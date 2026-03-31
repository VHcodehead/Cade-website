# Phase 6: Analytics and Advanced Admin - Research

**Researched:** 2026-03-30
**Domain:** Drag-and-drop reordering, analytics event tracking, Prisma aggregation, admin dashboard
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Drag project cards in the admin list to reorder
- New order persists to database (updates sortOrder field)
- Public portfolio grid reflects new order immediately after save
- Use @hello-pangea/dnd (maintained fork of react-beautiful-dnd) or @dnd-kit/core
- Keep it simple — vertical list reorder, not a complex grid drag
- Track page views across public site (silent, no UI impact)
- Track video play events (which projects get watched via hover-to-play or detail page play)
- Store events in an AnalyticsEvent table in the database (append-only)
- Lightweight — a Server Action or API route that fires on page load and video play
- No third-party analytics (Plausible/Fathom) — keep it self-contained for MVP
- Admin page showing: total page visits, video play counts per project, ranked list of most-viewed projects
- Simple chart or table — doesn't need to be fancy
- Date range filter (last 7 days, 30 days, all time) would be nice but optional
- Data sourced from AnalyticsEvent table with aggregation queries

### Claude's Discretion
- Whether to use @hello-pangea/dnd or @dnd-kit/core (research recommends: @hello-pangea/dnd)
- Exact AnalyticsEvent schema (eventType, projectId, page, timestamp, etc.)
- Whether to use Recharts/Chart.js for the dashboard or simple HTML tables
- How to fire analytics events without blocking page render (sendBeacon vs fetch)
- Aggregation query approach (raw SQL vs Prisma groupBy)

### Deferred Ideas (OUT OF SCOPE)
None — this is the final phase.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ADMIN-07 | Drag-and-drop project reordering in admin | @hello-pangea/dnd DragDropContext/Droppable/Draggable pattern; optimistic reorder with useOptimistic; Server Action to batch-update sortOrder |
| ANLYT-01 | Track page views across public site | Route Handler POST at /api/analytics/event; sendBeacon from client component useEffect; silent, non-blocking |
| ANLYT-02 | Track video play events (which projects get watched) | Same Route Handler; eventType='VIDEO_PLAY' with projectId; fire from hover-to-play and detail page video components |
| ANLYT-03 | Analytics dashboard in admin: visits, video plays, popular projects | Prisma groupBy for per-project aggregation; _count on projectId; date range with where.createdAt gte/lte; Recharts BarChart or HTML tables |
</phase_requirements>

---

## Summary

Phase 6 adds two independent capabilities to the admin panel: drag-and-drop project reordering and a self-hosted analytics system. Both are well-supported by the existing tech stack with no risky dependencies.

For drag-and-drop, the choice is clear: `@hello-pangea/dnd@18.0.1` explicitly declares `react: '^18.0.0 || ^19.0.0'` as a peer dependency and was published February 2025. The legacy `@dnd-kit/core@6.3.1` only requires `react: >=16.8.0` (works technically) but its peer dependency declaration predates React 19 and its last update was December 2024 — the newer `@dnd-kit/react@0.3.2` is still pre-1.0 and experimental. Use `@hello-pangea/dnd` for vertical list reorder: its `DragDropContext → Droppable → Draggable` API is purpose-built for this pattern and will integrate cleanly with the existing `ProjectList` component.

For analytics, the recommended pattern is a lightweight Route Handler at `POST /api/analytics/event` that the client calls via `navigator.sendBeacon` (with `fetch` keepalive fallback). Server Actions are a poor fit for fire-and-forget analytics because they require a network round-trip response and add unnecessary overhead to page rendering. The Route Handler receives the event payload, writes to an `AnalyticsEvent` Prisma model, and returns immediately. The dashboard uses `prisma.analyticsEvent.groupBy` with `_count` to aggregate per-project view and play totals. `recharts@3.8.1` explicitly supports React 19 and is the lightest chart option if charts are desired; otherwise a styled HTML table is sufficient for MVP.

