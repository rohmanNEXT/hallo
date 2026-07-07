'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ModerationProvider, useModeration } from './context';
import { Button } from '@/components/ui/button';
import {
  LuFileSearch as FileSearch,
  LuUserX as UserX,
  LuClipboardPen as ClipboardSignature,
  LuChevronRight as ChevronRight,
  LuSettings as Settings,
  LuBuilding2 as Building2,
  LuSparkles as Sparkles,
} from 'react-icons/lu';

const ModerationLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { user, aiModeration, setAiModeration } = useModeration();

  const menuItems = [
    {
      path: '/pembuat-kerja/moderation-center/review',
      label: 'Job Verification',
      icon: <FileSearch className="h-4 w-4 shrink-0" />,
    },
    {
      path: '/pembuat-kerja/moderation-center/companyverify',
      label: 'NIB Verification',
      icon: <Building2 className="h-4 w-4 shrink-0" />,
      divider: true,
    },
    {
      path: '/pembuat-kerja/moderation-center/appeals',
      label: 'Appeal Human',
      icon: <ClipboardSignature className="h-4 w-4 shrink-0" />,
      divider: true,
    },
    {
      path: '/pembuat-kerja/moderation-center/restriction',
      label: 'Account Suspicion',
      icon: <UserX className="h-4 w-4 shrink-0" />,
    },
    {
      path: '/pembuat-kerja/moderation-center/aiconfig',
      label: 'AI Config',
      icon: <Settings className="h-4 w-4 shrink-0" />,
    },
  ];

  return (
    <main className="bg-background py-12 px-4 sm:px-6 lg:px-8 text-foreground min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6 bg-card border border-border/70 p-5 rounded-3xl shadow-xs h-fit">
          <div className="pb-4 border-b border-border/60 flex items-center gap-2.5">
            {user?.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user?.name || 'Admin'}
                className="h-10 w-10 rounded-full object-cover border border-border shadow-xs shrink-0"
                width={100}
                height={100}
                unoptimized
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20 shrink-0">
                {user?.name?.charAt(0) || 'M'}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-extrabold text-sm text-foreground truncate">
                {user?.name || 'Moderator Admin'}
              </div>
              <div className="text-[12px] text-muted-foreground truncate font-medium mt-0.5">
                {user?.email || 'admin@jobstreet.com'}
              </div>
            </div>
          </div>

          {/* Menu Tabs */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <React.Fragment key={item.path}>
                  <Link
                    href={item.path}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer no-underline ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-extrabold shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/55 hover:text-foreground bg-transparent border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                  </Link>
                  {item.divider && <div className="border-b border-border/60 my-1.5" />}
                </React.Fragment>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border/60">
            <Button
              onClick={() => setAiModeration(!aiModeration)}
              className={`w-full h-9 font-bold text-xs cursor-pointer rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
                aiModeration
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 hover:border-emerald-500/30'
                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/15 hover:border-rose-500/30'
              }`}
            >
              <Sparkles
                className={`h-4 w-4 ${aiModeration ? 'animate-pulse text-emerald-500' : 'text-rose-500'}`}
              />
              <span>{aiModeration ? 'AI Scan On' : 'AI Scan Off'}</span>
            </Button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </main>
  );
};

export default function ModerationLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModerationProvider>
      <title>Moderation Center - JobStreet</title>
      <meta
        name="description"
        content="Pusat moderasi dan peninjauan kualitas lowongan, pembatasan akun, dan laporan pengguna."
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        button, 
        .button, 
        .badge, 
        [role="button"],
        button *,
        .cursor-pointer,
        .badge * {
          cursor: pointer !important;
        }
      `,
        }}
      />
      <ModerationLayoutContent>{children}</ModerationLayoutContent>
    </ModerationProvider>
  );
}
