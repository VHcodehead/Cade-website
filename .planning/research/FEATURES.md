# Feature Research

**Domain:** Premium videographer / video production company portfolio + admin CMS
**Researched:** 2026-03-30
**Confidence:** MEDIUM-HIGH (training knowledge of Buck, ManvsMachine, Instrument, Hype, Psyop; no live site crawls due to tool restrictions; core findings are consistent with industry knowledge and PROJECT.md context)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features a potential client or creative peer expects. Missing any of these causes an immediate credibility hit for a production house claiming premium positioning.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Full-bleed hero video / showreel | Every production house leads with motion — static hero is immediately subpar | LOW | Autoplay, muted, loop; MP4/WebM self-hosted or Vimeo embed |
| Portfolio grid with project thumbnails | The primary content of any portfolio site | LOW | Masonry or editorial grid; consistent aspect ratios |
| Hover-to-play video preview on grid items | Industry standard since ~2018; Vimeo iframes are too slow — native MP4 previews are expected | MEDIUM | Short 5-10s MP4/WebM clips; preload="none", play on mouseenter |
| Individual project detail pages | Clients want to dig into specific work | LOW | Full Vimeo embed + title, client, services, year |
| Client / brand trust section | Credibility signal; logos prove caliber of clients | LOW | Horizontal scroll or grid; Nike, Disney etc. |
| About section | Buyers need to know who they're hiring | LOW | Company story, key personnel, philosophy |
| Contact section or page | Primary lead-gen endpoint | LOW | Email + form; phone optional |
| Mobile responsive layout | >50% of initial discovery happens on mobile | MEDIUM | Video previews should degrade gracefully; muted autoplay works on iOS |
| Fast initial load (< 3s LCP) | Slow load = immediate distrust for a studio selling visual polish | MEDIUM | Next.js SSR/SSG, image optimization, lazy video loading |
| Dark / editorial aesthetic | Clients expect a dark canvas that lets video pop; light backgrounds signal amateur | LOW | CSS design token system; Tailwind dark theme |
| Visible project metadata | Client name, project type, year — buyers scan for relevance | LOW | Overlay on hover or below thumbnail |
| SEO-ready page titles and meta | Clients google "video production company San Francisco" | MEDIUM | Next.js metadata API, OG tags, structured data |

### Differentiators (Competitive Advantage)

Features that signal craft and intentionality. These are what separate a $5k website from a $20k website.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Cinematic page transitions | Reinforces the brand as motion-first; most portfolio sites use basic fades at best | MEDIUM | Framer Motion `AnimatePresence`; route change transitions; coordinate with scroll position |
| Scroll-triggered reveal animations | Premium editorial sites (Buck, ManvsMachine) use staggered reveal on scroll rather than everything present on load | MEDIUM | Framer Motion `whileInView`; stagger children; respect `prefers-reduced-motion` |
| Custom cursor / cursor follower | High-craft signal; uncommon outside top-tier creative studios | HIGH | CSS custom cursor + JS follower element; video title on cursor near thumbnails |
| Typography-driven design | Premium studios let type do heavy visual lifting — large, confident, editorial hierarchy | LOW | Variable font or tight type scale; big client names, minimal decoration |
| Magnetic hover effects on CTAs | Buttons that subtly follow cursor; seen on Instrument, Hype | HIGH | JS mouse position tracking + CSS transform; can be distracting if overdone |
| Smooth scroll with momentum | Native scroll feels cheap; momentum-based scroll elevates perceived quality | MEDIUM | Lenis or similar smooth scroll library; must not break accessibility |
| Video sound toggle with elegant UI | Lets a visitor opt into audio on the hero — invites engagement | LOW | Muted by default (autoplay requirement), prominent unmute affordance |
| Project filtering by category/service | Clients hiring for a specific type (brand film, social, doc) can self-sort | MEDIUM | Filter tags: Brand, Commercial, Documentary, Social; state in URL |
| Lazy / progressive video loading | Grid with 20+ items needs careful loading strategy to avoid bandwidth explosion | MEDIUM | IntersectionObserver to load preview clips only when near viewport |
| Admin CMS with drag-and-drop reorder | Non-technical owner can manage all content independently | HIGH | Proprietary admin panel; drag-and-drop uses `@dnd-kit/core` or similar |
| Admin analytics dashboard | Owner can see which projects get the most attention without leaving the CMS | HIGH | Track video play events, page views; Chart.js or Recharts in admin |
| Contact form with admin inbox | Lead capture + visibility without a third-party CRM | MEDIUM | Server-side form handler; messages stored in DB; visible in /admin |
| Publish/unpublish (draft mode) | Owner can prep new projects without going live prematurely | LOW | Boolean `published` field in DB; filter in public routes |
| OG image / social preview per project | When someone shares a project link, it previews correctly | MEDIUM | Next.js `generateMetadata` + `opengraph-image` route; use project thumbnail |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full-page Vimeo iframes on hover | "Just use the existing Vimeo embed" — simpler technically | Vimeo iframes take 2-4s to initialize; hover delay kills the effect; requires JS API handshake | Self-hosted MP4 preview clips (5-10s, ~500KB); Vimeo only on detail page |
| GIF-based video previews | Cheap to produce, no JS required | GIFs are 3-10x larger than equivalent MP4; choppy on high-DPI; no audio support | MP4/WebM with `<video autoplay muted loop playsinline>` |
| Full motion / parallax on every section | Visually impressive demo | Causes jank on mid-range devices; fights with actual video content for attention; increases `prefers-reduced-motion` complaints | Reserve parallax for 1-2 hero moments; use opacity/translate reveals everywhere else |
| Blog / news section | "Content marketing" suggestion | Dilutes editorial focus; requires content discipline the owner won't maintain; no SEO value for a small production house | Focus SEO on project pages with proper metadata |
| Client login / project delivery portal | "Let clients see their deliverables" | Completely separate product; security implications; out of scope for portfolio + lead gen | Use Vimeo's built-in private sharing/password-protected links for delivery |
| Real-time chat widget (Intercom, Drift) | "Capture leads immediately" | Clutters dark aesthetic; notification dot fights with premium visual hierarchy; most production clients email | Prominent contact form + CTA buttons; fast email response sets tone |
| E-commerce / invoice payments | "All-in-one client portal" | Scope explosion; security/PCI compliance; no stated need | Invoice via dedicated tools (HoneyBook, Bonsai) |
| Infinite scroll on portfolio grid | "Show everything" | Destroys perceived curation; premium studios show 12-24 best pieces, not everything | Curated grid of 12-24 projects with publish/unpublish to control visibility |
| Auto-playing audio on hero | "Cinematic atmosphere" | Immediately jarring; browsers block it anyway; users close tab | Muted autoplay video; prominent sound toggle for opt-in audio |
| Dark mode / light mode toggle | "User preference" | The dark editorial aesthetic IS the brand; offering a light mode dilutes it | Hardcode dark theme; no toggle needed |

