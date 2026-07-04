'use client';

import React from 'react';
import { LuApple, LuSmartphone } from 'react-icons/lu';
import { SiGoogleplay } from 'react-icons/si';
import Image from 'next/image';

const AppBanner: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto my-86 mb-40 px-6">
      <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-card/80 backdrop-blur-md shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] flex flex-col md:flex-row items-center justify-between gap-0">
        {/* Left Side: Content */}
        <div className="relative z-10 flex-1 px-8 py-6 md:py-8 space-y-2.5 text-left">
          <div className="space-y-2.5 mb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
              <span className="block mb-1">Download</span>
              <span className="block">Aplikasi Blue<span className="text-primary">Job</span></span>
            </h2>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs">
              Cari lowongan, panggilan wawancara, dan pesan HRD langsung dalam
              satu genggaman.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {/* App Store */}
            <button
              type="button"
              className="bg-foreground/80 text-background rounded-full px-5 py-2.5 transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95 shadow-sm group cursor-pointer border-none flex items-center"
            >
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2.5 text-left text-inherit"
              >
                <LuApple className="w-3.5 h-3.5 fill-current shrink-0" />
                <div>
                  <p className="text-[7px] text-background/60 uppercase font-semibold tracking-wider leading-none mb-0.5">
                    Get it on
                  </p>
                  <p className="text-[11px] font-extrabold leading-snug">
                    App Store
                  </p>
                </div>
              </a>
            </button>

            {/* Google Play */}
            <button
              type="button"
              className="bg-foreground/80 text-background rounded-full px-5 py-2.5 transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95 shadow-sm group cursor-pointer border-none flex items-center"
            >
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2.5 text-left text-inherit"
              >
                <SiGoogleplay className="w-3.5 h-3.5 shrink-0" />
                <div>
                  <p className="text-[7px] text-background/60 uppercase font-semibold tracking-wider leading-none mb-0.5">
                    Get it on
                  </p>
                  <p className="text-[11px] font-extrabold leading-snug">
                    Google Play
                  </p>
                </div>
              </a>
            </button>
          </div>
        </div>

        {/* Right Side: Mockup Image */}
        <div className="relative z-10 w-[140px] md:w-[250px] shrink-0 self-center flex items-center right-4 md:right-8 translate-y-0.5 md:translate-y-1.5">
          <Image
            src="/phone_app_mockup.png"
            alt="BlueJob App Mockup"
            className="w-full h-auto object-contain relative z-10 drop-shadow-2xl"
            width={250}
            height={360}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default AppBanner;
