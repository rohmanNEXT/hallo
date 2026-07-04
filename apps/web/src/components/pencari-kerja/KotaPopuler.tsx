'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const POPULAR_CITIES = [
  {
    name: 'DKI Jakarta',
    img: '/images/cities/jakarta.png',
  },
  {
    name: 'Banten',
    img: '/images/cities/banten.png',
  },
  {
    name: 'Bandung',
    img: '/images/cities/bandung.png',
  },
  {
    name: 'Bekasi',
    img: '/images/cities/bekasi.png',
  },
  {
    name: 'Surabaya',
    img: '/images/cities/surabaya.png',
  },
  {
    name: 'Bogor',
    img: '/images/cities/bogor.png',
  },
  {
    name: 'Bali',
    img: '/images/cities/bali.png',
  },
  {
    name: 'DI Yogyakarta',
    img: '/images/cities/yogyakarta.png',
  },
];

const KotaPopuler: React.FC = () => {
  const router = useRouter();

  const handleCityClick = (cityName: string) => {
    const params = new URLSearchParams();
    params.set('location', cityName);
    router.push(`/pencari-kerja/jobs?${params.toString()}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 pt-22 pb-6">
      <h2 className="text-xl md:text-2xl font-black text-center text-foreground mb-8.5">
        Kota kota Populer
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {POPULAR_CITIES.map((city) => (
          <div
            key={city.name}
            onClick={() => handleCityClick(city.name)}
            className="relative overflow-hidden rounded-3xl aspect-video flex items-center justify-center cursor-pointer group transition-all duration-300 border border-border/40 hover:border-primary/50 shadow-sm hover:scale-102 hover:shadow-lg"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${city.img})` }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/20 group-hover:via-black/35 transition-colors" />

            {/* Content */}
            <span className="relative text-white font-extrabold text-xs md:text-sm tracking-wide z-10 drop-shadow-md text-center px-2">
              {city.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KotaPopuler;
