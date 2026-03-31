# Phase 5: Admin CMS - Research

**Researched:** 2026-03-30
**Domain:** Next.js 16 Server Actions CRUD, file upload to /public, optimistic toggle, admin sidebar layout, read/unread message tracking
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Admin UI Layout**
- Clean sidebar layout — sidebar on left with nav links, content area on right
- Sidebar links: Dashboard (overview), Projects, Settings, Brand Logos, Messages
- Minimalist functional design — Linear meets WordPress aesthetic
- Dark theme matching public site (Phase 1 design tokens)
- No bloat — just forms and lists, no complex workflows

**Project Management (ADMIN-01 through ADMIN-06, ADMIN-08)**
- Projects list: table/card view with thumbnail, title, client, status (published/draft), sort order
- Create/Edit form: title, client, services, year, description, Vimeo URL, thumbnail URL (auto-fetched from Vimeo oEmbed), published toggle
- Delete: confirmation dialog ("Are you sure? This can't be undone.")
- Publish/Unpublish: toggle switch on the list view — instant, no page reload
- Hero video update: Vimeo URL field in Settings page (updates SiteConfig)

**File Uploads & Media**
- URL-based for videos — paste Vimeo URL, system auto-fetches thumbnail
- Brand logos: simple file upload to /public/assets/ via Server Action with formData
- previewClipUrl field stays optional in DB — ready for MP4 clips when available
- No cloud storage for MVP — logo files are small and rarely change

**Settings Page (ADMIN-09, ADMIN-10)**
- Single form: hero Vimeo URL, about text, contact email, location, Instagram URL, Vimeo profile URL
- Save button updates SiteConfig in database
- Simple, no tabs or complex layout

**Brand Logo Management (ADMIN-11)**
- Grid view of current logos with delete button on each
- Upload new logo: file input + upload button
- No drag-and-drop reorder for logos (marquee displays them all anyway)
- Logos stored in /public/assets/ and tracked in DB (or filesystem scan)

**Contact Messages Inbox (ADMIN-12)**
- List view: name, email, date, message preview
- Read/unread status: bold for unread, normal for read
- Click to view full message detail
- Delete messages
- No reply functionality — owner replies via his own email client

**Tablet Responsiveness (RESP-03)**
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

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ADMIN-01 | Admin dashboard home page with overview | Dashboard Server Component reads unread message count via db.contactSubmission.count(); renders nav cards |
| ADMIN-02 | Project list view with all projects and their status (published/draft) | db.project.findMany({ orderBy: { sortOrder: 'asc' } }); Client Component for useOptimistic toggle |
| ADMIN-03 | Create new project form (title, client, services, year, description, Vimeo URL, thumbnail) | Server Action + Zod + db.project.create(); revalidatePath('/admin/projects') + revalidatePath('/') |
| ADMIN-04 | Edit existing project | updateProject.bind(null, projectId) pattern; db.project.update(); same Zod schema as create |
| ADMIN-05 | Delete project with confirmation | deleteProject.bind(null, projectId); dialog via CSS/state toggle; db.project.delete(); revalidatePath |
| ADMIN-06 | Publish/unpublish toggle (draft mode) | useOptimistic hook in Client Component; togglePublished Server Action; db.project.update({ published }) |
| ADMIN-08 | Update hero/featured video from admin | Settings form updates SiteConfig row (id: "singleton"); db.siteConfig.update() or upsert |
| ADMIN-09 | Edit about section content from admin | Same Settings form as ADMIN-08; aboutText field in SiteConfig |
| ADMIN-10 | Edit contact information from admin | Same Settings form; contactEmail + new location/instagram/vimeoProfile fields need schema migration |
| ADMIN-11 | Upload and manage brand logos from admin | formData.get('file') as File; arrayBuffer → Buffer → fs.writeFile to /public/assets/; filesystem scan |
| ADMIN-12 | Contact form submissions inbox in admin | db.contactSubmission.findMany(); markRead Server Action sets read=true; delete action |
| RESP-03 | Admin panel usable on tablet | CSS md:flex sidebar visible; below md: translate-x-[-100%] with hamburger toggle via useState |
</phase_requirements>

---

## Summary

Phase 5 builds the admin CMS on top of the already-complete auth system (Phase 2). All patterns are extensions of what exists: Server Actions with Zod validation (contact.ts pattern), verifySession() in every page (dal.ts pattern), Prisma queries via db.ts singleton. No new libraries are required for the core CMS. The only new technique is file writes with Node.js `fs` for logo uploads, and `useOptimistic` for the publish/unpublish toggle.

