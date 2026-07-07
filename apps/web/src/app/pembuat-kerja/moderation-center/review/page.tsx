'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModeration } from '../context';
import {
  LuSparkles as Sparkles,
  LuCircleCheck as CheckCircle,
  LuShieldCheck as ShieldCheck,
  LuX as X,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuSearch as Search,
  LuFilter as Filter,
  LuArrowLeft as ArrowLeft,
  LuMapPin as MapPin,
  LuClock as Clock,
  LuBriefcase as Briefcase,
  LuDollarSign as DollarSign,
  LuFileText as FileText,
  LuCopy as Copy,
  LuEye as Eye,
} from 'react-icons/lu';

const JobVerificationPage: React.FC = () => {
  const {
    toastMessage,
    showToast,
    handleCopyId,
    selectedJobDetail,
    setSelectedJobDetail,
    viewedJobIds,
    setViewedJobIds,
    localReviewJobs,
    employerJobs,
    getDaysDiff,
    handleAiScanAll,
    isScanningAll,
    handleAutoAcceptPass,
    handleApproveJob,
    handleRejectJob,
    theme,
    dbScanResults,
    isScanning,
    handleScanDatabase,
  } = useModeration();

  const [showDoc, setShowDoc] = useState(false);
  const [reviewTab, setReviewTab] = useState<'under_review' | 'rejected' | 'database'>('under_review');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [dbSearch, setDbSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterFloating, setShowFilterFloating] = useState(false);
  const [startFromNumber, setStartFromNumber] = useState<number | ''>('');
  const [showOnlyUnviewed, setShowOnlyUnviewed] = useState(false);
  const [jobFilterTime, setJobFilterTime] = useState<
    'all' | '1w' | '3w' | '1m' | '2m' | '3m'
  >('all');
  const [filterCuriga, setFilterCuriga] = useState<boolean>(false);
  const [filterLolos, setFilterLolos] = useState<boolean>(false);

  const handleOpenJobDetail = (job: any) => {
    setSelectedJobDetail(job);
    setViewedJobIds((prev) => {
      const next = new Set(prev);
      next.add(job.id);
      return next;
    });
  };

  const getJobSerialId = (job: any) => {
    if (job.serialId) return job.serialId;
    const idStr = String(job.id);
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randCode = '';
    for (let c = 0; c < 6; c++) {
      const val = Math.abs((hash >> (c * 4)) % chars.length);
      randCode += chars[val];
    }
    return `SRL-${randCode}`;
  };

  const storeInReviewJobs = employerJobs.filter(
    (job) => job.status === 'in review' || job.status === 'in-review',
  );

  const allReviewJobs = [...storeInReviewJobs, ...localReviewJobs];
  const underReviewCount = allReviewJobs.filter(
    (j) => j.status === 'in review' || j.status === 'in-review',
  ).length;
  const reviewFailedCount = allReviewJobs.filter(
    (j) => j.status === 'ditolak',
  ).length;

  const activeDbItems = dbScanResults.length > 0
    ? dbScanResults
    : localReviewJobs.map((job) => ({
        idLowongan: job.id,
        title: job.title,
        company: job.company,
        alertLevel: (job.aiScore ?? 100) < 70 ? 'Suspend 30 Days' : 'Aman',
        finalAiReason: job.aiRecommendation || 'Aman & Sesuai Kebijakan',
        type: (job.aiScore ?? 100) < 70 ? 'Keburukan Lowongan' : 'Aman',
        aiScore: job.aiScore ?? 100,
      }));

  const filteredDbItems = activeDbItems.filter((item) => {
    if (dbSearch === '') return true;
    return (
      item.title?.toLowerCase().includes(dbSearch.toLowerCase()) ||
      item.company?.toLowerCase().includes(dbSearch.toLowerCase()) ||
      item.idLowongan?.toLowerCase().includes(dbSearch.toLowerCase())
    );
  });

  const dbItemsPerPage = 30;
  const totalDbPages = Math.max(
    1,
    Math.ceil(filteredDbItems.length / dbItemsPerPage),
  );
  const paginatedDbResults = filteredDbItems.slice(
    (currentPage - 1) * dbItemsPerPage,
    currentPage * dbItemsPerPage,
  );

  const handleViewDbItemDetailLocal = (item: any) => {
    const job =
      localReviewJobs.find(
        (j) => j.id === item.idLowongan || j.serialId === item.idLowongan,
      ) ||
      employerJobs.find(
        (j) => j.id === item.idLowongan || j.serialId === item.idLowongan,
      );

    if (job) {
      setSelectedJobDetail(job);
    } else {
      setSelectedJobDetail({
        id: item.idLowongan,
        title: item.title,
        company: item.company,
        salary: 4500000,
        description: `Deskripsi tidak tersedia. Lowongan kerja ${item.idLowongan} dilaporkan memiliki indikasi pelanggaran aturan moderasi platform.`,
        aiScore: item.aiScore,
        aiRecommendation: item.finalAiReason,
        status: (item.alertLevel === 'Aman' || item.alertLevel === 'Lolos') ? 'aktif' : 'ditolak',
      });
    }
  };

  const inReviewJobs = allReviewJobs.filter((j) => {
    if (reviewTab === 'rejected') {
      return j.status === 'ditolak';
    }
    return j.status === 'in review' || j.status === 'in-review';
  });

  const baseFiltered = inReviewJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(reviewSearchQuery.toLowerCase()),
  );

  const unviewedFiltered = showOnlyUnviewed
    ? baseFiltered.filter((job) => !viewedJobIds.has(job.id))
    : baseFiltered;

  const timeFiltered = unviewedFiltered.filter((job) => {
    if (jobFilterTime === 'all') return true;
    const days = getDaysDiff(job.createdAt);
    if (jobFilterTime === '1w' && days <= 7) return true;
    if (jobFilterTime === '3w' && days <= 21) return true;
    if (jobFilterTime === '1m' && days <= 30) return true;
    if (jobFilterTime === '2m' && days <= 60) return true;
    if (jobFilterTime === '3m' && days <= 90) return true;
    return false;
  });

  const aiFiltered = timeFiltered.filter((job) => {
    const isSuspicious = job.aiScore !== undefined && job.aiScore < 50;
    const isLolos = job.aiScore === undefined || job.aiScore >= 50;

    if (filterCuriga && filterLolos) return true;
    if (filterCuriga) return isSuspicious;
    if (filterLolos) return isLolos;
    return true;
  });

  const filteredReviewJobs =
    startFromNumber !== '' && Number(startFromNumber) > 0
      ? aiFiltered.slice(Number(startFromNumber) - 1)
      : aiFiltered;

  const itemsPerPage = 30;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviewJobs.length / itemsPerPage),
  );
  const paginatedJobs = filteredReviewJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6">
      {selectedJobDetail ? (
        <div className="w-full space-y-6 animate-in fade-in duration-300">
          <Button
            onClick={() => setSelectedJobDetail(null)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs font-semibold hover:bg-muted border border-border cursor-pointer bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="md:col-span-2 space-y-6">
              <Card className="border border-border/70 bg-card/50 backdrop-blur-sm shadow-md overflow-hidden relative">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-[60px] w-[60px] rounded-xl bg-white flex items-center justify-center border border-border shadow-sm overflow-hidden p-2 shrink-0">
                      <span className="text-xl font-black text-black">
                        {selectedJobDetail.company?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-tight">
                        {selectedJobDetail.title}
                      </h1>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[14px] font-bold text-emerald-500">
                          {selectedJobDetail.company}
                        </span>
                        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span>
                        {selectedJobDetail.workType || 'Penuh Waktu'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span>
                        <span className="text-red-500 font-medium">
                          {selectedJobDetail.workOption || 'Remote'}
                        </span>
                        <span className="mx-1.5">•</span>
                        <span className="text-muted-foreground font-medium">
                          {selectedJobDetail.location ||
                            'Kabupaten Simeulue'}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span>
                        Min.{' '}
                        {selectedJobDetail.experienceLevel ||
                          'Tidak berpengalaman'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <DollarSign className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span>
                        Rp{' '}
                        {selectedJobDetail.salary?.toLocaleString(
                          'id-ID',
                        )}{' '}
                        / bln
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/70 bg-card shadow-md">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">
                      Persyaratan
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="text-[12px] font-normal px-2.5 py-0.5 h-6 bg-background/50 border border-border text-muted-foreground"
                      >
                        {selectedJobDetail.workType || 'Penuh Waktu'}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[12px] font-normal px-2.5 py-0.5 h-6 bg-background/50 border border-border text-muted-foreground"
                      >
                        {selectedJobDetail.workOption || 'Remote'}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[12px] font-normal px-2.5 py-0.5 h-6 bg-background/50 border border-border text-muted-foreground"
                      >
                        {selectedJobDetail.experienceLevel ||
                          'Tidak berpengalaman'}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[12px] font-normal px-2.5 py-0.5 h-6 bg-background/50 border border-border text-muted-foreground"
                      >
                        {selectedJobDetail.educationLevel || 'S1'}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">
                      Skill
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {(
                        selectedJobDetail.skills || [
                          'React',
                          'TypeScript',
                          'Tailwind CSS',
                          'Next.js',
                        ]
                      ).map((skill: string, i: number) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[12px] font-normal px-2.5 py-0.5 h-6 bg-background/50 border border-border text-muted-foreground"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">
                      Benefit Kerja
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {(
                        selectedJobDetail.benefits || [
                          'BPJS Kesehatan',
                          'Bonus Kinerja Tahunan',
                          'Waktu Kerja Fleksibel',
                        ]
                      ).map((benefit: string, i: number) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[12px] font-normal px-2.5 py-0.5 h-6 rounded-full shadow-sm flex items-center gap-1.5 bg-background/50 border border-border text-muted-foreground"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/70 bg-card shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground border-b pb-2 mb-4">
                      Deskripsi Pekerjaan
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                      {selectedJobDetail.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative">
                <div className="space-y-4 pt-1 text-xs">
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 mt-0.5">🔑</span>
                    <div>
                      <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                        Serial ID
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        {getJobSerialId(selectedJobDetail)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                    TINDAKAN MODERASI
                  </h3>
                </div>
                <div className="flex flex-col gap-2.5 pt-1">
                  <Button
                    onClick={() => {
                      handleApproveJob(selectedJobDetail.id);
                      setSelectedJobDetail(null);
                    }}
                    className="w-full h-10 font-bold text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 hover:border-emerald-500/30 cursor-pointer rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Ditinjau & Setujui</span>
                  </Button>
                  <Button
                    onClick={() => {
                      handleRejectJob(selectedJobDetail.id);
                      setSelectedJobDetail(null);
                    }}
                    className="w-full h-10 font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/15 hover:border-rose-500/30 cursor-pointer rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                    <span>Tolak Lowongan (Gagal)</span>
                  </Button>
                </div>
              </div>

              {selectedJobDetail.aiScore !== undefined && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-foreground tracking-tight border-b pb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Analisis Hallo AI</span>
                  </h3>
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                      selectedJobDetail.aiScore >= 50
                        ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/5 border-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    <div className="space-y-1 text-left">
                      <div className="font-extrabold text-xs text-foreground">
                        AI Score: {selectedJobDetail.aiScore}/100
                      </div>
                      <p className="text-[12px] font-semibold text-muted-foreground opacity-90 leading-relaxed">
                        Rekomendasi:{' '}
                        {selectedJobDetail.aiRecommendation}
                      </p>
                    </div>
                    <Badge
                      className={`text-[12px] border-none font-bold px-2 py-0.5 ${
                        selectedJobDetail.aiScore >= 50
                          ? 'bg-emerald-500/20 text-emerald-600'
                          : 'bg-rose-500/20 text-rose-600'
                      }`}
                    >
                      {selectedJobDetail.aiScore >= 50
                        ? 'Lolos'
                        : 'Curiga'}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <Card className="h-[960px] border border-border bg-card rounded-3xl overflow-hidden">
            <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full space-y-4">
              <div className="flex-none space-y-4">
                {/* Unified Title & Actions Row */}
                <div className="pb-4 border-b shrink-0 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2 uppercase">
                      Job Verification
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setShowDoc(true)}
                      size="sm"
                      variant="outline"
                      className="h-7 text-[12px] font-bold flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Document</span>
                    </Button>
                  </div>
                </div>

                {/* Tabs & Controls row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 shrink-0">
                  <div className="flex items-center gap-6 text-sm font-semibold">
                    <button
                      onClick={() => {
                        setReviewTab('under_review');
                        setCurrentPage(1);
                      }}
                      className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                        reviewTab === 'under_review'
                          ? 'text-foreground border-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Under Review ({underReviewCount})
                    </button>
                    <button
                      onClick={() => {
                        setReviewTab('rejected');
                        setCurrentPage(1);
                      }}
                      className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                        reviewTab === 'rejected'
                          ? 'text-foreground border-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Ditolak ({reviewFailedCount})
                    </button>
                    <button
                      onClick={() => {
                        setReviewTab('database');
                        setCurrentPage(1);
                      }}
                      className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                        reviewTab === 'database'
                          ? 'text-foreground border-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Job Database
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 justify-end">
                    {reviewTab === 'under_review' && (
                      <Button
                        onClick={() => handleAutoAcceptPass(filteredReviewJobs)}
                        className="h-8 font-bold text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 hover:border-emerald-500/30 cursor-pointer px-3 rounded-lg shrink-0 shadow-none transition-all duration-200"
                      >
                        Accept Pass
                      </Button>
                    )}

                    {reviewTab === 'database' && (
                      <Button
                        onClick={handleScanDatabase}
                        disabled={isScanning}
                        size="sm"
                        className="h-8 font-bold text-xs rounded-lg px-4 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 border-none shrink-0"
                      >
                        {isScanning ? 'Rejecting...' : 'Reject'}
                      </Button>
                    )}

                    <div className="w-full sm:w-60 relative flex gap-2 items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        {reviewTab === 'database' ? (
                          <Input
                            placeholder="Cari lowongan/perusahaan..."
                            value={dbSearch}
                            onChange={(e) => {
                              setDbSearch(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="pl-9 h-8 text-xs bg-background/50 border border-border rounded-lg placeholder-zinc-500 dark:placeholder-zinc-400 shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                          />
                        ) : (
                          <Input
                            placeholder="Cari lowongan..."
                            value={reviewSearchQuery}
                            onChange={(e) => {
                              setReviewSearchQuery(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="pl-9 h-8 text-xs bg-background/50 border border-border rounded-lg placeholder-zinc-500 dark:placeholder-zinc-400 shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                          />
                        )}
                      </div>

                      {reviewTab !== 'database' && (
                        <div className="relative">
                          <Button
                            onClick={() =>
                              setShowFilterFloating(!showFilterFloating)
                            }
                            className={`h-9 w-9 p-0 rounded-lg border flex items-center justify-center cursor-pointer shadow-none transition-all ${
                              showFilterFloating ||
                              showOnlyUnviewed ||
                              startFromNumber !== ''
                                ? 'bg-zinc-900 border-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-sm'
                                : 'bg-background border-border text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground'
                            }`}
                            title="Filter Lanjutan"
                          >
                            <Filter className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {showFilterFloating && (
                          <div className="absolute right-0 top-10 z-30 w-56 bg-card border border-border rounded-xl shadow-lg p-3 space-y-3 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="font-bold text-foreground">
                              Filter Lowongan
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[12px] font-bold text-muted-foreground uppercase">
                                Mulai Nomor Dari
                              </label>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Contoh: 5"
                                value={startFromNumber}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setStartFromNumber(
                                    val === '' ? '' : Number(val),
                                  );
                                  setCurrentPage(1);
                                }}
                                className="h-7 text-xs"
                              />
                            </div>
                            <div
                              className="flex items-center gap-2 pt-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                id="unviewedOnly"
                                checked={showOnlyUnviewed}
                                onChange={(e) => {
                                  setShowOnlyUnviewed(
                                    e.target.checked,
                                  );
                                  setCurrentPage(1);
                                }}
                                className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                              />
                              <label
                                htmlFor="unviewedOnly"
                                className="font-medium text-foreground cursor-pointer select-none"
                              >
                                Belum Dilihat Detail
                              </label>
                            </div>

                            <div className="space-y-1.5 pt-1">
                              <label className="text-[12px] font-bold text-muted-foreground uppercase">
                                Jangka Waktu
                              </label>
                              <select
                                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                value={jobFilterTime}
                                onChange={(e) => {
                                  setJobFilterTime(
                                    e.target.value as any,
                                  );
                                  setCurrentPage(1);
                                }}
                              >
                                <option value="all">
                                  Semua Waktu
                                </option>
                                <option value="1w">
                                  1 Minggu Lalu
                                </option>
                                <option value="3w">
                                  3 Minggu Lalu
                                </option>
                                <option value="1m">
                                  1 Bulan Lalu
                                </option>
                                <option value="2m">
                                  2 Bulan Lalu
                                </option>
                                <option value="3m">
                                  3 Bulan Lalu
                                </option>
                              </select>
                            </div>

                            <div
                              className="flex items-center gap-2 pt-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                id="filterCuriga"
                                checked={filterCuriga}
                                onChange={(e) => {
                                  setFilterCuriga(e.target.checked);
                                  setCurrentPage(1);
                                }}
                                className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                              />
                              <label
                                htmlFor="filterCuriga"
                                className="font-medium text-foreground cursor-pointer select-none"
                              >
                                Curiga Ai 
                              </label>
                            </div>
                            <div
                              className="flex items-center gap-2 pt-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                id="filterLolos"
                                checked={filterLolos}
                                onChange={(e) => {
                                  setFilterLolos(e.target.checked);
                                  setCurrentPage(1);
                                }}
                                className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                              />
                              <label
                                htmlFor="filterLolos"
                                className="font-medium text-foreground cursor-pointer select-none"
                              >
                                Lolos Ai 
                              </label>
                            </div>

                            {(showOnlyUnviewed ||
                              startFromNumber !== '' ||
                              jobFilterTime !== 'all' ||
                              filterCuriga ||
                              filterLolos) && (
                              <Button
                                onClick={() => {
                                  setStartFromNumber('');
                                  setShowOnlyUnviewed(false);
                                  setJobFilterTime('all');
                                  setFilterCuriga(false);
                                  setFilterLolos(false);
                                  setCurrentPage(1);
                                }}
                                className="w-full h-8 text-[12px] font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-800/60 rounded-md transition-colors"
                              >
                                Reset Filter
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

              <div className="flex-1 w-full overflow-y-auto pr-1 min-h-0">
                <div className="w-full">
                  {reviewTab === 'database' ? (
                    filteredDbItems.length === 0 ? (
                      <div className="h-[200px] flex flex-col items-center justify-center text-center text-xs text-muted-foreground border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        No scan results available.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paginatedDbResults.map((item, idx) => {
                          const seqNum =
                            (currentPage - 1) * dbItemsPerPage + idx + 1;
                          return (
                            <div
                              key={item.idLowongan}
                              className={`p-5 rounded-2xl flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md border cursor-pointer transition-all duration-200 ${
                                theme === 'white'
                                  ? 'bg-white hover:bg-slate-50 border-slate-200/85 hover:border-slate-300'
                                  : 'bg-slate-900 border-slate-800 hover:border-slate-700/80'
                              }`}
                              style={{ minHeight: '190px' }}
                              onClick={() => handleViewDbItemDetailLocal(item)}
                            >
                              <div className="space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="min-w-0 flex-1 text-left">
                                    <span
                                      className={`font-extrabold text-xs truncate block ${
                                        theme === 'white'
                                          ? 'text-slate-800'
                                          : 'text-foreground'
                                      }`}
                                    >
                                      {seqNum}. {item.title}
                                    </span>
                                    <span className="text-[12px] text-primary font-bold block mt-1">
                                      {item.company}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                                    <Badge
                                      className={`font-bold text-[12px] px-2 py-0.5 rounded-full border ${
                                        theme === 'white'
                                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                                          : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 border-amber-500/20'
                                      }`}
                                    >
                                      Loker ID: {item.idLowongan}
                                    </Badge>
                                    {item.aiScore !== undefined && (
                                      <span
                                        className={`text-[12px] font-bold px-1.5 py-0.5 rounded border ${
                                          item.aiScore < 70
                                            ? theme === 'white'
                                              ? 'bg-rose-50 text-rose-600 border-rose-100'
                                              : 'bg-rose-500/20 text-rose-500 border-rose-500/10'
                                            : theme === 'white'
                                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                              : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/10'
                                        }`}
                                      >
                                        Score: {item.aiScore}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div
                                  className={`text-[12px] leading-relaxed p-3.5 rounded-xl shadow-xs mt-2 mb-3 border text-left ${
                                    theme === 'white'
                                      ? 'bg-slate-50/80 border-slate-200/60'
                                      : 'bg-slate-950/40 border-border/40'
                                  }`}
                                >
                                  <span
                                    className={`font-bold tracking-wider mb-1 block uppercase text-[12px] ${
                                      theme === 'white'
                                        ? 'text-slate-400'
                                        : 'text-muted-foreground'
                                    }`}
                                  >
                                    Reason:
                                  </span>
                                  <p
                                    className={`line-clamp-2 font-normal ${
                                      theme === 'white'
                                        ? 'text-slate-600'
                                        : 'text-muted-foreground/90'
                                    }`}
                                  >
                                    {item.finalAiReason}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={`pt-2 border-t flex justify-end ${
                                  theme === 'white'
                                    ? 'border-slate-100'
                                    : 'border-slate-800/60'
                                }`}
                              >
                                <Button
                                  size="sm"
                                  className={`h-7 text-[12px] font-bold rounded-lg cursor-pointer transition-all duration-200 border ${
                                    theme === 'white'
                                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-foreground hover:border-slate-700'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDbItemDetailLocal(item);
                                  }}
                                >
                                  Lihat Detail
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    filteredReviewJobs.length === 0 ? (
                      <div className="h-[200px] flex flex-col items-center justify-center text-center text-xs text-muted-foreground border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        Tidak ada lowongan yang cocok atau dalam antrean.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {paginatedJobs.map((job, index) => {
                          const globalIndex =
                            (currentPage - 1) * itemsPerPage + index;
                          const isSuspicious =
                            job.aiScore !== undefined &&
                            job.aiScore < 50;

                          return (
                            <div
                              key={job.id}
                              className="p-3.5 border border-border/70 rounded-2xl bg-card flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-border transition-all duration-200"
                              style={{ minHeight: '245px' }}
                              onClick={() => handleOpenJobDetail(job)}
                            >
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start gap-2.5">
                                    <div className="h-6 w-6 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[12px] shrink-0">
                                      {inReviewJobs.findIndex(
                                        (j) => j.id === job.id,
                                      ) + 1}
                                    </div>
                                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-[16px] border border-emerald-500/15 shrink-0">
                                      {job.company?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                      <div>
                                        <h4 className="font-bold text-[13px] text-foreground leading-tight hover:underline">
                                          {job.title}
                                        </h4>
                                        <div className="mt-1 flex items-center gap-1.5">
                                          <span className="text-[12px] font-mono font-bold bg-muted-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded inline-block">
                                            {getJobSerialId(job)}
                                          </span>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCopyId(getJobSerialId(job));
                                            }}
                                            className="p-0.5 hover:bg-muted rounded transition-all border-none bg-transparent flex items-center justify-center text-muted-foreground hover:text-foreground"
                                            title="Salin Serial ID"
                                          >
                                            <Copy className="h-2.5 w-2.5" />
                                          </button>
                                        </div>
                                      </div>
                                      <span className="text-[12px] font-bold text-emerald-500 block mt-1.5">
                                        {job.company}
                                      </span>
                                    </div>
                                  </div>
                                  <Badge
                                    className={`text-[12px] border-none font-bold px-1.5 py-0.5 rounded-full capitalize ${
                                      job.status === 'aktif'
                                        ? 'bg-emerald-500/20 text-emerald-600'
                                        : job.status === 'ditolak'
                                          ? 'bg-rose-500/20 text-rose-600'
                                          : 'bg-amber-500/20 text-amber-600'
                                    }`}
                                  >
                                    {job.status}
                                  </Badge>
                                </div>

                                <p
                                  className="text-[12px] text-muted-foreground leading-relaxed font-normal"
                                  style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {job.description}
                                </p>

                                {job.aiScore !== undefined && (
                                  <div
                                    className={`p-2 rounded-xl border flex items-center justify-between text-[12px] ${
                                      !isSuspicious
                                        ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-rose-500/5 border-rose-500/10 text-rose-600 dark:text-rose-400'
                                    }`}
                                    style={{ height: '32px' }}
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                                      <span>
                                        AI Score:{' '}
                                        <strong
                                          className={
                                            isSuspicious
                                              ? 'text-rose-500'
                                              : 'text-emerald-500'
                                          }
                                        >
                                          {job.aiScore}/100
                                        </strong>{' '}
                                        - {job.aiRecommendation}
                                      </span>
                                    </div>
                                    <Badge
                                      className={`text-[12px] border-none px-1.5 py-0 ${
                                        !isSuspicious
                                          ? 'bg-emerald-500/20 text-emerald-600'
                                          : 'bg-rose-500/20 text-rose-600'
                                      }`}
                                    >
                                      {!isSuspicious
                                        ? 'Lolos'
                                        : 'Curiga'}
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <div className="border-t border-border/60" />
                                <div
                                  className="flex justify-between items-center"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span className="text-[12px] font-black text-emerald-600 dark:text-emerald-400">
                                    Rp{' '}
                                    {job.salary?.toLocaleString(
                                      'id-ID',
                                    )}{' '}
                                    / bln
                                  </span>
                                  <div className="flex gap-1.5">
                                    <Button
                                      onClick={() => handleOpenJobDetail(job)}
                                      className="h-7 w-7 p-0 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shadow-none cursor-pointer rounded-lg transition-all duration-200"
                                      title="Lihat Detail"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      onClick={() => handleApproveJob(job.id)}
                                      className="h-7 font-bold text-[12px] px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 hover:border-emerald-500/30 shadow-none cursor-pointer rounded-lg transition-all duration-200"
                                    >
                                      Diterima
                                    </Button>
                                    <Button
                                      onClick={() => handleRejectJob(job.id)}
                                      className="h-7 font-bold text-[12px] px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/15 hover:border-rose-500/30 shadow-none cursor-pointer rounded-lg transition-all duration-200"
                                    >
                                      Gagal
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              </div>
              {/* ALWAYS SHOW PAGINATION AT THE BOTTOM OF THE MENU INSIDE THE BOX */}
              {(() => {
                const paginationTotalPages = reviewTab === 'database' ? totalDbPages : totalPages;
                if (paginationTotalPages < 1) return null;
                return (
                  <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-border/40 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Button variant="outline"
                        size="sm"
                        className="h-9 w-9 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                        onClick={() =>setCurrentPage((prev) =>
                            Math.max(prev - 1, 1),
                          )
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" /></Button>

                      <div className="flex items-center gap-1">
                        {(() => {
                          const renderedElements: React.ReactNode[] =
                            [];
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
                                        backgroundColor:
                                          'hsl(var(--foreground))',
                                        color: 'hsl(var(--background))',
                                        borderColor:
                                          'hsl(var(--foreground))',
                                      }
                                    : {
                                        color: 'hsl(var(--foreground))',
                                      }
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

                          if (paginationTotalPages <= 3) {
                            for (let i = 1; i <= paginationTotalPages; i++) {
                              renderedElements.push(renderButton(i));
                            }
                          } else {
                            if (currentPage < 3) {
                              renderedElements.push(renderButton(1));
                              renderedElements.push(renderButton(2));
                              renderedElements.push(
                                renderDots('dots-right'),
                              );
                              renderedElements.push(
                                renderButton(paginationTotalPages),
                              );
                            } else if (currentPage >= paginationTotalPages - 1) {
                              renderedElements.push(renderButton(1));
                              renderedElements.push(
                                renderDots('dots-left'),
                              );
                              renderedElements.push(
                                renderButton(paginationTotalPages - 1),
                              );
                              renderedElements.push(
                                renderButton(paginationTotalPages),
                              );
                            } else {
                              renderedElements.push(renderButton(1));
                              renderedElements.push(
                                renderDots('dots-left'),
                              );
                              renderedElements.push(
                                renderButton(currentPage),
                              );
                              renderedElements.push(
                                renderDots('dots-right'),
                              );
                              renderedElements.push(
                                renderButton(paginationTotalPages),
                              );
                            }
                          }
                          return renderedElements;
                        })()}
                      </div>

                      <Button variant="outline"
                        size="sm"
                        className="h-9 w-9 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                        onClick={() =>setCurrentPage((prev) =>
                            Math.min(prev + 1, paginationTotalPages),
                          )
                        }
                        disabled={currentPage === paginationTotalPages}
                      >
                        
                        <ChevronRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          <div className="pb-10" />
        </>
      )}

      {/* Documentation Modal */}
      {showDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  Sistem Kebijakan & Aturan Moderasi
                </h3>
              </div>
              <button
                onClick={() => setShowDoc(false)}
                className="text-muted-foreground hover:text-foreground border-none bg-transparent cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[12px] tracking-wider mb-1 border-b border-border/80 pb-1 flex items-center gap-1.5">
                  <span className="text-emerald-500"><Sparkles className="h-4 w-4" /></span> HALLO AI HELPER
                </h4>
                <p className="pl-1">
                  Verifikasi dan peninjauan lowongan kerja sebelum dipublikasikan menggunakan bantuan <strong>Hallo AI</strong> dengan biaya operasional yang efisien.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[12px] tracking-wider mb-1 border-b border-border/80 pb-1 flex items-center gap-1.5">
                  <span className="text-blue-500"><ShieldCheck className="h-4 w-4" /></span> KUALITAS & KEAMANAN
                </h4>
                <p className="pl-1">
                  Memastikan lowongan memenuhi standar kualitas tinggi, kepatuhan hukum, dan keamanan menyeluruh di seluruh platform.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[12px] tracking-wider mb-1 border-b border-border/80 pb-1 flex items-center gap-1.5">
                  <span className="text-purple-500"><Briefcase className="h-4 w-4" /></span> TINDAKAN FLEXIBEL
                </h4>
                <p className="pl-1">
                  Lowongan lolos peninjauan langsung dipublikasikan, sedangkan yang butuh perbaikan akan dikembalikan ke perusahaan.
                </p>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-t border-border flex justify-end">
              <Button
                onClick={() => setShowDoc(false)}
                className="h-8 text-xs font-bold px-4 rounded-xl"
              >
                Tutup Dokumentasi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobVerificationPage;
