# Project Documentation — Mohammed Marzouq Portfolio

> **Internal Reference & Architecture Guide**  
> **Notice:** This documentation is maintained separately from `README.md`. Because this repository is a public GitHub project governed by a strict proprietary license preventing cloning, templating, and redistribution, `README.md` is reserved exclusively for the public copyright notice and visitor contact information.

---

## 1. Executive Summary

- **Project Name:** Mohammed Marzouq Portfolio
- **Owner / Author:** Mohammed Marzouq ([@alsharefee](https://github.com/alsharefee))
- **Live URL:** [https://alsharefee.github.io/portfolio/](https://alsharefee.github.io/portfolio/)
- **Repository:** [https://github.com/alsharefee/portfolio](https://github.com/alsharefee/portfolio)
- **Primary Domain:** Senior Software Engineer specializing in Unity (C#), Unreal Engine (C++/Blueprints), XR (VR/AR), Real-Time Simulation, and Enterprise Low-Code (Mendix).
- **Hosting Platform:** GitHub Pages (static web deployment directly from the root repository).

This project is a high-performance, responsive personal portfolio website showcasing 10+ years of professional engineering work across 26 projects, hackathons, open-source contributions, technical writing, and industry recommendations.

---

## 2. Architecture & Design Principles

### 2.1 Zero-Framework Runtime
The client-facing application is delivered with **zero runtime JavaScript frameworks** (no React, Vue, or Angular) and **zero runtime CSS frameworks** (no Tailwind CSS dependency at serve time). 
- **Pure Semantic HTML5:** Fast initial render, high SEO visibility, clean document outline.
- **Modern Vanilla CSS3:** Uses CSS Custom Properties (tokens), CSS Grid, Flexbox, viewport units (`clamp()`), and `@media (prefers-reduced-motion)` queries.
- **Modern Vanilla ES6+ JavaScript:** Modular scripts handling UI state, filtering, observers, keyboard shortcuts, and modals without heavy external libraries.

### 2.2 Editorial Engineer Aesthetic
The visual design language is based on the "Editorial Engineer" concept:
- **Color Palette:**
  - Base Background: `#0e0e0c` (deep warm off-black)
  - Card & Surface: `#161614` / `#1c1c19` (elevated tonal charcoal)
  - Primary Typography: `#f0ede4` (warm paper white)
  - Muted Typography & Borders: `#8a867c` / `rgba(240, 237, 228, 0.1)`
  - Accent / Brand Highlight: `#c6f432` (high-voltage neon lime)
- **Typography:**
  - Headings: [Archivo](https://fonts.google.com/specimen/Archivo) (condensed variable width at `font-stretch: 62%`, weight 800, uppercase).
  - Body & Prose: [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) (clean, high-density editorial legibility).
  - Data / Badges / Code: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (monospace technical telemetry).
- **Visual Polish:**
  - Custom SVG film-grain overlay for texture.
  - Interactive cursor-following media preview hovercard for project rows and articles.
  - Smooth micro-interactions and scroll-triggered animations.

### 2.3 Data-Driven Build Pipeline
Instead of manually synchronizing 26 project cards, filters, and individual showcase pages:
- Project data is maintained as structured JSON in [`redesign/projects.json`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/redesign/projects.json).
- Native Node.js scripts compile the data into [`index.html`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/index.html) and all 26 pages under [`projects/`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/projects).
- An automated validation suite ([`redesign/validate_all_projects.js`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/redesign/validate_all_projects.js)) verifies asset integrity, HTML tag balancing, and pagination consistency before release.

---

## 3. Directory Structure & File Map

```text
portfolio/
├── Assets/                                # Media assets & static collateral
│   ├── ArticlesThumbnails/                # Thumbnails for technical articles
│   ├── AwardsAndRecognitionsImages/       # Hackathon & award photos
│   ├── MyImage/                           # Profile photography
│   ├── OpenSourceWorkThumbnails/          # GitHub project preview images
│   ├── ProjectsAssets/                    # In-depth screenshots & diagrams
│   ├── ProjectsPosters/                   # Video poster fallback frames
│   └── ProjectsThumbnails/                # High-res GIFs & images for cards
├── css/
│   ├── home.css                           # Homepage design tokens, layout & animations
│   └── project.css                        # Project detail page styles & legacy compatibility
├── js/
│   ├── consent.js                         # Google Consent Mode v2 & GDPR cookie controller
│   ├── home.js                            # Homepage interactive behavior & filters
│   └── project.js                         # Project page lightbox, keyboard navigation & observers
├── projects/                              # 26 standalone project detail pages
│   ├── project-2d-platform-game.html
│   ├── project-ai-made-game-2d-submarine-simulation.html
│   ├── project-ar-business-card-logo.html
│   ├── ... (23 additional project pages)
│   └── project-vr-sports-simulations.html
├── redesign/                              # Build scripts, data source & QA tooling
│   ├── build_home.js                      # Compiles projects.json + index.template.html -> index.html
│   ├── build_projects.js                  # Standardizes & generates all 26 project pages
│   ├── concept_b_editorial.jpg            # Visual design mockup reference
│   ├── IMPLEMENTATION_PLAN.md             # Detailed engineering audit and roadmap log
│   ├── index.template.html                # Master homepage HTML template with tokens
│   ├── projects.json                      # Single source of truth for all 26 projects
│   ├── serve.js                           # Zero-dependency local Node.js HTTP server
│   └── validate_all_projects.js           # Automated QA and asset integrity checker
├── DOCUMENTATION.md                       # Comprehensive internal project documentation
├── index.html                             # Production homepage (Editorial Engineer theme)
├── LICENSE                                # Proprietary All-Rights-Reserved terms
├── package.json                           # NPM scripts configuration
├── README.md                              # Public repository landing page & legal notice
├── robots.txt                             # Web crawler indexing directives
└── sitemap.xml                            # Search engine XML sitemap
```

---

## 4. Key Subsystems & Implementations

### 4.1 Privacy & Consent Management (`js/consent.js`)
The portfolio implements a strict, GDPR- and ePrivacy-compliant consent workflow with Google Consent Mode v2:
- **Default Denied:** Analytics storage (`analytics_storage`), ad storage, user data, and personalization default to `denied` before any script loads.
- **Local Dev Bypass:** Localhost environments (`localhost`, `127.0.0.1`, `*.local`) automatically suppress GA4 script injection to prevent polluting production analytics.
- **Opt-out Handling:** Supports programmatic opt-out via `?ga_optout=1` query parameter and localStorage `portfolio_ga_consent`.
- **Cookie Sanitization:** When consent is revoked or denied, [`clearGaCookies()`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/js/consent.js#L32-L48) actively removes `_ga` and `_gid` cookies across root and domain variations.
- **Banner UI:** Automatically renders an accessible consent dialog if the user has not made a selection, with explicit "Accept All" and "Reject" buttons.

### 4.2 Homepage Engine (`js/home.js` & `css/home.css`)
[`js/home.js`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/js/home.js) coordinates interactive features on the homepage:
1. **Dynamic Hero Name Fitting:** Measures the container width and adjusts the font size of the `MOHAMMED MARZOUQ` headline dynamically to span full width cleanly without line wrapping.
2. **Scroll Progress & Frosted Nav:** Tracks page scroll depth, updating a 2px lime indicator bar at the top of the viewport and applying a frosted glass backdrop filter to the sticky navigation header.
3. **Multi-Faceted Project Filter:**
   - Filters projects across 7 categories: `VR & Sim`, `AR`, `Mobile`, `2D`, `AI`, `PC`, and `Web`.
   - Supports cross-filtering by specific technology tags (e.g., Unity, C#, Shader Graph, WebGL).
   - Dynamically updates active project count indicators (e.g. `Showing 05 / 26 projects`) and provides a clear/reset action.
4. **Floating Hover Preview:** On desktop viewports, hovering over any project row in the list or article item displays a smooth, floating media preview card that tracks mouse coordinates using requestAnimationFrame.
5. **Battery & Performance Optimization:**
   - `IntersectionObserver` instances automatically pause off-screen autoplaying loop videos.
   - Numbers count-up animation triggers only when the stats grid enters the viewport.
6. **Awards Carousel & Expander:** Provides an interactive expandable story toggle for the Ajax Hackathon win, with an auto-advancing slide carousel that pauses on hover.
7. **Amsterdam Live Clock:** Continuously updates a footer clock synced to the `Europe/Amsterdam` timezone.
8. **Clipboard Email Copy:** Copies `alsharefee@gmail.com` with inline visual tooltip feedback.

### 4.3 Project Detail System (`js/project.js` & `css/project.css`)
Each project in [`projects/`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/projects) is a standalone static document styled with [`css/project.css`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/css/project.css) and wired with [`js/project.js`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/js/project.js):
1. **Cyclic Pagination:** Projects are arranged in reverse chronological order. Every project links directly to its predecessor and successor, looping seamlessly from oldest to newest.
2. **Keyboard Navigation:** Users can navigate between projects using the left and right arrow keys (`ArrowLeft` / `ArrowRight`).
3. **High-Resolution Lightbox:**
   - Clicking any project image opens a full-screen lightbox modal.
   - Supports keyboard dismissal via `Escape`, clicking the close button, or clicking outside the image on the backdrop.
4. **Legacy Compatibility Layer:** [`css/project.css`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/css/project.css) includes a 172-class compatibility layer replicating necessary utilities from Tailwind without loading the multi-megabyte Tailwind runtime.

---

## 5. Project Database & Schema (`redesign/projects.json`)

The canonical project list is defined in [`redesign/projects.json`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/redesign/projects.json). The JSON structure is organized as an array of categories, each containing item records:

```json
[
  {
    "category": "VR & Simulations",
    "items": [
      {
        "href": "projects/project-cassini-hackathon-space-for-water.html",
        "media": {
          "type": "video",
          "src": "Assets/ProjectsThumbnails/water-ezgif.com-video-to-gif-converter.mp4",
          "poster": "Assets/ProjectsPosters/water-poster.jpg"
        },
        "alt": "Space for Water — Satellite Data Visualization",
        "title": "WaterSim — Satellite Data Visualization",
        "year": "2026",
        "desc": "Real-time interactive water simulation leveraging European Space Agency satellite data...",
        "tags": ["Unity", "C#", "Compute Shaders", "Satellite Data", "Simulation"],
        "latest": true
      }
    ]
  }
]
```

### Schema Properties:
- `href` *(string)*: Relative path from project root to the HTML page.
- `media.type` *(string: `"img"` | `"video"`)*: Visual medium type.
- `media.src` *(string)*: Relative path to thumbnail video or image.
- `media.poster` *(string, optional)*: Fallback image for video thumbnails.
- `alt` *(string)*: Accessible alt text for images.
- `title` *(string)*: Display title of the project.
- `year` *(string)*: 4-digit production year (used for chronological sorting).
- `desc` *(string)*: Concise summary shown on cards and list rows.
- `tags` *(array of strings)*: Technical stack badges and filter keywords.
- `latest` *(boolean, optional)*: Flags the project with the `LATEST` badge.

---

## 6. Development & Maintenance Workflows

### 6.1 Prerequisites
- **Node.js** (v16.0 or higher recommended).
- No external global packages or build tools are needed.

### 6.2 Running Locally
To run the local preview server:
```powershell
npm start
```
*Equivalent command:* `node redesign/serve.js`

This starts an HTTP server at `http://localhost:8088/` with proper MIME type handling for videos, images, fonts, and HTML documents. Localhost automatically bypasses Google Analytics.

### 6.3 Validating the Project (QA Test Suite)
To run the automated validation suite:
```powershell
npm test
```
*Equivalent command:* `node redesign/validate_all_projects.js`

The QA script checks:
- **Zero Legacy References:** Asserts that no pages reference `tailwind.css`, `styles.css`, or `main.js`.
- **Styles & Scripts Check:** Confirms all 26 pages import `project.css` and `project.js`.
- **Character Encoding:** Scans for mojibake or corrupt UTF-8 sequences (e.g. `Ã`, `?????`).
- **DOM Balance:** Verifies that all opening `<div\b[^>]*>` tags match closing `</div>` tags.
- **Media Asset Resolution:** Confirms that 100% of referenced image/video paths exist on disk.
- **Pagination Integrity:** Confirms previous and next links match the cyclic order in `projects.json`.
- **Heading Semantics:** Confirms presence of properly structured `.project-title` H1 tags.

### 6.4 Adding or Modifying a Project
When adding a new project or updating an existing one:
1. **Add Assets:** Place screenshots, videos, and thumbnails in `Assets/ProjectsThumbnails/` and `Assets/ProjectsAssets/`.
2. **Update Data:** Add or update the entry in [`redesign/projects.json`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/redesign/projects.json).
3. **Rebuild Homepage:**
   ```powershell
   node redesign/build_home.js
   ```
4. **Rebuild or Create Project Detail Page:**
   - If adding a new page, create `projects/project-my-new-project.html` following the standard template structure.
   - Run the project generator to update pagination across all pages:
     ```powershell
     node redesign/build_projects.js
     ```
5. **Update Sitemap:** If a new page was added, append the new URL to [`sitemap.xml`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/sitemap.xml).
6. **Verify:** Run `npm test` to confirm zero errors.

---

## 7. SEO, Social & Search Architecture

- **Structured Data (JSON-LD):** Implements `Person` schema in [`index.html`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/index.html) including `name`, `jobTitle`, `sameAs` (LinkedIn, GitHub, ArtStation, YouTube, X), and professional summary.
- **Open Graph & Twitter Cards:** Complete `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `twitter:title`, and `twitter:image` tags configured for rich link previews.
- **Robots & Sitemap:** [`robots.txt`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/robots.txt) enables crawling for all user-agents and points to [`sitemap.xml`](file:///c:/Users/alsha/Documents/First%20Party%20Projects/portfolio/sitemap.xml), which enumerates the homepage and all 26 project pages with update frequencies and priorities.
- **Security & Integrity:** External outbound links enforce `rel="noopener noreferrer"`. Inline scripts avoid unsafe evals.

---

## 8. Deployment & Hosting

- **Deployment Model:** Continuous deployment via Git push to GitHub repository `alsharefee/portfolio` on the default branch (`main` / `master`).
- **Serving Mechanism:** GitHub Pages serves files directly from the root directory.
- **Cache Invalidation:** Static CSS and JS files can use query version strings if aggressive CDN caching requires cache-busting during frequent updates.
