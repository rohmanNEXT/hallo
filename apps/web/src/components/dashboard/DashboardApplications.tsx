'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/store';
import {
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Info,
  MessageSquare,
  Search,
  ShieldCheck,
} from 'lucide-react';
import axios from 'axios';
import { Job } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface DashboardApplicationsProps {
  onNavigate?: (tab: string) => void;
}

export default function DashboardApplications({
  onNavigate,
}: DashboardApplicationsProps) {
  const router = useRouter();
  const { user, applications } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [activeAppTab, setActiveAppTab] = useState<
    'Semua' | 'Interview' | 'Lulus' | 'Belum lulus'
  >('Semua');
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get<Job[]>('/data/jobs.json');
        setAllJobs(data);
      } catch (err) {
        console.error('Failed to fetch jobs in DashboardApplications:', err);
      }
    };
    fetchJobs();
  }, []);

  if (!mounted || !user) return null;

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col h-[880px] overflow-hidden animate-in fade-in duration-300 justify-between">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="space-y-1 pb-4 border-b shrink-0 mb-4">
          <span className="text-base font-extrabold text-foreground tracking-tight block">
            Lamaran Kerja
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex text-sm gap-6 mb-4 smooth-scroll">
          {[
            { id: 'Semua', label: 'Semua' },
            { id: 'Interview', label: 'Interview' },
            { id: 'Lulus', label: 'Lulus' },
            { id: 'Belum lulus', label: 'Belum lulus' },
          ].map((tab) => {
            const isActive = activeAppTab === tab.id;
            const count =
              tab.id === 'Semua'
                ? (applications || []).length
                : (applications || []).filter((a) => a.status === tab.id)
                    .length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveAppTab(tab.id as any)}
                className={`pb-2.5 text-[12px] md:text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                style={
                  isActive
                    ? {
                        borderBottomColor: 'hsl(var(--primary))',
                      }
                    : undefined
                }
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto pr-1 smooth-scroll space-y-3.5 pt-1">
          {(() => {
            const filtered =
              activeAppTab === 'Semua'
                ? applications || []
                : (applications || []).filter(
                    (app) => app.status === activeAppTab,
                  );

            if (filtered.length === 0) {
              return (
                <span className="text-xs text-muted-foreground font-semibold block py-8 text-center bg-background/10 rounded-xl border border-dashed">
                  Belum ada lamaran dengan status ini.
                </span>
              );
            }

            return filtered.map((app) => {
              const matchedJob = allJobs.find((j) => j.id === app.jobId);
              const location = matchedJob ? matchedJob.location : 'Salatiga';
              const displayStatus =
                app.status === 'Pending' ? 'Baru' : app.status;

              return (
                <div
                  key={app.id}
                  className="bg-card border border-border/60 rounded-2xl p-4 md:p-4.5 shadow-xs flex flex-col gap-3 hover:border-primary/40 transition-all"
                >
                  {/* Top section: Logo, Job Info, Timeline, Status Badge */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 relative">
                    {/* Left section: Circular Logo and Job Metadata */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="h-11 w-11 bg-white border border-border/70 rounded-xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                        {app.logo && (app.logo.startsWith('/') || app.logo.startsWith('http')) ? (
                          <img
                            src={app.logo}
                            alt={app.company}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xs font-black text-primary uppercase">
                            {app.logo || app.company.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        {/* 1. Nama Jobs */}
                        <span className="text-sm font-extrabold text-foreground tracking-tight leading-snug truncate block">
                          {app.jobTitle}
                        </span>
                        {/* 2. Twitter & Location */}
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground font-semibold flex-wrap">
                          <span className="truncate">
                            {app.company.toLowerCase().replace(/\s+/g, '')}
                          </span>
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10 shrink-0" />
                          <span className="text-muted-foreground/60 font-normal">
                            •
                          </span>
                          <span className="text-muted-foreground font-medium truncate">
                            {location
                              .replace(/Kabupaten\s+/i, '')
                              .replace(/Kota\s+/i, '')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle section: Timeline Lamaran */}
                    <div className="flex-1 min-w-[180px] space-y-1 md:pl-4">
                      <span className="text-[10px] font-bold text-foreground block">
                        Timeline Lamaran
                      </span>
                      <ul className="text-[10px] text-muted-foreground space-y-1 font-medium list-none p-0 m-0">
                        <li className="flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/75 inline-block shrink-0 mr-1"></span>
                          <span>Dilamar</span>
                          <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                          <span>{app.date || '14 Juni 2026'}</span>
                        </li>
                        <li className="flex items-center mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/75 inline-block shrink-0 mr-2"></span>
                          <span>
                            {app.status === 'Lulus'
                              ? 'Sudah Dilihat'
                              : 'Belum Dilihat'}
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Right section badge */}
                    <div className="absolute w-20 top-0 right-0 md:relative md:top-auto md:right-auto shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded select-none ${
                          app.status === 'Interview'
                            ? 'bg-blue-500/10 text-blue-500'
                            : app.status === 'Lulus'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : app.status === 'Belum lulus'
                                ? 'bg-rose-500/10 text-rose-500'
                                : 'bg-sky-500/10 text-sky-500'
                        }`}
                      >
                        {displayStatus}
                      </span>
                    </div>
                  </div>

                  {/* Bottom section: Action button and Search details */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onNavigate?.('chat')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-foreground text-[11px] font-bold rounded-lg hover:bg-primary/30 transition-all cursor-pointer"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>Kirim Pesan</span>
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          `/jobs?search=${encodeURIComponent(app.jobTitle)}`,
                        )
                      }
                      className="p-1.5 hover:bg-muted rounded-full transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      <Search className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
