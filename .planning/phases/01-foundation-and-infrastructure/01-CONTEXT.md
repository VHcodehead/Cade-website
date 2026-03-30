# Phase 1: Foundation and Infrastructure - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Bootstrap the Next.js project with TypeScript, Tailwind CSS, Prisma ORM, and Framer Motion. Establish the dark editorial design system. Configure SEO redirects from old URL structure. Deploy to Railway with PostgreSQL. Every subsequent phase builds on this foundation without revisiting infrastructure decisions.

</domain>

<decisions>
## Implementation Decisions

### Design System
- Color palette: Pure black background (#0A0A0A), off-white text (#F5F5F5), burnt orange accent (#FF4400 — existing brand color), subtle grays for cards/sections (#111111, #1A1A1A)
- Typography: Premium sans-serif — Inter or variable font like Syne for headings + Inter for body. Large, confident headings. Tight letter-spacing on uppercase labels
- Spacing: 8px grid system. Generous whitespace — videos are the star, let them breathe. Full-bleed sections
- Overall aesthetic: ManvsMachine meets Buck — dark canvas, motion-first, editorial typography, video-centric

### Project Structure
- Clean slate Next.js project in repo root — move old files to /legacy folder (git history preserves them)
- Migrate 22 project Vimeo IDs and metadata into a Prisma seed script that populates the database
- Copy brand logos from /assets into Next.js /public/assets/
- Old project HTML files become database records, not static files

### Deployment
- Railway confirmed as deployment target
- PostgreSQL via Railway addon for database
- Prisma binaryTargets: ["native", "linux-musl-openssl-3.0.x"] for Railway containers
- postinstall: "prisma generate" in package.json
- Build command: prisma migrate deploy && next build
- Verify Next.js version (15 vs 16) via npm show next version before bootstrapping

### Claude's Discretion
- Exact Tailwind config structure and custom theme extension approach
- Next.js App Router folder organization (route groups, layouts)
- ESLint and Prettier configuration details
- Prisma schema field types and relations specifics
- Whether to use Turbopack for dev server

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Brand logos in /assets/ (14 PNG/JPG files) — copy to /public/assets/ in new project
- Vimeo IDs from index.html data attributes — extract into seed script data
- Project metadata (titles, descriptions, clients) from index.html and projects/*.html — seed data source

### Established Patterns
- Existing CSS uses custom properties (:root variables) — will translate naturally to Tailwind design tokens
- Current color scheme (#0A0A0A, #FF4400, #F5F5F5) carries forward as brand identity

### Integration Points
- Vimeo Player API (CDN script) — will become a React component wrapper in the new stack
- Express server.js — replaced entirely by Next.js server
- 22 project HTML files at /projects/*.html — need 301 redirects to new /projects/[slug] routes

</code_context>

<specifics>
## Specific Ideas

- Dark editorial aesthetic referencing ManvsMachine and Buck production studio sites
- Keep the existing burnt orange (#FF4400) accent color — it's the brand
- Railway is the confirmed deployment platform (user already uses it)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-and-infrastructure*
*Context gathered: 2026-03-30*
