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
      <VideoFacade
        vimeoId={project.vimeoId}
        thumbnailUrl={thumbnailUrl}
        title={project.title}
      />

      {/* Project content — centered, generous spacing */}
      <article className="max-w-3xl mx-auto px-6 py-20">
        {/* Title */}
        <h1 className="font-heading text-2xl sm:text-4xl uppercase tracking-[0.15em] text-text-primary mb-10">
          {project.title}
        </h1>

        {/* Metadata — clean horizontal line with dividers */}
        <div className="flex gap-12 flex-wrap pb-10 mb-10 border-b border-white/10">
          {project.client && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted/50 mb-1">Client</p>
              <p className="text-sm text-text-primary">{project.client}</p>
            </div>
          )}
          {project.services && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted/50 mb-1">Services</p>
              <p className="text-sm text-text-primary">{project.services}</p>
            </div>
          )}
          {project.year && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted/50 mb-1">Year</p>
              <p className="text-sm text-text-primary">{project.year}</p>
            </div>
          )}
        </div>

        {/* Description */}
        {descriptionParagraphs.length > 0 && (
          <div className="mb-16">
            {descriptionParagraphs.map((para, i) => (
              <p key={i} className="text-base text-text-muted/70 leading-relaxed mb-5">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Prev / Next navigation */}
        <nav className="flex justify-between items-center border-t border-white/10 pt-10 mb-20">
          <div className="flex-1">
            {prevProject && (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group inline-flex flex-col"
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-text-muted/40 mb-1">Previous</span>
                <span className="text-sm text-text-muted group-hover:text-accent transition-colors duration-300">
                  {prevProject.title}
                </span>
              </Link>
            )}
          </div>

          <Link
            href="/#work"
            className="text-[10px] uppercase tracking-[0.25em] text-text-muted/40 hover:text-text-primary transition-colors duration-300"
          >
            All Work
          </Link>

          <div className="flex-1 text-right">
            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group inline-flex flex-col items-end"
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-text-muted/40 mb-1">Next</span>
                <span className="text-sm text-text-muted group-hover:text-accent transition-colors duration-300">
                  {nextProject.title}
                </span>
              </Link>
            )}
          </div>
        </nav>

        {/* CTA */}
        <div className="text-center py-10 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/50 mb-4">
            Interested?
          </p>
          <p className="font-heading text-xl sm:text-2xl uppercase tracking-[0.15em] text-text-primary mb-8">
            Let&apos;s make something together.
          </p>
          <CTAButton variant="primary" href="/#contact">
            Start a Project
          </CTAButton>
        </div>
      </article>
    </>
  )
}
