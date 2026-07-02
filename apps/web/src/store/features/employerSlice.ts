import { StateCreator } from 'zustand';
import type { AppState } from '@/store/store';
import { getLocalStorage, setLocalStorage } from '../zustand/helpers';
import { chatSettingsApi } from '@/lib/api';

export interface HRDAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  assignedJobIds: string[];
}

const defaultHrdAccounts: HRDAccount[] = [
  { id: 'hrd-1', name: 'Afred', email: 'afred@gmail.com', password: 'password123', assignedJobIds: ['emp-job-1', 'emp-job-2', 'emp-job-3', 'emp-job-4'] },
  { id: 'hrd-2', name: 'Baim', email: 'baim@gmail.com', password: 'password123', assignedJobIds: ['emp-job-5', 'emp-job-6', 'emp-job-7', 'emp-job-8'] }
];

export interface EmployerSlice {
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
  employerApplications: any[];
  updateApplicationStatus: (id: string, status: string) => void;
  sendCandidateMessage: (applicationId: string, message: string) => void;
  editEmployerJob: (id: string, updatedJob: any) => void;
  softDeleteEmployerJob: (id: string) => void;
  restoreEmployerJob: (id: string) => void;
  hardDeleteEmployerJob: (id: string) => void;
  verifyEmail: () => void;
  sentInvitations: string[];  // array of talentIds already invited
  sendJobInvitation: (talentId: string) => boolean; // returns false if quota exceeded
  autoChatSettings: {
    mode: 'no-custom' | 'custom';
    configs: Record<string, { isActive: boolean; selectedTemplateId: number; customTemplateText: string }>;
  };
  fetchAutoChatSettings: () => Promise<void>;
  updateAutoChatSettings: (settings: any) => Promise<void>;
  hrdAccounts: HRDAccount[];
  addHrdAccount: (hrd: Omit<HRDAccount, 'id'>) => void;
  updateHrdAccount: (id: string, updates: Partial<Omit<HRDAccount, 'id'>>) => void;
  deleteHrdAccount: (id: string) => void;
}

const getInitialJobs = () => {
  const initial = getLocalStorage("jobseeker-employerJobs", []);
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const filtered = initial.filter((job: any) => {
    if (job.status === 'trash' && job.deletedAt) {
      return new Date(job.deletedAt).getTime() > thirtyDaysAgo;
    }
    return true;
  });

  if (filtered.length !== initial.length) {
    setLocalStorage("jobseeker-employerJobs", filtered);
  }

  if (filtered && filtered.length >= 22) return filtered;

  const defaultJobs: any[] = [
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
      title: "Backend Developer",
      description: "Mendesain dan memelihara API handal menggunakan NestJS dan PostgreSQL.",
      salary: 15000000,
      badge: "premium company",
      status: "nonaktif",
      requirements: "Work type: Remote, Min Experience: 3 years",
      skills: ["Node.js", "Express", "TypeScript", "PostgreSQL"],
      benefits: ["Tunjangan Kerja Remote", "Kesehatan"],
      date: "07 Jun 2026",
    }
  ];

  const jobTitles = [
    "Full Stack Developer", "UI/UX Designer", "DevOps Engineer", "Data Scientist",
    "QA Engineer", "Mobile Engineer (Android/iOS)", "Product Manager", "Scrum Master",
    "Cyber Security Analyst", "SEO Specialist", "Content Writer", "Social Media Manager",
    "Sales Executive", "Customer Support", "HR Specialist", "Business Analyst", "Network Engineer", "Systems Administrator"
  ];

  for (let i = 3; i <= 22; i++) {
    const title = jobTitles[(i - 3) % jobTitles.length];
    defaultJobs.push({
      id: `emp-job-${i}`,
      title,
      description: `Membuka lowongan untuk posisi ${title} yang berpengalaman dan berdedikasi tinggi di bidangnya.`,
      salary: 6000000 + (i * 1000000) % 12000000,
      badge: i % 3 === 0 ? "urgent hiring" : i % 5 === 0 ? "premium company" : "",
      status: i % 7 === 0 ? "trash" : i % 4 === 0 ? "nonaktif" : "aktif",
      deletedAt: i % 7 === 0 ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      requirements: `Work type: Hybrid, Min Experience: ${(i % 4) + 1} years`,
      skills: ["Problem Solving", "Teamwork", "Communication"],
      benefits: ["Kesehatan", "Tunjangan"],
      date: `0${(i % 9) + 1} Jun 2026`,
    });
  }

  setLocalStorage("jobseeker-employerJobs", defaultJobs);
  return defaultJobs;
};

