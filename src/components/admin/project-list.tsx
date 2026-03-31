'use client'

import { useOptimistic, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { togglePublished, deleteProject } from '@/app/actions/projects'

type Project = {
  id: string
  slug: string
  title: string
  client: string
  published: boolean
  sortOrder: number
  vimeoId: string
  thumbnailUrl: string
  year: number
}

type OptimisticAction =
  | { type: 'toggle'; id: string; published: boolean }
  | { type: 'delete'; id: string }

function optimisticReducer(state: Project[], action: OptimisticAction): Project[] {
  if (action.type === 'toggle') {
    return state.map((p) =>
      p.id === action.id ? { ...p, published: action.published } : p
    )
  }
  if (action.type === 'delete') {
    return state.filter((p) => p.id !== action.id)
  }
  return state
}

export function ProjectList({ projects }: { projects: Project[] }) {
  const [optimisticProjects, dispatchOptimistic] = useOptimistic(
    projects,
    optimisticReducer
  )
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleToggle(id: string, currentPublished: boolean) {
    const newValue = !currentPublished
    startTransition(async () => {
      dispatchOptimistic({ type: 'toggle', id, published: newValue })
      await togglePublished(id, newValue)
    })
  }

  function handleDeleteConfirm(id: string) {
    startTransition(async () => {
      dispatchOptimistic({ type: 'delete', id })
      setConfirmDeleteId(null)
      await deleteProject(id)
    })
  }

  if (optimisticProjects.length === 0) {
    return (
      <div className="text-center py-20 text-text-muted">
        No projects yet.{' '}
        <a href="/admin/projects/new" className="text-accent hover:underline">
          Create your first project.
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Header row — hidden on mobile */}
      <div className="hidden md:grid grid-cols-[64px_1fr_160px_80px_120px_160px] gap-4 px-4 py-2 text-xs uppercase tracking-wider text-text-muted border-b border-white/10">
        <span>Thumb</span>
        <span>Title / Client</span>
        <span>Year</span>
        <span>Status</span>
        <span>Toggle</span>
        <span>Actions</span>
      </div>

      {optimisticProjects.map((project) => {
        const thumbnail =
          project.thumbnailUrl || `https://vumbnail.com/${project.vimeoId}.jpg`
        const isConfirmingDelete = confirmDeleteId === project.id

        return (
          <div
            key={project.id}
            className="bg-bg-card border border-white/10 rounded-lg px-4 py-3 flex flex-col md:grid md:grid-cols-[64px_1fr_160px_80px_120px_160px] md:items-center gap-3 md:gap-4"
          >
            {/* Thumbnail */}
            <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0 bg-bg-section">
              <Image
                src={thumbnail}
                alt={project.title}
                width={64}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>

            {/* Title + Client */}
            <div className="min-w-0">
              <p className="font-semibold text-text-primary truncate">{project.title}</p>
              <p className="text-sm text-text-muted truncate">{project.client}</p>
            </div>

            {/* Year */}
            <div className="text-sm text-text-muted">{project.year}</div>

            {/* Status badge */}
            <div>
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  project.published
                    ? 'bg-green-900/40 text-green-400'
                    : 'bg-yellow-900/40 text-yellow-400'
                }`}
              >
                {project.published ? 'Published' : 'Draft'}
              </span>
            </div>

            {/* Toggle button */}
            <div>
              <button
                onClick={() => handleToggle(project.id, project.published)}
                disabled={isPending}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                  project.published
                    ? 'bg-yellow-900/40 text-yellow-300 hover:bg-yellow-900/60'
                    : 'bg-green-900/40 text-green-300 hover:bg-green-900/60'
                }`}
              >
                {project.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>

            {/* Edit / Delete */}
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/projects/${project.id}`}
                className="px-3 py-1 rounded text-xs font-medium bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
              >
                Edit
              </Link>
              {isConfirmingDelete ? (
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-text-muted">
                    Delete &ldquo;{project.title}&rdquo;? This can&apos;t be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteConfirm(project.id)}
                      disabled={isPending}
                      className="px-2 py-1 text-xs bg-red-700 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 text-xs bg-bg-section hover:bg-white/10 text-text-muted rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(project.id)}
                  className="px-3 py-1 rounded text-xs font-medium bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
