'use client'

import { useActionState } from 'react'
import { submitContact, type ContactState } from '@/app/actions/contact'

const initialState: ContactState = { status: 'idle' }

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState)

  if (state.status === 'success') {
    return (
      <section id="contact" className="bg-bg-section py-spacing-16 px-spacing-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-2xl font-heading text-accent">Thanks! We&apos;ll be in touch.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="bg-bg-section py-spacing-16 px-spacing-4">
      <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-widest text-center mb-spacing-8 text-text-primary">
        Let&apos;s Work Together
      </h2>

      <form action={formAction} className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm uppercase tracking-widest text-text-muted mb-2"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="bg-bg-card border border-bg-section text-text-primary px-4 py-3 w-full focus:border-accent focus:outline-none transition-colors"
          />
          {state.errors?.name?.map((error) => (
            <p key={error} className="mt-1 text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm uppercase tracking-widest text-text-muted mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="bg-bg-card border border-bg-section text-text-primary px-4 py-3 w-full focus:border-accent focus:outline-none transition-colors"
          />
          {state.errors?.email?.map((error) => (
            <p key={error} className="mt-1 text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>

        {/* Company (optional) */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm uppercase tracking-widest text-text-muted mb-2"
          >
            Company (optional)
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="bg-bg-card border border-bg-section text-text-primary px-4 py-3 w-full focus:border-accent focus:outline-none transition-colors"
          />
          {state.errors?.company?.map((error) => (
            <p key={error} className="mt-1 text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm uppercase tracking-widest text-text-muted mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="bg-bg-card border border-bg-section text-text-primary px-4 py-3 w-full focus:border-accent focus:outline-none transition-colors resize-none"
          />
          {state.errors?.message?.map((error) => (
            <p key={error} className="mt-1 text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>

        {/* Form-level error */}
        {state.errors?._form?.map((error) => (
          <p key={error} className="text-red-500 text-sm">
            {error}
          </p>
        ))}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-accent text-white py-4 font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </section>
  )
}
