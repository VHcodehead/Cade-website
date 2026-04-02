'use client'

import { useActionState, useTransition } from 'react'
import { createTeamMember, deleteTeamMember, type TeamActionState } from '@/app/actions/team'

type TeamMember = {
  id: string
  name: string
  role: string
  bio: string
  photoUrl: string
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

const initialState: TeamActionState = { status: 'idle' }

export function TeamPageClient({ members }: { members: TeamMember[] }) {
  const [state, formAction, isPending] = useActionState(createTeamMember, initialState)
  const [isDeleting, startDeleteTransition] = useTransition()

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this team member?')) return
    startDeleteTransition(async () => {
      await deleteTeamMember(id)
    })
  }

  return (
    <div className="space-y-8">
      {/* Add form */}
      <div className="bg-bg-card border border-white/10 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Add Team Member</h2>

        {state.status === 'success' && (
          <p className="mb-4 text-green-400 text-sm font-medium">Team member added successfully.</p>
        )}
        {state.errors?._form && (
          <p className="mb-4 text-red-400 text-sm">{state.errors._form.join(', ')}</p>
        )}

        <form action={formAction} encType="multipart/form-data" className="space-y-4 max-w-xl">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
            />
            {state.errors?.name && (
              <p className="mt-1 text-red-400 text-xs">{state.errors.name.join(', ')}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-1">
              Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              required
              className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
            />
            {state.errors?.role && (
              <p className="mt-1 text-red-400 text-xs">{state.errors.role.join(', ')}</p>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-text-primary mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors resize-y"
            />
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-text-primary mb-1">
              Photo
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="w-full text-text-muted text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-white/10 file:text-sm file:font-medium file:bg-bg-section file:text-text-primary hover:file:bg-bg-card file:cursor-pointer file:transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-accent text-white text-sm font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Adding...' : 'Add Team Member'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-bg-card border border-white/10 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-text-primary">
            Current Team ({members.length})
          </h2>
        </div>

        {members.length === 0 ? (
          <p className="px-6 py-8 text-text-muted text-sm text-center">
            No team members yet. Add one above.
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {members.map((member) => (
              <li key={member.id} className="flex items-center gap-4 px-6 py-4">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-bg-section border border-white/10 flex items-center justify-center text-text-muted text-sm font-medium">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm font-medium truncate">{member.name}</p>
                  <p className="text-text-muted text-xs truncate">{member.role}</p>
                </div>

                <button
                  onClick={() => handleDelete(member.id)}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-xs text-red-400 border border-red-400/30 rounded hover:bg-red-400/10 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
