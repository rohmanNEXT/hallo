'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Building2,
  Users,
  Briefcase,
  Star,
  X,
  RefreshCw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { useAppStore } from '@/lib/store';

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  totalEmployees: string;
  openJobs: number;
  rating: number;
  isPremium: boolean;
  isVerified: boolean;
  postedAt: string;
  description: string;
  availableTitles: string[];
}

export const CompaniesPage: Company[] = Array.from({ length: 80 }).map(
  (_, index) => {
    const baseCompanies = [
      {
        name: 'Tokopedia',
        logo: '/images/companies/tokopedia.svg',
        industry: 'E-commerce',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'Gojek',
        logo: '/images/companies/gojek.svg',
        industry: 'Transportation',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'Traveloka',
        logo: '/images/companies/traveloka.svg',
        industry: 'Travel & Tech',
        location: 'Jakarta Barat, DKI Jakarta',
      },
      {
        name: 'Bukalapak',
        logo: '/images/companies/bukalapak.svg',
        industry: 'E-commerce',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'Shopee',
        logo: '/images/companies/shopee.svg',
        industry: 'E-commerce',
        location: 'Surabaya, Jawa Timur',
      },
      {
        name: 'Grab',
        logo: '/images/companies/grab.svg',
        industry: 'Logistics',
        location: 'Medan, Sumatera Utara',
      },
      {
        name: 'Google',
        logo: '/images/companies/google.svg',
        industry: 'Technology',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'Microsoft',
        logo: '/images/companies/microsoft.svg',
        industry: 'Technology',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'Apple',
        logo: '/images/companies/apple.svg',
        industry: 'Technology',
        location: 'Jakarta Utara, DKI Jakarta',
      },
      {
        name: 'Meta',
        logo: '/images/companies/meta.svg',
        industry: 'Technology',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'Amazon',
        logo: '/images/companies/amazon.svg',
        industry: 'E-commerce & Cloud',
        location: 'Surabaya, Jawa Timur',
      },
      {
        name: 'Netflix',
        logo: '/images/companies/netflix.svg',
        industry: 'Entertainment',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'Spotify',
        logo: '/images/companies/spotify.svg',
        industry: 'Entertainment',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'Twitter',
        logo: '/images/companies/twitter.svg',
        industry: 'Social Media',
        location: 'Medan, Sumatera Utara',
      },
      {
        name: 'Airbnb',
        logo: '/images/companies/airbnb.svg',
        industry: 'Travel & Tech',
        location: 'Denpasar, Bali',
      },
      {
        name: 'Zoom',
        logo: '/images/companies/zoom.svg',
        industry: 'Technology',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'Figma',
        logo: '/images/companies/figma.svg',
        industry: 'Design Tool',
        location: 'Jakarta Barat, DKI Jakarta',
      },
      {
        name: 'Adobe',
        logo: '/images/companies/adobe.svg',
        industry: 'Design & Tech',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'Slack',
        logo: '/images/companies/slack.svg',
        industry: 'Communication',
        location: 'Yogyakarta, DIY',
      },
      {
        name: 'NVIDIA',
        logo: '/images/companies/nvidia.svg',
        industry: 'Hardware & AI',
        location: 'Surabaya, Jawa Timur',
      },
      {
        name: 'Tesla',
        logo: '/images/companies/tesla.svg',
        industry: 'Automotive & Tech',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'Intel',
        logo: '/images/companies/intel.svg',
        industry: 'Hardware',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'Samsung',
        logo: '/images/companies/samsung.svg',
        industry: 'Electronics',
        location: 'Tangerang, Banten',
      },
      {
        name: 'TikTok',
        logo: '/images/companies/tiktok.svg',
        industry: 'Social Media',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'Discord',
        logo: '/images/companies/discord.svg',
        industry: 'Communication',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'Notion',
        logo: '/images/companies/notion.svg',
        industry: 'Productivity',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'Roblox',
        logo: '/images/companies/roblox.svg',
        industry: 'Gaming',
        location: 'Surabaya, Jawa Timur',
      },
      {
        name: 'Reddit',
        logo: '/images/companies/reddit.svg',
        industry: 'Social Media',
        location: 'Medan, Sumatera Utara',
      },
      {
        name: 'Pinterest',
        logo: '/images/companies/pinterest.svg',
        industry: 'Social Media',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'LinkedIn',
        logo: '/images/companies/linkedin.svg',
        industry: 'Professional Network',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'Salesforce',
        logo: '/images/companies/salesforce.svg',
        industry: 'Cloud CRM',
        location: 'Jakarta Utara, DKI Jakarta',
      },
      {
        name: 'Oracle',
        logo: '/images/companies/oracle.svg',
        industry: 'Database',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'Canva',
        logo: '/images/companies/canva.svg',
        industry: 'Design Tool',
        location: 'Surabaya, Jawa Timur',
      },
      {
        name: 'Shopify',
        logo: '/images/companies/shopify.svg',
        industry: 'E-commerce',
        location: 'Medan, Sumatera Utara',
      },
      {
        name: 'Stripe',
        logo: '/images/companies/stripe.svg',
        industry: 'Fintech',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'Uber',
        logo: '/images/companies/uber.svg',
        industry: 'Transportation',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'GitHub',
        logo: '/images/companies/github.svg',
        industry: 'Development',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'GitLab',
        logo: '/images/companies/gitlab.svg',
        industry: 'Development',
        location: 'Surabaya, Jawa Timur',
      },
      {
        name: 'Coinbase',
        logo: '/images/companies/coinbase.svg',
        industry: 'Cryptocurrency',
        location: 'Jakarta Barat, DKI Jakarta',
      },
      {
        name: 'Binance',
        logo: '/images/companies/binance.svg',
        industry: 'Cryptocurrency',
        location: 'Medan, Sumatera Utara',
      },

      // Additional 40 uniquely named companies (using reused logos, but different names)
      {
        name: 'Goto Financial',
        logo: '/images/companies/gojek.svg',
        industry: 'Fintech',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'Tokopedia Seller',
        logo: '/images/companies/tokopedia.svg',
        industry: 'E-commerce',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'Google Cloud Indo',
        logo: '/images/companies/google.svg',
        industry: 'Cloud Computing',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'AWS Indonesia',
        logo: '/images/companies/amazon.svg',
        industry: 'Cloud Computing',
        location: 'Surabaya, Jawa Timur',
      },
      {
        name: 'Apple Developer ID',
        logo: '/images/companies/apple.svg',
        industry: 'Technology',
        location: 'Yogyakarta, DIY',
      },
      {
        name: 'Meta Oculus Indo',
        logo: '/images/companies/meta.svg',
        industry: 'VR & AR',
        location: 'Medan, Sumatera Utara',
      },
      {
        name: 'Microsoft Azure ID',
        logo: '/images/companies/microsoft.svg',
        industry: 'Cloud Computing',
        location: 'Jakarta Barat, DKI Jakarta',
      },
      {
        name: 'Netflix Production',
        logo: '/images/companies/netflix.svg',
        industry: 'Entertainment',
        location: 'Denpasar, Bali',
      },
      {
        name: 'Spotify Podcasts',
        logo: '/images/companies/spotify.svg',
        industry: 'Entertainment',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'X Corp Indonesia',
        logo: '/images/companies/twitter.svg',
        industry: 'Social Media',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'Airbnb Experiences',
        logo: '/images/companies/airbnb.svg',
        industry: 'Travel & Tech',
        location: 'Surabaya, Jawa Timur',
      },
      {
        name: 'Zoom Meetings ID',
        logo: '/images/companies/zoom.svg',
        industry: 'Technology',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'Figma Design Studio',
        logo: '/images/companies/figma.svg',
        industry: 'Design Tool',
        location: 'Yogyakarta, DIY',
      },
      {
        name: 'Adobe Creative Cloud',
        logo: '/images/companies/adobe.svg',
        industry: 'Design & Tech',
        location: 'Medan, Sumatera Utara',
      },
      {
        name: 'Slack Communications',
        logo: '/images/companies/slack.svg',
        industry: 'Communication',
        location: 'Jakarta Barat, DKI Jakarta',
      },
      {
        name: 'NVIDIA Graphics ID',
        logo: '/images/companies/nvidia.svg',
        industry: 'Hardware & AI',
        location: 'Denpasar, Bali',
      },
      {
        name: 'Tesla Motors ID',
        logo: '/images/companies/tesla.svg',
        industry: 'Automotive & Tech',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'Intel Processors',
        logo: '/images/companies/intel.svg',
        industry: 'Hardware',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'Samsung Electronics',
        logo: '/images/companies/samsung.svg',
        industry: 'Electronics',
        location: 'Surabaya, Jawa Timur',
      },
      {
        name: 'TikTok Shop ID',
        logo: '/images/companies/tiktok.svg',
        industry: 'E-commerce',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'Discord Communities',
        logo: '/images/companies/discord.svg',
        industry: 'Communication',
        location: 'Yogyakarta, DIY',
      },
      {
        name: 'Notion Workspaces',
        logo: '/images/companies/notion.svg',
        industry: 'Productivity',
        location: 'Medan, Sumatera Utara',
      },
      {
        name: 'Roblox Games Indo',
        logo: '/images/companies/roblox.svg',
        industry: 'Gaming',
        location: 'Jakarta Barat, DKI Jakarta',
      },
      {
        name: 'Reddit Forums ID',
        logo: '/images/companies/reddit.svg',
        industry: 'Social Media',
        location: 'Denpasar, Bali',
      },
      {
        name: 'Pinterest Ideas',
        logo: '/images/companies/pinterest.svg',
        industry: 'Social Media',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'LinkedIn Recruiter',
        logo: '/images/companies/linkedin.svg',
        industry: 'Professional Network',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'Salesforce CRM ID',
        logo: '/images/companies/salesforce.svg',
        industry: 'Cloud CRM',
        location: 'Surabaya, Jawa Timur',
      },
      {
        name: 'Oracle Databases',
        logo: '/images/companies/oracle.svg',
        industry: 'Database',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'Canva Pro Indo',
        logo: '/images/companies/canva.svg',
        industry: 'Design Tool',
        location: 'Yogyakarta, DIY',
      },
      {
        name: 'Shopify Sellers ID',
        logo: '/images/companies/shopify.svg',
        industry: 'E-commerce',
        location: 'Medan, Sumatera Utara',
      },
      {
        name: 'Stripe Payments ID',
        logo: '/images/companies/stripe.svg',
        industry: 'Fintech',
        location: 'Jakarta Barat, DKI Jakarta',
      },
      {
        name: 'Uber Eats Indo',
        logo: '/images/companies/uber.svg',
        industry: 'Logistics',
        location: 'Denpasar, Bali',
      },
      {
        name: 'GitHub Actions ID',
        logo: '/images/companies/github.svg',
        industry: 'Development',
        location: 'Jakarta Selatan, DKI Jakarta',
      },
      {
        name: 'GitLab Pipelines',
        logo: '/images/companies/gitlab.svg',
        industry: 'Development',
        location: 'Bandung, Jawa Barat',
      },
      {
        name: 'Coinbase Exchange',
        logo: '/images/companies/coinbase.svg',
        industry: 'Cryptocurrency',
        location: 'Surabaya, Jawa Timur',
      },
      {
        name: 'Binance Smart Chain',
        logo: '/images/companies/binance.svg',
        industry: 'Cryptocurrency',
        location: 'Jakarta Pusat, DKI Jakarta',
      },
      {
        name: 'GrabFood Indonesia',
        logo: '/images/companies/grab.svg',
        industry: 'Logistics',
        location: 'Yogyakarta, DIY',
      },
      {
        name: 'BukaMall Indonesia',
        logo: '/images/companies/bukalapak.svg',
        industry: 'E-commerce',
        location: 'Medan, Sumatera Utara',
      },
      {
        name: 'Traveloka Eats',
        logo: '/images/companies/traveloka.svg',
        industry: 'Travel & Tech',
        location: 'Jakarta Barat, DKI Jakarta',
      },
      {
        name: 'ShopeeFood ID',
        logo: '/images/companies/shopee.svg',
        industry: 'E-commerce',
        location: 'Denpasar, Bali',
      },
    ];

    const base = baseCompanies[index];
    const charSum = base.name
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return {
      id: String(index + 1),
      name: base.name,
      logo: base.logo,
      industry: base.industry,
      location: base.location,
      totalEmployees:
        index % 3 === 0 ? '1000+' : index % 3 === 1 ? '500-1000' : '100-500',
      openJobs: 5 + (index % 25),
      rating: Number((4.0 + (index % 10) * 0.1).toFixed(1)),
      isPremium: charSum % 3 === 0,
      isVerified: charSum % 2 === 0,
      postedAt: `${1 + (index % 7)} hari lalu`,
      description: index % 3 === 0
        ? `${base.name} adalah perusahaan terkemuka yang berfokus pada inovasi dan pengembangan solusi berkualitas tinggi di bidang ${base.industry}.`
        : `${base.name} merupakan salah satu pemimpin industri global terkemuka yang memiliki komitmen luar biasa dalam menghadirkan inovasi mutakhir serta solusi terbaik di bidang ${base.industry}. Didorong oleh visi besar untuk mentransformasi lanskap teknologi secara berkelanjutan, kami terus berinvestasi pada talenta terbaik dunia, penelitian mendalam, serta teknologi generasi berikutnya. Kami berkomitmen untuk memberdayakan setiap individu dan organisasi di seluruh penjuru dunia agar mampu mencapai lebih banyak hal melalui solusi digital terintegrasi yang andal, aman, berskala enterprise, dan dirancang dengan standar kualitas tertinggi.`,
      availableTitles: ['Software Engineer', 'Product Manager', 'Data Analyst'],
    };
  },
);

