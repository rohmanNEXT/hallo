'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  Send,
  Search,
  MessageSquare,
  Info,
  ArrowLeft,
  Trash2,
  Edit2,
  Paperclip,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Contact {
  id: string;
  name: string;
  logo: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export default function ChatPage() {
  const {
    user,
    chatMessages,
    sendChatMessage,
    editChatMessage,
    deleteChatMessage,
    clearChatByContact,
    setChatMessages,
  } = useAppStore();

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContactId, setActiveContactId] = useState('techcorp');
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  const [hiddenMessages, setHiddenMessages] = useState<Set<string>>(new Set());

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Static mock contacts
  const contacts: Contact[] = [
    {
      id: 'techcorp',
      name: 'TechCorp Indonesia',
      logo: 'TC',
      lastMessage:
        chatMessages.length > 0
          ? chatMessages[chatMessages.length - 1].content
          : 'Halo Budi, terima kasih...',
      time:
        chatMessages.length > 0
          ? chatMessages[chatMessages.length - 1].timestamp
          : '10:40',
      unread: 0,
      online: true,
    },
    {
      id: 'designstudio',
      name: 'DesignStudio',
      logo: 'DS',
      lastMessage: 'Desain portofolio Anda sangat menarik.',
      time: 'Kemarin',
      unread: 1,
      online: false,
    },
    {
      id: 'datadriven',
      name: 'DataDriven Co',
      logo: 'DD',
      lastMessage: 'Kapan ada waktu untuk technical test?',
      time: 'Senin',
      unread: 0,
      online: true,
    },
  ];

  // Auto scroll to bottom of the chat box without scrolling the page window
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMessages, activeContactId, showChatOnMobile]);

  // Clean old chats (> 1 year) and setup mount status
  useEffect(() => {
    setMounted(true);

    // Auto delete messages older than 1 year (365 days)
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const activeChats = chatMessages.filter((msg) => {
      const ts = Number(msg.id);
      if (isNaN(ts)) return true; // Keep default mock messages
      return now - ts < oneYearInMs;
    });

    if (activeChats.length !== chatMessages.length) {
      setChatMessages(activeChats);
    }
  }, []);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">
            Memuat Obrolan...
          </p>
        </div>
      </div>
    );
  }

  const activeContact =
    contacts.find((c) => c.id === activeContactId) || contacts[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (activeContactId === 'techcorp') {
      sendChatMessage(chatInput.trim());
    } else {
      alert(
        'Fitur demo hanya berlaku untuk percakapan utama TechCorp Indonesia.',
      );
    }
    setChatInput('');
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isWithinFourHours = (msgId: string) => {
    const ts = Number(msgId);
    if (isNaN(ts)) return false;
    return Date.now() - ts < 4 * 60 * 60 * 1000;
  };

  const hideMessageForMe = (msgId: string) => {
    setHiddenMessages(prev => new Set(prev).add(msgId));
  };

  return (
    <main className="h-screen flex flex-col bg-background pt-10 pb-8 px-6 md:px-12 text-foreground overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col flex-1 w-full space-y-6 overflow-hidden min-h-0">
        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Chat
        </h1>

        {/* Chat Container Card */}
        <div className="bg-card border border-border/70 rounded-2xl shadow-sm flex flex-1 overflow-hidden">
          {/* Left Panel: Contacts List */}
          <div
            className={`w-full md:w-64 lg:w-72 border-r border-border/60 flex flex-col h-full bg-card/10 shrink-0 ${
              showChatOnMobile ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-border/60 flex items-center justify-between">
              <span className="font-bold text-sm">Pesan</span>
              <span className="text-xs bg-primary/15 text-primary px-2.5 py-1 rounded-full font-bold">
                {contacts.filter((c) => c.unread > 0).length} Baru
              </span>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-border/60">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari perusahaan..."
                  className="pl-9 h-9 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Contacts */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setActiveContactId(contact.id);
                    setShowChatOnMobile(true);
                  }}
                  className={`flex items-center gap-2.5 py-2.5 px-3.5 cursor-pointer transition-colors ${
                    activeContactId === contact.id
                      ? 'bg-primary/5 border-l-4 border-primary'
                      : 'hover:bg-muted/60 border-l-4 border-transparent'
                  }`}
                >
                  {/* Logo */}
                  <div className="relative h-9 w-9 bg-white border border-border/70 rounded-xl p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                    <span className="text-[10px] font-black text-muted-foreground">
                      {contact.logo}
                    </span>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-card" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground truncate">
                        {contact.name}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60">
                        {contact.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1 font-medium">
                      {contact.lastMessage}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {contact.unread > 0 && (
                    <span className="h-3.5 w-3.5 bg-primary text-primary-foreground text-[8px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {contact.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Chat Room */}
          <div
            className={`flex-1 flex flex-col h-full bg-card/5 ${
              !showChatOnMobile ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-card/30">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setShowChatOnMobile(false)}
                  className="md:hidden p-1 -ml-1 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="h-10 w-10 bg-white border border-border/70 rounded-xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                  <span className="text-xs font-black text-muted-foreground">
                    {activeContact.logo}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-foreground truncate">
                    {activeContact.name}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`h-2 w-2 rounded-full ${activeContact.online ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
                    />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {activeContact.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Simulation Button removed */}
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/20"
            >
              {activeContactId === 'techcorp' && chatMessages.length > 0 ? (
                chatMessages.filter(msg => !hiddenMessages.has(msg.id)).map((msg) => {
                  const isUser = msg.sender === 'user';
                  const isLastMessage =
                    chatMessages[chatMessages.length - 1]?.id === msg.id;
                  const withinWindow = isUser && isWithinFourHours(msg.id);
                  const canEdit = withinWindow;
                  const canDelete = withinWindow && isLastMessage;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs md:text-sm shadow-xs relative group ${
                          isUser
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-card border border-border/60 text-card-foreground rounded-tl-none'
                        }`}
                      >
                        {editingMessageId === msg.id ? (
                          <div className="space-y-2 min-w-[150px]">
                            <input
                              type="text"
                              value={editInput}
                              onChange={(e) => setEditInput(e.target.value)}
                              className="bg-transparent border-b border-primary-foreground/50 text-white focus:outline-none w-full text-xs"
                              autoFocus
                            />
                            <div className="flex justify-end gap-1.5 text-[10px]">
                              <button
                                onClick={() => {
                                  if (editInput.trim()) {
                                    editChatMessage(msg.id, editInput.trim());
                                  }
                                  setEditingMessageId(null);
                                }}
                                className="font-bold underline cursor-pointer text-white"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={() => setEditingMessageId(null)}
                                className="font-bold underline cursor-pointer opacity-80 text-white"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>
                            <div className="flex items-center justify-between mt-1 gap-4 opacity-75 text-[9px]">
                              <span>{msg.timestamp}</span>
                              {isUser && (
                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {canEdit && (
                                    <button
                                      onClick={() => {
                                        setEditingMessageId(msg.id);
                                        setEditInput(msg.content);
                                      }}
                                      className="hover:underline cursor-pointer font-bold text-blue-200"
                                    >
                                      Edit
                                    </button>
                                  )}
                                  {canDelete && (
                                    <button
                                      onClick={() => {
                                        if (confirm('Hapus pesan ini untuk semua?')) {
                                          deleteChatMessage(msg.id);
                                        }
                                      }}
                                      className="hover:underline cursor-pointer font-bold text-rose-300"
                                    >
                                      Hapus
                                    </button>
                                  )}
                                  <button
                                    onClick={() => hideMessageForMe(msg.id)}
                                    className="hover:underline cursor-pointer font-bold text-muted-foreground/80"
                                  >
                                    Hapus untuk Saya
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/60 mb-2" />
                  <p className="text-sm font-semibold text-muted-foreground">
                    Tidak ada pesan
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    Ketik pesan di bawah untuk memulai percakapan.
                  </p>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border/60 bg-card/30">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                {/* Upload File Button */}
                <label
                  className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl border border-border/60 bg-background hover:bg-primary/10 hover:border-primary/40 cursor-pointer transition-all group"
                  title="Upload file"
                >
                  <Paperclip className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <input type="file" className="hidden" />
                </label>
                <Input
                  placeholder="Tulis pesan..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="h-10 text-xs md:text-sm bg-background"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 shrink-0 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
