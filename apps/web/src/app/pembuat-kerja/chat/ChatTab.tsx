'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/store';
import { mockTalents } from '@/lib/mockTalents';
import {
  LuSend as Send,
  LuSearch as Search,
  LuMessageSquare as MessageSquare,
  LuArrowLeft as ArrowLeft,
  LuPaperclip as Paperclip,
  LuArrowUpDown as ArrowUpDown,
  LuUser as User,
  LuSettings as Settings,
} from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import MultiSelectJob from '@/components/ui/multi-select-job';
import { calculateHalloScore } from '../kandidat/KandidatTab';
import Image from 'next/image';
import LoadingSpinner from '@/components/ui/loading-spinner';

const ChatTab: React.FC = () => {
  const {
    user,
    employerApplications,
    employerJobs,
    hrdAccounts,
    sendCandidateMessage,
  } = useAppStore();

  const activeHrd = user?.employerRole === 'HRD' ? hrdAccounts.find(h => h.id === user.hrdId) : null;
  const filteredAppsByRole = activeHrd
    ? employerApplications.filter(app => activeHrd.assignedJobIds.includes(app.jobId))
    : employerApplications;

  const router = useRouter();
  const searchParams = useSearchParams();
  const appIdParam = searchParams.get('appId');

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [chatSorting, setChatSorting] = useState<'Terbaru' | 'Terlama' | 'Score'>('Terbaru');
  const [isChatSortOpen, setIsChatSortOpen] = useState(false);

  // Map applications to contacts with talent info
  const contacts = filteredAppsByRole
    .map((app) => {
      const job = employerJobs.find((j) => j.id === app.jobId);
      // Chat otomatis terhapus/tidak tampil saat lowongan tidak aktif (habis masanya)
      if (!job || job.status !== 'aktif') return null;

      const talent = mockTalents.find((t) => t.id === app.talentId);
      const lastMsg = app.chatHistory && app.chatHistory.length > 0
        ? app.chatHistory[app.chatHistory.length - 1]
        : null;
      return {
        id: app.id,
        name: talent?.name || 'Kandidat',
        avatar: talent?.avatar || '',
        title: talent?.title || 'Pelamar',
        lastMessage: lastMsg ? lastMsg.content : 'Belum ada percakapan',
        time: lastMsg ? lastMsg.timestamp.split(', ')[0] : app.date,
        online: true,
        jobId: app.jobId,
        score: calculateHalloScore(talent, job),
      };
    })
    .filter((contact): contact is NonNullable<typeof contact> => contact !== null)
    .filter((contact) => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesJob = selectedJobIds.length === 0 || selectedJobIds.includes(contact.jobId);
      return matchesSearch && matchesJob;
    });

  const sortedContacts = [...contacts].sort((a, b) => {
    if (chatSorting === 'Terbaru') return b.id.localeCompare(a.id);
    if (chatSorting === 'Terlama') return a.id.localeCompare(b.id);
    if (chatSorting === 'Score') return b.score - a.score;
    return 0;
  });

  // Auto scroll to bottom
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [filteredAppsByRole, activeAppId, showChatOnMobile]);

  useEffect(() => {
    setMounted(true);
    if (appIdParam) {
      setActiveAppId(appIdParam);
    } else if (filteredAppsByRole.length > 0) {
      setActiveAppId(filteredAppsByRole[0].id);
    }
  }, [filteredAppsByRole, appIdParam]);

  if (!mounted || !user) return <LoadingSpinner />;

  const activeApp = filteredAppsByRole.find((app) => {
    if (app.id !== activeAppId) return false;
    const job = employerJobs.find((j) => j.id === app.jobId);
    return job && job.status === 'aktif';
  });
  const activeTalent = activeApp ? mockTalents.find((t) => t.id === activeApp.talentId) : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeAppId) return;

    sendCandidateMessage(activeAppId, chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="h-[880px]">
      <div className="bg-card border border-border/75 rounded-3xl p-2 shadow-md flex h-[595px] overflow-hidden animate-in fade-in duration-300">
        {/* Left Panel: Contacts List */}
        <div
          className={`w-full md:w-60 lg:w-72 border-r border-border/60 flex flex-col h-full bg-card/10 shrink-0 ${
            showChatOnMobile ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-border/60 flex items-center justify-between relative">
            <span className="font-bold text-xs">Chat Kandidat</span>
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={() => setIsChatSortOpen(!isChatSortOpen)}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer text-muted-foreground hover:text-foreground border border-transparent bg-transparent"
                title="Urutkan Chat"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => router.push('/pembuat-kerja/chat?tab=chat-setting')}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer text-muted-foreground hover:text-foreground border border-transparent bg-transparent ml-0.5"
                title="Pengaturan Auto Chat"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              {isChatSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-99"
                    onClick={() => setIsChatSortOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 z-100 w-44 rounded-xl border border-border bg-card shadow-xl py-1 text-foreground animate-in fade-in slide-in-from-top-2 duration-150 text-[12px] font-bold">
                    {[
                      { value: 'Terbaru', label: 'Terbaru' },
                      { value: 'Terlama', label: 'Terlama' },
                      { value: 'Score', label: 'Talent Match' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setChatSorting(opt.value as any);
                          setIsChatSortOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 hover:bg-muted cursor-pointer transition-colors duration-150 border-none bg-transparent ${
                          chatSorting === opt.value
                            ? 'text-primary font-black bg-muted/40'
                            : 'text-foreground'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-border/60">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari kandidat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <MultiSelectJob
                selectedJobIds={selectedJobIds}
                onChange={setSelectedJobIds}
                jobs={employerJobs}
                isIconTrigger={true}
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/40 font-semibold">
            {sortedContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => {
                  setActiveAppId(contact.id);
                  setShowChatOnMobile(true);
                }}
                className={`flex items-center gap-2 py-2 px-3 cursor-pointer transition-colors ${
                  activeAppId === contact.id
                    ? 'bg-primary/5 border-l-4 border-primary'
                    : 'hover:bg-muted/60 border-l-4 border-transparent'
                }`}
              >
                {/* Avatar */}
                <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0">
                  {contact.avatar && !contact.avatar.includes('default-avatar') && !contact.avatar.includes('placeholder') ? (
                    <>
                      <Image
                        src={contact.avatar}
                        alt={contact.name}
                        className="h-full w-full object-cover"
                        width={100}
                        height={100}
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="avatar-fallback hidden absolute inset-0 items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black uppercase">
                        {contact.name?.[0] || '?'}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black uppercase">
                      {contact.name?.[0] || '?'}
                    </div>
                  )}
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
                    <span className="text-[10px] text-muted-foreground/60">
                      {contact.time}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5 font-medium">
                    {contact.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5 italic">
                    {contact.lastMessage}
                  </p>
                </div>
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
          {activeApp && activeTalent ? (
            <>
              {/* Header */}
              <div className="p-3 border-b border-border/60 flex items-center justify-between bg-card/30">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => setShowChatOnMobile(false)}
                    className="md:hidden p-1 -ml-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>
                  <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 relative">
                    {activeTalent.avatar && !activeTalent.avatar.includes('default-avatar') && !activeTalent.avatar.includes('placeholder') ? (
                      <>
                        <Image
                          src={activeTalent.avatar}
                          alt={activeTalent.name}
                          className="h-full w-full object-cover"
                          width={100}
                          height={100}
                          unoptimized
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback') as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="avatar-fallback hidden absolute inset-0 items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black uppercase">
                          {activeTalent.name?.[0] || '?'}
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black uppercase">
                        {activeTalent.name?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs font-bold text-foreground truncate">
                      {activeTalent.name}
                    </h2>
                    <p className="text-[10px] text-primary font-bold truncate">
                      {activeTalent.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/10"
              >
                {activeApp.chatHistory && activeApp.chatHistory.length > 0 ? (
                  activeApp.chatHistory.map((msg: any, idx: number) => {
                    const isCompany = msg.sender === 'company';
                    return (
                      <div
                        key={idx}
                        className={`flex ${isCompany ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-xl px-3 py-2 text-xs shadow-xs relative group ${
                            isCompany
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-card border border-border/60 text-card-foreground rounded-tl-none'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                          <div className="flex items-center justify-between mt-1 gap-3 opacity-75 text-[8px]">
                            <span>{msg.timestamp}</span>
                          </div>
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
                    <p className="text-[10px] text-muted-foreground/80 mt-1">
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
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-xs font-bold text-muted-foreground">
                Pilih percakapan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatTab;
