'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/dal'

const TestimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required').max(5000),
  personName: z.string().min(1, 'Name is required').max(200),
  personTitle: z.string().max(200).default(''),
  company: z.string().max(200).default(''),
})

export type TestimonialActionState = {
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

export async function createTestimonial(
  prevState: TestimonialActionState,
  formData: FormData
): Promise<TestimonialActionState> {
  await verifySession()

  const parsed = TestimonialSchema.safeParse({
    quote: formData.get('quote'),
    personName: formData.get('personName'),
    personTitle: formData.get('personTitle') || '',
    company: formData.get('company') || '',
  })

  if (!parsed.success) {
    return { status: 'error', errors: parsed.error.flatten().fieldErrors }
  }

  const { quote, personName, personTitle, company } = parsed.data

  // Handle photo upload
  const photoFile = formData.get('photo') as File | null
  let photoUrl = ''

  if (photoFile && photoFile.size > 0) {
    const slug = personName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    photoUrl = (await saveUploadedFile(photoFile, 'testimonials', slug)) ?? ''
  }

  // Get max sort order
  const maxSort = await db.testimonial.findFirst({ orderBy: { sortOrder: 'desc' } })
  const sortOrder = (maxSort?.sortOrder ?? 0) + 1

  try {
    await db.testimonial.create({
      data: { quote, personName, personTitle, company, photoUrl, sortOrder },
    })
  } catch {
    return { status: 'error', errors: { _form: ['Failed to create testimonial.'] } }
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/', 'layout')

  return { status: 'success' }
}

export async function updateTestimonial(
  id: string,
  prevState: TestimonialActionState,
  formData: FormData
): Promise<TestimonialActionState> {
  await verifySession()

  const parsed = TestimonialSchema.safeParse({
    quote: formData.get('quote'),
    personName: formData.get('personName'),
    personTitle: formData.get('personTitle') || '',
    company: formData.get('company') || '',
  })

  if (!parsed.success) {
    return { status: 'error', errors: parsed.error.flatten().fieldErrors }
  }

  const { quote, personName, personTitle, company } = parsed.data

  const existing = await db.testimonial.findUnique({ where: { id } })
  if (!existing) {
    return { status: 'error', errors: { _form: ['Testimonial not found.'] } }
  }

  const photoFile = formData.get('photo') as File | null
  let photoUrl = existing.photoUrl

  if (photoFile && photoFile.size > 0) {
    const slug = personName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    photoUrl = (await saveUploadedFile(photoFile, 'testimonials', slug)) ?? photoUrl
  }

  try {
    await db.testimonial.update({
      where: { id },
      data: { quote, personName, personTitle, company, photoUrl },
    })
  } catch {
    return { status: 'error', errors: { _form: ['Failed to update testimonial.'] } }
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/', 'layout')

  return { status: 'success' }
}

export async function deleteTestimonial(id: string): Promise<void> {
  await verifySession()
  await db.testimonial.delete({ where: { id } })
  revalidatePath('/admin/testimonials')
  revalidatePath('/', 'layout')
}

export async function reorderTestimonials(
  items: Array<{ id: string; sortOrder: number }>
): Promise<void> {
  await verifySession()
  await db.$transaction(
    items.map(({ id, sortOrder }) =>
      db.testimonial.update({ where: { id }, data: { sortOrder } })
    )
  )
  revalidatePath('/admin/testimonials')
  revalidatePath('/', 'layout')
}
