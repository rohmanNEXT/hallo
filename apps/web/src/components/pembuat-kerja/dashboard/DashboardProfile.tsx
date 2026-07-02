'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'sonner';
import Image from 'next/image';
import {
  LuShieldCheck as ShieldCheck,
  LuCircleCheck as CheckCircle,
  LuBuilding as Building,
  LuLightbulb as Lightbulb,
  LuUpload as Upload,
  LuInfo as Info,
  LuGlobe as Globe,
  LuImage as ImageIcon,
  LuX as X,
  LuCheck as Check,
  LuGripHorizontal as GripHorizontal,
  LuVideo as VideoIcon,
  LuPencil as PencilIcon,
  LuPlus as PlusIcon,
  LuStar as Star,
} from 'react-icons/lu';

// Helper functions for checking monthly edit limits of Informasi Dasar
const checkAndGetEditLimit = () => {
  if (typeof window === 'undefined') return { count: 0, monthYear: '' };
  const data = localStorage.getItem('company_info_edit_limit');
  const now = new Date();
  const currentMonthYear = `${now.getFullYear()}-${now.getMonth()}`;
  
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.monthYear === currentMonthYear) {
        return parsed;
      }
    } catch (e) {}
  }
  const defaultVal = { count: 0, monthYear: currentMonthYear };
  localStorage.setItem('company_info_edit_limit', JSON.stringify(defaultVal));
  return defaultVal;
};

const incrementEditLimit = () => {
  if (typeof window === 'undefined') return;
  const current = checkAndGetEditLimit();
  const updated = { count: current.count + 1, monthYear: current.monthYear };
  localStorage.setItem('company_info_edit_limit', JSON.stringify(updated));
};

