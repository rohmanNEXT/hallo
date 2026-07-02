'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/store';
import { LuAward as Award, LuArrowLeft as ArrowLeft } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function CertificatePreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAppStore();
  const [mounted, setMounted] = useState(false);

  const certName = searchParams.get('name') || 'Sertifikat Kompetensi';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">
            Memuat Sertifikat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-10 pb-28 px-6 md:px-12 text-foreground">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back navigation */}
        <Button
          onClick={() => router.push('/pencari-kerja/profile')}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-xs font-semibold hover:bg-primary/10 -ml-3 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Profil</span>
        </Button>

        {/* Certificate Visual Container */}
        <div className="bg-card border border-border/80 rounded-2xl shadow-md overflow-hidden">
          <div className="p-12 md:p-20 bg-amber-50/50 dark:bg-stone-900/30 border-8 border-double border-amber-800/20 text-center space-y-8 relative overflow-hidden select-none">
            {/* Elegant corner borders */}
            <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-amber-800/10 pointer-events-none" />

            {/* Certificate Badge icon */}
            <div className="flex justify-center">
              <Award className="h-20 w-20 text-amber-600 animate-pulse" />
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-4xl font-bold text-amber-950 dark:text-amber-100 uppercase tracking-widest">
                Sertifikat Kelulusan
              </h2>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 font-medium tracking-wide">
                PROUDLY PRESENTED TO
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-3xl font-black text-amber-900 dark:text-amber-200 underline decoration-amber-800/30 underline-offset-8">
                {user.name}
              </h3>
              <p className="text-xs text-muted-foreground font-medium pt-4">
                atas keberhasilan menyelesaikan sertifikasi kompetensi:
              </p>
            </div>

            <div className="py-4 px-8 bg-amber-900/5 border border-amber-900/10 rounded-xl inline-block">
              <span className="font-mono text-base md:text-lg font-extrabold text-amber-950 dark:text-amber-200 uppercase tracking-wide">
                {certName}
              </span>
            </div>

            <div className="flex justify-between items-end pt-12 text-amber-900/60 dark:text-amber-300/60 font-mono text-[10px] uppercase font-bold">
              <div>
                <div className="border-t border-amber-900/20 pt-2 px-4">
                  Tanggal Terbit: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <div>
                <div className="border-t border-amber-900/20 pt-2 px-4">
                  Tanda Tangan Digital Verified
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
