'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/store';
import useAuth from '@/hooks/useAuth';
import {
  LuX as X,
  LuMail as Mail,
  LuPhone as Phone,
  LuUser as User,
  LuShield as Shield,
  LuInfo as Info,
  LuArrowRight as ArrowRight,
  LuSearch as Search,
  LuBuilding2 as Building2,
} from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    setAuthModal,
    forgotEmail,
  } = useAppStore();
  const { login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setAuthModal(false);
    setError(null);
    setSuccessMsg(null);
    setEmail('');
    setName('');
    setWaNumber('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const mockEmail = role === 'admin' ? 'recruiter@example.com' : 'budi.santoso@example.com';
    setError(null);
    setLoading(true);
    try {
      await login({ email: mockEmail, role });
      handleClose();
    } catch (err) {
      setError('Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !waNumber.trim()) {
      setError('Semua field wajib diisi');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        waNumber: waNumber.trim(),
        role: role,
      });
      handleClose();
    } catch (err) {
      setError('Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waNumber.trim()) {
      setError('Nomor WhatsApp wajib diisi');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const foundEmail = await forgotEmail(waNumber.trim());
      if (foundEmail) {
        setSuccessMsg(`Email Anda yang terdaftar adalah: ${foundEmail}`);
      } else {
        setError('Nomor WhatsApp tidak terdaftar.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memproses.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden z-10 animate-in zoom-in-95 duration-250">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer border-none"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Tab content */}
        {authModalTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5 text-center sm:text-left">
              <h2 className="text-xl font-black text-foreground tracking-tight">Selamat Datang Kembali</h2>
              <p className="text-xs text-muted-foreground">Masuk untuk mencari loker impian Anda</p>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-xs flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Masuk Sebagai</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'user'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Search className="w-4 h-4 shrink-0" /> Pencari Kerja
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'admin'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0" /> Pembuat Kerja
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-10 rounded-xl font-bold text-xs gap-1.5 cursor-pointer">
              {loading ? 'Sedang Masuk...' : 'Masuk Sekarang'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>

            <div className="text-center text-xs text-muted-foreground mt-4">
              <p>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => { setError(null); setAuthModal(true, 'register'); }}
                  className="font-bold text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Daftar di sini
                </button>
              </p>
            </div>
          </form>
        )}

        {authModalTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5 text-center sm:text-left">
              <h2 className="text-xl font-black text-foreground tracking-tight">Buat Akun Baru</h2>
              <p className="text-xs text-muted-foreground">Mulai langkah karir baru Anda hari ini</p>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-xs flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-10 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Alamat Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-10 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Nomor WhatsApp (e.g. 08123456789)"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  className="pl-9 h-10 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Peran Anda</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'user'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Search className="w-4 h-4 shrink-0" /> Pencari Kerja
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'admin'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0" /> Pembuat Kerja
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-10 rounded-xl font-bold text-xs gap-1.5 mt-2 cursor-pointer">
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>

            <div className="text-center text-xs text-muted-foreground mt-4">
              <p>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => { setError(null); setAuthModal(true, 'login'); }}
                  className="font-bold text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Masuk di sini
                </button>
              </p>
            </div>
          </form>
        )}

        {authModalTab === 'forgot-email' && (
          <form onSubmit={handleForgotEmail} className="space-y-5">
            <div className="space-y-1.5 text-center sm:text-left">
              <h2 className="text-xl font-black text-foreground tracking-tight">Cari Email Terdaftar</h2>
              <p className="text-xs text-muted-foreground">Masukkan nomor WhatsApp Anda untuk menemukan email Anda</p>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-xs flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Nomor WhatsApp terdaftar"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  className="pl-9 h-10 text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-10 rounded-xl font-bold text-xs cursor-pointer">
              {loading ? 'Mencari...' : 'Cari Email Saya'}
            </Button>

            <div className="text-center text-xs text-muted-foreground mt-4">
              <p>
                <button
                  type="button"
                  onClick={() => { setError(null); setSuccessMsg(null); setAuthModal(true, 'login'); }}
                  className="font-bold text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Kembali ke Halaman Masuk
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
