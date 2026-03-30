# Codebase Structure

**Analysis Date:** 2026-03-30

## Directory Layout

```
MEWOskin-website/
├── .git/                   # Git repository
├── .planning/              # GSD planning and analysis
│   └── codebase/          # This directory (ARCHITECTURE.md, STRUCTURE.md, etc.)
├── assets/                # Images and brand logos (PNG, JPG)
├── projects/              # Individual project detail pages (22 HTML files)
├── index.html             # Main landing page (SPA)
├── server.js              # Express.js server entry point
├── script.js              # Client-side JavaScript controllers
├── styles.css             # Main stylesheet (global styles)
├── project-detail.css     # Project page stylesheet
├── package.json           # Node.js dependencies (Express, compression)
├── README.md              # Project documentation
├── QUICKSTART.md          # Getting started guide
├── VIMEO_IDS.md           # Vimeo video ID reference
└── .gitignore             # Git ignore rules
```

## Directory Purposes

**assets/:**
- Purpose: Store all brand imagery, logos, and visual assets
- Contains: PNG/JPG brand logos (Nike, Disney, Lululemon, etc.), company logo variants (LOGO_noBG.jpg, Asset_12.png, Asset 11.png)
- Key files: `LOGO_noBG.jpg` (spinning intro animation), `Asset_12.png` (intro animation join), `Asset 11 (1).png` (header logo)

**projects/:**
- Purpose: Host individual project detail pages, one HTML file per client work
- Contains: 22 HTML files with project-specific video embed, metadata, and description
- Key files: Representative projects include `aether-nz.html`, `bf-goodrich.html`, `dr-bronners.html`, `kith-x-columbia.html`, `lululemon.html`
- Structure: Each file references `../project-detail.css` and `../assets/*` for resources

**.planning/codebase/:**
- Purpose: Store analysis documents for the GSD planning system
- Contains: Architecture, structure, conventions, testing, and concerns documentation
- Generated: Yes (created by GSD mapper agent)
- Committed: Yes (stored in git)

## Key File Locations

**Entry Points:**

- `server.js`: Node.js/Express server - starts on port 3000, serves static files with compression, provides SPA fallback route
- `index.html`: Main landing page - loads from server.js, includes featured video section, brand banner, video grid, about section

**Configuration:**

- `package.json`: Defines Express and compression dependencies, start/dev scripts
- `.gitignore`: Ignores node_modules, .env, common development artifacts

**Core Logic:**

- `script.js`: All client-side behavior - 530 lines containing VideoManager, InfiniteScroll, animation controllers, event handlers
- `index.html`: HTML structure with video grid markup (19KB, 400+ lines)
- `projects/*.html`: Project detail pages (22 files, ~60 lines each)

**Styling:**

- `styles.css`: Global styles for all pages (16.9KB, includes intro animations, video grid, header, footer)
- `project-detail.css`: Project-specific styles (3.4KB, header, project video container, details section, unmute button)

**Content:**

- `README.md`: Project overview and description
- `QUICKSTART.md`: Setup and run instructions
- `VIMEO_IDS.md`: Reference of all Vimeo video IDs mapped to projects

## Naming Conventions

**Files:**

- **HTML pages:** lowercase with hyphens (kebab-case)
  - Examples: `aether-nz.html`, `dr-bronners.html`, `kith-x-columbia.html`

- **CSS files:** lowercase with single-word or descriptive names
  - Pattern: `{feature}.css`
  - Examples: `styles.css` (main), `project-detail.css` (project pages)

- **JavaScript files:** descriptive, lowercase
  - Pattern: `{purpose}.js`
  - Example: `script.js` (main client controller)

- **Image assets:** Original naming preserved, mixed case/underscores
  - Examples: `LOGO_noBG.jpg`, `Asset_12.png`, `Nike-Logo.png`

**Directories:**

- **Logical grouping:** lowercase, plural for collections
  - Pattern: `{entity-type}/`
  - Examples: `assets/` (images), `projects/` (project pages), `.planning/` (analysis)

**HTML Elements:**

- **IDs:** lowercase with hyphens (kebab-case)
  - Examples: `#featured-video-iframe`, `#intro-sequence`, `#logo-spinner`, `#video`

- **Classes:** lowercase with hyphens (kebab-case)
  - Examples: `.video-grid`, `.video-item`, `.unmute-button`, `.project-details`

