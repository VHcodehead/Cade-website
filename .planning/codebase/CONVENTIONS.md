# Coding Conventions

**Analysis Date:** 2026-03-30

## Naming Patterns

**Files:**
- JavaScript files use lowercase: `script.js`, `server.js`
- CSS files use lowercase: `styles.css`, `project-detail.css`
- HTML files use lowercase: `index.html`
- Asset files use descriptive names with capitals: `LOGO_noBG.jpg`, `Asset_12.png`

**Functions:**
- Utility functions use camelCase with `init` prefix for initialization: `initSmoothScroll()`, `initScrollAnimations()`, `initHeaderScroll()`
- Class methods use camelCase: `loadFeaturedVideo()`, `attachVideoListeners()`, `pauseAllExcept()`
- Constructor method named `constructor()`

**Variables:**
- Local variables use camelCase: `hoverTimeout`, `isLoaded`, `vimeoId`, `videoItems`
- Constants within classes stored as instance variables: `this.players = new Map()`
- Private-like variables prefixed with underscores where needed (rare in this codebase)
- Boolean variables prefixed with `is` or state-related: `isLoaded`, `isMuted`, `vimeoPreloaded`

**Types:**
- No TypeScript used; vanilla JavaScript only
- CSS classes use kebab-case: `.video-grid`, `.video-item`, `.unmute-button`, `.video-wrapper`
- HTML data attributes use kebab-case: `data-vimeo-id`, `data-project-url`, `data-video-id`

## Code Style

**Formatting:**
- No linter or formatter (ESLint/Prettier) configured
- 4-space indentation consistently used
- Line length: no strict limit, lines range from short to 100+ characters
- Semicolons used at statement ends
- Single and double quotes mixed in usage (`"text"` and `'text'` both appear)

**Linting:**
- No linting tool configured
- No code style rules enforced

## Import Organization

**Order:**
- In `server.js` (Node.js):
  1. Built-in modules: `const express = require('express');`
  2. Third-party modules: `const compression = require('compression');`
  3. Local modules: `const path = require('path');`

**Path Aliases:**
- No path aliases used
- Relative imports only in Node: `require('express')`, `require('path')`
- Browser JavaScript uses global scope exclusively

## Error Handling

**Patterns:**
- `.catch()` blocks on promises log errors to console: `.catch(err => { console.error('Failed to load...', err); })`
- Error handling in Fetch API: `.catch(err => { ... })` with fallback logic
- Graceful degradation: thumbnail loading fails over to alternative source (`vumbnail.com`)
- Conditional checks guard against missing DOM elements: `if (!wrapper.querySelector('.unmute-button'))`
- Return early on missing elements: `if (!bouncingLogo) return;`

**Error Patterns:**
```javascript
// Promise rejection with console.error
player.ready().then(() => {
    // success
}).catch(error => {
    console.error('Player ready failed:', error);
    reject(error);
});

// Fetch with fallback
fetch(url)
    .then(response => response.json())
    .catch(err => {
        console.error('Failed to load thumbnail for', vimeoId, err);
        // Fallback implementation
        wrapper.style.backgroundImage = `url(${fallbackUrl})`;
    });

// DOM element existence guard
if (!wrapper) {
    console.error('Featured video wrapper not found!');
    return;
}
```

## Logging

**Framework:** `console` object (console.log, console.error, console.warn)

**Patterns:**
- Verbose logging at initialization: `console.log('VLACOVISION website loaded')`
- Error logging on failures: `console.error('Failed to load featured video:', err)`
- Debug logging in video lifecycle: `console.log('Featured video loaded successfully')`, `console.log('Vimeo player ready')`
- Status logging: `console.log('Loading featured video with ID:', vimeoId)`
- No structured logging or log levels beyond console methods
- Logging is development-focused (not production-ready)

## Comments

**When to Comment:**
- Class and method descriptions: `// Video Player Management`, `// Load featured video automatically`
- Feature explanations: `// Hover to load and play`, `// Bounce off edges`
- Rationale for disabled code: `// Disabled parallax effect`, `// Featured video now uses hardcoded iframe in HTML`
- Why-based comments explaining non-obvious behavior: `// Start muted for autoplay compliance`

**JSDoc/TSDoc:**
- No JSDoc or TSDoc documentation used
- Only inline single-line comments

## Function Design

**Size:**
- Methods range from 5-40 lines
- Larger methods handle multiple concerns (e.g., `loadMoreVideos()` handles state, DOM manipulation, timing)
- No strict function size limits enforced

**Parameters:**
- Methods use simple parameters: `loadVideo(container, vimeoId)`
- Event handlers receive single event parameter: `addEventListener('click', (e) => { ... })`
- Closures used to capture variables: `hoverTimeout`, `player`, `isLoaded`

**Return Values:**
- Promise-based returns for async operations: `loadFeaturedVideo()`, `loadVideo()` return Promise
- Map structure for storing multiple items: `this.players = new Map()`
- No return statements in void methods (e.g., event handlers)

## Module Design

**Exports:**
- Node.js Express app: `app.listen(PORT, ...)`
- Browser-side: global scope exposure via classes and function initialization on DOMContentLoaded
- No module.exports or ES6 export syntax in browser code

**Barrel Files:**
- Not used; monolithic `script.js` file contains all browser logic

## Class Organization

**Pattern:**
```javascript
class ClassName {
    constructor() {
        // Initialize instance variables
        this.property = value;
    }

    methodOne() {
        // Implementation
    }

    methodTwo() {
        // Implementation
    }
}
```

**Classes in use:**
- `VideoManager`: Manages Vimeo player instances and grid interactions
- `InfiniteScroll`: Handles lazy-loading of videos on scroll

---

*Convention analysis: 2026-03-30*
