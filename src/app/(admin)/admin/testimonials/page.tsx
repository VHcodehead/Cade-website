import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'
import { TestimonialsPageClient } from './testimonials-client'

export default async function AdminTestimonialsPage() {
  await verifySession()

  const testimonials = await db.testimonial.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-8">Testimonials</h1>
      <TestimonialsPageClient testimonials={testimonials} />
    </div>
  )
}
