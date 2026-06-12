const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/indonesia-regions.json');
const regions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Filter out old Papua and Papua Barat
const otherRegions = regions.filter(r => r.province !== 'Papua' && r.province !== 'Papua Barat' && r.province !== 'Di Yogyakarta');

// Add Yogyakarta with correct capital abbreviation 'DIY'
otherRegions.push({
  province: 'DIY',
  regencies: [
    'Kabupaten Kulon Progo',
    'Kabupaten Bantul',
    'Kabupaten Gunung Kidul',
    'Kabupaten Sleman',
    'Kota Yogyakarta'
  ]
});

// Define the 6 split provinces
const papuaSplit = [
  {
    province: 'Papua',
    regencies: [
      'Kabupaten Jayapura',
      'Kabupaten Biak Numfor',
      'Kabupaten Kepulauan Yapen',
      'Kabupaten Sarmi',
      'Kabupaten Keerom',
      'Kabupaten Waropen',
      'Kabupaten Supiori',
      'Kabupaten Mamberamo Raya',
      'Kota Jayapura'
    ]
  },
  {
    province: 'Papua Barat',
    regencies: [
      'Kabupaten Manokwari',
      'Kabupaten Fakfak',
      'Kabupaten Kaimana',
      'Kabupaten Teluk Wondama',
      'Kabupaten Teluk Bintuni',
      'Kabupaten Manokwari Selatan',
      'Kabupaten Pegunungan Arfak'
    ]
  },
  {
    province: 'Papua Selatan',
    regencies: [
      'Kabupaten Merauke',
      'Kabupaten Boven Digoel',
      'Kabupaten Mappi',
      'Kabupaten Asmat'
    ]
  },
  {
    province: 'Papua Tengah',
    regencies: [
      'Kabupaten Nabire',
      'Kabupaten Paniai',
      'Kabupaten Mimika',
      'Kabupaten Puncak Jaya',
      'Kabupaten Dogiyai',
      'Kabupaten Intan Jaya',
      'Kabupaten Deiyai',
      'Kabupaten Puncak'
    ]
  },
  {
    province: 'Papua Pegunungan',
    regencies: [
      'Kabupaten Jayawijaya',
      'Kabupaten Yahukimo',
      'Kabupaten Pegunungan Bintang',
      'Kabupaten Tolikara',
      'Kabupaten Nduga',
      'Kabupaten Lanny Jaya',
      'Kabupaten Mamberamo Tengah',
      'Kabupaten Yalimo'
    ]
  },
  {
    province: 'Papua Barat Daya',
    regencies: [
      'Kabupaten Sorong',
      'Kabupaten Sorong Selatan',
      'Kabupaten Raja Ampat',
      'Kabupaten Tambrauw',
      'Kabupaten Maybrat',
      'Kota Sorong'
    ]
  }
];

const finalRegions = [...otherRegions, ...papuaSplit];
finalRegions.sort((a, b) => a.province.localeCompare(b.province));

fs.writeFileSync(filePath, JSON.stringify(finalRegions, null, 2), 'utf8');
console.log(`Successfully updated regions JSON. Total provinces: ${finalRegions.length}`);
