'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  LuArrowLeft as ArrowLeft,
  LuMapPin as MapPin,
  LuDollarSign as DollarSign,
  LuCalendar as Calendar,
  LuClock as Clock,
  LuBriefcase as Briefcase,
  LuGraduationCap as GraduationCap,
  LuBookmark as Bookmark,
  LuShare2 as Share2,
  LuShieldCheck as ShieldCheck,
  LuCircleCheck as CheckCircle2,
  LuExternalLink as ExternalLink,
  LuBuilding2 as Building2,
  LuEye as Eye,
  LuSparkles as Sparkles,
  LuCircleAlert as AlertCircle,
  LuFlame as Flame,
  LuUser as User,
  LuBanknote as Banknote,
  LuMonitorSmartphone as MonitorSmartphone,
  LuGlobe as Globe,
  LuUsers as Users,
  LuCheck,
  LuLoader as LuLoader2,
  LuChevronUp,
  LuChevronDown,
  LuLinkedin,
  LuInstagram,
  LuTwitter,
  LuFacebook,
  LuYoutube,
  LuFlag as Flag,
} from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/store';
import useAuth from '@/hooks/useAuth';
import useJobs from '@/hooks/useJobs';
import useCompanies from '@/hooks/useCompanies';
import React from 'react';
import { Job, Company } from '@/lib/types';
import { shortenLocation } from '@/lib/utils';
import Image from 'next/image';
import ReportModal from '@/components/pencari-kerja/ReportModal';

import LoadingSpinner from '@/components/ui/loading-spinner';

const JobDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { bookmarks, toggleBookmark, applyJob, theme } = useAppStore();
  const { user } = useAuth();
  const { data: jobs = [] } = useJobs();
  const { data: companies = [] } = useCompanies();

  const [job, setJob] = useState<Job | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCompanyDescExpanded, setIsCompanyDescExpanded] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const companyDescRef = React.useRef<HTMLParagraphElement>(null);
  const [showCompanyDescButton, setShowCompanyDescButton] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = companyDescRef.current;
    if (!el) return;

    const check = () => {
      if (!isCompanyDescExpanded) {
        setShowCompanyDescButton(el.scrollHeight > el.clientHeight);
      }
    };

    // Run check initially
    check();

    // Also run check if window resizes
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [job, companies, isCompanyDescExpanded]);

  useEffect(() => {
    if (jobs && jobs.length > 0 && jobId) {
      const found = jobs.find((j) => j.id === jobId) || jobs[0];
      if (found) {
        setJob(found);
      }
    }
  }, [jobs, jobId]);

  if (!mounted || !job) {
    return <LoadingSpinner />;
  }

  const foundCompany = companies.find(
    (c) => c.name.toLowerCase() === job.company.toLowerCase(),
  );
  const companyId = foundCompany ? foundCompany.id : '1';
  const companyDetailsDerived = {
    website: foundCompany
      ? `https://${foundCompany.name.toLowerCase().replace(/\s+/g, '')}.com`
      : job.companyDetails.website,
    linkedin: foundCompany
      ? `https://linkedin.com/company/${foundCompany.name.toLowerCase().replace(/\s+/g, '-')}`
      : job.companyDetails.linkedin,
    instagram: foundCompany
      ? `https://instagram.com/${foundCompany.name.toLowerCase().replace(/\s+/g, '.')}`
      : job.companyDetails.instagram,
  };

  // Filter recommendations based on matching category or title keyword, prioritized by shared categories/field
  const recommendedJobs = jobs
    .filter((j) => j.id !== job.id)
    .map((j) => {
      let score = 0;
      // Prioritize shared categories (bidang) heavily
      const sharedCategories = j.categories.filter((cat) =>
        job.categories.includes(cat),
      ).length;
      score += sharedCategories * 10;

      // Same company
      if (j.company === job.company) {
        score += 5;
      }

      // Title word matches (excluding short words)
      const commonTitleWords = j.title
        .toLowerCase()
        .split(/\s+/)
        .filter(
          (word) => word.length > 2 && job.title.toLowerCase().includes(word),
        ).length;
      score += commonTitleWords * 2;

      return { job: j, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.job)
    .slice(0, 3);

  const handleApply = async () => {
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

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isBookmarked = mounted && bookmarks.includes(job.id);

  return (
    <>
      <div className="min-h-screen bg-background pt-6 pb-12">
        <div className="bg-background">
          <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/pencari-kerja/jobs')}
              className={`flex items-center gap-2 text-xs font-semibold -ml-3 cursor-pointer transition-all ${
                mounted && theme === 'white'
                  ? 'text-[#334155] hover:bg-[#eef5fa] hover:text-[#0f6dff]'
                  : 'text-foreground hover:bg-white/10 hover:text-foreground'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReportOpen(true)}
                className="text-xs font-semibold cursor-pointer text-orange-500 border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500 h-8 px-3"
                title="Laporkan Lowongan"
              >
                <Flag className="h-3.5 w-3.5 mr-1.5" />
                Laporkan
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 pt-5 pb-6">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* LEFT/MAIN CONTAINER */}
            <div className="flex-1 w-full space-y-6">
              {/* 3.2 Job / ID Box - Company Mini Profile */}
              <Card className="border border-border/70 bg-card/50 backdrop-blur-sm shadow-md overflow-hidden relative">
                <CardContent className="p-5 md:p-6">
                  {/* Header: Logo + Title + Company */}
                  <div className="flex items-start gap-4 mb-6">
                    {/* Logo */}
                    <div className="h-[60px] w-[60px] rounded-xl bg-white flex items-center justify-center border border-border shadow-sm overflow-hidden p-2 shrink-0">
                      {job.logo.startsWith('/') ||
                      job.logo.startsWith('http') ? (
                        <Image
                          src={job.logo}
                          alt={job.company}
                          className="w-full h-full object-contain"
                          width={100}
                          height={100}
                          unoptimized
                        />
                      ) : (
                        job.logo
                      )}
                    </div>

                    {/* Title + Company */}
                    <div>
                      <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-tight">
                        {job.title}
                      </h1>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[14px] font-bold text-primary">
                          {job.company}
                        </span>
                        {job.isVerified && (
                          <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info rows — seperti referensi */}
                  <div className="space-y-3 mb-6">
                    {/* Tipe Kerja */}
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <User className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span>{job.workType}</span>
                    </div>

                    {/* Work Option + Lokasi */}
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span>
                        <span className="text-primary font-medium">
                          {job.workOption}
                        </span>
                        <span className="mx-1.5">•</span>
                        <span className="text-primary font-medium">
                          {job.location}
                        </span>
                      </span>
                    </div>

                    {/* Pengalaman */}
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span>Min. {job.experienceLevel}</span>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Banknote className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleApply}
                      disabled={appliedJobs.includes(job.id) || isApplying}
                      suppressHydrationWarning
                      className={`inline-flex items-center justify-center gap-2 h-10 px-7 text-sm font-bold rounded-full transition-all duration-200 shrink-0 shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border ${
                        appliedJobs.includes(job.id)
                          ? 'bg-[#16a34a] text-white border-[#16a34a]!'
                          : mounted && theme === 'white'
                            ? 'bg-[#0f6dff] hover:bg-[#0056d6] text-white border-[#0f6dff]! hover:border-[#0056d6]!'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary! hover:border-primary/90!'
                      }`}
                    >
                      {appliedJobs.includes(job.id) ? (
                        <>
                          <LuCheck className="h-3.5 w-3.5" strokeWidth={3} />
                          Sudah Dilamar
                        </>
                      ) : isApplying ? (
                        <>
                          <LuLoader2 className="h-3.5 w-3.5 animate-spin" />
                          Melamar...
                        </>
                      ) : (
                        'Lamar Sekarang'
                      )}
                    </button>

                    {/* Bookmark circle */}
                    <button
                      onClick={() => toggleBookmark(job.id)}
                      className={`h-9 w-9 cursor-pointer rounded-full border flex items-center justify-center transition-all duration-200 shrink-0
                      ${
                        isBookmarked
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-border bg-transparent text-foreground/70 hover:text-foreground hover:bg-muted/60'
                      }`}
                      title={isBookmarked ? 'Tersimpan' : 'Simpan'}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${isBookmarked ? 'fill-primary/60' : ''}`}
                      />
                    </button>

                    {/* Share circle */}
                    <button
                      onClick={handleShare}
                      className={`h-9 w-9 cursor-pointer rounded-full border flex items-center justify-center transition-all duration-200 shrink-0
                      ${
                        copied
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600'
                          : 'border-border bg-transparent text-foreground/70 hover:text-foreground hover:bg-muted/60'
                      }`}
                      title={copied ? 'Tersalin!' : 'Bagikan'}
                    >
                      {copied ? (
                        <LuCheck className="h-4 w-4" strokeWidth={3} />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Kualifikasi (Persyaratan, Skill, Benefit Kerja) */}
              <Card className="border border-border/70 bg-card/50 backdrop-blur-sm shadow-md">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-foreground mb-3">
                      Persyaratan
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[12px] font-normal px-2.5 py-0.5 h-6 ${
                          mounted && theme === 'white'
                            ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                            : 'bg-background/50 border border-border/80 text-muted-foreground'
                        }`}
                      >
                        {job.workType}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[12px] font-normal px-2.5 py-0.5 h-6 ${
                          mounted && theme === 'white'
                            ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                            : 'bg-background/50 border border-border/80 text-muted-foreground'
                        }`}
                      >
                        {job.workOption}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[12px] font-normal px-2.5 py-0.5 h-6 ${
                          mounted && theme === 'white'
                            ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                            : 'bg-background/50 border border-border/80 text-muted-foreground'
                        }`}
                      >
                        {job.experienceLevel}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[12px] font-normal px-2.5 py-0.5 h-6 ${
                          mounted && theme === 'white'
                            ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                            : 'bg-background/50 border border-border/80 text-muted-foreground'
                        }`}
                      >
                        {job.educationLevel}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-foreground mb-3">
                      Skill
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className={`text-[12px] font-normal px-2.5 py-0.5 h-6 ${
                            mounted && theme === 'white'
                              ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                              : 'bg-background/50 border border-border/80 text-muted-foreground'
                          }`}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-foreground mb-3">
                      Benefit Kerja
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((benefit, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className={`text-[12px] font-normal px-2.5 py-0.5 h-6 rounded-full shadow-sm flex items-center gap-1.5 ${
                            mounted && theme === 'white'
                              ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                              : 'bg-background/50 border border-border/80 text-muted-foreground'
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="border border-border/70 bg-card/50 backdrop-blur-sm shadow-md">
                <CardContent className="p-6 md:p-8 space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground border-b pb-2 mb-4">
                      Deskripsi Pekerjaan
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Menjaga Diri (Default Information) */}
              <div className="bg-orange-600/5 p-4 rounded-xl border border-orange-600/25 flex gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-xs text-orange-700 dark:text-orange-400">
                    Tips Menjaga Diri & Keamanan
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Jangan pernah mengirimkan uang atau membayar biaya apapun
                    dalam proses rekrutmen. Perusahaan resmi tidak memungut
                    biaya akomodasi atau tiket perjalanan. Laporkan jika Anda
                    menemukan indikasi penipuan.
                  </p>
                </div>
              </div>

              {/* Tentang Company */}
              <Card className="border border-border/70 bg-card/50 backdrop-blur-sm shadow-md">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between flex-wrap border-b pb-3.5 mb-4.5 gap-2">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-sm font-bold text-foreground">
                        Tentang {job.company}
                      </h2>
                      {job.isVerified && (
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      )}
                    </div>
                    <button
                      onClick={() =>
                        router.push(`/pencari-kerja/companies/${companyId}`)
                      }
                      className="text-xs text-primary hover:text-primary/80 transition-colors font-semibold flex items-center gap-1 cursor-pointer p-0 bg-transparent border-none"
                    >
                      Lihat Profil Perusahaan
                      <ExternalLink
                        className="h-3 w-3 shrink-0 ml-0.5"
                        strokeWidth={2.5}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-5 border-border/60 text-xs">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <div className="text-xs text-muted-foreground font-bold tracking-wider">
                          Industry
                        </div>
                        <div className="mt-1 font-normal text-foreground text-xs">
                          {job.companyDetails.industry}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:border-l md:pl-5 border-border/60">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <div className="text-xs text-muted-foreground font-bold tracking-wider">
                          Location
                        </div>
                        <div className="mt-1 font-normal text-foreground text-xs">
                          {job.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:border-l md:pl-5 border-border/60">
                      <Users className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <div className="text-xs text-muted-foreground font-bold tracking-wider">
                          Company Size
                        </div>
                        <div className="mt-1 font-normal text-foreground text-xs">
                          {job.companyDetails.employees || '100-500 Karyawan'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-3">
                    <p
                      ref={companyDescRef}
                      className={`text-xs text-muted-foreground leading-relaxed transition-all duration-300 ${isCompanyDescExpanded ? '' : 'line-clamp-5'}`}
                    >
                      {foundCompany
                        ? foundCompany.description
                        : job.companyDetails.description}
                    </p>
                    {showCompanyDescButton && (
                      <button
                        onClick={() =>
                          setIsCompanyDescExpanded(!isCompanyDescExpanded)
                        }
                        className="text-xs text-primary hover:text-primary/80 transition-all duration-200 hover:underline font-semibold mt-2.5 cursor-pointer flex items-center gap-1"
                      >
                        {isCompanyDescExpanded ? (
                          <>
                            Sembunyikan
                            <LuChevronUp
                              className="h-3.5 w-3.5 shrink-0"
                              strokeWidth={2.5}
                            />
                          </>
                        ) : (
                          <>
                            Lihat semua
                            <LuChevronDown
                              className="h-3.5 w-3.5 shrink-0"
                              strokeWidth={2.5}
                            />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Company Links */}
                  <div className="flex flex-wrap gap-2 mt-1!">
                    <a
                      href={companyDetailsDerived.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer bg-background/30"
                      title="Website Resmi"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                    <a
                      href={companyDetailsDerived.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer bg-background/30"
                      title="LinkedIn"
                    >
                      <LuLinkedin className="h-4 w-4" />
                    </a>
                    <a
                      href={companyDetailsDerived.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer bg-background/30"
                      title="Instagram"
                    >
                      <LuInstagram className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://x.com/${job.company.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer bg-background/30"
                      title="Twitter / X"
                    >
                      <LuTwitter className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={`https://facebook.com/${job.company.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer bg-background/30"
                      title="Facebook"
                    >
                      <LuFacebook className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://youtube.com/${job.company.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer bg-background/30"
                      title="YouTube"
                    >
                      <LuYoutube className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Company Workers */}
                  {job.companyDetails.workers &&
                    job.companyDetails.workers.length > 0 && (
                      <div className="border-t pt-4 mt-4!">
                        <h3 className="text-xs font-bold text-foreground mb-3.5">
                          Tim Kami
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {job.companyDetails.workers.map((worker, i) => {
                            const roles = [
                              'Chief Executive Officer (CEO)',
                              'Head of HR Department',
                              'Lead Product Designer',
                              'Senior Engineering Manager',
                            ];
                            const role = roles[i % roles.length];
                            const avatars = [
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
                            ];
                            const avatarUrl = avatars[i % avatars.length];
                            return (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-3 p-2 pr-4 rounded-full border bg-background/50 hover:bg-background transition-colors text-sm"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 border border-border">
                                    <Image
                                      src={avatarUrl}
                                      alt={worker}
                                      className="w-full h-full object-cover"
                                      width={100}
                                      height={100}
                                      unoptimized
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-xs text-foreground leading-none truncate">
                                      {worker}
                                    </div>
                                    <div className="text-xs font-normal text-muted-foreground leading-none mt-1 truncate">
                                      {role}
                                    </div>
                                  </div>
                                </div>
                                <a
                                  href={`https://linkedin.com/in/${worker.toLowerCase().replace(/\s+/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary transition-colors p-1 shrink-0 ml-3 border-l pl-3 cursor-pointer"
                                  title={`LinkedIn ${worker}`}
                                >
                                  <LuLinkedin className="h-4 w-4" />
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>

              {/* Mobile Recommended Jobs Section (Hidden on Desktop) */}
              <div className="block lg:hidden pt-4">
                <h3 className="font-bold text-sm text-foreground mb-4">
                  Lowongan Lainnya Yang Sesuai
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedJobs.map((recJob) => (
                    <div
                      key={recJob.id}
                      onClick={() =>
                        router.push(`/pencari-kerja/jobs/${recJob.id}`)
                      }
                      className="group relative flex flex-col justify-between rounded-xl border border-border/70 py-4 px-5 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary/50 bg-card"
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          {/* Header: Logo, Title, and Bookmark */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border overflow-hidden">
                                <Image
                                  src={recJob.logo}
                                  alt={recJob.company}
                                  className="w-full h-full object-contain"
                                  width={100}
                                  height={100}
                                  unoptimized
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-[14px] text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                                  {recJob.title}
                                </h3>
                                <p className="text-xs text-muted-foreground font-medium mt-1 flex items-center gap-1 overflow-hidden">
                                  <span className="truncate shrink min-w-0">
                                    {recJob.company}
                                  </span>
                                  {recJob.isVerified && (
                                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                  )}
                                  <span className="truncate shrink min-w-0">
                                    • {shortenLocation(recJob.location)}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(recJob.id);
                              }}
                              className="text-muted-foreground hover:text-primary transition-colors p-1 shrink-0 cursor-pointer"
                            >
                              <Bookmark
                                className={`h-4.5 w-4.5 ${mounted && bookmarks.includes(recJob.id) ? 'fill-primary/60' : ''}`}
                              />
                            </button>
                          </div>

                          {/* Badges Row */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {recJob.isPremium && (
                              <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold text-[12px] px-2 py-0.5 h-6">
                                Perusahaan Premium
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-[12px] font-normal px-2 py-0.5 h-6 ${
                                mounted && theme === 'white'
                                  ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                  : 'bg-background/50 border border-border/80 text-muted-foreground'
                              }`}
                            >
                              {recJob.workType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[12px] font-normal px-2 py-0.5 h-6 ${
                                mounted && theme === 'white'
                                  ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                  : 'bg-background/50 border border-border/80 text-muted-foreground'
                              }`}
                            >
                              {recJob.experienceLevel}
                            </Badge>
                          </div>
                        </div>

                        {/* Footer: Salary on Left, Time/Urgent on Right */}
                        <div className="flex items-center justify-between border-t pt-3 mt-auto h-9">
                          <span className="text-[12px] font-bold text-emerald-500">
                            {recJob.salary}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold h-6">
                            <span>{recJob.postedAt}</span>
                            {recJob.isUrgent && (
                              <Badge className="rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 font-semibold text-xs px-2 py-0 h-5 border border-red-500/10 shadow-none flex items-center gap-1">
                                <Flame className="h-2.5 w-2.5" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recommendedJobs.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Tidak ada lowongan terkait lainnya.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR PANEL */}
            <aside className="w-full lg:w-87 shrink-0 space-y-6">
              {/* Loker Ini Dikelola Oleh */}
              <Card className="border border-border/70 bg-card/50 backdrop-blur-sm shadow-md mb-8">
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-xs font-bold text-muted-foreground/80 tracking-wide">
                    Dikelola oleh
                  </h3>

                  <div className="flex items-center gap-3 pt-1">
                    {job.managedBy.avatar ? (
                      <Image
                        src={job.managedBy.avatar}
                        alt={job.managedBy.name}
                        className="h-9 w-9 rounded-full object-cover border border-border"
                        width={100}
                        height={100}
                        unoptimized
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full border border-border bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shadow-inner">
                        {job.managedBy.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-xs text-foreground truncate">
                          {job.managedBy.name}
                        </h4>
                        {job.managedBy.isPremium && (
                          <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold text-[12px] px-2 py-0.5 h-6 shrink-0">
                            Perusahaan Premium
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {job.managedBy.onlineStatus === 'Online' && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {job.managedBy.onlineStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Desktop Recommended Jobs (Hidden on Mobile) */}
              <div className="hidden lg:block space-y-4">
                <h3 className="font-bold text-sm text-foreground">
                  Lowongan Lainnya Yang Sesuai
                </h3>

                <div className="space-y-5">
                  {recommendedJobs.map((recJob) => (
                    <div
                      key={recJob.id}
                      onClick={() =>
                        router.push(`/pencari-kerja/jobs/${recJob.id}`)
                      }
                      className="group relative flex flex-col justify-between rounded-xl border border-border/70 py-4 px-5 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary/50 bg-card"
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          {/* Header: Logo, Title, and Bookmark */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border overflow-hidden">
                                <Image
                                  src={recJob.logo}
                                  alt={recJob.company}
                                  className="w-full h-full object-contain"
                                  width={100}
                                  height={100}
                                  unoptimized
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-[14px] text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                                  {recJob.title}
                                </h3>
                                <p className="text-xs text-muted-foreground font-medium mt-1 flex items-center gap-1 overflow-hidden">
                                  <span className="truncate shrink min-w-0">
                                    {recJob.company}
                                  </span>
                                  {recJob.isVerified && (
                                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                  )}
                                  <span className="truncate shrink min-w-0">
                                    • {shortenLocation(recJob.location)}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(recJob.id);
                              }}
                              className="text-muted-foreground hover:text-primary transition-colors p-1 shrink-0 cursor-pointer"
                            >
                              <Bookmark
                                className={`h-4.5 w-4.5 ${bookmarks.includes(recJob.id) ? 'fill-primary/60' : ''}`}
                              />
                            </button>
                          </div>

                          {/* Badges Row */}
                          <div className="flex h-12 flex-wrap gap-1.5 mb-4">
                            {recJob.isPremium && (
                              <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold text-[12px] px-2 py-0.5 h-6">
                                Perusahaan Premium
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-[12px] font-normal px-2 py-0.5 h-6 ${
                                mounted && theme === 'white'
                                  ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                  : 'bg-background/50 border border-border/80 text-muted-foreground'
                              }`}
                            >
                              {recJob.workType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[12px] font-normal px-2 py-0.5 h-6 ${
                                mounted && theme === 'white'
                                  ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                  : 'bg-background/50 border border-border/80 text-muted-foreground'
                              }`}
                            >
                              {recJob.experienceLevel}
                            </Badge>
                          </div>
                        </div>

                        {/* Footer: Salary on Left, Time/Urgent on Right */}
                        <div className="flex items-center justify-between border-t pt-3 mt-auto h-9">
                          <span className="text-[12px] font-bold text-emerald-500">
                            {recJob.salary}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold h-6">
                            <span>{recJob.postedAt}</span>
                            {recJob.isUrgent && (
                              <Badge className="rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 font-semibold text-xs px-2 py-0 h-5 border border-red-500/10 shadow-none flex items-center gap-1">
                                <Flame className="h-2.5 w-2.5" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recommendedJobs.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Tidak ada lowongan terkait lainnya.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetName={job.title}
        targetType="lowongan"
      />
    </>
  );
};

export default JobDetailPage;
