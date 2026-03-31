import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'
import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
  await verifySession()

  const config = await db.siteConfig.findUnique({ where: { id: 'singleton' } })

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Site Settings</h1>
      <SettingsForm config={config} />
    </div>
  )
}
