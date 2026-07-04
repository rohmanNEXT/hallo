'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/store';
import {
  LuInbox as Inbox,
  LuMapPin as MapPin,
  LuClock as Clock,
  LuCircleCheck as CheckCircle2,
  LuCircleX as XCircle,
  LuMessageSquare as MessageSquare,
  LuBuilding as Building,
  LuCoins as Coins,
  LuChevronRight as ChevronRight,
  LuX as X,
  LuSparkles as Sparkles,
} from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import initialOffersData from '../../../../public/data/offers.json';

interface JobOffer {
  id: string;
  companyName: string;
  companyLogo?: string;
  jobTitle: string;
  salaryRange: string;
  location: string;
  message: string;
  date: string;
  status: 'Menunggu' | 'Diterima' | 'Ditolak';
}

const initialOffers = initialOffersData as JobOffer[];

interface OfferCardProps {
  offer: JobOffer;
  onSelect: (offer: JobOffer) => void;
  onUpdateStatus: (id: string, newStatus: 'Diterima' | 'Ditolak') => void;
  onNavigate?: (tab: string) => void;
}

const OfferCard = ({
  offer,
  onSelect,
  onUpdateStatus,
  onNavigate,
}: OfferCardProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const messageRef = React.useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (messageRef.current) {
        const el = messageRef.current;
        const isOverflowing = el.scrollHeight > el.clientHeight;
        setShowDetail(isOverflowing);
      }
    };

    // Run check after render layout paint
    const timer = setTimeout(checkOverflow, 100);

    // Watch for size changes using ResizeObserver
    let observer: ResizeObserver | null = null;
    if (
      typeof window !== 'undefined' &&
      'ResizeObserver' in window &&
      messageRef.current
    ) {
      observer = new ResizeObserver(() => {
        checkOverflow();
      });
      observer.observe(messageRef.current);
    }

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [offer.message]);

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-4 md:p-4.5 shadow-xs flex flex-col gap-3.5 hover:border-primary/40 transition-all group">
      {/* Header block */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-11 w-11 bg-white border border-border/70 rounded-xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
            {offer.companyLogo ? (
              <Image
                src={offer.companyLogo}
                alt={offer.companyName}
                className="w-full h-full object-contain"
                width={100}
                height={100}
                unoptimized
              />
            ) : (
              <Building className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-sm font-extrabold text-foreground tracking-tight leading-snug truncate block">
              {offer.jobTitle}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mt-1">
              <span className="text-foreground/85 font-bold truncate">
                {offer.companyName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 shrink-0">
                <MapPin className="h-3 w-3" />
                {offer.location}
              </span>
            </div>
          </div>
        </div>

        <span
          className={`text-[12px] font-bold px-2.5 py-0.5 rounded select-none shrink-0 ${
            offer.status === 'Menunggu'
              ? 'bg-amber-500/10 text-amber-500'
              : offer.status === 'Diterima'
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-rose-500/10 text-rose-500'
          }`}
        >
          {offer.status}
        </span>
      </div>

      {/* Salary Range */}
      <div className="flex items-center gap-1.5 bg-muted/15 border border-border/40 px-3 py-2 rounded-xl text-[12px] font-semibold text-muted-foreground">
        <Coins className="h-4 w-4 text-muted-foreground shrink-0" />
        <span>Tawaran Gaji:</span>
        <span className="text-foreground font-normal">
          {offer.salaryRange
            .replace(/\.000\.000/g, 'jt')
            .replace(/\.000/g, 'rb')}
        </span>
      </div>

      {/* Message preview */}
      <div className="bg-muted/25 p-3 rounded-xl border border-border/40">
        <p
          ref={messageRef}
          className="text-xs text-muted-foreground font-medium leading-relaxed overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {offer.message}
        </p>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between border-t border-border/50 pt-3.5">
        <span className="text-[12px] text-muted-foreground font-semibold flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          Dikirim {offer.date}
        </span>

        <div className="flex gap-2">
          {showDetail && (
            <button
              onClick={() => onSelect(offer)}
              className="px-3 py-1.5 border border-border bg-transparent hover:bg-muted text-foreground text-[12px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              Detail
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}

          {offer.status === 'Menunggu' && (
            <>
              <button
                onClick={() => onUpdateStatus(offer.id, 'Ditolak')}
                className="px-3 py-1.5 bg-rose-500/20 text-foreground hover:bg-rose-500/30 text-[12px] font-bold rounded-lg transition-all cursor-pointer"
              >
                Tolak
              </button>
              <button
                onClick={() => onUpdateStatus(offer.id, 'Diterima')}
                className="px-3 py-1.5 bg-emerald-500/20 text-foreground hover:bg-emerald-500/30 text-[12px] font-bold rounded-lg transition-all cursor-pointer"
              >
                Terima
              </button>
            </>
          )}

          {(offer.status === 'Diterima' || offer.status === 'Ditolak') && (
            <button
              onClick={() => onNavigate?.('chat')}
              className="px-3 py-1.5 bg-primary/20 text-foreground text-[12px] font-bold rounded-lg hover:bg-primary/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Tanya Rekruter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface DashboardOffersProps {
  onNavigate?: (tab: string) => void;
}

export default function DashboardOffers({ onNavigate }: DashboardOffersProps) {
  const router = useRouter();
  const { user } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [offers, setOffers] = useState<JobOffer[]>(initialOffers);
  const [activeTab, setActiveTab] = useState<
    'Semua' | 'Menunggu' | 'Diterima' | 'Ditolak'
  >('Semua');
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('user-job-offers');
    let merged = initialOffers;
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as JobOffer[];
        const savedMap = new Map(parsed.map((o) => [o.id, o.status]));
        merged = initialOffers.map((fresh) => ({
          ...fresh,
          status: savedMap.has(fresh.id)
            ? savedMap.get(fresh.id)!
            : fresh.status,
        }));
      } catch (e) {
        console.error(e);
      }
    }
    setOffers(merged);
    localStorage.setItem('user-job-offers', JSON.stringify(merged));
  }, []);

  const saveOffers = (newOffers: JobOffer[]) => {
    setOffers(newOffers);
    localStorage.setItem('user-job-offers', JSON.stringify(newOffers));
  };

  if (!user) return null;

  const handleUpdateStatus = (
    id: string,
    newStatus: 'Diterima' | 'Ditolak',
  ) => {
    const updated = offers.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o,
    );
    saveOffers(updated);
    if (selectedOffer && selectedOffer.id === id) {
      setSelectedOffer({ ...selectedOffer, status: newStatus });
    }
  };

  const filteredOffers = offers.filter((o) => {
    if (activeTab === 'Semua') return true;
    return o.status === activeTab;
  });

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col h-[880px] overflow-hidden animate-in fade-in duration-300 justify-between">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="space-y-1 pb-4 border-b shrink-0 mb-4 flex items-center justify-between">
          <div>
            <span className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <span>Tawaran Kerja</span>
            </span>
          </div>
          {offers.filter((o) => o.status === 'Menunggu').length > 0 && (
            <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 text-[12px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20 animate-pulse">
              <Sparkles className="h-3 w-3" />
              <span>
                {offers.filter((o) => o.status === 'Menunggu').length} Tawaran
                Baru
              </span>
            </span>
          )}
        </div>

        {/* Tab Filters */}
        <div className="flex text-sm gap-6 mb-4 smooth-scroll shrink-0">
          {(['Semua', 'Menunggu', 'Diterima', 'Ditolak'] as const).map(
            (tab) => {
              const isActive = activeTab === tab;
              const count =
                tab === 'Semua'
                  ? offers.length
                  : offers.filter((o) => o.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 text-[12px] md:text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-foreground border-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  style={
                    isActive
                      ? { borderBottomColor: 'hsl(var(--primary))' }
                      : undefined
                  }
                >
                  {tab} ({count})
                </button>
              );
            },
          )}
        </div>

        {/* Offers List */}
        <div className="flex-1 overflow-y-auto pr-1 smooth-scroll space-y-3.5 pt-1">
          {filteredOffers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-2xl bg-muted/10 text-center">
              <Inbox className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <span className="text-xs text-muted-foreground font-semibold">
                Tidak ada tawaran kerja dengan status ini.
              </span>
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onSelect={setSelectedOffer}
                onUpdateStatus={handleUpdateStatus}
                onNavigate={onNavigate}
              />
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card/40 backdrop-blur-2xl border border-border/50 w-full max-w-xl rounded-3xl p-6 relative shadow-2xl flex flex-col max-h-[85vh] animate-in scale-in duration-200">
            <button
              onClick={() => setSelectedOffer(null)}
              className="absolute top-5 right-5 p-2 hover:bg-muted rounded-full transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 pb-2 mb-3 pr-8">
              <div className="h-14 w-14 bg-white border border-border/70 rounded-2xl p-2.5 flex items-center justify-center shrink-0 shadow-md">
                {selectedOffer.companyLogo ? (
                  <Image
                    src={selectedOffer.companyLogo}
                    alt={selectedOffer.companyName}
                    className="w-full h-full object-contain"
                    width={100}
                    height={100}
                    unoptimized
                  />
                ) : (
                  <Building className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-sm font-extrabold tracking-tight text-foreground leading-snug block truncate">
                  {selectedOffer.jobTitle}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mt-1">
                  <span className="text-foreground/85 font-bold truncate">
                    {selectedOffer.companyName}
                  </span>
                  <span>•
                  </span>
                  <span className="truncate">{selectedOffer.location}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 pr-1 smooth-scroll text-xs">
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-muted/20 border border-border/50 px-3 py-1.5 rounded-lg text-[12px] font-medium text-foreground w-fit shadow-xs">
                  <Coins className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Tawaran Gaji:</span>
                  <span className="font-bold text-foreground">
                    {selectedOffer.salaryRange
                      .replace(/\.000\.000/g, 'jt')
                      .replace(/\.000/g, 'rb')}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[12px] text-muted-foreground font-bold uppercase block tracking-wider mb-2">
                  Pesan Rekruter
                </span>
                <div className="bg-primary/5 border border-primary/10 dark:bg-primary/10 dark:border-primary/20 p-4.5 rounded-2xl shadow-xs">
                  <p className="font-medium leading-relaxed whitespace-pre-wrap text-foreground/90 text-xs not-italic max-h-[220px] overflow-y-auto smooth-scroll pr-1.5 scrollbar-thin">
                    &quot;{selectedOffer.message}&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <span className="text-[12px] text-muted-foreground font-bold uppercase tracking-wider shrink-0">
                  Status Penawaran:
                </span>
                <span
                  className={`text-[12px] font-extrabold px-3 py-1 rounded-md select-none tracking-wide ${
                    selectedOffer.status === 'Menunggu'
                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                      : selectedOffer.status === 'Diterima'
                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                        : 'bg-rose-500/15 text-rose-500 border border-rose-500/20'
                  }`}
                >
                  {selectedOffer.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOffer(null)}
                className="h-9 cursor-pointer text-xs font-bold border-border/60 hover:bg-muted transition-colors rounded-xl px-4"
              >
                Tutup
              </Button>
              {selectedOffer.status === 'Menunggu' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleUpdateStatus(selectedOffer.id, 'Ditolak');
                    }}
                    className="h-9 cursor-pointer text-xs font-bold bg-rose-500/20 text-foreground hover:bg-rose-500/30 transition-all rounded-xl px-4 border-0"
                  >
                    Tolak Tawaran
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleUpdateStatus(selectedOffer.id, 'Diterima');
                    }}
                    className="h-9 cursor-pointer text-xs font-bold bg-emerald-500/20 text-foreground hover:bg-emerald-500/30 transition-all rounded-xl px-4 border-0"
                  >
                    Terima Tawaran
                  </Button>
                </>
              )}
              {selectedOffer.status !== 'Menunggu' && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedOffer(null);
                    onNavigate?.('chat');
                  }}
                  className="h-9 cursor-pointer text-xs font-bold bg-primary/20 text-foreground flex items-center gap-1.5 transition-all rounded-xl px-4 border-0 hover:bg-primary/30"
                >
                  <MessageSquare className="h-4 w-4" />
                  Hubungi Rekruter
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
