# Phase 1: Foundation and Infrastructure - Research

**Researched:** 2026-03-30
**Domain:** Next.js 16, Tailwind CSS v4, Prisma 7, Railway deployment, Framer Motion 12
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Design System**
- Color palette: Pure black background (#0A0A0A), off-white text (#F5F5F5), burnt orange accent (#FF4400 — existing brand color), subtle grays for cards/sections (#111111, #1A1A1A)
- Typography: Premium sans-serif — Inter or variable font like Syne for headings + Inter for body. Large, confident headings. Tight letter-spacing on uppercase labels
- Spacing: 8px grid system. Generous whitespace — videos are the star, let them breathe. Full-bleed sections
- Overall aesthetic: ManvsMachine meets Buck — dark canvas, motion-first, editorial typography, video-centric

**Project Structure**
- Clean slate Next.js project in repo root — move old files to /legacy folder (git history preserves them)
- Migrate 22 project Vimeo IDs and metadata into a Prisma seed script that populates the database
- Copy brand logos from /assets into Next.js /public/assets/
- Old project HTML files become database records, not static files

**Deployment**
- Railway confirmed as deployment target
- PostgreSQL via Railway addon for database
- Prisma binaryTargets: ["native", "linux-musl-openssl-3.0.x"] for Railway containers — **SEE CRITICAL NOTE IN PITFALLS: Prisma 7 makes this obsolete**
- postinstall: "prisma generate" in package.json
- Build command: prisma migrate deploy && next build
- Verify Next.js version (15 vs 16) via npm show next version before bootstrapping

### Claude's Discretion
- Exact Tailwind config structure and custom theme extension approach
- Next.js App Router folder organization (route groups, layouts)
- ESLint and Prettier configuration details
- Prisma schema field types and relations specifics
- Whether to use Turbopack for dev server

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Next.js project scaffolded with TypeScript, Tailwind CSS, App Router | Next.js 16.2.1 is current `latest`; `create-next-app@latest` scaffolds all three by default; Turbopack is now the default bundler |
| FOUND-02 | Prisma ORM configured with PostgreSQL database and initial schema | Prisma 7.6.0 is current; new `prisma-client` generator provider replaces `prisma-client-js`; output path is now required |
| FOUND-03 | SEO redirect mapping from old URL structure (projects/*.html) to new routes | `next.config.ts` redirects array handles this at config level; permanent=true emits 308 (treated as 301 by all major crawlers) |
| FOUND-04 | Framer Motion configured with LazyMotion at root layout level | Framer Motion 12.38.0 is current; LazyMotion + domAnimation reduces bundle; must be "use client" wrapper component |
| FOUND-05 | Dark editorial design system (color tokens, typography scale, spacing) | Tailwind v4.2.2 is current; CSS-first @theme block replaces tailwind.config.js; Inter + Syne via next/font/google with CSS variables |
</phase_requirements>

---

## Summary

This phase bootstraps a greenfield Next.js 16 project on top of an existing Express/vanilla-JS codebase. The old files move to `/legacy/` while the new Next.js project occupies the repo root. The three most important technical choices to get right from the start are: (1) Prisma 7's new `prisma-client` generator which eliminates the old `binaryTargets` concern entirely, (2) Tailwind v4's CSS-first `@theme` configuration which has no `tailwind.config.js`, and (3) Next.js 16's `proxy.ts` which replaces `middleware.ts` — though for this phase, redirects are handled through `next.config.ts` which requires no migration.

The existing codebase provides 22 project HTML files at `/projects/*.html` whose slugs (`aether-nz`, `aventon`, etc.) map cleanly to the new `/projects/[slug]` route. One-to-one redirect rules in `next.config.ts` cover every old URL. The Vimeo IDs embedded in those HTML files are the seed data source — the real IDs are in the project HTML files (e.g., `1010368544` in `aether-nz.html`), not in VIMEO_IDS.md which only has placeholder values.

Railway deployment is straightforward with Next.js 16: set `DATABASE_URL` environment variable, run `prisma migrate deploy && next build` as the build command, and include `prisma generate` in the `postinstall` script. With Prisma 7's Wasm-based query engine, no platform-specific binary targets are needed.

**Primary recommendation:** Scaffold with `npx create-next-app@latest` (selects all correct defaults), then install Prisma 7, Framer Motion 12, and Tailwind v4 (already included in scaffold). Configure Prisma with `prisma-client` provider and output to `src/generated/prisma`. Define all design tokens in `globals.css` using `@theme`. Move old files to `/legacy/` before scaffolding to keep git history clean.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 | Framework, SSR, routing, image opt | Current `latest`; App Router, Turbopack default, React 19.2 |
| react / react-dom | ^19.0.0 | UI library | Required by Next.js 16 peer dependency |
| typescript | ^5.1.0 | Type safety | Required by Next.js 16 (minimum TS 5.1) |
| tailwindcss | 4.2.2 | Utility CSS | Current `latest`; CSS-first config, Lightning CSS engine |
| @tailwindcss/postcss | 4.x | Tailwind PostCSS plugin | Required for Tailwind v4 with Next.js |
| prisma | 7.6.0 | ORM CLI and migrations | Current `latest`; Rust-free, Wasm engine |
| @prisma/client | 7.6.0 | Database client | Matches prisma CLI version |
| framer-motion | 12.38.0 | Animation library | Current `latest`; LazyMotion for bundle reduction |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| postcss | latest | CSS processing | Required alongside @tailwindcss/postcss |
| eslint | latest | Code linting | Scaffolded by create-next-app; use flat config (ESLint v10 default in Next.js 16) |
| @next/eslint-plugin-next | latest | Next.js ESLint rules | Included by scaffold; now defaults to flat config format |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Turbopack (default) | Webpack (--webpack flag) | Only use webpack if custom webpack plugins are required; Turbopack is 2-5x faster |
| Inter + Syne (Google Fonts) | Local self-hosted fonts | next/font/google self-hosts at build time anyway; no privacy difference |
| Tailwind @theme CSS tokens | shadcn/ui design tokens | shadcn adds component complexity not needed in phase 1 |

**Installation (after `create-next-app` scaffold):**
```bash
npm install prisma@latest @prisma/client@latest --save-dev
npm install framer-motion@latest
# Tailwind v4 and next are already included by create-next-app@latest
```

**Version verification (run before scaffolding):**
```bash
npm show next version
# Should return: 16.2.1
```

---

## Architecture Patterns

### Recommended Project Structure

```
/                          # repo root (was Express project)
├── legacy/                # old Express files moved here before scaffold
│   ├── index.html
│   ├── projects/          # 22 old HTML files
│   ├── styles.css
│   ├── script.js
│   └── server.js
├── public/
│   └── assets/            # brand logos copied from /assets/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts            # 22 projects + site config seed
├── src/
│   ├── generated/
│   │   └── prisma/        # Prisma 7 generated client (required output path)
│   ├── app/
│   │   ├── layout.tsx     # root layout: fonts, LazyMotion provider, globals.css
│   │   ├── globals.css    # @import "tailwindcss" + @theme tokens
│   │   ├── page.tsx       # homepage (/)
│   │   └── projects/
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── components/
│   │   └── providers/
│   │       └── motion-provider.tsx  # "use client" LazyMotion wrapper
│   └── lib/
│       └── db.ts          # Prisma client singleton
├── next.config.ts         # redirects array for 22 old .html URLs
├── proxy.ts               # (Next.js 16: replaces middleware.ts for edge routing)
└── package.json
```

### Pattern 1: Tailwind v4 CSS-First Theme Definition

**What:** All design tokens defined in `globals.css` using `@theme` block. No `tailwind.config.js` file.
**When to use:** Always in Tailwind v4 projects. The `@theme` block generates corresponding utility classes automatically.

```css
/* src/app/globals.css */
/* Source: https://tailwindcss.com/docs/guides/nextjs */
@import "tailwindcss";

@theme {
  /* Color tokens */
  --color-bg-base: #0A0A0A;
  --color-bg-card: #111111;
  --color-bg-section: #1A1A1A;
  --color-text-primary: #F5F5F5;
  --color-text-muted: rgba(245, 245, 245, 0.6);
  --color-accent: #FF4400;

  /* Typography */
  --font-heading: var(--font-syne), var(--font-inter), sans-serif;
  --font-body: var(--font-inter), sans-serif;

  /* Spacing scale (8px grid) */
  --spacing-1: 0.5rem;   /* 8px */
  --spacing-2: 1rem;     /* 16px */
  --spacing-3: 1.5rem;   /* 24px */
  --spacing-4: 2rem;     /* 32px */
  --spacing-8: 4rem;     /* 64px */
  --spacing-16: 8rem;    /* 128px */
}
```

```tsx
/* PostCSS config: postcss.config.mjs */
/* Source: https://tailwindcss.com/docs/guides/nextjs */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### Pattern 2: Google Fonts via next/font with CSS Variables

**What:** Load Inter and Syne via `next/font/google` at build time, expose as CSS variables, reference in `@theme`.
**When to use:** Root layout. Fonts are self-hosted at build time — no Google network requests at runtime.

```tsx
// src/app/layout.tsx
import { Inter, Syne } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="bg-bg-base text-text-primary font-body">
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
```

### Pattern 3: LazyMotion Provider (Client Component Wrapper)

**What:** Server Component root layout wraps children in a client component that provides LazyMotion context.
**When to use:** Root layout — enables all child components to use `<m.div>` without importing full Framer Motion bundle.

```tsx
// src/components/providers/motion-provider.tsx
'use client';
import { LazyMotion, domAnimation } from 'framer-motion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
```

Usage in child components:
```tsx
'use client';
import { m } from 'framer-motion';

export function AnimatedCard() {
  return <m.div whileHover={{ scale: 1.02 }}>...</m.div>;
}
```

### Pattern 4: SEO Redirects in next.config.ts

**What:** All 22 old HTML URLs redirected to new slug routes at config level. Runs before filesystem — zero runtime overhead.
**When to use:** Static redirect mappings known at build time.

```typescript
// next.config.ts
// Source: https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects (v16.2.1)
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Individual project redirects (22 total)
      { source: '/projects/aether-nz.html', destination: '/projects/aether-nz', permanent: true },
      { source: '/projects/aventon.html', destination: '/projects/aventon', permanent: true },
      { source: '/projects/bf-goodrich.html', destination: '/projects/bf-goodrich', permanent: true },
      { source: '/projects/chase-sapphire.html', destination: '/projects/chase-sapphire', permanent: true },
      { source: '/projects/destroy-boredom.html', destination: '/projects/destroy-boredom', permanent: true },
      { source: '/projects/dirt.html', destination: '/projects/dirt', permanent: true },
      { source: '/projects/dr-bronners-2.html', destination: '/projects/dr-bronners-2', permanent: true },
      { source: '/projects/dr-bronners.html', destination: '/projects/dr-bronners', permanent: true },
      { source: '/projects/entelligence.html', destination: '/projects/entelligence', permanent: true },
      { source: '/projects/get-off-the-couch.html', destination: '/projects/get-off-the-couch', permanent: true },
      { source: '/projects/go-fast-campers.html', destination: '/projects/go-fast-campers', permanent: true },
      { source: '/projects/introducing-gt.html', destination: '/projects/introducing-gt', permanent: true },
      { source: '/projects/kith-x-columbia.html', destination: '/projects/kith-x-columbia', permanent: true },
      { source: '/projects/lost-summer.html', destination: '/projects/lost-summer', permanent: true },
      { source: '/projects/lululemon.html', destination: '/projects/lululemon', permanent: true },
      { source: '/projects/mikes-bikes-2.html', destination: '/projects/mikes-bikes-2', permanent: true },
      { source: '/projects/mikes-bikes.html', destination: '/projects/mikes-bikes', permanent: true },
      { source: '/projects/offield.html', destination: '/projects/offield', permanent: true },
      { source: '/projects/prickly-motorsports.html', destination: '/projects/prickly-motorsports', permanent: true },
      { source: '/projects/pulpan-brothers.html', destination: '/projects/pulpan-brothers', permanent: true },
      { source: '/projects/texino.html', destination: '/projects/texino', permanent: true },
      { source: '/projects/town-trail.html', destination: '/projects/town-trail', permanent: true },
    ];
  },
};

export default nextConfig;
```

> **Note on status codes:** Next.js emits 308 (not 301) for `permanent: true`. Google Search treats 308 identically to 301 for SEO purposes. All modern browsers honor 308.

### Pattern 5: Prisma 7 Schema and Database Client

**What:** Prisma 7 uses new `prisma-client` provider (not `prisma-client-js`) with required output path. No `binaryTargets` needed.
**When to use:** New projects on Prisma 7.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Project {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  client      String
  services    String
  year        Int
  description String
  vimeoId     String
  published   Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SiteConfig {
  id              String  @id @default("singleton")
  heroVimeoId     String  @default("")
  aboutText       String  @default("")
  contactEmail    String  @default("")
}
```

```typescript
// src/lib/db.ts
// Import from generated path — NOT from "@prisma/client"
import { PrismaClient } from '../generated/prisma';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

### Pattern 6: Railway Deployment Configuration

**What:** package.json scripts and Railway environment variables for zero-downtime deploy.
**When to use:** All Railway deployments with Prisma.

```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma migrate deploy && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

Railway environment variables required:
- `DATABASE_URL` — PostgreSQL connection string from Railway PostgreSQL addon
- `NODE_ENV` — set to `production` by Railway automatically

### Anti-Patterns to Avoid

- **Using `prisma-client-js` generator:** Deprecated in Prisma 7. Use `prisma-client`. The old generator still works but generates the Rust binary engine which is larger and slower.
- **Omitting `output` in Prisma generator block:** Prisma 7 requires an explicit output path. Without it, generation will fail.
- **Importing from `@prisma/client`:** In Prisma 7 with custom output path, you must import from the generated path (e.g., `../generated/prisma`). The `@prisma/client` package becomes a thin re-export that may not work correctly.
- **Creating `tailwind.config.js`:** Tailwind v4 is CSS-first. Creating a JS config file is unnecessary and can cause confusion. All customization goes in `@theme` in globals.css.
- **Using `middleware.ts` for redirects:** In Next.js 16, use `next.config.ts` redirects for static URL mappings. `middleware.ts` is deprecated; `proxy.ts` is the new name if edge runtime logic is needed.
- **Animating in Server Components:** Framer Motion requires `'use client'`. Create a wrapper component rather than adding the directive to layout.tsx directly.
- **Skipping the /legacy migration:** Moving files before `create-next-app` scaffolds ensures git history is preserved and the scaffold doesn't overwrite existing files.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading + zero layout shift | Custom font loading logic | `next/font/google` | Automatic subset, self-hosting, fallback metric matching |
| Image optimization | `<img>` with manual srcset | `next/image` | AVIF/WebP conversion, lazy loading, Core Web Vitals |
| Animation performance | CSS transitions + JS | Framer Motion `m` components | Hardware-accelerated, interrupt-safe, accessibility hooks |
| DB connection pooling | Manual pg pool | Prisma singleton pattern | Prisma handles pool sizing and connection lifecycle |
| SEO redirects at runtime | `redirect()` in page components | `next.config.ts` redirects | Config-level redirects run before filesystem; no server cost |
| TypeScript Prisma types | Manual interface definitions | Prisma generated types from `src/generated/prisma` | Fully typed queries, auto-updates with schema |

**Key insight:** Next.js 16 and Prisma 7 together handle nearly every infrastructure concern that teams historically built custom solutions for. Trust the scaffold.

---

## Common Pitfalls

### Pitfall 1: Prisma 7 binaryTargets Misconfiguration (Critical for Railway)

**What goes wrong:** CONTEXT.md specifies `binaryTargets: ["native", "linux-musl-openssl-3.0.x"]` based on Prisma 5/6 knowledge. With Prisma 7's new `prisma-client` generator (Wasm-based, Rust-free), `binaryTargets` is not a valid field and will cause a schema validation error.

**Why it happens:** Prisma 7 (released 2025) migrated the query engine from Rust native binaries to a WebAssembly module running on the JS main thread. Platform-specific binaries no longer exist.

**How to avoid:** Use the new generator block without `binaryTargets`:
```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

**Warning signs:** Schema validation error mentioning unknown field `binaryTargets` in generator block.

### Pitfall 2: Wrong Import Path for Prisma Client

**What goes wrong:** Code imports from `@prisma/client` instead of the generated output path, causing "PrismaClient not initialized" errors.

**Why it happens:** Prisma 7 no longer writes to `node_modules/@prisma/client` by default. The generated client lives at `src/generated/prisma`.

**How to avoid:** All imports must use the explicit generated path:
```typescript
import { PrismaClient } from '../generated/prisma'; // correct
import { PrismaClient } from '@prisma/client';       // wrong in Prisma 7
```

### Pitfall 3: Tailwind v4 `tailwind.config.js` Confusion

**What goes wrong:** Developer creates `tailwind.config.js` to define custom colors, then discovers classes aren't being generated or the file is ignored.

**Why it happens:** Tailwind v4 is CSS-first. The JS config file is not the configuration mechanism. Custom tokens go in `@theme` in globals.css.

**How to avoid:** Never create `tailwind.config.js`. Define all tokens in `@theme`. Use `@plugin` for plugins if needed.

**Warning signs:** Custom color classes not appearing in IntelliSense; build generates no custom utility classes.

### Pitfall 4: Framer Motion Server Component Error

**What goes wrong:** `window is not defined` or `ReactDOM.hydrate` error when using `motion.div` in a Server Component.

**Why it happens:** Framer Motion uses browser APIs (window, requestAnimationFrame) that don't exist during SSR.

**How to avoid:** Always add `'use client'` to any component that uses `motion` or `m` from framer-motion. The `MotionProvider` wrapper pattern (Pattern 3 above) handles this cleanly — Server Components can render children inside it because the provider is the only client boundary.

### Pitfall 5: Legacy Files Blocking Scaffold

**What goes wrong:** Running `create-next-app` in the repo root fails or overwrites `package.json`, `index.html`, or other existing files.

**Why it happens:** The scaffold expects a clean directory or creates conflicts with existing files.

**How to avoid:** Move all legacy files to `/legacy/` FIRST, then run `create-next-app`. Git preserves history for all moved files.

```bash
mkdir legacy
git mv index.html projects styles.css script.js server.js package.json legacy/
git commit -m "chore: move legacy Express site to /legacy"
# Now run create-next-app
```

### Pitfall 6: Missing `prisma generate` Before Build

**What goes wrong:** Railway build fails with "PrismaClient did not initialize yet" during `next build`.

**Why it happens:** `prisma generate` must run before any code that imports from the generated client. The `postinstall` script covers `npm install` runs, but Railway may cache `node_modules` between builds.

**How to avoid:** Include `prisma generate` in the build command as a fallback:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

### Pitfall 7: Vimeo IDs Not in VIMEO_IDS.md

**What goes wrong:** Seed script uses placeholder IDs (123456789...) from VIMEO_IDS.md instead of real Vimeo IDs.

**Why it happens:** VIMEO_IDS.md was a template/guide document — it only has placeholder values. Real Vimeo IDs are embedded in the project HTML files under `/projects/*.html`.

**How to avoid:** Extract real IDs from the HTML files. Example from `aether-nz.html`: the iframe src contains `video/1010368544`. Parse each HTML file for the real ID during seed script creation.

---

## Code Examples

### Complete Prisma Schema for Phase 1

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Project {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  client      String
  services    String   @default("")
  year        Int
  description String   @default("")
  vimeoId     String
  published   Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SiteConfig {
  id            String @id @default("singleton")
  heroVimeoId   String @default("")
  aboutText     String @default("")
  contactEmail  String @default("")
}
```

### Seed Script Structure

```typescript
// prisma/seed.ts
import { PrismaClient } from '../src/generated/prisma';

const db = new PrismaClient();

const projects = [
  // Real Vimeo IDs extracted from /projects/*.html files
  // IMPORTANT: Do NOT use VIMEO_IDS.md — those are placeholder values
  { slug: 'aether-nz',         title: 'Aether NZ',          client: 'Aether Apparel',    vimeoId: '1010368544', year: 2024, sortOrder: 1 },
  { slug: 'aventon',           title: 'Aventon',             client: 'Aventon',           vimeoId: '',           year: 2024, sortOrder: 2 },
  // ... remaining 20 projects — extract vimeoId from each HTML file
];

async function main() {
  for (const project of projects) {
    await db.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: { ...project, services: 'Production, Direction, Post-Production', description: '' },
    });
  }

  await db.siteConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroVimeoId: '1129060654', // from index.html featured video
      aboutText: 'A San Francisco Bay Area production house specializing in bold, authentic storytelling through film.',
      contactEmail: '',
    },
  });
}

