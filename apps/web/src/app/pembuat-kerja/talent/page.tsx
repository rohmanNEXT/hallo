'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { LuBuilding2 as Building2 } from 'react-icons/lu';
import dynamic from 'next/dynamic';
import withAuth from '@/hoc/withAuth';

const TalentTab = dynamic(() => import('./TalentTab'), { ssr: false });

const TalentPageContent: React.FC = () => {
  const router = useRouter();

  const handleTabNavigation = (tab: string) => {
    if (['lowongan', 'kandidat', 'talent', 'chat'].includes(tab)) {
      router.push(`/pembuat-kerja/${tab}`);
    } else if (tab === 'profile' || tab === 'verifikasi') {
      router.push('/pembuat-kerja/dashboard?tab=profile');
    } else if (['langganan', 'coin-credit', 'chat-setting', 'multi-user', 'pengaturan'].includes(tab)) {
      router.push(`/pembuat-kerja/dashboard?tab=${tab}`);
    } else {
      router.push(`/pembuat-kerja/lowongan`);
    }
  };

  const pageContent = (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-8 h-auto overflow-hidden max-w-7xl">
        <section className="flex-1 min-w-0 h-full">
          <div className="w-full space-y-8">
            <TalentTab updateTabInUrl={handleTabNavigation} />
          </div>
        </section>
      </div>
    </main>
  );

  return pageContent;
};

const ProtectedContent = withAuth(TalentPageContent, undefined, { role: 'HRD', redirectTo: '/pembuat-kerja/kandidat' });

const TalentPage: React.FC = () => {
  const container = (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Building2 className="h-8 w-8 text-primary animate-pulse" /></div>}>
      <ProtectedContent />
    </Suspense>
  );
  return container;
};

export default TalentPage;
