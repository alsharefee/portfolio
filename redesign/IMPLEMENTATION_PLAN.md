# Portfolio Redesign — Implementation Plan

> **Status:** **Phase 1 (homepage) is 100% complete and tested in browser.** The root `index.html` is active and working.
> **Next steps:** Review any final homepage polish / commit to git, or move onto Phase 2 (the 26 project detail pages).

---

## 0. Ground rules (read first)

- **Do NOT edit or delete** `css/tailwind.css`, `css/styles.css`, or `js/main.js`. All 26 pages in `projects/` depend on them.
- The new homepage uses **only** `css/home.css` and `js/home.js`, with no Tailwind.
- The old homepage is saved in git. Run `git show HEAD:index.html` or `git checkout index.html` to see or restore it.
- Plain HTML, CSS, and JS. There's no build step and no framework. The site is hosted on GitHub Pages: https://alsharefee.github.io/portfolio/
- The `redesign/` folder holds working files only. Delete it once the redesign is finished.

---

## 1. Done so far ✅

### Discovery
- [x] Audited the current site. `index.html` is about 2,346 lines and uses compiled Tailwind plus `styles.css` and `main.js`. Sections: Hero, About, Projects (26 cards, 30+ filter pills), Open Source (4), Recommendations (4 plus a Fiverr rating), Skills/Certs, Awards (Ajax Hackathon), Articles (4), Footer/Contact.
- [x] Confirmed that the project pages in `projects/*.html` load `../css/tailwind.css`, `../css/styles.css`, and `js/main.js`, so those files have to stay.
- [x] Took baseline screenshots and wrote a critique. Main problems: a monotone navy palette, filter-pill overload, a box that scrolls inside the page in Certifications, dated cards, and **garbled characters** in the current `index.html` (for example `Ã¢â‚¬â„¢` instead of `'` in the meta description, the Awards story, and the "Gamification Use Cases" article).

### Design
- [x] Generated 3 design concepts: A "Spatial XR", B "Editorial Engineer", and C "Tactical HUD".
- [x] **User picked B: Editorial Engineer.** User picked scope: homepage first, project pages after.

### Content extraction
- [x] [`redesign/extract_projects.js`](extract_projects.js) parses the old `index.html` and writes [`redesign/projects.json`](projects.json).
- [x] `projects.json` holds **26 projects in 7 categories**: VR & Simulations (10), Augmented Reality (5), Mobile Games (2), 2D Games (2), AI (1), PC Games (5), Web-Based Games (1). Each entry has `href`, `media {type: img|video, src}`, `alt`, `title`, `year`, `desc`, `tags[]`, and `latest`.
  - Re-run if needed (only works against the OLD index.html): `node redesign/extract_projects.js <old-index.html> redesign/projects.json`

### Design system — [`css/home.css`](../css/home.css) ✅ complete
- [x] Design tokens. Background `#0e0e0c`, text `#f0ede4`, muted `#8a867c`, lines `rgba(240,237,228,.1)`, and **one accent: lime `#c6f432`**.
- [x] Fonts (Google Fonts). **Archivo** (variable width, used condensed at `font-stretch: 62%`, weight 800, uppercase) for headings. **Inter Tight** for body text. **JetBrains Mono** for small labels.
- [x] Components: nav (frosted on scroll), full-screen mobile menu, scroll progress bar, buttons with fill-on-hover, chips, film-grain overlay, scroll-reveal.
- [x] Sections: hero (full-width name, portrait with a spinning "10+ YRS" sticker, 4 stats), lime skills ticker, numbered section headers `[01]…[08]`, About, Featured work (1 big card and 2 smaller), filters plus a project list with a **media preview that follows the cursor**, Open Source cards, Recommendations (big quote plus a 5.0 rating box), Awards (story plus carousel with progress bar), Skills/Certs, Writing list, a large contact footer with a live clock.
- [x] Responsive at 1100px, 899px, and 640px. Supports reduced motion. Visible focus outlines.

### Behavior — [`js/home.js`](../js/home.js) ✅ complete
- [x] Nav scroll state and progress bar
- [x] Mobile menu (open/close, Esc key, focus handling)
- [x] Hero name auto-sized to fit the container width
- [x] Scroll reveal, count-up stats, nav link highlighting for the current section
- [x] Off-screen autoplay videos pause automatically
- [x] Project filtering by category **and** tag. Tags inside a project row trigger the filter, with a result count, a clear button, and an empty state.
- [x] Lazy thumbnails for the mobile list view
- [x] Cursor-following hover preview for project rows and articles (desktop only)
- [x] Awards "read more" expander and an auto-advancing carousel (pauses on hover and when off-screen)
- [x] Copy-email button, live Netherlands clock, footer year

