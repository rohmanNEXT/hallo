'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Checkbox from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import CustomSelect from '@/components/ui/select-custom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  LuBriefcase as Briefcase,
  LuPlus as Plus,
  LuShieldAlert as ShieldAlert,
  LuSearch as Search,
  LuX as X,
  LuBuilding2 as Building2,
  LuInfo as Info,
  LuChevronUp as ChevronUp,
  LuChevronDown as ChevronDown,
  LuTrash2 as Trash2,
  LuRotateCcw as RotateCcw,
  LuSave as Save,
  LuPencil as EditIcon,
  LuGripVertical as GripVertical,
  LuMailWarning as MailWarning,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuCheck as Check,
  LuCircleCheck as CheckCircle,
  LuTriangleAlert as AlertTriangle,
  LuEye as Eye,
  LuUser as User,
  LuFileText as FileText,
  LuLink as Link,
  LuRocket as Rocket,
} from 'react-icons/lu';
import provincesData from '@/lib/indonesia-regions.json';
import { ProvinceData } from '@/lib/types';
import Image from 'next/image';

const PROVINCES = provincesData as ProvinceData[];

const AVAILABLE_SKILLS = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Node.js',
  'Express',
  'Prisma',
  'PostgreSQL',
  'Flutter',
  'React Native',
  'UI/UX Design',
  'Golang',
  'Python',
  'DevOps',
  'Laravel',
  'PHP',
  'Vue.js',
  'Angular',
];

const AVAILABLE_BENEFITS = [
  'Asuransi Kesehatan',
  'Laptop Perusahaan',
  'Bonus Tahunan',
  'Jam Kerja Fleksibel',
  'Kantin Gratis',
  'Opsi Kerja Hybrid',
  'Tunjangan Transportasi',
  'Pelatihan & Sertifikasi',
  'Keanggotaan Gym',
  'WFA (Work From Anywhere)',
  'Tunjangan Hari Raya (THR)',
  'Parkir Gratis',
];

interface LowonganTabProps {
  updateTabInUrl: (tab: string) => void;
}

