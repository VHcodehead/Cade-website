# Phase 4: Cinematic Animations - Research

**Researched:** 2026-03-30
**Domain:** Framer Motion v12, Next.js 16 App Router animation patterns
**Confidence:** HIGH (core APIs), MEDIUM (App Router page transition approach)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Animation intensity:** Middle ground — cinematic and memorable but not competing with video work. Between Instrument (smooth) and ManvsMachine (bold). Videos are still the star.
- **Page transitions:** Clip-path reveal effect, new page wipes in. AnimatePresence wrapping route changes. Duration 400-500ms. Custom ease-out curve.
- **Scroll reveals:** Portfolio grid: fade up (40px translate) + scale 0.95 → 1.0. Staggered 100-150ms per item. Section headings: fade in with subtle slide up 15-20px. `whileInView` with `once: true`. Duration 500-600ms.
- **Hover micro-interactions:** CTA buttons: scale(1.03) + brightness lift. Project cards: scale(1.02) lift. No magnetic cursor. No 3D tilt/perspective transforms.
- **Hero animations:** No scroll reveal on hero (already visible on load). Scroll indicator chevron: gentle pulse/bounce. Hero overlay text: fade-in on load delayed 500ms.
- **Reduced motion (ANIM-05):** All animations check prefers-reduced-motion. When enabled: content appears immediately, no transitions, no reveals. Use Framer Motion's built-in useReducedMotion.

### Claude's Discretion
- Exact clip-path animation path (circle reveal, horizontal wipe, diagonal)
- Whether to use layout animations for any transitions
- Exact stagger delay values and easing curves
- How to handle AnimatePresence exit/enter coordination with App Router
- Whether scroll indicator uses CSS keyframes or Framer Motion

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANIM-01 | Cinematic page transitions between routes (Framer Motion AnimatePresence) | `template.tsx` pattern with `m.div` clip-path reveal; see Architecture Patterns |
| ANIM-02 | Scroll-triggered reveal animations on grid items and sections (whileInView) | `whileInView` + `viewport={{ once: true }}` variants pattern; see Code Examples |
| ANIM-03 | Staggered animation on portfolio grid items entering viewport | `staggerChildren` in parent variant transition; see Code Examples |
| ANIM-04 | Smooth hover effects on interactive elements (CTAs, nav links, logos) | `whileHover` scale + brightness on `m.a`/`m.div`; see Code Examples |
| ANIM-05 | Respects prefers-reduced-motion for accessibility | `useReducedMotion` hook + `MotionConfig reducedMotion="user"` in provider; see Architecture Patterns |
</phase_requirements>

---

## Summary

The project uses `framer-motion` v12.38.0, which is the renamed `motion` package (imports from `framer-motion` remain valid — the rename is to the `motion` npm package, not a breaking API change). The core animation APIs — `m`, `LazyMotion`, `domAnimation`, `whileInView`, `AnimatePresence`, `useReducedMotion` — are all stable and fully supported.

The most complex requirement is ANIM-01: page transitions with the Next.js App Router. The App Router's internal context management breaks the standard `AnimatePresence` exit-animation pattern. The recommended approach for this project's use case (enter-only cinematic reveal, 400-500ms, no complex exit) is the `template.tsx` file convention: a Next.js file that re-renders on every route change, used to wrap page content with a `m.div` carrying `initial` and `animate` props. This avoids the FrozenRouter hack entirely. Enter-only clip-path transitions are visually compelling and sidestep all App Router exit-animation complexity.

For scroll reveals (ANIM-02/03), `whileInView` with `viewport={{ once: true }}` and parent-child variant staggering via `staggerChildren` in the transition config is the correct, fully supported pattern. Reduced motion (ANIM-05) is best handled by adding `MotionConfig reducedMotion="user"` to the existing `MotionProvider` — it automatically disables transform and layout animations site-wide while preserving opacity/color changes.

**Primary recommendation:** Use `template.tsx` for enter-only clip-path page transition; `MotionConfig reducedMotion="user"` in MotionProvider for ANIM-05; `whileInView` + `staggerChildren` for ANIM-02/03; `whileHover` for ANIM-04.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | 12.38.0 (installed) | All animation primitives | Already installed, LazyMotion configured at root |
| React | 19.0.0 (installed) | Component model | Already in use |
| Next.js | 16.2.1 (installed) | App Router, template.tsx convention | Already in use |

