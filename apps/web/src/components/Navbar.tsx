'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  Search,
  Bookmark,
  MessageCircle,
  Download,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Send,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  BellRing,
  Coins,
  Sparkles,
  Check,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const {
    user,
    isLoggedIn,
    bookmarks,
    toggleBookmark,
    chatMessages,
    sendChatMessage,
    isChatOpen,
    setChatOpen,
    applications,
    setAuthModal,
    logout,
    theme,
    setTheme,
    upgradePlan,
  } = useAppStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Apply theme to DOM on initial load (matches Zustand store / localStorage)
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (
      ['dark', 'darkblue', 'charcoal', 'teal', 'emerald', 'burgundy'].includes(
        theme
      )
    ) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingWebOpen, setIsSettingWebOpen] = useState(false);
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [appTab, setAppTab] = useState<
    'Semua' | 'Interview' | 'Lulus' | 'Belum lulus'
  >('Semua');
  const [chatInput, setChatInput] = useState('');

  const closeAllOthers = (except: string) => {
    if (except !== 'profile') setIsProfileOpen(false);
    if (except !== 'bookmarks') setIsBookmarksOpen(false);
    if (except !== 'notifications') setIsNotificationsOpen(false);
    if (except !== 'chat') setChatOpen(false);
    if (except !== 'applications') setIsApplicationsOpen(false);
    if (except !== 'settingWeb') setIsSettingWebOpen(false);
    if (except !== 'coin') setIsCoinModalOpen(false);
    if (except !== 'plan') setIsPlanModalOpen(false);
    if (except !== 'mobileMenu') setIsMobileMenuOpen(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim());
    setChatInput('');
  };

  // Mock Job Data for bookmarks (matching mockJobs in JobSearch)
  const mockJobsMap: Record<
    string,
    { title: string; company: string; location: string }
  > = {
    '1': {
      title: 'Senior Software Engineer',
      company: 'TechCorp Indonesia',
      location: 'Jakarta Selatan',
    },
    '2': {
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Bandung',
    },
    '3': {
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      location: 'Jakarta Pusat',
    },
    '4': {
      title: 'Marketing Manager',
      company: 'GrowthHub',
      location: 'Surabaya',
    },
    '5': {
      title: 'Data Analyst',
      company: 'DataDriven Co',
      location: 'Yogyakarta',
    },
    '6': {
      title: 'Frontend Developer',
      company: 'WebTech Solutions',
      location: 'Jakarta Barat',
    },
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full border-b bg-background/60 backdrop-blur-md shadow-sm"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="w-full max-w-[90%] mx-auto px-4 md:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side - Logo & Nav */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">
                    J
                  </span>
                </div>
                <span className="font-bold text-xl tracking-tight">
                  JobSeeker
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                {user?.role === 'admin' ? (
                  <>
                    <Link
                      href="/employer"
                      className="text-sm font-semibold text-primary hover:underline transition-all"
                    >
                      Dasbor Pembuat Kerja
                    </Link>
                    <Link
                      href="/employer?tab=lowongan"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Lowongan Saya
                    </Link>
                    <Link
                      href="/employer?tab=kandidat"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Kandidat
                    </Link>
                    <Link
                      href="/employer?tab=talent"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Talent Search
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/jobs"
                      className="text-xs font-semibold hover:text-primary transition-colors"
                    >
                      Cari Lowongan
                    </Link>
                    <Link
                      href="/companies"
                      className="text-xs font-semibold hover:text-primary transition-colors"
                    >
                      Perusahaan
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Right side - User Actions & Panels */}
            <div className="flex items-center space-x-3">
              {/* Download App */}
              <Button
                variant={(!mounted || theme === 'white') ? 'default' : 'outline'}
                size="sm"
                className={`hidden sm:flex cursor-pointer ${(!mounted || theme === 'white') ? 'bg-[#017eb7] hover:bg-[#016a9a] text-white border' : ''}`}
                style={
                  (!mounted || theme === 'white')
                    ? { borderColor: '#017eb7' }
                    : undefined
                }
                onClick={() =>
                  alert(
                    'Unduh Aplikasi JobSeeker di Play Store atau App Store!',
                  )
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Download App
              </Button>

              {/* Chat Icon & Panel */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const nextState = !isChatOpen;
                    if (nextState) closeAllOthers('chat');
                    setChatOpen(nextState);
                  }}
                  className="relative"
                >
                  <MessageCircle className="h-5 w-5" />
                  {mounted && isLoggedIn && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[9px] text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </span>
                  )}
                </Button>

                {/* Chat Panel Glassmorphism */}
                {isChatOpen && (
                  <div
                    className="absolute right-[-100px] sm:right-0 mt-3 w-80 sm:w-96 rounded-xl border p-4 shadow-2xl z-50"
                    style={{
                      backgroundColor: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))',
                    }}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-semibold text-sm">
                          TechCorp Recruiter (Online)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setChatOpen(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Message List */}
                    <div className="h-60 overflow-y-auto space-y-3 pr-1 smooth-scroll mb-3">
                      {isLoggedIn ? (
                        chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col max-w-[80%] rounded-lg p-2.5 text-xs ${
                              msg.sender === 'user'
                                ? 'bg-primary text-primary-foreground ml-auto'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <span>{msg.content}</span>
                            <span className="text-[9px] text-right mt-1 opacity-70">
                              {msg.timestamp}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-8 text-sm">
                          Silakan login untuk memulai percakapan realtime.
                        </div>
                      )}
                    </div>

                    {/* Chat Input Form */}
                    {isLoggedIn && (
                      <form
                        onSubmit={handleSendChat}
                        className="flex gap-2 mt-3 border-t pt-3"
                      >
                        <Input
                          placeholder="Tulis pesan..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="h-8 text-xs"
                        />
                        <Button
                          type="submit"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Bookmark Icon & Panel */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const nextState = !isBookmarksOpen;
                    if (nextState) closeAllOthers('bookmarks');
                    setIsBookmarksOpen(nextState);
                  }}
                  className="relative"
                >
                  <Bookmark className="h-5 w-5" />
                  {mounted && bookmarks.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[9px] text-primary-foreground flex items-center justify-center font-bold">
                      {bookmarks.length}
                    </span>
                  )}
                </Button>

                {/* Bookmark Popover */}
                {isBookmarksOpen && (
                  <div
                    className="absolute right-[-60px] sm:right-0 mt-3 w-80 rounded-xl border p-4 shadow-2xl z-50"
                    style={{
                      backgroundColor: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))',
                    }}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <span className="font-semibold text-sm">
                        Pekerjaan Tersimpan ({bookmarks.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsBookmarksOpen(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-3 pr-1 smooth-scroll">
                      {bookmarks.length > 0 ? (
                        bookmarks.map((id) => {
                          const job = mockJobsMap[id] || {
                            title: 'Lowongan Kerja',
                            company: 'Perusahaan',
                            location: 'Indonesia',
                          };
                          return (
                            <div
                              key={id}
                              className="flex items-center justify-between border-b pb-2 text-xs"
                            >
                              <div className="min-w-0 pr-2">
                                <Link
                                  href={`/jobs/${id}`}
                                  className="font-bold hover:text-primary transition-colors block truncate"
                                  onClick={() => setIsBookmarksOpen(false)}
                                >
                                  {job.title}
                                </Link>
                                <span className="text-muted-foreground block truncate">
                                  {job.company} • {job.location}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive h-7 w-7 hover:bg-destructive/10"
                                onClick={() => toggleBookmark(id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-muted-foreground py-6 text-sm">
                          Belum ada lowongan tersimpan.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Icon & Panel */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const nextState = !isNotificationsOpen;
                    if (nextState) closeAllOthers('notifications');
                    setIsNotificationsOpen(nextState);
                  }}
                  className="relative"
                >
                  <BellRing className="h-5 w-5" />
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[9px] text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </span>
                </Button>

                {/* Notification Popover */}
                {isNotificationsOpen && (
                  <div
                    className="absolute right-[-60px] sm:right-0 mt-3 w-80 rounded-xl border p-4 shadow-2xl z-50"
                    style={{
                      backgroundColor: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))',
                    }}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <span className="font-semibold text-sm">Notifikasi</span>
                      <button
                        type="button"
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="border-b pb-2 text-xs">
                        <span className="font-bold text-foreground">
                          TechCorp Indonesia
                        </span>{' '}
                        status lamaran Anda diperbarui ke{' '}
                        <span className="text-amber-500 font-bold">
                          Interview
                        </span>
                        .
                        <span className="text-[10px] text-muted-foreground block mt-1">
                          1 jam yang lalu
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-foreground">
                          DesignStudio
                        </span>{' '}
                        status lamaran Anda diperbarui ke{' '}
                        <span className="text-emerald-500 font-bold">
                          Lulus
                        </span>
                        !
                        <span className="text-[10px] text-muted-foreground block mt-1">
                          1 hari yang lalu
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu Dropdown */}
              {!mounted ? (
                 <div className="w-16 h-8" />
              ) : isLoggedIn && user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 h-10 hover:bg-accent rounded-full cursor-pointer"
                    onClick={() => {
                      const nextState = !isProfileOpen;
                      if (nextState) closeAllOthers('profile');
                      setIsProfileOpen(nextState);
                    }}
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border-2 border-primary">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </Button>

                  {isProfileOpen && (
                    <div
                      className="absolute right-0 mt-3 w-60 rounded-xl border p-2 shadow-2xl z-50"
                      style={{
                        backgroundColor: 'hsl(var(--card))',
                        color: 'hsl(var(--card-foreground))',
                      }}
                    >
                      <div className="px-3 py-2 border-b mb-1">
                        <div className="flex items-center gap-2">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="h-7 w-7 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-xs truncate">
                              {user.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              user.role === 'admin'
                                ? 'bg-blue-500/15 text-blue-600'
                                : 'bg-emerald-500/15 text-emerald-600'
                            }`}
                          >
                            {user.role === 'admin'
                              ? '🏢 Pembuat Kerja'
                              : '🔍 Pencari Kerja'}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={user.role === 'admin' ? '/employer' : '/profile'}
                        className="flex items-center px-3 py-2 text-xs hover:bg-accent rounded-lg transition-colors cursor-pointer"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2.5 text-muted-foreground" />
                        {user.role === 'admin' ? 'Dasbor Saya' : 'Profil Saya'}
                      </Link>

                      {user.role === 'admin' ? (
                        <>
                          <div className="px-3 py-2 border-b">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                              <span>Plan: {user.plan}</span>
                              <span className="flex items-center gap-1 text-amber-500 font-bold">
                                <Coins className="h-3 w-3" />
                                {user.coins} Koin
                              </span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => {
                                  closeAllOthers('coin');
                                  setIsCoinModalOpen(true);
                                }}
                                className="flex-1 text-[10px] font-semibold py-1 px-2 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 transition-colors cursor-pointer"
                              >
                                Beli Koin
                              </button>
                              <button
                                onClick={() => {
                                  closeAllOthers('plan');
                                  setIsPlanModalOpen(true);
                                }}
                                className="flex-1 text-[10px] font-semibold py-1 px-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                              >
                                Upgrade Plan
                              </button>
                            </div>
                          </div>
                          <hr className="my-1 border-muted" />
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              closeAllOthers('applications');
                              setIsApplicationsOpen(true);
                            }}
                            className="flex w-full items-center px-3 py-2 text-xs hover:bg-accent rounded-lg text-left transition-colors cursor-pointer"
                          >
                            <FileText className="h-4 w-4 mr-2.5 text-muted-foreground" />
                            Lamaran Saya
                          </button>

                          <button
                            onClick={() => {
                              closeAllOthers('settingWeb');
                              setIsSettingWebOpen(true);
                            }}
                            className="flex w-full items-center px-3 py-2 text-xs hover:bg-accent rounded-lg text-left transition-colors cursor-pointer"
                          >
                            <Sparkles className="h-4 w-4 mr-2.5 text-muted-foreground" />
                            Setting Tema
                          </button>

                          <Link
                            href="/settings"
                            className="flex items-center px-3 py-2 text-xs hover:bg-accent rounded-lg transition-colors cursor-pointer"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="h-4 w-4 mr-2.5 text-muted-foreground" />
                            Setting App
                          </Link>
                        </>
                      )}

                      <hr className="my-1 border-muted" />

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2.5" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button size="sm" onClick={() => setAuthModal(true, 'login')}>
                  Masuk
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => {
                  const nextState = !isMobileMenuOpen;
                  if (nextState) closeAllOthers('mobileMenu');
                  setIsMobileMenuOpen(nextState);
                }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              {/* Mobile Menu Panel */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-16 left-0 right-0 border-b bg-background p-4 shadow-lg md:hidden flex flex-col gap-3 z-50"
                  >
                    {user?.role === 'admin' ? (
                      <>
                        <Link
                          href="/employer"
                          className="text-sm font-semibold hover:text-primary transition-colors py-2 border-b"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Dasbor Pembuat Kerja
                        </Link>
                        <Link
                          href="/employer?tab=lowongan"
                          className="text-sm font-semibold hover:text-primary transition-colors py-2 border-b"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Lowongan Saya
                        </Link>
                        <Link
                          href="/employer?tab=kandidat"
                          className="text-sm font-semibold hover:text-primary transition-colors py-2 border-b"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Kandidat
                        </Link>
                        <Link
                          href="/employer?tab=talent"
                          className="text-sm font-semibold hover:text-primary transition-colors py-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Talent Search
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/jobs"
                          className="text-sm font-semibold hover:text-primary transition-colors py-2 border-b"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Cari Lowongan
                        </Link>
                        <Link
                          href="/companies"
                          className="text-sm font-semibold hover:text-primary transition-colors py-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Perusahaan
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Applications Drawer/Modal */}
      <AnimatePresence>
        {isApplicationsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border bg-card p-6 shadow-2xl flex flex-col"
              style={{
                backgroundColor: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
              }}
            >
              <button
                type="button"
                onClick={() => setIsApplicationsOpen(false)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-bold">Status Lamaran Kerja Saya</h2>
                <p className="text-xs text-muted-foreground">
                  Pantau perkembangan status lamaran kerja Anda secara realtime
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b mb-6 overflow-x-auto gap-2">
                {(['Semua', 'Interview', 'Lulus', 'Belum lulus'] as const).map(
                  (tab) => {
                    const count =
                      tab === 'Semua'
                        ? applications.length
                        : applications.filter((a) => a.status === tab).length;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setAppTab(tab)}
                        className={`pb-2 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                          appTab === tab
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab} ({count})
                      </button>
                    );
                  },
                )}
              </div>

              <div className="flex-grow overflow-y-auto space-y-4 max-h-[50vh] pr-1 smooth-scroll">
                {applications.filter(
                  (a) => appTab === 'Semua' || a.status === appTab,
                ).length > 0 ? (
                  applications
                    .filter((a) => appTab === 'Semua' || a.status === appTab)
                    .map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 border rounded-xl hover:bg-accent/40 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground">
                            {app.logo}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">
                              {app.jobTitle}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {app.company} • Dilamar pada {app.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {app.status === 'Interview' && (
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/15">
                              <Clock className="h-3 w-3 mr-1" />
                              Interview
                            </Badge>
                          )}
                          {app.status === 'Lulus' && (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/15">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Lulus
                            </Badge>
                          )}
                          {app.status === 'Belum lulus' && (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15">
                              <XCircle className="h-3 w-3 mr-1" />
                              Gagal
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-xs font-semibold">
                    Belum ada lamaran terkirim.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL SETTING WEB (THEME SWITCHER FLOATING MODAL) */}
      <AnimatePresence>
        {isSettingWebOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <div
              className="absolute inset-0 bg-background/80"
              onClick={() => setIsSettingWebOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border bg-card p-6 shadow-2xl flex flex-col"
              style={{
                backgroundColor: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold">Pengaturan Tampilan</h2>
                    <p className="text-[10px] text-muted-foreground">
                      Sesuaikan tema warna dashboard Anda
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSettingWebOpen(false)}
                  className="rounded-full p-1.5 hover:bg-accent hover:text-foreground text-muted-foreground transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  {
                    id: 'white',
                    name: 'White Light',
                    color: 'bg-white border-2 text-black',
                  },
                  {
                    id: 'dark',
                    name: 'Black Dark',
                    color: 'bg-[#020617] border-2 border-white/20 text-white',
                  },
                  {
                    id: 'darkblue',
                    name: 'Cyber Dark',
                    color:
                      'bg-[#0b1329] border-2 border-cyan-500/30 text-cyan-400',
                  },
                  {
                    id: 'arctic',
                    name: 'Arctic Light',
                    color:
                      'bg-[#f0f9f9] border-2 border-teal-500/20 text-teal-800',
                  },
                  {
                    id: 'teal',
                    name: 'Teal Dark',
                    color:
                      'bg-[#041e1a] border-2 border-teal-500/30 text-teal-400',
                  },
                  {
                    id: 'charcoal',
                    name: 'Charcoal Minimal',
                    color:
                      'bg-[#150a1c] border-2 border-purple-500/20 text-purple-350',
                  },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id)}
                    className={`relative p-3 rounded-lg border text-left flex flex-col justify-between h-20 transition-all hover:bg-accent/40 ${
                      theme === th.id ? 'border-primary' : 'border-border'
                    }`}
                    style={{ backgroundColor: 'hsl(var(--background))' }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`h-2.5 w-6 rounded ${th.color}`} />
                      {theme === th.id && (
                        <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold tracking-wider">
                      {th.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t text-xs">
                <div>
                  <span className="text-muted-foreground">Active: </span>
                  <span className="font-bold text-primary capitalize">
                    {theme}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-[10px] font-semibold"
                  onClick={() => setTheme('white')}
                >
                  RESET DEFAULT
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DIALOG BELI KOIN */}
      <AnimatePresence>
        {isCoinModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-card text-card-foreground border rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <Coins className="h-4.5 w-4.5 text-amber-500" />
                  Top Up Koin Pekerjaan
                </h3>
                <button
                  onClick={() => setIsCoinModalOpen(false)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                Beli koin untuk melamar pekerjaan premium dan membuka profil
                talent terbaik.
              </p>

              <div className="grid grid-cols-1 gap-2.5 max-h-[50vh] overflow-y-auto pr-1 smooth-scroll">
                {[
                  {
                    amount: 50,
                    price: 75000,
                    desc: 'Paket Starter - Hemat 5%',
                  },
                  {
                    amount: 100,
                    price: 140000,
                    desc: 'Paket Popular - Hemat 10%',
                  },
                  {
                    amount: 200,
                    price: 250000,
                    desc: 'Paket Premium - Hemat 15%',
                  },
                  {
                    amount: 500,
                    price: 550000,
                    desc: 'Paket Ultimate - Hemat 20%',
                  },
                ].map((pack, idx) => (
                  <div
                    key={idx}
                    className="p-3 border rounded-lg hover:border-primary cursor-pointer flex justify-between items-center bg-card"
                    onClick={() => {
                      useAppStore.getState().buyCoins(pack.amount, pack.price);
                      setIsCoinModalOpen(false);
                      alert(
                        `Pengisian koin berhasil! +${pack.amount} Koin ditambahkan.`,
                      );
                    }}
                  >
                    <div>
                      <div className="font-bold text-sm">
                        {pack.amount} Koin
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {pack.desc}
                      </div>
                    </div>
                    <div className="font-bold text-sm text-primary">
                      Rp {pack.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full h-8 text-xs mt-4"
                onClick={() => setIsCoinModalOpen(false)}
              >
                Batal
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DIALOG UPGRADE PLAN */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-card text-card-foreground border rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-primary" />
                  Upgrade Plan Pekerjaan
                </h3>
                <button
                  onClick={() => setIsPlanModalOpen(false)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                Pilih plan langganan untuk mendapatkan akses lebih banyak fitur
                dan koin.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    name: 'Free',
                    coins: 0,
                    price: 0,
                    features: [
                      'Lihat Lowongan Kerja',
                      'Kirim Lamaran Dasar',
                      'Chat Terbatas',
                    ],
                  },
                  {
                    name: 'Starter',
                    coins: 100,
                    price: 150000,
                    features: [
                      'Semua Fitur Free',
                      '100 Koin Bulanan',
                      'Prioritas Lamaran',
                      'Scan AI 5x/bulan',
                    ],
                  },
                  {
                    name: 'Platinum',
                    coins: 300,
                    price: 450000,
                    features: [
                      'Semua Fitur Starter',
                      '300 Koin Bulanan',
                      'Prioritas Utama',
                      'Scan AI Unlimited',
                      'Rekomendasi Karir Personal',
                    ],
                  },
                ].map((pl, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-xl p-4 cursor-pointer hover:border-primary transition-all ${
                      user?.plan === pl.name
                        ? 'border-primary bg-primary/5'
                        : ''
                    }`}
                    onClick={() => {
                      upgradePlan(
                        pl.name as 'Free' | 'Starter' | 'Platinum',
                        pl.price,
                      );
                      alert(`Berhasil upgrade ke plan ${pl.name}!`);
                      setIsPlanModalOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <div>
                        <div className="font-bold text-sm">{pl.name} Plan</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Dapatkan {pl.coins} Koin
                        </div>
                      </div>
                      <div className="font-bold text-sm text-primary">
                        {pl.price === 0
                          ? 'Rp 0'
                          : `Rp ${pl.price.toLocaleString('id-ID')}/bln`}
                      </div>
                    </div>
                    <ul className="text-[10px] space-y-1 text-muted-foreground">
                      {pl.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full h-8 text-xs mt-4"
                onClick={() => setIsPlanModalOpen(false)}
              >
                Batal
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
