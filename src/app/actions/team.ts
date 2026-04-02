'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/dal'

const TeamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  role: z.string().min(1, 'Role is required').max(200),
  bio: z.string().max(5000).default(''),
})

export type TeamActionState = {
  status: 'idle' | 'success' | 'error'
  errors?: Partial<Record<string, string[]>>
}

async function saveUploadedFile(file: File, dir: string, slug: string): Promise<string | null> {
  if (!file || file.size === 0) return null
  if (file.size > 25 * 1024 * 1024) return null

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${slug}.${ext}`

  const tmpDir = path.join('/tmp/uploads', dir)
  const buffer = Buffer.from(await file.arrayBuffer())

  await mkdir(tmpDir, { recursive: true })
  await writeFile(path.join(tmpDir, fileName), buffer)

  return `/api/uploads/${dir}/${fileName}`
}

export async function createTeamMember(
  prevState: TeamActionState,
  formData: FormData
): Promise<TeamActionState> {
  await verifySession()

  const parsed = TeamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio') || '',
  })

  if (!parsed.success) {
    return { status: 'error', errors: parsed.error.flatten().fieldErrors }
  }

  const { name, role, bio } = parsed.data

  // Handle photo upload
  const photoFile = formData.get('photo') as File | null
  let photoUrl = ''

  if (photoFile && photoFile.size > 0) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    photoUrl = (await saveUploadedFile(photoFile, 'team', slug)) ?? ''
  }

  // Get max sort order
  const maxSort = await db.teamMember.findFirst({ orderBy: { sortOrder: 'desc' } })
  const sortOrder = (maxSort?.sortOrder ?? 0) + 1

  try {
    await db.teamMember.create({
      data: { name, role, bio, photoUrl, sortOrder },
    })
  } catch {
    return { status: 'error', errors: { _form: ['Failed to create team member.'] } }
  }

  revalidatePath('/admin/team')
  revalidatePath('/', 'layout')

  return { status: 'success' }
}

export async function updateTeamMember(
  id: string,
  prevState: TeamActionState,
  formData: FormData
): Promise<TeamActionState> {
  await verifySession()

  const parsed = TeamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio') || '',
  })

  if (!parsed.success) {
    return { status: 'error', errors: parsed.error.flatten().fieldErrors }
  }

  const { name, role, bio } = parsed.data

  const existing = await db.teamMember.findUnique({ where: { id } })
  if (!existing) {
    return { status: 'error', errors: { _form: ['Team member not found.'] } }
  }

  const photoFile = formData.get('photo') as File | null
  let photoUrl = existing.photoUrl

  if (photoFile && photoFile.size > 0) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    photoUrl = (await saveUploadedFile(photoFile, 'team', slug)) ?? photoUrl
  }

  try {
    await db.teamMember.update({
      where: { id },
      data: { name, role, bio, photoUrl },
    })
  } catch {
    return { status: 'error', errors: { _form: ['Failed to update team member.'] } }
  }

  revalidatePath('/admin/team')
  revalidatePath('/', 'layout')

  return { status: 'success' }
}

export async function deleteTeamMember(id: string): Promise<void> {
  await verifySession()
  await db.teamMember.delete({ where: { id } })
  revalidatePath('/admin/team')
  revalidatePath('/', 'layout')
}

export async function reorderTeamMembers(
  items: Array<{ id: string; sortOrder: number }>
): Promise<void> {
  await verifySession()
  await db.$transaction(
    items.map(({ id, sortOrder }) =>
      db.teamMember.update({ where: { id }, data: { sortOrder } })
    )
  )
  revalidatePath('/admin/team')
  revalidatePath('/', 'layout')
}
