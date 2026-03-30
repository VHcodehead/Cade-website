---
phase: 02-auth-system-and-data-layer
plan: "02"
subsystem: auth
tags: [nextjs, proxy, server-actions, bcryptjs, jose, session, login, forms]

# Dependency graph
requires:
  - phase: 02-auth-system-and-data-layer/02-01
    provides: session.ts (encrypt/decrypt/createSession/deleteSession), dal.ts (verifySession), db.ts (PrismaClient with AdminUser model)
provides:
  - proxy.ts route protection redirecting unauthenticated /admin/** requests to /admin/login
  - login Server Action with bcryptjs constant-time comparison and session creation
  - logout Server Action with session deletion and redirect
  - LoginForm client component using useActionState for progressive enhancement
  - /admin/login page with VLACOVISION logo, dark theme, email/password form
  - /admin dashboard placeholder calling verifySession() with logout button
  - Admin layout with force-dynamic to prevent back-button cache exposure
affects: [phase-03-media-and-content-management, phase-05-admin-shell, all admin routes]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - proxy.ts (not middleware.ts) for Next.js 16 route protection — Edge-safe, no Node.js imports
    - Server Actions with useActionState for form handling without client JS dependency
    - Dual auth guard pattern — proxy.ts for optimistic redirect, verifySession() in page component for true authorization
    - force-dynamic in admin layout prevents browser caching admin pages after logout
    - Constant-time bcrypt comparison even when user not found (dummy hash fallback)

key-files:
  created:
    - proxy.ts
    - src/app/actions/auth.ts
    - src/components/admin/login-form.tsx
    - src/app/(admin)/admin/login/page.tsx
    - src/app/(admin)/layout.tsx
    - src/app/(admin)/admin/page.tsx
  modified: []

key-decisions:
  - "proxy.ts runs in Edge Runtime — bcryptjs intentionally excluded; it only reads the JWT session cookie via decrypt() from session.ts"
  - "Generic 'Invalid credentials.' error for both unknown email and wrong password — security requirement, prevents user enumeration"
  - "verifySession() called in admin page component, NOT in layout — Next.js partial rendering means layouts don't re-run on every navigation"
  - "LoginForm uses useActionState (React 19) for pending state and error display — no separate API route needed"

patterns-established:
  - "Auth pattern: proxy.ts optimistic redirect + verifySession() in page = defense in depth"
  - "Server Action form pattern: useActionState(action, undefined) returns [state, action, pending]"
  - "Constant-time auth: always run bcrypt.compare even for non-existent users to prevent timing attacks"

requirements-completed: [AUTH-01, AUTH-02, AUTH-04]

# Metrics
duration: ~30min
completed: 2026-03-30
---

# Phase 02 Plan 02: Auth Flow Summary

**Complete admin authentication system: proxy.ts route guard + login/logout Server Actions + LoginForm with useActionState + protected /admin dashboard with session verification**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-03-30T22:30:00Z
- **Completed:** 2026-03-30T23:07:43Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 6

## Accomplishments
- proxy.ts protects all /admin/** routes at the Edge, redirecting unauthenticated users to /admin/login and authenticated users away from /admin/login
- Login Server Action with Zod validation, bcryptjs constant-time comparison, and session creation via createSession() from Plan 01
- Logout Server Action clearing session cookie and redirecting — browser back button blocked by force-dynamic layout
- Minimal dark-theme login page at /admin/login with VLACOVISION text logo and progressive-enhancement form using useActionState
- Admin dashboard placeholder at /admin with verifySession() guard and working logout form action
- Human verification checkpoint passed — all 9 verification steps confirmed passing in browser

## Task Commits

Each task was committed atomically:

1. **Task 1: Create proxy.ts, auth Server Actions, and admin route group** - `77ec202` (feat)
2. **Task 2: Create login page and login form component** - `769aa8a` (feat)
3. **Task 3: Verify complete auth flow end-to-end** - checkpoint approved, no code commit

## Files Created/Modified
- `proxy.ts` - Edge-compatible route protection for /admin/** (redirect unauthenticated; redirect authenticated away from login)
- `src/app/actions/auth.ts` - login() and logout() Server Actions with Zod, bcryptjs, session management
- `src/components/admin/login-form.tsx` - Client component with useActionState, pending state, error display
- `src/app/(admin)/admin/login/page.tsx` - /admin/login page with VLACOVISION logo and LoginForm
- `src/app/(admin)/layout.tsx` - Admin route group layout with export const dynamic = 'force-dynamic'
- `src/app/(admin)/admin/page.tsx` - Admin dashboard placeholder calling verifySession() with logout button

## Decisions Made
- proxy.ts uses Edge Runtime — bcryptjs excluded intentionally (Node.js only). JWT decrypt via jose is Edge-safe.
- Generic error message "Invalid credentials." for both bad email and bad password — prevents user enumeration attacks.
- verifySession() placed in the page component, not the layout — Next.js layouts do not re-run on client-side navigation, making layout auth checks unreliable.
- useActionState (React 19 API) used in LoginForm — provides form pending state and action result without a separate API route.
- Constant-time bcrypt comparison with dummy hash fallback when user not found — prevents timing-based user enumeration.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all six files compiled cleanly, build succeeded, and all 9 browser verification steps passed on first attempt.

## User Setup Required

None - no external service configuration required beyond what Plan 01 established (DATABASE_URL, SESSION_SECRET, prisma migrate, prisma db seed).

## Next Phase Readiness

- All four AUTH requirements met: AUTH-01 (login), AUTH-02 (route protection), AUTH-03 (session persistence via Plan 01 cookie), AUTH-04 (logout + back-button prevention)
- Admin route group (admin) established and ready to receive content management pages in Phase 5
- proxy.ts pattern established — future protected route additions only require updating the protectedRoutes regex
- Phase 03 (media and content management) can proceed independently; it does not depend on Phase 02

---
*Phase: 02-auth-system-and-data-layer*
*Completed: 2026-03-30*