const LowonganTab: React.FC<LowonganTabProps> = ({ updateTabInUrl }) => {
  const {
    user,
    employerJobs,
    addEmployerJob,
    updateEmployerJobStatus,
    verifyCompany,
    editEmployerJob,
    softDeleteEmployerJob,
    restoreEmployerJob,
    hardDeleteEmployerJob,
    verifyEmail,
  } = useAppStore();

  const isVerified = user?.companyVerification?.verified || false;
  const isEmailVerified = user?.emailVerified || false;

  // Local state variables for filtering/searching
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [selectedJobStatuses, setSelectedJobStatuses] = useState<string[]>([
    'Aktif',
    'Nonaktif',
  ]);
  const [isJobStatusOpen, setIsJobStatusOpen] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'semua' | 'trash'>('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Trash Filter States
  const [trashStatusFilter, setTrashStatusFilter] = useState<
    'semua' | 'aktif' | 'nonaktif'
  >('semua');
  const [trashDeletedAtFilter, setTrashDeletedAtFilter] = useState<
    'semua' | '7' | '20' | '30' | '60'
  >('semua');
  const [trashSortOrder, setTrashSortOrder] = useState<
    'terbaru' | 'terlama' | 'az' | 'za'
  >('terbaru');

  // Dropdown open states
  const [isTrashStatusOpen, setIsTrashStatusOpen] = useState(false);
  const [isTrashDeletedAtOpen, setIsTrashDeletedAtOpen] = useState(false);
  const [isTrashSortOpen, setIsTrashSortOpen] = useState(false);

  const handleResetTrashFilters = () => {
    setTrashStatusFilter('semua');
    setTrashDeletedAtFilter('semua');
    setTrashSortOrder('terbaru');
    setIsTrashStatusOpen(false);
    setIsTrashDeletedAtOpen(false);
    setIsTrashSortOpen(false);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    jobSearchQuery,
    selectedJobStatuses,
    activeSubTab,
    trashStatusFilter,
    trashDeletedAtFilter,
    trashSortOrder,
  ]);

  // Job Posting State
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showVerifyPromptModal, setShowVerifyPromptModal] = useState(false);
  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'post' | 'delete';
    id?: string;
    data?: any;
  } | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobWorkType, setJobWorkType] = useState('On-site');

  // Screening Questions State
  const requiredQuestions = [
    {
      id: 'req-photo',
      question: 'Upload Foto Profil',
      type: 'file_upload',
      isRequired: true,
      isBuiltin: true,
    },
    {
      id: 'req-resume',
      question: 'Upload Resume / Curriculum Vitae',
      type: 'file_upload',
      isRequired: true,
      isBuiltin: true,
    },
  ];

  const [customQuestions, setCustomQuestions] = useState<any[]>([]);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const reordered = [...customQuestions];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    setCustomQuestions(reordered);
    setDraggedIndex(null);
  };

  const addCustomQuestion = () => {
    setCustomQuestions((prev) => [
      ...prev,
      {
        id: 'cq-' + Date.now(),
        question: '',
        type: 'long_input',
        options: [],
      },
    ]);
  };

  const addQuestionFromTemplate = (template: any) => {
    setCustomQuestions((prev) => [
      ...prev,
      {
        id: 'cq-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        question: template.question,
        type: template.type,
        options: template.options ? [...template.options] : [],
      },
    ]);
  };

  const updateQuestion = (id: string, updates: Partial<any>) => {
    setCustomQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const updated = { ...q, ...updates };

        // Preset default options based on selected type
        if (updates.type) {
          if (updates.type === 'yes_no') {
            updated.options = ['Ya', 'Tidak'];
          } else if (updates.type === 'proficiency_level') {
            updated.options = [
              'Tidak Berpengalaman',
              'Dasar',
              'Menengah',
              'Mahir',
              'Ahli',
            ];
          } else if (
            (updates.type === 'radio' || updates.type === 'checkbox') &&
            (!q.options || q.options.length === 0)
          ) {
            updated.options = ['Opsi 1', 'Opsi 2'];
          } else if (
            updates.type === 'skill_list' &&
            (!q.options || q.options.length === 0)
          ) {
            updated.options = ['Flutter', 'JavaScript'];
          } else if (
            updates.type === 'language_list' &&
            (!q.options || q.options.length === 0)
          ) {
            updated.options = ['Bahasa Inggris'];
          }
        }
        return updated;
      }),
    );
  };

  const deleteQuestion = (id: string) => {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const addOptionToQuestion = (qId: string) => {
    setCustomQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: [...(q.options || []), ''],
        };
      }),
    );
  };

  const updateOptionInQuestion = (qId: string, optIdx: number, val: string) => {
    setCustomQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const newOpts = [...(q.options || [])];
        newOpts[optIdx] = val;
        return {
          ...q,
          options: newOpts,
        };
      }),
    );
  };

  const deleteOptionFromQuestion = (qId: string, optIdx: number) => {
    setCustomQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: (q.options || []).filter(
            (_: string, idx: number) => idx !== optIdx,
          ),
        };
      }),
    );
  };

  const questionTemplates = [
    {
      name: 'Flutter & JS (Keahlian)',
      question: 'Seberapa mahir Anda dalam keahlian berikut?',
      type: 'skill_list',
      options: ['Flutter', 'JavaScript'],
    },
    {
      name: 'Pengalaman Full Stack',
      question: 'Berapa lama pengalaman Anda sebagai Full Stack Developer?',
      type: 'radio',
      options: [
        'Tidak Berpengalaman',
        'Kurang dari 1 Tahun',
        '1–3 Tahun',
        '3–5 Tahun',
        '5–10 Tahun',
        'Lebih dari 10 Tahun',
      ],
    },
    {
      name: 'Bahasa Inggris',
      question: 'Seberapa mahir Anda dalam bahasa berikut?',
      type: 'skill_list',
      options: ['Bahasa Inggris'],
    },
    {
      name: 'Tantangan Frontend',
      question:
        'Sebutkan salah satu tantangan paling kompleks yang pernah Anda hadapi dalam pengembangan frontend dan bagaimana Anda mengatasinya.',
      type: 'long_input',
    },
    {
      name: 'Domisili Surabaya',
      question: 'Apakah Anda saat ini berdomisili di Surabaya?',
      type: 'yes_no',
    },
    {
      name: 'Domisili Lengkap',
      question: 'Beberapa HRD ingin tau di mana kamu tinggal saat ini',
      type: 'district_selector',
    },
    {
      name: 'Availability',
      question: 'Kapan Anda dapat mulai bekerja?',
      type: 'radio',
      options: [
        'Secepatnya',
        'Dalam 2 Minggu',
        'Dalam 1 Bulan',
        'Dalam 2 Bulan',
      ],
    },
  ];

  // Toast state
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const showToast = (
    text: string,
    type: 'success' | 'error' | 'info' = 'success',
  ) => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Custom Delete Confirm State
  const [isDraftSave, setIsDraftSave] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [previewProvinceOpenId, setPreviewProvinceOpenId] = useState<
    string | null
  >(null);
  const [previewRegencyOpenId, setPreviewRegencyOpenId] = useState<
    string | null
  >(null);
  const [previewProvinceSearch, setPreviewProvinceSearch] = useState('');
  const [previewRegencySearch, setPreviewRegencySearch] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPremiumJob, setIsPremiumJob] = useState(false);
  const [salaryType, setSalaryType] = useState<'fixed' | 'range'>('fixed');
  const [skillInput, setSkillInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');
  const [isBenefitDropdownOpen, setIsBenefitDropdownOpen] = useState(false);
  const [benefitSearch, setBenefitSearch] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({});

  // Formik hook setup
  const formik = useFormik({
    initialValues: {
      title: '',
      location: '',
      workType: 'Penuh Waktu',
      workLocationType: 'On-site',
      salaryMin: '',
      salaryMax: '',
      description: '',
      skills: '',
      benefits: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Judul pekerjaan wajib diisi')
        .min(3, 'Minimal 3 karakter'),
      location: Yup.string().required('Lokasi pekerjaan wajib diisi'),
      workType: Yup.string().required('Tipe kerja wajib diisi'),
      workLocationType: Yup.string().required('Tipe pekerjaan wajib diisi'),
      salaryMin: Yup.number()
        .typeError('Gaji minimum harus berupa angka')
        .required('Gaji minimum wajib diisi')
        .positive('Gaji harus angka positif')
        .integer('Gaji harus berupa bilangan bulat'),
      salaryMax: Yup.number()
        .typeError('Gaji maksimum harus berupa angka')
        .positive('Gaji harus angka positif')
        .integer('Gaji harus berupa bilangan bulat')
        .moreThan(
          Yup.ref('salaryMin'),
          'Gaji maksimum harus lebih tinggi dari gaji minimum',
        )
        .nullable(),
      description: Yup.string()
        .required('Deskripsi pekerjaan wajib diisi')
        .min(10, 'Minimal 10 karakter'),
      skills: Yup.string(),
      benefits: Yup.string(),
    }),
    onSubmit: (values) => {
      if (!isVerified) {
        showToast('Profil perusahaan belum lengkap / terverifikasi!', 'error');
        updateTabInUrl('verifikasi');
        setShowAddJobModal(false);
        return;
      }

      const allScreening = [...requiredQuestions, ...customQuestions];

      const jobData = {
        title: values.title,
        description: values.description,
        salary: Number(values.salaryMin),
        salaryMin: Number(values.salaryMin),
        salaryMax:
          salaryType === 'range' && values.salaryMax
            ? Number(values.salaryMax)
            : undefined,
        badge: isPremiumJob
          ? 'premium company'
          : isUrgent
            ? 'urgent hiring'
            : '',
        status: editingJobId
          ? isDraftSave
            ? 'nonaktif'
            : employerJobs.find((j) => j.id === editingJobId)?.status || 'aktif'
          : isDraftSave
            ? 'nonaktif'
            : 'aktif',
        requirements: values.skills || undefined,
        location: values.location,
        workLocationType: values.workLocationType,
        workType: values.workType,
        screeningQuestions: allScreening,
      };

      if (!isEmailVerified) {
        setPendingAction({ type: 'post', data: jobData });
        setShowEmailVerifyModal(true);
        return;
      }

      if (editingJobId) {
        editEmployerJob(editingJobId, jobData);
        showToast(
          isDraftSave
            ? 'Draf lowongan pekerjaan berhasil diperbarui!'
            : 'Lowongan pekerjaan berhasil diperbarui!',
          'success',
        );
      } else {
        addEmployerJob(jobData);
        showToast(
          isDraftSave
            ? 'Lowongan pekerjaan berhasil disimpan sebagai draf!'
            : 'Lowongan pekerjaan baru berhasil dipublikasikan!',
          'success',
        );
      }

      formik.resetForm();
      setIsUrgent(false);
      setIsPremiumJob(false);
      setShowAddJobModal(false);
      setEditingJobId(null);
      setModalStep(1);
      setCustomQuestions([]);
      setIsDraftSave(false);
    },
  });

  // Company Verification Formik
  const companyFormik = useFormik({
    initialValues: {
      brandName: user?.companyVerification?.brandName || user?.name || '',
      legalName: user?.companyVerification?.name || '',
      industry: user?.companyVerification?.industry || 'Teknologi & Informasi',
      employeeCount:
        user?.companyVerification?.employeeCount || '11-50 Pegawai',
      website: user?.companyVerification?.website || '',
      description: user?.companyVerification?.description || '',
      nib: user?.companyVerification?.nib || '',
      waNumber: user?.companyVerification?.waNumber || '',
      logo: user?.companyVerification?.logoUrl || '',
    },
    validationSchema: Yup.object({
      brandName: Yup.string().required('Nama Brand wajib diisi'),
      legalName: Yup.string(),
      industry: Yup.string().required('Industri wajib diisi'),
      employeeCount: Yup.string().required('Jumlah pegawai wajib diisi'),
      website: Yup.string(),
      description: Yup.string()
        .required('Deskripsi wajib diisi')
        .min(75, 'Deskripsi minimal 75 karakter'),
      nib: Yup.string(),
      waNumber: Yup.string(),
      logo: Yup.string(),
    }),
    onSubmit: (values) => {
      verifyCompany({
        brandName: values.brandName,
        name: values.legalName || values.brandName,
        industry: values.industry,
        employeeCount: values.employeeCount,
        website: values.website,
        description: values.description,
        nib: values.nib || 'NIB-12345678',
        waNumber: values.waNumber,
        logo: values.logo || '',
      });

      setShowVerifyPromptModal(false);
      setShowAddJobModal(true);
      showToast(
        'Profil perusahaan berhasil dilengkapi dan diverifikasi!',
        'success',
      );
    },
  });

  const getDaysLeftInTrash = (deletedAt?: string) => {
    if (!deletedAt) return 30;
    const deletedDate = new Date(deletedAt);
    const expireDate = new Date(
      deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000,
    );
    const diffTime = expireDate.getTime() - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const totalJobsCount = employerJobs.filter(
    (j) => j.status !== 'trash',
  ).length;
  const activeJobsCount = employerJobs.filter(
    (j) => j.status === 'aktif',
  ).length;
  const nonActiveJobsCount = employerJobs.filter(
    (j) => j.status === 'nonaktif',
  ).length;
  const trashJobsCount = employerJobs.filter(
    (j) => j.status === 'trash',
  ).length;

  const statusMap: Record<string, string> = {
    aktif: 'Aktif',
    nonaktif: 'Nonaktif',
    'in review': 'In Review',
    ditolak: 'Ditolak',
    trash: 'Trash',
  };

  const filteredJobs = employerJobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(jobSearchQuery.toLowerCase());

    if (activeSubTab === 'trash') {
      if (job.status !== 'trash') return false;
      if (!matchesSearch) return false;

      // Filter by Original Status
      const originalStatus =
        job.originalStatus ||
        (parseInt(job.id.replace(/\D/g, '')) % 2 === 0 ? 'aktif' : 'nonaktif');
      if (trashStatusFilter !== 'semua' && originalStatus !== trashStatusFilter)
        return false;

      // Filter by Deleted At
      if (trashDeletedAtFilter !== 'semua' && job.deletedAt) {
        const deletedTime = new Date(job.deletedAt).getTime();
        const daysAgo = (Date.now() - deletedTime) / (1000 * 60 * 60 * 24);
        const limit = parseInt(trashDeletedAtFilter);
        if (daysAgo > limit) return false;
      }

      return true;
    }

    if (job.status === 'trash') return false;

    const uiStatus = statusMap[job.status?.toLowerCase()] ?? 'Nonaktif';
    const matchesStatus = selectedJobStatuses.includes(uiStatus);

    return matchesSearch && matchesStatus;
  });

  // Sort trash items if activeSubTab is trash
  if (activeSubTab === 'trash') {
    filteredJobs.sort((a, b) => {
      if (trashSortOrder === 'terbaru') {
        return (
          new Date(b.deletedAt || 0).getTime() -
          new Date(a.deletedAt || 0).getTime()
        );
      }
      if (trashSortOrder === 'terlama') {
        return (
          new Date(a.deletedAt || 0).getTime() -
          new Date(b.deletedAt || 0).getTime()
        );
      }
      if (trashSortOrder === 'az') {
        return a.title.localeCompare(b.title);
      }
      if (trashSortOrder === 'za') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/80 shadow-sm bg-card text-card-foreground">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Total Lowongan
              </p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {totalJobsCount}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-sm bg-card text-card-foreground">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Lowongan Aktif
              </p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {activeJobsCount}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-sm bg-card text-card-foreground">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Lowongan Nonaktif
              </p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {nonActiveJobsCount}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveSubTab('semua')}
          className={`pb-3 px-6 font-bold text-xs border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'semua'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Semua Lowongan ({totalJobsCount})
        </button>
        <button
          onClick={() => setActiveSubTab('trash')}
          className={`pb-3 px-6 font-bold text-xs border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'trash'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Tempat Sampah ({trashJobsCount})
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar Filter */}
        {activeSubTab === 'semua' && (
          <div className="w-full lg:w-56 bg-card border border-border rounded-2xl shrink-0 shadow-sm overflow-hidden">
            {/* Header Filter */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-border">
              <span className="text-sm font-bold text-foreground">Filter</span>
              <button
                onClick={() => {
                  if (selectedJobStatuses.length < 2) {
                    setSelectedJobStatuses(['Aktif', 'Nonaktif']);
                  } else {
                    setSelectedJobStatuses([]);
                  }
                }}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer bg-transparent border-none p-0 transition-colors"
              >
                {selectedJobStatuses.length < 2 ? 'Reset' : 'Clear'}
              </button>
            </div>

            {/* Status Section */}
            <div className="px-4 py-3">
              <button
                className="w-full flex justify-between items-center mb-3 bg-transparent border-none p-0 cursor-pointer"
                onClick={() => setIsJobStatusOpen(!isJobStatusOpen)}
              >
                <span className="text-sm font-bold text-foreground">
                  Status
                </span>
                {isJobStatusOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {isJobStatusOpen && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {['Aktif', 'Nonaktif', 'In Review', 'Ditolak'].map(
                    (status) => (
                      <Checkbox
                        key={status}
                        checked={selectedJobStatuses.includes(status)}
                        onCheckedChange={(checked) => {
                          const next = checked
                            ? [...selectedJobStatuses, status]
                            : selectedJobStatuses.filter((s) => s !== status);
                          setSelectedJobStatuses(next);
                        }}
                        label={status}
                        className="py-1.5"
                      />
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sidebar Filter Trash */}
        {activeSubTab === 'trash' && (
          <div className="w-full lg:w-56 bg-card border border-border rounded-2xl shrink-0 shadow-sm overflow-hidden p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-sm font-bold text-foreground">Filter</span>
              <button
                onClick={handleResetTrashFilters}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer bg-transparent border-none p-0 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Dihapus Pada Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">
                Dihapus Pada
              </label>
              <CustomSelect
                value={trashDeletedAtFilter}
                onChange={(val) => setTrashDeletedAtFilter(val as any)}
                options={[
                  { value: 'semua', label: 'Semua' },
                  { value: '7', label: '7 Hari Terakhir' },
                  { value: '20', label: '20 Hari Terakhir' },
                  { value: '30', label: '30 Hari Terakhir' },
                  { value: '60', label: '60 Hari Terakhir' },
                ]}
              />
            </div>

            {/* Urutkan Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">
                Urutkan
              </label>
              <CustomSelect
                value={trashSortOrder}
                onChange={(val) => setTrashSortOrder(val as any)}
                options={[
                  { value: 'terbaru', label: 'Terbaru Dihapus' },
                  { value: 'terlama', label: 'Terlama Dihapus' },
                  { value: 'az', label: 'Judul A-Z' },
                  { value: 'za', label: 'Judul Z-A' },
                ]}
              />
            </div>
          </div>
        )}

        <div className="flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari judul loker"
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-10 text-xs rounded-xl bg-background border-border text-foreground"
              />
              {jobSearchQuery && (
                <button
                  onClick={() => setJobSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {activeSubTab === 'semua' && (
                <Button
                  onClick={() => {
                    if (!isVerified) {
                      setShowVerifyPromptModal(true);
                    } else {
                      setEditingJobId(null);
                      formik.resetForm();
                      setIsUrgent(false);
                      setIsPremiumJob(false);
                      setSalaryType('fixed');
                      setModalStep(1);
                      setCustomQuestions([]);
                      setShowAddJobModal(true);
                    }
                  }}
                  className="font-bold text-xs h-10 gap-1.5 shadow-sm rounded-xl cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Pasang Lowongan</span>
                </Button>
              )}
            </div>
          </div>

          {!isVerified ? (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Profil Perusahaan Belum Lengkap
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                Lengkapi profil perusahaan sebelum memasang lowongan pekerjaan.
              </p>
              <Button
                onClick={() => setShowVerifyPromptModal(true)}
                className="border border-primary text-primary hover:bg-primary/10 bg-transparent rounded-xl px-6 font-bold text-xs h-10 shadow-sm transition-colors cursor-pointer"
              >
                Lengkapi Profil
              </Button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <h4 className="font-bold text-xs text-muted-foreground uppercase">
                Tidak Ada Lowongan
              </h4>
              <p className="text-[12px] text-muted-foreground mt-1">
                Belum ada lowongan pekerjaan yang cocok dengan filter Anda.
              </p>
            </div>
          ) : (
            <>
              <div className="h-[1380px] overflow-y-auto pr-2 pb-4 scroll-smooth">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {paginatedJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="border border-border shadow-sm hover:border-border/80 transition-all rounded-2xl overflow-hidden bg-card text-card-foreground h-[210px] flex flex-col justify-between"
                    >
                      <div className="p-4 flex flex-col justify-between h-full gap-2">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="font-extrabold text-xs text-foreground uppercase truncate max-w-[160px]">
                                {filteredJobs.findIndex(j => j.id === job.id) + 1}. {job.title}
                              </h4>
                              <div className="flex flex-wrap gap-1 items-center mt-0.5 text-[10px] text-muted-foreground font-semibold">
                                <span>
                                  {job.location || 'Jakarta, Indonesia'}
                                </span>
                                <span>•</span>
                                <span>{job.workLocationType || 'On-site'}</span>
                                <span>•</span>
                                <span>{job.date || 'Baru saja'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {job.badge && (
                                <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/15 border-none font-bold text-[10px] px-1.5 uppercase rounded-full">
                                  {job.badge}
                                </Badge>
                              )}
                              <Badge
                                className={`border-none font-bold text-[10px] px-1.5 uppercase rounded-full ${
                                  job.status === 'aktif'
                                    ? 'bg-emerald-500/15 text-emerald-600'
                                    : job.status === 'nonaktif'
                                      ? 'bg-amber-500/15 text-amber-600'
                                      : job.status === 'trash'
                                        ? 'bg-rose-500/15 text-rose-600'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {statusMap[job.status?.toLowerCase()] ||
                                  job.status}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-[12px] text-muted-foreground mt-2 font-medium leading-relaxed line-clamp-2">
                            {job.description}
                          </p>

                          {job.status === 'trash' && (
                            <p className="text-[10px] text-rose-500 font-extrabold bg-rose-500/10 rounded-lg px-2 py-0.5 inline-block mt-1">
                              Dihapus: {getDaysLeftInTrash(job.deletedAt)} hari
                              tersisa sebelum dihapus permanen
                            </p>
                          )}

                          {job.requirements && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-secondary/60 border border-border/80 text-secondary-foreground font-bold truncate max-w-[180px]">
                                {job.requirements}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-border pt-2 mt-auto">
                          <span className="text-[12px] font-black text-emerald-600">
                            {job.salaryMin && job.salaryMax
                              ? `Rp ${job.salaryMin.toLocaleString('id-ID')} - ${job.salaryMax.toLocaleString('id-ID')}`
                              : `Rp ${(job.salaryMin || job.salary || 0).toLocaleString('id-ID')}`}{' '}
                            / bln
                          </span>

                          <div className="flex items-center gap-2">
                            {job.status === 'trash' ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-[10px] font-bold h-7 px-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 cursor-pointer flex items-center gap-1"
                                  onClick={() => {
                                    restoreEmployerJob(job.id);
                                    showToast(
                                      'Lowongan berhasil dipulihkan ke Nonaktif!',
                                      'success',
                                    );
                                  }}
                                >
                                  <RotateCcw className="h-3 w-3" />
                                  Pulihkan
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-[10px] font-bold h-7 px-2 border-rose-500/30 text-rose-600 hover:bg-rose-500/10 cursor-pointer flex items-center gap-1"
                                  onClick={() => {
                                    setConfirmDeleteId(job.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Permanen
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-[10px] font-bold h-7 px-2 border-border hover:bg-muted cursor-pointer flex items-center gap-1"
                                  onClick={() => {
                                    setEditingJobId(job.id);
                                    formik.setValues({
                                      title: job.title || '',
                                      location: job.location || '',
                                      workType: job.workType || 'Penuh Waktu',
                                      workLocationType:
                                        job.workLocationType || 'On-site',
                                      salaryMin: String(
                                        job.salaryMin || job.salary || '',
                                      ),
                                      salaryMax: String(job.salaryMax || ''),
                                      description: job.description || '',
                                      skills: job.requirements
                                        ? job.requirements
                                            .split(',')
                                            .map((s: string) => s.trim())
                                            .filter(
                                              (s: string) =>
                                                !s
                                                  .toLowerCase()
                                                  .startsWith('work type') &&
                                                !s
                                                  .toLowerCase()
                                                  .startsWith('min experience'),
                                            )
                                            .join(', ')
                                        : '',
                                      benefits: job.benefits || '',
                                    });
                                    setIsUrgent(job.badge === 'urgent hiring');
                                    setIsPremiumJob(
                                      job.badge === 'premium company',
                                    );
                                    setSalaryType(
                                      job.salaryMax ? 'range' : 'fixed',
                                    );

                                    // Load screening questions
                                    const jobQuestions =
                                      job.screeningQuestions || [];
                                    const customs = jobQuestions.filter(
                                      (q: any) =>
                                        q.id !== 'req-photo' &&
                                        q.id !== 'req-resume',
                                    );
                                    setCustomQuestions(customs);

                                    setModalStep(1);
                                    setShowAddJobModal(true);
                                  }}
                                >
                                  <EditIcon className="h-3 w-3" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`text-[10px] font-bold h-7 px-2 border cursor-pointer ${
                                    job.status === 'aktif'
                                      ? 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10'
                                      : 'border-amber-500/30 text-amber-600 hover:bg-amber-500/10'
                                  }`}
                                  onClick={() => {
                                    const newStatus =
                                      job.status === 'aktif'
                                        ? 'nonaktif'
                                        : 'aktif';
                                    updateEmployerJobStatus(job.id, newStatus);
                                    showToast(
                                      `Status lowongan berhasil diubah menjadi ${newStatus === 'aktif' ? 'Aktif' : 'Nonaktif'}!`,
                                      'success',
                                    );
                                  }}
                                >
                                  {job.status === 'aktif'
                                    ? 'Aktif'
                                    : 'Nonaktif'}
                                </Button>
                                <button
                                  onClick={() => {
                                    if (!isEmailVerified) {
                                      setPendingAction({
                                        type: 'delete',
                                        id: job.id,
                                      });
                                      setShowEmailVerifyModal(true);
                                    } else {
                                      softDeleteEmployerJob(job.id);
                                      showToast(
                                        'Lowongan dipindahkan ke Tempat Sampah.',
                                        'success',
                                      );
                                    }
                                  }}
                                  className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer border-none bg-transparent"
                                  title="Pindahkan ke Tempat Sampah"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages >= 1 && (
                <div className="flex justify-center items-center gap-4 mt-6 pt-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>

                    <div className="flex items-center gap-1">
                      {(() => {
                        const renderedElements: React.ReactNode[] = [];
                        const renderButton = (pageNum: number) => {
                          const isCurrent = currentPage === pageNum;
                          return (
                            <Button
                              key={pageNum}
                              variant="outline"
                              className="h-9 w-9 text-xs font-bold transition-all rounded-lg cursor-pointer shadow-sm"
                              style={
                                isCurrent
                                  ? {
                                      backgroundColor: 'hsl(var(--foreground))',
                                      color: 'hsl(var(--background))',
                                      borderColor: 'hsl(var(--foreground))',
                                    }
                                  : { color: 'hsl(var(--foreground))' }
                              }
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        };

                        const renderDots = (key: string) => (
                          <span key={key} className="px-1.5 text-muted-foreground font-bold text-sm select-none">
                            ...
                          </span>
                        );

                        if (totalPages <= 3) {
                          for (let i = 1; i <= totalPages; i++) {
                            renderedElements.push(renderButton(i));
                          }
                        } else {
                          if (currentPage < 4) {
                            renderedElements.push(renderButton(1));
                            renderedElements.push(renderButton(2));
                            renderedElements.push(renderButton(3));
                            renderedElements.push(renderDots('dots-right'));
                          } else {
                            renderedElements.push(renderDots('dots-left'));
                            renderedElements.push(renderButton(totalPages - 2));
                            renderedElements.push(renderButton(totalPages - 1));
                            renderedElements.push(renderButton(totalPages));
                          }
                        }
                        return renderedElements;
                      })()}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1 px-3 border border-border/60 hover:bg-accent hover:text-accent-foreground text-xs font-semibold cursor-pointer disabled:opacity-50"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2">
          <div
            className="absolute inset-0"
            onClick={() => {
              setShowAddJobModal(false);
              setEditingJobId(null);
              formik.resetForm();
              setIsUrgent(false);
              setIsPremiumJob(false);
              setModalStep(1);
            }}
          />
          <Card className="relative w-full max-w-4xl h-[93vh] bg-card border border-border rounded-3xl shadow-2xl p-6 md:p-7 z-10 flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="shrink-0 pb-3">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-sm font-black uppercase text-foreground">
                  {editingJobId
                    ? 'Edit Lowongan Kerja'
                    : 'Pasang Lowongan Pekerjaan Baru'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddJobModal(false);
                    setEditingJobId(null);
                    formik.resetForm();
                    setIsUrgent(false);
                    setIsPremiumJob(false);
                    setModalStep(1);
                    setCustomQuestions([]);
                    setIsDraftSave(false);
                  }}
                  className="p-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/40 hover:bg-zinc-800/70 text-muted-foreground hover:text-foreground transition-all cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 w-full max-w-xl bg-zinc-800/25 p-1 rounded-xl border border-border/40">
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 ${
                    modalStep === 1
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span
                    className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                      modalStep === 1
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    1
                  </span>
                  <span className="text-[10px] font-bold">Informasi Dasar</span>
                </div>

                <div className="flex-1 h-0.5 bg-border/40 rounded-full overflow-hidden mx-0.5">
                  <div
                    className={`h-full bg-primary transition-all duration-300 ${modalStep >= 2 ? 'w-full' : 'w-0'}`}
                  />
                </div>

                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 ${
                    modalStep === 2
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                      : modalStep > 2
                        ? 'text-primary/80'
                        : 'text-muted-foreground'
                  }`}
                >
                  <span
                    className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                      modalStep === 2
                        ? 'bg-primary text-white'
                        : modalStep > 2
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    2
                  </span>
                  <span className="text-[10px] font-bold">Detail Lowongan</span>
                </div>

                <div className="flex-1 h-0.5 bg-border/40 rounded-full overflow-hidden mx-0.5">
                  <div
                    className={`h-full bg-primary transition-all duration-300 ${modalStep === 3 ? 'w-full' : 'w-0'}`}
                  />
                </div>

                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 ${
                    modalStep === 3
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span
                    className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                      modalStep === 3
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    3
                  </span>
                  <span className="text-[10px] font-bold">
                    Pertanyaan Screening
                  </span>
                </div>
              </div>
            </div>

            {/* Form & Content */}
            <form
              onSubmit={formik.handleSubmit}
              className="flex-1 flex flex-col justify-between overflow-hidden mt-3"
            >
              <div className="flex-1 overflow-y-auto pr-2 smooth-scroll space-y-4 pb-4">
                {!isVerified && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[12px] font-bold flex gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      Perhatian: Profil perusahaan belum lengkap. Selesaikan
                      verifikasi sebelum mempublish lowongan ini!
                    </span>
                  </div>
                )}

                {modalStep === 1 ? (
                  /* PAGE 1: Informasi Dasar */
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-foreground/90 mb-2 block">
                        Judul Pekerjaan
                      </label>
                      <Input
                        placeholder="e.g. Lead Frontend React Developer"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="rounded-xl font-medium bg-secondary/20 border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-primary/80"
                      />
                      {formik.touched.title && formik.errors.title && (
                        <div className="text-rose-500 text-xs font-bold mt-0.5">
                          {formik.errors.title}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-foreground/90 mb-2 block">
                        Lokasi Pekerjaan
                      </label>
                      <Input
                        placeholder="e.g. Jakarta, Indonesia atau Remote"
                        name="location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="rounded-xl font-medium bg-secondary/20 border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-primary/80"
                      />
                      {formik.touched.location && formik.errors.location && (
                        <div className="text-rose-500 text-xs font-bold mt-0.5">
                          {formik.errors.location}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-foreground/90 mb-2 block">
                        Tipe Kerja
                      </label>
                      <div className="flex flex-wrap gap-3.5 mt-1">
                        {[
                          'Penuh Waktu',
                          'Kontrak',
                          'Magang',
                          'Paruh Waktu',
                          'Freelance',
                        ].map((type) => {
                          const isSelected = formik.values.workType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() =>
                                formik.setFieldValue('workType', type)
                              }
                              className={`py-1.5 px-3 text-[12px] rounded-full transition-all cursor-pointer text-center truncate border shadow-none ${
                                isSelected
                                  ? 'bg-[#2d3d3a] border-[#445b56] text-[#e2e8e7] font-bold shadow-none'
                                  : 'bg-zinc-800/40 border-zinc-700/60 hover:bg-zinc-800/70 text-muted-foreground font-normal shadow-none'
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                      {formik.touched.workType && formik.errors.workType && (
                        <div className="text-rose-500 text-xs font-bold mt-0.5">
                          {formik.errors.workType}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-foreground/90 mb-2 block">
                        Tipe Pekerjaan
                      </label>
                      <div className="flex flex-wrap gap-3.5 mt-1">
                        {['On-site', 'Hybrid', 'Remote'].map((type) => {
                          const isSelected =
                            formik.values.workLocationType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() =>
                                formik.setFieldValue('workLocationType', type)
                              }
                              className={`py-1.5 px-3 text-[12px] rounded-full transition-all cursor-pointer border shadow-none ${
                                isSelected
                                  ? 'bg-[#2d3d3a] border-[#445b56] text-[#e2e8e7] font-bold shadow-none'
                                  : 'bg-zinc-800/40 border-zinc-700/60 hover:bg-zinc-800/70 text-muted-foreground font-normal shadow-none'
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                      {formik.touched.workLocationType &&
                        formik.errors.workLocationType && (
                          <div className="text-rose-500 text-xs font-bold mt-0.5">
                            {formik.errors.workLocationType}
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-foreground/90 mb-2 block">
                          Gaji Bulanan
                        </label>
                        <div className="flex bg-zinc-800/40 rounded-xl p-1 border border-zinc-700/60 shadow-none">
                          <button
                            type="button"
                            onClick={() => {
                              setSalaryType('fixed');
                              formik.setFieldValue('salaryMax', '');
                            }}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer shadow-none ${
                              salaryType === 'fixed'
                                ? 'bg-primary text-white shadow-none border-none outline-none'
                                : 'text-muted-foreground hover:text-foreground hover:bg-zinc-800/20 shadow-none'
                            }`}
                          >
                            Gaji Tetap
                          </button>
                          <button
                            type="button"
                            onClick={() => setSalaryType('range')}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer shadow-none ${
                              salaryType === 'range'
                                ? 'bg-primary text-white shadow-none border-none outline-none'
                                : 'text-muted-foreground hover:text-foreground hover:bg-zinc-800/20 shadow-none'
                            }`}
                          >
                            Rentang Gaji
                          </button>
                        </div>
                      </div>

                      {salaryType === 'fixed' ? (
                        <div className="flex flex-col gap-1">
                          <Input
                            type="number"
                            placeholder="e.g. 12000000"
                            name="salaryMin"
                            value={formik.values.salaryMin}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="rounded-xl font-medium bg-secondary/20 border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-primary/80"
                          />
                          {formik.touched.salaryMin &&
                            formik.errors.salaryMin && (
                              <div className="text-rose-500 text-[10px] font-bold mt-0.5">
                                {formik.errors.salaryMin}
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              Minimum
                            </span>
                            <Input
                              type="number"
                              placeholder="e.g. 10000000"
                              name="salaryMin"
                              value={formik.values.salaryMin}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="rounded-xl font-medium bg-secondary/20 border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-primary/80"
                            />
                            {formik.touched.salaryMin &&
                              formik.errors.salaryMin && (
                                <div className="text-rose-500 text-[10px] font-bold mt-0.5">
                                  {formik.errors.salaryMin}
                                </div>
                              )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              Maksimum
                            </span>
                            <Input
                              type="number"
                              placeholder="e.g. 15000000"
                              name="salaryMax"
                              value={formik.values.salaryMax}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="rounded-xl font-medium bg-secondary/20 border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-primary/80"
                            />
                            {formik.touched.salaryMax &&
                              formik.errors.salaryMax && (
                                <div className="text-rose-500 text-[10px] font-bold mt-0.5">
                                  {formik.errors.salaryMax}
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : modalStep === 2 ? (
                  /* PAGE 2: Detail Lowongan */
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-foreground/90 mb-2 block">
                        Deskripsi Pekerjaan
                      </label>
                      <textarea
                        placeholder="Jelaskan peran, tanggung jawab, dan kriteria..."
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full min-h-[300px] border border-border/80 bg-secondary/20 text-foreground rounded-xl p-3 text-xs focus-visible:ring-0 focus-visible:border-primary/80 outline-none font-medium placeholder:text-muted-foreground/60"
                      />
                      {formik.touched.description &&
                        formik.errors.description && (
                          <div className="text-rose-500 text-xs font-bold mt-0.5">
                            {formik.errors.description}
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 relative">
                      <label className="text-xs font-bold text-foreground/90 mb-0 block">
                        Keahlian
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setIsSkillDropdownOpen(!isSkillDropdownOpen)
                          }
                          className="w-full flex justify-between items-center px-3 py-2 border border-border/80 bg-secondary/20 text-muted-foreground hover:text-foreground text-xs rounded-xl font-medium focus:outline-none transition-all"
                        >
                          <span>Pilih Keahlian...</span>
                          <ChevronDown
                            className={`h-4 w-4 opacity-50 transition-transform ${isSkillDropdownOpen ? 'rotate-180' : ''}`}
                          />
                        </button>

                        {isSkillDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => {
                                setIsSkillDropdownOpen(false);
                                setSkillSearch('');
                              }}
                            />
                            <div className="absolute left-0 right-0 mt-1.5 p-2 bg-card border border-border rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto space-y-2">
                              <div className="flex items-center gap-2 px-2 py-1 border-b border-border">
                                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <input
                                  type="text"
                                  placeholder="Cari keahlian..."
                                  value={skillSearch}
                                  onChange={(e) =>
                                    setSkillSearch(e.target.value)
                                  }
                                  className="w-full bg-transparent border-none text-xs outline-none text-foreground placeholder:text-muted-foreground/60"
                                />
                              </div>
                              <div className="space-y-1">
                                {(() => {
                                  const currentSkills = formik.values.skills
                                    ? formik.values.skills
                                        .split(',')
                                        .map((s) => s.trim())
                                        .filter(Boolean)
                                    : [];
                                  const filtered = AVAILABLE_SKILLS.filter(
                                    (skill) =>
                                      skill
                                        .toLowerCase()
                                        .includes(skillSearch.toLowerCase()),
                                  );

                                  const exactMatch = AVAILABLE_SKILLS.some(
                                    (skill) =>
                                      skill.toLowerCase() ===
                                      skillSearch.trim().toLowerCase(),
                                  );

                                  return (
                                    <>
                                      {filtered.map((skill) => {
                                        const isChecked =
                                          currentSkills.includes(skill);
                                        return (
                                          <button
                                            key={skill}
                                            type="button"
                                            onClick={() => {
                                              let nextSkills;
                                              if (isChecked) {
                                                nextSkills =
                                                  currentSkills.filter(
                                                    (s) => s !== skill,
                                                  );
                                              } else {
                                                nextSkills = [
                                                  ...currentSkills,
                                                  skill,
                                                ];
                                              }
                                              formik.setFieldValue(
                                                'skills',
                                                nextSkills.join(', '),
                                              );
                                            }}
                                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-secondary/40 text-xs font-medium text-left text-foreground transition-all"
                                          >
                                            <span>{skill}</span>
                                            <div
                                              className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-border'}`}
                                            >
                                              {isChecked && (
                                                <Check className="h-3 w-3" />
                                              )}
                                            </div>
                                          </button>
                                        );
                                      })}
                                      {skillSearch.trim() && !exactMatch && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const customVal =
                                              skillSearch.trim();
                                            if (
                                              customVal &&
                                              !currentSkills.includes(customVal)
                                            ) {
                                              const nextSkills = [
                                                ...currentSkills,
                                                customVal,
                                              ];
                                              formik.setFieldValue(
                                                'skills',
                                                nextSkills.join(', '),
                                              );
                                            }
                                            setSkillSearch('');
                                          }}
                                          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-xs font-bold text-primary text-left transition-all"
                                        >
                                          <Plus className="h-3.5 w-3.5" />
                                          <span>
                                            Tambah custom: &quot;{skillSearch.trim()}
                                            &quot;
                                          </span>
                                        </button>
                                      )}
                                      {filtered.length === 0 &&
                                        !skillSearch.trim() && (
                                          <div className="text-center text-muted-foreground text-[10px] py-2">
                                            Tidak ada keahlian tersedia
                                          </div>
                                        )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formik.values.skills
                          ? formik.values.skills
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean)
                              .map((skill, index) => (
                                <Badge
                                  key={index}
                                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full px-2.5 py-1 text-xs flex items-center gap-1.5"
                                >
                                  <span>{skill}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentSkills = formik.values.skills
                                        .split(',')
                                        .map((s) => s.trim())
                                        .filter(Boolean);
                                      const updated = currentSkills.filter(
                                        (s) => s !== skill,
                                      );
                                      formik.setFieldValue(
                                        'skills',
                                        updated.join(', '),
                                      );
                                    }}
                                    className="hover:text-rose-500 transition-colors p-0.5 rounded-full"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))
                          : null}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 relative">
                      <label className="text-xs font-bold text-foreground/90 mb-0 block">
                        Benefit Kerja
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setIsBenefitDropdownOpen(!isBenefitDropdownOpen)
                          }
                          className="w-full flex justify-between items-center px-3 py-2 border border-border/80 bg-secondary/20 text-muted-foreground hover:text-foreground text-xs rounded-xl font-medium focus:outline-none transition-all"
                        >
                          <span>Pilih Benefit...</span>
                          <ChevronDown
                            className={`h-4 w-4 opacity-50 transition-transform ${isBenefitDropdownOpen ? 'rotate-180' : ''}`}
                          />
                        </button>

                        {isBenefitDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => {
                                setIsBenefitDropdownOpen(false);
                                setBenefitSearch('');
                              }}
                            />
                            <div className="absolute left-0 right-0 mt-1.5 p-2 bg-card border border-border rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto space-y-2">
                              <div className="flex items-center gap-2 px-2 py-1 border-b border-border">
                                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <input
                                  type="text"
                                  placeholder="Cari benefit..."
                                  value={benefitSearch}
                                  onChange={(e) =>
                                    setBenefitSearch(e.target.value)
                                  }
                                  className="w-full bg-transparent border-none text-xs outline-none text-foreground placeholder:text-muted-foreground/60"
                                />
                              </div>
                              <div className="space-y-1">
                                {(() => {
                                  const currentBenefits = formik.values.benefits
                                    ? formik.values.benefits
                                        .split(',')
                                        .map((b) => b.trim())
                                        .filter(Boolean)
                                    : [];
                                  const filtered = AVAILABLE_BENEFITS.filter(
                                    (benefit) =>
                                      benefit
                                        .toLowerCase()
                                        .includes(benefitSearch.toLowerCase()),
                                  );

                                  const exactMatch = AVAILABLE_BENEFITS.some(
                                    (benefit) =>
                                      benefit.toLowerCase() ===
                                      benefitSearch.trim().toLowerCase(),
                                  );

                                  return (
                                    <>
                                      {filtered.map((benefit) => {
                                        const isChecked =
                                          currentBenefits.includes(benefit);
                                        return (
                                          <button
                                            key={benefit}
                                            type="button"
                                            onClick={() => {
                                              let nextBenefits;
                                              if (isChecked) {
                                                nextBenefits =
                                                  currentBenefits.filter(
                                                    (b) => b !== benefit,
                                                  );
                                              } else {
                                                nextBenefits = [
                                                  ...currentBenefits,
                                                  benefit,
                                                ];
                                              }
                                              formik.setFieldValue(
                                                'benefits',
                                                nextBenefits.join(', '),
                                              );
                                            }}
                                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-secondary/40 text-xs font-medium text-left text-foreground transition-all"
                                          >
                                            <span>{benefit}</span>
                                            <div
                                              className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-border'}`}
                                            >
                                              {isChecked && (
                                                <Check className="h-3 w-3" />
                                              )}
                                            </div>
                                          </button>
                                        );
                                      })}
                                      {benefitSearch.trim() && !exactMatch && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const customVal =
                                              benefitSearch.trim();
                                            if (
                                              customVal &&
                                              !currentBenefits.includes(
                                                customVal,
                                              )
                                            ) {
                                              const nextBenefits = [
                                                ...currentBenefits,
                                                customVal,
                                              ];
                                              formik.setFieldValue(
                                                'benefits',
                                                nextBenefits.join(', '),
                                              );
                                            }
                                            setBenefitSearch('');
                                          }}
                                          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-xs font-bold text-primary text-left transition-all"
                                        >
                                          <Plus className="h-3.5 w-3.5" />
                                          <span>
                                            Tambah custom: &quot;
                                            {benefitSearch.trim()}&quot;
                                          </span>
                                        </button>
                                      )}
                                      {filtered.length === 0 &&
                                        !benefitSearch.trim() && (
                                          <div className="text-center text-muted-foreground text-[10px] py-2">
                                            Tidak ada benefit tersedia
                                          </div>
                                        )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formik.values.benefits
                          ? formik.values.benefits
                              .split(',')
                              .map((b) => b.trim())
                              .filter(Boolean)
                              .map((benefit, index) => (
                                <Badge
                                  key={index}
                                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full px-2.5 py-1 text-xs flex items-center gap-1.5"
                                >
                                  <span>{benefit}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentBenefits =
                                        formik.values.benefits
                                          .split(',')
                                          .map((b) => b.trim())
                                          .filter(Boolean);
                                      const updated = currentBenefits.filter(
                                        (b) => b !== benefit,
                                      );
                                      formik.setFieldValue(
                                        'benefits',
                                        updated.join(', '),
                                      );
                                    }}
                                    className="hover:text-rose-500 transition-colors p-0.5 rounded-full"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))
                          : null}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                        Special Badge & Promosi
                      </h5>
                      <div className="flex gap-4">
                        {!user?.plan || user.plan === 'Free' ? (
                          <div
                            className="opacity-60 cursor-not-allowed flex items-center"
                            title="Hanya untuk member berlangganan"
                          >
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {
                                showToast(
                                  'Badge Urgent Hiring hanya untuk member berlangganan! Silakan upgrade plan Anda.',
                                  'info',
                                );
                              }}
                              label="Urgent Hiring (Khusus Langganan)"
                            />
                          </div>
                        ) : (
                          <Checkbox
                            checked={isUrgent}
                            onCheckedChange={setIsUrgent}
                            label="Urgent Hiring"
                          />
                        )}

                        {!user?.plan || user.plan === 'Free' ? (
                          <div
                            className="opacity-60 cursor-not-allowed flex items-center"
                            title="Hanya untuk member berlangganan"
                          >
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {
                                showToast(
                                  'Badge Premium Company hanya untuk member berlangganan! Silakan upgrade plan Anda.',
                                  'info',
                                );
                              }}
                              label="Premium Company (Khusus Langganan)"
                            />
                          </div>
                        ) : (
                          <Checkbox
                            checked={isPremiumJob}
                            onCheckedChange={setIsPremiumJob}
                            label="Premium Company"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  modalStep === 3 && (
                    /* PAGE 3: Pertanyaan Screening */
                    <div className="space-y-6 text-left">
                      {/* SECTION A: Pertanyaan Wajib (Tidak Dapat Dihapus) */}
                      <div className="space-y-3">
                        <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wide flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-[#2d3d3a]/10 text-[#2d3d3a] dark:text-[#a0c5bd] flex items-center justify-center text-[10px] font-black">
                            A
                          </span>
                          <span>Pertanyaan Wajib (Tidak Dapat Dihapus)</span>
                        </h4>
                        <Accordion
                          type="multiple"
                          defaultValue={['req-photo', 'req-resume']}
                          className="space-y-2"
                        >
                          {requiredQuestions.map((q, idx) => (
                            <AccordionItem
                              key={q.id}
                              value={q.id}
                              className="border border-border/80 bg-secondary/5 rounded-2xl overflow-hidden shadow-sm"
                            >
                              <div className="w-full flex items-center justify-between py-2 px-3 bg-secondary/10 text-left">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <span className="text-[10px] font-black text-muted-foreground uppercase">
                                    {idx + 1}.
                                  </span>
                                  <span className="font-extrabold text-xs text-foreground truncate flex-1">
                                    {q.question}
                                  </span>
                                </div>
                                <AccordionTrigger className="p-0 bg-transparent hover:bg-transparent hover:no-underline w-6 h-6 flex items-center justify-center shrink-0 ml-3" />
                              </div>
                              <AccordionContent className="py-2.5 px-3 border-t border-border/60 bg-background/50 text-[10px] font-semibold text-muted-foreground italic">
                                * Kandidat wajib mengunggah file untuk
                                pertanyaan ini saat melamar lowongan.
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>

                      <hr className="border-border/60 my-4" />

                      {/* SECTION B: Pertanyaan Custom */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wide flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-[#2d3d3a]/10 text-[#2d3d3a] dark:text-[#a0c5bd] flex items-center justify-center text-[10px] font-black">
                              B
                            </span>
                            <span>Pertanyaan Custom</span>
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAddQuestionModal(true)}
                            className="h-8 text-[10px] font-bold rounded-xl border-primary/20 text-primary hover:bg-primary/10 gap-1 shrink-0 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Tambah Pertanyaan</span>
                          </Button>
                        </div>

                        {/* Draggable Custom Questions Accordion */}
                        {customQuestions.length > 0 ? (
                          <Accordion
                            type="multiple"
                            defaultValue={customQuestions.map((q) => q.id)}
                            className="space-y-2"
                          >
                            {customQuestions.map((q, idx) => (
                              <div
                                key={q.id}
                                draggable={true}
                                onDragStart={() => handleDragStart(idx)}
                                onDragOver={(e) => handleDragOver(e, idx)}
                                onDrop={() => handleDrop(idx)}
                                className={`transition-all duration-200 ${draggedIndex === idx ? 'opacity-40 scale-95' : ''}`}
                              >
                                <AccordionItem
                                  value={q.id}
                                  className="border border-border/80 rounded-2xl overflow-hidden bg-secondary/5 shadow-sm"
                                >
                                  {/* Header / Trigger */}
                                  <div className="w-full flex items-center justify-between py-2 px-3 bg-secondary/10 border-none outline-none text-left">
                                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                      <div
                                        className="cursor-move p-1 hover:bg-secondary rounded text-muted-foreground shrink-0"
                                        title="Geser untuk mengubah urutan"
                                      >
                                        <GripVertical className="h-3.5 w-3.5" />
                                      </div>
                                      <span className="text-[10px] font-black text-muted-foreground uppercase shrink-0">
                                        {idx + 1}.
                                      </span>
                                      <span className="font-extrabold text-xs text-foreground truncate flex-1">
                                        {q.question || '(Belum Ada Pertanyaan)'}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-[8px] font-black uppercase tracking-wider bg-primary/10 border-primary/20 text-primary rounded-full shrink-0"
                                      >
                                        {q.type === 'short_input'
                                          ? 'Input Pendek'
                                          : q.type === 'long_input'
                                            ? 'Input Panjang'
                                            : q.type === 'yes_no'
                                              ? 'Ya / Tidak'
                                              : q.type === 'proficiency_level'
                                                ? 'Tingkat Keahlian'
                                                : q.type === 'checkbox'
                                                  ? 'Multi Pilihan'
                                                  : q.type === 'radio'
                                                    ? 'Pilihan Tunggal'
                                                    : q.type === 'skill_list'
                                                      ? 'Daftar Keahlian'
                                                      : q.type ===
                                                          'language_list'
                                                        ? 'Daftar Bahasa'
                                                        : q.type ===
                                                            'district_selector'
                                                          ? 'Domisili Lengkap'
                                                          : 'Deskripsi'}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0 ml-3">
                                      <button
                                        type="button"
                                        onClick={() => deleteQuestion(q.id)}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Content */}
                                  <AccordionContent className="p-3 border-t border-border/60 bg-background/50">
                                    <div className="space-y-3">
                                      {/* Edit Question text & type */}
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="md:col-span-2 flex flex-col gap-1">
                                          <label className="text-[10px] font-bold text-foreground">
                                            Pertanyaan
                                          </label>
                                          <Input
                                            placeholder="Masukkan pertanyaan..."
                                            value={q.question}
                                            onChange={(e) =>
                                              updateQuestion(q.id, {
                                                question: e.target.value,
                                              })
                                            }
                                            className="rounded-xl h-9 text-xs font-semibold bg-background border-border/60"
                                          />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <label className="text-[10px] font-bold text-foreground">
                                            Tipe Jawaban
                                          </label>
                                          <select
                                            value={q.type}
                                            onChange={(e) =>
                                              updateQuestion(q.id, {
                                                type: e.target.value as any,
                                              })
                                            }
                                            className="flex h-9 w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                                          >
                                            <option value="short_input">
                                              Input Pendek (Short Text)
                                            </option>
                                            <option value="long_input">
                                              Input Panjang (Long Text)
                                            </option>
                                            <option value="description">
                                              Text Description
                                            </option>
                                            <option value="checkbox">
                                              Checkbox (Multi Pilihan)
                                            </option>
                                            <option value="radio">
                                              Radio Button (Pilihan Tunggal)
                                            </option>
                                            <option value="skill_list">
                                              Daftar Keahlian
                                            </option>
                                            <option value="language_list">
                                              Daftar Bahasa
                                            </option>
                                            <option value="proficiency_level">
                                              Tingkat Keahlian
                                            </option>
                                            <option value="yes_no">
                                              Ya / Tidak
                                            </option>
                                          </select>
                                        </div>
                                      </div>

                                      {/* Edit Options (if checkbox/radio) */}
                                      {(q.type === 'checkbox' ||
                                        q.type === 'radio') && (
                                        <div className="space-y-2 border-t pt-3 border-border/60 mt-1">
                                          <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
                                              Pilihan Jawaban (Opsi)
                                            </label>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                addOptionToQuestion(q.id)
                                              }
                                              className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 border-none bg-transparent cursor-pointer"
                                            >
                                              <Plus className="h-3 w-3" />
                                              <span>Tambah Opsi</span>
                                            </button>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {q.options?.map(
                                              (opt: string, optIdx: number) => (
                                                <div
                                                  key={optIdx}
                                                  className="flex items-center gap-2"
                                                >
                                                  <div className="h-2 w-2 rounded-full border border-muted-foreground shrink-0" />
                                                  <Input
                                                    placeholder={`Opsi ${optIdx + 1}`}
                                                    value={opt}
                                                    onChange={(e) =>
                                                      updateOptionInQuestion(
                                                        q.id,
                                                        optIdx,
                                                        e.target.value,
                                                      )
                                                    }
                                                    className="rounded-xl h-8 text-xs font-semibold bg-background border-border/60 flex-1"
                                                  />
                                                  {(q.options?.length || 0) >
                                                    1 && (
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        deleteOptionFromQuestion(
                                                          q.id,
                                                          optIdx,
                                                        )
                                                      }
                                                      className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                                    >
                                                      <X className="h-3 w-3" />
                                                    </button>
                                                  )}
                                                </div>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Edit Lists (if skill_list or language_list) */}
                                      {(q.type === 'skill_list' ||
                                        q.type === 'language_list') && (
                                        <div className="space-y-2 border-t pt-3 border-border/60 mt-1">
                                          <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
                                              Daftar Item (
                                              {q.type === 'skill_list'
                                                ? 'Keahlian'
                                                : 'Bahasa'}
                                              )
                                            </label>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                addOptionToQuestion(q.id)
                                              }
                                              className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 border-none bg-transparent cursor-pointer"
                                            >
                                              <Plus className="h-3 w-3" />
                                              <span>Tambah Item</span>
                                            </button>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {q.options?.map(
                                              (opt: string, optIdx: number) => (
                                                <div
                                                  key={optIdx}
                                                  className="flex items-center gap-2"
                                                >
                                                  <div className="h-2 w-2 rounded-full bg-primary/40 shrink-0" />
                                                  <Input
                                                    placeholder={
                                                      q.type === 'skill_list'
                                                        ? 'Contoh: Flutter'
                                                        : 'Contoh: Bahasa Inggris'
                                                    }
                                                    value={opt}
                                                    onChange={(e) =>
                                                      updateOptionInQuestion(
                                                        q.id,
                                                        optIdx,
                                                        e.target.value,
                                                      )
                                                    }
                                                    className="rounded-xl h-8 text-xs font-semibold bg-background border-border/60 flex-1"
                                                  />
                                                  {(q.options?.length || 0) >
                                                    1 && (
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        deleteOptionFromQuestion(
                                                          q.id,
                                                          optIdx,
                                                        )
                                                      }
                                                      className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                                    >
                                                      <X className="h-3 w-3" />
                                                    </button>
                                                  )}
                                                </div>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Preset info for fixed lists */}
                                      {q.type === 'yes_no' && (
                                        <p className="text-[10px] font-semibold text-muted-foreground italic">
                                          * Pilihan otomatis diset: Ya / Tidak
                                        </p>
                                      )}
                                      {q.type === 'proficiency_level' && (
                                        <p className="text-[10px] font-semibold text-muted-foreground italic">
                                          * Pilihan otomatis diset: Tidak
                                          Berpengalaman, Dasar, Menengah, Mahir,
                                          Ahli
                                        </p>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </div>
                            ))}
                          </Accordion>
                        ) : (
                          <div className="text-center py-8 border-2 border-dashed border-border/60 rounded-2xl text-[11px] text-muted-foreground bg-secondary/5">
                            Belum ada pertanyaan custom. Klik &quot;+ Tambah
                            Pertanyaan&quot; untuk memulai.
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Footer Controls */}
              <div className="shrink-0 pt-3 flex justify-end gap-3.5 bg-card">
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    formik.setFieldTouched('title', true);
                    formik.setFieldTouched('location', true);
                    formik.setFieldTouched('salaryMin', true);
                    formik.setFieldTouched('workType', true);
                    formik.setFieldTouched('workLocationType', true);

                    if (modalStep >= 2) {
                      formik.setFieldTouched('description', true);
                    }

                    const errors = await formik.validateForm();
                    const hasErrors =
                      errors.title ||
                      errors.location ||
                      errors.salaryMin ||
                      errors.workType ||
                      errors.workLocationType ||
                      (modalStep >= 2 && errors.description);

                    if (!hasErrors) {
                      setIsDraftSave(true);
                      setTimeout(() => {
                        formik.submitForm();
                      }, 50);
                    } else {
                      showToast(
                        'Harap isi field wajib sebelum menyimpan draf!',
                        'error',
                      );
                    }
                  }}
                  className="h-8 rounded-full border-primary/20 hover:border-primary/45 text-[#a0c5bd] bg-primary/5 hover:bg-primary/10 font-bold text-[11.5px] px-4 cursor-pointer transition-all"
                >
                  Simpan Draf
                </Button>

                {(modalStep === 2 || modalStep === 3) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalStep(modalStep === 3 ? 2 : 1)}
                    className="h-8 rounded-full font-bold text-[11.5px] px-4 cursor-pointer border-border/80 hover:bg-secondary/40 transition-all"
                  >
                    Kembali
                  </Button>
                )}

                {modalStep === 1 ? (
                  <Button
                    key="btn-next-step1"
                    type="button"
                    onClick={async () => {
                      // Trigger validation for page 1 fields
                      formik.setFieldTouched('title', true);
                      formik.setFieldTouched('location', true);
                      formik.setFieldTouched('salaryMin', true);
                      formik.setFieldTouched('salaryMax', true);
                      formik.setFieldTouched('workType', true);
                      formik.setFieldTouched('workLocationType', true);

                      const errors = await formik.validateForm();
                      if (
                        !errors.title &&
                        !errors.location &&
                        !errors.salaryMin &&
                        !errors.salaryMax &&
                        !errors.workType &&
                        !errors.workLocationType
                      ) {
                        setModalStep(2);
                      } else {
                        showToast(
                          'Harap isi informasi dasar dengan benar!',
                          'error',
                        );
                      }
                    }}
                    className="h-8 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-[11.5px] px-5 cursor-pointer shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    Lanjut
                  </Button>
                ) : modalStep === 2 ? (
                  <Button
                    key="btn-next-step2"
                    type="button"
                    onClick={async () => {
                      formik.setFieldTouched('description', true);
                      const errors = await formik.validateForm();
                      if (!errors.description) {
                        setModalStep(3);
                      } else {
                        showToast('Harap isi deskripsi lowongan!', 'error');
                      }
                    }}
                    className="h-8 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-[11.5px] px-5 cursor-pointer shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    Lanjut
                  </Button>
                ) : (
                  <Button
                    key="btn-submit-step3"
                    type="submit"
                    className="h-8 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-[11.5px] px-5 cursor-pointer shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    {editingJobId
                      ? <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>
                      : <><Rocket className="w-4 h-4 mr-2" /> Publikasikan Lowongan Kerja</>}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-9999 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-extrabold animate-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white'
              : toastMessage.type === 'error'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 text-white'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
          ) : (
            <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
              <Info className="h-3 w-3 text-white" />
            </div>
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="font-extrabold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Konfirmasi Hapus</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus lowongan pekerjaan ini secara
              permanen? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteId(null)}
                className="h-9 text-xs font-bold px-4 rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  hardDeleteEmployerJob(confirmDeleteId);
                  showToast(
                    'Lowongan berhasil dihapus secara permanen!',
                    'success',
                  );
                  setConfirmDeleteId(null);
                }}
                className="h-9 text-xs font-bold px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer"
              >
                Hapus Permanen
              </Button>
            </div>
          </Card>
        </div>
      )}
      {showVerifyPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setShowVerifyPromptModal(false)}
          />
          <Card className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto smooth-scroll">
            <div className="flex justify-between items-center border-b pb-3 mb-4 shrink-0">
              <h3 className="text-base font-extrabold text-foreground">
                Lengkapi Profil
              </h3>
              <button
                onClick={() => setShowVerifyPromptModal(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-all cursor-pointer border-none bg-transparent flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Alert Box */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl text-[12px] font-bold flex gap-2.5 mb-5">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>
                Segera lengkapi informasi perusahaan Anda agar bisa menayangkan
                lowongan kerja. Unggah NIB untuk meningkatkan peluang
                terverifikasi.
              </span>
            </div>
            <form
              onSubmit={companyFormik.handleSubmit}
              className="space-y-4 text-left"
            >
              {/* Logo Area */}
              <div className="flex flex-col items-center mb-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Logo Perusahaan*
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                    {companyFormik.values.logo ? (
                      <Image
                        src={companyFormik.values.logo}
                        alt="Preview Logo"
                        className="w-full h-full object-cover"
                       width={100} height={100} unoptimized />
                    ) : (
                      <Building2 className="h-7 w-7 text-primary" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() =>
                        companyFormik.setFieldValue(
                          'logo',
                          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
                        )
                      }
                      className="text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                      Pilih dari preset / Upload
                    </button>
                    <p className="text-[10px] text-muted-foreground">
                      Maks: 200 KB, JPG, JPEG, PNG, atau WEBP
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 border-b pb-1.5">
                  Informasi Dasar
                </h5>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Nama Brand*
                  </label>
                  <Input
                    placeholder="Contoh: BlueJob Corporation"
                    name="brandName"
                    value={companyFormik.values.brandName}
                    onChange={companyFormik.handleChange}
                    onBlur={companyFormik.handleBlur}
                    className="rounded-xl h-10 text-xs"
                  />
                  {companyFormik.touched.brandName &&
                    companyFormik.errors.brandName && (
                      <div className="text-rose-500 text-[10px] font-bold">
                        {companyFormik.errors.brandName}
                      </div>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Nama Legal
                  </label>
                  <Input
                    placeholder="Contoh: PT. BlueJob Global Indonesia"
                    name="legalName"
                    value={companyFormik.values.legalName}
                    onChange={companyFormik.handleChange}
                    onBlur={companyFormik.handleBlur}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Industri Perusahaan*
                    </label>
                    <select
                      name="industry"
                      value={companyFormik.values.industry}
                      onChange={companyFormik.handleChange}
                      onBlur={companyFormik.handleBlur}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs ring-offset-background outline-none focus:ring-1 focus:ring-primary dark:bg-slate-950 dark:border-slate-800"
                    >
                      <option value="Teknologi & Informasi">
                        Teknologi & Informasi
                      </option>
                      <option value="Keuangan & Perbankan">
                        Keuangan & Perbankan
                      </option>
                      <option value="Pendidikan">Pendidikan</option>
                      <option value="Kesehatan">Kesehatan</option>
                      <option value="Logistik & Transportasi">
                        Logistik & Transportasi
                      </option>
                      <option value="Manufaktur">Manufaktur</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Jumlah Pegawai*
                    </label>
                    <select
                      name="employeeCount"
                      value={companyFormik.values.employeeCount}
                      onChange={companyFormik.handleChange}
                      onBlur={companyFormik.handleBlur}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs ring-offset-background outline-none focus:ring-1 focus:ring-primary dark:bg-slate-950 dark:border-slate-800"
                    >
                      <option value="1-10 Pegawai">1-10 Pegawai</option>
                      <option value="11-50 Pegawai">11-50 Pegawai</option>
                      <option value="51-200 Pegawai">51-200 Pegawai</option>
                      <option value="201-500 Pegawai">201-500 Pegawai</option>
                      <option value="500+ Pegawai">500+ Pegawai</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Link Website/Social Media
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs text-muted-foreground font-semibold">
                      https://
                    </span>
                    <Input
                      placeholder="companysite.com"
                      value={companyFormik.values.website.replace(
                        /^https?:\/\//,
                        '',
                      )}
                      onChange={(e) =>
                        companyFormik.setFieldValue(
                          'website',
                          'https://' + e.target.value,
                        )
                      }
                      onBlur={companyFormik.handleBlur}
                      className="pl-16 rounded-xl h-10 text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Deskripsi Perusahaan (minimal 75 karakter)*
                  </label>
                  <textarea
                    placeholder="Masukkan deskripsi perusahaan..."
                    name="description"
                    value={companyFormik.values.description}
                    onChange={companyFormik.handleChange}
                    onBlur={companyFormik.handleBlur}
                    className="w-full min-h-[90px] border border-input bg-background rounded-xl p-3 text-xs focus:ring-1 focus:ring-primary outline-none dark:bg-slate-950 dark:border-slate-800 text-foreground"
                  />
                  {companyFormik.touched.description &&
                    companyFormik.errors.description && (
                      <div className="text-rose-500 text-[10px] font-bold">
                        {companyFormik.errors.description}
                      </div>
                    )}
                  <div className="text-[10px] text-muted-foreground text-right font-medium">
                    {companyFormik.values.description.length} / 75 karakter
                    minimum
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">
                    NIB Perusahaan
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={
                        companyFormik.values.nib
                          ? companyFormik.values.nib
                          : 'Pilih file'
                      }
                      disabled
                      className="rounded-xl h-10 text-xs flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        companyFormik.setFieldValue('nib', 'NIB_PT_BlueJob.pdf')
                      }
                      className="font-bold text-xs h-10 rounded-xl cursor-pointer shrink-0"
                    >
                      Upload
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    (Maks: 2 MB, PDF, JPG, JPEG, atau PNG)
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">
                    No. WhatsApp untuk dihubungi kandidat
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs text-muted-foreground font-semibold">
                      +62
                    </span>
                    <Input
                      placeholder="81234 567 8790"
                      value={companyFormik.values.waNumber.replace(/^\+62/, '')}
                      onChange={(e) =>
                        companyFormik.setFieldValue(
                          'waNumber',
                          '+62' + e.target.value,
                        )
                      }
                      onBlur={companyFormik.handleBlur}
                      className="pl-11 rounded-xl h-10 text-xs"
                    />
                  </div>
                  {/* Alert Box for candidate delivery */}
                  <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-xl text-[10px] font-bold flex gap-2.5 mt-2">
                    <Info className="h-4 w-4 shrink-0" />
                    <span>
                      Lamaran kandidat akan dikirimkan ke email yang didaftarkan
                      pada saat registrasi jika tidak mengisi nomor WhatsApp.
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-bold text-xs h-11 shadow-sm transition-colors cursor-pointer border-none mt-6"
              >
                Simpan
              </Button>
            </form>
          </Card>
        </div>
      )}
      {showEmailVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="absolute inset-0"
            onClick={() => {
              setShowEmailVerifyModal(false);
              setPendingAction(null);
            }}
          />
          <Card className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 md:p-8 z-10 dark:bg-slate-900 dark:border-slate-800 text-center space-y-5">
            <button
              onClick={() => {
                setShowEmailVerifyModal(false);
                setPendingAction(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all cursor-pointer border-none bg-transparent"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <MailWarning className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">
                Verifikasi Email Diperlukan
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Untuk melakukan aksi ini (Post / Delete), silakan verifikasi
                alamat email Anda demi keamanan akun.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => {
                  verifyEmail();
                  showToast('Email berhasil diverifikasi!', 'success');
                  setShowEmailVerifyModal(false);

                  // Resume pending action
                  if (pendingAction) {
                    if (pendingAction.type === 'post' && pendingAction.data) {
                      if (editingJobId) {
                        editEmployerJob(editingJobId, pendingAction.data);
                        showToast(
                          'Lowongan pekerjaan berhasil diperbarui!',
                          'success',
                        );
                      } else {
                        addEmployerJob(pendingAction.data);
                        showToast(
                          'Lowongan pekerjaan baru berhasil dipublikasikan!',
                          'success',
                        );
                      }
                      formik.resetForm();
                      setIsUrgent(false);
                      setIsPremiumJob(false);
                      setShowAddJobModal(false);
                      setEditingJobId(null);
                    } else if (
                      pendingAction.type === 'delete' &&
                      pendingAction.id
                    ) {
                      softDeleteEmployerJob(pendingAction.id);
                      showToast(
                        'Lowongan telah dipindahkan ke Tempat Sampah.',
                        'success',
                      );
                    }
                  }
                  setPendingAction(null);
                }}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-bold text-xs h-10 shadow-sm transition-colors cursor-pointer border-none"
              >
                Verifikasi Sekarang
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEmailVerifyModal(false);
                  setPendingAction(null);
                }}
                className="w-full rounded-xl font-bold text-xs h-10 shadow-sm cursor-pointer"
              >
                Batal
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LowonganTab;
