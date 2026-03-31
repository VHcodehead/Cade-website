---
phase: 05-admin-cms
verified: 2026-03-30T00:00:00Z
status: gaps_found
score: 11/13 truths verified
gaps:
  - truth: "Admin can edit any existing project and changes reflect on the public site"
    status: failed
    reason: "Edit page exists at /admin/projects/[id] but there is no link or button in the project list UI that navigates to it. The edit route is an orphaned page — not reachable via the admin interface."
    artifacts:
      - path: "src/components/admin/project-list.tsx"
        issue: "No Edit button or link to /admin/projects/[id] — project rows only have Toggle and Delete actions"
    missing:
      - "Add an Edit link/button to each project row in ProjectList that navigates to /admin/projects/[id]"
  - truth: "Row hover state in message list uses correct design token"
    status: failed
    reason: "message-list.tsx uses hover:bg-bg-elevated on message rows, but --color-bg-elevated is not defined in globals.css. The defined elevated token is --color-bg-section (bg-bg-section). This class renders as a no-op — hover state has no visual effect."
    artifacts:
      - path: "src/components/admin/message-list.tsx"
        issue: "Line 56: hover:bg-bg-elevated — token does not exist in globals.css @theme block"
    missing:
      - "Replace hover:bg-bg-elevated with hover:bg-bg-section on line 56 of message-list.tsx"
human_verification:
  - test: "Tablet viewport sidebar behaviour"
    expected: "At tablet width (~768px) the sidebar is hidden and a hamburger button appears. Tapping opens sidebar as overlay with backdrop."
    why_human: "CSS responsive transitions require visual inspection in a browser"
  - test: "Vimeo thumbnail auto-preview in project form"
    expected: "Entering a Vimeo ID or URL in the form shows a thumbnail image preview beside the field in real time."
    why_human: "Image load from external URL (vumbnail.com) requires browser rendering"
  - test: "Settings save success feedback"
    expected: "Saving settings shows green 'Settings saved successfully.' message without page reload."
    why_human: "useActionState optimistic feedback requires browser interaction to confirm"
---

# Phase 5: Admin CMS Verification Report

**Phase Goal:** The owner can manage all site content independently — adding projects, updating the hero, editing the about section, uploading logos, and reading contact messages — without touching code
**Verified:** 2026-03-30
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Admin sidebar is visible on desktop with links to Dashboard, Projects, Settings, Brand Logos, Messages | VERIFIED | sidebar.tsx NAV_LINKS array has all 5 links; active state uses usePathname |
| 2 | Sidebar collapses to hamburger menu on tablet/mobile viewports | VERIFIED | `md:hidden` on hamburger button, `md:translate-x-0` on sidebar; useState open/close toggle |
| 3 | Admin dashboard shows overview with navigation cards and unread message count | VERIFIED | admin/page.tsx queries db.contactSubmission.count + db.project.count; renders 4 cards with live data |
| 4 | SiteConfig model has location, instagramUrl, vimeoProfileUrl fields | VERIFIED | schema.prisma lines 35-37 confirm all three fields |
| 5 | Project model has thumbnailUrl and previewClipUrl fields | VERIFIED | schema.prisma lines 22-23 confirm both fields |
| 6 | Admin can see all projects in a list with title, client, status, and thumbnail | VERIFIED | project-list.tsx renders thumbnail, title, client, year, Published/Draft badge per row |
| 7 | Admin can toggle publish/unpublish with instant UI update | VERIFIED | useOptimistic + startTransition in project-list.tsx; togglePublished server action with revalidatePath |
| 8 | Admin can delete a project after confirming in a dialog | VERIFIED | confirmDeleteId state gate; inline "Delete [title]? This can't be undone." with Confirm/Cancel buttons |
| 9 | Admin can create a new project by filling out the form | VERIFIED | projects/new/page.tsx -> ProjectForm with createProject action; all fields present with Zod validation |
| 10 | Admin can edit any existing project and changes reflect on the public site | FAILED | Edit page exists at /admin/projects/[id] but NO link/button in project-list.tsx routes there — orphaned page |
| 11 | Vimeo thumbnail is auto-fetched when a Vimeo URL or ID is provided | VERIFIED | createProject/updateProject calls getVimeoThumbnail(vimeoId); form shows vumbnail.com preview on input change |
| 12 | Form shows field-level validation errors on invalid input | VERIFIED | state.errors per-field rendering in ProjectForm and SettingsForm |
| 13 | Admin can update hero Vimeo URL, about text, contact email, location, Instagram URL, and Vimeo profile URL | VERIFIED | settings-form.tsx has all 6 fields; updateSettings upserts SiteConfig with full field set |
| 14 | Admin can upload a brand logo image file and see it appear in the grid | VERIFIED | uploadLogo validates type+size, writes to public/assets/; LogoGrid shows upload section |
| 15 | Admin can delete a brand logo from the grid | VERIFIED | deleteLogo with path-traversal guard; LogoGrid calls window.confirm then deleteLogo.bind(null, filename)() |
| 16 | Contact form submissions appear in the admin inbox | VERIFIED | messages/page.tsx fetches db.contactSubmission.findMany and passes to MessageList |
| 17 | Unread messages are visually distinct from read messages | PARTIAL | Bold+accent-border for unread correctly implemented; but hover:bg-bg-elevated on rows is a no-op (undefined token) |
| 18 | Clicking a message shows the full detail and marks it as read | VERIFIED | detail page calls markRead(id) server-to-server if !message.read before rendering |
| 19 | Admin can delete messages | VERIFIED | deleteMessage via form action on detail page; deleteMessage via startTransition in MessageList |

