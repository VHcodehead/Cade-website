export const dynamic = 'force-dynamic';

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { getVimeoThumbnail } from '@/lib/vimeo'
import { VideoFacade } from '@/components/portfolio/video-facade'
import { VideoPlaylist } from '@/components/portfolio/video-playlist'
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
    alternates: {
      canonical: `https://www.vlacovision.com/projects/${slug}`,
    },
    openGraph: {
      url: `https://www.vlacovision.com/projects/${slug}`,
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

  // Parse additional Vimeo IDs if present
  const additionalVimeoIds = project.additionalVimeoIds
    ? project.additionalVimeoIds.split(',').map((id: string) => id.trim()).filter(Boolean)
    : []


  return (
    <div className="min-h-screen">
      <AnalyticsTracker page={`/projects/${slug}`} projectId={project.id} />

      {/* Full-width video */}
      <div className="pt-20">
        {additionalVimeoIds.length > 0 ? (
          <VideoPlaylist
            vimeoIds={[project.vimeoId, ...additionalVimeoIds]}
            thumbnailUrl={thumbnailUrl}
            title={project.title}
          />
        ) : (
          <VideoFacade
            vimeoId={project.vimeoId}
            thumbnailUrl={thumbnailUrl}
            title={project.title}
          />
        )}
      </div>

      {/* Centered content wrapper */}
      <div className="w-full flex justify-center">
        <article className="w-full max-w-[900px] px-8 sm:px-16 lg:px-20">

          {/* Title */}
          <div className="text-center pt-32 sm:pt-44 pb-20 sm:pb-28">
            <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/25 mb-8">
              {project.client || 'Project'}
            </p>
            <h1
              className="text-[clamp(2rem,5vw,4rem)] uppercase tracking-[0.15em] text-text-primary leading-[1.05]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {project.title}
            </h1>
          </div>

          {/* Metadata — centered row */}
          <div className="flex justify-center gap-20 sm:gap-28 flex-wrap py-12 sm:py-14 border-t border-white/[0.06] border-b border-b-white/[0.06]">
            {project.client && (
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.35em] text-text-muted/20 mb-3">Client</p>
                <p className="text-[14px] text-text-primary/60">{project.client}</p>
              </div>
            )}
            {project.services && (
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.35em] text-text-muted/20 mb-3">Services</p>
                <p className="text-[14px] text-text-primary/60">{project.services}</p>
              </div>
            )}
            {project.year && (
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.35em] text-text-muted/20 mb-3">Year</p>
                <p className="text-[14px] text-text-primary/60">{project.year}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {descriptionParagraphs.length > 0 && (
            <div className="text-center" style={{ paddingTop: '5rem', paddingBottom: '5rem', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
              {descriptionParagraphs.map((para, i) => (
                <p key={i} className="text-[15px] text-text-muted/35 leading-[2] tracking-wide" style={{ marginBottom: i < descriptionParagraphs.length - 1 ? '2rem' : 0 }}>
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* CTA — right after description, prominent */}
          <div className="text-center" style={{ paddingTop: '4rem', paddingBottom: '6rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <a
              href="/#contact"
              className="text-[clamp(1rem,2vw,1.5rem)] uppercase tracking-[0.2em] text-text-primary/70 hover:text-accent transition-colors duration-500"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Start a Project →
            </a>
          </div>

          {/* Prev / Next */}
          <nav style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '5rem', paddingBottom: '5rem' }}>
            <div className="grid grid-cols-3 items-start">
              <div>
                {prevProject && (
                  <Link href={`/projects/${prevProject.slug}`} className="group inline-flex flex-col">
                    <span className="text-[9px] uppercase tracking-[0.35em] text-text-muted/15" style={{ marginBottom: '1rem' }}>Previous</span>
                    <span className="text-[13px] text-text-muted/35 group-hover:text-text-primary transition-colors duration-500">
                      {prevProject.title}
                    </span>
                  </Link>
                )}
              </div>

              <div className="text-center">
                <Link
                  href="/#work"
                  className="text-[9px] uppercase tracking-[0.35em] text-text-muted/15 hover:text-text-muted/50 transition-colors duration-500"
                >
                  All Work
                </Link>
              </div>

              <div className="text-right">
                {nextProject && (
                  <Link href={`/projects/${nextProject.slug}`} className="group inline-flex flex-col items-end">
                    <span className="text-[9px] uppercase tracking-[0.35em] text-text-muted/15" style={{ marginBottom: '1rem' }}>Next</span>
                    <span className="text-[13px] text-text-muted/35 group-hover:text-text-primary transition-colors duration-500">
                      {nextProject.title}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </nav>

        </article>
      </div>
    </div>
  )
}
