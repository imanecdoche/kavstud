import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { UserProfile } from '../types';
import { 
  ArrowLeft, 
  HelpCircle, 
  Search, 
  ChevronDown, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Monitor, 
  UserCheck, 
  Award, 
  UserPlus, 
  Info,
  MessageCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqPageProps {
  onNavigate: (path: string) => void;
  userProfile?: UserProfile | null;
}

interface FaqItem {
  id: number;
  category: string;
  question: string;
  answer: React.ReactNode;
}

export default function FaqPage({ onNavigate, userProfile }: FaqPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 1: true });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const CATEGORIES = [
    { id: 'Semua', label: 'Semua Pertanyaan', icon: HelpCircle },
    { id: 'Tentang KAVIO EDU', label: 'Tentang KAVIO EDU', icon: Info },
    { id: 'Sistem Belajar', label: 'Sistem Belajar', icon: BookOpen },
    { id: 'Jadwal', label: 'Jadwal', icon: Calendar },
    { id: 'Pembayaran', label: 'Pembayaran', icon: CreditCard },
    { id: 'Platform', label: 'Platform', icon: Monitor },
    { id: 'Tutor', label: 'Tutor', icon: UserCheck },
    { id: 'Hasil Belajar', label: 'Hasil Belajar', icon: Award },
    { id: 'Pendaftaran', label: 'Pendaftaran', icon: UserPlus },
  ];

  const ALL_FAQS: FaqItem[] = [
    // 1. Tentang KAVIO EDU
    {
      id: 1,
      category: 'Tentang KAVIO EDU',
      question: '1. Apa itu KAVIO EDU?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          KAVIO EDU adalah platform pembelajaran Bahasa Inggris online yang menyediakan kelas <strong className="text-[#3C3C3C]">Private</strong> dan <strong className="text-[#3C3C3C]">Circle</strong> dengan metode belajar yang interaktif, fleksibel, dan disesuaikan dengan kemampuan setiap siswa.
        </p>
      )
    },
    {
      id: 2,
      category: 'Tentang KAVIO EDU',
      question: '2. Siapa saja yang bisa belajar di KAVIO EDU?',
      answer: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            KAVIO EDU terbuka untuk:
          </p>
          <ul className="list-disc pl-5 text-sm sm:text-base text-[#4B4B4B] font-medium space-y-1">
            <li>Anak-anak</li>
            <li>Siswa SD</li>
            <li>Siswa SMP</li>
            <li>Siswa SMA</li>
            <li>Mahasiswa</li>
            <li>Umum</li>
          </ul>
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed pt-1">
            Program belajar akan disesuaikan dengan usia, kemampuan, dan tujuan belajar masing-masing peserta.
          </p>
        </div>
      )
    },
    {
      id: 3,
      category: 'Tentang KAVIO EDU',
      question: '3. Apakah saya harus sudah bisa Bahasa Inggris?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          Tidak. KAVIO EDU menerima siswa dari tingkat pemula hingga tingkat lanjutan. Tutor akan menyesuaikan materi dengan kemampuan awal setiap siswa.
        </p>
      )
    },
    {
      id: 4,
      category: 'Tentang KAVIO EDU',
      question: '4. Program Bahasa Inggris apa saja yang tersedia?',
      answer: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Program yang tersedia meliputi:
          </p>
          <ul className="list-disc pl-5 text-sm sm:text-base text-[#4B4B4B] font-medium space-y-1">
            <li>General English</li>
            <li>English for Kids</li>
            <li>Grammar</li>
            <li>Speaking</li>
            <li>Vocabulary</li>
            <li>Reading</li>
            <li>Writing</li>
            <li>Conversation Class</li>
          </ul>
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed pt-1">
            Program akan terus dikembangkan sesuai kebutuhan siswa.
          </p>
        </div>
      )
    },
    {
      id: 5,
      category: 'Tentang KAVIO EDU',
      question: '5. Apa perbedaan Private Class dan Circle Class?',
      answer: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100 space-y-2">
            <h4 className="font-bold text-sm text-[#0284C7] uppercase">Private Class</h4>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-[#4B4B4B] space-y-1 font-medium">
              <li>1 tutor : 1 siswa</li>
              <li>Materi sepenuhnya disesuaikan</li>
              <li>Jadwal lebih fleksibel</li>
            </ul>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
            <h4 className="font-bold text-sm text-[#16A34A] uppercase">Circle Class</h4>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-[#4B4B4B] space-y-1 font-medium">
              <li>2–5 siswa</li>
              <li>Lebih interaktif</li>
              <li>Biaya lebih hemat</li>
              <li>Cocok untuk latihan komunikasi</li>
            </ul>
          </div>
        </div>
      )
    },

    // 2. Sistem Belajar
    {
      id: 6,
      category: 'Sistem Belajar',
      question: '6. Bagaimana metode belajar di KAVIO EDU?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          Pembelajaran dilakukan secara interaktif melalui diskusi, latihan, praktik, serta evaluasi berkala agar siswa mampu menggunakan Bahasa Inggris secara aktif.
        </p>
      )
    },
    {
      id: 7,
      category: 'Sistem Belajar',
      question: '7. Apakah kelas dilakukan secara online?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          Ya. Seluruh kelas dilaksanakan secara online sehingga siswa dapat belajar dari mana saja.
        </p>
      )
    },
    {
      id: 8,
      category: 'Sistem Belajar',
      question: '8. Platform apa yang digunakan saat belajar?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          Kelas menggunakan platform meeting online yang telah ditentukan oleh KAVIO EDU. Informasi akses kelas diberikan sebelum pembelajaran dimulai.
        </p>
      )
    },
    {
      id: 9,
      category: 'Sistem Belajar',
      question: '9. Berapa lama satu kali pertemuan?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Durasi mengikuti paket yang dipilih.
          </p>
          <p className="text-sm text-[#4B4B4B] font-bold">Pilihan:</p>
          <ul className="list-disc pl-5 text-sm text-[#4B4B4B] font-medium space-y-1">
            <li>60 menit</li>
            <li>90 menit</li>
          </ul>
        </div>
      )
    },
    {
      id: 10,
      category: 'Sistem Belajar',
      question: '10. Berapa kali pertemuan dalam satu bulan?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Mengikuti paket yang dipilih.
          </p>
          <p className="text-sm text-[#4B4B4B] font-bold">Contoh:</p>
          <ul className="list-disc pl-5 text-sm text-[#4B4B4B] font-medium space-y-1">
            <li>3 sesi</li>
            <li>4 sesi</li>
            <li>8 sesi</li>
          </ul>
        </div>
      )
    },
    {
      id: 11,
      category: 'Sistem Belajar',
      question: '11. Apakah materi mengikuti sekolah?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          Ya. Tutor dapat menyesuaikan materi dengan kurikulum sekolah maupun kebutuhan pribadi siswa.
        </p>
      )
    },
    {
      id: 12,
      category: 'Sistem Belajar',
      question: '12. Apakah saya bisa fokus belajar Speaking saja?',
      answer: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Bisa.
          </p>
          <p className="text-sm text-[#4B4B4B] font-bold">Materi dapat difokuskan pada:</p>
          <ul className="list-disc pl-5 text-sm text-[#4B4B4B] font-medium space-y-1">
            <li>Speaking</li>
            <li>Grammar</li>
            <li>Vocabulary</li>
            <li>Reading</li>
            <li>Writing</li>
            <li>Conversation</li>
          </ul>
        </div>
      )
    },
    {
      id: 13,
      category: 'Sistem Belajar',
      question: '13. Apakah saya akan mendapatkan latihan?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          Ya. Tutor dapat memberikan latihan, tugas, maupun materi tambahan untuk membantu perkembangan belajar.
        </p>
      )
    },

    // 3. Jadwal
    {
      id: 14,
      category: 'Jadwal',
      question: '14. Bagaimana menentukan jadwal belajar?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Jadwal ditentukan berdasarkan kesepakatan antara tutor dan siswa.
          </p>
          <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
            Untuk Circle Class, jadwal mengikuti kesepakatan seluruh anggota kelompok.
          </p>
        </div>
      )
    },
    {
      id: 15,
      category: 'Jadwal',
      question: '15. Apakah saya bisa mengubah jadwal?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Bisa.
          </p>
          <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
            Permintaan reschedule diajukan melalui aplikasi minimal <strong className="text-[#FF4B4B]">6 jam sebelum kelas dimulai</strong> dan harus mendapatkan persetujuan tutor.
          </p>
        </div>
      )
    },
    {
      id: 16,
      category: 'Jadwal',
      question: '16. Bagaimana jika saya terlambat masuk kelas?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Tutor tetap mengajar sesuai jadwal.
          </p>
          <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
            Durasi kelas tidak akan ditambah sesuai waktu keterlambatan siswa.
          </p>
        </div>
      )
    },
    {
      id: 17,
      category: 'Jadwal',
      question: '17. Bagaimana jika saya tidak bisa hadir?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          Apabila siswa tidak hadir tanpa pemberitahuan sesuai ketentuan, sesi pembelajaran dianggap telah digunakan.
        </p>
      )
    },
    {
      id: 18,
      category: 'Jadwal',
      question: '18. Bagaimana jika tutor berhalangan hadir?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          KAVIO EDU akan menjadwalkan ulang kelas sehingga siswa tetap mendapatkan hak sesi pembelajaran.
        </p>
      )
    },

    // 4. Pembayaran
    {
      id: 19,
      category: 'Pembayaran',
      question: '19. Bagaimana sistem pembayarannya?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            KAVIO EDU menggunakan sistem paket bulanan.
          </p>
          <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
            Pembayaran dilakukan di awal sebelum paket dimulai.
          </p>
        </div>
      )
    },
    {
      id: 20,
      category: 'Pembayaran',
      question: '20. Apakah bisa membayar per pertemuan?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Saat ini belum.
          </p>
          <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
            Seluruh program menggunakan sistem paket agar proses belajar lebih konsisten.
          </p>
        </div>
      )
    },
    {
      id: 21,
      category: 'Pembayaran',
      question: '21. Apakah paket memiliki masa berlaku?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Ya.
          </p>
          <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
            Seluruh paket berlaku selama <strong className="text-[#3C3C3C]">1 bulan</strong> sejak pertemuan pertama.
          </p>
        </div>
      )
    },
    {
      id: 22,
      category: 'Pembayaran',
      question: '22. Apakah pembayaran bisa dikembalikan?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          Pembayaran tidak dapat dikembalikan kecuali terdapat kondisi tertentu sesuai syarat dan ketentuan KAVIO EDU.
        </p>
      )
    },

    // 5. Platform
    {
      id: 23,
      category: 'Platform',
      question: '23. Apakah saya mendapatkan akun KAVIO EDU?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Ya.
          </p>
          <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
            Setiap siswa memperoleh akun untuk mengakses platform KAVIO EDU.
          </p>
        </div>
      )
    },
    {
      id: 24,
      category: 'Platform',
      question: '24. Apa saja yang bisa dilakukan melalui aplikasi?',
      answer: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Melalui aplikasi siswa dapat:
          </p>
          <ul className="list-disc pl-5 text-sm sm:text-base text-[#4B4B4B] font-medium space-y-1">
            <li>Melihat jadwal belajar</li>
            <li>Mengajukan reschedule</li>
            <li>Melihat status kelas</li>
            <li>Mengakses informasi pembelajaran</li>
            <li>Memantau perkembangan fitur</li>
          </ul>
        </div>
      )
    },
    {
      id: 25,
      category: 'Platform',
      question: '25. Apakah jadwal akan diperbarui secara otomatis?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Ya.
          </p>
          <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
            Seluruh perubahan jadwal akan tersinkronisasi secara real-time antara tutor dan siswa.
          </p>
        </div>
      )
    },

    // 6. Tutor
    {
      id: 26,
      category: 'Tutor',
      question: '26. Siapa tutor di KAVIO EDU?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          Tutor dipilih berdasarkan kompetensi dan kemampuan mengajar agar proses belajar berjalan efektif dan menyenangkan.
        </p>
      )
    },
    {
      id: 27,
      category: 'Tutor',
      question: '27. Apakah saya bisa memilih tutor?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          Jika tersedia, siswa dapat menyampaikan preferensi tutor. Penempatan tetap mempertimbangkan ketersediaan jadwal dan kecocokan kebutuhan belajar.
        </p>
      )
    },

    // 7. Hasil Belajar
    {
      id: 28,
      category: 'Hasil Belajar',
      question: '28. Apakah saya bisa melihat perkembangan belajar?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Ya.
          </p>
          <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
            Ke depannya KAVIO EDU akan menyediakan fitur <strong className="text-[#3C3C3C]">Learning Progress</strong> agar siswa dapat memantau perkembangan kemampuan Bahasa Inggris secara berkala.
          </p>
        </div>
      )
    },
    {
      id: 29,
      category: 'Hasil Belajar',
      question: '29. Apakah saya mendapatkan sertifikat?',
      answer: (
        <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
          Apabila tersedia pada program yang diikuti, sertifikat akan diberikan sesuai ketentuan yang berlaku.
        </p>
      )
    },

    // 8. Pendaftaran
    {
      id: 30,
      category: 'Pendaftaran',
      question: '30. Bagaimana cara mendaftar?',
      answer: (
        <ol className="list-decimal pl-5 text-sm sm:text-base text-[#4B4B4B] font-medium space-y-1.5">
          <li>Pilih paket belajar.</li>
          <li>Isi formulir pendaftaran.</li>
          <li>Lakukan pembayaran.</li>
          <li>Tentukan jadwal.</li>
          <li>Terima akun KAVIO EDU.</li>
          <li>Mulai belajar.</li>
        </ol>
      )
    },
    {
      id: 31,
      category: 'Pendaftaran',
      question: '31. Bagaimana jika saya masih bingung memilih paket?',
      answer: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Tidak masalah.
          </p>
          <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
            Tim KAVIO EDU siap membantu memberikan rekomendasi paket yang paling sesuai dengan kebutuhan dan tujuan belajar.
          </p>
        </div>
      )
    }
  ];

  const filteredFaqs = ALL_FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'Semua' || faq.category === selectedCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allOpen: Record<number, boolean> = {};
    filteredFaqs.forEach(faq => { allOpen[faq.id] = true; });
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  return (
    <div className="min-h-screen bg-[#171A21] text-white font-sans flex flex-col">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#171A21] backdrop-blur-md border-b border-white/10 py-3.5 px-4 sm:px-8 shadow-[0_4px_16px_rgba(0,0,0,0.6)] text-white">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/')}
              className="h-[36px] px-3.5 bg-black/40 hover:bg-white/10 text-white border border-white/20 text-xs font-bold uppercase rounded-[2px] flex items-center gap-2 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <div className="cursor-pointer" onClick={() => onNavigate('/')}>
              <Logo className="h-8 w-auto" />
            </div>
          </div>

          <a
            href="https://wa.me/6282111500190"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[36px] px-4 bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] text-xs font-bold uppercase rounded-[2px] flex items-center gap-2 cursor-pointer hidden sm:flex transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#171A21]" />
            <span>Tanya Admin WA</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-white">
        {/* Page Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#66C0F4]/15 text-[#66C0F4] font-bold text-[10px] uppercase tracking-wider border border-[#66C0F4]/30">
            <HelpCircle className="w-3.5 h-3.5 text-[#66C0F4]" />
            PUSAT BANTUAN & FAQ
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase">
            Pertanyaan Yang Sering Diajukan
          </h1>
          <p className="text-sm sm:text-base text-[#C6D4DF] font-normal leading-relaxed">
            Temukan jawaban lengkap mengenai program pembelajaran Bahasa Inggris, sistem jadwal, platform, dan pendaftaran di KAVIO EDU.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto pt-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8A8A8A]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci (misal: reschedule, private, pembayaran)..."
              className="w-full pl-11 pr-4 py-3 rounded-[2px] bg-black/40 border border-white/15 text-white placeholder-[#8A8A8A] text-xs font-medium focus:border-[#66C0F4] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category Pills Slider / Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#66C0F4] text-[#171A21] shadow-sm border border-[#66C0F4]'
                    : 'bg-black/40 hover:bg-white/10 text-[#C6D4DF] hover:text-white border border-white/15'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Top Control Bar (Item count & Expand/Collapse All) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 pt-2">
          <p className="text-xs sm:text-sm font-semibold text-[#C6D4DF]">
            Menampilkan <span className="text-[#66C0F4] font-bold">{filteredFaqs.length}</span> pertanyaan
            {selectedCategory !== 'Semua' && ` dalam "${selectedCategory}"`}
          </p>

          <div className="flex items-center gap-3 text-xs font-bold">
            <button
              onClick={expandAll}
              className="text-[#66C0F4] hover:underline cursor-pointer"
            >
              Buka Semua
            </button>
            <span className="text-[#8A8A8A]">|</span>
            <button
              onClick={collapseAll}
              className="text-[#C6D4DF] hover:underline cursor-pointer"
            >
              Tutup Semua
            </button>
          </div>
        </div>

        {/* Accordion FAQ List */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-12 text-center space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
            <HelpCircle className="w-12 h-12 text-[#8A8A8A] mx-auto" />
            <h3 className="text-lg font-bold text-white">Pertanyaan tidak ditemukan</h3>
            <p className="text-xs sm:text-sm text-[#C6D4DF] max-w-md mx-auto">
              Coba kata kunci pencarian lain atau hubungi admin KAVIO EDU via WhatsApp jika ada hal yang ingin ditanyakan.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className="bg-[#2F3138] border border-white/10 rounded-[3px] p-0 overflow-hidden transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span className="font-bold text-base sm:text-lg text-white">
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-[2px] bg-black/40 text-[#66C0F4] flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#66C0F4]/20 text-[#66C0F4]' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        <div className="p-5 pt-0 border-t border-white/10 bg-black/20 text-[#C6D4DF]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Card */}
        <div className="bg-[#2F3138] border border-white/20 rounded-[4px] p-8 sm:p-10 text-center space-y-4 max-w-3xl mx-auto shadow-[0_6px_16px_rgba(0,0,0,0.6)] text-white">
          <div className="w-12 h-12 rounded-[2px] bg-[#66C0F4]/15 text-[#66C0F4] flex items-center justify-center mx-auto border border-[#66C0F4]/30">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase">
              Masih Memiliki Pertanyaan Lain?
            </h3>
            <p className="text-xs sm:text-sm text-[#C6D4DF] font-normal leading-relaxed max-w-md mx-auto">
              Tim KAVIO EDU siap memberikan penjelasan lebih detail dan membantu memberikan rekomendasi paket belajar yang tepat.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/6282111500190"
              target="_blank"
              rel="noopener noreferrer"
              className="h-[44px] px-6 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center rounded-[2px] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi Gratis via WA</span>
            </a>
            <button
              onClick={() => onNavigate('/register')}
              className="h-[44px] px-6 bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] text-xs font-bold uppercase tracking-wider cursor-pointer w-full sm:w-auto rounded-[2px] transition-all"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-[#171A21] text-white text-xs font-bold border-t border-white/10 mt-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('/')}>
            <Logo className="h-7 w-auto" />
          </div>
          <p className="text-[#C6D4DF] font-medium">&copy; {new Date().getFullYear()} KAVIO Edu. Pusat Bantuan & FAQ.</p>
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-[#66C0F4] transition-colors cursor-pointer uppercase font-bold text-white"
          >
            Halaman Utama
          </button>
        </div>
      </footer>
    </div>
  );
}
