'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/store';
import {
  LuPencil as Pencil,
  LuCheck as Check,
  LuX as X,
  LuBriefcase as Briefcase,
  LuGraduationCap as GraduationCap,
  LuMail as Mail,
  LuPhone as Phone,
  LuGlobe as Globe,
  LuFileText as FileText,
  LuMapPin as MapPin,
  LuUser as User,
  LuPlus as Plus,
  LuTrash2 as Trash2,
  LuSettings as Settings,
  LuAward as Award,
  LuImage as ImageIcon,
  LuGripHorizontal as GripHorizontal,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuInfo as Info,
  LuLinkedin as Linkedin,
  LuCircleCheck as CircleCheck,
  LuPencil as FileEdit,
  LuFolder as Folder,
  LuDownload as Download,
} from 'react-icons/lu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface DashboardProfileProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardProfile({
  onNavigate,
}: DashboardProfileProps) {
  const { user, updateProfile, theme, bannerIndex, setBannerIndex } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Per-section edit state
  const [editSection, setEditSection] = useState<string | null>(null);

  // Edit form states
  const [formData, setFormData] = useState<any>({});

  // Skill & Certificate input states
  const [newSkillText, setNewSkillText] = useState('');
  const [newCertText, setNewCertText] = useState('');
  // Form states for new items with dates
  const [expName, setExpName] = useState('');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('');

  const [eduName, setEduName] = useState('');
  const [eduStart, setEduStart] = useState('');
  const [eduEnd, setEduEnd] = useState('');

  const [orgName, setOrgName] = useState('');
  const [orgStart, setOrgStart] = useState('');
  const [orgEnd, setOrgEnd] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const bannerPhotos = [
    {
      url: '/images/banners/banner1.png?v=25',
      label: 'Pegunungan',
    },
    {
      url: '/images/banners/banner2.png?v=25',
      label: 'Hutan',
    },
    {
      url: '/images/banners/banner3.png?v=25',
      label: 'Pantai',
    },
    {
      url: '/images/banners/banner4.png?v=25',
      label: 'Kota',
    },
    {
      url: '/images/banners/banner5.png?v=25',
      label: 'Laut',
      copyright: 'Maldives Atolls',
    },
    {
      url: '/images/banners/banner6.png?v=25',
      label: 'Salju',
    },
    {
      url: 'https://bing.biturl.top/?resolution=1920&format=image&index=0',
      label: 'Bing Image',
      copyright: 'Realtime Bing Image of the Day',
    },
  ];

  const [showPicker, setShowPicker] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const floatRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const floatPos = useRef({ x: 100, y: 120 });

  const setCookie = (name: string, value: string, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return undefined;
    return document.cookie
      .split('; ')
      .find((r) => r.startsWith(name + '='))
      ?.split('=')[1];
  };

  useEffect(() => {
    setMounted(true);
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
    if (user) {
      setFormData({
        name: user.name || '',
        nickname: user.nickname || '',
        career: user.career || '',
        waNumber: user.waNumber || '',
        email: user.email || '',
        education: Array.isArray(user.education)
          ? user.education
          : user.education
            ? [user.education]
            : [],
        experience: Array.isArray(user.experience)
          ? user.experience
          : user.experience
            ? [user.experience]
            : [],
        resume: user.resume || '',
        website: user.website || '',
        socialMedia: user.socialMedia || '',
        softFile: user.softFile || '',
        aboutMe: user.aboutMe || '',
        organization: Array.isArray(user.organization)
          ? user.organization
          : user.organization
            ? [user.organization]
            : [],
        skill: user.skill || [],
        jobReference: {
          interest: user.jobReference?.interest || '',
          city: user.jobReference?.city || '',
          salaryExpectation: user.jobReference?.salaryExpectation || '',
          workOption: user.jobReference?.workOption || 'Hybrid',
        },
        certificates: user.certificates || [],
      });
    }
  }, [user]);

  if (!user) return null;

  const experiences = Array.isArray(user.experience)
    ? user.experience
    : user.experience
      ? [user.experience]
      : [];
  const educations = Array.isArray(user.education)
    ? user.education
    : user.education
      ? [user.education]
      : [];
  const organizations = Array.isArray(user.organization)
    ? user.organization
    : user.organization
      ? [user.organization]
      : [];

  const handleStartEdit = (section: string) => {
    setEditSection(section);
  };

  const handleCancelEdit = () => {
    setEditSection(null);
    setFormData({
      name: user.name || '',
      nickname: user.nickname || '',
      career: user.career || '',
      waNumber: user.waNumber || '',
      email: user.email || '',
      education: Array.isArray(user.education)
        ? user.education
        : user.education
          ? [user.education]
          : [],
      experience: Array.isArray(user.experience)
        ? user.experience
        : user.experience
          ? [user.experience]
          : [],
      resume: user.resume || '',
      website: user.website || '',
      socialMedia: user.socialMedia || '',
      softFile: user.softFile || '',
      aboutMe: user.aboutMe || '',
      organization: Array.isArray(user.organization)
        ? user.organization
        : user.organization
          ? [user.organization]
          : [],
      skill: user.skill || [],
      jobReference: {
        interest: user.jobReference?.interest || '',
        city: user.jobReference?.city || '',
        salaryExpectation: user.jobReference?.salaryExpectation || '',
        workOption: user.jobReference?.workOption || 'Hybrid',
      },
      certificates: user.certificates || [],
    });
  };

  const handleSave = () => {
    updateProfile(formData);
    setEditSection(null);
  };

  // Skill handlers
  const handleAddSkill = () => {
    if (newSkillText.trim() && !formData.skill.includes(newSkillText.trim())) {
      setFormData({
        ...formData,
        skill: [...formData.skill, newSkillText.trim()],
      });
      setNewSkillText('');
    }
  };
  const handleRemoveSkill = (sk: string) => {
    setFormData({
      ...formData,
      skill: formData.skill.filter((s: string) => s !== sk),
    });
  };

  // Certificate handlers
  const handleAddCert = () => {
    if (
      newCertText.trim() &&
      !formData.certificates.includes(newCertText.trim())
    ) {
      setFormData({
        ...formData,
        certificates: [...formData.certificates, newCertText.trim()],
      });
      setNewCertText('');
    }
  };
  const handleRemoveCert = (cert: string) => {
    setFormData({
      ...formData,
      certificates: formData.certificates.filter((c: string) => c !== cert),
    });
  };

  const parseItem = (str: string) => {
    const match = str.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      const name = match[1].trim();
      const duration = match[2].trim();
      const parts = duration.split('-');
      if (parts.length === 2) {
        return { name, start: parts[0].trim(), end: parts[1].trim() };
      }
      return { name, start: duration, end: '' };
    }
    return { name: str.trim(), start: '', end: '' };
  };

  // Education handlers
  const handleAddEdu = () => {
    if (eduName.trim()) {
      const duration =
        eduStart.trim() && eduEnd.trim()
          ? ` (${eduStart.trim()} - ${eduEnd.trim()})`
          : eduStart.trim()
            ? ` (${eduStart.trim()})`
            : '';
      const combined = `${eduName.trim()}${duration}`;
      if (!formData.education.includes(combined)) {
        setFormData({
          ...formData,
          education: [...formData.education, combined],
        });
        setEduName('');
        setEduStart('');
        setEduEnd('');
      }
    }
  };
  const handleRemoveEdu = (edu: string) => {
    setFormData({
      ...formData,
      education: formData.education.filter((e: string) => e !== edu),
    });
  };

  // Experience handlers
  const handleAddExp = () => {
    if (expName.trim()) {
      const duration =
        expStart.trim() && expEnd.trim()
          ? ` (${expStart.trim()} - ${expEnd.trim()})`
          : expStart.trim()
            ? ` (${expStart.trim()})`
            : '';
      const combined = `${expName.trim()}${duration}`;
      if (!formData.experience.includes(combined)) {
        setFormData({
          ...formData,
          experience: [...formData.experience, combined],
        });
        setExpName('');
        setExpStart('');
        setExpEnd('');
      }
    }
  };
  const handleRemoveExp = (exp: string) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((e: string) => e !== exp),
    });
  };

  // Organization handlers
  const handleAddOrg = () => {
    if (orgName.trim()) {
      const duration =
        orgStart.trim() && orgEnd.trim()
          ? ` (${orgStart.trim()} - ${orgEnd.trim()})`
          : orgStart.trim()
            ? ` (${orgStart.trim()})`
            : '';
      const combined = `${orgName.trim()}${duration}`;
      if (!formData.organization.includes(combined)) {
        setFormData({
          ...formData,
          organization: [...formData.organization, combined],
        });
        setOrgName('');
        setOrgStart('');
        setOrgEnd('');
      }
    }
  };
  const handleRemoveOrg = (org: string) => {
    setFormData({
      ...formData,
      organization: formData.organization.filter((o: string) => o !== org),
    });
  };

  // File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError('Ukuran berkas melebihi 10MB!');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = ['pdf', 'doc', 'docx'].includes(fileExtension || '');

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      setUploadError('Hanya mendukung berkas PDF atau Word (.doc, .docx)!');
      return;
    }

    setUploadError(null);
    setFormData({
      ...formData,
      softFile: file.name,
    });
  };

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-6 shadow-md flex flex-col h-[882px] overflow-hidden animate-in fade-in duration-300">
      {/* ===== PRINT ONLY: Modern Seeker Profile Card ===== */}
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
            {/* Seeker Profile Image / Initial */}
            <div style={{
              width: 72, height: 72, borderRadius: 18, margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: 'white',
              boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            }}>
              {user.profileImage ? (
                <Image src={user.profileImage} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}  width={100} height={100} unoptimized />
              ) : (
                user.name?.charAt(0) || 'U'
              )}
            </div>

            {/* Seeker Name */}
            <h1 style={{
              fontSize: 32, fontWeight: 800, color: '#fafafa',
              margin: '0 0 4px', letterSpacing: '-0.5px', lineHeight: 1.2,
            }}>
              {user.name}
            </h1>

            {user.career && (
              <p style={{ fontSize: 15, color: '#a78bfa', fontWeight: 600, margin: '0 0 16px' }}>
                {user.career}
              </p>
            )}

            {/* Contact Row */}
            <p style={{
              fontSize: 12, color: '#71717a', fontWeight: 500, margin: '0 0 20px',
              display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap',
            }}>
              {user.email && <span>{user.email}</span>}
              {user.waNumber && <span>{user.waNumber}</span>}
              {user.website && <span>{user.website}</span>}
              {user.socialMedia && <span>LinkedIn: {user.socialMedia.replace('https://', '')}</span>}
            </p>

            {/* Badges removed for PDF as per UX consistency */}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#27272a', margin: '0 48px' }} />

          {/* Sections */}
          <div style={{ padding: '32px 48px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* TENTANG SAYA */}
            {user.aboutMe && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 10px', letterSpacing: '0.02em' }}>
                  TENTANG SAYA
                </h2>
                <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.9, margin: 0, fontWeight: 400 }}>
                  {user.aboutMe}
                </p>
              </div>
            )}

            {/* PENGALAMAN KERJA */}
            {user.experience && user.experience.length > 0 && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  PENGALAMAN KERJA
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {user.experience.map((exp: string, i: number) => (
                    <div key={i} style={{ borderLeft: '2px solid #27272a', paddingLeft: 16, margin: '6px 0' }}>
                      <p style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 650, margin: '0 0 4px' }}>
                        {exp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PENDIDIKAN */}
            {user.education && user.education.length > 0 && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  PENDIDIKAN
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {user.education.map((edu: string, i: number) => (
                    <div key={i} style={{ borderLeft: '2px solid #27272a', paddingLeft: 16, margin: '6px 0' }}>
                      <p style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 650, margin: '0 0 4px' }}>
                        {edu}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KEAHLIAN */}
            {user.skill && user.skill.length > 0 && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  KEAHLIAN / SKILL
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {user.skill.map((skill: string, i: number) => (
                    <span key={i} style={{
                      padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                      background: '#27272a', color: '#e4e4e7', border: '1px solid #3f3f46'
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ORGANISASI */}
            {user.organization && user.organization.length > 0 && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  ORGANISASI
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {user.organization.map((org: string, i: number) => (
                    <div key={i} style={{ borderLeft: '2px solid #27272a', paddingLeft: 16, margin: '6px 0' }}>
                      <p style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 650, margin: '0 0 4px' }}>
                        {org}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SERTIFIKASI */}
            {user.certificates && user.certificates.length > 0 && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 24 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  SERTIFIKASI
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {user.certificates.map((cert: string, i: number) => (
                    <div key={i} style={{ borderLeft: '2px solid #27272a', paddingLeft: 16, margin: '6px 0' }}>
                      <p style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 650, margin: '0 0 4px' }}>
                        {cert}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REFERENSI KERJA */}
            {user.jobReference && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  REFERENSI KERJA
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
                  {[
                    { label: 'Minat Kerja', value: user.jobReference.interest },
                    { label: 'Kota Pilihan', value: user.jobReference.city },
                    { label: 'Ekspektasi Gaji', value: user.jobReference.salaryExpectation },
                    { label: 'Opsi Kerja', value: user.jobReference.workOption },
                  ].filter(item => item.value).map((item, i) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #27272a' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{item.label}</p>
                      <p style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 600, margin: 0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-1.5 smooth-scroll space-y-6 md:space-y-8 pb-4">
        {/* Profile Header */}
        <div className="mb-6">
          <div className="bg-card border border-border/70 rounded-2xl overflow-hidden shadow-xl relative">
            {/* Banner */}
            <div
              className="h-32 md:h-36 bg-cover bg-center relative transition-all duration-300"
              style={{
                backgroundImage: `url('${bannerPhotos[bannerIndex].url}')`,
                backgroundPosition: 'center 35%',
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/15 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
              {/* Quick change photo button */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setShowPicker((prev) => !prev)}
                  className="flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white p-2 rounded-full transition-all cursor-pointer shadow-sm"
                  title="Ganti foto latar"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Floating Window - Draggable Photo Picker */}
            {showPicker && (
              <div
                ref={floatRef}
                className="fixed z-50 select-none animate-in fade-in zoom-in-95 duration-150"
                style={{
                  left: floatPos.current.x,
                  top: floatPos.current.y,
                  width: 260,
                }}
              >
                <div className="bg-background/20 backdrop-blur-sm border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
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
                      onClick={() => setShowPicker(false)}
                      className="h-6 w-6 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center transition-colors cursor-pointer shadow-sm border-none"
                    >
                      <X className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>

                  {/* Photo Grid */}
                  <div className="p-3.5 space-y-3">
                    <div className="grid grid-cols-3 gap-2.5">
                      {bannerPhotos.slice(0, 6).map((photo, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setBannerIndex(idx);
                          }}
                          className={`relative rounded-xl overflow-hidden h-[58px] cursor-pointer group transition-all border-none p-0 ${
                            bannerIndex === idx
                              ? 'ring-2 ring-foreground ring-offset-1 ring-offset-background'
                              : 'hover:ring-2 hover:ring-foreground/40'
                          }`}
                        >
                          <Image
                            src={photo.url}
                            alt={photo.label}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            draggable={false}
                           width={100} height={100} unoptimized />
                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/5 transition-all" />
                          <span className="absolute bottom-1 left-0 right-0 text-center text-[12px] font-bold text-white drop-shadow-md">
                            {photo.label}
                          </span>
                          {bannerIndex === idx && (
                            <div className="absolute top-1 right-1 h-3.5 w-3.5 bg-foreground rounded-full flex items-center justify-center shadow">
                              <Check className="h-2 w-2 text-black" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Standalone Bing Image Mode box below */}
                    <button
                      onClick={() => {
                        setBannerIndex(6);
                      }}
                      className={`w-full relative rounded-xl overflow-hidden h-[46px] cursor-pointer group flex items-center justify-between px-3 border transition-all ${
                        bannerIndex === 6
                          ? 'ring-2 ring-foreground ring-offset-1 ring-offset-background bg-foreground/10 border-foreground/30'
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
                        <span className="text-[12px] font-bold text-foreground">
                          Mode Bing Image
                        </span>
                      </div>
                      {bannerIndex === 6 && (
                        <div className="h-3.5 w-3.5 bg-primary rounded-full flex items-center justify-center shadow">
                          <Check className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Thin dark gradient below banner */}
            <div className="h-16 bg-linear-to-b from-black/30 via-black/10 to-transparent absolute left-0 right-0 pointer-events-none z-10" />

            {/* Avatar & Profile Info Overlay */}
            <div className="px-4 md:px-5 pb-3 md:pb-4 relative z-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between -mt-10 sm:-mt-12 gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3.5 text-center sm:text-left">
                  <button
                    onClick={() => setShowAvatarPicker(true)}
                    className="h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden shadow-md bg-muted/40 relative group cursor-pointer p-0 text-left shrink-0 transition-transform hover:scale-105 duration-200 flex items-center justify-center"
                    title="Ubah Foto Profil"
                  >
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt="avatar"
                        className="w-full h-full object-cover"
                       width={100} height={100} unoptimized />
                    ) : (
                      <div className="w-full h-full bg-card text-foreground flex items-center justify-center font-bold text-2xl border border-border">
                        {user.name?.charAt(0) ?? '?'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-200 text-white">
                      <Pencil className="h-4.5 w-4.5" />
                      <span className="text-[12px] font-bold uppercase tracking-wider">
                        Ubah
                      </span>
                    </div>
                  </button>
                  <div className="space-y-0.5 pb-1">
                    <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.75)]">
                      {user.name}
                    </h1>
                    <p className="mt-1 text-sm md:text-base font-semibold text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
                      {user.career || 'Pekerjaan belum diatur'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end gap-2 shrink-0 self-end mb-1 z-10">
                  <Button
                    type="button"
                    onClick={() => window.print()}
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 cursor-pointer font-bold border-border/60 text-xs text-foreground bg-background"
                  >
                    <span>export ke pdf</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1-Column Dashboard Layout */}
        <div className="space-y-6 max-w-4xl mx-auto w-full">
          {/* About Me Section */}
          <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-md space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                Tentang Saya
              </h3>
              {editSection !== 'aboutMe' ? (
                <button
                  onClick={() => handleStartEdit('aboutMe')}
                  className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSave}
                    className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {editSection === 'aboutMe' ? (
              <textarea
                value={formData.aboutMe}
                onChange={(e) =>
                  setFormData({ ...formData, aboutMe: e.target.value })
                }
                rows={4}
                className="w-full text-xs font-medium bg-background border border-border/80 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-foreground leading-relaxed"
              />
            ) : (
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                {user.aboutMe || 'Tulis ringkasan tentang diri Anda di sini...'}
              </p>
            )}
          </div>

          {/* UserProfile Info Section */}
          <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-md space-y-5 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[12px] text-muted-foreground uppercase tracking-wider">
                Informasi Kontak
              </h3>
              {editSection !== 'contact' ? (
                <button
                  onClick={() => handleStartEdit('contact')}
                  className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSave}
                    className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {editSection === 'contact' ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase">
                    Nama Lengkap
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase">
                    Nama Panggilan
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                    className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase">
                    Posisi
                  </label>
                  <Input
                    value={formData.career}
                    onChange={(e) =>
                      setFormData({ ...formData, career: e.target.value })
                    }
                    className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase">
                    Nomor Wa 
                  </label>
                  <Input
                    value={formData.waNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, waNumber: e.target.value })
                    }
                    className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase">
                    Email
                  </label>
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-3">
                  <User className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-semibold">
                      Nama Lengkap
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {user.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-semibold">
                      Nama Panggilan
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {user.nickname || '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-semibold">
                      Posisi
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {user.career || '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-semibold">
                      WhatsApp
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {user.waNumber || '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[12px] text-muted-foreground uppercase block font-semibold">
                      Email
                    </span>
                    <span className="text-xs font-bold text-foreground block break-all">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Links & Files Section */}
          <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-md space-y-5 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[12px] text-muted-foreground uppercase tracking-wider">
                Tautan & Dokumen
              </h3>
              {editSection !== 'links' ? (
                <button
                  onClick={() => handleStartEdit('links')}
                  className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSave}
                    className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {editSection === 'links' ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase block mb-1.5">
                    Resume
                  </label>
                  {formData.softFile ? (
                    <div className="flex items-center justify-between bg-muted/40 border border-border/80 rounded-xl p-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0 flex items-center">
                          {formData.softFile.endsWith('.pdf') ? <FileText className="w-5 h-5" /> : <FileEdit className="w-5 h-5" />}
                        </span>
                        <span className="text-xs font-bold truncate text-foreground">
                          {formData.softFile}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, softFile: '' })
                        }
                        className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-border/85 hover:border-foreground/50 rounded-xl p-4 transition-all flex flex-col items-center justify-center gap-1.5 bg-background/25 group">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="text-muted-foreground group-hover:scale-110 transition-transform">
                        <Folder className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        Pilih Berkas
                      </span>
                      <span className="text-[12px] text-muted-foreground text-center">
                        PDF atau Word (Maks. 10MB)
                      </span>
                    </div>
                  )}
                  {uploadError && (
                    <p className="text-[12px] font-bold text-rose-500 mt-1.5">
                      {uploadError}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase">
                    Website Pribadi
                  </label>
                  <Input
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://budisantoso.dev"
                    className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase">
                    LinkedIn
                  </label>
                  <Input
                    value={formData.socialMedia}
                    onChange={(e) =>
                      setFormData({ ...formData, socialMedia: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1 line-clamp-1">
                <div className="flex items-center gap-3">
                  <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[12px] text-muted-foreground uppercase block font-semibold">
                      Resume
                    </span>
                    {user.softFile ? (
                      <div className="flex items-center gap-2 mt-1 min-w-0">
                        <span className="text-xs font-bold text-foreground truncate block">
                          {user.softFile}
                        </span>
                        <span className="text-[12px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-muted-foreground uppercase shrink-0">
                          {user.softFile.split('.').pop()}
                        </span>
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            window.print();
                          }}
                          className="ml-1 text-primary hover:text-primary/80 transition-colors"
                          title="Unduh Resume"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-foreground block mt-1">
                        -
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-semibold">
                      Website
                    </span>
                    {user.website ? (
                      <a
                        href={user.website}
                        className="text-xs font-bold text-foreground hover:underline block truncate"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {user.website}
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-foreground">
                        -
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-[12px] text-muted-foreground uppercase block font-semibold">
                      LinkedIn
                    </span>
                    {user.socialMedia ? (
                      <a
                        href={user.socialMedia}
                        className="text-xs font-bold text-foreground hover:underline block truncate"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {user.socialMedia}
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-foreground">
                        -
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pengalaman Kerja Section */}
          <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-md space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                Pengalaman Kerja
              </h3>
              {editSection !== 'experience' ? (
                <button
                  onClick={() => handleStartEdit('experience')}
                  className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSave}
                    className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {editSection === 'experience' ? (
              <div className="space-y-4">
                <div className="space-y-3 bg-background/40 p-4 rounded-xl border border-border/70">
                  <div>
                    <label className="text-[12px] font-bold text-muted-foreground uppercase block mb-1">
                      Posisi & Perusahaan
                    </label>
                    <Input
                      value={expName}
                      onChange={(e) => setExpName(e.target.value)}
                      placeholder="e.g. Junior Developer di TechCorp"
                      className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12px] font-bold text-muted-foreground uppercase block mb-1">
                        Tanggal Mulai
                      </label>
                      <Input
                        value={expStart}
                        onChange={(e) => setExpStart(e.target.value)}
                        placeholder="e.g. Jan 2018 / 2018"
                        className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-bold text-muted-foreground uppercase block mb-1">
                        Tanggal Selesai
                      </label>
                      <Input
                        value={expEnd}
                        onChange={(e) => setExpEnd(e.target.value)}
                        placeholder="e.g. Des 2022 / Sekarang"
                        className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddExp}
                    size="sm"
                    className="w-full h-9 cursor-pointer text-xs font-bold bg-foreground text-background hover:bg-foreground/90"
                  >
                    Tambah Pengalaman
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.experience.map((exp: string) => (
                    <div
                      key={exp}
                      className="flex items-center justify-between bg-background/50 border border-border/80 text-foreground text-xs font-semibold p-3 rounded-xl shadow-sm hover:border-border transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Briefcase className="h-3 w-3 text-foreground shrink-0" />
                        <span className="truncate">{exp}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const parsed = parseItem(exp);
                            setExpName(parsed.name);
                            setExpStart(parsed.start);
                            setExpEnd(parsed.end);
                            handleRemoveExp(exp);
                          }}
                          className="text-muted-foreground hover:bg-muted p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Edit item"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveExp(exp)}
                          className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                {experiences.length > 0 ? (
                  experiences.map((exp: string) => (
                    <div
                      key={exp}
                      className="flex items-center gap-2 bg-background/40 border border-border/60 p-3 rounded-xl"
                    >
                      <Briefcase className="h-3 w-3 text-foreground shrink-0" />
                      <span className="text-xs font-semibold text-foreground">
                        {exp}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">
                    Belum ada pengalaman kerja yang ditambahkan.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Pendidikan Section */}
          <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-md space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                Pendidikan
              </h3>
              {editSection !== 'education' ? (
                <button
                  onClick={() => handleStartEdit('education')}
                  className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSave}
                    className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {editSection === 'education' ? (
              <div className="space-y-4">
                <div className="space-y-3 bg-background/40 p-4 rounded-xl border border-border/70">
                  <div>
                    <label className="text-[12px] font-bold text-muted-foreground uppercase block mb-1">
                      Institusi & Gelar
                    </label>
                    <Input
                      value={eduName}
                      onChange={(e) => setEduName(e.target.value)}
                      placeholder="e.g. S1 Teknik Informatika di Universitas Indonesia"
                      className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12px] font-bold text-muted-foreground uppercase block mb-1">
                        Tahun Mulai
                      </label>
                      <Input
                        value={eduStart}
                        onChange={(e) => setEduStart(e.target.value)}
                        placeholder="e.g. 2018"
                        className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-bold text-muted-foreground uppercase block mb-1">
                        Tahun Lulus
                      </label>
                      <Input
                        value={eduEnd}
                        onChange={(e) => setEduEnd(e.target.value)}
                        placeholder="e.g. 2022 / Sekarang"
                        className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddEdu}
                    size="sm"
                    className="w-full h-9 cursor-pointer text-xs font-bold bg-foreground text-background hover:bg-foreground/90"
                  >
                    Tambah Pendidikan
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.education.map((edu: string) => (
                    <div
                      key={edu}
                      className="flex items-center justify-between bg-background/50 border border-border/80 text-foreground text-xs font-semibold p-3 rounded-xl shadow-sm hover:border-border transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <GraduationCap className="h-3 w-3 text-foreground shrink-0" />
                        <span className="truncate">{edu}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const parsed = parseItem(edu);
                            setEduName(parsed.name);
                            setEduStart(parsed.start);
                            setEduEnd(parsed.end);
                            handleRemoveEdu(edu);
                          }}
                          className="text-muted-foreground hover:bg-muted p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Edit item"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveEdu(edu)}
                          className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                {educations.length > 0 ? (
                  educations.map((edu: string) => (
                    <div
                      key={edu}
                      className="flex items-center gap-2 bg-background/40 border border-border/60 p-3 rounded-xl"
                    >
                      <GraduationCap className="h-3 w-3 text-foreground shrink-0" />
                      <span className="text-xs font-semibold text-foreground">
                        {edu}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">
                    Belum ada riwayat pendidikan yang ditambahkan.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Skill Section */}
          <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-md space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                Keahlian / Skill
              </h3>
              {editSection !== 'skill' ? (
                <button
                  onClick={() => handleStartEdit('skill')}
                  className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSave}
                    className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {editSection === 'skill' ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    placeholder="Tambah skill baru (e.g. Next.js)"
                    className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddSkill}
                    size="sm"
                    className="h-9 cursor-pointer text-xs font-bold bg-foreground text-background hover:bg-foreground/90"
                  >
                    Tambah
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skill.map((sk: string) => (
                    <div
                      key={sk}
                      className={`inline-flex items-center gap-1.5 text-[12px] font-semibold pl-2.5 pr-1.5 py-0.5 h-6 rounded-full border shadow-sm select-none ${
                        mounted && theme === 'white'
                          ? 'bg-[#eef5fa] border-[#d2e2f0] text-[#334155]'
                          : 'bg-background/50 border-border/80 text-muted-foreground'
                      }`}
                    >
                      <span>{sk}</span>
                      <button
                        onClick={() => handleRemoveSkill(sk)}
                        className="p-0.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {user.skill && user.skill.length > 0 ? (
                  user.skill.map((sk: string) => (
                    <span
                      key={sk}
                      className={`inline-flex items-center text-[12px] font-semibold px-2.5 py-0.5 h-6 rounded-full border shadow-sm select-none ${
                        mounted && theme === 'white'
                          ? 'bg-[#eef5fa] border-[#d2e2f0] text-[#334155]'
                          : 'bg-background/50 border-border/80 text-muted-foreground'
                      }`}
                    >
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">
                    Belum ada skill yang ditambahkan.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Sertifikat Section */}
          <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-md space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                Sertifikasi / Lisensi
              </h3>
              {editSection !== 'certs' ? (
                <button
                  onClick={() => handleStartEdit('certs')}
                  className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSave}
                    className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {editSection === 'certs' ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCertText}
                    onChange={(e) => setNewCertText(e.target.value)}
                    placeholder="Tambah sertifikat baru (e.g. TOEFL 550)"
                    className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCert();
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddCert}
                    size="sm"
                    className="h-9 cursor-pointer text-xs font-bold bg-foreground text-background hover:bg-foreground/90"
                  >
                    Tambah
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.certificates.map((cert: string) => (
                    <div
                      key={cert}
                      className="flex items-center justify-between bg-muted text-muted-foreground text-xs font-semibold py-1.5 px-3 rounded-xl"
                    >
                      <span>{cert}</span>
                      <button
                        onClick={() => handleRemoveCert(cert)}
                        className="p-1 hover:bg-muted-foreground/20 rounded-md transition-colors"
                      >
                        <Trash2 className="h-3 w-3 text-rose-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {user.certificates && user.certificates.length > 0 ? (
                  user.certificates.map((cert: string) => (
                    <div
                      key={cert}
                      className="flex items-center gap-2 bg-background/40 border border-border/60 p-3 rounded-xl"
                    >
                      <Award className="h-3 w-3 text-foreground shrink-0" />
                      <span className="text-xs font-semibold text-foreground">
                        {cert}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">
                    Belum ada sertifikasi yang ditambahkan.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Pengalaman Organisasi Section */}
          <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-md space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                Pengalaman Organisasi
              </h3>
              {editSection !== 'organization' ? (
                <button
                  onClick={() => handleStartEdit('organization')}
                  className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSave}
                    className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {editSection === 'organization' ? (
              <div className="space-y-4">
                <div className="space-y-3 bg-background/40 p-4 rounded-xl border border-border/70">
                  <div>
                    <label className="text-[12px] font-bold text-muted-foreground uppercase block mb-1">
                      Nama Organisasi & Peran
                    </label>
                    <Input
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Ketua Himpunan Mahasiswa"
                      className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12px] font-bold text-muted-foreground uppercase block mb-1">
                        Tahun Mulai
                      </label>
                      <Input
                        value={orgStart}
                        onChange={(e) => setOrgStart(e.target.value)}
                        placeholder="e.g. 2020"
                        className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-bold text-muted-foreground uppercase block mb-1">
                        Tahun Selesai
                      </label>
                      <Input
                        value={orgEnd}
                        onChange={(e) => setOrgEnd(e.target.value)}
                        placeholder="e.g. 2021"
                        className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddOrg}
                    size="sm"
                    className="w-full h-9 cursor-pointer text-xs font-bold bg-foreground text-background hover:bg-foreground/90"
                  >
                    Tambah Organisasi
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.organization.map((org: string) => (
                    <div
                      key={org}
                      className="flex items-center justify-between bg-background/50 border border-border/80 text-foreground text-xs font-semibold p-3 rounded-xl shadow-sm hover:border-border transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <User className="h-3 w-3 text-foreground shrink-0" />
                        <span className="truncate">{org}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const parsed = parseItem(org);
                            setOrgName(parsed.name);
                            setOrgStart(parsed.start);
                            setOrgEnd(parsed.end);
                            handleRemoveOrg(org);
                          }}
                          className="text-muted-foreground hover:bg-muted p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Edit item"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveOrg(org)}
                          className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                {organizations.length > 0 ? (
                  organizations.map((org: string) => (
                    <div
                      key={org}
                      className="flex items-center gap-2 bg-background/40 border border-border/60 p-3 rounded-xl"
                    >
                      <User className="h-3 w-3 text-foreground shrink-0" />
                      <span className="text-xs font-semibold text-foreground">
                        {org}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">
                    Belum ada pengalaman organisasi yang ditambahkan.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Referensi Pekerjaan Section */}
          <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-md space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                Referensi Pekerjaan Minat
              </h3>
              {editSection !== 'reference' ? (
                <button
                  onClick={() => handleStartEdit('reference')}
                  className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSave}
                    className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {editSection === 'reference' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase">
                    Minat Pekerjaan
                  </label>
                  <Input
                    value={formData.jobReference.interest}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jobReference: {
                          ...formData.jobReference,
                          interest: e.target.value,
                        },
                      })
                    }
                    className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-foreground mt-1"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase">
                    Kota / Lokasi
                  </label>
                  <Input
                    value={formData.jobReference.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jobReference: {
                          ...formData.jobReference,
                          city: e.target.value,
                        },
                      })
                    }
                    className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-foreground mt-1"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase">
                    Ekspektasi Gaji
                  </label>
                  <Input
                    value={formData.jobReference.salaryExpectation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jobReference: {
                          ...formData.jobReference,
                          salaryExpectation: e.target.value,
                        },
                      })
                    }
                    className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-foreground mt-1"
                  />
                               <div>
                  <label className="text-[12px] font-bold text-muted-foreground uppercase">
                    Opsi Kerja
                  </label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {['Remote', 'Hybrid', 'Onsite'].map((opt) => {
                      const selectedOptions = (formData.jobReference?.workOption || 'Hybrid')
                        .split(',')
                        .map((s: any) => s.trim())
                        .filter(Boolean);
                      const isChecked = selectedOptions.includes(opt);
                      return (
                        <label key={opt} className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              let newOptions;
                              if (e.target.checked) {
                                newOptions = [...selectedOptions, opt];
                              } else {
                                newOptions = selectedOptions.filter((o: string) => o !== opt);
                              }
                              setFormData({
                                ...formData,
                                jobReference: {
                                  ...formData.jobReference,
                                  workOption: newOptions.join(','),
                                },
                              });
                            }}
                            className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-background"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>   </div>
              </div>
            ) : (
              <div className="space-y-6 pt-1">
                {/* Row 1: Bidang Minat */}
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4 items-start">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bidang Minat</span>
                  <div className="space-y-2">
                    <div className="space-y-2.5 my-1">
                      {(() => {
                        const roles = (user.jobReference?.interest || 'Software Engineering / Web Development').split(/\s*[\/,]\s*/).slice(0, 3);
                        return roles.map((role: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                            <CircleCheck />
                            <span>{role}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>

                {/* Row 2: Tipe Pekerjaan */}
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4 items-start pt-2 border-t border-border/45">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipe Pekerjaan</span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                      <CircleCheck />
                      <span>Penuh Waktu</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                      <CircleCheck />
                      <span>Paruh Waktu</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                      <CircleCheck />
                      <span>Magang</span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Ekspektasi Gaji Bulanan */}
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4 items-start pt-2 border-t border-border/45">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ekspektasi Gaji Bulanan</span>
                  <span className="text-sm font-bold text-foreground">
                    {user.jobReference?.salaryExpectation || 'IDR 5 jt - 8 jt'}
                  </span>
                </div>

                {/* Row 4: Preferensi Kota Kerja */}
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4 items-start pt-2 border-t border-border/45">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preferensi Kota Kerja</span>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                    <CircleCheck />
                    <span>{user.jobReference?.city || 'Jakarta Pusat'}, Jawa Timur</span>
                  </div>
                                {/* Row 5: Bersedia Bekerja */}
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4 items-start pt-2 border-t border-border/45">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bersedia Bekerja</span>
                  <div className="space-y-2">
                    {(user.jobReference?.workOption || 'Hybrid')
                      .split(',')
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                      .map((opt: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                          <CircleCheck />
                          <span>{opt}</span>
                        </div>
                      ))}
                  </div>
                </div>   </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl animate-in scale-in duration-200">
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-muted rounded-full transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>

            <h3 className="text-sm font-extrabold tracking-tight text-foreground mb-4">
              Ubah Foto Profil
            </h3>

            {/* Upload dari perangkat */}
            <div className="space-y-2 mb-4">
              <label className="text-[12px] font-bold text-muted-foreground uppercase block">
                Upload dari Perangkat
              </label>
              <label className="relative border-2 border-dashed border-border/70 hover:border-primary/50 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 bg-background/25 group cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const result = ev.target?.result as string;
                        if (result) {
                          updateProfile({ profileImage: result });
                          setShowAvatarPicker(false);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <span className="group-hover:scale-110 transition-transform text-muted-foreground mb-1">
                  <ImageIcon className="w-6 h-6" />
                </span>
                <span className="text-xs font-bold text-foreground">
                  Pilih Foto
                </span>
                <span className="text-[12px] text-muted-foreground">
                  JPG, PNG, WEBP (Maks. 5MB)
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
