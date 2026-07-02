'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LuShieldCheck as ShieldCheck } from 'react-icons/lu';

export default function ProfileTab() {
  const { user, verifyCompany } = useAppStore();
  const [nib, setNib] = useState(user?.companyVerification?.nib || '');
  const [compName, setCompName] = useState(user?.companyVerification?.name || '');
  const [compAddress, setCompAddress] = useState(user?.companyVerification?.address || '');

  if (!user) return null;

  const isVerified = user.companyVerification?.verified || false;

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nib || !compName) {
      alert('NIB dan Nama Perusahaan wajib diisi!');
      return;
    }
    verifyCompany({
      nib,
      name: compName,
      address: compAddress,
      verified: true,
    });
    alert(
      'Perusahaan Anda berhasil terverifikasi! Sekarang Anda bebas memposting lowongan pekerjaan.',
    );
  };

  return (
    <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 max-w-2xl mx-auto">
      <div>
        <h3 className="font-extrabold text-sm uppercase text-foreground flex items-center gap-1.5">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          Status Profil & Verifikasi NIB Perusahaan
        </h3>
        <p className="text-muted-foreground text-xs mt-1">
          Lengkapi legalitas Nomor Induk Berusaha (NIB) untuk mendapatkan lencana centang hijau terverifikasi di setiap postingan loker Anda.
        </p>
      </div>

      {isVerified ? (
        <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-start gap-4">
          <ShieldCheck className="h-7 w-7 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-black text-xs uppercase tracking-wide">
              Legalitas Valid & Centang Hijau Aktif!
            </h4>
            <p className="text-[12px] font-medium mt-1 leading-relaxed opacity-95">
              Nama Resmi: <strong>{user.companyVerification?.name}</strong> <br />
              NIB: <strong>{user.companyVerification?.nib}</strong> <br />
              Alamat terdaftar: {user.companyVerification?.address || 'Kantor Pusat'}
            </p>
            <p className="text-[10.5px] mt-2 italic font-semibold">
              Postingan pekerjaan Anda saat ini berstatus Tepercaya (Verified) dan mendapatkan visibilitas 2x lebih besar.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground">
              Nomor Induk Berusaha (NIB - 13 Digit)
            </label>
            <Input
              placeholder="Contoh: 1234567890123"
              value={nib}
              onChange={(e) => setNib(e.target.value)}
              className="rounded-xl bg-background border-border text-foreground"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground">
              Nama Resmi Perusahaan (Sesuai Akta)
            </label>
            <Input
              placeholder="Contoh: PT Solusi Teknologi Nusantara"
              value={compName}
              onChange={(e) => setCompName(e.target.value)}
              className="rounded-xl bg-background border-border text-foreground"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground">
              Alamat Lengkap Perusahaan
            </label>
            <Input
              placeholder="Contoh: Treasury Tower Lt. 15, SCBD Jakarta Selatan"
              value={compAddress}
              onChange={(e) => setCompAddress(e.target.value)}
              className="rounded-xl bg-background border-border text-foreground"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-foreground text-background font-bold h-10 rounded-xl mt-4 cursor-pointer hover:opacity-90 border-none"
          >
            Ajukan Verifikasi & Lengkapi Profil
          </Button>
        </form>
      )}
    </div>
  );
}
