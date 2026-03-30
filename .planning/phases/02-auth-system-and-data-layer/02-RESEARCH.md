# Phase 2: Auth System and Data Layer - Research

**Researched:** 2026-03-30
**Domain:** Custom JWT session auth — jose, bcryptjs, Next.js 16 proxy.ts, Prisma 7 AdminUser model
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Admin Credentials**
- Single admin user only — the site owner is the sole admin
- Email/password auth — owner chooses his own credentials
- Credentials stored in database (hashed password) or seeded via environment variables
- No registration flow needed — admin account is pre-created (seed or env var)

**Login Page Design**
- Minimal, clean login page at /admin/login
- Dark theme consistent with the public site (carries forward from Phase 1 design system)
- Simple form: email + password + submit button
- No branding overload — just the VLACOVISION logo and the login form

**Session Management**
- HTTP-only cookie-based sessions (secure, not accessible via JavaScript)
- Session persists across browser refresh
- Logout clears session completely — back button doesn't expose admin content

**Route Protection**
- All /admin/** routes protected — unauthenticated users redirected to /admin/login
- Next.js 16 proxy.ts (replaces middleware.ts) for optimistic cookie check + redirect
- Server-side verifySession() in every admin route handler/server action for true authorization

### Claude's Discretion
- Whether to use NextAuth v5 or custom JWT/session implementation (research flagged v5 stability concerns — Claude should pick the most reliable approach)
- Exact session token format and expiration policy
- Password hashing algorithm (bcrypt vs argon2)
- Error messages on failed login (generic "invalid credentials" for security)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUTH-01 | Admin user can log in with email/password at /admin/login | Server Action + bcryptjs.compare() + jose encrypt → cookie set; login page as App Router route |
| AUTH-02 | Admin routes (/admin/**) protected — unauthenticated users redirected to login | proxy.ts with cookie read + jose decrypt; matcher targets /admin/:path*; optimistic check only |
| AUTH-03 | Admin session persists across browser refresh (HTTP-only cookies) | jose SignJWT stored in httpOnly, secure, sameSite:'lax' cookie with 7d expiry; updateSession() refreshes on each request |
| AUTH-04 | Admin user can log out from any admin page | Server Action calls deleteSession() (cookies().delete('session')) then redirect('/admin/login') |
</phase_requirements>

---

## Summary

**Decision: Use custom jose JWT sessions, NOT NextAuth v5.**

NextAuth v5 (`next-auth@beta`) is still at `5.0.0-beta.30` on npm as of 2026-03-30. The `latest` dist-tag points to `4.24.13` (last published 5 months ago and not compatible with App Router patterns). NextAuth v5 remains in prolonged beta with no stable release date announced. For a single-user admin panel that only needs email/password, the NextAuth v5 overhead (OAuth provider machinery, database adapter configuration, session strategy setup, adapter migrations) is all dead weight. The custom jose pattern is directly documented in the official Next.js 16.2.1 authentication guide and is the approach Next.js recommends for teams not using a managed auth provider.

The implementation involves three layers working together: (1) `jose` for JWT signing/verification of session tokens stored in HTTP-only cookies, (2) `bcryptjs` for password hashing stored in a new `AdminUser` Prisma model, and (3) `proxy.ts` for optimistic cookie presence checks at the network boundary, backed by `verifySession()` in every server action and route handler for true authorization.

The existing codebase already has everything needed: Prisma 7 with PrismaPg adapter (`src/lib/db.ts`), the schema at `prisma/schema.prisma` (needs `AdminUser` model added), and the Tailwind v4 design tokens in `globals.css` for login page styling. Only `jose`, `bcryptjs`, `server-only`, and `zod` need to be installed.

**Primary recommendation:** Custom jose JWT sessions. Install `jose`, `bcryptjs`, `@types/bcryptjs`, `server-only`, and `zod`. Add `AdminUser` model to Prisma schema. Build `src/lib/session.ts` (encrypt/decrypt/createSession/deleteSession/updateSession), `src/lib/dal.ts` (verifySession), a login Server Action, logout Server Action, `/admin/login` page, and `proxy.ts` at project root.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| jose | 6.2.2 | JWT signing (SignJWT) and verification (jwtVerify) | Official Next.js docs recommend it; Edge/Node runtime compatible; no native dependencies |
| bcryptjs | 3.0.3 | Password hashing and comparison | Pure JS (no native binaries); works in Node.js Server Actions; well-audited |
| server-only | 0.0.1 | Prevents session/DAL code from being imported in client components | Next.js official pattern; import causes build error if used in 'use client' module |
| zod | 4.3.6 | Login form field validation in Server Action | Already in ecosystem; official Next.js auth guide uses it; type-safe schema definition |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @types/bcryptjs | latest | TypeScript types for bcryptjs | Always — bcryptjs is JavaScript-only |
| next/headers (built-in) | — | Async cookies() API for reading/writing session cookie | Server Components, Server Actions, Route Handlers |
| react/cache (built-in) | — | Memoize verifySession() per request render pass | DAL pattern — prevents duplicate cookie reads per request |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| bcryptjs (pure JS) | argon2 (native addon) | argon2 is stronger but requires native binaries; Railway build containers need OS-specific compilation; bcryptjs is simpler and still secure at cost=12 |
| jose (JWT stateless) | database sessions | Database sessions allow instant revocation; for a single admin user, stateless JWT is simpler and sufficient; cookie expiry is effectively the revocation mechanism |
| Custom jose sessions | NextAuth v5 beta | NextAuth v5 still at beta.30 with no stable release; full OAuth machinery for a single-user password login is overkill; custom solution is 4 files vs a complex adapter setup |

**Installation:**
```bash
npm install jose bcryptjs server-only zod
npm install --save-dev @types/bcryptjs
```

---

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)

```
src/
├── app/
│   ├── (admin)/                    # Admin route group
│   │   ├── layout.tsx              # Admin shell layout (verifySession guard)
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # AUTH-01: login form page
│   │   │   └── page.tsx            # Admin dashboard placeholder (Phase 5)
│   ├── actions/
│   │   └── auth.ts                 # login(), logout() Server Actions
│   └── globals.css                 # existing (design tokens used for login page)
├── lib/
│   ├── db.ts                       # existing PrismaClient singleton
│   ├── session.ts                  # encrypt(), decrypt(), createSession(), deleteSession(), updateSession()
│   └── dal.ts                      # verifySession() — Data Access Layer
├── components/
│   └── admin/
│       └── login-form.tsx          # 'use client' form with useActionState
├── generated/
│   └── prisma/                     # generated — includes AdminUser type after schema update
prisma/
├── schema.prisma                   # add AdminUser model
├── migrations/                     # new migration for AdminUser table
└── seed.ts                         # add admin seed (email + hashed password)
proxy.ts                            # AUTH-02: route protection at project root
```

### Pattern 1: Session Encryption/Decryption with jose

**What:** Stateless JWT session stored in HTTP-only cookie. jose's `SignJWT` creates a signed token; `jwtVerify` validates it.
**When to use:** createSession (after login), verifySession (every protected request), proxy.ts (optimistic check).

```typescript
// src/lib/session.ts
// Source: https://nextjs.org/docs/app/guides/authentication (v16.2.1, updated 2026-03-25)
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

type SessionPayload = {
  userId: string
  expiresAt: Date
}

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as SessionPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function updateSession(): Promise<void> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) return

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

### Pattern 2: Data Access Layer (DAL) with verifySession

**What:** Server-only function that reads + decrypts the session cookie and redirects if unauthenticated. React `cache()` memoizes it per request so multiple calls in one render don't re-read cookies.
**When to use:** Every admin Server Component, Server Action, and Route Handler. This is the true authorization check.

```typescript
// src/lib/dal.ts
// Source: https://nextjs.org/docs/app/guides/authentication (v16.2.1, updated 2026-03-25)
import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decrypt } from './session'

export const verifySession = cache(async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/admin/login')
  }

  return { isAuth: true, userId: session.userId }
})
```

### Pattern 3: proxy.ts Optimistic Route Protection

**What:** proxy.ts runs before every request on matched routes. It reads the session cookie and does a lightweight presence/decrypt check. This is OPTIMISTIC — it stops obviously unauthenticated requests early but is NOT a security boundary. verifySession() in Server Actions is the security boundary.
**When to use:** Project root `proxy.ts`. Protects all /admin routes.

```typescript
// proxy.ts (project root)
// Source: https://nextjs.org/docs/app/guides/authentication (v16.2.1, updated 2026-03-25)
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/src/lib/session'

const protectedRoutes = /^\/admin(?!\/login)/
const loginRoute = '/admin/login'

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.test(path)
  const isLoginRoute = path === loginRoute

  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)

  // Redirect unauthenticated users trying to access admin
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }

  // Redirect authenticated users away from login page
  if (isLoginRoute && session?.userId) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

> **Critical:** proxy.ts imports session utilities using `@/src/lib/session` path. bcryptjs MUST NOT be imported in proxy.ts — it is Node.js only and proxy.ts can run in the Edge Runtime. Keep password operations exclusively in Server Actions.

### Pattern 4: Login Server Action

**What:** Server Action handles credential validation — reads email/password from FormData, validates with zod, queries AdminUser from database, compares password with bcryptjs, creates session on success.
**When to use:** Called by the login form via `action={login}`.

```typescript
// src/app/actions/auth.ts
'use server'
import { z } from 'zod'
import bcryptjs from 'bcryptjs'
import { redirect } from 'next/navigation'
import { db } from '@/src/lib/db'
import { createSession, deleteSession } from '@/src/lib/session'

const LoginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
})

type LoginState = { error?: string } | undefined

export async function login(state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Invalid credentials.' }
  }

  const { email, password } = parsed.data

  const user = await db.adminUser.findUnique({ where: { email } })

  // Constant-time comparison guard: always compare even if user not found
  const dummyHash = '$2b$12$invalidhashplaceholderXXXXXXXXXXXXXXXXXXXXXXXXX'
  const passwordMatch = await bcryptjs.compare(
    password,
    user?.hashedPassword ?? dummyHash
  )

  if (!user || !passwordMatch) {
    return { error: 'Invalid credentials.' }
  }

  await createSession(user.id)
  redirect('/admin')
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/admin/login')
}
```

### Pattern 5: AdminUser Prisma Model

**What:** Single-row table for the admin user. Added to existing schema.prisma. Email is unique index, password is stored as bcryptjs hash.
**When to use:** Phase 2 schema migration.

```prisma
// prisma/schema.prisma — add this model
model AdminUser {
  id             String   @id @default(cuid())
  email          String   @unique
  hashedPassword String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

Seed the admin user (environment-variable driven for credentials):

```typescript
// In prisma/seed.ts — add after existing seed logic
import bcryptjs from 'bcryptjs'

const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@vlacovision.com'
const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme'

const hashedPassword = await bcryptjs.hash(adminPassword, 12)

await db.adminUser.upsert({
  where: { email: adminEmail },
  update: {},
  create: { email: adminEmail, hashedPassword },
})
```

Required environment variables for Railway:
- `SESSION_SECRET` — 32-byte random string: `openssl rand -base64 32`
- `ADMIN_EMAIL` — admin login email
- `ADMIN_PASSWORD` — admin login password (seed only; not stored)

### Pattern 6: Login Form (Client Component)

**What:** Minimal form using `useActionState` to display server-side validation errors without full page reload.
**When to use:** `/admin/login/page.tsx` renders this as the login UI.

```tsx
// src/components/admin/login-form.tsx
'use client'
import { useActionState } from 'react'
import { login } from '@/src/app/actions/auth'

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <form action={action} className="flex flex-col gap-4 w-full max-w-sm">
      {state?.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="bg-bg-card border border-white/10 rounded px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="bg-bg-card border border-white/10 rounded px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-accent text-white font-medium py-3 rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
```

### Anti-Patterns to Avoid

- **Doing auth in proxy.ts layout check only:** Proxy is optimistic — it can be bypassed. Every Server Action and Route Handler MUST call `verifySession()`. Relying on proxy alone is a security hole (CVE-2025-29927 demonstrated this exact vulnerability in middleware-only auth patterns).
- **Importing bcryptjs in proxy.ts:** bcryptjs is Node.js-only. proxy.ts may run in Edge Runtime. Keep bcryptjs exclusively in Server Actions.
- **Not wrapping session utilities with `import 'server-only'`:** Without this guard, session code (including the secret key) could accidentally be imported by a Client Component and shipped to the browser.
- **Storing the SESSION_SECRET in code:** Must be an environment variable. Hardcoding it means all deployed tokens are compromised if code is public.
- **Using bcrypt (not bcryptjs):** Native `bcrypt` requires compilation against the OS. In Railway containers and CI, this frequently breaks. `bcryptjs` is pure JavaScript and always works.
- **Checking auth in layout.tsx instead of page components:** Next.js partial rendering means layouts don't re-run on every navigation — the session check would be skipped. Auth checks must be in page components or Server Actions, not layouts.
- **Using `password` in the JWT payload:** The JWT payload is base64-encoded (not encrypted end-to-end). Only store the userId. Never store the password, email, or any PII in the token.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JWT signing and verification | Custom HMAC with crypto.subtle | `jose` SignJWT/jwtVerify | Handles algorithm agility, expiry, clock skew, malformed tokens gracefully |
| Password hashing | Custom bcrypt implementation | `bcryptjs` | bcrypt's salt + cost factor are subtle; wrong implementation = insecure storage |
| Form validation | Manual FormData parsing and regex | `zod` | Type-safe, composable, auto-generates TypeScript types |
| Cookie management | Manual Set-Cookie headers | Next.js `cookies()` API | Handles SameSite, Secure flags correctly; async-aware in App Router |
| Request interception for auth | Custom Express-style middleware | `proxy.ts` with matcher | Built into Next.js; runs before filesystem routing; correct timing guarantees |

**Key insight:** The password hashing cost factor is where DIY implementations consistently fail — bcryptjs.hash with cost=12 is the minimum safe value; lower values are brute-forceable in seconds on modern GPUs.

---

## Common Pitfalls

### Pitfall 1: Timing Attack on Failed Login

**What goes wrong:** Code returns immediately with "user not found" when the email is wrong, but does bcrypt.compare only when email is found. This timing difference reveals whether an email is registered.

**Why it happens:** Obvious short-circuit logic: `if (!user) return error`.

**How to avoid:** Always run bcrypt.compare regardless of whether the user was found. Use a pre-computed dummy hash as the comparison target when user is null (Pattern 4 above demonstrates this).

**Warning signs:** Login failure returns faster for unknown emails than known ones.

### Pitfall 2: SESSION_SECRET Not Set in Production

**What goes wrong:** `jose` throws on startup or all session verification fails silently if `process.env.SESSION_SECRET` is undefined — `new TextEncoder().encode(undefined)` produces an empty key.

**Why it happens:** Environment variable not added to Railway dashboard before deploy.

**How to avoid:** Add a startup guard:
```typescript
if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET is not set')
```
Place this in `session.ts` at module level so it fails loudly on cold start.

**Warning signs:** All admin routes redirect to login even after successful authentication; no explicit error in logs.

### Pitfall 3: proxy.ts Cookie Path vs Actual Cookie Name

**What goes wrong:** proxy.ts reads `req.cookies.get('session')` but session.ts sets the cookie with name `'session'` at `path: '/'`. Cookie names are case-sensitive.

**Why it happens:** Inconsistent naming between session.ts (write) and proxy.ts (read).

**How to avoid:** Define the cookie name as a constant in a shared location:
```typescript
export const SESSION_COOKIE_NAME = 'session' // session.ts
```
Both createSession and proxy.ts import this constant.

**Warning signs:** proxy.ts always redirects to login even after successful login; cookie is present in browser DevTools but proxy doesn't read it.

### Pitfall 4: Partial Rendering Bypasses Layout Auth Check

**What goes wrong:** Developer adds `verifySession()` only in the admin layout — navigating between admin routes skips the layout re-render, leaving the session unchecked for subsequent pages.

**Why it happens:** Next.js partial rendering: layouts re-render only when their segment changes, not on every navigation within the same segment.

**How to avoid:** Call `verifySession()` in every page component and every Server Action that touches admin data, not just in the layout. The layout can call it for UX (showing the admin name in nav) but it cannot be the sole protection.

**Warning signs:** Session expires but admin remains accessible after navigating to a different admin sub-page without a full refresh.

### Pitfall 5: Back Button Exposes Admin Content After Logout

**What goes wrong:** After logout, user presses back button in browser — previous admin page is served from browser cache.

**Why it happens:** Browser cache serves HTML from memory. Session cookie is deleted but the cached HTML is stale.

**How to avoid:** Set cache-control headers on admin routes:
```typescript
// In admin layout or page
import { headers } from 'next/headers'
// Or use Next.js route segment config:
export const dynamic = 'force-dynamic'
```
Alternatively, set `Cache-Control: no-store` response headers on all admin route handlers. `force-dynamic` in the layout is simpler.

**Warning signs:** After logout, browser back button shows admin content without re-authenticating.

### Pitfall 6: Zod v4 Breaking API Changes

**What goes wrong:** Zod 4 (installed by default in 2026) changed the error shape. Code referencing `.flatten().fieldErrors` or `.error` property (instead of `.message`) fails at runtime.

**Why it happens:** Zod 4 released in 2025 with breaking changes from Zod 3.

**How to avoid:** Zod 4 schema errors use `.issues` array directly. For login, a simple top-level error message is sufficient — skip the field-level error path entirely and just check `parsed.success`.

**Warning signs:** TypeScript errors on `.flatten()` or `.fieldErrors`; runtime `undefined` when accessing error properties.

---

## Code Examples

Verified patterns from official sources:

### Complete Session Module

```typescript
// src/lib/session.ts
// Source: https://nextjs.org/docs/app/guides/authentication (v16.2.1, 2026-03-25)
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export const SESSION_COOKIE_NAME = 'session'

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is not set')
}

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET)

type SessionPayload = { userId: string; expiresAt: Date }

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const token = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
```

### AdminUser Prisma Schema Addition

```prisma
// Add to prisma/schema.prisma
model AdminUser {
  id             String   @id @default(cuid())
  email          String   @unique
  hashedPassword String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

Migration command:
```bash
npx prisma migrate dev --name add-admin-user
```

### Environment Variables Required (Railway)

```bash
SESSION_SECRET=<output of: openssl rand -base64 32>
ADMIN_EMAIL=owner@example.com
ADMIN_PASSWORD=<strong-password-only-used-at-seed-time>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| NextAuth v4 + Credentials Provider | Custom jose JWT sessions | 2024-2025 (v5 beta still ongoing) | NextAuth v5 still not stable; jose is the official Next.js docs recommendation |
| middleware.ts for route protection | proxy.ts | Next.js 16 (Oct 2025) | Clearer Node.js vs Edge runtime boundary; same API |
| bcrypt (native) | bcryptjs (pure JS) | Ongoing; Railway container environments | Eliminates native compilation failures in CI and containers |
| Checking auth in layout | verifySession() in every page/action | Next.js App Router stable | Partial rendering means layouts skip re-auth; page-level is correct |
| Storing session in database table | Stateless JWT in HTTP-only cookie | App Router era | No DB round trip per request for single-user admin |

**Deprecated/outdated:**
- `next-auth@4.x`: Outdated for App Router patterns; does not support Server Actions natively
- `next-auth@5.0.0-beta.*`: Still in beta as of 2026-03-30; `latest` dist-tag still points to v4
- `middleware.ts`: Renamed to `proxy.ts` in Next.js 16; same functionality, new filename
- `jsonwebtoken` package: Uses Node.js-only crypto; not compatible with Edge Runtime; use jose instead

---

## Open Questions

1. **Admin password reset flow**
   - What we know: Owner is non-technical; CONTEXT.md notes "re-seed" as acceptable solution
   - What's unclear: Whether a simple password-reset script is worth building vs documenting the re-seed procedure
   - Recommendation: Document the re-seed procedure (update `ADMIN_PASSWORD` env var, re-run `npx prisma db seed`). No UI needed — this is an internal tool and the owner can contact whoever manages Railway.

2. **Session expiration policy**
   - What we know: 7 days is the Next.js official example default
   - What's unclear: Whether the owner wants longer persistence (e.g., 30 days) since he's the sole user on trusted devices
   - Recommendation: 7 days with sliding window (updateSession() on each proxy.ts pass). If he finds it annoying, change to 30 days. Sliding window means as long as he visits weekly, he stays logged in.

3. **bcryptjs cost factor**
   - What we know: Cost=10 is bcryptjs default; cost=12 adds ~300ms per hash; single-user admin means login latency is not a concern
   - What's unclear: Nothing — this is fully resolvable
   - Recommendation: Use cost=12. The additional 300ms per login is imperceptible for a non-critical admin panel, and it doubles the brute-force work for an attacker.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest (to be installed in Wave 0 per Phase 1 research) |
| Config file | `jest.config.ts` (Wave 0 gap from Phase 1) |
| Quick run command | `npx jest --testPathPattern=auth --passWithNoTests` |
| Full suite command | `npx jest` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | login() action returns error on bad credentials | unit | `npx jest __tests__/actions/auth.test.ts -t "login invalid credentials" --passWithNoTests` | ❌ Wave 0 |
| AUTH-01 | login() action creates session cookie on valid credentials | unit | `npx jest __tests__/actions/auth.test.ts -t "login success" --passWithNoTests` | ❌ Wave 0 |
| AUTH-02 | proxy.ts redirects unauthenticated request to /admin to /admin/login | integration | `npx jest __tests__/proxy.test.ts --passWithNoTests` | ❌ Wave 0 |
| AUTH-03 | session cookie has httpOnly, secure, sameSite=lax flags | unit | `npx jest __tests__/lib/session.test.ts -t "createSession cookie flags" --passWithNoTests` | ❌ Wave 0 |
| AUTH-04 | logout() deletes session cookie and redirects | unit | `npx jest __tests__/actions/auth.test.ts -t "logout" --passWithNoTests` | ❌ Wave 0 |

> Note: Server Actions and cookies() require mocking in Jest. Use `jest.mock('next/headers')` to mock the cookies store. The proxy.ts test requires mocking NextRequest with a cookies getter.

### Sampling Rate
- **Per task commit:** `npm run build` (validates TypeScript compilation catches auth module errors)
- **Per wave merge:** `npx jest --passWithNoTests`
- **Phase gate:** All 4 auth requirements manually smoke-tested via browser (login, refresh, logout, back-button) before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `__tests__/lib/session.test.ts` — covers AUTH-03 (cookie flags, encrypt/decrypt round-trip)
- [ ] `__tests__/actions/auth.test.ts` — covers AUTH-01, AUTH-04
- [ ] `__tests__/proxy.test.ts` — covers AUTH-02
- [ ] Jest install if not already: `npm install --save-dev jest @jest/globals ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom`

---

## Sources

### Primary (HIGH confidence)

- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication) — v16.2.1, last updated 2026-03-25 — full jose pattern, DAL/verifySession pattern, proxy.ts optimistic check pattern, cookie options
- [Next.js Proxy Getting Started](https://nextjs.org/docs/app/getting-started/proxy) — v16.2.1, last updated 2026-03-25 — proxy.ts naming, matcher config, Node.js runtime default
- npm registry (`npm show next-auth dist-tags`) — confirmed `latest` is `4.24.13`; `beta` is `5.0.0-beta.30` as of 2026-03-30
- npm registry (`npm show jose version`) — confirmed `6.2.2`
- npm registry (`npm show bcryptjs version`) — confirmed `3.0.3`
- npm registry (`npm show zod version`) — confirmed `4.3.6`
- Existing codebase inspection — confirmed Prisma 7 + PrismaPg adapter pattern, existing schema models, db.ts singleton

### Secondary (MEDIUM confidence)

- WebSearch results on NextAuth v5 beta status — multiple sources confirm no stable release; GitHub discussion #13382 "How many more years of beta releases for v5?" confirms ongoing beta status
- WebSearch results on bcryptjs vs argon2 for Next.js — consistent recommendation: bcryptjs for Railway/container environments due to no native deps; argon2 for bare-metal where compilation is reliable

### Tertiary (LOW confidence)

- WebSearch results on proxy.ts auth CVE-2025-29927 — middleware-only auth bypass; confirmed by auth0.com blog post on Next.js 16 auth changes — specific CVE details not independently verified against NVD

---

## Metadata

**Confidence breakdown:**
- Standard stack (jose, bcryptjs, zod versions): HIGH — verified via npm registry 2026-03-30
- NextAuth v5 beta decision: HIGH — dist-tags confirm no stable release; official Next.js docs don't recommend it as primary for custom implementations
- proxy.ts patterns: HIGH — verified against official Next.js 16.2.1 docs (updated 2026-03-25)
- jose encrypt/decrypt/createSession patterns: HIGH — code examples taken directly from official Next.js auth guide
- bcryptjs timing attack pattern (dummy hash): MEDIUM — established security pattern; not from official docs but from security literature consensus
- Zod v4 API changes: MEDIUM — zod@4.3.6 installed; v4 breaking changes confirmed but full API diff not deeply verified

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (Next.js docs stable; NextAuth v5 beta status may change if they ship stable release)
