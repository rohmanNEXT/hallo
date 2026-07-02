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
  } = useModeration();

  const [showDoc, setShowDoc] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState<
    'check_account' | 'check_db' | 'history'
  >('check_account');
  const [currentPage, setCurrentPage] = useState(1);
  const [historyFilter, setHistoryFilter] = useState<
    'All' | 'Permanent Ban' | 'Suspend 30 Days' | 'Light Warning'
  >('All');
  const [historySearch, setHistorySearch] = useState<string>('');
  const [dbSearch, setDbSearch] = useState<string>('');
  const [showFullDescModal, setShowFullDescModal] = useState<{
    title: string;
    desc: string;
  } | null>(null);

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

  const activeViolations = violations.filter((v) => v.status === 'Active');
  const filteredHistory = activeViolations.filter((v) => {
    const matchesFilter =
      historyFilter === 'All' || v.alertLevel === historyFilter;
    const matchesSearch =
      historySearch === '' ||
      v.name?.toLowerCase().includes(historySearch.toLowerCase()) ||
      v.email?.toLowerCase().includes(historySearch.toLowerCase()) ||
      v.id?.toLowerCase().includes(historySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const historyItemsPerPage = 30;
  const totalHistoryPages = Math.max(
    1,
    Math.ceil(filteredHistory.length / historyItemsPerPage),
  );
  const paginatedHistory = filteredHistory.slice(
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
                                  <span className="text-[9px] text-muted-foreground bg-slate-800/40 px-3 py-1 rounded-full border border-slate-700/20 my-1">
                                    {msg.message}
                                  </span>
                                ) : (
                                  <div
                                    className={`max-w-[80%] rounded-2xl p-3 ${isSelf ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted text-foreground rounded-tl-none'}`}
                                  >
                                    <p className="text-[9px] font-bold opacity-80 mb-1">
                                      {msg.sender}
                                    </p>
                                    <p className="text-xs leading-relaxed">
                                      {msg.message}
                                    </p>
                                    <p className="text-[8px] opacity-60 text-right mt-1">
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
                    <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
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
                    <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
                      Nama Akun
                    </span>
                    <span className="font-bold text-foreground">
                      {foundAccount?.name ||
                        selectedCheckDetail.dbItem?.company ||
                        'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-black tracking-wide">
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
                      {selectedCheckDetail.jobDetails && (
                        <div className="font-extrabold text-[11px] text-foreground">
                          Rekomendasi AI:{' '}
                          {selectedCheckDetail.jobDetails.aiRecommendation}
                        </div>
                      )}
                      <p className="text-[10px] font-semibold text-muted-foreground opacity-90 leading-relaxed">
                        {selectedCheckDetail.reason}
                      </p>
                    </div>
                    <Badge
                      className={`text-[9px] border-none font-bold px-1.5 py-0.5 uppercase ${
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
                    className="h-7 text-[10px] font-bold flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 cursor-pointer"
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
                        setActiveLeftTab('check_db');
                        setCurrentPage(1);
                      }}
                      className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                        activeLeftTab === 'check_db'
                          ? 'text-foreground border-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Job Database
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

                  {activeLeftTab === 'check_db' && (
                    <div className="flex gap-2 w-full sm:w-auto items-center shrink-0">
                      <Input
                        placeholder="Cari lowongan/perusahaan..."
                        value={dbSearch}
                        onChange={(e) => {
                          setDbSearch(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="h-8 text-xs rounded-xl bg-background border border-border/80 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary text-foreground w-48 sm:w-56"
                      />
                      <Button
                        onClick={handleScanDatabase}
                        disabled={isScanning}
                        size="sm"
                        className="h-8 font-bold text-xs rounded-xl px-4 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 border-none shrink-0"
                      >
                        {isScanning ? 'Scanning...' : 'Scan DB'}
                      </Button>
                    </div>
                  )}

                  {activeLeftTab === 'history' && (
                    <div className="flex gap-2 w-full sm:w-72 shrink-0">
                      <Input
                        placeholder="Cari akun (nama/email)..."
                        value={historySearch}
                        onChange={(e) => {
                          setHistorySearch(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="h-8 text-xs rounded-xl bg-background border border-border/80 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary text-foreground"
                      />
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
                            <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider">
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
                            <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1.5 block">
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
                            <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1.5 block">
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

                {/* 2. Check Entire Database */}
                {activeLeftTab === 'check_db' && (
                  <div className="flex flex-col flex-1 w-full space-y-4 min-h-0">
                    <div className="flex-1 w-full space-y-4 overflow-y-auto pr-1">
                      {filteredDbItems.length > 0 ? (
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {paginatedDbResults.map((item, idx) => {
                              const seqNum =
                                (currentPage - 1) * dbItemsPerPage + idx + 1;
                              return (
                                <div
                                  key={item.idLowongan}
                                  className={`p-5 rounded-2xl flex flex-col justify-between shadow-lg transition-all duration-200 border cursor-pointer hover:scale-[1.01] ${
                                    theme === 'white'
                                      ? 'bg-white hover:bg-slate-50 border-slate-200/85 hover:border-slate-300'
                                      : 'bg-slate-900 border-slate-800 hover:border-slate-700/80'
                                  }`}
                                  style={{ minHeight: '190px' }}
                                  onClick={() => handleViewDbItemDetail(item)}
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
                                        <span className="text-[10px] text-primary font-bold block mt-1">
                                          {item.company}
                                        </span>
                                      </div>
                                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <Badge
                                          className={`font-bold text-[9px] px-2 py-0.5 rounded-full border ${
                                            theme === 'white'
                                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                                              : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 border-amber-500/20'
                                          }`}
                                        >
                                          Loker ID: {item.idLowongan}
                                        </Badge>
                                        {item.aiScore !== undefined && (
                                          <span
                                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
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
                                      className={`text-[11px] leading-relaxed p-3.5 rounded-xl shadow-xs mt-2 mb-3 border text-left ${
                                        theme === 'white'
                                          ? 'bg-slate-50/80 border-slate-200/60'
                                          : 'bg-slate-950/40 border-border/40'
                                      }`}
                                    >
                                      <span
                                        className={`font-bold tracking-wider mb-1 block uppercase text-[9px] ${
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
                                      className={`h-7 text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-200 border ${
                                        theme === 'white'
                                          ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                                          : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-foreground hover:border-slate-700'
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDbItemDetail(item);
                                      }}
                                    >
                                      Lihat Detail
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="h-[200px] flex flex-col items-center justify-center text-center text-xs text-muted-foreground border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                          No scan results available.
                        </div>
                      )}
                    </div>

                    {totalDbPages >= 1 && (
                      <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-border/40 text-xs flex-none">
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.max(prev - 1, 1),
                              )
                            }
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Previous</span>
                          </Button>
                          <div className="flex items-center gap-1">
                            {(() => {
                              const renderedElements: React.ReactNode[] = [];
                              for (let i = 1; i <= totalDbPages; i++) {
                                const isCurrent = currentPage === i;
                                renderedElements.push(
                                  <Button
                                    key={i}
                                    variant="outline"
                                    className="h-8 w-8 text-xs font-bold transition-all rounded-lg cursor-pointer shadow-sm"
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalDbPages),
                              )
                            }
                            disabled={currentPage === totalDbPages}
                          >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
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
                            const fullReason = `${v.violationType} - ${v.finalAiReason}`;
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
                                          className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded inline-block ${
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
                                        className={`text-[10px] block mt-0.5 pl-1 ${
                                          theme === 'white'
                                            ? 'text-slate-500'
                                            : 'text-muted-foreground'
                                        }`}
                                      >
                                        {v.email} • {v.blockType}
                                      </span>
                                    </div>
                                    <Badge
                                      className={`font-bold text-[9px] px-2 py-0.5 rounded-full shrink-0 border ${
                                        theme === 'white'
                                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                                          : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/10 border-rose-500/20'
                                      }`}
                                    >
                                      {v.alertLevel}
                                    </Badge>
                                  </div>

                                  <div
                                    className={`text-[11px] leading-relaxed p-3.5 rounded-xl shadow-xs mt-2 mb-3 border ${
                                      theme === 'white'
                                        ? 'bg-slate-50/80 border-slate-200/60'
                                        : 'bg-slate-950/40 border-border/40'
                                    }`}
                                  >
                                    <span
                                      className={`font-bold tracking-wider mb-1 block uppercase text-[9px] ${
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
                                        className={`font-bold mt-2 text-[10px] inline-flex items-center gap-0.5 transition-colors duration-150 ${
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
                                  className={`pt-2 border-t flex justify-between items-center text-[10px] ${
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.max(prev - 1, 1),
                              )
                            }
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Previous</span>
                          </Button>
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
                                    className="h-8 w-8 text-xs font-bold transition-all rounded-lg cursor-pointer shadow-sm"
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalHistoryPages),
                              )
                            }
                            disabled={currentPage === totalHistoryPages}
                          >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
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
                  Kebijakan Pembatasan Akun
                </h3>
              </div>
              <button
                onClick={() => setShowDoc(false)}
                className="text-muted-foreground hover:text-foreground border-none bg-transparent cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 text-left">
              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[11px] tracking-wider mb-1 border-b border-border/80 pb-1 flex items-center gap-1.5">
                  <span className="text-emerald-500">🏢</span> COMPANIES (PERUSAHAAN)
                </h4>
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  <li>
                    <strong className="text-foreground">Pembayaran Tidak Sah</strong>: Pembayaran transaksi di luar platform atau penggunaan mod app. Tindakan langsung: <span className="text-rose-500 font-bold">Blokir Permanen</span>.
                  </li>
                  <li>
                    <strong className="text-foreground">Loker Lolos Publikasi Tapi Bermasalah</strong>:
                    <ul className="list-none pl-4 space-y-1 mt-1">
                      <li>• Pelanggaran ke-1: Peringatan (email, beranda)</li>
                      <li>• Pelanggaran ke-2: Suspend akun sementara (30 hari)</li>
                      <li>• Pelanggaran ke-3: Blokir permanen akun</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[11px] tracking-wider mb-1 border-b border-border/80 pb-1 flex items-center gap-1.5">
                  <span className="text-blue-500">👤</span> USER (PENCARI KERJA)
                </h4>
                <p className="pl-1">
                  Pencari kerja yang terdeteksi melakukan spam lamaran atau aktivitas mencurigakan berulang akan dibatasi aksesnya selama 30 hari hingga permanen.
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

      {/* Big Box Floating Modal */}
      {showFullDescModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-3xl border border-border/80 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowFullDescModal(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors z-10"
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
