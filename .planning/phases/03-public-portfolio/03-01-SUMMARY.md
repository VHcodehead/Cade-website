---
phase: 03-public-portfolio
plan: 01
subsystem: ui
tags: [next.js, vimeo, tailwind, react, server-components]

# Dependency graph
requires:
  - phase: 01-foundation-and-infrastructure
    provides: Next.js app scaffold, Tailwind v4 design tokens, global CSS
  - phase: 02-auth-system-and-data-layer
    provides: Prisma db client, SiteConfig model with contactEmail

provides:
  - Vimeo CDN remotePatterns in next.config.ts
  - getVimeoThumbnail + getProjectThumbnails utility (src/lib/vimeo.ts)
  - Fixed-header Nav component with scroll-to-solid and mobile hamburger
  - Three-column Footer server component with DB-sourced contact email
  - CTAButton reusable component (primary/secondary variants)
  - (public) route group layout wrapping nav + main + footer

affects:
  - 03-02 (homepage sections — depends on layout shell and Vimeo utility)
  - 03-03 (project detail pages — depends on Vimeo thumbnail utility)
  - 03-04 (contact form — CTAButton links to #contact)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Route groups ((public)) to apply shared layout to public pages without URL segments"
    - "Server Component footer fetches DB directly via db.siteConfig.findFirst()"
    - "Client Component nav uses useState + useEffect scroll listener for transparent-to-solid transition"
    - "oEmbed API with 24h next.js fetch revalidation for Vimeo thumbnail caching"
    - "vumbnail.com CDN as zero-fetch fallback for Vimeo thumbnails"

key-files:
  created:
    - src/lib/vimeo.ts
    - src/components/ui/cta-button.tsx
    - src/components/layout/nav.tsx
    - src/components/layout/footer.tsx
    - src/app/(public)/layout.tsx
    - src/app/(public)/page.tsx
  modified:
    - next.config.ts

key-decisions:
  - "Route group (public) used for layout shell — allows future admin routes to use a separate layout without URL impact"
  - "vumbnail.com CDN used as fallback for Vimeo thumbnails — no additional fetch required, pure CDN URL pattern"
  - "Footer as async Server Component — fetches SiteConfig directly from DB, no API layer needed"
  - "Deleted old src/app/page.tsx and moved to (public)/page.tsx to avoid Next.js route conflict"

patterns-established:
  - "Layout pattern: (public) route group wraps all public pages with Nav + Footer"
  - "Vimeo pattern: getVimeoThumbnail for single video, getProjectThumbnails for batch parallel fetch"
  - "CTA pattern: CTAButton component with primary/secondary variants links to /#contact"

requirements-completed: [SEO-04, SEO-02, RESP-01, LEAD-03]

# Metrics
duration: 8min
completed: 2026-03-31
---

# Phase 3 Plan 01: Public Layout Shell Summary

**Fixed-header nav with scroll-to-solid transition, three-column server-rendered footer with DB contact email, reusable CTAButton, and Vimeo oEmbed thumbnail utility with vumbnail.com CDN fallback**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-31T05:49:31Z
- **Completed:** 2026-03-31T05:51:27Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Vimeo CDN configured in next/image remotePatterns (i.vimeocdn.com + vumbnail.com) with oEmbed thumbnail utility using 24h fetch revalidation
- Public layout shell renders nav + main + footer via (public) route group — all subsequent public pages inherit this layout automatically
- Nav is fixed, transparent by default, transitions to solid bg-bg-base after 100px scroll with mobile hamburger overlay menu
- Footer fetches SiteConfig.contactEmail from DB server-side, three-column layout stacked on mobile

## Task Commits

1. **Task 1: Vimeo config and thumbnail utility** - `a038fdc` (feat)
2. **Task 2: Public layout shell — nav, footer, CTA button, route group** - `665e495` (feat)

## Files Created/Modified

- `next.config.ts` - Added i.vimeocdn.com and vumbnail.com remotePatterns for next/image
- `src/lib/vimeo.ts` - getVimeoThumbnail (oEmbed + fallback) and getProjectThumbnails (parallel slug-keyed)
- `src/components/ui/cta-button.tsx` - Reusable anchor with primary (accent bg) and secondary (border) variants
- `src/components/layout/nav.tsx` - Client component: fixed header, scroll-aware bg, mobile hamburger overlay
- `src/components/layout/footer.tsx` - Async server component: three-column grid, DB email, CTAButton, copyright
- `src/app/(public)/layout.tsx` - Route group layout: preconnect links + Nav + main + Footer
- `src/app/(public)/page.tsx` - Minimal placeholder (VLACOVISION heading + "Coming soon")

## Decisions Made

- Used (public) route group pattern so admin routes can use a separate layout without URL impact — matches Next.js App Router conventions
- Footer is an async Server Component that fetches from DB directly — no need for an API route or context provider for a single config value
- vumbnail.com added as a CDN fallback that returns a valid thumbnail URL string without any fetch — lightweight and reliable
- Moved src/app/page.tsx to src/app/(public)/page.tsx and deleted the original to prevent Next.js route conflict (two files cannot resolve the same "/" route)

## Deviations from Plan

None - plan executed exactly as written.

One minor issue handled automatically:

**[Rule 3 - Blocking] Cleared stale .next/types cache after page.tsx move**
- **Found during:** Task 2 verification (tsc --noEmit)
- **Issue:** .next/types/validator.ts still referenced deleted src/app/page.js after the file was moved, causing a TS2307 error
- **Fix:** Deleted .next/types directory so Next.js regenerates on next dev/build run
- **Files modified:** .next/types/ (removed)
- **Verification:** npx tsc --noEmit passes with no errors
- **Committed in:** 665e495 (Task 2 commit)

## Issues Encountered

None beyond the stale cache cleared above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Layout shell is complete — Plans 02 and 03 can build homepage sections and project pages that inherit Nav + Footer
- Vimeo utility is ready for use in hero section (Plan 02) and project cards (Plan 03)
- CTAButton is reusable across all sections that need a call-to-action
- The (public)/page.tsx placeholder will be replaced by Plan 02's homepage sections

---
*Phase: 03-public-portfolio*
*Completed: 2026-03-31*
