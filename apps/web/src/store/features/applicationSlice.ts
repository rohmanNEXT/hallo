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
      return true;
    } catch (error) {
      console.error("Apply job failed:", error);
      return false;
    }
  },
});
