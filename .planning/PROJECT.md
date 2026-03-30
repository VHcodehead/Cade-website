# VLACOVISION Website Revamp

## What This Is

A premium portfolio website for VLACOVISION, a San Francisco Bay Area video production company. The site showcases cinematic work for clients like Nike, Disney, Lululemon, and Chase. It serves both as a creative showreel for industry peers and as a lead-generation tool for potential clients looking to hire a production house. Includes a backend admin panel so the owner can manage all content without touching code.

## Core Value

When a potential client or creative peer lands on this site, they must immediately feel the production quality through cinematic video presentation, fluid animations, and premium design — and have a frictionless path to make contact.

## Requirements

### Validated

- ✓ Portfolio video grid with hover-to-play previews — existing
- ✓ Individual project detail pages with full video + metadata — existing
- ✓ Brand trust section (Nike, Disney, Lululemon, etc.) — existing
- ✓ Featured hero video — existing
- ✓ Responsive mobile/tablet/desktop layout — existing
- ✓ Vimeo integration for full-length video hosting — existing
- ✓ About section and company description — existing
- ✓ Contact section with email — existing

### Active

- [ ] Migrate from vanilla HTML/JS to Next.js 14+ with App Router
- [ ] Implement Tailwind CSS design system with dark editorial aesthetic
- [ ] Framer Motion cinematic animations (page transitions, scroll reveals, hover effects)
- [ ] Hover-to-play using short MP4/WebM preview clips (not Vimeo iframes) for instant playback
- [ ] Full Vimeo embeds only on project detail pages for long-form content
- [ ] Backend admin panel with authentication (protected /admin route)
- [ ] Admin: Add/edit/remove portfolio projects (title, description, Vimeo URL, preview clip, client, services, year)
- [ ] Admin: Drag-and-drop project reordering
- [ ] Admin: Publish/unpublish projects (draft mode)
- [ ] Admin: Update hero/featured video
- [ ] Admin: Edit about section, company info, contact details
- [ ] Admin: Upload and manage brand logos
- [ ] Contact form with inbox visible in admin dashboard
- [ ] Multiple CTAs throughout the site driving to contact form
- [ ] Analytics dashboard in admin (page visits, video plays, popular projects)
- [ ] Database-driven content (PostgreSQL or SQLite)
- [ ] 21st.dev MCP integration for premium UI components
- [ ] UI/UX Pro Max audit pass on completed frontend

### Out of Scope

- E-commerce / payments — not a store, pure portfolio + lead gen
- Blog / news section — owner didn't request, can add in future milestone
- User accounts / client login — no need for visitor authentication
- Real-time chat — contact form is sufficient
- Mobile app — web only
- Multi-language / i18n — English only
- Video hosting migration — staying on Vimeo for long-form

## Context

**Current state:** Vanilla HTML/CSS/JS site served by Express.js. 22 projects hardcoded in HTML with Vimeo IDs. 14 brand logos in /assets. No database, no CMS, no build tools. All content changes require code edits.

**Current site issues (vlacovision.com):** Poor CTAs, basic design, slow video loading (loads full Vimeo iframes on hover), limited interactivity, no way for owner to update content independently.

**Video strategy:** Short MP4 preview clips (5-10s, 720p, ~500KB-1MB) for hover-to-play in the grid. Full Vimeo embeds only on project detail pages. This matches how premium production studios (Buck, ManvsMachine) handle video portfolios.

**Target aesthetic:** Dark, editorial, cinematic. High-contrast with smooth parallax, full-bleed video, and typography-driven design. Think $10k production house site.

**Existing Vimeo IDs to migrate:** 22 projects with real Vimeo IDs (e.g., 1010368544, 1018385941, 1010444232, etc.)

**Brand logos to migrate:** Nike, Disney, Lululemon, Chase, Columbia, BF Goodrich, Kith, Aether, Dr. Bronner's, Brex, Dick's Sporting Goods, Old Navy, Digital Realty, Culinary Institute

## Constraints

- **Tech stack**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Prisma ORM — modern React ecosystem
- **Video hosting**: Vimeo for long-form (existing, free hosting with adaptive bitrate)
- **Admin UX**: Must be dead simple — owner is non-technical (think WordPress/Shopify simplicity)
- **Performance**: Video previews must load instantly on hover (native MP4, not iframe embeds)
- **Deployment**: Must work on Railway or similar Node.js hosting

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js over vanilla rebuild | Need React for admin panel, SSR for SEO, App Router for modern patterns | — Pending |
| MP4 previews over GIF/Vimeo iframe | GIFs are huge/low quality, Vimeo iframes are slow to load on hover. Native video is instant | — Pending |
| Built-in admin over headless CMS | Full control, no third-party dependency, tailored to exact needs | — Pending |
| Prisma + SQLite/PostgreSQL | Type-safe ORM, easy schema management, works with Next.js API routes | — Pending |
| Framer Motion over CSS-only | Cinematic page transitions, scroll-triggered animations, physics-based interactions | — Pending |

---
*Last updated: 2026-03-30 after initialization*