The schema needs one migration before any admin work begins: SiteConfig is missing `location`, `instagramUrl`, and `vimeoProfileUrl` fields required by the Settings page (ADMIN-09/ADMIN-10). The Project model needs a `thumbnailUrl` field added for storing the auto-fetched Vimeo thumbnail (the public site currently fetches it live, but admin saves it on project create/edit). The schema should also add `previewClipUrl String @default("")` per the CONTEXT.md note.

The biggest architectural decision is **shadcn/ui vs custom Tailwind for admin UI components**. Research verdict: custom Tailwind. The project already has its own dark design token system (`--color-bg-base`, `--color-bg-card`, `--color-accent`, etc.) in `globals.css`. Installing shadcn/ui would inject its own CSS variable namespace and risk overwriting the custom `@theme` block. For a minimalist admin panel with forms and lists — not complex data visualization — the existing token system plus plain Tailwind classes is sufficient and avoids the integration friction.

**Primary recommendation:** Build admin UI with custom Tailwind using existing design tokens. Use Server Actions + Zod + useActionState for all CRUD forms (established pattern). Use useOptimistic for the publish toggle. Use Node.js `fs.writeFile` for logo uploads to `/public/assets/`. Use filesystem scan (not DB records) for logo tracking.

---

## Standard Stack

### Core (all already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next (built-in) | 16.2.1 | Server Actions, revalidatePath, useOptimistic | Already in project; no addition needed |
| react (built-in) | 19.0.0 | useOptimistic, useActionState, useState | Already in project |
| zod | 4.3.6 | Admin form validation in Server Actions | Already in project; established pattern |
| prisma @prisma/client | 7.6.0 | All DB operations (create, update, delete, findMany) | Already in project |
| server-only | 0.0.1 | Guard admin actions from client bundle | Already in project |
| node:fs (built-in) | — | Write uploaded logo files to /public/assets/ | Node.js built-in; no install |
| node:path (built-in) | — | Resolve /public/assets/ path safely | Node.js built-in; no install |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| framer-motion | 12.38.0 | Sidebar slide animation on mobile/tablet | Already in project; use m.div for sidebar panel |
| next/cache revalidatePath | built-in | Bust admin page cache after mutations | After every create/update/delete action |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom Tailwind admin UI | shadcn/ui | shadcn init overwrites globals.css and injects its own CSS variable namespace — conflicts with existing --color-* tokens; not worth the migration cost for a simple form/list admin |
| Filesystem scan for logos | DB BrandLogo model | DB model adds migration complexity; filesystem scan is simpler and correct since /public/assets/ is stable between deploys via Railway Volume |
| useOptimistic for toggle | Full page reload | Full reload works but feels slow; useOptimistic is the correct React 19 pattern and is simpler than it looks |

**No new npm installs required for Phase 5.** All dependencies are already in package.json.

---

## Architecture Patterns

### Recommended Admin Directory Structure

```
src/
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx                    # Add sidebar nav here (upgrade from passthrough)
│   │   └── admin/
│   │       ├── page.tsx                  # ADMIN-01: Dashboard (replace placeholder)
│   │       ├── projects/
│   │       │   ├── page.tsx              # ADMIN-02: Projects list
│   │       │   ├── new/
│   │       │   │   └── page.tsx          # ADMIN-03: Create form
│   │       │   └── [id]/
│   │       │       └── page.tsx          # ADMIN-04: Edit form
│   │       ├── settings/
│   │       │   └── page.tsx              # ADMIN-08/09/10: Settings form
│   │       ├── logos/
│   │       │   └── page.tsx              # ADMIN-11: Logo grid + upload
│   │       └── messages/
│   │           ├── page.tsx              # ADMIN-12: Inbox list
│   │           └── [id]/
│   │               └── page.tsx          # Message detail view
│   └── actions/
│       ├── auth.ts                       # existing (login/logout)
│       ├── contact.ts                    # existing (public contact form)
│       ├── projects.ts                   # NEW: createProject, updateProject, deleteProject, togglePublished
│       ├── settings.ts                   # NEW: updateSettings
│       ├── logos.ts                      # NEW: uploadLogo, deleteLogo
│       └── messages.ts                   # NEW: markRead, deleteMessage
├── components/
│   ├── admin/
│   │   ├── sidebar.tsx                   # NEW: sidebar nav with collapse
│   │   ├── project-form.tsx              # NEW: shared create/edit form
│   │   ├── project-list.tsx              # NEW: list with optimistic toggle
│   │   ├── logo-grid.tsx                 # NEW: grid + upload
│   │   └── message-list.tsx              # NEW: inbox list
│   └── ui/
│       ├── cta-button.tsx                # existing
│       └── login-form.tsx                # existing
prisma/
└── schema.prisma                         # Migration: add thumbnailUrl, previewClipUrl to Project; add location/instagramUrl/vimeoProfileUrl to SiteConfig
```

### Pattern 1: Server Action CRUD with Prisma (Create)