**Score:** 11/13 truths verified (2 gaps: 1 navigation gap, 1 design-token warning)

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `prisma/schema.prisma` | Schema with thumbnailUrl, previewClipUrl, location, instagramUrl, vimeoProfileUrl | VERIFIED | All 5 fields present in Project and SiteConfig models |
| `src/components/admin/sidebar.tsx` | Collapsible sidebar navigation, min 40 lines | VERIFIED | 109 lines; 5 nav links, hamburger, active state, logout form |
| `src/app/(admin)/layout.tsx` | Admin layout with sidebar + content area, min 10 lines | VERIFIED | 14 lines; imports AdminSidebar, flex layout |
| `src/app/(admin)/admin/page.tsx` | Dashboard with nav cards and message count, min 20 lines | VERIFIED | 66 lines; 4 cards with real DB counts |
| `src/app/actions/projects.ts` | Server Actions: togglePublished, deleteProject, createProject, updateProject | VERIFIED | All 4 exported with verifySession, Zod validation, revalidatePath |
| `src/app/(admin)/admin/projects/page.tsx` | Projects list page, min 15 lines | VERIFIED | 39 lines; db.project.findMany, renders ProjectList |
| `src/components/admin/project-list.tsx` | Client component with useOptimistic toggle and delete, min 50 lines | VERIFIED | 178 lines; useOptimistic, delete confirm dialog — missing edit link |
| `src/components/admin/project-form.tsx` | Shared create/edit form component, min 60 lines | VERIFIED | 226 lines; useActionState, all fields, thumbnail preview, per-field errors |
| `src/app/(admin)/admin/projects/new/page.tsx` | Create project page, min 10 lines | VERIFIED | 13 lines; verifySession + ProjectForm with createProject |
| `src/app/(admin)/admin/projects/[id]/page.tsx` | Edit project page, min 15 lines | VERIFIED | 42 lines; db.project.findUnique, updateProject.bind, ProjectForm with project prop |
| `src/app/actions/settings.ts` | updateSettings Server Action | VERIFIED | Exports updateSettings; Zod schema, db.siteConfig.upsert |
| `src/app/(admin)/admin/settings/page.tsx` | Settings form page, min 30 lines | VERIFIED | 16 lines server component + settings-form.tsx (146 lines) split correctly |
| `src/app/actions/logos.ts` | uploadLogo and deleteLogo Server Actions | VERIFIED | Both exported; type/size validation, path-traversal guard |
| `src/app/(admin)/admin/logos/page.tsx` | Logo management page, min 15 lines | VERIFIED | 32 lines; readdirSync scan, LOGO_ exclusion filter, passes to LogoGrid |
| `src/components/admin/logo-grid.tsx` | Logo grid with upload form and delete, min 40 lines | VERIFIED | 84 lines; upload form with useActionState, grid with delete confirm |
| `src/app/actions/messages.ts` | markRead and deleteMessage Server Actions | VERIFIED | Both exported; verifySession, db operations, revalidatePath('/admin') |
| `src/app/(admin)/admin/messages/page.tsx` | Message inbox list page, min 15 lines | VERIFIED | 28 lines; unread count badge in heading |
| `src/app/(admin)/admin/messages/[id]/page.tsx` | Message detail page, min 20 lines | VERIFIED | 82 lines; auto-markRead, mailto link, delete form |
| `src/components/admin/message-list.tsx` | Message list client component with delete, min 30 lines | VERIFIED | 97 lines; read/unread styling, delete with window.confirm + useTransition |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/(admin)/layout.tsx` | `sidebar.tsx` | import AdminSidebar | WIRED | Line 3: `import AdminSidebar from '@/components/admin/sidebar'`; rendered on line 8 |
| `src/app/(admin)/admin/page.tsx` | `src/lib/db.ts` | db.contactSubmission.count | WIRED | Lines 8-11: Promise.all with count queries for unread, totalProjects, publishedProjects |
| `src/components/admin/project-list.tsx` | `src/app/actions/projects.ts` | togglePublished, deleteProject | WIRED | Line 5: imports both; handleToggle calls togglePublished, handleDeleteConfirm calls deleteProject |
| `src/app/(admin)/admin/projects/page.tsx` | `src/lib/db.ts` | db.project.findMany | WIRED | Lines 9-21: db.project.findMany with select + orderBy |
| `src/components/admin/project-form.tsx` | `src/app/actions/projects.ts` | useActionState with action prop | WIRED | Line 29: useActionState(action, { status: 'idle' }); action passed as prop from new/[id] pages |
| `src/app/(admin)/admin/projects/[id]/page.tsx` | `src/lib/db.ts` | db.project.findUnique | WIRED | Lines 16-28: findUnique with select, notFound() guard |
| `src/app/(admin)/admin/settings/page.tsx` | `src/app/actions/settings.ts` | updateSettings via SettingsForm | WIRED | settings-form.tsx line 4 imports updateSettings; line 19 useActionState(updateSettings, ...) |
| `src/components/admin/logo-grid.tsx` | `src/app/actions/logos.ts` | uploadLogo, deleteLogo | WIRED | Line 4: imports both; uploadAction used in form action, deleteLogo.bind called in handleDelete |
| `src/app/(admin)/admin/messages/[id]/page.tsx` | `src/app/actions/messages.ts` | markRead on page load | WIRED | Line 5 import; lines 22-24: `if (!message.read) { await markRead(id) }` |
| `src/components/admin/message-list.tsx` | `src/app/actions/messages.ts` | deleteMessage on button click | WIRED | Line 5 import; line 45: `await deleteMessage(message.id)` in startTransition |
| `src/components/admin/project-list.tsx` | `src/app/(admin)/admin/projects/[id]/page.tsx` | Edit link/button | NOT WIRED | No Link or href to `/admin/projects/${project.id}` exists in project-list.tsx |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| ADMIN-01 | 05-01 | Admin dashboard home page with overview | SATISFIED | admin/page.tsx: 4 nav cards with live DB counts |
| ADMIN-02 | 05-02 | Project list view with all projects and their status | SATISFIED | project-list.tsx renders title, client, year, Published/Draft badge, thumbnail |
| ADMIN-03 | 05-03 | Create new project form | SATISFIED | projects/new/page.tsx + ProjectForm with all fields + Vimeo thumbnail auto-fetch |
| ADMIN-04 | 05-03 | Edit existing project | BLOCKED | Edit page exists but no navigation path from project list to /admin/projects/[id] |
| ADMIN-05 | 05-02 | Delete project with confirmation | SATISFIED | confirmDeleteId dialog with "This can't be undone" + Confirm/Cancel |
| ADMIN-06 | 05-02 | Publish/unpublish toggle | SATISFIED | useOptimistic toggle with instant UI update + revalidatePath('/', 'layout') |
| ADMIN-08 | 05-04 | Update hero/featured video from admin | SATISFIED | settings-form.tsx heroVimeoId field + updateSettings upserts SiteConfig |
| ADMIN-09 | 05-04 | Edit about section content from admin | SATISFIED | settings-form.tsx aboutText textarea (6 rows) + updateSettings |
| ADMIN-10 | 05-04 | Edit contact information from admin | SATISFIED | settings-form.tsx contactEmail + location + instagramUrl + vimeoProfileUrl fields |
| ADMIN-11 | 05-04 | Upload and manage brand logos from admin | SATISFIED | LogoGrid upload form + grid with delete; file type/size validation |
| ADMIN-12 | 05-05 | Contact form submissions inbox in admin | SATISFIED | Messages inbox with read/unread distinction, detail view, delete from both views |
| RESP-03 | 05-01 | Admin panel usable on tablet | SATISFIED | Sidebar md:hidden hamburger, md:translate-x-0 desktop, md:grid project list columns |

**Note:** REQUIREMENTS.md tracking table still shows ADMIN-02 through ADMIN-12 as unchecked (pending). This is a documentation staleness issue — the implementations are code-complete. The table should be updated to mark ADMIN-02 through ADMIN-12 and RESP-03 as complete.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/admin/message-list.tsx` | 56 | `hover:bg-bg-elevated` — token not defined in globals.css @theme block; only bg-base, bg-card, bg-section exist | Warning | Message row hover state renders as a no-op; no visual hover feedback on rows |
| `src/app/actions/logos.ts` | 3 | Comment warns: "Files uploaded at runtime will be lost on redeploy until Railway Volumes configured" | Info | Expected limitation documented in code; not a bug |