### Animation Feature Matrix

| Feature | Framer Motion API | Status |
|---------|------------------|--------|
| Page transition (enter-only) | `template.tsx` + `m.div` initial/animate | Standard, no hacks needed |
| Scroll reveal | `whileInView` + `viewport={{ once: true }}` | Fully supported |
| Stagger children | `staggerChildren` in parent `transition` | Fully supported |
| Hover effects | `whileHover` on `m.div`/`m.a` | Fully supported |
| Reduced motion | `MotionConfig reducedMotion="user"` | Official API |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `template.tsx` enter-only | FrozenRouter + LayoutTransition for full exit | More complex, accesses Next.js internals (`next/dist/...`), fragile across versions |
| `MotionConfig reducedMotion="user"` | `useReducedMotion()` hook in each component | Hook requires manual wiring in every animated component; MotionConfig handles it globally |
| `staggerChildren` in variant | `stagger()` utility with `delayChildren` | Both work; `staggerChildren` is simpler for fixed delays, `stagger()` utility offers `from: "center"` and easing on the delay itself |

**Installation:** No new installs needed — all dependencies already in place.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   └── (public)/
│       ├── layout.tsx           # Unchanged — Nav/Footer shell
│       └── template.tsx         # NEW — page transition wrapper (m.div clip-path)
├── components/
│   ├── providers/
│   │   └── motion-provider.tsx  # ADD MotionConfig reducedMotion="user"
│   ├── animations/              # NEW — reusable animation wrappers
│   │   ├── reveal-section.tsx   # whileInView fade-up for section headings
│   │   └── reveal-grid-item.tsx # whileInView for individual grid items
│   ├── sections/
│   │   ├── portfolio-grid.tsx   # WRAP with reveal-grid-item + stagger parent
│   │   ├── hero.tsx             # ADD hero text fade-in + chevron animation
│   │   └── *.tsx                # WRAP headings with reveal-section
│   └── ui/
│       └── cta-button.tsx       # CONVERT to m.a with whileHover
```

### Pattern 1: Page Transition via template.tsx (ANIM-01)

**What:** Next.js `template.tsx` re-renders a new component instance on every route change (unlike `layout.tsx` which persists). Wrapping page content in a `m.div` with `initial`/`animate` gives enter-only transitions without needing AnimatePresence or exit animations.

**When to use:** Enter-only transitions. No exit needed — the clip-path reveal of the incoming page is sufficient for cinematic feel.

**Why enter-only works:** The old page is already gone by the time the new page renders. The incoming clip-path wipe reads as a deliberate reveal. This is simpler and more robust than trying to coordinate exit + enter with App Router internals.

**Example:**
```tsx
// src/app/(public)/template.tsx
'use client';
import { m } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      transition={{
        duration: 0.45,
        ease: [0.76, 0, 0.24, 1],  // custom ease-out — cinematic
      }}
    >
      {children}
    </m.div>
  );
}
```

**Note on clipPath directions for Claude's discretion:**
- Horizontal wipe (left to right): `initial: 'inset(0 100% 0 0)'` → `animate: 'inset(0 0% 0 0)'`
- Vertical wipe (top to bottom): `initial: 'inset(0 0 100% 0)'` → `animate: 'inset(0 0 0% 0)'`
- Diagonal: use polygon — `initial: 'polygon(0 0, 0 0, 0 100%, 0 100%)'` → `animate: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'`

The horizontal left-to-right wipe is recommended for "wipe in" feel at 400-500ms.

**`m` vs `motion` import:** The project uses `LazyMotion strict` mode. Within `LazyMotion strict`, use `m` (not `motion`) to prevent double-loading features. Import: `import { m } from 'framer-motion'`.

### Pattern 2: Scroll Reveal — Section Headings (ANIM-02)

**What:** `whileInView` with variants, `viewport={{ once: true }}`, 15-20px y translate + fade, 500-600ms.

**Example:**
```tsx
// src/components/animations/reveal-section.tsx
'use client';
import { m } from 'framer-motion';
import type { ReactNode } from 'react';

const variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function RevealSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </m.div>
  );
}
```

**`viewport.margin`:** Negative margin means the element must be 80px into the viewport before triggering — prevents premature firing just from scroll momentum near the fold.

### Pattern 3: Staggered Grid (ANIM-03)

