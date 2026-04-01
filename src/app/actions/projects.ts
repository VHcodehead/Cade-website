'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/dal'
import { getVimeoThumbnail } from '@/lib/vimeo'

const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  client: z.string().min(1, 'Client is required').max(200),
  services: z.string().max(500).default(''),
  year: z.coerce.number().int().min(2000).max(2099),
  description: z.string().max(5000).default(''),
  vimeoId: z.string().min(1, 'Vimeo ID is required'),
  additionalVimeoIds: z.string().max(500).default(''),
  published: z.coerce.boolean().default(false),
})

export type ProjectActionState = {
  status: 'idle' | 'success' | 'error'
  errors?: Partial<Record<string, string[]>>
}

function extractVimeoId(input: string): string {
  const match = input.match(/vimeo\.com\/(\d+)/)
  if (match) return match[1]
  return input.trim()
}

function extractMultipleVimeoIds(input: string): string {
  if (!input.trim()) return ''
  return input
    .split(',')
    .map((s) => extractVimeoId(s.trim()))
    .filter(Boolean)
    .join(',')
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function saveUploadedFile(file: File, dir: string, slug: string): Promise<string | null> {
  if (!file || file.size === 0) return null
  if (file.size > 20 * 1024 * 1024) return null // 20MB max

  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4'
  const fileName = `${slug}.${ext}`
  const dirPath = path.join(process.cwd(), 'public', dir)
  const filePath = path.join(dirPath, fileName)

  await mkdir(dirPath, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filePath, buffer)

  return `/${dir}/${fileName}`
}

export async function createProject(
  prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  await verifySession()

  const rawVimeoId = formData.get('vimeoId') as string
  const vimeoIdInput = extractVimeoId(rawVimeoId ?? '')
  const rawAdditional = formData.get('additionalVimeoIds') as string
  const additionalVimeoIds = extractMultipleVimeoIds(rawAdditional ?? '')

  const parsed = ProjectSchema.safeParse({
    title: formData.get('title'),
    client: formData.get('client'),
    services: formData.get('services') || '',
    year: formData.get('year'),
    description: formData.get('description') || '',
    vimeoId: vimeoIdInput,
    additionalVimeoIds,
    published: formData.get('published'),
  })

  if (!parsed.success) {
    return { status: 'error', errors: parsed.error.flatten().fieldErrors }
  }

  const { title, client, services, year, description, vimeoId, published } = parsed.data
  const slug = generateSlug(title)

  // Handle file uploads
  const previewClipFile = formData.get('previewClip') as File | null
  const thumbnailFile = formData.get('thumbnail') as File | null

  let previewClipUrl = ''
  let thumbnailUrl = ''

  if (previewClipFile && previewClipFile.size > 0) {
    previewClipUrl = (await saveUploadedFile(previewClipFile, 'videos', slug)) ?? ''
  }

  if (thumbnailFile && thumbnailFile.size > 0) {
    thumbnailUrl = (await saveUploadedFile(thumbnailFile, 'thumbnails', slug)) ?? ''
  }

  if (!thumbnailUrl) {
    const fetched = await getVimeoThumbnail(vimeoId)
    thumbnailUrl = fetched ?? ''
  }

  try {
    await db.project.create({
      data: {
        slug,
        title,
        client,
        services,
        year,
        description,
        vimeoId,
        additionalVimeoIds,
        thumbnailUrl,
        previewClipUrl,
        published,
      },
    })
  } catch {
    return { status: 'error', errors: { _form: ['Failed to create project. Slug may already exist.'] } }
  }

  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
  redirect('/admin/projects')
}

export async function updateProject(
  id: string,
  prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  await verifySession()

  const rawVimeoId = formData.get('vimeoId') as string
  const vimeoIdInput = extractVimeoId(rawVimeoId ?? '')
  const rawAdditional = formData.get('additionalVimeoIds') as string
  const additionalVimeoIds = extractMultipleVimeoIds(rawAdditional ?? '')

  const parsed = ProjectSchema.safeParse({
    title: formData.get('title'),
    client: formData.get('client'),
    services: formData.get('services') || '',
    year: formData.get('year'),
    description: formData.get('description') || '',
    vimeoId: vimeoIdInput,
    additionalVimeoIds,
    published: formData.get('published'),
  })

  if (!parsed.success) {
    return { status: 'error', errors: parsed.error.flatten().fieldErrors }
  }

  const { title, client, services, year, description, vimeoId, published } = parsed.data

  // Get existing project for slug and current media URLs
  const existing = await db.project.findUnique({ where: { id } })
  if (!existing) {
    return { status: 'error', errors: { _form: ['Project not found.'] } }
  }

  // Handle file uploads — keep existing if no new file uploaded
  const previewClipFile = formData.get('previewClip') as File | null
  const thumbnailFile = formData.get('thumbnail') as File | null

  let previewClipUrl = (formData.get('existingPreviewClipUrl') as string) || existing.previewClipUrl || ''
  let thumbnailUrl = (formData.get('existingThumbnailUrl') as string) || existing.thumbnailUrl || ''

  if (previewClipFile && previewClipFile.size > 0) {
    previewClipUrl = (await saveUploadedFile(previewClipFile, 'videos', existing.slug)) ?? previewClipUrl
  }

  if (thumbnailFile && thumbnailFile.size > 0) {
    thumbnailUrl = (await saveUploadedFile(thumbnailFile, 'thumbnails', existing.slug)) ?? thumbnailUrl
  }

  if (!thumbnailUrl) {
    const fetched = await getVimeoThumbnail(vimeoId)
    thumbnailUrl = fetched ?? ''
  }

  try {
    await db.project.update({
      where: { id },
      data: {
        title,
        client,
        services,
        year,
        description,
        vimeoId,
        additionalVimeoIds,
        thumbnailUrl,
        previewClipUrl,
        published,
      },
    })
  } catch {
    return { status: 'error', errors: { _form: ['Failed to update project.'] } }
  }

  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
  redirect('/admin/projects')
}

export async function togglePublished(id: string, published: boolean): Promise<void> {
  await verifySession()
  await db.project.update({ where: { id }, data: { published } })
  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
}

export async function deleteProject(id: string): Promise<void> {
  await verifySession()
  await db.project.delete({ where: { id } })
  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
}

export async function reorderProjects(
  items: Array<{ id: string; sortOrder: number }>
): Promise<void> {
  await verifySession()
  await db.$transaction(
    items.map(({ id, sortOrder }) =>
      db.project.update({ where: { id }, data: { sortOrder } })
    )
  )
  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
}
