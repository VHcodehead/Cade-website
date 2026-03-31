'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import type { ProjectActionState } from '@/app/actions/projects'

type ProjectFormProps = {
  project?: {
    id: string
    title: string
    client: string
    services: string
    year: number
    description: string
    vimeoId: string
    thumbnailUrl: string
    published: boolean
  }
  action: (prevState: ProjectActionState, formData: FormData) => Promise<ProjectActionState>
}

function extractVimeoId(input: string): string {
  const match = input.match(/vimeo\.com\/(\d+)/)
  if (match) return match[1]
  return input.trim()
}

export function ProjectForm({ project, action }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(action, { status: 'idle' })
  const [vimeoId, setVimeoId] = useState(project?.vimeoId ?? '')

  const currentYear = new Date().getFullYear()
  const isEditing = !!project

  function handleVimeoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const extracted = extractVimeoId(e.target.value)
    setVimeoId(extracted)
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/projects"
        className="text-text-muted text-sm hover:text-text-primary transition-colors mb-6 inline-block"
      >
        &larr; Back to Projects
      </Link>

      <h1 className="text-2xl font-bold text-text-primary mb-8">
        {isEditing ? 'Edit Project' : 'New Project'}
      </h1>

      {state.errors?._form && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded">
          {state.errors._form.map((err) => (
            <p key={err} className="text-red-400 text-sm">
              {err}
            </p>
          ))}
        </div>
      )}

      {state.status === 'success' && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded">
          <p className="text-green-400 text-sm">Project saved successfully.</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-text-muted text-sm mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={project?.title ?? ''}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
          />
          {state.errors?.title && (
            <p className="text-red-400 text-sm mt-1">{state.errors.title[0]}</p>
          )}
        </div>

        {/* Client */}
        <div>
          <label htmlFor="client" className="block text-text-muted text-sm mb-1.5">
            Client <span className="text-red-400">*</span>
          </label>
          <input
            id="client"
            name="client"
            type="text"
            required
            defaultValue={project?.client ?? ''}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
          />
          {state.errors?.client && (
            <p className="text-red-400 text-sm mt-1">{state.errors.client[0]}</p>
          )}
        </div>

        {/* Services */}
        <div>
          <label htmlFor="services" className="block text-text-muted text-sm mb-1.5">
            Services <span className="text-text-muted">(comma-separated)</span>
          </label>
          <input
            id="services"
            name="services"
            type="text"
            defaultValue={project?.services ?? ''}
            placeholder="e.g. Direction, Cinematography, Color"
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
          />
          {state.errors?.services && (
            <p className="text-red-400 text-sm mt-1">{state.errors.services[0]}</p>
          )}
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-text-muted text-sm mb-1.5">
            Year <span className="text-red-400">*</span>
          </label>
          <input
            id="year"
            name="year"
            type="number"
            required
            defaultValue={project?.year ?? currentYear}
            min={2000}
            max={2099}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
          />
          {state.errors?.year && (
            <p className="text-red-400 text-sm mt-1">{state.errors.year[0]}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-text-muted text-sm mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={project?.description ?? ''}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent resize-vertical"
          />
          {state.errors?.description && (
            <p className="text-red-400 text-sm mt-1">{state.errors.description[0]}</p>
          )}
        </div>

        {/* Vimeo ID with thumbnail preview */}
        <div>
          <label htmlFor="vimeoId" className="block text-text-muted text-sm mb-1.5">
            Vimeo ID or URL <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                id="vimeoId"
                name="vimeoId"
                type="text"
                required
                defaultValue={project?.vimeoId ?? ''}
                onChange={handleVimeoChange}
                placeholder="e.g. 123456789 or https://vimeo.com/123456789"
                className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
              />
              {state.errors?.vimeoId && (
                <p className="text-red-400 text-sm mt-1">{state.errors.vimeoId[0]}</p>
              )}
            </div>
            {vimeoId && /^\d+$/.test(vimeoId) && (
              <div className="flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://vumbnail.com/${vimeoId}.jpg`}
                  alt="Vimeo thumbnail preview"
                  width={120}
                  height={68}
                  className="rounded border border-white/10 object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={project?.published ?? false}
            className="w-4 h-4 accent-accent"
          />
          <label htmlFor="published" className="text-text-muted text-sm cursor-pointer">
            Published
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={pending}
            className={`px-6 py-2.5 bg-accent text-white rounded font-medium transition-all ${
              pending ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {pending ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
