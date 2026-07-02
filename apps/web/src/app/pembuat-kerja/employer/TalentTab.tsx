'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/store';
import { mockTalents } from '@/lib/mockTalents';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Checkbox from '@/components/ui/checkbox';
import CustomSelect from '@/components/ui/select-custom';
import CandidatePrintProfile from '@/components/CandidatePrintProfile';
import {
  LuCompass as Compass,
  LuSearch as Search,
  LuArrowUpDown as ArrowUpDown,
  LuChevronDown as ChevronDown,
  LuStar as Star,
  LuLockKeyholeOpen as Unlock,
  LuLock as Lock,
  LuUser as User,
  LuX as X,
  LuArrowLeft as ArrowLeft,
  LuEye as Eye,
  LuBriefcase as Briefcase,
  LuGlobe as Globe,
  LuLinkedin as Linkedin,
  LuFileText as FileText,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuCircleCheck as CheckCircle,
  LuSend as SendIcon,
  LuTriangleAlert as AlertTriangle,
  LuGraduationCap as GraduationCap,
  LuAward as Award,
  LuPhone as Phone,
  LuMail as Mail,
  LuMapPin as MapPin,
  LuDownload as Download,
} from 'react-icons/lu';
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

const getRolesForCard = (title: string): string[] => {
  const cleaned = title.replace(/\s*\([^)]*\)/g, '');
  const splitRoles = cleaned
    .split(/\s*(?:&|\/|and|,)\s*/i)
    .map((r) => r.trim())
    .filter(Boolean);

  if (splitRoles.length >= 2) {
    return splitRoles;
  }

  const single = splitRoles[0] || 'Staff';
  const lower = single.toLowerCase();
  if (lower.includes('frontend') || lower.includes('react')) {
    return [single, 'Web Developer', 'Software Engineer'];
  }
  if (
    lower.includes('backend') ||
    lower.includes('node') ||
    lower.includes('laravel')
  ) {
    return [single, 'Web Developer', 'Software Engineer'];
  }
  if (lower.includes('fullstack') || lower.includes('full stack')) {
    return [single, 'Web Developer', 'Software Engineer'];
  }
  if (
    lower.includes('designer') ||
    lower.includes('ui') ||
    lower.includes('ux') ||
    lower.includes('figma')
  ) {
    return [single, 'UI/UX Designer', 'Graphic Designer'];
  }
  if (
    lower.includes('writer') ||
    lower.includes('content') ||
    lower.includes('seo')
  ) {
    return [single, 'SEO Specialist', 'Copywriter'];
  }
  if (
    lower.includes('marketing') ||
    lower.includes('marketer') ||
    lower.includes('social media')
  ) {
    return [single, 'Social Media Specialist', 'Digital Marketer'];
  }
  if (
    lower.includes('admin') ||
    lower.includes('office') ||
    lower.includes('secretary')
  ) {
    return [single, 'Office Administrator', 'Data Entry'];
  }
  if (
    lower.includes('hr') ||
    lower.includes('recruiter') ||
    lower.includes('human resource')
  ) {
    return [single, 'HR Specialist', 'Talent Acquisition'];
  }
  if (
    lower.includes('sales') ||
    lower.includes('business development') ||
    lower.includes('bizdev')
  ) {
    return [single, 'Business Development', 'Sales Executive'];
  }

  return [single, 'Professional', 'Kandidat'];
};

interface TalentTabProps {
  updateTabInUrl: (tab: string) => void;
}

