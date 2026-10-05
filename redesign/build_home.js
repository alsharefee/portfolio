// Builds the redesigned homepage: fills redesign/index.template.html with
// data from redesign/projects.json and writes ../index.html.
// Usage: node redesign/build_home.js
const fs = require('fs');
const path = require('path');

const here = __dirname;
const template = fs.readFileSync(path.join(here, 'index.template.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(here, 'projects.json'), 'utf8'));
const outFile = path.join(here, '..', 'index.html');

const CATS = {
    'VR & Simulations': { slug: 'vr', label: 'VR & Sim' },
    'Augmented Reality': { slug: 'ar', label: 'AR' },
    'Mobile Games': { slug: 'mobile', label: 'Mobile' },
    '2D Games': { slug: '2d', label: '2D' },
    'AI': { slug: 'ai', label: 'AI' },
    'PC Games': { slug: 'pc', label: 'PC' },
    'Web-Based Games': { slug: 'web', label: 'Web' },
};

const FEATURED = [
    'projects/project-untitled-mecha-project-vr-mech-multiplayer-game.html',
    'projects/project-cassini-hackathon-space-for-water.html',
    'projects/project-snipers-ground-vr-multiplayer-sniping-game.html',
];

const esc = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fixText = s => String(s)
    .replace(/([.?!🤖])([A-Z])/gu, '$1 $2')
    .replace(/AR Business Car Logo/g, 'AR Business Card Logo')
    .replace(/expeirence/g, 'experience');
const safePath = p => encodeURI(decodeURI(p));
const tagKey = t => t.toLowerCase();
const pad = n => String(n).padStart(2, '0');

// Flatten + clean
const projects = [];
for (const group of data) {
    const cat = CATS[group.category];
    if (!cat) throw new Error(`Unknown category: ${group.category}`);
    for (const p of group.items) {
        projects.push({
            ...p,
            title: fixText(p.title),
            desc: fixText(p.desc),
            alt: p.alt ? fixText(p.alt) : fixText(p.title),
            src: safePath(p.media.src),
            type: p.media.type === 'video' ? 'video' : 'img',
            category: group.category,
            cat,
        });
    }
}

// Featured
const featured = FEATURED.map((href, i) => {
    const p = projects.find(x => x.href === href);
    if (!p) throw new Error(`Featured project not found: ${href}`);
    const media = p.type === 'video'
        ? `<video src="${p.src}" autoplay muted loop playsinline preload="metadata" data-autoplay aria-hidden="true"></video>`
        : `<img src="${p.src}" alt="${esc(p.alt)}" loading="lazy">`;
    return `<article class="feat reveal${i ? ` d${i}` : ''}">
                    <div class="feat-media">
                        ${p.latest ? '<span class="feat-badge mono">Latest</span>\n                        ' : ''}<span class="feat-num mono">F/${pad(i + 1)}</span>
                        ${media}
                    </div>
                    <div class="feat-body">
                        <h3 class="feat-title display"><a class="stretch" href="${esc(p.href)}">${esc(p.title)}</a></h3>
                        <span class="feat-year mono">${esc(p.year)}</span>
                        <p class="feat-desc">${esc(p.desc)}</p>
                    </div>
                </article>`;
}).join('\n                ');

// Category chips
const catCounts = {};
projects.forEach(p => { catCounts[p.cat.slug] = (catCounts[p.cat.slug] || 0) + 1; });
const categoryChips = [
    `<button class="chip" type="button" data-filter-cat="all" aria-pressed="true">All <span class="count">${projects.length}</span></button>`,
    ...Object.values(CATS)
        .filter(c => catCounts[c.slug])
        .map(c => `<button class="chip" type="button" data-filter-cat="${c.slug}" aria-pressed="false">${esc(c.label)} <span class="count">${catCounts[c.slug]}</span></button>`),
].join('\n                        ');

// Tag chips
const tagMap = new Map();
projects.forEach(p => p.tags.forEach(t => {
    const k = tagKey(t);
    if (!tagMap.has(k)) tagMap.set(k, { label: t, count: 0 });
    tagMap.get(k).count++;
}));
const tagChips = [...tagMap.entries()]
    .sort((a, b) => a[1].label.localeCompare(b[1].label, 'en', { sensitivity: 'base' }))
    .map(([k, v]) => `<button class="chip" type="button" data-filter-tag="${esc(k)}" aria-pressed="false">${esc(v.label)} <span class="count">${v.count}</span></button>`)
    .join('\n                        ');

// Rows
const rows = projects.map((p, i) => {
    const thumb = p.type === 'video'
        ? `<video data-src="${p.src}" muted loop playsinline preload="none"></video>`
        : `<img data-src="${p.src}" alt="">`;
    const tags = p.tags.map(t =>
        `<button class="tag" type="button" data-tag="${esc(tagKey(t))}" aria-label="Filter by ${esc(t)}">${esc(t)}</button>`
    ).join('');
    return `<li class="row" data-cat="${p.cat.slug}" data-tags="${esc(p.tags.map(tagKey).join('|'))}" data-preview="${p.src}" data-preview-type="${p.type}">
                    <span class="row-idx mono">${pad(i + 1)}</span>
                    <div class="row-thumb" aria-hidden="true">${thumb}</div>
                    <h3 class="row-title"><a class="stretch" href="${esc(p.href)}">${esc(p.title)}</a></h3>
                    <div class="row-meta">
                        <span class="row-cat mono">${esc(p.category)}</span>
                        <div class="row-tags">${tags}</div>
                    </div>
                    <span class="row-year">${esc(p.year)}</span>
                    <span class="row-arrow" aria-hidden="true">↗</span>
                </li>`;
}).join('\n                ');

const years = projects.map(p => parseInt(p.year, 10)).filter(Boolean);
const yearRange = `${Math.min(...years)}—${Math.max(...years)}`;

const html = template
    .replaceAll('@@PROJECT_COUNT@@', String(projects.length))
    .replaceAll('@@YEAR_RANGE@@', yearRange)
    .replace('@@FEATURED@@', featured)
    .replace('@@CATEGORY_CHIPS@@', categoryChips)
    .replace('@@TAG_CHIPS@@', tagChips)
    .replace('@@ROWS@@', rows);

if (html.includes('@@')) throw new Error('Unfilled placeholder left in output');
fs.writeFileSync(outFile, html);
console.log(`Wrote ${outFile}\n  ${projects.length} projects, ${tagMap.size} tags, years ${yearRange}`);
