'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Shield, 
  User, 
  Pencil, 
  AlertTriangle, 
  Check, 
  X,
  Phone,
  Lock,
  ChevronRight,
  MessageSquareQuote,
  Trash2,
  Moon,
  Sun
} from 'lucide-react';

export default function DashboardSettings() {
  const { settings, updateSettings, user, updateProfile, logout, theme, setTheme } = useAppStore();
  const [mounted, setMounted] = useState(false);
  
  // Email edit state
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  
  // WhatsApp edit state
  const [waNumber, setWaNumber] = useState('');
  const [isEditingWa, setIsEditingWa] = useState(false);
  
  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Language state
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  // Notification states (harian, mingguan)
  const [dailyNotif, setDailyNotif] = useState(true);
  const [weeklyNotif, setWeeklyNotif] = useState(true);

  // Testimonial state
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [testimonialText, setTestimonialText] = useState('');

  useEffect(() => {
    setMounted(true);
    if (user) {
      setWaNumber(user.waNumber || '6285646831030');
      setEmail(user.email || '');
    }
  }, [user]);

  if (!mounted || !user) return null;

  const handleSaveEmail = () => {
    if (!email.trim()) {
      alert('Email tidak boleh kosong');
      return;
    }
    updateProfile({ email: email.trim() });
    setIsEditingEmail(false);
    alert('Email berhasil diperbarui!');
  };

  const handleSaveWa = () => {
    if (!waNumber.trim()) {
      alert('Nomor WhatsApp tidak boleh kosong');
      return;
    }
    updateProfile({ waNumber: waNumber.trim() });
    setIsEditingWa(false);
    alert('Nomor WhatsApp berhasil diperbarui!');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Semua kolom kata sandi wajib diisi');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Konfirmasi kata sandi baru tidak cocok');
      return;
    }
    alert('Kata sandi berhasil diubah!');
    setIsChangingPassword(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveTestimonial = () => {
    if (!testimonialText.trim()) {
      alert('Testimoni tidak boleh kosong');
      return;
    }
    alert('Terima kasih atas testimoni Anda!');
    setIsEditingTestimonial(false);
  };

  const handleDeleteAccount = () => {
    const confirmDelete = confirm(
      'Apakah Anda yakin ingin menghapus akun Anda secara permanen? Semua data profil, lamaran kerja, dan chat tidak akan bisa dikembalikan.',
    );
    if (confirmDelete) {
      logout();
      alert('Akun Anda telah berhasil dihapus secara permanen.');
      window.location.href = '/';
    }
  };

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-6 shadow-md flex flex-col h-[880px] overflow-hidden animate-in fade-in duration-300">
      <div className="space-y-1 pb-4 border-b shrink-0 mb-4">
        <h2 className="text-base font-extrabold text-foreground tracking-tight">
          Pengaturan
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 smooth-scroll space-y-3.5 pb-1 pt-1.5">
        
        {/* Account Info Group Box */}
        <div className="border border-border/70 bg-card rounded-xl overflow-hidden divide-y divide-border/60 shadow-xs">
          
          {/* Email Row */}
          <div className="p-3.5 flex items-center justify-between gap-5">
            <div className="space-y-0.5 flex-1 pr-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Email
              </span>
              {isEditingEmail ? (
                <div className="flex items-center gap-1.5 mt-1 max-w-sm">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEmail}
                    className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors cursor-pointer"
                    title="Simpan"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingEmail(false);
                      setEmail(user.email || '');
                    }}
                    className="p-1.5 bg-muted hover:bg-muted/85 text-muted-foreground rounded-lg transition-colors cursor-pointer"
                    title="Batal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-foreground block">
                  {email}
                </span>
              )}
            </div>
            {!isEditingEmail && (
              <button
                onClick={() => setIsEditingEmail(true)}
                className="text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer shrink-0"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* WhatsApp Row */}
          <div className="p-3.5 flex items-center justify-between gap-5">
            <div className="space-y-0.5 flex-1 pr-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                WhatsApp
              </span>
              {isEditingWa ? (
                <div className="flex items-center gap-1.5 mt-1 max-w-sm">
                  <Input
                    type="text"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="h-8 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveWa}
                    className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors cursor-pointer"
                    title="Simpan"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingWa(false);
                      setWaNumber(user.waNumber || '');
                    }}
                    className="p-1.5 bg-muted hover:bg-muted/85 text-muted-foreground rounded-lg transition-colors cursor-pointer"
                    title="Batal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-foreground block">
                  {waNumber}
                </span>
              )}
            </div>
            {!isEditingWa && (
              <button
                onClick={() => setIsEditingWa(true)}
                className="text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer shrink-0"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Kata Sandi Row */}
          <div className="p-3.5">
            {isChangingPassword ? (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-2.5 pt-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Ubah Kata Sandi
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <Input
                    type="password"
                    placeholder="Kata Sandi Lama"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    type="password"
                    placeholder="Kata Sandi Baru"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    type="password"
                    placeholder="Konfirmasi Kata Sandi Baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] cursor-pointer px-3"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setOldPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit" size="sm" className="h-7 text-[10px] cursor-pointer px-3">
                    Simpan Kata Sandi
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Kata Sandi
                  </span>
                  <span className="text-xs font-semibold text-foreground block">
                    ••••••••
                  </span>
                </div>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer shrink-0"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Language Settings */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-xs md:text-sm text-foreground">
            Bahasa
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {([
              { id: 'id', label: 'Bahasa Indonesia', code: 'ID' },
              { id: 'en', label: 'English',           code: 'US' },
            ] as const).map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all h-10 ${
                  language === lang.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border/60 hover:bg-muted/20 hover:border-border'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-extrabold text-foreground/60 tracking-wider shrink-0 w-4 text-left">{lang.code}</span>
                  <div className="h-3 w-[1px] bg-border/80 shrink-0" />
                  <span className="text-xs font-semibold text-foreground truncate ml-1">{lang.label}</span>
                </div>
                {/* Always reserve space for check icon */}
                <Check className={`h-3.5 w-3.5 shrink-0 transition-opacity ${language === lang.id ? 'text-primary opacity-100' : 'opacity-0'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Theme Settings */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-xs md:text-sm text-foreground">
            Tema
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'white',    label: 'White Light',      bg: '#F9F9F7', primary: '#4B5FFA', dark: false },
              { id: 'dark',     label: 'Black Dark',       bg: '#020617', primary: '#5C6EF8', dark: true  },
              { id: 'darkblue', label: 'Dark Blue',        bg: '#0C1020', primary: '#5C6EF8', dark: true  },
              { id: 'teal',     label: 'Teal Dark',        bg: '#041E1A', primary: '#17E4C3', dark: true  },
              { id: 'charcoal', label: 'Charcoal Minimal', bg: '#150A1C', primary: '#9B5FD4', dark: true  },
              { id: 'burgundy', label: 'Burgundy',         bg: '#120508', primary: '#E03060', dark: true  },
            ] as const).map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer group ${
                    isActive
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border/60 hover:border-primary/50 hover:bg-muted/30'
                  }`}
                >
                  {/* Swatch */}
                  <div
                    className="w-full h-9 rounded-lg overflow-hidden relative flex items-center justify-center shadow-xs"
                    style={{ background: t.bg }}
                  >
                    {/* Mini card preview */}
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background: t.primary }}
                    />
                    {isActive && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check
                          className="h-4 w-4 drop-shadow-sm"
                          style={{ color: t.dark ? '#fff' : '#000' }}
                        />
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-semibold tracking-wide leading-none ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-xs md:text-sm text-foreground">
            Pengaturan Notifikasi
          </h3>

          <div className="border border-border/70 bg-card rounded-xl overflow-hidden divide-y divide-border/60 shadow-xs">
            {/* Daily Notif */}
            <div className="p-3.5 flex items-center justify-between gap-5">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  Notifikasi Rekomendasi Loker Harian
                </span>
                <span className="text-[10px] md:text-[11px] text-muted-foreground font-medium block leading-normal">
                  Terima email pemberitahuan harian dari loker.id jika ada rekomendasi loker yang sesuai dengan minatmu
                </span>
              </div>
              {/* Custom Toggle Switch */}
              <button
                onClick={() => setDailyNotif(!dailyNotif)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  dailyNotif ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    dailyNotif ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Weekly Notif */}
            <div className="p-3.5 flex items-center justify-between gap-5">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  Notifikasi Rekomendasi Loker Mingguan
                </span>
                <span className="text-[10px] md:text-[11px] text-muted-foreground font-medium block leading-normal">
                  Terima email pemberitahuan mingguan dari loker.id jika ada rekomendasi loker yang sesuai dengan minatmu
                </span>
              </div>
              {/* Custom Toggle Switch */}
              <button
                onClick={() => setWeeklyNotif(!weeklyNotif)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  weeklyNotif ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    weeklyNotif ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-2 font-sans pt-2">
          <h3 className="font-semibold text-xs md:text-sm text-rose-500">
            Danger Zone
          </h3>

          <div className="border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 p-3.5 rounded-xl flex items-center justify-between shadow-xs transition-colors">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
              <div>
                <span className="text-[11px] md:text-xs font-bold text-rose-500 block">
                  Hapus akun secara permanen
                </span>
                <span className="text-[9px] md:text-[10px] text-rose-500/80 font-medium block mt-1">
                  Semua data Anda (lamaran, chat, profil) akan dihapus selamanya.
                </span>
              </div>
            </div>
            <Button
              onClick={handleDeleteAccount}
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer font-bold px-3"
            >
              Hapus Akun
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
