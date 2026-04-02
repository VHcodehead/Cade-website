import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'
import { TeamPageClient } from './team-client'

export default async function AdminTeamPage() {
  await verifySession()

  const members = await db.teamMember.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-8">Team Members</h1>
      <TeamPageClient members={members} />
    </div>
  )
}
