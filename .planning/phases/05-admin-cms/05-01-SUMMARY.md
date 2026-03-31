---
phase: 05-admin-cms
plan: "01"
subsystem: admin-shell
tags: [admin, sidebar, navigation, schema, dashboard]
dependency_graph:
  requires: []
  provides: [admin-sidebar-shell, admin-layout, schema-extra-fields]
  affects: [05-02, 05-03, 05-04, 05-05]
tech_stack:
  added: []
  patterns: [collapsible-sidebar, server-component-db-queries, flex-layout-shell]
key_files:
  created:
    - src/components/admin/sidebar.tsx
  modified:
    - prisma/schema.prisma
    - src/app/(admin)/layout.tsx
    - src/app/(admin)/admin/page.tsx
decisions:
  - "bg-bg-section used in sidebar active states — plan referenced bg-bg-elevated which does not exist in globals.css design tokens; bg-section (#1A1A1A) is the correct elevated token"
  - "db push skipped — local PostgreSQL not running; schema syntax validated via prisma generate success; migration must run against real DB on deploy"
metrics:
  duration_minutes: 2
  completed_date: "2026-03-30"
  tasks_completed: 2
  files_changed: 4
---

# Phase 5 Plan 01: Admin Shell Summary

**One-liner:** Admin sidebar with hamburger collapse, flex layout shell, and dashboard with live DB counts for projects and unread messages.

## What Was Built

Collapsible sidebar navigation using `usePathname` for active-link highlighting, a flex admin layout shell wrapping all admin routes, and a real dashboard page that queries the DB for project and message counts.

Schema extended: `Project` gains `thumbnailUrl` and `previewClipUrl`; `SiteConfig` gains `location`, `instagramUrl`, `vimeoProfileUrl`. These fields are required by plans 02-05.

## Tasks

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Schema migration + Admin sidebar layout | 133f39f | prisma/schema.prisma, src/components/admin/sidebar.tsx, src/app/(admin)/layout.tsx |
| 2 | Admin dashboard page with overview cards | fc857a6 | src/app/(admin)/admin/page.tsx |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Used correct design token for active sidebar states**
- **Found during:** Task 1
- **Issue:** Plan spec referenced `bg-bg-elevated` which does not exist in `globals.css`. Available elevated token is `bg-section` (`--color-bg-section: #1A1A1A`).
- **Fix:** Replaced `bg-bg-elevated` / `hover:bg-bg-elevated` with `bg-bg-section` / `hover:bg-bg-section` in sidebar active and hover states.
- **Files modified:** src/components/admin/sidebar.tsx
- **Commit:** 133f39f

### Environment Constraints

**DB not available during build:** Local PostgreSQL at `localhost:5432` was unreachable. `npx prisma generate` succeeded (schema syntax valid), `npx tsc --noEmit` passed clean. `npm run build` fails at `prisma migrate deploy` step — this is an environment gate, not a code issue. Schema changes will apply on first deploy to Railway with live DB.

## Self-Check: PASSED

- prisma/schema.prisma — FOUND
- src/components/admin/sidebar.tsx — FOUND
- src/app/(admin)/layout.tsx — FOUND
- src/app/(admin)/admin/page.tsx — FOUND
- Commit 133f39f — FOUND
- Commit fc857a6 — FOUND
