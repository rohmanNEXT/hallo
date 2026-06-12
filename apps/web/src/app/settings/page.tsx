'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  User,
  Link as LinkIcon,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [visibility, setVisibility] = useState(
    settings?.visibility || 'Public',
  );
  const [notifs, setNotifs] = useState<string[]>(settings?.notifications || []);

  useEffect(() => {
    setMounted(true);
    if (settings) {
      setVisibility(settings.visibility);
      setNotifs(settings.notifications);
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      visibility,
      notifications: notifs,
    });
    alert('Pengaturan berhasil disimpan!');
  };

  const toggleNotif = (type: string) => {
    if (notifs.includes(type)) {
      setNotifs(notifs.filter((n) => n !== type));
    } else {
      setNotifs([...notifs, type]);
    }
  };

  if (!mounted || !settings) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-stone-100 flex items-center justify-center">
          <p className="text-stone-500 font-bold animate-pulse">
            Loading Settings...
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
        <div className="max-w-3xl mx-auto bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-black pb-6 mb-8">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                <SettingsIcon className="h-7 w-7" />
                <span>Pengaturan Akun</span>
              </h1>
              <p className="text-stone-500 font-bold text-xs mt-1">
                Sesuaikan preferensi privasi, visibilitas profil, dan notifikasi
                Anda.
              </p>
            </div>
            <Button
              onClick={handleSave}
              className="bg-black hover:bg-stone-850 text-white font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] flex items-center gap-2 rounded-xl h-10 px-5"
            >
              <Save className="h-4 w-4" />
              <span>Simpan</span>
            </Button>
          </div>

          <div className="space-y-6">
            {/* Visibilitas Profil */}
            <div className="p-5 bg-stone-50 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_black] space-y-3">
              <h3 className="font-black text-sm uppercase text-black flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-blue-600" />
                Visibilitas Profil
              </h3>
              <p className="text-stone-500 text-xs font-bold leading-relaxed">
                Tentukan siapa saja yang dapat melihat profil lengkap, resume,
                dan portfolio yang telah Anda unggah.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {['Public', 'Premium Only', 'Private'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setVisibility(opt)}
                    className={`px-4 py-2 border-2 border-black text-xs font-bold rounded-xl transition-all shadow-[2px_2px_0px_0px_black] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_black] ${
                      visibility === opt
                        ? 'bg-blue-400 text-black'
                        : 'bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {opt === 'Public'
                      ? '🔓 Publik (Semua Rekruter)'
                      : opt === 'Premium Only'
                        ? '💎 Premium Only'
                        : '🔒 Privat'}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferensi Notifikasi */}
            <div className="p-5 bg-stone-50 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_black] space-y-3">
              <h3 className="font-black text-sm uppercase text-black flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-orange-500" />
                Notifikasi
              </h3>
              <p className="text-stone-500 text-xs font-bold leading-relaxed">
                Pilih jenis email dan pemberitahuan yang ingin Anda dapatkan di
                perangkat Anda.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  {
                    id: 'apply_status',
                    label: '📢 Perubahan Status Lamaran',
                    desc: 'Dapatkan pemberitahuan instan saat status lamaran Anda berubah.',
                  },
                  {
                    id: 'new_jobs',
                    label: '💼 Rekomendasi Lowongan Baru',
                    desc: 'Info berkala mengenai pekerjaan yang sesuai dengan minat dan keahlian Anda.',
                  },
                  {
                    id: 'newsletter',
                    label: '✉️ Newsletter Karir Bulanan',
                    desc: 'Tips seputar wawancara, penyusunan CV, dan perkembangan industri kerja.',
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3 bg-white border-2 border-black rounded-xl cursor-pointer hover:bg-stone-50 transition-colors select-none"
                  >
                    <input
                      type="checkbox"
                      checked={notifs.includes(item.id)}
                      onChange={() => toggleNotif(item.id)}
                      className="mt-1 h-4 w-4 border-2 border-black rounded accent-primary cursor-pointer"
                    />
                    <div>
                      <div className="font-black text-xs text-black">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Akun Terhubung */}
            <div className="p-5 bg-stone-50 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_black] space-y-3">
              <h3 className="font-black text-sm uppercase text-black flex items-center gap-2">
                <LinkIcon className="h-4.5 w-4.5 text-emerald-500" />
                Akun Terhubung
              </h3>
              <p className="text-stone-500 text-xs font-bold leading-relaxed">
                Kelola integrasi login sekali klik Anda melalui platform pihak
                ketiga.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    name: 'Google',
                    connected: settings.connectedAccounts?.includes('Google'),
                    icon: '🌐',
                  },
                  {
                    name: 'LinkedIn',
                    connected: settings.connectedAccounts?.includes('LinkedIn'),
                    icon: '💼',
                  },
                ].map((acc) => (
                  <div
                    key={acc.name}
                    className="flex items-center justify-between p-3 bg-white border-2 border-black rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{acc.icon}</span>
                      <span className="font-black text-xs text-black">
                        {acc.name}
                      </span>
                    </div>
                    <Badge
                      className={
                        acc.connected
                          ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/10'
                          : 'bg-stone-100 text-stone-400'
                      }
                    >
                      {acc.connected ? 'Terhubung' : 'Terputus'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
