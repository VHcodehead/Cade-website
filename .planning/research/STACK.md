# Stack Research

**Domain:** Premium videographer portfolio site with built-in admin CMS
**Project:** VLACOVISION website revamp (vanilla HTML/JS → Next.js)
**Researched:** 2026-03-30
**Confidence:** MEDIUM — versions based on training data (cutoff Aug 2025). Verify all version numbers with `npm show <package> version` before pinning in package.json.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x (15.2 as of Aug 2025) | Full-stack React framework — frontend, API routes, SSR, admin routing | App Router gives file-based routing with React Server Components; API routes replace the old Express server; built-in image optimization for poster frames; ISR for portfolio pages that rarely change. Next.js 15 stabilized the App Router patterns that were still rough in 14. Use 15, not 14. |
| React | 19.x | UI component model | Peer dep of Next.js 15. React 19 ships stable server actions and `use` hook — both are used by the admin panel form submissions. Do not pin to 18. |
| TypeScript | 5.x | Type safety across the whole codebase | Prisma generates TypeScript types from schema; Next.js 15 ships with full TS support out of the box. Eliminates the class of bugs that plagued the vanilla `script.js` (stale Map state, implicit undefined from querySelector). |
| Tailwind CSS | 4.x (4.0 released early 2025) | Utility-first styling | Tailwind v4 drops the config file in favor of CSS-first configuration via `@theme`. Dark editorial aesthetic maps directly to Tailwind's dark mode and arbitrary values. Much faster build vs v3. |
| Framer Motion | 11.x | Cinematic animations | The only React animation library with layout animations, shared element transitions, scroll-linked progress, and physics springs that all work together. `AnimatePresence` handles page transitions. `useScroll` + `useTransform` handle parallax. Motion 11 is the stable post-rebranding release. |
| Prisma ORM | 5.x (5.20 as of Aug 2025) | Database access layer | Generates TypeScript types from schema; migration workflow is clean for solo developers; works with both SQLite (dev) and PostgreSQL (prod). The type-safe query builder catches the hardcoded-data problem currently in the site — project data moves to DB with full type safety on reads/writes. |
| PostgreSQL | 16.x | Production database | The projects requirement demands a real relational DB (project ordering, draft/publish state, contact form inbox). SQLite is fine in dev with Prisma, but Railway provides managed PostgreSQL natively — no operational cost difference, and Postgres handles concurrent admin writes without SQLite's write lock issues. |
| NextAuth.js (Auth.js) | 5.x (beta, stable API) | Admin authentication | Protects `/admin/**` routes. v5 works natively with Next.js App Router middleware. For a single-owner admin panel, use the Credentials provider with a bcrypt-hashed password stored in env var — no OAuth complexity needed. v4 does NOT support App Router middleware correctly; v5 is required. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@prisma/client` | 5.x (matches prisma) | Runtime DB client | Always — generated from your Prisma schema |
| `uploadthing` | 6.x | File uploads (MP4 preview clips + brand logos) | For the admin panel's "upload preview clip" and "upload brand logo" flows. Provides Next.js App Router route handlers out of the box, handles multipart, returns a CDN URL. No S3 bucket configuration required. |
| `@uploadthing/react` | 6.x | Upload UI components | Drop-in `<UploadButton>` component for admin forms |
| `react-hook-form` | 7.x | Admin form state management | Admin panel has complex forms (project CRUD with 8+ fields, about section, contact info). React Hook Form avoids re-renders per keystroke, has native Zod integration, and handles file input state alongside text fields. |
| `zod` | 3.x | Schema validation | Validate admin form input on client AND server side. Used in Server Actions to validate before Prisma writes. |
| `@hello-pangea/dnd` | 4.x | Drag-and-drop project reordering | The maintained fork of `react-beautiful-dnd` (original is abandoned). Handles vertical list reordering in the admin panel with keyboard accessibility. Touch support included. |
| `bcryptjs` | 2.x | Password hashing | Hash the admin password stored in env var. Use `bcryptjs` (pure JS) not `bcrypt` (native bindings) to avoid Railway build failures from native modules. |
| `@t3-oss/env-nextjs` | 0.10.x | Type-safe environment variables | Validates all env vars at build time. Prevents runtime crashes from missing `DATABASE_URL` or `NEXTAUTH_SECRET`. Simple schema definition for both server and client vars. |
| `sharp` | 0.33.x | Image processing (Next.js peer dep) | Next.js `<Image>` requires sharp for optimization. Install explicitly — Railway's build environment needs it declared as a prod dependency, not just inferred. |
| `next-themes` | 0.3.x | Dark mode management | Force the site to dark mode globally with no flash of light mode. Provides `ThemeProvider` that sets the `dark` class on `<html>`. |
| `clsx` + `tailwind-merge` | latest | Conditional classname merging | Required for component composition with Tailwind v4. `cn()` utility pattern used by every UI component. |
| `sonner` | 1.x | Toast notifications in admin | Admin actions (save project, delete, reorder) need feedback. Sonner integrates with Next.js App Router without the context issues that plague react-hot-toast. |
| `@vercel/analytics` OR `umami` | latest | Analytics dashboard | Two tiers — see Stack Patterns section. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `eslint` + `eslint-config-next` | Linting | Ships with `create-next-app`; enforce no-unused-vars and React hooks rules from day one |
| `prettier` | Code formatting | Set `printWidth: 100`, `tailwindcss` plugin for class sorting. Commit `.prettierrc` to repo. |
| `prisma` (CLI) | DB migrations | Run `npx prisma migrate dev` locally; `npx prisma migrate deploy` in Railway build command |
| `tsx` | TypeScript script runner | For one-off DB seed scripts (`npx tsx scripts/seed.ts`) without compiling first |
| `@types/bcryptjs` | Type definitions | Required since bcryptjs ships without bundled types |

---

## Installation

```bash
# Bootstrap
npx create-next-app@latest vlacovision --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Core dependencies
npm install framer-motion prisma @prisma/client next-auth@beta zod react-hook-form @hookform/resolvers

