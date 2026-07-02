'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppStore } from '@/store/store';

export interface MockReviewJob {
  id: string;
  title: string;
  company: string;
  salary: number;
  description: string;
  aiScore?: number;
  aiRecommendation?: string;
  status: 'in review' | 'aktif' | 'ditolak';
  serialId: string;
  createdAt?: string;
}

export interface Account {
  email: string;
  name: string;
  role: 'Company' | 'User';
  violationCount: number;
  status: 'Active' | 'Suspended' | 'Permanent Ban';
}

export interface MockCompany {
  id: string;
  name: string;
  email: string;
  status: 'verified' | 'review' | 'rejected';
  industry: string;
  joinedAt: string;
  viewed: boolean;
  createdAt: string;
  rejectedAt?: string;
  hasTeam?: boolean;
  verifyType?: 'old' | 'new' | 'update';
  aiScore?: number;
  rejectionReason?: string;
  updateRequestReason?: string;
}

export interface ViolationRecord {
  id: string;
  email: string;
  name: string;
  role: 'Company' | 'User';
  violationType:
    | 'Pembayaran Tidak Sah'
    | 'Lowongan Bermasalah yang Lolos Publikasi'
    | 'ID Chat Bermasalah';
  alertLevel: 'Light Warning' | 'Suspend 30 Days' | 'Permanent Ban';
  finalAiReason: string;
  date: string;
  daysAgo: number;
  blockType: 'By AI' | 'By Human';
  status: 'Active' | 'Trashed';
}

export interface AppealRequest {
  id: string;
  namaPelapor: string;
  emailPelapor: string;
  namaPelaku: string;
  emailPelaku: string;
  status: 'Pending' | 'Resolved' | 'Dismissed';
  alasan: string;
  tanggal: string;
  idChat: string;
  idLowongan: string;
  alertLevel: 'Light Warning' | 'Suspend 30 Days' | 'Permanent Ban';
}

interface ModerationContextProps {
  // Store items
  employerJobs: any[];
  updateEmployerJobStatus: (id: string, status: string) => void;
  user: any;
  theme: string;

  // Toast
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  handleCopyId: (id: string) => void;

  // AI Moderation toggle
  aiModeration: boolean;
  setAiModeration: React.Dispatch<React.SetStateAction<boolean>>;

  // Views / Detail selections (Shared for layout transition back/forth)
  selectedJobDetail: any | null;
  setSelectedJobDetail: React.Dispatch<React.SetStateAction<any | null>>;
  selectedCheckDetail: any | null;
  setSelectedCheckDetail: React.Dispatch<React.SetStateAction<any | null>>;

  // States
  viewedJobIds: Set<string>;
  setViewedJobIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  viewedAppealIds: Set<string>;
  setViewedAppealIds: React.Dispatch<React.SetStateAction<Set<string>>>;

  aiConfig: { apiKey: string; model: string; provider: string };
  setAiConfig: React.Dispatch<React.SetStateAction<{ apiKey: string; model: string; provider: string }>>;

  mockCompanies: MockCompany[];
  setMockCompanies: React.Dispatch<React.SetStateAction<MockCompany[]>>;

  localReviewJobs: MockReviewJob[];
  setLocalReviewJobs: React.Dispatch<React.SetStateAction<MockReviewJob[]>>;

  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;

  violations: ViolationRecord[];
  setViolations: React.Dispatch<React.SetStateAction<ViolationRecord[]>>;

  appeals: AppealRequest[];
  setAppeals: React.Dispatch<React.SetStateAction<AppealRequest[]>>;

  // Shared Helper Handlers
  getDaysDiff: (dateStr?: string) => number;
  handleAiScanAll: (filteredJobs: MockReviewJob[]) => void;
  isScanningAll: boolean;
  handleAutoAcceptPass: (filteredJobs: MockReviewJob[]) => void;
  handleApproveJob: (jobId: string) => void;
  handleRejectJob: (jobId: string) => void;

  // DB Scan & manual checks
  checkEmail: string;
  setCheckEmail: React.Dispatch<React.SetStateAction<string>>;
  foundAccount: Account | null;
  setFoundAccount: React.Dispatch<React.SetStateAction<Account | null>>;
  checkChatId: string;
  setCheckChatId: React.Dispatch<React.SetStateAction<string>>;
  checkJobId: string;
  setCheckJobId: React.Dispatch<React.SetStateAction<string>>;
  checkError: string;
  setCheckError: React.Dispatch<React.SetStateAction<string>>;
  handleCheckEmail: () => Promise<void>;
  handleCheckDetails: () => void;

  isScanning: boolean;
  dbScanResults: any[];
  setDbScanResults: React.Dispatch<React.SetStateAction<any[]>>;
  selectedDbItem: any | null;
  setSelectedDbItem: React.Dispatch<React.SetStateAction<any | null>>;
  handleScanDatabase: () => Promise<void>;
  handleViewDbItemDetail: (item: any) => void;
  handleBlockAccount: (blockType: 'By AI' | 'By Human') => void;
  handleDbBlock: (item: any, blockType: 'By AI' | 'By Human') => void;

  // Appeals
  selectedAppeal: AppealRequest | null;
  setSelectedAppeal: React.Dispatch<React.SetStateAction<AppealRequest | null>>;
  handleResolveAppeal: (appeal: AppealRequest, action: 'Unblock' | 'Reject') => void;
  handleViewAppealChatDetail: (appeal: any) => void;
  handleViewAppealJobDetail: (appeal: any) => void;
  runRetentionCleanup: () => void;
  handleResolveAppealStatus: (id: string, action: 'Resolved' | 'Dismissed') => void;
}

const ModerationContext = createContext<ModerationContextProps | undefined>(undefined);

