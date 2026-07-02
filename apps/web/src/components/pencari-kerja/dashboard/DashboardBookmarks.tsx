'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/store';
import { 
  LuTrash2 as Trash2, 
  LuExternalLink as ExternalLink, 
  LuBookmark as Bookmark, 
  LuChevronLeft as ChevronLeft, 
  LuChevronRight as ChevronRight,
  LuBuilding2
} from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Job } from '@/lib/types';
import Image from 'next/image';

export default function DashboardBookmarks() {
  const { user, bookmarks, toggleBookmark, theme } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [mockJobsData, setMockJobsData] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18; // 2 columns x 8 rows

  useEffect(() => {
    setMounted(true);
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get<Job[]>('/data/jobs.json');
        setMockJobsData(data);
      } catch (err) {
        console.error('Failed to fetch jobs in dashboard bookmarks:', err);
      }
    };
    fetchJobs();
  }, []);

  if (!user) return null;

  const bookmarked = mockJobsData.filter(job => (bookmarks || []).includes(job.id));

  // Pagination Logic
  const totalPages = Math.ceil(bookmarked.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = bookmarked.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col h-[882px] overflow-hidden animate-in fade-in duration-300 justify-between">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="space-y-1 pb-4 border-b shrink-0 mb-4">
          <span className="text-base font-extrabold text-foreground tracking-tight block">
            Bookmark
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-1.5 smooth-scroll pb-2">
          {bookmarked.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground font-semibold bg-background/10 rounded-xl border border-dashed flex flex-col items-center justify-center p-6">
              <Bookmark className="h-6 w-6 text-muted-foreground/40 mb-1" />
              <span>Belum ada lowongan yang ditandai bookmark.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 content-start">
              {paginatedJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3.5 bg-background/30 border border-border/60 rounded-xl hover:bg-background/50 transition-colors"
                >
                  <div 
                    className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                    onClick={() => window.location.href = `/jobs/${job.id}`}
                  >
                    {/* Company Logo */}
                    <div className="h-9 w-9 bg-white border border-border/70 rounded-xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                      {job.logo ? (
                        <Image
                          src={job.logo}
                          alt={job.company}
                          className="w-full h-full object-contain"
                         width={100} height={100} unoptimized />
                      ) : (
                        <LuBuilding2 className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-foreground block truncate hover:text-primary transition-colors">
                        {job.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium block mt-1">
                        {job.company} • {job.location} • {job.workOption}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      onClick={() => window.location.href = `/jobs/${job.id}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Lihat Detail"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      onClick={() => {
                        toggleBookmark(job.id);
                        // Reset page if the current page becomes empty
                        if (paginatedJobs.length === 1 && currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                      title="Hapus Bookmark"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modern Pagination Controls adapted from companies page */}
      {bookmarked.length > 0 && (
        <div className="flex justify-center items-center gap-4 pt-4 border-t border-border/50 shrink-0 text-xs mt-2">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className={`h-9 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50 ${
                theme === 'white' ? 'text-black!' : ''
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
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
                          : theme === 'white'
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
                  if (currentPage < 3) {
                    renderedElements.push(renderButton(1));
                    renderedElements.push(renderButton(2));
                    renderedElements.push(renderDots('dots-right'));
                    renderedElements.push(renderButton(totalPages));
                  } else if (currentPage > totalPages - 2) {
                    renderedElements.push(renderButton(1));
                    renderedElements.push(renderDots('dots-left'));
                    renderedElements.push(renderButton(totalPages - 1));
                    renderedElements.push(renderButton(totalPages));
                  } else {
                    renderedElements.push(renderButton(1));
                    renderedElements.push(renderDots('dots-left'));
                    renderedElements.push(renderButton(currentPage));
                    renderedElements.push(renderDots('dots-right'));
                    renderedElements.push(renderButton(totalPages));
                  }
                }
                return renderedElements;
              })()}
            </div>

            <Button
              variant="outline"
              size="sm"
              className={`h-9 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50 ${
                theme === 'white' ? 'text-black!' : ''
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
