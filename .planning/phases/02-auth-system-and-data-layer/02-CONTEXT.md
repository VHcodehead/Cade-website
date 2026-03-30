# Phase 2: Auth System and Data Layer - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Admin authentication is secure and complete — every subsequent admin feature can be built assuming `verifySession()` is already enforced. Single admin user only. Login, logout, session persistence, route protection.

</domain>

<decisions>
## Implementation Decisions

### Admin Credentials
- Single admin user only — the site owner is the sole admin
- Email/password auth — owner chooses his own credentials
- Credentials stored in database (hashed password) or seeded via environment variables
- No registration flow needed — admin account is pre-created (seed or env var)

### Login Page Design
- Minimal, clean login page at /admin/login
- Dark theme consistent with the public site (carries forward from Phase 1 design system)
- Simple form: email + password + submit button
- No branding overload — just the VLACOVISION logo and the login form

### Session Management
- HTTP-only cookie-based sessions (secure, not accessible via JavaScript)
- Session persists across browser refresh
- Logout clears session completely — back button doesn't expose admin content

### Route Protection
- All /admin/** routes protected — unauthenticated users redirected to /admin/login
- Next.js 16 proxy.ts (replaces middleware.ts) for optimistic cookie check + redirect
- Server-side verifySession() in every admin route handler/server action for true authorization

### Claude's Discretion
- Whether to use NextAuth v5 or custom JWT/session implementation (research flagged v5 stability concerns — Claude should pick the most reliable approach)
- Exact session token format and expiration policy
- Password hashing algorithm (bcrypt vs argon2)
- Error messages on failed login (generic "invalid credentials" for security)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/globals.css` — Dark editorial design tokens available for login page styling
- `src/lib/db.ts` — PrismaClient singleton ready for user/session queries
- `prisma/schema.prisma` — Can add AdminUser model or use environment variable approach

### Established Patterns
- Prisma 7 with PrismaPg adapter pattern established in Phase 1
- Next.js 16 App Router with route groups — admin can be its own route group `(admin)`
- `src/components/providers/motion-provider.tsx` — provider pattern established

### Integration Points
- `src/app/layout.tsx` — Root layout wraps everything, admin layout will be nested
- `next.config.ts` — Already has redirects, can add auth-related config
- `proxy.ts` — New file needed at project root for route protection (Next.js 16 pattern)

</code_context>

<specifics>
## Specific Ideas

- Keep it dead simple — one user, one login, done
- Owner is non-technical so password reset should be straightforward if needed (or just re-seed)
- Login page should feel clean and professional, not like a default template

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-auth-system-and-data-layer*
*Context gathered: 2026-03-30*
