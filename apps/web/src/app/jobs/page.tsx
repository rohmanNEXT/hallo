'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Filter,
  ChevronDown,
  Briefcase,
  Clock,
  DollarSign,
  GraduationCap,
  Building2,
  Bookmark,
  HelpCircle,
  Share2,
  Send,
  CheckCircle,
  ExternalLink,
  Moon,
  Sun,
  Sparkles,
  ShieldCheck,
  HelpCircle as HelpIcon,
  ArrowRight,
  X,
  Flame,
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
import provincesData from '../../lib/indonesia-regions.json';
import { CompaniesPage } from '../companies/page';

export interface ProvinceData {
  province: string;
  regencies: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  salaryNum: number; // For slider filtering
  workOption: string;
  workType: string;
  experienceLevel: string;
  educationLevel: string;
  isPremium: boolean;
  isUrgent: boolean;
  isVerified: boolean;
  postedAt: string;
  postedDaysAgo: number;
  categories: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  description: string;
  managedBy: {
    name: string;
    isPremium: boolean;
    onlineStatus: string; // e.g., "10 menit lalu"
    avatar?: string;
  };
  companyDetails: {
    description: string;
    industry: string;
    employees: string;
    website: string;
    linkedin: string;
    instagram: string;
    cultureTitle: string;
    galleryImages: string[];
    galleryVideos: string[];
    workers: string[];
  };
}

const PROVINCES = provincesData as ProvinceData[];

