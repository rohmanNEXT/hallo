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
  
  // Check if file has <img 
  if (!/<img\b/.test(content)) return;
  
  console.log(`Fixing ${filePath}...`);
  
  // Add import Image from 'next/image' if not present
  if (!/import Image from ['"]next\/image['"]/.test(content)) {
    // Find the last import statement
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLine = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLine + 1) + "import Image from 'next/image';\n" + content.slice(endOfLine + 1);
    } else {
      content = "import Image from 'next/image';\n" + content;
    }
  }
  
  // Replace <img ... /> with <Image width={100} height={100} unoptimized ... />
  content = content.replace(/<img\b([^>]*?)\/?>/g, (match, p1) => {
    // If it already has closing tag inside match, it's captured in p1 possibly, but the regex handles self-closing or not.
    // However, img should be self-closing. 
    // Let's add width, height and unoptimized. 
    // Wait, if it already has width and height, we don't add them.
    let attrs = p1;
    if (!/width=/.test(attrs) && !/fill\b/.test(attrs)) {
      attrs += ' width={100}';
    }
    if (!/height=/.test(attrs) && !/fill\b/.test(attrs)) {
      attrs += ' height={100}';
    }
    attrs += ' unoptimized';
    return `<Image${attrs} />`;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
}

console.log('Ugg mulai perbaiki img jadi Image...');
const srcDir = path.join(__dirname, 'src');
processDirectory(srcDir);
console.log('Ugg selesai!');
