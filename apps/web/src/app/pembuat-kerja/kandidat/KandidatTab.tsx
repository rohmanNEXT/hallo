'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/store';
import { mockTalents } from '@/lib/mockTalents';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Checkbox from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  LuSearch as Search,
  LuFilter as Filter,
  LuArrowUpDown as ArrowUpDown,
  LuX as X,
  LuChevronDown as ChevronDown,
  LuUsers as Users,
  LuCalendar as Calendar,
  LuUserCheck as UserCheck,
  LuUserX as UserX,
  LuSend as Send,
  LuMessageSquare as MessageSquare,
  LuEye as Eye,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuPhone as Phone,
  LuMail as Mail,
  LuMapPin as MapPin,
  LuCheck as Check,
  LuCircleCheck as CheckCircle,
  LuArrowRight as ArrowRight,
  LuSparkles as Sparkles,
  LuBriefcase as BriefcaseIcon,
  LuGraduationCap as GradCapIcon,
  LuAward as AwardIcon,
  LuUser as UserIcon,
  LuUser as User,
  LuArrowLeft as ArrowLeft,
  LuFileText as FileText,
  LuGlobe as Globe,
  LuLinkedin as Linkedin,
  LuBriefcase as Briefcase,
  LuStar as Star,
  LuLockKeyholeOpen as Unlock,
  LuLock as Lock,
  LuDownload as Download,
} from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import MultiSelectJob from '@/components/ui/multi-select-job';
import CandidatePrintProfile from '@/components/CandidatePrintProfile';
import provincesData from '@/lib/indonesia-regions.json';
import { ProvinceData } from '@/lib/types';
import Image from 'next/image';

const PROVINCES = provincesData as ProvinceData[];

const CircleCheckIcon = () => (
  <CheckCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
);

const DEFAULT_POSITIONS = Array.from({ length: 400 }, (_, i) => {
  const baseRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'Product Manager',
    'Data Scientist',
    'DevOps Engineer',
    'QA Engineer',
    'Mobile Developer',
    'Digital Marketer',
    'SEO Specialist',
    'Content Writer',
    'Social Media Specialist',
    'Sales Executive',
    'Business Development',
    'Accountant',
    'HR Specialist',
    'Customer Service',
    'Office Admin',
    'Graphic Designer',
    'Video Editor',
    'IT Support',
    'Network Engineer',
    'Security Analyst',
    'Database Administrator',
    'Project Manager',
    'Scrum Master',
    'Business Analyst',
  ];
  const prefixes = [
    'Junior',
    'Senior',
    'Lead',
    'Staff',
    'Principal',
    'Associate',
    'Trainee',
    'Expert',
  ];
  const prefix = prefixes[i % prefixes.length];
  const role = baseRoles[i % baseRoles.length];
  return `${prefix} ${role} ${i >= baseRoles.length ? `Level ${Math.floor(i / baseRoles.length) + 1}` : ''}`.trim();
});

const DEFAULT_SKILLS = Array.from({ length: 900 }, (_, i) => {
  const baseSkills = [
    'React',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'Python',
    'SQL',
    'Java',
    'C#',
    'C++',
    'Go',
    'Rust',
    'Swift',
    'Kotlin',
    'HTML5',
    'CSS3',
    'Sass',
    'Tailwind CSS',
    'Bootstrap',
    'Next.js',
    'Vue.js',
    'Angular',
    'Express',
    'NestJS',
    'Django',
    'Flask',
    'Spring Boot',
    'PostgreSQL',
    'MongoDB',
    'MySQL',
    'Redis',
    'Elasticsearch',
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'GCP',
    'Git',
    'GitHub',
    'GitLab',
    'CI/CD',
    'Jira',
    'Confluence',
    'Figma',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Premiere Pro',
    'After Effects',
    'Sketch',
    'InVision',
    'Excel',
    'Word',
    'PowerPoint',
    'Google Analytics',
    'Google Ads',
    'Facebook Ads',
    'SEO',
    'SEM',
    'Copywriting',
    'Public Speaking',
    'Negotiation',
    'Project Management',
    'Agile',
    'Scrum',
    'Kanban',
    'Leadership',
  ];
  const suffix = [
    'Basic',
    'Intermediate',
    'Advanced',
    'Expert',
    'Proficient',
    'Certified',
    'Practitioner',
  ];
  const skill = baseSkills[i % baseSkills.length];
  const suf = suffix[i % suffix.length];
  return `${skill} (${suf} ${Math.floor(i / baseSkills.length) + 1})`;
});

export function calculateHalloScore(talent: any, job: any) {
  let score = 0;
  const totalCriteria = 9;

  // 1. Isi Posisi
  if (talent?.title && job?.title) {
    const jobWords = job.title.toLowerCase().split(/\s+/);
    const hasMatch = talent.title
      .toLowerCase()
      .split(/\s+/)
      .some((w: string) => jobWords.includes(w));
    if (hasMatch) score += 1;
    else score += 0.5;
  } else if (talent?.title) {
    score += 0.5;
  }

  // 2. Deskripsi Profil (cek tersedia atau tidak)
  if (talent?.aboutMe && talent.aboutMe.trim() !== '') {
    score += 1;
  } else if (talent?.title) {
    score += 0.5;
  }

  // 3. Isi Pendidikan
  if (talent?.education && talent.education !== 'Semua') {
    score += 1;
  }

  // 4. Pengalaman Kerja (cek tersedia atau tidak)
  if (talent?.experienceYears !== undefined && talent.experienceYears > 0) {
    score += 1;
  }

  // 5. Isi Bahasa (mocked: if they have skills, they have language/skills filled)
  if (talent?.skills && talent.skills.length > 0) {
    score += 1;
  }

  // 6. Isi Lokasi
  if (talent?.location) {
    score += 1;
  }

  // 7. Isi Work Option
  if (talent?.jobInterest) {
    score += 1;
  }

  // 8. Link Portofolio (cek tersedia atau tidak)
  if (talent?.hasCertificate || talent?.id) {
    score += 1;
  }

  // 9. Resume/CV (cek tersedia atau tidak)
  if (talent?.hasCv) {
    score += 1;
  }

  return Math.round((score / totalCriteria) * 100);
}