**Primary recommendation:** Use `@hello-pangea/dnd` for drag-and-drop. Use a Route Handler + sendBeacon for analytics event ingestion. Use Prisma `groupBy` for aggregation. Use a simple HTML table (not Recharts) for the MVP dashboard — add Recharts only if charts are explicitly needed.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @hello-pangea/dnd | 18.0.1 | Vertical list drag-and-drop | Explicit React 19 peer dep; maintained fork of react-beautiful-dnd; purpose-built for list reorder |
| recharts | 3.8.1 | Bar/line charts for dashboard | Explicit React 19 peer dep; native SVG; lightest viable chart lib for Next.js |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none new) | — | Analytics ingestion | Use existing Next.js Route Handler pattern |
| (none new) | — | Aggregation | Use existing Prisma `db.analyticsEvent.groupBy()` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @hello-pangea/dnd | @dnd-kit/core 6.3.1 | dnd-kit works with React 19 but peer dep declaration is pre-19; less certainty; API more complex for simple vertical list |
| @hello-pangea/dnd | @dnd-kit/react 0.3.2 | Pre-1.0, experimental, breaking changes expected |
| Route Handler POST | Server Action | Server Actions are request/response; sendBeacon can't call them directly; not suitable for fire-and-forget |
| HTML table | Recharts | Recharts adds ~100KB; only worth it if bar charts are required; HTML table is zero-dependency |

**Installation:**
```bash
npm install @hello-pangea/dnd
# recharts only if charts chosen over table:
npm install recharts
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── api/
│   │   └── analytics/
│   │       └── event/
│   │           └── route.ts          # POST analytics ingestion endpoint
│   ├── (admin)/
│   │   └── admin/
│   │       └── analytics/
│   │           └── page.tsx          # Analytics dashboard (Server Component)
│   └── actions/
│       └── projects.ts               # Add reorderProjects() Server Action here
├── components/
│   ├── admin/
│   │   ├── project-list.tsx          # Enhanced with DragDropContext
│   │   └── analytics-table.tsx       # Dashboard stats table (client if interactive)
│   └── analytics/
│       └── page-tracker.tsx          # 'use client' — fires sendBeacon on mount
```

### Pattern 1: @hello-pangea/dnd Vertical Sortable List
**What:** Wrap the existing `ProjectList` with `DragDropContext`. Each row becomes a `Draggable` inside a single `Droppable`. `onDragEnd` fires when the user drops, giving source and destination indices. Reorder state optimistically, then call the Server Action to persist.

**When to use:** Any vertical list where items need persistent reordering in an admin UI.

**Key API:**
```typescript
// Source: https://github.com/hello-pangea/dnd
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd'

// onDragEnd signature:
function handleDragEnd(result: DropResult) {
  const { source, destination } = result
  if (!destination) return                  // dropped outside list
  if (destination.index === source.index) return  // no change

  // reorder local array
  const reordered = Array.from(items)
  const [moved] = reordered.splice(source.index, 1)
  reordered.splice(destination.index, 0, moved)

  // optimistic update, then Server Action
  startTransition(async () => {
    dispatchOptimistic({ type: 'reorder', items: reordered })
    await reorderProjects(reordered.map((p, i) => ({ id: p.id, sortOrder: i })))
  })
}
```

**JSX structure:**
```tsx
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="projects">
    {(provided) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {items.map((project, index) => (
          <Draggable key={project.id} draggableId={project.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {/* existing project row content */}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

**CRITICAL:** `provided.placeholder` must be rendered inside the `Droppable` render prop or the list collapses during drag.

### Pattern 2: reorderProjects Server Action
**What:** Accept an array of `{ id, sortOrder }` pairs and batch-update the database. Use Prisma `$transaction` to apply all updates atomically.

**When to use:** After every successful drag-and-drop end event.

```typescript
// src/app/actions/projects.ts — add to existing file
export async function reorderProjects(
  items: Array<{ id: string; sortOrder: number }>
): Promise<void> {
  await verifySession()

  await db.$transaction(
    items.map(({ id, sortOrder }) =>
      db.project.update({ where: { id }, data: { sortOrder } })
    )
  )

  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
}
```

### Pattern 3: Analytics Route Handler (fire-and-forget ingestion)
**What:** A `POST /api/analytics/event` Route Handler that receives a JSON payload, writes one `AnalyticsEvent` row, and returns 204.

**When to use:** Called from client components via `navigator.sendBeacon` on page load and video play. Never awaited by the caller.

```typescript
// src/app/api/analytics/event/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventType, page, projectId } = body

    await db.analyticsEvent.create({
      data: {
        eventType: eventType ?? 'PAGE_VIEW',
        page: page ?? '/',
        projectId: projectId ?? null,
      },
    })
  } catch {
    // silent — analytics must never error the page
  }

  return new NextResponse(null, { status: 204 })
}
```

### Pattern 4: Client-side sendBeacon tracker
**What:** A `'use client'` component that fires on mount using `useEffect`. Added to public pages and video components.

```typescript
// src/components/analytics/page-tracker.tsx
'use client'

import { useEffect } from 'react'

