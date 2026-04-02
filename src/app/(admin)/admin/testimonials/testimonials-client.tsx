'use client'

import { useActionState, useTransition } from 'react'
import { createTestimonial, deleteTestimonial, type TestimonialActionState } from '@/app/actions/testimonials'

type Testimonial = {
  id: string
  quote: string
  personName: string
  personTitle: string
  company: string
  photoUrl: string
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

const initialState: TestimonialActionState = { status: 'idle' }

export function TestimonialsPageClient({ testimonials }: { testimonials: Testimonial[] }) {
  const [state, formAction, isPending] = useActionState(createTestimonial, initialState)
  const [isDeleting, startDeleteTransition] = useTransition()

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    startDeleteTransition(async () => {
      await deleteTestimonial(id)
    })
  }

  return (
    <div className="space-y-8">
      {/* Add form */}
      <div className="bg-bg-card border border-white/10 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Add Testimonial</h2>

        {state.status === 'success' && (
          <p className="mb-4 text-green-400 text-sm font-medium">Testimonial added successfully.</p>
        )}
        {state.errors?._form && (
          <p className="mb-4 text-red-400 text-sm">{state.errors._form.join(', ')}</p>
        )}

        <form action={formAction} encType="multipart/form-data" className="space-y-4 max-w-xl">
          <div>
            <label htmlFor="quote" className="block text-sm font-medium text-text-primary mb-1">
              Quote
            </label>
            <textarea
              id="quote"
              name="quote"
              rows={4}
              required
              className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors resize-y"
            />
            {state.errors?.quote && (
              <p className="mt-1 text-red-400 text-xs">{state.errors.quote.join(', ')}</p>
            )}
          </div>

          <div>
            <label htmlFor="personName" className="block text-sm font-medium text-text-primary mb-1">
              Person Name
            </label>
            <input
              id="personName"
              name="personName"
              type="text"
              required
              className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
            />
            {state.errors?.personName && (
              <p className="mt-1 text-red-400 text-xs">{state.errors.personName.join(', ')}</p>
            )}
          </div>

          <div>
            <label htmlFor="personTitle" className="block text-sm font-medium text-text-primary mb-1">
              Title
            </label>
            <input
              id="personTitle"
              name="personTitle"
              type="text"
              className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-1">
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="w-full bg-bg-section border border-white/10 rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-text-primary mb-1">
              Photo (optional)
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
            {isPending ? 'Adding...' : 'Add Testimonial'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-bg-card border border-white/10 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-text-primary">
            Current Testimonials ({testimonials.length})
          </h2>
        </div>

        {testimonials.length === 0 ? (
          <p className="px-6 py-8 text-text-muted text-sm text-center">
            No testimonials yet. Add one above.
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {testimonials.map((t) => (
              <li key={t.id} className="flex items-start gap-4 px-6 py-4">
                {t.photoUrl ? (
                  <img
                    src={t.photoUrl}
                    alt={t.personName}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-bg-section border border-white/10 flex items-center justify-center text-text-muted text-sm font-medium shrink-0 mt-0.5">
                    {t.personName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm italic line-clamp-2">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="text-text-muted text-xs mt-1">
                    {t.personName}
                    {t.personTitle && `, ${t.personTitle}`}
                    {t.company && ` at ${t.company}`}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-xs text-red-400 border border-red-400/30 rounded hover:bg-red-400/10 transition-colors disabled:opacity-50 shrink-0"
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
