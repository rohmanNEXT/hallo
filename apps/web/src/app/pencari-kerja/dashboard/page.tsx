'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/store';
import {
  LuLayoutDashboard as LayoutDashboard,
  LuBriefcase as Briefcase,
  LuBookmark as Bookmark,
  LuMessageSquare as MessageSquare,
  LuInbox as Inbox,
  LuUser as User,
  LuSettings as Settings,
  LuLogOut as LogOut,
  LuMenu as Menu,
  LuX as X,
  LuChevronRight as ChevronRight,
} from 'react-icons/lu';

import dynamic from 'next/dynamic';

const DashboardOverview = dynamic(() => import('@/components/pencari-kerja/dashboard/DashboardOverview'), { ssr: false });
const DashboardApplications = dynamic(() => import('@/components/pencari-kerja/dashboard/DashboardApplications'), { ssr: false });
const DashboardBookmarks = dynamic(() => import('@/components/pencari-kerja/dashboard/DashboardBookmarks'), { ssr: false });
const DashboardChat = dynamic(() => import('@/components/pencari-kerja/dashboard/DashboardChat'), { ssr: false });
const DashboardOffers = dynamic(() => import('@/components/pencari-kerja/dashboard/DashboardOffers'), { ssr: false });
const DashboardProfile = dynamic(() => import('@/components/pencari-kerja/dashboard/DashboardProfile'), { ssr: false });
const DashboardSettings = dynamic(() => import('@/components/pencari-kerja/dashboard/DashboardSettings'), { ssr: false });
import Sidebar from '@/components/pencari-kerja/Sidebar';

type TabId =
  | 'beranda'
  | 'lamaran'
  | 'bookmark'
  | 'chat'
  | 'tawaran'
  | 'profile'
  | 'pengaturan';

const VALID_TABS: TabId[] = [
  'beranda',
  'lamaran',
  'bookmark',
  'chat',
  'tawaran',
  'profile',
  'pengaturan',
];

const SIDEBAR_ITEMS = [
  { id: 'beranda' as TabId, label: 'Beranda', icon: LayoutDashboard },
  { id: 'lamaran' as TabId, label: 'Lamaran', icon: Briefcase },
  { id: 'tawaran' as TabId, label: 'Tawaran Kerja', icon: Inbox },
  { id: 'bookmark' as TabId, label: 'Bookmark', icon: Bookmark },
  { id: 'chat' as TabId, label: 'Chat', icon: MessageSquare },
  { id: 'profile' as TabId, label: 'Profil Saya', icon: User },
  { id: 'pengaturan' as TabId, label: 'Pengaturan', icon: Settings },
];

function PencariDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const { user, logout } = useAppStore();

  const [mounted, setMounted] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('beranda');

  useEffect(() => {
    setMounted(true);
    if (tabParam && VALID_TABS.includes(tabParam as TabId)) {
      setActiveTab(tabParam as TabId);
    }
  }, [tabParam]);

  const updateTab = (tab: TabId) => {
    setActiveTab(tab);
    router.push(`/pencari-kerja/dashboard?tab=${tab}`);
  };

  const handleLogout = () => {
    setIsMobileDrawerOpen(false);
    logout();
    router.push('/');
  };

  const getTabTitle = () => {
    return SIDEBAR_ITEMS.find((i) => i.id === activeTab)?.label ?? 'Beranda';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'beranda':
        return <DashboardOverview onNavigate={(t) => updateTab(t as TabId)} />;
      case 'lamaran':
        return (
          <DashboardApplications onNavigate={(t) => updateTab(t as TabId)} />
        );
      case 'bookmark':
        return <DashboardBookmarks />;
      case 'chat':
        return <DashboardChat />;
      case 'tawaran':
        return <DashboardOffers onNavigate={(t) => updateTab(t as TabId)} />;
      case 'profile':
        return <DashboardProfile onNavigate={(t) => updateTab(t as TabId)} />;
      case 'pengaturan':
        return <DashboardSettings />;
      default:
        return <DashboardOverview onNavigate={(t) => updateTab(t as TabId)} />;
    }
  };

  if (!mounted || !user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <User className="h-10 w-10 text-primary animate-bounce mx-auto" />
          <p className="text-muted-foreground font-bold text-sm">
            Memuat Dashboard...
          </p>
        </div>
      </main>
    );
  }

  const SidebarContent = () => (
    <Sidebar
      user={user}
      items={SIDEBAR_ITEMS}
      activeTab={activeTab}
      onTabChange={(id) => {
        updateTab(id);
        setIsMobileDrawerOpen(false);
      }}
      onLogout={handleLogout}
    />
  );

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-16 z-30 flex items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 h-14 w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-accent hover:text-foreground text-muted-foreground transition-all cursor-pointer bg-transparent border-none"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-extrabold text-sm tracking-tight">
            {getTabTitle()}
          </span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-8 h-auto overflow-hidden max-w-[90%]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 shrink-0 border border-border/70 bg-card p-4 rounded-3xl shadow-xs h-fit">
          <SidebarContent />
        </aside>

        {/* Content Area */}
        <section className="flex-1 min-w-0 h-full">
          <div className="w-full">
            <div className={activeTab === 'beranda' ? '' : 'hidden'}>
              <DashboardOverview onNavigate={(t) => updateTab(t as TabId)} />
            </div>
            <div className={activeTab === 'lamaran' ? '' : 'hidden'}>
              <DashboardApplications onNavigate={(t) => updateTab(t as TabId)} />
            </div>
            <div className={activeTab === 'bookmark' ? '' : 'hidden'}>
              <DashboardBookmarks />
            </div>
            <div className={activeTab === 'chat' ? '' : 'hidden'}>
              <DashboardChat />
            </div>
            <div className={activeTab === 'tawaran' ? '' : 'hidden'}>
              <DashboardOffers onNavigate={(t) => updateTab(t as TabId)} />
            </div>
            <div className={activeTab === 'profile' ? '' : 'hidden'}>
              <DashboardProfile onNavigate={(t) => updateTab(t as TabId)} />
            </div>
            <div className={activeTab === 'pengaturan' ? '' : 'hidden'}>
              <DashboardSettings />
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Drawer */}
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
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r p-5 flex flex-col shadow-2xl md:hidden"
            >
              {/* Mobile Close */}
              <div className="flex items-center justify-between border-b pb-3 mb-4 shrink-0">
                <span className="font-extrabold text-sm">Dashboard</span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function PencariDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <User className="h-8 w-8 text-primary animate-pulse" />
        </div>
      }
    >
      <PencariDashboardContent />
    </Suspense>
  );
}
