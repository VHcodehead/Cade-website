import { notFound } from 'next/navigation'
import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'
import { updateProject } from '@/app/actions/projects'
import { ProjectForm } from '@/components/admin/project-form'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  await verifySession()

  const { id } = await params

  const project = await db.project.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      client: true,
      services: true,
      year: true,
      description: true,
      vimeoId: true,
      thumbnailUrl: true,
      previewClipUrl: true,
      additionalVimeoIds: true,
      published: true,
    },
  })

  if (!project) {
    notFound()
  }

  const updateWithId = updateProject.bind(null, project.id)

  return (
    <div className="p-8">
      <ProjectForm project={project} action={updateWithId} />
    </div>
  )
}
