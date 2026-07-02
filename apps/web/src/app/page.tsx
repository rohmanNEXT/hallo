'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/pencari-kerja/Hero';
import AppBanner from '@/components/pencari-kerja/AppBanner';
import IndonesiaMap from '@/components/pencari-kerja/IndonesiaMap';
import KotaPopuler from '@/components/pencari-kerja/KotaPopuler';
import { useAppStore } from '@/store/store';
import {
  LuShieldCheck as ShieldCheck,
  LuBookmark as Bookmark,
  LuFlame as Flame,
  LuArrowRight as ArrowRight,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
} from 'react-icons/lu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';
import { Job } from '@/lib/types';
import Image from 'next/image';

const Home: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { bookmarks, toggleBookmark, theme, isLoggedIn, user } = useAppStore();

  const [mockJobsData, setMockJobsData] = useState<Job[]>([]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && isLoggedIn && user?.role === 'admin') {
      const savedMode = localStorage.getItem('jobseeker-currentViewMode');
      if (savedMode === 'employer') {
        router.push('/pembuat-kerja/lowongan');
        return;
      }
    }
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get<Job[]>('/data/jobs.json');
        setMockJobsData(data);
      } catch (err) {
        console.error('Failed to fetch jobs on homepage:', err);
      }
    };
    fetchJobs();
  }, [router]);

  // 9 jobs per page
  const jobsPerPage = 9;
  const totalPages = Math.ceil(mockJobsData.length / jobsPerPage);
  const paginatedJobs = mockJobsData.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage,
  );

  return (
    <>
      <main className="min-h-screen">
        <Hero />

        {/* Divider Line with Year */}
        <div className="max-w-7xl mx-auto px-6 pt-24 flex items-center gap-4">
          <div className="grow border-t border-border/50"></div>
          <Badge
            variant="outline"
            className={`text-xs font-extrabold tracking-widest select-none px-3 py-1 rounded-full font-mono ${
              !mounted || theme === 'white'
                ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                : 'bg-background/50 border border-border/80 text-muted-foreground'
            }`}
          >
            [ {new Date().getFullYear()} ]
          </Badge>
          <div className="grow border-t border-border/50"></div>
        </div>

        {/* Loker Terbaru Section */}
        <section className="max-w-7xl mx-auto px-6 pt-28 pb-12 flex flex-col min-h-[600px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="text-left">
              <h2
                id="loker-terbaru-heading"
                className="text-2xl font-extrabold"
              >
                Lowongan Terbaru
              </h2>
            </div>
            <Link href="/pencari-kerja/jobs" className="block shrink-0">
              <Button
                variant="outline"
                size="sm"
                className={`h-9 border-border/60 hover:bg-accent text-xs font-bold gap-1.5 cursor-pointer whitespace-nowrap inline-flex items-center justify-center ${
                  mounted && theme === 'white' ? 'text-black' : ''
                }`}
              >
                <span>Lihat Semua</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 content-start">
            {paginatedJobs.map((job) => {
              const cardBadges = [
                ...(job.isPremium ? ['Perusahaan Premium'] : []),
                job.workOption,
                job.workType,
                job.experienceLevel,
                job.educationLevel,
                ...job.categories,
              ];
              const hasMore = cardBadges.length > 6;
              const maxVisible = hasMore ? 5 : 6;
              const visibleBadges = cardBadges.slice(0, maxVisible);
              const remainingCount = cardBadges.length - maxVisible;

              const row1 = visibleBadges.slice(0, 3);
              const row2 = visibleBadges.slice(3, 6);

              return (
                <div
                  key={job.id}
                  onClick={() => router.push(`/pencari-kerja/jobs/${job.id}`)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/70 p-4 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:border-primary/50 bg-card text-left h-[240px]"
                >
                  <div>
                    {/* Header: Logo, Title, and Bookmark */}
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border overflow-hidden">
                        <Image
                          src={job.logo}
                          alt={job.company}
                          className="w-5.5 h-5.5 object-contain"
                         width={100} height={100} unoptimized />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(job.id);
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors p-1 shrink-0 cursor-pointer"
                      >
                        <Bookmark
                          className={`h-4.5 w-4.5 ${bookmarks.includes(job.id) ? 'fill-primary/60' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Job Info */}
                    <div className="space-y-1 mb-3">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                        {job.title}
                      </h3>
                      <div className="text-xs text-muted-foreground truncate font-medium flex items-center gap-1">
                        <span className="truncate">{job.company}</span>
                        {job.isVerified && (
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10 shrink-0" />
                        )}
                        <span className="shrink-0">• {job.location}</span>
                      </div>
                    </div>

                    {/* Badges - 2 Rows */}
                    <div className="flex flex-col gap-1.5 mb-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {row1.map((badge, idx) => (
                          <Badge
                            key={idx}
                            variant={
                              badge.includes('Premium')
                                ? 'secondary'
                                : 'outline'
                            }
                            className={`text-[10.5px] font-normal px-2 py-0.5 h-5.5 ${
                              badge.includes('Premium')
                                ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold'
                                : !mounted || theme === 'white'
                                  ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                  : 'bg-background/50 border border-border/80 text-muted-foreground'
                            }`}
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {row2.length > 0 ? (
                          row2.map((badge, idx) => (
                            <Badge
                              key={idx}
                              variant={
                                badge.includes('Premium')
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className={`text-[10.5px] font-normal px-2 py-0.5 h-5.5 ${
                                badge.includes('Premium')
                                  ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold'
                                  : !mounted || theme === 'white'
                                    ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                    : 'bg-background/50 border border-border/80 text-muted-foreground'
                              }`}
                            >
                              {badge}
                            </Badge>
                          ))
                        ) : (
                          /* Invisible placeholder to maintain consistent 2-row height across all cards */
                          <Badge
                            variant="outline"
                            className="text-[10.5px] px-2 py-0.5 h-5.5 opacity-0 pointer-events-none select-none border-transparent bg-transparent"
                          >
                            &nbsp;
                          </Badge>
                        )}
                        {hasMore && (
                          <Badge
                            variant="outline"
                            className={`text-[10.5px] font-normal px-2 py-0.5 h-5.5 ${
                              !mounted || theme === 'white'
                                ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                : 'bg-background/50 border border-border/80 text-muted-foreground'
                            }`}
                          >
                            +{remainingCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t pt-2.5 mt-auto">
                    <span className="text-[12px] font-bold text-emerald-500">
                      {job.salary}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground font-semibold">
                      <span>{job.postedAt}</span>
                      {job.isUrgent && (
                        <Badge className="bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 font-semibold text-[10px] px-1.5 py-0 h-4.5 border border-red-500/10 shadow-none flex items-center gap-0.5 ml-1">
                          <Flame className="h-2 w-2" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modern Pagination Controls styled like companies page */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10 pt-6 text-xs">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-9 w-9 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50 ${
                    mounted && theme === 'white' ? 'text-black!' : ''
                  }`}
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {(() => {
                    const renderedElements: React.ReactNode[] = [];

                    const renderButton = (pageNum: number) => {
                      const isCurrent = currentPage === pageNum;
                      return (
                        <Button
                          key={pageNum}
                          variant="outline"
                          className="h-9 w-9 text-xs font-bold transition-all rounded-lg cursor-pointer shadow-sm"
                          style={
                            isCurrent
                              ? {
                                  backgroundColor: 'hsl(var(--foreground))',
                                  color: 'hsl(var(--background))',
                                  borderColor: 'hsl(var(--foreground))',
                                }
                              : mounted && theme === 'white'
                                ? { color: 'black' }
                                : { color: 'hsl(var(--foreground))' }
                          }
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    };

                    const renderDots = (key: string) => (
                      <span
                        key={key}
                        className="px-1.5 text-muted-foreground font-bold text-sm select-none"
                      >
                        ...
                      </span>
                    );

                    if (totalPages <= 3) {
                      for (let i = 1; i <= totalPages; i++) {
                        renderedElements.push(renderButton(i));
                      }
                    } else {
                      // totalPages >= 4
                      if (currentPage < 4) {
                        // Show 1, 2, 3, ...
                        renderedElements.push(renderButton(1));
                        renderedElements.push(renderButton(2));
                        renderedElements.push(renderButton(3));
                        renderedElements.push(renderDots('dots-right'));
                      } else {
                        // currentPage >= 4
                        // Show ..., 2, 3, 4 (for totalPages = 4)
                        renderedElements.push(renderDots('dots-left'));
                        renderedElements.push(renderButton(totalPages - 2));
                        renderedElements.push(renderButton(totalPages - 1));
                        renderedElements.push(renderButton(totalPages));
                      }
                    }
                    return renderedElements;
                  })()}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className={`h-9 w-9 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50 ${
                    mounted && theme === 'white' ? 'text-black!' : ''
                  }`}
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </section>

        <KotaPopuler />
        <IndonesiaMap />

        <AppBanner />
      </main>
    </>
  );
};

export default Home;
