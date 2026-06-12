'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Compass, Filter, Briefcase } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface Hotspot {
  city: string;
  count: number;
  lat: number;
  lng: number;
}

export default function IndonesiaMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const activeMarkerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [minJobs, setMinJobs] = useState(20);
  const { theme } = useAppStore();

  const hotspots: Hotspot[] = [
    { city: 'Jakarta', count: 48, lat: -6.2088, lng: 106.8456 },
    { city: 'Surabaya', count: 45, lat: -7.2575, lng: 112.7521 },
    { city: 'Yogyakarta', count: 35, lat: -7.7956, lng: 110.3695 },
    { city: 'Bandung', count: 32, lat: -6.9175, lng: 107.6191 },
    { city: 'Makassar', count: 29, lat: -5.1477, lng: 119.4327 },
    { city: 'Semarang', count: 27, lat: -6.9932, lng: 110.4203 },
    { city: 'Batam', count: 26, lat: 1.0829, lng: 104.0305 },
    { city: 'Pekanbaru', count: 25, lat: 0.5071, lng: 101.4478 },
    { city: 'Medan', count: 24, lat: 3.5952, lng: 98.6722 },
    { city: 'Samarinda', count: 24, lat: -0.5021, lng: 117.1536 },
    { city: 'Palembang', count: 23, lat: -2.9761, lng: 104.7754 },
    { city: 'Banjarmasin', count: 23, lat: -3.3186, lng: 114.5944 },
    { city: 'Balikpapan', count: 22, lat: -1.2654, lng: 116.8312 },
    { city: 'Pontianak', count: 22, lat: -0.0263, lng: 109.3425 },
    { city: 'Denpasar', count: 21, lat: -8.6705, lng: 115.2126 },
    { city: 'Manado', count: 21, lat: 1.4748, lng: 124.8428 },
    { city: 'Jayapura', count: 20, lat: -2.541, lng: 140.669 },
    { city: 'Kupang', count: 19, lat: -10.1772, lng: 123.607 },
    { city: 'Ambon', count: 18, lat: -3.6954, lng: 128.1814 },
  ];

  // Dynamically load Leaflet JS & CSS from CDN
  useEffect(() => {
    let active = true;
    const loadLeaflet = () => {
      return new Promise<void>((resolve) => {
        if ((window as any).L) {
          resolve();
          return;
        }

        // Load CSS
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    loadLeaflet().then(() => {
      if (active) {
        setLeafletLoaded(true);
      }
    });

    return () => {
      active = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize the Map Base Layer
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Clean up existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Determine map tile theme based on current app theme
    const isDarkTheme =
      theme === 'dark' ||
      theme === 'darkblue' ||
      theme === 'charcoal' ||
      theme === 'teal' ||
      theme === 'emerald' ||
      theme === 'burgundy';
    const tileUrl = isDarkTheme
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    // Initialize map with disabled drag/zoom interactions (fixed) and zoomSnap for perfect scaling
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: false,
      tap: false,
      zoomSnap: 0.04,
    });

    // Set bounds to tightly cover all of Indonesia and shift it slightly upwards
    map.fitBounds(
      [
        [-10.5, 94.5], // Southwest point
        [5.5, 141.5], // Northeast point
      ],
      {
        padding: [0, 0],
      },
    );

    mapInstanceRef.current = map;

    // Add Tile Layer
    L.tileLayer(tileUrl, {
      attribution: '&copy; CartoDB',
      maxZoom: 18,
    }).addTo(map);

    // Initialize Markers Group Layer
    markersGroupRef.current = L.layerGroup().addTo(map);
  }, [leafletLoaded, theme]);

  // Update Markers based on minJobs filter slider
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current || !markersGroupRef.current)
      return;

    const L = (window as any).L;
    if (!L) return;

    // Clear previous markers and active tooltip state
    markersGroupRef.current.clearLayers();
    activeMarkerRef.current = null;

    // Filter hotspots
    const filteredHotspots = hotspots.filter((hs) => hs.count >= minJobs);

    // Add markers for filtered hotspots
    filteredHotspots.forEach((hs) => {
      const customIcon = L.divIcon({
        html: `
          <span class="relative flex h-3.5 w-3.5 items-center justify-center">
            <span class="animate-slow-ping absolute inline-flex h-full w-full rounded-full bg-[#0f6dff]/40 opacity-50"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[#0f6dff] opacity-85 border border-white/70"></span>
          </span>
        `,
        className: 'custom-div-icon',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([hs.lat, hs.lng], { icon: customIcon }).addTo(
        markersGroupRef.current,
      );

      // Set direction: right for West edges (Sumatra), left for East edges (Papua), and top (upwards) for the rest
      let tooltipDirection: 'top' | 'left' | 'right' = 'top';
      if (hs.lng < 105) {
        tooltipDirection = 'right';
      } else if (hs.lng > 135) {
        tooltipDirection = 'left';
      }

      // Track tooltip state on the marker object itself
      (marker as any).tooltipOpen = false;

      // Open tooltip ONLY on click
      marker.on('click', (e: any) => {
        if (e.originalEvent) {
          e.originalEvent.stopPropagation();
        }

        // Close previously active tooltip if there is one, and it is not the current marker
        if (activeMarkerRef.current && activeMarkerRef.current !== marker) {
          activeMarkerRef.current.unbindTooltip();
          activeMarkerRef.current.tooltipOpen = false;
        }

        if ((marker as any).tooltipOpen) {
          marker.unbindTooltip();
          (marker as any).tooltipOpen = false;
          activeMarkerRef.current = null;
        } else {
          marker.bindTooltip(
            `
            <div class="custom-map-tooltip-inner px-2 py-1 text-[10px] font-bold rounded-lg shadow-md select-none">
              <div class="text-[#0f6dff] font-extrabold text-[11px] mb-0.5">${hs.city}</div>
              <div class="text-emerald-500 font-extrabold flex items-center gap-1">
                <span class="font-extrabold">${hs.count} Loker</span>
              </div>
            </div>
          `,
            {
              permanent: true,
              direction: tooltipDirection,
              className: 'custom-map-tooltip p-0',
              interactive: true,
            },
          ).openTooltip();
          (marker as any).tooltipOpen = true;
          activeMarkerRef.current = marker;
        }
      });
    });
  }, [leafletLoaded, minJobs]);

  return (
    <section className="max-w-7xl mx-auto px-6 pt-16 pb-14">
      <div className="bg-card rounded-[32px] px-6 py-8 md:p-10 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.08)] flex flex-col items-center text-center gap-8 overflow-hidden">
        {/* Top: Title Only */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
          Jangkauan Lowongan Seluruh Indonesia
        </h2>

        {/* Middle: Leaflet Map (Fixed & Non-interactive) */}
        <div className="w-full max-w-4xl h-[290px] md:h-[390px] border border-border/60 rounded-2xl overflow-hidden relative shadow-md bg-muted/20">
          <div ref={mapContainerRef} className="w-full h-full z-10" />
          {!leafletLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20 text-xs font-bold text-muted-foreground">
              Memuat Peta Interaktif...
            </div>
          )}
        </div>

        {/* Bottom: Filter Slider */}
        <div className="w-full max-w-xs p-5 rounded-2xl bg-background/50 border border-border/80 space-y-3 text-center">
          <div className="text-center">
            <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-3">
              FILTER JUMLAH LOWONGAN
            </span>
          </div>

          <div className="space-y-2 px-3">
            <div className="relative flex items-center pt-2">
              <input
                type="range"
                min="18"
                max="48"
                value={minJobs}
                onChange={(e) => setMinJobs(Number(e.target.value))}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer custom-slider focus:outline-none focus:ring-2 focus:ring-[#0f6dff]/30 transition-all"
                style={{
                  background: `linear-gradient(to right, #0f6dff 0%, #0f6dff ${((minJobs - 18) / (48 - 18)) * 100}%, #3f3f46 ${((minJobs - 18) / (48 - 18)) * 100}%, #3f3f46 100%)`
                }}
              />
            </div>
            
            <div className="flex justify-between text-[11px] text-muted-foreground font-semibold px-3 mt-6">
              <span className="translate-x-1 inline-block">Min 18</span>
              <span>Max 48</span>
            </div>
          </div>

          <div className="pt-0">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#0f6dff]/10 text-[#0f6dff] border border-[#0f6dff]/20 text-xs font-extrabold tracking-wide">
              {minJobs} Lowongan
            </span>
          </div>
        </div>
      </div>

      {/* Global overrides for Leaflet tooltip design to match app styling */}
      <style jsx global>{`
        .leaflet-tooltip {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-tooltip-left:before {
          border-left-color: #e4e4e7 !important;
        }
        .leaflet-tooltip-right:before {
          border-right-color: #e4e4e7 !important;
        }
        .leaflet-tooltip-top:before {
          border-top-color: #e4e4e7 !important;
        }
        .dark .leaflet-tooltip-left:before,
        .darkblue .leaflet-tooltip-left:before,
        .charcoal .leaflet-tooltip-left:before,
        .teal .leaflet-tooltip-left:before,
        .emerald .leaflet-tooltip-left:before,
        .burgundy .leaflet-tooltip-left:before {
          border-left-color: #27272a !important;
        }
        .dark .leaflet-tooltip-right:before,
        .darkblue .leaflet-tooltip-right:before,
        .charcoal .leaflet-tooltip-right:before,
        .teal .leaflet-tooltip-right:before,
        .emerald .leaflet-tooltip-right:before,
        .burgundy .leaflet-tooltip-right:before {
          border-right-color: #27272a !important;
        }
        .dark .leaflet-tooltip-top:before,
        .darkblue .leaflet-tooltip-top:before,
        .charcoal .leaflet-tooltip-top:before,
        .teal .leaflet-tooltip-top:before,
        .emerald .leaflet-tooltip-top:before,
        .burgundy .leaflet-tooltip-top:before {
          border-top-color: #27272a !important;
        }
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .animate-slow-ping {
          animation: ping 3.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        /* Solid tooltip containers (no transparency) */
        .custom-map-tooltip-inner {
          background-color: #ffffff !important;
          color: #09090b !important;
          border: 1px solid #e4e4e7 !important;
          opacity: 1 !important;
        }
        /* Solid dark themes */
        .dark .custom-map-tooltip-inner,
        .darkblue .custom-map-tooltip-inner,
        .charcoal .custom-map-tooltip-inner,
        .teal .custom-map-tooltip-inner,
        .emerald .custom-map-tooltip-inner,
        .burgundy .custom-map-tooltip-inner {
          background-color: #18181b !important;
          color: #fafafa !important;
          border: 1px solid #27272a !important;
          opacity: 1 !important;
        }
        /* Range slider styling to ensure visibility across all browsers and resets */
        /* Range slider styling to ensure visibility across all browsers and resets */
        input[type="range"].custom-slider {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 100% !important;
          height: 4px !important;
          border-radius: 9999px !important;
          outline: none !important;
          background: #e4e4e7 !important; /* light mode track fallback */
          transition: all 0.2s ease !important;
        }
        
        .dark input[type="range"].custom-slider,
        .darkblue input[type="range"].custom-slider,
        .charcoal input[type="range"].custom-slider,
        .teal input[type="range"].custom-slider,
        .emerald input[type="range"].custom-slider,
        .burgundy input[type="range"].custom-slider {
          background: #27272a !important; /* dark mode track fallback */
        }

        /* Webkit track overrides */
        input[type="range"].custom-slider::-webkit-slider-runnable-track {
          height: 4px !important;
          border-radius: 9999px !important;
          background: inherit !important;
          border: none !important;
        }

        /* Firefox track overrides */
        input[type="range"].custom-slider::-moz-range-track {
          height: 4px !important;
          border-radius: 9999px !important;
          background: inherit !important;
        }
        
        /* Thumb styling (Webkit/Blink) */
        input[type="range"].custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 20px !important;
          height: 20px !important;
          border-radius: 50% !important;
          background: #0f6dff !important;
          border: 3px solid #ffffff !important;
          box-shadow: 0 2px 6px rgba(15, 109, 255, 0.4) !important;
          cursor: pointer !important;
          margin-top: -8px !important; /* Center the thumb vertically on a 4px track */
          transition: transform 0.1s ease, background-color 0.1s ease !important;
        }
        input[type="range"].custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15) !important;
          background: #0056d6 !important;
        }
        input[type="range"].custom-slider::-webkit-slider-thumb:active {
          transform: scale(0.95) !important;
        }

        /* Thumb styling (Firefox) */
        input[type="range"].custom-slider::-moz-range-thumb {
          width: 20px !important;
          height: 20px !important;
          border-radius: 50% !important;
          background: #0f6dff !important;
          border: 3px solid #ffffff !important;
          box-shadow: 0 2px 6px rgba(15, 109, 255, 0.4) !important;
          cursor: pointer !important;
          box-sizing: border-box !important;
          transition: transform 0.1s ease, background-color 0.1s ease !important;
        }
        input[type="range"].custom-slider::-moz-range-thumb:hover {
          transform: scale(1.15) !important;
          background: #0056d6 !important;
        }
        input[type="range"].custom-slider::-moz-range-thumb:active {
          transform: scale(0.95) !important;
        }

        .dark input[type="range"].custom-slider::-webkit-slider-thumb,
        .darkblue input[type="range"].custom-slider::-webkit-slider-thumb,
        .charcoal input[type="range"].custom-slider::-webkit-slider-thumb,
        .teal input[type="range"].custom-slider::-webkit-slider-thumb,
        .emerald input[type="range"].custom-slider::-webkit-slider-thumb,
        .burgundy input[type="range"].custom-slider::-webkit-slider-thumb {
          border-color: #18181b !important;
        }

        .dark input[type="range"].custom-slider::-moz-range-thumb,
        .darkblue input[type="range"].custom-slider::-moz-range-thumb,
        .charcoal input[type="range"].custom-slider::-moz-range-thumb,
        .teal input[type="range"].custom-slider::-moz-range-thumb,
        .emerald input[type="range"].custom-slider::-moz-range-thumb,
        .burgundy input[type="range"].custom-slider::-moz-range-thumb {
          border-color: #18181b !important;
        }
      `}</style>
    </section>
  );
}
