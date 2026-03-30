# Project Research Summary

**Project:** VLACOVISION — Premium Videographer Portfolio + Admin CMS
**Domain:** Motion design / video production company portfolio with built-in content management
**Researched:** 2026-03-30
**Confidence:** MEDIUM-HIGH

## Executive Summary

VLACOVISION is a premium video production portfolio site migrating from a vanilla HTML/JS + Express static server to a full-stack Next.js 15 App Router application with a built-in admin CMS. The migration is not simply a re-skin — it solves three structural problems with the current site: hardcoded project data that the non-technical owner cannot update, a Vimeo-iframe-on-hover strategy that makes the portfolio grid feel slow and broken, and no lead-capture mechanism. The recommended approach is a Next.js 15 monorepo with two distinct route groups — a cinematic public portfolio and a protected admin panel — sharing one Prisma + PostgreSQL data layer. This is well-established architecture for owner-operated creative agency sites and has clear documented patterns across the entire stack.

The core technical bet is the video strategy. Replacing Vimeo iframes in the portfolio grid with self-hosted MP4 preview clips (720p, 5-10s, ~500KB-1MB each) is the single change most responsible for making the site feel premium. This is an irreversible early decision: the Prisma schema must store both `previewUrl` and `vimeoId`, the admin must support MP4 upload from day one, and the grid component must be built around native `<video>` elements. Every other enhancement — Framer Motion transitions, smooth scroll, custom cursor — is layered on top of this foundation and can be deferred. The video delivery strategy cannot be retrofitted without reworking the schema, admin, and all grid components simultaneously.

The principal risks are infrastructure-level, not frontend-level. Railway's ephemeral container filesystem will silently destroy any uploaded files on redeploy unless they are routed to external object storage (Cloudflare R2 or equivalent) from the start. Prisma requires explicit `binaryTargets` and `postinstall: "prisma generate"` in the build pipeline or the first Railway deployment fails entirely. Auth must use HTTP-only cookies (not localStorage) from the first commit — retrofitting session security after the admin panel is built is expensive. These three pitfalls together mean the infrastructure and data layer must be established and production-verified before frontend development begins in earnest.

---

## Key Findings

### Recommended Stack

The stack centers on Next.js 15 with the App Router, React 19, TypeScript 5, Tailwind CSS 4, and Framer Motion 11 for the frontend. The data layer is Prisma 5 + PostgreSQL 16. Admin auth uses NextAuth.js v5 (App Router-compatible; v4 is incompatible with middleware-based route protection). File uploads route through `uploadthing` or direct S3/R2 presigned URLs — never local filesystem in production. All form state uses React Hook Form 7 + Zod 3 with server-side re-validation in Server Actions.

