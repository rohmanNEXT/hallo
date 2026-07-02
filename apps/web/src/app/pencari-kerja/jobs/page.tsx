'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  LuSearch as Search,
  LuMapPin as MapPin,
  LuFilter as Filter,
  LuChevronDown as ChevronDown,
  LuBriefcase as Briefcase,
  LuClock as Clock,
  LuDollarSign as DollarSign,
  LuGraduationCap as GraduationCap,
  LuBuilding2 as Building2,
  LuBookmark as Bookmark,
  LuShieldCheck as ShieldCheck,
  LuCircleHelp as HelpIcon,
  LuArrowRight as ArrowRight,
  LuX as X,
  LuFlame as Flame,
  LuQrCode as QrCode,
  LuBookOpen as BookIcon,
  LuAlertCircle as AlertIcon,
  LuUpload as UploadIcon,
  LuChevronLeft as ChevronLeft,
  LuCheck as CheckIcon,
  LuShieldAlert as ShieldAlert,
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
import provincesData from '@/lib/indonesia-regions.json';
import axios from 'axios';
import { Job, ProvinceData } from '@/lib/types';
import Image from 'next/image';

const PROVINCES = provincesData as ProvinceData[];

const HELP_GUIDES = [
  {
    q: 'Bagaimana cara melamar pekerjaan?',
    a: 'Anda dapat mencari lowongan kerja yang sesuai di halaman utama, klik kartu lowongan untuk melihat rincian lengkap, lalu tekan tombol "Lamar Sekarang". Anda dapat memantau status lamaran Anda secara real-time di Dashboard Pencari Kerja pada tab "Lamaran Saya".',
  },
  {
    q: 'Mengapa akun saya berbadge Premium?',
    a: 'Badge premium diberikan kepada kandidat dengan data profil lengkap untuk memudahkan perusahaan menemukan keahlian Anda.',
  },
  {
    q: 'Apakah proses lamaran di platform ini dipungut biaya?',
    a: 'Tidak. Seluruh proses melamar pekerjaan di platform kami adalah 100% gratis. Jika ada pemungutan biaya pendaftaran atau akomodasi dengan alasan apapun, segera laporkan perusahaan tersebut melalui fitur "Laporkan Lowongan" yang tersedia.',
  },
  {
    q: 'Bagaimana cara mengganti kata sandi?',
    a: 'Buka Dashboard Pencari Kerja, masuk ke bagian Profil atau Pengaturan Akun, lalu ubah kata sandi Anda di sana.',
  },
];

const REPORT_FIELDS = [
  { id: 'lowongan',      label: 'Lowongan' },
  { id: 'perusahaan',   label: 'Perusahaan' },
  { id: 'chat',         label: 'Chat' },
  { id: 'keamanan_akun', label: 'Keamanan Akun' },
  { id: 'pembayaran',   label: 'Pembayaran' },
  { id: 'lainnya',      label: 'Lainnya' },
];

const REPORT_CATEGORIES: Record<string, string[]> = {
  lowongan: ['Deskripsi Pekerjaan Tidak Jelas', 'Indikasi Penipuan', 'Terdapat Pemungutan Biaya', 'Perusahaan Pialang', 'Gaji Terlalu Rendah', 'Lowongan Tidak Layak (SARA / Kekerasan)', 'Lainnya'],
  perusahaan: ['Informasi Perusahaan Tidak Valid', 'Indikasi Penipuan', 'Rekrutmen Bermasalah', 'Perusahaan Tidak Terdaftar', 'Lainnya'],
  chat: ['Pesan Spam', 'Konten Tidak Pantas', 'Penipuan Melalui Chat', 'Pelecehan / Intimidasi', 'Lainnya'],
  keamanan_akun: ['Akun Diretas', 'Phishing / Link Berbahaya', 'Data Pribadi Bocor', 'Login Tidak Dikenal', 'Lainnya'],
  pembayaran: ['Pembayaran Gagal', 'Tagihan Tidak Sesuai', 'Refund Bermasalah', 'Biaya Rekrutmen Tidak Sah', 'Lainnya'],
  lainnya: ['Masalah Teknis / Bug', 'Konten Tidak Pantas', 'Fitur Tidak Berjalan', 'Lainnya'],
};

interface HelpCenterModalProps {
  onClose: () => void;
}

