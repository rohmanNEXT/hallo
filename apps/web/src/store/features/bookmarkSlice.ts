import { StateCreator } from 'zustand';
import type { AppState } from '@/store/store';
import { getLocalStorage, setLocalStorage } from '../zustand/helpers';

export interface BookmarkSlice {
  bookmarks: string[];
  toggleBookmark: (jobId: string) => void;
}

export const createBookmarkSlice: StateCreator<
  AppState,
  [],
  [],
  BookmarkSlice
> = (set, get) => ({
  bookmarks: getLocalStorage("jobseeker-bookmarks", ["1", "3"]),
  
  toggleBookmark: (jobId) => {
    const current = get().bookmarks;
    let updated: string[];
    if (current.includes(jobId)) {
      updated = current.filter((id: string) => id !== jobId);
    } else {
      updated = [...current, jobId];
    }
    setLocalStorage("jobseeker-bookmarks", updated);
    set({ bookmarks: updated });
  },
});