**Core technologies:**
- **Next.js 15 (App Router):** Full-stack framework, file-based routing, SSR/SSG, API routes, image optimization — the only viable modern choice for this use case; v14 is in maintenance
- **React 19:** Peer requirement of Next.js 15; stable Server Actions and `use` hook needed by admin forms
- **TypeScript 5:** Type safety across Prisma-generated models and admin form validation; eliminates the stale-state bugs in the current vanilla JS
- **Tailwind CSS 4:** CSS-first configuration (no `tailwind.config.js`); faster builds; dark editorial aesthetic maps directly to utility classes
- **Framer Motion 11:** The only React animation library that handles layout animations, shared element transitions, scroll-linked parallax, and `AnimatePresence` page transitions together
- **Prisma 5 + PostgreSQL 16:** Type-safe ORM with schema migrations; PostgreSQL required for production (SQLite has write-lock issues in Railway's multi-container environment)
- **NextAuth.js v5:** App Router middleware-native auth; Credentials provider with bcrypt-hashed password; v4 is incompatible and must not be used
- **uploadthing 6:** Managed file uploads to CDN storage; eliminates S3 bucket configuration for a portfolio at this scale

**Critical version constraint:** `next-auth@beta` (v5) is required. NextAuth v4 does not correctly support App Router middleware route protection. Verify `npm show next-auth dist-tags` before installing.

### Expected Features

The research identified a clear MVP boundary. A production house at VLACOVISION's positioning requires the following table stakes to avoid immediate credibility loss:

**Must have (table stakes):**
- Full-bleed hero video (muted autoplay MP4) — first impression establishes motion-first brand
- Portfolio grid with hover-to-play MP4 previews — the core product experience; Vimeo iframes are unacceptable here
- Project detail pages with full Vimeo embed (facade pattern, loads on click) — where clients convert
- Brand trust logo strip (Nike, Disney, Lululemon, etc.) — instant credibility signal
- About section — humanizes the brand for buyers
- Contact form with DB-persisted submissions — the primary lead-gen endpoint; the current site has no CTA
- Admin: Project CRUD with publish/unpublish — owner independence is a stated requirement
- Admin: Authentication protecting all `/admin/*` routes — prerequisite for any admin feature
- Mobile responsive layout with graceful video degradation — 50%+ of discovery is mobile
- SEO metadata (title, description, OG) per page — findability for "video production company [city]"

**Should have (competitive differentiators — v1.x):**
- Cinematic page transitions via Framer Motion `AnimatePresence` — separates craft studios from generic portfolios
- Scroll-triggered reveal animations — editorial premium signal (Buck, ManvsMachine standard)
- Admin: Drag-and-drop project reorder — needed once owner has 20+ projects
- Admin: Contact inbox in dashboard — after first leads arrive
- Project filtering by category/service — once grid exceeds 16 projects
- OG image per project — social sharing preview
- Smooth scroll (Lenis) — polish layer

**Defer (v2+):**
- Admin analytics dashboard — needs data volume before it's useful
- Custom cursor — craft signal, add as late enhancement
- Magnetic hover effects on CTAs — high effort, diminishing return
- Admin brand logo management — currently 14 static logos, low churn

**Hard anti-features (never build):**
- Vimeo iframes in the portfolio grid — 2-4 second initialization delay destroys the hover UX
- Dark/light mode toggle — the dark editorial aesthetic is the brand identity; a toggle dilutes it
- Blog/news section — dilutes editorial focus, requires content discipline the owner won't maintain
- Infinite scroll — destroys perceived curation; premium studios show 12-24 best pieces

### Architecture Approach

The architecture uses two Next.js route groups — `(public)` and `(admin)` — each with their own root layout, giving the public portfolio and admin panel completely separate visual chrome while sharing one Next.js process and one Prisma data layer. Route protection is a two-layer system: `proxy.ts` (formerly `middleware.ts` in Next.js 16) performs an optimistic JWT cookie check on every `/admin/*` request and redirects unauthenticated users, while `lib/dal.ts` performs authoritative `verifySession()` checks inside every Server Action and Route Handler (bypassing the proxy is trivially possible via direct curl). All file uploads stream to external object storage — never local filesystem. Public pages are React Server Components fetching directly from the DAL (no API round-trip). Admin mutations use Server Actions for form submissions and Route Handlers for programmatic operations (reorder, file upload with progress).

**Note on Next.js version:** The ARCHITECTURE.md researcher referenced Next.js 16.2.1 documentation (updated 2026-03-25) and noted that `middleware.ts` has been renamed to `proxy.ts` in Next.js 16. The STACK.md researcher (knowledge cutoff August 2025) references Next.js 15. Verify the current stable Next.js version before bootstrapping — if Next.js 16 is now stable, the proxy.ts rename applies; if still on 15, use middleware.ts.

**Major components:**
1. **`proxy.ts` (auth gate)** — stateless JWT cookie check on every `/admin/*` request; never touches the database; redirect-only
2. **`(public)/` route group** — Server Component pages (home, project detail) fetching from DAL; Client Components only at leaf nodes (ProjectCard hover logic, ContactForm state)
3. **`(admin)/` route group** — Client Component-heavy admin panel (ProjectForm, drag-drop list, file uploader, settings form, contact inbox)
4. **`lib/dal.ts` (data access layer)** — all Prisma queries centralized here; `verifySession()` called at top of every protected operation; marked `server-only`
5. **`lib/session.ts`** — stateless JWT via `jose` (Edge Runtime compatible); 7-day HttpOnly cookie; no session table in DB
6. **`app/api/` route handlers** — REST endpoints for programmatic operations; file upload endpoint; analytics event tracking
7. **`lib/actions/`** — Server Actions for form mutations (project CRUD, contact submission, settings update)
8. **Prisma schema** — 5 models: `Project`, `SiteSettings` (singleton), `BrandLogo`, `ContactSubmission`, `AnalyticsEvent`; `Project.order` field essential for drag-drop reorder from day one

**Build order mandated by architecture:**
Database layer → Auth system → DAL → Public site components → Admin shell → Admin CRUD → File upload → Analytics

### Critical Pitfalls

Research identified 12 pitfalls; the top 5 that can block the entire project if missed:

1. **Railway ephemeral filesystem destroys uploaded files on redeploy** — Never write uploaded files to local filesystem in production. Route all uploads to S3/Cloudflare R2/Backblaze from the first upload feature. Files in `public/uploads/` survive local dev but vanish on every Railway deploy. Recovery cost is HIGH (manual re-upload of all assets).

2. **Prisma binary missing at runtime on Railway** — Add `postinstall: "prisma generate"` to `package.json` and `binaryTargets: ["native", "linux-musl-openssl-3.0.x"]` to `schema.prisma` before the first Railway deploy. Missing this causes a complete runtime crash with no DB connectivity. Easily prevented, catastrophic if missed.

3. **Admin auth using localStorage JWT** — HTTP-only cookies are required. localStorage tokens are XSS-stealable and cannot be server-side revoked. Use `jose` for stateless JWT in HttpOnly cookies. Never retrofit — build it right in the auth phase.

4. **Mobile video autoplay fails silently** — Every `<video>` element must have `muted`, `playsInline`, and `loop` attributes. The `.play()` call must catch its rejected Promise. Touch devices need `onTouchStart` handlers since hover events don't fire. Black rectangles in the grid on iPhone is the worst possible first impression for a video production company.

5. **Framer Motion SSR hydration mismatch** — All components using `motion.*` or Framer Motion hooks require `'use client'`. Use `LazyMotion` with `domAnimation` feature set in root layout to cut bundle size by ~50%. Animation components built without these patterns in the foundation phase must be reworked individually later.

---

## Implications for Roadmap

Based on architecture dependencies, pitfall phase mappings, and feature dependencies, the recommended phase structure is:

### Phase 1: Foundation and Infrastructure
**Rationale:** The pitfall research is unambiguous — infrastructure decisions made wrong here cause data loss, deployment failure, and security vulnerabilities that are expensive to fix mid-build. URL routing design affects SEO permanently. `next.config.js` settings (`remotePatterns`, `serverActions.bodySizeLimit`, `redirects`) must be in place before any feature is built on top of them.
**Delivers:** Bootstrapped Next.js 15 project with Tailwind v4, TypeScript, two route groups, `next.config.js` fully configured, old URL redirects mapped, `LazyMotion` wrapper in root layout, Railway project with PostgreSQL plugin connected, object storage bucket (R2/S3) provisioned, `postinstall: "prisma generate"` script in place, blank Prisma schema initialized with all 5 models and `binaryTargets` set, `.env` structure with `@t3-oss/env-nextjs` validation, first Railway deploy confirming Prisma engine loads correctly.
**Addresses:** Table stakes foundation; no features yet but all feature work is unblocked
**Avoids:** SEO URL regression (Pitfall 11), `next/image` domain config errors (Pitfall 12), Railway ephemeral filesystem data loss (Pitfall 6), Prisma binary crash (Pitfall 9), Framer Motion bundle size (Pitfall 1)
**Research flag:** Standard patterns — well-documented Next.js and Railway setup. Skip research-phase.

### Phase 2: Auth System and Data Layer
**Rationale:** Admin auth must be built before any admin feature. The architecture mandates `verifySession()` in every protected operation — if auth is added later, every Server Action and Route Handler must be revisited. Database migrations and DAL functions are prerequisites for both public pages and admin CRUD.
**Delivers:** `lib/session.ts` (JWT, HttpOnly cookies), `proxy.ts` (middleware auth gate for `/admin/*`), `lib/dal.ts` (all query functions + `verifySession`), Prisma migrations applied to Railway PostgreSQL, `/admin/login` page with Credentials auth, `AdminUser` seed with bcrypt-hashed password, complete `lib/actions/auth.ts` (login/logout Server Actions), confirmed Railway pre-deploy migration command (`npx prisma migrate deploy`).
**Addresses:** Admin authentication (MVP requirement)
**Avoids:** Admin auth insecurity (Pitfall 8), Prisma migration race condition on Railway (Pitfall 10), auth-check-only-in-middleware anti-pattern (Architecture Anti-Pattern 1)
**Research flag:** Standard patterns for NextAuth v5 Credentials + stateless JWT. Verify NextAuth v5 stable release status before implementing (`npm show next-auth dist-tags`). May need brief research-phase if v5 is still in beta.

### Phase 3: Public Portfolio (Core Product)
**Rationale:** The public site is the primary deliverable. It depends on Phase 1 (routing, Tailwind, image config) and Phase 2 (DAL query functions, seeded project data). The portfolio grid with hover-to-play MP4 previews is the site's core differentiator — it must be built to production quality before admin features.
**Delivers:** Seed script populating all 22 existing projects from current site data, hero video (muted autoplay MP4), portfolio grid with hover-to-play MP4 preview clips (native `<video>`, muted/playsInline/loop), project detail pages with Vimeo facade embed (poster image → click to load iframe), brand trust logo strip, about section, contact form (submissions stored in DB), multiple CTAs, full mobile responsive layout, SEO metadata on all pages, `next/image` for all thumbnails.
**Uses:** Framer Motion scroll-triggered reveals (`whileInView`, stagger), `ProjectCard` Client Component with hover state, `VimeoEmbed` facade pattern, `ContactForm` Server Action
**Avoids:** Vimeo iframes in the grid (Anti-Feature), mobile autoplay failure (Pitfall 3), eager Vimeo loading on detail pages (Pitfall 4), unoptimized image loading (Performance Trap)
**Research flag:** MP4 video delivery via CDN (R2/S3) — confirm the uploadthing integration or presigned URL pattern for the chosen object storage. One session of research-phase warranted.

### Phase 4: Cinematic Animations and Polish
**Rationale:** Animation is a differentiator layer that requires the public site structure (Phase 3) to already exist. `AnimatePresence` page transitions require App Router layout structure. Smooth scroll (Lenis) wraps existing scroll behavior. These are additive enhancements with no data dependencies.
**Delivers:** Framer Motion `AnimatePresence` page transitions (route changes), scroll-triggered section reveals (hero, about, contact), smooth scroll via Lenis, dark editorial aesthetic refinement, `prefers-reduced-motion` respect throughout, `AnimatePresence mode="wait"` preventing layout shift during transitions.
**Uses:** Framer Motion 11 `LazyMotion` + `m` component pattern, `next-themes` for locked dark mode, Lenis smooth scroll
**Avoids:** Framer Motion SSR hydration mismatch (Pitfall 2), layout shift during page transitions (UX Pitfall)
**Research flag:** Standard Framer Motion + Next.js App Router patterns. Skip research-phase.

### Phase 5: Admin CMS — CRUD and Content Management
**Rationale:** Admin panel requires auth (Phase 2) and public site components (Phase 3) to validate that the schema fields match what the public site renders. File upload infrastructure must be production-ready (object storage, not local filesystem) before building the upload UI.
**Delivers:** Admin dashboard overview, project list with publish/unpublish toggle, project create/edit forms (React Hook Form + Zod, all 8+ fields), hero video management in site settings, about section editor, brand logo upload and management, admin-side contact form inbox (read/unread status), full `bodySizeLimit: '25mb'` configuration for video uploads, file upload routing to object storage (R2/S3) with URL stored in DB.
**Uses:** `react-hook-form` 7, Zod 3, `uploadthing` or presigned S3 uploads, `sonner` for toast feedback, `AdminSidebar` shell layout
**Avoids:** Railway ephemeral filesystem data loss (Pitfall 6), Server Action body size limit blocking uploads (Pitfall 7), no upload progress indicator (UX Pitfall), admin layout auth check anti-pattern (Architecture Anti-Pattern 5)
**Research flag:** File upload via uploadthing vs presigned R2 URLs — if uploadthing 6 is confirmed compatible with Next.js 15/16 App Router, use it. Otherwise fall back to presigned R2. Verify before building upload UI.

### Phase 6: Admin CMS — Advanced Features
**Rationale:** Drag-and-drop reorder, contact inbox, and analytics are v1.x additions that build on the stable admin shell from Phase 5. They can be delivered incrementally after the owner begins using the basic CMS.
**Delivers:** Drag-and-drop project reorder (`@hello-pangea/dnd`, PATCH `/api/projects/reorder`, persisted `order` field), contact inbox with read/unread status, basic analytics event tracking (page views, video plays via `onPlay` handler), admin analytics dashboard with aggregated stats (not raw event log queries).
**Uses:** `@hello-pangea/dnd` 4, `AnalyticsEvent` Prisma model, aggregated summary queries (never raw event log for dashboard)
**Avoids:** Analytics dashboard querying full event log (Performance Trap), reorder not persisting after refresh
**Research flag:** Standard patterns. Skip research-phase.

### Phase Ordering Rationale

- **Infrastructure before features** (Phase 1 first): Railway filesystem, Prisma binary targets, object storage, and URL redirects cannot be safely retrofitted. Every file ever uploaded before the storage strategy is set is a lost file.
- **Auth before admin** (Phase 2 before Phase 5/6): The DAL's `verifySession()` pattern must be established before any admin Server Action is written. Adding auth to 20 existing Server Actions post-hoc is a security audit, not a feature.
- **Seed data before admin CRUD** (Phase 3 includes seed): Building admin edit forms requires existing data to edit. Seeding the 22 existing projects in Phase 3 (as part of public site development) means admin forms in Phase 5 have real data to validate against.
- **Public site before animations** (Phase 3 before Phase 4): `AnimatePresence` page transitions require the page components to already exist. Building animations on placeholder pages creates rework.
- **Basic admin before advanced admin** (Phase 5 before Phase 6): Owner needs CRUD and file upload before drag-drop reorder and analytics are useful. Delivering Phase 5 enables the owner to start managing content while Phase 6 is in progress.

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 2 (Auth):** Verify NextAuth v5 stable release status. If still in beta, assess whether custom `jose` JWT session (as shown in ARCHITECTURE.md) is preferable to avoid beta dependency in production.
- **Phase 3 (Portfolio / Media delivery):** Confirm object storage + CDN setup for MP4 preview clips. Verify uploadthing v6 compatibility with current Next.js version. Determine whether to use uploadthing or presigned R2 URLs for video clip delivery.
- **Phase 5 (Admin uploads):** Same as Phase 3 — file upload strategy must be resolved before building upload UI. One research-phase covering both Phases 3 and 5 is efficient.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** Next.js 15 bootstrapping, Tailwind v4, Railway + PostgreSQL setup — all well-documented.
- **Phase 4 (Animations):** Framer Motion + App Router patterns are stable and thoroughly documented.
- **Phase 6 (Advanced admin):** `@hello-pangea/dnd` drag-drop, analytics event table — standard patterns.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | STACK.md researcher had knowledge cutoff Aug 2025. Version numbers need confirmation via `npm show` before pinning. NextAuth v5 beta status needs verification. Next.js 16 (proxy.ts rename) discovered in ARCHITECTURE.md — version discrepancy needs resolution. |
| Features | MEDIUM-HIGH | Table stakes and anti-features are highly consistent across research and industry knowledge. Competitive feature specifics (Buck, ManvsMachine) based on training data, not live site crawls. MVP boundary is clear and confident. |
| Architecture | HIGH | ARCHITECTURE.md sourced from official Next.js 16.2.1 docs (verified 2026-03-25). Route group patterns, DAL pattern, stateless JWT session, Server Component / Client Component boundary — all official documentation-backed. |
| Pitfalls | HIGH | Pitfalls sourced from official Next.js docs (verified 2026-03-30), MDN, and documented framework behavior. Railway filesystem ephemerality and Prisma binary targets are well-established gotchas with confirmed recovery costs. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Next.js version discrepancy:** STACK.md recommends Next.js 15 (knowledge cutoff Aug 2025). ARCHITECTURE.md references Next.js 16.2.1 docs (updated 2026-03-25) and notes `middleware.ts` → `proxy.ts` rename in v16. Run `npm show next version` to determine current stable version and which convention applies before project bootstrap.

- **NextAuth v5 stability:** STACK.md recommends `next-auth@beta` (v5). Run `npm show next-auth dist-tags` to determine if v5 has reached a stable release tag. If still only `beta`, assess risk vs. using the custom `jose` stateless session pattern from ARCHITECTURE.md (which has no library dependency).

- **Object storage selection:** Research recommends Cloudflare R2 or AWS S3 for MP4 preview clips. Specific R2 vs. S3 vs. uploadthing decision should be made in Phase 1/2 planning, considering Railway's geographic region and latency to the chosen CDN edge.

- **shadcn/ui + Tailwind v4 compatibility:** STACK.md notes that shadcn/ui's Tailwind v4 support was still catching up at the knowledge cutoff. If shadcn/ui components are desired for the admin panel UI, verify current v4 compatibility before committing to Tailwind v4. If incompatible, use Tailwind v3 or build admin UI without shadcn.

- **Current site URL structure:** SEO redirect mapping (Pitfall 11) requires auditing the current vlacovision.com URL structure before routing is designed. This must be done before Phase 1 development begins — crawl or manually document all current project page URLs.

---

## Sources

### Primary (HIGH confidence)
- Next.js 16.2.1 official documentation (updated 2026-03-25) — route groups, Server/Client Components, authentication patterns, `proxy.ts` middleware, Route Handlers, Server Actions, video optimization, self-hosting, `bodySizeLimit`
- MDN Web Docs (verified 2026-03-30) — `<video>` autoplay restrictions, `playsInline` iOS requirement, `muted` attribute behavior
- PROJECT.md — validated owner requirements (non-technical owner, 22 existing projects, Vimeo-based workflow, premium portfolio positioning)

### Secondary (MEDIUM confidence)
- Training knowledge (cutoff Aug 2025) — Next.js 15, React 19, Tailwind v4, Framer Motion 11, Prisma 5, NextAuth v5, uploadthing 6, `@hello-pangea/dnd` ecosystem state
- Industry knowledge of Buck, ManvsMachine, Instrument, Hype, Psyop portfolio patterns — competitive feature analysis
- Auth.js v5 migration guide patterns — middleware-based protection, `auth()` helper
- Railway ephemeral filesystem and container restart behavior — container platform consensus

### Tertiary (needs validation)
- NextAuth v5 beta stability — verify `npm show next-auth dist-tags` before use
- Tailwind v4 + shadcn/ui compatibility — verify against current shadcn/ui release
- uploadthing v6 + Next.js 15/16 App Router compatibility — verify against current uploadthing docs
- `@hello-pangea/dnd` v4 + React 19 strict mode — verify peer dep compatibility

---
*Research completed: 2026-03-30*
*Ready for roadmap: yes*
