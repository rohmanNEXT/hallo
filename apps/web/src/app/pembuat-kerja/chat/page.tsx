'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LuBuilding2 as Building2 } from 'react-icons/lu';
import dynamic from 'next/dynamic';
import withAuth from '@/hoc/withAuth';

const ChatTab = dynamic(() => import('./ChatTab'), { ssr: false });
const ChatSettingTab = dynamic(() => import('@/components/pembuat-kerja/dashboard/DashboardChat'), { ssr: false });

type ChatSubTab = 'chat' | 'chat-setting';
const VALID_TABS: ChatSubTab[] = ['chat', 'chat-setting'];

const ChatPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as ChatSubTab | null;
  const [activeTab, setActiveTab] = useState<ChatSubTab>('chat');

  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const pageContent = (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-8 h-auto overflow-hidden max-w-7xl">
        <section className="flex-1 min-w-0 h-full">
          <div className="w-full space-y-8">
            {activeTab === 'chat-setting' ? <ChatSettingTab /> : <ChatTab />}
          </div>
        </section>
      </div>
    </main>
  );

  return pageContent;
};

const ProtectedContent = withAuth(ChatPageContent);

const ChatPage: React.FC = () => {
  const container = (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Building2 className="h-8 w-8 text-primary animate-pulse" /></div>}>
      <ProtectedContent />
    </Suspense>
  );
  return container;
};

export default ChatPage;
