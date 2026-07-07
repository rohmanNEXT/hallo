import { StateCreator } from 'zustand';
import type { AppState } from '@/store/store';
import { getLocalStorage, setLocalStorage } from '../zustand/helpers';
import { chatSettingsApi } from '@/lib/api';
import defaultJobsData from '@/lib/data/employer-jobs.json';
import defaultApplicationsData from '@/lib/data/employer-applications.json';

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
  updateScreeningKoreksi: (applicationId: string, questionId: string, correction: string) => void;
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

  // Cek versi data: jika data lama tidak punya screeningQuestions, paksa refresh dari JSON
  const hasScreeningQuestions = filtered.length > 0 && filtered[0]?.screeningQuestions;
  // FORCE RELOAD: comment out this line temporarily so it picks up JSON changes
  // if (filtered && filtered.length >= 22 && hasScreeningQuestions) return filtered;

  // Load from JSON — no fake data
  const defaultJobs = defaultJobsData as any[];
  setLocalStorage("jobseeker-employerJobs", defaultJobs);
  return defaultJobs;
};

const getInitialApplications = () => {
  const initial = getLocalStorage("jobseeker-employerApplications", []);

  // Cek versi data: jika data lama tidak punya screeningAnswers, paksa refresh dari JSON
  const hasScreeningAnswers = initial.length > 0 && initial[0]?.screeningAnswers;
  
  // Load from JSON — no fake data
  const defaultApps = defaultApplicationsData as any[];
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
            const candidateName = "Kandidat"; 
            const job = get().employerJobs.find((j: any) => j.id === app.jobId);
            const jobTitle = job?.title || "[Posisi]";
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

  updateScreeningKoreksi: (applicationId, questionId, correction) => {
    const current = get().employerApplications;
    const updated = current.map((app: any) => {
      if (app.id === applicationId) {
        const screeningKoreksi = app.screeningKoreksi || {};
        return {
          ...app,
          screeningKoreksi: {
            ...screeningKoreksi,
            [questionId]: correction,
          },
        };
      }
      return app;
    });
    setLocalStorage("jobseeker-employerApplications", updated);
    set({ employerApplications: updated });
  },
});
