'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/store';
import {
  Pencil,
  Check,
  X,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Globe,
  FileText,
  MapPin,
  User,
  Plus,
  Trash2,
  Settings,
  Award,
  Image as ImageIcon,
  GripHorizontal,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface DashboardProfileProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardProfile({ onNavigate }: DashboardProfileProps) {
  const { user, updateProfile, theme } = useAppStore();
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
      url: 'https://bing.biturl.top/?resolution=1920&format=image&index=0',
      label: 'Bing Image',
      copyright: 'Realtime Bing Image of the Day',
    },
  ];

  const [bgIndex, setBgIndex] = useState(0);
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
    const saved = getCookie('banner_photo');
    if (saved !== undefined) {
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < bannerPhotos.length) {
        setBgIndex(idx);
      }
    }

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
        education: Array.isArray(user.education) ? user.education : (user.education ? [user.education] : []),
        experience: Array.isArray(user.experience) ? user.experience : (user.experience ? [user.experience] : []),
        resume: user.resume || '',
        website: user.website || '',
        socialMedia: user.socialMedia || '',
        softFile: user.softFile || '',
        aboutMe: user.aboutMe || '',
        organization: Array.isArray(user.organization) ? user.organization : (user.organization ? [user.organization] : []),
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

  if (!mounted || !user) return null;

  const experiences = Array.isArray(user.experience) ? user.experience : (user.experience ? [user.experience] : []);
  const educations = Array.isArray(user.education) ? user.education : (user.education ? [user.education] : []);
  const organizations = Array.isArray(user.organization) ? user.organization : (user.organization ? [user.organization] : []);

  const handleStartEdit = (section: string) => {
    setEditSection(section);
  };

  const handleCancelEdit = () => {
    setEditSection(null);
    // Reset to user data
    setFormData({
      name: user.name || '',
      nickname: user.nickname || '',
      career: user.career || '',
      waNumber: user.waNumber || '',
      email: user.email || '',
      education: Array.isArray(user.education) ? user.education : (user.education ? [user.education] : []),
      experience: Array.isArray(user.experience) ? user.experience : (user.experience ? [user.experience] : []),
      resume: user.resume || '',
      website: user.website || '',
      socialMedia: user.socialMedia || '',
      softFile: user.softFile || '',
      aboutMe: user.aboutMe || '',
      organization: Array.isArray(user.organization) ? user.organization : (user.organization ? [user.organization] : []),
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
    if (newCertText.trim() && !formData.certificates.includes(newCertText.trim())) {
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

  // Helper to parse item details for editing
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
      const duration = eduStart.trim() && eduEnd.trim()
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
      const duration = expStart.trim() && expEnd.trim()
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
      const duration = orgStart.trim() && orgEnd.trim()
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

    // Validate size (< 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError('Ukuran berkas melebihi 10MB!');
      return;
    }

    // Validate type (pdf, doc, docx)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
      softFile: file.name
    });
  };

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-6 shadow-md flex flex-col h-[880px] overflow-hidden animate-in fade-in duration-300">
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-1.5 smooth-scroll space-y-6 md:space-y-8 pb-4">

        {/* Profile Header — ikut scroll */}
        <div className="mb-6">
          {/* Profile Header with Banner & Avatar Overlay */}
          <div className="bg-card border border-border/70 rounded-2xl overflow-hidden shadow-xl relative">
            {/* Banner */}
            <div
              className="h-32 md:h-36 bg-cover bg-center relative transition-all duration-300"
              style={{
                backgroundImage: `url('${bannerPhotos[bgIndex].url}')`,
              }}
            >
              {/* Stronger dark overlay for text contrast and depth */}
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-black/10" />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />


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
                  {/* Title Bar - drag handle */}
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
                      <span className="text-[11px] font-bold text-foreground tracking-tight">
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
                            setBgIndex(idx);
                            setCookie('banner_photo', String(idx));
                          }}
                          className={`relative rounded-xl overflow-hidden h-[58px] cursor-pointer group transition-all border-none p-0 ${
                            bgIndex === idx
                              ? 'ring-2 ring-foreground ring-offset-1 ring-offset-background'
                              : 'hover:ring-2 hover:ring-foreground/40'
                          }`}
                        >
                          <img
                            src={photo.url}
                            alt={photo.label}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            draggable={false}
                          />
                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/5 transition-all" />
                          <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-bold text-white drop-shadow-md">
                            {photo.label}
                          </span>
                          {bgIndex === idx && (
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
                        setBgIndex(6);
                        setCookie('banner_photo', '6');
                      }}
                      className={`w-full relative rounded-xl overflow-hidden h-[46px] cursor-pointer group transition-all flex items-center justify-between px-3 border transition-colors ${
                        bgIndex === 6
                          ? 'ring-2 ring-foreground ring-offset-1 ring-offset-background bg-foreground/10 border-foreground/30'
                          : 'hover:bg-muted/50 border-border/60 bg-background/25'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg overflow-hidden bg-muted relative shrink-0">
                          <img
                            src={bannerPhotos[6].url}
                            alt="Bing"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            draggable={false}
                          />
                          <div className="absolute inset-0 bg-black/25" />
                        </div>
                        <span className="text-[10px] font-bold text-foreground">
                          Mode Bing Image
                        </span>
                      </div>
                      {bgIndex === 6 && (
                        <div className="h-3.5 w-3.5 bg-primary rounded-full flex items-center justify-center shadow">
                          <Check className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Avatar Overlay */}
            <div className="px-4 md:px-5 pb-3 md:pb-4 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-14 gap-2 mb-1">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3.5 text-center sm:text-left">
                  <button
                    onClick={() => setShowAvatarPicker(true)}
                    className="h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden border-4 border-card shadow-md bg-muted/40 relative group cursor-pointer border-none p-0 text-left shrink-0"
                    title="Ubah Foto Profil"
                  >
                    <img
                      src={user.profileImage || '/images/avatar.svg'}
                      alt="avatar"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-200 text-white">
                      <Pencil className="h-4.5 w-4.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Ubah Foto</span>
                    </div>
                  </button>
                  <div className="space-y-1 pb-1">
                    <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-foreground">
                      {user.name}
                    </h1>
                    <p className="text-sm md:text-base font-semibold text-muted-foreground">
                      {user.career || 'Pekerjaan belum diatur'}
                    </p>
                  </div>
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
                  onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                  rows={4}
                  className="w-full text-xs font-medium bg-background border border-border/80 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-foreground leading-relaxed"
                />
              ) : (
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  {user.aboutMe || 'Tulis ringkasan tentang diri Anda di sini...'}
                </p>
              )}
            </div>             {/* UserProfile Info Section */}
            <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-md space-y-5 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[11px] text-muted-foreground uppercase tracking-wider">
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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Nama Lengkap</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Nama Panggilan</label>
                    <Input
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Posisi / Karir</label>
                    <Input
                      value={formData.career}
                      onChange={(e) => setFormData({ ...formData, career: e.target.value })}
                      className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Nomor WA</label>
                    <Input
                      value={formData.waNumber}
                      onChange={(e) => setFormData({ ...formData, waNumber: e.target.value })}
                      className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Email</label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  <div className="flex items-center gap-3">
                    <User className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Nama Lengkap</span>
                      <span className="text-xs font-bold text-foreground">{user.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Nama Panggilan</span>
                      <span className="text-xs font-bold text-foreground">{user.nickname || '-'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block font-semibold">WhatsApp</span>
                      <span className="text-xs font-bold text-foreground">{user.waNumber || '-'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Email</span>
                      <span className="text-xs font-bold text-foreground block break-all">{user.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

             {/* Links & Files Section */}
            <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-md space-y-5 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[11px] text-muted-foreground uppercase tracking-wider">
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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1.5">Resume</label>
                    {formData.softFile ? (
                      <div className="flex items-center justify-between bg-muted/40 border border-border/80 rounded-xl p-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl shrink-0">
                            {formData.softFile.endsWith('.pdf') ? '📄' : '📝'}
                          </span>
                          <span className="text-xs font-bold truncate text-foreground">
                            {formData.softFile}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, softFile: '' })}
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
                        <div className="text-xl text-muted-foreground group-hover:scale-110 transition-transform">📁</div>
                        <span className="text-xs font-bold text-foreground">Pilih Berkas</span>
                        <span className="text-[10px] text-muted-foreground text-center">PDF atau Word (Maks. 10MB)</span>
                      </div>
                    )}
                    {uploadError && (
                      <p className="text-[10px] font-bold text-rose-500 mt-1.5">{uploadError}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Website Pribadi</label>
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://budisantoso.dev"
                      className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">LinkedIn </label>
                    <Input
                      value={formData.socialMedia}
                      onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
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
                      <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Resume
                      </span>
                      {user.softFile ? (
                        <div className="flex items-center gap-2 mt-1 min-w-0">
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Membuka berkas: ${user.softFile}`);
                            }}
                            className="text-xs font-bold text-foreground hover:underline truncate block"
                          >
                            {user.softFile}
                          </a>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-muted-foreground uppercase shrink-0">
                            {user.softFile.split('.').pop()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-foreground block mt-1">-</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Website
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
                        <span className="text-xs font-bold text-foreground">-</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block font-semibold">LinkedIn                        
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
                        <span className="text-xs font-bold text-foreground">-</span>
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
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Posisi & Perusahaan</label>
                      <Input
                        value={expName}
                        onChange={(e) => setExpName(e.target.value)}
                        placeholder="e.g. Junior Developer di TechCorp"
                        className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Tanggal Mulai</label>
                        <Input
                          value={expStart}
                          onChange={(e) => setExpStart(e.target.value)}
                          placeholder="e.g. Jan 2018 / 2018"
                          className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Tanggal Selesai</label>
                        <Input
                          value={expEnd}
                          onChange={(e) => setExpEnd(e.target.value)}
                          placeholder="e.g. Des 2022 / Sekarang"
                          className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddExp} size="sm" className="w-full h-9 cursor-pointer text-xs font-bold bg-foreground text-background hover:bg-foreground/90">
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
                        <span className="text-xs font-semibold text-foreground">{exp}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">Belum ada pengalaman kerja yang ditambahkan.</span>
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
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Institusi & Gelar</label>
                      <Input
                        value={eduName}
                        onChange={(e) => setEduName(e.target.value)}
                        placeholder="e.g. S1 Teknik Informatika di Universitas Indonesia"
                        className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Tahun Mulai</label>
                        <Input
                          value={eduStart}
                          onChange={(e) => setEduStart(e.target.value)}
                          placeholder="e.g. 2018"
                          className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Tahun Lulus</label>
                        <Input
                          value={eduEnd}
                          onChange={(e) => setEduEnd(e.target.value)}
                          placeholder="e.g. 2022 / Sekarang"
                          className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddEdu} size="sm" className="w-full h-9 cursor-pointer text-xs font-bold bg-foreground text-background hover:bg-foreground/90">
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
                        <span className="text-xs font-semibold text-foreground">{edu}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">Belum ada riwayat pendidikan yang ditambahkan.</span>
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
                    <Button onClick={handleAddSkill} size="sm" className="h-9 cursor-pointer text-xs font-bold bg-foreground text-background hover:bg-foreground/90">
                      Tambah
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skill.map((sk: string) => (
                      <div
                        key={sk}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold pl-2.5 pr-1.5 py-0.5 h-6 rounded-full border shadow-sm select-none ${
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
                        className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 h-6 rounded-full border shadow-sm select-none ${
                          mounted && theme === 'white'
                            ? 'bg-[#eef5fa] border-[#d2e2f0] text-[#334155]'
                            : 'bg-background/50 border-border/80 text-muted-foreground'
                        }`}
                      >
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">Belum ada skill yang ditambahkan.</span>
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
                    <Button onClick={handleAddCert} size="sm" className="h-9 cursor-pointer text-xs font-bold bg-foreground text-background hover:bg-foreground/90">
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
                        <span className="text-xs font-semibold text-foreground">{cert}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">Belum ada sertifikasi yang ditambahkan.</span>
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
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Nama Organisasi & Peran</label>
                      <Input
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="e.g. Ketua Himpunan Mahasiswa"
                        className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Tahun Mulai</label>
                        <Input
                          value={orgStart}
                          onChange={(e) => setOrgStart(e.target.value)}
                          placeholder="e.g. 2020"
                          className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Tahun Selesai</label>
                        <Input
                          value={orgEnd}
                          onChange={(e) => setOrgEnd(e.target.value)}
                          placeholder="e.g. 2021"
                          className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-foreground"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddOrg} size="sm" className="w-full h-9 cursor-pointer text-xs font-bold bg-foreground text-background hover:bg-foreground/90">
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
                        <span className="text-xs font-semibold text-foreground">{org}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">Belum ada pengalaman organisasi yang ditambahkan.</span>
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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Minat Pekerjaan</label>
                    <Input
                      value={formData.jobReference.interest}
                      onChange={(e) => setFormData({
                        ...formData,
                        jobReference: { ...formData.jobReference, interest: e.target.value }
                      })}
                      className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-foreground mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Kota / Lokasi</label>
                    <Input
                      value={formData.jobReference.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        jobReference: { ...formData.jobReference, city: e.target.value }
                      })}
                      className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-foreground mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Ekspektasi Gaji</label>
                    <Input
                      value={formData.jobReference.salaryExpectation}
                      onChange={(e) => setFormData({
                        ...formData,
                        jobReference: { ...formData.jobReference, salaryExpectation: e.target.value }
                      })}
                      className="h-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-foreground mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Opsi Kerja</label>
                    <select
                      value={formData.jobReference.workOption}
                      onChange={(e) => setFormData({
                        ...formData,
                        jobReference: { ...formData.jobReference, workOption: e.target.value }
                      })}
                      className="w-full h-9 text-xs font-semibold bg-background border border-border/80 rounded-xl px-2 mt-1 focus:outline-none focus:ring-1 focus:ring-foreground cursor-pointer"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="bg-background/40 border border-border/60 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Minat Pekerjaan</span>
                    <span className="text-xs font-bold text-foreground block">{user.jobReference?.interest || '-'}</span>
                  </div>
                  <div className="bg-background/40 border border-border/60 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Kota</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground">{user.jobReference?.city || '-'}</span>
                    </div>
                  </div>
                  <div className="bg-background/40 border border-border/60 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Ekspektasi Gaji</span>
                    <span className="text-xs font-bold text-foreground block">{user.jobReference?.salaryExpectation || '-'}</span>
                  </div>
                  <div className="bg-background/40 border border-border/60 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Metode Kerja</span>
                    <span className="text-xs font-bold text-foreground block">{user.jobReference?.workOption || '-'}</span>
                  </div>
                </div>
              )}
            </div>
        </div>

      </div>{/* end scroll area */}

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
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">
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
                <span className="text-2xl group-hover:scale-110 transition-transform">🖼️</span>
                <span className="text-xs font-bold text-foreground">Pilih Foto</span>
                <span className="text-[10px] text-muted-foreground">JPG, PNG, WEBP (Maks. 5MB)</span>
              </label>
            </div>


          </div>
        </div>
      )}
    </div>
  );
}
