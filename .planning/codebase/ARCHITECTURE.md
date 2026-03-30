# Architecture

**Analysis Date:** 2026-03-30

## Pattern Overview

**Overall:** Server-rendered Single Page Application (SPA) with static asset delivery

**Key Characteristics:**
- Express.js server providing static file serving with compression and security headers
- Client-side JavaScript controlling dynamic video playback and UI interactions
- Vimeo API integration for video hosting and player management
- Zero database requirements - content driven by HTML markup and Vimeo metadata

## Layers

**Server Layer:**
- Purpose: Serve static assets, enforce security headers, enable compression, provide SPA fallback
- Location: `server.js`
- Contains: Express configuration, middleware setup, static file serving
- Depends on: Express, compression modules
- Used by: Client (all requests route through this)

**Presentation Layer:**
- Purpose: Define page structure, layout, and semantic markup
- Location: `index.html`, `projects/*.html`, `project-detail.css`, `styles.css`
- Contains: HTML templates, CSS styling rules, responsive design
- Depends on: No dependencies
- Used by: Browser renderer, JavaScript controllers

**Client-Side Controller Layer:**
- Purpose: Manage dynamic behavior, video lifecycle, animations, user interactions
- Location: `script.js`
- Contains: VideoManager class, InfiniteScroll class, event listeners, animation logic
- Depends on: Vimeo Player API, DOM APIs, browser APIs
- Used by: index.html through script tag

**Integration Layer:**
- Purpose: Connect to external services (Vimeo)
- Contains: Vimeo iframe creation, oEmbed API calls, thumbnail loading
- Integrated in: VideoManager class (methods: loadVideo, loadThumbnail, loadFeaturedVideo)

## Data Flow

**Video Grid Initialization:**

1. DOM loads with initial video grid items (first 9 videos) in `index.html`
2. DOMContentLoaded event fires in script.js
3. VideoManager.constructor() executes initGridVideos()
4. attachVideoListeners() adds mouseenter/mouseleave handlers to each .video-item
5. loadThumbnail() fetches from Vimeo oEmbed API for each video
6. Thumbnail URL displayed as background-image on .video-wrapper

**Video Playback Flow:**

1. User hovers over video item
2. 200ms delay triggers, then loadVideo() creates iframe
3. Vimeo.Player instantiated, volume set to 0 (muted)
4. player.play() called, player cached in VideoManager.players Map
5. User unmutes via .unmute-button click
6. Grid videos pause automatically on mouseleave

**Infinite Scroll Flow:**

1. InfiniteScroll.init() attaches scroll listener
2. checkScroll() monitors viewport position
3. When scrollPosition > (body.offsetHeight - 800), loadMoreVideos() executes
4. Hidden videos from .hidden-videos container cloned into .video-grid
5. New videos animated with opacity/transform transition
6. attachVideoListeners() re-runs on cloned elements
7. Process repeats until all videos loaded

**Project Detail Page Flow:**

1. User clicks video item (initVideoItemClicks)
2. window.location.href redirects to projects/*.html
3. Project page loads with hardcoded Vimeo iframe
4. Similar unmute button listener handles audio toggle

**State Management:**

- VideoManager.players: Map storing active Vimeo player instances
- InfiniteScroll.currentIndex: Tracks position in hidden videos array
- InfiniteScroll.isLoading: Flag preventing concurrent load requests
- Per-video flags: item.dataset.initialized prevents duplicate listeners
- Per-item player state: isLoaded, hoverTimeout stored in closure scope

## Key Abstractions

**VideoManager Class:**
- Purpose: Centralize all video loading, playback, and player instance management
- Examples: `script.js` lines 2-199
- Pattern: Class-based manager with lifecycle methods (init, load, pause, resume)
- Key methods: initGridVideos(), loadVideo(), loadThumbnail(), pauseAllExcept()

**InfiniteScroll Class:**
- Purpose: Handle lazy-loading and progressive rendering of video grid
- Examples: `script.js` lines 269-348
- Pattern: Observer pattern with scroll event detection
- Key methods: checkScroll(), loadMoreVideos(), showLoading(), hideLoading()

**Animation Functions:**
- Purpose: Encapsulate reusable animation logic (smooth scroll, scroll animations, header effects)
- Examples: `script.js` lines 202-266
- Pattern: Functional approach with event listeners and IntersectionObserver
- Key functions: initSmoothScroll(), initScrollAnimations(), initHeaderScroll(), initBouncingLogo()

**Unmute Button Handler:**
- Purpose: Toggle audio on both featured and grid videos
- Location: `script.js` lines 352-407
- Pattern: Event delegation with player state management
- Behavior: Checks current volume, toggles between 0 and 0.7

## Entry Points

**Server Entry Point:**
- Location: `server.js`
- Triggers: Node.js process start (npm start / npm run dev)
- Responsibilities: Start Express server on PORT (default 3000), serve static files with compression, apply security headers

**Client Entry Point:**
- Location: `index.html` - DOMContentLoaded event
- Triggers: When DOM fully parsed
- Responsibilities: Instantiate VideoManager, InfiniteScroll, initialize all UI controllers

**SPA Fallback:**
- Location: `server.js` line 26-28
- Route: GET * (all unmatched routes)
- Behavior: Redirects all requests to index.html for SPA routing

## Error Handling

**Strategy:** Client-side logging with graceful degradation

**Patterns:**

- **Missing elements:** Check with querySelector, log error, return early
  - Example: `if (!featuredWrapper) { console.error(...); return; }`

- **API failures:** Catch promise rejections, provide fallback
  - Example: Thumbnail load failure falls back to vumbnail.com

- **Video loading:** Promise catch blocks log errors, continue operation
  - Example: Player.ready() catch logs error but doesn't block UI

- **Autoplay compliance:** Mute by default, require user unmute gesture
  - Example: player.setVolume(0) before play()

## Cross-Cutting Concerns

**Logging:** Console logging via console.log() and console.error() throughout script.js
  - Featured video loading: logs each stage (creating iframe, initializing player, playing)
  - Thumbnail loading: logs success and fallback activation
  - Error conditions: logs all promise rejections

**Validation:** DOM element existence checks before accessing/manipulating
  - Example: VideoManager.initFeaturedVideo() checks for .featured-video-wrapper
  - InfiniteScroll.constructor() checks for .hidden-videos container

**Authentication:** None required - all content public, Vimeo embeds handle authorization

**Performance Optimization:**
  - Vimeo player preloaded on first mousemove event (line 520-529)
  - Thumbnails lazy-loaded on video item initialization
  - Videos lazy-loaded on hover with 200ms debounce
  - CSS animations use transform/opacity for GPU acceleration
  - Static assets cached with 1-day max-age header

---

*Architecture analysis: 2026-03-30*