# File uploads
npm install uploadthing @uploadthing/react

# Admin UI utilities
npm install @hello-pangea/dnd bcryptjs next-themes clsx tailwind-merge sonner @t3-oss/env-nextjs

# Analytics (choose one — see Stack Patterns)
npm install @vercel/analytics
# OR self-host Umami (no npm package, separate deployment)

# Image processing (explicit for Railway)
npm install sharp

# Dev dependencies
npm install -D @types/bcryptjs tsx prettier prettier-plugin-tailwindcss

# Initialize Prisma
npx prisma init --datasource-provider postgresql
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js 15 App Router | Next.js 14 App Router | Never for a greenfield build in 2026. 14 is in maintenance. 15 fixed RSC hydration bugs and has stable server actions. |
| Next.js 15 App Router | Remix | If you need fine-grained data loading per route with loaders/actions and no RSC complexity. For this project, Next.js is the better fit because of its ecosystem (uploadthing, NextAuth v5, next-themes all have Next.js-first support). |
| Tailwind CSS v4 | Tailwind CSS v3 | v3 if you need a large existing component library (shadcn/ui has v3 support; v4 support was still catching up at cutoff). Check shadcn/ui compatibility before committing to v4. |
| Prisma | Drizzle ORM | Drizzle if you want zero ORM overhead and prefer SQL-like query syntax. Drizzle is faster at runtime and has better edge runtime support. For this project, Prisma wins on DX — the admin panel requires schema migrations and generated types, where Prisma's tooling is more mature. |
| NextAuth v5 | Lucia Auth | Lucia if you want total control over the auth implementation without a framework. NextAuth v5 is simpler for a single-admin site with credentials provider. |
| uploadthing | AWS S3 + presigned URLs | S3 if you need to store hundreds of GB or have specific data residency requirements. For a portfolio with ~22 projects and ~5-10MB preview clips each, uploadthing's hosted storage eliminates ops complexity. |
| `@hello-pangea/dnd` | `dnd-kit` | `dnd-kit` for complex multi-list drag scenarios or if you need fine-grained sensor control. For a single reorderable list of projects, `@hello-pangea/dnd` has less API surface. |
| PostgreSQL | SQLite (via `better-sqlite3`) | SQLite if deploying to a serverless environment or if Railway managed Postgres costs are a concern. Prisma supports both; switching is a datasource URL change. Start with Postgres since Railway includes it. |
| `bcryptjs` | `bcrypt` (native) | `bcrypt` only if you control the build environment and can ensure native bindings compile. Railway's build container can be unpredictable with native modules. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js Pages Router | The old routing model (pre-App Router). Lacks React Server Components, doesn't support the `middleware.ts` auth pattern properly, and creates complexity mixing server/client code. This is a greenfield build — use App Router exclusively. | Next.js App Router |
| Vimeo Player API on the grid | The current site creates a Vimeo iframe on hover — this is the core performance problem. iframes initialize a full browser context, causing 2-5 second load delays. The reason the site feels slow. | Native HTML `<video>` element with preloaded MP4 preview clips |
| `react-beautiful-dnd` | The original library is unmaintained (last release 2022, open issues ignored). | `@hello-pangea/dnd` (maintained fork, same API) |
| `multer` or `formidable` for uploads | Traditional multipart parsers require stateful file handling that doesn't fit Next.js API routes. They also require writing your own storage backend. | `uploadthing` |
| `next-auth@4` | Version 4 uses the Pages Router session API and does not properly support App Router middleware-based route protection. The `auth()` helper and middleware exports are v5-only. | `next-auth@beta` (v5) |
| Tailwind UI (paid) or Chakra UI | Tailwind UI is paid, doesn't fit the custom dark editorial aesthetic. Chakra introduces a large runtime CSS-in-JS overhead that conflicts with Tailwind. | `shadcn/ui` components (copy-paste, fully ownable, Tailwind-based) |
| `react-query` / TanStack Query | Adds client-side data fetching complexity that App Router Server Components already solve. Admin panel mutations use Server Actions. The additional caching layer fights with Next.js's built-in fetch caching. | React Server Components + Server Actions + `revalidatePath()` |
| `axios` | Unnecessary over native `fetch` in Next.js 15. App Router's `fetch` is extended with cache/revalidation options. Adding axios adds 40KB for no benefit. | Native `fetch` |
| `moment.js` | 70KB bundle size for date formatting. Unmaintained for new features. | `date-fns` (tree-shakable, ESM-first) |
| GIF for video previews | GIFs are uncompressed at massive file sizes (a 5-second 720p GIF is 15-30MB). The current site avoids them, but this comes up as an "easy" alternative. | MP4/WebM preview clips (720p, ~500KB-1MB via FFmpeg) |
| `styled-components` or `emotion` | CSS-in-JS with runtime style injection creates FOUC issues with RSC and requires client boundary wrappers around every styled component. Incompatible with App Router's streaming model. | Tailwind CSS utility classes |

