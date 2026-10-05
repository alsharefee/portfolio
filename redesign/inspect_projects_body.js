const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const classes = new Set();
projects.forEach(cat => cat.items.forEach(p => {
  const content = fs.readFileSync(p.href, 'utf8');
  const matches = [...content.matchAll(/class=["']([^"']+)["']/g)];
  matches.forEach(m => m[1].split(/\s+/).forEach(c => {
    if (c.includes('blue') || c.includes('btn') || c.includes('shadow') || c.includes('gradient') || c.includes('hover') || c.includes('bg-')) {
      classes.add(c);
    }
  }));
}));
console.log('Special classes found:', [...classes].sort());