main().catch(console.error).finally(() => db.$disconnect());
```

Add to `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `prisma-client-js` + binaryTargets | `prisma-client` generator, no binaryTargets needed | Prisma 7.0.0 (2025) | Simpler schema, smaller bundles, no platform binary issues |
| `tailwind.config.js` theme extension | CSS-first `@theme` in globals.css | Tailwind v4.0 (Jan 2025) | No JS config file; design tokens as CSS custom properties |
| `middleware.ts` for routing | `proxy.ts` (Node.js runtime) | Next.js 16 (Oct 2025) | Clearer network boundary; middleware.ts deprecated |
| Turbopack opt-in flag | Turbopack default bundler | Next.js 16 (Oct 2025) | 2-5x faster builds with no config change |
| Sync params/cookies access | Async `await params`, `await cookies()` | Next.js 16 (breaking change) | Must use async in all route handlers and layouts |
| `next lint` built-in | ESLint run directly; `next lint` removed | Next.js 16 | Run `eslint` directly in CI; `next build` no longer lints |

**Deprecated/outdated:**
- `prisma-client-js` provider: still works but generates larger Rust binary engine; migrate to `prisma-client`
- `tailwind.config.js`: not used in v4; remove if present
- `middleware.ts`: deprecated in Next.js 16; rename to `proxy.ts` if used (not needed for this phase)
- `experimental.ppr` Next.js config flag: removed in Next.js 16; now `cacheComponents`

