'use client'

import { useActionState, useTransition } from 'react'
import { uploadLogo, deleteLogo, type LogoState } from '@/app/actions/logos'

const initialState: LogoState = { status: 'idle' }

export function LogoGrid({ logos }: { logos: string[] }) {
  const [uploadState, uploadAction, isUploading] = useActionState(uploadLogo, initialState)
  const [isPending, startTransition] = useTransition()

  function handleDelete(filename: string) {
    if (!window.confirm('Delete this logo?')) return
    startTransition(async () => {
      await deleteLogo.bind(null, filename)()
    })
  }

  return (
    <div>
      {/* Upload section */}
      <div className="bg-bg-card border border-white/10 rounded-lg p-6 mb-8 max-w-lg">
        <h2 className="text-text-primary font-semibold mb-4">Upload Logo</h2>

        {uploadState.status === 'success' && (
          <p className="mb-4 text-green-400 text-sm">{uploadState.message}</p>
        )}
        {uploadState.status === 'error' && (
          <p className="mb-4 text-red-400 text-sm">{uploadState.message}</p>
        )}

        <form action={uploadAction} encType="multipart/form-data" className="flex flex-col gap-4">
          <div>
            <input
              id="logo"
              name="logo"
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.svg"
              required
              className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-bg-section file:text-text-primary hover:file:opacity-90 cursor-pointer"
            />
            <p className="mt-1 text-xs text-text-muted">PNG, JPG, WebP, or SVG — max 2 MB</p>
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className="self-start px-5 py-2 bg-accent text-white text-sm font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading…' : 'Upload Logo'}
          </button>
        </form>
      </div>

      {/* Logo grid */}
      {logos.length === 0 ? (
        <p className="text-text-muted text-sm">No logos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {logos.map((filename) => (
            <div
              key={filename}
              className="bg-bg-card border border-white/10 rounded-lg p-4 flex flex-col items-center gap-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/assets/${filename}`}
                alt={filename}
                className="max-h-20 w-full object-contain"
              />
              <p className="text-text-muted text-xs text-center break-all leading-snug">{filename}</p>
              <button
                onClick={() => handleDelete(filename)}
                disabled={isPending}
                className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-300/50 rounded px-2 py-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
