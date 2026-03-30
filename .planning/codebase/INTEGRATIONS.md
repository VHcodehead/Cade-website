# External Integrations

**Analysis Date:** 2026-03-30

## APIs & External Services

**Video Hosting & Playback:**
- Vimeo - Primary video hosting and playback service
  - SDK/Client: Vimeo Player API (loaded from `https://player.vimeo.com/api/player.js`)
  - Used in: `index.html` line 8, all `projects/*.html` files
  - Implementation: `script.js` VideoManager class creates Vimeo.Player instances from iframes

**Thumbnail Generation:**
- Vimeo oEmbed API - Dynamic thumbnail fetching
  - Endpoint: `https://vimeo.com/api/oembed.json?url=https://vimeo.com/{vimeoId}`
  - Used in: `script.js` loadThumbnail() method (lines 150-167)
  - Fallback: vumbnail.com service at `https://vumbnail.com/{vimeoId}.jpg`

**Video CDN:**
- Vimeo Player CDN - Video embedding and streaming
  - Iframe src pattern: `https://player.vimeo.com/video/{vimeoId}?{params}`
  - Parameters: autoplay, loop, muted, controls, byline, title, portrait, autopause

## Data Storage

**Databases:**
- None - Static website with no backend data persistence

**File Storage:**
- Local filesystem only
- Static assets in `/assets` directory
- Project detail pages in `/projects` directory
- All files served directly by Express.js

**Caching:**
- HTTP cache headers configured in `server.js` (line 22)
  - maxAge: '1d' (1 day) for static assets
  - etag: true for cache validation

## Authentication & Identity

**Auth Provider:**
- None - Public website, no user authentication required
- Vimeo videos embedded with public iframe URLs (no API key required for standard embedding)

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console logging for debugging:
  - Featured video load events: `script.js` lines 21-34
  - Thumbnail loading: `script.js` lines 159-166
  - Vimeo player events: `script.js` lines 57-70
  - Server startup: `server.js` line 30-32
  - Browser console errors handled in Vimeo player callbacks

## CI/CD & Deployment

**Hosting:**
- Railway (recommended in README.md, line 41-71)
- Alternative: Any Node.js hosting platform (Heroku, Vercel, etc.)
- Deployment via GitHub integration or Railway CLI

**CI Pipeline:**
- None configured (no GitHub Actions, Jenkins, etc.)

## Environment Configuration

**Required env vars:**
- PORT - Server port (optional, defaults to 3000)

**Secrets location:**
- None present - Website is public with no sensitive credentials
- `.env`, `.env.local`, `.env.production` in `.gitignore` but not currently used

## Webhooks & Callbacks

**Incoming:**
- None - Static website, no webhook endpoints

**Outgoing:**
- None - Website makes outbound requests to Vimeo APIs only:
  - Vimeo Player API calls (iframe initialization)
  - Vimeo oEmbed API calls (thumbnail generation)

## Performance Optimizations

**Compression:**
- Gzip compression enabled via `compression` middleware in `server.js` (line 9)

**Preloading:**
- Vimeo player preconnect on first user interaction: `script.js` lines 520-529
  - Reduces initial load time by establishing connection before first video hover

**Lazy Loading:**
- Videos load only on hover for grid items: `script.js` lines 124-136
- Featured video loads on page load with autoplay
- Thumbnails loaded dynamically via oEmbed API

## Security Headers

**Headers configured in `server.js` (lines 12-17):**
- X-Content-Type-Options: nosniff - Prevents MIME type sniffing
- X-Frame-Options: SAMEORIGIN - Prevents clickjacking
- X-XSS-Protection: 1; mode=block - Legacy XSS protection

---

*Integration audit: 2026-03-30*