const getInitialApplications = () => {
  const initial = getLocalStorage("jobseeker-employerApplications", []);
  if (initial && initial.length >= 120) return initial;

  const defaultApps = [
    {
      id: "app-1",
      talentId: "talent-1",
      jobId: "emp-job-1",
      status: "Melamar",
      date: "10 Jun 2026",
      chatHistory: [
        { sender: "user", content: "Halo, saya sangat tertarik dengan lowongan Frontend Engineer ini.", timestamp: "10 Jun 2026, 10:00" }
      ]
    },
    {
      id: "app-2",
      talentId: "talent-2",
      jobId: "emp-job-1",
      status: "Terseleksi",
      date: "11 Jun 2026",
      chatHistory: [
        { sender: "user", content: "Halo, saya telah mengirimkan portfolio desain terbaru saya.", timestamp: "11 Jun 2026, 11:30" },
        { sender: "company", content: "Terima kasih, portfolio Anda sedang kami tinjau.", timestamp: "11 Jun 2026, 14:00" }
      ]
    },
    {
      id: "app-3",
      talentId: "talent-3",
      jobId: "emp-job-2",
      status: "Melamar",
      date: "12 Jun 2026",
      chatHistory: [
        { sender: "user", content: "Selamat siang, saya melamar untuk posisi Backend Developer.", timestamp: "12 Jun 2026, 09:15" }
      ]
    },
    {
      id: "app-4",
      talentId: "talent-4",
      jobId: "emp-job-1",
      status: "Diterima",
      date: "09 Jun 2026",
      chatHistory: [
        { sender: "user", content: "Terima kasih banyak atas kesempatannya!", timestamp: "09 Jun 2026, 16:30" }
      ]
    },
    {
      id: "app-5",
      talentId: "talent-5",
      jobId: "emp-job-1",
      status: "Ditutup",
      date: "08 Jun 2026",
      chatHistory: [
        { sender: "user", content: "Saya siap mengikuti proses seleksi.", timestamp: "08 Jun 2026, 13:00" }
      ]
    }
  ];

  for (let i = defaultApps.length + 1; i <= 120; i++) {
    defaultApps.push({
      id: `app-${i}`,
      talentId: `talent-${i}`,
      jobId: `emp-job-${(i % 20) + 1}`,
      status: i % 4 === 0 ? "Terseleksi" : i % 3 === 0 ? "Diterima" : i % 5 === 0 ? "Ditutup" : "Melamar",
      date: `${10 + (i % 20)} Jun 2026`,
      chatHistory: [
        { sender: "user", content: `Halo rekruter, saya melamar lewat sistem. Kualifikasi saya sesuai.`, timestamp: `${10 + (i % 20)} Jun 2026, 10:00` }
      ]
    });
  }

  setLocalStorage("jobseeker-employerApplications", defaultApps);
  return defaultApps;
};

export const createEmployerSlice: StateCreator<
  AppState,
  [],
  [],
  EmployerSlice
