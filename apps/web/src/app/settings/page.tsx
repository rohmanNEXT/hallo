'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';

type SectionType = 'account' | 'visibility' | 'notifications';

export default function SettingsPage() {
  const { settings, updateSettings, user, updateProfile, logout } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>('account');
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [visibility, setVisibility] = useState(
    settings?.visibility || 'Public',
  );
  const [notifs, setNotifs] = useState<string[]>(settings?.notifications || []);
  const [connected, setConnected] = useState<string[]>(
    settings?.connectedAccounts || [],
  );

  useEffect(() => {
    setMounted(true);
    if (settings) {
      setVisibility(settings.visibility);
      setNotifs(settings.notifications);
      setConnected(settings.connectedAccounts || []);
      setEmail(settings.email || user?.email || '');
    }
  }, [settings, user]);

  const handleSaveEmail = () => {
    updateSettings({
      email,
    });
    if (email && updateProfile) {
      updateProfile({ email });
    }
    setIsEditingEmail(false);
    alert('Email berhasil diperbarui!');
  };

  const handleSaveSettings = (newVisibility?: string, newNotifs?: string[]) => {
    updateSettings({
      visibility: newVisibility ?? visibility,
      notifications: newNotifs ?? notifs,
      connectedAccounts: connected,
      email,
    });
  };

  const toggleNotif = (type: string) => {
    let updatedNotifs: string[];
    if (notifs.includes(type)) {
      updatedNotifs = notifs.filter((n) => n !== type);
    } else {
      updatedNotifs = [...notifs, type];
    }
    setNotifs(updatedNotifs);
    handleSaveSettings(undefined, updatedNotifs);
  };

  const handleVisibilityChange = (val: string) => {
    setVisibility(val);
    handleSaveSettings(val, undefined);
  };

  const toggleConnect = (provider: string) => {
    let updatedConnected: string[];
    if (connected.includes(provider)) {
      updatedConnected = connected.filter((p) => p !== provider);
      setConnected(updatedConnected);
      alert(`Berhasil memutus koneksi dengan ${provider}`);
    } else {
      updatedConnected = [...connected, provider];
      setConnected(updatedConnected);
      alert(`Berhasil menghubungkan akun dengan ${provider}`);
    }
    updateSettings({
      connectedAccounts: updatedConnected,
    });
  };

  const handleDeleteAccount = () => {
    const confirmDelete = confirm(
      'Apakah Anda yakin ingin menghapus akun Anda secara permanen? Semua data profil, riwayat koin, lamaran kerja, dan chat tidak akan bisa dikembalikan.',
    );
    if (confirmDelete) {
      logout();
      alert('Akun Anda telah berhasil dihapus secara permanen.');
      window.location.href = '/';
    }
  };

  if (!mounted || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">
            Memuat Pengaturan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-10 pb-28 px-6 md:px-12 text-foreground">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Title */}
        <div className="pb-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Pengaturan
          </h1>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex border-b border-border/60 gap-8 mb-8">
          {[
            { id: 'account', label: 'Akun', icon: User },
            { id: 'visibility', label: 'Visibilitas', icon: Shield },
            { id: 'notifications', label: 'Notifikasi', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as SectionType)}
                className={`flex items-center gap-2 pb-3 text-base font-semibold transition-all border-b-2 -mb-[1px] cursor-pointer ${
                  isActive
                    ? 'text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                style={
                  isActive
                    ? {
                        borderBottomColor: 'hsl(var(--primary))',
                       }
                    : undefined
                }
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Tabs Area */}
        <div className="space-y-5 max-w-4xl">
          {activeSection === 'account' && (
            <>
              {/* Email Card */}
              <div className="border border-border/70 bg-card p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="space-y-1 flex-1 pr-4">
                  <span className="text-xs font-semibold text-muted-foreground block">
                    Email
                  </span>
                  {isEditingEmail ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-9 text-sm focus-visible:ring-1 focus-visible:ring-primary max-w-sm font-medium"
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
                          setEmail(settings?.email || user?.email || '');
                        }}
                        className="p-1.5 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors cursor-pointer"
                        title="Batal"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-foreground block">
                      {email}
                    </span>
                  )}
                </div>
                {!isEditingEmail && (
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="text-muted-foreground hover:text-primary p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <Pencil className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>

              {/* Connected Accounts Card */}
              <div className="border border-border/70 bg-card p-6 rounded-2xl shadow-sm space-y-4">
                <span className="text-xs font-semibold text-muted-foreground block">
                  Akun terhubung
                </span>
                <div className="space-y-3">
                  {[
                    {
                      name: 'Google',
                      connected: connected.includes('Google'),
                      icon: '🌐',
                    },
                    {
                      name: 'LinkedIn',
                      connected: connected.includes('LinkedIn'),
                      icon: '💼',
                    },
                    {
                      name: 'Microsoft',
                      connected: connected.includes('Microsoft'),
                      icon: '🪟',
                    },
                  ].map((acc) => (
                    <div
                      key={acc.name}
                      className="flex items-center justify-between py-1 border-b border-border/40 last:border-b-0 pb-3 last:pb-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{acc.icon}</span>
                        <span className="text-sm font-medium text-foreground">
                          {acc.name}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleConnect(acc.name)}
                        className={`cursor-pointer text-xs font-bold transition-colors ${
                          acc.connected
                            ? 'text-destructive hover:underline'
                            : 'text-primary hover:underline'
                        }`}
                      >
                        {acc.connected ? 'Putuskan' : 'Hubungkan'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delete Account Card (Danger Styling) */}
              <div className="border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 p-6 rounded-2xl flex items-center justify-between shadow-sm transition-colors">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                  <span className="text-sm font-semibold text-destructive">
                    Hapus akun secara permanen
                  </span>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="text-sm font-bold text-destructive hover:underline cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </>
          )}

          {activeSection === 'visibility' && (
            <div className="border border-border/70 bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <span className="text-xs font-semibold text-muted-foreground block">
                Siapa yang dapat melihat profil saya
              </span>
              <div className="flex flex-col gap-3 pt-1">
                {[
                  {
                    id: 'Public',
                    title: '🔓 Publik (Semua Rekruter)',
                    desc: 'Profil, resume, dan portofolio Anda dapat ditemukan oleh semua perusahaan.',
                  },
                  {
                    id: 'Premium Only',
                    title: '💎 Rekruter Premium',
                    desc: 'Hanya perusahaan premium yang dapat melihat info profil lengkap Anda.',
                  },
                  {
                    id: 'Private',
                    title: '🔒 Privat / Tersembunyi',
                    desc: 'Profil disembunyikan. Hanya perusahaan yang Anda lamar yang bisa melihat.',
                  },
                ].map((opt) => {
                  const isSelected = visibility === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleVisibilityChange(opt.id)}
                      className={`cursor-pointer p-4 border rounded-xl transition-all flex items-start gap-3 select-none ${
                        isSelected
                          ? 'bg-primary/10 border-border/80'
                          : 'bg-background/30 border-border/80 hover:bg-background/60'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => handleVisibilityChange(opt.id)}
                        className="mt-1 cursor-pointer accent-primary"
                      />
                      <div>
                        <div className="font-semibold text-xs text-foreground">
                          {opt.title}
                        </div>
                        <div className="text-[10.5px] text-muted-foreground font-medium leading-normal mt-1">
                          {opt.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="border border-border/70 bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <span className="text-xs font-semibold text-muted-foreground block">
                Notifikasi lamaran kerja & info karir
              </span>
              <div className="space-y-3 pt-1">
                {[
                  {
                    id: 'apply_status',
                    label: 'Perubahan Status Lamaran Kerja',
                    desc: 'Notifikasi saat status lamaran kerja Anda diperbarui rekruter.',
                  },
                  {
                    id: 'new_jobs',
                    label: 'Rekomendasi Lowongan Kerja Baru',
                    desc: 'Notifikasi berkala mengenai lowongan kerja baru yang cocok.',
                  },
                  {
                    id: 'newsletter',
                    label: 'Newsletter Tips Karir & CV',
                    desc: 'Tips berkala wawancara, pembuatan CV, dan tren karir terbaru.',
                  },
                ].map((item) => {
                  const isChecked = notifs.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleNotif(item.id)}
                      className={`cursor-pointer p-4 border rounded-xl transition-all flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-primary/10 border-border/80'
                          : 'bg-background/30 border-border/80 hover:bg-background/60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleNotif(item.id)}
                        className="mt-1 h-4 w-4 border border-border/80 rounded accent-primary cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <div className="font-semibold text-xs text-foreground">
                          {item.label}
                        </div>
                        <div className="text-[10.5px] text-muted-foreground font-medium leading-normal mt-1">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
