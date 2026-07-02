'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import CustomSelect from '@/components/ui/select-custom';
import { LuCheck as Check, LuMessageSquare as MessageSquare, LuSparkles as Sparkles, LuPower as Power } from 'react-icons/lu';

const ChatSettingTab: React.FC = () => {
  const { autoChatSettings, fetchAutoChatSettings, updateAutoChatSettings } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [mode, setMode] = useState<'no-custom' | 'custom'>('no-custom');
  const [selectedStatus, setSelectedStatus] = useState<string>('Melamar');
  
  const [configs, setConfigs] = useState<Record<string, { isActive: boolean; selectedTemplateId: number; customTemplateText: string }>>({
    "Melamar": { isActive: true, selectedTemplateId: 1, customTemplateText: "" },
    "Terseleksi": { isActive: false, selectedTemplateId: 1, customTemplateText: "" },
    "Diterima": { isActive: false, selectedTemplateId: 1, customTemplateText: "" },
    "Ditutup": { isActive: false, selectedTemplateId: 1, customTemplateText: "" }
  });

  useEffect(() => {
    setMounted(true);
    fetchAutoChatSettings();
  }, [fetchAutoChatSettings]);

  useEffect(() => {
    if (autoChatSettings) {
      setMode(autoChatSettings.mode || 'no-custom');
      if (autoChatSettings.configs) {
        setConfigs((prev) => ({ ...prev, ...autoChatSettings.configs }));
      }
    }
  }, [autoChatSettings]);

  if (!mounted) return null;

  const templatesData: Record<string, string> = {
    "Melamar": "Halo [Nama Kandidat], terima kasih telah melamar posisi [Posisi] di [Nama Perusahaan]. Lamaran Anda telah kami terima dan sedang dalam proses peninjauan oleh tim HRD.",
    "Terseleksi": "Halo [Nama Kandidat], selamat! Profil Anda sesuai dengan kualifikasi kami dan status Anda kini Terseleksi. Kami akan segera menghubungi Anda untuk tahap selanjutnya.",
    "Diterima": "Halo [Nama Kandidat], selamat bergabung! Anda dinyatakan Diterima untuk posisi [Posisi] di [Nama Perusahaan]. Tim kami akan segera mengirimkan informasi lebih lanjut terkait onboarding.",
    "Ditutup": "Halo [Nama Kandidat], terima kasih atas partisipasi Anda. Mohon maaf, saat ini posisi [Posisi] telah Ditutup. Jangan menyerah dan semoga sukses di kesempatan berikutnya!"
  };

  const currentSystemTemplate = templatesData[selectedStatus] || "";
  const currentConfig = configs[selectedStatus] || { isActive: false, customTemplateText: "" };

  const handleConfigChange = (changes: Partial<{ isActive: boolean; customTemplateText: string }>) => {
    setConfigs(prev => ({
      ...prev,
      [selectedStatus]: {
        ...prev[selectedStatus],
        ...changes
      }
    }));
  };

  const handleSave = async () => {
    if (mode === 'custom') {
      const emptyActiveStatus = Object.keys(configs).find(
        status => configs[status].isActive && !configs[status].customTemplateText.trim()
      );
      if (emptyActiveStatus) {
        alert(`Template kustom untuk status "${emptyActiveStatus}" masih kosong! Harap isi terlebih dahulu atau matikan auto-chat untuk status tersebut.`);
        setSelectedStatus(emptyActiveStatus);
        return;
      }
    }
    
    setIsSaving(true);
    try {
      await updateAutoChatSettings({
        mode,
        configs
      });
      alert("Pengaturan Auto Chat berhasil disimpan!");
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-card border border-border/70 rounded-3xl p-6 shadow-md space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Pengaturan Auto Chat</h2>
            <p className="text-xs text-muted-foreground">Kelola pesan otomatis yang akan dikirim saat status lamaran kandidat berubah</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Mode Balasan Otomatis (Global)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode('no-custom')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                mode === 'no-custom'
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border/60 hover:border-primary/40 bg-background/50 text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm">Mode Tanpa Custom</span>
                {mode === 'no-custom' && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <span className="text-[11px] leading-relaxed text-muted-foreground">Menggunakan template balasan standar dari sistem.</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('custom')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                mode === 'custom'
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border/60 hover:border-primary/40 bg-background/50 text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm">Mode Custom</span>
                {mode === 'custom' && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <span className="text-[11px] leading-relaxed text-muted-foreground">Ketik dan sesuaikan sendiri pesan template yang unik.</span>
            </button>
          </div>
        </div>

        {/* Dropdown Status */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Konfigurasi Per Status</label>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/2">
              <CustomSelect
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val)}
                className="h-[42px]"
                options={[
                  { value: "Melamar", label: "Status: Melamar" },
                  { value: "Terseleksi", label: "Status: Terseleksi" },
                  { value: "Diterima", label: "Status: Diterima" },
                  { value: "Ditutup", label: "Status: Ditutup" }
                ]}
              />
            </div>
            
            {/* Toggle On/Off */}
            <button
              type="button"
              onClick={() => handleConfigChange({ isActive: !currentConfig.isActive })}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-colors border w-full md:w-auto min-w-[160px] cursor-pointer ${
                currentConfig.isActive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'bg-muted/50 text-muted-foreground border-border/80 hover:bg-muted'
              }`}
            >
              <Power className="h-4 w-4" />
              {currentConfig.isActive ? 'Auto Chat Aktif' : 'Auto Chat Mati'}
            </button>
          </div>
          
          <div className="bg-muted/20 border border-border/50 p-3 rounded-xl">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <strong>Info:</strong> Pengaturan di bawah ini hanya berlaku untuk status <span className="font-bold text-foreground">&quot;{selectedStatus}&quot;</span>.
              {selectedStatus === "Melamar" && " Pesan akan dikirim otomatis saat kandidat baru melamar."}
              {selectedStatus !== "Melamar" && ` Pesan akan dikirim otomatis saat Anda mengubah status pelamar menjadi ${selectedStatus}.`}
            </p>
          </div>
        </div>

        {/* Editor Area (only shown if active) */}
        <div className={`transition-all duration-300 overflow-hidden ${currentConfig.isActive ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          {/* Mode Tanpa Custom Config */}
          {mode === 'no-custom' && (
            <div className="space-y-4 pt-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Template Bawaan Sistem</label>
              <div className="p-4 rounded-2xl border border-primary/50 bg-primary/5 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">Template Baku ({selectedStatus})</span>
                </div>
                <p className="text-[11px] text-foreground leading-relaxed italic bg-background/80 p-3 rounded-xl border border-border/50">
                  &quot;{currentSystemTemplate}&quot;
                </p>
                <p className="text-[10px] text-muted-foreground mt-3">
                  *Pesan ini akan dikirim secara otomatis tanpa perlu modifikasi. Anda hanya perlu memastikan fiturnya dalam keadaan <strong className="text-foreground">Aktif</strong> di atas.
                </p>
              </div>
            </div>
          )}

          {/* Mode Custom Config */}
          {mode === 'custom' && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Tulis Template Pesan</label>
                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Customizable
                </span>
              </div>
              <textarea
                value={currentConfig.customTemplateText}
                onChange={(e) => handleConfigChange({ customTemplateText: e.target.value })}
                rows={5}
                placeholder={`Contoh: Halo [Nama Kandidat], lamaran Anda dengan status ${selectedStatus}...`}
                className="w-full text-xs font-medium bg-background border border-border/80 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                disabled={!currentConfig.isActive}
              />
              
              {/* Result Preview */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-[11px] text-foreground leading-relaxed">
                <p className="font-bold text-primary mb-2">Result / Pratinjau:</p>
                <p className="italic text-muted-foreground whitespace-pre-wrap">
                  {currentConfig.customTemplateText 
                    ? `"${currentConfig.customTemplateText}"` 
                    : 'Template Anda masih kosong. Silakan tulis sesuatu.'}
                </p>
              </div>

              <div className="bg-muted/40 border border-border/60 rounded-2xl p-3.5 text-[10px] text-muted-foreground leading-relaxed space-y-1">
                <p className="font-bold text-foreground uppercase mb-1">Panduan Penggunaan Placeholders:</p>
                <p>Gunakan tag berikut untuk mengisi data dinamis kandidat secara otomatis:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li><code className="text-primary font-bold">[Nama Kandidat]</code> &rarr; Menampilkan nama pelamar</li>
                  <li><code className="text-primary font-bold">[Posisi]</code> &rarr; Menampilkan nama lowongan pekerjaan</li>
                  <li><code className="text-primary font-bold">[Nama Perusahaan]</code> &rarr; Menampilkan nama perusahaan Anda</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Ringkasan Konfigurasi Semua Status */}
        <div className="pt-6 border-t border-border/50 space-y-4">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Ringkasan Seluruh Status</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(templatesData).map((status) => {
               const configStatus = configs[status] || { isActive: false, customTemplateText: "" };
               const isActive = configStatus.isActive;
               const templateText = mode === 'custom' 
                 ? configStatus.customTemplateText || '(Kosong)' 
                 : templatesData[status];
                 
               return (
                 <div key={status} className={`p-4 rounded-xl border ${isActive ? 'border-primary/40 bg-primary/5' : 'border-border/60 bg-muted/30'} flex flex-col gap-2`}>
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-foreground">{status}</span>
                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                       {isActive ? 'Aktif' : 'Mati'}
                     </span>
                   </div>
                   <p className="text-[11px] text-muted-foreground italic line-clamp-3">
                     &quot;{templateText}&quot;
                   </p>
                 </div>
               );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-border pt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 font-semibold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSettingTab;
