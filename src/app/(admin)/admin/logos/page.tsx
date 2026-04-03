import { readdirSync } from 'node:fs'
import path from 'node:path'
import { verifySession } from '@/lib/dal'
import { LogoGrid } from '@/components/admin/logo-grid'

export const dynamic = 'force-dynamic'

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg'])
const UPLOAD_DIR = '/tmp/uploads/logos'

function getUploadedLogos(): string[] {
  try {
    return readdirSync(UPLOAD_DIR).filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return IMAGE_EXTS.has(ext)
    })
  } catch {
    return []
  }
}

export default async function LogosPage() {
  await verifySession()

  const logos = getUploadedLogos()

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-4">Brand Logos</h1>
      <p className="text-text-muted text-sm mb-8">
        Upload logos here and they&apos;ll appear in the scrolling brand strip on the homepage. Pre-loaded client logos (Nike, Disney, etc.) are managed separately.
      </p>
      <LogoGrid logos={logos} />
    </div>
  )
}
