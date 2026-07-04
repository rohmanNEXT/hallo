const fs = require('fs');
const path = require('path');

const companiesFile = path.join(__dirname, '../public/data/companies.json');
const jobsFile = path.join(__dirname, '../public/data/jobs.json');

const companies = JSON.parse(fs.readFileSync(companiesFile, 'utf8'));

// Pools
const benefitPool = [
  "Asuransi Kesehatan Keluarga (Rawat Inap & Jalan)",
  "BPJS Ketenagakerjaan & Kesehatan Terpadu",
  "Tunjangan Hari Raya (THR) & Bonus Kinerja Tahunan",
  "Alokasi Cuti Tahunan 15-20 Hari",
  "Cuti Melahirkan & Ayah Berbayar",
  "Program Kesejahteraan & Kesehatan Mental (Konseling Gratis)",
  "Subsidi Perangkat Kerja (Laptop, Monitor, Kursi Ergonomis)",
  "Subsidi Internet & Transportasi Bulanan",
  "Sistem Kerja Fleksibel (WFA / Hybrid)",
  "Program Pengembangan Karir & Pelatihan Eksternal Berbayar",
  "Tunjangan Makan Siang & Kopi di Kantor",
  "Fasilitas Gym & Kelas Kebugaran",
  "Opsi Kepemilikan Saham Karyawan (ESOP)",
  "Asuransi Jiwa & Santunan Kecelakaan",
  "Pinjaman Karyawan Tanpa Bunga",
  "Bantuan Dana Pendidikan untuk Anak",
  "Program Cuti Sabbatical (Setelah 5 Tahun Bekerja)"
];

