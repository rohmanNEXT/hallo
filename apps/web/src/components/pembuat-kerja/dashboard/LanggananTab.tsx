'use client';

import React from 'react';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { LuZap as Zap, LuCheck as Check } from 'react-icons/lu';

export default function LanggananTab() {
  const { user, upgradePlan } = useAppStore();

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: [
        '3 Job Posting (120 hari)',
        '2 Job Invitation',
        'Basic Search Placement',
        'Pertanyaan Screening Terbatas',
      ],
    },
    {
      name: 'Starter',
      price: 650000,
      features: [
        '10 Job Posting',
        '1 admin master (plan, control multi user)',
        '2 multi user',
        '20 Job Invitation',
        'Pesan otomatis',
        'Sembunyikan Gaji Loker',
        'Talent pool, Search, Match',
        'Company Verified, Premium, Urgen Badge',
        'Priority Placement Spotlight',
        'Custom Pertanyaan Screening',
        'Export & Download Candidate Data as CSV',
      ],
      popular: true,
    },
    {
      name: 'Platinum',
      price: 1300000,
      features: [
        '20 Job Posting',
        '1 admin master (plan, control multi user)',
        '3 multi user',
        '40 Job Invitation',
        'Pesan otomatis',
        'Sembunyikan Gaji Loker',
        'Talent pool, Search, Match',
        'Company Verified, Premium, Urgen Badge',
        'Priority Placement Spotlight',
        'Custom Pertanyaan Screening',
        'Export & Download Candidate Data as CSV',
      ],
    },
  ];

  const hasSubscription = user?.plan && user.plan !== 'Free';

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-6 shadow-md flex flex-col h-[880px] overflow-hidden animate-in fade-in duration-300">
      <div className="space-y-1 pb-4 border-b shrink-0 mb-4">
        <h2 className="text-base font-extrabold text-foreground tracking-tight">
          Langganan
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 smooth-scroll space-y-6 pb-1 pt-1.5">
        <div>
          <h3 className="font-extrabold text-sm uppercase text-foreground flex items-center gap-1.5">
            <Zap className="h-5 w-5 text-primary" />
            Tingkatkan Rencana Rekrutmen Perusahaan
          </h3>
          <p className="text-muted-foreground text-xs mt-1">
            Pilih paket plan rekrutmen yang cocok untuk mempercepat proses hiring perusahaan Anda.
          </p>
        </div>

        {hasSubscription ? (
          <div className="p-8 bg-indigo-500/5 border border-indigo-500/15 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <Zap className="h-12 w-12 text-indigo-500 mx-auto animate-pulse" />
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
              Anda sudah berlangganan di plan {user.plan}!
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto font-medium">
              Nikmati seluruh fitur premium dari paket {user.plan} untuk mempermudah dan mempercepat rekrutmen perusahaan Anda.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => {
                  upgradePlan('Free', 0);
                  alert('Langganan dibatalkan. Kembali ke Free Plan.');
                }}
                variant="outline"
                className="text-xs font-bold px-5 h-9 border-border/60 text-foreground bg-background rounded-xl cursor-pointer hover:bg-accent transition-all"
              >
                Batalkan Langganan
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pb-4">
            {plans.map((pl, idx) => (
              <div
                key={idx}
                className={`border p-6 rounded-3xl flex flex-col justify-between transition-all bg-card ${
                  pl.popular
                    ? 'border-primary shadow-md relative scale-102 z-10'
                    : 'border-border/80 shadow-xs'
                }`}
              >
                {pl.popular && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                    Paling Populer
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-black text-sm text-foreground uppercase tracking-wider">
                      {pl.name} Plan
                    </h4>
                    <p className="text-xl font-black text-foreground mt-2">
                      {pl.price === 0 ? 'Rp 0' : `Rp ${pl.price.toLocaleString('id-ID')}`}
                      {pl.price > 0 && <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider"> / bulan</span>}
                    </p>
                  </div>

                  <hr className="border-border/50" />

                  <ul className="space-y-2.5">
                    {pl.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-[10.5px] text-foreground/80 font-semibold leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-border/40">
                  <Button
                    onClick={() => {
                      if (pl.price === 0) {
                        upgradePlan('Free', 0);
                        alert('Anda telah memilih Free Plan!');
                      } else {
                        upgradePlan(pl.name as any, pl.price);
                        alert(
                          `Langganan diupgrade ke ${pl.name}! Nikmati fitur rekrutmen prioritas.`,
                        );
                      }
                    }}
                    variant={pl.popular ? 'default' : 'outline'}
                    className="w-full text-xs font-bold h-9 rounded-xl cursor-pointer"
                  >
                    {pl.price === 0 ? 'Pilih Free Plan' : 'Langganan Sekarang'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