---

## Feature Dependencies

```
Hero Video (autoplay, muted)
    └──requires──> MP4/WebM asset strategy (not Vimeo)
                       └──requires──> Admin: Upload/manage preview clips

Portfolio Grid
    └──requires──> Project data model (title, client, services, year, Vimeo ID, preview clip URL)
                       └──requires──> Database (Prisma + PostgreSQL/SQLite)
                                          └──requires──> Admin CMS (CRUD for projects)

Hover-to-play preview
    └──requires──> MP4 preview clips (not Vimeo iframes)
    └──requires──> IntersectionObserver / lazy load strategy

Project Detail Page
    └──requires──> Dynamic routing [slug] or [id]
    └──requires──> Vimeo embed (full-length, lazy)
    └──requires──> Project data from DB

Admin: Drag-and-drop reorder
    └──requires──> sortOrder field in project schema
    └──requires──> Admin auth (protected /admin route)

Admin: Analytics dashboard
    └──requires──> Event tracking (video plays, page views)
    └──requires──> Events table in DB or third-party analytics ingestion

Admin: Contact inbox
    └──requires──> Contact form (public-facing)
    └──requires──> Messages table in DB

Page transitions (Framer Motion)
    └──requires──> Next.js App Router layout structure
    └──enhances──> Scroll-triggered reveals (same animation library)

Project filtering by category
    └──enhances──> Portfolio grid
    └──requires──> Category/tag field in project schema

OG image per project
    └──requires──> Project detail page
    └──requires──> Next.js generateMetadata
```

### Dependency Notes

- **Hover-to-play requires MP4 clips, not Vimeo:** This is a hard technical dependency. The video strategy decision gates the entire grid UX.
- **Admin CMS requires auth first:** No sense building CRUD before the /admin route is protected.
- **Analytics requires event instrumentation:** Can't show a dashboard without first recording events. Instrumentation goes in during frontend build.
- **Page transitions require App Router layout structure:** Must be established in Phase 1 before adding animation layers.
- **Drag-and-drop reorder requires sortOrder in schema:** Schema must be designed with this field from day one, not retrofitted.

---

## MVP Definition

### Launch With (v1)

Minimum that makes VLACOVISION feel like a premium production house online.

- [ ] Hero video (muted autoplay MP4) — first impression is everything
- [ ] Portfolio grid (12-24 projects) with hover-to-play MP4 previews — core product
- [ ] Project detail pages with full Vimeo embed + metadata — where clients convert
- [ ] Brand trust logos (Nike, Disney, Lululemon, etc.) — instant credibility
- [ ] About section — humanizes the brand
- [ ] Contact form (public) + messages stored in DB — lead gen endpoint
- [ ] Multiple CTAs linking to contact — addresses current site's CTA weakness
- [ ] Admin: Project CRUD (add/edit/delete) — owner independence
- [ ] Admin: Publish/unpublish — content control
- [ ] Admin: Hero video update — owner can change featured content
- [ ] Admin: Authentication — protected /admin route
- [ ] Mobile responsive layout — discovery happens on phone
- [ ] SEO metadata (title, description, OG) per page — findability

