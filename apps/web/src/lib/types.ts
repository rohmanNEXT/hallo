export interface UserProfile {
  name: string;
  nickname?: string;
  career: string;
  waNumber: string;
  email: string;
  education: string[];
  experience: string[];
  resume: string;
  website: string;
  socialMedia: string;
  softFile: string;
  aboutMe: string;
  organization: string[];
  skill: string[];
  jobReference: {
    interest: string;
    city: string;
    salaryExpectation: string;
    workOption: string; // 'remote' | 'hybrid' | 'onsite'
  };
  certificates: string[];
  profileImage?: string;
  role: "user" | "admin";
  plan: "Free" | "Starter" | "Platinum";
  companyVerification?: {
    verified: boolean;
    nib: string;
    name: string;
    address: string;
    email: string;
    website: string;
    whatsapp: string;
    signature: string;
  };
}

export interface Settings {
  email: string;
  connectedAccounts: string[];
  visibility: string; // 'Public' | 'Premium Only' | 'Private'
  notifications: string[]; // 'apply_status', 'new_jobs', 'newsletter'
}

export interface ChatMessage {
  id: string;
  sender: "user" | "company";
  content: string;
  timestamp: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  logo: string;
  status: "Interview" | "Lulus" | "Belum lulus" | "Pending";
  date: string;
}

export interface ProvinceData {
  province: string;
  regencies: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  salaryNum: number; // For slider filtering
  workOption: string;
  workType: string;
  experienceLevel: string;
  educationLevel: string;
  isPremium: boolean;
  isUrgent: boolean;
  isVerified: boolean;
  postedAt: string;
  postedDaysAgo: number;
  categories: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  description: string;
  managedBy: {
    name: string;
    isPremium: boolean;
    onlineStatus: string; // e.g., "10 menit lalu"
    avatar?: string;
  };
  companyDetails: {
    description: string;
    industry: string;
    employees: string;
    website: string;
    linkedin: string;
    instagram: string;
    cultureTitle: string;
    galleryImages: string[];
    galleryVideos: string[];
    workers: string[];
  };
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  totalEmployees: string;
  openJobs: number;
  rating: number;
  isPremium: boolean;
  isVerified: boolean;
  postedAt: string;
  description: string;
  availableTitles: string[];
}

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  totalEmployees: string;
  rating: number;
  isPremium: boolean;
  description: string;
  website: string;
  linkedin: string;
  instagram: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  cultureTitle: string;
  cultureDesc: string;
  galleryImages: string[];
  galleryVideos: string[];
  workers: {
    name: string;
    position: string;
    image: string;
    linkedin?: string;
  }[];
  benefits: string[];
}

export interface AppNotification {
  id: string;
  company: string;
  status: string;
  time: string;
  suffix: string;
}
