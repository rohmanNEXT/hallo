'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  LuSearch as Search,
  LuMapPin as MapPin,
  LuBuilding2 as Building2,
  LuUsers as Users,
  LuBriefcase as Briefcase,
  LuStar as Star,
  LuX as X,
  LuRefreshCw as RefreshCw,
  LuShieldCheck as ShieldCheck,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuChevronDown as ChevronDown,
} from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppStore } from '@/store/store';

import React from 'react';
import axios from 'axios';
import { Company } from '@/lib/types';
import Image from 'next/image';

const CompanyList: React.FC = () => {
  const router = useRouter();
  const { theme } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [companiesPage, setCompaniesPage] = useState<Company[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get<Company[]>('/data/companies.json');
        setCompaniesPage(data);
      } catch (err) {
        console.error('Failed to fetch companies list:', err);
      }
    };
    fetchCompanies();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedLocation, setDebouncedLocation] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; // 3 columns by 10 rows

  // Debouncing Search & Location
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(locationQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [locationQuery]);

  const handleReset = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSortBy('relevance');
    setCurrentPage(1);
  };

  // Custom location dropdown state
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const locationOptions = Array.from(
    new Set(companiesPage.map((c) => c.location)),
  ).sort((a, b) => a.localeCompare(b));
  const filteredLocationOptions = locationSearch
    ? locationOptions.filter((l) =>
        l.toLowerCase().includes(locationSearch.toLowerCase()),
      )
    : locationOptions;

  // Custom sortBy dropdown
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const sortOptions = [
    { value: 'relevance', label: 'Relevansi' },
    { value: 'newest', label: 'Terbaru' },
    { value: 'rating', label: 'Rating Tertinggi' },
    { value: 'jobs', label: 'Lowongan Terbanyak' },
  ];

  // Close all dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(e.target as Node)
      )
        setIsLocationOpen(false);
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      )
        setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filter & Sort Logic
  const filteredCompanies = companiesPage.filter((company) => {
    const matchName =
      company.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      company.industry.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchLocation = company.location
      .toLowerCase()
      .includes(debouncedLocation.toLowerCase());
    return matchName && matchLocation;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return a.postedAt.includes('hari') ? 1 : -1; // Newest estimation
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'jobs') {
      return b.openJobs - a.openJobs;
    }
    return 0; // relevance
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="h-[2885px] bg-background flex flex-col">
      <div className="">
        {/* Header */}
        <div className="bg-background overflow-visible relative z-10">
          <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 py-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-6">
              Eksplor Perusahaan
            </h1>

            {/* Search Selection Section */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1 relative w-full">
                {mounted && theme === 'white' ? (
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5c6f84]" />
                ) : (
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
                <Input
                  type="text"
                  placeholder="Cari nama perusahaan atau industri..."
                  className={
                    mounted && theme === 'white'
                      ? 'pl-9 h-10 text-xs bg-[#eef5fa] border border-border! rounded-lg text-[#334155] placeholder-[#5c6f84] focus-visible:ring-1 focus-visible:ring-[#eef5fa]/50 focus-visible:ring-offset-0 shadow-none!'
                      : 'pl-9 h-10 text-xs bg-background/50 border border-border! rounded-lg placeholder-zinc-500 dark:placeholder-zinc-400 shadow-none!'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Custom always-downward location dropdown */}
              <div className="flex-1 relative w-full" ref={locationDropdownRef}>
                <MapPin
                  className={`absolute left-3 top-5 transform -translate-y-1/2 h-4 w-4 z-10 pointer-events-none ${mounted && theme === 'white' ? 'text-[#5c6f84]' : 'text-muted-foreground'}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsLocationOpen(!isLocationOpen);
                    setLocationSearch('');
                  }}
                  className={`w-full h-10 pl-9 pr-9 text-xs rounded-lg outline-none cursor-pointer text-left flex items-center ${
                    mounted && theme === 'white'
                      ? 'bg-[#eef5fa] border border-border! text-[#334155]'
                      : 'bg-background border border-border! text-foreground'
                  }`}
                >
                  <span
                    className={
                      locationQuery
                        ? ''
                        : mounted && theme === 'white'
                          ? 'text-[#5c6f84]'
                          : 'text-muted-foreground'
                    }
                  >
                    {locationQuery || 'Semua Lokasi'}
                  </span>
                </button>
                <ChevronDown
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''} ${mounted && theme === 'white' ? 'text-[#5c6f84]' : 'text-muted-foreground'}`}
                />

                {isLocationOpen && (
                  <div
                    style={{ backgroundColor: 'hsl(var(--popover))' }}
                    className={`absolute top-full left-0 right-0 mt-1 z-100 rounded-lg border shadow-xl overflow-hidden ${
                      mounted && theme === 'white'
                        ? 'border-[#d2e2f0]'
                        : 'border-border'
                    }`}
                  >
                    <div
                      className={`p-2 border-b ${mounted && theme === 'white' ? 'border-[#d2e2f0]' : 'border-border/60'}`}
                    >
                      <input
                        autoFocus
                        type="text"
                        placeholder="Cari lokasi..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className={`w-full px-2 py-1 text-xs rounded outline-none ${
                          mounted && theme === 'white'
                            ? 'bg-[#eef5fa] text-[#334155] placeholder-[#5c6f84]'
                            : 'bg-muted text-foreground placeholder-muted-foreground'
                        }`}
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setLocationQuery('');
                          setCurrentPage(1);
                          setIsLocationOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${
                          !locationQuery
                            ? 'font-semibold text-primary'
                            : mounted && theme === 'white'
                              ? 'text-[#334155]'
                              : 'text-foreground'
                        }`}
                      >
                        Semua Lokasi
                      </button>
                      {filteredLocationOptions.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setLocationQuery(loc);
                            setCurrentPage(1);
                            setIsLocationOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${
                            locationQuery === loc
                              ? 'font-semibold text-primary bg-primary/5'
                              : mounted && theme === 'white'
                                ? 'text-[#334155]'
                                : 'text-foreground'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 w-full sm:w-auto shrink-0">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-10 px-4 text-xs font-semibold flex items-center gap-1.5 w-full sm:w-auto cursor-pointer border-red-500/60! hover:border-red-500! text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <RefreshCw className="h-3.5 w-3.5 opacity-60" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 pt-3 pb-8 flex-1 flex flex-col">
        {/* Results Info & Sort By */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div>
            <p className="text-xs text-muted-foreground font-semibold">
              <strong className="font-extrabold text-foreground">
                {filteredCompanies.length.toLocaleString('id-ID')}
              </strong>{' '}
              Company found
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Sort by</span>
            <div className="relative" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="h-8 pl-3 pr-8 border rounded-lg bg-card/60 outline-none text-xs cursor-pointer font-medium text-foreground hover:bg-muted/40 transition-all flex items-center min-w-[140px]"
              >
                {sortOptions.find((o) => o.value === sortBy)?.label ||
                  'Relevansi'}
              </button>
              <ChevronDown
                className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}
              />
              {isSortOpen && (
                <div
                  className="absolute top-full right-0 mt-1 z-100 rounded-lg border border-border/50 bg-popover/40 backdrop-blur-2xl shadow-xl overflow-hidden min-w-[160px]"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        setCurrentPage(1);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${sortBy === opt.value ? 'font-semibold text-primary bg-primary/5' : 'text-foreground'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Company Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
          {paginatedCompanies.map((company) => (
            <Card
              key={company.id}
              className="hover:shadow-md border bg-card/60 backdrop-blur-sm transition-all duration-200 group flex flex-col justify-between overflow-hidden"
            >
              <CardHeader className="py-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border overflow-hidden">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        className="w-8 h-8 object-contain"
                       width={100} height={100} unoptimized />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors flex items-center gap-1.5 mb-1.5">
                        <span className="truncate">{company.name}</span>
                        {company.isVerified && (
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10 shrink-0" />
                        )}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground truncate">
                        {company.industry}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-0 pb-4 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <div className="flex flex-col gap-y-2.5 mt-1 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {company.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                      <Briefcase className="h-3.5 w-3.5 shrink-0" />
                      {company.openJobs} Lowongan Tersedia
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-auto border-t border-muted/50">
                  <span className="text-xs text-muted-foreground font-semibold">
                    Aktif {company.postedAt}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs cursor-pointer font-semibold"
                    onClick={() => router.push(`/pencari-kerja/companies/${company.id}`)}
                  >
                    Lihat Profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="text-center text-muted-foreground py-16 text-sm">
            Tidak ada perusahaan yang cocok dengan kriteria pencarian Anda.
          </div>
        )}

        {/* Modern Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-auto pt-6 pb-16 text-xs">
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className={`h-9 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50 ${
                  mounted && theme === 'white' ? 'text-black!' : ''
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
                className={`h-9 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50 ${
                  mounted && theme === 'white' ? 'text-black!' : ''
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
    </div>
  );
};

export default CompanyList;
