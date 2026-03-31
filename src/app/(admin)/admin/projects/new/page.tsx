import { verifySession } from '@/lib/dal'
import { createProject } from '@/app/actions/projects'
import { ProjectForm } from '@/components/admin/project-form'

export default async function NewProjectPage() {
  await verifySession()

  return (
    <div className="p-8">
      <ProjectForm action={createProject} />
    </div>
  )
}
