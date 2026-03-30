# Architecture Research

**Domain:** Premium portfolio website with built-in CMS admin panel (Next.js 14+ App Router)
**Researched:** 2026-03-30
**Confidence:** HIGH — based on official Next.js 16.2.1 documentation (updated 2026-03-25)

> **Important version note:** Next.js 16 renamed `middleware.ts` to `proxy.ts`. All route protection
> code should use `proxy.ts` at the project root. A codemod exists to migrate older projects.
> This document uses the current `proxy.ts` convention.

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        BROWSER / CLIENT                           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  Public Site │  │  Admin Panel │  │  /admin/login          │  │
│  │  (SC-heavy)  │  │  (CC-heavy)  │  │  (auth gate)           │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬───────────┘  │
└─────────┼────────────────┼──────────────────────────┼────────────┘
          │                │                          │
┌─────────▼────────────────▼──────────────────────────▼────────────┐
│                     proxy.ts  (auth gate)                         │
│  - Reads session cookie (JWT, stateless)                          │
│  - Redirects /admin/* to /admin/login if no valid session         │
│  - Never hits database (optimistic cookie check only)             │
└──────────────────────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                     Next.js App Router                            │
│                                                                   │
│  app/                                                             │
│  ├── (public)/          ← Public route group (no auth)           │
│  │   ├── layout.tsx     ← Cinematic site layout, Framer Motion   │
│  │   ├── page.tsx       ← Home: hero video + project grid        │
│  │   └── projects/[slug]/page.tsx  ← Project detail + Vimeo     │
│  │                                                                │
│  └── (admin)/           ← Admin route group (auth required)      │
│      ├── layout.tsx     ← Admin shell layout                     │
│      ├── login/page.tsx ← Login form (public within group)       │
│      └── admin/                                                   │
│          ├── page.tsx          ← Dashboard overview               │
│          ├── projects/page.tsx ← Project list + reorder          │
│          ├── projects/new/     ← Create project                  │
│          ├── projects/[id]/    ← Edit project                    │
│          ├── settings/page.tsx ← Site settings, about, hero     │
│          ├── logos/page.tsx    ← Brand logo management           │
│          ├── contacts/page.tsx ← Contact form inbox             │
│          └── analytics/page.tsx ← Page views, video plays       │
└──────────────────────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                     API Layer (Route Handlers)                    │
│                                                                   │
│  app/api/                                                         │
│  ├── projects/route.ts        ← GET list, POST create            │
│  ├── projects/[id]/route.ts   ← GET one, PUT update, DELETE      │
│  ├── projects/reorder/route.ts ← PATCH order array               │
│  ├── settings/route.ts        ← GET/PUT site settings            │
│  ├── logos/route.ts           ← GET list, POST upload            │
│  ├── logos/[id]/route.ts      ← DELETE logo                      │
│  ├── contacts/route.ts        ← POST submit, GET inbox           │
│  ├── contacts/[id]/route.ts   ← PATCH read status, DELETE       │
│  ├── upload/route.ts          ← POST multipart file upload       │
│  ├── analytics/route.ts       ← POST track event, GET stats     │
│  └── auth/                                                        │
│      ├── login/route.ts       ← POST credentials → set cookie   │
│      └── logout/route.ts      ← POST → clear cookie             │
└──────────────────────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                  Data Access Layer (lib/dal.ts)                   │
│  - verifySession() — called in every protected Server Component  │
│  - getUser() — memoized with React cache()                       │
│  - All Prisma queries centralized here                           │
└──────────────────────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                  Prisma ORM + PostgreSQL / SQLite                 │
│                                                                   │
│  Models: Project | SiteSettings | BrandLogo | ContactSubmission  │
│          AnalyticsEvent | AdminUser                               │
└──────────────────────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                  External Services                                │
│  ┌───────────┐  ┌──────────────┐  ┌───────────────────────────┐  │
│  │  Vimeo    │  │  Local FS /  │  │  (future) S3-compatible   │  │
│  │  (embed)  │  │  /public/    │  │  object storage           │  │
│  └───────────┘  └──────────────┘  └───────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| `proxy.ts` | Optimistic auth check on every request; redirect `/admin/*` without session | Cookie store only (no DB) |
| `(public)` route group | Public-facing site: homepage, project grid, project detail pages | API routes (RSC data fetch), Vimeo (embed) |
| `(admin)` route group | Protected admin panel: CRUD UI, analytics, inbox | API routes, DAL |
| Route Handlers `app/api/` | REST endpoints for all CRUD and file upload operations | Prisma DAL, local filesystem |
| `lib/dal.ts` | Centralized data access and auth verification; memoized with `React.cache()` | Prisma client |
| `lib/session.ts` | JWT encrypt/decrypt; cookie read/write; session lifecycle | `jose` library, `next/headers` |
| Prisma client | Type-safe ORM; schema migration; query builder | PostgreSQL or SQLite |
| `public/uploads/` | Local static file storage for MP4 previews and brand logos | Next.js static file serving |

---

## Recommended Project Structure

```
vlacovision/
├── app/
│   ├── (public)/                    # Public site — no auth required
│   │   ├── layout.tsx               # Site shell: nav, Framer Motion providers
│   │   ├── page.tsx                 # Home: hero video + project grid (SC)
│   │   └── projects/
│   │       └── [slug]/
│   │           └── page.tsx         # Project detail with Vimeo embed (SC)
│   │
│   ├── (admin)/                     # Admin panel — proxy.ts enforces auth
│   │   ├── layout.tsx               # Admin shell: sidebar, header
│   │   ├── login/
│   │   │   └── page.tsx             # Login form (CC — needs form state)
│   │   └── admin/
│   │       ├── page.tsx             # Dashboard overview (SC)
│   │       ├── projects/
│   │       │   ├── page.tsx         # Project list + drag-to-reorder (CC)
│   │       │   ├── new/page.tsx     # Create project form (CC)
│   │       │   └── [id]/page.tsx    # Edit project form (CC)
│   │       ├── settings/
│   │       │   └── page.tsx         # Site settings form (CC)
│   │       ├── logos/
│   │       │   └── page.tsx         # Logo grid + upload (CC)
│   │       ├── contacts/
│   │       │   └── page.tsx         # Contact inbox (SC + CC)
│   │       └── analytics/
│   │           └── page.tsx         # Analytics dashboard (SC)
│   │
│   └── api/
│       ├── projects/
│       │   ├── route.ts             # GET (list), POST (create)
│       │   ├── reorder/route.ts     # PATCH (update order array)
│       │   └── [id]/route.ts        # GET, PUT, DELETE single project
│       ├── settings/route.ts        # GET, PUT site settings
│       ├── logos/
│       │   ├── route.ts             # GET list, POST upload logo
│       │   └── [id]/route.ts        # DELETE logo
│       ├── contacts/
│       │   ├── route.ts             # POST (submit form), GET (inbox)
│       │   └── [id]/route.ts        # PATCH (mark read), DELETE
│       ├── upload/route.ts          # POST multipart/form-data → save file
│       ├── analytics/route.ts       # POST track, GET stats
│       └── auth/
│           ├── login/route.ts       # POST credentials → JWT cookie
│           └── logout/route.ts      # POST → delete cookie
│
├── components/
│   ├── public/                      # Public site components
│   │   ├── HeroVideo.tsx            # CC — autoplay, Framer Motion
│   │   ├── ProjectGrid.tsx          # SC — renders grid from DB
│   │   ├── ProjectCard.tsx          # CC — hover-to-play MP4 preview
│   │   ├── VimeoEmbed.tsx           # CC — iframe embed for detail page
│   │   ├── BrandLogos.tsx           # SC — logo marquee strip
│   │   └── ContactForm.tsx          # CC — form state, submission
│   │
│   └── admin/                       # Admin panel components
│       ├── ProjectForm.tsx           # CC — create/edit form
│       ├── ProjectList.tsx           # CC — drag-and-drop reorder
│       ├── LogoUploader.tsx          # CC — file input + preview
│       ├── VideoPreviewUpload.tsx    # CC — MP4 clip uploader
│       ├── SettingsForm.tsx          # CC — site settings editor
│       ├── ContactInbox.tsx          # CC — contact list + detail view
│       ├── AnalyticsDashboard.tsx    # CC — charts, stat cards
│       └── AdminSidebar.tsx          # CC — navigation
│
├── lib/
│   ├── session.ts          # JWT encrypt/decrypt, createSession, deleteSession
│   ├── dal.ts              # verifySession(), getUser(), all Prisma queries
│   ├── prisma.ts           # Prisma client singleton
│   ├── actions/            # Server Actions (form submissions from CC)
│   │   ├── auth.ts         # login(), logout()
│   │   ├── projects.ts     # createProject(), updateProject(), deleteProject()
│   │   ├── settings.ts     # updateSettings()
│   │   └── contacts.ts     # submitContact()
│   └── validations/        # Zod schemas for all form inputs
│       ├── project.ts
│       ├── settings.ts
│       └── contact.ts
│
├── prisma/
│   ├── schema.prisma       # DB schema
│   └── seed.ts             # Seed 22 existing projects
│
├── public/
│   └── uploads/            # Uploaded MP4 previews + brand logos
│       ├── previews/       # Short MP4 clip files
│       └── logos/          # Brand logo images
│
└── proxy.ts                # Auth gate for /admin/* routes
```

### Structure Rationale

- **`(public)/` and `(admin)/` route groups:** Parenthetical folders are excluded from the URL. Both groups get their own `layout.tsx` — public gets the cinematic site shell, admin gets the sidebar/nav shell. These are two distinct visual applications sharing one Next.js process.
- **`lib/dal.ts`:** Centralizes all Prisma queries and auth verification. Every protected Server Component calls `verifySession()` here. The DAL is marked `server-only` to prevent client-side leakage.
- **`lib/session.ts`:** Stateless JWT sessions using `jose` (Edge Runtime compatible). Cookie-based; no session table in DB. 7-day expiry with rolling refresh.
- **`public/uploads/`:** For Railway deployment, local filesystem is writable. For production scalability beyond a single server, replace with S3/R2 presigned uploads (deferred — not needed at MVP scale).
- **Server Actions in `lib/actions/`:** Used for mutations from Client Components (forms). Server Actions give type-safe server-side execution without a separate API call for form submissions.
- **Route Handlers in `app/api/`:** Used for operations initiated programmatically (drag-drop reorder, file upload with progress, analytics tracking). Not for form submissions — those use Server Actions.

---

## Architectural Patterns

### Pattern 1: Route Group Separation (Public vs Admin)

**What:** Two route groups `(public)` and `(admin)` give each section its own root layout. The proxy enforces auth on all `/admin/*` paths before they ever reach rendering.

**When to use:** Any time a single Next.js app serves two distinct audiences (public visitors vs authenticated owners) with completely different visual chrome.

**Trade-offs:** Navigating between route groups triggers a full page reload (different root layouts). This is acceptable since public visitors never go to admin routes and vice versa.

```typescript
// app/(admin)/layout.tsx — admin shell wraps all admin pages
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}

// app/(public)/layout.tsx — cinematic site shell
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white min-h-screen">
      <SiteNav />
      {children}
    </div>
  )
}
```

### Pattern 2: Server Component First, Client Component at Leaf

**What:** Pages and layouts are Server Components by default. Client Components are pushed to the leaves of the tree — only interactive elements get `'use client'`. Static shells stay server-rendered for fast initial load and SEO.

**When to use:** Every page. The default. Deviate only when you need `useState`, `useEffect`, event handlers, or browser APIs.

**Trade-offs:** Requires discipline. Accidentally importing a CC into an SC (without `children` prop pattern) causes build errors. Third-party libraries (Framer Motion, dnd-kit) need client boundary wrappers.

```typescript
// CORRECT: SC page → passes data down → CC handles interactivity
// app/(public)/page.tsx (Server Component)
export default async function Home() {
  const projects = await dal.getPublishedProjects()
  const settings = await dal.getSiteSettings()
  return (
    <>
      <HeroVideo url={settings.heroVideoUrl} />   {/* CC */}
      <ProjectGrid projects={projects} />          {/* SC shell, CC cards */}
    </>
  )
}

