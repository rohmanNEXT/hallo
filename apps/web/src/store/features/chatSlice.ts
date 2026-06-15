import { StateCreator } from 'zustand';
import type { AppState } from '@/store/store';
import { ChatMessage } from '@/lib/types';
import { getLocalStorage, setLocalStorage } from '../zustand/helpers';
import { initialChats } from '../zustand/defaults';

export interface ChatSlice {
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => void;
  editChatMessage: (id: string, newContent: string) => void;
  deleteChatMessage: (id: string) => void;
  clearChatByContact: (contactId: string) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
}

export const createChatSlice: StateCreator<
  AppState,
  [],
  [],
  ChatSlice
> = (set, get) => ({
  isChatOpen: false,
  setChatOpen: (open) => set({ isChatOpen: open }),
  chatMessages: getLocalStorage("jobseeker-chats", initialChats),
  
  sendChatMessage: (content) => {
    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      content,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [...get().chatMessages, newMsg];
    setLocalStorage("jobseeker-chats", updated);
    set({ chatMessages: updated });

    // Mock auto reply from company
    setTimeout(() => {
      const reply: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "company",
        content: "Terima kasih atas pesannya! Kami akan segera menghubungi Anda kembali.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      const withReply = [...get().chatMessages, reply];
      setLocalStorage("jobseeker-chats", withReply);
      set({ chatMessages: withReply });
    }, 1500);
  },

  editChatMessage: (id, newContent) => {
    const updated = get().chatMessages.map((msg: ChatMessage) => msg.id === id ? { ...msg, content: newContent } : msg);
    setLocalStorage("jobseeker-chats", updated);
    set({ chatMessages: updated });
  },

  deleteChatMessage: (id) => {
    const updated = get().chatMessages.filter((msg: ChatMessage) => msg.id !== id);
    setLocalStorage("jobseeker-chats", updated);
    set({ chatMessages: updated });
  },

  clearChatByContact: (contactId) => {
    setLocalStorage("jobseeker-chats", []);
    set({ chatMessages: [] });
  },

  setChatMessages: (messages) => {
    setLocalStorage("jobseeker-chats", messages);
    set({ chatMessages: messages });
  },
});