**What:** Parent variant orchestrates `staggerChildren`; each `ProjectCard` wrapper uses child variants. Fade up 40px + scale 0.95 → 1.0.

**Example:**
```tsx
// src/components/animations/reveal-grid-item.tsx
'use client';
import { m } from 'framer-motion';
import type { ReactNode } from 'react';

export const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,  // 120ms between items — cascade wave
      delayChildren: 0.05,
    },
  },
};

export const gridItemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Parent wrapper — goes in PortfolioGrid around the grid div
export function AnimatedGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      variants={gridContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {children}
    </m.div>
  );
}

// Child wrapper — goes around each ProjectCard
export function AnimatedGridItem({ children }: { children: ReactNode }) {
  return (
    <m.div variants={gridItemVariants}>
      {children}
    </m.div>
  );
}
```

**Key:** Child variants inherit the parent's `whileInView` trigger automatically when `variants` prop is set on children. The stagger delay is defined only in the parent's transition — children just define their own animation values.

### Pattern 4: Hover Effects (ANIM-04)

**What:** `whileHover` on `m.a` for CTAButton, `m.div` for ProjectCard outer wrapper.

**Example — CTAButton:**
```tsx
// src/components/ui/cta-button.tsx (converted to m.a)
'use client';
import { m } from 'framer-motion';

export function CTAButton({ variant, href, children }: CTAButtonProps) {
  return (
    <m.a
      href={href}
      whileHover={{ scale: 1.03, filter: 'brightness(1.1)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={variant === 'primary'
        ? 'inline-block px-8 py-3 bg-accent text-white font-bold uppercase tracking-widest'
        : 'inline-block px-8 py-3 border border-text-muted text-text-primary uppercase tracking-widest'
      }
    >
      {children}
    </m.a>
  );
}
```

**Note:** Remove existing `transition-opacity hover:opacity-80` Tailwind classes from CTAButton when converting — let Framer Motion own the hover state. Nav underline hover (CSS) is already established and should stay as-is (CSS transition is fine for this).

### Pattern 5: Reduced Motion (ANIM-05)

**What:** Add `MotionConfig reducedMotion="user"` to the existing `MotionProvider`. This automatically disables transform and layout animations site-wide when `prefers-reduced-motion: reduce` is set. Opacity and color transitions are preserved (content remains visible, just without motion).

**Example:**
```tsx
// src/components/providers/motion-provider.tsx
'use client';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
```