// components/public/ProjectCard.tsx
'use client'
export function ProjectCard({ project }: { project: Project }) {
  const [isHovering, setIsHovering] = useState(false)
  // hover-to-play logic
}
```

### Pattern 3: Stateless JWT Sessions via Cookie

**What:** Auth state is stored entirely in an encrypted, HttpOnly cookie (JWT via `jose`). No session table in the database. The proxy reads and decrypts this cookie on every request for an optimistic check. The DAL re-verifies in Server Components and Route Handlers for secure checks.

**When to use:** Single-admin applications (one owner). If multiple admin users with role granularity are needed, add a session table.

**Trade-offs:** Cannot revoke sessions server-side without a session table. Acceptable for a solo-owner CMS — the remedy is a short expiry (7 days) with rolling refresh.

```typescript
// lib/session.ts
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const key = new TextEncoder().encode(process.env.SESSION_SECRET)

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(key)

  ;(await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}
```

### Pattern 4: File Upload via Route Handler + Local Filesystem

**What:** File uploads (MP4 preview clips, brand logos) are handled by a dedicated `POST /api/upload` Route Handler. Files are streamed from `request.formData()` and written to `public/uploads/` subdirectories. The returned URL is stored in the database as a relative path.

**When to use:** Railway/Node.js hosting where the filesystem is writable. Works at MVP scale. Replace with S3/R2 presigned URLs when horizontal scaling is needed.

**Trade-offs:** Files are lost on container restart if volume is not mounted. Railway supports persistent volumes — mount `/app/public/uploads` to a volume in Railway config.

```typescript
// app/api/upload/route.ts
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const type = formData.get('type') as 'preview' | 'logo'

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${file.name}`
  const subdir = type === 'preview' ? 'previews' : 'logos'
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', subdir, filename)

  await writeFile(uploadPath, buffer)
  return Response.json({ url: `/uploads/${subdir}/${filename}` })
}
```