---

## Stack Patterns by Variant

**For the public portfolio site (visitor-facing):**
- Use React Server Components for all read-only pages (home, project detail, about, contact)
- Fetch project data directly in Server Components via Prisma (no API round-trip)
- Use `generateStaticParams` for project detail pages (pre-render all 22 project slugs at build)
- Add `revalidatePath('/projects/[slug]')` in Server Actions when admin updates a project

**For the admin panel (`/admin/*`):**
- All admin pages must be Client Components OR use Server Actions for mutations
- Protect the entire `/admin` segment with `middleware.ts` using NextAuth v5's `auth` export
- Admin forms use `react-hook-form` + Zod on the client, Server Actions validate with the same Zod schema on the server
- File uploads bypass Server Actions entirely — uploadthing provides its own Next.js API route handler

**For video previews in the grid:**
- Generate MP4 preview clips offline with FFmpeg before upload: `ffmpeg -i input.mp4 -t 8 -vf scale=1280:720 -c:v libx264 -crf 28 -preset fast -an preview.mp4`
- Also generate WebM for broader browser coverage: `ffmpeg -i input.mp4 -t 8 -vf scale=1280:720 -c:v libvpx-vp9 -crf 40 -b:v 0 -an preview.webm`
- Upload both via admin panel; store both URLs in Prisma schema (`previewMp4Url`, `previewWebmUrl`)
- Use `<video autoPlay muted loop playsInline>` with `onMouseEnter` play / `onMouseLeave` pause + reset