**What:** Server Action receives FormData, validates with Zod, writes to DB, revalidates affected paths.
**When to use:** createProject, updateSettings, uploadLogo.

```typescript
// src/app/actions/projects.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/dal'

const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  client: z.string().min(1, 'Client is required').max(200),
  services: z.string().max(500).default(''),
  year: z.coerce.number().int().min(2000).max(2099),
  description: z.string().max(5000).default(''),
  vimeoId: z.string().min(1, 'Vimeo ID is required'),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean().default(false),
})

export type ProjectActionState = {
  status: 'idle' | 'success' | 'error'
  errors?: Partial<Record<keyof z.infer<typeof ProjectSchema> | '_form', string[]>>
}

export async function createProject(
  prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  await verifySession()  // auth check — ALWAYS first

  const parsed = ProjectSchema.safeParse({
    title: formData.get('title'),
    client: formData.get('client'),
    services: formData.get('services') || '',
    year: formData.get('year'),
    description: formData.get('description') || '',
    vimeoId: formData.get('vimeoId'),
    thumbnailUrl: formData.get('thumbnailUrl') || '',
    published: formData.get('published') === 'true',
  })

  if (!parsed.success) {
    return { status: 'error', errors: parsed.error.flatten().fieldErrors }
  }

  const { title, client, services, year, description, vimeoId, thumbnailUrl, published } = parsed.data

  // Generate slug from title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  try {
    await db.project.create({
      data: {
        slug,
        title, client, services, year, description, vimeoId,
        thumbnailUrl: thumbnailUrl ?? '',
        published,
      },
    })
  } catch {
    return { status: 'error', errors: { _form: ['Failed to create project.'] } }
  }

  revalidatePath('/admin/projects')   // admin list
  revalidatePath('/', 'layout')       // public portfolio grid
  redirect('/admin/projects')
}
```

### Pattern 2: Server Action with Bound ID (Update/Delete)

**What:** Use `action.bind(null, id)` to pass the record ID to a Server Action without a hidden field. The action receives the ID as its first argument before `formData`.
**When to use:** updateProject, deleteProject, deleteMessage.

```typescript
// Source: https://nextjs.org/docs/app/guides/forms (Next.js 16.2.1, 2026-03-31)

// In the action file:
export async function updateProject(
  id: string,
  prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  await verifySession()
  // ...validate, update, revalidate
}

// In the Client Component:
'use client'
import { updateProject } from '@/app/actions/projects'

export function ProjectEditForm({ project }: { project: Project }) {
  const updateWithId = updateProject.bind(null, project.id)
  const [state, formAction, pending] = useActionState(updateWithId, { status: 'idle' })

  return <form action={formAction}>...</form>
}
```

### Pattern 3: useOptimistic for Publish/Unpublish Toggle

**What:** Client Component holds list of projects with `useOptimistic`. Clicking the toggle calls `setOptimistic` immediately (UI updates) then fires the Server Action. On Server Action return, real state takes over.
**When to use:** Publish/unpublish toggle on the project list view (ADMIN-06).

```typescript
// Source: https://react.dev/reference/react/useOptimistic (React 19 docs, verified 2026-03-30)
// Source: https://nextjs.org/docs/app/guides/forms (Next.js 16.2.1, 2026-03-31)
'use client'

import { useOptimistic, startTransition } from 'react'
import { togglePublished } from '@/app/actions/projects'

type Project = { id: string; title: string; published: boolean }

export function ProjectList({ projects }: { projects: Project[] }) {
  const [optimisticProjects, setOptimistic] = useOptimistic(
    projects,
    (state, { id, published }: { id: string; published: boolean }) =>
      state.map((p) => (p.id === id ? { ...p, published } : p))
  )

  function handleToggle(project: Project) {
    startTransition(async () => {
      // 1. Update UI immediately
      setOptimistic({ id: project.id, published: !project.published })
      // 2. Hit server
      await togglePublished(project.id, !project.published)
      // 3. revalidatePath inside togglePublished refreshes real state
    })
  }

  return (
    <ul>
      {optimisticProjects.map((p) => (
        <li key={p.id}>
          {p.title}
          <button onClick={() => handleToggle(p)}>
            {p.published ? 'Unpublish' : 'Publish'}
          </button>
        </li>
      ))}
    </ul>
  )
}
```

The Server Action for the toggle:

```typescript
// src/app/actions/projects.ts
export async function togglePublished(id: string, published: boolean): Promise<void> {
  await verifySession()
  await db.project.update({ where: { id }, data: { published } })
  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')  // public site reflects immediately
}
```

### Pattern 4: File Upload via Server Action (Logo Upload)

