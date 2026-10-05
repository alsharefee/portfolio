const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const list = [];
projects.forEach(cat => cat.items.forEach(item => list.push({ ...item, category: cat.category })));

list.forEach(p => {
  const content = fs.readFileSync(p.href, 'utf8');
  // replace all href="..." and src="..."
  const stripped = content.replace(/(href|src)=["'][^"']+["']/g, '');
  const matches = stripped.match(/https?:\/\/[^\s<"']+/g);
  if (matches) {
    console.log(p.href, 'has unlinked URLs:');
    matches.forEach(m => console.log('   ', m));
  }
});
