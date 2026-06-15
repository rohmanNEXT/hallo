'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/store';
import { Award, Clock, CheckCircle, XCircle, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Job } from '@/lib/types';

function StandaloneApplicationsPageContent() {
  const { user, applications, bookmarks, toggleBookmark } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [mockJobsData, setMockJobsData] = useState<Job[]>([]);
  const [activeMainView, setActiveMainView] = useState<'bookmark' | 'lamaran'>('lamaran');
  const [activeAppTab, setActiveAppTab] = useState<'Semua' | 'Interview' | 'Lulus' | 'Belum lulus'>('Semua');

  useEffect(() => {
    setMounted(true);
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get<Job[]>('/data/jobs.json');
        setMockJobsData(data);
      } catch (err) {
        console.error('Failed to fetch jobs in applications page:', err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'bookmark') {
      setActiveMainView('bookmark');
    } else if (tab === 'lamaran') {
      setActiveMainView('lamaran');
    }
  }, [searchParams]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">
            Memuat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-10 pb-28 px-6 md:px-12 text-foreground">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Navigation: Title is Aktifitas, with Bookmark & Lamaran sub-tabs below */}
        <div className="border-b border-border/60 pb-4 space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Aktifitas
          </h1>
          
          <div className="flex gap-8">
            <button
              onClick={() => setActiveMainView('bookmark')}
              className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-[18px] cursor-pointer ${
                activeMainView === 'bookmark'
                  ? 'text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              style={
                activeMainView === 'bookmark'
                  ? {
                      borderBottomColor: 'hsl(var(--primary))',
                    }
                  : undefined
              }
            >
              Bookmark ({ (bookmarks || []).length })
            </button>
            <button
              onClick={() => setActiveMainView('lamaran')}
              className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-[18px] cursor-pointer ${
                activeMainView === 'lamaran'
                  ? 'text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              style={
                activeMainView === 'lamaran'
                  ? {
                      borderBottomColor: 'hsl(var(--primary))',
                    }
                  : undefined
              }
            >
              Lamaran Saya ({ (applications || []).length })
            </button>
          </div>
        </div>

        {/* Content Container */}
        {activeMainView === 'bookmark' ? (
          /* Bookmark View */
          <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-foreground">
              Daftar Lowongan yang Ditandai
            </h2>
            <div className="space-y-4">
              {(() => {
                const bookmarked = mockJobsData.filter(job => (bookmarks || []).includes(job.id));
                
                if (bookmarked.length === 0) {
                  return (
                    <span className="text-xs text-muted-foreground font-semibold block py-4 text-center">
                      Belum ada lowongan yang ditandai bookmark.
                    </span>
                  );
                }

                return bookmarked.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 bg-background/30 border border-border/60 rounded-xl hover:bg-background/50 transition-colors"
                  >
                    <div 
                      className="flex items-center gap-3.5 min-w-0 cursor-pointer flex-1"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      {/* Company Logo */}
                      <div className="h-10 w-10 bg-white border border-border/70 rounded-xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                        {job.logo ? (
                          <img
                            src={job.logo}
                            alt={job.company}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">🏢</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-foreground block truncate hover:text-primary transition-colors">
                          {job.title}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium block mt-1">
                          {job.company} • {job.location} • {job.workOption}
                        </span>
                      </div>
                    </div>

                    {/* Bookmark Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => router.push(`/jobs/${job.id}`)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Lihat Detail Lowongan"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => toggleBookmark(job.id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                        title="Hapus Bookmark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        ) : (
          /* Lamaran Saya View */
          <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Navigation Tabs (Settings-style active underline) */}
            <div className="flex border-b border-border/60 gap-6 mb-2">
              {[
                { id: 'Semua', label: 'Semua' },
                { id: 'Interview', label: 'Interview' },
                { id: 'Lulus', label: 'Lulus' },
                { id: 'Belum lulus', label: 'Belum lulus' },
              ].map((tab) => {
                const isActive = activeAppTab === tab.id;
                const count = tab.id === 'Semua'
                  ? (applications || []).length
                  : (applications || []).filter(a => a.status === tab.id).length;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAppTab(tab.id as any)}
                    className={`pb-2.5 text-xs md:text-sm font-semibold transition-all border-b-2 -mb-[1px] cursor-pointer ${
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
            <div className="space-y-4 pt-1">
              {(() => {
                const filtered = activeAppTab === 'Semua'
                  ? applications || []
                  : (applications || []).filter(app => app.status === activeAppTab);

                if (filtered.length === 0) {
                  return (
                    <span className="text-xs text-muted-foreground font-semibold block py-4 text-center">
                      Belum ada lamaran dengan status ini.
                    </span>
                  );
                }

                return filtered.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 bg-background/30 border border-border/60 rounded-xl hover:bg-background/50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Company Logo */}
                      <div className="h-10 w-10 bg-white border border-border/70 rounded-xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                        {app.logo ? (
                          <img
                            src={app.logo}
                            alt={app.company}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">🏢</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-foreground block truncate">
                          {app.jobTitle}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium block mt-1">
                          {app.company} • Melamar pada {app.date || '-'}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 select-none flex items-center gap-1.5 ${
                        app.status === 'Interview'
                          ? 'bg-blue-500/10 text-blue-500'
                          : app.status === 'Lulus'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : app.status === 'Belum lulus'
                          ? 'bg-rose-500/10 text-rose-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {app.status === 'Interview' && <Clock className="h-3.5 w-3.5" />}
                      {app.status === 'Lulus' && <CheckCircle className="h-3.5 w-3.5" />}
                      {app.status === 'Belum lulus' && <XCircle className="h-3.5 w-3.5" />}
                      <span>{app.status}</span>
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default function StandaloneApplicationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Memuat...</p>
        </div>
      </div>
    }>
      <StandaloneApplicationsPageContent />
    </Suspense>
  );
}