**What `reducedMotion="user"` does:** Reads the OS-level `prefers-reduced-motion: reduce` media query. When active, all `transform`, `x`, `y`, `scale`, `rotate`, `clipPath` animations are skipped — elements jump to their final state. Opacity and color still animate (they don't cause vestibular disruption). This means reveals still "appear" (via opacity) rather than being completely instant, which is the accessibility-compliant middle ground.

**If more control needed:** Use `useReducedMotion()` hook in individual components to completely skip animation variants.

### Pattern 6: Hero Text Fade-in (ANIM-01 adjacent)

**What:** Hero overlay text fades in on mount with 500ms delay. No scroll reveal needed — hero is visible at load. Use `m.div` with `animate` (not `whileInView`).

**Example:**
```tsx
// In hero.tsx (already 'use client')
<m.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6, delay: 0.5 }}
>
  {/* overlay text */}
</m.div>
```

### Pattern 7: Scroll Indicator Chevron

**Claude's discretion — recommended approach:** Keep the existing `animate-bounce` Tailwind CSS class (already in hero.tsx). CSS animations are cheaper, already working, and appropriate for a simple bounce. No need to add Framer Motion for this element.

**Alternative if Framer Motion preferred:**
```tsx
<m.div
  animate={{ y: [0, 6, 0] }}
  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
>
```

### Anti-Patterns to Avoid

- **Using `motion` instead of `m` inside `LazyMotion strict`:** Will throw a runtime error. Always use `m` from `'framer-motion'` when inside `LazyMotion strict`.
- **Putting AnimatePresence in `(public)/layout.tsx` for page transitions:** Layouts do not re-render on navigation — AnimatePresence will never see child changes. Use `template.tsx` instead.
- **Using `usePathname` as motion.div key:** Triggers on every navigation including hash changes and query string updates. Not needed with `template.tsx` approach.
- **Using FrozenRouter / LayoutRouterContext hacks:** Accesses `next/dist/shared/lib/app-router-context.shared-runtime` — a private API subject to breakage on any Next.js patch. Avoid for a project that needs to stay maintained.
- **Animating `height`, `width`, `top`, `left`, `padding`:** These trigger layout recalculation. Always prefer `transform: translateY()` (`y` prop) and `opacity`. `clipPath` is compositor-friendly in modern browsers.
- **Putting `whileInView` on many deeply nested elements without `once: true`:** Performance degrades with many active IntersectionObservers. Always use `viewport={{ once: true }}`.
- **`scale` on `ProjectCard` interfering with Vimeo iframe hover:** The existing `onMouseEnter`/`onMouseLeave` on ProjectCard injects a Vimeo iframe on hover. Adding `whileHover` scale on the outer div may cause layout jank when the iframe appears. Wrap only the outer container in a subtle `scale(1.02)` at the card level, not the iframe container.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reduced motion detection | Custom media query listener + context | `MotionConfig reducedMotion="user"` | Handles SSR correctly, responds to OS changes, no React state needed |
| Stagger timing | Manual CSS animation-delay per nth-child | `staggerChildren` in variant transition | Automatically scales with any number of children |
| IntersectionObserver for scroll reveals | Custom IO hook + state | `whileInView` + `viewport={{ once: true }}` | Framer Motion manages IO lifecycle; already uses `framer-motion` |
| Viewport entry detection | `useState` + `useEffect` + IntersectionObserver (like current ProjectCard) | `whileInView` | ProjectCard already has a custom IO for lazy loading — animation IO is separate and should use whileInView |
| Animation easing functions | CSS cubic-bezier strings in multiple places | Centralize in a `transitions.ts` constants file | Single source of truth; easy to tune globally |

**Key insight:** The project already uses `framer-motion` with `LazyMotion`. Every animation primitive needed for this phase is already available. No new packages are required.

---

## Common Pitfalls

### Pitfall 1: LazyMotion Strict Mode Import Errors
**What goes wrong:** Using `import { motion } from 'framer-motion'` inside `LazyMotion strict` mode throws a runtime error: "You're using the `motion` component, but `LazyMotion` is set to `strict` mode."
**Why it happens:** `motion` pre-loads all features. `LazyMotion strict` enforces using `m` to prevent feature double-loading.
**How to avoid:** Always use `import { m } from 'framer-motion'` in any component that will be rendered inside `MotionProvider`.
**Warning signs:** Runtime error in development console mentioning strict mode.

### Pitfall 2: App Router AnimatePresence Exit Animations
**What goes wrong:** Wrapping `{children}` in `(public)/layout.tsx` with `AnimatePresence` does nothing — exit animations never fire because `layout.tsx` is not a re-rendering boundary on navigation.
**Why it happens:** Next.js App Router layouts persist across navigations; only the page slot changes. `AnimatePresence` needs to observe a component unmounting.
**How to avoid:** Use `template.tsx` (not `layout.tsx`) for transitions. Accept enter-only animations for simplicity.
**Warning signs:** No animation fires on navigation despite AnimatePresence being present.

### Pitfall 3: ProjectCard Double IntersectionObserver Conflict
**What goes wrong:** ProjectCard already uses a custom `IntersectionObserver` (the `isVisible` state for lazy-loading thumbnails). Adding `whileInView` on the same element creates two competing observers.
**Why it happens:** `whileInView` registers its own IO internally.
**How to avoid:** Keep the existing lazy-load IO in ProjectCard as-is. Wrap the ProjectCard with an `AnimatedGridItem` div **above** the ProjectCard component in PortfolioGrid — the animation wrapper is separate from the lazy-load logic inside the card.
**Warning signs:** Thumbnail never loads, or animation fires too early/late.

### Pitfall 4: clipPath Animating Between Incompatible Shapes
**What goes wrong:** Animating from `inset(...)` to `polygon(...)` produces no animation or a jarring jump.
**Why it happens:** CSS clip-path can only interpolate between shapes of the same type and same number of vertices.
**How to avoid:** Use consistent shape type throughout. For the page transition, stick to `inset(...)` for the wipe. For text reveals, stick to `polygon(...)` with matching vertex counts.
**Warning signs:** Clip-path jumps to final state rather than animating smoothly.

### Pitfall 5: will-change Memory Bloat
**What goes wrong:** Setting `will-change: transform` on every animated element via Tailwind `will-change-transform` class causes the GPU to create layers for all of them simultaneously, exhausting memory on mobile.
**Why it happens:** Developers add `will-change` proactively thinking it always helps.
**How to avoid:** Do not add `will-change` to scroll-reveal elements. Framer Motion manages layer promotion internally for active animations. Only consider `will-change` for elements that animate continuously (e.g., a persistent loader).

### Pitfall 6: Easing Strings vs Arrays
**What goes wrong:** Using a CSS named easing like `'ease-in-out'` string when Framer Motion expects either a named string it recognizes or a cubic-bezier array.
**Why it happens:** CSS easing names like `ease` and `ease-in-out` do work, but custom curves need array format.
**How to avoid:** For custom cinematic curves use array: `ease: [0.76, 0, 0.24, 1]`. Named values (`'easeOut'`, `'easeInOut'`) are Framer Motion's own vocabulary and work fine.

---

## Code Examples

### Complete template.tsx (Horizontal Wipe — Recommended)
```tsx
// Source: Next.js template.tsx convention + Framer Motion m component
// src/app/(public)/template.tsx
'use client';
import { m } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      transition={{
        duration: 0.45,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      {children}
    </m.div>
  );
}
```

### Updated MotionProvider with MotionConfig
```tsx
// Source: motion.dev/docs/react-accessibility
// src/components/providers/motion-provider.tsx
'use client';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
```

### Staggered Portfolio Grid
```tsx
// Source: motion.dev/docs staggerChildren + whileInView patterns
// In PortfolioGrid: wrap the grid div with AnimatedGrid, each ProjectCard with AnimatedGridItem

// gridContainerVariants — on the grid container
const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

// gridItemVariants — on each item; "coming into focus" effect
const gridItemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};
```

### Section Heading Reveal
```tsx
// 15-20px slide up + fade, once:true, slight viewport margin
const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

<m.h2
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
>
  {heading}
</m.h2>
```

### CTA Button Hover
```tsx
// scale(1.03) + brightness lift — no opacity hack needed
<m.a
  href={href}
  whileHover={{ scale: 1.03, filter: 'brightness(1.12)' }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.18, ease: 'easeOut' }}
  className="..."
>
  {children}
</m.a>
```

### Shared Transition Constants (Recommended)
```ts
// src/lib/animation-config.ts — centralize timing for global tuning
export const EASING_CINEMATIC = [0.76, 0, 0.24, 1] as const;  // sharp ease-out
export const EASING_SMOOTH = [0.25, 0.1, 0.25, 1] as const;   // gentle ease-out

export const DURATION = {
  fast: 0.2,
  medium: 0.45,
  cinematic: 0.55,
} as const;

export const STAGGER_GRID = 0.12;   // 120ms between grid items
export const STAGGER_DELAY = 0.05;  // 50ms initial delay before stagger starts
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` npm package | `motion` npm package (same API) | 2025 | `framer-motion` still works as a compatibility shim — no immediate migration required |
| `motion` import | `m` import inside `LazyMotion strict` | Existing project pattern | Must use `m` — already enforced by current `strict` config |
| `staggerChildren` number | `stagger()` utility for complex patterns | Stable | Both valid; `staggerChildren` is simpler for uniform delays |
| IntersectionObserver polyfill fallback | Removed in v10 | v10 | All target browsers support IO natively — no impact |
| _app.js AnimatePresence (Pages Router) | template.tsx (App Router) | Next.js 13+ | Must use template.tsx for per-route animations |

**Deprecated/outdated:**
- `AnimatePresence` in `layout.tsx`: Does not work for route transitions in App Router — use `template.tsx`
- FrozenRouter + `next/dist/...` internal imports: Fragile private API, avoid

---

## Open Questions

1. **clip-path direction for page transition**
   - What we know: Horizontal wipe (`inset(0 100% 0 0)` → `inset(0 0% 0 0)`) is clean and readable
   - What's unclear: Exact art direction preference (left-to-right wipe vs vertical vs diagonal) — this is Claude's discretion per CONTEXT.md
   - Recommendation: Default to horizontal left-to-right wipe; it reads as "turning the page" which suits a portfolio site

2. **ProjectCard scale interaction with Vimeo iframe hover**
   - What we know: ProjectCard uses `onMouseEnter` to inject a Vimeo iframe. Adding outer `scale(1.02)` `whileHover` could cause visual glitch when iframe appears mid-scale.
   - What's unclear: Whether scale + iframe injection causes layout reflow or GPU layer conflict
   - Recommendation: Apply `whileHover` scale only on the `ProjectCard`'s outer wrapper (`AnimatedGridItem`), not on the card's internal `Link` or `div`. Test on actual device. Alternative: skip card hover scale if it conflicts; the thumbnail/iframe transition already provides hover feedback.

3. **framer-motion import vs motion/react import**
   - What we know: Project uses `framer-motion` package. Both `import { m } from 'framer-motion'` and `import { m } from 'motion/react'` work — no breaking change in v12.
   - What's unclear: Whether to migrate imports to `motion/react` now or later
   - Recommendation: Keep `framer-motion` imports throughout Phase 4. Do not mix packages. Migrate to `motion/react` as a separate task if desired.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or test files found in project |
| Config file | None — Wave 0 gap |
| Quick run command | N/A until framework installed |
| Full suite command | N/A until framework installed |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ANIM-01 | Page transition clip-path wipe renders on route change | manual-only | Visual inspection — CSS animation state not easily unit-testable | ❌ Wave 0 |
| ANIM-02 | whileInView reveals fire on scroll into viewport | manual-only | Requires browser scroll simulation; Playwright/Cypress would work but not in scope | ❌ Wave 0 |
| ANIM-03 | Grid items stagger on enter | manual-only | Same as ANIM-02 | ❌ Wave 0 |
| ANIM-04 | Hover scale fires on whileHover | manual-only | Requires pointer event simulation in browser | ❌ Wave 0 |
| ANIM-05 | Reduced motion disables transforms | unit (smoke) | `npm run build` passing + manual with OS reduced motion setting | ❌ Wave 0 |

**Note:** All ANIM requirements are visual/interaction requirements best validated by manual browser testing. The appropriate test strategy is:
1. Build succeeds (`npm run build`) — catches TypeScript errors in animation wrappers
2. Dev server visual inspection per requirement
3. Reduced motion: test by enabling "Reduce motion" in OS accessibility settings and verifying elements appear without transform animation

### Sampling Rate
- **Per task:** `npm run build` (TypeScript compilation catches import errors)
- **Per wave:** Visual review in browser — scroll reveals, hover, page transitions
- **Phase gate:** Manual verification of all 5 ANIM requirements before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] No automated test framework exists — `npm run build` is the primary CI signal
- [ ] `src/lib/animation-config.ts` — shared constants file (no framework needed; just a TypeScript module)