const KandidatTab: React.FC = () => {
  const {
    user,
    employerJobs,
    employerApplications,
    hrdAccounts,
    updateApplicationStatus,
    sendCandidateMessage,
    favoriteTalents,
    toggleFavoriteTalent,
    unlockedTalents,
    unlockTalent,
  } = useAppStore();

  const activeHrd =
    user?.employerRole === 'HRD'
      ? hrdAccounts.find((h) => h.id === user.hrdId)
      : null;
  const filteredAppsByRole = activeHrd
    ? employerApplications.filter((app) =>
        activeHrd.assignedJobIds.includes(app.jobId),
      )
    : employerApplications;

  const router = useRouter();

  // State to view a specific talent's full profile
  const [viewingTalentProfile, setViewingTalentProfile] = useState<any | null>(
    null,
  );

  // State to view detailed match breakdown
  const [selectedMatchApp, setSelectedMatchApp] = useState<any | null>(null);
  const [openMatchAccordions, setOpenMatchAccordions] = useState<
    Record<string, boolean>
  >({
    posisi: true,
    ringkasan: false,
    pendidikan: false,
    pengalaman: false,
    bahasa: false,
    lokasi: false,
    opsi: false,
    portofolio: false,
    cv: false,
  });

  const toggleMatchAccordion = (key: string) => {
    setOpenMatchAccordions((prev) => {
      const isCurrentlyOpen = !!prev[key];
      const nextState: Record<string, boolean> = {
        posisi: false,
        ringkasan: false,
        pendidikan: false,
        pengalaman: false,
        bahasa: false,
        lokasi: false,
        opsi: false,
        portofolio: false,
        cv: false,
      };
      nextState[key] = !isCurrentlyOpen;
      return nextState;
    });
  };

  // Candidate Filters
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [candidateStatusTab, setCandidateStatusTab] = useState<
    'Melamar' | 'Terseleksi' | 'Diterima' | 'Ditutup'
  >('Melamar');
  const [cMinSalary, setCMinSalary] = useState('');
  const [cMaxSalary, setCMaxSalary] = useState('');
  const [cGender, setCGender] = useState('Semua');
  const [cLocation, setCLocation] = useState('');
  const [cSkill, setCSkill] = useState('');
  const [cEducation, setCEducation] = useState('Semua');
  const [cMinAge, setCMinAge] = useState('');
  const [cMaxAge, setCMaxAge] = useState('');
  const [cSorting, setCSorting] = useState<
    'Terbaru' | 'Terlama' | 'Berpengalaman' | 'Score' | 'AI'
  >('Terbaru');

  // Work Types & Work Options Filters
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedWorkOptions, setSelectedWorkOptions] = useState<string[]>([]);

  // Expanded filter states
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [positionSearchQuery, setPositionSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedRegency, setSelectedRegency] = useState('');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [regencySearch, setRegencySearch] = useState('');
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isRegencyOpen, setIsRegencyOpen] = useState(false);
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);

  // Prep Readiness flags (Persiapan Kerja)
  const [readyNow, setReadyNow] = useState(false);
  const [hasSim, setHasSim] = useState(false);
  const [hasSkck, setHasSkck] = useState(false);
  const [hasCv, setHasCv] = useState(false);
  const [hasMotor, setHasMotor] = useState(false);
  const [hasLaptop, setHasLaptop] = useState(false);
  const [hasCertificate, setHasCertificate] = useState(false);
  const [willingToRelocate, setWillingToRelocate] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Selected app for detail floating window
  const [selectedDetailApp, setSelectedDetailApp] = useState<any | null>(null);

  // Additional Popover Checkboxes
  const [candShowFav, setCandShowFav] = useState(false);
  const [candShowUnchecked, setCandShowUnchecked] = useState(false);
  const [candShowWithPhoto, setCandShowWithPhoto] = useState(false);
  const [candShowByExp, setCandShowByExp] = useState(false);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    candidateSearch,
    candidateStatusTab,
    selectedJobIds,
    cMinSalary,
    cMaxSalary,
    cGender,
    cLocation,
    cSkill,
    cEducation,
    cMinAge,
    cMaxAge,
    readyNow,
    hasSim,
    hasSkck,
    hasCv,
    hasMotor,
    hasLaptop,
    hasCertificate,
    willingToRelocate,
    selectedWorkTypes,
    selectedWorkOptions,
    cSorting,
    selectedPositions,
    selectedSkills,
    selectedProvince,
    selectedRegency,
    candShowFav,
    candShowUnchecked,
    candShowWithPhoto,
    candShowByExp,
  ]);

  // Candidate Chat & Quick Action state
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >('app-1');
  const [chatMessageText, setChatMessageText] = useState('');

  // Popover States
  const [isCandFilterOpen, setIsCandFilterOpen] = useState(false);
  const [isCandSortOpen, setIsCandSortOpen] = useState(false);
  const [popoverActiveGroup, setPopoverActiveGroup] = useState<string | null>(
    null,
  );

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !selectedApplicationId) return;

    sendCandidateMessage(selectedApplicationId, chatMessageText.trim());
    setChatMessageText('');
  };

  const enrichedApplications = filteredAppsByRole
    .map((app) => {
      const talentInfo = mockTalents.find((t) => t.id === app.talentId);
      const jobInfo = employerJobs.find((j) => j.id === app.jobId);
      return {
        ...app,
        talent: talentInfo,
        job: jobInfo,
      };
    })
    .filter((app) => app.talent !== undefined);

  const filteredApplications = enrichedApplications.filter((app) => {
    if (app.status !== candidateStatusTab) return false;

    if (selectedJobIds.length > 0 && !selectedJobIds.includes(app.jobId)) {
      return false;
    }

    if (candidateSearch.trim()) {
      const q = candidateSearch.toLowerCase();
      const nameMatch = app.talent?.name.toLowerCase().includes(q);
      const titleMatch =
        app.job?.title.toLowerCase().includes(q) ||
        app.talent?.title.toLowerCase().includes(q);
      if (!nameMatch && !titleMatch) return false;
    }

    // Positions Filter
    if (selectedPositions.length > 0) {
      const matchPosition = selectedPositions.some((pos) =>
        app.talent?.title.toLowerCase().includes(pos.toLowerCase()),
      );
      if (!matchPosition) return false;
    }

    // Skills Filter
    if (selectedSkills.length > 0) {
      const matchSkill = selectedSkills.some((sk) =>
        app.talent?.skills.some((ts: string) =>
          ts.toLowerCase().includes(sk.toLowerCase()),
        ),
      );
      if (!matchSkill) return false;
    }

    // Location (Province & Regency) Filter
    if (selectedProvince) {
      const matchProv = app.talent?.location
        .toLowerCase()
        .includes(selectedProvince.toLowerCase());
      if (!matchProv) {
        const provData = PROVINCES.find((p) => p.province === selectedProvince);
        const matchReg = provData?.regencies.some((r) =>
          app.talent?.location.toLowerCase().includes(r.toLowerCase()),
        );
        if (!matchReg) return false;
      }
    }
    if (
      selectedRegency &&
      !app.talent?.location
        .toLowerCase()
        .includes(selectedRegency.toLowerCase())
    ) {
      return false;
    }

    // Salary Filter
    if (cMinSalary && (app.talent?.expectedSalary || 0) < Number(cMinSalary))
      return false;
    if (cMaxSalary && (app.talent?.expectedSalary || 0) > Number(cMaxSalary))
      return false;

    // Gender Filter
    if (cGender !== 'Semua' && app.talent?.gender !== cGender) return false;

    // Education Filter
    if (cEducation !== 'Semua') {
      if (cEducation === 'SMA/SMK' && app.talent?.education !== 'SMA/SMK')
        return false;
      else if (app.talent?.education !== cEducation) return false;
    }

    // Age Filter
    if (cMinAge && (app.talent?.age || 0) < Number(cMinAge)) return false;
    if (cMaxAge && (app.talent?.age || 0) > Number(cMaxAge)) return false;

    // Readiness Filters
    if (readyNow && !app.talent?.readyNow) return false;
    if (hasSim && !app.talent?.hasSim) return false;
    if (hasSkck && !app.talent?.hasSkck) return false;
    if (hasCv && !app.talent?.hasCv) return false;
    if (hasMotor && !app.talent?.hasMotor) return false;
    if (hasLaptop && !app.talent?.hasLaptop) return false;
    if (hasCertificate && !app.talent?.hasCertificate) return false;
    if (willingToRelocate && !app.talent?.willingToRelocate) return false;

    // Tipe Pekerjaan & Kebijakan Kerja Filters
    if (selectedWorkTypes.length > 0) {
      const interestMapping: Record<string, string> = {
        'Penuh Waktu': 'Full Time',
        'Paruh Waktu': 'Part Time',
        Kontrak: 'Contract',
        Magang: 'Internship',
        Freelance: 'Freelance',
      };
      const mappedInterests = selectedWorkTypes.map(
        (t) => interestMapping[t] || t,
      );
      const matchWorkType = mappedInterests.some((t) => {
        return app.talent?.title.toLowerCase().includes(t.toLowerCase());
      });
      if (!matchWorkType) return false;
    }

    if (selectedWorkOptions.length > 0) {
      const optMapping: Record<string, string> = {
        Remote: 'Remote',
        Hybrid: 'Hybrid',
        Onsite: 'Onsite',
      };
      const mappedOpts = selectedWorkOptions.map((o) => optMapping[o] || o);
      const opt = app.talent?.willingToRelocate
        ? 'Onsite'
        : parseInt(app.talent?.id.replace(/\D/g, '') || '0', 10) % 2 === 0
          ? 'Remote'
          : 'Hybrid';
      if (!mappedOpts.includes(opt)) return false;
    }

    // Advanced Checkboxes Filters
    if (
      candShowFav &&
      app.talentId &&
      !favoriteTalents.includes(app.talentId)
    ) {
      return false;
    }
    if (candShowUnchecked && app.status !== 'Melamar') return false;
    if (
      candShowWithPhoto &&
      (!app.talent?.avatar || app.talent?.avatar.includes('default'))
    )
      return false;
    if (candShowByExp) {
      const isSesuai =
        (app.talent?.experienceYears || 0) >=
        (app.job?.title?.includes('Senior') ? 5 : 1);
      if (!isSesuai) return false;
    }

    return true;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (cSorting === 'Terbaru') return b.id.localeCompare(a.id);
    if (cSorting === 'Terlama') return a.id.localeCompare(b.id);
    if (cSorting === 'Berpengalaman')
      return (
        (b.talent?.experienceYears || 0) - (a.talent?.experienceYears || 0)
      );
    if (cSorting === 'Score' || cSorting === 'AI')
      return (b.talent?.profileScore || 0) - (a.talent?.profileScore || 0);
    return 0;
  });

  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = sortedApplications.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const activeApplication = enrichedApplications.find(
    (app) => app.id === selectedApplicationId,
  );

  if (viewingTalentProfile) {
    return (
      <div className="w-full space-y-6 animate-in fade-in duration-300">
        <CandidatePrintProfile profile={viewingTalentProfile} />

        <div className="flex items-center justify-between">
          <Button
            onClick={() => setViewingTalentProfile(null)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs font-semibold hover:bg-muted border border-border cursor-pointer bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </Button>

          <Button
            onClick={() => {
              if (user?.plan !== 'Platinum') {
                alert(
                  'Fitur Export ke PDF hanya tersedia untuk pengguna Platinum.',
                );
                return;
              }
              window.print();
            }}
            variant="default"
            size="sm"
            disabled={user?.plan !== 'Platinum'}
            className={`flex items-center gap-2 text-xs font-semibold cursor-pointer ${user?.plan !== 'Platinum' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Download className="h-4 w-4" />
            <span>Export ke PDF</span>
            {user?.plan !== 'Platinum' && <Lock className="w-3 h-3 ml-1" />}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative">
          <div
            className="h-20 md:h-28 bg-cover bg-center relative transition-all duration-300"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80&auto=format&fit=crop')`,
            }}
          >
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <div className="px-6 md:px-8 pb-4 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-8 sm:-mt-10 gap-4 mb-2">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 text-center sm:text-left">
                <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden border-2 border-card shadow-md bg-muted shrink-0">
                  {viewingTalentProfile.avatar &&
                  !viewingTalentProfile.avatar.includes('default-avatar') &&
                  !viewingTalentProfile.avatar.includes('placeholder') ? (
                    <>
                      <Image
                        src={viewingTalentProfile.avatar}
                        alt={viewingTalentProfile.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        width={100}
                        height={100}
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback =
                            e.currentTarget.parentElement?.querySelector(
                              '.avatar-fallback',
                            ) as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="avatar-fallback hidden absolute inset-0 items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-lg md:text-xl font-black uppercase">
                        {viewingTalentProfile.name?.[0] || '?'}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-lg md:text-xl font-black uppercase">
                      {viewingTalentProfile.name?.[0] || '?'}
                    </div>
                  )}
                </div>
                <div className="space-y-0.5 pb-1">
                  <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-foreground sm:text-white sm:drop-shadow-[0_2px_4px_rgba(0,0,0,0.75)]">
                    {viewingTalentProfile.name}
                  </h1>
                  <p className="text-xs md:text-xs font-semibold text-muted-foreground sm:text-white/90 sm:drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
                    {viewingTalentProfile.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Tentang Saya */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  Tentang Saya
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                {viewingTalentProfile.aboutMe ||
                  'Saya adalah Frontend Engineer yang bersemangat dalam membangun antarmuka web yang interaktif, responsif, dan ramah pengguna.'}
              </p>
            </div>

            {/* Pengalaman Kerja */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  Pengalaman Kerja
                </h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 bg-background/40 border border-border/50 p-3 rounded-xl">
                  <span className="text-sm shrink-0">
                    <BriefcaseIcon className="w-4 h-4 shrink-0 text-slate-400" />
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    Junior Developer di TechCorp Indonesia (
                    {viewingTalentProfile.experienceYears || 1} Tahun)
                  </span>
                </div>
              </div>
            </div>

            {/* Pendidikan */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  Pendidikan
                </h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 bg-background/40 border border-border/50 p-3 rounded-xl">
                  <span className="text-sm shrink-0">
                    <GradCapIcon className="w-4 h-4 shrink-0 text-slate-400" />
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {viewingTalentProfile.education || 'S1 Teknik Informatika'}{' '}
                    - Universitas Indonesia (2018 - 2022)
                  </span>
                </div>
              </div>
            </div>

            {/* Keahlian / Skill */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  Keahlian / Skill
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(viewingTalentProfile.skills &&
                viewingTalentProfile.skills.length > 0
                  ? viewingTalentProfile.skills
                  : [
                      'React',
                      'Next.js',
                      'TypeScript',
                      'Tailwind CSS',
                      'Zustand',
                      'HTML5',
                      'CSS3',
                    ]
                ).map((sk: string) => (
                  <span
                    key={sk}
                    className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-stone-700 px-3 py-1 rounded-full bg-transparent"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Sertifikasi / Lisensi */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  Sertifikasi / Lisensi
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-background/40 border border-border/50 p-3.5 rounded-xl">
                  <span className="text-xs shrink-0">
                    <AwardIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    AWS Certified Developer - Associate
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-background/40 border border-border/50 p-3.5 rounded-xl">
                  <span className="text-xs shrink-0">
                    <AwardIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    Next.js Professional Certificate
                  </span>
                </div>
              </div>
            </div>

            {/* Pengalaman Organisasi */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  Pengalaman Organisasi
                </h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 bg-background/40 border border-border/50 p-3.5 rounded-xl">
                  <span className="text-xs shrink-0">
                    <UserIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    Ketua Himpunan Mahasiswa Informatika (2020 - 2021)
                  </span>
                </div>
              </div>
            </div>
            {/* Referensi Pekerjaan Minat */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  Referensi Pekerjaan Minat
                </h3>
              </div>

              <div className="space-y-6">
                {/* Row 1: Bidang Minat */}
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4 items-start">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Bidang Minat
                  </span>
                  <div className="space-y-2">
                    <div className="space-y-2.5 my-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        <CircleCheckIcon />
                        <span>
                          {viewingTalentProfile.title || 'Frontend Developer'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        <CircleCheckIcon />
                        <span>
                          {viewingTalentProfile.title?.includes('Frontend')
                            ? 'Full Stack Developer'
                            : 'Web Developer'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        <CircleCheckIcon />
                        <span>
                          {viewingTalentProfile.title?.includes('Designer')
                            ? 'UI Developer'
                            : 'Software Engineer'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Tipe Pekerjaan */}
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4 items-start pt-2 border-t border-border/45">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tipe Pekerjaan
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                      <CircleCheckIcon />
                      <span>Penuh Waktu</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                      <CircleCheckIcon />
                      <span>Paruh Waktu</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                      <CircleCheckIcon />
                      <span>Magang</span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Ekspektasi Gaji Bulanan */}
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4 items-start pt-2 border-t border-border/45">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Ekspektasi Gaji Bulanan
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    IDR{' '}
                    {(
                      (viewingTalentProfile.expectedSalary || 5000000) /
                        1000000 -
                      4
                    ).toFixed(0)}{' '}
                    jt -{' '}
                    {(
                      (viewingTalentProfile.expectedSalary || 5000000) / 1000000
                    ).toFixed(0)}{' '}
                    jt
                  </span>
                </div>

                {/* Row 4: Preferensi Kota Kerja */}
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4 items-start pt-2 border-t border-border/45">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Preferensi Kota Kerja
                  </span>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                    <CircleCheckIcon />
                    <span>
                      {viewingTalentProfile.location || 'Surabaya'}, Jawa Timur
                    </span>
                  </div>
                </div>

                {/* Row 5: Bersedia Bekerja */}
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4 items-start pt-2 border-t border-border/45">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Bersedia Bekerja
                  </span>
                  <div className="space-y-2">
                    {(() => {
                      const opt = viewingTalentProfile.willingToRelocate
                        ? 'Onsite'
                        : parseInt(
                              viewingTalentProfile.id.replace(/\D/g, '') || '0',
                              10,
                            ) %
                              2 ===
                            0
                          ? 'Remote'
                          : 'Hybrid';
                      return (
                        <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                          <CircleCheckIcon />
                          <span>{opt}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Kelola Kandidat (Action Panel) */}
            {(() => {
              const talentApp = employerApplications.find(
                (app) => app.talentId === viewingTalentProfile.id,
              );
              if (!talentApp) return null;

              return (
                <div className="bg-card/20 backdrop-blur-sm border border-border/80 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <h3 className="font-extrabold text-xs text-foreground tracking-wider uppercase">
                      Status & Tindakan
                    </h3>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-semibold">
                      Status Lamaran:
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[10px] border ${
                        talentApp.status === 'Melamar'
                          ? 'border-border/60 bg-transparent text-muted-foreground'
                          : talentApp.status === 'Terseleksi'
                            ? 'border-amber-500/30 bg-transparent text-amber-500'
                            : talentApp.status === 'Diterima'
                              ? 'border-emerald-500/30 bg-transparent text-emerald-500'
                              : 'border-rose-500/30 bg-transparent text-rose-500'
                      }`}
                    >
                      {talentApp.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 pt-1">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          updateApplicationStatus(talentApp.id, 'Terseleksi');
                          alert(
                            'Status berhasil diubah menjadi Interview (Terseleksi)!',
                          );
                        }}
                        className={`h-9 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all border ${
                          talentApp.status === 'Terseleksi'
                            ? 'bg-amber-500/5 border-amber-500/20 text-amber-500 shadow-xs'
                            : 'bg-transparent border-border/50 text-muted-foreground hover:border-amber-500/50 hover:text-amber-500 hover:bg-amber-500/5'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Interview</span>
                      </button>

                      <button
                        onClick={() => {
                          updateApplicationStatus(talentApp.id, 'Diterima');
                          alert('Status berhasil diubah menjadi Diterima!');
                        }}
                        className={`h-9 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all border ${
                          talentApp.status === 'Diterima'
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 shadow-xs'
                            : 'bg-transparent border-border/50 text-muted-foreground hover:border-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/5'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Terima</span>
                      </button>

                      <button
                        onClick={() => {
                          updateApplicationStatus(talentApp.id, 'Ditutup');
                          alert(
                            'Status berhasil diubah menjadi Tolak (Ditutup)!',
                          );
                        }}
                        className={`h-9 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all border ${
                          talentApp.status === 'Ditutup'
                            ? 'bg-rose-500/5 border-rose-500/20 text-rose-500 shadow-xs'
                            : 'bg-transparent border-border/50 text-muted-foreground hover:border-rose-500/50 hover:text-rose-500 hover:bg-rose-500/5'
                        }`}
                      >
                        <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>Tolak</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setViewingTalentProfile(null);
                        router.push(
                          `/pembuat-kerja/chat?appId=${talentApp.id}`,
                        );
                      }}
                      className="w-full h-10 font-bold text-xs bg-primary/20 hover:bg-primary/50 text-white cursor-pointer rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] border border-primary/30 backdrop-blur-2xl"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>Hubungi / Chat Kandidat</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Informasi Kontak */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  INFORMASI KONTAK
                </h3>
              </div>
              <div className="space-y-4 pt-1 text-xs">
                <div className="flex items-start gap-3">
                  <span className="text-slate-400 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5 shrink-0" />
                  </span>
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Nama Lengkap
                    </span>
                    <span className="font-bold text-foreground">
                      {viewingTalentProfile.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-400 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5 shrink-0" />
                  </span>
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Nama Panggilan
                    </span>
                    <span className="font-bold text-foreground">
                      {viewingTalentProfile.nickname ||
                        viewingTalentProfile.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-400 mt-0.5">
                    <BriefcaseIcon className="w-3.5 h-3.5 shrink-0" />
                  </span>
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Posisi
                    </span>
                    <span className="font-bold text-foreground">
                      {viewingTalentProfile.title}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-400 mt-0.5">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                  </span>
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Whatsapp
                    </span>
                    <span className="font-bold text-foreground">
                      {viewingTalentProfile.waNumber || '081234567890'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-400 mt-0.5">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                  </span>
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Email
                    </span>
                    <span className="font-bold text-foreground">
                      {viewingTalentProfile.email ||
                        `${viewingTalentProfile.name.toLowerCase().replace(/\s+/g, '')}@example.com`}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                  </span>
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Tempat Tinggal
                    </span>
                    <span className="font-bold text-foreground">
                      {viewingTalentProfile.location || 'Jakarta Pusat'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tautan & Dokumen */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  TAUTAN & DOKUMEN
                </h3>
              </div>
              <div className="space-y-4 pt-1 text-xs">
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Resume
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-bold text-foreground truncate max-w-[150px]">
                        Portofolio_Frontend.pdf
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[12px] rounded-md font-bold text-slate-600 dark:text-slate-350 shrink-0">
                        PDF
                      </span>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          window.print();
                        }}
                        className="ml-2 text-primary hover:text-primary/80 transition-colors"
                        title="Unduh Resume"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Website
                    </span>
                    <a
                      href="#"
                      className="font-bold text-primary hover:underline block truncate max-w-[180px] mt-0.5"
                    >
                      https://
                      {viewingTalentProfile.website || 'budisantoso.dev'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Linkedin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      LinkedIn
                    </span>
                    <a
                      href="#"
                      className="font-bold text-primary hover:underline block truncate max-w-[180px] mt-0.5"
                    >
                      https://linkedin.com/in/
                      {viewingTalentProfile.name
                        .toLowerCase()
                        .replace(/\s+/g, '')}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Kesiapan Kerja & Dokumen */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                Kesiapan Kerja & Dokumen
              </h3>
              <div className="space-y-3 pt-1">
                {[
                  {
                    label: 'CV Lamaran',
                    value: viewingTalentProfile.hasCv
                      ? 'Tersedia'
                      : 'Tidak Tersedia',
                  },
                  {
                    label: 'Ekspektasi Gaji',
                    value: `Rp ${viewingTalentProfile.expectedSalary?.toLocaleString('id-ID') || '18.500.000'}`,
                  },
                  {
                    label: 'Kapan Mulai Kerja',
                    value: viewingTalentProfile.readyNow
                      ? 'Siap Segera'
                      : '1 Bulan Notice',
                  },
                  { label: 'Lokasi Kerja', value: 'Onsite' },
                  {
                    label: 'Prestasi & Sertifikat',
                    value: viewingTalentProfile.hasCertificate
                      ? 'Tersedia'
                      : 'Tidak Tersedia',
                  },
                  {
                    label: 'Perangkat Pendukung',
                    value: viewingTalentProfile.hasLaptop
                      ? 'Laptop Pribadi, HP'
                      : 'HP',
                  },
                  {
                    label: 'Kendaraan Pribadi',
                    value: viewingTalentProfile.hasMotor ? 'Motor' : '-',
                  },
                  {
                    label: 'Dokumen Pendukung',
                    value:
                      [
                        viewingTalentProfile.hasSim ? 'SIM' : '',
                        viewingTalentProfile.hasSkck ? 'SKCK' : '',
                      ]
                        .filter(Boolean)
                        .join(', ') || '-',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs leading-relaxed"
                  >
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {item.label}:{' '}
                      <span className="text-muted-foreground font-semibold">
                        {item.value}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[780px] flex flex-col justify-between animate-in fade-in duration-300">
      <div className="grow flex flex-col justify-start">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex gap-2.5 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kandidat berdasarkan nama atau posisi..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                className="pl-10 h-11 rounded-xl text-xs bg-background border-border text-foreground w-full"
              />
            </div>
            <MultiSelectJob
              selectedJobIds={selectedJobIds}
              onChange={setSelectedJobIds}
              jobs={employerJobs}
            />
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1.5 relative">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCandFilterOpen(!isCandFilterOpen);
                  setIsCandSortOpen(false);
                }}
                className="h-8 gap-1.5 px-3.5 border-border rounded-xl text-xs font-extrabold bg-background text-foreground hover:bg-muted cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </Button>

              {isCandFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-999"
                    onClick={() => setIsCandFilterOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 z-1000 w-[320px] sm:w-[380px] rounded-2xl border border-border bg-card shadow-2xl p-5 text-foreground animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-sm text-foreground">
                          Filter
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCGender('Semua');
                            setCEducation('Semua');
                            setCMinSalary('');
                            setCMaxSalary('');
                            setSelectedPositions([]);
                            setSelectedSkills([]);
                            setSelectedProvince('');
                            setSelectedRegency('');
                            setProvinceSearch('');
                            setRegencySearch('');
                            setPositionSearchQuery('');
                            setSkillSearchQuery('');
                            setCandShowFav(false);
                            setCandShowUnchecked(false);
                            setCandShowWithPhoto(false);
                            setCandShowByExp(false);
                            setReadyNow(false);
                            setHasSim(false);
                            setHasSkck(false);
                            setHasCv(false);
                            setHasMotor(false);
                            setHasLaptop(false);
                            setHasCertificate(false);
                            setWillingToRelocate(false);
                            setCMinAge('');
                            setCMaxAge('');
                            setSelectedWorkTypes([]);
                            setSelectedWorkOptions([]);
                          }}
                          className="text-xs text-blue-500 font-bold hover:underline cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCandFilterOpen(false)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 select-text">
                      {/* Advanced Checkboxes */}
                      <div className="space-y-2 pb-3 border-b border-border/60">
                        <Checkbox
                          checked={candShowFav}
                          onCheckedChange={setCandShowFav}
                          label="Tampilkan Favorit"
                        />
                        <Checkbox
                          checked={candShowUnchecked}
                          onCheckedChange={setCandShowUnchecked}
                          label="Tampilkan yang Belum Dicek"
                        />
                        <Checkbox
                          checked={candShowWithPhoto}
                          onCheckedChange={setCandShowWithPhoto}
                          label="Tampilkan yang Memiliki Foto"
                        />
                        <Checkbox
                          checked={candShowByExp}
                          onCheckedChange={setCandShowByExp}
                          label="Tampilkan yang Sesuai Pengalaman"
                        />
                      </div>

                      <div className="space-y-2">
                        {/* Positions Filter */}
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'posisi'
                                  ? null
                                  : 'posisi',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Posisi</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'posisi' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'posisi' && (
                            <div className="pt-2 space-y-2">
                              <Input
                                placeholder="Cari posisi..."
                                value={positionSearchQuery}
                                onChange={(e) =>
                                  setPositionSearchQuery(e.target.value)
                                }
                                className="h-8 text-xs bg-background"
                              />
                              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 border rounded-lg p-2 bg-background/50">
                                {(() => {
                                  const filtered = DEFAULT_POSITIONS.filter(
                                    (pos) =>
                                      pos
                                        .toLowerCase()
                                        .includes(
                                          positionSearchQuery.toLowerCase(),
                                        ),
                                  );
                                  if (
                                    filtered.length === 0 &&
                                    positionSearchQuery.trim() !== ''
                                  ) {
                                    const customPos =
                                      positionSearchQuery.trim();
                                    const isSelected =
                                      selectedPositions.includes(customPos);
                                    return (
                                      <div className="space-y-1">
                                        <p className="text-[12px] text-muted-foreground italic">
                                          Posisi tidak ditemukan.
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isSelected) {
                                              setSelectedPositions(
                                                selectedPositions.filter(
                                                  (x) => x !== customPos,
                                                ),
                                              );
                                            } else {
                                              setSelectedPositions([
                                                ...selectedPositions,
                                                customPos,
                                              ]);
                                            }
                                            setPositionSearchQuery('');
                                          }}
                                          className="w-full text-left px-2 py-1 text-[12px] rounded bg-primary/10 hover:bg-primary/20 text-primary font-bold transition-all flex items-center justify-between"
                                        >
                                          <span>
                                            Gunakan &quot;{customPos}&quot;
                                          </span>
                                          <span className="text-[12px] bg-primary text-primary-foreground px-1 py-0.5 rounded">
                                            Tambah
                                          </span>
                                        </button>
                                      </div>
                                    );
                                  }
                                  return filtered.slice(0, 50).map((pos) => {
                                    const isSelected =
                                      selectedPositions.includes(pos);
                                    return (
                                      <label
                                        key={pos}
                                        className="flex items-center gap-2 text-[12px] cursor-pointer select-none"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => {
                                            if (isSelected) {
                                              setSelectedPositions(
                                                selectedPositions.filter(
                                                  (x) => x !== pos,
                                                ),
                                              );
                                            } else {
                                              setSelectedPositions([
                                                ...selectedPositions,
                                                pos,
                                              ]);
                                            }
                                          }}
                                          className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                                        />
                                        <span>{pos}</span>
                                      </label>
                                    );
                                  });
                                })()}
                              </div>
                              {selectedPositions.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1 max-h-20 overflow-y-auto">
                                  {selectedPositions.map((pos) => (
                                    <Badge
                                      key={pos}
                                      variant="secondary"
                                      className="text-[12px] py-0 px-1.5 flex items-center gap-1 font-bold"
                                    >
                                      <span>{pos}</span>
                                      <X
                                        className="w-2.5 h-2.5 cursor-pointer text-muted-foreground hover:text-foreground"
                                        onClick={() =>
                                          setSelectedPositions(
                                            selectedPositions.filter(
                                              (x) => x !== pos,
                                            ),
                                          )
                                        }
                                      />
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Skills Filter */}
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'skill' ? null : 'skill',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Skill</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'skill' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'skill' && (
                            <div className="pt-2 space-y-2">
                              <Input
                                placeholder="Cari skill..."
                                value={skillSearchQuery}
                                onChange={(e) =>
                                  setSkillSearchQuery(e.target.value)
                                }
                                className="h-8 text-xs bg-background"
                              />
                              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 border rounded-lg p-2 bg-background/50">
                                {(() => {
                                  const filtered = DEFAULT_SKILLS.filter((sk) =>
                                    sk
                                      .toLowerCase()
                                      .includes(skillSearchQuery.toLowerCase()),
                                  );
                                  if (
                                    filtered.length === 0 &&
                                    skillSearchQuery.trim() !== ''
                                  ) {
                                    const customSkill = skillSearchQuery.trim();
                                    const isSelected =
                                      selectedSkills.includes(customSkill);
                                    return (
                                      <div className="space-y-1">
                                        <p className="text-[12px] text-muted-foreground italic">
                                          Skill tidak ditemukan.
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isSelected) {
                                              setSelectedSkills(
                                                selectedSkills.filter(
                                                  (x) => x !== customSkill,
                                                ),
                                              );
                                            } else {
                                              setSelectedSkills([
                                                ...selectedSkills,
                                                customSkill,
                                              ]);
                                            }
                                            setSkillSearchQuery('');
                                          }}
                                          className="w-full text-left px-2 py-1 text-[12px] rounded bg-primary/10 hover:bg-primary/20 text-primary font-bold transition-all flex items-center justify-between"
                                        >
                                          <span>
                                            Gunakan &quot;{customSkill}&quot;
                                          </span>
                                          <span className="text-[12px] bg-primary text-primary-foreground px-1 py-0.5 rounded">
                                            Tambah
                                          </span>
                                        </button>
                                      </div>
                                    );
                                  }
                                  return filtered.slice(0, 50).map((sk) => {
                                    const isSelected =
                                      selectedSkills.includes(sk);
                                    return (
                                      <label
                                        key={sk}
                                        className="flex items-center gap-2 text-[12px] cursor-pointer select-none"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => {
                                            if (isSelected) {
                                              setSelectedSkills(
                                                selectedSkills.filter(
                                                  (x) => x !== sk,
                                                ),
                                              );
                                            } else {
                                              setSelectedSkills([
                                                ...selectedSkills,
                                                sk,
                                              ]);
                                            }
                                          }}
                                          className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                                        />
                                        <span>{sk}</span>
                                      </label>
                                    );
                                  });
                                })()}
                              </div>
                              {selectedSkills.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1 max-h-20 overflow-y-auto">
                                  {selectedSkills.map((sk) => (
                                    <Badge
                                      key={sk}
                                      variant="secondary"
                                      className="text-[12px] py-0 px-1.5 flex items-center gap-1 font-bold"
                                    >
                                      <span>{sk}</span>
                                      <X
                                        className="w-2.5 h-2.5 cursor-pointer text-muted-foreground hover:text-foreground"
                                        onClick={() =>
                                          setSelectedSkills(
                                            selectedSkills.filter(
                                              (x) => x !== sk,
                                            ),
                                          )
                                        }
                                      />
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Education Filter */}
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'pendidikan'
                                  ? null
                                  : 'pendidikan',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Minimum Pendidikan</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'pendidikan' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'pendidikan' && (
                            <div className="pt-2 flex flex-wrap gap-1.5">
                              {[
                                'Semua Pendidikan',
                                'S3 (Doktor)',
                                'S2 (Magister)',
                                'Pendidikan Profesi',
                                'S1 (Sarjana)',
                                'D4 (Sarjana Terapan)',
                                'D3',
                                'D2',
                                'D1',
                                'SMA/SMK',
                                'SMP',
                                'SD',
                              ].map((edu) => (
                                <button
                                  key={edu}
                                  type="button"
                                  onClick={() => {
                                    if (edu === 'Semua Pendidikan')
                                      setCEducation('Semua');
                                    else if (edu.startsWith('S3'))
                                      setCEducation('S3');
                                    else if (edu.startsWith('S2'))
                                      setCEducation('S2');
                                    else if (edu.startsWith('S1'))
                                      setCEducation('S1');
                                    else if (edu.startsWith('D4'))
                                      setCEducation('D4');
                                    else setCEducation(edu);
                                  }}
                                  className={`px-2.5 py-1.5 text-[12px] rounded-lg border transition-all cursor-pointer font-bold ${
                                    (cEducation === 'Semua' &&
                                      edu === 'Semua Pendidikan') ||
                                    (cEducation === 'S3' &&
                                      edu.startsWith('S3')) ||
                                    (cEducation === 'S2' &&
                                      edu.startsWith('S2')) ||
                                    (cEducation === 'S1' &&
                                      edu.startsWith('S1')) ||
                                    (cEducation === 'D4' &&
                                      edu.startsWith('D4')) ||
                                    (cEducation === edu &&
                                      edu !== 'Semua Pendidikan' &&
                                      !edu.startsWith('S3') &&
                                      !edu.startsWith('S2') &&
                                      !edu.startsWith('S1') &&
                                      !edu.startsWith('D4'))
                                      ? 'bg-primary border-primary text-primary-foreground'
                                      : 'bg-background border-border text-foreground hover:bg-muted'
                                  }`}
                                >
                                  {edu}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Usia Filter */}
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'usia' ? null : 'usia',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Usia</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'usia' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'usia' && (
                            <div className="pt-2 flex gap-2">
                              <Input
                                type="number"
                                placeholder="Min Usia"
                                value={cMinAge}
                                onChange={(e) => setCMinAge(e.target.value)}
                                className="h-8 text-xs bg-background"
                              />
                              <Input
                                type="number"
                                placeholder="Max Usia"
                                value={cMaxAge}
                                onChange={(e) => setCMaxAge(e.target.value)}
                                className="h-8 text-xs bg-background"
                              />
                            </div>
                          )}
                        </div>

                        {/* Salary Filter */}
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'gaji' ? null : 'gaji',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Gaji</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'gaji' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'gaji' && (
                            <div className="pt-2 flex gap-2">
                              <Input
                                type="number"
                                placeholder="Min"
                                value={cMinSalary}
                                onChange={(e) => setCMinSalary(e.target.value)}
                                className="h-8 text-xs bg-background"
                              />
                              <Input
                                type="number"
                                placeholder="Max"
                                value={cMaxSalary}
                                onChange={(e) => setCMaxSalary(e.target.value)}
                                className="h-8 text-xs bg-background"
                              />
                            </div>
                          )}
                        </div>

                        {/* Tipe Pekerjaan Filter */}
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'workTypes'
                                  ? null
                                  : 'workTypes',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Tipe Pekerjaan</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'workTypes' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'workTypes' && (
                            <div className="pt-2 pb-1 flex flex-wrap gap-2">
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
                                  onClick={() => {
                                    if (selectedWorkTypes.includes(type)) {
                                      setSelectedWorkTypes(
                                        selectedWorkTypes.filter(
                                          (x) => x !== type,
                                        ),
                                      );
                                    } else {
                                      setSelectedWorkTypes([
                                        ...selectedWorkTypes,
                                        type,
                                      ]);
                                    }
                                  }}
                                  className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer font-medium ${
                                    selectedWorkTypes.includes(type)
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

                        {/* Kebijakan Kerja Filter */}
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'workOptions'
                                  ? null
                                  : 'workOptions',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Kebijakan Kerja</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'workOptions' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'workOptions' && (
                            <div className="pt-2 pb-1 flex flex-wrap gap-2">
                              {['Remote', 'Hybrid', 'Onsite'].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    if (selectedWorkOptions.includes(opt)) {
                                      setSelectedWorkOptions(
                                        selectedWorkOptions.filter(
                                          (x) => x !== opt,
                                        ),
                                      );
                                    } else {
                                      setSelectedWorkOptions([
                                        ...selectedWorkOptions,
                                        opt,
                                      ]);
                                    }
                                  }}
                                  className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer font-medium ${
                                    selectedWorkOptions.includes(opt)
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

                        {/* Kesiapan Kerja Filter */}
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'kuis' ? null : 'kuis',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Kesiapan Kerja & Dokumen</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'kuis' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'kuis' && (
                            <div className="pt-2 flex flex-col gap-2">
                              <Checkbox
                                checked={readyNow}
                                onCheckedChange={setReadyNow}
                                label="Siap Segera"
                              />
                              <Checkbox
                                checked={hasSim}
                                onCheckedChange={setHasSim}
                                label="Memiliki SIM"
                              />
                              <Checkbox
                                checked={hasSkck}
                                onCheckedChange={setHasSkck}
                                label="Memiliki SKCK"
                              />
                              <Checkbox
                                checked={hasCv}
                                onCheckedChange={setHasCv}
                                label="Resume CV"
                              />
                              <Checkbox
                                checked={hasMotor}
                                onCheckedChange={setHasMotor}
                                label="Motor Pribadi"
                              />
                              <Checkbox
                                checked={hasLaptop}
                                onCheckedChange={setHasLaptop}
                                label="Laptop Pribadi"
                              />
                              <Checkbox
                                checked={hasCertificate}
                                onCheckedChange={setHasCertificate}
                                label="Sertifikat"
                              />
                              <Checkbox
                                checked={willingToRelocate}
                                onCheckedChange={setWillingToRelocate}
                                label="Bersedia Relokasi"
                              />
                            </div>
                          )}
                        </div>

                        {/* Gender Filter */}
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'gender'
                                  ? null
                                  : 'gender',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Gender</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'gender' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'gender' && (
                            <div className="pt-2 flex flex-col gap-2">
                              {['Semua', 'Laki-laki', 'Perempuan'].map((g) => (
                                <label
                                  key={g}
                                  className="flex items-center gap-2 text-xs cursor-pointer select-none"
                                >
                                  <input
                                    type="radio"
                                    name="popover-cgender"
                                    checked={cGender === g}
                                    onChange={() => setCGender(g)}
                                    className="text-primary focus:ring-primary h-3.5 w-3.5"
                                  />
                                  <span>{g}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Kecamatan (Location) Filter */}
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'kecamatan'
                                  ? null
                                  : 'kecamatan',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Kecamatan</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'kecamatan' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'kecamatan' && (
                            <div className="pt-2 space-y-2 relative">
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsProvinceOpen(!isProvinceOpen);
                                    setProvinceSearch('');
                                    setIsRegencyOpen(false);
                                  }}
                                  className="w-full h-8 pl-2.5 pr-8 text-xs bg-background border rounded-md outline-none cursor-pointer text-left flex items-center text-foreground font-semibold"
                                >
                                  <span>
                                    {selectedProvince || 'Pilih Provinsi'}
                                  </span>
                                </button>
                                <ChevronDown
                                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none transition-transform duration-200 ${isProvinceOpen ? 'rotate-180' : ''}`}
                                />
                                {isProvinceOpen && (
                                  <div className="absolute top-full left-0 right-0 mt-1 z-105 rounded-lg border bg-popover shadow-xl overflow-hidden text-popover-foreground">
                                    <div className="p-2 border-b">
                                      <input
                                        type="text"
                                        placeholder="Cari provinsi..."
                                        value={provinceSearch}
                                        onChange={(e) =>
                                          setProvinceSearch(e.target.value)
                                        }
                                        className="w-full px-2 py-1 text-xs rounded outline-none bg-muted text-foreground"
                                      />
                                    </div>
                                    <div className="max-h-32 overflow-y-auto">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedProvince('');
                                          setSelectedRegency('');
                                          setIsProvinceOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-primary/10 transition-colors text-foreground font-bold"
                                      >
                                        Semua Provinsi
                                      </button>
                                      {PROVINCES.filter((p) =>
                                        p.province
                                          .toLowerCase()
                                          .includes(
                                            provinceSearch.toLowerCase(),
                                          ),
                                      ).map((p) => (
                                        <button
                                          key={p.province}
                                          type="button"
                                          onClick={() => {
                                            setSelectedProvince(p.province);
                                            setSelectedRegency('');
                                            setIsProvinceOpen(false);
                                          }}
                                          className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-primary/10 transition-colors text-foreground"
                                        >
                                          {p.province}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="relative">
                                <button
                                  type="button"
                                  disabled={!selectedProvince}
                                  onClick={() => {
                                    setIsRegencyOpen(!isRegencyOpen);
                                    setRegencySearch('');
                                    setIsProvinceOpen(false);
                                  }}
                                  className="w-full h-8 pl-2.5 pr-8 text-xs bg-background border rounded-md outline-none cursor-pointer text-left flex items-center text-foreground font-semibold disabled:opacity-50"
                                >
                                  <span>
                                    {selectedRegency || 'Pilih Kabupaten/Kota'}
                                  </span>
                                </button>
                                <ChevronDown
                                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none transition-transform duration-200 ${isRegencyOpen ? 'rotate-180' : ''}`}
                                />
                                {isRegencyOpen && selectedProvince && (
                                  <div className="absolute top-full left-0 right-0 mt-1 z-105 rounded-lg border bg-popover shadow-xl overflow-hidden text-popover-foreground">
                                    <div className="p-2 border-b">
                                      <input
                                        type="text"
                                        placeholder="Cari kota..."
                                        value={regencySearch}
                                        onChange={(e) =>
                                          setRegencySearch(e.target.value)
                                        }
                                        className="w-full px-2 py-1 text-xs rounded outline-none bg-muted text-foreground"
                                      />
                                    </div>
                                    <div className="max-h-32 overflow-y-auto">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedRegency('');
                                          setIsRegencyOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-primary/10 transition-colors text-foreground font-bold"
                                      >
                                        Semua Kota
                                      </button>
                                      {(
                                        PROVINCES.find(
                                          (p) =>
                                            p.province === selectedProvince,
                                        )?.regencies || []
                                      )
                                        .filter((r) =>
                                          r
                                            .toLowerCase()
                                            .includes(
                                              regencySearch.toLowerCase(),
                                            ),
                                        )
                                        .map((r) => (
                                          <button
                                            key={r}
                                            type="button"
                                            onClick={() => {
                                              setSelectedRegency(r);
                                              setIsRegencyOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-primary/10 transition-colors text-foreground"
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

                        {/* Gaji (Salary) Filter */}
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'gaji' ? null : 'gaji',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Harapan Gaji</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'gaji' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'gaji' && (
                            <div className="pt-2 flex gap-2">
                              <Input
                                type="number"
                                placeholder="Min"
                                value={cMinSalary}
                                onChange={(e) => setCMinSalary(e.target.value)}
                                className="h-8 text-xs bg-background"
                              />
                              <Input
                                type="number"
                                placeholder="Max"
                                value={cMaxSalary}
                                onChange={(e) => setCMaxSalary(e.target.value)}
                                className="h-8 text-xs bg-background"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCandSortOpen(!isCandSortOpen);
                  setIsCandFilterOpen(false);
                }}
                className="h-8 gap-1.5 px-3.5 border-border rounded-xl text-xs font-extrabold bg-background text-foreground hover:bg-muted cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>
                  Sort By:{' '}
                  {cSorting === 'Score'
                    ? 'Talent Match'
                    : cSorting === 'Berpengalaman'
                      ? 'Berpengalaman'
                      : cSorting}
                </span>
              </Button>

              {isCandSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-999"
                    onClick={() => setIsCandSortOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 z-1000 w-52 rounded-2xl border border-border bg-card shadow-2xl py-1.5 text-foreground animate-in fade-in slide-in-from-top-2 duration-150 select-text">
                    {[
                      { value: 'Terlama', label: 'Terlama' },
                      { value: 'Terbaru', label: 'Terbaru' },
                      {
                        value: 'Score',
                        label: 'Talent Match',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setCSorting(opt.value as any);
                          setIsCandSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs hover:bg-muted cursor-pointer transition-colors duration-150 ${
                          cSorting === opt.value
                            ? 'text-primary font-bold bg-muted/40'
                            : 'text-foreground'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl items-center grow mt-4 gap-1">
          {(['Melamar', 'Terseleksi', 'Diterima', 'Ditutup'] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setCandidateStatusTab(tab)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer outline-none ${
                  candidateStatusTab === tab
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {tab} (
                {
                  enrichedApplications.filter((app) => app.status === tab)
                    .length
                }
                )
              </button>
            ),
          )}
        </div>

        {sortedApplications.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl mt-4">
            <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <h4 className="font-bold text-xs text-muted-foreground uppercase">
              Kandidat Tidak Ditemukan
            </h4>
            <p className="text-[12px] text-muted-foreground mt-1">
              Gunakan kata kunci atau filter lain untuk mencari.
            </p>
          </div>
        ) : (
          <div className="grow flex flex-col justify-between">
            <div className="h-[600px] overflow-y-auto pr-1.5 scroll-smooth mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                {paginatedApplications.map((app) => (
                  <Card
                    key={app.id}
                    className={`border rounded-2xl overflow-hidden shadow-sm bg-card text-card-foreground h-auto min-h-[140px] flex flex-col justify-between p-4 relative ${
                      selectedApplicationId === app.id
                        ? 'border-primary ring-1 ring-primary/20 bg-primary/5'
                        : 'border-border'
                    }`}
                    onClick={() => {
                      if (selectedApplicationId === app.id) {
                        setSelectedApplicationId(null);
                      } else {
                        setSelectedApplicationId(app.id);
                      }
                    }}
                  >
                    <CardContent className="p-0 flex flex-col justify-between h-full gap-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          {app.talent?.avatar &&
                          !app.talent.avatar.includes('default-avatar') &&
                          !app.talent.avatar.includes('placeholder') ? (
                            <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0 relative">
                              <Image
                                src={app.talent.avatar}
                                alt={app.talent.name}
                                className="h-full w-full object-cover"
                                width={100}
                                height={100}
                                unoptimized
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fallback =
                                    e.currentTarget.parentElement?.querySelector(
                                      '.avatar-fallback',
                                    ) as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                              <div className="avatar-fallback hidden absolute inset-0 items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-black uppercase">
                                {app.talent?.name?.[0] || '?'}
                              </div>
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-border flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-200 text-sm font-black uppercase">
                              {app.talent?.name?.[0] || '?'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <h4 className="font-extrabold text-xs sm:text-sm text-foreground truncate max-w-[90px] sm:max-w-[120px] tracking-tight">
                                {app.talent?.name}
                              </h4>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (app.talentId)
                                    toggleFavoriteTalent(app.talentId);
                                }}
                                className="p-0.5 rounded-full text-muted-foreground hover:text-amber-500 transition-all border-none cursor-pointer shrink-0 bg-transparent"
                              >
                                <Star
                                  className={`h-3.5 w-3.5 ${
                                    app.talentId &&
                                    favoriteTalents.includes(app.talentId)
                                      ? 'fill-amber-400 text-amber-500'
                                      : ''
                                  }`}
                                />
                              </button>
                            </div>
                            <p className="text-[12px] font-bold text-primary truncate max-w-[120px] sm:max-w-[150px] mt-0.5">
                              {app.talent?.title}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs sm:text-sm font-black text-foreground">
                            Rp{' '}
                            {app.talent?.expectedSalary.toLocaleString('id-ID')}
                          </p>
                          <p className="text-[12px] text-muted-foreground font-semibold mt-0.5">
                            Exp: {app.talent?.experienceYears} Thn
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-border/50 pt-2.5 flex items-center justify-between gap-2 mt-auto">
                        <div className="flex items-center gap-1.5 min-w-0 text-[12px] text-muted-foreground">
                          <Briefcase className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
                          <span className="truncate max-w-[100px] sm:max-w-[120px] font-semibold text-foreground/80">
                            {app.job?.title || 'Job Post'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMatchApp(app);
                            }}
                            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold text-[12px] px-2 py-0.5 rounded-full cursor-pointer transition-all hover:bg-emerald-500/10"
                          >
                            Match: {calculateHalloScore(app.talent, app.job)}%
                          </Badge>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingTalentProfile(app.talent);
                            }}
                            className="p-1 rounded-lg text-muted-foreground hover:text-primary transition-all cursor-pointer border border-border flex items-center justify-center bg-transparent"
                            title="Lihat Profil"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages >= 1 && (
              <div className="flex justify-center items-center gap-4 mt-6 pt-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                            className="h-9 w-9 text-xs font-bold transition-all rounded-lg cursor-pointer shadow-sm animate-in fade-in duration-100"
                            style={
                              isCurrent
                                ? {
                                    backgroundColor: 'hsl(var(--foreground))',
                                    color: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--foreground))',
                                  }
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
                          renderedElements.push(renderButton(3));
                          renderedElements.push(renderDots('dots-right'));
                        } else if (currentPage >= totalPages - 1) {
                          renderedElements.push(renderDots('dots-left'));
                          renderedElements.push(renderButton(totalPages - 2));
                          renderedElements.push(renderButton(totalPages - 1));
                          renderedElements.push(renderButton(totalPages));
                        } else {
                          renderedElements.push(renderDots('dots-left'));
                          renderedElements.push(renderButton(currentPage - 1));
                          renderedElements.push(renderButton(currentPage));
                          renderedElements.push(renderButton(currentPage + 1));
                          renderedElements.push(renderDots('dots-right'));
                        }
                      }
                      return renderedElements;
                    })()}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Talent Match Analysis Modal */}
      {selectedMatchApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedMatchApp(null)}
          />
          <Card className="relative w-full max-w-lg bg-card/95 border border-border/70 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col z-10 animate-in zoom-in-95 duration-150 text-foreground overflow-hidden max-h-[85vh] backdrop-saturate-150">
            <button
              onClick={() => setSelectedMatchApp(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground transition-all cursor-pointer border-none bg-transparent hover:text-foreground active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-5 flex flex-col h-full overflow-hidden">
              <div className="shrink-0 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] tracking-wider uppercase border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Match Analysis</span>
                </div>
                <h3 className="text-base font-extrabold text-foreground tracking-tight mt-1.5">
                  Analisis Talent Match
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Kandidat:</span>
                  <span className="font-extrabold text-foreground">
                    {selectedMatchApp.talent?.name}
                  </span>
                </div>

                {/* Modern Score representation */}
                <div className="flex items-center gap-4 mt-3.5 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight shrink-0">
                    {calculateHalloScore(
                      selectedMatchApp.talent,
                      selectedMatchApp.job,
                    )}
                    %
                  </div>
                  <div className="grow space-y-1">
                    <div className="flex justify-between text-[10px] font-extrabold text-emerald-700/80 dark:text-emerald-400/80 uppercase tracking-wider">
                      <span>Kecocokan Profil</span>
                      <span>Sangat Tinggi</span>
                    </div>
                    <div className="h-1.5 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${calculateHalloScore(selectedMatchApp.talent, selectedMatchApp.job)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-border/50 shrink-0" />

              {/* Scrollable list of match criteria */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3 smooth-scroll">
                {/* 1. Posisi */}
                {(() => {
                  const match =
                    selectedMatchApp.talent?.title &&
                    selectedMatchApp.job?.title &&
                    selectedMatchApp.talent.title
                      .toLowerCase()
                      .split(/\s+/)
                      .some((w: string) =>
                        selectedMatchApp.job.title.toLowerCase().includes(w),
                      );
                  const score = match ? 100 : 100;
                  const isOpen = !!openMatchAccordions.posisi;
                  return (
                    <div
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-emerald-500/20 shadow-xs bg-emerald-500/2 dark:bg-emerald-950/10' : 'border-border/50 bg-background/50 hover:bg-muted/10'}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleMatchAccordion('posisi')}
                        className="w-full flex items-center justify-between p-4 text-xs font-bold text-foreground transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 rounded-full text-[12px]">
                            <CheckCircle className="w-3 h-3" />
                          </span>
                          <span className="tracking-tight">
                            Posisi ({score}%)
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0 text-[12px] text-muted-foreground space-y-2 select-text animate-in slide-in-from-top-1 duration-150">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              {selectedMatchApp.talent?.title ||
                                'Frontend Developer'}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p>Sesuai dengan posisi lowongan</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 2. Ringkasan Profil */}
                {(() => {
                  const isOpen = !!openMatchAccordions.ringkasan;
                  return (
                    <div
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-emerald-500/20 shadow-xs bg-emerald-500/2 dark:bg-emerald-950/10' : 'border-border/50 bg-background/50 hover:bg-muted/10'}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleMatchAccordion('ringkasan')}
                        className="w-full flex items-center justify-between p-4 text-xs font-bold text-foreground transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 rounded-full text-[12px]">
                            <CheckCircle className="w-3 h-3" />
                          </span>
                          <span className="tracking-tight">
                            Ringkasan Profil (100%)
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0 text-[12px] text-muted-foreground space-y-2 select-text animate-in slide-in-from-top-1 duration-150">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              Profil telah dilengkapi
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 3. Pendidikan */}
                {(() => {
                  const hasEdu =
                    selectedMatchApp.talent?.education ||
                    'S1 Teknik Informatika';
                  const isOpen = !!openMatchAccordions.pendidikan;
                  return (
                    <div
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-emerald-500/20 shadow-xs bg-emerald-500/2 dark:bg-emerald-950/10' : 'border-border/50 bg-background/50 hover:bg-muted/10'}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleMatchAccordion('pendidikan')}
                        className="w-full flex items-center justify-between p-4 text-xs font-bold text-foreground transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 rounded-full text-[12px]">
                            <CheckCircle className="w-3 h-3" />
                          </span>
                          <span className="tracking-tight">
                            Pendidikan (90%)
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0 text-[12px] text-muted-foreground space-y-2 select-text animate-in slide-in-from-top-1 duration-150">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              {hasEdu}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 4. Pengalaman Kerja */}
                {(() => {
                  const exp = selectedMatchApp.talent?.experienceYears || 2;
                  const isOpen = !!openMatchAccordions.pengalaman;
                  return (
                    <div
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-emerald-500/20 shadow-xs bg-emerald-500/2 dark:bg-emerald-950/10' : 'border-border/50 bg-background/50 hover:bg-muted/10'}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleMatchAccordion('pengalaman')}
                        className="w-full flex items-center justify-between p-4 text-xs font-bold text-foreground transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 rounded-full text-[12px]">
                            <CheckCircle className="w-3 h-3" />
                          </span>
                          <span className="tracking-tight">
                            Pengalaman Kerja (85%)
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0 text-[12px] text-muted-foreground space-y-2 select-text animate-in slide-in-from-top-1 duration-150">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              {exp} tahun{' '}
                              {selectedMatchApp.talent?.title ||
                                'Frontend Developer'}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p>Lowongan membutuhkan 3 tahun pengalaman</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 5. Bahasa */}
                {(() => {
                  const isOpen = !!openMatchAccordions.bahasa;
                  return (
                    <div
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-emerald-500/20 shadow-xs bg-emerald-500/2 dark:bg-emerald-950/10' : 'border-border/50 bg-background/50 hover:bg-muted/10'}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleMatchAccordion('bahasa')}
                        className="w-full flex items-center justify-between p-4 text-xs font-bold text-foreground transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 rounded-full text-[12px]">
                            <CheckCircle className="w-3 h-3" />
                          </span>
                          <span className="tracking-tight">Bahasa (100%)</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0 text-[12px] text-muted-foreground space-y-2 select-text animate-in slide-in-from-top-1 duration-150">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              Bahasa Indonesia
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              Bahasa Inggris
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 6. Lokasi */}
                {(() => {
                  const loc = selectedMatchApp.talent?.location || 'Bandung';
                  const isOpen = !!openMatchAccordions.lokasi;
                  return (
                    <div
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-emerald-500/20 shadow-xs bg-emerald-500/2 dark:bg-emerald-950/10' : 'border-border/50 bg-background/50 hover:bg-muted/10'}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleMatchAccordion('lokasi')}
                        className="w-full flex items-center justify-between p-4 text-xs font-bold text-foreground transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 rounded-full text-[12px]">
                            <CheckCircle className="w-3 h-3" />
                          </span>
                          <span className="tracking-tight">Lokasi (100%)</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0 text-[12px] text-muted-foreground space-y-2 select-text animate-in slide-in-from-top-1 duration-150">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              {loc}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p>Mendukung kerja remote</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 7. Opsi Kerja */}
                {(() => {
                  const opt = selectedMatchApp.talent?.jobInterest || 'Remote';
                  const isOpen = !!openMatchAccordions.opsi;
                  return (
                    <div
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-emerald-500/20 shadow-xs bg-emerald-500/2 dark:bg-emerald-950/10' : 'border-border/50 bg-background/50 hover:bg-muted/10'}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleMatchAccordion('opsi')}
                        className="w-full flex items-center justify-between p-4 text-xs font-bold text-foreground transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 rounded-full text-[12px]">
                            <CheckCircle className="w-3 h-3" />
                          </span>
                          <span className="tracking-tight">
                            Opsi Kerja (100%)
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0 text-[12px] text-muted-foreground space-y-2 select-text animate-in slide-in-from-top-1 duration-150">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              {opt}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              Hybrid
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 8. Portofolio */}
                {(() => {
                  const isOpen = !!openMatchAccordions.portofolio;
                  return (
                    <div
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-emerald-500/20 shadow-xs bg-emerald-500/2 dark:bg-emerald-950/10' : 'border-border/50 bg-background/50 hover:bg-muted/10'}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleMatchAccordion('portofolio')}
                        className="w-full flex items-center justify-between p-4 text-xs font-bold text-foreground transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 rounded-full text-[12px]">
                            <CheckCircle className="w-3 h-3" />
                          </span>
                          <span className="tracking-tight">
                            Portofolio (100%)
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0 text-[12px] text-muted-foreground space-y-2 select-text animate-in slide-in-from-top-1 duration-150">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              GitHub tersedia
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              Website portofolio tersedia
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 9. Resume/CV */}
                {(() => {
                  const isOpen = !!openMatchAccordions.cv;
                  return (
                    <div
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-emerald-500/20 shadow-xs bg-emerald-500/2 dark:bg-emerald-950/10' : 'border-border/50 bg-background/50 hover:bg-muted/10'}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleMatchAccordion('cv')}
                        className="w-full flex items-center justify-between p-4 text-xs font-bold text-foreground transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 rounded-full text-[12px]">
                            <CheckCircle className="w-3 h-3" />
                          </span>
                          <span className="tracking-tight">
                            Resume/CV (100%)
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0 text-[12px] text-muted-foreground space-y-2 select-text animate-in slide-in-from-top-1 duration-150">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-black mt-0.5">
                              •
                            </span>
                            <p className="font-extrabold text-foreground">
                              CV telah diunggah
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

export default KandidatTab;
