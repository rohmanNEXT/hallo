'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  LuBell as Bell, 
  LuShield as Shield, 
  LuUser as User, 
  LuPencil as Pencil, 
  LuTriangleAlert as AlertTriangle, 
  LuCheck as Check, 
  LuX as X,
  LuPhone as Phone,
  LuLock as Lock,
  LuChevronRight as ChevronRight,
  LuMessageSquareQuote as MessageSquareQuote,
  LuTrash2 as Trash2,
  LuMoon as Moon,
  LuSun as Sun,
  LuInfo as Info
} from 'react-icons/lu';
import { Card } from '@/components/ui/card';

export default function DashboardSettings() {
  const { settings, updateSettings, user, updateProfile, logout, theme, setTheme } = useAppStore();
  const [mounted, setMounted] = useState(false);
  
  // Edit & Change Mode States
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingWa, setIsEditingWa] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Language state
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  // Notification states (harian, mingguan)
  const [dailyNotif, setDailyNotif] = useState(true);
  const [weeklyNotif, setWeeklyNotif] = useState(true);

  // Toast state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Formiks
  const emailFormik = useFormik({
    initialValues: { email: user?.email || '' },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email('Format email tidak valid').required('Email wajib diisi'),
    }),
    onSubmit: (values) => {
      updateProfile({ email: values.email.trim() });
      setIsEditingEmail(false);
      showToast('Email berhasil diperbarui!', 'success');
    }
  });

  const waFormik = useFormik({
    initialValues: { waNumber: user?.waNumber || '' },
    enableReinitialize: true,
    validationSchema: Yup.object({
      waNumber: Yup.string().required('Nomor WhatsApp wajib diisi'),
    }),
    onSubmit: (values) => {
      updateProfile({ waNumber: values.waNumber.trim() });
      setIsEditingWa(false);
      showToast('Nomor WhatsApp berhasil diperbarui!', 'success');
    }
  });

  const passwordFormik = useFormik({
    initialValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Kata sandi lama wajib diisi'),
      newPassword: Yup.string().required('Kata sandi baru wajib diisi').min(6, 'Minimal 6 karakter'),
      confirmPassword: Yup.string()
        .required('Konfirmasi kata sandi wajib diisi')
        .oneOf([Yup.ref('newPassword')], 'Konfirmasi kata sandi tidak cocok'),
    }),
    onSubmit: (values) => {
      showToast('Kata sandi berhasil diubah!', 'success');
      setIsChangingPassword(false);
      passwordFormik.resetForm();
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) return null;

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-6 shadow-md flex flex-col h-[882px] overflow-hidden animate-in fade-in duration-300">
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
                <form onSubmit={emailFormik.handleSubmit} className="flex flex-col gap-1 mt-1 max-w-sm">
                  <div className="flex items-center gap-1.5">
                    <Input
                      name="email"
                      type="email"
                      value={emailFormik.values.email}
                      onChange={emailFormik.handleChange}
                      onBlur={emailFormik.handleBlur}
                      className="h-8 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors cursor-pointer"
                      title="Simpan"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingEmail(false);
                        emailFormik.resetForm();
                      }}
                      className="p-1.5 bg-muted hover:bg-muted/85 text-muted-foreground rounded-lg transition-colors cursor-pointer"
                      title="Batal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {emailFormik.touched.email && emailFormik.errors.email && (
                    <span className="text-[10px] text-rose-500 font-bold">{emailFormik.errors.email}</span>
                  )}
                </form>
              ) : (
                <span className="text-xs font-semibold text-foreground block">
                  {emailFormik.values.email}
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
                <form onSubmit={waFormik.handleSubmit} className="flex flex-col gap-1 mt-1 max-w-sm">
                  <div className="flex items-center gap-1.5">
                    <Input
                      name="waNumber"
                      type="text"
                      value={waFormik.values.waNumber}
                      onChange={waFormik.handleChange}
                      onBlur={waFormik.handleBlur}
                      className="h-8 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors cursor-pointer"
                      title="Simpan"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingWa(false);
                        waFormik.resetForm();
                      }}
                      className="p-1.5 bg-muted hover:bg-muted/85 text-muted-foreground rounded-lg transition-colors cursor-pointer"
                      title="Batal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {waFormik.touched.waNumber && waFormik.errors.waNumber && (
                    <span className="text-[10px] text-rose-500 font-bold">{waFormik.errors.waNumber}</span>
                  )}
                </form>
              ) : (
                <span className="text-xs font-semibold text-foreground block">
                  {waFormik.values.waNumber}
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
              <form onSubmit={passwordFormik.handleSubmit} className="space-y-2.5 pt-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Ubah Kata Sandi
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <Input
                      type="password"
                      name="oldPassword"
                      placeholder="Kata Sandi Lama"
                      value={passwordFormik.values.oldPassword}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      className="h-8 text-xs"
                    />
                    {passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword && (
                      <span className="text-[10px] text-rose-500 font-bold">{passwordFormik.errors.oldPassword}</span>
                    )}
                  </div>
                  <div>
                    <Input
                      type="password"
                      name="newPassword"
                      placeholder="Kata Sandi Baru"
                      value={passwordFormik.values.newPassword}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      className="h-8 text-xs"
                    />
                    {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                      <span className="text-[10px] text-rose-500 font-bold">{passwordFormik.errors.newPassword}</span>
                    )}
                  </div>
                  <div>
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Konfirmasi Kata Sandi Baru"
                      value={passwordFormik.values.confirmPassword}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      className="h-8 text-xs"
                    />
                    {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                      <span className="text-[10px] text-rose-500 font-bold">{passwordFormik.errors.confirmPassword}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] cursor-pointer px-3"
                    onClick={() => {
                      setIsChangingPassword(false);
                      passwordFormik.resetForm();
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
                  type="button"
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
                  <div className="h-3 w-px bg-border/80 shrink-0" />
                  <span className="text-xs font-semibold text-foreground truncate ml-1">{lang.label}</span>
                </div>
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
                  <span className={`text-[10px] font-semibold tracking-wide leading-none ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
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
                  {user?.role === 'admin'
                    ? 'Notifikasi Email Kandidat Baru'
                    : 'Notifikasi Rekomendasi Loker Harian'}
                </span>
                <span className="text-[10px] md:text-[12px] text-muted-foreground font-medium block leading-normal">
                  {user?.role === 'admin'
                    ? 'Kirim email pemberitahuan instan setiap kali ada kandidat baru melamar di lowongan Anda'
                    : 'Terima email pemberitahuan harian dari loker.id jika ada rekomendasi loker yang sesuai dengan minatmu'}
                </span>
              </div>
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
                  {user?.role === 'admin'
                    ? 'Rekomendasi Kandidat Mingguan'
                    : 'Notifikasi Rekomendasi Loker Mingguan'}
                </span>
                <span className="text-[10px] md:text-[12px] text-muted-foreground font-medium block leading-normal">
                  {user?.role === 'admin'
                    ? 'Dapatkan kurasi mingguan talent terbaik yang cocok untuk kriteria rekrutmen Anda'
                    : 'Terima email pemberitahuan mingguan dari loker.id jika ada rekomendasi loker yang sesuai dengan minatmu'}
                </span>
              </div>
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
                <span className="text-[12px] md:text-xs font-bold text-rose-500 block">
                  Hapus akun secara permanen
                </span>
                <span className="text-[10px] text-rose-500/80 font-medium block mt-1">
                  Semua data Anda (lamaran, chat, profil) akan dihapus selamanya.
                </span>
              </div>
            </div>
            <Button
              onClick={() => setShowConfirmDelete(true)}
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer font-bold px-3"
            >
              Hapus Akun
            </Button>
          </div>
        </div>
      </div>

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-9999 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-extrabold animate-in slide-in-from-bottom-5 duration-200 ${
          toastMessage.type === 'success'
            ? 'bg-emerald-600 text-white'
            : toastMessage.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-800 text-white'
        }`}>
          {toastMessage.type === 'success' ? (
            <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          ) : (
            <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
              <Info className="h-3 w-3 text-white" />
            </div>
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="font-extrabold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
              <span>Konfirmasi Hapus Akun</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus akun Anda secara permanen? Semua data profil, lamaran kerja, dan chat tidak akan bisa dikembalikan.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDelete(false)}
                className="h-9 text-xs font-bold px-4 rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  logout();
                  showToast('Akun Anda telah berhasil dihapus secara permanen.', 'success');
                  setTimeout(() => {
                    window.location.href = '/';
                  }, 1500);
                }}
                className="h-9 text-xs font-bold px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer"
              >
                Hapus Akun
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
