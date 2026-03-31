import Link from 'next/link'
import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'
import { ProjectList } from '@/components/admin/project-list'

export default async function AdminProjectsPage() {
  await verifySession()

  const projects = await db.project.findMany({
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      slug: true,
      title: true,
      client: true,
      published: true,
      sortOrder: true,
      vimeoId: true,
      thumbnailUrl: true,
      year: true,
    },
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-accent text-white text-sm font-medium rounded hover:opacity-90 transition-opacity"
        >
          New Project
        </Link>
      </div>

      <ProjectList projects={projects} />
    </div>
  )
}