export default function CompanyList() {
  const router = useRouter();
  const { theme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    new Set(CompaniesPage.map((c) => c.location)),
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
  const filteredCompanies = CompaniesPage.filter((company) => {
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
        <div className="bg-card/60 backdrop-blur-md overflow-visible relative z-10">
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
                      ? 'pl-9 h-10 text-xs bg-[#eef5fa] border !border-border rounded-lg text-[#334155] placeholder-[#5c6f84] focus-visible:ring-1 focus-visible:ring-[#eef5fa]/50 focus-visible:ring-offset-0 !shadow-none'
                      : 'pl-9 h-10 text-xs bg-background/50 border !border-border rounded-lg placeholder-zinc-500 dark:placeholder-zinc-400 !shadow-none'
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
                      ? 'bg-[#eef5fa] border !border-border text-[#334155]'
                      : 'bg-background border !border-border text-foreground'
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
                    className={`absolute top-full left-0 right-0 mt-1 z-[100] rounded-lg border shadow-xl overflow-hidden ${
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
                  className="h-10 px-4 text-xs font-semibold flex items-center gap-1.5 w-full sm:w-auto cursor-pointer !border-red-500/40 hover:!border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
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
                  style={{ backgroundColor: 'hsl(var(--popover))' }}
                  className="absolute top-full right-0 mt-1 z-[100] rounded-lg border border-border shadow-xl overflow-hidden min-w-[160px]"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCompanies.map((company) => (
            <Card
              key={company.id}
              className="hover:shadow-md border bg-card/60 backdrop-blur-sm transition-all duration-200 group flex flex-col justify-between overflow-hidden"
            >
              <CardHeader className="py-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border overflow-hidden">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-8 h-8 object-contain"
                      />
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
                    onClick={() => router.push(`/companies/${company.id}`)}
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
                  mounted && theme === 'white' ? '!text-black' : ''
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center gap-1">
                {(totalPages <= 3
                  ? Array.from({ length: totalPages }, (_, i) => i + 1)
                  : [1, 2, 3]
                ).map((pageNum) => {
                  const isCurrent = currentPage === pageNum;
                  return (
                    <Button
                      key={pageNum}
                      variant={isCurrent ? 'default' : 'outline'}
                      className={`h-9 w-9 text-xs font-bold transition-all rounded-lg cursor-pointer ${
                        isCurrent
                          ? `bg-primary shadow-sm shadow-primary/25 hover:bg-primary/95 ${mounted && theme === 'white' ? '!text-black border border-black' : '!text-white'}`
                          : `border-border/60 hover:bg-accent hover:text-accent-foreground ${mounted && theme === 'white' ? 'text-black' : ''}`
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 3 && (
                  <span className="px-2.5 text-muted-foreground font-bold text-sm select-none">
                    ...
                  </span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className={`h-9 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50 ${
                  mounted && theme === 'white' ? '!text-black' : ''
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
}
