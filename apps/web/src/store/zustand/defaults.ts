import { UserProfile, Settings, ChatMessage, JobApplication } from '@/lib/types';

export const defaultUser: UserProfile = {
  name: "Budi Santoso",
  nickname: "Budi",
  career: "Frontend Engineer",
  waNumber: "081234567890",
  email: "budi.santoso@example.com",
  education: ["S1 Teknik Informatika - Universitas Indonesia (2018 - 2022)"],
  experience: ["Junior Developer di TechCorp Indonesia (1 Tahun)"],
  resume: "Resume_Budi_Santoso.pdf",
  website: "https://budisantoso.dev",
  socialMedia: "https://linkedin.com/in/budisantoso",
  softFile: "Portofolio_Frontend.pdf",
  aboutMe: "Saya adalah Frontend Engineer yang bersemangat dalam membangun antarmuka web yang interaktif, responsif, dan ramah pengguna.",
  organization: ["Ketua Himpunan Mahasiswa Informatika (2020 - 2021)"],
  skill: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Zustand", "HTML5", "CSS3"],
  jobReference: {
    interest: "Software Engineering / Web Development",
    city: "Jakarta Pusat",
    salaryExpectation: "Rp 12.000.000 - 15.000.000",
    workOption: "Hybrid",
  },
  certificates: ["AWS Certified Developer - Associate", "Next.js Professional Certificate"],
  profileImage: "",
  role: "user", 
  plan: "Free",
  companyVerification: {
    verified: false,
    nib: "",
    name: "",
    address: "",
    email: "",
    website: "",
    whatsapp: "",
    signature: "",
  },
};

export const defaultSettings: Settings = {
  email: "budi.santoso@example.com",
  connectedAccounts: ["Google", "LinkedIn"],
  visibility: "Public",
  notifications: ["apply_status", "new_jobs"],
};

export const initialChats: ChatMessage[] = [
  { id: "1", sender: "company", content: "Halo Budi, terima kasih telah melamar. Apakah ada waktu untuk interview minggu ini?", timestamp: "10:30" },
  { id: "2", sender: "user", content: "Halo! Ya, saya bersedia. Bagaimana kalau hari Kamis jam 14:00 WIB?", timestamp: "10:35" },
  { id: "3", sender: "company", content: "Baik, jadwal sudah dikonfirmasi. Kami akan kirimkan link meet nanti ya.", timestamp: "10:40" },
];

export const initialApplications: JobApplication[] = [
  { id: "app-1", jobId: "1", jobTitle: "Senior Software Engineer", company: "TechCorp Indonesia", logo: "TC", status: "Interview", date: "08 Jun 2026" },
  { id: "app-2", jobId: "3", jobTitle: "UI/UX Designer", company: "DesignStudio", logo: "DS", status: "Lulus", date: "05 Jun 2026" },
  { id: "app-3", jobId: "5", jobTitle: "Data Analyst", company: "DataDriven Co", logo: "DD", status: "Belum lulus", date: "01 Jun 2026" },
];
