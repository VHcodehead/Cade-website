'use server'

import { writeFile, unlink, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/dal'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const UPLOAD_DIR = '/tmp/uploads/logos'

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
    return { status: 'error', message: 'File too large. Maximum size is 5 MB.' }
  }

  const ext = path.extname(file.name).toLowerCase()
  const basename = path.basename(file.name, ext)
  const sanitized = basename.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const timestamp = Date.now()
  const filename = `${sanitized}-${timestamp}${ext}`

  await mkdir(UPLOAD_DIR, { recursive: true })
  const filePath = path.join(UPLOAD_DIR, filename)

  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))

  revalidatePath('/admin/logos')
  revalidatePath('/', 'layout')

  return { status: 'success', message: `Logo "${file.name}" uploaded successfully.` }
}

export async function deleteLogo(filename: string): Promise<void> {
  await verifySession()

  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    throw new Error('Invalid filename.')
  }

  // Try /tmp/uploads/logos/ first, then /public/assets/
  const tmpPath = path.join(UPLOAD_DIR, filename)
  const publicPath = path.join(process.cwd(), 'public', 'assets', filename)

  try {
    await unlink(tmpPath)
  } catch {
    try {
      await unlink(publicPath)
    } catch {
      // File might already be gone
    }
  }

  revalidatePath('/admin/logos')
  revalidatePath('/', 'layout')
}