**What:** A `<form>` submits a file input. Server Action receives the file as a `File` object from `formData.get('file')`. Converts to Buffer, writes to `/public/assets/` with `fs.writeFile`.
**When to use:** Logo upload (ADMIN-11).

```typescript
// Source: Next.js file upload pattern via Server Actions (verified multiple sources, 2026-03-30)
'use server'

import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/dal'

export async function uploadLogo(
  prevState: { status: string; error?: string },
  formData: FormData
): Promise<{ status: string; error?: string }> {
  await verifySession()

  const file = formData.get('file') as File | null

  if (!file || file.size === 0) {
    return { status: 'error', error: 'No file selected.' }
  }

  // Validate: images only, max 2MB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    return { status: 'error', error: 'Only PNG, JPG, WebP, and SVG files are accepted.' }
  }
  if (file.size > 2 * 1024 * 1024) {
    return { status: 'error', error: 'File must be under 2MB.' }
  }

  // Sanitize filename: lowercase, replace spaces, keep extension
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  const baseName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
  const filename = `${baseName}-${Date.now()}.${ext}`

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // process.cwd() is the project root at runtime — public/assets/ is correct
  const assetsDir = join(process.cwd(), 'public', 'assets')
  await writeFile(join(assetsDir, filename), buffer)

  revalidatePath('/admin/logos')
  revalidatePath('/', 'layout')  // public marquee refreshes

  return { status: 'success' }
}
```

> **Railway note:** Railway's default filesystem IS ephemeral — files in `/public/assets/` written at runtime will be lost on redeploy. However, the CONTEXT.md explicitly accepts this risk: "No cloud storage for MVP — logo files are small and rarely change." The logos already in `/public/assets/` (19 existing files) are committed to git and survive deploy. New uploads added via admin will be lost on redeploy. This is acceptable for MVP. The planner should add a task comment noting the operator should re-upload logos after any redeploy until Railway Volumes are added.

### Pattern 5: Filesystem Scan for Logo Tracking

**What:** Instead of a DB model for logos, scan `/public/assets/` directory at request time and return filenames. Logos are referenced as `/assets/filename`.
**When to use:** Logo list page (ADMIN-11), replacing the existing hardcoded logo list.

```typescript
// src/app/(admin)/admin/logos/page.tsx
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { verifySession } from '@/lib/dal'

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg'])

export default async function LogosPage() {
  await verifySession()

  const assetsDir = join(process.cwd(), 'public', 'assets')
  const allFiles = readdirSync(assetsDir)
  const logos = allFiles.filter((f) => {
    const ext = '.' + f.split('.').pop()?.toLowerCase()
    return IMAGE_EXTENSIONS.has(ext) && !f.startsWith('LOGO_')  // exclude site logo
  })

  return (
    <div>
      {/* Logo grid */}
      {logos.map((filename) => (
        <div key={filename}>
          <img src={`/assets/${encodeURIComponent(filename)}`} alt={filename} />
          {/* Delete button calls deleteLogo.bind(null, filename) */}
        </div>
      ))}
      {/* Upload form */}
    </div>
  )
}
```

Logo delete action removes the file from disk:

```typescript
export async function deleteLogo(filename: string): Promise<void> {
  await verifySession()
  // Sanitize: no path traversal
  if (filename.includes('/') || filename.includes('..')) return
  const filePath = join(process.cwd(), 'public', 'assets', filename)
  await unlink(filePath)
  revalidatePath('/admin/logos')
  revalidatePath('/', 'layout')
}
```

### Pattern 6: Admin Sidebar Layout (No Library Needed)

**What:** `(admin)/layout.tsx` becomes a real layout with sidebar + content area. Sidebar has state for collapse on tablet/mobile. No shadcn/ui required.
**When to use:** Phase 5 admin shell.

```typescript
// src/app/(admin)/layout.tsx
import { AdminSidebar } from '@/components/admin/sidebar'

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
```

