'use client'

import { useActionState } from 'react'
import { updateSettings, type SettingsState } from '@/app/actions/settings'

type SiteConfig = {
  id: string
  heroVimeoId: string
  aboutText: string
  contactEmail: string
  location: string
  instagramUrl: string
  vimeoProfileUrl: string
  ctaHeading: string
  ctaButtonText: string
  aboutHeading: string
} | null

const initialState: SettingsState = { status: 'idle' }

export function SettingsForm({ config }: { config: SiteConfig }) {
  const [state, formAction, isPending] = useActionState(updateSettings, initialState)

  return (
    <form action={formAction} className="bg-bg-card border border-white/10 rounded-lg p-6 max-w-2xl">
      {state.status === 'success' && (
        <p className="mb-6 text-green-400 text-sm font-medium">Settings saved successfully.</p>
      )}
      {state.errors?._form && (
        <p className="mb-6 text-red-400 text-sm">{state.errors._form.join(', ')}</p>
      )}

      <div className="space-y-6">
        {/* Hero Vimeo ID */}
        <div>
          <label htmlFor="heroVimeoId" className="block text-sm font-medium text-text-primary mb-1">
            Hero Vimeo ID
          </label>
          <p className="text-xs text-text-muted mb-2">Enter the Vimeo video ID for the homepage hero</p>
          <input
            id="heroVimeoId"
            name="heroVimeoId"
            type="text"
            defaultValue={config?.heroVimeoId ?? ''}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
          />
          {state.errors?.heroVimeoId && (
            <p className="mt-1 text-red-400 text-xs">{state.errors.heroVimeoId.join(', ')}</p>
          )}
        </div>

        {/* About Text */}
        <div>
          <label htmlFor="aboutText" className="block text-sm font-medium text-text-primary mb-1">
            About Text
          </label>
          <textarea
            id="aboutText"
            name="aboutText"
            rows={6}
            defaultValue={config?.aboutText ?? ''}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors resize-y"
          />
          {state.errors?.aboutText && (
            <p className="mt-1 text-red-400 text-xs">{state.errors.aboutText.join(', ')}</p>
          )}
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-text-primary mb-1">
            Contact Email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={config?.contactEmail ?? ''}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
          />
          {state.errors?.contactEmail && (
            <p className="mt-1 text-red-400 text-xs">{state.errors.contactEmail.join(', ')}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={config?.location ?? ''}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
          />
          {state.errors?.location && (
            <p className="mt-1 text-red-400 text-xs">{state.errors.location.join(', ')}</p>
          )}
        </div>

        {/* Instagram URL */}
        <div>
          <label htmlFor="instagramUrl" className="block text-sm font-medium text-text-primary mb-1">
            Instagram URL
          </label>
          <input
            id="instagramUrl"
            name="instagramUrl"
            type="text"
            defaultValue={config?.instagramUrl ?? ''}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
          />
          {state.errors?.instagramUrl && (
            <p className="mt-1 text-red-400 text-xs">{state.errors.instagramUrl.join(', ')}</p>
          )}
        </div>

        {/* Vimeo Profile URL */}
        <div>
          <label htmlFor="vimeoProfileUrl" className="block text-sm font-medium text-text-primary mb-1">
            Vimeo Profile URL
          </label>
          <input
            id="vimeoProfileUrl"
            name="vimeoProfileUrl"
            type="text"
            defaultValue={config?.vimeoProfileUrl ?? ''}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
          />
          {state.errors?.vimeoProfileUrl && (
            <p className="mt-1 text-red-400 text-xs">{state.errors.vimeoProfileUrl.join(', ')}</p>
          )}
        </div>

        {/* Divider for About / CTA section */}
        <div className="pt-4 border-t border-white/10">
          <h2 className="text-lg font-semibold text-text-primary mb-4">About &amp; CTA</h2>
        </div>

        {/* About Heading */}
        <div>
          <label htmlFor="aboutHeading" className="block text-sm font-medium text-text-primary mb-1">
            About Heading
          </label>
          <input
            id="aboutHeading"
            name="aboutHeading"
            type="text"
            defaultValue={config?.aboutHeading ?? 'Vlacovision'}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
          />
          {state.errors?.aboutHeading && (
            <p className="mt-1 text-red-400 text-xs">{state.errors.aboutHeading.join(', ')}</p>
          )}
        </div>

        {/* CTA Heading */}
        <div>
          <label htmlFor="ctaHeading" className="block text-sm font-medium text-text-primary mb-1">
            CTA Heading
          </label>
          <input
            id="ctaHeading"
            name="ctaHeading"
            type="text"
            defaultValue={config?.ctaHeading ?? "Let's create something worth watching."}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
          />
          {state.errors?.ctaHeading && (
            <p className="mt-1 text-red-400 text-xs">{state.errors.ctaHeading.join(', ')}</p>
          )}
        </div>

        {/* CTA Button Text */}
        <div>
          <label htmlFor="ctaButtonText" className="block text-sm font-medium text-text-primary mb-1">
            CTA Button Text
          </label>
          <input
            id="ctaButtonText"
            name="ctaButtonText"
            type="text"
            defaultValue={config?.ctaButtonText ?? 'Start a Project'}
            className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
          />
          {state.errors?.ctaButtonText && (
            <p className="mt-1 text-red-400 text-xs">{state.errors.ctaButtonText.join(', ')}</p>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-accent text-white text-sm font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
