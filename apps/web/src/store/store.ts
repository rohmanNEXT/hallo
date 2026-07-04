import { create } from 'zustand';
import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from './zustand/helpers';
import { createAuthSlice, AuthSlice } from './features/authSlice';
import { createBookmarkSlice, BookmarkSlice } from './features/bookmarkSlice';
import { createChatSlice, ChatSlice } from './features/chatSlice';
import { createApplicationSlice, ApplicationSlice } from './features/applicationSlice';
import { createEmployerSlice, EmployerSlice } from './features/employerSlice';

export interface AppState extends AuthSlice, BookmarkSlice, ChatSlice, ApplicationSlice, EmployerSlice {
  theme: string;
  setTheme: (theme: string) => void;
  bannerIndex: number;
  setBannerIndex: (index: number) => void;
}

export const useAppStore = create<AppState>()((set, get, store) => ({
  theme: getLocalStorage("jobseeker-theme", "white"),
  setTheme: (theme) => {
    setLocalStorage("jobseeker-theme", theme);
    set({ theme });
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.setAttribute("data-theme", theme);
      if (['dark', 'darkblue', 'charcoal', 'teal', 'emerald', 'burgundy'].includes(theme)) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  },
  bannerIndex: typeof window !== 'undefined'
    ? (() => {
        const saved = localStorage.getItem('banner_photo');
        if (saved) {
          const val = parseInt(saved, 10);
          return isNaN(val) ? 0 : val;
        }
        return 0;
      })()
    : 0,
  setBannerIndex: (index: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('banner_photo', index.toString());
    }
    set({ bannerIndex: index });
  },
  
  // Combine slices
  ...createAuthSlice(set, get, store),
  ...createBookmarkSlice(set, get, store),
  ...createChatSlice(set, get, store),
  ...createApplicationSlice(set, get, store),
  ...createEmployerSlice(set, get, store),
}));

let globalHasMounted = false;

export const useHasMounted = () => {
  const [mounted, setMounted] = useState(globalHasMounted);
  useEffect(() => {
    globalHasMounted = true;
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted]);
  return mounted;
};

export default useAppStore;
