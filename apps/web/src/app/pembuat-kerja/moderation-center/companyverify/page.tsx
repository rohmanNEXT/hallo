'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModeration } from '../context';
import {
  LuX as X,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuEye as Eye,
  LuArrowLeft as ArrowLeft,
  LuMapPin as MapPin,
  LuBriefcase as Briefcase,
  LuFileText as FileText,
  LuBuilding2 as Building2,
  LuGlobe as Globe,
  LuLinkedin as Linkedin,
  LuInstagram as Instagram,
  LuTwitter as Twitter,
  LuFacebook as Facebook,
  LuYoutube as Youtube,
  LuUsers as Users,
  LuCircleAlert as AlertCircle,
  LuFilter as Filter,
  LuSparkles as Sparkles,
} from 'react-icons/lu';

const CompanyVerifyPage: React.FC = () => {
  const {
    toastMessage,
    showToast,
    mockCompanies,
    setMockCompanies,
    getDaysDiff,
    theme,
    aiModeration,
  } = useModeration();

  const [showDoc, setShowDoc] = useState(false);
  const [companyVerifyTab, setCompanyVerifyTab] = useState<
    'database' | 'review' | 'rejected'
  >('review');
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState<
    'all' | '1week' | '3weeks' | '1month' | '2months' | '3months'
  >('all');
  const [companyStartFromNumber, setCompanyStartFromNumber] = useState<
    number | ''
  >('');
  const [companyShowOnlyUnviewed, setCompanyShowOnlyUnviewed] = useState(false);
  const [showCompanyFilterDropdown, setShowCompanyFilterDropdown] =
    useState(false);
  const [companyCurrentPage, setCompanyCurrentPage] = useState(1);
  const [viewingCompanyProfile, setViewingCompanyProfile] =
    useState<any | null>(null);
  const [companyDetailSubTab, setCompanyDetailSubTab] = useState<
    'profile' | 'document'
  >('profile');
  const [showFullDescModal, setShowFullDescModal] = useState<{
    title: string;
    desc: string;
  } | null>(null);
  const [rejectModalCompanyId, setRejectModalCompanyId] = useState<
    string | null
  >(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredCompanies = mockCompanies.filter((comp) => {
    // 1. Tab Filter
    if (companyVerifyTab === 'database') {
      if (comp.status !== 'verified') return false;
    } else if (companyVerifyTab === 'review') {
      if (comp.status !== 'review') return false;
    } else if (companyVerifyTab === 'rejected') {
      if (comp.status !== 'rejected') return false;
      if (!comp.rejectedAt) return false;
      const days = getDaysDiff(comp.rejectedAt);
      if (days < 0 || days > 90) return false;
    }

    // 2. Date Filter
    if (companyFilter === '1week') {
      if (getDaysDiff(comp.createdAt) > 7) return false;
    } else if (companyFilter === '3weeks') {
      if (getDaysDiff(comp.createdAt) > 21) return false;
    } else if (companyFilter === '1month') {
      if (getDaysDiff(comp.createdAt) > 30) return false;
    } else if (companyFilter === '2months') {
      if (getDaysDiff(comp.createdAt) > 60) return false;
    } else if (companyFilter === '3months') {
      if (getDaysDiff(comp.createdAt) > 90) return false;
    }

    // 3. Unviewed Filter
    if (companyShowOnlyUnviewed && comp.viewed) return false;

    // 4. Search Query
    if (companySearchQuery) {
      const q = companySearchQuery.toLowerCase();
      if (
        !comp.name.toLowerCase().includes(q) &&
        !comp.email.toLowerCase().includes(q) &&
        !comp.industry.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    return true;
  });

  const slicedCompanies =
    companyStartFromNumber !== '' && Number(companyStartFromNumber) > 0
      ? filteredCompanies.slice(Number(companyStartFromNumber) - 1)
      : filteredCompanies;

  const companyItemsPerPage = 30;
  const totalCompanyPages = Math.max(
    1,
    Math.ceil(slicedCompanies.length / companyItemsPerPage),
  );
  const paginatedCompanies = slicedCompanies.slice(
    (companyCurrentPage - 1) * companyItemsPerPage,
    companyCurrentPage * companyItemsPerPage,
  );

  return (
    <div className="space-y-6">
      {viewingCompanyProfile ? (
        <Card className="h-[960px] border border-border bg-card rounded-3xl overflow-hidden animate-in fade-in duration-300">
          <CardContent className="p-5 md:p-6 flex flex-col h-full space-y-4">
            {/* Back Button Row */}
            <div className="pb-4 border-b shrink-0 flex items-center justify-between">
              <Button
                onClick={() => setViewingCompanyProfile(null)}
                variant="outline"
                size="sm"
                className="h-8 text-xs font-bold flex items-center gap-1.5 border border-border/60 hover:bg-accent hover:text-accent-foreground rounded-xl cursor-pointer bg-background"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali</span>
              </Button>
              <span className="text-[12px] font-bold text-muted-foreground uppercase">
                Profile Detail
              </span>
            </div>

            {/* Profile Detail Content Area */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {/* Header Card */}
              <div className="border border-border/80 bg-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-white border border-border/80 rounded-2xl flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                    <Building2 className="h-9 w-9 text-primary" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-base font-black text-foreground">
                      {viewingCompanyProfile.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {viewingCompanyProfile.email}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`font-bold text-[12px] ${
                          viewingCompanyProfile.status === 'verified'
                            ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
                            : viewingCompanyProfile.status === 'review'
                              ? 'text-amber-500 border-amber-500/30 bg-amber-500/5'
                              : 'text-rose-500 border-rose-500/30 bg-rose-500/5'
                        }`}
                      >
                        {viewingCompanyProfile.status === 'verified'
                          ? 'TERVERIFIKASI'
                          : viewingCompanyProfile.status === 'review'
                            ? 'UNDER REVIEW'
                            : 'DITOLAK'}
                      </Badge>
                      {viewingCompanyProfile.status !== 'verified' &&
                        viewingCompanyProfile.verifyType && (
                          <Badge
                            variant="outline"
                            className={`font-bold text-[12px] ${
                              viewingCompanyProfile.verifyType === 'old'
                                ? 'text-blue-500 border-blue-500/30 bg-blue-500/5'
                                : viewingCompanyProfile.verifyType === 'new'
                                  ? 'text-violet-500 border-violet-500/30 bg-violet-500/5'
                                  : 'text-orange-500 border-orange-500/30 bg-orange-500/5'
                            }`}
                          >
                            {viewingCompanyProfile.verifyType === 'old'
                              ? 'VERIFY LAMA'
                              : viewingCompanyProfile.verifyType === 'new'
                                ? 'VERIFY BARU'
                                : 'REQUEST UPDATE'}
                          </Badge>
                        )}
                      <span className="text-[12px] text-muted-foreground">
                        • ID: {viewingCompanyProfile.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social media icons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    {
                      icon: <Globe className="h-3.5 w-3.5" />,
                      label: 'Website',
                    },
                    {
                      icon: <Linkedin className="h-3.5 w-3.5" />,
                      label: 'Linkedin',
                    },
                    {
                      icon: <Instagram className="h-3.5 w-3.5" />,
                      label: 'Instagram',
                    },
                    {
                      icon: <Twitter className="h-3.5 w-3.5" />,
                      label: 'Twitter',
                    },
                    {
                      icon: <Facebook className="h-3.5 w-3.5" />,
                      label: 'Facebook',
                    },
                    {
                      icon: <Youtube className="h-3.5 w-3.5" />,
                      label: 'Youtube',
                    },
                  ].map((soc, idx) => (
                    <button
                      key={idx}
                      className="h-7 w-7 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer transition-all"
                      title={soc.label}
                    >
                      {soc.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Verification Assessment (otak ai) */}
              {aiModeration && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-500/20 dark:border-emerald-800/40 rounded-2xl p-5 text-left space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
                      <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        AI Moderation Scan Result (otak ai)
                      </span>
                    </div>
                    <Badge className="bg-emerald-500 text-white font-extrabold text-[12px] h-5">
                      {viewingCompanyProfile.aiScore || 85}% TRUST SCORE
                    </Badge>
                  </div>
                  <div className="text-xs space-y-2 leading-relaxed">
                    <p className="font-semibold text-foreground">
                      Analisis Dokumen NIB & SIUP:
                    </p>
                    <p className="text-muted-foreground text-[12px]">
                      {viewingCompanyProfile.aiScore && viewingCompanyProfile.aiScore < 50 ? (
                        <span className="text-rose-500 font-extrabold">⚠️ TERINDIKASI REKAYASA DIGITAL: Ditemukan metadata edit gambar Photoshop/GIMP pada berkas PDF. Struktur nomor NIB tidak sinkron dengan data BKPM.</span>
                      ) : (
                        <span className="text-emerald-600 font-extrabold">✓ DOKUMEN VALID: Tanda tangan digital cocok dengan sertifikat BKPM. Informasi pimpinan dan bidang usaha sinkron dengan database pemerintah.</span>
                      )}
                    </p>
                    {viewingCompanyProfile.aiScore && viewingCompanyProfile.aiScore < 50 && (
                      <div className="mt-3 bg-card border border-rose-500/20 rounded-xl p-3 space-y-2">
                        <p className="font-bold text-[12px] text-rose-500 uppercase tracking-wide">Template Alasan Penolakan AI:</p>
                        <p className="text-[12px] text-muted-foreground italic bg-muted/30 p-2.5 rounded-lg border border-border/40">
                          &quot;Berdasarkan pemindaian AI dari sistem moderasi, berkas dokumen legalitas (SIUP/NIB) yang diunggah terdeteksi memiliki rekayasa digital pada metadata file. Harap ajukan verifikasi ulang dengan melampirkan berkas scan dokumen asli tanpa suntingan.&quot;
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRejectReason("Berdasarkan pemindaian AI dari sistem moderasi, berkas dokumen legalitas (SIUP/NIB) yang diunggah terdeteksi memiliki rekayasa digital pada metadata file. Harap ajukan verifikasi ulang dengan melampirkan berkas scan dokumen asli tanpa suntingan.");
                            setRejectModalCompanyId(viewingCompanyProfile.id);
                            showToast("Template Alasan Penolakan AI disalin ke form Tolak!", "info");
                          }}
                          className="h-7 text-[12px] font-bold border-rose-500/20 text-rose-600 hover:bg-rose-500/10 cursor-pointer bg-transparent"
                        >
                          Gunakan Sebagai Alasan Penolakan
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reason Alerts */}
              {viewingCompanyProfile.status === 'rejected' &&
                viewingCompanyProfile.rejectionReason && (
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex gap-3 text-sm text-rose-600 text-left">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold mb-1">
                        Alasan Penolakan (Dari Sistem/Admin):
                      </p>
                      <p className="text-rose-600/90 line-clamp-3 leading-relaxed text-[13px]">
                        {viewingCompanyProfile.rejectionReason}
                      </p>
                      {viewingCompanyProfile.rejectionReason.length > 150 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowFullDescModal({
                              title: 'Alasan Penolakan (Sistem)',
                              desc: viewingCompanyProfile.rejectionReason!,
                            });
                          }}
                          className="text-rose-600 font-bold hover:underline mt-2 text-xs flex items-center gap-1"
                        >
                          Lihat Selengkapnya
                        </button>
                      )}
                    </div>
                  </div>
                )}
              {viewingCompanyProfile.verifyType === 'update' &&
                viewingCompanyProfile.updateRequestReason && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex gap-3 text-sm text-orange-600 text-left">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold mb-1">
                        Alasan Pengajuan Pembaruan (Dari Perusahaan):
                      </p>
                      <p className="text-orange-600/90 line-clamp-3 leading-relaxed text-[13px]">
                        {viewingCompanyProfile.updateRequestReason}
                      </p>
                      {viewingCompanyProfile.updateRequestReason.length > 150 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowFullDescModal({
                              title: 'Request Update Dokumen',
                              desc: viewingCompanyProfile.updateRequestReason!,
                            });
                          }}
                          className="text-orange-600 font-bold hover:underline mt-2 text-xs flex items-center gap-1"
                        >
                          Lihat Selengkapnya
                        </button>
                      )}
                    </div>
                  </div>
                )}

              {/* Sub-tab Navigation */}
              {viewingCompanyProfile.status === 'verified' && (
                <div className="flex border-b border-border/88 shrink-0">
                  <button
                    onClick={() => setCompanyDetailSubTab('profile')}
                    className={`pb-2.5 text-xs font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap px-4 ${
                      companyDetailSubTab === 'profile'
                        ? 'text-foreground border-primary font-extrabold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Detail Profil
                  </button>
                  <button
                    onClick={() => setCompanyDetailSubTab('document')}
                    className={`pb-2.5 text-xs font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap px-4 ${
                      companyDetailSubTab === 'document'
                        ? 'text-foreground border-primary font-extrabold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Dokumen Pengajuan
                  </button>
                </div>
              )}

              {viewingCompanyProfile.status === 'verified' &&
              companyDetailSubTab === 'profile' ? (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Tim Kami Card */}
                  <div className="border border-border/80 bg-card rounded-2xl p-5 shadow-xs text-left">
                    <span className="block text-[12px] font-black text-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">
                      Tim Kami
                    </span>
                    {viewingCompanyProfile.hasTeam !== false ? (
                      <div className="flex flex-wrap gap-4">
                        {[
                          {
                            name: 'Budi Santoso',
                            role: 'Chief Executive Officer (CEO)',
                            avatar:
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
                          },
                          {
                            name: 'Siti Rahma',
                            role: 'Head of HR Department',
                            avatar:
                              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
                          },
                        ].map((member, idx) => (
                          <div
                            key={idx}
                            className="border border-border/85 rounded-full px-4 py-2 flex items-center gap-3 bg-muted/10"
                          >
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="h-9 w-9 rounded-full object-cover border border-border"
                            />
                            <div className="text-left shrink-0">
                              <p className="text-xs font-black text-foreground leading-none">
                                {member.name}
                              </p>
                              <p className="text-[12px] text-muted-foreground mt-1 leading-none">
                                {member.role}
                              </p>
                            </div>
                            <button className="h-6 w-6 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary transition-all ml-2 cursor-pointer bg-card">
                              <Linkedin className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-border/80 rounded-2xl p-6 text-center text-xs font-bold text-muted-foreground bg-muted/5">
                        Kosong
                      </div>
                    )}
                  </div>

                  {/* Detail Company Card */}
                  <div className="border border-border/80 bg-card rounded-2xl p-5 shadow-xs space-y-4 text-left">
                    <span className="block text-[12px] font-black text-foreground uppercase tracking-wider border-b border-border/50 pb-2">
                      Detail Company
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <span className="block text-[12px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">
                            Industry
                          </span>
                          <p className="text-xs font-bold text-foreground">
                            {viewingCompanyProfile.industry}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <span className="block text-[12px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">
                            Location
                          </span>
                          <p className="text-xs font-bold text-foreground">
                            Jakarta Selatan, DKI Jakarta
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Users className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <span className="block text-[12px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">
                            Company Size
                          </span>
                          <p className="text-xs font-bold text-foreground">
                            1000+ Karyawan
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                      {viewingCompanyProfile.name} adalah perusahaan terkemuka yang berfokus pada inovasi dan pengembangan solusi berkualitas tinggi di bidang {viewingCompanyProfile.industry}.
                    </p>
                  </div>

                  {/* Kultur Perusahaan */}
                  <div className="border border-border/80 bg-card rounded-2xl p-5 shadow-xs text-left">
                    <span className="block text-[12px] font-black text-foreground uppercase tracking-wider mb-3 border-b border-border/50 pb-2">
                      Kultur Perusahaan
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Di {viewingCompanyProfile.name}, kami menerapkan budaya kerja Agile yang kolaboratif, transparan, dan mendukung penuh keseimbangan hidup karyawan (work-life balance) melalui sistem kerja hybrid.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Legal Documents Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border border-border/60 rounded-2xl p-5 bg-muted/20 text-left">
                    <div>
                      <span className="block text-[12px] font-bold text-foreground uppercase tracking-wider mb-1">
                        Nomor Induk Berusaha (NIB)
                      </span>
                      <p className="text-xs text-muted-foreground font-mono">
                        912000{viewingCompanyProfile.id.replace(/\D/g, '') || '1234567'}
                      </p>
                    </div>
                    <div>
                      <span className="block text-[12px] font-bold text-foreground uppercase tracking-wider mb-1">
                        Nomor SIUP
                      </span>
                      <p className="text-xs text-muted-foreground font-mono">
                        503/00{viewingCompanyProfile.id.replace(/\D/g, '') || '12'}/SIUP/2025
                      </p>
                    </div>
                    <div>
                      <span className="block text-[12px] font-bold text-foreground uppercase tracking-wider mb-1">
                        NPWP Perusahaan
                      </span>
                      <p className="text-xs text-muted-foreground font-mono">
                        01.234.567.8-012.000
                      </p>
                    </div>
                    <div>
                      <span className="block text-[12px] font-bold text-foreground uppercase tracking-wider mb-1">
                        Nama Penanggung Jawab (HRD)
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Budi Santoso
                      </p>
                    </div>
                  </div>

                  {/* Document File Preview */}
                  <div className="space-y-3 text-left">
                    <span className="block text-[12px] font-bold text-foreground uppercase tracking-wider">
                      Berkas Dokumen Pengajuan (Scan Asli)
                    </span>
                    <div className="border border-border/80 rounded-2xl p-4 bg-muted/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-10 bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center rounded-lg font-black text-sm shadow-xs shrink-0">
                          PDF
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            NIB_SIUP_{viewingCompanyProfile.name.replace(/\s+/g, '_')}.pdf
                          </p>
                          <p className="text-[12px] text-muted-foreground">
                            Size: 2.4 MB • Uploaded: {viewingCompanyProfile.joinedAt}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-bold border border-border/80 rounded-xl hover:bg-muted bg-background shrink-0 cursor-pointer"
                      >
                        Download Dokumen
                      </Button>
                    </div>
                    
                    {/* Mock Document Preview */}
                    <div className="w-full h-[400px] rounded-2xl border border-border/80 overflow-hidden bg-white mt-3 relative shadow-inner">
                      <div className="p-8 text-black text-left font-serif space-y-4 text-xs h-full overflow-y-auto bg-zinc-50/50">
                        <div className="text-center border-b-2 border-black pb-4">
                          <h2 className="font-extrabold text-sm uppercase tracking-wide">Pemerintah Republik Indonesia</h2>
                          <h3 className="font-bold text-xs uppercase text-zinc-700">Lembaga Pengelola dan Penyelenggara OSS</h3>
                          <p className="text-[12px] font-sans text-zinc-500 mt-1">NIB (Nomor Induk Berusaha): 01234567891011</p>
                        </div>
                        <div className="space-y-3 pt-2">
                          <p className="font-bold text-center underline uppercase tracking-tight">IZIN USAHA DI BIDANG PERDAGANGAN (SIUP)</p>
                          <p className="text-[12px] font-sans mt-3 text-zinc-800">Berdasarkan Ketentuan Undang-Undang Republik Indonesia, dengan ini menerangkan bahwa:</p>
                          <table className="w-full text-[12px] font-sans mt-2 border-collapse">
                            <tbody>
                              <tr className="border-b border-zinc-200/50 py-1.5">
                                <td className="font-bold w-36 py-1.5 text-zinc-700">Nama Perusahaan</td>
                                <td className="py-1.5">: {viewingCompanyProfile.name}</td>
                              </tr>
                              <tr className="border-b border-zinc-200/50 py-1.5">
                                <td className="font-bold py-1.5 text-zinc-700">Alamat Kantor</td>
                                <td className="py-1.5">: Jl. Jenderal Sudirman No. 12, Jakarta Selatan, DKI Jakarta</td>
                              </tr>
                              <tr className="border-b border-zinc-200/50 py-1.5">
                                <td className="font-bold py-1.5 text-zinc-700">Nama Pimpinan</td>
                                <td className="py-1.5">: Budi Santoso</td>
                              </tr>
                              <tr className="border-b border-zinc-200/50 py-1.5">
                                <td className="font-bold py-1.5 text-zinc-700">Nomor Telepon</td>
                                <td className="py-1.5">: +62 21 1234 5678</td>
                              </tr>
                              <tr className="border-b border-zinc-200/50 py-1.5">
                                <td className="font-bold py-1.5 text-zinc-700">Bidang Usaha</td>
                                <td className="py-1.5">: {viewingCompanyProfile.industry}</td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="text-[12px] font-sans mt-4 text-zinc-700 leading-relaxed">
                            Dokumen ini diterbitkan secara elektronik dan sah sebagai izin operasional resmi serta bukti legalitas perusahaan di wilayah hukum Negara Kesatuan Republik Indonesia.
                          </p>
                        </div>
                        <div className="pt-8 flex justify-between items-center text-[12px] font-sans text-zinc-500">
                          <div>
                            <p>Dicetak Pada: 2026-07-02</p>
                            <p className="text-emerald-600 font-extrabold mt-1">✓ SECURE & VERIFIED BY OSS SYSTEM</p>
                          </div>
                          <div className="text-center">
                            <p>Kepala Badan Koordinasi Penanaman BKPM</p>
                            <div className="h-10 w-24 mx-auto my-2 border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 bg-zinc-50 font-sans text-[7px] rounded-lg">
                              DIGITAL SIGNATURE
                            </div>
                            <p className="font-extrabold text-zinc-800">Bahlil Lahadalia</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            {viewingCompanyProfile.status === 'review' && (
              <div className="flex gap-3 pt-4 border-t border-border shrink-0">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl h-10 text-xs font-bold border-rose-500/30 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  onClick={() => {
                    setRejectModalCompanyId(viewingCompanyProfile.id);
                  }}
                >
                  Tolak Pendaftaran
                </Button>
                <Button
                  className="flex-1 rounded-xl h-10 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                  onClick={() => {
                    setMockCompanies((prev) =>
                      prev.map((c) =>
                        c.id === viewingCompanyProfile.id
                          ? { ...c, status: 'verified' }
                          : c,
                      ),
                    );
                    setViewingCompanyProfile(
                      viewingCompanyProfile ? { ...viewingCompanyProfile, status: 'verified' } : null
                    );
                    showToast('Perusahaan diverifikasi', 'success');
                  }}
                >
                  Verifikasi Perusahaan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="h-[960px] border border-border bg-card rounded-3xl overflow-hidden">
          <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full space-y-4">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Unified Title & Actions Row */}
              <div className="pb-4 border-b shrink-0 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2 uppercase">
                    NIB Verification
                  </span>
                </div>
                <Button
                  onClick={() => setShowDoc(true)}
                  size="sm"
                  variant="outline"
                  className="h-7 text-[12px] font-bold flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 border-zinc-900 cursor-pointer dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 dark:border-zinc-100 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Documentation</span>
                </Button>
              </div>

              {/* Tab Navigation row inside Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shrink-0 pb-1">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold whitespace-nowrap">
                  <button
                    onClick={() => {
                      setCompanyVerifyTab('review');
                      setCompanySearchQuery('');
                      setCompanyFilter('all');
                      setCompanyCurrentPage(1);
                    }}
                    className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                      companyVerifyTab === 'review'
                        ? 'text-foreground border-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Under Review (
                    {mockCompanies.filter((c) => c.status === 'review').length}
                    )
                  </button>
                  <button
                    onClick={() => {
                      setCompanyVerifyTab('rejected');
                      setCompanySearchQuery('');
                      setCompanyFilter('all');
                      setCompanyCurrentPage(1);
                    }}
                    className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                      companyVerifyTab === 'rejected'
                        ? 'text-foreground border-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Ditolak (
                    {
                      mockCompanies.filter(
                        (c) =>
                          c.status === 'rejected' &&
                          c.rejectedAt &&
                          getDaysDiff(c.rejectedAt) <= 90,
                      ).length
                    }
                    )
                  </button>
                  <button
                    onClick={() => {
                      setCompanyVerifyTab('database');
                      setCompanySearchQuery('');
                      setCompanyFilter('all');
                      setCompanyCurrentPage(1);
                    }}
                    className={`pb-2.5 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                      companyVerifyTab === 'database'
                        ? 'text-foreground border-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Company Database
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <div className="w-48 shrink-0">
                    <Input
                      placeholder="Cari perusahaan..."
                      value={companySearchQuery}
                      onChange={(e) => {
                        setCompanySearchQuery(e.target.value);
                        setCompanyCurrentPage(1);
                      }}
                      className="h-8 text-xs rounded-xl bg-background border border-border/80 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary text-foreground"
                    />
                  </div>

                  <div className="relative">
                    <Button
                      onClick={() =>
                        setShowCompanyFilterDropdown(!showCompanyFilterDropdown)
                      }
                      className={`h-9 w-9 p-0 rounded-lg border flex items-center justify-center cursor-pointer shadow-none transition-all ${
                        showCompanyFilterDropdown || companyFilter !== 'all'
                          ? 'bg-zinc-900 border-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-sm'
                          : 'bg-background border-border text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground'
                      }`}
                      title="Filter Perusahaan"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>

                    {showCompanyFilterDropdown && (
                      <div className="absolute right-0 top-10 z-30 w-56 bg-card border border-border rounded-xl shadow-lg p-3 space-y-3 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="font-bold text-foreground">
                          Filter Perusahaan
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[12px] font-bold text-muted-foreground uppercase">
                            Mulai Nomor Dari
                          </label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Contoh: 5"
                            value={companyStartFromNumber}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCompanyStartFromNumber(
                                val === '' ? '' : Number(val),
                              );
                              setCompanyCurrentPage(1);
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
                            id="companyUnviewedOnly"
                            checked={companyShowOnlyUnviewed}
                            onChange={(e) => {
                              setCompanyShowOnlyUnviewed(e.target.checked);
                              setCompanyCurrentPage(1);
                            }}
                            className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                          />
                          <label
                            htmlFor="companyUnviewedOnly"
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
                            value={companyFilter}
                            onChange={(e) => {
                              setCompanyFilter(e.target.value as any);
                              setCompanyCurrentPage(1);
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

                        {(companyShowOnlyUnviewed ||
                          companyStartFromNumber !== '' ||
                          companyFilter !== 'all') && (
                          <Button
                            onClick={() => {
                              setCompanyStartFromNumber('');
                              setCompanyShowOnlyUnviewed(false);
                              setCompanyFilter('all');
                              setCompanyCurrentPage(1);
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

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedCompanies.map((comp, idx) => {
                  const absoluteIndex =
                    (companyCurrentPage - 1) * companyItemsPerPage + idx + 1;
                  return (
                    <Card
                      key={comp.id}
                      className="border border-border shadow-sm rounded-2xl overflow-hidden bg-card text-card-foreground hover:border-border/80 transition-all flex flex-col h-full text-left"
                    >
                      <CardContent className="p-5 flex flex-col flex-1">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-extrabold text-sm mb-0.5 truncate pr-2">
                              {absoluteIndex}. {comp.name}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate pr-2">
                              {comp.email}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingCompanyProfile(comp);
                              setCompanyDetailSubTab(
                                comp.status === 'verified' ? 'profile' : 'document',
                              );
                            }}
                            className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-800/40 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all cursor-pointer border border-zinc-300 dark:border-zinc-700/80 shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                            title="Profile Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <Badge
                            variant="outline"
                            className={`font-bold text-[12px] h-7 flex items-center justify-center px-2.5 ${
                              comp.status === 'verified'
                                ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
                                : comp.status === 'review'
                                  ? 'text-amber-500 border-amber-500/30 bg-amber-500/5'
                                  : 'text-rose-500 border-rose-500/30 bg-rose-500/5'
                            }`}
                          >
                            {comp.status === 'verified'
                              ? 'TERVERIFIKASI'
                              : comp.status === 'review'
                                ? 'UNDER REVIEW'
                                : 'DITOLAK'}
                          </Badge>
                          {comp.status !== 'verified' && comp.verifyType && (
                            <Badge
                              variant="outline"
                              className={`font-bold text-[12px] h-7 flex items-center justify-center px-2.5 ${
                                comp.verifyType === 'old'
                                  ? 'text-blue-500 border-blue-500/30 bg-blue-500/5'
                                  : comp.verifyType === 'new'
                                    ? 'text-violet-500 border-violet-500/30 bg-violet-500/5'
                                    : 'text-orange-500 border-orange-500/30 bg-orange-500/5'
                              }`}
                            >
                              {comp.verifyType === 'old'
                                ? 'VERIFY LAMA'
                                : comp.verifyType === 'new'
                                  ? 'VERIFY BARU'
                                  : 'REQUEST UPDATE'}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-[12px] font-semibold text-muted-foreground bg-muted/40 p-2.5 rounded-lg mb-4">
                          <div>
                            <span className="block text-foreground mb-0.5">Industry</span>
                            {comp.industry}
                          </div>
                          <div className="h-6 w-px bg-border/60"></div>
                          <div>
                            <span className="block text-foreground mb-0.5">Joined</span>
                            {comp.joinedAt}
                          </div>
                        </div>

                        {comp.updateRequestReason ? (
                          <div className="text-[12px] bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 p-2.5 rounded-xl mb-4 text-left leading-relaxed h-[64px]">
                            <span className="font-bold block mb-0.5">Alasan Pengajuan:</span>
                            <span className="line-clamp-2">{comp.updateRequestReason}</span>
                          </div>
                        ) : (comp.rejectionReason && comp.status === 'rejected') ? (
                          <div className="text-[12px] bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-2.5 rounded-xl mb-4 text-left leading-relaxed h-[64px]">
                            <span className="font-bold block mb-0.5">Alasan Penolakan:</span>
                            <span className="line-clamp-2">{comp.rejectionReason}</span>
                          </div>
                        ) : (
                          <div className="text-[12px] bg-muted/20 border border-dashed border-border/80 text-muted-foreground p-2.5 rounded-xl mb-4 text-left leading-relaxed h-[64px] flex items-center justify-center font-medium italic">
                            Tidak ada alasan yang dilampirkan
                          </div>
                        )}

                        {comp.status === 'review' && (
                          <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                            <Button
                              variant="outline"
                              className="flex-1 rounded-xl h-8 text-[12px] font-bold border-rose-500/30 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRejectModalCompanyId(comp.id);
                              }}
                            >
                              Tolak
                            </Button>
                            <Button
                              className="flex-1 rounded-xl h-8 text-[12px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                              onClick={() => {
                                setMockCompanies((prev) =>
                                  prev.map((c) =>
                                    c.id === comp.id ? { ...c, status: 'verified' } : c,
                                  ),
                                );
                                showToast('Perusahaan diverifikasi', 'success');
                              }}
                            >
                              Verifikasi
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {paginatedCompanies.length === 0 && (
                  <div className="col-span-full py-16 text-center border border-dashed border-border/80 bg-muted/20 rounded-2xl">
                    <p className="text-sm font-bold text-muted-foreground">
                      Tidak ada data perusahaan.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {totalCompanyPages >= 1 && (
              <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-border/40 text-xs flex-none">
                <div className="flex items-center gap-1.5">
                  <Button variant="outline"
                    size="sm"
                    className="h-9 w-9 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                    onClick={() =>setCompanyCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={companyCurrentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" /></Button>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const renderedElements: React.ReactNode[] = [];
                      for (let i = 1; i <= totalCompanyPages; i++) {
                        const isCurrent = companyCurrentPage === i;
                        renderedElements.push(
                          <Button
                            key={i}
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
                            onClick={() => setCompanyCurrentPage(i)}
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
                    onClick={() =>setCompanyCurrentPage((prev) =>
                        Math.min(prev + 1, totalCompanyPages),
                      )
                    }
                    disabled={companyCurrentPage === totalCompanyPages}
                  >
                    
                    <ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Description Detail Modal */}
      {showFullDescModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-b border-border">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                {showFullDescModal.title}
              </h3>
              <button
                onClick={() => setShowFullDescModal(null)}
                className="text-muted-foreground hover:text-foreground border-none bg-transparent cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 max-h-[50vh] overflow-y-auto text-sm leading-relaxed text-foreground text-left">
              {showFullDescModal.desc}
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-t border-border flex justify-end">
              <Button
                onClick={() => setShowFullDescModal(null)}
                className="h-9 text-xs font-bold px-5 rounded-xl"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Window Documentation Modal */}
      {showDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  Kebijakan Verifikasi Perusahaan
                </h3>
              </div>
              <button
                onClick={() => setShowDoc(false)}
                className="text-muted-foreground hover:text-foreground border-none bg-transparent cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 max-h-[65vh] overflow-y-auto text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 text-left">
              Riwayat perusahaan yang ditolak hanya disimpan dan ditampilkan selama 3 bulan.
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

      {/* Reject Company Modal */}
      {rejectModalCompanyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden relative">
            <button
              onClick={() => {
                setRejectModalCompanyId(null);
                setRejectReason('');
              }}
              className="absolute top-4 right-4 h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6 border-b border-border/50 bg-rose-500/10 text-left">
              <h2 className="text-xl font-extrabold flex items-center gap-2 text-rose-600">
                <AlertCircle className="h-5 w-5" />
                Tolak Pendaftaran Perusahaan
              </h2>
            </div>
            <div className="p-6 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">
                  Template Alasan Penolakan
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Dari hasil penelusuran tim verifikasi telah melakukan pengecekan menyeluruh dari berkas yang dilampirkan, kami mendapati adanya indikasi ketidaksesuaian atau rekayasa digital pada file dokumen legalitas (SIUP/NIB) yang diunggah. Demi menjaga keamanan komunitas, mohon lakukan pengunggahan ulang untuk dokumen legalitas yang asli, resmi dari pemerintah (BKPM/OSS), serta bersih tanpa editan maupun filter gambar apapun. Terima kasih banyak atas pengertian dan kerjasamanya.',
                    'Mohon maaf, pengajuan verifikasi perusahaan saat ini belum dapat disetujui. Berdasarkan hasil pemeriksaan data akta pendirian, nama Direktur Utama yang didaftarkan pada akun JobStreet tidak sinkron dengan nama yang tertulis di Akta Pendirian Perusahaan maupun Surat Keputusan (SK) Menkumham terakhir. Silakan periksa kembali kecocokan penulisan nama lengkap dan ajukan ulang dengan melampirkan akta pendirian yang paling mutakhir. Terima kasih banyak atas perhatiannya.',
                  ].map((tpl, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted font-normal text-[12px]"
                      onClick={() => setRejectReason(tpl)}
                    >
                      {tpl.substring(0, 30)}...
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">
                  Pesan Penolakan (Custom)
                </label>
                <textarea
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm min-h-[120px] focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all resize-none text-foreground"
                  placeholder="Tulis alasan penolakan secara detail..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="p-4 flex items-center justify-end gap-3 bg-muted/10 border-t border-border/50">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectModalCompanyId(null);
                  setRejectReason('');
                }}
                className="h-10 text-xs font-bold rounded-xl px-6"
              >
                Batal
              </Button>
              <Button
                className="h-10 text-xs font-bold rounded-xl px-6 bg-rose-500 hover:bg-rose-600 text-white"
                onClick={() => {
                  if (!rejectReason.trim()) {
                    showToast('Harap masukkan alasan penolakan!', 'error');
                    return;
                  }

                  setMockCompanies((prev) =>
                    prev.map((c) =>
                      c.id === rejectModalCompanyId
                        ? {
                            ...c,
                            status: 'rejected',
                            rejectedAt: '2026-07-01',
                            rejectionReason: rejectReason,
                          }
                        : c,
                    ),
                  );
                  if (viewingCompanyProfile?.id === rejectModalCompanyId) {
                    setViewingCompanyProfile(
                      viewingCompanyProfile
                        ? {
                            ...viewingCompanyProfile,
                            status: 'rejected',
                            rejectedAt: '2026-07-01',
                            rejectionReason: rejectReason,
                          }
                        : null
                    );
                  }

                  showToast('Perusahaan berhasil ditolak!', 'success');
                  setRejectModalCompanyId(null);
                  setRejectReason('');
                }}
              >
                Kirim Penolakan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyVerifyPage;
