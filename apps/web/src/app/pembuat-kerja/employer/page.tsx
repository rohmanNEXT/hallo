'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import {
  LuBuilding2 as Building2,
  LuCoins as Coins,
  LuSettings as Settings,
  LuChevronRight as ChevronRight,
  LuMenu as Menu,
  LuX as X,
  LuUser as User,
  LuSparkles as Sparkles,
  LuLogOut as LogOut,
  LuLayoutDashboard as LayoutDashboard,
  LuUsers as Users,
  LuBriefcase as Briefcase,
  LuMessageSquare as MessageSquare,
} from 'react-icons/lu';

import dynamic from 'next/dynamic';

const LowonganTab = dynamic(() => import('./LowonganTab'), { ssr: false });
const KandidatTab = dynamic(() => import('./KandidatTab'), { ssr: false });
const TalentTab = dynamic(() => import('./TalentTab'), { ssr: false });
const CoinCreditTab = dynamic(() => import('./CoinCreditTab'), { ssr: false });
const LanggananTab = dynamic(() => import('./LanggananTab'), { ssr: false });
const ProfileTab = dynamic(() => import('./ProfileTab'), { ssr: false });
const DashboardSettings = dynamic(() => import('./DashboardSettings'), {
  ssr: false,
});
const ChatTab = dynamic(() => import('./ChatTab'), { ssr: false });
const ChatSettingTab = dynamic(() => import('./ChatSettingTab'), {
  ssr: false,
});
const MultiUserTab = dynamic(() => import('./MultiUserTab'), { ssr: false });
import Sidebar from '@/components/pembuat-kerja/Sidebar';

const EmployerDashboardContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const { user, logout } = useAppStore();

  const [mounted, setMounted] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | 'lowongan'
    | 'kandidat'
    | 'talent'
    | 'profile'
    | 'langganan'
    | 'coin-credit'
    | 'pengaturan'
    | 'chat'
    | 'chat-setting'
    | 'multi-user'
  >('lowongan');

  // Sync tab from URL query params
  useEffect(() => {
    setMounted(true);
    if (
      tabParam &&
      [
        'lowongan',
        'kandidat',
        'talent',
        'profile',
        'langganan',
        'coin-credit',
        'pengaturan',
        'chat',
        'chat-setting',
        'multi-user',
      ].includes(tabParam)
    ) {
      if (
        user?.employerRole === 'HRD' &&
        !['kandidat', 'chat'].includes(tabParam)
      ) {
        setActiveTab('kandidat');
        router.push(`/pembuat-kerja/employer?tab=kandidat`);
      } else {
        setActiveTab(tabParam as any);
      }
    } else if (mounted) {
      if (user?.employerRole === 'HRD') {
        setActiveTab('kandidat');
        router.push(`/pembuat-kerja/employer?tab=kandidat`);
      } else {
        setActiveTab('lowongan');
      }
    }
  }, [tabParam, mounted, user, router]);

  const updateTabInUrl = (tab: string) => {
    setActiveTab(tab as any);
    router.push(`/pembuat-kerja/employer?tab=${tab}`);
  };

  const handleLogout = () => {
    setIsMobileDrawerOpen(false);
    logout();
    router.push('/');
  };

  const settingsMenuItems = [
    { id: 'profile', label: 'Profile Saya', icon: User },
    { id: 'langganan', label: 'Langganan', icon: Sparkles },
    { id: 'coin-credit', label: 'Coin & Credit', icon: Coins },
    { id: 'chat-setting', label: 'Chat', icon: MessageSquare },
    { id: 'multi-user', label: 'Multi User (HRD)', icon: Users },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const getTabTitle = () => {
    const matched = settingsMenuItems.find((item) => item.id === activeTab);
    if (matched) return matched.label;
    if (activeTab === 'lowongan') return 'Lowongan Saya';
    if (activeTab === 'kandidat') return 'Kandidat';
    if (activeTab === 'talent') return 'Talent Search';
    if (activeTab === 'chat') return 'Chat Kandidat';
    if (activeTab === 'multi-user') return 'Multi User';
    return 'Profile Saya';
  };

  if (!mounted || !user) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Building2 className="h-10 w-10 text-primary animate-bounce mx-auto" />
          <p className="text-slate-600 font-bold text-sm">
            Loading BlueJob Recruiter Dashboard...
          </p>
        </div>
      </main>
    );
  }

  const isSettingsTab = [
    'profile',
    'langganan',
    'coin-credit',
    'chat-setting',
    'multi-user',
    'pengaturan',
  ].includes(activeTab);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'lowongan':
        return <LowonganTab updateTabInUrl={updateTabInUrl} />;
      case 'kandidat':
        return <KandidatTab />;
      case 'talent':
        return <TalentTab updateTabInUrl={updateTabInUrl} />;
      case 'coin-credit':
        return <CoinCreditTab />;
      case 'langganan':
        return <LanggananTab />;
      case 'profile':
        return <ProfileTab />;
      case 'chat-setting':
        return <ChatSettingTab />;
      case 'pengaturan':
        return <DashboardSettings />;
      case 'chat':
        return <ChatTab />;
      case 'multi-user':
        return <MultiUserTab />;
      default:
        return user?.employerRole === 'HRD' ? (
          <KandidatTab />
        ) : (
          <LowonganTab updateTabInUrl={updateTabInUrl} />
        );
    }
  };

  const isHRD = user?.employerRole === 'HRD';

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {isSettingsTab && (
        <div className="md:hidden top-16 z-30 flex items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 h-14 w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-1.5 -ml-1.5 rounded-lg hover:bg-accent hover:text-foreground text-muted-foreground transition-all cursor-pointer bg-transparent border-none"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
            <span className="font-extrabold text-sm tracking-tight">
              {getTabTitle()}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-8 h-auto overflow-hidden max-w-7xl">
        {isSettingsTab && !isHRD && (
          <aside className="hidden md:flex flex-col w-56 lg:w-64 shrink-0 border border-border/70 bg-card p-4 rounded-3xl h-fit shadow-xs gap-5">
            <Sidebar
              user={user}
              items={settingsMenuItems}
              activeTab={activeTab}
              onTabChange={(id) => updateTabInUrl(id)}
              onLogout={handleLogout}
              menuTitle="Menu Rekruter"
            />
          </aside>
        )}

        <section className="flex-1 min-w-0 h-full">
          <div className="w-full space-y-8">{renderActiveTabContent()}</div>
        </section>
      </div>

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
              className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r p-5 flex flex-col justify-between shadow-2xl md:hidden"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="flex items-center justify-between border-b pb-4 mb-4 shrink-0">
                  <span className="font-extrabold text-sm">Dashboard</span>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1 hover:bg-muted rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <Sidebar
                    user={user}
                    items={settingsMenuItems}
                    activeTab={activeTab}
                    onTabChange={(id) => {
                      updateTabInUrl(id);
                      setIsMobileDrawerOpen(false);
                    }}
                    onLogout={handleLogout}
                    menuTitle="Menu Rekruter"
                  />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
};

const EmployerDashboard: React.FC = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Building2 className="h-8 w-8 text-primary animate-pulse" />
      </div>
    }
  >
    <EmployerDashboardContent />
  </Suspense>
);

export default EmployerDashboard;