```typescript
// src/components/admin/sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/admin',          label: 'Dashboard' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/logos',    label: 'Brand Logos' },
  { href: '/admin/messages', label: 'Messages' },
]

export function AdminSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Hamburger: visible below md */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-bg-card border border-white/10 rounded"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        {/* 3-line icon */}
      </button>

      {/* Backdrop for tablet */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-bg-card border-r border-white/10
          flex flex-col
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="p-6 border-b border-white/10">
          <span className="text-text-primary font-bold text-sm uppercase tracking-widest">Admin</span>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`
                px-4 py-2.5 rounded text-sm transition-colors
                ${pathname === href
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'}
              `}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
```

### Pattern 7: Read/Unread Message Tracking

**What:** `ContactSubmission` already has `read Boolean @default(false)`. Marking as read fires a Server Action that sets `read: true`. The inbox list uses bold/normal font weight to distinguish.
**When to use:** Messages inbox (ADMIN-12).

```typescript
// Mark read on detail page view (auto-mark)
export async function markMessageRead(id: string): Promise<void> {
  await verifySession()
  await db.contactSubmission.update({ where: { id }, data: { read: true } })
  revalidatePath('/admin/messages')
  // Also revalidates dashboard unread count badge
  revalidatePath('/admin')
}

// Query for inbox list
const messages = await db.contactSubmission.findMany({
  orderBy: { createdAt: 'desc' },
  select: { id: true, name: true, email: true, message: true, read: true, createdAt: true },
})

// Inbox row renders:
// <tr className={message.read ? 'text-text-muted' : 'text-text-primary font-semibold'}>
```

### Pattern 8: SiteConfig Upsert (Settings Page)

**What:** SiteConfig is a singleton row (`id: "singleton"`). Use `upsert` so it works even if the row doesn't exist yet.
**When to use:** Settings form save action (ADMIN-08, ADMIN-09, ADMIN-10).

```typescript
export async function updateSettings(
  prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  await verifySession()

  // ...Zod validation...

  await db.siteConfig.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      heroVimeoId: data.heroVimeoId,
      aboutText: data.aboutText,
      contactEmail: data.contactEmail,
      location: data.location,
      instagramUrl: data.instagramUrl,
      vimeoProfileUrl: data.vimeoProfileUrl,
    },
    update: {
      heroVimeoId: data.heroVimeoId,
      aboutText: data.aboutText,
      contactEmail: data.contactEmail,
      location: data.location,
      instagramUrl: data.instagramUrl,
      vimeoProfileUrl: data.vimeoProfileUrl,
    },
  })

  revalidatePath('/admin/settings')
  revalidatePath('/', 'layout')  // public site footer/about refresh
  return { status: 'success' }
}
```

### Anti-Patterns to Avoid

- **Missing `await verifySession()` in Server Actions:** Auth only in the page component is insufficient — Server Actions can be called directly via POST. Every action must call `verifySession()` as its first statement.
- **Using hidden `<input type="hidden" name="id">` for IDs:** The value is visible in rendered HTML. Use `action.bind(null, id)` instead — it is encoded and not in the DOM.
- **Calling `redirect()` inside a try/catch block:** `redirect()` throws an internal Next.js error that gets swallowed by catch. Call `redirect()` after the try/catch block.
- **Skipping `revalidatePath('/', 'layout')` after admin mutations:** Admin changes to projects or SiteConfig must also bust the public site cache, or visitors will see stale data.
- **Writing files with a predictable filename (no timestamp):** Two uploads of `nike-logo.png` would overwrite each other. Always suffix with `Date.now()` or a random token.
- **Using `readFileSync` in a Server Component:** This blocks the Node.js event loop. Use `readdirSync` is acceptable in RSC (not in hot paths), but prefer async `readdir` for correctness.
- **Assuming `process.cwd()` is always the project root:** It is in Railway's runtime. But in tests or unusual setups it may not be. Use it confidently for MVP.

---

## Schema Migration Required (Wave 0 Task)

Before any admin feature work, the Prisma schema needs additions:

```prisma
model Project {
  // ...existing fields...
  thumbnailUrl   String   @default("")  // ADD: stored from Vimeo oEmbed on save
  previewClipUrl String   @default("")  // ADD: optional MP4 clip URL (future)
}

model SiteConfig {
  id              String @id @default("singleton")
  heroVimeoId     String @default("")
  aboutText       String @default("")
  contactEmail    String @default("")
  location        String @default("")     // ADD: for settings page (ADMIN-10)
  instagramUrl    String @default("")     // ADD: for settings page (ADMIN-10)
  vimeoProfileUrl String @default("")    // ADD: for settings page (ADMIN-10)
}
```

Migration command:
```bash
npx prisma migrate dev --name add-admin-cms-fields
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toggle state that survives round-trip | Manual useState + refetch | `useOptimistic` | React 19 built-in; auto-reverts on failure; single source of truth |
| Passing record ID to Server Action | `<input type="hidden">` | `action.bind(null, id)` | Hidden inputs are in DOM (readable/editable); bind is encoded in closure |
| Cache invalidation after CRUD | Manual page reload / router.refresh() | `revalidatePath()` | Built-in Next.js primitive; correct semantics for RSC cache |
| File type validation | Custom MIME regex | Explicit allowlist array | MIME types can be spoofed; add server-side extension check as second layer |
| Slug generation | UUID or random string | Derived from title (lowercased, hyphenated) | Human-readable URLs; consistent with existing `/projects/[slug]` route |
| Form error display | Alert popups | useActionState state object | Progressive-enhancement safe; matches existing contact form pattern |

---

## Common Pitfalls

### Pitfall 1: redirect() Inside try/catch

**What goes wrong:** `redirect()` in Next.js throws a special `NEXT_REDIRECT` error internally. If wrapped in a try/catch, the catch block swallows the redirect and the user sees no navigation.

**Why it happens:** Developers reflexively wrap all DB code in try/catch, then add redirect at the end of the try block.

**How to avoid:**
```typescript
// WRONG:
try {
  await db.project.create({ data })
  redirect('/admin/projects')  // This throw is caught!
} catch (e) {
  return { status: 'error' }
}

// CORRECT:
try {
  await db.project.create({ data })
} catch {
  return { status: 'error', errors: { _form: ['Save failed.'] } }
}
redirect('/admin/projects')  // Outside try/catch
```

**Warning signs:** Form submits successfully (DB record created) but page doesn't redirect; or form redirects to error state even when DB write succeeds.

### Pitfall 2: verifySession() Not Called in Server Action

**What goes wrong:** Admin mutations work without authentication — any user who discovers the action URL can POST to it.

**Why it happens:** Developer assumes the page-level `await verifySession()` protects the entire request.

**How to avoid:** Every Server Action must call `await verifySession()` as its FIRST statement, before any other logic. The page-level check guards rendering; the action-level check guards mutations.

**Warning signs:** Server Actions callable via curl/Postman without a session cookie.

### Pitfall 3: stale Public Site After Admin Mutation

**What goes wrong:** Admin saves a project change; public portfolio still shows the old title/status.

**Why it happens:** `revalidatePath('/admin/projects')` only invalidates the admin page, not the public routes.

**How to avoid:** Every mutation action must call both:
- `revalidatePath('/admin/projects')` — admin list
- `revalidatePath('/', 'layout')` — purges entire public site's layout cache

For project detail pages, also call `revalidatePath('/projects/[slug]', 'page')` if slug could change.

**Warning signs:** Admin shows new data; `localhost:3000` still shows old data after hard refresh.

### Pitfall 4: Railway Ephemeral Filesystem for Logo Uploads

**What goes wrong:** Owner uploads logos via admin. Railway redeploys. All uploaded logos disappear. The public marquee shows broken images.

**Why it happens:** Railway's default filesystem is ephemeral — only files baked into the Docker image (committed to git) survive redeploys.

**How to avoid:** For MVP, document this limitation clearly in admin UI ("Note: uploaded logos will need to be re-uploaded after site updates"). Long-term fix is Railway Volume mount at `/public/assets/`. The 19 existing logos are committed to git and are safe.

**Warning signs:** Logos visible immediately after upload; broken after next deploy.

### Pitfall 5: Slug Collision on Project Create

**What goes wrong:** Two projects with similar titles generate the same slug. `db.project.create()` throws a unique constraint violation on `slug`.

**Why it happens:** Slug is derived from title; "Nike Campaign" and "Nike Campaigns" both become `nike-campaign`.

**How to avoid:** Catch the unique constraint error specifically and return a user-facing error. Optionally append a short suffix (year or random 4 chars) to disambiguate.

```typescript
} catch (e) {
  if (e instanceof Error && e.message.includes('Unique constraint')) {
    return { status: 'error', errors: { title: ['A project with a similar title already exists. Try adding the year.'] } }
  }
  return { status: 'error', errors: { _form: ['Failed to save project.'] } }
}
```

**Warning signs:** 500 error on project create when titles are similar; Prisma unique constraint error in logs.

### Pitfall 6: useOptimistic Outside startTransition

**What goes wrong:** Calling `setOptimistic()` outside `startTransition()` causes React to warn "An update to a component inside a startTransition was not wrapped in startTransition" and may not behave correctly.

**Why it happens:** Developer calls `setOptimistic()` directly in an onClick handler without `startTransition`.

**How to avoid:** Always wrap `setOptimistic()` + the Server Action call together inside `startTransition(async () => { ... })`.

**Warning signs:** React console warning about startTransition; optimistic update reverts immediately before server response.

### Pitfall 7: SiteConfig Row Missing (upsert not update)

**What goes wrong:** Settings save throws "Record to update not found" because the SiteConfig singleton row was never seeded.

**Why it happens:** Using `db.siteConfig.update()` instead of `db.siteConfig.upsert()` when the singleton row doesn't exist.

**How to avoid:** Always use `upsert` with `where: { id: 'singleton' }` and provide both `create` and `update` data.

**Warning signs:** Settings page save returns 500; Prisma "Record not found" error in logs.

---

## Code Examples

### revalidatePath After Create/Update/Delete

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/revalidatePath (Next.js 16.2.1, 2026-03-31)
import { revalidatePath } from 'next/cache'

// After create/update/delete a project:
revalidatePath('/admin/projects')         // admin list refreshes
revalidatePath('/', 'layout')             // entire public site cache purged

// After update a specific project:
revalidatePath(`/projects/${slug}`, 'page') // specific detail page

// After settings change:
revalidatePath('/admin/settings')
revalidatePath('/', 'layout')
```

