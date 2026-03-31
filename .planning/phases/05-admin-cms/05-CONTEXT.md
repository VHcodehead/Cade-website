# Phase 5: Admin CMS - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

The owner can manage all site content independently — adding projects, updating the hero, editing the about section, uploading logos, and reading contact messages — without touching code. Full CRUD admin panel behind auth.

</domain>

<decisions>
## Implementation Decisions

### Admin UI Layout
- Clean sidebar layout — sidebar on left with nav links, content area on right
- Sidebar links: Dashboard (overview), Projects, Settings, Brand Logos, Messages
- Minimalist functional design — Linear meets WordPress aesthetic
- Dark theme matching public site (Phase 1 design tokens)
- No bloat — just forms and lists, no complex workflows

### Project Management (ADMIN-01 through ADMIN-06, ADMIN-08)
- Projects list: table/card view with thumbnail, title, client, status (published/draft), sort order
- Create/Edit form: title, client, services, year, description, Vimeo URL, thumbnail URL (auto-fetched from Vimeo oEmbed), published toggle
- Delete: confirmation dialog ("Are you sure? This can't be undone.")
- Publish/Unpublish: toggle switch on the list view — instant, no page reload
- Hero video update: Vimeo URL field in Settings page (updates SiteConfig)

### File Uploads & Media
- URL-based for videos — paste Vimeo URL, system auto-fetches thumbnail
- Brand logos: simple file upload to /public/assets/ via Server Action with formData
- previewClipUrl field stays optional in DB — ready for MP4 clips when available
- No cloud storage for MVP — logo files are small and rarely change

### Settings Page (ADMIN-09, ADMIN-10)
- Single form: hero Vimeo URL, about text, contact email, location, Instagram URL, Vimeo profile URL
- Save button updates SiteConfig in database
- Simple, no tabs or complex layout

### Brand Logo Management (ADMIN-11)
- Grid view of current logos with delete button on each
- Upload new logo: file input + upload button
- No drag-and-drop reorder for logos (marquee displays them all anyway)
- Logos stored in /public/assets/ and tracked in DB (or filesystem scan)

### Contact Messages Inbox (ADMIN-12)
- List view: name, email, date, message preview
- Read/unread status: bold for unread, normal for read
- Click to view full message detail
- Delete messages
- No reply functionality — owner replies via his own email client

### Tablet Responsiveness (RESP-03)
- Admin optimized for desktop, functional on tablet
- Sidebar collapses to hamburger menu on tablet
- All forms usable without horizontal scroll

### Claude's Discretion
- Whether to use a component library (shadcn/ui) for admin forms or custom Tailwind
- Exact table vs card layout for project list
- How to track brand logos (DB records vs filesystem scan of /public/assets/)
- Form validation approach for admin forms (Zod reuse or simpler)
- Dashboard overview content (simple stats or just navigation links)
- Whether logo upload creates a DB record or just saves to filesystem

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/db.ts` — PrismaClient singleton for all queries
- `src/lib/dal.ts` — verifySession() for auth checks on every admin page
- `src/app/actions/auth.ts` — Server Action pattern established (login/logout)
- `src/app/actions/contact.ts` — Server Action with Zod validation pattern (reuse for admin forms)
- `prisma/schema.prisma` — Project, SiteConfig, ContactSubmission, AdminUser models
- `src/lib/vimeo.ts` — getVimeoThumbnail() for auto-fetching thumbnails
- `src/app/globals.css` — Dark design tokens available
- `src/components/ui/cta-button.tsx` — Reusable button component pattern

### Established Patterns
- Server Actions with Zod validation + useActionState (contact form pattern)
- verifySession() as first line in every admin page component
- Route group: (admin) already set up with layout.tsx and force-dynamic
- HTTP-only cookie auth with proxy.ts protection

### Integration Points
- `src/app/(admin)/admin/page.tsx` — Current dashboard placeholder (replace with real dashboard)
- `src/app/(admin)/layout.tsx` — Add sidebar navigation here
- Public site components read from DB — admin writes to same DB, changes reflect immediately
- `src/lib/vimeo.ts` getVimeoThumbnail — reuse when admin saves a project with Vimeo URL

</code_context>

<specifics>
## Specific Ideas

- Keep it WordPress-simple — the owner is non-technical
- Publish/unpublish toggle should feel instant (no page reload)
- Auto-fetch Vimeo thumbnail when URL is pasted — visual feedback that the URL works
- Contact inbox should feel like a simple email list (read/unread, click to expand)
- Dashboard can be simple — just nav cards linking to each section, maybe a message count badge

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-admin-cms*
*Context gathered: 2026-03-31*