export const ModerationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { employerJobs, updateEmployerJobStatus, user, theme } = useAppStore();

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (
    text: string,
    type: 'success' | 'error' | 'info' = 'success',
  ) => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    showToast(`ID ${id} berhasil disalin!`, 'success');
  };

  const [aiModeration, setAiModeration] = useState<boolean>(false);
  const [selectedJobDetail, setSelectedJobDetail] = useState<any | null>(null);
  const [selectedCheckDetail, setSelectedCheckDetail] = useState<any | null>(null);

  // Custom Filter States
  const [viewedJobIds, setViewedJobIds] = useState<Set<string>>(new Set());
  const [viewedAppealIds, setViewedAppealIds] = useState<Set<string>>(new Set());

  // AI Config States
  const [aiConfig, setAiConfig] = useState({
    apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    model: 'gpt-4o-mini',
    provider: 'Gemini',
  });

  const [mockCompanies, setMockCompanies] = useState<MockCompany[]>(() => {
    const verifiedTemplates = [
      { name: 'PT Astra International', industry: 'Automotive' },
      { name: 'PT Bank Central Asia', industry: 'Banking' },
      { name: 'PT Telkom Indonesia', industry: 'Telecommunications' },
      { name: 'PT Unilever Indonesia', industry: 'Consumer Goods' },
      { name: 'PT Gojek Teknologi', industry: 'Technology' },
      { name: 'PT Tokopedia Indonesia', industry: 'E-Commerce' },
      { name: 'PT Shopee Indonesia', industry: 'E-Commerce' },
      { name: 'PT Bukalapak', industry: 'E-Commerce' },
      { name: 'PT Traveloka', industry: 'Travel & Tourism' },
      { name: 'PT Grab Indonesia', industry: 'Transportation' },
      { name: 'PT Indofood Sukses Makmur', industry: 'Food & Beverage' },
      { name: 'PT Pertamina', industry: 'Energy & Mining' },
      { name: 'PT PLN (Persero)', industry: 'Energy & Mining' },
      { name: 'PT Mandiri Utama Finance', industry: 'Finance' },
      { name: 'PT Bank Negara Indonesia', industry: 'Banking' },
      { name: 'PT Garuda Indonesia', industry: 'Aviation' },
      { name: 'PT Semen Indonesia', industry: 'Construction Material' },
      { name: 'PT Kalbe Farma', industry: 'Pharmaceutical' },
      { name: 'PT Matahari Department Store', industry: 'Retail' },
      { name: 'PT XL Axiata', industry: 'Telecommunications' },
      { name: 'PT Indosat Ooredoo', industry: 'Telecommunications' },
      { name: 'PT Wijaya Karya', industry: 'Construction' },
      { name: 'PT Adaro Energy', industry: 'Energy & Mining' },
      { name: 'PT Kimia Farma', industry: 'Pharmaceutical' },
      { name: 'PT Bank Mandiri', industry: 'Banking' },
      { name: 'CV Karya Digital Nusantara', industry: 'Software' },
      { name: 'PT Inti Digitalindo', industry: 'Technology' },
      { name: 'PT Solusi Teknologi Bangsa', industry: 'Technology' },
      { name: 'PT Kreasi Media Utama', industry: 'Media' },
      { name: 'PT Inovasi Anak Negeri', industry: 'Technology' },
      { name: 'PT Maju Bersama Group', industry: 'Conglomerate' },
      { name: 'PT Bumi Resources', industry: 'Energy & Mining' },
      { name: 'PT Jasa Marga', industry: 'Infrastructure' },
      { name: 'PT Aneka Tambang', industry: 'Energy & Mining' },
      { name: 'PT Indika Energy', industry: 'Energy & Mining' },
      { name: 'PT Maybank Indonesia', industry: 'Banking' },
      { name: 'PT CIMB Niaga', industry: 'Banking' },
      { name: 'PT Danamon Indonesia', industry: 'Banking' },
      { name: 'PT Pegadaian', industry: 'Finance' },
      { name: 'PT Taspen', industry: 'Finance' },
      { name: 'PT Pos Indonesia', industry: 'Logistics' },
      { name: 'PT JNE Express', industry: 'Logistics' },
      { name: 'PT SiCepat Ekspres', industry: 'Logistics' },
      { name: 'PT J&T Express', industry: 'Logistics' },
      { name: 'PT Anteraja', industry: 'Logistics' },
      { name: 'PT Ninja Express', industry: 'Logistics' },
      { name: 'PT Lalamove Indonesia', industry: 'Transportation' },
      { name: 'PT Maxim Indonesia', industry: 'Transportation' },
      { name: 'PT Tiket.com', industry: 'Travel & Tourism' },
      { name: 'PT Pegipegi', industry: 'Travel & Tourism' },
      { name: 'PT OYO Life Indonesia', industry: 'Hospitality' },
      { name: 'PT Kopi Kenangan', industry: 'Food & Beverage' },
      { name: 'PT Sayurbox', industry: 'Food & Beverage' },
      { name: 'PT HappyFresh', industry: 'Food & Beverage' },
      { name: 'PT Klikdokter', industry: 'Healthcare' },
      { name: 'PT Alodokter', industry: 'Healthcare' },
      { name: 'PT Halodoc', industry: 'Healthcare' },
      { name: 'PT SehatQ', industry: 'Healthcare' },
      { name: 'PT PrimaKu', industry: 'Healthcare' },
      { name: 'PT Ruangguru', industry: 'Education' },
      { name: 'PT Zenius Education', industry: 'Education' },
      { name: 'PT Coursera Indonesia', industry: 'Education' },
      { name: 'PT Dicoding Indonesia', industry: 'Education' },
      { name: 'PT Sanbercode', industry: 'Education' },
      { name: 'PT Amartha', industry: 'Finance' },
      { name: 'PT OVO Finansial', industry: 'Finance' },
      { name: 'PT Dana Indonesia', industry: 'Finance' },
      { name: 'PT LinkAja', industry: 'Finance' },
      { name: 'PT Kredivo', industry: 'Finance' },
      { name: 'PT Akulaku Finance', industry: 'Finance' },
      { name: 'PT Moladin Digital Indonesia', industry: 'Automotive' },
      { name: 'PT Carro Indonesia', industry: 'Automotive' },
      { name: 'PT Stockbit Sekuritas', industry: 'Finance' },
      { name: 'PT Bibit Tumbuh Bersama', industry: 'Finance' },
      { name: 'PT Pluang', industry: 'Finance' },
      { name: 'PT Xendit', industry: 'Finance' },
      { name: 'PT Midtrans', industry: 'Finance' },
      { name: 'PT iPaymu', industry: 'Finance' },
      { name: 'PT Kata.ai', industry: 'Technology' },
    ];

    const joinDates = [
      '2024-01-10','2024-02-14','2024-03-05','2024-04-20','2024-05-11',
      '2024-06-08','2024-07-22','2024-08-17','2024-09-03','2024-10-30',
      '2024-11-19','2024-12-01','2025-01-08','2025-02-22','2025-03-14',
      '2025-04-09','2025-05-27','2025-06-06','2025-07-15','2025-08-04',
    ];

    const generatedVerified: MockCompany[] = verifiedTemplates.map((t, i) => {
      const num = i + 201;
      const dIdx = i % joinDates.length;
      const domain = t.name.toLowerCase().replace(/\bpt\b|\bcv\b/g,'').replace(/[^a-z0-9]/g,'').trim().slice(0,12);
      return {
        id: `COMP-${num}`,
        name: t.name,
        email: `hr@${domain}.co.id`,
        status: 'verified',
        industry: t.industry,
        joinedAt: joinDates[dIdx]!,
        viewed: true,
        createdAt: joinDates[dIdx]!,
        hasTeam: i % 3 !== 0,
      };
    });

    return [
      ...generatedVerified,
      {
        id: 'COMP-101',
        name: 'PT Global Data Indo',
        email: 'hr@globaldata.com',
        status: 'verified',
        industry: 'Technology',
        joinedAt: '2026-06-20',
        viewed: true,
        createdAt: '2026-06-20',
        hasTeam: true,
      },
      {
        id: 'COMP-102',
        name: 'Tech Startup XYZ',
        email: 'hello@techxyz.io',
        status: 'verified',
        industry: 'Software',
        joinedAt: '2026-06-18',
        viewed: true,
        createdAt: '2026-06-18',
        hasTeam: false,
      },
      {
        id: 'COMP-103',
        name: 'PT Media Kreatif',
        email: 'admin@mediakreatif.co.id',
        status: 'review',
        industry: 'Media',
        joinedAt: '2026-06-25',
        viewed: false,
        createdAt: '2026-06-25',
        verifyType: 'new',
        aiScore: 45,
      },
      {
        id: 'COMP-104',
        name: 'Studio Pixel Utama',
        email: 'design@pixelutama.com',
        status: 'rejected',
        industry: 'Design',
        joinedAt: '2026-06-22',
        viewed: true,
        createdAt: '2026-06-22',
        rejectedAt: '2026-06-23',
        verifyType: 'old',
        aiScore: 30,
        rejectionReason:
          'Dokumen legalitas SIUP yang diunggah palsu atau hasil editan, nama direktur tidak sesuai dengan akta pendirian. Selain itu, alamat kantor yang tertera pada dokumen NIB berbeda dengan lokasi fisik yang tercantum di Google Maps. Berdasarkan pengecekan lebih lanjut, NPWP perusahaan juga tidak valid saat dicocokkan dengan basis data perpajakan. Kami mencurigai adanya upaya pemalsuan dokumen yang disengaja. Oleh karena itu, pengajuan verifikasi perusahaan ini ditolak secara permanen dan kami melarang perusahaan untuk mendaftar kembali menggunakan identitas yang sama. Keputusan ini bersifat mutlak berdasarkan panduan komunitas kami.',
      },
      {
        id: 'COMP-105',
        name: 'Kreasi Anak Bangsa',
        email: 'support@kreasianak.id',
        status: 'review',
        industry: 'Creative',
        joinedAt: '2026-07-01',
        viewed: false,
        createdAt: '2026-07-01',
        verifyType: 'update',
        aiScore: 85,
        updateRequestReason:
          'Halo tim Admin JobStreet, kami ingin mengajukan pembaruan dokumen NIB karena perusahaan kami baru saja melakukan perubahan struktur kepengurusan dan menambah klasifikasi bidang usaha baru (KBLI). Kami juga telah melampirkan foto terbaru dari kantor fisik kami yang baru saja pindah alamat pada awal bulan ini. Selain itu, kami menyertakan scan KTP terbaru dari direktur utama yang baru beserta swafoto sesuai dengan panduan. Mohon agar pengajuan pembaruan data kami ini dapat segera diproses dan diverifikasi karena kami sedang membutuhkan akun ini untuk segera membuka lowongan pekerjaan dalam skala besar minggu depan. Jika ada dokumen tambahan yang kurang, mohon segera informasikan kepada kami melalui email. Terima kasih atas bantuannya.',
      },
      {
        id: 'COMP-106',
        name: 'Logistik Nusantara',
        email: 'info@logistiknusantara.co.id',
        status: 'rejected',
        industry: 'Logistics',
        joinedAt: '2026-06-10',
        viewed: true,
        createdAt: '2026-06-10',
        rejectedAt: '2026-06-11',
        verifyType: 'new',
        aiScore: 40,
        rejectionReason:
          'Alamat kantor fiktif dan nomor telepon tidak dapat dihubungi setelah 3 kali percobaan verifikasi.',
      },
      {
        id: 'COMP-107',
        name: 'Pangan Makmur PT',
        email: 'hrd@panganmakmur.com',
        status: 'rejected',
        industry: 'Agriculture',
        joinedAt: '2026-06-01',
        viewed: true,
        createdAt: '2026-06-01',
        rejectedAt: '2026-06-02',
        verifyType: 'update',
      },
      {
        id: 'COMP-108',
        name: 'Tekno Solusindo',
        email: 'biz@teknosolusindo.net',
        status: 'rejected',
        industry: 'Technology',
        joinedAt: '2026-05-01',
        viewed: true,
        createdAt: '2026-05-01',
        rejectedAt: '2026-05-02',
      },
      {
        id: 'COMP-109',
        name: 'Karya Prima Utama',
        email: 'contact@karyaprima.com',
        status: 'rejected',
        industry: 'Construction',
        joinedAt: '2026-04-01',
        viewed: true,
        createdAt: '2026-04-01',
        rejectedAt: '2026-04-02',
      },
      {
        id: 'COMP-110',
        name: 'Sinergi Mulia Jaya',
        email: 'sales@sinergimulia.com',
        status: 'rejected',
        industry: 'Services',
        joinedAt: '2026-02-01',
        viewed: true,
        createdAt: '2026-02-01',
        rejectedAt: '2026-02-02',
      },
    ];
  });

  const [localReviewJobs, setLocalReviewJobs] = useState<MockReviewJob[]>(() => {
    const list: MockReviewJob[] = [
      {
        id: 'mock-review-1',
        title: 'Remote Data Entry Clerk',
        company: 'PT Global Data Indo',
        salary: 4500000,
        description:
          'Mencari staf data entry remote dengan komisi harian melimpah. Wajib membayar uang registrasi pendaftaran 50 ribu.',
        aiScore: 35,
        aiRecommendation: 'Risiko Tinggi (Meminta uang pendaftaran)',
        status: 'in review',
        serialId: 'SRL-A1B2C3',
        createdAt: '2026-06-25',
      },
      {
        id: 'mock-review-2',
        title: 'Senior Frontend Engineer',
        company: 'Tech Startup XYZ',
        salary: 18000000,
        description:
          'Membangun dashboard analisis data real-time menggunakan React, TypeScript, dan Tailwind CSS.',
        aiScore: 98,
        aiRecommendation: 'Aman & Sesuai Kebijakan',
        status: 'in review',
        serialId: 'SRL-D4E5F6',
        createdAt: '2026-06-28',
      },
    ];

    const templates = [
      {
        title: 'Social Media Specialist',
        company: 'PT Media Kreatif',
        salary: 6000000,
        description:
          'Mengelola postingan harian, berinteraksi dengan audiens, dan menganalisis metrik media sosial.',
        aiScore: 92,
        aiRecommendation: 'Aman & Sesuai Kebijakan',
      },
      {
        title: 'Graphic Designer',
        company: 'Studio Pixel Utama',
        salary: 7500000,
        description:
          'Membuat desain visual berkualitas tinggi untuk keperluan promosi digital dan cetak.',
        aiScore: 90,
        aiRecommendation: 'Aman & Sesuai Kebijakan',
      },
      {
        title: 'Admin Online Shop',
        company: 'Toko Sukses Jaya',
        salary: 3500000,
        description:
          'Membalas chat pelanggan, mengemas barang, dan menginput resi pengiriman.',
        aiScore: 88,
        aiRecommendation: 'Aman & Sesuai Kebijakan',
      },
      {
        title: 'Staf Administrasi',
        company: 'PT Finansial Mandiri',
        salary: 5000000,
        description:
          'Mengurus dokumen kantor, pengarsipan data keuangan, dan membantu koordinasi internal.',
        aiScore: 95,
        aiRecommendation: 'Aman & Sesuai Kebijakan',
      },
      {
        title: 'Content Writer',
        company: 'Penerbit Wacana',
        salary: 5500000,
        description:
          'Menulis artikel SEO, naskah promosi, dan konten edukatif yang menarik pembaca.',
        aiScore: 89,
        aiRecommendation: 'Aman & Sesuai Kebijakan',
      },
    ];

    for (let i = 3; i <= 60; i++) {
      const template = templates[(i - 3) % templates.length];
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let randCode = '';
      for (let c = 0; c < 6; c++) {
        randCode += chars[Math.floor(Math.random() * chars.length)];
      }
      const daysAgo = Math.floor(Math.random() * 100) + 1;
      const date = new Date('2026-07-01');
      date.setDate(date.getDate() - daysAgo);
      const dateString = date.toISOString().split('T')[0];
      list.push({
        id: `mock-review-${i}`,
        title: template.title,
        company: template.company,
        salary: template.salary,
        description: template.description,
        aiScore: template.aiScore,
        aiRecommendation: template.aiRecommendation,
        status: 'in review',
        serialId: `SRL-${randCode}`,
        createdAt: dateString,
      });
    }
    return list;
  });

  const [accounts, setAccounts] = useState<Account[]>([
    {
      email: 'hr@tokopedia.com',
      name: 'PT Tokopedia',
      role: 'Company',
      violationCount: 0,
      status: 'Active',
    },
    {
      email: 'admin@scammer.com',
      name: 'PT Cepat Kaya',
      role: 'Company',
      violationCount: 2,
      status: 'Suspended',
    },
    {
      email: 'budi@gmail.com',
      name: 'Budi Santoso',
      role: 'User',
      violationCount: 1,
      status: 'Active',
    },
    {
      email: 'andi@gmail.com',
      name: 'Andi Pratama',
      role: 'User',
      violationCount: 2,
      status: 'Suspended',
    },
    {
      email: 'cyber@hack.com',
      name: 'Cyber Hacker',
      role: 'User',
      violationCount: 3,
      status: 'Permanent Ban',
    },
  ]);

  const [violations, setViolations] = useState<ViolationRecord[]>([
    {
      id: 'VIOL-001',
      email: 'budi@gmail.com',
      name: 'Budi Santoso',
      role: 'User',
      violationType: 'ID Chat Bermasalah',
      alertLevel: 'Light Warning',
      finalAiReason: 'Mengirim tautan phising pada obrolan ID CHAT-801',
      date: '2026-06-15',
      daysAgo: 9,
      blockType: 'By Human',
      status: 'Active',
    },
    {
      id: 'VIOL-002',
      email: 'admin@scammer.com',
      name: 'PT Cepat Kaya',
      role: 'Company',
      violationType: 'Lowongan Bermasalah yang Lolos Publikasi',
      alertLevel: 'Suspend 30 Days',
      finalAiReason: 'Laporan pembayaran di luar aplikasi pada loker JOB-001',
      date: '2026-06-01',
      daysAgo: 23,
      blockType: 'By AI',
      status: 'Active',
    },
    {
      id: 'VIOL-003',
      email: 'oldscam@trash.com',
      name: 'PT Penipu Ulung',
      role: 'Company',
      violationType: 'Pembayaran Tidak Sah',
      alertLevel: 'Light Warning',
      finalAiReason: 'Memodifikasi sistem transaksi API di loker',
      date: '2026-04-10',
      daysAgo: 75,
      blockType: 'By AI',
      status: 'Trashed',
    },
    {
      id: 'VIOL-004',
      email: 'cyber@hack.com',
      name: 'Cyber Hacker',
      role: 'User',
      violationType: 'Pembayaran Tidak Sah',
      alertLevel: 'Permanent Ban',
      finalAiReason: 'Bypass payment gateway secara ilegal',
      date: '2026-04-01',
      daysAgo: 84,
      blockType: 'By Human',
      status: 'Trashed',
    },
  ]);

  const [appeals, setAppeals] = useState<AppealRequest[]>(() => {
    const baseAppeals: AppealRequest[] = [
      {
        id: 'APP-001',
        namaPelapor: 'Budi Santoso',
        emailPelapor: 'budi@gmail.com',
        namaPelaku: 'PT Cepat Kaya',
        emailPelaku: 'admin@scammer.com',
        status: 'Pending',
        alasan:
          'Terdeteksi mengirim link luar sistem dan meminta uang admin melalui chat',
        tanggal: '19 Jun 2026',
        idChat: 'CHAT-801',
        idLowongan: 'N/A',
        alertLevel: 'Light Warning',
      },
      {
        id: 'APP-002',
        namaPelapor: 'Siti Rahayu',
        emailPelapor: 'siti@yahoo.com',
        namaPelaku: 'PT Cepat Kaya',
        emailPelaku: 'admin@scammer.com',
        status: 'Pending',
        alasan:
          'Lowongan meminta biaya pendaftaran di luar platform sebesar Rp 150.000',
        tanggal: '18 Jun 2026',
        idChat: 'N/A',
        idLowongan: 'JOB-001',
        alertLevel: 'Suspend 30 Days',
      },
      {
        id: 'APP-003',
        namaPelapor: 'Andi Pratama',
        emailPelapor: 'andi@gmail.com',
        namaPelaku: 'Cyber Hacker',
        emailPelaku: 'cyber@hack.com',
        status: 'Dismissed',
        alasan: 'Spam berulang dan konten berbahaya di chat job application',
        tanggal: '15 Jun 2026',
        idChat: 'CHAT-420',
        idLowongan: 'N/A',
        alertLevel: 'Permanent Ban',
      },
    ];

    const appealTemplates = [
      {
        pelapor: 'Rizki Aditya',
        emailPelapor: 'rizki.aditya@gmail.com',
        pelaku: 'PT Karya Niaga',
        emailPelaku: 'hrd@karya-niaga.com',
        alasan: 'Perusahaan meminta biaya registrasi sebesar Rp 200.000 sebelum wawancara kerja dilaksanakan.',
        idChat: 'N/A',
        idLowongan: 'JOB-110',
        alertLevel: 'Suspend 30 Days' as const,
      },
      {
        pelapor: 'Dewi Kartika',
        emailPelapor: 'dewi.kartika@yahoo.com',
        pelaku: 'Ahmad Faizal',
        emailPelaku: 'faizal88@hotmail.com',
        alasan: 'Mengirimkan pesan berisi tautan phising yang mengatasnamakan JobStreet kepada pelamar.',
        idChat: 'CHAT-902',
        idLowongan: 'N/A',
        alertLevel: 'Permanent Ban' as const,
      },
      {
        pelapor: 'Fajar Nugroho',
        emailPelapor: 'fajar.nugroho@gmail.com',
        pelaku: 'PT Maju Terus',
        emailPelaku: 'admin@majuterus.co.id',
        alasan: 'Lowongan kerja fiktif, pelamar diminta mentransfer uang seragam Rp 350.000.',
        idChat: 'N/A',
        idLowongan: 'JOB-220',
        alertLevel: 'Permanent Ban' as const,
      },
      {
        pelapor: 'Putri Handayani',
        emailPelapor: 'putri.h@gmail.com',
        pelaku: 'Rudi Hermawan',
        emailPelaku: 'rudi.h@gmail.com',
        alasan: 'Pengguna mengirim spam lamaran dan pesan tidak relevan ke banyak pelamar lain.',
        idChat: 'CHAT-303',
        idLowongan: 'N/A',
        alertLevel: 'Light Warning' as const,
      },
      {
        pelapor: 'Agung Prasetyo',
        emailPelapor: 'agung.pras@gmail.com',
        pelaku: 'PT Digital Prima',
        emailPelaku: 'info@digitalprima.id',
        alasan: 'Informasi gaji yang dicantumkan sangat menyesatkan dan tidak sesuai dengan realita pekerjaan.',
        idChat: 'N/A',
        idLowongan: 'JOB-445',
        alertLevel: 'Light Warning' as const,
      },
      {
        pelapor: 'Lestari Wulandari',
        emailPelapor: 'lestari.w@outlook.com',
        pelaku: 'PT Rekrut Cepat',
        emailPelaku: 'hr@rekrutcepat.com',
        alasan: 'Proses perekrutan ilegal, meminta data KTP, KK, dan nomor rekening sebelum kontrak ditandatangani.',
        idChat: 'CHAT-567',
        idLowongan: 'N/A',
        alertLevel: 'Suspend 30 Days' as const,
      },
      {
        pelapor: 'Hendra Kusuma',
        emailPelapor: 'hendra.k@gmail.com',
        pelaku: 'Sari Melati',
        emailPelaku: 'sari.melati@yahoo.com',
        alasan: 'Akun palsu yang menggunakan foto orang lain dan menipu pencari kerja dengan janji gaji tinggi.',
        idChat: 'CHAT-888',
        idLowongan: 'N/A',
        alertLevel: 'Permanent Ban' as const,
      },
      {
        pelapor: 'Yuni Astuti',
        emailPelapor: 'yuni.astuti@gmail.com',
        pelaku: 'PT Solusi Karir',
        emailPelaku: 'admin@solusikarir.net',
        alasan: 'Menolak membayar gaji karyawan kontrak dan mengancam pelamar yang protes.',
        idChat: 'N/A',
        idLowongan: 'JOB-778',
        alertLevel: 'Suspend 30 Days' as const,
      },
      {
        pelapor: 'Bayu Setiawan',
        emailPelapor: 'bayu.s@gmail.com',
        pelaku: 'CV Berkah Abadi',
        emailPelaku: 'hrd@berkah-abadi.com',
        alasan: 'Perusahaan menawarkan posisi yang tidak ada dan meminta uang training fee Rp 500.000.',
        idChat: 'N/A',
        idLowongan: 'JOB-991',
        alertLevel: 'Permanent Ban' as const,
      },
      {
        pelapor: 'Nadia Permata',
        emailPelapor: 'nadia.permata@gmail.com',
        pelaku: 'Dodi Susanto',
        emailPelaku: 'dodi.s@hotmail.com',
        alasan: 'Mengirim konten tidak pantas dan melecehkan melalui fitur chat lamaran kerja.',
        idChat: 'CHAT-112',
        idLowongan: 'N/A',
        alertLevel: 'Permanent Ban' as const,
      },
    ];

    const dates = [
      '2026-06-01','2026-06-03','2026-06-05','2026-06-07','2026-06-09',
      '2026-06-11','2026-06-13','2026-06-15','2026-06-17','2026-06-19',
      '2026-06-21','2026-06-23','2026-06-25','2026-06-27','2026-06-29',
    ];

    for (let i = 4; i <= 45; i++) {
      const t = appealTemplates[(i - 4) % appealTemplates.length];
      const idx = (i - 4) % dates.length;
      baseAppeals.push({
        id: `APP-${String(i).padStart(3, '0')}`,
        namaPelapor: t.pelapor,
        emailPelapor: t.emailPelapor,
        namaPelaku: t.pelaku,
        emailPelaku: t.emailPelaku,
        status: 'Pending',
        alasan: t.alasan,
        tanggal: dates[idx]!,
        idChat: t.idChat,
        idLowongan: t.idLowongan,
        alertLevel: t.alertLevel,
      });
    }

    return baseAppeals;
  });

  // Form states for Check Account
  const [checkEmail, setCheckEmail] = useState<string>('');
  const [foundAccount, setFoundAccount] = useState<Account | null>(null);
  const [checkChatId, setCheckChatId] = useState<string>('');
  const [checkJobId, setCheckJobId] = useState<string>('');
  const [checkError, setCheckError] = useState<string>('');

  // Scanning database states
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [dbScanResults, setDbScanResults] = useState<any[]>([]);
  const [selectedDbItem, setSelectedDbItem] = useState<any | null>(null);

  // Selected Appeal Detail
  const [selectedAppeal, setSelectedAppeal] = useState<AppealRequest | null>(null);

  const getDaysDiff = (dateStr?: string) => {
    if (!dateStr) return 999;
    const date = new Date(dateStr);
    const now = new Date('2026-07-01');
    const diffTime = now.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const [isScanningAll, setIsScanningAll] = useState(false);

  const handleAiScanAll = (filteredJobs: MockReviewJob[]) => {
    if (filteredJobs.length === 0) {
      showToast('Tidak ada lowongan untuk dipindai.', 'info');
      return;
    }
    setIsScanningAll(true);
    setTimeout(() => {
      setLocalReviewJobs((prev) =>
        prev.map((j) => {
          if (filteredJobs.some((fj) => fj.id === j.id)) {
            const isSuspicious =
              j.description.toLowerCase().includes('uang') ||
              j.description.toLowerCase().includes('bayar');
            return {
              ...j,
              aiScore: isSuspicious ? 20 : 95,
              aiRecommendation: isSuspicious
                ? 'Sangat Mencurigakan (Kata kunci pembayaran terdeteksi)'
                : 'Lolos Pemindaian AI',
            };
          }
          return j;
        }),
      );
      setIsScanningAll(false);
      showToast(
        'Pemindaian AI selesai untuk semua lowongan di halaman ini!',
        'success',
      );
    }, 1500);
  };

  const handleAutoAcceptPass = (filteredJobs: MockReviewJob[]) => {
    const targetJobs = filteredJobs.filter(
      (job) => job.aiScore === undefined || job.aiScore >= 50,
    );
    if (targetJobs.length === 0) {
      showToast('Tidak ada lowongan yang lolos untuk disetujui.', 'info');
      return;
    }

    targetJobs.forEach((job) => {
      if (employerJobs.some((j) => j.id === job.id)) {
        updateEmployerJobStatus(job.id, 'aktif');
      }
    });

    const targetIds = new Set(targetJobs.map((j) => j.id));
    setLocalReviewJobs((prev) =>
      prev.map((j) => (targetIds.has(j.id) ? { ...j, status: 'aktif' } : j)),
    );

    showToast(
      `Berhasil menyetujui ${targetJobs.length} lowongan yang lolos pemindaian AI!`,
      'success',
    );
  };

  const handleApproveJob = (jobId: string) => {
    if (employerJobs.some((j) => j.id === jobId)) {
      updateEmployerJobStatus(jobId, 'aktif');
    }
    setLocalReviewJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'aktif' } : j)),
    );
    showToast('Lowongan berhasil disetujui dan dipublikasikan!', 'success');
  };

  const handleRejectJob = (jobId: string) => {
    if (employerJobs.some((j) => j.id === jobId)) {
      updateEmployerJobStatus(jobId, 'ditolak');
    }
    setLocalReviewJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'ditolak' } : j)),
    );
    showToast('Lowongan berhasil ditolak!', 'success');
  };

  const handleCheckEmail = async () => {
    setCheckError('');
    setFoundAccount(null);
    setSelectedCheckDetail(null);

    if (!checkEmail.includes('@')) {
      setCheckError('Format email tidak valid.');
      return;
    }

    const matched = accounts.find(
      (a) => a.email.toLowerCase() === checkEmail.toLowerCase(),
    );
    if (matched) {
      setFoundAccount(matched);
    } else {
      setCheckError('Email tidak ditemukan di database.');
    }
  };

  const handleCheckDetails = () => {
    if (!foundAccount) return;

    let alertLevel: 'Light Warning' | 'Suspend 30 Days' | 'Permanent Ban' =
      'Light Warning';
    let reason = 'AI mendeteksi akun aman.';
    let chatDetails: any[] | undefined = undefined;
    let jobDetails: any | undefined = undefined;

    const isCompany = foundAccount.role === 'Company';
    const nextViolationNumber = foundAccount.violationCount + 1;

    if (checkChatId) {
      const chatLower = checkChatId.toLowerCase();
      if (
        chatLower.includes('801') ||
        chatLower.includes('judi') ||
        chatLower.includes('slot') ||
        chatLower.includes('phish') ||
        chatLower.includes('luar')
      ) {
        chatDetails = [
          {
            sender: 'Sistem',
            message: 'Chat dimulai antara Budi Santoso dan PT Cepat Kaya.',
            timestamp: '10:00',
          },
          {
            sender: 'PT Cepat Kaya',
            message:
              'Halo Budi, untuk registrasi wajib deposit dulu ke link ini: http://cepat-kaya.com/deposit-slot',
            timestamp: '10:02',
          },
          {
            sender: 'Budi Santoso',
            message: 'Oh baik pak, saya transfer sekarang.',
            timestamp: '10:03',
          },
        ];
      } else {
        chatDetails = [
          {
            sender: 'Sistem',
            message: `Obrolan ID ${checkChatId.toUpperCase()} terdaftar.`,
            timestamp: '09:15',
          },
          {
            sender: foundAccount.name,
            message: 'Halo, apakah lowongan ini masih tersedia?',
            timestamp: '09:16',
          },
          {
            sender: 'Lawan Bicara',
            message: 'Ya masih, silakan kirimkan CV Anda.',
            timestamp: '09:18',
          },
        ];
      }

      if (
        chatLower.includes('judi') ||
        chatLower.includes('slot') ||
        chatLower.includes('porn') ||
        chatLower.includes('keburukan') ||
        chatLower.includes('kasar')
      ) {
        if (isCompany) {
          if (nextViolationNumber === 1) {
            alertLevel = 'Light Warning';
            reason =
              'Pelanggaran 1 (ID Chat Keburukan): Peringatan (email, beranda).';
          } else if (nextViolationNumber === 2) {
            alertLevel = 'Suspend 30 Days';
            reason =
              'Pelanggaran 2 (ID Chat Keburukan): Suspend akun sementara (30 hari).';
          } else {
            alertLevel = 'Permanent Ban';
            reason = 'Pelanggaran 3 (ID Chat Keburukan): Blokir permanen akun.';
          }
        } else {
          if (nextViolationNumber === 1) {
            alertLevel = 'Light Warning';
            reason =
              'Pelanggaran 1 (ID Chat Keburukan): Postingan dihapus + peringatan.';
          } else if (nextViolationNumber === 2) {
            alertLevel = 'Suspend 30 Days';
            reason =
              'Pelanggaran 2 (ID Chat Keburukan): Suspend akun sementara (30 hari).';
          } else {
            alertLevel = 'Permanent Ban';
            reason = 'Pelanggaran 3 (ID Chat Keburukan): Blokir permanen akun.';
          }
        }
      } else if (
        chatLower.includes('transfer') ||
        chatLower.includes('payment') ||
        chatLower.includes('bayar') ||
        chatLower.includes('mod')
      ) {
        alertLevel = 'Permanent Ban';
        reason =
          'Pelanggaran Pembayaran Tidak Sah (di luar app/mod app) terdeteksi. Tindakan: Blokir Permanen langsung.';
      } else {
        reason = 'ID Chat dianalisis. Potensi pelanggaran ringan terdeteksi.';
      }
    } else if (checkJobId) {
      const job =
        localReviewJobs.find(
          (j) => j.id === checkJobId || j.serialId === checkJobId,
        ) ||
        employerJobs.find(
          (j) => j.id === checkJobId || j.serialId === checkJobId,
        );

      if (job) {
        jobDetails = {
          title: job.title,
          company: job.company,
          description: job.description,
          salary: job.salary,
          aiRecommendation:
            (job as any).aiRecommendation || 'Aman & Sesuai Kebijakan',
        };
      } else {
        jobDetails = {
          title: 'Remote Data Entry & Typing Specialist',
          company:
            foundAccount.role === 'Company'
              ? foundAccount.name
              : 'PT Maju Mundur Sentosa',
          description: `Pekerjaan mengetik dokumen harian secara remote. Pendaftaran gratis, namun wajib melakukan deposit awal sebesar Rp 150.000 untuk jaminan komitmen kerja.`,
          salary: 5000000,
          aiRecommendation: 'Risiko Tinggi (Meminta deposit uang pendaftaran)',
        };
      }

      const isBadJob =
        jobDetails &&
        (jobDetails.description.toLowerCase().includes('bayar') ||
          jobDetails.description.toLowerCase().includes('uang') ||
          jobDetails.description.toLowerCase().includes('judi') ||
          jobDetails.description.toLowerCase().includes('slot') ||
          jobDetails.description.toLowerCase().includes('porn') ||
          jobDetails.description.toLowerCase().includes('deposit'));

      if (isBadJob) {
        const descLower = jobDetails.description.toLowerCase();
        if (
          descLower.includes('bayar') ||
          descLower.includes('uang') ||
          descLower.includes('deposit')
        ) {
          alertLevel = 'Permanent Ban';
          reason =
            'Pelanggaran Pembayaran Tidak Sah (di luar payment app / mod app) di loker. Tindakan: Blokir Permanen langsung.';
        } else {
          if (nextViolationNumber === 1) {
            alertLevel = 'Light Warning';
            reason =
              'Pelanggaran 1 (Loker Keburukan Lolos Publik): Peringatan (email, beranda).';
          } else if (nextViolationNumber === 2) {
            alertLevel = 'Suspend 30 Days';
            reason =
              'Pelanggaran 2 (Loker Keburukan Lolos Publik): Suspend akun sementara (30 hari).';
          } else {
            alertLevel = 'Permanent Ban';
            reason =
              'Pelanggaran 3 (Loker Keburukan Lolos Publik): Blokir permanen akun.';
          }
        }
      } else {
        reason = 'ID Lowongan teranalisis aman.';
      }
    } else {
      reason = 'Analisis default akun berdasarkan riwayat pelanggaran.';
      if (nextViolationNumber === 1) {
        alertLevel = 'Light Warning';
      } else if (nextViolationNumber === 2) {
        alertLevel = 'Suspend 30 Days';
      } else if (nextViolationNumber >= 3) {
        alertLevel = 'Permanent Ban';
      }
    }

    const details = { alertLevel, reason, chatDetails, jobDetails };
    setSelectedCheckDetail(details);
  };

  const handleViewDbItemDetail = (item: any) => {
    const job =
      localReviewJobs.find(
        (j) => j.id === item.idLowongan || j.serialId === item.idLowongan,
      ) ||
      employerJobs.find(
        (j) => j.id === item.idLowongan || j.serialId === item.idLowongan,
      );

    const jobDetails = {
      title: item.title,
      company: item.company,
      description:
        job?.description ||
        `Deskripsi tidak tersedia. Lowongan kerja ${item.idLowongan} dilaporkan memiliki indikasi pelanggaran aturan moderasi platform.`,
      salary: job?.salary || 4500000,
      aiRecommendation:
        item.type === 'Pembayaran Tidak Sah'
          ? 'Risiko Tinggi (Pembayaran di luar platform)'
          : 'Risiko Tinggi (Loker Lolos Publikasi)',
    };

    const details = {
      alertLevel: item.alertLevel,
      reason: item.finalAiReason,
      jobDetails,
      dbItem: item,
    };

    setSelectedCheckDetail(details);
  };

  const handleBlockAccount = (blockType: 'By AI' | 'By Human') => {
    if (!foundAccount || !selectedCheckDetail) return;

    const activeBlockType = aiModeration ? 'By AI' : blockType;

    const newViolation: ViolationRecord = {
      id: `VIOL-${Date.now()}`,
      email: foundAccount.email,
      name: foundAccount.name,
      role: foundAccount.role,
      violationType: checkJobId
        ? 'Lowongan Bermasalah yang Lolos Publikasi'
        : 'ID Chat Bermasalah',
      alertLevel: selectedCheckDetail.alertLevel as any,
      finalAiReason: selectedCheckDetail.reason,
      date: new Date().toISOString().split('T')[0],
      daysAgo: 0,
      blockType: activeBlockType,
      status: 'Active',
    };

    // Auto reject all "in review" jobs of this company if violating
    if (foundAccount.role === 'Company') {
      setLocalReviewJobs((prevJobs) =>
        prevJobs.map((j) => {
          if (j.company === foundAccount.name && j.status === 'in review') {
            return { ...j, status: 'ditolak' as const };
          }
          return j;
        }),
      );
      employerJobs.forEach((j) => {
        if (j.company === foundAccount.name && j.status === 'in review') {
          updateEmployerJobStatus(j.id, 'ditolak');
        }
      });
    }

    if (checkJobId) {
      setLocalReviewJobs((prevJobs) =>
        prevJobs.map((j) =>
          j.id === checkJobId ? { ...j, status: 'ditolak' } : j,
        ),
      );
    }

    const updatedAccounts = accounts.map((a) => {
      if (a.email === foundAccount.email) {
        const nextCount = a.violationCount + 1;
        let nextStatus: Account['status'] = 'Active';
        if (selectedCheckDetail.alertLevel === 'Permanent Ban') {
          nextStatus = 'Permanent Ban';
        } else if (selectedCheckDetail.alertLevel === 'Suspend 30 Days') {
          nextStatus = 'Suspended';
        } else {
          nextStatus = a.status;
        }

        return {
          ...a,
          violationCount: nextCount,
          status: nextStatus,
        };
      }
      return a;
    });

    setAccounts(updatedAccounts);
    setViolations([newViolation, ...violations]);
    showToast(
      `Akun ${foundAccount.name} berhasil ditindak (${selectedCheckDetail.alertLevel}) oleh ${activeBlockType}! Lowongan "In Review" milik perusahaan ini otomatis ditolak.`,
      'success',
    );

    setCheckEmail('');
    setFoundAccount(null);
    setSelectedCheckDetail(null);
    setCheckChatId('');
    setCheckJobId('');
  };

  const handleScanDatabase = async () => {
    setIsScanning(true);
    setDbScanResults([]);
    setSelectedDbItem(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const results: any[] = [];
    localReviewJobs.forEach((job) => {
      const score = job.aiScore ?? 100;
      if (score < 70) {
        results.push({
          idLowongan: job.id,
          title: job.title,
          company: job.company,
          alertLevel: 'Suspend 30 Days',
          finalAiReason:
            job.aiRecommendation ||
            'AI Rule-based: Deteksi tingkat keburukan di bawah ambang batas aman.',
          type: 'Keburukan Lowongan',
          aiScore: score,
        });
      }
    });

    setDbScanResults(results);
    setIsScanning(false);
  };

  const handleDbBlock = (item: any, blockType: 'By AI' | 'By Human') => {
    const activeBlockType = aiModeration ? 'By AI' : blockType;
    const matchedAccount = accounts.find((a) => a.name === item.company);
    const targetEmail = matchedAccount
      ? matchedAccount.email
      : `hr@${item.company.toLowerCase().replace(/\s+/g, '')}.com`;

    const newViolation: ViolationRecord = {
      id: `VIOL-${Date.now()}`,
      email: targetEmail,
      name: item.company,
      role: 'Company',
      violationType:
        item.type === 'Pembayaran Tidak Sah'
          ? 'Pembayaran Tidak Sah'
          : 'Lowongan Bermasalah yang Lolos Publikasi',
      alertLevel: item.alertLevel,
      finalAiReason: item.finalAiReason,
      date: new Date().toISOString().split('T')[0],
      daysAgo: 0,
      blockType: activeBlockType,
      status: 'Active',
    };

    // Auto reject all "in review" jobs of this company
    setLocalReviewJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === item.idLowongan) {
          return { ...j, status: 'ditolak' as const };
        }
        if (j.company === item.company && j.status === 'in review') {
          return { ...j, status: 'ditolak' as const };
        }
        return j;
      }),
    );
    employerJobs.forEach((j) => {
      if (j.company === item.company && j.status === 'in review') {
        updateEmployerJobStatus(j.id, 'ditolak');
      }
    });

    if (matchedAccount) {
      setAccounts((prev) =>
        prev.map((a) => {
          if (a.email === targetEmail) {
            const nextCount = a.violationCount + 1;
            let nextStatus: Account['status'] = 'Active';
            if (item.alertLevel === 'Permanent Ban') {
              nextStatus = 'Permanent Ban';
            } else {
              nextStatus = nextCount >= 3 ? 'Permanent Ban' : 'Suspended';
            }
            return { ...a, violationCount: nextCount, status: nextStatus };
          }
          return a;
        }),
      );
    } else {
      setAccounts((prev) => [
        ...prev,
        {
          email: targetEmail,
          name: item.company,
          role: 'Company',
          violationCount: 1,
          status:
            item.alertLevel === 'Permanent Ban' ? 'Permanent Ban' : 'Active',
        },
      ]);
    }

    setViolations([newViolation, ...violations]);
    setDbScanResults((prev) =>
      prev.filter((r) => r.idLowongan !== item.idLowongan),
    );
    setSelectedDbItem(null);
    showToast(
      `Loker ${item.idLowongan} diblokir (${item.alertLevel}) oleh ${activeBlockType}! Seluruh loker "In Review" milik ${item.company} otomatis ditolak.`,
      'success',
    );
  };

  const handleResolveAppeal = (
    appeal: AppealRequest,
    action: 'Unblock' | 'Reject',
  ) => {
    if (action === 'Unblock') {
      setViolations((prev) =>
        prev.filter((v) => v.email !== appeal.emailPelaku),
      );
      setAccounts((prev) =>
        prev.map((a) =>
          a.email === appeal.emailPelaku
            ? { ...a, violationCount: 0, status: 'Active' }
            : a,
        ),
      );
      showToast(
        `Banding disetujui. Akun ${appeal.namaPelaku} dibebaskan.`,
        'success',
      );
    } else {
      showToast(
        `Banding ditolak. Akun ${appeal.namaPelaku} tetap diblokir.`,
        'error',
      );
    }

    setAppeals((prev) =>
      prev.map((a) =>
        a.id === appeal.id
          ? { ...a, status: action === 'Unblock' ? 'Resolved' : 'Dismissed' }
          : a,
      ),
    );
    setSelectedAppeal(null);
  };

  const handleViewAppealChatDetail = (appeal: any) => {
    setViewedAppealIds((prev) => {
      const next = new Set(prev);
      next.add(appeal.id);
      return next;
    });
    const emailPelaku = appeal.emailPelaku || appeal.email || '';
    const namaPelaku = appeal.namaPelaku || appeal.name || '';
    const alasan = appeal.alasan || appeal.finalAiReason || '';
    const acc = accounts.find(
      (a) => a.email.toLowerCase() === emailPelaku.toLowerCase(),
    ) || {
      email: emailPelaku,
      name: namaPelaku,
      role: 'User' as const,
      violationCount: 0,
      status: 'Active' as const,
    };

    setFoundAccount(acc);
    setCheckEmail(acc.email);
    setCheckChatId(appeal.idChat);
    setCheckJobId('');

    const chatLower = appeal.idChat.toLowerCase();
    let chatDetails = [
      {
        sender: 'Sistem',
        message: `Obrolan ID ${appeal.idChat.toUpperCase()} terdaftar.`,
        timestamp: '09:15',
      },
      {
        sender: namaPelaku,
        message: 'Halo, mohon bantuannya terkait kendala ini.',
        timestamp: '09:16',
      },
    ];
    if (
      chatLower.includes('801') ||
      chatLower.includes('judi') ||
      chatLower.includes('slot') ||
      chatLower.includes('phish')
    ) {
      chatDetails = [
        {
          sender: 'Sistem',
          message: 'Chat dimulai antara Budi Santoso dan PT Cepat Kaya.',
          timestamp: '10:00',
        },
        {
          sender: 'PT Cepat Kaya',
          message:
            'Halo Budi, untuk registrasi wajib deposit dulu ke link ini: http://cepat-kaya.com/deposit-slot',
          timestamp: '10:02',
        },
        {
          sender: 'Budi Santoso',
          message: 'Oh baik pak, saya transfer sekarang.',
          timestamp: '10:03',
        },
      ];
    }

    const details = {
      alertLevel: appeal.alertLevel,
      reason: alasan,
      chatDetails,
      appealItem: appeal,
    };

    setSelectedCheckDetail(details);
  };

  const handleViewAppealJobDetail = (appeal: any) => {
    setViewedAppealIds((prev) => {
      const next = new Set(prev);
      next.add(appeal.id);
      return next;
    });
    const emailPelaku = appeal.emailPelaku || appeal.email || '';
    const namaPelaku = appeal.namaPelaku || appeal.name || '';
    const alasan = appeal.alasan || appeal.finalAiReason || '';
    const acc = accounts.find(
      (a) => a.email.toLowerCase() === emailPelaku.toLowerCase(),
    ) || {
      email: emailPelaku,
      name: namaPelaku,
      role: 'Company' as const,
      violationCount: 0,
      status: 'Active' as const,
    };

    setFoundAccount(acc);
    setCheckEmail(acc.email);
    setCheckChatId('');
    setCheckJobId(appeal.idLowongan);

    const job =
      localReviewJobs.find(
        (j) => j.id === appeal.idLowongan || j.serialId === appeal.idLowongan,
      ) ||
      employerJobs.find(
        (j) => j.id === appeal.idLowongan || j.serialId === appeal.idLowongan,
      );

    const jobDetails = {
      title: job?.title || 'Lowongan Terkait Banding',
      company: job?.company || namaPelaku,
      description:
        job?.description ||
        `Deskripsi tidak tersedia. Lowongan kerja ${appeal.idLowongan} sedang ditinjau kembali terkait pengajuan banding.`,
      salary: job?.salary || 5000000,
      aiRecommendation: alasan,
    };

    const details = {
      alertLevel: appeal.alertLevel,
      reason: alasan,
      jobDetails,
      appealItem: appeal,
    };

    setSelectedCheckDetail(details);
  };

  const runRetentionCleanup = () => {
    const updated = violations.map((v) => {
      if (v.status === 'Active' && v.daysAgo > 60) {
        return { ...v, status: 'Trashed' as const };
      }
      return v;
    });
    setViolations(updated);
    showToast(
      'Pembersihan Retensi: Data pelanggaran aktif > 60 hari dipindahkan ke Trash.',
      'info',
    );
  };

  const handleResolveAppealStatus = (
    id: string,
    action: 'Resolved' | 'Dismissed',
  ) => {
    setAppeals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a)),
    );
    setSelectedAppeal(null);
    showToast(
      action === 'Resolved'
        ? 'Appeal diterima dan diselesaikan.'
        : 'Appeal ditolak.',
      action === 'Resolved' ? 'success' : 'error',
    );
  };

  useEffect(() => {
    if (aiModeration && dbScanResults.length > 0) {
      const timer = setTimeout(() => {
        dbScanResults.forEach((item) => {
          handleDbBlock(item, 'By AI');
        });
        showToast(
          'AI Moderation Aktif: Semua temuan database otomatis diblokir oleh AI.',
          'success',
        );
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [aiModeration, dbScanResults]);

  return (
    <ModerationContext.Provider
      value={{
        employerJobs,
        updateEmployerJobStatus,
        user,
        theme,
        toastMessage,
        showToast,
        handleCopyId,
        aiModeration,
        setAiModeration,
        selectedJobDetail,
        setSelectedJobDetail,
        selectedCheckDetail,
        setSelectedCheckDetail,
        viewedJobIds,
        setViewedJobIds,
        viewedAppealIds,
        setViewedAppealIds,
        aiConfig,
        setAiConfig,
        mockCompanies,
        setMockCompanies,
        localReviewJobs,
        setLocalReviewJobs,
        accounts,
        setAccounts,
        violations,
        setViolations,
        appeals,
        setAppeals,
        getDaysDiff,
        handleAiScanAll,
        isScanningAll,
        handleAutoAcceptPass,
        handleApproveJob,
        handleRejectJob,
        checkEmail,
        setCheckEmail,
        foundAccount,
        setFoundAccount,
        checkChatId,
        setCheckChatId,
        checkJobId,
        setCheckJobId,
        checkError,
        setCheckError,
        handleCheckEmail,
        handleCheckDetails,
        isScanning,
        dbScanResults,
        setDbScanResults,
        selectedDbItem,
        setSelectedDbItem,
        handleScanDatabase,
        handleViewDbItemDetail,
        handleBlockAccount,
        handleDbBlock,
        selectedAppeal,
        setSelectedAppeal,
        handleResolveAppeal,
        handleViewAppealChatDetail,
        handleViewAppealJobDetail,
        runRetentionCleanup,
        handleResolveAppealStatus,
      }}
    >
      {children}
    </ModerationContext.Provider>
  );
};

export const useModeration = () => {
  const context = useContext(ModerationContext);
  if (!context) {
    throw new Error('useModeration must be used within a ModerationProvider');
  }
  return context;
};
