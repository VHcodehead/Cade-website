# Phase 6: Analytics and Advanced Admin - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

The owner has visibility into which projects get the most attention and can reorder the portfolio to reflect strategic priorities. Drag-and-drop project reordering in admin + analytics tracking (page views, video plays) + analytics dashboard.

</domain>

<decisions>
## Implementation Decisions

### Drag-and-Drop Project Reorder (ADMIN-07)
- Drag project cards in the admin list to reorder
- New order persists to database (updates sortOrder field)
- Public portfolio grid reflects new order immediately after save
- Use @hello-pangea/dnd (maintained fork of react-beautiful-dnd) or @dnd-kit/core
- Keep it simple — vertical list reorder, not a complex grid drag

### Analytics Tracking (ANLYT-01, ANLYT-02)
- Track page views across public site (silent, no UI impact)
- Track video play events (which projects get watched via hover-to-play or detail page play)
- Store events in an AnalyticsEvent table in the database (append-only)
- Lightweight — a Server Action or API route that fires on page load and video play
- No third-party analytics (Plausible/Fathom) — keep it self-contained for MVP

### Analytics Dashboard (ANLYT-03)
- Admin page showing: total page visits, video play counts per project, ranked list of most-viewed projects
- Simple chart or table — doesn't need to be fancy
- Date range filter (last 7 days, 30 days, all time) would be nice but optional
- Data sourced from AnalyticsEvent table with aggregation queries

### Claude's Discretion
- Whether to use @hello-pangea/dnd or @dnd-kit/core (research should recommend)
- Exact AnalyticsEvent schema (eventType, projectId, page, timestamp, etc.)
- Whether to use Recharts/Chart.js for the dashboard or simple HTML tables
- How to fire analytics events without blocking page render (sendBeacon vs fetch)
- Aggregation query approach (raw SQL vs Prisma groupBy)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/admin/project-list.tsx` — Current project list (will be enhanced with drag-and-drop)
- `src/app/actions/projects.ts` — Existing project Server Actions (add reorder action)
- `prisma/schema.prisma` — Project.sortOrder field already exists
- `src/lib/db.ts` — PrismaClient singleton
- Admin sidebar + layout already built

### Established Patterns
- Server Actions with Zod + useActionState/useOptimistic
- verifySession() on every admin page
- Dark theme design tokens

### Integration Points
- Public site components — need to fire analytics events on page load and video play
- `src/components/portfolio/project-card.tsx` — Fire video play event on hover-to-play
- `src/app/(public)/projects/[slug]/page.tsx` — Fire page view + video play events
- Admin dashboard — add analytics link to sidebar (already has the nav structure)

</code_context>

<specifics>
## Specific Ideas

- Drag-and-drop should feel responsive — optimistic update, don't wait for DB round-trip
- Analytics should be invisible to visitors — no loading delay, no visible tracking UI
- Dashboard can be simple tables for MVP — charts are nice-to-have

</specifics>

<deferred>
## Deferred Ideas

None — this is the final phase

</deferred>

---

*Phase: 06-analytics-and-advanced-admin*
*Context gathered: 2026-03-31*