### Zod Coercion for Year Field

```typescript
// Source: Zod v4 docs — coerce converts string form value to number
const ProjectSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2099),
  published: z.boolean().default(false),
})

// formData.get('year') returns string "2024"
// z.coerce.number() converts it to 2024 — no manual parseInt needed
```

### Auto-fetch Vimeo Thumbnail on Project Save

```typescript
// Reuse existing src/lib/vimeo.ts — getVimeoThumbnail(vimeoId)
// Call it in the Server Action after validation, before DB write:
import { getVimeoThumbnail } from '@/lib/vimeo'

const thumbnailUrl = await getVimeoThumbnail(vimeoId) ?? ''

await db.project.create({
  data: { ..., vimeoId, thumbnailUrl }
})
```

### Dashboard Unread Message Count

```typescript
// src/app/(admin)/admin/page.tsx
import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'

export default async function AdminDashboard() {
  await verifySession()

  const [projectCount, unreadCount] = await Promise.all([
    db.project.count(),
    db.contactSubmission.count({ where: { read: false } }),
  ])

  // Render nav cards with counts as badges
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| API Routes for CRUD | Server Actions with formData | Next.js 14+ App Router stable | Eliminates /api layer; auth lives in the action itself |
| router.refresh() after mutation | revalidatePath() / revalidateTag() | Next.js 14+ | Precise cache invalidation; doesn't flash loading states |
| useReducer + fetch for optimistic | useOptimistic hook | React 19 | Built-in; auto-reverts on failure; cleaner API |
| middleware.ts route protection | proxy.ts | Next.js 16 | Renamed; same behavior |
| Hardcoding env path for public/ | process.cwd() + path.join | Node.js standard | Portable across dev/prod; works in Railway |

**Deprecated/outdated for this project:**
- API Routes for admin CRUD: Use Server Actions — established pattern from contact.ts
- next-safe-action wrapper: Overkill for a single-admin tool; plain Zod + useActionState is sufficient
- shadcn/ui for admin components: CSS variable collision with existing @theme; not worth the integration

---

## Open Questions

1. **Slug editing on project update**
   - What we know: Slug is derived from title on create; changing title on edit would change the slug, breaking existing `/projects/[slug]` URLs bookmarked externally
   - What's unclear: Should slug be auto-updated on title change, or locked after creation?
   - Recommendation: Lock slug after creation. Add a read-only `slug` display field in the edit form. If the owner really needs to change it, it's a manual DB operation.

2. **Logo exclusion from filesystem scan (LOGO_noBG.jpg)**
   - What we know: `/public/assets/LOGO_noBG.jpg` is the site logo, not a client logo
   - What's unclear: Other non-logo files may be in `/public/assets/` — the scan needs a reliable filter
   - Recommendation: Prefix all client logos with a marker, or maintain a simple exclusion list. Safest: create `/public/assets/logos/` subdirectory for client logos; keep site files in `/public/assets/`. This separates concerns cleanly and simplifies the scan.

3. **Project sortOrder on create**
   - What we know: `sortOrder Int @default(0)` — all new projects get 0, creating ties
   - What's unclear: How should new projects sort relative to existing ones?
   - Recommendation: On create, set `sortOrder` to `(max existing sortOrder) + 1`. Query `db.project.aggregate({ _max: { sortOrder: true } })` before insert. This places new projects at the bottom of the list by default, which is sensible for a chronological portfolio.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest (established from Phase 2 research; install if not present) |
| Config file | `jest.config.ts` |
| Quick run command | `npx jest --testPathPattern=admin --passWithNoTests` |
| Full suite command | `npx jest --passWithNoTests` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ADMIN-01 | Dashboard page renders unread count | smoke | `npm run build` (TypeScript compilation) | ❌ Wave 0 |
| ADMIN-02 | Projects list fetches from DB | smoke | `npm run build` | ❌ Wave 0 |
| ADMIN-03 | createProject returns error on missing title | unit | `npx jest __tests__/actions/projects.test.ts -t "createProject invalid" --passWithNoTests` | ❌ Wave 0 |
| ADMIN-04 | updateProject updates DB record | unit | `npx jest __tests__/actions/projects.test.ts -t "updateProject" --passWithNoTests` | ❌ Wave 0 |
| ADMIN-05 | deleteProject removes DB record | unit | `npx jest __tests__/actions/projects.test.ts -t "deleteProject" --passWithNoTests` | ❌ Wave 0 |
| ADMIN-06 | togglePublished flips boolean | unit | `npx jest __tests__/actions/projects.test.ts -t "togglePublished" --passWithNoTests` | ❌ Wave 0 |
| ADMIN-08 | updateSettings saves heroVimeoId | unit | `npx jest __tests__/actions/settings.test.ts --passWithNoTests` | ❌ Wave 0 |
| ADMIN-09 | updateSettings saves aboutText | unit | `npx jest __tests__/actions/settings.test.ts --passWithNoTests` | ❌ Wave 0 |
| ADMIN-10 | updateSettings saves contactEmail/location | unit | `npx jest __tests__/actions/settings.test.ts --passWithNoTests` | ❌ Wave 0 |
| ADMIN-11 | uploadLogo rejects non-image file | unit | `npx jest __tests__/actions/logos.test.ts --passWithNoTests` | ❌ Wave 0 |
| ADMIN-12 | markMessageRead sets read=true | unit | `npx jest __tests__/actions/messages.test.ts --passWithNoTests` | ❌ Wave 0 |
| RESP-03 | Sidebar renders hamburger below md breakpoint | manual | Browser DevTools responsive mode at 768px | N/A |

> Server Action unit tests require mocking `verifySession` (returns `{ isAuth: true, userId: 'test' }`), the Prisma db client (jest.mock), and `revalidatePath` + `redirect` from next/cache and next/navigation.

### Sampling Rate
- **Per task commit:** `npm run build` — validates TypeScript and Prisma generate
- **Per wave merge:** `npx jest --passWithNoTests`
- **Phase gate:** Manual smoke test — create project, edit, toggle publish, upload logo, view message, mark read, check public site reflects changes

### Wave 0 Gaps
- [ ] `__tests__/actions/projects.test.ts` — covers ADMIN-03, ADMIN-04, ADMIN-05, ADMIN-06
- [ ] `__tests__/actions/settings.test.ts` — covers ADMIN-08, ADMIN-09, ADMIN-10
- [ ] `__tests__/actions/logos.test.ts` — covers ADMIN-11
- [ ] `__tests__/actions/messages.test.ts` — covers ADMIN-12
- [ ] Jest install if not present: `npm install --save-dev jest @jest/globals ts-jest jest-environment-node`
- [ ] Schema migration: `npx prisma migrate dev --name add-admin-cms-fields`

---

## Sources

### Primary (HIGH confidence)
- [Next.js Forms Guide](https://nextjs.org/docs/app/guides/forms) — v16.2.1, updated 2026-03-31 — Server Actions with formData, bind() pattern for IDs, useActionState, useOptimistic, file upload pattern
- [Next.js revalidatePath API](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) — v16.2.1, updated 2026-03-31 — revalidatePath signature, page vs layout type, behavior after mutations
- [React useOptimistic docs](https://react.dev/reference/react/useOptimistic) — React 19 official docs — API, startTransition requirement, toggle example pattern
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — current — confirms full Tailwind v4 support but highlights CSS variable namespace collision risk
- Existing codebase — `prisma/schema.prisma`, `src/app/actions/contact.ts`, `src/lib/dal.ts`, `src/lib/vimeo.ts`, `src/app/(admin)/layout.tsx`, `src/app/(admin)/admin/page.tsx`, `public/assets/` directory listing

### Secondary (MEDIUM confidence)
- [Railway Volumes docs](https://docs.railway.com/reference/volumes) — confirms Railway default filesystem is ephemeral; files survive within a deployment but are destroyed on redeploy without a Volume
- WebSearch results on Next.js file upload with fs.writeFile — multiple sources confirm `formData.get('file') as File` + `arrayBuffer()` + `Buffer.from()` + `fs.writeFile` pattern for Server Actions

### Tertiary (LOW confidence)
- WebSearch results on shadcn/ui CSS variable conflict with custom @theme — single Medium article confirms init overwrites globals.css; recommend verifying before attempting install

---

## Metadata

**Confidence breakdown:**
- Standard stack (no new libs needed): HIGH — confirmed by inspecting package.json; all patterns use existing deps
- Server Action CRUD patterns: HIGH — verified against Next.js 16.2.1 official forms guide (updated 2026-03-31)
- useOptimistic toggle pattern: HIGH — verified against React 19 official docs
- revalidatePath behavior: HIGH — verified against Next.js 16.2.1 official API reference (updated 2026-03-31)
- File upload via Server Action: MEDIUM — Next.js official docs don't have a dedicated file upload guide; pattern confirmed by multiple community sources and consistent behavior
- Railway ephemeral filesystem: MEDIUM — official Railway docs confirm; specific behavior for /public/assets/ confirmed by search results
- shadcn/ui conflict decision: MEDIUM — CSS variable collision confirmed by docs and community; recommendation to avoid is well-supported but not from a single authoritative source

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (Next.js 16.2.1 docs current; React 19 stable; no fast-moving parts)
