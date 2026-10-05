const fs = require('fs');
const path = require('path');
const projects = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const list = [];
projects.forEach(cat => cat.items.forEach(item => list.push({ ...item, category: cat.category })));

let missingCount = 0;
let totalCount = 0;

list.forEach(p => {
  const content = fs.readFileSync(p.href, 'utf8');
  const srcs = [...content.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
  srcs.forEach(src => {
    // skip youtube embed / iframe or http urls
    if (src.startsWith('http://') || src.startsWith('https://')) return;
    totalCount++;
    const decoded = decodeURI(src);
    const absPath = path.resolve(path.dirname(p.href), decoded);
    if (!fs.existsSync(absPath)) {
      console.error(`[MISSING] in ${p.href}: ${src} -> ${absPath}`);
      missingCount++;
    }
  });
});

console.log(`Checked ${totalCount} local media files. Missing: ${missingCount}`);
