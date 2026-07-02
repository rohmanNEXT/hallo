'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/store';
import {
  LuBuilding2 as Building2,
  LuCoins as Coins,
  LuSettings as Settings,
  LuMenu as Menu,
  LuX as X,
  LuUser as User,
  LuSparkles as Sparkles,
  LuMessageSquare as MessageSquare,
  LuUsers as Users,
} from 'react-icons/lu';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/pembuat-kerja/Sidebar';
import withAuth from '@/hoc/withAuth';

const DashboardSettings = dynamic(() => import('@/components/pembuat-kerja/dashboard/DashboardSettings'), { ssr: false });
const DashboardLangganan = dynamic(() => import('@/components/pembuat-kerja/dashboard/DashboardLangganan'), { ssr: false });
const DashboardCoinCredit = dynamic(() => import('@/components/pembuat-kerja/dashboard/DashboardCoinCredit'), { ssr: false });
const DashboardMultiUser = dynamic(() => import('@/components/pembuat-kerja/dashboard/DashboardMultiUser'), { ssr: false });
const DashboardProfile = dynamic(() => import('@/components/pembuat-kerja/dashboard/DashboardProfile'), { ssr: false });
const DashboardChat = dynamic(() => import('@/components/pembuat-kerja/dashboard/DashboardChat'), { ssr: false });

type DashboardTab = 'profile' | 'langganan' | 'coin-credit' | 'chat-setting' | 'multi-user' | 'pengaturan';
const VALID_TABS: DashboardTab[] = ['profile', 'langganan', 'coin-credit', 'chat-setting', 'multi-user', 'pengaturan'];

const settingsMenuItems = [
  { id: 'profile', label: 'Profile Saya', icon: User },
  { id: 'langganan', label: 'Langganan', icon: Sparkles },
  { id: 'coin-credit', label: 'Coin & Credit', icon: Coins },
  { id: 'chat-setting', label: 'Chat', icon: MessageSquare },
  { id: 'multi-user', label: 'Multi User (HRD)', icon: Users },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
];

const EmployerDashboardContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as DashboardTab | null;
  const { user, logout } = useAppStore();

  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const isHRD = user?.employerRole === 'HRD';

  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const updateTabInUrl = (tab: string) => {
    setActiveTab(tab as DashboardTab);
    router.push(`/pembuat-kerja/dashboard?tab=${tab}`);
  };

  const handleLogout = () => {
    setIsMobileDrawerOpen(false);
    logout();
    router.push('/');
  };

  const getTabTitle = () =>
    settingsMenuItems.find((item) => item.id === activeTab)?.label ?? 'Dashboard';

  const renderContent = () => {
    let element = <DashboardSettings />;
    if (activeTab === 'profile') {
      element = <DashboardProfile />;
    } else if (activeTab === 'langganan') {
      element = <DashboardLangganan />;
    } else if (activeTab === 'coin-credit') {
      element = <DashboardCoinCredit />;
    } else if (activeTab === 'chat-setting') {
      element = <DashboardChat />;
    } else if (activeTab === 'multi-user') {
      element = <DashboardMultiUser />;
    }
    return element;
  };

  const pageContent = (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {!isHRD && (
        <div className="md:hidden top-16 z-30 flex items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 h-14 w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-1.5 -ml-1.5 rounded-lg hover:bg-accent hover:text-foreground text-muted-foreground transition-all cursor-pointer bg-transparent border-none"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
            <span className="font-extrabold text-sm tracking-tight">{getTabTitle()}</span>
          </div>
        </div>
      )}

      <div className="flex-1 w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-8 h-auto overflow-hidden max-w-7xl">
        {!isHRD && (
          <aside className="hidden md:flex flex-col w-56 lg:w-64 shrink-0 border border-border/70 bg-card p-4 rounded-3xl h-fit shadow-xs gap-5">
            <Sidebar
              user={user!}
              items={settingsMenuItems}
              activeTab={activeTab}
              onTabChange={(id) => updateTabInUrl(id)}
              onLogout={handleLogout}
              menuTitle="Menu Rekruter"
            />
          </aside>
        )}

        <section className="flex-1 min-w-0 h-full">
          <div className="w-full space-y-8">{renderContent()}</div>
        </section>
      </div>

      <AnimatePresence>
        {isMobileDrawerOpen && !isHRD && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black md:hidden"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
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
                    user={user!}
                    items={settingsMenuItems}
                    activeTab={activeTab}
                    onTabChange={(id) => { updateTabInUrl(id); setIsMobileDrawerOpen(false); }}
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

  return pageContent;
};

const ProtectedContent = withAuth(EmployerDashboardContent);

const EmployerDashboard: React.FC = () => {
  const container = (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Building2 className="h-8 w-8 text-primary animate-pulse" /></div>}>
      <ProtectedContent />
    </Suspense>
  );
  return container;
};

export default EmployerDashboard;