const TalentTab: React.FC<TalentTabProps> = ({ updateTabInUrl }) => {
  const {
    employerJobs,
    unlockedTalents,
    unlockTalent,
    favoriteTalents,
    toggleFavoriteTalent,
    theme,
    sentInvitations,
    sendJobInvitation,
    user,
  } = useAppStore();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedJobIdForInvite, setSelectedJobIdForInvite] = useState('');
  const [inviteJobSearch, setInviteJobSearch] = useState('');

  // Per-card Invitation Overlay States
  const [invitingTalent, setInvitingTalent] = useState<any | null>(null);
  const [selectedJobsForInvite, setSelectedJobsForInvite] = useState<string[]>([]);
  const [inviteSearchPerCard, setInviteSearchPerCard] = useState('');

  // Talent Filters copied from KandidatTab
  const [talentSearch, setTalentSearch] = useState('');
  const [cMinSalary, setCMinSalary] = useState('');
  const [cMaxSalary, setCMaxSalary] = useState('');
  const [cGender, setCGender] = useState('Semua');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [cEducation, setCEducation] = useState('Semua');
  const [cMinAge, setCMinAge] = useState('');
  const [cMaxAge, setCMaxAge] = useState('');
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [positionSearchQuery, setPositionSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedRegency, setSelectedRegency] = useState('');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [regencySearch, setRegencySearch] = useState('');
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isRegencyOpen, setIsRegencyOpen] = useState(false);

  // Prep Readiness flags
  const [readyNow, setReadyNow] = useState(false);
  const [hasSim, setHasSim] = useState(false);
  const [hasSkck, setHasSkck] = useState(false);
  const [hasCv, setHasCv] = useState(false);
  const [hasMotor, setHasMotor] = useState(false);
  const [hasLaptop, setHasLaptop] = useState(false);
  const [hasCertificate, setHasCertificate] = useState(false);
  const [willingToRelocate, setWillingToRelocate] = useState(false);

  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedWorkOptions, setSelectedWorkOptions] = useState<string[]>([]);

  const [candShowFav, setCandShowFav] = useState(false);
  const [candShowUnchecked, setCandShowUnchecked] = useState(false);
  const [candShowWithPhoto, setCandShowWithPhoto] = useState(false);
  const [candShowByExp, setCandShowByExp] = useState(false);
  const [candShowNoExp, setCandShowNoExp] = useState(false);
  const [candShowOtherExp, setCandShowOtherExp] = useState(false);

  const [talentPageTab, setTalentPageTab] = useState<
    'All' | 'Favorite' | 'Unlocked'
  >('All');
  const [talentPage, setTalentPage] = useState(1);
  const [talentSorting, setTalentSorting] = useState<
    'Terbaru' | 'Terlama' | 'Score'
  >('Terbaru');

  // Popovers
  const [isTalentFilterOpen, setIsTalentFilterOpen] = useState(false);
  const [isTalentSortOpen, setIsTalentSortOpen] = useState(false);
  const [popoverActiveGroup, setPopoverActiveGroup] = useState<string | null>(
    null,
  );

  const [viewingTalentProfile, setViewingTalentProfile] = useState<any | null>(
    null,
  );

  // Process Filter
  const filteredTalents = mockTalents.filter((talent) => {
    if (talentPageTab === 'Favorite' && !favoriteTalents.includes(talent.id))
      return false;
    if (talentPageTab === 'Unlocked' && !unlockedTalents.includes(talent.id))
      return false;

    if (talentSearch.trim()) {
      const q = talentSearch.toLowerCase();
      const titleMatch =
        talent.title.toLowerCase().includes(q) ||
        talent.name.toLowerCase().includes(q);
      if (!titleMatch) return false;
    }

    // Positions Filter
    if (selectedPositions.length > 0) {
      const matchPosition = selectedPositions.some((pos) =>
        talent.title.toLowerCase().includes(pos.toLowerCase()),
      );
      if (!matchPosition) return false;
    }

    // Skills Filter
    if (selectedSkills.length > 0) {
      const matchSkill = selectedSkills.some((sk) =>
        talent.skills.some((ts: string) =>
          ts.toLowerCase().includes(sk.toLowerCase()),
        ),
      );
      if (!matchSkill) return false;
    }

    // Location (Province & Regency) Filter
    if (selectedProvince) {
      const matchProv = talent.location
        .toLowerCase()
        .includes(selectedProvince.toLowerCase());
      if (!matchProv) {
        const provData = PROVINCES.find((p) => p.province === selectedProvince);
        const matchReg = provData?.regencies.some((r) =>
          talent.location.toLowerCase().includes(r.toLowerCase()),
        );
        if (!matchReg) return false;
      }
    }
    if (
      selectedRegency &&
      !talent.location.toLowerCase().includes(selectedRegency.toLowerCase())
    ) {
      return false;
    }

    // Salary Filter
    if (cMinSalary && (talent.expectedSalary || 0) < Number(cMinSalary))
      return false;
    if (cMaxSalary && (talent.expectedSalary || 0) > Number(cMaxSalary))
      return false;

    // Gender Filter
    if (cGender !== 'Semua' && talent.gender !== cGender) return false;

    // Education Filter
    if (cEducation !== 'Semua') {
      if (cEducation === 'SMA/SMK' && talent.education !== 'SMA/SMK')
        return false;
      else if (talent.education !== cEducation) return false;
    }

    // Age Filter
    if (cMinAge && (talent.age || 0) < Number(cMinAge)) return false;
    if (cMaxAge && (talent.age || 0) > Number(cMaxAge)) return false;

    // Tipe Pekerjaan & Kebijakan Kerja Filters
    if (selectedWorkTypes.length > 0) {
      const interestMapping: Record<string, string> = {
        'Penuh Waktu': 'Full Time',
        Kontrak: 'Contract',
        'Paruh Waktu': 'Part Time',
        Magang: 'Internship',
        Freelance: 'Freelance',
      };
      const mappedInterests = selectedWorkTypes.map(
        (t) => interestMapping[t] || t,
      );
      if (!mappedInterests.includes(talent.jobInterest)) return false;
    }
    if (selectedWorkOptions.length > 0) {
      const talentWorkOption = talent.willingToRelocate
        ? 'Onsite'
        : parseInt(talent.id.replace(/\D/g, '') || '0', 10) % 2 === 0
          ? 'Remote'
          : 'Hybrid';
      if (!selectedWorkOptions.includes(talentWorkOption)) return false;
    }

    // Advanced Checkboxes Filters
    if (candShowFav && !favoriteTalents.includes(talent.id)) return false;
    if (candShowUnchecked && unlockedTalents.includes(talent.id)) return false;
    if (
      candShowWithPhoto &&
      (!talent.avatar || talent.avatar.includes('default'))
    )
      return false;

    return true;
  });

  const sortedTalents = [...filteredTalents].sort((a, b) => {
    if (talentSorting === 'Terbaru') return b.id.localeCompare(a.id);
    if (talentSorting === 'Terlama') return a.id.localeCompare(b.id);
    if (talentSorting === 'Score') return b.profileScore - a.profileScore;
    return 0;
  });

  const talentsPerPage = 16;
  const totalTalentPages = Math.ceil(sortedTalents.length / talentsPerPage);
  const paginatedTalents = sortedTalents.slice(
    (talentPage - 1) * talentsPerPage,
    talentPage * talentsPerPage,
  );

  if (viewingTalentProfile) {
    return (
      <div className="w-full space-y-6 animate-in fade-in duration-300">
        <CandidatePrintProfile profile={viewingTalentProfile} />
        <Button
          onClick={() => setViewingTalentProfile(null)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-xs font-semibold hover:bg-muted border border-border cursor-pointer bg-background"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Button>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative">
          <div
            className="h-28 md:h-38 bg-cover bg-center relative transition-all duration-300"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80&auto=format&fit=crop')`,
            }}
          >
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <div className="px-6 md:px-8 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-15 gap-4 mb-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                <div className="relative h-24 w-24 md:h-30 md:w-30 rounded-2xl overflow-hidden border-4 border-card shadow-md bg-muted shrink-0">
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
                      <div className="avatar-fallback hidden absolute inset-0 items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-2xl md:text-3xl font-black uppercase">
                        {viewingTalentProfile.name?.[0] || '?'}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-2xl md:text-3xl font-black uppercase">
                      {viewingTalentProfile.name?.[0] || '?'}
                    </div>
                  )}
                </div>
                <div className="space-y-1 pb-1">
                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground sm:text-white sm:drop-shadow-[0_2px_4px_rgba(0,0,0,0.75)]">
                    {viewingTalentProfile.name}
                  </h1>
                  <p className="text-xs md:text-sm font-semibold text-muted-foreground sm:text-white/90 sm:drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
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
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
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
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
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
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-semibold text-foreground">
                    AWS Certified Developer - Associate
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-background/40 border border-border/50 p-3.5 rounded-xl">
                  <Award className="w-3.5 h-3.5 shrink-0" />
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
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-semibold text-foreground">
                    Ketua Himpunan Mahasiswa Informatika (2020 - 2021)
                  </span>
                </div>
              </div>
            </div>

            {/* Referensi Pekerjaan Minat */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight flex items-center gap-2">
                  Referensi Pekerjaan Minat
                  {!unlockedTalents.includes(viewingTalentProfile.id) && (
                    <Lock className="w-4 h-4 text-rose-500" />
                  )}
                </h3>
              </div>

              <div className="relative">
                {/* Lock Overlay if locked */}
                {!unlockedTalents.includes(viewingTalentProfile.id) && (
                  <div className="absolute inset-0 bg-card/85 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-4 rounded-xl border border-rose-500/30">
                    <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-full border border-rose-200 dark:border-rose-900/50 mb-3">
                      <Lock className="w-6 h-6 text-rose-500" />
                    </div>
                    <p className="text-xs font-bold text-foreground">
                      Referensi Pekerjaan Minat Terkunci
                    </p>
                    <p className="text-[10px] text-muted-foreground max-w-[280px] text-center mt-1">
                      Buka profil talent ini untuk melihat rincian minat dan
                      preferensi pekerjaan.
                    </p>
                  </div>
                )}

                <div
                  className={`space-y-6 ${!unlockedTalents.includes(viewingTalentProfile.id) ? 'filter blur-[1.5px] select-none pointer-events-none' : ''}`}
                >
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
                        (viewingTalentProfile.expectedSalary || 5000000) /
                        1000000
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
                        {viewingTalentProfile.location || 'Surabaya'}, Jawa
                        Timur
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
                          : parseInt(viewingTalentProfile.id.replace(/\D/g, '') || '0', 10) % 2 === 0
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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Informasi Kontak */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  INFORMASI KONTAK
                </h3>
              </div>
              <div className="space-y-4 pt-1 text-xs">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
                      Nama Lengkap
                    </span>
                    <span className="font-bold text-foreground">
                      {viewingTalentProfile.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
                      Nama Panggilan
                    </span>
                    <span className="font-bold text-foreground">
                      {viewingTalentProfile.nickname ||
                        viewingTalentProfile.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
                      Posisi
                    </span>
                    <span className="font-bold text-foreground">
                      {viewingTalentProfile.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
                      Whatsapp
                    </span>
                    {unlockedTalents.includes(viewingTalentProfile.id) ? (
                      <span className="font-bold text-foreground">
                        {viewingTalentProfile.waNumber || '081234567890'}
                      </span>
                    ) : (
                      <span className="font-bold text-muted-foreground flex items-center gap-1.5 italic">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        Terkunci
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
                      Email
                    </span>
                    {unlockedTalents.includes(viewingTalentProfile.id) ? (
                      <span className="font-bold text-foreground">
                        {viewingTalentProfile.email ||
                          `${viewingTalentProfile.name.toLowerCase().replace(/\s+/g, '')}@example.com`}
                      </span>
                    ) : (
                      <span className="font-bold text-muted-foreground flex items-center gap-1.5 italic">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        Terkunci
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
                      Tempat Tinggal
                    </span>
                    {unlockedTalents.includes(viewingTalentProfile.id) ? (
                      <span className="font-bold text-foreground">
                        {viewingTalentProfile.location || 'Jakarta Pusat'}
                      </span>
                    ) : (
                      <span className="font-bold text-muted-foreground flex items-center gap-1.5 italic">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        Terkunci
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tautan & Dokumen */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight uppercase">
                  Tautan & Dokumen
                </h3>
              </div>
              {unlockedTalents.includes(viewingTalentProfile.id) ? (
                <div className="space-y-4 pt-1 text-xs">
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
                        Resume
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-bold text-foreground truncate max-w-[150px]">
                          Portofolio_Frontend.pdf
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[8px] rounded-md font-bold text-slate-600 dark:text-slate-350 shrink-0">
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
                      <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
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
                      <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
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
                  <div className="pt-3 border-t border-border/45 mt-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsInviteModalOpen(true);
                      }}
                      className="w-full text-xs font-extrabold h-9 rounded-xl bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border-none"
                    >
                      <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> Undang Kerja</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative py-4 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="absolute inset-0 bg-card/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4">
                    <Lock className="w-8 h-8 text-amber-500 mb-2" />
                    <p className="text-[11px] font-bold text-foreground">
                      Konten Terkunci
                    </p>
                    <p className="text-[9px] text-muted-foreground max-w-[200px] mb-3">
                      Buka profil untuk melihat CV, Portofolio & LinkedIn
                    </p>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        const success = unlockTalent(viewingTalentProfile.id);
                        if (success) {
                          alert(
                            `Berhasil membuka profil ${viewingTalentProfile.name}! Saldo berkurang 10 koin.`,
                          );
                        } else {
                          alert(
                            'Koin Anda tidak cukup untuk membuka profil ini! Silakan lakukan top up di tab Koin.',
                          );
                          updateTabInUrl('coin-credit');
                        }
                      }}
                      size="sm"
                      className="h-7 text-[10px] font-extrabold uppercase gap-1 bg-linear-to-r from-amber-500 to-orange-500 hover:bg-amber-600 text-white rounded-xl border-none shadow-sm shadow-amber-500/10 cursor-pointer active:scale-95 transition-all px-3"
                    >
                      <Unlock className="h-3 w-3" />
                      <span>Unlock CV & Link</span>
                    </Button>
                  </div>
                  <div className="w-full space-y-3 blur-[2px] pointer-events-none opacity-50 text-left text-[10px]">
                    <div className="h-8 bg-muted rounded-xl w-full"></div>
                    <div className="h-8 bg-muted rounded-xl w-full"></div>
                    <div className="h-8 bg-muted rounded-xl w-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-card border border-border/80 w-full max-w-2xl rounded-3xl p-8 relative shadow-2xl animate-in scale-in duration-200 space-y-4">
              <button
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setSelectedJobIdForInvite('');
                  setInviteJobSearch('');
                }}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xs font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  Undang Kerja
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Pilih lowongan aktif untuk mengundang <span className="font-bold text-foreground">{viewingTalentProfile?.name}</span>.
                </p>
              </div>

              {/* Search bar inside modal */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Cari lowongan..."
                  value={inviteJobSearch}
                  onChange={(e) => setInviteJobSearch(e.target.value)}
                  className="pl-8 h-8.5 text-xs bg-background/50 border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              {/* List of active jobs */}
              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                {(() => {
                  const filteredJobs = employerJobs
                    .filter((j: any) => j.status === 'aktif')
                    .filter((j: any) => j.title.toLowerCase().includes(inviteJobSearch.toLowerCase()));
                  
                  if (filteredJobs.length === 0) {
                    return (
                      <p className="text-[11px] text-muted-foreground italic text-center py-4">
                        {inviteJobSearch ? 'Tidak ada lowongan yang cocok.' : 'Anda tidak memiliki lowongan aktif.'}
                      </p>
                    );
                  }

                  return filteredJobs.map((job: any) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJobIdForInvite(job.id)}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between group ${
                        selectedJobIdForInvite === job.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border/50 hover:bg-muted/40 text-foreground/80'
                      }`}
                    >
                      <span className="truncate pr-2">{job.title}</span>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        selectedJobIdForInvite === job.id
                          ? 'border-primary-foreground bg-primary-foreground'
                          : 'border-border/80 group-hover:border-foreground/40'
                      }`}>
                        {selectedJobIdForInvite === job.id && (
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsInviteModalOpen(false);
                    setSelectedJobIdForInvite('');
                    setInviteJobSearch('');
                  }}
                  className="flex-1 text-xs font-bold h-9 rounded-xl cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  disabled={!selectedJobIdForInvite}
                  onClick={() => {
                    const job = employerJobs.find((j: any) => j.id === selectedJobIdForInvite);
                    alert(`Undangan kerja berhasil dikirim ke ${viewingTalentProfile?.name} untuk posisi "${job?.title}"!`);
                    setIsInviteModalOpen(false);
                    setSelectedJobIdForInvite('');
                    setInviteJobSearch('');
                  }}
                  className="flex-1 text-xs font-bold h-9 rounded-xl cursor-pointer border-none bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  Kirim Undangan
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari posisi atau bidang pekerjaan..."
              value={talentSearch}
              onChange={(e) => setTalentSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl text-xs bg-background border-border text-foreground"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1.5 relative">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsTalentFilterOpen(!isTalentFilterOpen);
                  setIsTalentSortOpen(false);
                }}
                className="h-8 gap-1.5 px-3.5 border-border rounded-xl text-xs font-extrabold bg-background text-foreground hover:bg-muted cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Filter</span>
              </Button>

              {isTalentFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-999"
                    onClick={() => setIsTalentFilterOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 z-1000 w-[325px] sm:w-[380px] rounded-2xl border border-border bg-card shadow-2xl p-5 text-foreground animate-in fade-in slide-in-from-top-2 duration-150 select-text">
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-sm text-foreground">
                          Filter
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setTalentSearch('');
                            setCMinSalary('');
                            setCMaxSalary('');
                            setCGender('Semua');
                            setSelectedSkills([]);
                            setSkillSearchQuery('');
                            setCEducation('Semua');
                            setCMinAge('');
                            setCMaxAge('');
                            setSelectedPositions([]);
                            setPositionSearchQuery('');
                            setSelectedProvince('');
                            setSelectedRegency('');
                            setProvinceSearch('');
                            setRegencySearch('');
                            setIsProvinceOpen(false);
                            setIsRegencyOpen(false);
                            setReadyNow(false);
                            setHasSim(false);
                            setHasSkck(false);
                            setHasCv(false);
                            setHasMotor(false);
                            setHasLaptop(false);
                            setHasCertificate(false);
                            setWillingToRelocate(false);
                            setCandShowFav(false);
                            setCandShowUnchecked(false);
                            setCandShowWithPhoto(false);
                            setCandShowByExp(false);
                            setCandShowNoExp(false);
                            setCandShowOtherExp(false);
                            setSelectedWorkTypes([]);
                            setSelectedWorkOptions([]);
                          }}
                          className="text-xs text-blue-500 font-bold hover:underline cursor-pointer bg-transparent border-none"
                        >
                          Reset
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsTalentFilterOpen(false)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer border-none bg-transparent"
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
                                        <p className="text-[10px] text-muted-foreground italic">
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
                                          <span>Gunakan &quot;{customPos}&quot;</span>
                                          <span className="text-[10px] bg-primary text-primary-foreground px-1 py-0.5 rounded">
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
                                      className="text-[10px] py-0 px-1.5 flex items-center gap-1 font-bold"
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
                                        <p className="text-[10px] text-muted-foreground italic">
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
                                          <span>Gunakan &quot;{customSkill}&quot;</span>
                                          <span className="text-[10px] bg-primary text-primary-foreground px-1 py-0.5 rounded">
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
                                      className="text-[10px] py-0 px-1.5 flex items-center gap-1 font-bold"
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
                                  className={`px-2.5 py-1.5 text-[10px] rounded-lg border transition-all cursor-pointer font-bold ${
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

                        {/* Gaji Filter */}
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
                                popoverActiveGroup === 'workTypes' ? null : 'workTypes',
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
                                      setSelectedWorkTypes(selectedWorkTypes.filter((x) => x !== type));
                                    } else {
                                      setSelectedWorkTypes([...selectedWorkTypes, type]);
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
                                popoverActiveGroup === 'workOptions' ? null : 'workOptions',
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
                                      setSelectedWorkOptions(selectedWorkOptions.filter((x) => x !== opt));
                                    } else {
                                      setSelectedWorkOptions([...selectedWorkOptions, opt]);
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
                                    name="popover-tgender"
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
                  setIsTalentSortOpen(!isTalentSortOpen);
                  setIsTalentFilterOpen(false);
                }}
                className="h-8 gap-1.5 px-3.5 border-border rounded-xl text-xs font-extrabold bg-background text-foreground hover:bg-muted cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>
                  Sort By:{' '}
                  {talentSorting === 'Score' ? 'Talent Match' : talentSorting}
                </span>
              </Button>

              {isTalentSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-999"
                    onClick={() => setIsTalentSortOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 z-1000 w-52 rounded-2xl border border-border bg-card shadow-2xl py-1.5 text-foreground animate-in fade-in slide-in-from-top-2 duration-150 select-text">
                    {[
                      { value: 'Terlama', label: 'Terlama' },
                      { value: 'Terbaru', label: 'Terbaru' },
                      { value: 'Score', label: 'Talent Match' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setTalentSorting(opt.value as any);
                          setIsTalentSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs hover:bg-muted cursor-pointer transition-colors duration-150 ${
                          talentSorting === opt.value
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
      </div>

      <div className="w-full space-y-4 lg:col-span-3">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <div className="flex gap-2">
            {(['All', 'Favorite', 'Unlocked'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setTalentPageTab(tab);
                  setTalentPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border cursor-pointer flex items-center gap-1.5 ${
                  talentPageTab === tab
                    ? 'bg-foreground border-foreground text-background shadow-sm'
                    : 'bg-card border-border text-foreground hover:bg-muted'
                }`}
              >
                {tab === 'All' && <span>Semua Talent</span>}
                {tab === 'Favorite' && (
                  <span className="flex items-center gap-1"><Star className="w-3 h-3" /> Talent Pool</span>
                )}
                {tab === 'Unlocked' && (
                  <>
                    <Unlock className="h-3.5 w-3.5" />
                    <span>Cv terbuka</span>
                  </>
                )}
              </button>
            ))}
          </div>

          <span className="text-xs text-muted-foreground font-semibold">
            Menampilkan <strong>{filteredTalents.length}</strong> talent
          </span>
        </div>

        {paginatedTalents.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <Compass className="h-10 w-10 text-muted-foreground/35 mx-auto mb-3" />
            <h4 className="font-bold text-xs text-muted-foreground uppercase">
              Talent Tidak Ditemukan
            </h4>
            <p className="text-[12px] text-muted-foreground mt-1">
              Belum ada kandidat di talent global yang sesuai dengan kriteria
              filter Anda.
            </p>
          </div>
        ) : (
          <div className="h-[1240px] overflow-y-auto pr-2 pb-4 scroll-smooth">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {paginatedTalents.map((talent) => {
                const isUnlocked = unlockedTalents.includes(talent.id);
                const isFav = favoriteTalents.includes(talent.id);

              return (
                <Card
                  key={talent.id}
                  className="border border-border/80 hover:border-emerald-500/30 transition-all duration-300 rounded-2xl overflow-hidden shadow-sm bg-card text-card-foreground hover:shadow-md flex flex-col justify-between h-[365px] relative group"
                >
                  <div className="p-5 relative flex-1 flex flex-col justify-between">
                    <button
                      type="button"
                      onClick={() => toggleFavoriteTalent(talent.id)}
                      className="absolute top-4 right-4 p-1.5 rounded-full bg-muted/40 hover:bg-muted text-muted-foreground hover:text-amber-500 transition-all border-none cursor-pointer z-10"
                    >
                      <Star
                        className={`h-4 w-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`}
                      />
                    </button>
 
                    <div className="flex flex-col items-center text-center">
                      <div className="relative">
                        {talent.avatar &&
                        !talent.avatar.includes('default-avatar') &&
                        !talent.avatar.includes('placeholder') ? (
                          <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-background shadow-md shrink-0 relative">
                            <Image
                              src={talent.avatar}
                              alt={talent.name}
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
                            <div className="avatar-fallback hidden absolute inset-0 items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-base font-black uppercase">
                              {talent.name?.[0] || '?'}
                            </div>
                          </div>
                        ) : (
                          <div className="h-14 w-14 rounded-full border-2 border-background shadow-md flex items-center justify-center shrink-0 text-white text-base font-bold bg-linear-to-tr from-emerald-500 to-teal-500">
                            {talent.name?.[0] || '?'}
                          </div>
                        )}
                      </div>
 
                      <h4 className="font-extrabold text-xs text-foreground mt-3 truncate max-w-full tracking-tight">
                        {talent.name}
                      </h4>
 
                      <p className="text-[10px] font-bold text-primary truncate max-w-full mt-0.5 tracking-wide uppercase">
                        {talent.title}
                      </p>
 
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1.5 max-w-full h-[48px] overflow-hidden content-start">
                        {getRolesForCard(talent.title)
                          .slice(0, 3)
                          .map((role: string, roleIdx: number) => (
                            <Badge
                              key={roleIdx}
                              variant="outline"
                              className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 h-[22px] rounded-md shadow-2xs flex items-center gap-1 shrink-0 ${
                                theme === 'white'
                                  ? 'bg-[#eef5fa] border-[#d2e2f0] text-[#334155]'
                                  : 'bg-background/50 border border-border/80 text-muted-foreground'
                              }`}
                            >
                              {roleIdx === 0 && (
                                <Briefcase className="w-3 h-3 shrink-0" />
                              )}
                              <span className="truncate max-w-[100px]">
                                {role}
                              </span>
                            </Badge>
                          ))}
                      </div>
 
                      <div className="w-full mt-3.5 space-y-1.5">
                        <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                          <span>Score Profil</span>
                          <span className="text-emerald-500">
                            {talent.profileScore}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-linear-to-r from-emerald-500 to-teal-500"
                            style={{ width: `${talent.profileScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
 
                    <div className="flex flex-wrap gap-1 mt-2.5 h-[22px] overflow-hidden content-start justify-center">
                      {talent.skills.slice(0, 3).map((s, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className={`text-[9px] font-bold px-2 py-0 h-5 rounded-md ${
                            theme === 'white'
                              ? 'bg-[#eef5fa] border-[#d2e2f0] text-[#334155]'
                              : 'bg-background/50 border border-border/80 text-muted-foreground'
                          }`}
                        >
                          {s}
                        </Badge>
                      ))}
                      {talent.skills.length > 3 && (
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold px-2 py-0 h-5 rounded-md ${
                            theme === 'white'
                              ? 'bg-[#eef5fa] border-[#d2e2f0] text-[#334155]'
                              : 'bg-background/50 border border-border/80 text-muted-foreground'
                          }`}
                        >
                          +{talent.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
 
                  <div className="p-4 border-t border-border/60 space-y-2 bg-muted/20 dark:bg-muted/10 shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider">
                          Gaji Ekspektasi
                        </p>
                        <p className="text-xs font-black text-foreground truncate mt-0.5">
                          Rp {talent.expectedSalary.toLocaleString('id-ID')}
                        </p>
                      </div>
 
                      {isUnlocked ? (
                        <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-extrabold text-[10px] h-7 px-2.5 flex items-center gap-1 rounded-xl shrink-0">
                          <Unlock className="h-3 w-3" />
                          <span>Cv terbuka</span>
                        </div>
                      ) : (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            const success = unlockTalent(talent.id);
                            if (success) {
                              alert(
                                `Berhasil membuka profil ${talent.name}! Saldo berkurang 10 koin.`,
                              );
                            } else {
                              alert(
                                'Koin Anda tidak cukup untuk membuka profil ini! Silakan lakukan top up di tab Koin.',
                              );
                              updateTabInUrl('coin-credit');
                            }
                          }}
                          className="h-7 text-[10px] font-extrabold uppercase gap-1 bg-linear-to-r from-amber-500 to-orange-500 hover:bg-amber-600 text-white rounded-xl border-none shadow-sm shadow-amber-500/10 cursor-pointer active:scale-95 transition-all px-2.5 shrink-0"
                        >
                          <Unlock className="h-3 w-3" />
                          <span>Unlock</span>
                        </Button>
                      )}
                    </div>
 
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingTalentProfile(talent);
                        }}
                        className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-800/40 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all cursor-pointer border border-zinc-300 dark:border-zinc-700/80 shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                        title="Lihat Detail Profil"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
 
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInvitingTalent(talent);
                          setSelectedJobsForInvite([]);
                          setInviteSearchPerCard('');
                        }}
                        className="flex-1 h-8 text-[10px] font-black rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 hover:scale-102 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 border-none uppercase"
                        title="Undang Kerja"
                      >
                        <SendIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>Invitation</span>
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
            </div>
          </div>
        )}

        {totalTalentPages >= 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 pt-6 pb-8 text-xs">
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                onClick={() => setTalentPage((p) => Math.max(p - 1, 1))}
                disabled={talentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center gap-1">
                {(() => {
                  const renderedElements: React.ReactNode[] = [];

                  const renderButton = (pageNum: number) => {
                    const isCurrent = talentPage === pageNum;
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
                            : { color: 'hsl(var(--foreground))' }
                        }
                        onClick={() => setTalentPage(pageNum)}
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

                  if (totalTalentPages <= 3) {
                    for (let i = 1; i <= totalTalentPages; i++) {
                      renderedElements.push(renderButton(i));
                    }
                  } else {
                    if (talentPage < 4) {
                      renderedElements.push(renderButton(1));
                      renderedElements.push(renderButton(2));
                      renderedElements.push(renderButton(3));
                      renderedElements.push(renderDots('dots-right'));
                    } else {
                      renderedElements.push(renderDots('dots-left'));
                      renderedElements.push(renderButton(totalTalentPages - 2));
                      renderedElements.push(renderButton(totalTalentPages - 1));
                      renderedElements.push(renderButton(totalTalentPages));
                    }
                  }
                  return renderedElements;
                })()}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                onClick={() =>
                  setTalentPage((p) => Math.min(p + 1, totalTalentPages))
                }
                disabled={talentPage === totalTalentPages}
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 w-full max-w-2xl rounded-3xl p-8 relative shadow-2xl animate-in scale-in duration-200 space-y-4">
            <button
              onClick={() => {
                setIsInviteModalOpen(false);
                setSelectedJobIdForInvite('');
                setInviteJobSearch('');
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xs font-bold cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                Undang Kerja
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Pilih lowongan aktif untuk mengundang <span className="font-bold text-foreground">{viewingTalentProfile?.name}</span>.
              </p>
            </div>

            {/* Search bar inside modal */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari lowongan..."
                value={inviteJobSearch}
                onChange={(e) => setInviteJobSearch(e.target.value)}
                className="pl-8 h-8.5 text-xs bg-background/50 border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>

            {/* List of active jobs */}
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {(() => {
                const filteredJobs = employerJobs
                  .filter((j: any) => j.status === 'aktif')
                  .filter((j: any) => j.title.toLowerCase().includes(inviteJobSearch.toLowerCase()));
                
                if (filteredJobs.length === 0) {
                  return (
                    <p className="text-[11px] text-muted-foreground italic text-center py-4">
                      {inviteJobSearch ? 'Tidak ada lowongan yang cocok.' : 'Anda tidak memiliki lowongan aktif.'}
                    </p>
                  );
                }

                return filteredJobs.map((job: any) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobIdForInvite(job.id)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between group ${
                      selectedJobIdForInvite === job.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border/50 hover:bg-muted/40 text-foreground/80'
                    }`}
                  >
                    <span className="truncate pr-2">{job.title}</span>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      selectedJobIdForInvite === job.id
                        ? 'border-primary-foreground bg-primary-foreground'
                        : 'border-border/80 group-hover:border-foreground/40'
                    }`}>
                      {selectedJobIdForInvite === job.id && (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setSelectedJobIdForInvite('');
                  setInviteJobSearch('');
                }}
                className="flex-1 text-xs font-bold h-9 rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                disabled={!selectedJobIdForInvite}
                onClick={() => {
                  const job = employerJobs.find((j: any) => j.id === selectedJobIdForInvite);
                  alert(`Undangan kerja berhasil dikirim ke ${viewingTalentProfile?.name} untuk posisi "${job?.title}"!`);
                  setIsInviteModalOpen(false);
                  setSelectedJobIdForInvite('');
                  setInviteJobSearch('');
                }}
                className="flex-1 text-xs font-bold h-9 rounded-xl cursor-pointer border-none bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                Kirim Undangan
              </Button>
            </div>
          </div>
        </div>
      )}

      {invitingTalent && (() => {
        const plan = user?.plan || 'Free';
        const isSubscribed = plan !== 'Free';
        const quotaUsed = sentInvitations.length;
        const quotaMax = 20;
        const quotaLeft = Math.max(0, quotaMax - quotaUsed);
        const alreadyInvited = sentInvitations.includes(invitingTalent?.id);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-card border border-border/80 w-full max-w-lg rounded-3xl p-6 relative shadow-2xl animate-in scale-in duration-200 space-y-4">
              <button
                onClick={() => {
                  setInvitingTalent(null);
                  setSelectedJobsForInvite([]);
                  setInviteSearchPerCard('');
                }}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xs font-bold cursor-pointer border-none bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  Undang Kerja
                </h3>
                <p className="text-xs text-muted-foreground">
                  Undang <span className="font-bold text-foreground">{invitingTalent?.name}</span> ke lowongan aktif Anda.
                </p>
              </div>

              {/* Subscription gating */}
              {!isSubscribed ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-foreground">Fitur Berbayar</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">Upgrade ke paket <span className="text-primary font-bold">Starter</span> atau <span className="text-primary font-bold">Platinum</span> untuk mengundang hingga 20 talent.</p>
                  </div>
                  <button
                    onClick={() => {
                      setInvitingTalent(null);
                    }}
                    className="mt-1 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black cursor-pointer border-none hover:opacity-90 transition-all"
                  >
                    Lihat Paket Langganan
                  </button>
                </div>
              ) : (
                <>
                  {/* Quota badge */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold ${
                    quotaLeft === 0
                      ? 'border-red-500/30 bg-red-500/5 text-red-500'
                      : quotaLeft <= 5
                      ? 'border-amber-500/30 bg-amber-500/5 text-amber-500'
                      : 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600'
                  }`}>
                    <SendIcon className="w-3.5 h-3.5 shrink-0" />
                    {quotaLeft === 0
                      ? 'Kuota undangan habis (0/20)'
                      : `Sisa kuota undangan: ${quotaLeft}/${quotaMax}`}
                    {alreadyInvited && <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Sudah Diundang</span>}
                  </div>

                  {quotaLeft > 0 || alreadyInvited ? (
                    <>
                      {/* Search bar inside floating window */}
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Cari lowongan..."
                          value={inviteSearchPerCard}
                          onChange={(e) => setInviteSearchPerCard(e.target.value)}
                          className="pl-8 h-9 text-xs bg-background/50 border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
                        />
                      </div>

                      {/* List of active jobs with checkbox */}
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 select-text">
                        {(() => {
                          const filteredJobs = employerJobs
                            .filter((j: any) => j.status === 'aktif')
                            .filter((j: any) => j.title.toLowerCase().includes(inviteSearchPerCard.toLowerCase()));
                          
                          if (filteredJobs.length === 0) {
                            return (
                              <p className="text-xs text-muted-foreground italic text-center py-4">
                                {inviteSearchPerCard ? 'Tidak ada lowongan yang cocok.' : 'Anda tidak memiliki lowongan aktif.'}
                              </p>
                            );
                          }

                          return filteredJobs.map((job: any) => {
                            const isChecked = selectedJobsForInvite.includes(job.id);
                            return (
                              <div
                                key={job.id}
                                onClick={() => {
                                  if (isChecked) {
                                    setSelectedJobsForInvite(selectedJobsForInvite.filter(id => id !== job.id));
                                  } else {
                                    setSelectedJobsForInvite([...selectedJobsForInvite, job.id]);
                                  }
                                }}
                                className={`px-3 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-3 ${
                                  isChecked
                                    ? 'border-primary/50 bg-primary/5 text-foreground'
                                    : 'border-border/50 hover:bg-muted/40 text-foreground/80'
                                }`}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedJobsForInvite([...selectedJobsForInvite, job.id]);
                                    } else {
                                      setSelectedJobsForInvite(selectedJobsForInvite.filter(id => id !== job.id));
                                    }
                                  }}
                                />
                                <span className="truncate flex-1">{job.title}</span>
                              </div>
                            );
                          });
                        })()}
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-border/50">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setInvitingTalent(null);
                            setSelectedJobsForInvite([]);
                            setInviteSearchPerCard('');
                          }}
                          className="flex-1 text-xs font-bold h-9 rounded-xl cursor-pointer"
                        >
                          Batal
                        </Button>
                        <Button
                          disabled={selectedJobsForInvite.length === 0}
                          onClick={() => {
                            const ok = sendJobInvitation(invitingTalent?.id);
                            if (!ok) {
                              alert('Kuota undangan Anda sudah habis (20/20). Silakan upgrade paket untuk kuota lebih.');
                              return;
                            }
                            const jobTitles = selectedJobsForInvite
                              .map(id => employerJobs.find((j: any) => j.id === id)?.title)
                              .filter(Boolean)
                              .join(', ');
                            alert(`Undangan kerja berhasil dikirim ke ${invitingTalent?.name} untuk posisi: ${jobTitles}!`);
                            setInvitingTalent(null);
                            setSelectedJobsForInvite([]);
                            setInviteSearchPerCard('');
                          }}
                          className="flex-1 text-xs font-bold h-9 rounded-xl cursor-pointer border-none bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                        >
                          Kirim Undangan ({selectedJobsForInvite.length})
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                      <p className="text-xs text-muted-foreground">Kuota 20 undangan Anda sudah habis. Hubungi tim kami untuk reset atau upgrade paket.</p>
                      <button
                        onClick={() => setInvitingTalent(null)}
                        className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black cursor-pointer border-none hover:opacity-90 transition-all"
                      >
                        Tutup
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default TalentTab;
