# Pitfalls Research

**Domain:** Premium videographer portfolio website with built-in admin CMS — Next.js App Router rebuild from vanilla HTML/JS
**Researched:** 2026-03-30
**Confidence:** HIGH (all critical pitfalls verified against official Next.js docs, MDN, and known framework behavior as of August 2025)

---

## Critical Pitfalls

### Pitfall 1: Framer Motion Bloats Client Bundle — No LazyMotion

**What goes wrong:**
Importing from `framer-motion` directly pulls the entire animation library into every client bundle. On a portfolio site with cinematic scroll reveals, page transitions, and hover effects across many components, this compounds quickly. The full Framer Motion bundle is ~35-40KB gzipped. On a visually-heavy portfolio page with 10+ animated components, you can end up with 100KB+ of animation JavaScript blocking interactivity.

**Why it happens:**
Developers import `motion` from `framer-motion` at the top level in every animated component without ever auditing bundle impact. The App Router makes it easy to mark everything `'use client'` and not think about it.

**How to avoid:**
Use `LazyMotion` with the `domAnimation` feature set instead of the full `domMax`. Wrap the root layout with `<LazyMotion features={domAnimation}>` and use `m` instead of `motion` in all animated components. This reduces Framer Motion's client footprint by ~50%. Only include `domMax` (physics spring, drag, layout animation) in components that actually need those features, loaded dynamically.

```tsx
// app/layout.tsx
import { LazyMotion, domAnimation } from 'framer-motion'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LazyMotion features={domAnimation}>
          {children}
        </LazyMotion>
      </body>
    </html>
  )
}

// In animated components: use `m` not `motion`
import { m } from 'framer-motion'
<m.div animate={{ opacity: 1 }} />
```

**Warning signs:**
- Lighthouse JS payload exceeds 150KB for the home page
- Bundle analyzer shows `framer-motion` as the largest chunk
- First Input Delay (FID) or Interaction to Next Paint (INP) is high

**Phase to address:**
Foundation phase — set up `LazyMotion` wrapper in root layout before any animation components are built.

---

### Pitfall 2: Framer Motion SSR Hydration Mismatch Crashes the Page

**What goes wrong:**
Framer Motion components that read browser-only state (scroll position, window size, mouse position) during server render produce HTML that doesn't match the client's initial render. React throws a hydration error, often silently in development but visibly in production as a blank flash or console error. Page transitions using `AnimatePresence` are especially prone to this because they depend on route changes that only exist client-side.

**Why it happens:**
In Next.js App Router, components without `'use client'` are Server Components that render on the server. Any `motion.*` component or hook (`useScroll`, `useMotionValue`, `useInView`) used in a Server Component or a Client Component that renders server-side without guarding causes a mismatch.

**How to avoid:**
- Mark ALL components using `motion.*` or Framer Motion hooks with `'use client'`
- For page transitions with `AnimatePresence`, wrap the layout children in a Client Component provider, not in the Server Component layout directly
- Use `suppressHydrationWarning` only as a last resort and only on elements where the mismatch is intentional and harmless
- Test with `next build && next start` — hydration errors often don't surface in `next dev`

**Warning signs:**
- `Warning: Prop \`style\` did not match` errors in the console
- Content flashes or is invisible on initial page load
- `useLayoutEffect` warnings in server logs
- Works in dev but breaks in production build

**Phase to address:**
Animation phase — establish the `'use client'` boundary pattern before building any Framer Motion components.

---

### Pitfall 3: Mobile Video Autoplay Silently Fails — No `muted` + `playsInline`

**What goes wrong:**
The hover-to-play MP4 preview clips simply do not play on iOS Safari or Android Chrome. The JavaScript `.play()` call returns a rejected Promise that goes unhandled, and the video element shows nothing — often just a black rectangle or a static poster frame. This is catastrophic for a portfolio whose entire grid relies on video previews.

**Why it happens:**
All major mobile browsers enforce autoplay restrictions: video with audio cannot autoplay without explicit user gesture. On iOS specifically, even muted video requires the `playsInline` attribute or it will try to go fullscreen (and often fail). The `autoplay="false"` attribute is not a valid way to disable autoplay — the presence of the attribute itself triggers autoplay behavior regardless of value.

