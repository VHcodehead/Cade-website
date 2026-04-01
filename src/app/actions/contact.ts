'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

    // Send email notification (fire-and-forget — don't block form submission)
    if (resend) {
      const notifyEmail = process.env.ADMIN_EMAIL || 'admin@vlacovision.com';
      resend.emails.send({
        from: 'VLACOVISION <onboarding@resend.dev>',
        to: notifyEmail,
        subject: `New inquiry from ${name}${company ? ` (${company})` : ''}`,
        text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\n\nMessage:\n${message}\n\n---\nView in admin: ${process.env.RAILWAY_PUBLIC_DOMAIN ? 'https://' + process.env.RAILWAY_PUBLIC_DOMAIN + '/admin/messages' : '/admin/messages'}`,
      }).catch(() => {
        // Silent fail — form submission already saved to DB
      });
    }

    return { status: 'success' }
  } catch {
    return {
      status: 'error',
      errors: { _form: ['Something went wrong. Please try again.'] },
    }
  }
}
