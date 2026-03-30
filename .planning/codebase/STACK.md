# Technology Stack

**Analysis Date:** 2026-03-30

## Languages

**Primary:**
- JavaScript (ES6+) - Client-side interactivity and DOM manipulation
- HTML5 - Page structure and markup
- CSS3 - Styling and animations

## Runtime

**Environment:**
- Node.js (version unspecified in package.json, typically modern LTS)

**Package Manager:**
- npm - Dependency management
- Lockfile: Not present (no package-lock.json or yarn.lock detected)

## Frameworks

**Core:**
- Express.js 4.18.2 - HTTP server and static file serving
- Vimeo Player API - Client-side video player integration

**Build/Dev:**
- None specified - No build tool (webpack, vite, etc.) used

## Key Dependencies

**Critical:**
- express 4.18.2 - Web framework for Node.js server
- compression 1.7.4 - Gzip compression middleware for HTTP responses

**Infrastructure:**
- Vimeo Player API (loaded via CDN) - Video player functionality
- Vimeo oEmbed API (via fetch) - Dynamic thumbnail generation

## Configuration

**Environment:**
- PORT environment variable - Server port (defaults to 3000)
- Entry point: `server.js` - Express app configuration
- Static file serving from project root via `express.static('.')`

**Build:**
- No build configuration files present
- Static assets served directly from `/assets` directory
- CSS and JavaScript files served as-is with cache control (1-day max-age)

## Platform Requirements

**Development:**
- Node.js runtime
- npm for dependency installation
- Modern web browser with ES6+ support

**Production:**
- Node.js hosting (Railway recommended in documentation)
- HTTP/HTTPS support
- Static file serving capability
- Environment variable support for PORT configuration

---

*Stack analysis: 2026-03-30*
