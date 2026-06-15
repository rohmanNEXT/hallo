import { create } from 'zustand';
import { getLocalStorage, setLocalStorage } from './zustand/helpers';
import { createAuthSlice, AuthSlice } from './features/authSlice';
import { createBookmarkSlice, BookmarkSlice } from './features/bookmarkSlice';
import { createChatSlice, ChatSlice } from './features/chatSlice';
import { createApplicationSlice, ApplicationSlice } from './features/applicationSlice';
import { createEmployerSlice, EmployerSlice } from './features/employerSlice';

export interface AppState extends AuthSlice, BookmarkSlice, ChatSlice, ApplicationSlice, EmployerSlice {
  theme: string;
  setTheme: (theme: string) => void;
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
  
  // Combine slices
  ...createAuthSlice(set, get, store),
  ...createBookmarkSlice(set, get, store),
  ...createChatSlice(set, get, store),
  ...createApplicationSlice(set, get, store),
  ...createEmployerSlice(set, get, store),
}));
export default useAppStore;
