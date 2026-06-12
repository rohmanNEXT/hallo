'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Building2,
  Briefcase,
  Plus,
  Coins,
  ShieldCheck,
  Users,
  Flame,
  Star,
  Compass,
} from 'lucide-react';

export default function EmployerDashboard() {
  const {
    user,
    employerJobs,
    addEmployerJob,
    updateEmployerJobStatus,
    verifyCompany,
    buyCoins,
    upgradePlan,
  } = useAppStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'pekerjaan' | 'koin' | 'verifikasi'
  >('pekerjaan');

  // Job Post State
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobSalary, setJobSalary] = useState(10000000);

  // Verification Form State
  const [nib, setNib] = useState('');
  const [compName, setCompName] = useState('');
  const [compAddress, setCompAddress] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDesc) {
      alert('Judul dan Deskripsi pekerjaan harus diisi!');
      return;
    }
    addEmployerJob({
      title: jobTitle,
      description: jobDesc,
      salary: jobSalary,
      status: 'aktif',
    });
    setJobTitle('');
    setJobDesc('');
    alert('Lowongan pekerjaan baru berhasil ditambahkan!');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nib || !compName) {
      alert('NIB dan Nama Perusahaan harus diisi!');
      return;
    }
    verifyCompany({
      nib,
      name: compName,
      address: compAddress,
      verified: true,
    });
    alert('Permohonan verifikasi perusahaan Anda berhasil disetujui!');
  };

  if (!mounted || !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-stone-100 flex items-center justify-center">
          <p className="text-stone-500 font-bold animate-pulse">
            Loading Employer Dashboard...
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const isVerified = user.companyVerification?.verified || false;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-100 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_black] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-blue-500 text-white rounded-2xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_black] shrink-0">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase text-black flex items-center gap-1.5">
                  <span>
                    {user.companyVerification?.name ||
                      user.name ||
                      'Perusahaan Saya'}
                  </span>
                  {isVerified && (
                    <ShieldCheck className="h-6 w-6 text-emerald-500 fill-emerald-500/10 shrink-0" />
                  )}
                </h1>
                <p className="text-stone-500 text-xs font-bold mt-1">
                  Dasbor Rekruter & Pengelola Lowongan Kerja
                </p>
              </div>
            </div>

            {/* Coins Widget */}
            <div className="bg-amber-400 border-2 border-black px-4 py-2.5 rounded-xl shadow-[3px_3px_0px_0px_black] flex items-center gap-3">
              <Coins className="h-5 w-5 text-black" />
              <div>
                <div className="text-[10px] text-black font-bold uppercase leading-none">
                  Saldo Koin
                </div>
                <div className="font-black text-sm text-black mt-1">
                  {user.coins || 0} Koin
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b-2 border-black bg-stone-200/50 p-1.5 rounded-xl border-2 border-black">
            {[
              { id: 'pekerjaan', label: '💼 Kelola Lowongan', icon: Briefcase },
              { id: 'koin', label: '🪙 Beli Koin & Plan', icon: Coins },
              {
                id: 'verifikasi',
                label: '🛡️ Verifikasi Perusahaan',
                icon: ShieldCheck,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-stone-650 hover:bg-stone-200'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: List of Jobs (For 'pekerjaan' tab) or Settings Forms */}
            <div className="lg:col-span-2 space-y-4">
              {activeTab === 'pekerjaan' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black uppercase text-black">
                    📋 Daftar Lowongan Aktif ({employerJobs.length})
                  </h3>

                  {employerJobs.length === 0 ? (
                    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_black] p-6 text-center">
                      <p className="text-xs text-stone-500 font-bold">
                        Belum ada lowongan pekerjaan yang diterbitkan.
                      </p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {employerJobs.map((job) => (
                        <Card
                          key={job.id}
                          className="border-2 border-black hover:shadow-md transition-shadow relative overflow-hidden bg-white p-5 shadow-[4px_4px_0px_0px_black]"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="font-black text-sm text-black uppercase">
                                {job.title}
                              </h4>
                              <p className="text-[10px] text-stone-500 font-bold mt-1">
                                Dibuat pada: {job.date || 'Baru saja'}
                              </p>
                              <p className="text-xs text-stone-600 mt-2 font-medium leading-relaxed">
                                {job.description}
                              </p>
                              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
                                <span className="text-xs font-black text-emerald-600">
                                  Rp {job.salary?.toLocaleString('id-ID')}
                                </span>
                                <Badge
                                  className={
                                    job.status === 'aktif'
                                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/10'
                                      : 'bg-stone-100 text-stone-400'
                                  }
                                >
                                  {job.status === 'aktif' ? 'Aktif' : 'Draf'}
                                </Badge>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs border-2 border-black"
                                onClick={() =>
                                  updateEmployerJobStatus(
                                    job.id,
                                    job.status === 'aktif' ? 'draf' : 'aktif',
                                  )
                                }
                              >
                                {job.status === 'aktif'
                                  ? 'Matikan'
                                  : 'Aktifkan'}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'koin' && (
                <div className="bg-white border-2 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_black] space-y-6">
                  <div>
                    <h3 className="font-black text-sm uppercase text-black">
                      💰 Tambah Saldo Koin
                    </h3>
                    <p className="text-stone-500 text-xs mt-1">
                      Beli koin tambahan untuk memasang lowongan baru atau
                      membuka profil pelamar.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        amount: 50,
                        cost: 75000,
                        desc: 'Cocok untuk rekrutmen kecil',
                      },
                      {
                        amount: 200,
                        cost: 250000,
                        desc: 'Paling populer untuk berkembang',
                      },
                      {
                        amount: 500,
                        cost: 550000,
                        desc: 'Pilihan terbaik untuk enterprise',
                      },
                    ].map((pack, idx) => (
                      <div
                        key={idx}
                        className="border-2 border-black p-4 rounded-xl flex justify-between items-center bg-stone-50 hover:bg-stone-100/50 cursor-pointer"
                        onClick={() => {
                          buyCoins(pack.amount, pack.cost);
                          alert(`Berhasil membeli paket ${pack.amount} Koin!`);
                        }}
                      >
                        <div>
                          <div className="font-black text-sm text-black">
                            {pack.amount} Koin
                          </div>
                          <div className="text-[10px] text-stone-500 font-bold mt-0.5">
                            {pack.desc}
                          </div>
                        </div>
                        <span className="font-black text-xs text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                          Rp {pack.cost.toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <hr className="border-black border-2 my-6" />

                  <div>
                    <h3 className="font-black text-sm uppercase text-black">
                      💎 Upgrade Plan Perusahaan
                    </h3>
                    <p className="text-stone-500 text-xs mt-1">
                      Tingkatkan visibilitas lowongan kerja Anda secara
                      nasional.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: 'Starter',
                        price: 150000,
                        desc: 'Upgrade lowongan ke prioritas',
                      },
                      {
                        name: 'Platinum',
                        price: 450000,
                        desc: 'Akses penuh basis data pelamar & prioritas utama',
                      },
                    ].map((pl, idx) => (
                      <div
                        key={idx}
                        className="border-2 border-black p-4 rounded-xl flex justify-between items-center bg-stone-50 hover:bg-stone-100/50 cursor-pointer"
                        onClick={() => {
                          upgradePlan(pl.name as any, pl.price);
                          alert(
                            `Berhasil upgrade plan perusahaan ke ${pl.name}!`,
                          );
                        }}
                      >
                        <div>
                          <div className="font-black text-sm text-black">
                            {pl.name} Plan
                          </div>
                          <div className="text-[10px] text-stone-500 font-bold mt-0.5">
                            {pl.desc}
                          </div>
                        </div>
                        <span className="font-black text-xs text-blue-600 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                          Rp {pl.price.toLocaleString('id-ID')}/bln
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'verifikasi' && (
                <div className="bg-white border-2 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_black] space-y-6">
                  <div>
                    <h3 className="font-black text-sm uppercase text-black flex items-center gap-1.5">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                      Status Verifikasi Perusahaan
                    </h3>
                    <p className="text-stone-500 text-xs mt-1">
                      Verifikasi perusahaan Anda untuk menampilkan lencana
                      centang hijau di setiap lowongan yang Anda terbitkan.
                    </p>
                  </div>

                  {isVerified ? (
                    <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-700 rounded-xl flex items-center gap-3">
                      <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-black text-xs uppercase leading-none">
                          Perusahaan Terverifikasi
                        </div>
                        <div className="text-[10px] font-medium mt-1 leading-relaxed">
                          NIB Anda telah divalidasi dan lencana verifikasi
                          aktif. Lowongan Anda akan mendapatkan kepercayaan
                          lebih dari pencari kerja.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerify} className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase text-stone-400">
                          Nomor Induk Berusaha (NIB)
                        </label>
                        <Input
                          placeholder="Masukkan 13 digit NIB perusahaan Anda"
                          value={nib}
                          onChange={(e: any) => setNib(e.target.value)}
                          className="border-2 border-black"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase text-stone-400">
                          Nama Resmi Perusahaan
                        </label>
                        <Input
                          placeholder="Masukkan nama resmi perusahaan sesuai akta"
                          value={compName}
                          onChange={(e: any) => setCompName(e.target.value)}
                          className="border-2 border-black"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase text-stone-400">
                          Alamat Lengkap Perusahaan
                        </label>
                        <Input
                          placeholder="Masukkan alamat lengkap kantor pusat"
                          value={compAddress}
                          onChange={(e: any) => setCompAddress(e.target.value)}
                          className="border-2 border-black"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-black hover:bg-stone-850 text-white font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] mt-2 rounded-xl"
                      >
                        Ajukan Verifikasi
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Post a New Job Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase text-black flex items-center gap-1.5">
                <Plus className="h-5 w-5 text-black" />
                Pasang Lowongan Baru
              </h3>

              <div className="bg-white border-2 border-black p-5 rounded-xl shadow-[4px_4px_0px_0px_black]">
                <form onSubmit={handlePostJob} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-stone-400">
                      Judul Pekerjaan
                    </label>
                    <Input
                      placeholder="Contoh: Frontend React Engineer"
                      value={jobTitle}
                      onChange={(e: any) => setJobTitle(e.target.value)}
                      className="border-2 border-black"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-stone-400">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      placeholder="Jelaskan kebutuhan peran ini..."
                      value={jobDesc}
                      onChange={(e: any) => setJobDesc(e.target.value)}
                      className="w-full min-h-[100px] border-2 border-black p-2 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-stone-400">
                      Estimasi Gaji Bulanan (IDR)
                    </label>
                    <Input
                      type="number"
                      placeholder="10000000"
                      value={jobSalary}
                      onChange={(e: any) =>
                        setJobSalary(Number(e.target.value))
                      }
                      className="border-2 border-black"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-stone-850 text-white font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] py-2 rounded-xl mt-2"
                  >
                    🚀 Pasang Lowongan Kerja
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
