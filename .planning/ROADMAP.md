# ROADMAP: VLACOVISION Website Revamp

**Created:** 2026-03-30
**Granularity:** Standard
**Coverage:** 49/49 v1 requirements mapped

## Phases

- [ ] **Phase 1: Foundation and Infrastructure** - Next.js scaffold, Tailwind, Prisma schema, Railway deployment verified
- [ ] **Phase 2: Auth System and Data Layer** - Admin login, session management, DAL, database migrations live
- [ ] **Phase 3: Public Portfolio** - Complete public-facing site with video grid, contact form, SEO, and mobile layout
- [ ] **Phase 4: Cinematic Animations** - Framer Motion page transitions, scroll reveals, and motion polish
- [ ] **Phase 5: Admin CMS** - Full content management for projects, settings, brand logos, and contact inbox
- [ ] **Phase 6: Analytics and Advanced Admin** - Drag-and-drop reorder, analytics tracking, admin dashboard

---

## Phase Details

### Phase 1: Foundation and Infrastructure
**Goal**: The project is bootstrapped, deployable to Railway, and every subsequent phase can build without revisiting infrastructure decisions
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` locally serves a dark-themed Next.js app at localhost:3000 with no TypeScript or Tailwind errors
  2. Railway deployment succeeds — app is live at a public URL with Prisma connecting to PostgreSQL (no DB connectivity errors in logs)
  3. Visiting the old URL pattern (e.g., `/projects/title.html`) redirects to the new route with a 301 — no SEO link rot
  4. The Framer Motion `LazyMotion` wrapper is present in the root layout and the bundle analyzer shows animation features are not eagerly loaded
  5. The design system tokens (color palette, type scale, spacing) are defined in Tailwind config and produce correct dark editorial output on a test component
**Plans:** 1/2 plans executed
Plans:
- [ ] 01-01-PLAN.md — Scaffold Next.js 16, move legacy files, establish dark editorial design system
- [ ] 01-02-PLAN.md — Prisma 7 schema + seed data, SEO redirects, Framer Motion LazyMotion provider

### Phase 2: Auth System and Data Layer
**Goal**: Admin authentication is secure and complete — every subsequent admin feature can be built assuming `verifySession()` is already enforced
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. Visiting any `/admin/**` route without a session cookie redirects immediately to `/admin/login` — no admin content is visible
  2. The admin user can log in with email/password at `/admin/login` and land on the admin dashboard
  3. Refreshing any admin page while authenticated keeps the user logged in (session survives browser refresh)
  4. Clicking "Log out" from any admin page clears the session and redirects to `/admin/login` — the back button does not expose admin content
**Plans**: TBD

### Phase 3: Public Portfolio
**Goal**: A potential client who visits the site experiences the full production quality of VLACOVISION — cinematic video, brand credibility, and a clear path to make contact
**Depends on**: Phase 2 (DAL query functions and seeded project data)
**Requirements**: PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, PORT-06, PORT-07, PORT-08, PORT-09, PORT-10, LEAD-01, LEAD-02, LEAD-03, LEAD-04, SEO-01, SEO-02, SEO-03, SEO-04, RESP-01, RESP-02
**Success Criteria** (what must be TRUE):
  1. The hero section loads a muted, autoplaying MP4 video immediately on page load with a visible sound toggle that works
  2. Hovering a portfolio grid item on desktop starts playing the MP4 preview clip within 200ms (no Vimeo iframe, no perceptible delay)
  3. On a mobile device, tapping a grid item shows a poster image with play icon; the project detail page opens with the full Vimeo embed loaded via a facade (poster image → click → iframe)
  4. All 22 existing projects are visible in the grid with real Vimeo IDs and the Nike/Disney/Lululemon brand logo strip appears on the home page
  5. Submitting the contact form with valid inputs shows a success state, and the submission is stored in the database (verifiable via direct DB query)
  6. Every public page has a unique title, meta description, and OG tag — Lighthouse SEO score is 90+
**Plans**: TBD

### Phase 4: Cinematic Animations
**Goal**: The site feels like a premium motion studio built it — transitions are smooth, reveals are deliberate, and motion never blocks content
**Depends on**: Phase 3 (page components must exist before transitions can be layered on)
**Requirements**: ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05
**Success Criteria** (what must be TRUE):
  1. Navigating between any two pages produces a fluid crossfade or slide transition — there is no blank white flash or layout jump
  2. Scrolling down the home page triggers staggered reveal animations on portfolio grid items and section headings entering the viewport
  3. Hovering over CTAs, nav links, and brand logos produces a smooth micro-animation response (not an instant state jump)
  4. On a device with `prefers-reduced-motion: reduce` set, all animations are disabled and content is immediately visible without motion
**Plans**: TBD

### Phase 5: Admin CMS
**Goal**: The owner can manage all site content independently — adding projects, updating the hero, editing the about section, uploading logos, and reading contact messages — without touching code
**Depends on**: Phase 2 (auth), Phase 3 (schema validated against what public site renders)
**Requirements**: ADMIN-01, ADMIN-02, ADMIN-03, ADMIN-04, ADMIN-05, ADMIN-06, ADMIN-08, ADMIN-09, ADMIN-10, ADMIN-11, ADMIN-12, RESP-03
**Success Criteria** (what must be TRUE):
  1. The owner can create a new project by filling out the admin form (title, client, services, year, description, Vimeo URL, preview clip upload, thumbnail) and see it appear on the public site immediately after publishing
  2. The owner can edit any existing project, toggle its publish/unpublish status, and delete it with a confirmation step — all changes reflect on the public site within one page reload
  3. The owner can update the hero video, edit the about section text, change contact details, and upload/remove brand logos from the admin panel
  4. Contact form submissions from the public site appear in the admin inbox with read/unread status
  5. The admin panel is fully functional on a tablet (all forms reachable and submittable without horizontal scroll)
**Plans**: TBD

### Phase 6: Analytics and Advanced Admin
**Goal**: The owner has visibility into which projects get the most attention and can reorder the portfolio to reflect strategic priorities — without any data loss or page refresh inconsistencies
**Depends on**: Phase 5 (admin shell exists, project data is live and being managed)
**Requirements**: ADMIN-07, ANLYT-01, ANLYT-02, ANLYT-03
**Success Criteria** (what must be TRUE):
  1. The owner can drag a project card in the admin list to a new position, drop it, and immediately see the public portfolio grid reflect the new order (persists after page refresh)
  2. Page views and video play events are silently tracked as users browse the public site — no visible UI change, no performance impact
  3. The admin analytics dashboard shows total page visits, video play counts per project, and a ranked list of most-viewed projects — data is accurate relative to actual traffic
**Plans**: TBD

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Infrastructure | 1/2 | In Progress|  |
| 2. Auth System and Data Layer | 0/? | Not started | - |
| 3. Public Portfolio | 0/? | Not started | - |
| 4. Cinematic Animations | 0/? | Not started | - |
| 5. Admin CMS | 0/? | Not started | - |
| 6. Analytics and Advanced Admin | 0/? | Not started | - |

---

## Coverage Map

| Requirement | Phase |
|-------------|-------|
| FOUND-01 | 1 |
| FOUND-02 | 1 |
| FOUND-03 | 1 |
| FOUND-04 | 1 |
| FOUND-05 | 1 |
| AUTH-01 | 2 |
| AUTH-02 | 2 |
| AUTH-03 | 2 |
| AUTH-04 | 2 |
| PORT-01 | 3 |
| PORT-02 | 3 |
| PORT-03 | 3 |
| PORT-04 | 3 |
| PORT-05 | 3 |
| PORT-06 | 3 |
| PORT-07 | 3 |
| PORT-08 | 3 |
| PORT-09 | 3 |
| PORT-10 | 3 |
| LEAD-01 | 3 |
| LEAD-02 | 3 |
| LEAD-03 | 3 |
| LEAD-04 | 3 |
| SEO-01 | 3 |
| SEO-02 | 3 |
| SEO-03 | 3 |
| SEO-04 | 3 |
| RESP-01 | 3 |
| RESP-02 | 3 |
| ANIM-01 | 4 |
| ANIM-02 | 4 |
| ANIM-03 | 4 |
| ANIM-04 | 4 |
| ANIM-05 | 4 |
| ADMIN-01 | 5 |
| ADMIN-02 | 5 |
| ADMIN-03 | 5 |
| ADMIN-04 | 5 |
| ADMIN-05 | 5 |
| ADMIN-06 | 5 |
| ADMIN-08 | 5 |
| ADMIN-09 | 5 |
| ADMIN-10 | 5 |
| ADMIN-11 | 5 |
| ADMIN-12 | 5 |
| RESP-03 | 5 |
| ADMIN-07 | 6 |
| ANLYT-01 | 6 |
| ANLYT-02 | 6 |
| ANLYT-03 | 6 |

**Total mapped: 49/49 ✓**

---
*Roadmap created: 2026-03-30*
*Last updated: 2026-03-30 — Phase 1 plans created (2 plans, 2 waves)*
