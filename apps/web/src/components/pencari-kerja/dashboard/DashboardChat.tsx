'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/store';
import {
  LuSend as Send,
  LuSearch as Search,
  LuMessageSquare as MessageSquare,
  LuArrowLeft as ArrowLeft,
  LuTrash2 as Trash2,
  LuPaperclip as Paperclip,
} from 'react-icons/lu';
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

export default function DashboardChat() {
  const {
    user,
    chatMessages,
    sendChatMessage,
    editChatMessage,
    deleteChatMessage,
    clearChatByContact,
    setChatMessages,
  } = useAppStore();

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

  // Auto scroll to bottom
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMessages, activeContactId, showChatOnMobile]);

  useEffect(() => {
    setMounted(true);

    // Auto delete messages older than 1 year (365 days)
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const activeChats = chatMessages.filter((msg) => {
      const ts = Number(msg.id);
      if (isNaN(ts)) return true;
      return now - ts < oneYearInMs;
    });

    if (activeChats.length !== chatMessages.length) {
      setChatMessages(activeChats);
    }
  }, []);

  if (!user) return null;

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
    setHiddenMessages((prev) => new Set(prev).add(msgId));
  };

  return (
    <div className='h-[880px]'>
    <div className="bg-card border border-border/75 rounded-3xl p-2 shadow-md flex h-[595px] overflow-hidden animate-in fade-in duration-300">
      {/* Left Panel: Contacts List */}
      <div
        className={`w-full md:w-60 lg:w-72 border-r border-border/60 flex flex-col h-full bg-card/10 shrink-0 ${
          showChatOnMobile ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <span className="font-bold text-xs">Chat</span>
          <span className="text-[12px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold">
            {contacts.filter((c) => c.unread > 0).length} Baru
          </span>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-border/60">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari perusahaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary"
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
              className={`flex items-center gap-2 py-2 px-3 cursor-pointer transition-colors ${
                activeContactId === contact.id
                  ? 'bg-primary/5 border-l-4 border-primary'
                  : 'hover:bg-muted/60 border-l-4 border-transparent'
              }`}
            >
              {/* Logo */}
              <div className="relative h-8 w-8 bg-white border border-border/70 rounded-xl p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <span className="text-[12px] font-black text-muted-foreground">
                  {contact.logo}
                </span>
                {contact.online && (
                  <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-500 border border-card" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground truncate">
                    {contact.name}
                  </span>
                  <span className="text-[12px] text-muted-foreground/60">
                    {contact.time}
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground truncate mt-1 font-medium">
                  {contact.lastMessage}
                </p>
              </div>

              {/* Unread dot */}
              {contact.unread > 0 && (
                <span className="h-3.5 w-3.5 bg-primary text-primary-foreground text-[12px] font-bold rounded-full flex items-center justify-center shrink-0">
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
        <div className="p-3 border-b border-border/60 flex items-center justify-between bg-card/30">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setShowChatOnMobile(false)}
              className="md:hidden p-1 -ml-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <div className="h-8 w-8 bg-white border border-border/70 rounded-xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
              <span className="text-[12px] font-black text-muted-foreground">
                {activeContact.logo}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-foreground truncate">
                {activeContact.name}
              </h2>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${activeContact.online ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
                />
                <span className="text-[12px] text-muted-foreground font-medium">
                  {activeContact.online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Simulasi Hapus removed */}
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/10"
        >
          {activeContactId === 'techcorp' && chatMessages.length > 0 ? (
            chatMessages
              .filter((msg) => !hiddenMessages.has(msg.id))
              .map((msg) => {
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
                      className={`max-w-[80%] rounded-xl px-3 py-2 text-xs shadow-xs relative group ${
                        isUser
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-card border border-border/60 text-card-foreground rounded-tl-none'
                      }`}
                    >
                      {editingMessageId === msg.id ? (
                        <div className="space-y-1.5 min-w-[120px]">
                          <input
                            type="text"
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            className="bg-transparent border-b border-primary-foreground/50 text-white focus:outline-none w-full text-[12px]"
                            autoFocus
                          />
                          <div className="flex justify-end gap-1.5 text-[12px]">
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
                          <div className="flex items-center justify-between mt-1 gap-3 opacity-75 text-[12px]">
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
                                      if (
                                        confirm('Hapus pesan ini untuk semua?')
                                      ) {
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
              <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-xs font-bold text-muted-foreground">
                Tidak ada pesan
              </p>
              <p className="text-[12px] text-muted-foreground/80 mt-1">
                Ketik pesan di bawah untuk memulai percakapan.
              </p>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-border/60 bg-card/30">
          <form
            onSubmit={handleSendMessage}
            className="flex gap-2 items-center"
          >
            {/* Upload File */}
            <label
              className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl border border-border/60 bg-background hover:bg-primary/10 hover:border-primary/40 cursor-pointer transition-all group"
              title="Upload file"
            >
              <Paperclip className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              <input type="file" className="hidden" />
            </label>
            <Input
              placeholder="Tulis pesan..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="h-9 text-xs bg-background"
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 shrink-0 cursor-pointer border border-primary/30"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
