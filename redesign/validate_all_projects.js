const fs = require('fs');
const path = require('path');

const projectsData = JSON.parse(fs.readFileSync('redesign/projects.json', 'utf8'));
const list = [];
projectsData.forEach(cat => cat.items.forEach(item => list.push({ ...item, category: cat.category })));

let totalErrors = 0;

console.log('--- Starting Comprehensive QA on All 26 Project Pages ---');

list.forEach((p, idx) => {
  const filePath = p.href;
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File missing: ${filePath}`);
    totalErrors++;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Check legacy references
  if (content.includes('tailwind.css') || content.includes('styles.css') || content.includes('../js/main.js')) {
    console.error(`[ERROR in ${filePath}] Contains legacy CSS/JS references!`);
    totalErrors++;
  }

  // Check project.css and project.js presence
  if (!content.includes('../css/project.css') || !content.includes('../js/project.js')) {
    console.error(`[ERROR in ${filePath}] Missing project.css or project.js!`);
    totalErrors++;
  }

  // Check mojibake
  if (content.includes('Ã') || content.includes('?????')) {
    console.error(`[ERROR in ${filePath}] Contains mojibake characters!`);
    totalErrors++;
  }

  // Check div balance
  const opens = (content.match(/<div\b[^>]*>/gi) || []).length;
  const closes = (content.match(/<\/div>/gi) || []).length;
  if (opens !== closes) {
    console.error(`[ERROR in ${filePath}] Div tag mismatch! Opens: ${opens}, Closes: ${closes}`);
    totalErrors++;
  }

  // Check media src existence
  const srcs = [...content.matchAll(/<(?:img|video|iframe|source)\s+[^>]*src=["']([^"']+)["']/gi)].map(m => m[1]);
  srcs.forEach(src => {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return;
    const absPath = path.resolve('projects', decodeURI(src));
    if (!fs.existsSync(absPath)) {
      console.error(`[ERROR in ${filePath}] Missing media src: ${src} -> ${absPath}`);
      totalErrors++;
    }
  });

  // Check pagination links
  const prevIdx = (idx - 1 + list.length) % list.length;
  const nextIdx = (idx + 1) % list.length;
  const expectedPrev = path.basename(list[prevIdx].href);
  const expectedNext = path.basename(list[nextIdx].href);

  if (!content.includes(`href="${expectedPrev}"`)) {
    console.error(`[ERROR in ${filePath}] Missing expected prev link: ${expectedPrev}`);
    totalErrors++;
  }
  if (!content.includes(`href="${expectedNext}"`)) {
    console.error(`[ERROR in ${filePath}] Missing expected next link: ${expectedNext}`);
    totalErrors++;
  }

  // Check title & header
  if (!content.includes('<h1 class="project-title display">')) {
    console.error(`[ERROR in ${filePath}] Missing .project-title heading!`);
    totalErrors++;
  }
});

console.log('--- QA Results ---');
if (totalErrors === 0) {
  console.log(`✅ ALL 26 PROJECT PAGES PASSED VALIDATION! ZERO ERRORS.`);
} else {
  console.error(`❌ QA FAILED with ${totalErrors} errors.`);
}
