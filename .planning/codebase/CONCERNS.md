# Codebase Concerns

**Analysis Date:** 2026-03-30

## Tech Debt

**DEBUG Comments and Disabled Code in Styles:**
- Issue: Multiple `/* DEBUG: ... */` comments and disabled animations left in production CSS
- Files: `styles.css` (lines 322-323, 364, 389-390)
- Impact: Indicates rushed deployment; debug code should not be in production. The red border on iframe (line 364) is particularly visible
- Fix approach: Remove all DEBUG comments and re-enable animations properly. Use CSS variables or classes to control visual state instead of inline comments

**Disabled Parallax Feature:**
- Issue: `initParallax()` function is completely stubbed out with no implementation
- Files: `script.js` (lines 244-246)
- Impact: Dead code taking up space; unclear if this was intentionally removed or should be implemented
- Fix approach: Either implement parallax properly or remove the function entirely and its initialization call (line 509)

**Mixed CSS Naming Conventions:**
- Issue: Both `.featured-video-wrapper` and `.featured-video-wrapper-new` exist; many `-new` suffixed classes suggest incomplete refactor
- Files: `styles.css` (lines 249-314)
- Impact: Confusion about which classes are active, duplication, difficult to maintain
- Fix approach: Complete the refactor by removing all `-new` suffixed classes or committing to using them consistently throughout HTML

**Hard-coded Vimeo Video IDs:**
- Issue: All video IDs are embedded directly in HTML `data-vimeo-id` attributes with no centralized configuration
- Files: `index.html` (lines 103-268, 278-417), all project files in `projects/`
- Impact: Making bulk updates requires editing 20+ HTML files; no ability to A/B test videos or swap without touching multiple files
- Fix approach: Move video data to a JSON configuration file and populate HTML dynamically, or use a simpler video management system

## Performance Bottlenecks

**Multiple Simultaneous Video Players in Memory:**
- Problem: Infinite scroll loads additional video iframes that all stay in memory; video grid loads thumbnails via Vimeo oEmbed API on every page load
- Files: `script.js` (lines 127-135, 150-167, 308-324)
- Impact: Browser memory usage increases significantly as user scrolls; no cleanup when videos are no longer visible; potential DOM bloat with 20+ iframes
- Improvement path: Implement intersection observer to unload off-screen video players, cache thumbnail responses with localStorage, lazy-load Vimeo API script only when needed

**Vimeo oEmbed API Calls Without Caching:**
- Problem: `loadThumbnail()` fetches from `https://vimeo.com/api/oembed.json` for every video every page load with fallback to vumbnail.com
- Files: `script.js` (lines 150-167)
- Impact: Multiple API requests (one per video) slows page load; relies on external service availability; no caching mechanism
- Improvement path: Cache thumbnail URLs in localStorage per vimeo ID, batch requests, or use a static thumbnail CDN

**Scroll Event Listeners Without Debounce:**
- Problem: `window.addEventListener('scroll')` fires on every pixel of scroll; no debouncing or throttling
- Files: `script.js` (lines 253-265, 286-289)
- Impact: High CPU usage on scroll; multiple calculations per scroll event
- Improvement path: Throttle scroll events to 16ms intervals (60fps) or use passive event listeners

**Unused Animation Sequences:**
- Problem: Bouncing logo animation is fully implemented but disabled (lines 410-490); takes 530 lines of code
- Files: `script.js` (lines 410-490, 514)
- Impact: Code bloat; no memory benefit from disabling (function still defined and compiled)
- Fix approach: Either remove entirely or move to separate conditional module

## Fragile Areas

**VideoManager Class - Implicit State Management:**
- Files: `script.js` (lines 2-199)
- Why fragile: Uses a `Map` to track players with vimeoId as key, but relies on DOM element attributes for the same data; no synchronization between players Map and actual iframes in DOM; if HTML changes, players Map becomes stale
- Safe modification: Before modifying video grid HTML, audit all references to `this.players` Map. Consider using WeakMap for automatic cleanup when elements are removed
- Test coverage: No unit tests exist; behavior depends on execution order of event listeners

**Infinite Scroll with Array Cloning:**
- Files: `script.js` (lines 269-349)
- Why fragile: Clones hidden video elements and re-attaches listeners with `cloneNode(true)`, then calls `attachVideoListeners()` on the new grid every load; if listeners aren't properly cleaned from cloned elements, duplicates will fire
- Safe modification: The re-attachment at lines 329-330 is called unconditionally after each load - verify listeners don't accumulate on cloned elements
- Test coverage: No tests for listener accumulation; difficult to detect multiple listener fires without monitoring console