### Add After Validation (v1.x)

- [ ] Admin: Drag-and-drop project reorder — owner needs this once they have 20+ projects
- [ ] Admin: Contact inbox in dashboard — after first leads arrive via form
- [ ] Admin: Analytics dashboard — once there's data worth seeing
- [ ] Project filtering by category — once grid exceeds ~16 projects
- [ ] Smooth scroll (Lenis) — polish layer after core is solid
- [ ] Custom cursor — craft signal, low risk to add as enhancement
- [ ] OG image per project — SEO/social enhancement post-launch

### Future Consideration (v2+)

- [ ] Admin: Brand logo management — currently static 14 logos, low churn
- [ ] Advanced analytics (heatmaps, scroll depth) — overkill until traffic is established
- [ ] Magnetic hover effects — high effort, diminishing return past the cursor
- [ ] Project awards / recognition section — needs content to exist first

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero video (MP4 autoplay) | HIGH | LOW | P1 |
| Portfolio grid + hover-to-play | HIGH | MEDIUM | P1 |
| Project detail pages | HIGH | LOW | P1 |
| Brand trust logos | HIGH | LOW | P1 |
| Contact form | HIGH | LOW | P1 |
| Mobile responsive | HIGH | MEDIUM | P1 |
| SEO metadata | HIGH | LOW | P1 |
| Admin auth + CRUD | HIGH | HIGH | P1 |
| Admin publish/unpublish | HIGH | LOW | P1 |
| Page transitions (Framer Motion) | MEDIUM | MEDIUM | P2 |
| Scroll-triggered reveals | MEDIUM | LOW | P2 |
| Admin drag-and-drop reorder | MEDIUM | MEDIUM | P2 |
| Admin contact inbox | MEDIUM | LOW | P2 |
| Admin analytics dashboard | MEDIUM | HIGH | P2 |
| Project filtering | MEDIUM | MEDIUM | P2 |
| OG image per project | MEDIUM | LOW | P2 |
| Smooth scroll (Lenis) | LOW | LOW | P2 |
| Custom cursor | LOW | MEDIUM | P3 |
| Magnetic hover effects | LOW | HIGH | P3 |
| Admin logo management | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch — site is broken or embarrassing without it
- P2: Should have — add when core is working, before calling it done
- P3: Nice to have — future milestone

---

## Competitor Feature Analysis

Analysis based on training knowledge of premium motion design / production studio sites as of mid-2025 (Buck, ManvsMachine, Instrument, Hype, Psyop, Object & Animal, TBWA\Media Arts Lab). No live site crawls were possible.

| Feature | Buck / ManvsMachine tier | Mid-tier production house | VLACOVISION approach |
|---------|--------------------------|--------------------------|----------------------|
| Hero | Full-bleed video reel, often multi-clip montage | Static hero image or basic video | Full-bleed MP4 hero, single best clip |
| Grid | Editorial masonry, variable sizes | Equal-size thumbnails | Editorial grid, some size variation |
| Hover video | Native MP4, instant play | Vimeo iframe (slow) or GIF | Native MP4 clips, preloaded on hover |
| Page transitions | Custom route animations, often horizontal wipes | None or basic fade | Framer Motion AnimatePresence fade/slide |
| Cursor | Custom cursor with project title reveal | Default browser cursor | Custom cursor as v1.x enhancement |
| Smooth scroll | Lenis or proprietary | None | Lenis post-launch |
| Contact | Minimal — email only, often no form | Generic contact page | Form + email, messages in admin inbox |
| Admin | Headless CMS (Contentful/Sanity) or custom | None (dev updates manually) | Custom admin panel (owner non-technical) |
| SEO | Strong per-project metadata | Weak, often no OG | Next.js generateMetadata, OG per project |
| Mobile | Designed for desktop-first, mobile adequate | Responsive | Mobile-first responsive, video degrades gracefully |

---

## Sources

- PROJECT.md — validated requirements from owner consultation (HIGH confidence)
- Training knowledge: Buck (buck.tv), ManvsMachine (manvsmachine.co.uk), Instrument (instrument.com), Hype (wearehype.io), Psyop — observed patterns as of mid-2025 (MEDIUM confidence — live sites may have evolved)
- Industry consensus: Vimeo Developer Docs on iframe initialization latency; MDN on `<video>` autoplay policies; Next.js App Router docs on metadata API (HIGH confidence for technical constraints)
- Note: WebSearch, WebFetch, and Bash tools were unavailable during this research session. All findings derive from training data and PROJECT.md. Confidence is MEDIUM on competitive feature specifics; HIGH on technical constraints and the MP4-vs-iframe video strategy.

---
*Feature research for: Premium videographer portfolio + admin CMS (VLACOVISION)*
*Researched: 2026-03-30*