type Props = {
  page: string
  eventType?: 'PAGE_VIEW' | 'VIDEO_PLAY'
  projectId?: string
}

export function AnalyticsTracker({ page, eventType = 'PAGE_VIEW', projectId }: Props) {
  useEffect(() => {
    const payload = JSON.stringify({ eventType, page, projectId })
    const url = '/api/analytics/event'

    if (navigator.sendBeacon) {
      // sendBeacon requires Blob for JSON content-type
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon(url, blob)
    } else {
      fetch(url, { method: 'POST', body: payload, keepalive: true,
        headers: { 'Content-Type': 'application/json' } })
    }
  }, []) // fire once on mount

  return null
}
```

**Usage in pages:**
```tsx
// app/(public)/projects/[slug]/page.tsx — add to JSX
<AnalyticsTracker page={`/projects/${slug}`} projectId={project.id} />
```

**Usage for video play events:** Pass `eventType="VIDEO_PLAY"` and `projectId` when hover-to-play activates or the Vimeo iframe player fires.

### Pattern 5: Prisma groupBy Analytics Aggregation
**What:** Aggregate `AnalyticsEvent` rows to produce per-project counts and total page views for the dashboard.

```typescript
// Used in admin analytics page (Server Component)
const since = new Date()
since.setDate(since.getDate() - 30) // last 30 days

// Total page views
const pageViewCount = await db.analyticsEvent.count({
  where: { eventType: 'PAGE_VIEW', createdAt: { gte: since } },
})