const categoryRoles = {
  "Software Engineering": {
    titles: ["Frontend Engineer", "Backend Developer", "Fullstack Engineer", "Mobile App Developer", "DevOps Engineer", "Software Architect", "Quality Assurance Engineer", "Data Engineer"],
    skills: ["React", "Next.js", "Node.js", "TypeScript", "Python", "Go", "AWS", "Docker", "Kubernetes", "SQL", "NoSQL", "Git", "CI/CD", "Testing", "System Design"],
    reqs: [
      "Pengalaman praktis dalam pengembangan perangkat lunak berskala besar yang efisien dan andal.",
      "Pemahaman mendalam tentang struktur data, algoritma, dan pola desain perangkat lunak yang kompleks.",
      "Kemampuan menulis kode yang bersih (clean code), mudah dipelihara, dan terdokumentasi dengan baik.",
      "Keahlian dalam mendiagnosis dan memecahkan masalah teknis (troubleshooting) secara sistematis.",
      "Pengalaman bekerja dalam lingkungan Agile/Scrum dengan kolaborasi lintas tim yang intensif.",
      "Pemahaman kuat mengenai praktik keamanan aplikasi dan optimalisasi performa (performance tuning).",
      "Gelar Sarjana di bidang Ilmu Komputer, Teknik Informatika, atau bidang STEM yang relevan."
    ],
    descTemplates: [
      "Kami sedang mencari seorang {TITLE} yang bersemangat untuk memimpin pengembangan solusi perangkat lunak inovatif. Dalam peran ini, Anda akan bertanggung jawab untuk merancang dan membangun arsitektur yang tangguh, serta memastikan sistem beroperasi dengan performa tinggi. Anda harus memiliki keahlian kuat dalam menggunakan teknologi modern seperti {SKILLS}. Anda akan bekerja berdampingan dengan talenta-talenta terbaik dalam lingkungan kerja yang dinamis. Selain itu, Anda harus memenuhi kualifikasi utama kami, yaitu {REQ}. Sebagai apresiasi atas kontribusi Anda, kami menyediakan berbagai manfaat termasuk {BENEFIT}.",
      "Bergabunglah dengan tim teknologi kami sebagai {TITLE} dan berikan dampak nyata bagi jutaan pengguna. Kami membutuhkan profesional yang dapat mengimplementasikan fitur-fitur kompleks dan menerjemahkan kebutuhan bisnis ke dalam solusi teknis yang elegan. Penguasaan yang baik atas {SKILLS} merupakan sebuah keharusan mutlak. Kami mengharapkan kandidat yang memiliki {REQ}. Mengingat kesejahteraan karyawan adalah prioritas kami, Anda berhak mendapatkan {BENEFIT} sebagai bagian dari kompensasi yang komprehensif.",
      "Kesempatan karir yang luar biasa menanti Anda sebagai {TITLE} di perusahaan kami. Peran ini menuntut tingkat keahlian teknis yang tinggi untuk memelihara dan meningkatkan kualitas sistem inti kami. Anda akan ditantang untuk menerapkan praktik terbaik rekayasa perangkat lunak dengan menggunakan tool terkini, utamanya {SKILLS}. Kandidat ideal wajib memiliki kemampuan luar biasa dalam {REQ}. Bersama kami, Anda tidak hanya akan berkembang secara profesional tetapi juga menikmati fasilitas premium berupa {BENEFIT}."
    ]
  },
  "Product & Design": {
    titles: ["Product Manager", "UI/UX Designer", "Product Owner", "UX Researcher", "Product Designer", "Scrum Master"],
    skills: ["Figma", "Agile", "Scrum", "Wireframing", "Prototyping", "User Research", "Data Analysis", "Jira", "A/B Testing", "Product Strategy", "Design Thinking"],
    reqs: [
      "Pengalaman terbukti dalam mengelola seluruh siklus hidup produk dari ideasi hingga peluncuran komersial.",
      "Kemampuan analitis yang kuat untuk menerjemahkan wawasan pelanggan menjadi spesifikasi fitur yang dapat ditindaklanjuti.",
      "Keahlian dalam menggunakan berbagai alat desain (seperti Figma) dan alat manajemen proyek modern.",
      "Portofolio yang menunjukkan pendekatan pemecahan masalah yang berpusat pada pengguna (user-centric).",
      "Keterampilan komunikasi yang luar biasa untuk berkolaborasi dengan tim engineering, bisnis, dan manajemen tingkat atas.",
      "Pengalaman dalam melakukan riset pengguna dan menerapkan hasil temuan ke dalam peningkatan desain.",
      "Pemahaman yang mendalam mengenai prinsip-prinsip desain antarmuka, aksesibilitas, dan pengalaman pengguna."
    ],
    descTemplates: [
      "Perusahaan kami membuka lowongan untuk posisi {TITLE} yang visioner dan berfokus pada hasil. Tugas utama Anda mencakup penentuan arah strategis produk serta memastikan keselarasan antara tujuan bisnis dan pengalaman pengguna yang optimal. Pengalaman mendalam dengan metodologi dan alat seperti {SKILLS} sangat esensial. Anda juga harus menunjukkan keunggulan dalam hal {REQ}. Untuk mendukung produktivitas dan kesejahteraan Anda, kami menawarkan paket kompensasi yang luar biasa termasuk {BENEFIT}.",
      "Sebagai {TITLE}, Anda akan menjadi penggerak utama di balik inovasi produk-produk unggulan kami. Kami mencari individu yang mampu menjembatani kebutuhan teknis dan estetika, serta menciptakan antarmuka yang intuitif dan elegan. Penguasaan komprehensif terhadap {SKILLS} akan sangat membantu Anda dalam posisi ini. Kriteria utama yang kami cari adalah kandidat yang menguasai {REQ}. Di perusahaan kami, keseimbangan kehidupan kerja sangat dihargai, oleh karena itu kami memberikan fasilitas berupa {BENEFIT}.",
      "Kami mengundang profesional {TITLE} yang berbakat untuk bergabung dengan tim desain dan produk kami yang dinamis. Anda akan memimpin inisiatif riset dan pengembangan yang secara langsung berdampak pada kepuasan pelanggan. Anda diharapkan mahir dalam menerapkan {SKILLS} dalam alur kerja sehari-hari. Kesuksesan di peran ini membutuhkan {REQ}. Sebagai bagian dari komitmen kami terhadap karyawan, kami menjamin Anda akan mendapatkan {BENEFIT}."
    ]
  },
  "Data & Analytics": {
    titles: ["Data Scientist", "Data Analyst", "Machine Learning Engineer", "Business Intelligence Analyst", "Analytics Manager"],
    skills: ["Python", "R", "SQL", "Tableau", "Power BI", "Machine Learning", "Deep Learning", "TensorFlow", "Statistics", "Data Visualization", "Big Data", "Spark"],
    reqs: [
      "Pengalaman yang solid dalam membangun model machine learning, analitik prediktif, atau analisis statistik mendalam.",
      "Kemampuan tingkat lanjut dalam mengelola dan menganalisis kumpulan data berukuran sangat besar (Big Data).",
      "Keahlian dalam menyajikan temuan data kompleks menjadi wawasan bisnis yang mudah dipahami oleh pemangku kepentingan.",
      "Penguasaan bahasa kueri basis data dan alat visualisasi data terkini.",
      "Latar belakang pendidikan yang kuat dalam bidang Statistik, Matematika Terapan, Ilmu Komputer, atau disiplin kuantitatif lainnya.",
      "Pemahaman yang baik mengenai infrastruktur data cloud dan praktik MLOps.",
      "Kemampuan berpikir kritis tingkat tinggi untuk mengidentifikasi anomali, tren, dan peluang optimalisasi bisnis."
    ],
    descTemplates: [
      "Kami mencari seorang {TITLE} berdedikasi untuk membantu kami mengubah data mentah menjadi keputusan bisnis strategis. Peran krusial ini mencakup perancangan model prediktif dan dasbor interaktif yang memberikan wawasan waktu-nyata (real-time). Anda harus ahli dalam memanfaatkan {SKILLS} secara maksimal. Sangat penting bagi pelamar untuk memenuhi syarat utama yaitu {REQ}. Kami percaya bahwa talenta hebat pantas mendapatkan penghargaan terbaik, termasuk {BENEFIT}.",
      "Tingkatkan karir data Anda bersama kami sebagai {TITLE}. Anda akan berkesempatan menangani proyek analitik berskala masif yang menantang batas kemampuan teknis. Keahlian tingkat lanjut dalam ekosistem analitik, terutama {SKILLS}, merupakan keunggulan kompetitif yang kami cari. Kami menginginkan seseorang dengan {REQ}. Menyadari pentingnya kesehatan dan kesejahteraan tim kami, kami menyediakan kompensasi komprehensif seperti {BENEFIT}.",
      "Apakah Anda seorang profesional data yang ahli? Bergabunglah sebagai {TITLE} dan ambil peran penting dalam inisiatif transformasi digital kami. Fokus utama Anda adalah mengoptimalkan algoritma dan menyajikan visualisasi data yang memukau. Syarat mutlak untuk sukses di posisi ini adalah keahlian mendalam pada {SKILLS}. Di samping itu, kandidat yang terpilih wajib memiliki {REQ}. Sebagai mitra kerja jangka panjang, perusahaan kami menjamin Anda menerima berbagai kemudahan dan fasilitas, termasuk {BENEFIT}."
    ]
  },
  "Marketing & Sales": {
    titles: ["Digital Marketing Manager", "SEO Specialist", "Content Strategist", "Sales Executive", "Account Manager", "Growth Hacker", "Social Media Manager"],
    skills: ["SEO", "SEM", "Google Analytics", "Content Marketing", "B2B Sales", "CRM", "Social Media Advertising", "Copywriting", "Email Marketing", "Brand Strategy", "HubSpot"],
    reqs: [
      "Rekam jejak yang terbukti dalam merancang dan mengeksekusi kampanye pemasaran digital yang menghasilkan ROI tinggi.",
      "Keterampilan komunikasi persuasi yang sangat baik dan kemampuan untuk membangun hubungan jangka panjang dengan klien utama.",
      "Pemahaman analitis yang tajam terhadap metrik pemasaran, konversi (conversion rate), dan analisis perilaku konsumen.",
      "Kreativitas yang tinggi dalam pembuatan konten menarik, strategi branding, dan manajemen reputasi publik.",
      "Pengalaman mendalam dalam negosiasi B2B, penutupan penjualan (closing), dan manajemen siklus penjualan menyeluruh.",
      "Gelar Sarjana di bidang Pemasaran, Ilmu Komunikasi, Manajemen Bisnis, atau disiplin ilmu setara.",
      "Kemampuan adaptasi yang cepat terhadap tren pasar, teknologi periklanan terbaru, dan dinamika industri yang berubah-ubah."
    ],
    descTemplates: [
      "Perusahaan kami sedang dalam fase ekspansi pesat dan mencari seorang {TITLE} yang dinamis. Tanggung jawab Anda akan berkisar pada penetrasi pasar baru, perancangan kampanye inovatif, serta peningkatan kesadaran merek yang signifikan. Kompetensi yang solid dalam {SKILLS} akan sangat krusial dalam tugas sehari-hari Anda. Kami membutuhkan profesional yang dapat membuktikan bahwa mereka memiliki {REQ}. Selain gaji yang kompetitif, Anda akan menikmati berbagai keuntungan esensial seperti {BENEFIT}.",
      "Jadilah ujung tombak pertumbuhan bisnis kami sebagai {TITLE}. Dalam posisi ini, Anda tidak hanya bertugas merumuskan strategi, tetapi juga memastikan setiap eksekusi memberikan dampak penjualan dan pemasaran yang maksimal. Anda diwajibkan memiliki penguasaan materi pada {SKILLS}. Kualifikasi utama yang menjadi prioritas kami adalah pemenuhan terhadap {REQ}. Kesejahteraan Anda terjamin melalui pemberian fasilitas lengkap yang meliputi {BENEFIT}.",
      "Kami menantang Anda untuk bergabung menjadi {TITLE} dan mengubah prospek menjadi klien setia melalui inisiatif cerdas. Pekerjaan ini memerlukan paduan antara kreativitas tingkat tinggi dan pendekatan yang sangat berpusat pada data. Anda harus fasih menggunakan metode dan instrumen {SKILLS}. Kandidat harus secara konsisten menunjukkan kemampuan terkait {REQ}. Bersama kami, kinerja luar biasa Anda akan dihargai melalui benefit resmi unggulan berupa {BENEFIT}."
    ]
  }
};

