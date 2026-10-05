const http = require('http');
const fs = require('fs');

const html = fs.readFileSync('projects/_test_project.html', 'utf8');

const urls = [];
const linkHrefs = [...html.matchAll(/<link\s+[^>]*href=["']([^"']+)["']/gi)].map(m => m[1]);
const scriptSrcs = [...html.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/gi)].map(m => m[1]);
const mediaSrcs = [...html.matchAll(/<(?:img|video|iframe|source)\s+[^>]*src=["']([^"']+)["']/gi)].map(m => m[1]);

[...linkHrefs, ...scriptSrcs, ...mediaSrcs].forEach(u => {
  if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return;
  let resolved = u;
  if (u.startsWith('../')) {
    resolved = '/' + u.slice(3);
  } else if (!u.startsWith('/')) {
    resolved = '/projects/' + u;
  }
  urls.push({ original: u, resolved });
});

console.log(`Checking ${urls.length} internal assets in _test_project.html...`);

let completed = 0;
let failed = 0;

urls.forEach(({ original, resolved }) => {
  const req = http.get(`http://localhost:8080${resolved}`, res => {
    if (res.statusCode !== 200) {
      console.error(`[FAIL ${res.statusCode}] ${original} -> http://localhost:8080${resolved}`);
      failed++;
    } else {
      console.log(`[OK 200] ${original}`);
    }
    completed++;
    if (completed === urls.length) {
      console.log(`\nAsset check finished. Total: ${urls.length}, Failed: ${failed}`);
    }
  });
  req.on('error', err => {
    console.error(`[ERROR] ${original}:`, err.message);
    failed++;
    completed++;
  });
});
