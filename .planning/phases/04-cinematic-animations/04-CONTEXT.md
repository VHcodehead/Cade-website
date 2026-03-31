# Phase 4: Cinematic Animations - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Framer Motion animations as a polish layer on top of the existing public pages. Page transitions, scroll-triggered reveals, hover micro-interactions, and prefers-reduced-motion support. No new pages or features — purely visual motion enhancement.

</domain>

<decisions>
## Implementation Decisions

### Animation Intensity — Middle Ground
- Cinematic and memorable, but not competing with the video work
- More dramatic than pure restraint (not just fades) but less than full showpiece
- Reference: between Instrument (smooth) and ManvsMachine (bold)
- The videos are still the star — animations create atmosphere, not distraction

### Page Transitions
- Clip-path reveal effect — new page "wipes" in (cinematic, signature feel)
- AnimatePresence wrapping route changes
- Duration: 400-500ms
- Easing: custom ease-out curve

### Scroll Reveals
- Portfolio grid items: fade up (40px translate) + scale from 0.95 → 1.0 ("coming into focus" effect)
- Staggered by 100-150ms per item — cascade wave effect
- Section headings: fade in with subtle slide up (15-20px)
- Triggered via whileInView with once: true (animate once, don't repeat on scroll back)
- Duration: 500-600ms for the cinematic pacing

### Hover Micro-Interactions
- CTA buttons: subtle scale(1.03) + brightness lift on hover
- Nav links: underline grows from left (CSS transition, already established)
- Project cards: subtle scale(1.02) lift on container for depth
- No magnetic cursor effects — keep it clean, don't fight with hover-to-play video
- No 3D tilt/perspective transforms

### Hero Animations
- No scroll reveal on hero (already visible on load)
- Scroll indicator chevron: gentle pulse/bounce animation (CSS or Framer Motion)
- Hero overlay text: subtle fade-in on page load (delayed 500ms after hero video starts)

### Reduced Motion (ANIM-05)
- All Framer Motion animations check prefers-reduced-motion: reduce
- When enabled: content appears immediately, no transitions, no reveals
- Functional behavior unchanged — only visual motion removed
- Use a custom hook or Framer Motion's built-in useReducedMotion

### Claude's Discretion
- Exact clip-path animation path (circle reveal, horizontal wipe, diagonal)
- Whether to use layout animations for any transitions
- Exact stagger delay values and easing curves
- How to handle the AnimatePresence exit/enter coordination with App Router
- Whether scroll indicator uses CSS keyframes or Framer Motion

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/providers/motion-provider.tsx` — LazyMotion with domAnimation already wrapping the app
- `src/app/globals.css` — Design tokens for timing (can add animation-related custom properties)
- All page components are built and functional — animations are additive

### Established Patterns
- Client components use 'use client' directive — animation wrappers will need this
- Server Components for data fetching, Client Components at leaf — animation wrappers go at leaf level
- Existing hover effects on nav (CSS transitions) and project cards (Vimeo iframe injection)

### Integration Points
- `src/app/(public)/layout.tsx` — AnimatePresence wraps the page children here
- `src/components/sections/portfolio-grid.tsx` — Grid items get scroll reveal wrappers
- `src/components/sections/hero.tsx` — Hero overlay text gets fade-in
- `src/components/ui/cta-button.tsx` — Add hover scale animation
- Every section component — each gets a scroll reveal wrapper

</code_context>

<specifics>
## Specific Ideas

- "Coming into focus" effect on portfolio grid items (scale 0.95 → 1.0 + fade) — signature feel
- Clip-path page transition — cinematic reveal, more memorable than a basic fade
- Staggered cascade on grid — items appear in a wave, not all at once
- Cinematic pacing (400-600ms) — slower than typical web apps, more deliberate

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-cinematic-animations*
*Context gathered: 2026-03-31*
