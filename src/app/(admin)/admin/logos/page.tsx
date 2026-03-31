import { readdirSync } from 'node:fs'
import path from 'node:path'
import { verifySession } from '@/lib/dal'
import { LogoGrid } from '@/components/admin/logo-grid'

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg'])

function getLogoFiles(): string[] {
  const assetsDir = path.join(process.cwd(), 'public', 'assets')
  try {
    return readdirSync(assetsDir).filter((file) => {
      if (file.startsWith('LOGO_')) return false
      const ext = path.extname(file).toLowerCase()
      return IMAGE_EXTS.has(ext)
    })
  } catch {
    return []
  }
}

export default async function LogosPage() {
  await verifySession()

  const logos = getLogoFiles()

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Brand Logos</h1>
      <LogoGrid logos={logos} />
    </div>
  )
}