### Pattern 5: Prisma Schema Design

**What:** Five models covering all content domains. `Project` is the main entity. `SiteSettings` is a singleton row (only one row ever exists, updated in place). `BrandLogo` stores uploaded logo URLs. `ContactSubmission` captures the contact inbox. `AnalyticsEvent` is a simple append-only event log.

```prisma
// prisma/schema.prisma

model Project {
  id          String   @id @default(cuid())
  slug        String   @unique              // URL-safe identifier
  title       String
  client      String?
  services    String[]                      // ["Direction", "Cinematography"]
  year        Int?
  description String?
  vimeoId     String                        // e.g. "1010368544"
  previewUrl  String?                       // /uploads/previews/clip.mp4
  order       Int      @default(0)          // drag-to-reorder position
  published   Boolean  @default(false)      // draft/publish toggle
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SiteSettings {
  id              String  @id @default("singleton")
  heroVimeoId     String?                    // Featured hero video
  heroPreviewUrl  String?                    // Hero MP4 preview
  aboutText       String?
  companyName     String  @default("VLACOVISION")
  contactEmail    String?
  instagramUrl    String?
  updatedAt       DateTime @updatedAt
}

model BrandLogo {
  id        String   @id @default(cuid())
  name      String                           // "Nike", "Disney"
  imageUrl  String                           // /uploads/logos/nike.svg
  order     Int      @default(0)
  createdAt DateTime @default(now())
}

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model AnalyticsEvent {
  id        String   @id @default(cuid())
  event     String                           // "page_view" | "video_play" | "contact_click"
  path      String?                          // /projects/nike-spot
  projectId String?                          // For video_play events
  createdAt DateTime @default(now())
}

model AdminUser {
  id           String @id @default(cuid())
  email        String @unique
  passwordHash String
}
```