// Video plays per project (ranked)
const videoPlays = await db.analyticsEvent.groupBy({
  by: ['projectId'],
  where: {
    eventType: 'VIDEO_PLAY',
    projectId: { not: null },
    createdAt: { gte: since },
  },
  _count: { projectId: true },
  orderBy: { _count: { projectId: 'desc' } },
})
// Then join project titles:
const projectIds = videoPlays.map((r) => r.projectId!)
const projects = await db.project.findMany({
  where: { id: { in: projectIds } },
  select: { id: true, title: true },
})
```

Source: https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing

### Anti-Patterns to Avoid
- **Calling a Server Action from sendBeacon:** Server Actions expect a specific form-encoded or JSON format and return a response. sendBeacon is fire-and-forget; mismatch causes silent failures.
- **Tracking in Server Components:** Server Components run at request time; you cannot attach `useEffect` to them. Analytics must be a `'use client'` component.
- **Awaiting analytics in page render:** Any analytics call in the render path blocks LCP. Always fire via `useEffect` or client-only after paint.
- **Not including `provided.placeholder`:** Omitting the placeholder from the Droppable render prop collapses the list height during drag, making drop targets invisible.
- **Reordering sortOrder as sequential 0-N integers:** Store them as `index` directly (0, 1, 2...) — do not store sparse values or you'll need a sort step on every read.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible drag handles, keyboard support, screen reader announcements | Custom mouse/touch drag | @hello-pangea/dnd | Focus management, ARIA announcements, and cross-browser touch events are 10K+ lines of edge-case code |
| Drag ghost/placeholder during drag | CSS clone hacks | @hello-pangea/dnd Draggable snapshot | Library owns the drag state; custom clones conflict with its portal rendering |
| Batch DB update as separate per-row requests | N individual Server Actions | Prisma `$transaction([...])` | Atomicity; one request instead of N concurrent Server Actions racing each other |
| Date range math | Custom timestamp arithmetic | JavaScript `Date` + `new Date().setDate()` | Sufficient for 7/30/all-time; no date library needed |

---

## Common Pitfalls

### Pitfall 1: @hello-pangea/dnd + React StrictMode double-invocation
**What goes wrong:** In development, React 19 StrictMode double-invokes effects. The drag library manages its own internal state; this does not cause visible issues but can produce console warnings in dev.
**Why it happens:** StrictMode mounts/unmounts components twice to surface side-effect bugs.
**How to avoid:** No action needed — the library handles it. Do not disable StrictMode to "fix" it.
**Warning signs:** Console warnings about "unstable_batchedUpdates" in development only; safe to ignore.

### Pitfall 2: sortOrder gap after reorder
**What goes wrong:** After drag-and-drop, sortOrder values become sparse (e.g., 0, 2, 5) if not reassigned as a full sequence.
**Why it happens:** Only the moved item's sortOrder is updated, not the entire list.
**How to avoid:** Always send the full reordered array to `reorderProjects` and reassign `sortOrder` as the item's array index (0, 1, 2...).

### Pitfall 3: sendBeacon with plain string body (wrong Content-Type)
**What goes wrong:** `navigator.sendBeacon(url, JSON.stringify(data))` sends `Content-Type: text/plain;charset=UTF-8`. The Route Handler's `request.json()` still parses it, but it is technically incorrect.
**Why it happens:** sendBeacon defaults to text/plain for strings.
**How to avoid:** Wrap in a Blob: `new Blob([payload], { type: 'application/json' })`.

### Pitfall 4: Analytics breaking on ad-blockers
**What goes wrong:** Ad-blockers block requests to paths matching `/api/analytics/*`.
**Why it happens:** Common filter lists target `analytics` in the URL path.
**How to avoid:** Acceptable for MVP — self-hosted analytics data will be slightly undercounted but not broken. Rename the route to `/api/collect` or `/api/events` if undercounting is unacceptable.

### Pitfall 5: Prisma groupBy returning null projectId rows
**What goes wrong:** `analyticsEvent.groupBy({ by: ['projectId'] })` returns a group where `projectId: null` (events without a project).
**Why it happens:** NULL is a valid group key in PostgreSQL.
**How to avoid:** Add `where: { projectId: { not: null } }` before grouping.

### Pitfall 6: DragDropContext SSR hydration mismatch
**What goes wrong:** `@hello-pangea/dnd` uses browser-only APIs; if the `ProjectList` is rendered server-side, hydration fails.
**Why it happens:** The file already has `'use client'` — so this is already handled. No action needed.
**Warning signs:** "Hydration mismatch" errors — would only occur if `'use client'` is removed.

---

## Code Examples

### AnalyticsEvent Prisma Schema Addition
```prisma
model AnalyticsEvent {
  id        String   @id @default(cuid())
  eventType String   // 'PAGE_VIEW' | 'VIDEO_PLAY'
  page      String   // e.g. '/', '/projects/my-slug'
  projectId String?  // null for non-project page views
  createdAt DateTime @default(now())

  @@index([eventType, createdAt])
  @@index([projectId, eventType])
}
```

**Rationale:**
- No foreign key to `Project` — analytics must survive project deletion without cascading data loss
- `projectId` as nullable String (not a relation) — matches existing `Project.id` type (cuid) without FK constraint
- Compound indexes on `(eventType, createdAt)` and `(projectId, eventType)` cover all groupBy query patterns
- No update path needed — append-only table, no `updatedAt`

### Date Range Filter Helper
```typescript
function getDateFilter(range: '7d' | '30d' | 'all'): Date | undefined {
  if (range === 'all') return undefined
  const since = new Date()
  since.setDate(since.getDate() - (range === '7d' ? 7 : 30))
  return since
}

// Usage in groupBy:
const since = getDateFilter(selectedRange)
const where = since ? { createdAt: { gte: since } } : {}
```

### Full Analytics Dashboard Query
```typescript
// app/(admin)/admin/analytics/page.tsx — Server Component
export default async function AnalyticsDashboard({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  await verifySession()
  const { range = '30d' } = await searchParams
  const since = getDateFilter(range as '7d' | '30d' | 'all')
  const createdAt = since ? { gte: since } : undefined

  const [totalViews, videoPlays] = await Promise.all([
    db.analyticsEvent.count({
      where: { eventType: 'PAGE_VIEW', createdAt },
    }),
    db.analyticsEvent.groupBy({
      by: ['projectId'],
      where: { eventType: 'VIDEO_PLAY', projectId: { not: null }, createdAt },
      _count: { projectId: true },
      orderBy: { _count: { projectId: 'desc' } },
    }),
  ])

  const projectIds = videoPlays.map((r) => r.projectId!)
  const projects = await db.project.findMany({
    where: { id: { in: projectIds } },
    select: { id: true, title: true },
  })
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.title]))

  // render table...
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-beautiful-dnd (Atlassian, deprecated) | @hello-pangea/dnd (community fork) | 2022 | react-beautiful-dnd is unmaintained; hello-pangea is the active successor |
| @dnd-kit/core (original) | @dnd-kit/react (new adapter, pre-1.0) | 2024-2025 | New architecture but not production-stable; avoid for now |
| API Routes (pages/) | Route Handlers (app/) | Next.js 13 App Router | Route Handlers are the App Router equivalent; no pages/ API routes in this project |
| `useBeforeUnload` for analytics flush | `navigator.sendBeacon` / `visibilitychange` | 2019+ | `beforeunload` unreliable on mobile; sendBeacon is the reliable standard |

**Deprecated/outdated:**
- `react-beautiful-dnd`: Atlassian archived it in 2022; use @hello-pangea/dnd instead
- `pages/api/` API Routes: This project uses App Router; use `app/api/route.ts` format

---

## Open Questions

1. **Video play event trigger location**
   - What we know: Events should fire on hover-to-play and detail page video play
   - What's unclear: The hover-to-play component may not yet exist (PORT-04 is pending); this phase may need to add the `AnalyticsTracker` to it once it's built in Phase 3/5
   - Recommendation: Add a `data-project-id` attribute and fire the event inside the existing video play callback in `project-card.tsx`. If hover-to-play isn't implemented yet, add a TODO comment and track detail page plays only.

2. **Recharts vs HTML table**
   - What we know: Recharts 3.8.1 supports React 19; `react-is` peer dep is now also React 19 compatible per npm
   - What's unclear: Whether the owner wants visual bar charts or a plain ranked table
   - Recommendation: Build the MVP dashboard as an HTML table. The architecture makes swapping in Recharts trivial — just replace the table JSX with `<BarChart>` from recharts.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently installed in project |
| Config file | None — see Wave 0 gaps |
| Quick run command | `npx tsc --noEmit` (type-check only) |
| Full suite command | `npx tsc --noEmit && next build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ADMIN-07 | reorderProjects() updates sortOrder for all items | manual-only | drag items in browser, reload to verify order persists | N/A |
| ADMIN-07 | optimistic reorder reflects immediately without DB round-trip | manual-only | observe instant UI response on drag | N/A |
| ANLYT-01 | POST /api/analytics/event records PAGE_VIEW event | manual-only | `curl -X POST /api/analytics/event -d '{"eventType":"PAGE_VIEW","page":"/"}'` then check DB | ❌ Wave 0 |
| ANLYT-02 | VIDEO_PLAY event fires with correct projectId | manual-only | play video, check DB row exists | N/A |
| ANLYT-03 | Analytics dashboard shows correct totals | manual-only | seed test events, view dashboard, compare counts | N/A |

**Justification for manual-only:** This phase has no test framework installed. The behaviors involve browser drag-and-drop (ADMIN-07), browser beacon API (ANLYT-01/02), and database aggregation UI (ANLYT-03) — all requiring either a browser or a live database. Unit testing the reorder array logic (splice/splice) is the only viable fast test.

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (catches type errors in new Server Actions and Route Handlers)
- **Per wave merge:** `npx tsc --noEmit && next build`
- **Phase gate:** TypeScript clean + manual smoke test of drag-and-drop and analytics event recording before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] No test framework installed — consider adding Vitest if unit tests are desired post-MVP
- [ ] `curl`/`fetch` smoke test script for `POST /api/analytics/event` — manual step

*(If unit testing the reorder array helper is desired, Vitest can be added with `npm install -D vitest` — zero config needed for pure TS functions)*

---

## Sources

### Primary (HIGH confidence)
- npm registry (`npm show`) — @hello-pangea/dnd@18.0.1 peerDependencies confirmed `react: '^18.0.0 || ^19.0.0'`
- npm registry (`npm show`) — @dnd-kit/core@6.3.1 peerDependencies confirmed `react: '>=16.8.0'` (no explicit React 19 declaration)
- npm registry (`npm show`) — recharts@3.8.1 peerDependencies confirmed `react: '^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0'`
- GitHub hello-pangea/dnd package.json — confirmed React 19 support with separate test suites for React 18 and 19
- https://nextjs.org/docs/app/getting-started/route-handlers — Route Handler POST pattern (Next.js 16.2.1 docs)
- https://nextjs.org/docs/app/guides/analytics — sendBeacon + fetch keepalive pattern from official Next.js docs
- https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing — groupBy with _count and where date filter

### Secondary (MEDIUM confidence)
- npm registry — @dnd-kit/react@0.3.2 is pre-1.0, peerDeps include React 19, but experimental
- WebSearch cross-verified: hello-pangea/dnd@18.0.1 published 2025-02-09 (confirmed via npm show time)

### Tertiary (LOW confidence)
- WebSearch: recharts React 19 requires react-is peer dep override — unverified against recharts@3.8.1 specifically; npm show shows react-is is already listed in its peerDependencies with React 19 support, so likely resolved in 3.x

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm registry confirmed peer deps for all candidate libraries
- Architecture: HIGH — based on official Next.js 16 docs and verified Prisma docs
- Pitfalls: MEDIUM — sendBeacon/Content-Type and groupBy null group pitfalls from authoritative sources; StrictMode warning from community (unverified)

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (stable libraries; 30-day window)
