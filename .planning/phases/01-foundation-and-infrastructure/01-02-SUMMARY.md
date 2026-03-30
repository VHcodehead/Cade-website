---
phase: 01-foundation-and-infrastructure
plan: 02
subsystem: infra
tags: [prisma, postgresql, framer-motion, seo-redirects, orm, seed-data]

# Dependency graph
requires:
  - 01-01 (Next.js scaffold with Tailwind v4, TypeScript, src/ structure)
provides:
  - Prisma 7 ORM with Project, SiteConfig, and ContactSubmission models
  - Database client singleton using PrismaPg adapter pattern
  - Seed script with 22 real Vimeo IDs extracted from legacy HTML files
  - 22 permanent SEO redirect rules (old .html URLs to clean slugs)
  - LazyMotion provider wrapping root layout for animation-ready app
affects:
  - All phases requiring database queries (Phases 2-6)
  - All components using Framer Motion animations (Phase 4)
  - SEO: old .html URLs now redirect 308 to new /projects/[slug] routes

# Tech tracking
tech-stack:
  added:
    - prisma@7.6.0
    - "@prisma/client@7.6.0"
    - "@prisma/adapter-pg"
    - pg
    - tsx@4.21.0
    - dotenv
    - framer-motion@latest
  patterns:
    - Prisma 7 prisma-client generator with output to src/generated/prisma
    - Prisma 7 PrismaPg adapter pattern (no binaryTargets, no env() in schema)
    - prisma.config.ts datasource configuration (Prisma 7 replaces schema url)
    - PrismaClient singleton with globalThis for Next.js dev hot reload
    - LazyMotion + domAnimation for lazy-loaded Framer Motion features
    - Client component wrapper (MotionProvider) nested inside Server Component layout

