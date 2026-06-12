import { create } from "zustand";

export interface UserProfile {
  name: string;
  career: string;
  waNumber: string;
  email: string;
  education: string;
  experience: string;
  resume: string;
  website: string;
  socialMedia: string;
  softFile: string;
  aboutMe: string;
  organization: string;
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
  coins: number;
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

interface AppState {
  theme: string;
  setTheme: (theme: string) => void;
  
  // Auth
  user: UserProfile | null;
  settings: Settings;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register" | "forgot-email" | "forgot-password";
  setAuthModal: (isOpen: boolean, tab?: "login" | "register" | "forgot-email" | "forgot-password") => void;
  login: (email: string) => Promise<boolean>;
  register: (data: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateSettings: (data: Partial<Settings>) => void;
  forgotEmail: (waNumber: string) => Promise<string | null>;

  // Bookmarks
  bookmarks: string[];
  toggleBookmark: (jobId: string) => void;

  // Chat
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => void;

  // Applications
  applications: JobApplication[];
  applyJob: (jobId: string, jobTitle: string, company: string, logo: string) => Promise<boolean>;

  // Employer / Admin Mode States & Actions
  employerJobs: any[];
  addEmployerJob: (job: any) => void;
  updateEmployerJobStatus: (id: string, status: string) => void;
  verifyCompany: (verificationData: any) => void;
  buyCoins: (amount: number, cost: number) => void;
  upgradePlan: (planName: "Free" | "Starter" | "Platinum", price: number) => void;
  aiScanCount: number;
  runAiScan: (jobId: string) => Promise<boolean>;
  unlockedTalents: string[];
  unlockTalent: (talentId: string) => boolean;
  favoriteTalents: string[];
  toggleFavoriteTalent: (talentId: string) => void;
}

// Initial Mock User
const defaultUser: UserProfile = {
  name: "Budi Santoso",
  career: "Frontend Engineer",
  waNumber: "081234567890",
  email: "budi.santoso@example.com",
  education: "S1 Teknik Informatika - Universitas Indonesia (2018 - 2022)",
  experience: "Junior Developer di TechCorp Indonesia (1 Tahun)",
  resume: "Resume_Budi_Santoso.pdf",
  website: "https://budisantoso.dev",
  socialMedia: "https://linkedin.com/in/budisantoso",
  softFile: "Portofolio_Frontend.pdf",
  aboutMe: "Saya adalah Frontend Engineer yang bersemangat dalam membangun antarmuka web yang interaktif, responsif, dan ramah pengguna.",
  organization: "Ketua Himpunan Mahasiswa Informatika (2020 - 2021)",
  skill: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Zustand", "HTML5", "CSS3"],
  jobReference: {
    interest: "Software Engineering / Web Development",
    city: "Jakarta Pusat",
    salaryExpectation: "Rp 12.000.000 - 15.000.000",
    workOption: "Hybrid",
  },
  certificates: ["AWS Certified Developer - Associate", "Next.js Professional Certificate"],
  profileImage: "",
  role: "user", // Default role is user (job seeker) - role is set at registration
  coins: 100,
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

const defaultSettings: Settings = {
  email: "budi.santoso@example.com",
  connectedAccounts: ["Google", "LinkedIn"],
  visibility: "Public",
  notifications: ["apply_status", "new_jobs"],
};

const initialChats: ChatMessage[] = [
  { id: "1", sender: "company", content: "Halo Budi, terima kasih telah melamar. Apakah ada waktu untuk interview minggu ini?", timestamp: "10:30" },
  { id: "2", sender: "user", content: "Halo! Ya, saya bersedia. Bagaimana kalau hari Kamis jam 14:00 WIB?", timestamp: "10:35" },
  { id: "3", sender: "company", content: "Baik, jadwal sudah dikonfirmasi. Kami akan kirimkan link meet nanti ya.", timestamp: "10:40" },
];

const initialApplications: JobApplication[] = [
  { id: "app-1", jobId: "1", jobTitle: "Senior Software Engineer", company: "TechCorp Indonesia", logo: "TC", status: "Interview", date: "08 Jun 2026" },
  { id: "app-2", jobId: "3", jobTitle: "UI/UX Designer", company: "DesignStudio", logo: "DS", status: "Lulus", date: "05 Jun 2026" },
  { id: "app-3", jobId: "5", jobTitle: "Data Analyst", company: "DataDriven Co", logo: "DD", status: "Belum lulus", date: "01 Jun 2026" },
];

export const useAppStore = create<AppState>((set, get) => {
  // Safe window/localStorage access for Next.js SSR
  const getLocalStorage = (key: string, defaultValue: any) => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return saved;
        }
      }
    }
    return defaultValue;
  };