const ProfileTab: React.FC = () => {
  const { user, verifyCompany, bannerIndex, setBannerIndex } = useAppStore();
  const [showPicker, setShowPicker] = useState(false);

  const floatRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const floatPos = useRef({ x: 100, y: 120 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      floatPos.current = { x: window.innerWidth / 2 - 140, y: 150 };
    }

    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !floatRef.current) return;
      const x = e.clientX - dragOffset.current.x;
      const y = e.clientY - dragOffset.current.y;
      floatPos.current = { x, y };
      floatRef.current.style.left = x + 'px';
      floatRef.current.style.top = y + 'px';
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  useEffect(() => {
    if (user?.email === 'recruiter@example.com' && user?.plan !== 'Platinum') {
      useAppStore.getState().upgradePlan('Platinum', 1300000);
    }
  }, [user]);

  const bannerPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80&auto=format&fit=crop',
      label: 'Kantor',
    },
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop',
      label: 'Pegunungan',
    },
    {
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80&auto=format&fit=crop',
      label: 'Hutan',
    },
    {
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80&auto=format&fit=crop',
      label: 'Pantai',
    },
    {
      url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80&auto=format&fit=crop',
      label: 'Kota',
    },
    {
      url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80&auto=format&fit=crop',
      label: 'Padang',
    },
    {
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop',
      label: 'Salju',
    },
    {
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80&auto=format&fit=crop',
      label: 'Bing Image',
    },
  ];

  const isVerified = user?.companyVerification?.verified || false;
  // User is premium if their plan is Starter/Platinum OR if they have purchased profile advance addon (or have enough coins equivalent/unlocked it)
  // Let's check user.plan or check if they purchased it. Since the state keeps coins, if they purchased it or if they have Starter/Platinum, they are premium.
  // We can also allow editing if user.plan is premium OR if they have bought the advance profile addon.
  // Since updateProfile updates the user state, we can track if they unlocked it. Let's check user.plan.
  const isPremium = user?.plan === 'Starter' || user?.plan === 'Platinum' || (user as any).companyProfileAdvance === true || (user?.coins !== undefined && user.coins < 0); // fallback or checking boolean
  // Let's write a robust check:
  const isPremiumUnlocked = user?.plan === 'Starter' || user?.plan === 'Platinum' || (user as any).companyProfileAdvance === true;

  const brandName = user?.companyVerification?.brandName || '';

  // Local state for non-limited fields
  const [logoUrl, setLogoUrl] = useState(user?.companyVerification?.logoUrl || '');
  const [nib, setNib] = useState(user?.companyVerification?.nib || '');
  const [waNumber, setWaNumber] = useState(user?.companyVerification?.waNumber || '81234567890');
  
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showBrandInfo, setShowBrandInfo] = useState(false);
  const [showLegalInfo, setShowLegalInfo] = useState(false);
  const [showIndustryInfo, setShowIndustryInfo] = useState(false);
  const [showEmployeeInfo, setShowEmployeeInfo] = useState(false);

  // Request Update Document States
  const [showRequestUpdateModal, setShowRequestUpdateModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [updateReason, setUpdateReason] = useState('');
  const [updateDoc, setUpdateDoc] = useState<File | null>(null);
  const [updatePhoto, setUpdatePhoto] = useState<File | null>(null);
  const [showWebsiteInfo, setShowWebsiteInfo] = useState(false);
  const [showDescriptionInfo, setShowDescriptionInfo] = useState(false);
  const [showNibInfo, setShowNibInfo] = useState(false);
  const [showPicInfo, setShowPicInfo] = useState(false);
  const [showCandidateWaInfo, setShowCandidateWaInfo] = useState(false);
  const nibInputRef = useRef<HTMLInputElement>(null);


  // Formik for Informasi Dasar & Kontak Perusahaan (2 times per month limit)
  const infoFormik = useFormik({
    initialValues: {
      brandName: user?.companyVerification?.brandName || 'Personal',
      legalName: user?.companyVerification?.name || '',
      industry: user?.companyVerification?.industry || '',
      employeeCount: user?.companyVerification?.employeeCount || '',
      website: user?.companyVerification?.website || '',
      description: user?.companyVerification?.description || '',
      picName: user?.companyVerification?.picName || 'Demo Company Indonesia',
      candidateWhatsapp: user?.companyVerification?.candidateWhatsapp || '812345678790',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      brandName: Yup.string().required('Nama Brand wajib diisi'),
      legalName: Yup.string().nullable(),
      industry: Yup.string().required('Industri Perusahaan wajib diisi'),
      employeeCount: Yup.string().required('Jumlah Pegawai wajib diisi'),
      website: Yup.string().url('Link Website harus berupa URL valid').nullable(),
      description: Yup.string()
        .required('Deskripsi Perusahaan wajib diisi')
        .min(75, 'Deskripsi Perusahaan minimal harus 75 karakter'),
      picName: Yup.string().required('Nama PIC wajib diisi'),
      candidateWhatsapp: Yup.string()
        .matches(/^[0-9]+$/, 'Nomor WhatsApp hanya boleh berisi angka')
        .nullable(),
    }),
    onSubmit: (values) => {
      const limit = checkAndGetEditLimit();
      if (limit.count >= 2) {
        toast.error("Batas edit Informasi Dasar maksimal 2 kali dalam 1 bulan telah tercapai!");
        return;
      }

      verifyCompany({
        logoUrl,
        brandName: values.brandName,
        name: values.legalName,
        industry: values.industry,
        employeeCount: values.employeeCount,
        website: values.website,
        description: values.description,
        nib,
        picName: values.picName,
        waNumber,
        candidateWhatsapp: values.candidateWhatsapp,
        verified: true,
        galleryImages,
        galleryVideos,
        workers,
      });

      incrementEditLimit();
      const newLimit = checkAndGetEditLimit();
      toast.success(`Informasi Dasar & Kontak berhasil disimpan! Sisa batas edit bulan ini: ${2 - newLimit.count}/2`);
      setIsEditingInfo(false);
    },
  });

  // Custom states for Gallery and Team
  const [galleryImages, setGalleryImages] = useState<string[]>(
    user?.companyVerification?.galleryImages || [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    ]
  );
  const [galleryVideos, setGalleryVideos] = useState<string[]>(
    user?.companyVerification?.galleryVideos || [
      'https://assets.mixkit.co/videos/preview/mixkit-business-people-meeting-around-table-40192-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-people-working-in-a-modern-office-42358-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-workers-in-a-modern-office-discussing-work-42263-large.mp4',
    ]
  );
  const [workers, setWorkers] = useState<any[]>(
    user?.companyVerification?.workers || [
      {
        name: 'Budi Santoso',
        position: 'Chief Executive Officer (CEO)',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
        linkedin: 'https://linkedin.com',
      },
      {
        name: 'Siti Rahma',
        position: 'Chief Technology Officer (CTO)',
        image: 'S',
        linkedin: 'https://linkedin.com',
      }
    ]
  );

  const [editSection, setEditSection] = useState<'gallery' | 'team' | 'info' | null>(null);
  const [isAddingWorker, setIsAddingWorker] = useState(false);

  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerPosition, setNewWorkerPosition] = useState('');
  const [newWorkerLinkedin, setNewWorkerLinkedin] = useState('');
  const [newWorkerImage, setNewWorkerImage] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (galleryImages.length >= 3) {
      alert('Maksimal 3 foto galeri!');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setGalleryImages([...galleryImages, reader.result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (galleryVideos.length >= 3) {
      alert('Maksimal 3 video galeri!');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setGalleryVideos([...galleryVideos, reader.result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveVideo = (index: number) => {
    setGalleryVideos(galleryVideos.filter((_, i) => i !== index));
  };

  const handleWorkerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewWorkerImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoUrl(reader.result);
        verifyCompany({
          logoUrl: reader.result,
          brandName: infoFormik.values.brandName,
          name: infoFormik.values.legalName,
          industry: infoFormik.values.industry,
          employeeCount: infoFormik.values.employeeCount,
          website: infoFormik.values.website,
          description: infoFormik.values.description,
          nib,
          picName: infoFormik.values.picName,
          waNumber,
          candidateWhatsapp: infoFormik.values.candidateWhatsapp,
          verified: true,
          galleryImages,
          galleryVideos,
          workers,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNibUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNib(file.name);
    verifyCompany({
      logoUrl,
      brandName: infoFormik.values.brandName,
      name: infoFormik.values.legalName,
      industry: infoFormik.values.industry,
      employeeCount: infoFormik.values.employeeCount,
      website: infoFormik.values.website,
      description: infoFormik.values.description,
      nib: file.name,
      picName: infoFormik.values.picName,
      waNumber,
      candidateWhatsapp: infoFormik.values.candidateWhatsapp,
      verified: true,
      galleryImages,
      galleryVideos,
      workers,
    });
  };

  const handleAddWorker = () => {
    if (!newWorkerName.trim() || !newWorkerPosition.trim()) {
      alert('Nama dan Jabatan wajib diisi!');
      return;
    }
    if (workers.length >= 6) {
      alert('Maksimal 6 anggota tim!');
      return;
    }
    const newWorker = {
      name: newWorkerName.trim(),
      position: newWorkerPosition.trim(),
      image: newWorkerImage || newWorkerName.trim().charAt(0).toUpperCase(),
      linkedin: newWorkerLinkedin.trim() || 'https://linkedin.com',
    };
    setWorkers([...workers, newWorker]);
    setNewWorkerName('');
    setNewWorkerPosition('');
    setNewWorkerLinkedin('');
    setNewWorkerImage('');
    setIsAddingWorker(false);
  };

  const handleRemoveWorker = (index: number) => {
    setWorkers(workers.filter((_, i) => i !== index));
  };

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const { brandName, legalName, industry, employeeCount, description, website } = infoFormik.values;
    const { picName, candidateWhatsapp } = infoFormik.values;
    if (!brandName || !legalName || !industry || !employeeCount || !description || !picName) {
      alert('Mohon lengkapi semua bidang wajib (*)!');
      return;
    }
    if (description.length < 75) {
      alert('Deskripsi perusahaan minimal harus 75 karakter!');
      return;
    }

    verifyCompany({
      logoUrl,
      brandName,
      name: legalName,
      industry,
      employeeCount,
      website,
      description,
      nib,
      picName,
      waNumber,
      candidateWhatsapp,
      verified: true,
      galleryImages,
      galleryVideos,
      workers,
    });

    alert('Profil Perusahaan berhasil disimpan!');
  };

  return (
    <>
      <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-6 shadow-md flex flex-col h-[882px] overflow-hidden max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* ===== PRINT ONLY: Modern Company Profile Card ===== */}
      <style>{`
        @media print {
          body > * {
            visibility: hidden !important;
            position: absolute !important;
          }
          .print-profile-root,
          .print-profile-root * {
            visibility: visible !important;
          }
          body {
            background: #09090b !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-profile-root {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 99999 !important;
            background: #09090b !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        @media screen {
          .print-profile-root { display: none !important; }
        }
      `}</style>

      <div className="print-profile-root" style={{ background: '#09090b', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 32px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        {/* Main Card */}
        <div style={{
          width: '100%', maxWidth: 680,
          background: '#18181b',
          borderRadius: 24,
          border: '1px solid #27272a',
          overflow: 'hidden',
        }}>
          {/* Card Header — Centered */}
          <div style={{ padding: '48px 48px 32px', textAlign: 'center' }}>
            {/* Company Initial / Logo */}
            <div style={{
              width: 72, height: 72, borderRadius: 18, margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: 'white',
              boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
            }}>
              {infoFormik.values.brandName?.charAt(0) || 'C'}
            </div>

            {/* Company Name */}
            <h1 style={{
              fontSize: 32, fontWeight: 800, color: '#fafafa',
              margin: '0 0 4px', letterSpacing: '-0.5px', lineHeight: 1.2,
            }}>
              {infoFormik.values.brandName || user.name || 'Company Profile'}
            </h1>

            {/* Legal Name / Subtitle */}
            {infoFormik.values.legalName && (
              <p style={{ fontSize: 15, color: '#a78bfa', fontWeight: 600, margin: '0 0 16px' }}>
                {infoFormik.values.legalName}
              </p>
            )}

            {/* Contact Row */}
            <p style={{
              fontSize: 12, color: '#71717a', fontWeight: 500, margin: '0 0 20px',
              display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap',
            }}>
              {infoFormik.values.industry && <span>{infoFormik.values.industry}</span>}
              {user.email && <span>{user.email}</span>}
              {infoFormik.values.candidateWhatsapp && <span>+62{infoFormik.values.candidateWhatsapp}</span>}
            </p>

            {/* Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              {isVerified && (
                <span style={{
                  padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)',
                }}><Check className="w-3 h-3 mr-1 inline" /> Terverifikasi</span>
              )}
              {isPremium && (
                <span style={{
                  padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)',
                }}><Star className="w-3 h-3 mr-1 inline" /> Premium</span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#27272a', margin: '0 48px' }} />

          {/* Sections */}
          <div style={{ padding: '32px 48px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* TENTANG PERUSAHAAN */}
            {infoFormik.values.description && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 10px', letterSpacing: '0.02em' }}>
                  TENTANG PERUSAHAAN
                </h2>
                <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.9, margin: 0, fontWeight: 400 }}>
                  {infoFormik.values.description}
                </p>
              </div>
            )}

            {/* INFORMASI */}
            <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                INFORMASI
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
                {[
                  { label: 'Industri', value: infoFormik.values.industry },
                  { label: 'Jumlah Pegawai', value: infoFormik.values.employeeCount },
                  { label: 'Website', value: infoFormik.values.website },
                  { label: 'PIC', value: infoFormik.values.picName },
                  { label: 'Email', value: user.email },
                  { label: 'WhatsApp', value: infoFormik.values.candidateWhatsapp ? `+62${infoFormik.values.candidateWhatsapp}` : '' },
                ].filter(item => item.value).map((item, i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #27272a' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{item.label}</p>
                    <p style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 600, margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* TIM KAMI */}
            {workers.length > 0 && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  TIM KAMI
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {workers.map((w, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 16px 8px 8px',
                      background: '#27272a', borderRadius: 999,
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 800, color: 'white', flexShrink: 0, overflow: 'hidden',
                      }}>
                        {w.image?.startsWith('http') || w.image?.startsWith('data:') ? (
                          <Image src={w.image} alt={w.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}  width={100} height={100} unoptimized />
                        ) : (
                          w.image || w.name?.charAt(0)
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#fafafa', margin: 0, lineHeight: 1.2 }}>{w.name}</p>
                        <p style={{ fontSize: 10, color: '#71717a', margin: '2px 0 0', fontWeight: 500 }}>{w.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GALERI KANTOR */}
            {galleryImages.length > 0 && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 24 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  GALERI KANTOR
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {galleryImages.map((img, i) => (
                    <div key={i} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3', background: '#27272a' }}>
                      <Image src={img} alt={`Galeri ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}  width={100} height={100} unoptimized />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ===== END PRINT ONLY ===== */}

      <div className="flex-1 overflow-y-auto pr-1.5 smooth-scroll space-y-6 pb-4">
        {/* Premium Header Banner Card */}
        <div className="bg-card border border-border/70 rounded-2xl overflow-hidden shadow-xl relative">
        <div
          className="h-26 md:h-36 bg-cover bg-center relative transition-all duration-300"
          style={{
            backgroundImage: `url('${isPremium ? (bannerPhotos[bannerIndex !== undefined ? bannerIndex : 0]?.url || bannerPhotos[0].url) : bannerPhotos[4].url}')`,
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/15 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />

          {/* Banner Selector Button */}
          {isPremium && (
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={() => setShowPicker((prev) => !prev)}
                className="flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white p-2 rounded-full transition-all cursor-pointer shadow-sm"
                title="Ganti foto latar"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {showPicker && isPremium && (
          <div
            ref={floatRef}
            className="fixed z-50 select-none animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: floatPos.current.x,
              top: floatPos.current.y,
              width: 260,
            }}
          >
            <div className="bg-background/95 backdrop-blur-md border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
              <div
                onMouseDown={(e) => {
                  if (!floatRef.current) return;
                  dragging.current = true;
                  const rect = floatRef.current.getBoundingClientRect();
                  dragOffset.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  };
                  e.preventDefault();
                }}
                className="flex items-center justify-between px-3.5 py-2.5 bg-transparent border-b border-border/50 cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-2">
                  <GripHorizontal className="h-3.5 w-3.5 text-muted-foreground/50" />
                  <span className="text-[12px] font-bold text-foreground">
                    Pilih Tema Latar
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPicker(false)}
                  className="h-6 w-6 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center transition-colors cursor-pointer shadow-sm border-none"
                >
                  <X className="h-3.5 w-3.5 text-white" />
                </button>
              </div>

              <div className="p-3.5 space-y-3">
                <div className="grid grid-cols-3 gap-2.5">
                  {bannerPhotos.slice(0, 6).map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setBannerIndex(idx);
                      }}
                      className={`relative rounded-xl overflow-hidden h-[58px] cursor-pointer group transition-all border-none p-0 ${
                        bannerIndex === idx
                          ? 'ring-2 ring-primary ring-offset-1 ring-offset-background'
                          : 'hover:ring-2 hover:ring-primary/40'
                      }`}
                    >
                      <Image
                        src={photo.url}
                        alt={photo.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        draggable={false}
                       width={100} height={100} unoptimized />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/5 transition-all" />
                      <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-bold text-white drop-shadow-md">
                        {photo.label}
                      </span>
                      {bannerIndex === idx && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 bg-primary rounded-full flex items-center justify-center shadow">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBannerIndex(6);
                  }}
                  className={`w-full relative rounded-xl overflow-hidden h-[46px] cursor-pointer group transition-all flex items-center justify-between px-3 border-none ${
                    bannerIndex === 6
                      ? 'ring-2 ring-primary ring-offset-1 ring-offset-background bg-primary/10 border-primary/30'
                      : 'hover:bg-muted/50 border-border/60 bg-background/25'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg overflow-hidden bg-muted relative shrink-0">
                      <Image
                        src={bannerPhotos[6].url}
                        alt="Bing"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        draggable={false}
                       width={100} height={100} unoptimized />
                      <div className="absolute inset-0 bg-black/25" />
                    </div>
                    <span className="text-[10px] font-bold text-foreground">
                      Mode Bing Image
                    </span>
                  </div>
                  {bannerIndex === 6 && (
                    <div className="h-4 w-4 bg-primary rounded-full flex items-center justify-center shadow">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Thin dark gradient below banner */}
        <div className="h-16 bg-linear-to-b from-black/30 via-black/10 to-transparent absolute left-0 right-0 pointer-events-none z-10" />

        <div className="px-4 md:px-5 pb-3 md:pb-4 relative z-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between -mt-10 sm:-mt-12 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3.5 text-center sm:text-left">
              <button
                type="button"
                onClick={() => setShowLogoModal(true)}
                className="h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden shadow-md bg-muted/40 relative group cursor-pointer p-0 text-left shrink-0 transition-transform hover:scale-105 duration-200 flex items-center justify-center"
                title="Ubah Foto Profil"
              >
                {logoUrl ? (
                  <Image src={logoUrl} alt="Logo" className="w-full h-full object-cover"  width={100} height={100} unoptimized />
                ) : (
                  <div className="w-full h-full bg-card text-foreground flex items-center justify-center font-black text-3xl md:text-4xl border border-border">
                    {(brandName || user.name || 'P').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-200 text-white">
                  <PencilIcon className="h-4 w-4" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    Ubah
                  </span>
                </div>
              </button>
              <div className="space-y-1.5 pb-1">
                <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.75)]">
                  {brandName || user.name || 'Profil Perusahaan'}
                </h1>
                
                {/* Badges: Verifikasi & Premium */}
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white font-extrabold text-[10px] border border-emerald-400/50 shadow-md">
                      <ShieldCheck className="h-3 w-3" />
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500/80 text-white font-extrabold text-[10px] border border-slate-400/50 shadow-sm">
                      Belum Verifikasi
                    </span>
                  )}
                  {isPremium ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/90 text-white font-extrabold text-[10px] border border-amber-400/50 shadow-md">
                      <CheckCircle className="h-3 w-3 text-white" />
                      Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500/80 text-white font-extrabold text-[10px] border border-slate-400/50 shadow-sm">
                      Standard Plan
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center sm:justify-end gap-2 shrink-0 self-end mb-1 z-10 flex-wrap">
              {isVerified && (
                <Button
                  type="button"
                  onClick={() => setShowRequestUpdateModal(true)}
                  className="h-8 gap-1.5 cursor-pointer font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Request Update Document
                </Button>
              )}
              <Button
                type="button"
                onClick={() => window.print()}
                variant="outline"
                className="h-8 gap-1.5 cursor-pointer font-bold border-border/60 text-xs text-foreground bg-background shadow-md"
              >
                <span>export ke pdf</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
 
      {/* Galeri Kantor */}
      <Card className="bg-card border border-border/70 rounded-2xl shadow-md p-6 relative">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Galeri Kantor
          </h3>
          <div className="flex items-center gap-2">
            {!isPremium ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10.5px] font-extrabold uppercase">
                Hanya Premium
              </span>
            ) : (
              editSection !== 'gallery' ? (
                <button
                  type="button"
                  onClick={() => setEditSection('gallery')}
                  className="text-muted-foreground hover:text-primary p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                  title="Edit Galeri"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditSection(null);
                    verifyCompany({
                      logoUrl,
                      brandName: infoFormik.values.brandName,
                      name: infoFormik.values.legalName,
                      industry: infoFormik.values.industry,
                      employeeCount: infoFormik.values.employeeCount,
                      website: infoFormik.values.website,
                      description: infoFormik.values.description,
                      nib,
                      picName: infoFormik.values.picName,
                      waNumber,
                      candidateWhatsapp: infoFormik.values.candidateWhatsapp,
                      verified: true,
                      galleryImages,
                      galleryVideos,
                      workers,
                    });
                  }}
                  className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                  title="Simpan Galeri"
                >
                  <Check className="h-4 w-4" />
                </button>
              )
            )}
          </div>
        </div>
        
        {/* Images Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-1.5 border-border/50">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Foto Kantor (Maks 3)</span>
            <span className="text-[10px] text-muted-foreground font-semibold">{galleryImages.length}/3</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryImages.map((imgUrl, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border relative aspect-square bg-muted group"
              >
                <Image
                  src={imgUrl}
                  alt={`Gallery Image ${i + 1}`}
                  className="object-cover w-full h-full"
                 width={100} height={100} unoptimized />
                {isPremium && editSection === 'gallery' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm border-none z-10"
                    title="Hapus Foto"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
            {isPremium && editSection === 'gallery' && galleryImages.length < 3 && (
              <div className="relative border-2 border-dashed border-border/85 hover:border-primary/50 rounded-xl aspect-square flex flex-col items-center justify-center gap-1 bg-background/25 group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="h-5 w-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-foreground">Upload Foto</span>
              </div>
            )}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b pb-1.5 border-border/50">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Video Kantor (Maks 3)</span>
            <span className="text-[10px] text-muted-foreground font-semibold">{galleryVideos.length}/3</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryVideos.map((vidUrl, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border relative aspect-square bg-black group"
              >
                <video
                  src={vidUrl}
                  controls
                  className="w-full h-full object-cover"
                />
                {isPremium && editSection === 'gallery' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(i)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm border-none z-10"
                    title="Hapus Video"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
            {isPremium && editSection === 'gallery' && galleryVideos.length < 3 && (
              <div className="relative border-2 border-dashed border-border/85 hover:border-primary/50 rounded-xl aspect-square flex flex-col items-center justify-center gap-1 bg-background/25 group cursor-pointer">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="h-5 w-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-foreground">Upload Video</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tim Kami */}
      <Card className="bg-card border border-border/70 rounded-2xl shadow-md p-6 relative">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Tim Kami
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-semibold mr-1">{workers.length}/6</span>
            {!isPremium ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10.5px] font-extrabold uppercase">
                Hanya Premium
              </span>
            ) : (
              editSection !== 'team' ? (
                <button
                  type="button"
                  onClick={() => setEditSection('team')}
                  className="text-muted-foreground hover:text-primary p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                  title="Edit Tim"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditSection(null);
                    verifyCompany({
                      logoUrl,
                      brandName: infoFormik.values.brandName,
                      name: infoFormik.values.legalName,
                      industry: infoFormik.values.industry,
                      employeeCount: infoFormik.values.employeeCount,
                      website: infoFormik.values.website,
                      description: infoFormik.values.description,
                      nib,
                      picName: infoFormik.values.picName,
                      waNumber,
                      candidateWhatsapp: infoFormik.values.candidateWhatsapp,
                      verified: true,
                      galleryImages,
                      galleryVideos,
                      workers,
                    });
                  }}
                  className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                  title="Simpan Tim"
                >
                  <Check className="h-4 w-4" />
                </button>
              )
            )}
          </div>
        </div>
        
        {/* Workers List */}
        <div className="flex flex-wrap gap-3 items-center">
          {workers.map((worker, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 pr-4 rounded-full border bg-background/50 relative group text-sm"
            >
              {worker.image?.startsWith('http') || worker.image?.startsWith('data:image') ? (
                <Image
                  src={worker.image}
                  alt={worker.name}
                  className="h-8 w-8 rounded-full object-cover shrink-0 border border-border"
                 width={100} height={100} unoptimized />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border shrink-0">
                  {worker.image || worker.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-xs text-foreground leading-none">
                  {worker.name}
                </p>
                <p className="text-xs font-normal text-muted-foreground leading-none mt-1">
                  {worker.position}
                </p>
              </div>
              
              {isPremium && editSection === 'team' && (
                <button
                  type="button"
                  onClick={() => handleRemoveWorker(i)}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-full cursor-pointer border-none shrink-0"
                  title="Hapus Anggota"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
          {isPremium && editSection === 'team' && workers.length < 6 && (
            <button
              type="button"
              onClick={() => setIsAddingWorker((prev) => !prev)}
              className="flex items-center gap-1.5 p-2 px-4 rounded-full border border-dashed border-primary text-primary hover:bg-primary/5 transition-colors text-xs font-bold cursor-pointer"
            >
              <span>+ Tambah Anggota</span>
            </button>
          )}
        </div>

        {isPremium && editSection === 'team' && isAddingWorker && workers.length < 6 && (
          <div className="space-y-3 p-4 border border-border/60 rounded-2xl bg-muted/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Nama</label>
                <Input
                  placeholder="Nama anggota tim"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  className="rounded-xl bg-background border-border text-foreground font-semibold text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Jabatan</label>
                <Input
                  placeholder="Jabatan/Posisi"
                  value={newWorkerPosition}
                  onChange={(e) => setNewWorkerPosition(e.target.value)}
                  className="rounded-xl bg-background border-border text-foreground font-semibold text-xs"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Foto Anggota (Opsional)</label>
                <div className="flex items-center gap-3">
                  <div className="relative border border-dashed border-border/85 hover:border-primary/50 rounded-xl px-3 py-1.5 flex items-center justify-center gap-1.5 bg-background/25 cursor-pointer text-xs font-bold text-foreground">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleWorkerPhotoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Foto</span>
                  </div>
                  {newWorkerImage && (
                    <div className="h-8 w-8 rounded-full overflow-hidden border shrink-0">
                      <Image src={newWorkerImage} alt="preview" className="w-full h-full object-cover"  width={100} height={100} unoptimized />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">LinkedIn URL (Opsional)</label>
                <Input
                  placeholder="https://linkedin.com/in/..."
                  value={newWorkerLinkedin}
                  onChange={(e) => setNewWorkerLinkedin(e.target.value)}
                  className="rounded-xl bg-background border-border text-foreground font-semibold text-xs"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAddWorker}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold h-9 rounded-xl cursor-pointer border-none shadow-sm text-xs"
            >
              Tambah Anggota Tim
            </Button>
          </div>
        )}
      </Card>

      {/* Toaster for premium alert notifications */}
      <Toaster position="top-center" richColors />

      {/* Section 1: Logo & NIB */}
      <Card className="bg-card border border-border/70 rounded-2xl shadow-md p-6 relative">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Logo Perusahaan Section */}
          <div className="flex flex-col items-center justify-center pb-6">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Logo Perusahaan<span className="text-rose-500">*</span>
            </span>
            <button
              type="button"
              onClick={() => setShowLogoModal(true)}
              className="h-24 w-24 rounded-2xl overflow-hidden border-4 border-card shadow-md bg-muted/40 relative group cursor-pointer border-none p-0 text-left shrink-0"
              title="Ubah Foto Profil"
            >
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" width={100} height={100} unoptimized />
              ) : (
                <Building className="w-12 h-12 text-primary mx-auto" />
              )}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-200 text-white">
                <PencilIcon className="h-4.5 w-4.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Ubah Foto
                </span>
              </div>
            </button>
            <span className="text-[10px] text-muted-foreground mt-3">
              (Maks: 200 KB, JPG, JPEG, PNG, atau WEBP)
            </span>
          </div>

          {/* NIB Perusahaan */}
          <div className="flex flex-col gap-1.5 pt-4 border-t border-border/50">
            <label className="text-[10px] font-black uppercase text-muted-foreground">
              NIB Perusahaan
            </label>
            <div className="flex justify-between items-center rounded-xl border border-border bg-background px-3 py-2">
              <input
                ref={nibInputRef}
                id="nib-upload"
                type="file"
                accept=".pdf"
                onChange={handleNibUpload}
                className="hidden"
              />
              <span className="text-xs text-muted-foreground truncate max-w-[70%]">
                {nib ? (nib.endsWith('.pdf') ? nib : `nib_perusahaan_${nib}.pdf`) : 'Pilih file'}
              </span>
              <button
                type="button"
                onClick={() => nibInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-transparent"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              (Maks: 2 MB, PDF, JPG, JPEG, atau PNG)
            </span>
          </div>
        </form>
      </Card>

      {/* Section 2: Informasi Dasar & Kontak Perusahaan */}
      <form onSubmit={infoFormik.handleSubmit} className="space-y-6">
        <Card className="bg-card border border-border/70 rounded-2xl shadow-md p-6 relative">
          <div className="flex items-center justify-between mb-5">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Informasi Dasar
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold">
                Sisa batas edit bulan ini: {Math.max(0, 2 - checkAndGetEditLimit().count)}/2 kali
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isVerified && !isPremium ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10.5px] font-extrabold uppercase">
                  Hanya Premium
                </span>
              ) : !isEditingInfo ? (
                <button
                  type="button"
                  onClick={() => {
                    const limit = checkAndGetEditLimit();
                    if (limit.count >= 2) {
                      toast.error("Batas edit Informasi Dasar maksimal 2 kali dalam 1 bulan telah tercapai!");
                      return;
                    }
                    setIsEditingInfo(true);
                  }}
                  className="text-muted-foreground hover:text-primary p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                  title="Edit Informasi Dasar"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      infoFormik.resetForm();
                      setIsEditingInfo(false);
                    }}
                    className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                    title="Batal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="submit"
                    className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                    title="Simpan"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Brand */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <span>Nama Brand</span><span className="text-rose-500">*</span>
                  <button
                    type="button"
                    onClick={() => setShowBrandInfo((prev) => !prev)}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent p-0 flex items-center justify-center"
                    title="Detail Informasi"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                </label>
                <Input
                  name="brandName"
                  value={infoFormik.values.brandName}
                  onChange={infoFormik.handleChange}
                  onBlur={infoFormik.handleBlur}
                  className={`rounded-xl bg-background border-border text-foreground font-semibold text-xs ${
                    infoFormik.touched.brandName && infoFormik.errors.brandName ? 'border-rose-500 focus-visible:ring-rose-500/20' : ''
                  }`}
                  disabled={!isEditingInfo}
                />
                {showBrandInfo && (
                  <div className="absolute z-40 top-12 left-0 right-0 bg-slate-900 dark:bg-slate-950 text-white border border-border/80 rounded-xl p-3 shadow-xl text-[10px] font-semibold leading-relaxed animate-in fade-in duration-200">
                    Nama brand/merek perusahaan yang tampil ke publik. Edit maks. 1–2 kali per bulan.
                  </div>
                )}
                {infoFormik.touched.brandName && infoFormik.errors.brandName && (
                  <span className="text-[10px] font-semibold text-rose-500">{infoFormik.errors.brandName}</span>
                )}
              </div>

              {/* Nama Legal */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <span>Nama Legal</span>
                  <button
                    type="button"
                    onClick={() => setShowLegalInfo((prev) => !prev)}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent p-0 flex items-center justify-center"
                    title="Detail Informasi"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                </label>
                <Input
                  name="legalName"
                  placeholder="Masukkan nama legal"
                  value={infoFormik.values.legalName}
                  onChange={infoFormik.handleChange}
                  onBlur={infoFormik.handleBlur}
                  className="rounded-xl bg-background border-border text-foreground font-semibold text-xs"
                  disabled={!isEditingInfo}
                />
                {showLegalInfo && (
                  <div className="absolute z-40 top-12 left-0 right-0 bg-slate-900 dark:bg-slate-950 text-white border border-border/80 rounded-xl p-3 shadow-xl text-[10px] font-semibold leading-relaxed animate-in fade-in duration-200">
                    Nama legal/resmi perusahaan. Edit maks. 2 kali per tahun.
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Industri Perusahaan */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <span>Industri Perusahaan</span><span className="text-rose-500">*</span>
                  <button
                    type="button"
                    onClick={() => setShowIndustryInfo((prev) => !prev)}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent p-0 flex items-center justify-center"
                    title="Detail Informasi"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                </label>
                <select
                  name="industry"
                  value={infoFormik.values.industry}
                  onChange={infoFormik.handleChange}
                  onBlur={infoFormik.handleBlur}
                  className={`flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-75 disabled:cursor-not-allowed ${
                    infoFormik.touched.industry && infoFormik.errors.industry ? 'border-rose-500' : ''
                  }`}
                  disabled={!isEditingInfo}
                >
                  <option value="">Pilih industri</option>
                  <option value="Teknologi & Informasi">Teknologi & Informasi</option>
                  <option value="Manufaktur & Produksi">Manufaktur & Produksi</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Keuangan & Perbankan">Keuangan & Perbankan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                {showIndustryInfo && (
                  <div className="absolute z-40 top-12 left-0 right-0 bg-slate-900 dark:bg-slate-950 text-white border border-border/80 rounded-xl p-3 shadow-xl text-[10px] font-semibold leading-relaxed animate-in fade-in duration-200">
                    Kategori industri utama perusahaan. Edit maks. 1–2 kali per bulan.
                  </div>
                )}
                {infoFormik.touched.industry && infoFormik.errors.industry && (
                  <span className="text-[10px] font-semibold text-rose-500">{infoFormik.errors.industry}</span>
                )}
              </div>

              {/* Jumlah Pegawai */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <span>Jumlah Pegawai</span><span className="text-rose-500">*</span>
                  <button
                    type="button"
                    onClick={() => setShowEmployeeInfo((prev) => !prev)}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent p-0 flex items-center justify-center"
                    title="Detail Informasi"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                </label>
                <select
                  name="employeeCount"
                  value={infoFormik.values.employeeCount}
                  onChange={infoFormik.handleChange}
                  onBlur={infoFormik.handleBlur}
                  className={`flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-75 disabled:cursor-not-allowed ${
                    infoFormik.touched.employeeCount && infoFormik.errors.employeeCount ? 'border-rose-500' : ''
                  }`}
                  disabled={!isEditingInfo}
                >
                  <option value="">Pilih jumlah pegawai</option>
                  <option value="1-10 Pegawai">1-10 Pegawai</option>
                  <option value="11-50 Pegawai">11-50 Pegawai</option>
                  <option value="51-200 Pegawai">51-200 Pegawai</option>
                  <option value="201-500 Pegawai">201-500 Pegawai</option>
                  <option value="500+ Pegawai">500+ Pegawai</option>
                </select>
                {showEmployeeInfo && (
                  <div className="absolute z-40 top-12 left-0 right-0 bg-slate-900 dark:bg-slate-950 text-white border border-border/80 rounded-xl p-3 shadow-xl text-[10px] font-semibold leading-relaxed animate-in fade-in duration-200">
                    Jumlah kisaran total karyawan. Edit maks. 1–2 kali per bulan.
                  </div>
                )}
                {infoFormik.touched.employeeCount && infoFormik.errors.employeeCount && (
                  <span className="text-[10px] font-semibold text-rose-500">{infoFormik.errors.employeeCount}</span>
                )}
              </div>
            </div>

            {/* Link Website */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                <span>Link Website/Social Media</span>
                <button
                  type="button"
                  onClick={() => setShowWebsiteInfo((prev) => !prev)}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent p-0 flex items-center justify-center"
                  title="Detail Informasi"
                >
                  <Info className="h-3 w-3" />
                </button>
              </label>
              <Input
                name="website"
                placeholder="https://companysite.com"
                value={infoFormik.values.website}
                onChange={infoFormik.handleChange}
                onBlur={infoFormik.handleBlur}
                className={`rounded-xl bg-background border-border text-foreground font-semibold text-xs ${
                  infoFormik.touched.website && infoFormik.errors.website ? 'border-rose-500 focus-visible:ring-rose-500/20' : ''
                }`}
                disabled={!isEditingInfo}
              />
              {showWebsiteInfo && (
                <div className="absolute z-40 top-12 left-0 right-0 bg-slate-900 dark:bg-slate-950 text-white border border-border/80 rounded-xl p-3 shadow-xl text-[10px] font-semibold leading-relaxed animate-in fade-in duration-200">
                  Tautan website/sosial media perusahaan. Bebas edit kapan saja.
                </div>
              )}
              {infoFormik.touched.website && infoFormik.errors.website && (
                <span className="text-[10px] font-semibold text-rose-500">{infoFormik.errors.website}</span>
              )}
            </div>

            {/* Deskripsi Perusahaan */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                <span>Deskripsi Perusahaan (minimal 75 karakter)</span><span className="text-rose-500">*</span>
                <button
                  type="button"
                  onClick={() => setShowDescriptionInfo((prev) => !prev)}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent p-0 flex items-center justify-center"
                  title="Detail Informasi"
                >
                  <Info className="h-3 w-3" />
                </button>
              </label>
              <textarea
                name="description"
                placeholder="Masukkan deskripsi perusahaan"
                value={infoFormik.values.description}
                onChange={infoFormik.handleChange}
                onBlur={infoFormik.handleBlur}
                rows={4}
                className={`w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-75 disabled:cursor-not-allowed resize-none ${
                  infoFormik.touched.description && infoFormik.errors.description ? 'border-rose-500 focus:ring-rose-500/20' : ''
                }`}
                disabled={!isEditingInfo}
              />
              {showDescriptionInfo && (
                <div className="absolute z-40 bottom-full mb-1 left-0 right-0 bg-slate-900 dark:bg-slate-950 text-white border border-border/80 rounded-xl p-3 shadow-xl text-[10px] font-semibold leading-relaxed animate-in fade-in duration-200">
                  Deskripsi perusahaan. Edit maks. 1–2 kali per bulan.
                </div>
              )}
              {infoFormik.touched.description && infoFormik.errors.description && (
                <span className="text-[10px] font-semibold text-rose-500">{infoFormik.errors.description}</span>
              )}
            </div>

            {/* Nama PIC */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                <span>Nama PIC</span><span className="text-rose-500">*</span>
                <button
                  type="button"
                  onClick={() => setShowPicInfo((prev) => !prev)}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent p-0 flex items-center justify-center"
                  title="Detail Informasi"
                >
                  <Info className="h-3 w-3" />
                </button>
              </label>
              <Input
                name="picName"
                placeholder="Masukkan nama PIC"
                value={infoFormik.values.picName}
                onChange={infoFormik.handleChange}
                onBlur={infoFormik.handleBlur}
                className={`rounded-xl bg-background border-border text-foreground font-semibold text-xs ${
                  infoFormik.touched.picName && infoFormik.errors.picName ? 'border-rose-500 focus-visible:ring-rose-500/20' : ''
                }`}
                disabled={!isEditingInfo}
              />
              {showPicInfo && (
                <div className="absolute z-40 top-12 left-0 right-0 bg-slate-900 dark:bg-slate-950 text-white border border-border/80 rounded-xl p-3 shadow-xl text-[10px] font-semibold leading-relaxed animate-in fade-in duration-200">
                  Nama Person In Charge (PIC) perusahaan. Bebas edit kapan saja.
                </div>
              )}
              {infoFormik.touched.picName && infoFormik.errors.picName && (
                <span className="text-[10px] font-semibold text-rose-500">{infoFormik.errors.picName}</span>
              )}
            </div>
          </div>
        </Card>

        {/* Section 3: Kontak Perusahaan */}
        <Card className="bg-card border border-border/70 rounded-2xl shadow-md p-6 relative">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Kontak Perusahaan
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* No Whatsapp */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">
                  No Whatsapp<span className="text-rose-500">*</span>
                </label>
                <Input
                  value={waNumber.startsWith('+') || waNumber.startsWith('62') ? waNumber : `+62${waNumber}`}
                  className="rounded-xl bg-muted/30 border-border text-foreground font-semibold text-xs disabled:opacity-75 disabled:cursor-not-allowed"
                  disabled={true}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">
                  Email<span className="text-rose-500">*</span>
                </label>
                <Input
                  value={user.email}
                  className="rounded-xl bg-muted/30 border-border text-foreground font-semibold text-xs disabled:opacity-75 disabled:cursor-not-allowed"
                  disabled={true}
                />
              </div>
            </div>

              {/* No. WhatsApp untuk dihubungi kandidat */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <span>No. WhatsApp untuk dihubungi kandidat</span>
                  <button
                    type="button"
                    onClick={() => setShowCandidateWaInfo((prev) => !prev)}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer border-none bg-transparent p-0 flex items-center justify-center"
                    title="Detail Informasi"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                </label>
                <Input
                  name="candidateWhatsapp"
                  placeholder="+6281234567890"
                  value={infoFormik.values.candidateWhatsapp}
                  onChange={infoFormik.handleChange}
                  onBlur={infoFormik.handleBlur}
                  className={`rounded-xl bg-background border-border text-foreground font-semibold text-xs ${
                    infoFormik.touched.candidateWhatsapp && infoFormik.errors.candidateWhatsapp ? 'border-rose-500 focus-visible:ring-rose-500/20' : ''
                  }`}
                  disabled={!isEditingInfo}
                />
                {showCandidateWaInfo && (
                  <div className="absolute z-40 bottom-full mb-1 left-0 right-0 bg-slate-900 dark:bg-slate-950 text-white border border-border/80 rounded-xl p-3 shadow-xl text-[10px] font-semibold leading-relaxed animate-in fade-in duration-200">
                    Nomor WA yang akan dihubungi kandidat. Bebas edit kapan saja.
                  </div>
                )}
                {infoFormik.touched.candidateWhatsapp && infoFormik.errors.candidateWhatsapp && (
                  <span className="text-[10px] font-semibold text-rose-500">{infoFormik.errors.candidateWhatsapp}</span>
                )}
              </div>

            {/* Info Box */}
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl flex items-start gap-2.5 text-blue-600 dark:text-blue-400 text-[12px] leading-relaxed">
              <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
              <p>
                Lamaran kandidat akan dikirimkan ke email yang didaftarkan pada saat registrasi jika tidak mengisi nomor WhatsApp
              </p>
            </div>
          </div>
        </Card>
      </form>
        </div>
      </div>

      {showRequestUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-3xl border border-border shadow-xl overflow-hidden relative">
            <button
              onClick={() => setShowRequestUpdateModal(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full text-muted-foreground hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer border-none bg-transparent"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6 border-b border-border/50">
              <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                <Upload className="h-5 w-5 text-orange-500" />
                Request Update Document
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Ajukan permintaan pembaruan dokumen legalitas ke tim Moderasi. Pastikan data yang diunggah valid dan jelas.
              </p>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2 relative">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-foreground">
                    Alasan Request Update <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[10px] font-bold ${updateReason.length < 300 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {updateReason.length}/300 Karakter
                  </span>
                </div>
                <textarea
                  placeholder="Jelaskan secara detail alasan mengapa Anda perlu memperbarui dokumen ini (Minimal 300 karakter)..."
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  className={`w-full min-h-[100px] rounded-xl bg-background border text-foreground font-semibold text-xs p-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none ${
                    updateReason.length > 0 && updateReason.length < 300 ? 'border-rose-500' : 'border-border'
                  }`}
                />
                {updateReason.length > 0 && updateReason.length < 300 && (
                  <p className="text-[10px] font-semibold text-rose-500">
                    Alasan pengajuan terlalu singkat. Silakan jabarkan detail alasan perubahan dokumen Anda minimal 300 karakter.
                  </p>
                )}
              </div>

              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-foreground">
                  Upload Dokumen Baru (PDF) <span className="text-rose-500">*</span>
                </label>
                <div className="border-2 border-dashed border-border/80 rounded-xl p-4 text-center bg-muted/30">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setUpdateDoc(e.target.files?.[0] || null)}
                    className="hidden"
                    id="upload-doc-new"
                  />
                  <label htmlFor="upload-doc-new" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                      {updateDoc ? updateDoc.name : 'Klik untuk memilih dokumen PDF'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-foreground">
                  Upload Foto Bukti Tambahan (JPG/PNG) <span className="text-rose-500">*</span>
                </label>
                <div className="border-2 border-dashed border-border/80 rounded-xl p-4 text-center bg-muted/30">
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={(e) => setUpdatePhoto(e.target.files?.[0] || null)}
                    className="hidden"
                    id="upload-photo-new"
                  />
                  <label htmlFor="upload-photo-new" className="cursor-pointer flex flex-col items-center gap-2">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                      {updatePhoto ? updatePhoto.name : 'Klik untuk memilih foto (Max 5MB)'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 pt-2 flex items-center justify-end gap-3 bg-muted/10 border-t border-border/50">
              <Button
                variant="outline"
                onClick={() => setShowRequestUpdateModal(false)}
                className="h-9 text-xs font-bold rounded-xl"
              >
                Batal
              </Button>
              <Button
                disabled={!updateReason || updateReason.length < 300 || !updateDoc || !updatePhoto}
                onClick={() => {
                  if (!updateDoc || !updatePhoto) return;
                  const processUpdates = () => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        const newLogo = reader.result;
                        setLogoUrl(newLogo);
                        setNib(updateDoc.name);

                        verifyCompany({
                          logoUrl: newLogo,
                          brandName: infoFormik.values.brandName,
                          name: infoFormik.values.legalName,
                          industry: infoFormik.values.industry,
                          employeeCount: infoFormik.values.employeeCount,
                          website: infoFormik.values.website,
                          description: infoFormik.values.description,
                          nib: updateDoc.name,
                          picName: infoFormik.values.picName,
                          waNumber,
                          candidateWhatsapp: infoFormik.values.candidateWhatsapp,
                          verified: true,
                          galleryImages,
                          galleryVideos,
                          workers,
                        });

                        toast.success('Pembaruan Dokumen & Foto Perusahaan berhasil diterapkan!');
                        setShowRequestUpdateModal(false);
                        setUpdateReason('');
                        setUpdateDoc(null);
                        setUpdatePhoto(null);
                      }
                    };
                    reader.readAsDataURL(updatePhoto);
                  };
                  processUpdates();
                }}
                className="h-9 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
              >
                Kirim Request
              </Button>
            </div>
          </div>
        </div>
      )}
      {showLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-3xl border border-border shadow-xl overflow-hidden relative">
            <button
              onClick={() => setShowLogoModal(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full text-muted-foreground hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer border-none bg-transparent"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6 border-b border-border/50">
              <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                Ubah Foto Profil
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <span className="text-[10px] font-black uppercase text-muted-foreground">UPLOAD DARI PERANGKAT</span>
              <div className="relative border-2 border-dashed border-border/80 hover:border-primary/50 rounded-2xl p-8 text-center bg-muted/10 group cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleLogoUpload(e);
                    setShowLogoModal(false);
                    toast.success('Foto profil berhasil diperbarui!');
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary group-hover:scale-105 transition-all duration-200" />
                  <span className="text-xs font-bold text-foreground mt-1">Pilih Foto</span>
                  <span className="text-[10px] text-muted-foreground font-semibold">JPG, PNG, WEBP (Maks. 5MB)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default ProfileTab;

