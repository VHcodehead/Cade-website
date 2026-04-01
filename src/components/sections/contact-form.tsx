'use client'

import { useActionState } from 'react'
import { submitContact, type ContactState } from '@/app/actions/contact'

const initialState: ContactState = { status: 'idle' }

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState)

  if (state.status === 'success') {
    return (
      <section id="contact" className="py-32 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Message Sent</p>
          <p className="text-2xl font-heading text-text-primary">
            Thanks. We&apos;ll be in touch soon.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-32 px-6 border-t border-white/5">
      <div className="max-w-xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/50 text-center mb-4">
          Contact
        </p>
        <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-[0.15em] text-center mb-16 text-text-primary">
          Let&apos;s Work Together
        </h2>

        <form action={formAction} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.25em] text-text-muted/60 mb-3">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="bg-transparent border-b border-white/15 text-text-primary pb-3 w-full focus:border-accent focus:outline-none transition-colors text-sm placeholder:text-text-muted/30"
                placeholder="Your name"
              />
              {state.errors?.name?.map((error) => (
                <p key={error} className="mt-2 text-red-400 text-xs">{error}</p>
              ))}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.25em] text-text-muted/60 mb-3">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="bg-transparent border-b border-white/15 text-text-primary pb-3 w-full focus:border-accent focus:outline-none transition-colors text-sm placeholder:text-text-muted/30"
                placeholder="you@company.com"
              />
              {state.errors?.email?.map((error) => (
                <p key={error} className="mt-2 text-red-400 text-xs">{error}</p>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-[10px] uppercase tracking-[0.25em] text-text-muted/60 mb-3">
              Company <span className="text-text-muted/30">(optional)</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="bg-transparent border-b border-white/15 text-text-primary pb-3 w-full focus:border-accent focus:outline-none transition-colors text-sm placeholder:text-text-muted/30"
              placeholder="Your company"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-[10px] uppercase tracking-[0.25em] text-text-muted/60 mb-3">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="bg-transparent border-b border-white/15 text-text-primary pb-3 w-full focus:border-accent focus:outline-none transition-colors text-sm resize-none placeholder:text-text-muted/30"
              placeholder="Tell us about your project"
            />
            {state.errors?.message?.map((error) => (
              <p key={error} className="mt-2 text-red-400 text-xs">{error}</p>
            ))}
          </div>

          {state.errors?._form?.map((error) => (
            <p key={error} className="text-red-400 text-xs">{error}</p>
          ))}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="px-12 py-4 text-xs font-medium uppercase tracking-[0.25em] text-white border border-white/20 hover:border-accent hover:text-accent transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isPending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
