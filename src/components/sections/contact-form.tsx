'use client'

import { useActionState } from 'react'
import { submitContact, type ContactState } from '@/app/actions/contact'

const initialState: ContactState = { status: 'idle' }

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState)

  if (state.status === 'success') {
    return (
      <section id="contact" className="py-40 sm:py-52 px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent/80 mb-6">Message Sent</p>
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
    <section id="contact" className="py-40 sm:py-52 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left column — heading and context */}
          <div className="lg:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/30 mb-6">
              Contact
            </p>
            <h2
              className="text-[clamp(1.5rem,3vw,2.5rem)] uppercase tracking-[0.12em] text-text-primary leading-[1.1] mb-8"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Let&apos;s Work
              <br />
              Together
            </h2>
            <p className="text-[13px] text-text-muted/40 leading-relaxed max-w-xs">
              Have a project in mind? We&apos;d love to hear about it. Fill out the form and we&apos;ll get back to you within 24 hours.
            </p>
          </div>

          {/* Right column — the form */}
          <div className="lg:col-span-8">
            <form action={formAction} className="flex flex-col gap-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {/* Name */}
                <div className="group">
                  <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.3em] text-text-muted/30 mb-4 group-focus-within:text-text-muted/60 transition-colors duration-300">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="bg-transparent border-b border-border-subtle text-text-primary pb-4 w-full focus:border-text-muted/40 transition-colors duration-500 text-[15px] placeholder:text-text-muted/15"
                    placeholder="Your name"
                  />
                  {state.errors?.name?.map((error) => (
                    <p key={error} className="mt-3 text-red-400/80 text-xs tracking-wide">{error}</p>
                  ))}
                </div>

                {/* Email */}
                <div className="group">
                  <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.3em] text-text-muted/30 mb-4 group-focus-within:text-text-muted/60 transition-colors duration-300">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-transparent border-b border-border-subtle text-text-primary pb-4 w-full focus:border-text-muted/40 transition-colors duration-500 text-[15px] placeholder:text-text-muted/15"
                    placeholder="you@company.com"
                  />
                  {state.errors?.email?.map((error) => (
                    <p key={error} className="mt-3 text-red-400/80 text-xs tracking-wide">{error}</p>
                  ))}
                </div>
              </div>

              {/* Company */}
              <div className="group">
                <label htmlFor="company" className="block text-[10px] uppercase tracking-[0.3em] text-text-muted/30 mb-4 group-focus-within:text-text-muted/60 transition-colors duration-300">
                  Company <span className="text-text-muted/15">(optional)</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="bg-transparent border-b border-border-subtle text-text-primary pb-4 w-full focus:border-text-muted/40 transition-colors duration-500 text-[15px] placeholder:text-text-muted/15"
                  placeholder="Your company"
                />
              </div>

              {/* Message */}
              <div className="group">
                <label htmlFor="message" className="block text-[10px] uppercase tracking-[0.3em] text-text-muted/30 mb-4 group-focus-within:text-text-muted/60 transition-colors duration-300">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="bg-transparent border-b border-border-subtle text-text-primary pb-4 w-full focus:border-text-muted/40 transition-colors duration-500 text-[15px] resize-none placeholder:text-text-muted/15 leading-relaxed"
                  placeholder="Tell us about your project, timeline, and budget range"
                />
                {state.errors?.message?.map((error) => (
                  <p key={error} className="mt-3 text-red-400/80 text-xs tracking-wide">{error}</p>
                ))}
              </div>

              {state.errors?._form?.map((error) => (
                <p key={error} className="text-red-400/80 text-xs tracking-wide">{error}</p>
              ))}

              {/* Submit — editorial style, not a fat button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isPending}
                  className="group inline-flex items-center gap-5 text-[11px] font-medium uppercase tracking-[0.25em] text-text-primary transition-colors duration-500 hover:text-accent disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <span>{isPending ? 'Sending...' : 'Send Message'}</span>
                  <span className="inline-block w-10 h-[1px] bg-current transition-all duration-500 group-hover:w-16 group-disabled:w-10" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