---

## Data Flow

### Public Site — Project Grid Request

```
Browser visits vlacovision.com
    ↓
proxy.ts — path is public, session check skipped → NextResponse.next()
    ↓
app/(public)/page.tsx (Server Component, runs on server)
    ↓
lib/dal.ts getPublishedProjects()
    ↓
Prisma → SELECT * FROM Project WHERE published=true ORDER BY order ASC
    ↓
Projects array returned → Server Component renders HTML with project data
    ↓
Client receives fully-rendered HTML + RSC payload
    ↓
ProjectCard (Client Component) hydrates → hover-to-play state initialized
    ↓
User hovers → <video> src="/uploads/previews/clip.mp4" plays instantly
```

### Admin — Edit Project Form Submission

```
Admin edits project in ProjectForm (Client Component)
    ↓
Form action calls Server Action: lib/actions/projects.ts updateProject()
    ↓
Server Action calls verifySession() → confirms valid session cookie
    ↓
Zod schema validates form data
    ↓
Prisma UPDATE Project SET ... WHERE id = ?
    ↓
revalidatePath('/admin/projects') → Next.js cache invalidated
    ↓
revalidatePath('/') → Public homepage cache invalidated
    ↓
Server Action redirects → admin project list re-fetches from DB
```

### Contact Form Submission (Public)