---

## Human Verification Required

### 1. Tablet Sidebar Toggle

**Test:** Open the admin at a tablet viewport (~768px width). Confirm the sidebar is hidden and a hamburger button appears top-left. Tap the hamburger. Verify sidebar slides in as an overlay with a dark backdrop. Tap the backdrop or X button to close.
**Expected:** Hamburger visible below md breakpoint; sidebar slides in/out; clicking backdrop closes it
**Why human:** CSS responsive transitions and touch events require browser rendering

### 2. Vimeo Thumbnail Auto-Preview

**Test:** Navigate to /admin/projects/new. Type a full Vimeo URL (e.g. https://vimeo.com/123456789) into the Vimeo field.
**Expected:** A thumbnail image appears beside the field immediately, sourced from vumbnail.com
**Why human:** Live image load from external URL cannot be verified statically

### 3. Settings Save Feedback

**Test:** Navigate to /admin/settings. Change a field and click Save Settings.
**Expected:** Green "Settings saved successfully." text appears inline without page reload. Public site reflects the change.
**Why human:** Server Action round-trip and optimistic state update require browser execution

### 4. Logo Upload End-to-End

**Test:** Navigate to /admin/logos. Upload a PNG file under 2 MB. Verify it appears in the grid. Then delete it. Verify it disappears.
**Expected:** Upload writes to /public/assets/; grid refreshes via revalidatePath; delete removes file and grid updates
**Why human:** Filesystem writes and Server Component revalidation require running environment

---

## Gaps Summary

Two gaps found:

**Gap 1 — ADMIN-04 edit navigation (BLOCKER for goal):** The edit page at `src/app/(admin)/admin/projects/[id]/page.tsx` is fully implemented but is an orphaned route. The project list component (`src/components/admin/project-list.tsx`) has no Edit button or link pointing to `/admin/projects/${project.id}`. The owner cannot edit an existing project without knowing the internal Prisma CUID and constructing the URL manually. This directly blocks the phase goal ("editing projects without touching code").

**Fix required:** Add an Edit link to each project row in `ProjectList` — for example, a `<Link href={/admin/projects/${project.id}}>Edit</Link>` button alongside the existing Toggle and Delete actions.

**Gap 2 — Undefined CSS token (WARNING):** `src/components/admin/message-list.tsx` line 56 uses `hover:bg-bg-elevated`, but `--color-bg-elevated` is not defined in `globals.css`. The available elevated background token is `bg-bg-section`. The hover effect on message rows is currently invisible. This is a functional degradation (no visual hover feedback) but does not block core functionality.

**Fix required:** Replace `hover:bg-bg-elevated` with `hover:bg-bg-section` on line 56 of `message-list.tsx`.

These two fixes are contained and do not require architectural changes.

---

_Verified: 2026-03-30_
_Verifier: Claude (gsd-verifier)_
