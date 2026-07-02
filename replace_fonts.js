const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, 'apps', 'web', 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css') || file.endsWith('.js')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk(targetDir);
console.log(`Found ${files.length} files to scan.`);

let count9 = 0;
let count11 = 0;
let count11_5 = 0;
let count8_5 = 0;
let count7 = 0;
let count9_5 = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('text-[9px]')) {
    content = content.replace(/text-\[9px\]/g, 'text-[10px]');
    count9++;
    changed = true;
  }
  if (content.includes('text-[11px]')) {
    content = content.replace(/text-\[11px\]/g, 'text-[12px]');
    count11++;
    changed = true;
  }
  if (content.includes('text-[11.5px]')) {
    content = content.replace(/text-\[11.5px\]/g, 'text-[12px]');
    count11_5++;
    changed = true;
  }
  if (content.includes('text-[8.5px]')) {
    content = content.replace(/text-\[8.5px\]/g, 'text-[8px]');
    count8_5++;
    changed = true;
  }
  if (content.includes('text-[7px]')) {
    content = content.replace(/text-\[7px\]/g, 'text-[8px]');
    count7++;
    changed = true;
  }
  if (content.includes('text-[9.5px]')) {
    content = content.replace(/text-\[9.5px\]/g, 'text-[10px]');
    count9_5++;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.relative(targetDir, file)}`);
  }
});

console.log(`Finished. Updated 9px->10px (${count9}), 11px->12px (${count11}), 11.5px->12px (${count11_5}), 8.5px->8px (${count8_5}), 7px->8px (${count7}), 9.5px->10px (${count9_5}).`);
