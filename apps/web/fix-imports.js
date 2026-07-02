const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Fix the exact string 'import {\nimport Image from \'next/image\';'
  // Or 'import { \nimport Image ...'
  
  // A regex to find an import block where import Image was inserted right after `import {`
  content = content.replace(/import\s*\{\r?\nimport Image from ['"]next\/image['"];/g, "import Image from 'next/image';\nimport {");
  
  if (content !== originalContent) {
    console.log(`Fixed imports in ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

console.log('Ugg memperbaiki import yang rusak...');
const srcDir = path.join(__dirname, 'src');
processDirectory(srcDir);
console.log('Ugg selesai memperbaiki import!');
