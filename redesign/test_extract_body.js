const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const list = [];
projects.forEach(cat => cat.items.forEach(item => list.push({ ...item, category: cat.category })));

list.forEach(p => {
  const filePath = p.href;
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find tags closing div
  const tagsIdx = content.indexOf('<!-- Tags -->');
  if (tagsIdx === -1) {
    console.error('No <!-- Tags --> in:', filePath);
    return;
  }
  
  const afterTagsComment = content.slice(tagsIdx);
  // find first <div ...> and its matching/closing </div>
  const firstDivIdx = afterTagsComment.indexOf('<div');
  const divCloseIdx = afterTagsComment.indexOf('</div>', firstDivIdx);
  
  const contentStart = tagsIdx + divCloseIdx + '</div>'.length;
  const mainEnd = content.indexOf('</main>');
  
  const bodyContent = content.slice(contentStart, mainEnd).trim();
  // remove the trailing </div></div> container closures if present
  const cleaned = bodyContent.replace(/<\/div>\s*<\/div>\s*$/, '').trim();
  
  console.log(filePath, '| length:', cleaned.length, '| first 60 chars:', cleaned.replace(/\s+/g, ' ').slice(0, 60));
});
