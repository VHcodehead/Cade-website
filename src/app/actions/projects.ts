'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
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
  thumbnailUrl: z.string().optional(),
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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function createProject(
  prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  await verifySession()

  const rawVimeoId = formData.get('vimeoId') as string
  const vimeoIdInput = extractVimeoId(rawVimeoId ?? '')

  const parsed = ProjectSchema.safeParse({
    title: formData.get('title'),
    client: formData.get('client'),
    services: formData.get('services') || '',
    year: formData.get('year'),
    description: formData.get('description') || '',
    vimeoId: vimeoIdInput,
    thumbnailUrl: formData.get('thumbnailUrl') || undefined,
    published: formData.get('published'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const { title, client, services, year, description, vimeoId, thumbnailUrl, published } =
    parsed.data

  const slug = generateSlug(title)

  let resolvedThumbnail = thumbnailUrl ?? ''
  if (!resolvedThumbnail) {
    const fetched = await getVimeoThumbnail(vimeoId)
    resolvedThumbnail = fetched ?? ''
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
        thumbnailUrl: resolvedThumbnail,
        published,
      },
    })
  } catch {
    return {
      status: 'error',
      errors: { _form: ['Failed to create project. Please try again.'] },
    }
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

  const parsed = ProjectSchema.safeParse({
    title: formData.get('title'),
    client: formData.get('client'),
    services: formData.get('services') || '',
    year: formData.get('year'),
    description: formData.get('description') || '',
    vimeoId: vimeoIdInput,
    thumbnailUrl: formData.get('thumbnailUrl') || undefined,
    published: formData.get('published'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const { title, client, services, year, description, vimeoId, thumbnailUrl, published } =
    parsed.data

  let resolvedThumbnail = thumbnailUrl ?? ''
  if (!resolvedThumbnail) {
    const fetched = await getVimeoThumbnail(vimeoId)
    resolvedThumbnail = fetched ?? ''
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
        thumbnailUrl: resolvedThumbnail,
        published,
      },
    })
  } catch {
    return {
      status: 'error',
      errors: { _form: ['Failed to update project. Please try again.'] },
    }
  }

  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
  redirect('/admin/projects')
}

export async function togglePublished(id: string, published: boolean): Promise<void> {
  await verifySession()

  await db.project.update({
    where: { id },
    data: { published },
  })

  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
}

export async function deleteProject(id: string): Promise<void> {
  await verifySession()

  await db.project.delete({
    where: { id },
  })

  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
}
