'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  LuSearch as Search,
  LuMapPin as MapPin,
  LuBriefcase as Briefcase,
  LuChevronDown as ChevronDown,
  LuTrendingUp as TrendingUp,
} from 'react-icons/lu';
import provincesData from '../../lib/indonesia-regions.json';
import Badge from '../ui/badge';
import { useAppStore, useHasMounted } from '@/store/store';

interface ProvinceItem {
  province: string;
  regencies: string[];
}

const Hero: React.FC = () => {
  const router = useRouter();
  const { theme } = useAppStore();
  const mounted = useHasMounted();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [provinces, setProvinces] = useState<string[]>([]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const allRegencies = (provincesData as ProvinceItem[])
    .flatMap((p) => p.regencies)
    .sort((a, b) => a.localeCompare(b));

  const filteredRegencies = locationSearch
    ? allRegencies.filter((r) =>
        r.toLowerCase().includes(locationSearch.toLowerCase()),
      )
    : allRegencies;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (Array.isArray(provincesData)) {
      const names = (provincesData as ProvinceItem[]).map(
        (item) => item.province,
      );
      setProvinces(names.sort());
    }
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.set('search', keyword);
    if (location) params.set('location', location);
    router.push(`/jobs?${params.toString()}`);
  };

  const handlePopularClick = (pos: string) => {
    setKeyword(pos);
    const params = new URLSearchParams();
    params.set('search', pos);
    if (location) params.set('location', location);
    router.push(`/jobs?${params.toString()}`);
  };

  const popularPositions = [
    'Software Engineer',
    'Product Manager',
    'Data Analyst',
    'UI/UX Designer',
    'Marketing Manager',
    'Sales Representative',
    'DevOps Engineer',
    'Finance Specialist',
    'HR Specialist',
  ];

  return (
    <section className="pt-16 pb-12 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Title */}
        <div className="space-y-3.5 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold dark:text-foreground tracking-tight leading-tight">
            Temukan Pekerjaan Impianmu.
          </h1>
          <div className="text-xl sm:text-2xl font-black text-[#0f6dff] dark:text-primary tracking-wide opacity-80">
            #dengan JobSeeker.
          </div>
        </div>

        {/* Search Inputs */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 max-w-3xl mx-auto px-2">
          {/* Keyword Input */}
          <div className="relative flex-1 w-full">
            {!mounted || theme === 'white' ? (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5c6f84]" />
            ) : (
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <input
              type="text"
              placeholder="Posisi pekerjaan atau kata kunci"
              className={`pl-9 pr-4 h-10 w-full text-xs border rounded-lg focus:outline-none transition-all ${
                !mounted || theme === 'white'
                  ? 'bg-[#eef5fa] border-border text-[#334155] placeholder-[#5c6f84] focus:ring-1 focus:ring-[#eef5fa]/50'
                  : 'bg-card/50 border-border text-foreground placeholder-zinc-500 dark:placeholder-zinc-400 focus:ring-1 focus:ring-primary'
              }`}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
          </div>

          {/* Location Select */}
          <div className="w-full md:w-64 relative" ref={locationDropdownRef}>
            <MapPin
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 z-10 pointer-events-none ${
                !mounted || theme === 'white'
                  ? 'text-[#5c6f84]'
                  : 'text-muted-foreground'
              }`}
            />
            <button
              type="button"
              onClick={() => {
                setIsLocationOpen(!isLocationOpen);
                setLocationSearch('');
              }}
              className={`w-full h-10 pl-9 pr-9 text-xs rounded-lg outline-none cursor-pointer text-left flex items-center border transition-all ${
                !mounted || theme === 'white'
                  ? 'bg-[#eef5fa] border-border text-[#334155]'
                  : 'bg-card/50 border-border text-foreground'
              }`}
            >
              <span
                className={
                  location
                    ? ''
                    : !mounted || theme === 'white'
                      ? 'text-[#5c6f84]'
                      : 'text-muted-foreground'
                }
              >
                {location ||
                  (!mounted || theme === 'white'
                    ? 'Semua Kota/Provinsi'
                    : 'Semua Kota')}
              </span>
            </button>
            <ChevronDown
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none transition-transform duration-200 ${
                isLocationOpen ? 'rotate-180' : ''
              } ${!mounted || theme === 'white' ? 'text-[#5c6f84]' : 'text-muted-foreground'}`}
            />

            {isLocationOpen && (
              <div
                className={`absolute top-full left-0 right-0 mt-1 z-100 rounded-lg border shadow-xl overflow-hidden bg-popover/40 backdrop-blur-2xl ${
                  !mounted || theme === 'white'
                    ? 'border-[#d2e2f0]'
                    : 'border-border/50'
                }`}
              >
                <div
                  className={`p-2 border-b ${
                    !mounted || theme === 'white'
                      ? 'border-[#d2e2f0]'
                      : 'border-border/60'
                  }`}
                >
                  <input
                    autoFocus
                    type="text"
                    placeholder="Cari kota..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className={`w-full px-2 py-1 text-xs rounded outline-none ${
                      !mounted || theme === 'white'
                        ? 'bg-[#eef5fa] text-[#334155] placeholder-[#5c6f84]'
                        : 'bg-muted text-foreground placeholder-muted-foreground'
                    }`}
                  />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setLocation('');
                      setIsLocationOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${
                      !location
                        ? 'font-semibold text-primary'
                        : !mounted || theme === 'white'
                          ? 'text-[#334155]'
                          : 'text-foreground'
                    }`}
                  >
                    {!mounted || theme === 'white'
                      ? 'Semua Kota/Provinsi'
                      : 'Semua Kota'}
                  </button>
                  {filteredRegencies.map((r: string) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setLocation(r);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${
                        location === r
                          ? 'font-semibold text-primary bg-primary/5'
                          : !mounted || theme === 'white'
                            ? 'text-[#334155]'
                            : 'text-foreground'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cari Button */}
          <button
            onClick={handleSearch}
            suppressHydrationWarning
            className={`w-full md:w-auto h-10 px-6 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer border ${
              !mounted || theme === 'white'
                ? 'bg-[#0f6dff] hover:bg-[#0056d6] text-white border-[#0f6dff]! hover:border-[#0056d6]!'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary!'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Cari Pekerjaan</span>
          </button>
        </div>

        {/* Popular Positions */}
        <div className="space-y-3 pt-10">
          <p className="text-xs text-muted-foreground font-bold pb-1">
            Posisi Populer:
          </p>
          <div className="flex flex-col items-center gap-3">
            {/* Row 1 */}
            <div className="flex flex-wrap justify-center gap-2.5">
              {popularPositions.slice(0, 3).map((pos) => (
                <Badge
                  key={pos}
                  variant="outline"
                  onClick={() => handlePopularClick(pos)}
                  className={`text-xs font-normal px-3.5 py-1 h-7 rounded-full shadow-sm flex items-center cursor-pointer transition-all hover:-translate-y-0.5 duration-200 ${
                    !mounted || theme === 'white'
                      ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                      : 'bg-background/50 border border-border/80 text-muted-foreground'
                  }`}
                >
                  {pos}
                </Badge>
              ))}
            </div>
            {/* Row 2 */}
            <div className="flex flex-wrap justify-center gap-2.5">
              {popularPositions.slice(3, 6).map((pos) => (
                <Badge
                  key={pos}
                  variant="outline"
                  onClick={() => handlePopularClick(pos)}
                  className={`text-xs font-normal px-3.5 py-1 h-7 rounded-full shadow-sm flex items-center cursor-pointer transition-all hover:-translate-y-0.5 duration-200 ${
                    !mounted || theme === 'white'
                      ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                      : 'bg-background/50 border border-border/80 text-muted-foreground'
                  }`}
                >
                  {pos}
                </Badge>
              ))}
            </div>
            {/* Row 3 */}
            <div className="flex flex-wrap justify-center gap-2.5">
              {popularPositions.slice(6, 9).map((pos) => (
                <Badge
                  key={pos}
                  variant="outline"
                  onClick={() => handlePopularClick(pos)}
                  className={`text-xs font-normal px-3.5 py-1 h-7 rounded-full shadow-sm flex items-center cursor-pointer transition-all hover:-translate-y-0.5 duration-200 ${
                    !mounted || theme === 'white'
                      ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                      : 'bg-background/50 border border-border/80 text-muted-foreground'
                  }`}
                >
                  {pos}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left max-w-[740px] mx-auto">
          {/* Card 1 */}
          <div className="border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4 bg-card/30">
            <div className="h-11 w-11 border border-border rounded-full dark:bg-blue-900/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-[#0f6dff]/60" />
            </div>
            <div>
              <div className="font-extrabold text-xl leading-none">10.000+</div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider mt-1.5 text-foreground">
                Lowongan Aktif
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4 bg-card/30">
            <div className="h-11 w-11 border border-border rounded-full dark:bg-purple-900/10 flex items-center justify-center shrink-0">
              <Briefcase className="h-5 w-5 text-purple-600/60" />
            </div>
            <div>
              <div className="font-extrabold text-xl leading-none">5.000+</div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider mt-1.5 text-foreground">
                Perusahaan Mitra
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4 bg-card/30">
            <div className="h-11 w-11 border border-border rounded-full dark:bg-red-900/10 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-red-600/60" />
            </div>
            <div>
              <div className="font-extrabold text-xl leading-none">38</div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider mt-1.5 text-foreground">
                Provinsi Terjangkau
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
