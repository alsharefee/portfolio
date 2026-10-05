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
  let body = content.slice(contentStart, mainEnd).trim();
  
  // In project 13, there was a stray extra </div> before </main>
  if (p.href.includes('project-augmented-reality-app.html')) {
    body = body.replace(/<\/div>\s*<\/div>\s*$/, ''); // strip extra stray div + container div
  } else {
    body = body.replace(/<\/div>\s*$/, ''); // strip only container div
  }
  
  const opens = (body.match(/<div\b[^>]*>/gi) || []).length;
  const closes = (body.match(/<\/div>/gi) || []).length;
  if (opens !== closes) {
    console.error(`[MISMATCH in ${idx+1}] ${p.href} | Opens: ${opens}, Closes: ${closes}, Diff: ${opens - closes}`);
  } else {
    console.log(`[BALANCED ${idx+1}] ${p.href} | Divs: ${opens}`);
  }
});
