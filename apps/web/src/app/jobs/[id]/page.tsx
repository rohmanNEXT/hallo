'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Briefcase,
  GraduationCap,
  Bookmark,
  Share2,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Building2,
  Eye,
  Sparkles,
  AlertCircle,
  Flame,
  User,
  Banknote,
  MonitorSmartphone,
  Globe,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { mockJobsData, Job } from '@/app/jobs/page';
import { CompaniesPage } from '@/app/companies/page';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { bookmarks, toggleBookmark, applyJob, user, theme } = useAppStore();
  const [job, setJob] = useState<Job | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCompanyDescExpanded, setIsCompanyDescExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Find job from mock data, default to first job if not found
    const found = mockJobsData.find((j) => j.id === jobId) || mockJobsData[0];
    if (found) {
      setJob(found);
    }
  }, [jobId]);

  if (!mounted) return null;

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">
            Memuat Detail Lowongan...
          </p>
        </div>
      </div>
    );
  }

  const foundCompany = CompaniesPage.find(
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

  // Filter recommendations based on matching category or title keyword
  const recommendedJobs = mockJobsData
    .filter(
      (j) =>
        j.id !== job.id &&
        (j.company === job.company ||
          j.categories.some((cat) => job.categories.includes(cat)) ||
          j.title
            .toLowerCase()
            .split(' ')
            .some((word) => job.title.toLowerCase().includes(word))),
    )
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
        <div className="bg-card/60 backdrop-blur-md">
          <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/jobs')}
              className="flex items-center gap-2 text-xs font-semibold hover:bg-primary/10 -ml-3 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="text-xs font-semibold cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                {copied ? 'Tersalin!' : 'Bagikan'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleBookmark(job.id)}
                className={`text-xs font-semibold cursor-pointer ${isBookmarked ? 'text-primary border-primary bg-primary/5' : ''}`}
              >
                <Bookmark
                  className={`h-3.5 w-3.5 mr-1.5 ${isBookmarked ? 'fill-primary text-primary' : ''}`}
                />
                {isBookmarked ? 'Tersimpan' : 'Simpan'}
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
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-full h-full object-contain"
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
                          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
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
                          ? 'bg-[#16a34a] text-white !border-[#16a34a]'
                          : mounted && theme === 'white'
                            ? 'bg-[#0f6dff] hover:bg-[#0056d6] text-white !border-[#0f6dff] hover:!border-[#0056d6]'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground !border-primary hover:!border-primary/90'
                      }`}
                    >
                      {appliedJobs.includes(job.id) ? (
                        <>
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Sudah Dilamar
                        </>
                      ) : isApplying ? (
                        <>
                          <svg
                            className="h-3.5 w-3.5 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
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
                        className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`}
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
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
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
                        className={`text-[11.5px] font-normal px-2.5 py-0.5 h-6 ${
                          mounted && theme === 'white'
                            ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                            : 'bg-background/50 border border-border/80 text-muted-foreground'
                        }`}
                      >
                        {job.workType}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[11.5px] font-normal px-2.5 py-0.5 h-6 ${
                          mounted && theme === 'white'
                            ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                            : 'bg-background/50 border border-border/80 text-muted-foreground'
                        }`}
                      >
                        {job.workOption}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[11.5px] font-normal px-2.5 py-0.5 h-6 ${
                          mounted && theme === 'white'
                            ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                            : 'bg-background/50 border border-border/80 text-muted-foreground'
                        }`}
                      >
                        {job.experienceLevel}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[11.5px] font-normal px-2.5 py-0.5 h-6 ${
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
                          className={`text-[11.5px] font-normal px-2.5 py-0.5 h-6 ${
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
                          className={`text-[11.5px] font-normal px-2.5 py-0.5 h-6 rounded-full shadow-sm flex items-center gap-1.5 ${
                            mounted && theme === 'white'
                              ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                              : 'bg-background/50 border border-border/80 text-muted-foreground'
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
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
                <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
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
                        <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <button
                      onClick={() => router.push(`/company/${companyId}`)}
                      className="text-xs text-primary hover:text-primary/80 transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Lihat Profil Perusahaan
                      <svg className="h-3 w-3 shrink-0 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-5 border-border/60 text-xs">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
                      <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
                    <p className={`text-xs text-muted-foreground leading-relaxed transition-all duration-300 ${isCompanyDescExpanded ? '' : 'line-clamp-5'}`}>
                      {foundCompany
                        ? foundCompany.description
                        : job.companyDetails.description}
                    </p>
                    {((foundCompany ? foundCompany.description : job.companyDetails.description) || '').length > 250 && (
                      <button
                        onClick={() => setIsCompanyDescExpanded(!isCompanyDescExpanded)}
                        className="text-xs text-primary hover:text-primary/80 transition-all duration-200 hover:underline font-semibold mt-2.5 cursor-pointer flex items-center gap-1"
                      >
                        {isCompanyDescExpanded ? (
                          <>
                            Sembunyikan
                            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                            </svg>
                          </>
                        ) : (
                          <>
                            Lihat semua
                            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Company Links */}
                  <div className="flex flex-wrap gap-2 !mt-1">
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
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href={companyDetailsDerived.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer bg-background/30"
                      title="Instagram"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                    <a
                      href={`https://x.com/${job.company.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer bg-background/30"
                      title="Twitter / X"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href={`https://facebook.com/${job.company.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer bg-background/30"
                      title="Facebook"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                      </svg>
                    </a>
                    <a
                      href={`https://youtube.com/${job.company.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer bg-background/30"
                      title="YouTube"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.003 3.003 0 0 0-2.11 2.108C0 8.026 0 12 0 12s0 3.974.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.863.51 9.388.51 9.388.51s7.525 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.974 24 12 24 12s0-3.974-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  </div>

                  {/* Company Workers */}
                  <div className="border-t pt-4 !mt-4">
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
                                <img
                                  src={avatarUrl}
                                  alt={worker}
                                  className="w-full h-full object-cover"
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
                              <svg
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
                      onClick={() => router.push(`/jobs/${recJob.id}`)}
                      className="group relative flex flex-col justify-between rounded-xl border border-border/70 py-4 px-5 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary/50 bg-card"
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          {/* Header: Logo, Title, and Bookmark */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border overflow-hidden">
                                <img
                                  src={recJob.logo}
                                  alt={recJob.company}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-[14px] text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                                  {recJob.title}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate font-medium mt-1 flex items-center gap-1">
                                  <span className="truncate">
                                    {recJob.company}
                                  </span>
                                  {recJob.isVerified && (
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                  )}
                                  <span className="shrink-0">
                                    • {recJob.location}
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
                                className={`h-4.5 w-4.5 ${mounted && bookmarks.includes(recJob.id) ? 'fill-primary text-primary' : ''}`}
                              />
                            </button>
                          </div>

                          {/* Badges Row */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {recJob.isPremium && (
                              <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold text-[11.5px] px-2 py-0.5 h-6">
                                Perusahaan Premium
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-[11.5px] font-normal px-2 py-0.5 h-6 ${
                                mounted && theme === 'white'
                                  ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                  : 'bg-background/50 border border-border/80 text-muted-foreground'
                              }`}
                            >
                              {recJob.workType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[11.5px] font-normal px-2 py-0.5 h-6 ${
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
            <aside className="w-full lg:w-87 shrink-0 space-y-6 mr-10">
              {/* Loker Ini Dikelola Oleh */}
              <Card className="border border-border/70 bg-card/50 backdrop-blur-sm shadow-md mb-8">
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-xs font-bold text-muted-foreground/80 tracking-wide">
                    Dikelola oleh 
                  </h3>

                  <div className="flex items-center gap-3 pt-1">
                    {job.managedBy.avatar ? (
                      <img
                        src={job.managedBy.avatar}
                        alt={job.managedBy.name}
                        className="h-9 w-9 rounded-full object-cover border border-border"
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
                          <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold text-[11.5px] px-2 py-0.5 h-6 shrink-0">
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

                <div className="space-y-3">
                  {recommendedJobs.map((recJob) => (
                    <div
                      key={recJob.id}
                      onClick={() => router.push(`/jobs/${recJob.id}`)}
                      className="group relative flex flex-col justify-between rounded-xl border border-border/70 py-4 px-5 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary/50 bg-card"
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          {/* Header: Logo, Title, and Bookmark */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border overflow-hidden">
                                <img
                                  src={recJob.logo}
                                  alt={recJob.company}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-[14px] text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                                  {recJob.title}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate font-medium mt-1 flex items-center gap-1">
                                  <span className="truncate">
                                    {recJob.company}
                                  </span>
                                  {recJob.isPremium && (
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                  )}
                                  <span className="shrink-0">
                                    • {recJob.location}
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
                                className={`h-4.5 w-4.5 ${bookmarks.includes(recJob.id) ? 'fill-primary text-primary' : ''}`}
                              />
                            </button>
                          </div>

                          {/* Badges Row */}
                          <div className="flex h-12 flex-wrap gap-1.5 mb-4">
                            {recJob.isPremium && (
                              <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold text-[11.5px] px-2 py-0.5 h-6">
                                Perusahaan Premium
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-[11.5px] font-normal px-2 py-0.5 h-6 ${
                                mounted && theme === 'white'
                                  ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                  : 'bg-background/50 border border-border/80 text-muted-foreground'
                              }`}
                            >
                              {recJob.workType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[11.5px] font-normal px-2 py-0.5 h-6 ${
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
    </>
  );
}
