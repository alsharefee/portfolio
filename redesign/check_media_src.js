const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const list = [];
projects.forEach(cat => cat.items.forEach(item => list.push({ ...item, category: cat.category })));

list.forEach(p => {
  const content = fs.readFileSync(p.href, 'utf8');
  // check src attributes with unencoded spaces
  const unencodedSpaces = [...content.matchAll(/src=["']([^"']*\s[^"']*)["']/g)];
  if (unencodedSpaces.length) {
    console.log(p.href, 'has unencoded spaces in src:');
    unencodedSpaces.forEach(m => console.log('   ', m[1]));
  }
});
console.log('Done checking media src attributes.');
