import { StateCreator } from 'zustand';
import type { AppState } from '@/store/store';
import { JobApplication } from '@/lib/types';
import { getLocalStorage, setLocalStorage } from '../zustand/helpers';
import { initialApplications } from '../zustand/defaults';

export interface ApplicationSlice {
  applications: JobApplication[];
  applyJob: (jobId: string, jobTitle: string, company: string, logo: string) => Promise<boolean>;
}

export const createApplicationSlice: StateCreator<
  AppState,
  [],
  [],
  ApplicationSlice
> = (set, get) => ({
  applications: getLocalStorage("jobseeker-applications", initialApplications),
  
  applyJob: async (jobId, jobTitle, company, logo) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const currentApps = get().applications;
      if (currentApps.some((app: any) => app.jobId === jobId)) {
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

      // Automatically add to recruiter side (employerApplications) and trigger welcome message
      const store = get();
      const currentEmployerApps = store.employerApplications || [];
      const autoChatSettings = store.autoChatSettings;

      let welcomeMsg = "";
      if (autoChatSettings && autoChatSettings.configs && autoChatSettings.configs['Melamar'] && autoChatSettings.configs['Melamar'].isActive) {
        const config = autoChatSettings.configs['Melamar'];
        if (autoChatSettings.mode === "custom" && config.customTemplateText) {
          welcomeMsg = config.customTemplateText;
        } else {
          welcomeMsg = "Halo [Nama Kandidat], terima kasih telah melamar posisi [Posisi] di [Nama Perusahaan]. Lamaran Anda telah kami terima dan sedang dalam proses peninjauan oleh tim HRD.";
        }
      }

      // Replace placeholders
      const candidateName = store.user?.name || "Kandidat";
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

      const newEmployerApp = {
        id: newApp.id,
        talentId: "talent-1",
        jobId,
        status: "Melamar",
        date: newApp.date,
        chatHistory: [
          { sender: "user", content: `Halo rekruter, saya melamar lewat sistem. Kualifikasi saya sesuai.`, timestamp },
          { sender: "company", content: welcomeMsg, timestamp }
        ]
      };

      const updatedEmployerApps = [newEmployerApp, ...currentEmployerApps];
      setLocalStorage("jobseeker-employerApplications", updatedEmployerApps);
      set({ employerApplications: updatedEmployerApps });

      return true;
    } catch (error) {
      console.error("Apply job failed:", error);
      return false;
    }
  },
});
