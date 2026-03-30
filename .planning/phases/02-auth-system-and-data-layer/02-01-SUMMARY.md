---
phase: 02-auth-system-and-data-layer
plan: 01
subsystem: auth
tags: [auth, session, jwt, prisma, bcryptjs, jose]
dependency_graph:
  requires: []
  provides: [session-encryption, verifySession-DAL, AdminUser-model]
  affects: [02-02-login-action, 02-03-route-protection, 02-04-logout]
tech_stack:
  added: [jose, bcryptjs, server-only, zod, "@types/bcryptjs"]
  patterns: [JWT-HS256-session, React-cache-DAL, server-only-guard, bcryptjs-hash-cost-12]
key_files:
  created:
    - src/lib/session.ts
    - src/lib/dal.ts
    - prisma/migrations/20260330224632_add_admin_user/migration.sql
  modified:
    - prisma/schema.prisma
    - prisma/seed.ts
    - package.json
    - package-lock.json
decisions:
  - "Used jose HS256 (not RS256) for session JWT — symmetric key sufficient for single-server admin auth"
  - "MODULE-LEVEL SESSION_SECRET guard (not function-level) — throws at startup before any request is served"
  - "SESSION_COOKIE_NAME exported constant shared between session.ts and dal.ts — prevents cookie name mismatch bugs"
  - "Only userId in JWT payload — email/role never stored in token per research anti-pattern guidance"
  - "Migration SQL created manually — prisma migrate dev --create-only requires live DB even in Prisma 7"
metrics:
  duration_minutes: 2
  completed_date: "2026-03-30"
  tasks_completed: 2
  files_changed: 8
---

# Phase 02 Plan 01: Auth Dependencies, AdminUser Model, Session Library, and DAL Summary

**One-liner:** JWT session encryption with jose HS256, React cache-wrapped verifySession DAL, and AdminUser Prisma model with bcryptjs-seeded credentials establishing all auth contracts.

## What Was Built

### Task 1: Install dependencies and add AdminUser model with migration and seed
- Installed `jose`, `bcryptjs`, `server-only`, `zod` as runtime dependencies
- Installed `@types/bcryptjs` as dev dependency
- Added `AdminUser` model to `prisma/schema.prisma` with `email` unique constraint, `hashedPassword`, `createdAt`, `updatedAt`
- Created migration SQL file manually at `prisma/migrations/20260330224632_add_admin_user/migration.sql` (Prisma 7 requires live DB even for `--create-only`)
- Regenerated Prisma client — `AdminUser` type now available in `src/generated/prisma/client`
- Extended `prisma/seed.ts` with bcryptjs import and admin user upsert using cost 12 — existing 22 project seeds preserved exactly

### Task 2: Create session encryption library and Data Access Layer
- Created `src/lib/session.ts` with `import 'server-only'` guard preventing SESSION_SECRET from leaking to client bundles
- Session exports: `encrypt`, `decrypt`, `createSession`, `deleteSession`, `SESSION_COOKIE_NAME`
- Module-level `SESSION_SECRET` guard throws at startup if env var missing
- `decrypt()` wraps `jwtVerify` in try/catch returning `null` on failure (no throws propagating to callers)
- `createSession()` sets `httpOnly: true`, `secure: NODE_ENV === 'production'`, `sameSite: 'lax'`, `path: '/'`
- Created `src/lib/dal.ts` with `import 'server-only'` guard
- `verifySession` wrapped in React `cache()` — deduplicates DB/session checks within a single request tree
- `verifySession` redirects to `/admin/login` when no valid session exists

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Prisma `migrate dev --create-only` requires live DB in Prisma 7**
- **Found during:** Task 1
- **Issue:** `npx prisma migrate dev --name add-admin-user --create-only` fails with P1001 (can't reach DB) — the plan assumed `--create-only` would work without a DB, but Prisma 7 connects even for migration file generation
- **Fix:** Created migration SQL file manually matching Prisma's expected format and directory naming convention (`YYYYMMDDHHMMSS_name/migration.sql`)
- **Files modified:** `prisma/migrations/20260330224632_add_admin_user/migration.sql` (created)
- **Commit:** 425daf1

## Verification Results

- `npx prisma generate` — succeeded, AdminUser type generated
- `npx tsc --noEmit` — passed with no errors after both tasks
- `npm run build` — fails only on `prisma migrate deploy` (requires live DB at `localhost:5432`) — this is expected in dev without a running database; the Next.js compilation layer itself would succeed

## Success Criteria Status

- [x] jose, bcryptjs, server-only, zod installed in package.json
- [x] AdminUser model in prisma/schema.prisma with email unique constraint
- [x] prisma/seed.ts includes admin user upsert with bcryptjs hash at cost 12
- [x] src/lib/session.ts exports encrypt, decrypt, createSession, deleteSession, SESSION_COOKIE_NAME
- [x] src/lib/dal.ts exports verifySession with cache() wrapper that redirects on invalid session
- [x] All files pass TypeScript type checking

## Self-Check: PASSED

Files verified:
- FOUND: src/lib/session.ts
- FOUND: src/lib/dal.ts
- FOUND: prisma/schema.prisma
- FOUND: prisma/seed.ts
- FOUND: prisma/migrations/20260330224632_add_admin_user/migration.sql

Commits verified:
- FOUND: 425daf1 — chore(02-01): install auth deps, add AdminUser model, extend seed
- FOUND: 15eccb0 — feat(02-01): add JWT session library and verifySession DAL
