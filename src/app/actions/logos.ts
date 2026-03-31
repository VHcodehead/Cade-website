'use server'

// NOTE: Files uploaded at runtime on Railway will be lost on redeploy.
// Re-upload logos after deploy until Railway Volumes are configured.

import { writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/dal'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB

export type LogoState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function uploadLogo(
  prevState: LogoState,
  formData: FormData
): Promise<LogoState> {
  await verifySession()

  const file = formData.get('logo') as File | null

  if (!file || file.size === 0) {
    return { status: 'error', message: 'No file selected.' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { status: 'error', message: 'Invalid file type. Only PNG, JPG, WebP, and SVG are allowed.' }
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { status: 'error', message: 'File too large. Maximum size is 2 MB.' }
  }

  // Sanitize filename: lowercase, replace non-alphanumeric (except dot) with hyphens, append timestamp
  const ext = path.extname(file.name).toLowerCase()
  const basename = path.basename(file.name, ext)
  const sanitized = basename.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const timestamp = Date.now()
  const filename = `${sanitized}-${timestamp}${ext}`

  const assetsDir = path.join(process.cwd(), 'public', 'assets')
  const filePath = path.join(assetsDir, filename)

  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))

  revalidatePath('/admin/logos')
  revalidatePath('/', 'layout')

  return { status: 'success', message: `Logo "${filename}" uploaded successfully.` }
}

export async function deleteLogo(filename: string): Promise<void> {
  await verifySession()

  // Reject any path traversal attempts
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    throw new Error('Invalid filename.')
  }

  const filePath = path.join(process.cwd(), 'public', 'assets', filename)
  await unlink(filePath)

  revalidatePath('/admin/logos')
  revalidatePath('/', 'layout')
}
