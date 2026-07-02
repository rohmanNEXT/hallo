'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LuSparkles as Sparkles,
  LuArrowRight as ArrowRight,
  LuCoins as CoinsIcon,
  LuSearch as SearchIcon,
  LuMail as MailIcon,
  LuBuilding2 as BuildingIcon,
} from 'react-icons/lu';

const CustomCoinsIcon = () => (
  <CoinsIcon className="h-5 w-5 text-amber-500 animate-pulse" />
);
const CustomSearchIcon = () => <SearchIcon className="h-5 w-5 text-primary" />;
const CustomMailIcon = () => <MailIcon className="h-5 w-5 text-indigo-500" />;
const CustomBuildingIcon = () => (
  <BuildingIcon className="h-5 w-5 text-emerald-500" />
);

export default function CoinCreditTab() {
  const { user, buyCoins, updateProfile } = useAppStore();
  const [customCoins, setCustomCoins] = useState('');
  const [showCustomInputInCard, setShowCustomInputInCard] = useState(false);

  if (!user) return null;

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-6 shadow-md flex flex-col h-[880px] overflow-hidden animate-in fade-in duration-300">
      <div className="space-y-1 pb-4 border-b shrink-0 mb-4">
        <h2 className="text-base font-extrabold text-foreground tracking-tight">
          Coin & Credit
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 smooth-scroll space-y-6 pb-1 pt-1.5">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-50/80 via-slate-50 to-white dark:from-emerald-950 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 border border-emerald-500/20 shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CustomCoinsIcon />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-foreground mt-2">
                Saldo Koin Pekerjaan
              </h3>
              <p className="text-muted-foreground text-xs">
                Gunakan koin Anda untuk mengaktifkan add-on rekrutmen eksklusif.
              </p>
            </div>
            <div className="bg-card/60 backdrop-blur-md border border-border/80 rounded-xl p-2 sm:px-3.5 flex items-center gap-2.5 shadow-sm shrink-0">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 scale-90">
                <CustomCoinsIcon />
              </div>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block leading-none">
                  Saldo Anda
                </span>
                <span className="text-sm font-black text-amber-500 tracking-tight leading-none mt-1 block">
                  {user.coins || 0} Koin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Packages */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">
              Beli Paket Koin
            </h4>
            <span className="text-[10px] font-medium text-muted-foreground/80">
              Rp 1.000 / Koin
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { amount: 25, cost: 25000, desc: 'Starter Coin Pack' },
              { amount: 100, cost: 100000, desc: 'Popular Coin Pack' },
              { amount: 300, cost: 300000, desc: 'Value Coin Pack' },
            ].map((pack, idx) => (
              <div
                key={idx}
                className="border border-border/60 p-5 rounded-2xl flex flex-col justify-between h-44 bg-card/40 hover:bg-card/80 hover:border-emerald-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  buyCoins(pack.amount, pack.cost);
                  alert(
                    `Top up ${pack.amount} koin sukses! Saldo Anda sekarang bertambah.`,
                  );
                }}
              >
                <div>
                  <span className="inline-flex items-center justify-center p-2 rounded-xl bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors">
                    <CustomCoinsIcon />
                  </span>
                  <h5 className="font-black text-base text-foreground mt-3">
                    {pack.amount} Koin
                  </h5>
                  <p className="text-[9px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">
                    {pack.desc}
                  </p>
                </div>
                <Button className="w-full text-xs font-extrabold h-9 rounded-xl cursor-pointer mt-4 flex items-center justify-center gap-1">
                  <span>Rp {pack.cost.toLocaleString('id-ID')}</span>
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Button>
              </div>
            ))}

            {showCustomInputInCard ? (
              <div className="border border-emerald-500/40 p-4 rounded-2xl flex flex-col justify-between h-44 bg-card/90 shadow-xl animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-muted-foreground block tracking-wider">
                    Jumlah Koin Kustom
                  </label>
                  <Input
                    type="number"
                    placeholder="Min. 1"
                    value={customCoins}
                    onChange={(e) => setCustomCoins(e.target.value)}
                    className="h-8 text-xs bg-background/50 font-bold border-border rounded-lg"
                    min="1"
                    autoFocus
                  />
                  <span className="text-[11px] font-black text-emerald-500 block mt-1">
                    {customCoins && Number(customCoins) > 0
                      ? `Rp ${(Number(customCoins) * 1000).toLocaleString('id-ID')}`
                      : 'Rp 0'}
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCustomInputInCard(false);
                    }}
                    className="flex-1 text-[10px] font-bold h-8 rounded-lg border border-border/80 bg-background hover:bg-muted cursor-pointer transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const coinsNum = Number(customCoins);
                      if (!coinsNum || coinsNum <= 0) {
                        alert(
                          'Jumlah koin wajib diisi dan lebih besar dari 0!',
                        );
                        return;
                      }
                      buyCoins(coinsNum, coinsNum * 1000);
                      alert(
                        `Top up ${coinsNum} koin sukses! Saldo Anda sekarang bertambah.`,
                      );
                      setCustomCoins('');
                      setShowCustomInputInCard(false);
                    }}
                    className="flex-1 text-[10px] font-bold h-8 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer border-none transition-colors"
                  >
                    Beli
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="border border-border/60 p-5 rounded-2xl flex flex-col justify-between h-44 bg-card/40 hover:bg-card/80 hover:border-emerald-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
                onClick={() => setShowCustomInputInCard(true)}
              >
                <div>
                  <span className="inline-flex items-center justify-center p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <CustomCoinsIcon />
                  </span>
                  <h5 className="font-black text-base text-foreground mt-3">
                    Custom Koin
                  </h5>
                  <p className="text-[9px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">
                    Beli Sesuai Kebutuhan
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="w-full text-xs font-extrabold h-9 rounded-xl cursor-pointer mt-4 flex items-center justify-center gap-1"
                >
                  <span>Beli Kustom</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Tukar Add-on */}
        <div className="space-y-4">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">
            Tukarkan Koin untuk Add-on
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Unlock Detail Profil & CV di Talent Search',
                cost: 200,
                desc: 'Buka kontak lengkap, email, nomor Whatsapp, dan download file CV kandidat di pencarian talent (per kontak).',
                icon: <CustomSearchIcon />,
              },
              {
                title: '20 Job Invitation',
                cost: 60,
                desc: 'Undang 20 talent pilihan untuk melamar di lowongan aktif Anda (per bulan).',
                icon: <CustomMailIcon />,
              },
              {
                title: 'Company Profile Advance',
                cost: 50,
                desc: 'Kustomisasi halaman profil perusahaan dengan banner, galeri, dan pekerja (per bulan).',
                icon: <CustomBuildingIcon />,
              },
            ].map((addon, idx) => (
              <div
                key={idx}
                className="border border-border/60 p-5 rounded-2xl flex flex-col justify-between min-h-[230px] h-full bg-card/30 hover:bg-card/70 hover:border-emerald-500/20 hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="p-2 rounded-xl bg-background/50 border border-border/40 group-hover:bg-background transition-colors">
                      {addon.icon}
                    </span>
                    <span className="text-[10px] font-bold text-amber-500 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      {addon.cost} Koin
                    </span>
                  </div>
                  <h5 className="font-bold text-[13px] text-foreground leading-snug mt-3">
                    {addon.title}
                  </h5>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1.5 leading-normal">
                    {addon.desc}
                  </p>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      if ((user.coins || 0) >= addon.cost) {
                        updateProfile({
                          coins: (user.coins || 0) - addon.cost,
                        });
                        alert(
                          `Berhasil menukarkan ${addon.cost} koin untuk ${addon.title}!`,
                        );
                      } else {
                        alert(
                          `Koin Anda tidak cukup! Silakan beli paket koin terlebih dahulu.`,
                        );
                      }
                    }}
                    variant="outline"
                    className="w-full text-[10px] font-extrabold h-8.5 rounded-xl cursor-pointer border-amber-500/20 text-amber-600 hover:bg-amber-500/5 hover:text-amber-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CustomCoinsIcon />
                    <span>Tukar {addon.cost} Koin</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
