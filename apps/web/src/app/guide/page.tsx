'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  LuBookOpen as BookIcon,
  LuSearch as SearchIcon,
  LuChevronRight as ChevronRight,
  LuUser as UserIcon,
  LuBuilding2 as BuildingIcon,
  LuCircle as HelpIcon,
  LuChevronLeft as ChevronLeft,
} from 'react-icons/lu';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const GUIDES_SEEKER = [
  {
    q: 'Bagaimana cara melamar pekerjaan?',
    a: 'Anda dapat mencari lowongan kerja yang sesuai di halaman utama, klik kartu lowongan untuk melihat rincian lengkap, lalu tekan tombol "Lamar Sekarang". Anda dapat memantau status lamaran Anda secara real-time di Dashboard Pencari Kerja pada tab "Lamaran Saya".',
  },
  {
    q: 'Bagaimana cara memperbarui profil agar dilirik HRD?',
    a: 'Lengkapi seluruh data profil Anda termasuk Riwayat Pekerjaan, Riwayat Pendidikan, Keahlian (Skills), dan Portofolio. Akun dengan profil lengkap (>80%) akan mendapatkan lencana "Kandidat Premium" secara otomatis, yang meningkatkan visibilitas Anda di hasil pencarian HRD.',
  },
  {
    q: 'Apakah proses lamaran di platform ini dipungut biaya?',
    a: 'Tidak. Seluruh proses pencarian kerja dan melamar pekerjaan di platform kami adalah 100% GRATIS. Jika ada perusahaan yang meminta biaya pendaftaran, transportasi, atau akomodasi dengan alasan apapun, segera laporkan perusahaan tersebut melalui fitur "Laporkan Lowongan" yang tersedia.',
  },
  {
    q: 'Bagaimana cara mengganti kata sandi atau email saya?',
    a: 'Buka Dashboard Pencari Kerja, arahkan ke tab "Pengaturan Akun" atau "Profil". Anda dapat memperbarui informasi login dan keamanan Anda di sana dengan melakukan verifikasi email terlebih dahulu.',
  },
];

const GUIDES_EMPLOYER = [
  {
    q: 'Bagaimana cara memasang lowongan pekerjaan baru?',
    a: 'Masuk sebagai Pembuat Kerja (HRD), pergi ke menu "Lowongan Kerja", lalu klik tombol "Pasang Lowongan". Lengkapi detail pekerjaan seperti judul posisi, kategori, tipe pekerjaan, kisaran gaji, lokasi, persyaratan keahlian, dan deskripsi tugas. Anda juga dapat menyimpannya sebagai draf sebelum diterbitkan.',
  },
  {
    q: 'Apa itu fitur AI Helper (Hallo AI) dalam verifikasi lowongan?',
    a: 'Sistem kami menggunakan kecerdasan buatan (Hallo AI) untuk meninjau secara otomatis kualitas deskripsi lowongan, kepatuhan terhadap hukum tenaga kerja, serta mendeteksi indikasi penipuan. Lowongan dengan skor tinggi akan langsung aktif, sedangkan lowongan mencurigakan akan ditahan untuk peninjauan manual oleh moderator.',
  },
  {
    q: 'Bagaimana cara mengelola lamaran kandidat yang masuk?',
    a: 'Buka Dashboard Pembuat Kerja di bagian "Kandidat" atau "Lowongan". Anda dapat memfilter pelamar berdasarkan keahlian, melihat CV & portofolio mereka, serta mengubah status lamaran mereka menjadi "Review", "Wawancara", "Diterima", atau "Ditolak". Pelamar akan menerima notifikasi otomatis atas setiap perubahan status.',
  },
  {
    q: 'Bagaimana cara menghubungi talenta secara langsung?',
    a: 'Anda dapat menggunakan menu "Talent Pool" untuk mencari kandidat pasif berdasarkan kriteria spesifik, lalu memulai percakapan langsung melalui fitur Chat bawaan platform kami.',
  },
];

const GuidePage: React.FC = () => {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-foreground py-10 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/60">
          <div className="space-y-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 mb-2"
            >
              <ChevronLeft className="h-4 w-4" /> Kembali
            </button>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
              <BookIcon className="h-8 w-8 text-primary" />
              Pusat Panduan & Bantuan
            </h1>
            <p className="text-sm text-muted-foreground">
              Temukan jawaban tercepat untuk semua pertanyaan Anda mengenai platform rekrutmen kami.
            </p>
          </div>
          
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari panduan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/50 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Seeker Section */}
          <div className="space-y-6 bg-card/30 border border-border/40 p-6 md:p-8 rounded-3xl">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <UserIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Panduan Pencari Kerja</h2>
                <p className="text-xs text-muted-foreground">Tips melamar, melacak pekerjaan, dan memperbarui profil</p>
              </div>
            </div>

            <Accordion type="single" className="w-full space-y-3">
              {GUIDES_SEEKER.map((guide, i) => (
                <AccordionItem key={i} value={`seeker-${i}`} className="border border-border/55 rounded-2xl px-4 overflow-hidden bg-card/65">
                  <AccordionTrigger className="text-xs font-bold text-left hover:no-underline py-4 text-foreground hover:text-primary transition-colors">
                    {guide.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-muted-foreground pb-4 pt-1 border-t border-border/30 mt-1">
                    {guide.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Employer Section */}
          <div className="space-y-6 bg-card/30 border border-border/40 p-6 md:p-8 rounded-3xl">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <BuildingIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Panduan Pembuat Kerja</h2>
                <p className="text-xs text-muted-foreground">Memasang loker, menyaring pelamar, dan integrasi AI</p>
              </div>
            </div>

            <Accordion type="single" className="w-full space-y-3">
              {GUIDES_EMPLOYER.map((guide, i) => (
                <AccordionItem key={i} value={`employer-${i}`} className="border border-border/55 rounded-2xl px-4 overflow-hidden bg-card/65">
                  <AccordionTrigger className="text-xs font-bold text-left hover:no-underline py-4 text-foreground hover:text-primary transition-colors">
                    {guide.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-muted-foreground pb-4 pt-1 border-t border-border/30 mt-1">
                    {guide.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="bg-linear-to-r from-primary/10 via-background to-emerald-500/10 border border-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-sm font-bold text-foreground flex items-center justify-center md:justify-start gap-1.5">
              <HelpIcon className="h-5 w-5 text-primary" />
              Masih butuh bantuan tambahan?
            </h3>
            <p className="text-xs text-muted-foreground">
              Tim support kami siap membantu Anda menyelesaikan kendala teknis atau pertanyaan lainnya 24/7.
            </p>
          </div>
          <button
            onClick={() => {
              router.push('/pencari-kerja/jobs?help=true');
            }}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:scale-102 transition-transform cursor-pointer shadow-sm"
          >
            Hubungi Bantuan
          </button>
        </div>
      </div>
    </main>
  );
};

export default GuidePage;
