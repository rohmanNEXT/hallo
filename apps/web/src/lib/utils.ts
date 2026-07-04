import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenLocation(location: string): string {
  if (!location) return location;

  return location
    .replace(/Kabupaten\s+/gi, "Kab. ")
    .replace(/Kota Administrasi\s+/gi, "Kota ")
    .replace(/Jakarta Pusat/gi, "Jakpus")
    .replace(/Jakarta Utara/gi, "Jakut")
    .replace(/Jakarta Barat/gi, "Jakbar")
    .replace(/Jakarta Timur/gi, "Jaktim")
    .replace(/Jakarta Selatan/gi, "Jaksel")
    .replace(/Daerah Khusus Ibukota Jakarta/gi, "DKI")
    .replace(/DKI Jakarta/gi, "DKI")
    .replace(/Banten/gi, "Banten")
    .replace(/Jawa Barat/gi, "Jabar")
    .replace(/Jawa Tengah/gi, "Jateng")
    .replace(/Jawa Timur/gi, "Jatim")
    .replace(/Daerah Istimewa Yogyakarta/gi, "DIY")
    .replace(/DI Yogyakarta/gi, "DIY")
    .replace(/Yogyakarta/gi, "DIY")
    .replace(/Aceh/gi, "Aceh")
    .replace(/Sumatera Utara/gi, "Sumut")
    .replace(/Sumatera Barat/gi, "Sumbar")
    .replace(/Sumatera Selatan/gi, "Sumsel")
    .replace(/Riau/gi, "Riau")
    .replace(/Kepulauan Riau/gi, "Kepri")
    .replace(/Jambi/gi, "Jambi")
    .replace(/Bengkulu/gi, "Bengkulu")
    .replace(/Lampung/gi, "Lampung")
    .replace(/Kepulauan Bangka Belitung/gi, "Babel")
    .replace(/Bangka Belitung/gi, "Babel")
    .replace(/Bali/gi, "Bali")
    .replace(/Nusa Tenggara Barat/gi, "NTB")
    .replace(/Nusa Tenggara Timur/gi, "NTT")
    .replace(/Kalimantan Barat/gi, "Kalbar")
    .replace(/Kalimantan Tengah/gi, "Kalteng")
    .replace(/Kalimantan Selatan/gi, "Kalsel")
    .replace(/Kalimantan Timur/gi, "Kaltim")
    .replace(/Kalimantan Utara/gi, "Kalut")
    .replace(/Sulawesi Utara/gi, "Sulut")
    .replace(/Sulawesi Tengah/gi, "Sulteng")
    .replace(/Sulawesi Selatan/gi, "Sulsel")
    .replace(/Sulawesi Tenggara/gi, "Sultra")
    .replace(/Sulawesi Barat/gi, "Sulbar")
    .replace(/Gorontalo/gi, "Gorontalo")
    .replace(/Maluku/gi, "Maluku")
    .replace(/Maluku Utara/gi, "Malut")
    .replace(/Papua/gi, "Papua")
    .replace(/Papua Barat/gi, "Pabar")
    .replace(/Papua Barat Daya/gi, "PBD")
    .replace(/Papua Tengah/gi, "Pateng")
    .replace(/Papua Selatan/gi, "Pasel")
    .replace(/Papua Pegunungan/gi, "Papeg")
    .replace(/Papua Barat Laut/gi, "PBL");
}

export function formatJobCount(count: number): string {
  if (count >= 1000) {
    const thousands = Math.floor(count / 1000);
    return `${thousands}rb`;
  }
  return count.toLocaleString('id-ID');
}
