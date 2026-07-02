'use client';

import React from 'react';
import Image from 'next/image';
import { LuCheck as Check } from 'react-icons/lu';

interface CandidatePrintProfileProps {
  profile: any; // Can be viewingTalentProfile from employer or user from jobseeker
}

export default function CandidatePrintProfile({ profile }: CandidatePrintProfileProps) {
  if (!profile) return null;

  return (
    <>
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
            {/* Avatar / Initial */}
            <div style={{
              width: 72, height: 72, borderRadius: 18, margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: 'white',
              boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              {profile.avatar && !profile.avatar.includes('default') && !profile.avatar.includes('placeholder') ? (
                <Image src={profile.avatar} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} width={100} height={100} unoptimized />
              ) : profile.profileImage && !profile.profileImage.includes('default') && !profile.profileImage.includes('placeholder') ? (
                <Image src={profile.profileImage} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} width={100} height={100} unoptimized />
              ) : (
                profile.name?.charAt(0) || 'U'
              )}
            </div>

            {/* Candidate Name */}
            <h1 style={{
              fontSize: 32, fontWeight: 800, color: '#fafafa',
              margin: '0 0 4px', letterSpacing: '-0.5px', lineHeight: 1.2,
            }}>
              {profile.name || 'Candidate Name'}
            </h1>

            {/* Job Title / Subtitle */}
            {profile.title && (
              <p style={{ fontSize: 15, color: '#a78bfa', fontWeight: 600, margin: '0 0 16px' }}>
                {profile.title}
              </p>
            )}

            {/* Contact Row */}
            <p style={{
              fontSize: 12, color: '#71717a', fontWeight: 500, margin: '0 0 20px',
              display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap',
            }}>
              {profile.location && <span>{profile.location}</span>}
              {profile.email && <span>{profile.email}</span>}
              {profile.phone && <span>{profile.phone}</span>}
            </p>

            {/* Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              {(profile.hasCv || profile.softFile) && (
                <span style={{
                  padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)',
                }}><Check className="w-3 h-3 mr-1 inline" /> CV Tersedia</span>
              )}
              {profile.hasCertificate && (
                <span style={{
                  padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)',
                }}><Check className="w-3 h-3 mr-1 inline" /> Tersertifikasi</span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#27272a', margin: '0 48px' }} />

          {/* Sections */}
          <div style={{ padding: '32px 48px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* TENTANG SAYA */}
            {(profile.aboutMe || profile.description) && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 10px', letterSpacing: '0.02em' }}>
                  TENTANG SAYA
                </h2>
                <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.9, margin: 0, fontWeight: 400 }}>
                  {profile.aboutMe || profile.description}
                </p>
              </div>
            )}

            {/* INFORMASI & KESIAPAN KERJA */}
            <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                INFORMASI & KESIAPAN
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
                {[
                  { label: 'Ekspektasi Gaji', value: profile.expectedSalary ? `Rp ${profile.expectedSalary.toLocaleString('id-ID')}` : '' },
                  { label: 'Kapan Mulai', value: profile.readyNow ? 'Siap Segera' : 'Notice 1 Bulan' },
                  { label: 'Pengalaman', value: profile.experienceYears ? `${profile.experienceYears} Tahun` : '' },
                  { label: 'Lokasi Kerja', value: profile.willingToRelocate ? 'Bersedia Relokasi' : 'Tidak Bersedia Relokasi' },
                  { label: 'Perangkat Kerja', value: profile.hasLaptop ? 'Laptop Pribadi Tersedia' : '' },
                  { label: 'Kendaraan Pribadi', value: profile.hasMotor ? 'Motor' : '' },
                  { label: 'Dokumen', value: [profile.hasSim ? 'SIM' : '', profile.hasSkck ? 'SKCK' : ''].filter(Boolean).join(', ') },
                  { label: 'Website', value: profile.website },
                ].filter(item => item.value).map((item, i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #27272a' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{item.label}</p>
                    <p style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 600, margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PENGALAMAN KERJA */}
            {((profile.experience && profile.experience.length > 0) || profile.experienceYears > 0 || profile.experiences) && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  PENGALAMAN KERJA
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                  {profile.experience && Array.isArray(profile.experience) ? (
                    profile.experience.map((exp: string, i: number) => (
                      <div key={i} style={{ borderLeft: '2px solid #27272a', paddingLeft: 16, margin: '6px 0' }}>
                        <p style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 650, margin: '0 0 4px' }}>
                          {exp}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div style={{ borderRadius: 12, padding: 12, background: '#27272a' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#fafafa', margin: '0 0 4px' }}>
                        {profile.title || 'Professional'}
                      </p>
                      <p style={{ fontSize: 11, color: '#a1a1aa', margin: 0 }}>
                        {profile.experienceYears || 1} Tahun Pengalaman
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PENDIDIKAN */}
            {((profile.education && Array.isArray(profile.education) && profile.education.length > 0) || (typeof profile.education === 'string')) && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  PENDIDIKAN
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                  {profile.education && Array.isArray(profile.education) ? (
                    profile.education.map((edu: string, i: number) => (
                      <div key={i} style={{ borderLeft: '2px solid #27272a', paddingLeft: 16, margin: '6px 0' }}>
                        <p style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 650, margin: '0 0 4px' }}>
                          {edu}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div style={{ borderRadius: 12, padding: 12, background: '#27272a' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#fafafa', margin: '0 0 4px' }}>
                        {profile.education || 'S1'}
                      </p>
                      <p style={{ fontSize: 11, color: '#a1a1aa', margin: 0 }}>
                        Lulus
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ORGANISASI */}
            {profile.organization && Array.isArray(profile.organization) && profile.organization.length > 0 && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  ORGANISASI
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {profile.organization.map((org: string, i: number) => (
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
            {profile.certificates && Array.isArray(profile.certificates) && profile.certificates.length > 0 && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  SERTIFIKASI & PENGHARGAAN
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {profile.certificates.map((cert: string, i: number) => (
                    <div key={i} style={{ borderLeft: '2px solid #27272a', paddingLeft: 16, margin: '6px 0' }}>
                      <p style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 650, margin: '0 0 4px' }}>
                        {cert}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KEAHLIAN / SKILL */}
            {((profile.skills && profile.skills.length > 0) || (profile.skill && profile.skill.length > 0)) && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  KEAHLIAN / SKILL
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(profile.skills || profile.skill).map((skill: string, i: number) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      background: '#27272a',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#e4e4e7'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* REFERENSI KERJA */}
            {profile.jobReference && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid', paddingTop: 8 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#fafafa', margin: '0 0 10px', letterSpacing: '0.02em' }}>
                  REFERENSI KERJA
                </h2>
                <div style={{ borderLeft: '2px solid #27272a', paddingLeft: 16, margin: '6px 0' }}>
                  <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.9, margin: 0, fontWeight: 400, fontStyle: 'italic' }}>
                    &quot;{profile.jobReference}&quot;
                  </p>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
}
