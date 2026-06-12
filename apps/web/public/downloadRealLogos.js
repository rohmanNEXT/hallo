const fs = require('fs');
const https = require('https');
const path = require('path');

const companies = [
  { name: "microsoft", slug: "microsoft" },
  { name: "google", slug: "google" },
  { name: "apple", slug: "apple" },
  { name: "meta", slug: "meta" },
  { name: "spotify", slug: "spotify" },
  { name: "netflix", slug: "netflix" },
  { name: "twitter", slug: "x" },
  { name: "airbnb", slug: "airbnb" },
  { name: "zoom", slug: "zoom" },
  { name: "figma", slug: "figma" },
  { name: "adobe", slug: "adobe" },
  { name: "slack", slug: "slack" },
  { name: "nvidia", slug: "nvidia" },
  { name: "tesla", slug: "tesla" },
  { name: "amazon", slug: "amazon" },
  { name: "intel", slug: "intel" },
  { name: "samsung", slug: "samsung" },
  { name: "tiktok", slug: "tiktok" },
  { name: "grab", slug: "grab" },
  { name: "tokopedia", slug: "tokopedia" },
  { name: "gojek", slug: "gojek" },
  { name: "traveloka", slug: "traveloka" },
  { name: "bukalapak", slug: "bukalapak" },
  { name: "shopee", slug: "shopee" },
  { name: "discord", slug: "discord" },
  { name: "notion", slug: "notion" },
  { name: "roblox", slug: "roblox" },
  { name: "reddit", slug: "reddit" },
  { name: "pinterest", slug: "pinterest" },
  { name: "linkedin", slug: "linkedin" },
  { name: "salesforce", slug: "salesforce" },
  { name: "oracle", slug: "oracle" },
  { name: "canva", slug: "canva" },
  { name: "shopify", slug: "shopify" },
  { name: "stripe", slug: "stripe" },
  { name: "uber", slug: "uber" },
  { name: "github", slug: "github" },
  { name: "gitlab", slug: "gitlab" },
  { name: "coinbase", slug: "coinbase" },
  { name: "binance", slug: "binance" }
];

const dir = path.join(__dirname, 'images', 'companies');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const company of companies) {
    const url = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${company.slug}.svg`;
    const filename = `${company.name}.svg`;
    const filepath = path.join(dir, filename);
    console.log(`Downloading real logo for ${company.name}...`);
    try {
      await download(url, filepath);
      console.log(`Saved ${filename}`);
    } catch (err) {
      console.error(`Failed simple-icons for ${company.name}: ${err.message}. Trying backup Clearbit SVG...`);
      // Fallback: Clearbit offers logo pngs which we can save, but since user requested original SVG icons we can try standard clearbit url or local fallback
      const clearbitUrl = `https://logo.clearbit.com/${company.name}.com`;
      try {
        await download(clearbitUrl, filepath);
        console.log(`Saved ${filename} from Clearbit`);
      } catch (err2) {
        console.error(`Failed all sources for ${company.name}:`, err2.message);
      }
    }
  }
  console.log("All downloads done!");
}

run();
