const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const list = [];
projects.forEach(cat => cat.items.forEach(item => list.push({ ...item, category: cat.category })));

list.forEach((p, idx) => {
  const content = fs.readFileSync(p.href, 'utf8');
  const tagsIdx = content.indexOf('<!-- Tags -->');
  const afterTagsComment = content.slice(tagsIdx);
  const firstDivIdx = afterTagsComment.indexOf('<div');
  const divCloseIdx = afterTagsComment.indexOf('</div>', firstDivIdx);
  const contentStart = tagsIdx + divCloseIdx + '</div>'.length;
  const mainEnd = content.indexOf('</main>');
  const body = content.slice(contentStart, mainEnd).trim().replace(/<\/div>\s*<\/div>\s*$/, '').trim();
  
  // Count opening and closing divs
  const opens = (body.match(/<div\b[^>]*>/gi) || []).length;
  const closes = (body.match(/<\/div>/gi) || []).length;
  console.log(`[${idx+1}] ${p.href} | Opens: ${opens}, Closes: ${closes}, Diff: ${opens - closes}`);
});
