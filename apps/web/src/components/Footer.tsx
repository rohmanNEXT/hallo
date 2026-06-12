'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-12 pb-6 border-t border-border bg-card/20">
      <div className="w-full max-w-[90%] mx-auto px-4 md:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Branding and Socials */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-extrabold text-2xl">J</span>
              <span className="font-bold text-lg text-foreground tracking-tight">
                JobSeeker
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-normal leading-relaxed max-w-xs">
              Platform pencarian kerja terbaik di Indonesia. Temukan impian Anda
              dengan mudah.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="#"
                className="inline-flex items-center justify-center border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8 hover:bg-accent/30 cursor-pointer text-muted-foreground transition-all shadow-sm"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8 hover:bg-accent/30 cursor-pointer text-muted-foreground transition-all shadow-sm"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8 hover:bg-accent/30 cursor-pointer text-muted-foreground transition-all shadow-sm"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8 hover:bg-accent/30 cursor-pointer text-muted-foreground transition-all shadow-sm"
              >
                <svg
                  className="h-3.5 w-3.5 fill-none stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Tautan Cepat */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground">Tautan Cepat</h4>
            <ul className="space-y-2 text-xs font-normal text-muted-foreground"> 
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-foreground transition-colors"
                >
                  Cari Lowongan
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="hover:text-foreground transition-colors"
                >
                  Perusahaan
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Untuk Pencari Kerja */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground">
              Untuk Pencari Kerja
            </h4>
            <ul className="space-y-2 text-xs font-normal text-muted-foreground">
              <li>
                <Link
                  href="/profile"
                  className="hover:text-foreground transition-colors"
                >
                  Buat Profil
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-foreground transition-colors"
                >
                  Cari Pekerjaan
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Panduan Gaji
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Tips Karir
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak */}
          <div className="space-y-3 text-muted-foreground">
            <h4 className="text-sm font-bold text-foreground">Kontak</h4>
            <ul className="space-y-2.5 text-xs font-normal">
              <li className="flex items-start gap-2.5">
                <Mail className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <a
                  href="mailto:support@jobseeker.id"
                  className="hover:text-foreground transition-colors"
                >
                  support@jobseeker.id
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">+62 21 1234 5678</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Jakarta, Indonesia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Top Border */}
        <div className="border-t border-border pt-6 text-center text-xs font-normal text-muted-foreground/80">
          <p>&copy; 2026 JobSeeker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