**For analytics:**
- If deploying to Railway (NOT Vercel): self-host Umami on a separate Railway service with its own Postgres instance. Umami provides a built-in dashboard for page views and custom events. Add Umami's tracking script via `next/script` Strategy="afterInteractive".
- If deploying to Vercel: use `@vercel/analytics` (built into the platform, zero config) + `@vercel/speed-insights` for Core Web Vitals.
- For video play tracking: fire a custom Umami event `umami.track('video-play', { projectId, projectTitle })` from the `<video>` `onPlay` handler.

**For contact form submissions:**
- Store submissions in a `ContactSubmission` Prisma model (no email service dependency)
- Admin sees all submissions in the `/admin/inbox` page
- Optionally add Resend or Nodemailer to also send an email notification, but do not make it the primary persistence mechanism — DB is the source of truth

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `next@15.x` | `react@19.x` | Next.js 15 requires React 19. Do not mix with React 18. |
| `next-auth@beta` (v5) | `next@15.x` | v5 is designed for App Router. Works with Next.js 14+ and 15. Check Auth.js docs for exact beta tag (`npm show next-auth dist-tags`). |
| `framer-motion@11.x` | `react@19.x` | Motion 11 supports React 19. Verify peer deps on install. |
| `@prisma/client@5.x` | `prisma@5.x` | Must be the same minor version. Run `prisma generate` after any schema change to regenerate client. |
| `uploadthing@6.x` | `next@15.x` | uploadthing v6 supports App Router route handlers. Check their Next.js integration docs for the `createRouteHandler` import path. |
| `@hello-pangea/dnd@4.x` | `react@19.x` | Compatible with React 19 (strict mode works). |
| `tailwindcss@4.x` | `postcss@8.x` | Tailwind v4 uses a new PostCSS plugin — update your PostCSS config. See Tailwind v4 upgrade guide if migrating from v3. |
| `sharp@0.33.x` | `next@15.x` | Next.js 15 requires sharp 0.28+. Must be a prod dependency (not devDependency) for Railway. |

---

## Sources

- Training data (knowledge cutoff: August 2025) — Next.js 15, React 19, Tailwind v4, Framer Motion 11, Prisma 5, NextAuth v5 ecosystem state — MEDIUM confidence
- Official Next.js App Router docs pattern — `app/` directory routing, Server Components, Server Actions — HIGH confidence (stable, documented patterns)
- Auth.js v5 migration guide patterns — middleware-based protection, `auth()` helper — MEDIUM confidence (v5 was in beta at cutoff; verify stable release status)
- uploadthing Next.js integration — file upload pattern with App Router — MEDIUM confidence
- `@hello-pangea/dnd` as maintained `react-beautiful-dnd` fork — MEDIUM confidence (community-accepted fork at cutoff)
- bcryptjs vs bcrypt for Railway — MEDIUM confidence based on known native module build issues in containerized environments
- Video preview strategy (MP4 + WebM with `<video>` element) — HIGH confidence (browser-native, well-documented behavior, matches how Buck/ManvsMachine/production studios solve the same problem)

**CRITICAL: Before creating package.json, run these to confirm current versions:**
```bash
npm show next version
npm show react version
npm show framer-motion version
npm show prisma version
npm show next-auth dist-tags
npm show tailwindcss version
npm show uploadthing version
```

---

*Stack research for: VLACOVISION premium videographer portfolio + admin CMS*
*Migrating from: Express.js static server + vanilla JS*
*Migrating to: Next.js 15 App Router + TypeScript + Tailwind + Prisma + PostgreSQL*
*Researched: 2026-03-30*
