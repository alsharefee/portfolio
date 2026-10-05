// Extracts project card data from the legacy index.html into JSON.
const fs = require('fs');
const path = process.argv[2];
const html = fs.readFileSync(path, 'utf8');

const start = html.indexOf('<section id="projects"');
const end = html.indexOf('<section id="code"');
const section = html.slice(start, end);

const clean = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// Split into category chunks by <h4
const parts = section.split(/<h4\b/).slice(1);
const out = [];
for (const part of parts) {
  const catMatch = part.match(/<\/i>([\s\S]*?)<\/h4>/);
  const iconMatch = part.match(/class="(fa[sb]? fa-[\w-]+)/);
  const category = catMatch ? clean(catMatch[1]) : 'Unknown';
  // Each card begins with class="reveal bg-slate-800
  const cards = part.split(/<div\s+class="reveal bg-slate-800/).slice(1);
  const items = cards.map(c => {
    const href = (c.match(/href="([^"]+)"/) || [])[1];
    const video = (c.match(/<video[\s\S]*?src="([^"]+)"/) || [])[1];
    const img = (c.match(/<img[\s\S]*?src="([^"]+)"/) || [])[1];
    const yt = (c.match(/data-video-id="([^"]+)"/) || [])[1];
    const alt = (c.match(/alt="([^"]*)"/) || [])[1];
    const title = clean((c.match(/<h3[\s\S]*?>([\s\S]*?)<\/h3>/) || [])[1] || '');
    const year = clean((c.match(/<p class="text-blue-400[^"]*">([\s\S]*?)<\/p>/) || [])[1] || '');
    const desc = clean((c.match(/<p\s+class="text-slate-400[^"]*">([\s\S]*?)<\/p>/) || [])[1] || '');
    const tags = [...c.matchAll(/<span\s+class="text-xs bg-slate-900 text-blue-300[^"]*">([\s\S]*?)<\/span>/g)].map(m => clean(m[1]));
    const latest = /\bLatest\b/.test(c.slice(0, 800));
    return { href, media: video ? { type: 'video', src: video } : yt ? { type: 'youtube', id: yt } : { type: 'img', src: img }, alt, title, year, desc, tags, latest };
  });
  out.push({ category, icon: iconMatch ? iconMatch[1] : null, items });
}
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 2));
console.log(out.map(c => `${c.category}: ${c.items.length}`).join('\n'));
console.log('Total:', out.reduce((a, c) => a + c.items.length, 0));