const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'report'>('guide');
  const [reportStep, setReportStep] = useState<1 | 2>(1);
  const [selectedField, setSelectedField] = useState('lowongan');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredGuides = HELP_GUIDES.filter(
    (g) =>
      g.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, 5));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles].slice(0, 5));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || additionalInfo.length < 20) return;
    setReportStep(2);
  };

  const resetReport = () => {
    setSelectedField('lowongan');
    setSelectedCategory('');
    setAdditionalInfo('');
    setEmail('');
    setFiles([]);
    setReportStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl rounded-[24px] border bg-card text-foreground shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2">
            <HelpIcon className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">
              {activeTab === 'guide' ? 'Pusat Panduan & Bantuan' : 'Laporkan Kendala / Lowongan'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors bg-transparent border-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {reportStep !== 3 && (
          <div className="flex px-6 border-b border-border/40 shrink-0">
            <button
              onClick={() => {
                setActiveTab('guide');
                setReportStep(1);
              }}
              className={`pb-3 pt-3 font-bold text-xs border-b-2 -mb-[2px] transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Pusat Panduan FAQ
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`pb-3 pt-3 px-6 font-bold text-xs border-b-2 -mb-[2px] transition-all cursor-pointer ${
                activeTab === 'report'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Laporkan Kendala
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 md:p-8 smooth-scroll">
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari panduan..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGuides.map((guide, i) => (
                  <div key={i} className="p-5 border border-border/70 rounded-2xl bg-muted/10 space-y-2">
                    <h4 className="font-bold text-xs text-foreground flex items-start gap-1.5">
                      <span className="text-primary font-black">Q:</span>
                      {guide.q}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed pl-4">
                      {guide.a}
                    </p>
                  </div>
                ))}
                {filteredGuides.length === 0 && (
                  <div className="col-span-2 text-center py-10 text-xs text-muted-foreground">
                    Tidak menemukan kecocokan panduan.
                  </div>
                )}
              </div>

              <div className="text-center pt-4">
                <Link
                  href="/guide"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Lihat Halaman Panduan Lengkap <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'report' && (
            <div>
              {reportStep === 1 && (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Info banner */}
                  <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-500">
                    <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed font-medium">
                      Kami akan meninjau laporanmu dan mengambil tindakan yang dibutuhkan. Mohon berikan informasi sedetail mungkin. Laporan kamu akan tetap dirahasiakan.
                    </p>
                  </div>

                  {/* 1. Bidang Kendala */}
                  <div>
                    <label className="block text-xs font-extrabold text-foreground mb-1">
                      Bidang Kendala<span className="text-primary ml-0.5">*</span>
                    </label>
                    <p className="text-[10px] text-muted-foreground mb-3">Pilih bidang yang paling relevan dengan kendala yang kamu alami.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {REPORT_FIELDS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => { setSelectedField(f.id); setSelectedCategory(''); }}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                            selectedField === f.id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background hover:border-primary/40 hover:bg-muted/30 text-foreground'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Kategori Kendala */}
                  <div>
                    <label className="block text-xs font-extrabold text-foreground mb-1">
                      Kategori Kendala<span className="text-primary ml-0.5">*</span>
                    </label>
                    <p className="text-[10px] text-muted-foreground mb-3">Pilih kategori yang paling sesuai.</p>
                    <div className="space-y-1">
                      {(REPORT_CATEGORIES[selectedField] ?? []).map((cat) => (
                        <label
                          key={cat}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                            selectedCategory === cat
                              ? 'border-primary/50 bg-primary/5'
                              : 'border-transparent hover:bg-muted/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={cat}
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(cat)}
                            className="accent-primary shrink-0"
                          />
                          <span className="text-xs font-semibold text-foreground">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 3. Deskripsi Kendala */}
                  <div>
                    <label className="block text-xs font-extrabold text-foreground mb-1">
                      Deskripsi Kendala<span className="text-primary ml-0.5">*</span>
                    </label>
                    <p className="text-[10px] text-muted-foreground mb-2">Jelaskan kendala secara lengkap agar tim kami dapat menangani dengan tepat (min. 20 karakter).</p>
                    <div className="relative">
                      <textarea
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value.slice(0, 500))}
                        placeholder="Tambahkan penjelasan yang lengkap agar kami dapat melakukan tindakan lebih lanjut yang diperlukan…"
                        className="w-full h-28 p-3 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground resize-none"
                      />
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1">
                        <span>{additionalInfo.length < 20 && additionalInfo.length > 0 ? 'Minimal 20 karakter' : ''}</span>
                        <span>{additionalInfo.length} / 500</span>
                      </div>
                    </div>
                  </div>

                  {/* 4. Email Tujuan Bermasalah */}
                  <div>
                    <label className="block text-xs font-extrabold text-foreground mb-1">
                      Email Tujuan Bermasalah
                      <span className="text-muted-foreground font-normal ml-1.5">(opsional, jika terkait email)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground"
                    />
                  </div>

                  {/* 5. Upload Bukti Pendukung */}
                  <div>
                    <label className="block text-xs font-extrabold text-foreground mb-1">Upload Bukti Pendukung</label>
                    <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">
                      Hanya jenis gambar (JPEG, JPG, PNG) yang diterima. Maksimal 5 file, masing-masing kurang dari 5MB. Upload gambar atau geser file kamu ke kotak di bawah ini.
                    </p>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border/80 hover:border-primary/50 transition-colors rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 bg-muted/5"
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" multiple className="hidden" />
                      <UploadIcon className="h-6 w-6 text-muted-foreground" />
                      <span className="text-[10px] font-bold text-foreground">+ Upload Gambar</span>
                    </div>
                    {files.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                        {files.map((file, i) => (
                          <div key={i} className="relative p-2.5 border border-border/80 rounded-xl bg-muted/10 text-[10px] font-medium flex items-center justify-between">
                            <span className="truncate pr-4">{file.name}</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setFiles((prev) => prev.filter((_, idx) => idx !== i)); }} className="text-muted-foreground hover:text-primary cursor-pointer p-0 bg-transparent border-none">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-4 border-t border-border/40">
                    <button
                      type="submit"
                      disabled={!selectedCategory || additionalInfo.length < 20}
                      className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:scale-102 transition-transform cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      Kirim Laporan
                    </button>
                  </div>
                </form>
              )}

              {reportStep === 2 && (
                <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <CheckIcon className="h-8 w-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-foreground">Laporan Berhasil Dikirim</h3>
                    <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                      Terima kasih atas laporan Anda. Tim support kami akan segera meninjau laporan ini dalam waktu 1x24 jam.
                    </p>
                  </div>
                  <button
                    onClick={() => { resetReport(); onClose(); }}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:scale-102 transition-transform cursor-pointer shadow-sm mt-2"
                  >
                    Tutup Pusat Bantuan
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const JobsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookmarks, toggleBookmark, applyJob, theme, setTheme } =
    useAppStore();
  const [mounted, setMounted] = useState(false);
  const [mockJobsData, setMockJobsData] = useState<Job[]>([]);

  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get<Job[]>('/data/jobs.json');
        const jobsWithRandom = data.map(job => ({ ...job, _randomSort: Math.random() }));
        setMockJobsData(jobsWithRandom as Job[]);
      } catch (err) {
        console.error('Failed to fetch jobs in JobsPage:', err);
      }
    };
    fetchJobs();
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
  const [visibleJobsCount, setVisibleJobsCount] = useState(9);

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

  // Reset visible jobs count and re-randomize when filters change
  useEffect(() => {
    setVisibleJobsCount(9);
    setMockJobsData((prev) =>
      prev.map((job) => ({ ...job, _randomSort: Math.random() }))
    );
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
      // 1. Perusahaan Premium di urutan teratas
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;

      // 2. Berdasarkan sortBy jika newest
      if (sortBy === 'newest') {
        return a.postedDaysAgo - b.postedDaysAgo;
      }

      // 3. Randomisasi persisten per session (relevance/default)
      const randA = (a as any)._randomSort || 0;
      const randB = (b as any)._randomSort || 0;
      return randA - randB;
    });

  // Local scroll container infinite scroll listener
  const jobsListRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    if (!jobsListRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = jobsListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 80) {
      if (visibleJobsCount < filteredJobs.length) {
        setVisibleJobsCount((prev) => Math.min(prev + 9, filteredJobs.length));
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


  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-background relative overflow-visible z-10">
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
                    ? 'pl-9 h-10 text-xs bg-[#eef5fa] border border-border! rounded-lg text-[#334155] placeholder-[#5c6f84] focus-visible:ring-1 focus-visible:ring-[#eef5fa]/50 focus-visible:ring-offset-0 shadow-none!'
                    : 'pl-9 h-10 text-xs bg-background/50 border border-border! rounded-lg placeholder-zinc-500 dark:placeholder-zinc-400 shadow-none!'
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
                    ? 'bg-[#eef5fa] border border-border! text-[#334155]'
                    : 'bg-background border border-border! text-foreground'
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
            className={`lg:w-62 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'} space-y-4`}
          >
            {/* Download App QR Code Card */}
            <Card className="border bg-card/60 backdrop-blur-md shadow-sm p-4 flex items-center gap-4 relative z-30">
              <div className="bg-white p-1.5 rounded-lg shrink-0 border border-border flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-900" />
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
                </div>
              </CardHeader>

              <CardContent className="py-2 px-4 divide-y divide-border/60">
                <div className="py-3">
                  <button
                    onClick={() => toggleSection('workTypes')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
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

                <div className="py-3">
                  <button
                    onClick={() => toggleSection('workOptions')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
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

                <div className="py-3">
                  <button
                    onClick={() => toggleSection('lokasi')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <span>Kecamatan</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 transform transition-transform duration-200 ${activeSection === 'lokasi' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {activeSection === 'lokasi' && (
                    <div className="pt-2.5 space-y-2">
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
                            className="absolute top-full left-0 right-0 mt-1 z-100 rounded-lg border border-border shadow-xl overflow-hidden"
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
                            className="absolute top-full left-0 right-0 mt-1 z-100 rounded-lg border border-border shadow-xl overflow-hidden"
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

                <div className="py-3">
                  <button
                    onClick={() => toggleSection('experience')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
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
                            className="absolute top-full left-0 right-0 mt-1 z-100 rounded-lg border border-border shadow-xl overflow-hidden"
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

                <div className="py-3">
                  <button
                    onClick={() => toggleSection('education')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
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
                            className="absolute top-full left-0 right-0 mt-1 z-100 rounded-lg border border-border shadow-xl overflow-hidden"
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

                <div className="py-3">
                  <button
                    onClick={() => toggleSection('lastUpdate')}
                    className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
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

            <Card className="border bg-card/60 backdrop-blur-md shadow-sm p-4 relative z-10">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="w-full py-2 border rounded-lg hover:bg-accent text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-transparent"
              >
                <HelpIcon className="h-4 w-4 text-muted-foreground" />
                Help Center
              </button>
            </Card>
          </aside>

          <div className="flex-1 space-y-4 pb-4 pt-0">
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
                      className="absolute top-full right-0 mt-1 z-100 rounded-lg border border-border shadow-xl overflow-hidden min-w-[160px]"
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

            <div
              ref={jobsListRef}
              onScroll={handleScroll}
              className="max-h-[1080px] overflow-y-auto pr-2 smooth-scroll space-y-6"
            >
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

                  return (
                    <div
                      key={job.id}
                      onClick={() => {
                        router.push(`/pencari-kerja/jobs/${job.id}`);
                      }}
                      className="group relative flex flex-col justify-between rounded-xl border border-border/70 py-4 px-5 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary/50 bg-card"
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border overflow-hidden">
                                <Image
                                  src={job.logo}
                                  alt={job.company}
                                  className="w-6 h-6 object-contain"
                                 width={100} height={100} unoptimized />
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
                              className="text-muted-foreground hover:text-primary transition-colors p-1 shrink-0 cursor-pointer bg-transparent border-none"
                            >
                              <Bookmark
                                className={`h-4.5 w-4.5 ${bookmarks.includes(job.id) ? 'fill-primary/60' : ''}`}
                              />
                            </button>
                          </div>

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
                                  className={`text-[12px] font-normal px-2.5 py-0.5 h-6 ${
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
                                  className={`text-[12px] font-normal px-2.5 py-0.5 h-6 ${
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
                                  className={`text-[12px] font-normal px-2.5 py-0.5 h-6 ${
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
                  Tidak ada lowongan pekerjaan yang sesuai dengan kriteria filter Anda.
                </div>
              )}

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

      {isHelpOpen && (
        <HelpCenterModal onClose={() => setIsHelpOpen(false)} />
      )}
    </div>
  );
};

const JobsPageWithSuspense: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground font-medium">
              Memuat Pekerjaan...
            </p>
          </div>
        </div>
      }
    >
      <JobsPage />
    </Suspense>
  );
};

export default JobsPageWithSuspense;
