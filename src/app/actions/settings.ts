'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/dal'

const SettingsSchema = z.object({
  heroVimeoId: z.string().max(100),
  aboutText: z.string().max(5000),
  contactEmail: z.string().email('Invalid email address'),
  location: z.string().max(200),
  instagramUrl: z.string().max(500),
  vimeoProfileUrl: z.string().max(500),
  ctaHeading: z.string().max(500),
  ctaButtonText: z.string().max(200),
  aboutHeading: z.string().max(200),
})

export type SettingsState = {
  status: 'idle' | 'success' | 'error'
  errors?: Record<string, string[]>
}

export async function updateSettings(
  prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  await verifySession()

  const parsed = SettingsSchema.safeParse({
    heroVimeoId: formData.get('heroVimeoId'),
    aboutText: formData.get('aboutText'),
    contactEmail: formData.get('contactEmail'),
    location: formData.get('location'),
    instagramUrl: formData.get('instagramUrl'),
    vimeoProfileUrl: formData.get('vimeoProfileUrl'),
    ctaHeading: formData.get('ctaHeading'),
    ctaButtonText: formData.get('ctaButtonText'),
    aboutHeading: formData.get('aboutHeading'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const data = parsed.data

  try {
    await db.siteConfig.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...data },
      update: { ...data },
    })

    revalidatePath('/', 'layout')

    return { status: 'success' }
  } catch {
    return {
      status: 'error',
      errors: { _form: ['Something went wrong. Please try again.'] },
    }
  }
}
