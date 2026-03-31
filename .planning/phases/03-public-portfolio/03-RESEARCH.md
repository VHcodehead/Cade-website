# Phase 3: Public Portfolio - Research

**Researched:** 2026-03-30
**Domain:** Vimeo oEmbed, Server Actions, CSS Grid, Next.js SEO, Contact Form
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero Section**
- Full-viewport height (100vh) hero with muted autoplay video (Vimeo embed or MP4 if available)
- Minimal overlay: VLACOVISION logo text top-left, sound toggle bottom-right
- Subtle gradient at bottom fading to black for smooth transition into content
- No tagline or CTA in the hero — let the video speak
- Subtle animated scroll indicator (chevron) at bottom center
- First CTA ("Start a Project") appears immediately after hero section

**Portfolio Grid**
- 2-column editorial grid on desktop, single column on mobile
- Variable aspect ratios — some projects get a larger "featured" card spanning both columns for visual rhythm
- Info overlay on hover: project title + client name fade in over the video
- Below each card: small text with project title and one-line description
- No infinite scroll — show all published projects in a curated grid
- Click opens project detail page

**Hover-to-Play Video (UPDATED — no MP4 clips available)**
- Default state: Vimeo thumbnail image (fetched via Vimeo oEmbed API)
- On hover (desktop): load lightweight Vimeo player iframe (muted, autoplay, no controls, loop)
- Pre-connect to Vimeo CDN on page load for faster iframe loading
- On mobile: tap opens project detail page directly (no hover state on touch devices)
- Future upgrade path: admin panel has previewClipUrl field ready for MP4 clips when available

**Project Detail Pages**
- Full-width Vimeo embed at top (facade pattern — poster image, click to load iframe for performance)
- Project metadata: Client, Services, Year (displayed as sidebar or inline)
- Project description below video
- "Next Project" / "Previous Project" navigation at bottom
- Back to portfolio link
- CTA at bottom: "Like what you see? Let's talk." → links to contact form

**Brand Logo Section**
- Horizontal strip below hero / above portfolio grid
- "Trusted by" label in small uppercase
- Logos grayscale by default, full color on hover (subtle polish)
- Auto-scrolling marquee if many logos, static grid if fewer

