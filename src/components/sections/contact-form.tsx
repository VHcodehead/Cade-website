'use client'

import { useActionState } from 'react'
import { submitContact, type ContactState } from '@/app/actions/contact'

const initialState: ContactState = { status: 'idle' }

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState)

  if (state.status === 'success') {
    return (
      <section id="contact" className="py-48 sm:py-56 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-10 h-[1px] bg-accent/40 mx-auto mb-12" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent/70 mb-8">Message Sent</p>
          <h2
            className="text-[clamp(1.5rem,3vw,2.5rem)] uppercase tracking-[0.12em] text-text-primary leading-[1.1]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Thanks. We&apos;ll be in touch soon.
          </h2>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-48 sm:py-56 px-6 sm:px-10 lg:px-16">
      <div>
        {/* Header — centered */}
        <div className="text-center mb-20 sm:mb-28">
          <div className="w-10 h-[1px] bg-accent/30 mx-auto mb-12" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/20 mb-8">
            Contact
          </p>
          <h2
            className="text-[clamp(1.75rem,3.5vw,3rem)] uppercase tracking-[0.12em] text-text-primary leading-[1.1] mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Let&apos;s Work Together
          </h2>
          <p className="text-[14px] text-text-muted/25 max-w-md mx-auto leading-relaxed">
            Have a project in mind? Tell us about it and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        {/* Form — centered */}
        <div className="max-w-xl mx-auto">
          <form action={formAction} className="flex flex-col gap-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="group">
                <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.3em] text-text-muted/20 mb-5 group-focus-within:text-accent/40 transition-colors duration-500">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="bg-transparent border-b border-white/[0.08] text-text-primary pb-4 w-full focus:border-accent/30 transition-colors duration-500 text-[15px] placeholder:text-text-muted/10 outline-none"
                  placeholder="Your name"
                />
                {state.errors?.name?.map((error) => (
                  <p key={error} className="mt-3 text-red-400/60 text-xs tracking-wide">{error}</p>
                ))}
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.3em] text-text-muted/20 mb-5 group-focus-within:text-accent/40 transition-colors duration-500">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-transparent border-b border-white/[0.08] text-text-primary pb-4 w-full focus:border-accent/30 transition-colors duration-500 text-[15px] placeholder:text-text-muted/10 outline-none"
                  placeholder="you@company.com"
                />
                {state.errors?.email?.map((error) => (
                  <p key={error} className="mt-3 text-red-400/60 text-xs tracking-wide">{error}</p>
                ))}
              </div>
            </div>

            <div className="group">
              <label htmlFor="company" className="block text-[10px] uppercase tracking-[0.3em] text-text-muted/20 mb-5 group-focus-within:text-accent/40 transition-colors duration-500">
                Company <span className="text-text-muted/10">(optional)</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="bg-transparent border-b border-white/[0.08] text-text-primary pb-4 w-full focus:border-accent/30 transition-colors duration-500 text-[15px] placeholder:text-text-muted/10 outline-none"
                placeholder="Your company"
              />
            </div>

            <div className="group">
              <label htmlFor="message" className="block text-[10px] uppercase tracking-[0.3em] text-text-muted/20 mb-5 group-focus-within:text-accent/40 transition-colors duration-500">
                Project Details
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="bg-transparent border-b border-white/[0.08] text-text-primary pb-4 w-full focus:border-accent/30 transition-colors duration-500 text-[15px] resize-none placeholder:text-text-muted/10 leading-relaxed outline-none"
                placeholder="Tell us about your project, timeline, and budget range"
              />
              {state.errors?.message?.map((error) => (
                <p key={error} className="mt-3 text-red-400/60 text-xs tracking-wide">{error}</p>
              ))}
            </div>

            {state.errors?._form?.map((error) => (
              <p key={error} className="text-red-400/60 text-xs tracking-wide">{error}</p>
            ))}

            {/* Submit — clean text link style, no box */}
            <div className="pt-8 text-center">
              <button
                type="submit"
                disabled={isPending}
                className="group inline-flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.3em] text-text-muted/50 hover:text-accent transition-colors duration-500 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <span>{isPending ? 'Sending...' : 'Send Message'}</span>
                <span className="inline-block w-8 h-[1px] bg-current transition-all duration-500 group-hover:w-14" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