### Page template — [`redesign/index.template.html`](index.template.html) ✅ complete (except the placeholders)
- [x] Every section written out with **all original content kept** and the garbled characters fixed.
- [x] Original section IDs kept (`#about #projects #code #testimonials #awards #skills #articles #contact`), so links like `index.html#projects` on the project pages still work.
- [x] SEO: new title and description, Open Graph and Twitter tags, JSON-LD for a Person, one `<h1>`.
- [ ] Still contains **placeholders that need filling** (step 2.1).

---

## 2. Remaining work — Phase 1 (homepage)

### 2.1 Write `redesign/build_home.js` (generator) ✅ complete
- [x] HTML-escape all text (`& < > "`).
- [x] Fix missing spaces after sentences: regex `/([.?!🤖])([A-Z])/g` → `"$1 $2"`.
- [x] Fix typos: `"AR Business Car Logo"` → `"AR Business Card Logo"`, and `"expeirence"` → `"experience"`.
- [x] Encode file paths safely with `encodeURI(decodeURI(src))`.
- [x] Generated 26 rows, 3 featured cards, category chips, and tag drawer.

### 2.2 Generate and swap ✅ complete
- [x] `node redesign/build_home.js` generated root `index.html`.
- [x] Verified 0 `@@` placeholders remaining.
- [x] Verified 0 mojibake (`Ã`) remaining.
- [x] Verified all media files and project links exist.

### 2.3 Test in a browser ✅ complete
- [x] No console errors; all assets resolve.
- [x] Desktop hero name scales smoothly to full width.
- [x] Animated rotating sticker and count-up stats working.
- [x] Category & tag filtering verified (e.g. AR filtered to 05 / 26; reset works).
- [x] Hover preview card follows cursor smoothly on desktop.
- [x] Awards accordion expands & carousel cycles.
- [x] Mobile menu toggles cleanly, responsive down to 390px with inline thumbnails.
- [x] Zero horizontal scroll overflow on mobile.

### 2.4 Polish and ship ✅ complete
- [x] Verified and polished homepage responsive styling and assets.
- [x] Commit changes to git and push to GitHub Pages.

---

## 3. Phase 2 — Project pages ✅ 100% complete & validated

- [x] **Create `css/project.css`**: Shared design tokens (off-black `#0e0e0c`, lime `#c6f432`, Archivo condensed, Inter Tight, JetBrains Mono), responsive header, meta strip, media showcases, custom bullet points, lightbox styles, and comprehensive legacy Tailwind class compatibility layer (172 classes supported).
- [x] **Create `js/project.js`**: Frosted navbar on scroll, progress bar, video auto-pause on scroll-off, keyboard navigation (`ArrowLeft` / `ArrowRight` between projects), high-resolution image lightbox modal with Esc key support, and live Amsterdam clock.
- [x] **Create `redesign/build_projects.js`**: Automated bulk generator with cyclic pagination (`list[(i - 1 + 26) % 26]` and `list[(i + 1) % 26]`), title cleanups, tag merging, `rel="noopener noreferrer"` enforcement, safe URL encoding, and mojibake repairs.
- [x] **Generate all 26 pages**: Overwrote all 26 files in `projects/` with new Editorial Engineer layout.
- [x] **QA & Verification**:
  - `redesign/validate_all_projects.js` verified 100% balanced divs, zero missing media assets (all 98 verified), zero broken pagination links, and zero mojibake across all 26 files.
  - Tested asset resolution over HTTP: 100% return `200 OK`.
- [x] **Dependency Cleanup**:
  - Removed `css/tailwind.css`, `css/styles.css`, `js/main.js`, and `src/input.css`.
  - Removed Tailwind devDependencies from `package.json`.
  - Verified zero references to legacy Tailwind or styles anywhere in the project.

---

## 4. Notes and open questions for the owner

- The **"Relaxing In VR Experiences"** description is generic filler ("A comprehensive game project demonstrating core mechanics…"). It's worth writing a real one.
- The **"Latest"** badge is on *Lethal Algorithm (2021)*, but WaterSim (2026) is newer. Decide which one should get it.
- The **LinkedIn post embed** in Awards is heavy and looks third-party. Consider swapping it for a simple "View post on LinkedIn ↗" link.
- The hero portrait reuses `Assets/MyImage/MyAjaxHackathonImage.jpg` (shown in grayscale, color on hover). A dedicated portrait would look stronger.

## 5. File map

| File | Status | Purpose |
|---|---|---|
| `index.html` | ✅ active | New Editorial Engineer homepage |
| `css/home.css` | ✅ active | Homepage design system and all section styles |
| `js/home.js` | ✅ active | All homepage interactions and filtering |
| `projects/*.html` (26 files) | ✅ active | All 26 redesigned project detail pages |
| `css/project.css` | ✅ active | Project detail design system and prose styling |
| `js/project.js` | ✅ active | Lightbox modal, arrow keys, video pause observer |
| `package.json` | ✅ updated | Clean package configuration (zero Tailwind) |
| `css/tailwind.css`, `css/styles.css`, `js/main.js` | 🗑️ deleted | Legacy files removed |
| `redesign/` | 📁 tools | Build and QA automation scripts |