**Contact Form & CTAs**
- CTAs placed at: after hero section, after brand logos, at bottom of every project detail page, in footer
- CTA text: "Start a Project" (primary, accent-colored) and "Get in Touch" (secondary)
- Contact form fields: name, email, company (optional), message
- Full-width section with dark background, accent-colored (#FF4400) submit button
- Success state: "Thanks! We'll be in touch." inline message (no page redirect)
- Form submissions stored in database (ContactSubmission model)

**About Section**
- Clean, typographic section — large headline "CREATIVE VISION"
- 2-3 sentences about VLACOVISION (from existing site copy)
- No team photos — keep it editorial and text-driven
- Content pulled from SiteConfig database model (editable in Phase 5 admin)

**Navigation**
- Fixed header — transparent over hero, solid dark (#0A0A0A) on scroll
- Links: Work, About, Contact
- VLACOVISION logo on the left
- Smooth scroll to sections for same-page links

**Footer**
- Three columns: VLACOVISION (location), Contact (email), Follow (Instagram, Vimeo)
- Copyright line at bottom
- One more CTA in footer: "Start a Project" link
- Dark background consistent with site aesthetic

**SEO**
- Unique meta title, description, OG tags per page via Next.js generateMetadata
- Project detail pages get project-specific metadata
- Semantic HTML with proper heading hierarchy (h1 → h2 → h3)
- Image optimization via Next.js Image component for logos and thumbnails

**Responsive Design**
- Mobile-first responsive approach
- Single column grid on mobile, 2-column on desktop
- Hero video works on mobile with muted autoplay (playsInline)
- Touch devices: tap opens project page (no hover preview)
- Contact form fully usable on mobile

### Claude's Discretion
- Exact grid gap and padding values (within 8px grid system)
- Vimeo thumbnail fetching strategy (oEmbed API vs vumbnail.com fallback)
- Exact animation timing for hover effects (Phase 4 adds Framer Motion polish)
- How to handle projects without a Vimeo ID (show placeholder?)
- Smooth scroll implementation details
- Exact marquee vs static grid threshold for brand logos

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PORT-01 | Full-bleed hero video section with muted autoplay MP4/WebM loop | Vimeo `background=1` iframe param enables muted+autoplay+loop; hero uses SiteConfig.heroVimeoId already seeded |
| PORT-02 | Hero video has elegant sound toggle (mute/unmute) | Vimeo Player.js SDK exposes `.setVolume()` and `.getMuted()` / `.setMuted()` for programmatic control |
| PORT-03 | Portfolio grid displaying projects with thumbnail/poster images | Vimeo oEmbed `thumbnail_url` via `https://vimeo.com/api/oembed.json?url=...`; no auth needed for public videos |
| PORT-04 | Hover-to-play on grid items using Vimeo iframe (no MP4 — updated) | On hover: inject `<iframe src="player.vimeo.com/video/ID?autoplay=1&muted=1&loop=1&controls=0&background=1">`; replace thumbnail |
| PORT-05 | Mobile touch fallback for hover-to-play (poster + tap to open project) | CSS `@media (hover: none)` disables hover state; tap routes to `/projects/[slug]` |
| PORT-06 | Project detail page with full Vimeo embed, title, client, services, year, description | Facade pattern: poster image → click → iframe swap; all data from Prisma Project model |
| PORT-07 | Brand trust logo section (Nike, Disney, Lululemon, Chase, etc.) | 19 logos confirmed in `/public/assets/`; CSS marquee animation or static grid |
| PORT-08 | About section with company description | SiteConfig.aboutText already seeded; Server Component reads from DB |
| PORT-09 | All 22 existing projects migrated with real Vimeo IDs into database | Already complete — seed.ts has all 22 projects with real Vimeo IDs |
| PORT-10 | Lazy/progressive loading for video grid items (IntersectionObserver) | Native `useRef` + `IntersectionObserver` hook in client grid card component |
| LEAD-01 | Contact form on public site (name, email, company, message) | Server Action with `useActionState` hook; Zod v4 already installed in project |
| LEAD-02 | Form submissions stored in database | `db.contactSubmission.create()` — ContactSubmission model already in schema |
| LEAD-03 | Multiple CTA buttons throughout site driving to contact form | Anchor links to `#contact` section; 4 CTA placement points defined |
| LEAD-04 | Contact form has client-side validation and success/error feedback | `useActionState` returns state; inline "Thanks!" message on success; field errors from Zod |
| SEO-01 | Unique meta title, description, and OG tags per page | `generateMetadata` in each page.tsx; params are `Promise<{slug: string}>` in Next.js 16 |
| SEO-02 | Proper heading hierarchy and semantic HTML | Enforce h1 on page, h2 on sections, h3 on cards; `<main>`, `<nav>`, `<footer>`, `<section>` |
| SEO-03 | Fast initial load (< 3s LCP) via SSR and lazy loading | Server Components by default; Vimeo thumbnails via next/image; facade pattern defers iframe load |
| SEO-04 | Image optimization via Next.js Image component | Add `i.vimeocdn.com` and `vumbnail.com` to `remotePatterns` in next.config.ts |
| RESP-01 | Fully responsive layout across mobile, tablet, and desktop | Tailwind `sm:` breakpoints; `grid-cols-1 sm:grid-cols-2`; fluid hero |
| RESP-02 | Video previews degrade gracefully on mobile (poster + tap to play) | `@media (hover: none)` CSS; touch event routes to project page |
</phase_requirements>

---

## Summary

Phase 3 builds the complete public-facing site on top of the foundation from Phases 1-2. The project is in excellent shape entering this phase: all 22 projects are seeded with real Vimeo IDs, the ContactSubmission model is in the schema, brand logos are in `/public/assets/`, and the dark design system is fully defined in `globals.css`. The three most technically nuanced areas are: (1) the Vimeo oEmbed thumbnail fetch strategy and the hover-to-play iframe injection pattern, (2) the Server Action contact form using `useActionState` with Zod v4, and (3) CSS Grid with variable-span featured cards.

The Vimeo integration relies entirely on publicly-available, unauthenticated APIs. Thumbnails come from `https://vimeo.com/api/oembed.json?url=https://vimeo.com/{ID}` (no API key required for public videos). The hover-to-play card injects a `background=1` Vimeo iframe on `mouseenter` (replaces the thumbnail image), which gives muted+autoplay+loop+no-controls in one parameter. The project detail page uses a "facade" pattern: show Vimeo thumbnail as a poster image with a play icon overlay; on click, replace with the actual iframe. This defers all Vimeo iframe loading until interaction, which is critical for the < 3s LCP target on a grid of 22 projects.

The contact form uses React's `useActionState` hook (the 2025 standard; `useFormState` is deprecated) wired to a `'use server'` action. Zod v4 is already installed. The action validates fields, calls `db.contactSubmission.create()`, and returns success/error state to the client component for inline display. No page redirect — success state renders inline per the locked decision.

**Primary recommendation:** Build in this order: (1) Next.js image remotePatterns for Vimeo, (2) Vimeo oEmbed utility function, (3) layout shell with nav + footer, (4) homepage sections top-to-bottom, (5) project detail page, (6) contact form action + component. Phase 4 adds Framer Motion animations on top of this structural foundation.

---

## Standard Stack

### Core (already installed — no new packages required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | ^16.2.1 | generateMetadata, Server Actions, next/image | Already installed |
| react | ^19.0.0 | useActionState hook for forms | Already installed |
| zod | ^4.3.6 | Contact form validation schema | Already installed |
| tailwindcss | ^4 | Responsive grid, design tokens | Already installed |
| framer-motion | ^12.38.0 | MotionProvider already in layout (Phase 4 uses it) | Already installed |
| @prisma/client | ^7.6.0 | ContactSubmission.create(), Project queries | Already installed |

### Supporting (no new installs needed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @prisma/adapter-pg | ^7.6.0 | DB connection via db.ts | Already in db.ts |
| jose | ^6.2.2 | Session (Phase 2, no changes needed) | Proxy already handles |

### No New Dependencies

This phase requires **zero new npm packages**. All required libraries are already installed:
- Zod v4 for form validation
- Framer Motion 12 for any lightweight transitions (Phase 4 will add polished animations)
- Next.js built-in: `next/image` for thumbnails, `generateMetadata` for SEO

The Vimeo integration is purely iframe-based (no SDK needed for basic embed). If programmatic player control is needed for the sound toggle, `@vimeo/player` can be added, but the sound toggle on the hero can also be built using the Vimeo postMessage API without an SDK.

**Optional add if sound toggle requires programmatic control:**
```bash
npm install @vimeo/player
```

---

## Architecture Patterns

### Recommended Project Structure for Phase 3

```
src/
├── app/
│   ├── (public)/              # Public route group
│   │   ├── layout.tsx         # Public layout: nav + footer
│   │   ├── page.tsx           # Homepage: hero + logos + grid + about + contact
│   │   └── projects/
│   │       └── [slug]/
│   │           └── page.tsx   # Project detail page
│   ├── actions/
│   │   ├── auth.ts            # Phase 2 — already exists
│   │   └── contact.ts         # NEW: submitContact Server Action
│   └── (admin)/               # Phase 2 — already exists
├── components/
│   ├── providers/
│   │   └── motion-provider.tsx  # Already exists
│   ├── layout/
│   │   ├── nav.tsx            # Fixed header, transparent-to-solid on scroll
│   │   └── footer.tsx         # Three-column footer
│   ├── sections/
│   │   ├── hero.tsx           # Vimeo background iframe + sound toggle
│   │   ├── brand-logos.tsx    # Marquee or static grid
│   │   ├── portfolio-grid.tsx # 2-column CSS grid, featured cards
│   │   ├── about.tsx          # SiteConfig.aboutText
│   │   └── contact-form.tsx   # useActionState form
│   ├── portfolio/
│   │   ├── project-card.tsx   # Thumbnail + hover-to-play (Client Component)
│   │   └── video-facade.tsx   # Facade pattern: poster → click → iframe
│   └── ui/
│       └── cta-button.tsx     # Reusable CTA: "Start a Project" / "Get in Touch"
└── lib/
    ├── db.ts                  # Already exists
    ├── vimeo.ts               # NEW: getVimeoThumbnail(vimeoId) utility
    └── session.ts             # Phase 2 — already exists
```

### Pattern 1: Vimeo oEmbed Thumbnail Fetch (Server-Side, Cached)

**What:** Fetch Vimeo thumbnail URL server-side during page render. Cache aggressively — thumbnails don't change.
**When to use:** Portfolio grid (fetching 22 thumbnails at once), project detail page poster.
**Source:** `https://vimeo.com/api/oembed.json?url=...` — unauthenticated, no API key required for public videos.

```typescript
// src/lib/vimeo.ts
// Source: https://developer.vimeo.com/api/oembed

export interface VimeoOembedData {
  thumbnail_url: string;        // e.g. https://i.vimeocdn.com/video/123456_640.jpg
  thumbnail_width: number;      // default: 640
  thumbnail_height: number;     // default: 360
  title: string;
  duration: number;
}

export async function getVimeoThumbnail(vimeoId: string): Promise<string | null> {
  if (!vimeoId) return null;

  try {
    const url = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=1280`;
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours — thumbnails rarely change
    });

    if (!res.ok) return null;

    const data: VimeoOembedData = await res.json();
    return data.thumbnail_url ?? null;
  } catch {
    return null;
  }
}