- **Data attributes:** lowercase with hyphens (kebab-case)
  - Examples: `data-vimeo-id`, `data-project-url`, `data-video-id`, `data-initialized`

**JavaScript:**

- **Classes:** PascalCase
  - Examples: `VideoManager`, `InfiniteScroll`

- **Functions:** camelCase
  - Examples: `initSmoothScroll()`, `initScrollAnimations()`, `loadMoreVideos()`, `loadVideo()`

- **Variables:** camelCase
  - Examples: `videoItem`, `vimeoId`, `currentIndex`, `isLoading`, `hoverTimeout`

- **Constants:** UPPER_SNAKE_CASE
  - Examples: `const PORT = process.env.PORT || 3000;`, `const MAX_BOUNCES = 8;`

## Where to Add New Code

**New Project:**
- Primary code: Create `projects/{project-slug}.html` with markup matching existing project templates
- Content: Copy structure from `projects/aether-nz.html`, update video iframe src, client/services/description, metadata (lines 40-65)
- Reference in main grid: Add video-item entry to `index.html` .video-grid section with data-vimeo-id and data-project-url
- Styles: Use existing `project-detail.css` - no additional CSS needed for standard project layout

**New Animation or Interaction:**
- Primary code: Add new function to `script.js` following pattern of initSmoothScroll(), initScrollAnimations(), etc.
- Initialize: Call function in DOMContentLoaded event handler (line 503-514)
- Styling: Add CSS to `styles.css` with matching selector names
- Example pattern: Function names start with "init", use addEventListener or querySelector for DOM interaction

**New Feature (Video Management):**
- Primary code: Add method to VideoManager class (`script.js` lines 2-199)
- State management: Use this.players Map for player instance storage or add new property
- Initialize: Call from initGridVideos() or constructor if needed
- Example: pauseAllExcept() (line 192-198) demonstrates player state manipulation

**New Global Style:**
- Add to `styles.css` with meaningful selector names
- Use CSS custom properties (--black: #0a0a0a, --white: #f5f5f5, --light-gray: #b0b0b0) for color consistency
- Follow pattern: Media queries at bottom of relevant rule blocks

**New Asset Image:**
- Location: Place in `assets/` directory with descriptive naming
- Reference: Use relative path `assets/{filename}` in HTML img src
- Update: If brand logo, add to brand-logos section in index.html (~line 82)

## Special Directories

**.planning/:**
- Purpose: Store analysis documents for code planning system
- Generated: Yes (created by automated GSD mapper)
- Committed: Yes (stored in git, tracked by version control)
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md (as applicable)

**.git/:**
- Purpose: Version control directory
- Generated: Yes (git init)
- Committed: N/A (git internal)

**node_modules/ (not present):**
- Purpose: Would contain npm-installed dependencies
- Generated: Yes (npm install)
- Committed: No (listed in .gitignore)

## File Size Reference

**Large files (>10KB):**
- `index.html`: 19.7KB - Main landing page with 22 featured project items
- `script.js`: 18.7KB - All client-side controllers and animations
- `styles.css`: 16.9KB - Global styles with animations and responsive design
- `project-detail.css`: 3.4KB - Project page specific styles

**Standard files (1-5KB):**
- Individual `projects/*.html`: ~4-5KB each
- `server.js`: 0.8KB - Minimal Express configuration

## Code Organization Principles

**Separation of Concerns:**
- Server logic isolated in `server.js` (no client code)
- Client logic isolated in `script.js` (no server code)
- Styling separated by scope: `styles.css` (global), `project-detail.css` (project pages)
- HTML structure pure markup - no inline scripts except minimal setup

**Class-Based Controllers:**
- VideoManager encapsulates all video playback logic
- InfiniteScroll encapsulates pagination logic
- Each class has single responsibility

**Functional Utilities:**
- Pure functions for initialization (initSmoothScroll, initScrollAnimations, etc.)
- Event delegation pattern for dynamic content (unmute buttons)
- IntersectionObserver pattern for scroll animations

**DOM Query Efficiency:**
- Selectors stored in variables to avoid repeated queries
- forEach loops used for batch operations
- Event delegation for grid items instead of individual listeners

---

*Structure analysis: 2026-03-30*
