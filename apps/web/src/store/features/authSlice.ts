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
  login: (email: string) => Promise<boolean>;
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
> = (set, get) => ({
  user: getLocalStorage("jobseeker-user", defaultUser),
  settings: getLocalStorage("jobseeker-settings", defaultSettings),
  isLoggedIn: getLocalStorage("jobseeker-isLoggedIn", true),
  isAuthModalOpen: false,
  authModalTab: "login",

  setAuthModal: (isOpen, tab = "login") => set({ isAuthModalOpen: isOpen, authModalTab: tab }),

  login: async (email) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const currentUser = get().user;
      const loggedUser = currentUser ? { ...currentUser, email } : { ...defaultUser, email };
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
      if (waNumber === "081234567890" || waNumber.length > 8) {
        return "budi.santoso@example.com";
      }
      return null;
    } catch (error) {
      console.error("Forgot email failed:", error);
      return null;
    }
  },
});