---

## Sources

### Primary (HIGH confidence)
- `motion.dev/docs/react-accessibility` — MotionConfig reducedMotion="user" and useReducedMotion API
- `motion.dev/docs/react-reduce-bundle-size` — LazyMotion strict, m component vs motion component
- `motion.dev/docs/performance` — GPU-accelerated properties, will-change guidance, composite vs layout
- `motion.dev/motion/stagger/` — stagger() API and staggerChildren in variants

### Secondary (MEDIUM confidence)
- `imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router` — FrozenRouter pattern for App Router (documented approach, but not recommended for this project due to private API access)
- `medium.com/@jurouhlar` (clip-path text reveal) — polygon clip-path + whileInView + viewport once:true pattern, verified against Motion docs
- `dev.to/abdur_rakibrony_97cea0e9` (template.tsx) — enter-only template.tsx pattern, corroborated by multiple sources

### Tertiary (LOW confidence — flagged)
- Various community blog posts on FrozenRouter / LayoutRouterContext: The approach works but accesses Next.js private internals. Marked LOW because fragility increases on Next.js upgrades. Not recommended for this project.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — framer-motion v12 API verified against official motion.dev docs
- Architecture (template.tsx): MEDIUM — Enter-only approach is well-documented; FrozenRouter alternative is known-fragile and avoided; no official Next.js support for full exit+enter page transitions yet
- Scroll reveals / stagger: HIGH — whileInView, viewport, staggerChildren all verified against official docs
- Reduced motion: HIGH — MotionConfig reducedMotion="user" is the official recommended API
- Performance: HIGH — GPU-accelerated property list verified against motion.dev performance guide

**Research date:** 2026-03-30
**Valid until:** 2026-06-30 (Framer Motion API is stable; Next.js App Router page transition support could improve any release)
