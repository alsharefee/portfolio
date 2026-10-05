const fs = require('fs');
const path = require('path');

const projectsData = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const list = [];
projectsData.forEach(cat => cat.items.forEach(item => list.push({ ...item, category: cat.category })));

// Sort by year descending (newest first)
list.sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10));

// First, read all bodies from existing files before any file is rewritten
const bodies = new Map();
list.forEach(p => {
  const content = fs.readFileSync(p.href, 'utf8');
  const startMark = '<div class="project-body prose">';
  const endMark = '<!-- Pagination: Previous / Next Project -->';
  const startIdx = content.indexOf(startMark);
  const endIdx = content.indexOf(endMark);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Markers not found in ${p.href}`);
  }
  const body = content.slice(startIdx + startMark.length, endIdx).trim().replace(/<\/div>\s*$/, '').trim();
  bodies.set(p.href, body);
});

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getCleanTitle(p) {
  if (p.href.includes('project-cassini-hackathon-space-for-water.html')) {
    return 'WaterSim — Satellite Data Visualization';
  }
  if (p.title.includes('AR Business Car Logo')) {
    return 'AR Business Card Logo';
  }
  if (p.title.includes('"The" Savior')) {
    return 'The Savior: A Game Jam Game';
  }
  return p.title;
}

function getPrimaryStack(p, tags) {
  const tStr = tags.join(' ').toLowerCase();
  if (tStr.includes('unreal engine')) return 'Unreal Engine · Simulation';
  if (tStr.includes('javascript')) return 'Unity (JS) · Mobile Game';
  if (tStr.includes('dots')) return 'Unity DOTS / ECS (C#)';
  if (tStr.includes('apple arkit') || tStr.includes('easyar') || tStr.includes('vuforia') || tStr.includes('ar')) {
    return 'Unity (C#) · Augmented Reality';
  }
  if (tStr.includes('vr')) return 'Lead Developer · Unity (C#) & VR';
  if (tStr.includes('game jam')) return 'Gameplay Programmer · Unity (C#)';
  if (tStr.includes('unity')) return 'Developer · Unity (C#)';
  return 'Software Engineer';
}

function buildProjectPage(idx) {
  const p = list[idx];
  const prevIdx = (idx - 1 + list.length) % list.length;
  const nextIdx = (idx + 1) % list.length;
  const prev = list[prevIdx];
  const next = list[nextIdx];

  const prevHref = path.basename(prev.href);
  const nextHref = path.basename(next.href);
  const prevTitle = getCleanTitle(prev);
  const nextTitle = getCleanTitle(next);
  const currentTitle = getCleanTitle(p);

  const prevIndexStr = String(prevIdx + 1).padStart(2, '0');
  const nextIndexStr = String(nextIdx + 1).padStart(2, '0');
  const currentIndexStr = String(idx + 1).padStart(2, '0');

  const body = bodies.get(p.href);
  const primaryStack = getPrimaryStack(p, p.tags);

  // Tags HTML
  const tagsHtml = p.tags
    .map(t => `<span class="tag-badge">${escapeHtml(t)}</span>`)
    .join('\n                            ');

  // Open Graph Image
  let ogImage = 'https://alsharefee.github.io/portfolio/Assets/ProjectsThumbnails/m2-res_480p-ezgif.com-optimize.gif';
  if (p.media && p.media.src) {
    ogImage = `https://alsharefee.github.io/portfolio/${encodeURI(decodeURI(p.media.src))}`;
  }

  const pageHtml = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(currentTitle)} | Mohammed Marzouq</title>
    <meta name="description" content="${escapeHtml(p.desc.slice(0, 160))}">
    <meta name="author" content="Mohammed Marzouq">
    <meta name="theme-color" content="#0e0e0c">
    <meta name="color-scheme" content="dark">
    <link rel="canonical" href="https://alsharefee.github.io/portfolio/${p.href}">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeHtml(currentTitle)} | Mohammed Marzouq">
    <meta property="og:description" content="${escapeHtml(p.desc)}">
    <meta property="og:url" content="https://alsharefee.github.io/portfolio/${p.href}">
    <meta property="og:image" content="${ogImage}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(currentTitle)}">
    <meta name="twitter:description" content="${escapeHtml(p.desc.slice(0, 140))}">
    <meta name="twitter:image" content="${ogImage}">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml"
        href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23c6f432'/%3E%3Ctext x='50%25' y='56%25' text-anchor='middle' dominant-baseline='middle' font-family='Arial Narrow,Arial,sans-serif' font-size='34' font-weight='900' fill='%230e0e0c'%3EMM%3C/text%3E%3C/svg%3E">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
    
    <!-- Font Awesome -->
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Project Stylesheet -->
    <link rel="stylesheet" href="../css/project.css">
    <script>document.documentElement.classList.add('js');</script>
