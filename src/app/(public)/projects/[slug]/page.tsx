export const dynamic = 'force-dynamic';

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
      <AnalyticsTracker page={`/projects/${slug}`} projectId={project.id} />

      {/* Full-width video */}
      <div className="pt-20">
        <VideoFacade
          vimeoId={project.vimeoId}
          thumbnailUrl={thumbnailUrl}
          title={project.title}
        />
      </div>

      {/* Project content — single column, centered, generous spacing */}
      <article className="max-w-3xl mx-auto px-6 sm:px-10">

        {/* Title block */}
        <div className="pt-24 sm:pt-32 pb-16 sm:pb-20">
          <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/20 mb-6">
            {project.client || 'Project'}
          </p>
          <h1
            className="text-[clamp(1.75rem,4vw,3.5rem)] uppercase tracking-[0.1em] text-text-primary leading-[1.05]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {project.title}
          </h1>
        </div>

        {/* Metadata — clean horizontal row */}
        <div className="flex gap-16 sm:gap-20 flex-wrap py-10 border-t border-border-subtle border-b border-b-border-subtle">
          {project.client && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/20 mb-2">Client</p>
              <p className="text-[14px] text-text-primary/70">{project.client}</p>
            </div>
          )}
          {project.services && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/20 mb-2">Services</p>
              <p className="text-[14px] text-text-primary/70">{project.services}</p>
            </div>
          )}
          {project.year && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/20 mb-2">Year</p>
              <p className="text-[14px] text-text-primary/70">{project.year}</p>
            </div>
          )}
        </div>

        {/* Description — if exists */}
        {descriptionParagraphs.length > 0 && (
          <div className="py-16 sm:py-20">
            {descriptionParagraphs.map((para, i) => (
              <p key={i} className="text-[15px] text-text-muted/40 leading-[1.9] tracking-wide mb-6 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Prev / Next */}
        <nav className="border-t border-border-subtle py-20 sm:py-24">
          <div className="grid grid-cols-3 items-start">
            <div>
              {prevProject && (
                <Link href={`/projects/${prevProject.slug}`} className="group inline-flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted/15 mb-3">Previous</span>
                  <span className="text-[13px] text-text-muted/40 group-hover:text-text-primary transition-colors duration-300">
                    {prevProject.title}
                  </span>
                </Link>
              )}
            </div>

            <div className="text-center">
              <Link
                href="/#work"
                className="text-[10px] uppercase tracking-[0.3em] text-text-muted/15 hover:text-text-muted/50 transition-colors duration-300"
              >
                All Work
              </Link>
            </div>

            <div className="text-right">
              {nextProject && (
                <Link href={`/projects/${nextProject.slug}`} className="group inline-flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted/15 mb-3">Next</span>
                  <span className="text-[13px] text-text-muted/40 group-hover:text-text-primary transition-colors duration-300">
                    {nextProject.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* CTA */}
        <div className="text-center py-24 sm:py-32 border-t border-border-subtle">
          <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/15 mb-10">
            Interested?
          </p>
          <h2
            className="text-[clamp(1.25rem,2.5vw,2rem)] uppercase tracking-[0.12em] text-text-primary mb-14 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Let&apos;s make something
            <br />
            worth watching.
          </h2>
          <CTAButton variant="primary" href="/#contact">
            Start a Project
          </CTAButton>
        </div>
      </article>
    </>
  )
}
