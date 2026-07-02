import { StateCreator } from 'zustand';
import type { AppState } from '@/store/store';
import { UserProfile, Settings } from '@/lib/types';
import { getLocalStorage, setLocalStorage } from '../zustand/helpers';
import { defaultUser, defaultSettings } from '../zustand/defaults';

export interface AuthSlice {
  user: UserProfile | null;
  settings: Settings;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register" | "forgot-email" | "forgot-password";
  setAuthModal: (isOpen: boolean, tab?: "login" | "register" | "forgot-email" | "forgot-password") => void;
  login: (email: string, role?: "user" | "admin") => Promise<boolean>;
  register: (data: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateSettings: (data: Partial<Settings>) => void;
  forgotEmail: (waNumber: string) => Promise<string | null>;
}

export const createAuthSlice: StateCreator<
  AppState,
  [],
  [],
  AuthSlice
> = (set, get) => {
  let initialUser = getLocalStorage("jobseeker-user", defaultUser);
  if (initialUser) {
    if (typeof window !== "undefined") {
      const savedImg = localStorage.getItem("jobseeker-profile-image");
      if (savedImg) {
        initialUser.profileImage = savedImg;
      }
    }
    if (initialUser.email === 'recruiter@example.com' || initialUser.email === 'afred@gmail.com' || initialUser.email === 'baim@gmail.com') {
      initialUser.plan = "Platinum";
      initialUser.employerRole = initialUser.email === 'recruiter@example.com' ? "MASTER_ADMIN" : "HRD";
      if (initialUser.email === 'afred@gmail.com') {
        initialUser.hrdId = "hrd-1";
      } else if (initialUser.email === 'baim@gmail.com') {
        initialUser.hrdId = "hrd-2";
      }
      initialUser.role = "admin";

      initialUser.companyVerification = {
        verified: true,
        nib: initialUser.companyVerification?.nib || "NIB-12345678",
        name: initialUser.companyVerification?.name || "PT. BlueJob Global Indonesia",
        brandName: initialUser.companyVerification?.brandName || "BlueJob Corporation",
        address: initialUser.companyVerification?.address || "Kantor Pusat",
        email: initialUser.companyVerification?.email || "recruiter@example.com",
        website: initialUser.companyVerification?.website || "bluejob.com",
        whatsapp: initialUser.companyVerification?.whatsapp || "",
        waNumber: initialUser.companyVerification?.waNumber || "",
        signature: initialUser.companyVerification?.signature || "",
        industry: initialUser.companyVerification?.industry || "Teknologi & Informasi",
        employeeCount: initialUser.companyVerification?.employeeCount || "11-50 Pegawai",
        description: initialUser.companyVerification?.description || "Perusahaan teknologi terkemuka penyedia solusi digital.",
      };
    }
  }

  return {
    user: initialUser,
    settings: getLocalStorage("jobseeker-settings", defaultSettings),
    isLoggedIn: getLocalStorage("jobseeker-isLoggedIn", true),
  isAuthModalOpen: false,
  authModalTab: "login",

  setAuthModal: (isOpen, tab = "login") => set({ isAuthModalOpen: isOpen, authModalTab: tab }),

  login: async (email, role) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const currentUser = get().user;
      let loggedUser = (currentUser
        ? { ...currentUser, email, ...(role ? { role } : {}) }
        : { ...defaultUser, email, ...(role ? { role } : {}) }) as UserProfile;
      if (email === 'recruiter@example.com' || email === 'afred@gmail.com' || email === 'baim@gmail.com') {
        loggedUser.plan = "Platinum";
        loggedUser.employerRole = email === 'recruiter@example.com' ? "MASTER_ADMIN" : "HRD";
        if (email === 'afred@gmail.com') {
          loggedUser.hrdId = "hrd-1";
          loggedUser.name = "Afred";
        } else if (email === 'baim@gmail.com') {
          loggedUser.hrdId = "hrd-2";
          loggedUser.name = "Baim";
        }
        loggedUser.role = "admin";
        
        loggedUser.companyVerification = {
          verified: true,
          nib: loggedUser.companyVerification?.nib || "NIB-12345678",
          name: loggedUser.companyVerification?.name || "PT. BlueJob Global Indonesia",
          brandName: loggedUser.companyVerification?.brandName || "BlueJob Corporation",
          address: loggedUser.companyVerification?.address || "Kantor Pusat",
          email: loggedUser.companyVerification?.email || "recruiter@example.com",
          website: loggedUser.companyVerification?.website || "bluejob.com",
          whatsapp: loggedUser.companyVerification?.whatsapp || "",
          waNumber: loggedUser.companyVerification?.waNumber || "",
          signature: loggedUser.companyVerification?.signature || "",
          industry: loggedUser.companyVerification?.industry || "Teknologi & Informasi",
          employeeCount: loggedUser.companyVerification?.employeeCount || "11-50 Pegawai",
          description: loggedUser.companyVerification?.description || "Perusahaan teknologi terkemuka penyedia solusi digital.",
        };
      }
      setLocalStorage("jobseeker-user", loggedUser);
      setLocalStorage("jobseeker-isLoggedIn", true);
      set({ user: loggedUser, isLoggedIn: true, isAuthModalOpen: false });
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
      localStorage.removeItem("jobseeker-profile-image");
      localStorage.setItem("jobseeker-isLoggedIn", "false");
    }
    set({ user: null, isLoggedIn: false });
  },

  updateProfile: (data) => {
    const currentUser = get().user;
    if (currentUser) {
      if (data.profileImage) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("jobseeker-profile-image");
          localStorage.setItem("jobseeker-profile-image", data.profileImage);
        }
      }
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
      if (waNumber === "081234567890" || waNumber.length > 8) {
        return "budi.santoso@example.com";
      }
      return null;
    } catch (error) {
      console.error("Forgot email failed:", error);
      return null;
    }
  },
};
};