</head>

<body>
    <!-- Scroll Progress Bar -->
    <div class="progress" id="progress" aria-hidden="true"></div>

    <!-- Navigation -->
    <nav class="nav" id="nav">
        <div class="container nav-inner">
            <a href="../index.html" class="brand" aria-label="Mohammed Marzouq Home">
                <span class="brand-mark">MM</span>
                <div class="brand-meta mono">
                    <span>INDEX</span>
                    <span class="sep">/</span>
                    <span class="title-trunc">[${currentIndexStr}] ${escapeHtml(currentTitle)}</span>
                </div>
            </a>
            <div class="nav-actions">
                <a href="../index.html#projects" class="back-link">
                    <span class="arrow-left">←</span> Back to Projects
                </a>
                <a href="../index.html#contact" class="btn btn-sm btn-accent">
                    Contact <span class="arrow">↗</span>
                </a>
            </div>
        </div>
    </nav>

    <!-- Main Project Content -->
    <main class="project-main">
        <div class="container">
            <!-- Project Header -->
            <header class="project-header">
                <div class="project-breadcrumbs mono">
                    <a href="../index.html">Mohammed Marzouq</a>
                    <span class="muted">/</span>
                    <a href="../index.html#projects">Projects</a>
                    <span class="muted">/</span>
                    <span class="accent">[INDEX ${currentIndexStr}/26 · ${escapeHtml(p.category.toUpperCase())}]</span>
                </div>

                <h1 class="project-title display">${escapeHtml(currentTitle)}</h1>

                <dl class="project-meta-strip">
                    <div class="meta-item">
                        <dt>TIMELINE</dt>
                        <dd class="mono-val">${escapeHtml(p.year)}</dd>
                    </div>
                    <div class="meta-item">
                        <dt>CATEGORY</dt>
                        <dd>${escapeHtml(p.category)}</dd>
                    </div>
                    <div class="meta-item">
                        <dt>ROLE / STACK</dt>
                        <dd>${escapeHtml(primaryStack)}</dd>
                    </div>
                    <div class="meta-item">
                        <dt>TAGS</dt>
                        <dd>
                            <div class="tags-list">
                                ${tagsHtml}
                            </div>
                        </dd>
                    </div>
                </dl>
            </header>

            <!-- Extracted Body Content -->
            <div class="project-body prose">
                ${body}
            </div>

            <!-- Pagination: Previous / Next Project -->
            <section class="pagination-section" aria-label="Project pagination">
                <div class="pagination-grid">
                    <a href="${prevHref}" class="nav-card prev" id="prev-project-link">
                        <span class="nav-card-label mono"><span class="arrow-left">←</span> Previous Project [${prevIndexStr}]</span>
                        <span class="nav-card-title">${escapeHtml(prevTitle)}</span>
                        <span class="nav-card-year mono">${escapeHtml(prev.year)} · ${escapeHtml(prev.category)}</span>
                    </a>
                    <a href="${nextHref}" class="nav-card next" id="next-project-link">
                        <span class="nav-card-label mono">Next Project [${nextIndexStr}] <span class="arrow-right">→</span></span>
                        <span class="nav-card-title">${escapeHtml(nextTitle)}</span>
                        <span class="nav-card-year mono">${escapeHtml(next.year)} · ${escapeHtml(next.category)}</span>
                    </a>
                </div>
                <div style="text-align: center; margin-top: 36px;">
                    <a href="../index.html#projects" class="back-link">
                        ↑ Return to All 26 Projects
                    </a>
                </div>
            </section>
        </div>
    </main>

    <!-- Footer -->
    <footer class="project-footer">
        <div class="container footer-inner mono">
            <div>&copy; 2026 Mohammed Marzouq. All rights reserved.</div>
            <div>AMSTERDAM, NL · <span data-clock>--:--</span> CET</div>
            <div><a href="../index.html" class="accent">Home ↗</a></div>
        </div>
    </footer>

    <!-- Image Lightbox Modal -->
    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-hidden="true">
        <button class="lightbox-close" id="lightbox-close" aria-label="Close image lightbox">&times;</button>
        <img id="lightbox-img" src="" alt="">
    </div>

    <!-- Interactive Script -->
    <script src="../js/project.js"></script>
</body>

</html>
`;

  return pageHtml;
}

console.log(`Starting generation of ${list.length} project detail pages...`);

let count = 0;
list.forEach((p, idx) => {
  const pageHtml = buildProjectPage(idx);
  fs.writeFileSync(p.href, pageHtml, 'utf8');
  count++;
  console.log(`[${String(count).padStart(2, '0')}/26] Wrote ${p.href} (${pageHtml.length} bytes)`);
});

console.log(`\nSuccessfully generated and updated all ${count} project pages!`);
