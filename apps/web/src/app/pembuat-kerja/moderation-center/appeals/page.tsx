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
  LuCircleAlert as AlertCircle,
  LuShieldCheck as ShieldCheck,
  LuFilter as Filter,
  LuSearch as Search,
  LuClipboardPen as ClipboardSignature,
} from 'react-icons/lu';

const AppealHumanPage: React.FC = () => {
  const {
    toastMessage,
    showToast,
    handleCopyId,
    selectedCheckDetail,
    setSelectedCheckDetail,
    accounts,
    appeals,
    setAppeals,
    getDaysDiff,
    handleResolveAppeal,
    handleViewAppealChatDetail,
    handleViewAppealJobDetail,
    theme,
    viewedAppealIds,
  } = useModeration();

  const [showDoc, setShowDoc] = useState(false);
  const [appealFilter, setAppealFilter] = useState<
    'Pending' | 'Resolved' | 'Dismissed'
  >('Pending');
  const [appealSearch, setAppealSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showAppealFilterFloating, setShowAppealFilterFloating] = useState(false);
  const [showAppealOnlyUnviewed, setShowAppealOnlyUnviewed] = useState(false);
  const [appealStartFromNumber, setAppealStartFromNumber] = useState<number | ''>('');
  const [appealFilterTime, setAppealFilterTime] = useState<
    'all' | '1week' | '3weeks' | '1month' | '2months' | '3months'
  >('all');
  const [appealCategories, setAppealCategories] = useState<{
    Chat: boolean;
    Lowongan: boolean;
    Other: boolean;
  }>({
    Chat: false,
    Lowongan: false,
    Other: false,
  });

  const filteredAppeals = appeals.filter((a) => {
    if (a.status !== appealFilter) return false;
    if (showAppealOnlyUnviewed && viewedAppealIds.has(a.id)) return false;

    // 1. Date Filter
    if (appealFilterTime === '1week') {
      if (getDaysDiff(a.tanggal) > 7) return false;
    } else if (appealFilterTime === '3weeks') {
      if (getDaysDiff(a.tanggal) > 21) return false;
    } else if (appealFilterTime === '1month') {
      if (getDaysDiff(a.tanggal) > 30) return false;
    } else if (appealFilterTime === '2months') {
      if (getDaysDiff(a.tanggal) > 60) return false;
    } else if (appealFilterTime === '3months') {
      if (getDaysDiff(a.tanggal) > 90) return false;
    }

    // 2. Search Query
    if (appealSearch.trim() !== '') {
      const q = appealSearch.toLowerCase();
      if (
        !a.namaPelapor?.toLowerCase().includes(q) &&
        !a.namaPelaku?.toLowerCase().includes(q) &&
        !a.emailPelapor?.toLowerCase().includes(q) &&
        !a.emailPelaku?.toLowerCase().includes(q) &&
        !a.id?.toLowerCase().includes(q) &&
        !a.alasan?.toLowerCase().includes(q)
      )
        return false;
    }

    // 3. Category Filter
    let cat = 'Other';
    const alasanLower = a.alasan?.toLowerCase() || '';
    if (a.idChat && a.idChat !== 'N/A') {
      cat = 'Chat';
    } else if (a.idLowongan && a.idLowongan !== 'N/A') {
      cat = 'Lowongan';
    } else if (alasanLower.includes('mod app') || alasanLower.includes('pembayaran') || alasanLower.includes('transaksi')) {
      cat = 'ModApp';
    } else if (
      alasanLower.includes('berubah sendiri') ||
      alasanLower.includes('tanpa lewat verify') ||
      alasanLower.includes('tanpa melalui proses verifikasi') ||
      alasanLower.includes('sandi') ||
      alasanLower.includes('telepon') ||
      alasanLower.includes('email') ||
      alasanLower.includes('password') ||
      alasanLower.includes('kredensial')
    ) {
      cat = 'SpamAccount';
    }

    if (cat === 'ModApp' || cat === 'SpamAccount') return false;

    const hasActiveCategoryFilter =
      appealCategories.Chat ||
      appealCategories.Lowongan ||
      appealCategories.Other;

    if (hasActiveCategoryFilter) {
      if (cat === 'Chat' && !appealCategories.Chat) return false;
      if (cat === 'Lowongan' && !appealCategories.Lowongan) return false;
      if (cat === 'Other' && !appealCategories.Other) return false;
    }

    return true;
  });

  const slicedAppeals =
    appealStartFromNumber !== '' && Number(appealStartFromNumber) > 0
      ? filteredAppeals.slice(Number(appealStartFromNumber) - 1)
      : filteredAppeals;

  const appealItemsPerPage = 30;
  const totalAppealPages = Math.max(
    1,
    Math.ceil(slicedAppeals.length / appealItemsPerPage),
  );
  const paginatedAppeals = slicedAppeals.slice(
    (currentPage - 1) * appealItemsPerPage,
    currentPage * appealItemsPerPage,
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
            <span>Kembali ke Appeal Human</span>
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
                        <span>Log Obrolan</span>
                      </h2>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {selectedCheckDetail.chatDetails.map(
                          (msg: any, i: number) => {
                            const isSelf = msg.sender !== 'Sistem' && msg.sender !== 'Budi Santoso'; // logic matching context
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
                  Aksi Banding
                </h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Email Pelaku
                    </span>
                    <span className="font-bold text-foreground">
                      {selectedCheckDetail.appealItem?.emailPelaku || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-black tracking-wide">
                      Nama Akun
                    </span>
                    <span className="font-bold text-foreground">
                      {selectedCheckDetail.appealItem?.namaPelaku || 'N/A'}
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
                    {selectedCheckDetail.appealItem && selectedCheckDetail.appealItem.status === 'Pending' && (
                      <>
                        <Button
                          onClick={() => {
                            handleResolveAppeal(
                              selectedCheckDetail.appealItem,
                              'Unblock',
                            );
                            setSelectedCheckDetail(null);
                          }}
                          className="w-full h-9 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all border-none"
                        >
                          Unblock / Terima Banding
                        </Button>
                        <Button
                          onClick={() => {
                            handleResolveAppeal(
                              selectedCheckDetail.appealItem,
                              'Reject',
                            );
                            setSelectedCheckDetail(null);
                          }}
                          className="w-full h-9 text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all border-none"
                        >
                          Reject / Tolak Banding
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="h-[960px] border border-border bg-card rounded-3xl overflow-hidden">
            <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full space-y-4">
              <div className="flex-none space-y-4">
                {/* Unified Title & Actions Row */}
                <div className="pb-4 border-b shrink-0 mb-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2 uppercase">
                      Appeal Human
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

                {/* Filter Tabs inside Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shrink-0 pb-1">
                  <div className="flex items-center gap-6 text-sm font-semibold">
                    {(['Pending', 'Resolved', 'Dismissed'] as const).map(
                      (status) => {
                        const counts = {
                          Pending: appeals.filter(
                            (a) => a.status === 'Pending',
                          ).length,
                          Resolved: appeals.filter(
                            (a) => a.status === 'Resolved',
                          ).length,
                          Dismissed: appeals.filter(
                            (a) => a.status === 'Dismissed',
                          ).length,
                        };
                        const isCurrent = appealFilter === status;
                        return (
                          <button
                            key={status}
                            onClick={() => setAppealFilter(status)}
                            className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                              isCurrent
                                ? 'text-foreground border-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {status} ({counts[status]})
                          </button>
                        );
                      },
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <div className="relative flex-1 sm:flex-none sm:w-44">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                      <Input
                        value={appealSearch}
                        onChange={(e) => {
                          setAppealSearch(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Cari nama, email, ID..."
                        className="h-8 pl-8 pr-3 text-xs rounded-xl bg-background border border-border/80 focus-visible:ring-1 focus-visible:ring-offset-0 w-full"
                      />
                    </div>
                    <div className="relative">
                      <Button
                        onClick={() =>
                          setShowAppealFilterFloating(
                            !showAppealFilterFloating,
                          )
                        }
                        className={`h-8 w-8 p-0 rounded-xl border flex items-center justify-center cursor-pointer shadow-none transition-all ${
                          showAppealFilterFloating ||
                          showAppealOnlyUnviewed ||
                          appealStartFromNumber !== '' ||
                          appealFilterTime !== 'all' ||
                          appealCategories.Chat ||
                          appealCategories.Lowongan ||
                          appealCategories.Other
                            ? 'bg-zinc-900 border-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-sm'
                            : 'bg-background border-border text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground'
                        }`}
                        title="Filter Appeal"
                      >
                        <Filter className="h-4 w-4" />
                      </Button>

                      {showAppealFilterFloating && (
                        <div className="absolute right-0 top-9 z-30 w-60 bg-card border border-border rounded-2xl shadow-xl p-4 space-y-3.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150 text-left">
                          <div className="font-bold text-foreground">
                            Filter Appeal
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
                              value={appealStartFromNumber}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAppealStartFromNumber(
                                  val === '' ? '' : Number(val),
                                );
                                setCurrentPage(1);
                              }}
                              className="h-7 text-xs"
                            />
                          </div>

                          {/* 2. Belum Lihat Detail Checkbox */}
                          <div
                            className="flex items-center gap-2 pt-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              id="appealUnviewedOnly"
                              checked={showAppealOnlyUnviewed}
                              onChange={(e) => {
                                setShowAppealOnlyUnviewed(
                                  e.target.checked,
                                );
                                setCurrentPage(1);
                              }}
                              className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                            />
                            <label
                              htmlFor="appealUnviewedOnly"
                              className="font-medium text-foreground cursor-pointer select-none"
                            >
                              Belum Lihat Detail
                            </label>
                          </div>

                          {/* 3. Jangka Waktu */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase">
                              Jangka Waktu
                            </label>
                            <select
                              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              value={appealFilterTime}
                              onChange={(e) => {
                                setAppealFilterTime(
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

                          {/* 4. Checkbox Kategori */}
                          <div className="space-y-2 pt-1 border-t border-border/50">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">
                              Kategori
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {(['Chat', 'Lowongan', 'Other'] as const).map((catKey) => {
                                const label = catKey === 'Chat' ? 'Chat ID' : catKey === 'Lowongan' ? 'Lowongan ID' : catKey;
                                return (
                                  <div
                                    key={catKey}
                                    className="flex items-center gap-1.5 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAppealCategories((prev) => {
                                        const next = { ...prev, [catKey]: !prev[catKey] };
                                        return next;
                                      });
                                      setCurrentPage(1);
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={appealCategories[catKey]}
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

                          {/* 5. Reset Button */}
                          {(showAppealOnlyUnviewed ||
                            appealStartFromNumber !== '' ||
                            appealFilterTime !== 'all' ||
                            appealCategories.Chat ||
                            appealCategories.Lowongan ||
                            appealCategories.Other) && (
                            <Button
                              onClick={() => {
                                setAppealStartFromNumber('');
                                setShowAppealOnlyUnviewed(false);
                                setAppealFilterTime('all');
                                setAppealCategories({
                                  Chat: false,
                                  Lowongan: false,
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
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col flex-1 min-h-0">
                <div className="flex-1 w-full space-y-4 overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-1">
                    {filteredAppeals.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl col-span-2">
                        <ClipboardSignature className="h-9 w-9 text-muted-foreground/30 mb-2" />
                        <p className="text-xs text-muted-foreground">
                          Tidak ada appeal dengan status ini
                        </p>
                      </div>
                    ) : (
                      paginatedAppeals.map((appeal, idx) => {
                        const startNum =
                          appealStartFromNumber !== ''
                            ? Number(appealStartFromNumber)
                            : 1;
                        const seqNum =
                          (currentPage - 1) * appealItemsPerPage +
                          idx +
                          startNum;
                        const statusColors: Record<string, string> =
                          theme === 'white'
                            ? {
                                Pending:
                                  'bg-amber-50 text-amber-600 border-amber-200',
                                Resolved:
                                  'bg-emerald-50 text-emerald-700 border-emerald-200',
                                Dismissed:
                                  'bg-slate-100 text-slate-500 border-slate-200',
                              }
                            : {
                                Pending:
                                  'bg-amber-500/10 text-amber-600 border-amber-500/20',
                                Resolved:
                                  'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                                Dismissed:
                                  'bg-slate-500/10 text-slate-400 border-slate-500/20',
                              };
                        const levelColors: Record<string, string> =
                          theme === 'white'
                            ? {
                                'Light Warning':
                                  'bg-yellow-50 text-yellow-600 border-yellow-200',
                                'Suspend 30 Days':
                                  'bg-orange-50 text-orange-600 border-orange-200',
                                'Permanent Ban':
                                  'bg-rose-50 text-rose-600 border-rose-200',
                              }
                            : {
                                'Light Warning':
                                  'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
                                'Suspend 30 Days':
                                  'bg-orange-500/10 text-orange-600 border-orange-500/20',
                                'Permanent Ban':
                                  'bg-rose-500/10 text-rose-600 border-rose-500/20',
                              };
                        return (
                          <div
                            key={appeal.id}
                            className={`p-3.5 rounded-2xl space-y-3 transition-all duration-200 border text-left ${
                              theme === 'white'
                                ? 'bg-white hover:bg-slate-50/60 border-slate-200/85 hover:border-slate-300 shadow-sm hover:shadow-md'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700/80 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[12px] font-extrabold shrink-0 ${
                                    theme === 'white'
                                      ? 'text-slate-500'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  {seqNum}.
                                </span>
                                <button
                                  onClick={() => handleCopyId(appeal.id)}
                                  className={`font-mono text-[12px] px-1.5 py-0.5 rounded font-bold border flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95 shrink-0 ${
                                    theme === 'white'
                                      ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                      : 'bg-slate-800 border-slate-700 text-foreground hover:bg-slate-700/80'
                                  }`}
                                  title="Salin ID Appeal"
                                >
                                  ID: {appeal.id}
                                </button>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-[12px] font-bold border rounded px-2 py-0.5 shrink-0 capitalize ${statusColors[appeal.status]}`}
                              >
                                {appeal.status}
                              </Badge>
                            </div>

                            <div className="flex flex-col gap-2 pt-1 border-t border-border/50 text-[12px] font-semibold text-muted-foreground">
                              {(() => {
                                let catLabel = 'Other';
                                let catColorClass = 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
                                const alasanLower = appeal.alasan?.toLowerCase() || '';
                                if (appeal.idChat && appeal.idChat !== 'N/A') {
                                  catLabel = 'Chat ID';
                                  catColorClass = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                                } else if (appeal.idLowongan && appeal.idLowongan !== 'N/A') {
                                  catLabel = 'Lowongan ID';
                                  catColorClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                                } else if (alasanLower.includes('mod app') || alasanLower.includes('pembayaran') || alasanLower.includes('transaksi')) {
                                  catLabel = 'Mod App';
                                  catColorClass = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
                                } else if (
                                  alasanLower.includes('berubah sendiri') ||
                                  alasanLower.includes('tanpa lewat verify') ||
                                  alasanLower.includes('tanpa melalui proses verifikasi') ||
                                  alasanLower.includes('sandi') ||
                                  alasanLower.includes('telepon') ||
                                  alasanLower.includes('email') ||
                                  alasanLower.includes('password') ||
                                  alasanLower.includes('kredensial')
                                ) {
                                  catLabel = 'Spam Account';
                                  catColorClass = 'bg-orange-500/10 text-orange-500 border-orange-500/20';
                                }
                                return (
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`font-bold tracking-wider uppercase text-[11px] ${theme === 'white' ? 'text-slate-400' : 'text-muted-foreground'}`}>
                                      Kategori:
                                    </span>
                                    <Badge variant="outline" className={`text-[10px] font-bold border rounded-full px-2 py-0.5 uppercase ${catColorClass}`}>
                                      {catLabel}
                                    </Badge>
                                  </div>
                                );
                              })()}
                              <div>
                                <span className="text-rose-500 font-medium block mb-1 mt-2">
                                  Pelaku: {appeal.namaPelaku} ({appeal.emailPelaku})
                                </span>
                                <span className="text-emerald-500 font-medium block mt-0.5">
                                  Pelapor: {appeal.namaPelapor} ({appeal.emailPelapor})
                                </span>
                              </div>
                            </div>

                            <div
                              className={`p-2 rounded-xl border-l-2 border-l-amber-500 ${
                                theme === 'white'
                                  ? 'bg-amber-50/60 border border-amber-100'
                                  : 'bg-slate-950 border border-slate-800/80'
                              }`}
                            >
                              <p className="text-[12px] uppercase font-black text-amber-500 tracking-wider mb-1">
                                Alasan Laporan
                              </p>
                              <p
                                className={`text-xs leading-relaxed ${
                                  theme === 'white'
                                    ? 'text-slate-700'
                                    : 'text-foreground'
                                }`}
                              >
                                {appeal.alasan}
                              </p>
                            </div>

                            {appeal.status === 'Pending' && (
                              <div className="flex items-center gap-2 pt-1">
                                {appeal.idChat !== 'N/A' && (
                                  <Button
                                    onClick={() =>
                                      handleViewAppealChatDetail({
                                        ...appeal,
                                        email: appeal.emailPelaku,
                                        name: appeal.namaPelaku,
                                        finalAiReason: appeal.alasan,
                                      })
                                    }
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-[12px] font-bold flex items-center gap-1.5"
                                  >
                                    <MessageSquare className="h-3 w-3" />
                                    <span>Lihat Chat</span>
                                  </Button>
                                )}
                                {appeal.idLowongan !== 'N/A' && (
                                  <Button
                                    onClick={() =>
                                      handleViewAppealJobDetail({
                                        ...appeal,
                                        email: appeal.emailPelaku,
                                        name: appeal.namaPelaku,
                                        finalAiReason: appeal.alasan,
                                      })
                                    }
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-[12px] font-bold flex items-center gap-1.5"
                                  >
                                    <Briefcase className="h-3 w-3" />
                                    <span>Lihat Lowongan</span>
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {totalAppealPages >= 1 && (
                  <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-border/40 text-xs flex-none">
                    <div className="flex items-center gap-1.5">
                      <Button variant="outline"
                        size="sm"
                        className="h-9 w-9 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                        onClick={() =>setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" /></Button>
                      <div className="flex items-center gap-1">
                        {(() => {
                          const renderedElements: React.ReactNode[] = [];
                          for (let i = 1; i <= totalAppealPages; i++) {
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
                                        color: 'hsl(var(--background))',
                                        borderColor:
                                          'hsl(var(--foreground))',
                                      }
                                    : { color: 'hsl(var(--foreground))' }
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
                            Math.min(prev + 1, totalAppealPages),
                          )
                        }
                        disabled={currentPage === totalAppealPages}
                      >
                        
                        <ChevronRight className="h-4 w-4" /></Button>
                    </div>
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
                  Dokumentasi Appeal
                </h3>
              </div>
              <button
                onClick={() => setShowDoc(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 text-left">
              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground uppercase text-[12px] tracking-wider mb-1 border-b border-border/80 pb-1">
                  PROSEDUR BANDING
                </h4>
                <p className="pl-1">
                  Pengguna yang ditangguhkan dapat mengajukan banding. Moderator memverifikasi bukti log chat atau kecurigaan lowongan sebelum mengambil tindakan Unblock atau membiarkan blokir permanen tetap berlaku.
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

export default AppealHumanPage;
