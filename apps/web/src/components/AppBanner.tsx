'use client';

import React from 'react';

export default function AppBanner() {
  return (
    <div className="max-w-3xl mx-auto my-86 mb-16 px-6">
      <div className="bg-gradient-to-br from-card to-card/90 border border-border/80 rounded-[24px] px-6 pt-6 md:px-10 md:pt-8 pb-0 shadow-[0_12px_35px_-10px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center justify-between gap-6 relative">
        {/* Left Side: Content */}
        <div className="max-w-sm space-y-3 pb-6 md:pb-8 text-left z-10">
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight leading-tight">
            Download Aplikasi JobSeeker
          </h2>
          <p className="text-xs text-foreground/80 dark:text-muted-foreground font-medium leading-relaxed pb-2.5">
            Cari lowongan, panggilan wawancara, dan pesan HRD langsung dalam satu genggaman.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1.5">
            {/* App Store */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2.5 bg-foreground hover:bg-foreground/90 text-background rounded-xl px-4 py-2 shadow-sm transition-all text-left group border border-border cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-background transition-transform group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z" />
              </svg>
              <div>
                <p className="text-[7.5px] text-background/70 uppercase font-bold tracking-wider leading-none">
                  Download on the
                </p>
                <p className="text-[11.5px] font-extrabold text-background mt-0.5 leading-none">
                  App Store
                </p>
              </div>
            </a>

            {/* Google Play */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2.5 bg-foreground hover:bg-foreground/90 text-background rounded-xl px-4 py-2 shadow-sm transition-all text-left group border border-border cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-background transition-transform group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 5.27v13.46L16.55 12 3 5.27M17.87 11.33l1.91.95-1.91.95-1.32-.63 1.32-1.27M3 3c-.2 0-.4 0-.56.13l12.9 6.45 2.53-1.27L3 3m0 18l14.87-5.31-2.53-1.27L2.44 20.87C2.6 21 2.8 21 3 21z" />
              </svg>
              <div>
                <p className="text-[7.5px] text-background/70 uppercase font-bold tracking-wider leading-none">
                  Get it on
                </p>
                <p className="text-[11.5px] font-extrabold text-background mt-0.5 leading-none">
                  Google Play
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Right Side: Mockup Image */}
        <div className="w-[150px] md:w-[170px] shrink-0 self-end flex items-end z-10 relative mb-8">
          <img
            src="/phone_app_mockup.png"
            alt="JobSeeker App Mockup"
            className="w-full h-auto object-contain rounded-t-2xl drop-shadow-[0_-5px_25px_rgba(0,0,0,0.15)]"
          />
        </div>
      </div>
    </div>
  );
}