```
Visitor fills contact form → ContactForm (Client Component)
    ↓
Calls Server Action: lib/actions/contacts.ts submitContact()
    ↓
Zod validates name, email, message
    ↓
Prisma INSERT INTO ContactSubmission
    ↓
(Optional) Send email notification via nodemailer/Resend
    ↓
Return success state → form shows confirmation
    ↓
Admin checks /admin/contacts → SC fetches unread count + inbox list
```

### File Upload — MP4 Preview Clip

```
Admin selects file in VideoPreviewUpload (Client Component)
    ↓
fetch() POST /api/upload with FormData (multipart)
    ↓
Route Handler app/api/upload/route.ts verifySession()
    ↓
request.formData() → File object
    ↓
Buffer written to public/uploads/previews/{timestamp}-{filename}.mp4
    ↓
Returns { url: "/uploads/previews/..." }
    ↓
Client stores URL in form state → submitted with project save
```

### Auth Flow — Admin Login

```
Admin visits /admin/projects
    ↓
proxy.ts: /admin/* is protected → reads session cookie → cookie absent
    ↓
NextResponse.redirect('/admin/login')
    ↓
Login form (Client Component) submitted → Server Action login()
    ↓
Query AdminUser by email → bcrypt.compare(password, hash)
    ↓
lib/session.ts createSession(userId) → JWT signed → HttpOnly cookie set
    ↓
redirect('/admin/projects')
    ↓
proxy.ts: session cookie present and valid → NextResponse.next()
    ↓
page.tsx: verifySession() called in DAL (double-check) → renders admin
```

---

## Build Order (Component Dependencies)

The build order matters because later phases depend on earlier ones.

```
1. Database layer (Prisma schema + migrations + seed)
       ↓
2. Auth system (lib/session.ts, proxy.ts, login route handler, AdminUser model)
       ↓
3. Data Access Layer (lib/dal.ts with verifySession + query functions)
       ↓
4. Public site components (no admin dependency)
   ├── Project model → ProjectGrid + ProjectCard (hover-to-play)
   ├── SiteSettings model → HeroVideo, BrandLogos
   └── ContactSubmission model → ContactForm
       ↓
5. Admin panel shell (AdminLayout, AdminSidebar)
       ↓
6. Admin CRUD pages (each requires step 4's API + step 5's shell)
   ├── /admin/projects (list, create, edit, reorder, publish toggle)
   ├── /admin/settings (site settings form)
   ├── /admin/logos (logo grid + upload)
   └── /admin/contacts (inbox)
       ↓
7. File upload system (needed by project edit and logo management)
       ↓
8. Analytics (append-only events + dashboard — can be last, non-blocking)
```

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k visitors/month | Current monolith is fine. SQLite works. Local filesystem for uploads. |
| 1k-50k visitors/month | Switch to PostgreSQL. Mount Railway volume for uploads. Add ISR (`revalidate`) to public pages. |
| 50k+ visitors/month | Replace local file uploads with S3/R2 presigned URLs. Add CDN in front. Consider read replica for analytics queries. |

### Scaling Priorities

1. **First bottleneck:** Video file delivery. MP4 previews served from Node.js process — add a CDN or move to object storage when traffic grows. The DB and auth layer can handle far more load than file serving.
2. **Second bottleneck:** Analytics event writes. The append-only `AnalyticsEvent` table will grow fastest. Add a time-based cleanup job or move to a dedicated analytics service (Plausible, Fathom) when rows exceed ~500k.

