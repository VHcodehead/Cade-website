'use server'

import { z } from 'zod'
import bcryptjs from 'bcryptjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { createSession, deleteSession } from '@/lib/session'

const LoginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
})

export type LoginState = { error?: string } | undefined

export async function login(state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Invalid credentials.' }
  }

  const { email, password } = parsed.data

  const user = await db.adminUser.findUnique({ where: { email } })

  // Constant-time comparison: always run bcryptjs.compare even if user is null
  // to prevent timing attacks that reveal whether an email exists in the database
  const hashToCompare = user?.hashedPassword ?? '$2b$12$invalidhashplaceholderXXXXXXXXXXXXXXXXXXXXXXXXX'
  const passwordMatch = await bcryptjs.compare(password, hashToCompare)

  if (!user || !passwordMatch) {
    return { error: 'Invalid credentials.' }
  }

  await createSession(user.id)
  redirect('/admin')
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/admin/login')
}