**Unmute Button Event Delegation:**
- Files: `script.js` (lines 352-407)
- Why fragile: Event listener at line 378 uses event delegation checking for `.unmute-button` anywhere in document, but references the closest `.video-item` to find the container (line 386); if HTML structure changes, the selector chain breaks
- Safe modification: Change from event delegation to attaching listeners directly in `addUnmuteButtons()` method instead of relying on bubbling
- Test coverage: No tests; behavior depends on DOM structure matching assumptions

**Global Script Initialization:**
- Files: `script.js` (lines 503-517)
- Why fragile: All initialization happens in DOMContentLoaded event with no error boundaries; if any function throws, subsequent initializations never run
- Safe modification: Wrap each initialization call in try/catch or use a safer initialization pattern
- Test coverage: Single point of failure; no graceful degradation

## Memory Leaks

**Event Listeners Not Removed on Dynamic Content:**
- Issue: InfiniteScroll class adds scroll listeners on init (line 286) and never removes them, even if the component is destroyed
- Files: `script.js` (lines 286-289)
- Impact: After repeated page loads or component initialization, scroll handlers accumulate without cleanup
- Fix approach: Add a `destroy()` method to InfiniteScroll that removes the scroll listener; call it before reinitializing

**Players Map Grows Without Cleanup:**
- Issue: VideoManager stores players in Map but never removes them when videos are unloaded via infinite scroll
- Files: `script.js` (lines 3-4, 130)
- Impact: Players remain in memory even after scrolling past them; each player holds iframe reference preventing garbage collection
- Fix approach: Implement cleanup in intersection observer to pause and destroy off-screen players, remove from Map

**Hover Timeout References:**
- Issue: Each video item maintains a `hoverTimeout` variable that may not always be cleared if events fire out of order
- Files: `script.js` (lines 119, 140-145)
- Impact: Timeouts could fire after elements are removed, causing "memory leak" references
- Fix approach: Store timeout refs on element itself and clear all on removal, or wrap in try/catch

## Security Considerations

**iframe Sandbox Attributes Missing:**
- Risk: Vimeo iframes have `allow="autoplay; fullscreen; picture-in-picture"` but no sandbox attribute
- Files: `index.html` (lines 55-61), all `projects/*.html` files
- Current mitigation: Vimeo is a trusted third-party; iframe src is not user-controlled
- Recommendations: Add `sandbox="allow-scripts allow-presentation allow-same-origin"` to further restrict capabilities; document why sandbox is not stricter if intentional

**innerHTML Used for Button Creation:**
- Risk: While the SVG is hardcoded (not user input), using innerHTML is unsafe practice if this ever becomes dynamic
- Files: `script.js` (lines 88-98)
- Current mitigation: SVG content is hardcoded; no user input
- Recommendations: Create buttons with createElement/createElementNS instead; better accessibility (no alt text on SVG); would be safer if button labels become dynamic

**Content Security Policy Not Set:**
- Risk: No CSP headers in Express server; allows inline scripts and styles
- Files: `server.js`
- Current mitigation: Small project; all scripts are internal or trusted (Vimeo API)
- Recommendations: Add CSP header: `script-src 'self' player.vimeo.com` to reduce XSS attack surface

**Express Static Serving Without Restrictions:**
- Risk: `express.static('.')` serves entire directory including sensitive files from root
- Files: `server.js` (line 20)
- Current mitigation: No .env or credentials files present in repo
- Recommendations: Change to `express.static('.')` with explicit path; add .gitignore check in CI; consider serving only necessary directories

## Known Bugs

**Featured Video Wrapper Selector Mismatch:**
- Symptoms: Code looks for `.featured-video-wrapper` in initFeaturedVideo but HTML uses inline styles on `<section class="featured-video">`
- Files: `script.js` (line 11-15), `index.html` (line 53)
- Trigger: Function is disabled (commented out line 6), so bug not visible; if re-enabled, wrapper not found error will occur
- Workaround: The featured video still works because iframe is hardcoded in HTML with autoplay; the featured video manager code is just not used

**Vimeo Player Instantiation Happens Before DOM Ready:**
- Symptoms: Project detail pages create Vimeo.Player at line 72 of aether-nz.html (inline script) before Vimeo script fully loads
- Files: All `projects/*.html` files (inline script sections)
- Trigger: Race condition that usually works because Vimeo API loads fast, but could fail on slow networks
- Workaround: Vimeo API is loaded in `<head>` before inline script, so it usually loads in time; but not guaranteed

