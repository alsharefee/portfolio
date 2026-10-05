const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const list = [];
projects.forEach(cat => cat.items.forEach(item => list.push({ ...item, category: cat.category })));

const allClasses = new Set();
list.forEach(p => {
  const content = fs.readFileSync(p.href, 'utf8');
  const tagsIdx = content.indexOf('<!-- Tags -->');
  const afterTagsComment = content.slice(tagsIdx);
  const firstDivIdx = afterTagsComment.indexOf('<div');
  const divCloseIdx = afterTagsComment.indexOf('</div>', firstDivIdx);
  const contentStart = tagsIdx + divCloseIdx + '</div>'.length;
  const mainEnd = content.indexOf('</main>');
  const body = content.slice(contentStart, mainEnd).trim().replace(/<\/div>\s*<\/div>\s*$/, '').trim();
  
  const matches = [...body.matchAll(/class=["']([^"']+)["']/g)];
  matches.forEach(m => m[1].split(/\s+/).forEach(c => {
    if (c.trim()) allClasses.add(c.trim());
  }));
});

console.log('Total unique classes in extracted body:', allClasses.size);
console.log(JSON.stringify([...allClasses].sort(), null, 2));
