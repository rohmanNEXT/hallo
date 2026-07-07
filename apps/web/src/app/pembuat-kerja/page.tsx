'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  LuCheck,
  LuBot,
  LuGlobe,
  LuClock,
  LuMessageCircleQuestion,
  LuBuilding2,
  LuRocket,
  LuSparkles,
  LuUsers,
  LuBriefcase,
  LuTrendingUp,
  LuShieldCheck,
  LuZap,
  LuArrowRight,
  LuStar,
} from 'react-icons/lu';

const PembuatKerjaPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0533] via-[#2d0a5e] to-[#1a0533] text-white py-24 px-6 lg:px-12 min-h-[680px] flex items-center">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-fuchsia-600/15 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              {/* Badge removed */}

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Temukan & Rekrut{' '}
                  <span className="block mt-1">
                    <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                      Kandidat Terbaik
                    </span>
                  </span>
                  <span className="text-white/90">
                    lainnya lebih cepat.
                  </span>
                </h1>
                <p className="text-white/60 text-sm leading-relaxed max-w-lg">
                  Akses 10 juta+ talenta siap kerja. Skrining otomatis dengan
                  AI. Posting loker gratis — mulai rekrut hari ini.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="h-12 px-7 text-sm font-bold rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-orange-500/50">
                  <LuRocket className="h-4 w-4 mr-2" />
                  Pasang Loker Sekarang
                </Button>
                <Button
                  variant="outline"
                  className="h-12 px-7 text-sm font-semibold rounded-2xl border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm transition-all hover:scale-105"
                >
                  Pelajari Lebih Lanjut
                  <LuArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {[
                    'bg-violet-400',
                    'bg-fuchsia-400',
                    'bg-pink-400',
                    'bg-amber-400',
                  ].map((c, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full ${c} border-2 border-[#2d0a5e] flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {['B', 'T', 'A', 'S'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <LuStar
                        key={s}
                        className="h-3 w-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    80.000+ perusahaan telah bergabung
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Dashboard Mockup */}
            <div className="relative h-[400px] hidden lg:flex items-center justify-center">
              {/* Main card */}
              <div className="absolute w-[90%] h-[78%] bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-3xl right-0 top-8 shadow-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  <div className="ml-2 h-5 flex-1 bg-white/10 rounded-full" />
                </div>
                <div className="flex gap-3 flex-1">
                  <div className="w-1/3 bg-white/5 rounded-xl border border-white/10 p-3 space-y-2">
                    <div className="h-2 bg-violet-400/30 rounded w-3/4" />
                    <div className="h-2 bg-white/10 rounded w-full" />
                    <div className="h-2 bg-white/10 rounded w-2/3" />
                    <div className="h-6 bg-orange-400/20 rounded-lg mt-4" />
                  </div>
                  <div className="flex-1 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3 items-center"
                      >
                        <div className="h-8 w-8 rounded-full bg-violet-400/20 border border-violet-400/20 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-2 bg-white/20 rounded w-3/4" />
                          <div className="h-2 bg-white/10 rounded w-1/2" />
                        </div>
                        <div className="h-5 w-12 bg-green-400/20 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating pill removed as per user request */}
            </div>
          </div>

          {/* Stat Pills */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
            {[
              {
                icon: LuBriefcase,
                label: 'Pasang Loker',
                value: 'MUDAH & SIMPEL',
                color: 'from-violet-500/20 to-fuchsia-500/20',
                border: 'border-violet-500/20',
                iconColor: 'text-violet-300',
              },
              {
                icon: LuBot,
                label: 'Skrining CV',
                value: 'BERTENAGA AI',
                color: 'from-blue-500/20 to-cyan-500/20',
                border: 'border-blue-500/20',
                iconColor: 'text-blue-300',
              },
              {
                icon: LuTrendingUp,
                label: 'Cari Kandidat',
                value: 'TALENT SEARCH',
                color: 'from-emerald-500/20 to-teal-500/20',
                border: 'border-emerald-500/20',
                iconColor: 'text-emerald-300',
              },
              {
                icon: LuUsers,
                label: 'Jangkau',
                value: '10 JUTA+ KANDIDAT',
                color: 'from-orange-500/20 to-amber-500/20',
                border: 'border-orange-500/20',
                iconColor: 'text-orange-300',
              },
            ].map(
              ({ icon: Icon, label, value, color, border, iconColor }, i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-br ${color} backdrop-blur-sm border ${border} rounded-xl p-3.5 flex items-center gap-3 hover:scale-102 transition-transform duration-300`}
                >
                  <div
                    className={`h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
                  </div>
                  <div>
                    <div className="text-[12px] font-extrabold text-white/95 leading-tight">
                      {label}
                    </div>
                    <div
                      className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${iconColor}`}
                    >
                      {value}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ─── 2. TRUSTED BY (MARQUEE) ─── */}
      <section className="py-12 bg-background border-b border-border/40 overflow-hidden relative">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 35s linear infinite;
            will-change: transform;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `,
          }}
        />
        <div className="max-w-7xl mx-auto text-center px-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
            Dipercaya oleh 80.000+ perusahaan ternama
          </p>
        </div>

        <div className="relative w-full overflow-hidden flex">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div
            className="animate-marquee items-center opacity-60 hover:opacity-100 transition-opacity duration-500"
            style={{ gap: '4rem' }}
          >
            {[
              { name: 'Bluebird', color: 'text-blue-500' },
              { name: 'BNI Life', color: 'text-orange-500' },
              { name: 'BTPN Syariah', color: 'text-orange-400' },
              { name: 'FOOM', color: 'text-foreground' },
              { name: 'Home Credit', color: 'text-red-500' },
              { name: 'Indodana', color: 'text-green-500' },
              { name: 'Astra', color: 'text-blue-600' },
              { name: 'Tokopedia', color: 'text-green-600' },
              { name: 'Bluebird', color: 'text-blue-500' },
              { name: 'BNI Life', color: 'text-orange-500' },
              { name: 'BTPN Syariah', color: 'text-orange-400' },
              { name: 'FOOM', color: 'text-foreground' },
              { name: 'Home Credit', color: 'text-red-500' },
              { name: 'Indodana', color: 'text-green-500' },
              { name: 'Astra', color: 'text-blue-600' },
              { name: 'Tokopedia', color: 'text-green-600' },
            ].map((company, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-base font-black whitespace-nowrap shrink-0 ${company.color}`}
              >
                <LuBuilding2 className="h-5 w-5 shrink-0 opacity-70" />
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. FEATURES & KEUNGGULAN ─── */}
      <section className="py-24 px-6 lg:px-12 bg-muted/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs font-bold text-primary mb-4">
              <LuShieldCheck className="h-3.5 w-3.5" />
              Fitur Lengkap & Gratis
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
              Platform Rekrutmen yang Berpihak pada Anda
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Semua yang Anda butuhkan untuk rekrutmen cepat, tepat, dan efisien
              — sudah tersedia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                icon: LuCheck,
                gradient: 'from-violet-500 to-indigo-600',
                glow: 'shadow-violet-500/20',
                bg: 'bg-violet-500/5 dark:bg-violet-500/10',
                border: 'border-violet-500/15',
                title: 'Fitur Lengkap, 100% GRATIS',
                desc: 'Posting loker tak terbatas, hubungi kandidat, dan jadwalkan wawancara — tanpa bayar sepeser pun.',
              },
              {
                icon: LuBot,
                gradient: 'from-blue-500 to-cyan-500',
                glow: 'shadow-blue-500/20',
                bg: 'bg-blue-500/5 dark:bg-blue-500/10',
                border: 'border-blue-500/15',
                title: '2× Lebih Cepat Skrining',
                desc: 'Saring ratusan CV sekaligus dengan kecerdasan AI kami — temukan yang terbaik dalam hitungan detik.',
              },
              {
                icon: LuGlobe,
                gradient: 'from-emerald-500 to-teal-500',
                glow: 'shadow-emerald-500/20',
                bg: 'bg-emerald-500/5 dark:bg-emerald-500/10',
                border: 'border-emerald-500/15',
                title: 'Temukan Kandidat Berkualitas',
                desc: 'Akses jutaan talenta terbaik dari berbagai latar belakang. Kandidat yang tepat, lebih cepat dan efisien.',
              },
              {
                icon: LuClock,
                gradient: 'from-orange-500 to-amber-500',
                glow: 'shadow-orange-500/20',
                bg: 'bg-orange-500/5 dark:bg-orange-500/10',
                border: 'border-orange-500/15',
                title: 'Kandidat dalam 24 Jam',
                desc: 'Aktifkan loker secara instan dan jangkau 10 juta+ pencari kerja berkualifikasi dengan cepat.',
              },
            ].map(
              ({ icon: Icon, gradient, glow, bg, border, title, desc }, i) => (
                <div
                  key={i}
                  className={`group ${bg} border ${border} rounded-3xl p-6 hover:shadow-xl ${glow} hover:-translate-y-2 transition-all duration-300`}
                >
                  <div
                    className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg ${glow} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-sm font-black text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ─── 4. CARA MENCARI PEKERJA (SEO & EXTRA INFO) ─── */}
      <section className="py-20 px-6 lg:px-12 max-w-5xl mx-auto space-y-10">
        <div className="space-y-3">
          <h3 className="text-sm font-black text-foreground">
            Cara Mencari Pekerja di BlueJob Recruiter
          </h3>
          <p className="text-muted-foreground text-xs leading-loose">
            BlueJob Recruiter merupakan situs dan aplikasi iklan lowongan kerja
            gratis via online yang memudahkan Anda untuk membuat lowongan
            pekerjaan dan mendapatkan calon karyawan. Keamanan pasti dijamin
            karena telah diawasi oleh otoritas terkait. Memasang iklan loker
            gratis memiliki banyak peminat karena kami telah memiliki jutaan
            pencari kerja yang terdaftar.
          </p>
          <p className="text-muted-foreground text-xs leading-loose">
            Cara membuat lowongan kerja pun mudah dan tanpa biaya sepeserpun.
            Anda cukup mengisi beberapa pertanyaan pada form yang tersedia dan
            Anda telah satu langkah lebih dekat untuk mendapatkan karyawan
            terbaik.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-black text-foreground">
            Kelebihan Pasang Lowongan di BlueJob Recruiter
          </h3>
          <div className="space-y-6 pl-4 border-l-2 border-primary/20">
            {[
              {
                n: '1',
                title: 'Lowongan kerja mudah ditemukan',
                desc: 'Dengan posting lowongan kerja di BlueJob Recruiter, iklan Anda akan dengan mudah dilihat oleh banyak orang sehingga pemilihan kandidat semakin baik.',
              },
              {
                n: '2',
                title: 'Kualitas pelamar yang bermutu',
                desc: 'Platform kami memastikan Anda terhubung dengan kandidat yang memiliki keterampilan sesuai kebutuhan perusahaan. Filter canggih kami menyederhanakan seleksi awal.',
              },
              {
                n: '3',
                title: 'Kelola calon kandidat lebih mudah',
                desc: 'Setelah iklan lowongan diterima banyak pelamar, filter kandidat melalui CV yang paling sesuai dan hubungi mereka langsung untuk wawancara.',
              },
            ].map(({ n, title, desc }) => (
              <div key={n}>
                <h4 className="text-xs font-black mb-1.5 text-foreground">
                  {n}. {title}
                </h4>
                <p className="text-muted-foreground text-xs leading-loose">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. FAQ ─── */}
      <section className="py-24 px-6 lg:px-12 bg-muted/20 border-y border-border/40">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-14 items-start">
          <div className="w-full md:w-1/3 md:sticky md:top-24">
            <div className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white p-6 rounded-3xl shadow-xl shadow-violet-500/30 inline-block mb-5">
              <LuMessageCircleQuestion className="h-10 w-10" />
            </div>
            <h3 className="text-base font-black text-foreground">
              Masih ada pertanyaan?
            </h3>
            <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
              Kami siap membantu kapan saja melalui pusat bantuan kami.
            </p>
            <Button
              variant="outline"
              className="mt-5 text-xs font-bold h-9 rounded-xl px-5"
            >
              Help Center <LuArrowRight className="h-3.5 w-3.5 ml-2" />
            </Button>
          </div>

          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-black mb-8 text-foreground">
              Pertanyaan Umum
            </h2>
            <Accordion type="single" className="space-y-3">
              {[
                {
                  q: 'Apa itu BlueJob Recruiter for Employers?',
                  a: 'BlueJob Recruiter for Employers adalah platform rekrutmen terpadu yang membantu perusahaan mencari dan menyaring kandidat terbaik dengan cepat dan efisien menggunakan teknologi AI.',
                },
                {
                  q: 'Ada berapa jenis layanan BlueJob Recruiter?',
                  a: 'Terdapat layanan gratis dan berbayar, mencakup posting loker tak terbatas, fitur skrining AI, hingga akses Talent Search premium.',
                },
                {
                  q: 'Apakah pemasangan lowongan dipungut biaya?',
                  a: 'Pemasangan lowongan kerja dasar 100% gratis tanpa biaya tersembunyi. Anda hanya membayar untuk fitur premium opsional.',
                },
                {
                  q: 'Berapa lama proses pemasangan lowongan kerja?',
                  a: 'Lowongan Anda akan tayang secara instan setelah form dikirim dan disetujui dalam waktu kurang dari 5 menit.',
                },
              ].map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`q${i + 1}`}
                  className="border border-border/50 bg-card rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                >
                  <AccordionTrigger className="text-xs font-bold py-4 px-6 hover:bg-transparent hover:no-underline text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground px-6 pb-5 pt-0 text-xs leading-relaxed border-none bg-transparent">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ─── 6. REGISTRATION FORM (CTA) ─── */}
      <section className="py-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-3xl mx-auto">
          {/* Card */}
          <div className="relative bg-card border border-border/60 shadow-2xl rounded-3xl p-8 md:p-10 overflow-hidden">
            {/* Decorative glow inside card */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-xs font-bold text-orange-500 mb-4">
                  <LuRocket className="h-3.5 w-3.5" />
                  Mulai Gratis Sekarang
                </div>
                <h2 className="text-2xl font-black text-foreground">
                  Buat Akun & Mulai Rekrut!
                </h2>
                <p className="text-muted-foreground text-xs mt-2">
                  Bergabunglah dengan 80.000+ perusahaan yang sudah menemukan
                  talenta terbaik.
                </p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Contoh: Budi Santoso"
                      className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background text-xs transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">
                      Nama Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Contoh: PT Maju Bersama"
                      className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background text-xs transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">
                      Email Bisnis <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="email@perusahaan.com"
                      className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background text-xs transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <div className="flex items-center justify-center px-4 bg-muted/80 border border-r-0 border-border/60 rounded-l-xl text-xs font-bold text-foreground/70">
                        🇮🇩 +62
                      </div>
                      <Input
                        placeholder="823 4567 8910"
                        className="h-11 rounded-l-none rounded-r-xl bg-muted/40 border-border/60 focus:bg-background text-xs transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80">
                    Kode Referral{' '}
                    <span className="text-muted-foreground font-normal">
                      (Opsional)
                    </span>
                  </label>
                  <Input
                    placeholder="Masukkan kode referral jika ada"
                    className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background text-xs transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="pt-1">
                  <Button className="w-full h-12 text-sm font-black rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-[1.02]">
                    <LuRocket className="h-4 w-4 mr-2" />
                    Daftar Sekarang — Gratis!
                  </Button>
                </div>

                <p className="text-[10px] text-muted-foreground text-center">
                  Dengan mendaftar, Anda menyetujui{' '}
                  <a
                    href="#"
                    className="text-primary font-semibold hover:underline"
                  >
                    Syarat &amp; Ketentuan BlueJob Recruiter
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PembuatKerjaPage;
