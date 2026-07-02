'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Checkbox from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  LuBriefcase as Briefcase,
  LuPlus as Plus,
  LuShieldAlert as ShieldAlert,
  LuSearch as Search,
  LuBuilding2 as Building2,
  LuRocket as Rocket,
  LuX as X,
} from 'react-icons/lu';

interface LowonganTabProps {
  updateTabInUrl: (tab: string) => void;
}

export default function LowonganTab({ updateTabInUrl }: LowonganTabProps) {
  const {
    user,
    employerJobs,
    addEmployerJob,
    updateEmployerJobStatus,
  } = useAppStore();

  const isVerified = user?.companyVerification?.verified || false;

  // Local state variables for filtering/searching
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [selectedJobStatuses, setSelectedJobStatuses] = useState<string[]>([
    'Draft',
    'Aktif',
    'Nonaktif',
    'Ditutup',
    'In Review',
    'Ditolak',
  ]);
  const [isJobStatusOpen, setIsJobStatusOpen] = useState(true);

  // Job Posting State
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPremiumJob, setIsPremiumJob] = useState(false);
  const [workType, setWorkType] = useState('Full Time');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [benefitsProvided, setBenefitsProvided] = useState('');

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      alert(
        'Profil perusahaan Anda belum lengkap / terverifikasi! Harap selesaikan verifikasi perusahaan di tab Verifikasi.',
      );
      updateTabInUrl('verifikasi');
      setShowAddJobModal(false);
      return;
    }
    if (!jobTitle || !jobDesc) {
      alert('Judul dan Deskripsi pekerjaan wajib diisi!');
      return;
    }

    addEmployerJob({
      title: jobTitle,
      description: jobDesc,
      salary: Number(jobSalary) || 8000000,
      badge: isPremiumJob ? 'premium company' : isUrgent ? 'urgent hiring' : '',
      status: 'aktif',
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      requirements: skillsRequired || undefined,
    });

    // Reset Form
    setJobTitle('');
    setJobDesc('');
    setJobSalary('');
    setIsUrgent(false);
    setIsPremiumJob(false);
    setWorkType('Full Time');
    setSkillsRequired('');
    setBenefitsProvided('');
    setShowAddJobModal(false);

    alert('Lowongan pekerjaan baru berhasil dipublikasikan!');
  };

  const totalJobsCount = employerJobs.length;
  const activeJobsCount = employerJobs.filter((j) => j.status === 'aktif').length;
  const draftJobsCount = employerJobs.filter((j) => j.status !== 'aktif').length;

  const filteredJobs = employerJobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(jobSearchQuery.toLowerCase());
    
    const uiStatus = job.status === 'aktif' ? 'Aktif' : 'Draft';
    const matchesStatus = selectedJobStatuses.includes(uiStatus);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {!isVerified && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wide">
                Profil Perusahaan Belum Lengkap!
              </h5>
              <p className="text-[12px] font-medium mt-0.5 opacity-90">
                Anda harus melengkapi profil dan memverifikasi NIB
                sebelum dapat mempublikasikan lowongan aktif baru.
              </p>
            </div>
          </div>
          <Button
            onClick={() => updateTabInUrl('verifikasi')}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-8 px-3 rounded-lg border-none shrink-0"
          >
            Lengkapi Sekarang
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/80 shadow-sm bg-card text-card-foreground">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Total Lowongan
              </p>
              <h3 className="text-2xl font-black mt-1">
                {totalJobsCount}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-sm bg-card text-card-foreground">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Lowongan Aktif
              </p>
              <h3 className="text-2xl font-black mt-1 text-emerald-600">
                {activeJobsCount}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-sm bg-card text-card-foreground">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Lowongan Draf
              </p>
              <h3 className="text-2xl font-black mt-1 text-slate-500">
                {draftJobsCount}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-slate-500/10 text-slate-500 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar Filter */}
        <div className="w-full lg:w-56 bg-card border border-border rounded-2xl p-4 space-y-4 shrink-0 shadow-sm">
          <div className="space-y-2.5">
            <div
              className="flex justify-between items-center cursor-pointer select-none"
              onClick={() => setIsJobStatusOpen(!isJobStatusOpen)}
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Status Lowongan
              </span>
            </div>

            {isJobStatusOpen && (
              <div className="space-y-2.5 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {['Aktif', 'Draft'].map((status) => (
                  <Checkbox
                    key={status}
                    checked={selectedJobStatuses.includes(status)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedJobStatuses([...selectedJobStatuses, status]);
                      } else {
                        setSelectedJobStatuses(
                          selectedJobStatuses.filter((s) => s !== status),
                        );
                      }
                    }}
                    label={status}
                    className="py-0.5"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
            <div className="flex-1 relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari judul loker"
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs rounded-xl bg-background border-border text-foreground"
              />
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[12px] text-muted-foreground font-semibold">
                Menampilkan {filteredJobs.length} dari {totalJobsCount} Lowongan Kerja
              </span>

              <Button
                onClick={() => setShowAddJobModal(true)}
                className="font-bold text-xs h-10 gap-1.5 shadow-sm rounded-xl cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Pasang Lowongan</span>
              </Button>
            </div>
          </div>

          {!isVerified ? (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Profil Perusahaan Belum Lengkap
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                Lengkapi profil perusahaan sebelum memasang lowongan pekerjaan.
              </p>
              <Button
                onClick={() => updateTabInUrl('verifikasi')}
                className="border border-primary text-primary hover:bg-primary/10 bg-transparent rounded-xl px-6 font-bold text-xs h-10 shadow-sm transition-colors cursor-pointer"
              >
                Lengkapi Profil
              </Button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <h4 className="font-bold text-xs text-muted-foreground uppercase">
                Tidak Ada Lowongan
              </h4>
              <p className="text-[12px] text-muted-foreground mt-1">
                Belum ada lowongan pekerjaan yang cocok dengan filter Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="border border-border shadow-sm hover:border-border/80 transition-all rounded-2xl overflow-hidden bg-card text-card-foreground"
                >
                  <div className="p-5 flex flex-col justify-between h-full gap-4">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-extrabold text-sm text-foreground uppercase">
                            {job.title}
                          </h4>
                          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                            Dibuat: {job.date || 'Baru saja'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {job.badge && (
                            <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/15 border-none font-bold text-[10px] px-1.5 uppercase rounded-full">
                              {job.badge}
                            </Badge>
                          )}
                          <Badge
                            className={`border-none font-bold text-[10px] px-1.5 uppercase rounded-full ${
                              job.status === 'aktif'
                                ? 'bg-emerald-500/15 text-emerald-600'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {job.status === 'aktif' ? 'Aktif' : 'Draft'}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-3 font-medium leading-relaxed line-clamp-3">
                        {job.description}
                      </p>

                      {job.requirements && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-secondary/60 border border-border/80 text-secondary-foreground font-bold">
                            {job.requirements}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs font-black text-emerald-600">
                        Rp {job.salary?.toLocaleString('id-ID')} / bln
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[10px] font-bold h-7 px-2 border-border hover:bg-muted cursor-pointer"
                          onClick={() =>
                            updateEmployerJobStatus(
                              job.id,
                              job.status === 'aktif' ? 'draf' : 'aktif',
                            )
                          }
                        >
                          {job.status === 'aktif' ? 'Ubah ke Draft' : 'Aktifkan'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setShowAddJobModal(false)}
          />
          <Card className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] z-10 dark:bg-slate-900 dark:border-slate-800">
            <button
              onClick={() => setShowAddJobModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all cursor-pointer border-none"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-black uppercase text-slate-900 mb-6 dark:text-slate-100">
              Pasang Lowongan Pekerjaan Baru
            </h3>

            <form onSubmit={handlePostJob} className="space-y-4">
              {!isVerified && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[12px] font-bold flex gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Perhatian: Profil perusahaan belum lengkap.
                    Selesaikan verifikasi sebelum mempublish lowongan ini!
                  </span>
                </div>
              )}

              <div className="space-y-3.5">
                <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Informasi Utama
                </h5>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Judul Pekerjaan
                  </label>
                  <Input
                    placeholder="e.g. Lead Frontend React Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Deskripsi Pekerjaan
                  </label>
                  <textarea
                    placeholder="Jelaskan peran, tanggung jawab, dan kriteria..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    className="w-full min-h-[100px] border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-primary outline-none dark:bg-slate-950 dark:border-slate-800"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Gaji Bulanan 
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 12000000"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>
              </div>

              <hr className="border-slate-100 my-4 dark:border-slate-800" />

              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Special Badge & Promosi
                </h5>
                <div className="flex gap-4">
                  <Checkbox
                    checked={isUrgent}
                    onCheckedChange={setIsUrgent}
                    label="Urgent Hiring"
                  />

                  <Checkbox
                    checked={isPremiumJob}
                    onCheckedChange={setIsPremiumJob}
                    label="Premium Company"
                  />
                </div>
              </div>

              <hr className="border-slate-100 my-4 dark:border-slate-800" />

              <div className="space-y-3.5">
                <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Persyaratan Kerja
                </h5>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tipe Kerja (Work Option)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Full Time', 'Contract', 'Part Time'].map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setWorkType(type)}
                          className={`py-1.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            workType === type
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-650'
                          }`}
                        >
                          {type}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Keahlian
                  </label>
                  <Input
                    placeholder="e.g. React, Next.js, Redux, Tailwind CSS"
                    value={skillsRequired}
                    onChange={(e) =>
                      setSkillsRequired(e.target.value)
                    }
                    className="rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Benefit Kerja 
                  </label>
                  <Input
                    placeholder="e.g. Asuransi Kesehatan, Laptop Perusahaan, Bonus Tahunan"
                    value={benefitsProvided}
                    onChange={(e) =>
                      setBenefitsProvided(e.target.value)
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white font-bold h-10 rounded-xl mt-6 cursor-pointer"
              >
                <Rocket className="w-4 h-4 mr-2" /> Publikasikan Lowongan Kerja
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
