'use client';

import React, { useState, useRef } from 'react';
import { LuX as X, LuShieldCheck as ShieldCheck, LuUpload as Upload, LuChevronRight as ChevronRight } from 'react-icons/lu';

const REPORT_REASONS = [
  {
    id: 'perkerjaan_tidak_layak',
    label: 'Perkerjaan Tidak Layak',
    desc: 'Loker memuat isu SARA, pornografi, dan/atau kekerasan.',
  },
  {
    id: 'deskripsi_tidak_jelas',
    label: 'Deskripsi Pekerjaan Tidak Jelas',
    desc: 'Loker tidak memuat kualifikasi atau tanggung jawab pekerjaan, dan/atau memiliki deskripsi pekerjaan yang tidak berhubungan dengan nama loker',
  },
  {
    id: 'indikasi_penipuan',
    label: 'Indikasi penipuan',
    desc: 'Perusahaan meminta data diri yang tidak berhubungan dengan pekerjaan, dan/atau menjanjikan gaji tinggi dengan usaha minimal dan mencurigakan',
  },
  {
    id: 'pemungutan_biaya',
    label: 'Terdapat Pemungutan Biaya',
    desc: 'Perusahaan memungut biaya pada saat proses rekrutmen',
  },
  {
    id: 'perusahaan_pialang',
    label: 'Perusahaan Pialang',
    desc: 'Perusahaan bergerak di bidang pialang yang memperdagangkan kontrak berjangka (futures) atas komoditas, mata uang, indeks saham, atau instrumen keuangan lainnya',
  },
  {
    id: 'gaji_terlalu_rendah',
    label: 'Gaji Terlalu Rendah',
    desc: 'Gaji yang diberikan oleh HRD terlalu rendah dibandingkan yang tertera di aplikasi atau gaji pekerjaan sangat rendah dibandingkan gaji di pasaran.',
  },
  {
    id: 'lainnya',
    label: 'Lainnya',
    desc: 'Kamu mengalami kendala lain atau ketidaknyamanan ketika melamar kerja.',
  },
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  targetType?: 'lowongan' | 'perusahaan';
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetName,
  targetType = 'lowongan',
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setStep(1);
    setSelectedReason('');
    setAdditionalInfo('');
    setUploadedFiles([]);
    setSubmitted(false);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (f) => ['image/jpeg', 'image/jpg', 'image/png'].includes(f.type) && f.size <= 5 * 1024 * 1024
    );
    setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (additionalInfo.length < 20) return;
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2500);
  };

  if (!isOpen) return null;

  const selectedLabel = REPORT_REASONS.find((r) => r.id === selectedReason)?.label ?? '';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-background/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-extrabold text-foreground">
            Laporkan {targetType === 'perusahaan' ? 'Perusahaan' : 'Lowongan'} Ini
          </h2>
          <button
            onClick={handleClose}
            className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[72vh] overflow-y-auto">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="h-7 w-7 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-extrabold text-sm text-foreground">Laporan Terkirim!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Laporan kamu tentang <span className="font-bold">&quot;{targetName}&quot;</span> sedang kami tinjau.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Info box */}
              <div className="flex gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 mb-6">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-foreground/80 leading-relaxed">
                  Kami akan meninjau laporanmu dan mengambil tindakan yang dibutuhkan. Mohon berikan informasi sedetail mungkin, agar laporan kamu dapat diperiksa dengan baik. Tenang, laporan kamu akan tetap dirahasiakan.
                </p>
              </div>

              {step === 1 && (
                <div>
                  <p className="text-sm font-extrabold text-foreground mb-4">
                    Pilih 1 alasan<span className="text-red-500">*</span>
                  </p>
                  <div className="space-y-1">
                    {REPORT_REASONS.map((reason) => (
                      <label
                        key={reason.id}
                        className={`flex items-start gap-3 cursor-pointer px-3 py-2.5 rounded-xl border transition-all ${
                          selectedReason === reason.id
                            ? 'border-primary/50 bg-primary/5'
                            : 'border-transparent hover:bg-muted/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reason.id}
                          checked={selectedReason === reason.id}
                          onChange={() => setSelectedReason(reason.id)}
                          className="mt-0.5 accent-primary shrink-0"
                        />
                        <div>
                          <p className="text-sm font-bold text-foreground">{reason.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{reason.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} id="report-detail-form">
                  <div className="mb-5">
                    <p className="text-sm font-bold text-foreground">{selectedLabel}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {REPORT_REASONS.find((r) => r.id === selectedReason)?.desc}
                    </p>
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-extrabold text-foreground mb-2">
                      Informasi Tambahan<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        className="w-full min-h-[110px] rounded-xl border border-border bg-background px-4 py-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        placeholder="Tambahkan penjelasan yang lengkap disini agar kami dapat melakukan tindakan lebih lanjut yang diperlukan (min. 20 karakter)"
                        maxLength={500}
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                      />
                      <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">
                        {additionalInfo.length} / 500
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-foreground mb-1">Upload Bukti Pendukung</p>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      Hanya jenis gambar (JPEG, JPG, PNG) yang diterima. Maksimal 5 file, masing-masing kurang dari 5MB. Upload gambar atau geser file kamu ke kotak di bawah ini.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {uploadedFiles.map((file, i) => (
                        <div
                          key={i}
                          className="h-16 w-16 rounded-xl border border-border bg-muted/40 flex flex-col items-center justify-center relative overflow-hidden"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setUploadedFiles((prev) => prev.filter((_, fi) => fi !== i))}
                            className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/60 flex items-center justify-center cursor-pointer"
                          >
                            <X className="h-2.5 w-2.5 text-white" />
                          </button>
                        </div>
                      ))}
                      {uploadedFiles.length < 5 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-16 w-16 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground font-semibold">Upload</span>
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
            <button
              onClick={step === 1 ? handleClose : () => setStep(1)}
              className="px-4 py-2 rounded-lg border border-border text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Kembali
            </button>
            {step === 1 ? (
              <button
                disabled={!selectedReason}
                onClick={() => setStep(2)}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Selanjutnya
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                form="report-detail-form"
                disabled={additionalInfo.length < 20}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Kirim
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