key-files:
  created:
    - prisma/schema.prisma
    - prisma/seed.ts
    - prisma.config.ts
    - src/lib/db.ts
    - src/components/providers/motion-provider.tsx
    - src/generated/prisma/ (auto-generated, gitignored)
  modified:
    - next.config.ts (added 22 redirects + turbopack.root)
    - src/app/layout.tsx (added MotionProvider wrapping children)
    - package.json (postinstall, build script, prisma.seed config)
    - tsconfig.json (added @/* path alias, excluded prisma/ from type check)

key-decisions:
  - "Prisma 7 uses PrismaPg adapter instead of env() in schema — datasource URL moved to prisma.config.ts"
  - "Import from src/generated/prisma/client.ts explicitly (not directory) — Prisma 7 generates no index.ts"
  - "Seed script excluded from tsconfig.json — it is a standalone Node.js script, not part of Next.js app"
  - "Added @prisma/adapter-pg + pg as runtime dependencies — required for Prisma 7 Wasm-based client"
  - "turbopack.root set in next.config.ts to silence workspace root detection warning"

patterns-established:
  - "Prisma 7 adapter pattern: PrismaPg({ connectionString: process.env.DATABASE_URL }) passed to PrismaClient"
  - "Motion pattern: MotionProvider ('use client') wraps children in Server Component layout"
  - "SEO redirect pattern: permanent: true in next.config.ts redirects array emits 308"

requirements-completed:
  - FOUND-02
  - FOUND-03
  - FOUND-04

# Metrics
duration: 22min
completed: 2026-03-30
---

# Phase 1 Plan 02: Prisma ORM, SEO Redirects, and Motion Provider Summary

**Prisma 7 with PostgreSQL adapter, 22-project seed with real Vimeo IDs from legacy HTML, 22 SEO redirect rules, and LazyMotion provider at root layout**

## Performance

- **Duration:** ~22 min
- **Started:** 2026-03-30T21:50:56Z
- **Completed:** 2026-03-30T22:11:12Z
- **Tasks:** 2
- **Files modified:** 6 created, 5 modified

## Accomplishments

- Prisma 7.6.0 configured with `prisma-client` generator outputting to `src/generated/prisma/`, client generates with zero errors
- Prisma schema defines Project (22 fields), SiteConfig, and ContactSubmission models
- Seed script contains all 22 real Vimeo IDs extracted from legacy HTML files via iframe src parsing — no placeholders used
- Database client singleton in `src/lib/db.ts` using PrismaPg adapter for Prisma 7's Wasm-based engine
- All 22 old `.html` URLs mapped in `next.config.ts` with `permanent: true` (308 redirects) to clean `/projects/[slug]` routes
- Framer Motion LazyMotion provider wraps root layout children — `domAnimation` features loaded lazily, server-side boundary maintained
- `npm run build` (via `npx next build`) exits with zero errors and zero warnings

## Task Commits

1. **Task 1: Prisma setup** - `6518792` (feat(01-02): configure Prisma 7 with schema, seed script, and database client)
2. **Task 2: Redirects + LazyMotion** - `ac9a6ab` (feat(01-02): add SEO redirects and Framer Motion LazyMotion provider)

## Files Created/Modified

- `prisma/schema.prisma` — Prisma 7 schema with Project, SiteConfig, ContactSubmission models; datasource db with provider only (no url)
- `prisma/seed.ts` — 22 projects with real Vimeo IDs, upsert-idempotent, plus SiteConfig with hero Vimeo ID 1129060654
- `prisma.config.ts` — Prisma 7 config file handling datasource URL via process.env.DATABASE_URL
- `src/lib/db.ts` — PrismaClient singleton with PrismaPg adapter, imports from `../generated/prisma/client`
- `src/components/providers/motion-provider.tsx` — 'use client' component with LazyMotion + domAnimation + strict mode
- `next.config.ts` — 22 permanent redirect entries + turbopack.root configuration
- `src/app/layout.tsx` — Added MotionProvider import and wrapping around children in body
- `package.json` — postinstall=prisma generate, build=prisma generate && prisma migrate deploy && next build, prisma.seed=tsx
- `tsconfig.json` — Added @/* path alias pointing to src/*, excluded prisma/ directory from type checking

## Decisions Made

- **Prisma 7 uses PrismaPg adapter:** Prisma 7's schema.prisma no longer accepts `url = env("DATABASE_URL")` in the datasource block. The URL is configured via `prisma.config.ts` datasource property, and the PrismaClient constructor requires an explicit adapter (`PrismaPg`). This required installing `@prisma/adapter-pg` and `pg`.
- **Explicit import to `/client.ts`:** Prisma 7 generates `client.ts` as the main entry but no `index.ts` barrel. With TypeScript `moduleResolution: "bundler"`, importing from the directory fails. The fix is to import from `../generated/prisma/client` directly.
- **Seed script excluded from tsconfig:** `prisma/seed.ts` is a standalone Node.js script run via `tsx prisma/seed.ts`. Including it in the Next.js TypeScript compilation causes errors because the generated prisma path resolves differently. Excluding `prisma/` from tsconfig resolves this cleanly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Prisma 7 schema rejected `url = env("DATABASE_URL")` in datasource block**
- **Found during:** Task 1 (Step 3 — prisma generate)
- **Issue:** Running `npx prisma generate` with `url = env("DATABASE_URL")` in schema.prisma failed with: "The datasource property `url` is no longer supported in schema files. Move connection URLs for Migrate to `prisma.config.ts`"
- **Fix:** Removed `url` from schema.prisma datasource block. The `prisma.config.ts` (auto-generated by `prisma init`) already handles the URL via `process.env.DATABASE_URL`. Updated `src/lib/db.ts` and `prisma/seed.ts` to use `PrismaPg` adapter.
- **Files modified:** `prisma/schema.prisma`, `src/lib/db.ts`, `prisma/seed.ts`
- **Commit:** 6518792

**2. [Rule 1 - Bug] Generated Prisma 7 client has no `index.ts` — directory import fails TypeScript resolution**
- **Found during:** Task 1 (TypeScript compile during build)
- **Issue:** TypeScript error "Cannot find module '../generated/prisma'" because Prisma 7 generates `client.ts` but no `index.ts`. `moduleResolution: "bundler"` requires explicit file or index.
- **Fix:** Changed import in `src/lib/db.ts` to `from '../generated/prisma/client'` and similarly in `prisma/seed.ts`.
- **Files modified:** `src/lib/db.ts`, `prisma/seed.ts`
- **Commit:** 6518792

**3. [Rule 1 - Bug] `prisma/seed.ts` included in Next.js TypeScript type check caused module resolution errors**
- **Found during:** Task 1 (TypeScript compile during build)
- **Issue:** Next.js TypeScript check ran against `prisma/seed.ts` which imports from `../src/generated/prisma/client` — a relative path that resolves differently from within the prisma/ subdirectory vs. the src/ root.
- **Fix:** Added `"prisma"` to the `exclude` array in `tsconfig.json`. Seed script is a standalone Node.js runtime script, not part of the Next.js application.
- **Files modified:** `tsconfig.json`
- **Commit:** 6518792

**4. [Rule 2 - Missing Config] No `@/*` path alias in tsconfig.json**
- **Found during:** Task 2 (layout.tsx import of MotionProvider with `@/components/...`)
- **Issue:** `tsconfig.json` had `"paths": {}` — no `@` alias configured. The import `from '@/components/providers/motion-provider'` would fail TypeScript type checking.
- **Fix:** Added `"@/*": ["./src/*"]` to paths in tsconfig.json. Next.js handles the alias at runtime automatically; the tsconfig path is needed for TypeScript.
- **Files modified:** `tsconfig.json`
- **Commit:** ac9a6ab

---

**Total deviations:** 4 auto-fixed (Rules 1 and 2)
**Impact on plan:** Prisma 7's config changes required adapter-based client instantiation — an undocumented breaking change from what the plan expected. The outcome is identical functionality; the implementation differs in that the `PrismaPg` adapter is now an explicit runtime dependency.

## Issues Encountered

- Prisma 7 removed datasource `url` from schema.prisma — required adapter pattern instead of the plan's simple `new PrismaClient()` constructor.
- Prisma 7 no longer generates an `index.ts` in the output directory — explicit `/client` path required in imports.

## User Setup Required

Before running `npx prisma db push` or `npx prisma migrate dev`, the user must:
1. Add a PostgreSQL addon to the Railway project (Railway dashboard -> Project -> New -> Database -> PostgreSQL)
2. Copy the connection string from Railway dashboard -> PostgreSQL addon -> Connect tab
3. Replace the placeholder `DATABASE_URL` in `.env` with the Railway connection string:
   ```
   DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?schema=public"
   ```
4. Run `npx prisma migrate dev --name init` to create the database schema
5. Run `npx prisma db seed` to populate the 22 projects and SiteConfig

## Next Phase Readiness

- Phase 2 can begin: Database schema is ready for auth tables; Prisma client generates cleanly
- All 22 project Vimeo IDs are seeded — Phase 3 homepage video grid can query the database
- LazyMotion provider is at root — Phase 4 animation work can use `<m.div>` without revisiting layout
- SEO redirects are live — old URLs from the legacy Express site will redirect to new routes post-deploy

---
*Phase: 01-foundation-and-infrastructure*
*Completed: 2026-03-30*
