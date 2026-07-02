import React, { useState } from 'react';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { LuPlus as Plus, LuTrash2 as Trash2, LuPen as Edit, LuUsers as Users } from 'react-icons/lu';

const MultiUserTab: React.FC = () => {
  const { hrdAccounts, employerJobs, addHrdAccount, updateHrdAccount, deleteHrdAccount } = useAppStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    assignedJobIds: [] as string[]
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '', assignedJobIds: [] });
    setEditingId(null);
    setIsChangingPassword(false);
  };

  const handleOpenModal = (hrd?: any) => {
    if (hrd) {
      setFormData({
        name: hrd.name,
        email: hrd.email,
        password: hrd.password || '',
        confirmPassword: hrd.password || '',
        assignedJobIds: hrd.assignedJobIds || []
      });
      setEditingId(hrd.id);
      setIsChangingPassword(false);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert("Nama dan Email wajib diisi!");
      return;
    }
    if ((!editingId || isChangingPassword) && formData.password !== formData.confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }
    if ((!editingId || isChangingPassword) && formData.password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }

    const dataToSave = {
      name: formData.name,
      email: formData.email,
      assignedJobIds: formData.assignedJobIds,
      ...( (!editingId || isChangingPassword) ? { password: formData.password } : {} )
    };

    if (editingId) {
      updateHrdAccount(editingId, dataToSave);
    } else {
      addHrdAccount(dataToSave as any);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleVerifyOtp = () => {
    if (otpInput === '123456') {
      setIsOtpModalOpen(false);
      setIsChangingPassword(true);
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      setOtpInput('');
    } else {
      alert("Kode OTP salah! (Gunakan 123456 untuk simulasi)");
    }
  };

  const toggleJobAccess = (jobId: string) => {
    setFormData(prev => {
      const isSelected = prev.assignedJobIds.includes(jobId);
      if (isSelected) {
        return { ...prev, assignedJobIds: prev.assignedJobIds.filter(id => id !== jobId) };
      } else {
        return { ...prev, assignedJobIds: [...prev.assignedJobIds, jobId] };
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Multi User (HRD)</h2>
          <p className="text-muted-foreground text-sm mt-1">Kelola akses akun HRD untuk perusahaan Anda.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 rounded-xl">
          <Plus className="h-4 w-4" /> Tambah HRD
        </Button>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border/60">
              <tr>
                <th className="px-6 py-4 font-bold">Nama HRD</th>
                <th className="px-6 py-4 font-bold">Email (Login)</th>
                <th className="px-6 py-4 font-bold">Akses Lowongan</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {hrdAccounts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Belum ada akun HRD.
                  </td>
                </tr>
              ) : (
                hrdAccounts.map((hrd) => (
                  <tr key={hrd.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{hrd.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{hrd.email}</td>
                    <td className="px-6 py-4 text-primary font-semibold">
                      {hrd.assignedJobIds.length} Lowongan
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(hrd)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => {
                          if (confirm(`Hapus akun HRD ${hrd.name}?`)) {
                            deleteHrdAccount(hrd.id);
                          }
                        }} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Akun HRD' : 'Tambah Akun HRD'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">✕</button>
            </div>
            
            <div className="overflow-y-auto pr-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1.5">Nama</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border/80 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Nama lengkap" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1.5">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-background border border-border/80 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="email@perusahaan.com" />
                </div>
              </div>

              {!editingId || isChangingPassword ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground block mb-1.5">Password</label>
                    <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-background border border-border/80 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Masukkan password" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground block mb-1.5">Konfirmasi Password</label>
                    <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-background border border-border/80 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Ulangi password" />
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex items-center justify-between bg-muted/30 p-4 rounded-xl border border-border/60">
                  <div>
                    <p className="text-sm font-bold text-foreground">Password Terenkripsi</p>
                    <p className="text-xs text-muted-foreground mt-0.5">******</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsOtpModalOpen(true)} className="rounded-xl">
                    Ganti Password
                  </Button>
                </div>
              )}

              <div className="pt-2">
                <label className="text-xs font-bold text-muted-foreground block mb-2">Akses Lowongan</label>
                <div className="border border-border/60 rounded-xl p-4 bg-muted/20 space-y-3 max-h-[300px] overflow-y-auto">
                  {employerJobs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Tidak ada lowongan aktif.</p>
                  ) : (
                    employerJobs.map((job, index) => (
                      <label key={job.id} className="flex items-start gap-3 cursor-pointer p-2 hover:bg-background rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={formData.assignedJobIds.includes(job.id)}
                          onChange={() => toggleJobAccess(job.id)}
                        />
                        <div>
                          <p className="font-bold text-sm text-foreground">{index + 1}. {job.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{job.id} • {job.location}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Batal</Button>
              <Button onClick={handleSave} className="rounded-xl">Simpan Akun</Button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col text-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">✓</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Verifikasi Email</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Kami telah mengirimkan 6-digit kode verifikasi ke email Admin Anda. Masukkan kode tersebut untuk melanjutkan (Simulasi: 123456).
            </p>
            
            <input 
              type="text" 
              maxLength={6}
              value={otpInput} 
              onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))} 
              className="w-full bg-background border border-border/80 rounded-xl p-3 text-center text-xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-primary mb-6" 
              placeholder="••••••" 
            />
            
            <div className="flex justify-between gap-3">
              <Button variant="ghost" onClick={() => { setIsOtpModalOpen(false); setOtpInput(''); }} className="w-full rounded-xl">Batal</Button>
              <Button onClick={handleVerifyOtp} className="w-full rounded-xl">Verifikasi</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiUserTab;
