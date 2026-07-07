const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, 'apps', 'web', 'src', 'app', 'pembuat-kerja');

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

if (!fs.existsSync(targetDir)) {
  console.error(`Directory not found: ${targetDir}`);
  process.exit(1);
}

const files = walk(targetDir);
console.log(`Found ${files.length} files to scan in pembuat-kerja.`);

const regex = /text-\[(8|8\.5|9|9\.5|10|10\.5|11|11\.5)px\]/g;
let totalReplaced = 0;
let filesUpdated = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let matchCount = 0;
  
  // Count matches
  const matches = content.match(regex);
  if (matches) {
    matchCount = matches.length;
    content = content.replace(regex, 'text-[12px]');
    fs.writeFileSync(file, content, 'utf8');
    totalReplaced += matchCount;
    filesUpdated++;
    console.log(`Updated: ${path.relative(targetDir, file)} - replaced ${matchCount} occurrence(s)`);
  }
});

console.log(`Finished. Updated ${filesUpdated} files with total ${totalReplaced} replacements.`);