export const mockJobsData: Job[] = [
  {
    name: 'Microsoft',
    logo: '/images/companies/microsoft.svg',
    title: 'Product Manager',
    cat: ['Product', 'Tech'],
  },
  {
    name: 'Google',
    logo: '/images/companies/google.svg',
    title: 'Senior Software Engineer',
    cat: ['Engineering', 'Tech'],
  },
  {
    name: 'Apple',
    logo: '/images/companies/apple.svg',
    title: 'iOS Developer',
    cat: ['Engineering', 'iOS'],
  },
  {
    name: 'Meta',
    logo: '/images/companies/meta.svg',
    title: 'Fullstack Engineer',
    cat: ['Engineering', 'Fullstack'],
  },
  {
    name: 'Spotify',
    logo: '/images/companies/spotify.svg',
    title: 'Backend Developer',
    cat: ['Engineering', 'Backend'],
  },
  {
    name: 'Netflix',
    logo: '/images/companies/netflix.svg',
    title: 'Frontend Specialist',
    cat: ['Engineering', 'Frontend'],
  },
  {
    name: 'Twitter',
    logo: '/images/companies/twitter.svg',
    title: 'Security Engineer',
    cat: ['Security', 'Tech'],
  },
  {
    name: 'Airbnb',
    logo: '/images/companies/airbnb.svg',
    title: 'UX Researcher',
    cat: ['Design', 'Research'],
  },
  {
    name: 'Zoom',
    logo: '/images/companies/zoom.svg',
    title: 'Quality Assurance',
    cat: ['QA', 'Testing'],
  },
  {
    name: 'Figma',
    logo: '/images/companies/figma.svg',
    title: 'Lead UI/UX Designer',
    cat: ['Design', 'Creative'],
  },
  {
    name: 'Adobe',
    logo: '/images/companies/adobe.svg',
    title: 'Graphic Designer',
    cat: ['Design', 'Creative'],
  },
  {
    name: 'Slack',
    logo: '/images/companies/slack.svg',
    title: 'Product Marketing',
    cat: ['Marketing', 'Business'],
  },
  {
    name: 'NVIDIA',
    logo: '/images/companies/nvidia.svg',
    title: 'AI/ML Engineer',
    cat: ['AI/ML', 'Tech'],
  },
  {
    name: 'Tesla',
    logo: '/images/companies/tesla.svg',
    title: 'Autopilot Software Lead',
    cat: ['Engineering', 'AI/ML'],
  },
  {
    name: 'Amazon',
    logo: '/images/companies/amazon.svg',
    title: 'Cloud Architect',
    cat: ['Cloud', 'Tech'],
  },
  {
    name: 'Intel',
    logo: '/images/companies/intel.svg',
    title: 'Hardware Engineer',
    cat: ['Hardware', 'Tech'],
  },
  {
    name: 'Samsung',
    logo: '/images/companies/samsung.svg',
    title: 'Mobile UI Architect',
    cat: ['Design', 'Mobile'],
  },
  {
    name: 'TikTok',
    logo: '/images/companies/tiktok.svg',
    title: 'Data Analyst',
    cat: ['Data', 'Analytics'],
  },
  {
    name: 'Grab',
    logo: '/images/companies/grab.svg',
    title: 'DevOps Engineer',
    cat: ['Engineering', 'DevOps'],
  },
  {
    name: 'Tokopedia',
    logo: '/images/companies/tokopedia.svg',
    title: 'Merchant Growth Manager',
    cat: ['Business', 'Growth'],
  },
  {
    name: 'Gojek',
    logo: '/images/companies/gojek.svg',
    title: 'Android Engineer',
    cat: ['Engineering', 'Mobile'],
  },
  {
    name: 'Traveloka',
    logo: '/images/companies/traveloka.svg',
    title: 'Flight Search Architect',
    cat: ['Engineering', 'Search'],
  },
  {
    name: 'Bukalapak',
    logo: '/images/companies/bukalapak.svg',
    title: 'SEO Specialist',
    cat: ['Marketing', 'Growth'],
  },
  {
    name: 'Shopee',
    logo: '/images/companies/shopee.svg',
    title: 'Product Operations Analyst',
    cat: ['Business', 'Operations'],
  },
  {
    name: 'Discord',
    logo: '/images/companies/discord.svg',
    title: 'Community Manager',
    cat: ['Community', 'Support'],
  },
  {
    name: 'Notion',
    logo: '/images/companies/notion.svg',
    title: 'Solutions Engineer',
    cat: ['Engineering', 'Support'],
  },
  {
    name: 'Roblox',
    logo: '/images/companies/roblox.svg',
    title: 'Game Engine Developer',
    cat: ['Engineering', 'Gaming'],
  },
  {
    name: 'Reddit',
    logo: '/images/companies/reddit.svg',
    title: 'Content Moderator',
    cat: ['Support', 'Operations'],
  },
  {
    name: 'Pinterest',
    logo: '/images/companies/pinterest.svg',
    title: 'Creative Lead',
    cat: ['Design', 'Creative'],
  },
  {
    name: 'LinkedIn',
    logo: '/images/companies/linkedin.svg',
    title: 'Talent Acquisition',
    cat: ['HR', 'Recruitment'],
  },
  {
    name: 'Salesforce',
    logo: '/images/companies/salesforce.svg',
    title: 'CRM Consultant',
    cat: ['Business', 'CRM'],
  },
  {
    name: 'Oracle',
    logo: '/images/companies/oracle.svg',
    title: 'Database Administrator',
    cat: ['Database', 'Tech'],
  },
  {
    name: 'Canva',
    logo: '/images/companies/canva.svg',
    title: 'Templates Creator Specialist',
    cat: ['Design', 'Creative'],
  },
  {
    name: 'Shopify',
    logo: '/images/companies/shopify.svg',
    title: 'E-commerce Engineer',
    cat: ['Engineering', 'E-commerce'],
  },
  {
    name: 'Stripe',
    logo: '/images/companies/stripe.svg',
    title: 'Payment API Engineer',
    cat: ['Engineering', 'Finance'],
  },
  {
    name: 'Uber',
    logo: '/images/companies/uber.svg',
    title: 'Rideshare Dispatch Lead',
    cat: ['Engineering', 'Operations'],
  },
  {
    name: 'GitHub',
    logo: '/images/companies/github.svg',
    title: 'Developer Advocate',
    cat: ['Engineering', 'Community'],
  },
  {
    name: 'GitLab',
    logo: '/images/companies/gitlab.svg',
    title: 'CI/CD Architect',
    cat: ['Engineering', 'DevOps'],
  },
  {
    name: 'Coinbase',
    logo: '/images/companies/coinbase.svg',
    title: 'Blockchain Security Engineer',
    cat: ['Engineering', 'Crypto'],
  },
  {
    name: 'Binance',
    logo: '/images/companies/binance.svg',
    title: 'Crypto Operations Manager',
    cat: ['Crypto', 'Operations'],
  },
].map((brand, i) => {
  const id = String(i + 1);
  const WORK_OPTIONS = ['Remote', 'Hybrid', 'Onsite'];
  const WORK_TYPES = [
    'Penuh Waktu',
    'Kontrak',
    'Magang',
    'Paruh Waktu',
    'Freelance',
  ];
  const EXP_LEVELS = [
    'Tidak berpengalaman',
    'Fresh Graduate',
    'Kurang dari setahun',
    '1-3 tahun',
    '3-5 tahun',
    '5-10 tahun',
    'Lebih dari 10 tahun',
  ];
  const EDU_LEVELS = [
    'S1',
    'D3',
    'SMA/SMK',
    'S1/D3',
  ];

  const allRegencies = PROVINCES.flatMap((p) => p.regencies);
  const location = allRegencies[i % allRegencies.length];
  const workOption = WORK_OPTIONS[i % WORK_OPTIONS.length];
  const workType = WORK_TYPES[i % WORK_TYPES.length];
  const experienceLevel = EXP_LEVELS[i % EXP_LEVELS.length];
  const educationLevel = EDU_LEVELS[i % EDU_LEVELS.length];
  const salaryNum = 10 + (i % 15);
  const salary = `Rp ${salaryNum}jt - Rp${salaryNum + 5}jt`;

  const companyObj = CompaniesPage.find((c) => c.name === brand.name);
  const isPremium = companyObj ? companyObj.isPremium : i % 3 === 0;
  const isUrgent = i % 2 === 0;
  const isVerified = companyObj ? companyObj.isVerified : i % 3 !== 1;

  const postedDaysAgo = i % 7;
  const postedAt =
    postedDaysAgo === 0 ? '3 jam lalu' : `${postedDaysAgo} hari lalu`;

  return {
    id,
    title: brand.title,
    company: brand.name,
    logo: `/images/companies/${brand.name.toLowerCase()}.svg`,
    location,
    salary,
    salaryNum,
    workOption,
    workType,
    experienceLevel,
    educationLevel,
    isPremium,
    isUrgent,
    isVerified,
    postedAt,
    postedDaysAgo,
    categories: brand.cat,
    requirements: [
      `Pengalaman kerja minimal di bidang terkait (${experienceLevel})`,
      `Menguasai stack utama ${brand.cat.join(' & ')}`,
      'Kemampuan komunikasi dan kolaborasi tim yang baik',
    ],
    skills: [...brand.cat, 'Agile', 'Git'],
    benefits: [
      'BPJS Kesehatan',
      'Bonus Kinerja Tahunan',
      'Waktu Kerja Fleksibel',
    ],
    description: `Bergabunglah bersama tim global kami di ${brand.name} untuk berkontribusi pada proyek skala enterprise di bidang ${brand.cat[0]}.\n\nTanggung Jawab Utama:\n- Mengelola siklus hidup produk dari ideasi, spesifikasi, pengembangan, hingga peluncuran.\n- Berkolaborasi dengan tim lintas divisi (desainer, engineer, pemasaran) untuk menyelaraskan visi produk.\n- Menganalisis masukan pengguna dan data performa untuk iterasi produk yang berkelanjutan.\n- Menyusun dokumentasi kebutuhan produk (PRD) yang jelas dan terperinci.`,
    managedBy: {
      name: `${brand.name} Recruiter`,
      isPremium,
      onlineStatus: i % 2 === 0 ? 'Online' : 'Aktif 10 menit lalu',
      avatar: `https://images.unsplash.com/photo-${
        i % 4 === 0
          ? '1534528741775-53994a69daeb'
          : i % 4 === 1
            ? '1507003211169-0a1dd7228f2d'
            : i % 4 === 2
              ? '1494790108377-be9c29b29330'
              : '1500648767791-00dcc994a43e'
      }?auto=format&fit=crop&w=100&h=100&q=80`,
    },
    companyDetails: {
      description: i % 3 === 0
        ? `${brand.name} adalah perusahaan teknologi global inovatif yang berkomitmen penuh untuk menghadirkan solusi cerdas terbaik di bidang ${brand.cat.join(' & ')}.`
        : `${brand.name} merupakan salah satu pemimpin industri global terkemuka yang memiliki komitmen luar biasa dalam menghadirkan inovasi mutakhir serta solusi terbaik di bidang ${brand.cat.join(' & ')}. Didorong oleh visi besar untuk mentransformasi lanskap teknologi secara berkelanjutan, kami terus berinvestasi pada talenta terbaik dunia, penelitian mendalam, serta teknologi generasi berikutnya. Kami berkomitmen untuk memberdayakan setiap individu dan organisasi di seluruh penjuru dunia agar mampu mencapai lebih banyak hal melalui solusi digital terintegrasi yang andal, aman, berskala enterprise, dan dirancang dengan standar kualitas tertinggi.`,
      industry: 'Teknologi & Informasi',
      employees: '1000+ Karyawan',
      website: `https://${brand.name.toLowerCase()}.com`,
      linkedin: `https://linkedin.com/company/${brand.name.toLowerCase()}`,
      instagram: `https://instagram.com/${brand.name.toLowerCase()}`,
      cultureTitle: 'Inovasi & Kolaborasi Tanpa Batas',
      galleryImages: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      ],
      galleryVideos: [
        'https://assets.mixkit.co/videos/preview/mixkit-working-in-a-modern-office-space-32863-large.mp4',
      ],
      workers: ['Alif (Tech Lead)', 'Sarah (Product Owner)'],
    },
  };
});

