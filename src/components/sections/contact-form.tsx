'use client'

import { useState, useRef } from 'react'
import { submitContact, type ContactState } from '@/app/actions/contact'

export function ContactForm() {
  const [state, setState] = useState<ContactState>({ status: 'idle' })
  const [isPending, setIsPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = formRef.current
    if (!form) return

    const formData = new FormData(form)

    // Client-side validation
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!name?.trim()) {
      setState({ status: 'error', errors: { name: ['Name is required'] } })
      return
    }
    if (!email?.trim() || !email.includes('@')) {
      setState({ status: 'error', errors: { email: ['Valid email is required'] } })
      return
    }
    if (!message?.trim() || message.trim().length < 10) {
      setState({ status: 'error', errors: { message: ['Message must be at least 10 characters'] } })
      return
    }

    setIsPending(true)
    const result = await submitContact({ status: 'idle' }, formData)
    setState(result)
    setIsPending(false)

    if (result.status === 'success') {
      form.reset()
    }
  }

  if (state.status === 'success') {
    return (
      <section id="contact" className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-10 h-[1px] bg-accent/40 mx-auto mb-12" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent/70 mb-6">Message Sent</p>
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
    <section id="contact" className="min-h-screen flex flex-col justify-center py-32 sm:py-40 px-6 sm:px-10 lg:px-16" style={{ scrollMarginTop: '6rem' }}>
      <div className="w-full" style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
        {/* Heading */}
        <div className="text-center mb-20 sm:mb-28">
          <div className="w-10 h-[1px] bg-accent/30 mx-auto mb-12" />
          <h2
            className="text-[clamp(1.75rem,3.5vw,3rem)] uppercase tracking-[0.12em] text-text-primary leading-[1.1]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Start a Project
          </h2>
        </div>

        {/* Conversational form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-16 sm:space-y-20">
          {/* Sentence 1: Introduction */}
          <div className="text-[clamp(1.1rem,2vw,1.5rem)] leading-[2.2] text-text-muted/40">
            <span>My name is </span>
            <span className="inline-block relative">
              <input
                name="name"
                type="text"
                required
                className="bg-transparent border-b border-white/[0.1] text-text-primary pb-1 w-[200px] sm:w-[280px] focus:border-accent/40 transition-colors duration-500 outline-none placeholder:text-text-muted/15 text-[inherit]"
                placeholder="your name"
              />
              {state.errors?.name?.map((error) => (
                <span key={error} className="absolute -bottom-6 left-0 text-red-400/60 text-[11px]">{error}</span>
              ))}
            </span>
            <span> from </span>
            <span className="inline-block relative">
              <input
                name="company"
                type="text"
                className="bg-transparent border-b border-white/[0.1] text-text-primary pb-1 w-[200px] sm:w-[280px] focus:border-accent/40 transition-colors duration-500 outline-none placeholder:text-text-muted/15 text-[inherit]"
                placeholder="your company"
              />
            </span>
            <span>.</span>
          </div>

          {/* Sentence 2: Email */}
          <div className="text-[clamp(1.1rem,2vw,1.5rem)] leading-[2.2] text-text-muted/40">
            <span>You can reach me at </span>
            <span className="inline-block relative">
              <input
                name="email"
                type="email"
                required
                className="bg-transparent border-b border-white/[0.1] text-text-primary pb-1 w-[280px] sm:w-[360px] focus:border-accent/40 transition-colors duration-500 outline-none placeholder:text-text-muted/15 text-[inherit]"
                placeholder="you@company.com"
              />
              {state.errors?.email?.map((error) => (
                <span key={error} className="absolute -bottom-6 left-0 text-red-400/60 text-[11px]">{error}</span>
              ))}
            </span>
          </div>

          {/* Sentence 3: Project details */}
          <div className="text-[clamp(1.1rem,2vw,1.5rem)] leading-[2.2] text-text-muted/40">
            <span>I&apos;m looking for help with</span>
            <div className="mt-4">
              <textarea
                name="message"
                rows={3}
                required
                className="bg-transparent border-b border-white/[0.1] text-text-primary pb-2 w-full focus:border-accent/40 transition-colors duration-500 outline-none placeholder:text-text-muted/15 text-[inherit] resize-none leading-[1.8]"
                placeholder="a brand film, commercial, documentary..."
              />
              {state.errors?.message?.map((error) => (
                <p key={error} className="mt-2 text-red-400/60 text-[11px]">{error}</p>
              ))}
            </div>
          </div>

          {state.errors?._form?.map((error) => (
            <p key={error} className="text-red-400/60 text-xs tracking-wide">{error}</p>
          ))}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="group inline-flex items-center gap-4 text-[12px] uppercase tracking-[0.3em] text-text-primary/60 hover:text-accent transition-colors duration-500 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <span>{isPending ? 'Sending...' : 'Send Message'}</span>
              <span className="inline-block w-8 h-[1px] bg-current transition-all duration-500 group-hover:w-16" />
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
