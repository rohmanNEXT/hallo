'use client';

import React from 'react';

const POPULAR_CITIES = [
  {
    name: 'DKI Jakarta',
    img: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    name: 'Banten',
    img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    name: 'Bandung',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    name: 'Bekasi',
    img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    name: 'Surabaya',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    name: 'Bogor',
    img: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    name: 'Bali',
    img: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    name: 'DI Yogyakarta',
    img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=400&h=250&q=80',
  },
];

const KotaPopuler: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-22 pb-6">
      <h2 className="text-xl md:text-2xl font-black text-center text-foreground mb-8">
        Kota-Kota Populer
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {POPULAR_CITIES.map((city) => (
          <div
            key={city.name}
            className="relative overflow-hidden rounded-2xl aspect-video flex items-center justify-center cursor-pointer group transition-all duration-300 border border-border/40 hover:border-primary/50 shadow-sm hover:scale-102 hover:shadow-lg"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${city.img})` }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 group-hover:via-black/35 transition-colors" />

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