**How to avoid:**
Every `<video>` element used for hover-to-play previews MUST have all three attributes: `muted`, `playsInline`, and `loop`. Always handle the `.play()` Promise rejection explicitly:

```tsx
const videoRef = useRef<HTMLVideoElement>(null)

const handleMouseEnter = async () => {
  const video = videoRef.current
  if (!video) return
  try {
    await video.play()
  } catch (err) {
    // Autoplay blocked — show poster/fallback, do not throw
    console.warn('Autoplay prevented:', err)
  }
}
```

Also, on touch devices hover events don't fire — implement `onTouchStart` to trigger play, and `onTouchEnd` to pause. Test on a real iPhone in Safari, not just Chrome DevTools mobile emulation.

**Warning signs:**
- Black rectangles in the video grid on mobile
- Unhandled Promise rejections in console: `play() request was interrupted`
- Works on desktop Chrome but fails on iPhone Safari

**Phase to address:**
Portfolio grid phase — bake in the muted/playsInline pattern from the first video component, not as a patch after QA.

---

### Pitfall 4: Vimeo Embeds Loaded Eagerly on Project Pages Destroy Performance

**What goes wrong:**
Placing a Vimeo `<iframe>` directly in the project detail page JSX causes the browser to immediately load the full Vimeo player JavaScript (~300KB+), establish a cross-origin connection, and block the main thread. On a project page with multiple related videos, this multiplies. Lighthouse performance score drops below 50.

**Why it happens:**
Developers embed Vimeo as a simple `<iframe src="https://player.vimeo.com/video/ID">` because it "just works." The iframe doesn't respect lazy loading the same way images do, and Vimeo's player initializes immediately on DOM insertion.

