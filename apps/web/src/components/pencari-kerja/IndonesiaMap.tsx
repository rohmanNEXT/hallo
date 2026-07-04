'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LuCompass as Compass, LuFilter as Filter, LuBriefcase as Briefcase } from 'react-icons/lu';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/store';
import useJobs from '@/hooks/useJobs';

interface Hotspot {
  city: string;
  count: number;
  lat: number;
  lng: number;
}

const IndonesiaMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const activeMarkerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [minJobs, setMinJobs] = useState(48);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const { theme } = useAppStore();
  const { data: jobs = [] } = useJobs();

  const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
    'Jakarta': { lat: -6.2088, lng: 106.8456 },
    'Jakarta Pusat': { lat: -6.1823, lng: 106.8428 },
    'Jakarta Selatan': { lat: -6.2838, lng: 106.8048 },
    'Jakarta Barat': { lat: -6.1683, lng: 106.7588 },
    'Jakarta Timur': { lat: -6.2628, lng: 106.8822 },
    'Jakarta Utara': { lat: -6.1361, lng: 106.9006 },
    'Surabaya': { lat: -7.2575, lng: 112.7521 },
    'Yogyakarta': { lat: -7.7956, lng: 110.3695 },
    'Bandung': { lat: -6.9175, lng: 107.6191 },
    'Makassar': { lat: -5.1477, lng: 119.4327 },
    'Semarang': { lat: -6.9932, lng: 110.4203 },
    'Medan': { lat: 3.5952, lng: 98.6722 },
    'Denpasar': { lat: -8.6705, lng: 115.2126 },
    'Bekasi': { lat: -6.2383, lng: 106.9756 },
    'Tangerang': { lat: -6.1761, lng: 106.6382 },
    'Tangerang Selatan': { lat: -6.3227, lng: 106.7085 },
    'Depok': { lat: -6.4071, lng: 106.8158 },
    'Batam': { lat: 1.0829, lng: 104.0305 },
    'Pekanbaru': { lat: 0.5071, lng: 101.4478 },
    'Samarinda': { lat: -0.5021, lng: 117.1536 },
    'Palembang': { lat: -2.9761, lng: 104.7754 },
    'Banjarmasin': { lat: -3.3186, lng: 114.5944 },
    'Balikpapan': { lat: -1.2654, lng: 116.8312 },
    'Pontianak': { lat: -0.0263, lng: 109.3425 },
    'Manado': { lat: 1.4748, lng: 124.8428 },
    'Jayapura': { lat: -2.541, lng: 140.669 },
    'Kupang': { lat: -10.1772, lng: 123.607 },
    'Ambon': { lat: -3.6954, lng: 128.1814 },
    'Surakarta': { lat: -7.5561, lng: 110.8316 },
    'Malang': { lat: -7.9797, lng: 112.6304 },
    'Bogor': { lat: -6.5971, lng: 106.7932 },
    'Gresik': { lat: -7.1648, lng: 112.6517 },
    'Sidoarjo': { lat: -7.4478, lng: 112.7183 },
    'Sleman': { lat: -7.7126, lng: 110.3340 },
    'Bantul': { lat: -7.8860, lng: 110.3297 },
  };

  const hotspots = React.useMemo(() => {
    if (jobs.length === 0) return [];
    
    const cityCounts: Record<string, number> = {};
    jobs.forEach(job => {
      if (job.location) {
        const city = job.location.split(',')[0].trim();
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      }
    });

    const generatedHotspots: Hotspot[] = [];
    Object.entries(cityCounts).forEach(([city, count]) => {
      if (count > 0) {
        if (CITY_COORDINATES[city]) {
          generatedHotspots.push({
            city,
            count,
            lat: CITY_COORDINATES[city].lat,
            lng: CITY_COORDINATES[city].lng,
          });
        } else {
          // Fallback logic for unmapped cities: Put them near center/Jakarta roughly but jittered
          // so they don't stack on top of each other
          const jitterLat = -2.5 + (Math.random() * 8 - 4); // Spread vertically across indonesia
          const jitterLng = 117.0 + (Math.random() * 20 - 10); // Spread horizontally
          generatedHotspots.push({
            city,
            count,
            lat: jitterLat,
            lng: jitterLng,
          });
        }
      }
    });
    
    return generatedHotspots;
  }, [jobs]);

  const maxJobCount = React.useMemo(() => {
    if (jobs.length === 0) return 48;
    return jobs.length;
  }, [jobs.length]);

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

  // Close active tooltip when clicking anywhere outside the marker/tooltip
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (activeMarkerRef.current) {
        const target = e.target as HTMLElement;
        // Jika klik bukan pada icon marker atau isi tooltip, maka tutup tooltip
        if (!target.closest('.custom-map-tooltip') && !target.closest('.custom-div-icon')) {
          activeMarkerRef.current.unbindTooltip();
          activeMarkerRef.current.tooltipOpen = false;
          activeMarkerRef.current = null;
          setActiveCity(null);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
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

    // Close active tooltip when clicking outside markers (on the map itself)
    map.on('click', () => {
      if (activeMarkerRef.current) {
        activeMarkerRef.current.unbindTooltip();
        activeMarkerRef.current.tooltipOpen = false;
        activeMarkerRef.current = null;
        setActiveCity(null);
      }
    });
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
    const filteredHotspots = hotspots.filter((hs) => hs.count <= minJobs);

    // Add markers for filtered hotspots
    filteredHotspots.forEach((hs) => {
      const customIcon = L.divIcon({
        html: `
          <span class="relative flex h-3.5 w-3.5 items-center justify-center">
            <span class="animate-slow-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-50"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary opacity-60 border border-white/70"></span>
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

      // Auto-open if this is the active city
      if (hs.city === activeCity) {
        marker
          .bindTooltip(
            `
            <div class="custom-map-tooltip-inner px-3 py-2 rounded-xl shadow-lg cursor-text select-text flex flex-col items-start min-w-[100px]">
              <div class="text-primary font-semibold text-sm tracking-tight mb-1">${hs.city}</div>
              <div class="text-emerald-500 font-semibold text-xs">
                ${hs.count} Loker
              </div>
            </div>
          `,
            {
              permanent: true,
              direction: tooltipDirection,
              className: 'custom-map-tooltip p-0',
              interactive: true,
            },
          )
          .openTooltip();
        (marker as any).tooltipOpen = true;
        activeMarkerRef.current = marker;
      }

      // Open tooltip ONLY on click
      marker.on('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
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
          setActiveCity(null);
        } else {
          marker
            .bindTooltip(
              `
            <div class="custom-map-tooltip-inner px-3 py-2 rounded-xl shadow-lg cursor-text select-text flex flex-col items-start min-w-[100px]">
              <div class="text-primary font-semibold text-sm tracking-tight mb-1">${hs.city}</div>
              <div class="text-emerald-500 font-semibold text-xs">
                ${hs.count} Loker
              </div>
            </div>
          `,
              {
                permanent: true,
                direction: tooltipDirection,
                className: 'custom-map-tooltip p-0',
                interactive: true,
              },
            )
            .openTooltip();
          (marker as any).tooltipOpen = true;
          activeMarkerRef.current = marker;
          setActiveCity(hs.city);
        }
      });
    });
  }, [leafletLoaded, minJobs, theme, activeCity, hotspots]);

  return (
    <section className="max-w-7xl mx-auto px-6 pt-22 pb-14">
      <div className="bg-card rounded-[32px] px-6 py-8 md:p-10 flex flex-col items-center text-center border border-border overflow-hidden">
        {/* Top: Title Only */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight mb-9.5">
          Jangkauan Lowongan Seluruh Indonesia
        </h2>

        {/* Middle: Leaflet Map (Fixed & Non-interactive) */}
        <div className="w-full max-w-4xl h-[290px] md:h-[390px] mb-10 border border-border/60 rounded-2xl overflow-hidden relative shadow-md bg-muted/20">
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
            <span className="text-sm font-medium text-muted-foreground block mb-4">
              Jumlah Lowongan
            </span>
          </div>

          <div className="space-y-2 px-3">
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max={maxJobCount}
                value={maxJobCount - minJobs}
                onChange={(e) => setMinJobs(maxJobCount - Number(e.target.value))}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer custom-slider focus:outline-none transition-all"
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(((maxJobCount - minJobs) - 0) / (maxJobCount - 0)) * 100}%, #3f3f46 ${(((maxJobCount - minJobs) - 0) / (maxJobCount - 0)) * 100}%, #3f3f46 100%)`,
                }}
              />
            </div>

            <div className="flex justify-between text-[12px] text-muted-foreground font-semibold px-3 mt-4">
              <span className="translate-x-1 inline-block">{maxJobCount}</span>
              <span>0</span>
            </div>
          </div>

          <div className="pt-2">
            <Badge
              variant="outline"
              className={`text-[12px] font-normal px-2.5 py-0.5 h-6 ${
                leafletLoaded && theme === 'white'
                  ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                  : 'bg-background/50 border border-border/80 text-muted-foreground'
              }`}
            >
              {minJobs} Lowongan
            </Badge>
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
        input[type='range'].custom-slider {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 100% !important;
          height: 4px !important;
          border-radius: 9999px !important;
          outline: none !important;
          background: #e4e4e7 !important; /* light mode track fallback */
          transition: all 0.2s ease !important;
        }

        .dark input[type='range'].custom-slider,
        .darkblue input[type='range'].custom-slider,
        .charcoal input[type='range'].custom-slider,
        .teal input[type='range'].custom-slider,
        .emerald input[type='range'].custom-slider,
        .burgundy input[type='range'].custom-slider {
          background: #27272a !important; /* dark mode track fallback */
        }

        /* Webkit track overrides */
        input[type='range'].custom-slider::-webkit-slider-runnable-track {
          height: 4px !important;
          border-radius: 9999px !important;
          background: inherit !important;
          border: none !important;
        }

        /* Firefox track overrides */
        input[type='range'].custom-slider::-moz-range-track {
          height: 4px !important;
          border-radius: 9999px !important;
          background: inherit !important;
        }

        /* Thumb styling (Webkit/Blink) */
        input[type='range'].custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 14px !important;
          height: 14px !important;
          border-radius: 50% !important;
          background: hsl(var(--primary) / 0.6) !important;
          border: none !important;
          box-shadow: none !important;
          cursor: pointer !important;
          margin-top: -5px !important; /* Center the thumb vertically on a 4px track */
          transition:
            transform 0.1s ease,
            background-color 0.1s ease !important;
        }
        input[type='range'].custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15) !important;
          filter: brightness(0.9) !important;
        }
        input[type='range'].custom-slider::-webkit-slider-thumb:active {
          transform: scale(0.95) !important;
        }

        /* Thumb styling (Firefox) */
        input[type='range'].custom-slider::-moz-range-thumb {
          width: 14px !important;
          height: 14px !important;
          border-radius: 50% !important;
          background: hsl(var(--primary) / 0.6) !important;
          border: none !important;
          box-shadow: none !important;
          cursor: pointer !important;
          box-sizing: border-box !important;
          transition:
            transform 0.1s ease,
            background-color 0.1s ease !important;
        }
        input[type='range'].custom-slider::-moz-range-thumb:hover {
          transform: scale(1.15) !important;
          filter: brightness(0.9) !important;
        }
        input[type='range'].custom-slider::-moz-range-thumb:active {
          transform: scale(0.95) !important;
        }

        .dark input[type='range'].custom-slider::-webkit-slider-thumb,
        .darkblue input[type='range'].custom-slider::-webkit-slider-thumb,
        .charcoal input[type='range'].custom-slider::-webkit-slider-thumb,
        .teal input[type='range'].custom-slider::-webkit-slider-thumb,
        .emerald input[type='range'].custom-slider::-webkit-slider-thumb,
        .burgundy input[type='range'].custom-slider::-webkit-slider-thumb {
          border-color: #18181b !important;
        }

        .dark input[type='range'].custom-slider::-moz-range-thumb,
        .darkblue input[type='range'].custom-slider::-moz-range-thumb,
        .charcoal input[type='range'].custom-slider::-moz-range-thumb,
        .teal input[type='range'].custom-slider::-moz-range-thumb,
        .emerald input[type='range'].custom-slider::-moz-range-thumb,
        .burgundy input[type='range'].custom-slider::-moz-range-thumb {
          border-color: #18181b !important;
        }
      `}</style>
    </section>
  );
};

export default IndonesiaMap;
