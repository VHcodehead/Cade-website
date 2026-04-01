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
    previewClipUrl: string
    additionalVimeoIds: string
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
  const [previewFileName, setPreviewFileName] = useState('')
  const [thumbFileName, setThumbFileName] = useState('')

  const currentYear = new Date().getFullYear()
  const isEditing = !!project

  function handleVimeoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const extracted = extractVimeoId(e.target.value)
    setVimeoId(extracted)
  }

  const inputClass = 'w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent'

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
            <p key={err} className="text-red-400 text-sm">{err}</p>
          ))}
        </div>
      )}

      {state.status === 'success' && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded">
          <p className="text-green-400 text-sm">Project saved successfully.</p>
        </div>
      )}

      <form action={formAction} className="space-y-6" encType="multipart/form-data">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-text-muted text-sm mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input id="title" name="title" type="text" required defaultValue={project?.title ?? ''} className={inputClass} />
          {state.errors?.title && <p className="text-red-400 text-sm mt-1">{state.errors.title[0]}</p>}
        </div>

        {/* Client */}
        <div>
          <label htmlFor="client" className="block text-text-muted text-sm mb-1.5">
            Client <span className="text-red-400">*</span>
          </label>
          <input id="client" name="client" type="text" required defaultValue={project?.client ?? ''} className={inputClass} />
          {state.errors?.client && <p className="text-red-400 text-sm mt-1">{state.errors.client[0]}</p>}
        </div>

        {/* Services */}
        <div>
          <label htmlFor="services" className="block text-text-muted text-sm mb-1.5">
            Services <span className="text-text-muted">(comma-separated)</span>
          </label>
          <input id="services" name="services" type="text" defaultValue={project?.services ?? ''} placeholder="e.g. Direction, Cinematography, Color" className={inputClass} />
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-text-muted text-sm mb-1.5">
            Year <span className="text-red-400">*</span>
          </label>
          <input id="year" name="year" type="number" required defaultValue={project?.year ?? currentYear} min={2000} max={2099} className={inputClass} />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-text-muted text-sm mb-1.5">
            Description
          </label>
          <textarea id="description" name="description" rows={4} defaultValue={project?.description ?? ''} className={`${inputClass} resize-vertical`} />
        </div>

        {/* Divider — Media Section */}
        <div className="pt-4 pb-2 border-t border-white/10">
          <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider">Media</h2>
        </div>

        {/* Vimeo ID */}
        <div>
          <label htmlFor="vimeoId" className="block text-text-muted text-sm mb-1.5">
            Vimeo URL or ID <span className="text-red-400">*</span>
          </label>
          <p className="text-text-muted/40 text-xs mb-2">Full video shown on the project detail page</p>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                id="vimeoId" name="vimeoId" type="text" required
                defaultValue={project?.vimeoId ?? ''} onChange={handleVimeoChange}
                placeholder="e.g. 123456789 or https://vimeo.com/123456789"
                className={inputClass}
              />
              {state.errors?.vimeoId && <p className="text-red-400 text-sm mt-1">{state.errors.vimeoId[0]}</p>}
            </div>
            {vimeoId && /^\d+$/.test(vimeoId) && (
              <div className="flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://vumbnail.com/${vimeoId}.jpg`} alt="Preview" width={120} height={68} className="rounded border border-white/10 object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Additional Vimeo IDs */}
        <div>
          <label htmlFor="additionalVimeoIds" className="block text-text-muted text-sm mb-1.5">
            Additional Vimeo URLs <span className="text-text-muted/40">(optional)</span>
          </label>
          <p className="text-text-muted/40 text-xs mb-2">For projects with multiple videos. Comma-separated IDs or URLs.</p>
          <input
            id="additionalVimeoIds" name="additionalVimeoIds" type="text"
            defaultValue={project?.additionalVimeoIds ?? ''}
            placeholder="e.g. 123456789, 987654321"
            className={inputClass}
          />
        </div>

        {/* Preview Clip Upload */}
        <div>
          <label htmlFor="previewClip" className="block text-text-muted text-sm mb-1.5">
            Preview Clip <span className="text-text-muted/40">(optional)</span>
          </label>
          <p className="text-text-muted/40 text-xs mb-2">Short compressed MP4 (5-15 sec) for hover-to-play on homepage. Max 20MB.</p>
          {project?.previewClipUrl && (
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-green-400">Current:</span>
              <span className="text-xs text-text-muted">{project.previewClipUrl}</span>
              <input type="hidden" name="existingPreviewClipUrl" value={project.previewClipUrl} />
            </div>
          )}
          <label className="block cursor-pointer">
            <div className="flex items-center gap-3 px-4 py-3 bg-bg-section border border-white/10 border-dashed rounded hover:border-accent/30 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted/40">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span className="text-sm text-text-muted/50">{previewFileName || 'Choose MP4 file...'}</span>
            </div>
            <input
              id="previewClip" name="previewClip" type="file" accept="video/mp4,video/webm"
              className="hidden"
              onChange={(e) => setPreviewFileName(e.target.files?.[0]?.name ?? '')}
            />
          </label>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label htmlFor="thumbnail" className="block text-text-muted text-sm mb-1.5">
            Thumbnail <span className="text-text-muted/40">(optional)</span>
          </label>
          <p className="text-text-muted/40 text-xs mb-2">Poster image for the project card. JPG or PNG. Auto-fetched from Vimeo if not provided.</p>
          {project?.thumbnailUrl && project.thumbnailUrl.startsWith('/thumbnails/') && (
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-green-400">Current:</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.thumbnailUrl} alt="Current thumbnail" width={80} height={45} className="rounded border border-white/10 object-cover" />
              <input type="hidden" name="existingThumbnailUrl" value={project.thumbnailUrl} />
            </div>
          )}
          <label className="block cursor-pointer">
            <div className="flex items-center gap-3 px-4 py-3 bg-bg-section border border-white/10 border-dashed rounded hover:border-accent/30 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted/40">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-sm text-text-muted/50">{thumbFileName || 'Choose image...'}</span>
            </div>
            <input
              id="thumbnail" name="thumbnail" type="file" accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => setThumbFileName(e.target.files?.[0]?.name ?? '')}
            />
          </label>
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3 pt-2">
          <input id="published" name="published" type="checkbox" defaultChecked={project?.published ?? false} className="w-4 h-4 accent-accent" />
          <label htmlFor="published" className="text-text-muted text-sm cursor-pointer">Published</label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit" disabled={pending}
            className={`px-6 py-2.5 bg-accent text-white rounded font-medium transition-all ${pending ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {pending ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
