'use server'

import { z } from 'zod'
import { db } from '@/lib/db'

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
})

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  errors?: {
    name?: string[]
    email?: string[]
    company?: string[]
    message?: string[]
    _form?: string[]
  }
}

export async function submitContact(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company') || undefined,
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, email, company, message } = parsed.data

  try {
    await db.contactSubmission.create({
      data: {
        name,
        email,
        company: company ?? '',
        message,
      },
    })

    return { status: 'success' }
  } catch {
    return {
      status: 'error',
      errors: { _form: ['Something went wrong. Please try again.'] },
    }
  }
}
