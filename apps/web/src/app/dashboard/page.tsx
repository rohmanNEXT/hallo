'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/store';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Bookmark,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Coins,
  Inbox,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Dashboard Components
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardProfile from '@/components/dashboard/DashboardProfile';
import DashboardChat from '@/components/dashboard/DashboardChat';
import DashboardApplications from '@/components/dashboard/DashboardApplications';
import DashboardBookmarks from '@/components/dashboard/DashboardBookmarks';
import DashboardSettings from '@/components/dashboard/DashboardSettings';
import DashboardOffers from '@/components/dashboard/DashboardOffers';
import Image from 'next/image';

type TabType =
  | 'overview'
  | 'profile'
  | 'chat'
  | 'lamaran'
  | 'bookmark'
  | 'settings'
  | 'tawaran';

function DashboardContent() {
  const { user, isLoggedIn, logout } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update active tab based on query param
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (
      tabParam &&
      [
        'overview',
        'profile',
        'chat',
        'lamaran',
        'bookmark',
        'settings',
        'tawaran',
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Handle Tab Switch
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileDrawerOpen(false);

    // Update URL query param without full page reload
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    router.push(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleLogout = () => {
    setIsMobileDrawerOpen(false);
    logout();
    router.push('/');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">
            Memuat Dasbor...
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Akses Ditolak</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
          Anda harus masuk (login) terlebih dahulu untuk mengakses dasbor.
        </p>
        <Button
          onClick={() => router.push('/')}
          className="h-9 cursor-pointer text-xs font-bold"
        >
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  // Menu items list
  const menuItems = [
    { id: 'overview', label: 'Dasbor', icon: LayoutDashboard },
    { id: 'bookmark', label: 'Bookmark', icon: Bookmark },
    { id: 'lamaran', label: 'Lamaran Saya', icon: Briefcase },
    { id: 'tawaran', label: 'Tawaran Kerja', icon: Inbox },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'profile', label: 'Profil Saya', icon: User },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview
            onNavigate={(tab) => handleTabChange(tab as TabType)}
          />
        );
      case 'profile':
        return (
          <DashboardProfile
            onNavigate={(tab) => handleTabChange(tab as TabType)}
          />
        );
      case 'chat':
        return <DashboardChat />;
      case 'lamaran':
        return (
          <DashboardApplications
            onNavigate={(tab) => handleTabChange(tab as TabType)}
          />
        );
      case 'tawaran':
        return (
          <DashboardOffers
            onNavigate={(tab) => handleTabChange(tab as TabType)}
          />
        );
      case 'bookmark':
        return <DashboardBookmarks />;
      case 'settings':
        return <DashboardSettings />;
      default:
        return (
          <DashboardOverview
            onNavigate={(tab) => handleTabChange(tab as TabType)}
          />
        );
    }
  };

  const getTabTitle = () => {
    const matched = menuItems.find((item) => item.id === activeTab);
    return matched ? matched.label : 'Dasbor';
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Mobile Header (Sticky top) */}
      <div className="md:hidden top-16 z-30 flex items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 h-14 w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-accent hover:text-foreground text-muted-foreground transition-all cursor-pointer"
          >
            <Menu className="h-5.5 w-5.5" />
          </button>
          <span className="font-extrabold text-sm tracking-tight">
            {getTabTitle()}
          </span>
        </div>
      </div>

      {/* Main Grid Layout with fixed height */}
      <div className="flex-1 w-full max-w-[90%] mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-8 h-[calc(100vh-180px)] md:h-[840px] min-h-[700px] overflow-hidden">
        {/* Left Sidebar (Desktop Only) */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 shrink-0 border border-border/70 bg-card p-4 rounded-3xl h-full shadow-xs justify-between">
          <div className="space-y-6">
            <div className="px-3.5 pt-2.5 pb-4 border-b flex items-center gap-2">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="h-11 w-11 rounded-full object-cover border border-border shadow-xs"
                />
              ) : (
                <div className="h-11 w-11 rounded-full bg-muted text-foreground flex items-center justify-center font-bold text-base border border-border">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-foreground truncate">
                  {user.name}
                </div>
                <div className="text-xs text-muted-foreground truncate font-medium mt-1 max-w-[110px] lg:max-w-[140px] block">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 block mb-4">
                Menu
              </span>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as TabType)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-extrabold shadow-sm border-white/20'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-7 border-t border-border/60">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5 shrink-0" />
              <span>Keluar</span>
            </button>
          </div>
        </aside>

        {/* Right Content Panel */}
        <section className="flex-1 min-w-0 h-full overflow-hidden">
          {renderActiveComponent()}
        </section>
      </div>

      {/* Mobile Sidebar Navigation Drawer Overlay */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black md:hidden"
              onClick={() => setIsMobileDrawerOpen(false)}
            />

            {/* Sidebar Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r p-5 flex flex-col justify-between shadow-2xl md:hidden"
            >
              <div className="space-y-6">
                {/* Header with Close */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2.5">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate mt-1">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Menu */}
                <div className="space-y-1.5">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id as TabType)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-primary text-primary-foreground font-extrabold'
                            : 'text-muted-foreground hover:bg-muted/55 hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom logout */}
              <div className="border-t pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Keluar</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground font-medium">
              Memuat...
            </p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
