'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  LuBuilding2 as Building2,
  LuMapPin as MapPin,
  LuGlobe as Globe,
  LuArrowLeft as ArrowLeft,
  LuBriefcase as Briefcase,
  LuAward as Award,
  LuStar as Star,
  LuUsers as Users,
  LuShieldCheck as ShieldCheck,
  LuBookmark as Bookmark,
  LuFlame as Flame,
  LuCircleAlert as AlertCircle,
  LuLinkedin,
  LuInstagram,
  LuTwitter,
  LuFacebook,
  LuYoutube,
  LuCheck as Check,
} from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/store';
import axios from 'axios';
import { CompanyProfile, Company, Job } from '@/lib/types';
import Image from 'next/image';
import { LuFlag as Flag } from 'react-icons/lu';
import ReportModal from '@/components/pencari-kerja/ReportModal';

const CompanyProfilePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const companyId = (params?.id as string) || '1';
  const { bookmarks, toggleBookmark, theme } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [companyJobs, setCompanyJobs] = useState<any[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [companiesRes, jobsRes] = await Promise.all([
          axios.get<Company[]>('/data/companies.json'),
          axios.get<Job[]>('/data/jobs.json')
        ]);
        const companiesList = companiesRes.data;
        const jobsList = jobsRes.data;
        setAllJobs(jobsList);

        const foundCompany = companiesList.find((c) => c.id === companyId);
        if (foundCompany) {
          const profile: CompanyProfile = {
            id: foundCompany.id,
            name: foundCompany.name,
            logo: foundCompany.logo,
            industry: foundCompany.industry,
            location: foundCompany.location,
            totalEmployees: foundCompany.totalEmployees.includes('Karyawan')
              ? foundCompany.totalEmployees
              : `${foundCompany.totalEmployees} Karyawan`,
            rating: foundCompany.rating,
            isPremium: foundCompany.isPremium,
            description: foundCompany.description,
            website: `https://${foundCompany.name.toLowerCase().replace(/\s+/g, '')}.com`,
            linkedin: `https://linkedin.com/company/${foundCompany.name.toLowerCase().replace(/\s+/g, '-')}`,
            instagram: `https://instagram.com/${foundCompany.name.toLowerCase().replace(/\s+/g, '.')}`,
            twitter: `https://twitter.com/${foundCompany.name.toLowerCase().replace(/\s+/g, '')}`,
            facebook: `https://facebook.com/${foundCompany.name.toLowerCase().replace(/\s+/g, '')}`,
            youtube: `https://youtube.com/${foundCompany.name.toLowerCase().replace(/\s+/g, '')}`,
            cultureTitle: 'Inovasi Tanpa Batas & Fleksibilitas Kerja',
            cultureDesc: `Di ${foundCompany.name}, kami menerapkan budaya kerja Agile yang kolaboratif, transparan, dan mendukung penuh keseimbangan hidup karyawan (work-life balance) melalui sistem kerja hybrid.`,
            benefits: [
              'Period Leave',
              'Team Building Activity',
              'Casual Dress Code',
              'Paid Maternity / Paternity Leave',
              'Employee Discounts',
              'Competitive Salary',
              'THR / Bonus system',
              'Professional Development',
              'Company Outings',
            ],
            galleryImages: [
              'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
            ],
            galleryVideos: [
              'https://assets.mixkit.co/videos/preview/mixkit-business-people-meeting-around-table-40192-large.mp4',
              'https://assets.mixkit.co/videos/preview/mixkit-people-working-in-a-modern-office-42358-large.mp4',
              'https://assets.mixkit.co/videos/preview/mixkit-workers-in-a-modern-office-discussing-work-42263-large.mp4',
            ],
            workers: [
              {
                name: 'Budi Santoso',
                position: 'Chief Executive Officer (CEO)',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
              },
              {
                name: 'Siti Rahma',
                position: 'Head of HR Department',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
              },
            ],
          };
          setCompany(profile);

          const matching = jobsList.filter(
            (j) => j.company.toLowerCase() === foundCompany.name.toLowerCase()
          );
          setCompanyJobs(matching);
          setFilteredJobs(matching);
        }
      } catch (err) {
        console.error('Failed to load company profile:', err);
      }
    };
    if (companyId) {
      fetchData();
    }
  }, [companyId]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = companyJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.workType.toLowerCase().includes(query),
    );
    setFilteredJobs(filtered);
  };

  if (!mounted || !company) return null;

  return (
    <>
      <main className="min-h-screen bg-background py-10 pb-24">
        <div className="w-full max-w-[90%] mx-auto px-4 md:px-8">
          {/* Back button row */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent/40 cursor-pointer"
              onClick={() => router.push('/pencari-kerja/companies')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReportOpen(true)}
              className="text-xs font-semibold cursor-pointer text-orange-500 border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
            >
              <Flag className="h-3.5 w-3.5 mr-1.5" />
              Laporkan
            </Button>
          </div>

          {/* Profile Header Banner Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className="lg:col-span-8">
              <div className="relative overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-md p-6 lg:p-8 h-full">
                <div className="flex flex-col md:flex-row items-center md:items-center gap-6 relative z-10 h-full">
                  {/* Logo wrapper */}
                  <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center font-bold text-3xl border border-border shadow-sm overflow-hidden p-2 shrink-0">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      className="w-full h-full object-contain"
                     width={100} height={100} unoptimized />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                        {company.name}
                      </h1>
                      {company.isPremium && (
                        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                      )}
                    </div>

                    {/* Social Links under title */}
                    <div className="flex gap-2 pt-1.5 justify-center md:justify-start">
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Website Resmi"
                          className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg h-7 w-7 cursor-pointer text-muted-foreground transition-all shadow-sm"
                        >
                          <Globe className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {company.linkedin && (
                        <a
                          href={company.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="LinkedIn Profile"
                          className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg h-7 w-7 cursor-pointer text-muted-foreground transition-all shadow-sm"
                        >
                          <LuLinkedin className="h-4 w-4" />
                        </a>
                      )}
                      {company.instagram && (
                        <a
                          href={company.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Instagram Profile"
                          className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg h-7 w-7 cursor-pointer text-muted-foreground transition-all shadow-sm"
                        >
                          <LuInstagram className="h-4 w-4" />
                        </a>
                      )}
                      {company.twitter && (
                        <a
                          href={company.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Twitter / X Profile"
                          className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg h-7 w-7 cursor-pointer text-muted-foreground transition-all shadow-sm"
                        >
                          <LuTwitter className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {company.facebook && (
                        <a
                          href={company.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Facebook Page"
                          className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg h-7 w-7 cursor-pointer text-muted-foreground transition-all shadow-sm"
                        >
                          <LuFacebook className="h-4 w-4" />
                        </a>
                      )}
                      {company.youtube && (
                        <a
                          href={company.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="YouTube Channel"
                          className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg h-7 w-7 cursor-pointer text-muted-foreground transition-all shadow-sm"
                        >
                          <LuYoutube className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Menjaga Diri (Default Information) next to the banner */}
            <div className="lg:col-span-4 bg-orange-600/5 p-6 rounded-3xl border border-orange-600/25 flex gap-3 h-full items-start">
              <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xs text-orange-700 dark:text-orange-400">
                  Tips Menjaga Diri & Keamanan
                </h4>
                <p className="text-xs text-muted-foreground font-semibold leading-relaxed mt-1.5">
                  Jangan pernah mengirimkan uang atau membayar biaya apapun
                  dalam proses rekrutmen. Perusahaan resmi tidak memungut biaya
                  akomodasi atau tiket perjalanan. Laporkan jika Anda menemukan
                  indikasi penipuan.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Content Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Separate Tim Kami Box Card */}
              <div className="bg-card/45 backdrop-blur-md rounded-2xl border p-6 md:p-8 mb-6">
                <h2 className="text-base font-bold border-b pb-2.5 mb-5.5">
                  Tim Kami 
                </h2>
                <div className="flex flex-wrap gap-3">
                  {company.workers.map((worker, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 pr-4 rounded-full border bg-background/50 hover:bg-background transition-colors text-sm"
                    >
                      {worker.image.startsWith('http') ? (
                        <Image
                          src={worker.image}
                          alt={worker.name}
                          className="h-8 w-8 rounded-full object-cover shrink-0 border border-border"
                         width={100} height={100} unoptimized />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border shrink-0">
                          {worker.image}
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
                      <a
                        href={
                          worker.linkedin ||
                          `https://linkedin.com/in/${worker.name.toLowerCase().replace(/\s+/g, '')}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors p-1 shrink-0 ml-3 border-l pl-3 cursor-pointer"
                        title={`LinkedIn ${worker.name}`}
                      >
                        <LuLinkedin className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail Company */}
              <section className="bg-card/45 backdrop-blur-md rounded-2xl border p-6 md:p-8 space-y-6">
                <h2 className="text-base font-bold border-b pb-2.5 mb-5">
                  Detail Company
                </h2>

                {/* Metadata Grid (Industry, Location, Company Size) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-5 border-border/60 text-xs">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <div className="text-xs text-muted-foreground font-bold tracking-wider">
                        Industry
                      </div>
                      <div className="mt-1 font-normal text-foreground text-xs">
                        {company.industry}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:border-l md:pl-5 border-border/60">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <div className="text-xs text-muted-foreground font-bold tracking-wider">
                        Location
                      </div>
                      <div className="mt-1 font-normal text-foreground text-xs">
                        {company.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:border-l md:pl-5 border-border/60">
                    <Users className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <div className="text-xs text-muted-foreground font-bold tracking-wider">
                        Company Size
                      </div>
                      <div className="mt-1 font-normal text-foreground text-xs">
                        {company.totalEmployees || '100-500 Karyawan'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Description */}
                <p className="text-xs text-muted-foreground font-semibold pt-3 pb-0.5 leading-relaxed">
                  {company.description}
                </p>
              </section>

              {/* Budaya Perusahaan */}
              <section className="bg-card/45 backdrop-blur-md rounded-2xl border p-6 md:p-8 space-y-4">
                <h2 className="text-base font-bold border-b pb-2.5 mb-4">
                  Kultur Perusahaan
                </h2>
                <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                  {company.cultureDesc}
                </p>
              </section>

              {/* Benefit Kerja */}
              <section className="bg-card/45 backdrop-blur-md rounded-2xl border p-6 md:p-8 space-y-4">
                <h2 className="text-base font-bold border-b pb-2.5 mb-5.5">
                  Benefit Kerja
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {company.benefits?.map((benefit, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className={`text-[12px] font-normal px-2.5 py-0.5 h-6 rounded-full shadow-sm flex items-center ${
                        mounted && theme === 'white'
                          ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                          : 'bg-background/50 border border-border/80 text-muted-foreground'
                      }`}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </section>

              {/* Galeri Foto & Video */}
              <section className="bg-card/45 backdrop-blur-md rounded-2xl border p-6 md:p-8 space-y-4">
                <h2 className="text-base font-bold border-b pb-2.5 mb-4.5">
                  Company Gallery
                </h2>

                {/* Images */}
                <div className="flex flex-wrap gap-4">
                  {company.galleryImages.slice(0, 3).map((imgUrl, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl border relative w-[240px] h-[240px] bg-muted shrink-0"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${company.name} Gallery ${i + 1}`}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                       width={100} height={100} unoptimized />
                    </div>
                  ))}
                </div>

                {/* Videos */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {company.galleryVideos.map((vidUrl, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl border relative w-[240px] h-[240px] bg-black shrink-0"
                    >
                      <video
                        src={vidUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column - Active Jobs */}
            <div className="lg:col-span-4">
              {/* Loker Aktif Section */}
              <section className="bg-card/45 backdrop-blur-md rounded-2xl border p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-base font-bold">Loker Aktif</h2>
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-semibold"
                  >
                    {filteredJobs.length} Lowongan
                  </Badge>
                </div>

                {/* Search Box with Tombol Cari inside */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Cari lowongan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    className="w-full pl-3 pr-16 py-1.5 text-xs rounded-xl border bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    size="sm"
                    onClick={handleSearch}
                    suppressHydrationWarning
                    className={`absolute right-1 top-1 bottom-1 h-auto py-0 text-[10px] px-2.5 rounded-lg font-semibold border transition-colors cursor-pointer ${
                      mounted && theme === 'white'
                        ? 'bg-[#0f6dff] hover:bg-[#0056d6] text-white border-[#0f6dff]! hover:border-[#0056d6]!'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary!'
                    }`}
                  >
                    Cari
                  </Button>
                </div>

                {/* Jobs list - Max 10 boxes scrollable */}
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 smooth-scroll">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => router.push(`/pencari-kerja/jobs/${job.id}`)}
                        className="group relative flex flex-col justify-between rounded-xl border border-border/70 py-4 px-5 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary/50 bg-card"
                      >
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            {/* Header: Logo, Title, and Bookmark */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border overflow-hidden">
                                  <Image
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-full h-full object-contain"
                                   width={100} height={100} unoptimized />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-[14px] text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                                    {job.title}
                                  </h3>
                                  <p className="text-xs text-muted-foreground truncate font-medium mt-1 flex items-center gap-1">
                                    <span className="truncate">
                                      {company.name}
                                    </span>
                                    {company.isPremium && (
                                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                    )}
                                    <span className="shrink-0">
                                      • {job.location}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(job.id);
                                }}
                                className="text-muted-foreground hover:text-primary transition-colors p-1 shrink-0 cursor-pointer"
                              >
                                <Bookmark
                                  className={`h-4.5 w-4.5 ${mounted && bookmarks.includes(job.id) ? 'fill-primary/60' : ''}`}
                                />
                              </button>
                            </div>

                            {/* Badges Row */}
                            <div className="flex h-12 flex-wrap gap-1.5 mb-4">
                              {job.isPremium && (
                                <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold text-[12px] px-2 py-0.5 h-6">
                                  Perusahaan Premium
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className={`text-[12px] font-normal px-2 py-0.5 h-6 ${
                                  mounted && theme === 'white'
                                    ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                    : 'bg-background/50 border border-border/80 text-muted-foreground'
                                }`}
                              >
                                {job.workType}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-[12px] font-normal px-2 py-0.5 h-6 ${
                                  mounted && theme === 'white'
                                    ? 'bg-[#eef5fa] border border-[#d2e2f0] text-[#334155]'
                                    : 'bg-background/50 border border-border/80 text-muted-foreground'
                                }`}
                              >
                                {job.experienceLevel}
                              </Badge>
                            </div>
                          </div>

                          {/* Footer: Salary on Left, Time/Urgent on Right */}
                          <div className="flex items-center justify-between border-t pt-3 mt-auto h-9">
                            <span className="text-[12px] font-bold text-emerald-500">
                              {job.salary}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold h-6">
                              <span>{job.postedAt}</span>
                              {job.isUrgent && (
                                <Badge className="rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 font-semibold text-xs px-2 py-0 h-5 border border-red-500/10 shadow-none flex items-center gap-1">
                                  <Flame className="h-2.5 w-2.5" />
                                  Urgent
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Tidak ada lowongan yang cocok.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetName={company.name}
        targetType="perusahaan"
      />
    </>
  );
};

export default CompanyProfilePage;