---

## Anti-Patterns

### Anti-Pattern 1: Auth Check Only in proxy.ts

**What people do:** Put auth logic only in `proxy.ts` and trust that protected routes are safe because the proxy gates them.

**Why it's wrong:** The Next.js docs explicitly warn: "Proxy should not be your only line of defense." Server Actions and Route Handlers are invoked as direct POST requests — a curl to `/api/projects` bypasses the proxy entirely.

**Do this instead:** Call `verifySession()` from `lib/dal.ts` at the top of every protected Route Handler and Server Action. The proxy is an optimistic UX redirect layer; the DAL is the real security boundary.

### Anti-Pattern 2: Putting Business Logic in Client Components

**What people do:** Fetch data in Client Components using `useEffect` + fetch, handle loading/error states manually.

**Why it's wrong:** In App Router, this negates SSR benefits (no SEO, flash of empty content), adds unnecessary client JavaScript, and exposes API endpoints that don't need to exist.

**Do this instead:** Fetch data in Server Components (async page.tsx), pass as props to Client Components. Reserve Client Components for state and events only.

### Anti-Pattern 3: Storing Files in /tmp or Memory

**What people do:** Buffer uploaded files in memory or write to `/tmp` without awareness of container lifecycle.

**Why it's wrong:** `/tmp` on Railway is ephemeral and not shared across deploys. Files are lost on restart. Memory buffers fail for large video preview clips.

**Do this instead:** Write to `public/uploads/` and mount that path to a Railway persistent volume. Alternatively, use presigned S3 uploads from day one.

### Anti-Pattern 4: One Giant Prisma Query for the Homepage

**What people do:** Fetch all projects with all fields (including large description text) for the homepage grid.

**Why it's wrong:** The grid only needs title, slug, client, previewUrl, and order. Selecting all fields wastes bandwidth and adds latency, especially when 22+ projects are in the database.

**Do this instead:** Use Prisma `select` to specify only the fields needed per view. The detail page fetches the full record including description and vimeoId.

### Anti-Pattern 5: Using Layout.tsx for Auth Checks

**What people do:** Put `verifySession()` in a shared layout component expecting it to protect all child routes.

**Why it's wrong:** Next.js layouts use partial rendering — they do not re-render on every navigation. A user who logs out and then navigates client-side may still see protected UI from the cached layout render.

**Do this instead:** Put auth checks in individual page components and in the DAL functions they call. Use `proxy.ts` for redirect behavior and the DAL for data-level security.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Vimeo | Client-side `<iframe>` embed with `player.vimeo.com/video/{id}` | Only on project detail pages. No API key needed for embed-only. Load lazily. |
| Railway (hosting) | Node.js server deployment. Persistent volume for `/app/public/uploads` | Set `SESSION_SECRET`, `DATABASE_URL` as Railway environment variables |
| Email (optional) | Nodemailer or Resend for contact form notifications | Not required at MVP. Can be added to `submitContact()` Server Action without touching the schema |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Public site ↔ Database | Server Components call DAL functions directly (no API round-trip) | Highest confidence — data served at render time |
| Admin forms ↔ Database | Server Actions for form submission; Route Handlers for programmatic ops (reorder, file upload) | Server Actions preferred for form data; Route Handlers for progress/streaming needs |
| proxy.ts ↔ DAL | proxy reads cookie only; DAL does DB verification | Never call Prisma from proxy.ts — it runs on every request and must be fast |
| Client Components ↔ Server | Props (from SC parent) or Server Actions (mutations) or fetch() to Route Handlers | Context providers are CC-only; do not attempt to pass server-fetched data via context |

---

## Sources

- Next.js 16.2.1 official documentation (updated 2026-03-25): https://nextjs.org/docs/app/api-reference/file-conventions/route-groups
- Next.js Server and Client Components guide: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js Authentication guide: https://nextjs.org/docs/app/guides/authentication
- Next.js proxy.ts (formerly middleware) reference: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- Next.js Route Handlers reference: https://nextjs.org/docs/app/api-reference/file-conventions/route

---
*Architecture research for: Next.js 14+ portfolio + admin CMS (VLACOVISION)*
*Researched: 2026-03-30*
