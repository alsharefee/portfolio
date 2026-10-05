const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const list = [];
projects.forEach(cat => cat.items.forEach(item => list.push({ ...item, category: cat.category })));

list.forEach(p => {
  const filePath = p.href;
  if (!fs.existsSync(filePath)) {
    console.error('Missing:', filePath);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    console.error('No main in:', filePath);
    return;
  }
  const main = mainMatch[1];
  
  const tagsEnd = main.indexOf('<!-- Media Section -->');
  const proseStart = main.indexOf('<!-- Description -->');
  
  let mediaHtml = '';
  if (tagsEnd !== -1 && proseStart !== -1) {
    mediaHtml = main.slice(tagsEnd + '<!-- Media Section -->'.length, proseStart).trim();
  }
  
  let proseHtml = '';
  if (proseStart !== -1) {
    const afterDesc = main.slice(proseStart + '<!-- Description -->'.length);
    const proseOpen = afterDesc.indexOf('>');
    // remove trailing container closing divs
    const raw = afterDesc.slice(proseOpen + 1).trim();
    proseHtml = raw.replace(/<\/div>\s*<\/div>\s*$/, '').trim();
  }
  
  console.log(filePath, '| media len:', mediaHtml.length, '| prose len:', proseHtml.length);
});
