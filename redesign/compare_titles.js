const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const list = [];
projects.forEach(cat => cat.items.forEach(item => list.push({ ...item, category: cat.category })));

list.forEach((p, idx) => {
  const content = fs.readFileSync(p.href, 'utf8');
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : 'NO H1';
  console.log(`[${idx+1}] JSON: "${p.title}" | H1: "${h1}"`);
});
