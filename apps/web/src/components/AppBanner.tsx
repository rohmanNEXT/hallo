'use client';

import React from 'react';
import { Apple, Play } from 'lucide-react';

export default function AppBanner() {
  return (
    <div className="max-w-3xl mx-auto my-86 mb-40 px-6">
      <div className="bg-gradient-to-br from-card to-card/90 border border-border/80 rounded-[24px] px-6 pt-6 md:px-10 md:pt-8 pb-0 shadow-[0_12px_35px_-10px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center justify-between gap-6 relative">
        {/* Left Side: Content */}
        <div className="max-w-sm space-y-3 pb-6 md:pb-8 text-left z-10">
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground">
            Download Aplikasi BlueJob
          </h2>
          <p className="text-xs text-foreground/80 dark:text-muted-foreground font-medium leading-relaxed pb-2.5">
            Cari lowongan, panggilan wawancara, dan pesan HRD langsung dalam satu genggaman.
          </p>

          <div className="flex flex-wrap gap-3 pt-1.5">
            {/* App Store */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2.5 bg-foreground/80 hover:bg-foreground/90 text-background rounded-full px-5 py-2 shadow-sm transition-all text-left group border border-border cursor-pointer"
            >
              <Apple className="w-4 h-4 text-background transition-transform group-hover:scale-110 fill-current" />
              <div>
                <p className="text-[8px] text-background/70 uppercase font-bold tracking-wider leading-none">
                  Download on the
                </p>
                <p className="text-[12px] font-extrabold text-background mt-1 leading-none">
                  App Store
                </p>
              </div>
            </a>

            {/* Google Play */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2.5 bg-foreground/80 hover:bg-foreground/90 text-background rounded-full px-5 py-2 shadow-sm transition-all text-left group border border-border cursor-pointer"
            >
              <Play className="w-4 h-4 text-background transition-transform group-hover:scale-110 fill-current" />
              <div>
                <p className="text-[8px] text-background/70 uppercase font-bold tracking-wider leading-none">
                  Get it on
                </p>
                <p className="text-[12px] font-extrabold text-background mt-1 leading-none">
                  Google Play
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Right Side: Mockup Image */}
        <div className="w-[100px] md:w-[230px] shrink-0 self-end flex items-end z-10 relative mb-8">
          <img
            src="/phone_app_mockup.png"
            alt="JobSeeker App Mockup"
            className="w-full h-auto object-contain rounded-2xl drop-shadow-[0_-5px_25px_rgba(0,0,0,0.15)]"
          />
        </div>
      </div>
    </div>
  );
}
