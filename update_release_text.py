import os
import glob

# 1. Process index.html
index_file = 'index.html'
with open(index_file, 'r', encoding='utf-8') as f:
    index_content = f.read()

index_content = index_content.replace(
    '<p class="text-blue-400 text-sm font-semibold mb-3">Release Year: 2026</p>',
    '<p class="text-blue-400 text-sm font-semibold mb-3">2026</p>'
)

with open(index_file, 'w', encoding='utf-8') as f:
    f.write(index_content)

# 2. Process project pages
projects_dir = 'projects'
html_files = glob.glob(os.path.join(projects_dir, '*.html'))

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace(
        '<p class="text-blue-400 font-semibold mb-6">Release Year: 2026</p>',
        '<p class="text-blue-400 font-semibold mb-6">Release Date: 2026</p>'
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
            
print("Updated text in cards and project pages successfully!")