**How to avoid:**
Use the `loading="lazy"` attribute on all Vimeo iframes. For a premium UX, implement a facade pattern: show a custom poster image (fetched from Vimeo's oEmbed API) with a play button overlay, and only swap in the actual `<iframe>` on user click. This cuts initial page load by 300KB+ and keeps the page feeling instant.

```tsx
// Facade pattern
const [activated, setActivated] = useState(false)

if (!activated) {
  return (
    <div onClick={() => setActivated(true)} style={{ cursor: 'pointer' }}>
      <img src={posterUrl} alt={title} />
      <PlayIcon />
    </div>
  )
}

return <iframe src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`} ... />
```

Also: use Next.js `<Suspense>` wrapping for Vimeo embeds fetched server-side (per official Next.js docs), with a skeleton fallback.

**Warning signs:**
- Project detail page LCP is over 4s
- Network waterfall shows Vimeo JS loading before page content
- Bundle shows 3rd party scripts blocking render

**Phase to address:**
Project detail page phase — implement facade from day one, not after performance audit.

---

### Pitfall 5: MP4 Preview Clips Served Without Proper Headers or CDN — Videos Load Slowly

**What goes wrong:**
MP4 preview clips stored in `public/` and served directly from the Next.js Node.js process on Railway are slow to start playing. Railway's Node.js server is not optimized for binary asset delivery — it doesn't send proper HTTP range request support, doesn't set cache headers, and lacks a CDN in front. A 1MB MP4 clip may stall for 2-3 seconds before playback begins, defeating the "instant hover" goal.

**Why it happens:**
Next.js's `public/` folder works fine for small static assets but is not designed for video delivery. The Node.js server handles every byte, doesn't cache at the edge, and Railway's default setup doesn't configure a CDN layer automatically.

**How to avoid:**
- Store preview MP4s in an object storage service with CDN delivery: Railway's default file system is ephemeral (files uploaded at runtime are lost on redeploy). Use Cloudflare R2, AWS S3 + CloudFront, or Backblaze B2 + Cloudflare for ~$0/mo at this scale.
- Set `preload="metadata"` (not `preload="auto"`) on video elements — this loads only the first few frames for poster display without fetching the whole file.
- Add `Content-Range` support and correct `Content-Type: video/mp4` headers — cloud storage providers handle this automatically.
- Target preview clip size: under 800KB at 720p, 5-10 seconds, encoded with `ffmpeg -crf 28 -preset slow`.

**Warning signs:**
- Videos take >1s to start playing on hover on a fast connection
- Files disappear from the server after Railway redeploys
- No `Accept-Ranges: bytes` header in video responses

**Phase to address:**
Infrastructure/media phase — establish the CDN-backed storage pattern before any admin upload feature is built.

---

### Pitfall 6: Railway Ephemeral Filesystem Loses Uploaded Files on Redeploy

**What goes wrong:**
The admin panel allows the owner to upload preview clips and brand logos. These files are saved to the local filesystem (e.g., `/tmp/` or `public/uploads/`). After the next Railway deployment, redeploy, or container restart, all uploaded files are gone. The portfolio shows broken images and missing video previews.

**Why it happens:**
Railway runs Next.js in a container with an ephemeral filesystem. Unlike a VPS, there is no persistent disk that survives between deployments. Developers who test locally (where the filesystem persists) don't discover this until after going live.

**How to avoid:**
Never write uploaded files to the local filesystem in production. Route all uploads to external object storage from day one:
1. Admin uploads file via the browser
2. Server Action receives the file as a `FormData` / `File` object
3. Server streams the file directly to S3/R2/Backblaze using their SDK
4. Only the public URL is stored in the database

For the Railway deployment, also set `output: 'standalone'` in `next.config.js` to minimize the deployed artifact.

**Warning signs:**
- Uploads work in local dev but vanish in production
- Console logs show file paths like `/tmp/...` in server actions
- Railway deployment logs show container restart events

**Phase to address:**
Admin CMS phase — establish the object storage upload pipeline before the first upload UI is built.

---

### Pitfall 7: Server Action `bodySizeLimit` Blocks Video Clip Uploads

**What goes wrong:**
Admin tries to upload a 5MB preview clip through the admin panel. The upload silently fails or returns a 413 error. The owner, who is non-technical, has no idea what went wrong.

**Why it happens:**
Next.js Server Actions have a default `bodySizeLimit` of **1MB**. This is documented but easy to miss. Preview clips at 720p/5-10s easily exceed 1MB even when compressed.

**How to avoid:**
Increase the limit in `next.config.js` before any upload feature is built:

```js
// next.config.js
module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
}
```

For large files (>10MB), prefer client-side direct upload to S3/R2 using presigned URLs — this bypasses the Next.js server entirely and avoids the size limit problem altogether. The Server Action only stores the resulting URL.

**Warning signs:**
- Upload fails with no clear error message in the admin UI
- Network tab shows 413 status from `/api/...` or Server Action endpoint
- Works for small logos but fails for video clips

**Phase to address:**
Admin CMS phase — configure `bodySizeLimit` or presigned upload pattern before the first upload field is built.

---

### Pitfall 8: Admin Panel Authentication — JWT in localStorage Is Insecure and Sessionless

**What goes wrong:**
The admin panel stores the session token in `localStorage`. An XSS attack on any page of the site (e.g., from a malicious Vimeo embed or third-party script) can steal the token and impersonate the admin. Additionally, there is no server-side session, so compromised tokens can't be revoked.

**Why it happens:**
It's the easiest auth pattern to implement: `fetch('/api/login')`, get a JWT back, put it in `localStorage`, send it in headers on every request. Works immediately, no setup required.

**How to avoid:**
Use HTTP-only cookies for the session token, not `localStorage`. HTTP-only cookies are inaccessible to JavaScript — XSS cannot steal them. Implement with NextAuth.js (credentials provider) or a lightweight custom session using Next.js `cookies()` API. Always:
- Set `httpOnly: true` and `secure: true` on session cookies
- Set `SameSite: lax` or `strict`
- Protect all `/admin/*` routes in middleware that checks the cookie before rendering
- Hash the password with bcrypt — never store plaintext or MD5

**Warning signs:**
- Session token visible in browser's Application > Local Storage tab
- No session invalidation on logout (token still works after "logout")
- Admin routes accessible without cookie check at the middleware level

**Phase to address:**
Admin auth phase — get the cookie-based session right before ANY admin feature is built. Never retrofit security.

---

### Pitfall 9: Prisma Binary Missing at Runtime on Railway (Deployment Failure)

**What goes wrong:**
`next build` succeeds locally. Railway deployment fails at runtime with: `Error: Query engine library for current platform "linux-musl-arm64-openssl-3.0.x" could not be found`. Or the app starts but all database queries throw errors because Prisma's query engine binary for the production platform wasn't included in the build.

**Why it happens:**
Prisma generates a native binary engine specific to the host OS/architecture. The developer's machine generates a Windows or macOS binary. Railway runs Linux (likely `linux-musl` for Alpine-based containers or `linux-openssl-3.0.x` for Debian). The production binary is never generated because `prisma generate` only ran locally.

**How to avoid:**
- Add `prisma generate` to the Railway build command: `npm run build` should be `prisma generate && next build`
- Or add `postinstall: "prisma generate"` to `package.json` scripts — Railway runs `npm install` which triggers `postinstall`
- Specify the target in `schema.prisma`:

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}
```

- Never run `prisma migrate deploy` inside the Next.js startup process — run it as a separate Railway deployment step or pre-deploy command.

**Warning signs:**
- `prisma generate` not listed in package.json scripts or build pipeline
- Build succeeds but runtime crashes immediately on first DB query
- Railway logs: "Query engine library for current platform ... could not be found"

**Phase to address:**
Database/deployment phase — set up the Railway build pipeline with `prisma generate` before any database queries are written.

---

### Pitfall 10: `prisma migrate deploy` Blocks or Fails During Zero-Downtime Deploys

**What goes wrong:**
The startup script runs `prisma migrate deploy` when the app boots. This works fine until: (1) a migration takes more than 30 seconds (Railway's health check timeout), causing Railway to restart the container mid-migration, corrupting database state; (2) a migration requires a lock on a table that the running app is actively querying, causing deadlocks; (3) two containers start simultaneously during a rolling deploy, both running migrations at the same time.

**Why it happens:**
Running migrations at app startup is common tutorial advice that works fine in development but creates production race conditions.

**How to avoid:**
Run `prisma migrate deploy` as a one-off command **before** the new app version starts, using Railway's "deploy command" feature (separate from the start command). Configure Railway's service settings: Start Command = `next start`, Pre-deploy = `npx prisma migrate deploy`. This ensures migrations complete before any new containers handle traffic.

For SQLite (if using): understand that SQLite is a single-file database — concurrent writes from Railway's multiple container starts will corrupt it. Use PostgreSQL (Railway provides it as a plugin) for any production deployment.

**Warning signs:**
- SQLite used in production with Railway
- `prisma migrate deploy` in the same command as `next start`
- No Railway pre-deploy hook configured
- Health check timeouts during deployments with schema changes

**Phase to address:**
Database/deployment phase — configure the Railway deploy pipeline correctly on first database setup.

---

### Pitfall 11: SEO Regression During Migration — Old URLs Return 404

**What goes wrong:**
The existing vlacovision.com site has 22 project pages indexed by Google. After the rebuild, the URL structure changes (e.g., from `/work/project-name.html` to `/projects/[slug]`). All existing backlinks and Google search rankings for those pages are lost. New URL structure returns 404 for old URLs.

**Why it happens:**
URL structure is an afterthought in rebuilds. The new Next.js file-based routing is designed fresh without mapping to existing URL patterns.

**How to avoid:**
1. Crawl the current site with a tool like Screaming Frog or simply list all current URLs from the hardcoded HTML before starting the rebuild
2. Define the new URL structure FIRST, map old → new, and implement redirects in `next.config.js`:

```js
// next.config.js
async redirects() {
  return [
    {
      source: '/work/:slug.html',
      destination: '/projects/:slug',
      permanent: true, // 301 redirect — passes link equity
    },
  ]
}
```

3. Maintain the same slug format where possible (e.g., project slugs derived from existing Vimeo IDs or titles)
4. Keep the existing `<meta name="description">` content and page titles — don't reinvent them unless they were poor

**Warning signs:**
- No URL audit of current site before starting rebuild
- `permanent: false` (302) used for permanent URL changes
- New routes don't include metadata exports (`export const metadata = ...`)
- Old Vimeo IDs not preserved in slug generation

**Phase to address:**
Foundation phase — document URL mapping before any routing is built. Implement redirects in `next.config.js` from day one.

---

### Pitfall 12: `next/image` Breaks for Externally-Hosted Brand Logos Without Domain Config

**What goes wrong:**
Brand logos (Nike, Disney, etc.) are stored externally (S3/R2 or Vimeo thumbnails). Using `<Image src="https://cdn.example.com/nike-logo.png" />` throws: `Error: Invalid src prop ... hostname "cdn.example.com" is not configured under images in your next.config.js`.

**Why it happens:**
Next.js `next/image` only allows external images from explicitly allowlisted hostnames for security. This is correct behavior but catches developers by surprise when switching from `<img>` tags.

**How to avoid:**
Configure all external image domains before using `next/image` with external sources:

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com', // Vimeo thumbnails
      },
    ],
  },
}
```

Use `remotePatterns` (introduced in Next.js 13) over the deprecated `domains` array.

**Warning signs:**
- `<Image>` components using URLs from S3/R2/CDN throw build-time or runtime errors
- Vimeo thumbnail images used as video posters but `next/image` rejects the domain
- `domains` config used instead of `remotePatterns`

**Phase to address:**
Foundation phase — configure `remotePatterns` before any external images are used.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| `'use client'` on every component to avoid SSR complexity | Faster initial development | Defeats SSR/SEO benefits, increases JS sent to client, CLS issues | Never for layout/page-level components; acceptable for isolated interactive widgets |
| SQLite for production database | Zero setup, no cost | Data corruption under concurrent writes, lost on Railway container restart, no horizontal scale | Only acceptable for local development |
| Storing uploads in `public/uploads/` locally | Works immediately in dev | Files lost on every Railway deploy, no CDN, slow delivery | Never in production |
| Plaintext `localStorage` JWT for admin auth | Simple to implement | XSS-stealable, no server-side revocation, no cookie protections | Never |
| Full `import { motion } from 'framer-motion'` everywhere | Less code to write | Bloated client bundles on every animated page | Never in App Router; use `m` from `LazyMotion` |
| Skipping `prisma generate` in build pipeline | Works locally | Runtime crash on Railway first deploy | Never |
| `autoplay="false"` on video elements | Seems correct | Browser treats attribute presence as true — video autoplays anyway | Never; remove attribute entirely to prevent autoplay |
| 302 redirects for old-to-new URLs | Faster to configure | Does not pass SEO link equity to new URL | Only for temporary/conditional redirects; use 301 for permanent page moves |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Vimeo embed | Load iframe on page mount with `src` immediately set | Facade pattern: show poster image, set `src` only on user click |
| Vimeo oEmbed API | Call Vimeo oEmbed on every page render (no cache) | Fetch at build time or cache in database; Vimeo rate-limits the oEmbed endpoint |
| MP4 preview clips on hover | `.play()` without catching the rejected Promise | Always `await video.play().catch(() => {})` |
| Prisma on Railway | Missing `postinstall: "prisma generate"` in package.json | Add `postinstall` script; include correct `binaryTargets` in schema |
| Next.js Server Actions for file upload | Default 1MB body size limit causes silent failures for video | Set `bodySizeLimit: '25mb'` or use presigned uploads for large files |
| Railway file storage | Writing to local filesystem for user uploads | Stream all uploads to S3/R2/Backblaze; store only URLs in DB |
| Framer Motion with App Router | Using `motion.div` in Server Components | All Framer Motion usage requires `'use client'` directive |
| `next/image` with CDN URLs | Omitting `remotePatterns` config for external hostnames | Add all external image hostnames to `remotePatterns` before using `<Image>` |
| NextAuth.js on Railway | Missing `NEXTAUTH_URL` and `NEXTAUTH_SECRET` env vars | Set both in Railway's environment variables panel before first deploy |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| All 22 project MP4 previews `preload="auto"` | Page loads 22MB of video data on mount; time to interactive is 10+ seconds | Use `preload="metadata"` or `preload="none"`; only load video on hover via JS | Immediately on any connection slower than 100Mbps |
| Vimeo iframes in the portfolio grid (not just detail pages) | Grid hover triggers 22 Vimeo players, each loading ~300KB of Vimeo JS | Use native `<video>` with self-hosted MP4 for grid previews; Vimeo only on detail pages | Immediately — even on fast connections, 22 iframes is ~6MB of 3rd party JS |
| Unoptimized brand logos as PNG in `<img>` tags | Large logo files (1MB+ PNGs) shipped without optimization | Use `next/image` for all logos; provide SVG where possible | At page load — direct performance hit regardless of scale |
| Framer Motion scroll animations on 22 grid items, all mounted at once | `IntersectionObserver` / scroll listeners on 22 elements cause jank | Virtualize the grid if >20 items, or use CSS `will-change: transform` only on visible items | With 22+ items visible simultaneously |
| Admin analytics dashboard querying full event log on every page view | Dashboard takes 5-10s to load as event log grows | Aggregate analytics data daily into summary tables; never query raw event log directly | After ~10,000 page view events (~1-2 months of traffic) |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Admin routes protected only by frontend redirect (no middleware check) | Direct URL access to `/admin/projects` bypasses the redirect, exposes data | Use Next.js middleware (`middleware.ts`) to check session cookie on every `/admin/*` route server-side |
| Vimeo URL or project data accepted from user input without validation | Malformed Vimeo ID causes runtime errors; malicious URLs could exfiltrate data | Validate Vimeo IDs match `^\d{6,12}$`; sanitize all text inputs with zod schemas before DB writes |
| Password stored as plaintext or MD5 in the database | Admin account compromised if DB is leaked | Use bcrypt with cost factor 12+ via `@node-rs/bcrypt` (listed in Next.js's auto-externalized packages) |
| `NEXTAUTH_SECRET` or database URL committed to git | Credentials exposed in repository | Use Railway's environment variable management; add `.env*` to `.gitignore` from project initialization |
| No rate limiting on the contact form endpoint | Spam floods the admin inbox and the database | Add rate limiting on the contact form route: check by IP, max 5 submissions per hour |
| Admin file upload accepting any MIME type | Malicious file upload (PHP shells, SVG with XSS) | Validate MIME type server-side (not just `accept` attribute in the input); only allow `video/mp4`, `image/png`, `image/svg+xml`, `image/webp` |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Video grid shows black rectangles on mobile (no touch-to-play fallback) | Mobile visitors (likely 50%+ of traffic) see a broken grid with no video | Detect touch device; on mobile show static poster image with play icon overlay; tap launches detail page with Vimeo embed |
| Page transitions with Framer Motion cause layout shift during animation | Content jumps during route changes, feels glitchy | Use `position: fixed` or `position: absolute` on transitioning elements; ensure old page exits before new page enters with `mode="wait"` in `AnimatePresence` |
| Hero video autoplays with audio on desktop | Visitor is startled/annoyed; likely to leave | Hero video must be `muted` — always. Provide an unmute toggle if audio is meaningful to the piece |
| Admin upload shows no progress indicator for large video files | Owner thinks the upload is frozen and refreshes, losing the upload | Show a progress bar using `XMLHttpRequest` with `upload.onprogress` or use a library like `uppy` that handles this |
| Contact form has no success state — just disappears after submit | User doesn't know if submission worked; may submit multiple times | Show explicit success message ("Message received — we'll be in touch within 24 hours") and disable the form after submission |
| Portfolio grid loads all 22 items at full resolution images simultaneously | Slow initial load; content layout shift as images pop in | Use `next/image` with `loading="lazy"` and explicit `width`/`height` for all grid thumbnails |

---

## "Looks Done But Isn't" Checklist

- [ ] **Video previews on mobile:** Verify that hover-to-play works on an actual iPhone in Safari — not just Chrome DevTools mobile emulation. Check that videos play muted with no black rectangle.
- [ ] **Admin auth:** Verify that navigating directly to `/admin/projects` without a session redirects to login — not just that the UI button is hidden.
- [ ] **File uploads persist:** Deploy to Railway, upload a logo via admin, then trigger a redeploy — verify the logo is still visible after the redeploy (it will not be if using local filesystem).
- [ ] **SEO metadata on project pages:** Check that each project detail page has a unique `<title>`, `<meta name="description">`, and `<meta property="og:image">` — not just the root layout's defaults.
- [ ] **Old URL redirects:** Verify the 22 existing Vimeo project URLs (if they had slugs) return 301 redirects to new URLs — use `curl -I https://vlacovision.com/old-url`.
- [ ] **Vimeo embed on detail page:** Verify that the Vimeo player does NOT load until the user clicks play (facade pattern) — check the Network tab for `player.vimeo.com` requests.
- [ ] **Prisma on Railway:** Trigger a fresh Railway deployment and check that the app starts without `Query engine library ... could not be found` errors.
- [ ] **Contact form rate limiting:** Submit the contact form 10 times in a row — verify it blocks further submissions and shows an appropriate message.
- [ ] **Analytics dashboard performance:** With 1,000+ events in the database, verify the admin analytics page loads in under 2 seconds.
- [ ] **Drag-and-drop reorder persists:** Reorder projects in the admin, refresh the page, and verify the public portfolio grid reflects the new order.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Framer Motion SSR hydration crashes | MEDIUM | Add `'use client'` to affected components; move animation logic to client-only wrappers; rebuild |
| Uploaded files lost on Railway redeploy | HIGH | Re-upload all assets manually; migrate file storage to S3/R2 immediately; update all DB URLs |
| Prisma binary missing in production | LOW | Add `prisma generate` to Railway build command; redeploy |
| Admin auth localStorage JWT compromise | HIGH | Rotate credentials; rebuild auth with HTTP-only cookies; audit for XSS vectors |
| SEO URL regression discovered post-launch | MEDIUM | Add redirects in `next.config.js`; submit updated sitemap to Google Search Console; wait 2-4 weeks for re-indexing |
| SQLite data corruption under concurrent writes | HIGH | Export data (if possible), migrate to PostgreSQL, restore data, rebuild Railway service with Postgres plugin |
| Mobile video previews not playing | LOW | Add `muted`, `playsInline`, Promise catch, and touch event handlers to video components |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Framer Motion bundle size (`LazyMotion`) | Phase 1: Foundation — root layout setup | Bundle analyzer shows `framer-motion` under 20KB |
| Framer Motion SSR hydration mismatch | Phase 2: Animation system — first animated component | No hydration warnings in `next build && next start` |
| Mobile video autoplay (muted/playsInline/Promise) | Phase 3: Portfolio grid — first video element | Manual test on real iPhone Safari |
| Vimeo iframe eager loading | Phase 4: Project detail page — first Vimeo embed | Network tab shows Vimeo JS not loaded until user clicks play |
| MP4s served without CDN | Phase 3: Portfolio grid — media storage setup | Videos begin playing within 200ms on hover over 4G |
| Railway ephemeral filesystem for uploads | Phase 5: Admin CMS — first upload feature | Upload file, redeploy Railway, verify file still accessible |
| Server Action `bodySizeLimit` | Phase 5: Admin CMS — upload form | Upload a 5MB MP4 without 413 error |
| Admin auth security (HTTP-only cookies) | Phase 5: Admin CMS — authentication setup | `/admin/*` returns 302 to login without valid session cookie |
| Prisma binary on Railway | Phase 2: Database setup — first Railway deploy | Fresh Railway deploy starts without Prisma engine error |
| Prisma migrate race condition | Phase 2: Database setup — Railway deploy pipeline | Railway pre-deploy command runs `migrate deploy` before `next start` |
| SEO URL regression | Phase 1: Foundation — routing design | `curl -I` on old URLs returns 301 to new URLs |
| `next/image` external domain config | Phase 1: Foundation — `next.config.js` setup | No `Invalid src prop` errors when using external image URLs |

---

## Sources

- Next.js official docs — Video optimization: https://nextjs.org/docs/app/guides/videos (verified 2026-03-30)
- Next.js official docs — Self-hosting guide: https://nextjs.org/docs/app/guides/self-hosting (verified 2026-03-30)
- Next.js official docs — Server Actions `bodySizeLimit`: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions (verified 2026-03-30)
- Next.js official docs — `serverExternalPackages` (Prisma auto-externalized): https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages (verified 2026-03-30)
- Next.js official docs — App Router migration: https://nextjs.org/docs/app/guides/migrating/app-router-migration (verified 2026-03-30)
- MDN Web Docs — Video autoplay restrictions and `playsInline` requirement on iOS: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video (verified 2026-03-30)
- Framer Motion — Bundle size and LazyMotion: training knowledge (HIGH confidence, stable API since Framer Motion v6)
- Prisma — Binary targets and deployment: training knowledge (HIGH confidence, documented behavior)
- Railway — Ephemeral filesystem behavior: training knowledge (MEDIUM confidence, consistent with all container-based platforms)

---

*Pitfalls research for: Premium videographer portfolio with admin CMS — Next.js App Router rebuild*
*Researched: 2026-03-30*