export default function JobsPage() {
  const router = useRouter();
  const { bookmarks, toggleBookmark, applyJob, theme, setTheme } =
    useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedRegency, setSelectedRegency] = useState('');
  const [salaryLimit, setSalaryLimit] = useState(30); // Max salary slider
  const [workOptions, setWorkOptions] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [expLevels, setExpLevels] = useState<string[]>([]);
  const [eduLevels, setEduLevels] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState('all'); // 'all', '1', '3', '7'

  const [sortBy, setSortBy] = useState('relevance');
  const [visibleJobsCount, setVisibleJobsCount] = useState(24);

  // UI Panels
  const [showFilters, setShowFilters] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  // Custom location dropdown state
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const allRegencies = PROVINCES.flatMap((p: ProvinceData) => p.regencies).sort(
    (a: string, b: string) => a.localeCompare(b),
  );
  const filteredRegencies = locationSearch
    ? allRegencies.filter((r: string) =>
        r.toLowerCase().includes(locationSearch.toLowerCase()),
      )
    : allRegencies;

  // Custom province dropdown (sidebar Kecamatan)
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState('');
  const provinceDropdownRef = useRef<HTMLDivElement>(null);
  const filteredProvinces = provinceSearch
    ? PROVINCES.filter((p: ProvinceData) =>
        p.province.toLowerCase().includes(provinceSearch.toLowerCase()),
      )
    : PROVINCES;

  // Custom regency dropdown (sidebar Kecamatan)
  const [isRegencyOpen, setIsRegencyOpen] = useState(false);
  const [regencySearch, setRegencySearch] = useState('');
  const regencyDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRegencies = selectedProvince
    ? PROVINCES.find((p: ProvinceData) => p.province === selectedProvince)
        ?.regencies || []
    : [];
  const filteredSidebarRegencies = regencySearch
    ? sidebarRegencies.filter((r: string) =>
        r.toLowerCase().includes(regencySearch.toLowerCase()),
      )
    : sidebarRegencies;

  // Custom exp dropdown
  const [isExpOpen, setIsExpOpen] = useState(false);
  const expDropdownRef = useRef<HTMLDivElement>(null);
  const expOptions = [
    'Tidak berpengalaman',
    'Fresh Graduate',
    'Kurang dari setahun',
    '1-3 tahun',
    '3-5 tahun',
    '5-10 tahun',
    'Lebih dari 10 tahun',
  ];

  // Custom edu dropdown
  const [isEduOpen, setIsEduOpen] = useState(false);
  const eduDropdownRef = useRef<HTMLDivElement>(null);
  const eduOptions = [
    'S3',
    'S2',
    'Pendidikan Profesi',
    'S1',
    'D1-D4',
    'SMA/SMK',
    'SMP',
    'SD',
  ];

  // Custom sortBy dropdown
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const sortOptions = [
    { value: 'relevance', label: 'Paling Relevan' },
    { value: 'newest', label: 'Baru Ditambahkan' },
  ];

  // Close all custom dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(e.target as Node)
      )
        setIsLocationOpen(false);
      if (
        provinceDropdownRef.current &&
        !provinceDropdownRef.current.contains(e.target as Node)
      )
        setIsProvinceOpen(false);
      if (
        regencyDropdownRef.current &&
        !regencyDropdownRef.current.contains(e.target as Node)
      )
        setIsRegencyOpen(false);
      if (
        expDropdownRef.current &&
        !expDropdownRef.current.contains(e.target as Node)
      )
        setIsExpOpen(false);
      if (
        eduDropdownRef.current &&
        !eduDropdownRef.current.contains(e.target as Node)
      )
        setIsEduOpen(false);
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      )
        setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Accordion UI State for Sidebar Filter (Only one open at a time)
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  // Debouncing Search Query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset visible jobs count when filters change
  useEffect(() => {
    setVisibleJobsCount(24);
  }, [
    debouncedSearch,
    selectedProvince,
    selectedRegency,
    salaryLimit,
    workOptions,
    workTypes,
    expLevels,
    eduLevels,
    lastUpdate,
    sortBy,
  ]);

  // Filter Logic
  const filteredJobs = mockJobsData
    .filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.categories.some((c) =>
          c.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );

      const matchProvince = selectedProvince
        ? job.location.includes(selectedProvince)
        : true;
      const matchRegency = selectedRegency
        ? job.location.includes(selectedRegency)
        : true;

      // Filter Gaji
      const matchSalary = job.salaryNum <= salaryLimit;

      // Badges arrays
      const matchWorkOption =
        workOptions.length > 0 ? workOptions.includes(job.workOption) : true;
      const matchWorkType =
        workTypes.length > 0 ? workTypes.includes(job.workType) : true;
      const matchExp =
        expLevels.length > 0 ? expLevels.includes(job.experienceLevel) : true;
      const matchEdu =
        eduLevels.length > 0 ? eduLevels.includes(job.educationLevel) : true;

      // Last update
      let matchDate = true;
      if (lastUpdate !== 'all') {
        matchDate = job.postedDaysAgo <= parseInt(lastUpdate, 10);
      }

      return (
        matchSearch &&
        matchProvince &&
        matchRegency &&
        matchSalary &&
        matchWorkOption &&
        matchWorkType &&
        matchExp &&
        matchEdu &&
        matchDate
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return a.postedDaysAgo - b.postedDaysAgo;
      }
      return 0; // relevance / standard order
    });

  // Local scroll container infinite scroll listener
  const jobsListRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    if (!jobsListRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = jobsListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 80) {
      if (visibleJobsCount < filteredJobs.length) {
        setVisibleJobsCount((prev) => Math.min(prev + 12, filteredJobs.length));
      }
    }
  };

  const handleApply = async (job: Job) => {
    setIsApplying(true);
    const success = await applyJob(job.id, job.title, job.company, job.logo);
    setIsApplying(false);
    if (success) {
      setAppliedJobs((prev) => [...prev, job.id]);
      alert(`Berhasil melamar pekerjaan di ${job.company}!`);
    } else {
      alert('Anda sudah melamar pekerjaan ini sebelumnya.');
    }
  };

  const toggleFilterArray = (
    item: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (state.includes(item)) {
      setState(state.filter((x) => x !== item));
    } else {
      setState([...state, item]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProvince('');
    setSelectedRegency('');
    setSalaryLimit(30);
    setWorkOptions([]);
    setWorkTypes([]);
    setExpLevels([]);
    setEduLevels([]);
    setLastUpdate('all');
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-card/60 relative overflow-visible z-10">
        <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 pt-7 pb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Input Search */}
            <div className="flex-1 relative w-full">
              {mounted && theme === 'white' ? (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5c6f84]" />
              ) : (
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                type="text"
                placeholder={
                  mounted && theme === 'white'
                    ? 'Cari Nama Pekerjaan, Skill, dan Perusahaan'
                    : 'Cari posisi pekerjaan, perusahaan atau kategori...'
                }
                className={
                  mounted && theme === 'white'
                    ? 'pl-9 h-10 text-xs bg-[#eef5fa] border !border-border rounded-lg text-[#334155] placeholder-[#5c6f84] focus-visible:ring-1 focus-visible:ring-[#eef5fa]/50 focus-visible:ring-offset-0 !shadow-none'
                    : 'pl-9 h-10 text-xs bg-background/50 border !border-border rounded-lg placeholder-zinc-500 dark:placeholder-zinc-400 !shadow-none'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* City Selector - Custom always-downward dropdown */}
            <div className="w-full sm:w-96 relative" ref={locationDropdownRef}>
              <MapPin
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 z-10 pointer-events-none ${mounted && theme === 'white' ? 'text-[#5c6f84]' : 'text-muted-foreground'}`}
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
                    selectedRegency
                      ? ''
                      : mounted && theme === 'white'
                        ? 'text-[#5c6f84]'
                        : 'text-muted-foreground'
                  }
                >
                  {selectedRegency ||
                    (mounted && theme === 'white'
                      ? 'Semua Kota/Provinsi'
                      : 'Semua Kota')}
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
                      placeholder="Cari kota..."
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
                        setSelectedRegency('');
                        setIsLocationOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${
                        !selectedRegency
                          ? 'font-semibold text-primary'
                          : mounted && theme === 'white'
                            ? 'text-[#334155]'
                            : 'text-foreground'
                      }`}
                    >
                      {mounted && theme === 'white'
                        ? 'Semua Kota/Provinsi'
                        : 'Semua Kota'}
                    </button>
                    {filteredRegencies.map((r: string) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setSelectedRegency(r);
                          setIsLocationOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${
                          selectedRegency === r
                            ? 'font-semibold text-primary bg-primary/5'
                            : mounted && theme === 'white'
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

            {/* Button Cari */}
            <Button
              type="button"
              onClick={() => {
                setDebouncedSearch(searchQuery);
              }}
              className={`h-10 px-6 text-xs font-extrabold border shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto shrink-0 ${
                mounted && theme === 'white'
                  ? 'bg-[#1877f2] hover:bg-[#166fe5] text-white'
                  : 'bg-primary text-white border-primary-foreground/30 hover:shadow-primary/25'
              }`}
              style={
                mounted && theme === 'white'
                  ? { borderColor: '#1877f2' }
                  : undefined
              }
            >
              <Search className="h-4 w-4 mr-1.5" />
              Cari Pekerjaan
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 pt-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <aside
            className={`lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'} space-y-4`}
          >
            {/* Download App QR Code Card */}
            <Card className="border bg-card/60 backdrop-blur-md shadow-sm p-4 flex items-center gap-4 relative z-30">
              <div className="bg-white p-1.5 rounded-lg shrink-0 border border-border flex items-center justify-center">
                {/* SVG QR Code */}
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 29 29"
                  fill="none"
                  className="text-slate-900"
                >
                  <path
                    d="M0 0h7v7H0zm1 1v5h5V1zm8 0h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm1 0h2v1h-2zm3 0h4v7h-4zm1 1v5h2V2zm-9 1h1v1H9zm1 0h1v1h-1zm2 0h1v1h-1zm-4 1h1v1H8zm5 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm-9 1h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h2v1h-2zm-6 3h1v1H8zm1 0h1v1H9zm4 0h1v1h-1zm1 0h2v1h-2zm2 0h1v1h-1zm-8 1h1v1H0zm1 1v5h5V9zm8 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm3 0h1v2h-1zm1 0h1v1h-1zm2 0h1v1h-1zm-7 1h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm2 0h2v1h-2zm-9 1h1v1H9zm3 0h1v1h-1zm3 0h1v1h-1zm-6 1h1v1H8zm1 0h1v1H9zm3 0h1v1h-1zm2 0h2v1h-2zm2 0h1v1h-1zm-8 1h1v1H0zm1 1v5h5v-5zm8 0h1v1h-1zm1 0h2v1h-2zm3 0h1v1h-1zm1 0h1v1h-1zm3 0h4v7h-4zm1 1v5h2v-5zm-9 1h1v1H9zm1 0h1v1h-1zm2 0h1v1h-1zm-4 1h1v1H8zm5 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm-9 1h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h2v1h-2zm-6 3h1v1H8zm1 0h1v1H9zm4 0h1v1h-1zm1 0h2v1h-2zm2 0h1v1h-1z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold text-foreground mb-1">
                  Unduh Aplikasi
                </h4>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  Scan QR code untuk download aplikasi JobSeeker.
                </p>
              </div>
            </Card>
            {/* Filter Options */}
            <Card className="border bg-card/60 backdrop-blur-md shadow-sm relative z-20">
              <CardHeader className="p-4 py-3.5 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground">
                    Filter
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-[10px] h-7 px-2 !border-red-500/40 hover:!border-red-500 transition-all text-red-500 hover:bg-red-500 hover:text-white font-semibold cursor-pointer"
                  >
                    Clean Filters
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="py-2 px-4 divide-y divide-border/60">
                {/* 2. Tipe Pekerjaan Accordion */}
                <div className="py-3">
                  <button
                    onClick={() => toggleSection('workTypes')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>Tipe Pekerjaan</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 transform transition-transform duration-200 ${activeSection === 'workTypes' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {activeSection === 'workTypes' && (
                    <div className="pt-2.5 pb-1 flex flex-wrap gap-2">
                      {[
                        'Penuh Waktu',
                        'Kontrak',
                        'Magang',
                        'Paruh Waktu',
                        'Freelance',
                      ].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            toggleFilterArray(type, workTypes, setWorkTypes)
                          }
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer font-medium ${
                            workTypes.includes(type)
                              ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/15'
                              : 'bg-muted/40 text-muted-foreground border-border/85 hover:bg-muted'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Kebijakan Kerja Accordion */}
                <div className="py-3">
                  <button
                    onClick={() => toggleSection('workOptions')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>Kebijakan Kerja</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 transform transition-transform duration-200 ${activeSection === 'workOptions' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {activeSection === 'workOptions' && (
                    <div className="pt-2.5 pb-1 flex flex-wrap gap-2">
                      {['Remote', 'Hybrid', 'Onsite'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            toggleFilterArray(opt, workOptions, setWorkOptions)
                          }
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer font-medium ${
                            workOptions.includes(opt)
                              ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/15'
                              : 'bg-muted/40 text-muted-foreground border-border/85 hover:bg-muted'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Kecamatan Accordion */}
                <div className="py-3">
                  <button
                    onClick={() => toggleSection('lokasi')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>Kecamatan</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 transform transition-transform duration-200 ${activeSection === 'lokasi' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {activeSection === 'lokasi' && (
                    <div className="pt-2.5 space-y-2">
                      {/* Province custom dropdown */}
                      <div className="relative" ref={provinceDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProvinceOpen(!isProvinceOpen);
                            setProvinceSearch('');
                            setIsRegencyOpen(false);
                          }}
                          className="w-full h-8 pl-2.5 pr-8 text-xs bg-background border rounded-md outline-none cursor-pointer text-left flex items-center"
                        >
                          <span
                            className={
                              selectedProvince
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }
                          >
                            {selectedProvince || 'Pilih Provinsi'}
                          </span>
                        </button>
                        <ChevronDown
                          className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none transition-transform duration-200 ${isProvinceOpen ? 'rotate-180' : ''}`}
                        />
                        {isProvinceOpen && (
                          <div
                            style={{ backgroundColor: 'hsl(var(--popover))' }}
                            className="absolute top-full left-0 right-0 mt-1 z-[100] rounded-lg border border-border shadow-xl overflow-hidden"
                          >
                            <div className="p-2 border-b border-border/60">
                              <input
                                autoFocus
                                type="text"
                                placeholder="Cari provinsi..."
                                value={provinceSearch}
                                onChange={(e) =>
                                  setProvinceSearch(e.target.value)
                                }
                                className="w-full px-2 py-1 text-xs rounded outline-none bg-muted text-foreground placeholder-muted-foreground"
                              />
                            </div>
                            <div className="max-h-44 overflow-y-auto">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProvince('');
                                  setSelectedRegency('');
                                  setIsProvinceOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${!selectedProvince ? 'font-semibold text-primary' : 'text-foreground'}`}
                              >
                                Pilih Provinsi
                              </button>
                              {filteredProvinces.map((p: ProvinceData) => (
                                <button
                                  key={p.province}
                                  type="button"
                                  onClick={() => {
                                    setSelectedProvince(p.province);
                                    setSelectedRegency('');
                                    setIsProvinceOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${selectedProvince === p.province ? 'font-semibold text-primary bg-primary/5' : 'text-foreground'}`}
                                >
                                  {p.province}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Regency custom dropdown */}
                      <div className="relative" ref={regencyDropdownRef}>
                        <button
                          type="button"
                          disabled={!selectedProvince}
                          onClick={() => {
                            if (selectedProvince) {
                              setIsRegencyOpen(!isRegencyOpen);
                              setRegencySearch('');
                              setIsProvinceOpen(false);
                            }
                          }}
                          className="w-full h-8 pl-2.5 pr-8 text-xs bg-background border rounded-md outline-none cursor-pointer text-left flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span
                            className={
                              selectedRegency
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }
                          >
                            {selectedRegency || 'Pilih Kabupaten/Kota'}
                          </span>
                        </button>
                        <ChevronDown
                          className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none transition-transform duration-200 ${isRegencyOpen ? 'rotate-180' : ''}`}
                        />
                        {isRegencyOpen && selectedProvince && (
                          <div
                            style={{ backgroundColor: 'hsl(var(--popover))' }}
                            className="absolute top-full left-0 right-0 mt-1 z-[100] rounded-lg border border-border shadow-xl overflow-hidden"
                          >
                            <div className="p-2 border-b border-border/60">
                              <input
                                autoFocus
                                type="text"
                                placeholder="Cari kab/kota..."
                                value={regencySearch}
                                onChange={(e) =>
                                  setRegencySearch(e.target.value)
                                }
                                className="w-full px-2 py-1 text-xs rounded outline-none bg-muted text-foreground placeholder-muted-foreground"
                              />
                            </div>
                            <div className="max-h-44 overflow-y-auto">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRegency('');
                                  setIsRegencyOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${!selectedRegency ? 'font-semibold text-primary' : 'text-foreground'}`}
                              >
                                Pilih Kabupaten/Kota
                              </button>
                              {filteredSidebarRegencies.map((r: string) => (
                                <button
                                  key={r}
                                  type="button"
                                  onClick={() => {
                                    setSelectedRegency(r);
                                    setIsRegencyOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${selectedRegency === r ? 'font-semibold text-primary bg-primary/5' : 'text-foreground'}`}
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Pengalaman Accordion */}
                <div className="py-3">
                  <button
                    onClick={() => toggleSection('experience')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>Pengalaman</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 transform transition-transform duration-200 ${activeSection === 'experience' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {activeSection === 'experience' && (
                    <div className="pt-2.5">
                      <div className="relative" ref={expDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsExpOpen(!isExpOpen)}
                          className="w-full h-8 pl-2.5 pr-8 text-xs bg-background border rounded-md outline-none cursor-pointer text-left flex items-center"
                        >
                          <span
                            className={
                              expLevels[0]
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }
                          >
                            {expLevels[0] || 'Semua Pengalaman'}
                          </span>
                        </button>
                        <ChevronDown
                          className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none transition-transform duration-200 ${isExpOpen ? 'rotate-180' : ''}`}
                        />
                        {isExpOpen && (
                          <div
                            style={{ backgroundColor: 'hsl(var(--popover))' }}
                            className="absolute top-full left-0 right-0 mt-1 z-[100] rounded-lg border border-border shadow-xl overflow-hidden"
                          >
                            <div className="max-h-52 overflow-y-auto">
                              <button
                                type="button"
                                onClick={() => {
                                  setExpLevels([]);
                                  setIsExpOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${!expLevels[0] ? 'font-semibold text-primary' : 'text-foreground'}`}
                              >
                                Semua Pengalaman
                              </button>
                              {expOptions.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    setExpLevels([opt]);
                                    setIsExpOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${expLevels[0] === opt ? 'font-semibold text-primary bg-primary/5' : 'text-foreground'}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Tingkat Pendidikan Accordion */}
                <div className="py-3">
                  <button
                    onClick={() => toggleSection('education')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>Tingkat Pendidikan</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 transform transition-transform duration-200 ${activeSection === 'education' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {activeSection === 'education' && (
                    <div className="pt-2.5">
                      <div className="relative" ref={eduDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsEduOpen(!isEduOpen)}
                          className="w-full h-8 pl-2.5 pr-8 text-xs bg-background border rounded-md outline-none cursor-pointer text-left flex items-center"
                        >
                          <span
                            className={
                              eduLevels[0]
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }
                          >
                            {eduLevels[0] || 'Semua Pendidikan'}
                          </span>
                        </button>
                        <ChevronDown
                          className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none transition-transform duration-200 ${isEduOpen ? 'rotate-180' : ''}`}
                        />
                        {isEduOpen && (
                          <div
                            style={{ backgroundColor: 'hsl(var(--popover))' }}
                            className="absolute top-full left-0 right-0 mt-1 z-[100] rounded-lg border border-border shadow-xl overflow-hidden"
                          >
                            <div className="max-h-52 overflow-y-auto">
                              <button
                                type="button"
                                onClick={() => {
                                  setEduLevels([]);
                                  setIsEduOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${!eduLevels[0] ? 'font-semibold text-primary' : 'text-foreground'}`}
                              >
                                Semua Pendidikan
                              </button>
                              {eduOptions.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    setEduLevels([opt]);
                                    setIsEduOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${eduLevels[0] === opt ? 'font-semibold text-primary bg-primary/5' : 'text-foreground'}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. Terakhir Diperbarui Accordion */}
                <div className="py-3">
                  <button
                    onClick={() => toggleSection('lastUpdate')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>Terakhir Diperbarui</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 transform transition-transform duration-200 ${activeSection === 'lastUpdate' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {activeSection === 'lastUpdate' && (
                    <div className="pt-2.5 pb-1 flex flex-wrap gap-2">
                      {[
                        { label: 'Kapan pun', value: 'all' },
                        { label: 'Sebulan Terakhir', value: '30' },
                        { label: 'Seminggu Terakhir', value: '7' },
                        { label: '24 Jam Terakhir', value: '1' },
                      ].map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setLastUpdate(item.value)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer font-medium ${
                            lastUpdate === item.value
                              ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/15'
                              : 'bg-muted/40 text-muted-foreground border-border/85 hover:bg-muted'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Help Center */}
            <Card className="border bg-card/60 backdrop-blur-md shadow-sm p-4 relative z-10">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="w-full py-2 border rounded-lg hover:bg-accent text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <HelpIcon className="h-4 w-4 text-muted-foreground" />
                Help Center
              </button>
            </Card>
          </aside>

          {/* Center Column: Jobs Grid List */}
          <div className="flex-1 space-y-4 pb-4 pt-0">
            {/* Header Result */}
            <div className="flex flex-row justify-between items-center pb-0">
              <span className="text-xs text-muted-foreground">
                <strong className="font-extrabold text-foreground">
                  {filteredJobs.length.toLocaleString('id-ID')}
                </strong>{' '}
                Jobs Found
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Sort by
                </span>
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="h-8 pl-3 pr-8 text-xs bg-background border border-border/80 rounded-lg outline-none cursor-pointer text-left flex items-center font-medium text-foreground hover:bg-muted/40 transition-all min-w-[130px]"
                  >
                    {sortOptions.find((o) => o.value === sortBy)?.label ||
                      'Paling Relevan'}
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

            {/* Local Scrollable Container for browsing lowongan */}
            <div
              ref={jobsListRef}
              onScroll={handleScroll}
              className="max-h-[1080px] overflow-y-auto pr-2 smooth-scroll space-y-6"
            >
              {/* Jobs 2-column responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.slice(0, visibleJobsCount).map((job) => {
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

                  const getBadgeColorClass = (text: string) => {
                    const colors = [
                      'border-sky-500/20 bg-sky-500/15 text-sky-600 dark:text-sky-400',
                      'border-emerald-500/20 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
                      'border-orange-600/20 bg-orange-600/15 text-orange-700 dark:text-orange-500',
                      'border-violet-500/20 bg-violet-500/15 text-violet-600 dark:text-violet-400',
                      'border-rose-500/20 bg-rose-500/15 text-rose-600 dark:text-rose-400',
                      'border-indigo-500/20 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
                      'border-cyan-500/20 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
                      'border-orange-500/20 bg-orange-500/15 text-orange-600 dark:text-orange-400',
                    ];
                    let hash = 0;
                    for (let i = 0; i < text.length; i++) {
                      hash = text.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    const index = Math.abs(hash) % colors.length;
                    return colors[index];
                  };

                  return (
                    <div
                      key={job.id}
                      onClick={() => {
                        router.push(`/jobs/${job.id}`);
                      }}
                      className="group relative flex flex-col justify-between rounded-xl border border-border/70 py-4 px-5 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary/50 bg-card"
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          {/* Header: Logo, Title, and Bookmark */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border overflow-hidden">
                                <img
                                  src={job.logo}
                                  alt={job.company}
                                  className="w-6 h-6 object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-[14px] text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                                  {job.title}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate font-medium mt-1 flex items-center gap-1">
                                  <span className="truncate">
                                    {job.company}
                                  </span>
                                  {job.isVerified && (
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10 shrink-0" />
                                  )}
                                  <span className="shrink-0">
                                    • {job.location}
                                  </span>
                                </p>
                              </div>
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
                                className={`h-4.5 w-4.5 ${bookmarks.includes(job.id) ? 'fill-primary text-primary' : ''}`}
                              />
                            </button>
                          </div>

                          {/* Badges Row (Exactly 2 lines height space) */}
                          <div className="flex flex-col gap-1.5 mb-4">
                            <div className="flex flex-wrap gap-1.5">
                              {row1.map((badge, idx) => (
                                <Badge
                                  key={idx}
                                  variant={
                                    badge.includes('Premium')
                                      ? 'secondary'
                                      : 'outline'
                                  }
                                  className={`text-[11.5px] font-normal px-2.5 py-0.5 h-6 ${
                                    badge.includes('Premium')
                                      ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold'
                                      : mounted && theme === 'white'
                                        ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                        : 'bg-background/50 border border-border/80 text-muted-foreground'
                                  }`}
                                >
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {row2.map((badge, idx) => (
                                <Badge
                                  key={idx}
                                  variant={
                                    badge.includes('Premium')
                                      ? 'secondary'
                                      : 'outline'
                                  }
                                  className={`text-[11.5px] font-normal px-2.5 py-0.5 h-6 ${
                                    badge.includes('Premium')
                                      ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold'
                                      : mounted && theme === 'white'
                                        ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                        : 'bg-background/50 border border-border/80 text-muted-foreground'
                                  }`}
                                >
                                  {badge}
                                </Badge>
                              ))}
                              {hasMore && (
                                <Badge
                                  variant="outline"
                                  className={`text-[11.5px] font-normal px-2.5 py-0.5 h-6 ${
                                    mounted && theme === 'white'
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

                        {/* Footer: Salary on Left, Time/Urgent on Right */}
                        <div className="flex items-center justify-between border-t pt-3 mt-auto h-9">
                          <span className="text-[12px] font-bold text-emerald-500">
                            {job.salary}
                          </span>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold h-6">
                            <span>{job.postedAt}</span>
                            {job.isUrgent && (
                              <Badge className="bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 font-semibold text-xs px-2 py-0 h-5 border border-red-500/10 shadow-none flex items-center gap-1">
                                <Flame className="h-2.5 w-2.5" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center text-muted-foreground py-16 text-sm">
                  Tidak ada lowongan pekerjaan yang sesuai dengan kriteria
                  filter Anda.
                </div>
              )}

              {/* Infinite Scroll/Lazy load indication */}
              {visibleJobsCount < filteredJobs.length && (
                <div className="text-center py-6">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    Memuat lowongan kerja lainnya...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HELP CENTER MODAL */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setIsHelpOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border bg-card/95 p-6 shadow-2xl backdrop-blur-md">
            <button
              onClick={() => setIsHelpOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4">
              <h2 className="text-sm font-bold flex items-center gap-1">
                <HelpIcon className="h-5 w-5 text-primary" />
                Pusat Bantuan (Help Center)
              </h2>
              <p className="text-xs text-muted-foreground">
                Pertanyaan yang sering ditanyakan mengenai portal lowongan kerja
                JobSeeker
              </p>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 smooth-scroll text-xs">
              <div>
                <h4 className="font-bold text-foreground">
                  1. Bagaimana cara melamar pekerjaan?
                </h4>
                <p className="text-muted-foreground mt-1">
                  Anda cukup mengklik tombol &quot;Lamar Sekarang&quot; di
                  detail lowongan kerja. Statusnya dapat dilacak langsung
                  melalui menu &quot;Lamaran Saya&quot;.
                </p>
              </div>
              <hr />
              <div>
                <h4 className="font-bold text-foreground">
                  2. Mengapa akun saya berbadge Premium?
                </h4>
                <p className="text-muted-foreground mt-1">
                  Badge premium diberikan kepada pelamar dengan data profil
                  lengkap untuk memudahkan perusahaan menemukan keahlian Anda.
                </p>
              </div>
              <hr />
              <div>
                <h4 className="font-bold text-foreground">
                  3. Apakah pergantian tema tersimpan?
                </h4>
                <p className="text-muted-foreground mt-1">
                  Ya, pilihan tema Anda disimpan otomatis di local storage
                  browser Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
