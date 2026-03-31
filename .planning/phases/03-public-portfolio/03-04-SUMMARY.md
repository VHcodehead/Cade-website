---
phase: 03-public-portfolio
plan: "04"
subsystem: public-portfolio
tags: [video-facade, project-detail, seo, contact-form, metadata]
dependency_graph:
  requires: ["03-02", "03-03"]
  provides: ["project-detail-page", "video-facade", "seo-metadata", "contact-form-integration"]
  affects: ["homepage", "project-pages"]
tech_stack:
  added: []
  patterns: ["video-facade-poster-to-iframe", "next-generateMetadata", "prev-next-sortorder-navigation"]
key_files:
  created:
    - src/components/portfolio/video-facade.tsx
    - src/app/(public)/projects/[slug]/page.tsx
  modified:
    - src/app/(public)/page.tsx
decisions:
  - "VideoFacade swaps poster image to Vimeo iframe on click — defers iframe load for LCP performance"
  - "generateMetadata in (public)/page.tsx uses metadata export (not async function) since no dynamic data needed"
  - "Prev/Next navigation uses sortOrder lt/gt queries — clean and DB-driven ordering"
  - "ContactForm replaces placeholder section directly — component already owns id='contact' wrapper"
metrics:
  duration_min: 17
  completed_date: "2026-03-31"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 1
---

# Phase 03 Plan 04: Project Detail Page, Video Facade, and SEO Summary

**One-liner:** Vimeo video facade (poster-click-to-iframe) on project detail pages with prev/next navigation, project-specific SEO metadata, and ContactForm wired into the homepage.

## What Was Built

### Task 1: VideoFacade component and project detail page

Created `src/components/portfolio/video-facade.tsx` — a client component that renders a poster image with a centered play button overlay. On click, it replaces itself with the Vimeo iframe with `?autoplay=1` and privacy-respecting flags (`dnt=1`, no title/byline/portrait). The container is `relative w-full aspect-video bg-black` to preserve aspect ratio at all screen widths.

Created `src/app/(public)/projects/[slug]/page.tsx` — a server component with:
- `generateMetadata` using `Promise<{ slug: string }>` params (Next.js 16 pattern)
- Project fetch via `db.project.findUnique({ where: { slug } })` with 404 for missing/unpublished
- Parallel fetch of thumbnail, prevProject, nextProject
- Full layout: VideoFacade full-width, then max-w-4xl content with title, metadata row (client/services/year), description paragraphs (split on `\n\n`)
- Prev/Next nav using `sortOrder lt/gt` queries with `← title` / `title →` links
- CTA section: "Like what you see? Let's talk." with CTAButton pointing to `/#contact`

### Task 2: SEO metadata on homepage and wire ContactForm

Updated `src/app/(public)/page.tsx`:
- Added `export const metadata: Metadata` with title "VLACOVISION — Premium Video Production", rich description mentioning Bay Area + Nike/Disney/Lululemon, and OpenGraph type "website" with siteName
- Replaced the contact placeholder `<section id="contact">` with `<ContactForm />` — the component already owns its section wrapper with `id="contact"`, so all `#contact` anchor links (hero CTA, brand logo CTA, project detail CTA, footer) resolve correctly without any additional changes

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

Files created/modified:
- src/components/portfolio/video-facade.tsx: FOUND
- src/app/(public)/projects/[slug]/page.tsx: FOUND
- src/app/(public)/page.tsx: FOUND (modified)

Commits:
- ee011e6: feat(03-04): project detail page with video facade and prev/next navigation
- f90e1c3: feat(03-04): SEO metadata on homepage and wire ContactForm

## Self-Check: PASSED