// Fetch thumbnails for all projects in one pass (used by homepage grid)
export async function getProjectThumbnails(
  projects: Array<{ slug: string; vimeoId: string }>
): Promise<Record<string, string | null>> {
  const entries = await Promise.all(
    projects.map(async (p) => [p.slug, await getVimeoThumbnail(p.vimeoId)])
  );
  return Object.fromEntries(entries);
}
```

**Thumbnail URL manipulation:** The oEmbed `thumbnail_url` is typically `https://i.vimeocdn.com/video/{hash}_640.webp`. You can request larger sizes by changing the width param on the oEmbed request (`?width=1280`). The CDN URL itself can also be modified — replace `_640` with `_1280` for a larger version.

**Fallback strategy (Claude's Discretion):** If oEmbed fails (private video, rate limit), use `https://vumbnail.com/{vimeoId}.jpg` as a fallback. This is a third-party CDN that proxies Vimeo thumbnails without authentication. Confidence: MEDIUM (community-used, not official).

### Pattern 2: Vimeo iframe Embed Parameters

**What:** Vimeo player URL parameters control playback behavior without JavaScript.
**Source:** https://help.vimeo.com/hc/en-us/articles/12426260232977-About-Player-Parameters (verified 2026-03-30)

| Use Case | URL | Key Parameters |
|----------|-----|----------------|
| Hero background | `player.vimeo.com/video/{ID}?background=1` | Enables: muted + autoplay + loop + no controls |
| Hover-to-play card | `player.vimeo.com/video/{ID}?autoplay=1&muted=1&loop=1&controls=0&background=1` | Same as background mode |
| Project detail (user-controlled) | `player.vimeo.com/video/{ID}?title=0&byline=0&portrait=0&dnt=1` | Clean player, no Vimeo branding, no tracking |
| Sound toggle (hero) | `background=0` + JS volume control OR use `@vimeo/player` SDK | Programmatic volume toggle |

```tsx
// Hero iframe (background mode — muted autoplay loop, no controls)
<iframe
  src={`https://player.vimeo.com/video/${heroVimeoId}?background=1&quality=auto`}
  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
  allow="autoplay; fullscreen"
  title="VLACOVISION Showreel"
/>

// Hover-to-play card iframe (injected on hover, removed on leave)
<iframe
  src={`https://player.vimeo.com/video/${vimeoId}?background=1&quality=360p`}
  className="absolute inset-0 w-full h-full"
  allow="autoplay"
  title={`${title} preview`}
/>
```

### Pattern 3: Project Card — Hover-to-Play (Client Component)

**What:** Shows Vimeo thumbnail by default. On `mouseenter`, replaces with Vimeo `background=1` iframe. On `mouseleave`, removes iframe and restores thumbnail. On mobile (`hover: none`), entire card is a link to the project page.
**When to use:** Each card in the portfolio grid.

```tsx
// src/components/portfolio/project-card.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';

interface ProjectCardProps {
  slug: string;
  title: string;
  client: string;
  vimeoId: string;
  thumbnailUrl: string | null;
  isFeatured?: boolean;
}

export function ProjectCard({
  slug, title, client, vimeoId, thumbnailUrl, isFeatured = false
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <Link
      href={`/projects/${slug}`}
      className={`group relative block overflow-hidden bg-bg-card ${
        isFeatured ? 'col-span-2' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Aspect ratio container — 16:9 standard, featured may vary */}
      <div className="relative aspect-video">

        {/* Thumbnail (default state) */}
        {thumbnailUrl && !isHovered && (
          <Image
            src={thumbnailUrl}
            alt={`${title} — ${client}`}
            fill
            className="object-cover"
            sizes={isFeatured ? '100vw' : '50vw'}
          />
        )}

        {/* Vimeo iframe (hover state — desktop only via CSS) */}
        {isHovered && vimeoId && (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?background=1&quality=360p`}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay"
            title={`${title} preview`}
          />
        )}

        {/* Hover overlay: title + client fade in */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-text-primary font-heading text-lg uppercase tracking-widest">{title}</p>
          <p className="text-text-muted text-sm uppercase tracking-wider">{client}</p>
        </div>
      </div>

      {/* Below-card text */}
      <div className="p-3">
        <p className="text-text-primary text-sm font-semibold">{title}</p>
      </div>
    </Link>
  );
}
```

**Mobile note:** The `onMouseEnter`/`onMouseLeave` events do not fire on touch devices. The entire card is a `<Link>` so tap naturally navigates to the project page — no extra mobile handling needed in the component. The Vimeo iframe is simply never injected on touch devices.

### Pattern 4: Video Facade for Project Detail (Poster → Click → Iframe)

**What:** Show the Vimeo thumbnail as a styled poster with a play icon overlay. On click, replace with the full Vimeo embed iframe. Defers all Vimeo loading until user intent.
**Why:** Critical for LCP — loading 1 iframe on click is fast; loading it on page render blocks LCP.

```tsx
// src/components/portfolio/video-facade.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface VideoFacadeProps {
  vimeoId: string;
  thumbnailUrl: string | null;
  title: string;
}

