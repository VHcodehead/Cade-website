---
phase: 05-admin-cms
plan: 05
subsystem: ui
tags: [prisma, server-actions, nextjs, admin, messages]

requires:
  - phase: 05-01-admin-shell
    provides: verifySession DAL, admin layout, design tokens (bg-bg-card, bg-bg-elevated, text-text-muted, accent)
  - phase: 02-auth-system-and-data-layer
    provides: verifySession, db client, ContactSubmission model

provides:
  - markRead and deleteMessage Server Actions in src/app/actions/messages.ts
  - Message inbox at /admin/messages with unread count badge and read/unread visual distinction
  - Message detail page at /admin/messages/[id] with auto-mark-read on view
  - Delete from both list and detail views
  - MessageList client component with startTransition delete and window.confirm

affects: [05-admin-cms]

tech-stack:
  added: []
  patterns:
    - Server Action called directly from Server Component (markRead on detail page render — server-to-server, no form)
    - deleteMessage.bind(null, id) in form action for redirect after delete
    - useTransition for async delete in client component without loading state complexity

key-files:
  created:
    - src/app/actions/messages.ts
    - src/app/(admin)/admin/messages/page.tsx
    - src/app/(admin)/admin/messages/[id]/page.tsx
    - src/components/admin/message-list.tsx
  modified: []

key-decisions:
  - "markRead called directly from Server Component on page render — no form or client event needed for server-to-server action call"
  - "deleteMessage.bind(null, id) in <form action> on detail page — natural redirect to /admin/messages after delete without JS"
  - "useTransition wraps deleteMessage in MessageList client component — pending state disables button without full page suspend"

patterns-established:
  - "Server Action direct call from Server Component: import action, call await action(id) inline — no RPC layer needed"
  - "Form delete with bind: <form action={deleteMessage.bind(null, id)}> for native form post redirect pattern"

requirements-completed: [ADMIN-12]

duration: 2min
completed: 2026-03-30
---

# Phase 05 Plan 05: Message Inbox Summary

**Email-inbox-style contact message viewer with markRead/deleteMessage Server Actions, bold unread styling, auto-mark-read on detail view, and delete from both list and detail**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-30T18:02:14Z
- **Completed:** 2026-03-30T18:04:30Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- markRead and deleteMessage Server Actions with verifySession guard and revalidatePath for both /admin/messages and /admin
- Message inbox page showing all submissions sorted by date, unread count badge in heading, passes to MessageList client component
- MessageList renders each message as clickable row: bold+accent-border for unread, muted for read, name/email/date/preview, delete with window.confirm
- Detail page auto-marks message read on server render by calling markRead directly as a server-to-server action call

## Task Commits

Each task was committed atomically:

1. **Task 1: Message Server Actions and inbox list** - `814443a` (feat)
2. **Task 2: Message detail page with auto-mark-read** - `0de3f6f` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/app/actions/messages.ts` - markRead and deleteMessage Server Actions with verifySession
- `src/app/(admin)/admin/messages/page.tsx` - Inbox Server Component, unread count badge, MessageList integration
- `src/app/(admin)/admin/messages/[id]/page.tsx` - Detail Server Component, auto-markRead, mailto link, delete form
- `src/components/admin/message-list.tsx` - Client component: read/unread styling, delete with confirm, useTransition

## Decisions Made

- Called markRead directly from Server Component on page render — server-to-server action call, no form or client event required
- Used deleteMessage.bind(null, id) in form action on detail page — native form post triggers redirect to inbox naturally
- useTransition in MessageList for async delete — shows pending state on button without full page suspend

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- npm run build fails at `prisma migrate deploy` because local database is not running — this is expected for local dev; Railway deploy runs migration against live DB. The Next.js build itself (npx next build) fails only due to pre-existing missing components in logos/settings/projects pages (not yet built in subsequent plans). All new files pass TypeScript type checking cleanly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Message inbox is fully functional end-to-end
- Dashboard unread count (already built in 05-01) reflects actual unread via db.contactSubmission.count({ where: { read: false } })
- Subsequent plans (projects CRUD, settings, logos) can build independently

---
*Phase: 05-admin-cms*
*Completed: 2026-03-30*
