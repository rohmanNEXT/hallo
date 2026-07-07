'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModeration } from '../context';
import {
  LuSparkles as Sparkles,
  LuX as X,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuEye as Eye,
  LuArrowLeft as ArrowLeft,
  LuMessageSquare as MessageSquare,
  LuClock as Clock,
  LuMapPin as MapPin,
  LuBriefcase as Briefcase,
  LuDollarSign as DollarSign,
  LuFileText as FileText,
  LuCopy as Copy,
  LuUsers as Users,
  LuCircleAlert as AlertCircle,
  LuShieldCheck as ShieldCheck,
  LuFilter as Filter,
  LuBuilding2 as Building2,
  LuCreditCard as CreditCard,
  LuBot as Bot,
  LuSettings as Settings,
} from 'react-icons/lu';

const AccountSuspicionPage: React.FC = () => {
  const {
    toastMessage,
    showToast,
    handleCopyId,
    selectedCheckDetail,
    setSelectedCheckDetail,
    viewedJobIds,
    setViewedJobIds,
    localReviewJobs,
    employerJobs,
    accounts,
    violations,
    checkEmail,
    setCheckEmail,
    foundAccount,
    setFoundAccount,
    checkChatId,
    setCheckChatId,
    checkJobId,
    setCheckJobId,
    checkError,
    setCheckError,
    handleCheckEmail,
    handleCheckDetails,
    isScanning,
    dbScanResults,
    setDbScanResults,
    selectedDbItem,
    setSelectedDbItem,
    handleScanDatabase,
    handleViewDbItemDetail,
    handleBlockAccount,
    handleDbBlock,
    theme,
    getDaysDiff,
  } = useModeration();

  const [showDoc, setShowDoc] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState<
    'check_account' | 'history'
  >('check_account');
  const [currentPage, setCurrentPage] = useState(1);
  const [historyFilter, setHistoryFilter] = useState<
    'All' | 'Permanent Ban' | 'Suspend 30 Days' | 'Light Warning'
  >('All');
  const [historySearch, setHistorySearch] = useState<string>('');
  const [showFullDescModal, setShowFullDescModal] = useState<{
    title: string;
    desc: string;
  } | null>(null);

  const [showHistoryFilterFloating, setShowHistoryFilterFloating] = useState(false);
  const [historyStartFromNumber, setHistoryStartFromNumber] = useState<number | ''>('');
  const [historyFilterTime, setHistoryFilterTime] = useState<
    'all' | '1week' | '3weeks' | '1month' | '2months' | '3months'
  >('all');
  const [historyCategories, setHistoryCategories] = useState<{
    Chat: boolean;
    Lowongan: boolean;
    ModApp: boolean;
    SpamAccount: boolean;
    Other: boolean;
  }>({
    Chat: false,
    Lowongan: false,
    ModApp: false,
    SpamAccount: false,
    Other: false,
  });

  const activeViolations = violations.filter((v) => v.status === 'Active');
  const filteredHistory = activeViolations.filter((v) => {
    // 1. Alert Level Filter
    const matchesFilter =
      historyFilter === 'All' || v.alertLevel === historyFilter;

    // 2. Search Filter
    const matchesSearch =
      historySearch === '' ||
      v.name?.toLowerCase().includes(historySearch.toLowerCase()) ||
      v.email?.toLowerCase().includes(historySearch.toLowerCase()) ||
      v.id?.toLowerCase().includes(historySearch.toLowerCase());

    if (!matchesFilter || !matchesSearch) return false;

    // 3. Time Filter
    if (historyFilterTime === '1week') {
      if (getDaysDiff(v.date) > 7) return false;
    } else if (historyFilterTime === '3weeks') {
      if (getDaysDiff(v.date) > 21) return false;
    } else if (historyFilterTime === '1month') {
      if (getDaysDiff(v.date) > 30) return false;
    } else if (historyFilterTime === '2months') {
      if (getDaysDiff(v.date) > 60) return false;
    } else if (historyFilterTime === '3months') {
      if (getDaysDiff(v.date) > 90) return false;
    }

    // 4. Category Filter
    let cat = 'Other';
    if (v.violationType === 'ID Chat Bermasalah') {
      cat = 'Chat';
    } else if (v.violationType === 'Lowongan Bermasalah yang Lolos Publikasi') {
      cat = 'Lowongan';
    } else if (v.violationType === 'Pembayaran Tidak Sah') {
      cat = 'ModApp';
    } else if (v.violationType === 'Spam Akun') {
      cat = 'SpamAccount';
    }

    const hasActiveCategoryFilter =
      historyCategories.Chat ||
      historyCategories.Lowongan ||
      historyCategories.ModApp ||
      historyCategories.SpamAccount ||
      historyCategories.Other;

    if (hasActiveCategoryFilter) {
      if (cat === 'Chat' && !historyCategories.Chat) return false;
      if (cat === 'Lowongan' && !historyCategories.Lowongan) return false;
      if (cat === 'ModApp' && !historyCategories.ModApp) return false;
      if (cat === 'SpamAccount' && !historyCategories.SpamAccount) return false;
      if (cat === 'Other' && !historyCategories.Other) return false;
    }

    return true;
  });

  const slicedHistory =
    historyStartFromNumber !== '' && Number(historyStartFromNumber) > 0
      ? filteredHistory.slice(Number(historyStartFromNumber) - 1)
      : filteredHistory;

  const historyItemsPerPage = 30;
  const totalHistoryPages = Math.max(
    1,
    Math.ceil(slicedHistory.length / historyItemsPerPage),
  );
  const paginatedHistory = slicedHistory.slice(
    (currentPage - 1) * historyItemsPerPage,
    currentPage * historyItemsPerPage,
  );

  return (
    <div className="space-y-6">
      {selectedCheckDetail ? (
        <div className="w-full space-y-6 animate-in fade-in duration-300">
          <Button
            onClick={() => setSelectedCheckDetail(null)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs font-semibold hover:bg-muted border border-border cursor-pointer bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Moderasi Akun</span>
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="md:col-span-2 space-y-6">
              {/* CHAT PREVIEW IN DETAIL */}
              {selectedCheckDetail.chatDetails && (
                <div className="space-y-4 text-left">
                  <Card className="border border-border/70 bg-card shadow-md">
                    <CardContent className="p-5 md:p-6 space-y-4">
                      <h2 className="text-sm font-bold text-foreground border-b pb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-emerald-500" />
                        <span>Log Obrolan: {checkChatId.toUpperCase()}</span>
                      </h2>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {selectedCheckDetail.chatDetails.map(
                          (msg: any, i: number) => {
                            const isSelf =
                              msg.sender === foundAccount?.name;
                            const isSystem = msg.sender === 'Sistem';
                            return (
                              <div
                                key={i}
                                className={`flex flex-col ${isSystem ? 'items-center w-full' : isSelf ? 'items-end' : 'items-start'}`}
                              >
                                {isSystem ? (
                                  <span className="text-[12px] text-muted-foreground bg-slate-800/40 px-3 py-1 rounded-full border border-slate-700/20 my-1">
                                    {msg.message}
                                  </span>
                                ) : (
                                  <div
                                    className={`max-w-[80%] rounded-2xl p-3 ${isSelf ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted text-foreground rounded-tl-none'}`}
                                  >
                                    <p className="text-[12px] font-bold opacity-80 mb-1">
                                      {msg.sender}
                                    </p>
                                    <p className="text-xs leading-relaxed">
                                      {msg.message}
                                    </p>
                                    <p className="text-[12px] opacity-60 text-right mt-1">
                                      {msg.timestamp}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          },
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* JOB PREVIEW IN DETAIL */}
              {selectedCheckDetail.jobDetails && (
                <div className="space-y-6 text-left">
                  <Card className="border border-border/70 bg-card/50 backdrop-blur-sm shadow-md overflow-hidden relative">
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="h-[60px] w-[60px] rounded-xl bg-white flex items-center justify-center border border-border shadow-sm overflow-hidden p-2 shrink-0">
                          <span className="text-xl font-black text-black">
                            {selectedCheckDetail.jobDetails.company?.charAt(
                              0,
                            ) || 'C'}
                          </span>
                        </div>
                        <div>
                          <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-tight">
                            {selectedCheckDetail.jobDetails.title}
                          </h1>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[14px] font-bold text-emerald-500">
                              {selectedCheckDetail.jobDetails.company}
                            </span>
                            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/20">
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          <Clock className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                          <span>Penuh Waktu</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                          <span>Remote</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                          <span>Min. 1 Tahun</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          <DollarSign className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                          <span>
                            Rp{' '}
                            {selectedCheckDetail.jobDetails.salary?.toLocaleString(
                              'id-ID',
                            )}{' '}
                            / bln
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-border/70 bg-card shadow-md">
                    <CardContent className="p-5 md:p-6 space-y-4">
                      <div>
                        <h2 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">
                          Persyaratan
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="text-[12px] font-normal px-2.5 py-0.5 h-6 bg-background/50 border border-border text-muted-foreground"
                          >
                            Penuh Waktu
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-[12px] font-normal px-2.5 py-0.5 h-6 bg-background/50 border border-border text-muted-foreground"
                          >
                            Remote
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-[12px] font-normal px-2.5 py-0.5 h-6 bg-background/50 border border-border text-muted-foreground"
                          >
                            S1
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">
                          Skill
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {['React', 'TypeScript', 'Tailwind CSS'].map(
                            (skill, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-[12px] font-normal px-2.5 py-0.5 h-6 bg-background/50 border border-border text-muted-foreground"
                              >
                                {skill}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-border/70 bg-card shadow-md">
                    <CardContent className="p-5 md:p-6">
                      <h2 className="text-sm font-bold text-foreground border-b pb-2 mb-3">
                        Deskripsi Pekerjaan
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                        {selectedCheckDetail.jobDetails.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Right column: Action Panel */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-foreground border-b pb-2 uppercase">
                  Aksi Moderasi Akun
                </h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Email Target
                    </span>
                    <span className="font-bold text-foreground">
                      {foundAccount?.email ||
                        (selectedCheckDetail.dbItem
                          ? `hr@${selectedCheckDetail.dbItem.company.toLowerCase().replace(/\s+/g, '')}.com`
                          : 'N/A')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Nama Akun
                    </span>
                    <span className="font-bold text-foreground">
                      {foundAccount?.name ||
                        selectedCheckDetail.dbItem?.company ||
                        'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Rekomendasi Tindakan
                    </span>
                    <span className="font-bold text-amber-500 uppercase">
                      {selectedCheckDetail.alertLevel}
                    </span>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        if (selectedCheckDetail.dbItem) {
                          handleDbBlock(selectedCheckDetail.dbItem, 'By Human');
                        } else {
                          handleBlockAccount('By Human');
                        }
                        setSelectedCheckDetail(null);
                      }}
                      className="w-full h-9 text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all border-none"
                    >
                      Block
                    </Button>
                  </div>
                </div>
              </div>

              {selectedCheckDetail.reason && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-foreground tracking-tight pb-2 flex items-center gap-1.5 uppercase">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>
                      {selectedCheckDetail.chatDetails
                        ? 'Analisis Pelanggaran Chat'
                        : 'Analisis Hallo AI'}
                    </span>
                  </h3>
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                      selectedCheckDetail.alertLevel ===
                        'Permanent Ban' ||
                      selectedCheckDetail.alertLevel ===
                        'Suspend 30 Days'
                        ? 'bg-rose-500/5 border-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'bg-amber-500/5 border-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    <div className="space-y-1 text-left">
                      {(() => {
                        let catLabel = 'Other';
                        let catColorClass = 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
                        const reasonLower = selectedCheckDetail.reason?.toLowerCase() || '';
                        if (selectedCheckDetail.chatDetails) {
                          catLabel = 'Chat ID';
                          catColorClass = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                        } else if (selectedCheckDetail.jobDetails) {
                          catLabel = 'Lowongan ID';
                          catColorClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                        } else if (reasonLower.includes('mod app') || reasonLower.includes('pembayaran') || reasonLower.includes('transaksi')) {
                          catLabel = 'Mod App';
                          catColorClass = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
                        } else if (
                          reasonLower.includes('berubah sendiri') ||
                          reasonLower.includes('tanpa lewat verify') ||
                          reasonLower.includes('tanpa melalui proses verifikasi') ||
                          reasonLower.includes('sandi') ||
                          reasonLower.includes('telepon') ||
                          reasonLower.includes('email') ||
                          reasonLower.includes('password') ||
                          reasonLower.includes('kredensial')
                        ) {
                          catLabel = 'Spam Account';
                          catColorClass = 'bg-orange-500/10 text-orange-500 border-orange-500/20';
                        }
                        return (
                          <div className="mb-2 flex items-center gap-1.5">
                            <span className={`font-bold tracking-wider uppercase text-[11px] ${theme === 'white' ? 'text-slate-400' : 'text-muted-foreground'}`}>
                              Kategori:
                            </span>
                            <Badge variant="outline" className={`text-[10px] font-bold border rounded-full px-2 py-0.5 uppercase ${catColorClass}`}>
                              {catLabel}
                            </Badge>
                          </div>
                        );
                      })()}
                      {selectedCheckDetail.jobDetails && (
                        <div className="font-extrabold text-[12px] text-foreground">
                          Rekomendasi AI:{' '}
                          {selectedCheckDetail.jobDetails.aiRecommendation}
                        </div>
                      )}
                      <p className="text-[12px] font-semibold text-muted-foreground opacity-90 leading-relaxed">
                        {selectedCheckDetail.reason}
                      </p>
                    </div>
                    <Badge
                      className={`text-[12px] border-none font-bold px-1.5 py-0.5 uppercase ${
                        selectedCheckDetail.alertLevel ===
                          'Permanent Ban' ||
                        selectedCheckDetail.alertLevel ===
                          'Suspend 30 Days'
                          ? 'bg-rose-500/20 text-rose-600'
                          : 'bg-amber-500/20 text-amber-600'
                      }`}
                    >
                      {selectedCheckDetail.alertLevel === 'Permanent Ban'
                        ? 'Ban'
                        : selectedCheckDetail.alertLevel === 'Suspend 30 Days'
                          ? 'Suspend'
                          : 'Warning'}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="h-[960px] border border-border bg-card rounded-3xl overflow-hidden">
            <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full space-y-4">
              <div className="flex-none space-y-4">
                {/* Unified Title & Actions Row */}
                <div className="pb-4 border-b shrink-0 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2 uppercase">
                      Account Suspicion
                    </span>
                  </div>
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

                {/* Tab Navigation row inside Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shrink-0 pb-1">
                  <div className="flex items-center gap-6 text-sm font-semibold">
                    <button
                      onClick={() => {
                        setActiveLeftTab('check_account');
                        setCurrentPage(1);
                      }}
                      className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                        activeLeftTab === 'check_account'
                          ? 'text-foreground border-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Account Details
                    </button>
                    <button
                      onClick={() => {
                        setActiveLeftTab('history');
                        setCurrentPage(1);
                      }}
                      className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                        activeLeftTab === 'history'
                          ? 'text-foreground border-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Account Violations
                    </button>
                  </div>

                  {activeLeftTab === 'check_account' && (
                    <div className="flex gap-2 w-full sm:w-72 shrink-0">
                      <Input
                        placeholder="Masukkan email..."
                        value={checkEmail}
                        onChange={(e) => setCheckEmail(e.target.value)}
                        className="h-8 text-xs rounded-xl bg-background border border-border/80 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary text-foreground"
                      />
                      <Button
                        onClick={handleCheckEmail}
                        size="sm"
                        className="h-8 font-bold text-xs rounded-xl px-4 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 border-none shrink-0"
                      >
                        Check
                      </Button>
                    </div>
                  )}

                  {activeLeftTab === 'history' && (
                    <div className="flex gap-2 w-full sm:w-80 shrink-0 justify-end relative">
                      <Input
                        placeholder="Cari akun (nama/email)..."
                        value={historySearch}
                        onChange={(e) => {
                          setHistorySearch(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="h-8 text-xs rounded-xl bg-background border border-border/80 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary text-foreground flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() =>
                          setShowHistoryFilterFloating(!showHistoryFilterFloating)
                        }
                        className={`h-8 w-8 p-0 rounded-xl border flex items-center justify-center cursor-pointer shadow-none transition-all ${
                          showHistoryFilterFloating ||
                          historyStartFromNumber !== '' ||
                          historyFilterTime !== 'all' ||
                          historyCategories.Chat ||
                          historyCategories.Lowongan ||
                          historyCategories.ModApp ||
                          historyCategories.SpamAccount ||
                          historyCategories.Other
                            ? 'bg-zinc-900 border-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-sm'
                            : 'bg-background border-border text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground'
                        }`}
                        title="Filter Violations"
                      >
                        <Filter className="h-4 w-4" />
                      </Button>

                      {showHistoryFilterFloating && (
                        <div className="absolute right-0 top-9 z-30 w-60 bg-card border border-border rounded-2xl shadow-xl p-4 space-y-3.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150 text-left">
                          <div className="font-bold text-foreground">
                            Filter Violations
                          </div>

                          {/* 1. Mulai Nomor Dari */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase">
                              Mulai Nomor Dari
                            </label>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Contoh: 5"
                              value={historyStartFromNumber}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHistoryStartFromNumber(
                                  val === '' ? '' : Number(val),
                                );
                                setCurrentPage(1);
                              }}
                              className="h-7 text-xs"
                            />
                          </div>

                          {/* 2. Jangka Waktu */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase">
                              Jangka Waktu
                            </label>
                            <select
                              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              value={historyFilterTime}
                              onChange={(e) => {
                                setHistoryFilterTime(
                                  e.target.value as any,
                                );
                                setCurrentPage(1);
                              }}
                            >
                              <option value="all">Semua Waktu</option>
                              <option value="1week">1 Minggu Lalu</option>
                              <option value="3weeks">3 Minggu Lalu</option>
                              <option value="1month">1 Bulan Lalu</option>
                              <option value="2months">2 Bulan Lalu</option>
                              <option value="3months">3 Bulan Lalu</option>
                            </select>
                          </div>

                          {/* 3. Checkbox Kategori */}
                          <div className="space-y-2 pt-1 border-t border-border/50">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">
                              Kategori
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {(['Chat', 'Lowongan', 'ModApp', 'SpamAccount', 'Other'] as const).map((catKey) => {
                                const label = catKey === 'Chat' ? 'Chat ID' : catKey === 'Lowongan' ? 'Lowongan ID' : catKey === 'ModApp' ? 'Mod App' : catKey === 'SpamAccount' ? 'Spam Account' : catKey;
                                return (
                                  <div
                                    key={catKey}
                                    className="flex items-center gap-1.5 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setHistoryCategories((prev) => {
                                        const next = { ...prev, [catKey]: !prev[catKey] };
                                        return next;
                                      });
                                      setCurrentPage(1);
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={historyCategories[catKey]}
                                      onChange={() => {}} // handled by click container
                                      className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                                    />
                                    <span className="text-[11px] font-medium text-foreground select-none cursor-pointer">
                                      {label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* 4. Reset Button */}
                          {(historyStartFromNumber !== '' ||
                            historyFilterTime !== 'all' ||
                            historyCategories.Chat ||
                            historyCategories.Lowongan ||
                            historyCategories.ModApp ||
                            historyCategories.SpamAccount ||
                            historyCategories.Other) && (
                            <Button
                              onClick={() => {
                                setHistoryStartFromNumber('');
                                setHistoryFilterTime('all');
                                setHistoryCategories({
                                  Chat: false,
                                  Lowongan: false,
                                  ModApp: false,
                                  SpamAccount: false,
                                  Other: false,
                                });
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
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col pt-2 flex-1 min-h-0">
                {/* 1. Check Account */}
                {activeLeftTab === 'check_account' && (
                  <div className="space-y-5">
                    {checkError && (
                      <p className="text-xs text-rose-500 font-semibold">
                        {checkError}
                      </p>
                    )}

                    {foundAccount && (
                      <div className="p-5 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-5 animate-in fade-in duration-200 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 shrink-0">
                            {foundAccount.name?.charAt(0) || 'A'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] uppercase text-slate-400 font-black tracking-wider">
                              Nama Akun
                            </p>
                            <p className="text-sm font-extrabold text-foreground truncate">
                              {foundAccount.name}
                            </p>
                            <p className="text-xs text-slate-300 truncate">
                              {foundAccount.email} •{' '}
                              <span className="text-primary font-semibold">
                                {foundAccount.role}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/60">
                          <div>
                            <label className="text-[12px] uppercase text-slate-400 font-bold tracking-wider mb-1.5 block">
                              ID Chat
                            </label>
                            <Input
                              placeholder="ID Chat..."
                              value={checkChatId}
                              onChange={(e) =>
                                setCheckChatId(e.target.value)
                              }
                              className="h-9 text-xs bg-slate-900/60 border border-slate-800 text-foreground focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="text-[12px] uppercase text-slate-400 font-bold tracking-wider mb-1.5 block">
                              ID Lowongan
                            </label>
                            <Input
                              placeholder="ID Lowongan..."
                              value={checkJobId}
                              onChange={(e) =>
                                setCheckJobId(e.target.value)
                              }
                              className="h-9 text-xs bg-slate-900/60 border border-slate-800 text-foreground focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={handleCheckDetails}
                          className="w-full h-10 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 mt-2 border-none"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Detail</span>
                        </Button>
                      </div>
                    )}
                  </div>
                )}



                {/* 3. History */}
                {activeLeftTab === 'history' && (
                  <div className="flex flex-col flex-1 w-full space-y-4 min-h-0">
                    <div className="flex-1 w-full space-y-4 overflow-y-auto pr-1">
                      <div className="flex gap-2 flex-wrap">
                        {[
                          'All',
                          'Permanent Ban',
                          'Suspend 30 Days',
                          'Light Warning',
                        ].map((lvl) => {
                          const isCurrent = historyFilter === lvl;
                          return (
                            <button
                              key={lvl}
                              onClick={() => {
                                setHistoryFilter(lvl as any);
                                setCurrentPage(1);
                              }}
                              className={`text-xs font-normal px-3.5 py-1 h-7 rounded-full shadow-sm flex items-center cursor-pointer transition-all hover:-translate-y-0.5 duration-200 border ${
                                isCurrent
                                  ? 'bg-primary text-primary-foreground border-primary font-bold'
                                  : theme === 'white'
                                    ? 'bg-[#eef5fa] border-[#d2e2f0] text-[#334155]'
                                    : 'bg-background/50 border-border/80 text-muted-foreground'
                              }`}
                            >
                              {lvl}
                            </button>
                          );
                        })}
                      </div>

                      {filteredHistory.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {paginatedHistory.map((v, idx) => {
                            const seqNum =
                              (currentPage - 1) * historyItemsPerPage +
                              idx +
                              1;
                            const baseReason = ((v.violationType as string) === 'Lainnya' || (v.violationType as string) === 'Other') 
                              ? v.finalAiReason 
                              : `${v.violationType} - ${v.finalAiReason}`;
                            const fullReason = baseReason.replace(/^(Lainnya|Other)\s*-\s*/i, '');
                            return (
                              <div
                                key={v.id}
                                className={`p-5 rounded-2xl flex flex-col justify-between shadow-lg transition-all duration-200 relative overflow-hidden group border text-left ${
                                  theme === 'white'
                                    ? 'bg-white hover:bg-slate-50/50 border-slate-200/85 hover:border-slate-300'
                                    : 'bg-slate-900/40 hover:bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80'
                                }`}
                                style={{ minHeight: '180px' }}
                              >
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0 flex-1">
                                      <span
                                        className={`font-extrabold text-xs truncate block mb-1 ${
                                          theme === 'white'
                                            ? 'text-slate-800'
                                            : 'text-foreground'
                                        }`}
                                      >
                                        {seqNum}. {v.name}
                                      </span>
                                      <div className="flex items-center gap-1.5 mt-0.5 pl-1">
                                        <span
                                          className={`text-[12px] font-mono font-bold px-1.5 py-0.5 rounded inline-block ${
                                            theme === 'white'
                                              ? 'bg-slate-100 text-slate-500'
                                              : 'bg-muted-foreground/15 text-muted-foreground'
                                          }`}
                                        >
                                          ID: {v.id}
                                        </span>
                                        <button
                                          onClick={() =>
                                            handleCopyId(v.id)
                                          }
                                          className={`p-0.5 hover:bg-muted rounded transition-all cursor-pointer border-none bg-transparent flex items-center justify-center ${
                                            theme === 'white'
                                              ? 'text-slate-400 hover:text-slate-600'
                                              : 'text-muted-foreground hover:text-foreground'
                                          }`}
                                          title="Salin ID"
                                        >
                                          <Copy className="h-2.5 w-2.5" />
                                        </button>
                                      </div>
                                      <span
                                        className={`text-[12px] block mt-0.5 pl-1 ${
                                          theme === 'white'
                                            ? 'text-slate-500'
                                            : 'text-muted-foreground'
                                        }`}
                                      >
                                        {v.email} • {v.blockType}
                                      </span>
                                    </div>
                                    <Badge
                                      className={`font-bold text-[12px] px-2 py-0.5 rounded-full shrink-0 border ${
                                        theme === 'white'
                                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                                          : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/10 border-rose-500/20'
                                      }`}
                                    >
                                      {v.alertLevel}
                                    </Badge>
                                  </div>

                                  <div
                                    className={`text-[12px] leading-relaxed p-3.5 rounded-xl shadow-xs mt-2 mb-3 border ${
                                      theme === 'white'
                                        ? 'bg-slate-50/80 border-slate-200/60'
                                        : 'bg-slate-950/40 border-border/40'
                                    }`}
                                  >
                                    {(() => {
                                      let catLabel = 'Other';
                                      let catColorClass = 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
                                      if (v.violationType === 'ID Chat Bermasalah') {
                                        catLabel = 'Chat ID';
                                        catColorClass = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                                      } else if (v.violationType === 'Lowongan Bermasalah yang Lolos Publikasi') {
                                        catLabel = 'Lowongan ID';
                                        catColorClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                                      } else if (v.violationType === 'Pembayaran Tidak Sah') {
                                        catLabel = 'Mod App';
                                        catColorClass = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
                                      } else if (v.violationType === 'Spam Akun') {
                                        catLabel = 'Spam Account';
                                        catColorClass = 'bg-orange-500/10 text-orange-500 border-orange-500/20';
                                      } else if ((v.violationType as string) === 'Lainnya' || (v.violationType as string) === 'Other') {
                                        catLabel = 'Other';
                                        catColorClass = 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
                                      }
                                      return (
                                        <div className="mb-2 flex items-center gap-1.5">
                                          <span className={`font-bold tracking-wider uppercase text-[12px] ${theme === 'white' ? 'text-slate-400' : 'text-muted-foreground'}`}>
                                            Kategori:
                                          </span>
                                          <Badge variant="outline" className={`text-[11px] font-bold border rounded-full px-2 py-0.5 uppercase ${catColorClass}`}>
                                            {catLabel}
                                          </Badge>
                                        </div>
                                      );
                                    })()}
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
                                      {fullReason}
                                    </p>
                                    {fullReason.length > 80 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowFullDescModal({
                                            title: `Reason (Violation - Account ID: ${v.id})`,
                                            desc: fullReason,
                                          });
                                        }}
                                        className={`font-bold mt-2 text-[12px] inline-flex items-center gap-0.5 transition-colors duration-150 ${
                                          theme === 'white'
                                            ? 'text-sky-600 hover:text-sky-500'
                                            : 'text-primary hover:text-primary/80'
                                        }`}
                                      >
                                        Lihat Selengkapnya
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={`pt-2 border-t flex justify-between items-center text-[12px] ${
                                    theme === 'white'
                                      ? 'border-slate-100 text-slate-400'
                                      : 'border-slate-800/60 text-slate-400'
                                  }`}
                                >
                                  <span>{v.daysAgo}d ago</span>
                                  <span>{v.date}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-xs text-muted-foreground">
                          Tidak ada riwayat pelanggaran akun.
                        </div>
                      )}
                    </div>

                    {totalHistoryPages >= 1 && (
                      <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-border/40 text-xs flex-none">
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
                              const renderedElements: React.ReactNode[] = [];
                              for (
                                let i = 1;
                                i <= totalHistoryPages;
                                i++
                              ) {
                                const isCurrent = currentPage === i;
                                renderedElements.push(
                                  <Button
                                    key={i}
                                    variant="outline"
                                    className="h-9 w-9 text-xs font-bold transition-all rounded-lg cursor-pointer shadow-sm"
                                    style={
                                      isCurrent
                                        ? {
                                            backgroundColor:
                                              'hsl(var(--foreground))',
                                            color:
                                              'hsl(var(--background))',
                                            borderColor:
                                              'hsl(var(--foreground))',
                                          }
                                        : {
                                            color:
                                              'hsl(var(--foreground))',
                                          }
                                    }
                                    onClick={() => setCurrentPage(i)}
                                  >
                                    {i}
                                  </Button>,
                                );
                              }
                              return renderedElements;
                            })()}
                          </div>
                          <Button variant="outline"
                            size="sm"
                            className="h-9 w-9 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                            onClick={() =>setCurrentPage((prev) =>
                                Math.min(prev + 1, totalHistoryPages),
                              )
                            }
                            disabled={currentPage === totalHistoryPages}
                          >
                            
                            <ChevronRight className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Window Documentation Modal */}
      {showDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
             <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  Account Suspicion Documentation
                </h3>
              </div>
              <button
                onClick={() => setShowDoc(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 text-left">
              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[12px] tracking-wider mb-1 border-b border-border/80 pb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" /> Chat
                </h4>
                <p className="pl-1">
                  Akun dilaporkan atau terdeteksi mengirim pesan mencurigakan melalui fitur chat, seperti mengirim tautan di luar platform, phishing, penipuan, atau pesan berbahaya lainnya.
                </p>
                <p className="pl-1">
                  <strong>Action:</strong> <span className="text-amber-600 dark:text-amber-400 font-bold">Light Warning</span>
                </p>
              </div>

              <hr className="border-border/60" />

              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[12px] tracking-wider mb-1 border-b border-border/80 pb-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-500 shrink-0" /> Job Posting
                </h4>
                <p className="pl-1">
                  Lowongan pekerjaan yang dipublikasikan melanggar kebijakan, seperti lowongan palsu, informasi yang menyesatkan, atau konten yang tidak sesuai.
                </p>
                <p className="pl-1">
                  <strong>Action:</strong> <span className="text-amber-600 dark:text-amber-400 font-bold">Light Warning</span>
                </p>
              </div>

              <hr className="border-border/60" />

              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[12px] tracking-wider mb-1 border-b border-border/80 pb-1 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-rose-500 shrink-0" /> Payment Abuse
                </h4>
                <p className="pl-1">
                  Terdeteksi melakukan bypass pembayaran, transaksi di luar sistem resmi, atau penyalahgunaan fitur pembayaran.
                </p>
                <p className="pl-1">
                  <strong>Action:</strong> <span className="text-rose-600 dark:text-rose-400 font-bold">Permanent Block</span>
                </p>
              </div>

              <hr className="border-border/60" />

              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[12px] tracking-wider mb-1 border-b border-border/80 pb-1 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-orange-500 shrink-0" /> Spam Account
                </h4>
                <p className="pl-1">
                  Akun menunjukkan aktivitas spam atau indikasi telah dikompromikan, seperti perubahan email, nomor telepon, atau kata sandi tanpa melalui proses verifikasi yang sah.
                </p>
                <p className="pl-1">
                  <strong>Action:</strong> <span className="text-rose-600 dark:text-rose-400 font-bold">Permanent Block</span>
                </p>
              </div>

              <hr className="border-border/60" />

              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[12px] tracking-wider mb-1 border-b border-border/80 pb-1 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-zinc-500 shrink-0" /> Other
                </h4>
                <p className="pl-1">
                  Pelanggaran lain yang tidak termasuk dalam kategori di atas, berdasarkan hasil deteksi AI atau peninjauan moderator.
                </p>
                <div className="pl-3 mt-1.5 space-y-1">
                  <p className="font-bold text-foreground">Contoh:</p>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-slate-500 dark:text-slate-400">
                    <li>Recruiter lolos memposting lowongan spam dan mengirim chat spam.</li>
                    <li>Kandidat mengirim chat spam atau melakukan abuse kepada recruiter.</li>
                    <li>Dan lainnya jika melakukan user sebuah abuse apapun yang belum diketahui.</li>
                  </ul>
                </div>
                <p className="pl-1 pt-1.5">
                  <strong>Action:</strong> <span className="text-amber-600 dark:text-amber-400 font-bold">Light Warning</span> (atau disesuaikan dengan tingkat pelanggaran)
                </p>
              </div>

              <hr className="border-border/60" />

              {/* LEVEL PELANGGARAN SECTION */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[12px] tracking-wider mb-3 border-b border-border/80 pb-1">
                  Level Pelanggaran
                </h4>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[12px] text-foreground uppercase tracking-wide">Light Warning</span>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Level 1</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      Peringatan ringan untuk pelanggaran pertama kali. Akun masih dapat beroperasi secara normal, namun tercatat dalam sistem moderasi. Berlaku untuk pelanggaran Chat ID dan Job Posting.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[12px] text-foreground uppercase tracking-wide">Suspend 30 Days</span>
                      <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">Level 2</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      Penangguhan akun selama 30 hari. Akun tidak dapat melakukan aktivitas apapun di platform selama masa suspensi. Berlaku untuk pelanggaran berulang atau kategori tertentu.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[12px] text-foreground uppercase tracking-wide">Permanent Ban</span>
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">Level 3</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      Pemblokiran permanen terhadap akun. Akun tidak dapat diaktifkan kembali dan semua data terkait akan dinonaktifkan. Berlaku untuk Payment Abuse, Spam Account, atau pelanggaran berat lainnya.
                    </p>
                  </div>
                </div>
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

      {/* Big Box Floating Modal */}
      {showFullDescModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-3xl border border-border/80 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowFullDescModal(null)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-muted-foreground transition-colors z-10 border-none bg-transparent cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6 border-b border-border/50 bg-muted/20">
              <h2 className="text-sm font-extrabold flex items-center gap-2 text-foreground uppercase tracking-widest text-left">
                <AlertCircle className="h-4.5 w-4.5 text-primary" />
                {showFullDescModal.title}
              </h2>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto bg-card text-left">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {showFullDescModal.desc}
              </p>
            </div>
            <div className="p-4 pt-2 flex items-center justify-end bg-muted/10 border-t border-border/50">
              <Button
                variant="outline"
                onClick={() => setShowFullDescModal(null)}
                className="h-9 text-xs font-bold rounded-xl px-6"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSuspicionPage;