**Scroll Event Fires Multiple Times Per Frame:**
- Symptoms: Header background changes and InfiniteScroll.checkScroll() called repeatedly during single scroll action
- Files: `script.js` (lines 253-265, 286-289)
- Trigger: Browser scroll event, particularly on mobile or during momentum scroll
- Workaround: None; just high CPU usage, not a functional bug

## Test Coverage Gaps

**VideoManager Untested:**
- What's not tested: Player creation, thumbnail loading, hover interactions, player lifecycle
- Files: `script.js` (lines 2-199)
- Risk: Changes to Vimeo API params, player creation logic, or thumbnail fallback could break videos without notice
- Priority: **High** - Core functionality

**InfiniteScroll Untested:**
- What's not tested: Scroll trigger point, video cloning, listener re-attachment, edge cases (empty grid, single page of videos)
- Files: `script.js` (lines 269-349)
- Risk: Refactoring could break pagination; hard to verify listener accumulation manually
- Priority: **High** - User-facing functionality

**Event Delegation Logic Untested:**
- What's not tested: Unmute button clicks, click handling on dynamically added videos, event propagation
- Files: `script.js` (lines 352-407, 493-500)
- Risk: Changes to selector logic or event target structure break without clear error messages
- Priority: **Medium** - Interactive features

**No E2E Tests:**
- Gap: No tests for actual video loading, Vimeo API interaction, or full page flow
- Risk: Vimeo API deprecation, rate limiting, or video availability changes discovered only in production
- Priority: **Medium** - Would catch integration issues

## Missing Critical Features

**No Error Recovery for Failed Video Loads:**
- Problem: If Vimeo API fails or video ID is invalid, users see broken layout with no fallback
- Blocks: Cannot gracefully degrade if Vimeo is unavailable; no offline mode
- Suggestion: Show placeholder image or message; implement retry logic; detect API errors and show user-friendly message

**No Loading States Between Thumbnails and Video:**
- Problem: Hover load at line 125-136 has 200ms delay but shows nothing to user during load
- Blocks: User thinks nothing is happening; could click multiple times or leave
- Suggestion: Show loading spinner during hover-to-play delay

**No Video Analytics:**
- Problem: No way to track which videos users actually watch or how long they engage
- Blocks: Cannot measure project popularity or user behavior
- Suggestion: Integrate Vimeo Analytics API or add custom tracking

**No Mobile Video Optimization:**
- Problem: All videos are muted on mobile for autoplay, same as desktop; potential data usage not addressed
- Blocks: Mobile users may not want autoplay bandwidth usage
- Suggestion: Detect mobile and disable autoplay; show play button instead

**No Accessibility Features:**
- Problem: No captions, no video transcripts, no keyboard controls for video players
- Blocks: Deaf/HoH users cannot watch; keyboard-only users cannot interact with unmute button
- Suggestion: Add caption tracks; make unmute button keyboard accessible; add ARIA labels

## Scaling Limits

**Infinite Scroll Will Break at Scale:**
- Current capacity: Works with ~20 videos loaded, all in hidden container
- Limit: Adding 50+ videos causes HTML parsing slowdown and memory issues with Vimeo API requests
- Scaling path: Paginate instead of infinite scroll; load videos server-side with offset/limit; implement virtual scrolling with only 3-5 videos rendered at once

**Vimeo API Rate Limits:**
- Current capacity: Currently making 1 request per video on page load (12 on initial, more on scroll)
- Limit: Vimeo oEmbed API has unspecified rate limits; caching not implemented
- Scaling path: Implement client-side caching with localStorage; use Vimeo Enhance with server-side thumbnail generation; batch requests

**Server Has No Performance Monitoring:**
- Current capacity: Single Node.js process on default port
- Limit: No metrics, logging, or error tracking; cannot diagnose slow page loads
- Scaling path: Add basic logging; implement request timing; use APM tool; potentially add CDN for static assets

## Dependencies at Risk

**Vimeo Player SDK:**
- Risk: Entire video experience depends on Vimeo embed API (`https://player.vimeo.com/api/player.js`)
- Impact: API deprecation, breaking changes, or service unavailability breaks all video functionality
- Migration plan: Maintain fallback with direct iframe embeds (already done); consider self-hosted video solution for critical content; monitor Vimeo changelog

**Express Framework:**
- Risk: Package at `^4.18.2`; caret allows breaking changes in 5.x
- Impact: Major version bump could require code changes
- Migration plan: Pin to `~4.18.2` for safety; set up automated dependency scanning with Dependabot

**No Package Lock File:**
- Risk: No `package-lock.json` in repo (though likely git-ignored)
- Impact: `npm install` could pull different versions in different environments
- Fix approach: Commit `package-lock.json` to repository; use `npm ci` in CI/deploy

---

*Concerns audit: 2026-03-30*
