import { StateCreator } from 'zustand';
import type { AppState } from '@/store/store';
import { getLocalStorage, setLocalStorage } from '../zustand/helpers';

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
}

export const createEmployerSlice: StateCreator<
  AppState,
  [],
  [],
  EmployerSlice
> = (set, get) => ({
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
    const updated = current.map((job: any) => (job.id === id ? { ...job, status } : job));
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
      updated = current.filter((id: string) => id !== talentId);
    } else {
      updated = [...current, talentId];
    }
    setLocalStorage("jobseeker-favoriteTalents", updated);
    set({ favoriteTalents: updated });
  },
});
