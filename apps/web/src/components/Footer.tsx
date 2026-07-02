'use client';

import React from 'react';
import Link from 'next/link';
import { LuMail as Mail, LuPhone as Phone, LuMapPin as MapPin, LuFacebook as Facebook, LuTwitter as Twitter, LuLinkedin as Linkedin, LuInstagram as Instagram } from 'react-icons/lu';

const Footer: React.FC = () => {
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
                className="inline-flex items-center justify-center border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8 cursor-pointer text-muted-foreground transition-all shadow-sm"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8 cursor-pointer text-muted-foreground transition-all shadow-sm"
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8 cursor-pointer text-muted-foreground transition-all shadow-sm"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8 cursor-pointer text-muted-foreground transition-all shadow-sm"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Tautan Cepat */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground">Tautan Cepat</h4>
            <ul className="space-y-2 text-xs font-normal text-muted-foreground"> 
              <li>
                <Link
                  href="/pencari-kerja/jobs"
                  className="hover:text-foreground transition-colors"
                >
                  Cari Lowongan
                </Link>
              </li>
              <li>
                <Link
                  href="/pencari-kerja/companies"
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
                  href="/pencari-kerja/profile"
                  className="hover:text-foreground transition-colors"
                >
                  Buat Profil
                </Link>
              </li>
              <li>
                <Link
                  href="/pencari-kerja/jobs"
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
                <Mail className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                <a
                  href="mailto:support@jobseeker.id"
                  className="hover:text-foreground transition-colors"
                >
                  support@jobseeker.id
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                <span className="text-muted-foreground">+62 21 1234 5678</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
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
};

export default Footer;
