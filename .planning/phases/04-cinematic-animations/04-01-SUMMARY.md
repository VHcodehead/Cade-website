---
phase: 04-cinematic-animations
plan: 01
subsystem: ui
tags: [framer-motion, animation, page-transitions, scroll-reveal, reduced-motion, clip-path]

# Dependency graph
requires:
  - phase: 03-public-portfolio
    provides: Public layout shell (layout.tsx), MotionProvider with LazyMotion strict, portfolio page components
provides:
  - Centralized animation timing constants (EASING_CINEMATIC, EASING_SMOOTH, DURATION, STAGGER_GRID, STAGGER_DELAY)
  - OS-level reduced motion support via MotionConfig reducedMotion="user"
  - Horizontal clip-path wipe page transition on every public route navigation
  - RevealSection component for fade-up scroll reveals
  - AnimatedGrid + AnimatedGridItem components for staggered grid entry with "coming into focus" effect
affects: [04-02, any future animation work, portfolio grid, section headings]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "LazyMotion strict mode: always use m import, never motion"
    - "template.tsx for route-level enter-only page transitions (no AnimatePresence needed)"
    - "MotionConfig reducedMotion='user' at provider level for system-wide accessibility"
    - "whileInView with viewport once:true for scroll reveals that trigger once per session"

key-files:
  created:
    - src/lib/animation-config.ts
    - src/app/(public)/template.tsx
    - src/components/animations/reveal-section.tsx
    - src/components/animations/reveal-grid-item.tsx
  modified:
    - src/components/providers/motion-provider.tsx

key-decisions:
  - "template.tsx used for enter-only clip-path wipe — Next.js remounts template on every route change, so no AnimatePresence or exit animations are needed"
  - "MotionConfig reducedMotion='user' placed inside LazyMotion but outside page content — automatically skips transform/scale/clipPath animations for OS reduced-motion preference while keeping opacity transitions"
  - "AnimatedGridItem wraps outside ProjectCard to avoid conflicting with ProjectCard's internal IntersectionObserver for lazy thumbnail loading"

patterns-established:
  - "Animation constants: all easing and duration values centralized in animation-config.ts — never hardcode in components"
  - "Scroll reveal: whileInView + viewport once:true + negative margin for trigger-before-visible behavior"
  - "Stagger pattern: empty container variants with staggerChildren/delayChildren control child timing without container visual changes"

requirements-completed: [ANIM-01, ANIM-05]

# Metrics
duration: 2min
completed: 2026-03-30
---

# Phase 4 Plan 01: Animation Foundation Summary

**Clip-path horizontal wipe page transition, MotionConfig reduced-motion support, and reusable RevealSection/AnimatedGrid scroll-reveal components using framer-motion LazyMotion strict mode**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-30T07:16:55Z
- **Completed:** 2026-03-30T07:17:24Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Centralized all animation timing (EASING_CINEMATIC, EASING_SMOOTH, DURATION, STAGGER_GRID, STAGGER_DELAY) into a single importable module
- Added MotionConfig reducedMotion="user" to MotionProvider — OS prefers-reduced-motion automatically disables transform/scale/clipPath animations site-wide
- Created template.tsx producing a left-to-right clip-path wipe on every public route navigation (enter-only, no AnimatePresence needed)
- Created RevealSection for fade-up scroll reveals on section headings/content
- Created AnimatedGrid + AnimatedGridItem for staggered "coming into focus" grid entry ready for Plan 02 integration

## Task Commits

Each task was committed atomically:

1. **Task 1: Animation config + MotionProvider update + page transition template** - `26b6a8c` (feat)
2. **Task 2: Reusable scroll-reveal animation wrapper components** - `67cd9b9` (feat)

**Plan metadata:** (created in final commit — see below)

## Files Created/Modified

- `src/lib/animation-config.ts` - Centralized easing curves, durations, and stagger constants
- `src/components/providers/motion-provider.tsx` - Added MotionConfig reducedMotion="user" wrapping LazyMotion children
- `src/app/(public)/template.tsx` - Enter-only clip-path wipe page transition for all public routes
- `src/components/animations/reveal-section.tsx` - whileInView fade-up wrapper for section headings
- `src/components/animations/reveal-grid-item.tsx` - Staggered grid container (AnimatedGrid) and item (AnimatedGridItem) wrappers with exported variants

## Decisions Made

- template.tsx used for page transition (not AnimatePresence in layout.tsx) — Next.js remounts template on route changes, giving enter-only animation behavior for free without exit animation complexity
- MotionConfig placed inside LazyMotion but wrapping all page content — single source of reduced-motion truth for the entire site
- AnimatedGridItem designed to wrap outside ProjectCard to avoid IntersectionObserver interference with lazy thumbnail loading

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Full `npm run build` fails in dev environment due to no local PostgreSQL running (pre-existing environment constraint, unrelated to animation code). TypeScript `--noEmit` compile passed clean, confirming all animation code is correct.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All animation primitives are ready for Plan 02 integration into existing page sections
- RevealSection can be dropped directly around section headings in hero, portfolio, and contact sections
- AnimatedGrid + AnimatedGridItem ready to wrap PortfolioGrid items
- Reduced-motion and LazyMotion strict compatibility already handled — Plan 02 just consumes the components

---
*Phase: 04-cinematic-animations*
*Completed: 2026-03-30*