---

## Open Questions

1. **Real Vimeo IDs for remaining 21 projects**
   - What we know: `aether-nz.html` has ID `1010368544`, `index.html` hero has `1129060654`
   - What's unclear: The other 21 project HTML files must be parsed individually for their Vimeo embed URLs
   - Recommendation: The planner should include a task to extract all 22 Vimeo IDs from `/projects/*.html` and `/index.html` as part of the seed script creation task.

2. **Contact email for SiteConfig**
   - What we know: SiteConfig needs a contactEmail field; not found in existing HTML files
   - What's unclear: The actual contact email to seed
   - Recommendation: Seed with empty string; owner configures via admin panel (Phase 5).

3. **Prisma 7 `ts-node` vs `tsx` for seed script**
   - What we know: Prisma docs show `ts-node` in some examples; `tsx` is faster and needs no `tsconfig.json` adjustments
   - What's unclear: Which the Railway build environment supports
   - Recommendation: Use `tsx` (faster, no CommonJS module workaround needed): `"seed": "tsx prisma/seed.ts"`

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — Wave 0 must install |
| Config file | None — see Wave 0 gaps |
| Quick run command | `npx jest --testPathPattern=phase1 --passWithNoTests` |
| Full suite command | `npx jest` |

> This is a greenfield project. No test infrastructure exists. Wave 0 of the plan must establish the test framework. Given the infrastructure nature of this phase (file system setup, config files, Railway deployment), most verification is smoke-test and build-output validation rather than unit tests.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | Next.js project builds successfully | smoke | `npm run build` exits 0 | ❌ Wave 0 |
| FOUND-02 | Prisma client generates; DB connection succeeds | smoke | `npx prisma db push --skip-generate` | ❌ Wave 0 |
| FOUND-03 | Old HTML URLs return 308 redirect to new path | integration | `curl -I /projects/aether-nz.html` → Location header check | ❌ Wave 0 |
| FOUND-04 | LazyMotion provider renders without error | unit | Jest + React Testing Library render test | ❌ Wave 0 |
| FOUND-05 | CSS custom properties present in built output | smoke | `grep -r "0A0A0A" .next/static` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run build` (validates compilation)
- **Per wave merge:** Full Jest suite + `npm run build`
- **Phase gate:** `npm run build` green + Railway deploy succeeds before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `jest.config.ts` — Jest configuration for Next.js 16 + TypeScript
- [ ] `jest.setup.ts` — @testing-library/jest-dom matchers
- [ ] `__tests__/providers/motion-provider.test.tsx` — covers FOUND-04
- [ ] Framework install: `npm install --save-dev jest @jest/globals ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom`

---

## Sources

### Primary (HIGH confidence)

- npm registry (`npm show next version`, `npm show prisma version`, etc.) — exact versions verified 2026-03-30
- [Next.js 16 Blog Post](https://nextjs.org/blog/next-16) — breaking changes, proxy.ts rename, Turbopack default, async params requirement
- [Next.js redirects API reference](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects) v16.2.1 (last updated 2026-03-25) — permanent redirect syntax, 308 status code behavior
- [Tailwind CSS Next.js installation guide](https://tailwindcss.com/docs/guides/nextjs) — @import "tailwindcss", postcss.config.mjs, exact v4 setup
- [Prisma 7 generators reference](https://www.prisma.io/docs/orm/prisma-schema/overview/generators) — `prisma-client` provider, required output field, no binaryTargets
- Direct file inspection of `/projects/aether-nz.html` — confirmed Vimeo ID 1010368544; confirmed VIMEO_IDS.md contains only placeholder values

### Secondary (MEDIUM confidence)

- [Prisma 7.0.0 announcement](https://www.prisma.io/blog/announcing-prisma-orm-7-0-0) — Rust-free Wasm engine, binaryTargets obsolete
- [Prisma upgrade to v7 guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7) — generator migration pattern, import path changes
- [Next.js font optimization docs](https://nextjs.org/docs/app/getting-started/fonts) — next/font/google CSS variable pattern
- Multiple WebSearch results on Framer Motion 12 + Next.js App Router "use client" pattern — consistent across sources

### Tertiary (LOW confidence)

- WebSearch results on Railway + Prisma 7 deployment specifics — limited recent sources; postinstall `prisma generate` pattern appears consistent but Railway's build cache behavior not fully verified

---

## Metadata

**Confidence breakdown:**
- Standard stack versions: HIGH — verified directly via npm registry 2026-03-30
- Next.js 16 architecture: HIGH — verified against official blog and docs (last updated 2026-03-25)
- Tailwind v4 configuration: HIGH — verified against official Tailwind docs
- Prisma 7 generator changes: HIGH — verified against official Prisma docs and announcement
- binaryTargets obsolescence: MEDIUM — confirmed by generator docs (no binaryTargets field in new provider) and Prisma 7 announcement; no explicit "binaryTargets removed" statement found
- Railway deployment specifics: MEDIUM — postinstall pattern confirmed; Prisma 7 + Railway not yet widely documented
- Framer Motion LazyMotion pattern: MEDIUM — consistent across multiple community sources; official docs not directly checked

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (stable ecosystem; Prisma and Next.js minor releases expected but no breaking changes)