export function VideoFacade({ vimeoId, thumbnailUrl, title }: VideoFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsPlaying(true)}
      className="relative w-full aspect-video bg-black group cursor-pointer block"
      aria-label={`Play ${title}`}
    >
      {thumbnailUrl && (
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover group-hover:opacity-90 transition-opacity"
          priority  // This is the hero image on the page — prioritize
          sizes="100vw"
        />
      )}
      {/* Play icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-accent transition-colors">
          <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
```

### Pattern 5: CSS Grid with Featured Card Spanning

**What:** 2-column editorial grid where some cards span both columns. `grid-auto-flow: dense` fills gaps.
**When to use:** Homepage portfolio grid.

```tsx
// src/components/sections/portfolio-grid.tsx
// Featured logic: every 5th project (sortOrder % 5 === 0) spans 2 columns

export function PortfolioGrid({ projects }) {
  return (
    <section id="work" className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-bg-section auto-rows-auto">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.slug}
          {...project}
          thumbnailUrl={thumbnailUrls[project.slug]}
          isFeatured={i % 5 === 0}  // Every 5th item is featured (spans 2 cols)
        />
      ))}
    </section>
  );
}
```

CSS for featured card spanning (in globals.css or Tailwind):
```css
/* In globals.css — Tailwind v4 @layer or direct style */
.col-span-2 {
  grid-column: span 2;
}
/* On mobile, featured cards revert to single column */
@media (max-width: 640px) {
  .col-span-2 {
    grid-column: span 1;
  }
}
```

**Alternative (Tailwind responsive):** Use `sm:col-span-2` on the featured card. This is the cleanest approach in Tailwind v4.

### Pattern 6: Contact Form with useActionState + Zod v4

**What:** Server Action with Zod validation. Client component uses `useActionState` to track state, show inline errors and success message.
**Source:** https://nextjs.org/docs/app/guides/forms (Next.js 16.2.1, last updated 2026-03-25)

```typescript
// src/app/actions/contact.ts
'use server'

import { z } from 'zod';
import { db } from '@/lib/db';

const ContactSchema = z.object({
  name:    z.string().min(1, 'Name is required').max(100),
  email:   z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  errors?: {
    name?: string[];
    email?: string[];
    company?: string[];
    message?: string[];
    _form?: string[];
  };
};

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = ContactSchema.safeParse({
    name:    formData.get('name'),
    email:   formData.get('email'),
    company: formData.get('company') || undefined,
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await db.contactSubmission.create({
      data: {
        name:    parsed.data.name,
        email:   parsed.data.email,
        company: parsed.data.company ?? '',
        message: parsed.data.message,
      },
    });
    return { status: 'success' };
  } catch {
    return {
      status: 'error',
      errors: { _form: ['Something went wrong. Please try again.'] },
    };
  }
}
```

```tsx
// src/components/sections/contact-form.tsx
'use client';

import { useActionState } from 'react';
import { submitContact, type ContactState } from '@/app/actions/contact';

const initialState: ContactState = { status: 'idle' };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === 'success') {
    return (
      <p className="text-accent text-xl font-heading uppercase tracking-widest">
        Thanks! We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <input name="name" placeholder="Name *" required
          className="w-full bg-bg-card border border-white/10 px-4 py-3 text-text-primary" />
        {state.errors?.name && (
          <p className="text-accent text-sm mt-1">{state.errors.name[0]}</p>
        )}
      </div>
      <div>
        <input name="email" type="email" placeholder="Email *" required
          className="w-full bg-bg-card border border-white/10 px-4 py-3 text-text-primary" />
        {state.errors?.email && (
          <p className="text-accent text-sm mt-1">{state.errors.email[0]}</p>
        )}
      </div>
      <input name="company" placeholder="Company (optional)"
        className="w-full bg-bg-card border border-white/10 px-4 py-3 text-text-primary" />
      <div>
        <textarea name="message" placeholder="Message *" rows={5} required
          className="w-full bg-bg-card border border-white/10 px-4 py-3 text-text-primary resize-none" />
        {state.errors?.message && (
          <p className="text-accent text-sm mt-1">{state.errors.message[0]}</p>
        )}
      </div>
      {state.errors?._form && (
        <p className="text-accent text-sm">{state.errors._form[0]}</p>
      )}
      <button
        type="submit" disabled={pending}
        className="px-8 py-4 bg-accent text-white font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {pending ? 'Sending...' : 'Start a Project'}
      </button>
    </form>
  );
}
```

### Pattern 7: generateMetadata for Dynamic Project Pages

**What:** Server-side metadata per project page. `params` is a `Promise` in Next.js 16 — must be awaited.
**Source:** https://nextjs.org/docs/app/api-reference/functions/generate-metadata (Next.js 16.2.1, verified 2026-03-30)

```tsx
// src/app/(public)/projects/[slug]/page.tsx
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { getVimeoThumbnail } from '@/lib/vimeo';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;  // CRITICAL: params is a Promise in Next.js 16

  const project = await db.project.findUnique({
    where: { slug, published: true },
    select: { title: true, client: true, description: true, vimeoId: true },
  });

  if (!project) return { title: 'Project Not Found' };

  const thumbnail = await getVimeoThumbnail(project.vimeoId);

  return {
    title: `${project.title} — ${project.client} | VLACOVISION`,
    description: project.description || `${project.title} by VLACOVISION for ${project.client}`,
    openGraph: {
      title: `${project.title} — ${project.client}`,
      description: project.description,
      images: thumbnail ? [{ url: thumbnail, width: 1280, height: 720 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      images: thumbnail ? [thumbnail] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await db.project.findUnique({
    where: { slug, published: true },
  });
  if (!project) notFound();
  // ... render
}
```

**Root layout title template** (add to `src/app/layout.tsx`):
```tsx
export const metadata: Metadata = {
  title: {
    template: '%s | VLACOVISION',
    default: 'VLACOVISION — Video Production',
  },
  description: 'Premium video production for brands that move people. Bay Area and worldwide.',
  metadataBase: new URL('https://vlacovision.com'),
};
```

### Pattern 8: Next.js Image remotePatterns for Vimeo

**What:** Add Vimeo CDN and fallback to `next.config.ts` so `next/image` can optimize thumbnails.
**Source:** https://nextjs.org/docs/app/api-reference/components/image

```typescript
// next.config.ts (add to existing config)
const nextConfig: NextConfig = {
  // ... existing turbopack, redirects ...
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vumbnail.com',  // fallback thumbnail CDN
        pathname: '/**',
      },
    ],
  },
};
```

### Pattern 9: CSS Marquee Animation (Brand Logos)

**What:** Infinite horizontal scroll for the 19 brand logos. Pure CSS + Tailwind v4.
**When to use:** 19 logos confirmed — use marquee (more than ~8 logos).

```css
/* In globals.css — add to @layer or as plain CSS after @theme */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 40s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
```

```tsx
// src/components/sections/brand-logos.tsx
// Duplicate the logo list to create seamless loop

export function BrandLogos({ logos }) {
  const doubledLogos = [...logos, ...logos];

  return (
    <section className="py-12 overflow-hidden border-y border-white/10">
      <p className="text-center text-xs uppercase tracking-widest text-text-muted mb-8">
        Trusted By
      </p>
      <div className="flex">
        <div
          className="flex gap-16 items-center animate-marquee"
          style={{ width: 'max-content' }}
        >
          {doubledLogos.map((logo, i) => (
            <img
              key={i}
              src={`/assets/${logo.filename}`}
              alt={logo.name}
              className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Note on logo images:** Brand logos in `/public/assets/` are PNG files with varying backgrounds. Use `grayscale` CSS filter for uniformity. The `filter: grayscale(1)` + `hover:grayscale(0)` is handled by Tailwind's `grayscale` and `hover:grayscale-0` classes.

### Pattern 10: Fixed Nav (Transparent to Solid on Scroll)

**What:** Nav starts transparent over hero, switches to solid `#0A0A0A` on scroll. Implemented with `scroll` event listener or `IntersectionObserver` on the hero section.

```tsx
// src/components/layout/nav.tsx
'use client';
import { useEffect, useState } from 'react';

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      isScrolled ? 'bg-bg-base' : 'bg-transparent'
    }`}>
      {/* ... nav content */}
    </header>
  );
}
```

### Pattern 11: IntersectionObserver for Grid Lazy Loading (PORT-10)

**What:** Defer Vimeo thumbnail network requests until card enters viewport. Particularly useful if all 22 thumbnails would otherwise fetch simultaneously.
**Implementation choice:** Use a `useInView` hook or native `IntersectionObserver` in each `ProjectCard`. Since thumbnails are fetched server-side via `getVimeoThumbnail`, this primarily prevents *rendering* off-screen iframes.

```tsx
// In ProjectCard — only mount Vimeo iframe when card is visible
import { useEffect, useRef, useState } from 'react';

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { rootMargin: '200px', ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}
```

### Anti-Patterns to Avoid

- **Loading all 22 Vimeo iframes on page load:** Each Vimeo iframe triggers 3-5 network requests. 22 iframes = ~100 requests. Always use thumbnails + hover-to-play.
- **Fetching oEmbed client-side:** oEmbed requests from the browser expose your page to CORS issues and add round trips. Fetch server-side in Server Components.
- **`useFormState` instead of `useActionState`:** `useFormState` is deprecated in React 19. Use `useActionState` from `react` (not `react-dom`).
- **Passing unsanitized `vimeoId` to iframe src:** Validate that `vimeoId` is numeric before embedding. Prisma data should be trusted, but add a `parseInt` check.
- **Hero iframe without `allow="autoplay"`:** Browsers block autoplay iframes without this attribute.
- **Missing `params` await in Next.js 16:** `params` in dynamic routes is now a `Promise`. Forgetting `await params` causes a TypeScript error and a runtime crash.
- **Static metadata object on dynamic routes:** Using `export const metadata = {...}` on `[slug]/page.tsx` gives the same metadata for all projects. Always use `generateMetadata` for dynamic routes.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | `<img>` with manual sizes | `next/image` | AVIF/WebP conversion, lazy loading built in, Core Web Vitals |
| Form pending state | Manual `isLoading` state | `useActionState` pending boolean | Built into React 19; zero boilerplate |
| Form validation | Custom regex validators | Zod v4 `safeParse` | Type-safe, error messages, already installed |
| Video aspect ratio | Padding-bottom hack | `aspect-video` Tailwind class | Native CSS `aspect-ratio: 16/9` |
| Scroll detection | `getBoundingClientRect` polling | `IntersectionObserver` | Browser-native, no polling, passive |
| Thumbnail URL | Manual Vimeo API OAuth | oEmbed endpoint | No auth required, returns `thumbnail_url` directly |
| Sound toggle | Postmessage iframe hacking | `@vimeo/player` SDK | Clean API: `.setMuted(false)` |

**Key insight:** The entire Vimeo integration for this phase requires no API key and no SDK install. The oEmbed endpoint + `background=1` player parameter handle thumbnails and background playback entirely.

---

## Common Pitfalls

### Pitfall 1: Vimeo oEmbed Rate Limiting Without Caching

**What goes wrong:** `getVimeoThumbnail` is called on every page render without caching. With 22 projects, the homepage hits Vimeo's oEmbed endpoint 22 times per request. Under load, Vimeo throttles unauthenticated oEmbed requests.

**Why it happens:** Next.js `fetch` in Server Components is not automatically deduplicated across different URLs. Each `getVimeoThumbnail(vimeoId)` is a distinct fetch.

**How to avoid:** Add `next: { revalidate: 86400 }` to every oEmbed fetch (shown in Pattern 1). Alternatively, cache thumbnail URLs in the database — add a `thumbnailUrl String @default("")` field to the Project model and populate it at seed/admin time.

**Recommendation:** For Phase 3, use `revalidate: 86400`. For Phase 5 (admin), store `thumbnailUrl` in the DB to eliminate the runtime fetch entirely.

### Pitfall 2: `params` is a Promise in Next.js 16

**What goes wrong:** Code accesses `params.slug` directly instead of `await params` first. Results in a TypeScript error and runtime crash.

**Why it happens:** Next.js 16 made all dynamic route parameters async. This is a breaking change from Next.js 14/15.

**How to avoid:** Always pattern:
```tsx
// Next.js 16 — params MUST be awaited
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

**Warning signs:** TypeScript error: "Property 'slug' does not exist on type 'Promise<{ slug: string }>'".

### Pitfall 3: Vimeo Autoplay Blocked in Hero on Mobile

**What goes wrong:** The hero Vimeo `background=1` iframe doesn't autoplay on mobile (iOS/Android). The hero shows a black rectangle.

**Why it happens:** iOS Safari requires `muted + playsInline` for autoplay. For iframes, the `allow="autoplay"` attribute is required AND the video must be muted. `background=1` should handle this, but browser behavior varies.

**How to avoid:** Ensure the iframe has `allow="autoplay"`. On mobile, degrade gracefully: show a fallback static image (the Vimeo thumbnail) as the hero background instead of the iframe. Detect via `@media (max-width: 768px)` or via User Agent on the server.

**Practical approach:** Render the hero iframe only on desktop; show the thumbnail image as the mobile hero background.

### Pitfall 4: Missing `remotePatterns` for Vimeo Thumbnails

**What goes wrong:** `next/image` throws "hostname 'i.vimeocdn.com' is not configured under images.remotePatterns" error in build or runtime.

**Why it happens:** Next.js requires explicit allowlisting of external image hostnames for security.

**How to avoid:** Add `i.vimeocdn.com` to `remotePatterns` in `next.config.ts` before writing any component that uses `<Image src={thumbnailUrl} />`. This must be done first — it's a build-breaking omission.

### Pitfall 5: `useActionState` Import from Wrong Package

**What goes wrong:** `import { useActionState } from 'react-dom'` causes an error because `useActionState` moved to `react` in React 19.

**Why it happens:** Old tutorials show `import { useFormState } from 'react-dom'` (deprecated). New tutorials show `useActionState` but some reference `react-dom` incorrectly.

**How to avoid:** Always import from `react`:
```typescript
import { useActionState } from 'react';  // React 19 — correct
// NOT: import { useFormState } from 'react-dom';  // deprecated
```

### Pitfall 6: Server Action Missing `'use server'` Directive

**What goes wrong:** Form submission throws "Server Actions must be async functions" or the action runs on the client instead of server.

**Why it happens:** The `'use server'` directive at the file level marks all exports as server functions. Forgetting it means the function runs client-side and database calls fail.

**How to avoid:** Always add `'use server'` as the first line of any `actions/*.ts` file. This is consistent with the existing `src/app/actions/auth.ts` pattern already in the project.

### Pitfall 7: OpenGraph Images Require Absolute URLs

**What goes wrong:** `openGraph.images` with a relative path (e.g., `/og.png`) breaks social sharing previews. Facebook/Twitter crawlers receive an empty or broken image URL.

**Why it happens:** OG image URLs must be absolute for crawlers that don't share your domain context.

**How to avoid:** Set `metadataBase` in root layout, then all relative URLs in metadata are resolved against it:
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://vlacovision.com'),
};
```
With `metadataBase` set, `openGraph.images: ['/og.png']` resolves to `https://vlacovision.com/og.png`.

### Pitfall 8: Marquee Layout Shift from Logo Sizes

**What goes wrong:** Brand logos have wildly different original dimensions. Some logos appear too large or too small in the marquee strip, creating visual imbalance.

**Why it happens:** Logos in `/public/assets/` are raw brand assets (PNG files of various sizes). Without normalization, some are 2000px wide, others 200px.

**How to avoid:** Apply consistent height constraint (`h-8` or `h-10`) and `w-auto` to all logos. Use `object-contain` if using `<img>` or set `height={32}` with `width={undefined}` if using `next/image`.

---

## Code Examples

### Vimeo oEmbed Response Shape

```json
// GET https://vimeo.com/api/oembed.json?url=https://vimeo.com/1010368544&width=1280
{
  "type": "video",
  "version": "1.0",
  "provider_name": "Vimeo",
  "title": "Aether NZ",
  "author_name": "VLACOVISION",
  "thumbnail_url": "https://i.vimeocdn.com/video/1234567890_1280.webp",
  "thumbnail_width": 1280,
  "thumbnail_height": 720,
  "duration": 120,
  "width": 1280,
  "height": 720,
  "html": "<iframe src=\"https://player.vimeo.com/video/1010368544...\">"
}
```

### Homepage Data Fetch (Server Component)

```tsx
// src/app/(public)/page.tsx
import { db } from '@/lib/db';
import { getProjectThumbnails } from '@/lib/vimeo';

export default async function HomePage() {
  // Parallel fetch: projects + site config + thumbnails
  const [projects, siteConfig] = await Promise.all([
    db.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    }),
    db.siteConfig.findUnique({ where: { id: 'singleton' } }),
  ]);

  // Thumbnails fetched server-side, cached 24h per Vimeo ID
  const thumbnails = await getProjectThumbnails(
    projects.map(p => ({ slug: p.slug, vimeoId: p.vimeoId }))
  );

  return (
    <main>
      <HeroSection heroVimeoId={siteConfig?.heroVimeoId ?? ''} />
      <BrandLogos />
      <PortfolioGrid projects={projects} thumbnailUrls={thumbnails} />
      <AboutSection text={siteConfig?.aboutText ?? ''} />
      <ContactSection />
    </main>
  );
}
```

### Pre-connect to Vimeo CDN

```tsx
// src/app/(public)/layout.tsx or in <head> via Script
// Reduces iframe load time by pre-establishing connection to Vimeo origins

import ReactDOM from 'react-dom';

// In a client component that renders early (e.g., the public layout):
'use client';
export function VimeoPreconnect() {
  ReactDOM.preconnect('https://player.vimeo.com');
  ReactDOM.preconnect('https://i.vimeocdn.com');
  ReactDOM.prefetchDNS('https://fresnel.vimeocdn.com');
  return null;
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useFormState` from `react-dom` | `useActionState` from `react` | React 19 (2024) | Old hook deprecated; must update imports |
| `params.slug` direct access | `const { slug } = await params` | Next.js 16 (Oct 2025) | Breaking change — params is now async |
| MP4 preview clips for hover | Vimeo `background=1` iframe | Project decision (no MP4s available) | Simpler, no upload infrastructure needed |
| `next/image` `domains` array | `next/image` `remotePatterns` | Next.js 13+ | `domains` deprecated; use `remotePatterns` |
| `<marquee>` HTML element | CSS `@keyframes` + `translateX` | Deprecated in HTML5 | Pure CSS, accessible, no library needed |
| Static `metadata` export on dynamic routes | `generateMetadata` async function | Next.js 13+ App Router | Required for per-page dynamic metadata |

**Deprecated/outdated:**
- `useFormState`: Still in `react-dom` but deprecated; migrated to `useActionState` in React 19
- `next/image` `domains` config: Deprecated; use `remotePatterns`
- `<marquee>` tag: HTML-deprecated; use CSS animation

---

## Open Questions

1. **Hero sound toggle implementation**
   - What we know: Vimeo `background=1` mutes the video and disables controls. To add a sound toggle, we need programmatic control.
   - What's unclear: Whether to install `@vimeo/player` SDK (~50KB) for the single toggle button, or use the postMessage API directly.
   - Recommendation: Use `@vimeo/player` SDK. It's the official, documented approach. The hero is the one place where sound control makes UX sense and is worth the dependency. Install: `npm install @vimeo/player`. The Vimeo Player.js API exposes `.setMuted(false)` / `.getMuted()`.

2. **Projects without vimeoId**
   - What we know: All 22 seeded projects have valid Vimeo IDs. But the schema allows empty `vimeoId` string.
   - What's unclear: What should a card show if `vimeoId` is empty (future admin-created projects)?
   - Recommendation: Show a gray placeholder card with the project title. Do not attempt to fetch oEmbed for an empty ID — the `getVimeoThumbnail` function already returns `null` for empty IDs.

3. **Marquee vs static grid threshold**
   - What we know: 19 logos confirmed in `/public/assets/`. Context says "auto-scrolling marquee if many logos."
   - What's unclear: The exact threshold. 19 logos fits in a static row at ~80px height each but requires significant horizontal space.
   - Recommendation: Use marquee (19 logos is sufficient to benefit from scrolling). The seamless loop technique (duplicate the list) works cleanly with CSS.

4. **Smooth scroll implementation**
   - What we know: Nav links ("Work", "About", "Contact") should smooth-scroll to sections on the homepage.
   - What's unclear: CSS `scroll-behavior: smooth` vs JavaScript-driven scroll.
   - Recommendation: Add `scroll-behavior: smooth` to `html` in `globals.css`. Zero JavaScript, no library. Phase 4 can upgrade to Lenis if needed (v2 requirements list it). Avoid adding Lenis in Phase 3.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — Wave 0 must install Jest + Testing Library |
| Config file | None — see Wave 0 gaps |
| Quick run command | `npx jest --passWithNoTests --testPathPattern=phase3` |
| Full suite command | `npx jest` |

> No test infrastructure exists in this project yet. Wave 0 of the Phase 3 plan should install Jest. However, for a UI-heavy rendering phase like this, most verification is smoke-test (build succeeds, pages render) and manual browser testing (hover states, form submission, mobile layout). Automated unit tests focus on the Server Action and the Vimeo utility function.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PORT-01 | Hero renders with Vimeo iframe | smoke | `npm run build` exits 0 | ❌ Wave 0 |
| PORT-03 | Portfolio grid renders project thumbnails | smoke | `npm run build` exits 0 | ❌ Wave 0 |
| PORT-06 | Project detail page renders for known slug | integration | `curl -s http://localhost:3000/projects/aether-nz | grep "Aether NZ"` | ❌ Wave 0 |
| PORT-09 | All 22 projects seeded | smoke | `npx prisma db seed` exits 0 | ❌ (seed exists; DB may need re-run) |
| PORT-10 | IntersectionObserver hook returns ref + isInView | unit | Jest: `render(<ProjectCard>)`, check no iframe before scroll | ❌ Wave 0 |
| LEAD-01 | Contact form renders all fields | smoke | `npm run build` exits 0 | ❌ Wave 0 |
| LEAD-02 | Form submission creates ContactSubmission record | integration | `submitContact(mockFormData)` creates DB record | ❌ Wave 0 |
| LEAD-04 | Zod validation returns field errors | unit | Jest: `submitContact` with invalid data returns errors | ❌ Wave 0 |
| SEO-01 | Project page has unique title/description meta | integration | `curl -s .../projects/aether-nz | grep "<title>Aether"` | ❌ Wave 0 |
| SEO-04 | Thumbnails served via next/image | smoke | Build output includes optimized image paths | ❌ Wave 0 |
| RESP-01 | No horizontal scroll on mobile viewport | manual | Chrome DevTools mobile emulation | N/A |
| RESP-02 | Touch devices: tap navigates, no hover iframe | manual | Physical device or emulator | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (validates compilation and metadata generation)
- **Per wave merge:** `npx jest` (Server Action unit tests) + `npm run build`
- **Phase gate:** Full build green + manual browser review of hero, grid, form submission, and mobile layout

### Wave 0 Gaps
- [ ] `jest.config.ts` — Jest + Next.js 16 + TypeScript configuration
- [ ] `jest.setup.ts` — `@testing-library/jest-dom` matchers
- [ ] `__tests__/actions/contact.test.ts` — unit tests for `submitContact` (covers LEAD-02, LEAD-04)
- [ ] `__tests__/lib/vimeo.test.ts` — unit tests for `getVimeoThumbnail` (mocked fetch, covers PORT-03)
- [ ] Framework install: `npm install --save-dev jest @jest/globals ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom`

---

## Sources

### Primary (HIGH confidence)
- [Next.js 16.2.1 generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — verified 2026-03-30, last updated 2026-03-25; async params requirement, openGraph fields, metadataBase behavior
- [Next.js 16.2.1 Forms guide](https://nextjs.org/docs/app/guides/forms) — verified 2026-03-30, last updated 2026-03-25; useActionState pattern, Zod safeParse integration, pending boolean
- [Vimeo Player Parameters](https://help.vimeo.com/hc/en-us/articles/12426260232977-About-Player-Parameters) — verified 2026-03-30; background=1 mode, muted, autoplay, loop, controls parameters
- [Next.js Image remotePatterns](https://nextjs.org/docs/app/api-reference/components/image) — hostname allowlisting pattern for i.vimeocdn.com
- Direct project file inspection — confirmed: 22 projects in seed.ts with real Vimeo IDs, ContactSubmission model in schema.prisma, 19 logo files in /public/assets/, db.ts using PrismaPg adapter pattern, Zod v4.3.6 installed

### Secondary (MEDIUM confidence)
- [Vimeo oEmbed API docs](https://developer.vimeo.com/api/oembed) — WebFetch returned JS-only content; structure confirmed via multiple secondary sources; `thumbnail_url` field, no-auth for public videos
- [WebKit blog: iOS video autoplay policies](https://webkit.org/blog/6784/new-video-policies-for-ios/) — `muted + playsInline` required for iOS autoplay; `background=1` should satisfy this
- CSS marquee animation pattern via [Ryan Mulligan](https://ryanmulligan.dev/blog/css-marquee/) + [Cruip tutorial](https://cruip.com/create-an-infinite-horizontal-scroll-animation-with-tailwind-css/) — translateX -50% with duplicated list is the established pattern

### Tertiary (LOW confidence)
- `vumbnail.com` as Vimeo thumbnail fallback CDN — community-used third-party service, no official status; use only as fallback
- `@vimeo/player` SDK for sound toggle — confirmed to exist and have `.setMuted()` API; exact React integration pattern not verified with current docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified in package.json; zero new dependencies needed
- Vimeo oEmbed API: MEDIUM — endpoint pattern well-established; exact response fields confirmed via multiple sources but official docs page returned JS-only content during WebFetch
- Vimeo player parameters: HIGH — official help article fetched and read directly
- generateMetadata / useActionState: HIGH — official Next.js 16.2.1 docs fetched and read directly
- CSS Grid featured spans: HIGH — standard CSS, well-documented
- CSS marquee: HIGH — pure CSS keyframes, multiple implementations confirmed
- IntersectionObserver: HIGH — browser-native API, no library needed

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (stable ecosystem; Vimeo API and Next.js 16.x unlikely to have breaking changes in 30 days)
