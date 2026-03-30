# Requirements: VLACOVISION Website Revamp

**Defined:** 2026-03-30
**Core Value:** When a potential client or creative peer lands on this site, they must immediately feel the production quality through cinematic video presentation, fluid animations, and premium design — and have a frictionless path to make contact.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: Next.js project scaffolded with TypeScript, Tailwind CSS, App Router
- [x] **FOUND-02**: Prisma ORM configured with PostgreSQL database and initial schema
- [x] **FOUND-03**: SEO redirect mapping from old URL structure (projects/*.html) to new routes
- [x] **FOUND-04**: Framer Motion configured with LazyMotion at root layout level
- [x] **FOUND-05**: Dark editorial design system (color tokens, typography scale, spacing)

### Authentication

- [x] **AUTH-01**: Admin user can log in with email/password at /admin/login
- [x] **AUTH-02**: Admin routes (/admin/**) protected — unauthenticated users redirected to login
- [x] **AUTH-03**: Admin session persists across browser refresh (HTTP-only cookies)
- [x] **AUTH-04**: Admin user can log out from any admin page

### Portfolio - Public

- [ ] **PORT-01**: Full-bleed hero video section with muted autoplay MP4/WebM loop
- [ ] **PORT-02**: Hero video has elegant sound toggle (mute/unmute)
- [ ] **PORT-03**: Portfolio grid displaying projects with thumbnail/poster images
- [ ] **PORT-04**: Hover-to-play on grid items using short MP4 preview clips (native video, not Vimeo iframe)
- [ ] **PORT-05**: Mobile touch fallback for hover-to-play (poster + play icon tap)
- [ ] **PORT-06**: Project detail page with full Vimeo embed, title, client, services, year, description
- [ ] **PORT-07**: Brand trust logo section (Nike, Disney, Lululemon, Chase, etc.)
- [ ] **PORT-08**: About section with company description
- [ ] **PORT-09**: All 22 existing projects migrated with real Vimeo IDs into database
- [ ] **PORT-10**: Lazy/progressive loading for video grid items (IntersectionObserver)

### Contact & Lead Gen

- [ ] **LEAD-01**: Contact form on public site (name, email, company, message)
- [ ] **LEAD-02**: Form submissions stored in database
- [ ] **LEAD-03**: Multiple CTA buttons throughout site driving to contact form
- [ ] **LEAD-04**: Contact form has client-side validation and success/error feedback

### Animations

- [ ] **ANIM-01**: Cinematic page transitions between routes (Framer Motion AnimatePresence)
- [ ] **ANIM-02**: Scroll-triggered reveal animations on grid items and sections (whileInView)
- [ ] **ANIM-03**: Staggered animation on portfolio grid items entering viewport
- [ ] **ANIM-04**: Smooth hover effects on interactive elements (CTAs, nav links, logos)
- [ ] **ANIM-05**: Respects prefers-reduced-motion for accessibility

### Admin CMS

- [ ] **ADMIN-01**: Admin dashboard home page with overview
- [ ] **ADMIN-02**: Project list view with all projects and their status (published/draft)
- [ ] **ADMIN-03**: Create new project form (title, client, services, year, description, Vimeo URL, preview clip upload, thumbnail)
- [ ] **ADMIN-04**: Edit existing project
- [ ] **ADMIN-05**: Delete project with confirmation
- [ ] **ADMIN-06**: Publish/unpublish toggle (draft mode)
- [ ] **ADMIN-07**: Drag-and-drop project reordering
- [ ] **ADMIN-08**: Update hero/featured video from admin
- [ ] **ADMIN-09**: Edit about section content from admin
- [ ] **ADMIN-10**: Edit contact information from admin
- [ ] **ADMIN-11**: Upload and manage brand logos from admin
- [ ] **ADMIN-12**: Contact form submissions inbox in admin

### Analytics

- [ ] **ANLYT-01**: Track page views across public site
- [ ] **ANLYT-02**: Track video play events (which projects get watched)
- [ ] **ANLYT-03**: Analytics dashboard in admin showing page visits, video plays, popular projects

### SEO & Performance

- [ ] **SEO-01**: Unique meta title, description, and OG tags per page
- [ ] **SEO-02**: Proper heading hierarchy and semantic HTML
- [ ] **SEO-03**: Fast initial load (< 3s LCP) via SSR and lazy loading
- [ ] **SEO-04**: Image optimization via Next.js Image component

### Responsive Design

- [ ] **RESP-01**: Fully responsive layout across mobile, tablet, and desktop
- [ ] **RESP-02**: Video previews degrade gracefully on mobile (poster + tap to play)
- [ ] **RESP-03**: Admin panel usable on tablet (desktop-optimized, tablet-functional)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Polish & Enhancement

- **POLISH-01**: Custom cursor with project title reveal on hover
- **POLISH-02**: Magnetic hover effects on CTA buttons
- **POLISH-03**: Smooth scroll with momentum (Lenis)
- **POLISH-04**: Project filtering by category/service type
- **POLISH-05**: OG image auto-generated per project from video thumbnail

### Advanced Admin

- **ADV-01**: Advanced analytics (scroll depth, heatmaps)
- **ADV-02**: Email notification on new contact form submission
- **ADV-03**: Project awards/recognition section
- **ADV-04**: Multi-user admin with role-based access

## Out of Scope

| Feature | Reason |
|---------|--------|
| E-commerce / payments | Not a store — pure portfolio + lead gen |
| Blog / news section | Dilutes editorial focus; owner won't maintain content discipline |
| Client login / project delivery portal | Completely separate product; use Vimeo private sharing instead |
| Real-time chat widget | Clutters dark aesthetic; contact form is sufficient |
| Dark/light mode toggle | Dark editorial aesthetic IS the brand; toggle dilutes it |
| Infinite scroll | Destroys perceived curation; curated grid is better |
| Auto-playing audio on hero | Browsers block it; immediately jarring; use sound toggle instead |
| GIF-based previews | 3-10x larger than MP4; choppy; no audio support |
| Mobile native app | Web only for this scope |
| Multi-language / i18n | English only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| AUTH-01 | Phase 2 | Complete |
| AUTH-02 | Phase 2 | Complete |
| AUTH-03 | Phase 2 | Complete |
| AUTH-04 | Phase 2 | Complete |
| PORT-01 | Phase 3 | Pending |
| PORT-02 | Phase 3 | Pending |
| PORT-03 | Phase 3 | Pending |
| PORT-04 | Phase 3 | Pending |
| PORT-05 | Phase 3 | Pending |
| PORT-06 | Phase 3 | Pending |
| PORT-07 | Phase 3 | Pending |
| PORT-08 | Phase 3 | Pending |
| PORT-09 | Phase 3 | Pending |
| PORT-10 | Phase 3 | Pending |
| LEAD-01 | Phase 3 | Pending |
| LEAD-02 | Phase 3 | Pending |
| LEAD-03 | Phase 3 | Pending |
| LEAD-04 | Phase 3 | Pending |
| SEO-01 | Phase 3 | Pending |
| SEO-02 | Phase 3 | Pending |
| SEO-03 | Phase 3 | Pending |
| SEO-04 | Phase 3 | Pending |
| RESP-01 | Phase 3 | Pending |
| RESP-02 | Phase 3 | Pending |
| ANIM-01 | Phase 4 | Pending |
| ANIM-02 | Phase 4 | Pending |
| ANIM-03 | Phase 4 | Pending |
| ANIM-04 | Phase 4 | Pending |
| ANIM-05 | Phase 4 | Pending |
| ADMIN-01 | Phase 5 | Pending |
| ADMIN-02 | Phase 5 | Pending |
| ADMIN-03 | Phase 5 | Pending |
| ADMIN-04 | Phase 5 | Pending |
| ADMIN-05 | Phase 5 | Pending |
| ADMIN-06 | Phase 5 | Pending |
| ADMIN-08 | Phase 5 | Pending |
| ADMIN-09 | Phase 5 | Pending |
| ADMIN-10 | Phase 5 | Pending |
| ADMIN-11 | Phase 5 | Pending |
| ADMIN-12 | Phase 5 | Pending |
| RESP-03 | Phase 5 | Pending |
| ADMIN-07 | Phase 6 | Pending |
| ANLYT-01 | Phase 6 | Pending |
| ANLYT-02 | Phase 6 | Pending |
| ANLYT-03 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 49 total
- Mapped to phases: 49
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-30 after roadmap creation — ADMIN-07 moved from Phase 5 to Phase 6*
