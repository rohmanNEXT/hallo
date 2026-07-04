'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/store/store';
import {
  LuBriefcase as Briefcase,
  LuBookmark as Bookmark,
  LuMessageSquare as MessageSquare,
  LuAward as Award,
  LuChevronRight as ChevronRight,
  LuChevronLeft as ChevronLeft,
  LuInfo as Info,
  LuMapPin as MapPin,
  LuClock as Clock,
  LuCircleCheck as CheckCircle2,
  LuCircleX as XCircle,
  LuSparkles as Sparkles,
  LuCoins as Coins,
  LuSearch as Search,
  LuImage as ImageIcon,
  LuX as X,
  LuGripHorizontal as GripHorizontal,
  LuInbox as Inbox,
  LuCheck,
  LuBuilding2,
} from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Job } from '@/lib/types';
import Image from 'next/image';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardOverview({
  onNavigate,
}: DashboardOverviewProps) {
  const { user, applications, bookmarks, theme, bannerIndex, setBannerIndex } = useAppStore();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [prevIndex, setPrevIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const floatRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const floatPos = useRef({ x: 0, y: 120 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      floatPos.current = { x: window.innerWidth / 2 - 140, y: 120 };
    }
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !floatRef.current) return;
      const x = e.clientX - dragOffset.current.x;
      const y = e.clientY - dragOffset.current.y;
      floatPos.current = { x, y };
      floatRef.current.style.left = x + 'px';
      floatRef.current.style.top = y + 'px';
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Cookie helpers
  const setCookie = (name: string, value: string, days = 365) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return undefined;
    return document.cookie
      .split('; ')
      .find((r) => r.startsWith(name + '='))
      ?.split('=')[1];
  };

  // Change photo with crossfade + save to store
















































  const bannerPhotos = [
    {
      url: '/images/banners/banner1.png?v=25',
      label: 'Pegunungan',
    },
    {
      url: '/images/banners/banner2.png?v=25',
      label: 'Hutan',
    },
    {
      url: '/images/banners/banner3.png?v=25',
      label: 'Pantai',
    },
    {
      url: '/images/banners/banner4.png?v=25',
      label: 'Kota',
    },
    {
      url: '/images/banners/banner5.png?v=25',
      label: 'Laut',
      copyright: 'Maldives Atolls',
    },
    {
      url: '/images/banners/banner6.png?v=25',
      label: 'Salju',
    },
    {
      url: 'https://bing.biturl.top/?resolution=1920&format=image&index=0',
      label: 'Bing Image',
      copyright: 'Realtime Bing Image of the Day',
    },
  ];

  const changePhoto = (idx: number) => {
    if (idx === bannerIndex) return;
    setPrevIndex(bannerIndex);
    setFading(true);
    setBannerIndex(idx);
    setTimeout(() => setFading(false), 700);
  };



  useEffect(() => {
    setMounted(true);
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get<Job[]>('/data/jobs.json');
        setAllJobs(data);
      } catch (err) {
        console.error('Failed to fetch jobs in dashboard overview:', err);
      }
    };
    fetchJobs();
  }, []);

  if (!user) return null;

  // Calculate profile strength
  const calculateProfileStrength = () => {
    let score = 20; // base score for registering
    if (user.waNumber) score += 10;
    if (user.education && user.education.length > 0) score += 10;
    if (user.experience && user.experience.length > 0) score += 10;
    if (user.resume) score += 15;
    if (user.website || user.socialMedia) score += 10;
    if (user.aboutMe) score += 10;
    if (user.skill && user.skill.length > 0) score += 15;
    return score;
  };

  const profileStrength = calculateProfileStrength();

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300 h-full overflow-y-auto pr-1.5 smooth-scroll pb-6">
      {/* Welcome Banner - Bing Style with Crossfade */}
      <div className="relative overflow-hidden rounded-3xl text-white shadow-xl min-h-[170px]">
        {/* Previous photo - fades out */}
        <div
          className="absolute inset-0 rounded-3xl bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url('${bannerPhotos[prevIndex].url}')`,
            backgroundPosition: 'center 35%',
            opacity: fading ? 1 : 0,
          }}
        />
        {/* Current photo - fades in */}
        <div
          className="absolute inset-0 rounded-3xl bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url('${bannerPhotos[bannerIndex].url}')`,
            backgroundPosition: 'center 35%',
            opacity: fading ? 0 : 1,
          }}
        />
        {/* Stronger dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/20 rounded-3xl" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/15 to-transparent rounded-3xl" />
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent rounded-3xl" />

        {/* Photo picker trigger button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowPicker((prev) => !prev)}
            className="flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white p-2 rounded-full transition-all cursor-pointer shadow-sm"
            title="Ganti foto latar"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 h-full p-8 md:p-10 pb-7 md:pb-8">
          <div className="space-y-1.5">
            <span className="text-xl font-extrabold tracking-tight drop-shadow-lg block">
              Hi, {user.nickname || user.name}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Window - Draggable Photo Picker */}
      {showPicker && (
        <div
          ref={floatRef}
          className="fixed z-50 select-none animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: floatPos.current.x,
            top: floatPos.current.y,
            width: 260,
          }}
        >
          <div className="bg-background/20 backdrop-blur-sm border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
            <div
              onMouseDown={(e) => {
                if (!floatRef.current) return;
                dragging.current = true;
                const rect = floatRef.current.getBoundingClientRect();
                dragOffset.current = {
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                };
                e.preventDefault();
              }}
              className="flex items-center justify-between px-3.5 py-2.5 bg-transparent border-b border-border/50 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-2">
                <GripHorizontal className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span className="text-[12px] font-bold text-foreground">
                  Pilih Tema Latar
                </span>
              </div>
              <button
                onClick={() => setShowPicker(false)}
                className="h-6 w-6 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center transition-colors cursor-pointer shadow-sm border-none"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
            </div>

            {/* Photo Grid */}
            <div className="p-3.5 space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                {bannerPhotos.slice(0, 6).map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => changePhoto(idx)}
                    className={`relative rounded-xl overflow-hidden h-[58px] cursor-pointer group transition-all border-none p-0 ${
                      bannerIndex === idx
                        ? 'ring-2 ring-primary ring-offset-1 ring-offset-background'
                        : 'hover:ring-2 hover:ring-primary/40'
                    }`}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      draggable={false}
                     width={100} height={100} unoptimized />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/5 transition-all" />
                    <span className="absolute bottom-1 left-0 right-0 text-center text-[12px] font-bold text-white drop-shadow-md">
                      {photo.label}
                    </span>
                    {bannerIndex === idx && (
                      <div className="absolute top-1 right-1 h-3.5 w-3.5 bg-primary rounded-full flex items-center justify-center shadow">
                        <LuCheck className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Standalone Bing Image Mode box below */}
              <button
                onClick={() => changePhoto(6)}
                className={`w-full relative rounded-xl overflow-hidden h-[46px] cursor-pointer group flex items-center justify-between px-3 border transition-colors ${
                  bannerIndex === 6
                    ? 'ring-2 ring-primary ring-offset-1 ring-offset-background bg-primary/10 border-primary/30'
                    : 'hover:bg-muted/55 border-border/60 bg-background/25'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg overflow-hidden bg-muted relative shrink-0">
                    <Image
                      src={bannerPhotos[6].url}
                      alt="Bing"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      draggable={false}
                     width={100} height={100} unoptimized />
                    <div className="absolute inset-0 bg-black/25" />
                  </div>
                  <span className="text-[12px] font-bold text-foreground">
                    Mode Bing Image
                  </span>
                </div>
                {bannerIndex === 6 && (
                  <div className="flex -space-x-2 mr-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-card z-10">
                    <LuCheck className="w-3 h-3 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: 'Total Lamaran',
            value: (applications || []).length,
            icon: Briefcase,
            color: 'text-foreground border-blue-500/20',
            tab: 'lamaran',
          },
          {
            title: 'Tawaran Kerja',
            value: 3, // Mock chat count
            icon: Inbox,
            color: 'text-foreground border-emerald-500/20',
            tab: 'tawaran',
          },
          {
            title: 'Kekuatan Profil',
            value: `${profileStrength}%`,
            icon: Award,
            color: 'text-foreground border-purple-500/20',
            tab: 'profile',
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className="p-4 md:p-5 flex flex-col justify-between border border-border/80 hover:border-primary/40 transition-all shadow-sm hover:shadow-md cursor-pointer group"
              onClick={() => onNavigate(stat.tab)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl border ${stat.color} shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-4">
                <span className="text-xl md:text-2xl font-black text-foreground">
                  {stat.value}
                </span>
                <span className="text-[12px] font-bold text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all inline-flex items-center">
                  Detail <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Applications Listing with Search and Scroll */}
        <div className="lg:col-span-2 bg-card border border-border/70 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <span className="font-semibold text-sm text-foreground block">
              Lamaran Saya
            </span>
             <div className="relative flex items-center w-full sm:max-w-[240px]">
               <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
               <input
                 type="text"
                 placeholder="Cari lamaran"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary"
               />
             </div>
          </div>

          {/* Fixed Height Scroll Container (height set to fit 9 items neatly, approx 450px) */}
          <div className="overflow-y-auto pr-1 smooth-scroll h-[450px] space-y-2.5">
            {(() => {
              const filteredApps = (applications || []).filter(
                (app) =>
                  app.jobTitle
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  app.company.toLowerCase().includes(searchQuery.toLowerCase()),
              );

              if (filteredApps.length === 0) {
                return (
                  <div className="text-center py-12 text-xs text-muted-foreground font-medium">
                    Tidak ada lamaran yang ditemukan.
                  </div>
                );
              }

              return filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 bg-background/30 border border-border/60 rounded-xl hover:bg-background/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 bg-white border border-border/70 rounded-xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs relative">
                      {app.logo ? (
                        <Image
                          src={app.logo}
                          alt={app.company}
                          className="w-full h-full object-contain"
                         width={100} height={100} unoptimized />
                      ) : (
                        <LuBuilding2 className="w-5 h-5 text-muted-foreground" />
                      )}
                      {app.status === 'Lulus' && (
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full w-4 h-4 flex items-center justify-center border-2 border-card text-[12px] text-white">
                          <LuCheck className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-foreground block truncate">
                        {app.jobTitle}
                      </span>
                      <span className="text-[12px] text-muted-foreground font-medium block mt-1">
                        {app.company} • Melamar pada {app.date || '-'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[12px] font-bold px-2 py-0.5 rounded shrink-0 select-none flex items-center gap-1 ${
                      app.status === 'Interview'
                        ? 'bg-blue-500/10 text-blue-500'
                        : app.status === 'Lulus'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : app.status === 'Belum lulus'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-sky-500/10 text-sky-500'
                    }`}
                  >
                    {app.status === 'Interview' && (
                      <Clock className="h-3 w-3" />
                    )}
                    {app.status === 'Lulus' && (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    {app.status === 'Belum lulus' && (
                      <XCircle className="h-3 w-3" />
                    )}
                    <span>
                      {app.status === 'Pending' ? 'Baru' : app.status}
                    </span>
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Right Column: Profile Completeness Checklist */}
        <div className="space-y-6">
          <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-sm space-y-4">
            <span className="font-semibold text-sm text-foreground tracking-tight block">
              Kekuatan Profil Kamu
            </span>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px] font-bold mb-2.5">
                <span
                  className={`${
                    profileStrength === 100
                      ? 'text-emerald-500'
                      : 'text-primary'
                  } opacity-80`}
                >
                  {profileStrength}% Selesai
                </span>
                <span
                  className={
                    profileStrength === 100
                      ? 'text-emerald-500'
                      : 'text-muted-foreground'
                  }
                >
                  {profileStrength === 100
                    ? <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Profil Sempurna!</span>
                    : profileStrength >= 80
                      ? <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Sudah Dilirik Rekruter</span>
                      : 'Minimal 80% Dilirik Rekruter'}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    profileStrength === 100
                      ? 'bg-linear-to-r from-emerald-400 to-emerald-600'
                      : profileStrength >= 80
                        ? 'bg-linear-to-r from-blue-500 to-indigo-600'
                        : 'bg-linear-to-r from-orange-400 to-orange-500'
                  }`}
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3 pt-2">
              {[
                { label: 'Informasi Kontak WhatsApp', done: !!user.waNumber },
                { label: 'Pendidikan Terakhir', done: !!(user.education && user.education.length > 0) },
                { label: 'Pengalaman Kerja', done: !!(user.experience && user.experience.length > 0) },
                { label: 'Unggah Berkas Resume CV', done: !!user.resume },
                { label: 'Deskripsi Tentang Saya', done: !!user.aboutMe },
                {
                  label: 'Tambahkan Keahlian / Skill',
                  done: user.skill && user.skill.length > 0,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs font-medium mt-1"
                >
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                  )}
                  <span
                    className={
                      item.done
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground font-semibold'
                    }
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {profileStrength < 100 && (
              <Button
                onClick={() => onNavigate('profile')}
                className="w-full h-9 text-xs font-bold cursor-pointer mt-2"
              >
                Lengkapi Profil
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
