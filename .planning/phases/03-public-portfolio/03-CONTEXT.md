# Phase 3: Public Portfolio - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete public-facing site — hero video, hover-to-play portfolio grid, project detail pages, brand logos, about section, contact form with multiple CTAs, SEO metadata, and responsive layout. All content served from database via Prisma. This is the core product that visitors and potential clients experience.

</domain>

<decisions>
## Implementation Decisions

### Hero Section
- Full-viewport height (100vh) hero with muted autoplay video (Vimeo embed or MP4 if available)
- Minimal overlay: VLACOVISION logo text top-left, sound toggle bottom-right
- Subtle gradient at bottom fading to black for smooth transition into content
- No tagline or CTA in the hero — let the video speak
- Subtle animated scroll indicator (chevron) at bottom center
- First CTA ("Start a Project") appears immediately after hero section

### Portfolio Grid
- 2-column editorial grid on desktop, single column on mobile
- Variable aspect ratios — some projects get a larger "featured" card spanning both columns for visual rhythm
- Info overlay on hover: project title + client name fade in over the video
- Below each card: small text with project title and one-line description
- No infinite scroll — show all published projects in a curated grid
- Click opens project detail page

### Hover-to-Play Video (UPDATED — no MP4 clips available)
- Default state: Vimeo thumbnail image (fetched via Vimeo oEmbed API)
- On hover (desktop): load lightweight Vimeo player iframe (muted, autoplay, no controls, loop)
- Pre-connect to Vimeo CDN on page load for faster iframe loading
- On mobile: tap opens project detail page directly (no hover state on touch devices)
- Future upgrade path: admin panel has previewClipUrl field ready for MP4 clips when available

### Project Detail Pages
- Full-width Vimeo embed at top (facade pattern — poster image, click to load iframe for performance)
- Project metadata: Client, Services, Year (displayed as sidebar or inline)
- Project description below video
- "Next Project" / "Previous Project" navigation at bottom
- Back to portfolio link
- CTA at bottom: "Like what you see? Let's talk." → links to contact form

### Brand Logo Section
- Horizontal strip below hero / above portfolio grid
- "Trusted by" label in small uppercase
- Logos grayscale by default, full color on hover (subtle polish)
- Auto-scrolling marquee if many logos, static grid if fewer

### Contact Form & CTAs
- CTAs placed at: after hero section, after brand logos, at bottom of every project detail page, in footer
- CTA text: "Start a Project" (primary, accent-colored) and "Get in Touch" (secondary)
- Contact form fields: name, email, company (optional), message
- Full-width section with dark background, accent-colored (#FF4400) submit button
- Success state: "Thanks! We'll be in touch." inline message (no page redirect)
- Form submissions stored in database (ContactSubmission model)

### About Section
- Clean, typographic section — large headline "CREATIVE VISION"
- 2-3 sentences about VLACOVISION (from existing site copy)
- No team photos — keep it editorial and text-driven
- Content pulled from SiteConfig database model (editable in Phase 5 admin)

### Navigation
- Fixed header — transparent over hero, solid dark (#0A0A0A) on scroll
- Links: Work, About, Contact
- VLACOVISION logo on the left
- Smooth scroll to sections for same-page links

### Footer
- Three columns: VLACOVISION (location), Contact (email), Follow (Instagram, Vimeo)
- Copyright line at bottom
- One more CTA in footer: "Start a Project" link
- Dark background consistent with site aesthetic

### SEO
- Unique meta title, description, OG tags per page via Next.js generateMetadata
- Project detail pages get project-specific metadata
- Semantic HTML with proper heading hierarchy (h1 → h2 → h3)
- Image optimization via Next.js Image component for logos and thumbnails

### Responsive Design
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

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/globals.css` — Full dark design system tokens (colors, fonts, spacing)
- `src/lib/db.ts` — PrismaClient singleton for all data queries
- `prisma/schema.prisma` — Project, SiteConfig, ContactSubmission models ready
- `prisma/seed.ts` — 22 projects with real Vimeo IDs already seeded
- `public/assets/` — 19 brand logo files (Nike, Disney, Lululemon, etc.)
- `src/components/providers/motion-provider.tsx` — LazyMotion wrapper (animations added in Phase 4)

### Established Patterns
- Next.js 16 App Router with route groups — `(public)` group for public pages
- Prisma 7 with PrismaPg adapter — query pattern in db.ts
- Tailwind v4 CSS-first config — use @theme tokens for all styling
- Server Components by default — client components at leaf nodes only

### Integration Points
- `src/app/layout.tsx` — Root layout with fonts + MotionProvider
- `next.config.ts` — Has redirects, add Vimeo remote patterns for images
- `proxy.ts` — Already handles admin auth, public routes pass through
- Database — 22 projects seeded, SiteConfig for about/contact content

</code_context>

<specifics>
## Specific Ideas

- Editorial grid inspired by ManvsMachine/Buck production studio sites
- Grayscale → color logo hover effect for brand trust section
- Multiple strategic CTAs to fix the current vlacovision.com's critical CTA weakness
- Vimeo oEmbed API for thumbnails (same approach as current site but optimized)
- Facade pattern for project detail video (poster → click → iframe) for performance
- "Next/Previous Project" navigation on detail pages for easy portfolio browsing

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-public-portfolio*
*Context gathered: 2026-03-30*