> = (set, get) => ({
  employerJobs: getInitialJobs(),

  employerApplications: getInitialApplications(),
  
  autoChatSettings: {
    mode: "no-custom",
    configs: {
      "Melamar": { isActive: true, selectedTemplateId: 1, customTemplateText: "" },
      "Terseleksi": { isActive: false, selectedTemplateId: 1, customTemplateText: "" },
      "Diterima": { isActive: false, selectedTemplateId: 1, customTemplateText: "" },
      "Ditutup": { isActive: false, selectedTemplateId: 1, customTemplateText: "" }
    }
  },

  fetchAutoChatSettings: async () => {
    try {
      const data = await chatSettingsApi.getSettings();
      set({ autoChatSettings: data });
    } catch (error) {
      console.error("Failed to fetch auto chat settings", error);
    }
  },

  updateAutoChatSettings: async (settings) => {
    try {
      // Optimistic update
      set({ autoChatSettings: settings });
      await chatSettingsApi.updateSettings(settings);
    } catch (error) {
      console.error("Failed to update auto chat settings", error);
      // Fallback: refetch original
      get().fetchAutoChatSettings();
    }
  },

  hrdAccounts: getLocalStorage("jobseeker-hrdAccounts", defaultHrdAccounts),
  
  addHrdAccount: (hrd) => {
    const newHrd = { ...hrd, id: `hrd-${Date.now()}` };
    const updated = [...get().hrdAccounts, newHrd];
    setLocalStorage("jobseeker-hrdAccounts", updated);
    set({ hrdAccounts: updated });
  },

  updateHrdAccount: (id, updates) => {
    const updated = get().hrdAccounts.map(h => h.id === id ? { ...h, ...updates } : h);
    setLocalStorage("jobseeker-hrdAccounts", updated);
    set({ hrdAccounts: updated });
  },

  deleteHrdAccount: (id) => {
    const updated = get().hrdAccounts.filter(h => h.id !== id);
    setLocalStorage("jobseeker-hrdAccounts", updated);
    set({ hrdAccounts: updated });
  },
  
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
    const updated = current.map((job: any) => (job.id === id ? { ...job, status } : job));
    setLocalStorage("jobseeker-employerJobs", updated);
    set({ employerJobs: updated });
  },

  editEmployerJob: (id, updatedJob) => {
    const current = get().employerJobs;
    const updated = current.map((job: any) => (job.id === id ? { ...job, ...updatedJob } : job));
    setLocalStorage("jobseeker-employerJobs", updated);
    set({ employerJobs: updated });
  },

  softDeleteEmployerJob: (id) => {
    const current = get().employerJobs;
    const updated = current.map((job: any) =>
      job.id === id ? { ...job, status: 'trash', deletedAt: new Date().toISOString() } : job
    );
    setLocalStorage("jobseeker-employerJobs", updated);
    set({ employerJobs: updated });
  },

  restoreEmployerJob: (id) => {
    const current = get().employerJobs;
    const updated = current.map((job: any) =>
      job.id === id ? { ...job, status: 'nonaktif', deletedAt: undefined } : job
    );
    setLocalStorage("jobseeker-employerJobs", updated);
    set({ employerJobs: updated });
  },

  hardDeleteEmployerJob: (id) => {
    const current = get().employerJobs;
    const updated = current.filter((job: any) => job.id !== id);
    setLocalStorage("jobseeker-employerJobs", updated);
    set({ employerJobs: updated });
  },

  verifyEmail: () => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        emailVerified: true,
      };
      setLocalStorage("jobseeker-user", updatedUser);
      set({ user: updatedUser });
    }
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

    if ((currentUser.coins || 0) >= 10) {
      const updatedUser = {
        ...currentUser,
        coins: (currentUser.coins || 0) - 10,
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
      updated = current.filter((id: string) => id !== talentId);
    } else {
      updated = [...current, talentId];
    }
    setLocalStorage("jobseeker-favoriteTalents", updated);
    set({ favoriteTalents: updated });
  },

  sentInvitations: getLocalStorage("jobseeker-sentInvitations", []),

  sendJobInvitation: (talentId) => {
    const currentUser = get().user;
    const plan = currentUser?.plan || 'Free';
    // Only subscribed (non-Free) users can use invitation quota
    if (plan === 'Free') return false;
    const current = get().sentInvitations;
    if (current.includes(talentId)) return true; // already invited, allow resend
    // Max 20 invitations per subscription
    if (current.length >= 20) return false;
    const updated = [...current, talentId];
    setLocalStorage("jobseeker-sentInvitations", updated);
    set({ sentInvitations: updated });
    return true;
  },

  updateApplicationStatus: (id, status) => {
    const current = get().employerApplications;
    const settings = get().autoChatSettings;
    
    const updated = current.map((app: any) => {
      if (app.id === id) {
        let newApp = { ...app, status };
        
        // Auto Chat logic for new status
        if (settings && settings.configs && settings.configs[status] && settings.configs[status].isActive) {
          const config = settings.configs[status];
          let welcomeMsg = "";
          if (settings.mode === "custom" && config.customTemplateText) {
            welcomeMsg = config.customTemplateText;
          } else {
            const templatesData: Record<string, string> = {
              "Melamar": "Halo [Nama Kandidat], terima kasih telah melamar posisi [Posisi] di [Nama Perusahaan]. Lamaran Anda telah kami terima dan sedang dalam proses peninjauan oleh tim HRD.",
              "Terseleksi": "Halo [Nama Kandidat], selamat! Profil Anda sesuai dengan kualifikasi kami dan status Anda kini Terseleksi. Kami akan segera menghubungi Anda untuk tahap selanjutnya.",
              "Diterima": "Halo [Nama Kandidat], selamat bergabung! Anda dinyatakan Diterima untuk posisi [Posisi] di [Nama Perusahaan]. Tim kami akan segera mengirimkan informasi lebih lanjut.",
              "Ditutup": "Halo [Nama Kandidat], terima kasih atas partisipasi Anda. Mohon maaf, saat ini posisi [Posisi] telah Ditutup. Jangan menyerah dan semoga sukses di kesempatan berikutnya!"
            };
            welcomeMsg = templatesData[status] || templatesData["Melamar"];
          }

          if (welcomeMsg) {
            const candidateName = "Kandidat"; // Assuming candidate name is not directly available in employer app object or we use a fallback
            // To get actual jobTitle, company: wait, the app object contains jobTitle? No, app contains jobId.
            // But let's assume we can't easily replace it here unless we fetch the job. 
            // In employerApplications, it might have some data. Let's look up the job from employerJobs.
            const job = get().employerJobs.find((j: any) => j.id === app.jobId);
            const jobTitle = job?.title || "[Posisi]";
            // We know the current user is the company.
            const company = get().user?.companyVerification?.name || "[Nama Perusahaan]";
            
            welcomeMsg = welcomeMsg
              .replace(/\[Nama Kandidat\]/g, candidateName)
              .replace(/\[Posisi\]/g, jobTitle)
              .replace(/\[Nama Perusahaan\]/g, company);

            const timestamp = new Date().toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) + ", " + new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

            newApp.chatHistory = [
              ...(newApp.chatHistory || []),
              { sender: "company", content: welcomeMsg, timestamp }
            ];
          }
        }
        
        return newApp;
      }
      return app;
    });
    setLocalStorage("jobseeker-employerApplications", updated);
    set({ employerApplications: updated });
  },

  sendCandidateMessage: (applicationId, message) => {
    const current = get().employerApplications;
    const updated = current.map((app: any) => {
      if (app.id === applicationId) {
        return {
          ...app,
          chatHistory: [
            ...(app.chatHistory || []),
            {
              sender: "company",
              content: message,
              timestamp: new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }) + ", " + new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ],
        };
      }
      return app;
    });
    setLocalStorage("jobseeker-employerApplications", updated);
    set({ employerApplications: updated });
  },
});
