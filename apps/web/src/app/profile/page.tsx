'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Coins,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoggedIn } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-stone-100 flex items-center justify-center">
          <p className="text-stone-500 font-bold animate-pulse">
            Loading Profile...
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-100 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-black pb-6 mb-8">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                <span>👤 Profil Saya</span>
              </h1>
              <p className="text-stone-500 font-bold text-xs mt-1">
                Kelola informasi pribadi dan status pencarian kerja Anda.
              </p>
            </div>
            <div className="bg-amber-400 border-2 border-black px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_black] flex items-center gap-2">
              <Coins className="h-5 w-5 text-black" />
              <span className="font-black text-sm text-black">
                {user.coins || 0} Koin
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Avatar & Summary */}
            <div className="flex flex-col items-center text-center p-6 bg-stone-50 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_black]">
              <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-black shadow-[3px_3px_0px_0px_black] mb-4 bg-stone-200">
                <img
                  src={user.profileImage || '/images/avatar.svg'}
                  alt="avatar"
                  className="w-full h-full object-cover grayscale"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                  }}
                />
              </div>
              <h4 className="font-black text-lg uppercase leading-none tracking-tight">
                {user.name || 'N/A'}
              </h4>
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mt-1.5 bg-black text-white px-2 py-0.5 rounded border border-black">
                {user.role}
              </p>
              <p className="text-xs text-stone-500 font-bold mt-4">
                Bergabung sejak Mei 2026
              </p>
            </div>

            {/* Right Column: Detailed Info Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-stone-50 border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_0px_black] flex flex-col justify-center">
                <label className="text-[8px] font-black uppercase text-stone-400 mb-0.5">
                  👤 Nama Lengkap
                </label>
                <span className="font-black text-sm text-black">
                  {user.name || '-'}
                </span>
              </div>
              <div className="bg-stone-50 border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_0px_black] flex flex-col justify-center">
                <label className="text-[8px] font-black uppercase text-stone-400 mb-0.5">
                  🎂 Nomor WA
                </label>
                <span className="font-black text-sm text-black">
                  {user.waNumber || '-'}
                </span>
              </div>
              <div className="bg-stone-50 border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_0px_black] flex flex-col justify-center">
                <label className="text-[8px] font-black uppercase text-stone-400 mb-0.5">
                  💼 Karir / Posisi
                </label>
                <span className="font-black text-sm text-black">
                  {user.career || '-'}
                </span>
              </div>
              <div className="bg-stone-50 border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_0px_black] flex flex-col justify-center">
                <label className="text-[8px] font-black uppercase text-stone-400 mb-0.5">
                  ✉️ Alamat Email
                </label>
                <span className="font-black text-xs text-black break-all">
                  {user.email}
                </span>
              </div>
              <div className="bg-stone-50 border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_0px_black] flex flex-col justify-center md:col-span-2">
                <label className="text-[8px] font-black uppercase text-stone-400 mb-0.5">
                  🎓 Pendidikan
                </label>
                <span className="font-black text-xs text-black leading-relaxed">
                  {user.education || '-'}
                </span>
              </div>
              <div className="bg-stone-50 border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_0px_black] flex flex-col justify-center md:col-span-2">
                <label className="text-[8px] font-black uppercase text-stone-400 mb-0.5">
                  🛠️ Pengalaman
                </label>
                <span className="font-black text-xs text-black leading-relaxed">
                  {user.experience || '-'}
                </span>
              </div>
              <div className="bg-stone-50 border-2 border-dashed border-black/20 p-4 rounded-xl flex flex-col justify-center md:col-span-2">
                <label className="text-[8px] font-black uppercase text-stone-400 mb-0.5">
                  🔑 ID Pengguna
                </label>
                <span className="font-mono text-[9px] text-stone-500 select-all">
                  {(() => {
                    if (!user.email) return 'N/A';
                    try {
                      return btoa(user.email).substring(0, 16);
                    } catch (e) {
                      return user.email.substring(0, 16);
                    }
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
