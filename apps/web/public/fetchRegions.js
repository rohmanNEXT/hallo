const fs = require('fs');
const path = require('path');
const https = require('https');

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word === 'dki' || word === 'diy') return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

async function run() {
  try {
    console.log('Fetching provinces from github...');
    const provinces = await getJSON('https://raw.githubusercontent.com/yusufsyaifudin/wilayah-indonesia/master/data/list_of_area/provinces.json');
    console.log(`Found ${provinces.length} provinces.`);

    console.log('Fetching regencies from github...');
    const regencies = await getJSON('https://raw.githubusercontent.com/yusufsyaifudin/wilayah-indonesia/master/data/list_of_area/regencies.json');
    console.log(`Found ${regencies.length} regencies.`);

    // Map of province ID to province name
    const provMap = {};
    for (const p of provinces) {
      provMap[p.id] = toTitleCase(p.name);
    }

    // Group regencies by province ID
    const regencyGroups = {};
    for (const r of regencies) {
      const pId = r.province_id;
      if (!regencyGroups[pId]) {
        regencyGroups[pId] = [];
      }
      regencyGroups[pId].push(toTitleCase(r.name));
    }

    const result = [];
    for (const pId of Object.keys(provMap)) {
      result.push({
        province: provMap[pId],
        regencies: regencyGroups[pId] || []
      });
    }

    // Sort by province name
    result.sort((a, b) => a.province.localeCompare(b.province));

    const outputPath = path.join(__dirname, '../src/lib/indonesia-regions.json');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Successfully compiled and saved ${result.length} provinces to ${outputPath}`);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

run();
