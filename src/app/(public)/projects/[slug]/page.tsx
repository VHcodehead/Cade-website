import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { getVimeoThumbnail } from '@/lib/vimeo'
import { VideoFacade } from '@/components/portfolio/video-facade'
import { CTAButton } from '@/components/ui/cta-button'
import { AnalyticsTracker } from '@/components/analytics/page-tracker'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await db.project.findUnique({ where: { slug } })

  if (!project || !project.published) {
    return { title: 'Project Not Found — VLACOVISION' }
  }

  const thumbnailUrl = await getVimeoThumbnail(project.vimeoId)
  const description = project.description
    ? project.description.slice(0, 160)
    : `${project.title} — a VLACOVISION production.`

  return {
    title: `${project.title} — VLACOVISION`,
    description,
    openGraph: {
      title: `${project.title} — VLACOVISION`,
      description,
      type: 'video.other',
      images: thumbnailUrl ? [thumbnailUrl] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await db.project.findUnique({ where: { slug } })

  if (!project || !project.published) {
    notFound()
  }

  const [thumbnailUrl, prevProject, nextProject] = await Promise.all([
    getVimeoThumbnail(project.vimeoId),
    db.project.findFirst({
      where: { published: true, sortOrder: { lt: project.sortOrder } },
      orderBy: { sortOrder: 'desc' },
    }),
    db.project.findFirst({
      where: { published: true, sortOrder: { gt: project.sortOrder } },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  const descriptionParagraphs = project.description
    ? project.description.split('\n\n').filter(Boolean)
    : []

  return (
    <>
      {/* Silent page view tracker — fires sendBeacon on mount, no visible UI */}
      <AnalyticsTracker page={`/projects/${slug}`} projectId={project.id} />

      {/* Full-width video facade at top */}
      <VideoFacade
        vimeoId={project.vimeoId}
        thumbnailUrl={thumbnailUrl}
        title={project.title}
      />

      {/* Project content */}
      <div className="max-w-4xl mx-auto px-spacing-4 py-spacing-8">
        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-5xl uppercase tracking-widest mb-4">
          {project.title}
        </h1>

        {/* Metadata row */}
        <div className="flex gap-8 flex-wrap mb-spacing-4">
          {project.client && (
            <div>
              <p className="text-xs uppercase tracking-widest text-text-muted">Client</p>
              <p className="text-sm text-text-primary">{project.client}</p>
            </div>
          )}
          {project.services && (
            <div>
              <p className="text-xs uppercase tracking-widest text-text-muted">Services</p>
              <p className="text-sm text-text-primary">{project.services}</p>
            </div>
          )}
          {project.year && (
            <div>
              <p className="text-xs uppercase tracking-widest text-text-muted">Year</p>
              <p className="text-sm text-text-primary">{project.year}</p>
            </div>
          )}
        </div>

        {/* Description */}
        {descriptionParagraphs.length > 0 && (
          <div className="mt-spacing-4">
            {descriptionParagraphs.map((para, i) => (
              <p key={i} className="text-lg text-text-muted leading-relaxed mb-4">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Prev / Next navigation */}
        <div className="flex justify-between items-center border-t border-bg-section pt-spacing-4 mt-spacing-8">
          <div>
            {prevProject && (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="text-sm text-text-muted hover:text-accent transition-colors"
              >
                &larr; {prevProject.title}
              </Link>
            )}
          </div>

          <Link
            href="/#work"
            className="text-sm text-text-muted hover:text-accent transition-colors"
          >
            Back to Portfolio
          </Link>

          <div>
            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="text-sm text-text-muted hover:text-accent transition-colors"
              >
                {nextProject.title} &rarr;
              </Link>
            )}
          </div>
        </div>

        {/* CTA at bottom */}
        <div className="text-center py-spacing-8">
          <p className="font-heading text-xl uppercase tracking-widest mb-6">
            Like what you see? Let&apos;s talk.
          </p>
          <CTAButton variant="primary" href="/#contact">
            Start a Project
          </CTAButton>
        </div>
      </div>
    </>
  )
}