const locations = [
  "Jakarta Selatan, DKI Jakarta", "Jakarta Pusat, DKI Jakarta", "Jakarta Barat, DKI Jakarta", "Jakarta Timur, DKI Jakarta", "Jakarta Utara, DKI Jakarta",
  "Bandung, Jawa Barat", "Surabaya, Jawa Timur", "Yogyakarta, DI Yogyakarta", "Semarang, Jawa Tengah", "Medan, Sumatera Utara",
  "Denpasar, Bali", "Makassar, Sulawesi Selatan", "Tangerang, Banten", "Depok, Jawa Barat", "Bekasi, Jawa Barat"
];

const workOptions = ["Remote", "On-site", "Hybrid"];
const workTypes = ["Penuh Waktu", "Kontrak", "Paruh Waktu", "Freelance"];
const expLevels = ["Pemula", "Menengah", "Senior", "Manajerial", "Eksekutif"];
const edLevels = ["SMA/SMK", "D3", "S1", "S2", "S3"];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset(arr, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomSalary() {
  const min = Math.floor(Math.random() * 8) + 5;
  const max = min + Math.floor(Math.random() * 10) + 2;
  return {
    salaryText: `Rp ${min}jt - Rp${max}jt`,
    salaryNum: min
  };
}

let jobIdCounter = 1;
const newJobs = [];

const categoriesKeys = Object.keys(categoryRoles);

companies.forEach(company => {
  // 1. Assign official benefits to company
  const companyBenefits = randomSubset(benefitPool, 5, 8);
  
  // 2. Generate random 9-15 jobs
  const jobCount = Math.floor(Math.random() * 6) + 9;
  
  const usedTitles = new Set();

  for (let i = 0; i < jobCount; i++) {
    let categoryKey;
    let catData;
    let title = "";
    
    // Find an unused title and its category
    let attempts = 0;
    while(attempts < 100) {
      categoryKey = randomChoice(categoriesKeys);
      catData = categoryRoles[categoryKey];
      title = randomChoice(catData.titles);
      if (!usedTitles.has(title)) {
        usedTitles.add(title);
        break;
      }
      attempts++;
    }
    
    // Pick skills
    const skills = randomSubset(catData.skills, 4, 7);
    
    // Pick requirements
    const reqsSubset = randomSubset(catData.reqs, 4, 6);
    
    // Pick template
    let descTemplate = randomChoice(catData.descTemplates);
    
    // Construct description by replacing placeholders
    const skillsStr = skills.slice(0, 3).join(", ") + " dan " + skills[skills.length - 1];
    const reqStr = reqsSubset[0].toLowerCase();
    const benStr = companyBenefits.slice(0, 2).join(" dan ");
    
    const description = descTemplate
      .replace(/{TITLE}/g, title)
      .replace(/{SKILLS}/g, skillsStr)
      .replace(/{REQ}/g, reqStr)
      .replace(/{BENEFIT}/g, benStr);

    const salaryData = generateRandomSalary();

    const job = {
      id: jobIdCounter.toString(),
      title: title,
      company: company.name,
      companyId: company.id,
      logo: company.logo,
      location: randomChoice(locations),
      salary: salaryData.salaryText,
      salaryNum: salaryData.salaryNum,
      workOption: randomChoice(workOptions),
      workType: randomChoice(workTypes),
      experienceLevel: randomChoice(expLevels),
      educationLevel: randomChoice(edLevels),
      isPremium: Math.random() > 0.8,
      isUrgent: Math.random() > 0.8,
      isVerified: true,
      postedAt: Math.floor(Math.random() * 24) + 1 + " jam lalu",
      postedDaysAgo: 0,
      categories: [categoryKey],
      requirements: reqsSubset,
      skills: skills,
      benefits: companyBenefits, // The exact official benefits for this company
      description: description,
      managedBy: {
        name: company.name + " Recruiter",
        isPremium: Math.random() > 0.8,
        onlineStatus: "Online",
        avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(company.name) + "&background=random"
      },
      companyDetails: {
        description: company.description || `${company.name} adalah perusahaan inovatif yang terus berkembang pesat di industrinya.`,
        industry: company.industry,
        employees: company.totalEmployees || "100-500 Karyawan",
        website: "https://" + company.name.toLowerCase().replace(/\s/g, '') + ".com",
        linkedin: "https://linkedin.com/company/" + company.name.toLowerCase().replace(/\s/g, ''),
        instagram: "https://instagram.com/" + company.name.toLowerCase().replace(/\s/g, ''),
        cultureTitle: "Budaya Kerja Inklusif dan Kolaboratif",
        galleryImages: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
        ],
        galleryVideos: [
          "https://assets.mixkit.co/videos/preview/mixkit-working-in-a-modern-office-space-32863-large.mp4"
        ],
        workers: [
          "Budi (Manager)",
          "Siti (Senior Staff)"
        ]
      }
    };

    newJobs.push(job);
    jobIdCounter++;
  }
});

fs.writeFileSync(jobsFile, JSON.stringify(newJobs, null, 2));
console.log(`Generated ${newJobs.length} jobs successfully!`);