  const setLocalStorage = (key: string, value: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return {
    theme: getLocalStorage("jobseeker-theme", "white"),
    setTheme: (theme) => {
      setLocalStorage("jobseeker-theme", theme);
      set({ theme });
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        // Reset all theme attributes
        root.setAttribute("data-theme", theme);
        if (theme === "dark" || theme === "darkblue" || theme === "charcoal" || theme === "teal" || theme === "emerald" || theme === "burgundy") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    },

    // Auth States
    user: getLocalStorage("jobseeker-user", defaultUser),
    settings: getLocalStorage("jobseeker-settings", defaultSettings),
    isLoggedIn: getLocalStorage("jobseeker-isLoggedIn", true),
    isAuthModalOpen: false,
    authModalTab: "login",

    setAuthModal: (isOpen, tab = "login") => set({ isAuthModalOpen: isOpen, authModalTab: tab }),

    login: async (email) => {
      try {
        // Simulasi network request dengan delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockProfile: UserProfile = {
          ...defaultUser,
          email: email,
        };
        setLocalStorage("jobseeker-user", mockProfile);
        setLocalStorage("jobseeker-isLoggedIn", true);
        set({ user: mockProfile, isLoggedIn: true, isAuthModalOpen: false });
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },

    register: async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const newProfile: UserProfile = {
          ...defaultUser,
          name: data.name || "User Baru",
          email: data.email || "user@example.com",
          waNumber: data.waNumber || "",
          role: (data.role as "user" | "admin") || "user",
          coins: data.role === "admin" ? 0 : 0,
          plan: "Free",
        };
        setLocalStorage("jobseeker-user", newProfile);
        setLocalStorage("jobseeker-isLoggedIn", true);
        set({ user: newProfile, isLoggedIn: true, isAuthModalOpen: false });
        return true;
      } catch (error) {
        console.error("Registration failed:", error);
        return false;
      }
    },

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("jobseeker-user");
        localStorage.setItem("jobseeker-isLoggedIn", "false");
      }
      set({ user: null, isLoggedIn: false });
    },

    updateProfile: (data) => {
      const currentUser = get().user;
      if (currentUser) {
        const updated = { ...currentUser, ...data };
        setLocalStorage("jobseeker-user", updated);
        set({ user: updated });
      }
    },

    updateSettings: (data) => {
      const currentSettings = get().settings;
      const updated = { ...currentSettings, ...data };
      setLocalStorage("jobseeker-settings", updated);
      set({ settings: updated });
    },

    forgotEmail: async (waNumber) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        // Mock check wa number
        if (waNumber === "081234567890" || waNumber.length > 8) {
          return "budi.santoso@example.com";
        }
        return null;
      } catch (error) {
        console.error("Forgot email failed:", error);
        return null;
      }
    },

    // Bookmarks
    bookmarks: getLocalStorage("jobseeker-bookmarks", ["1", "3"]),
    toggleBookmark: (jobId) => {
      const current = get().bookmarks;
      let updated: string[];
      if (current.includes(jobId)) {
        updated = current.filter((id) => id !== jobId);
      } else {
        updated = [...current, jobId];
      }
      setLocalStorage("jobseeker-bookmarks", updated);
      set({ bookmarks: updated });
    },

    // Chat
    isChatOpen: false,
    setChatOpen: (open) => set({ isChatOpen: open }),
    chatMessages: getLocalStorage("jobseeker-chats", initialChats),
    sendChatMessage: (content) => {
      const newMsg: ChatMessage = {
        id: String(Date.now()),
        sender: "user",
        content,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      const updated = [...get().chatMessages, newMsg];
      setLocalStorage("jobseeker-chats", updated);
      set({ chatMessages: updated });

      // Mock auto reply from company
      setTimeout(() => {
        const reply: ChatMessage = {
          id: String(Date.now() + 1),
          sender: "company",
          content: "Terima kasih atas pesannya! Kami akan segera menghubungi Anda kembali.",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        };
        const withReply = [...get().chatMessages, reply];
        setLocalStorage("jobseeker-chats", withReply);
        set({ chatMessages: withReply });
      }, 1500);
    },

    // Applications
    applications: getLocalStorage("jobseeker-applications", initialApplications),
    applyJob: async (jobId, jobTitle, company, logo) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const currentApps = get().applications;
        // Check if already applied
        if (currentApps.some((app) => app.jobId === jobId)) {
          return false;
        }
        const newApp: JobApplication = {
          id: `app-${Date.now()}`,
          jobId,
          jobTitle,
          company,
          logo,
          status: "Pending",
          date: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        };
        const updated = [newApp, ...currentApps];
        setLocalStorage("jobseeker-applications", updated);
        set({ applications: updated });
        return true;
      } catch (error) {
        console.error("Apply job failed:", error);
        return false;
      }
    },

    // Employer / Admin Mode States & Actions
    employerJobs: getLocalStorage("jobseeker-employerJobs", [
      {
        id: "emp-job-1",
        title: "Frontend Engineer (React)",
        description: "Kami sedang mencari Frontend Engineer berbakat untuk membangun aplikasi web modern berskala besar.",
        salary: 12000000,
        badge: "urgent hiring",
        status: "aktif",
        requirements: "Work type: On-site, Min Experience: 2 years",
        skills: ["React", "Next.js", "TypeScript"],
        benefits: ["Kesehatan", "Bonus Kinerja", "Makan Siang Gratis"],
        date: "08 Jun 2026",
      },
      {
        id: "emp-job-2",
        title: "Backend Developer (Node.js)",
        description: "Mendesain dan memelihara API handal menggunakan NestJS dan PostgreSQL.",
        salary: 15000000,
        badge: "premium company",
        status: "draf",
        requirements: "Work type: Remote, Min Experience: 3 years",
        skills: ["Node.js", "Express", "TypeScript", "PostgreSQL"],
        benefits: ["Tunjangan Kerja Remote", "Kesehatan"],
        date: "07 Jun 2026",
      }
    ]),
    
    addEmployerJob: (job) => {
      const current = get().employerJobs;
      const newJob = {
        id: `emp-job-${Date.now()}`,
        date: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        ...job,
      };
      const updated = [newJob, ...current];
      setLocalStorage("jobseeker-employerJobs", updated);
      set({ employerJobs: updated });
    },

    updateEmployerJobStatus: (id, status) => {
      const current = get().employerJobs;
      const updated = current.map((job) => (job.id === id ? { ...job, status } : job));
      setLocalStorage("jobseeker-employerJobs", updated);
      set({ employerJobs: updated });
    },

    verifyCompany: (verificationData) => {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          companyVerification: {
            ...verificationData,
            verified: true,
          },
        };
        setLocalStorage("jobseeker-user", updatedUser);
        set({ user: updatedUser });
      }
    },

    buyCoins: (amount, cost) => {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          coins: (currentUser.coins || 0) + amount,
        };
        setLocalStorage("jobseeker-user", updatedUser);
        set({ user: updatedUser });
      }
    },

    upgradePlan: (planName, price) => {
      const currentUser = get().user;
      if (currentUser) {
        // Tentukan jumlah koin bonus berdasarkan plan
        let coinBonus = 0;
        if (planName === "Starter") coinBonus = 100;
        if (planName === "Platinum") coinBonus = 300;

        const updatedUser = {
          ...currentUser,
          plan: planName,
          coins: (currentUser.coins || 0) + coinBonus,
        };
        setLocalStorage("jobseeker-user", updatedUser);
        set({ user: updatedUser });
      }
    },

    aiScanCount: getLocalStorage("jobseeker-aiScanCount", 0),
    
    runAiScan: async (jobId) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const currentCount = get().aiScanCount;
        const newCount = currentCount + 1;
        setLocalStorage("jobseeker-aiScanCount", newCount);
        set({ aiScanCount: newCount });
        return true;
      } catch (error) {
        console.error("AI scan failed:", error);
        return false;
      }
    },

    unlockedTalents: getLocalStorage("jobseeker-unlockedTalents", []),
    
    unlockTalent: (talentId) => {
      const currentUser = get().user;
      if (!currentUser) return false;
      
      const currentUnlocked = get().unlockedTalents;
      if (currentUnlocked.includes(talentId)) return true;

      // Unlock cost is 10 coins
      if ((currentUser.coins || 0) >= 10) {
        const updatedUser = {
          ...currentUser,
          coins: currentUser.coins - 10,
        };
        const updatedUnlocked = [...currentUnlocked, talentId];
        setLocalStorage("jobseeker-user", updatedUser);
        setLocalStorage("jobseeker-unlockedTalents", updatedUnlocked);
        set({ user: updatedUser, unlockedTalents: updatedUnlocked });
        return true;
      }
      return false;
    },

    favoriteTalents: getLocalStorage("jobseeker-favoriteTalents", []),
    
    toggleFavoriteTalent: (talentId) => {
      const current = get().favoriteTalents;
      let updated: string[];
      if (current.includes(talentId)) {
        updated = current.filter((id) => id !== talentId);
      } else {
        updated = [...current, talentId];
      }
      setLocalStorage("jobseeker-favoriteTalents", updated);
      set({ favoriteTalents: updated });
    },
  };
});
