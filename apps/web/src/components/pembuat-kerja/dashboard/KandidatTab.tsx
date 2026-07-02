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
  LuCircleCheck as CheckCircle,
  LuArrowRight as ArrowRight,
} from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import MultiSelectJob from '@/components/ui/multi-select-job';
import Image from 'next/image';

export default function KandidatTab() {
  const {
    user,
    employerJobs,
    employerApplications,
    updateApplicationStatus,
    sendCandidateMessage,
  } = useAppStore();

  const router = useRouter();

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
  const itemsPerPage = 20;

  // Selected app for detail floating window
  const [selectedDetailApp, setSelectedDetailApp] = useState<any | null>(null);

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

  // Additional Popover Checkboxes
  const [candShowFav, setCandShowFav] = useState(false);
  const [candShowUnchecked, setCandShowUnchecked] = useState(false);
  const [candShowWithPhoto, setCandShowWithPhoto] = useState(false);
  const [candShowByExp, setCandShowByExp] = useState(false);
  const [candShowNoExp, setCandShowNoExp] = useState(false);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !selectedApplicationId) return;

    sendCandidateMessage(selectedApplicationId, chatMessageText.trim());
    setChatMessageText('');
  };

  const enrichedApplications = employerApplications
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

    if (cMinSalary && (app.talent?.expectedSalary || 0) < Number(cMinSalary))
      return false;
    if (cMaxSalary && (app.talent?.expectedSalary || 0) > Number(cMaxSalary))
      return false;

    if (cGender !== 'Semua' && app.talent?.gender !== cGender) return false;

    if (
      cLocation.trim() &&
      !app.talent?.location.toLowerCase().includes(cLocation.toLowerCase())
    )
      return false;

    if (
      cSkill.trim() &&
      !app.talent?.skills.some((s: string) =>
        s.toLowerCase().includes(cSkill.toLowerCase()),
      )
    )
      return false;

    if (cEducation !== 'Semua' && app.talent?.education !== cEducation)
      return false;

    if (cMinAge && (app.talent?.age || 0) < Number(cMinAge)) return false;
    if (cMaxAge && (app.talent?.age || 0) > Number(cMaxAge)) return false;

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
        'Kontrak': 'Contract',
        'Magang': 'Internship',
        'Freelance': 'Freelance',
      };
      const mappedInterests = selectedWorkTypes.map((t) => interestMapping[t] || t);
      const matchWorkType = mappedInterests.some((t) => {
        return app.talent?.title.toLowerCase().includes(t.toLowerCase());
      });
      if (!matchWorkType) return false;
    }

    if (selectedWorkOptions.length > 0) {
      const optMapping: Record<string, string> = {
        'Remote': 'Remote',
        'Hybrid': 'Hybrid',
        'Onsite': 'Onsite',
      };
      const mappedOpts = selectedWorkOptions.map((o) => optMapping[o] || o);
      const opt = app.talent?.willingToRelocate
        ? 'Onsite'
        : parseInt(app.talent?.id.replace(/\D/g, '') || '0', 10) % 2 === 0
          ? 'Remote'
          : 'Hybrid';
      if (!mappedOpts.includes(opt)) return false;
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
  const paginatedApplications = sortedApplications.slice(startIndex, startIndex + itemsPerPage);

  const activeApplication = enrichedApplications.find(
    (app) => app.id === selectedApplicationId,
  );

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-300">
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
                            setCSkill('');
                            setCLocation('');
                            setCMinAge('');
                            setCMaxAge('');
                            setCandShowFav(false);
                            setCandShowUnchecked(false);
                            setCandShowWithPhoto(false);
                            setCandShowByExp(false);
                            setCandShowNoExp(false);
                            setReadyNow(false);
                            setHasSim(false);
                            setHasSkck(false);
                            setHasCv(false);
                            setHasMotor(false);
                            setHasLaptop(false);
                            setHasCertificate(false);
                            setWillingToRelocate(false);
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
                      <div className="space-y-2 pb-3 border-b border-border/60">
                        <Checkbox
                          checked={candShowFav}
                          onCheckedChange={setCandShowFav}
                          label="Tampilkan Favorit"
                        />
                        <Checkbox
                          checked={candShowUnchecked}
                          onCheckedChange={setCandShowUnchecked}
                          label="Tampilkan yang belum dicek"
                        />
                        <Checkbox
                          checked={candShowWithPhoto}
                          onCheckedChange={setCandShowWithPhoto}
                          label="Tampilkan hanya yang memiliki foto"
                        />
                        <Checkbox
                          checked={candShowByExp}
                          onCheckedChange={setCandShowByExp}
                          label="Tampilkan sesuai pengalaman"
                        />
                        <Checkbox
                          checked={candShowNoExp}
                          onCheckedChange={setCandShowNoExp}
                          label="Tampilkan yang tidak memiliki pengalaman"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'gaji'
                                  ? null
                                  : 'gaji',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Gaji Kandidat</span>
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
                                onChange={(e) =>
                                  setCMinSalary(e.target.value)
                                }
                                className="h-8 text-xs bg-background"
                              />
                              <Input
                                type="number"
                                placeholder="Max"
                                value={cMaxSalary}
                                onChange={(e) =>
                                  setCMaxSalary(e.target.value)
                                }
                                className="h-8 text-xs bg-background"
                              />
                            </div>
                          )}
                        </div>

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
                              {[
                                'Semua',
                                'Laki-laki',
                                'Perempuan',
                              ].map((g) => (
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

                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'lokasi'
                                  ? null
                                  : 'lokasi',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Lokasi</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'lokasi' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'lokasi' && (
                            <div className="pt-2">
                              <Input
                                placeholder="Cari kota / kecamatan..."
                                value={cLocation}
                                onChange={(e) =>
                                  setCLocation(e.target.value)
                                }
                                className="h-8 text-xs bg-background"
                              />
                            </div>
                          )}
                        </div>

                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'skills'
                                  ? null
                                  : 'skills',
                              )
                            }
                            className="w-full flex items-center justify-between text-xs font-bold text-foreground py-1 cursor-pointer"
                          >
                            <span>Skills</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${popoverActiveGroup === 'skills' ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {popoverActiveGroup === 'skills' && (
                            <div className="pt-2">
                              <Input
                                placeholder="e.g. React, Excel"
                                value={cSkill}
                                onChange={(e) =>
                                  setCSkill(e.target.value)
                                }
                                className="h-8 text-xs bg-background"
                              />
                            </div>
                          )}
                        </div>

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
                                'Semua',
                                'SMA/SMK',
                                'D3',
                                'S1',
                                'S2',
                              ].map((edu) => (
                                <button
                                  key={edu}
                                  type="button"
                                  onClick={() => setCEducation(edu)}
                                  className={`px-2.5 py-1 text-[10px] rounded-lg border transition-all cursor-pointer font-bold ${
                                    cEducation === edu
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

                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'usia'
                                  ? null
                                  : 'usia',
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
                                onChange={(e) =>
                                  setCMinAge(e.target.value)
                                }
                                className="h-8 text-xs bg-background"
                              />
                              <Input
                                type="number"
                                placeholder="Max Usia"
                                value={cMaxAge}
                                onChange={(e) =>
                                  setCMaxAge(e.target.value)
                                }
                                className="h-8 text-xs bg-background"
                              />
                            </div>
                          )}
                        </div>

                        <div className="border-b border-border/40 pb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverActiveGroup(
                                popoverActiveGroup === 'kuis'
                                  ? null
                                  : 'kuis',
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
                    ? 'Score Profil Tertinggi'
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
                        value: 'Berpengalaman',
                        label: 'Berpengalaman',
                      },
                      {
                        value: 'Score',
                        label: 'Score Profil Tertinggi',
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
          {(['Melamar', 'Terseleksi', 'Diterima', 'Ditutup'] as const).map((tab) => {
            const count = enrichedApplications.filter((app) => app.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setCandidateStatusTab(tab)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer outline-none ${
                  candidateStatusTab === tab
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {paginatedApplications.map((app) => (
                <Card
                  key={app.id}
                  className={`border transition-all hover:border-primary/40 rounded-xl overflow-hidden shadow-sm bg-card text-card-foreground hover:shadow-md duration-200 h-[115px] flex flex-col justify-center ${
                    selectedApplicationId === app.id
                      ? 'border-primary ring-1 ring-primary/20'
                      : 'border-border'
                  }`}
                  onClick={() => setSelectedApplicationId(app.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={app.talent?.avatar}
                        alt={app.talent?.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-100 shrink-0"
                       width={100} height={100} unoptimized />
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{app.talent?.name}</span>
                          <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100/80 border-none font-bold text-[8px] px-1 py-0 rounded-full">
                            Score: {app.talent?.profileScore}%
                          </Badge>
                        </h4>
                        <p className="text-[10.5px] font-bold text-primary mt-0.5">
                          {app.talent?.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          Lowongan:{' '}
                          <strong className="text-slate-600 dark:text-slate-300 uppercase truncate max-w-[120px] inline-block align-bottom">
                            {app.job?.title || 'Job Post'}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                          Rp {app.talent?.expectedSalary.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Pengalaman: {app.talent?.experienceYears} Thn
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDetailApp(app);
                        }}
                        className="p-1.5 rounded-lg hover:bg-muted text-primary hover:text-primary-foreground transition-all cursor-pointer border border-border flex items-center justify-center bg-transparent"
                        title="Lihat Detail Floating"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6 pt-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
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
                        <span key={key} className="px-1.5 text-muted-foreground font-bold text-sm select-none">
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
                    className="h-9 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Floating Window Details Modal */}
        {selectedDetailApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div
              className="absolute inset-0"
              onClick={() => setSelectedDetailApp(null)}
            />
            <Card className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col z-10 animate-in zoom-in-95 duration-150 text-foreground overflow-hidden">
              <button
                onClick={() => setSelectedDetailApp(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-all cursor-pointer border-none bg-transparent"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedDetailApp.talent?.avatar}
                    alt={selectedDetailApp.talent?.name}
                    className="h-14 w-14 rounded-full object-cover border border-border shadow-xs"
                   width={100} height={100} unoptimized />
                  <div>
                    <h3 className="text-base font-extrabold text-foreground leading-snug">
                      {selectedDetailApp.talent?.name}
                    </h3>
                    <p className="text-xs font-bold text-primary mt-0.5">
                      {selectedDetailApp.talent?.title}
                    </p>
                  </div>
                </div>

                <hr className="border-border/60" />

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Pendidikan</span>
                    <span className="font-extrabold text-foreground">{selectedDetailApp.talent?.education}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Lokasi</span>
                    <span className="font-extrabold text-foreground">{selectedDetailApp.talent?.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Pengalaman</span>
                    <span className="font-extrabold text-foreground">{selectedDetailApp.talent?.experienceYears} Thn</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Ekspektasi Gaji</span>
                    <span className="font-extrabold text-foreground">Rp {selectedDetailApp.talent?.expectedSalary?.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Status</span>
                    <span className="font-extrabold text-foreground">{selectedDetailApp.status}</span>
                  </div>
                </div>

                <hr className="border-border/60" />

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      updateApplicationStatus(selectedDetailApp.id, 'Terseleksi');
                      setSelectedDetailApp({ ...selectedDetailApp, status: 'Terseleksi' });
                      alert('Status berhasil diubah menjadi Interview (Terseleksi)!');
                    }}
                    className="py-2.5 px-2 text-[10.5px] font-bold rounded-xl border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Interview</span>
                  </button>
                  <button
                    onClick={() => {
                      updateApplicationStatus(selectedDetailApp.id, 'Diterima');
                      setSelectedDetailApp({ ...selectedDetailApp, status: 'Diterima' });
                      alert('Status berhasil diubah menjadi Diterima!');
                    }}
                    className="py-2.5 px-2 text-[10.5px] font-bold rounded-xl border border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5 animate-pulse" />
                    <span>Terima</span>
                  </button>
                  <button
                    onClick={() => {
                      updateApplicationStatus(selectedDetailApp.id, 'Ditutup');
                      setSelectedDetailApp({ ...selectedDetailApp, status: 'Ditutup' });
                      alert('Status berhasil diubah menjadi Tolak (Ditutup)!');
                    }}
                    className="py-2.5 px-2 text-[10.5px] font-bold rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Tolak</span>
                  </button>
                </div>

                <div className="flex justify-between items-center border-t border-border/60 pt-4 mt-2">
                  <button
                    onClick={() => {
                      alert(`Profil lengkap ${selectedDetailApp.talent?.name}:\n\nKeahlian: ${selectedDetailApp.talent?.skills?.join(', ')}\nIndustri: ${selectedDetailApp.talent?.industry}\nKategori: ${selectedDetailApp.talent?.jobCategory}`);
                    }}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1 bg-transparent border-none p-0"
                  >
                    Lihat Profil <ArrowRight className="w-4 h-4 ml-1 text-primary" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDetailApp(null);
                      router.push(`/pembuat-kerja/employer?tab=chat&appId=${selectedDetailApp.id}`);
                    }}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1 bg-transparent border-none p-0"
                  >
                    Chat Kandidat <ArrowRight className="w-4 h-4 ml-1 text-primary" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
    </div>
  );
}
