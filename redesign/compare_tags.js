const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const list = [];
projects.forEach(cat => cat.items.forEach(item => list.push({ ...item, category: cat.category })));

list.forEach((p, idx) => {
  const content = fs.readFileSync(p.href, 'utf8');
  const tagsIdx = content.indexOf('<!-- Tags -->');
  if (tagsIdx !== -1) {
    const after = content.slice(tagsIdx, tagsIdx + 1000);
    const divMatch = after.match(/<div[^>]*>([\s\S]*?)<\/div>/i);
    if (divMatch) {
      const htmlTags = [...divMatch[1].matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
      console.log(`[${idx+1}] JSON tags (${p.tags.length}):`, p.tags.join(', '));
      console.log(`     HTML tags (${htmlTags.length}):`, htmlTags.join(', '));
    }
  }
});
