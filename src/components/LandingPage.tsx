import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { UserProfile } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  HelpCircle, 
  Star, 
  ArrowRight, 
  Clock, 
  UserCheck, 
  Users, 
  BookOpen, 
  Target, 
  Sparkles,
  AlertCircle,
  MessageCircle,
  ShieldCheck,
  BarChart3,
  Flame,
  Award,
  Loader2
} from 'lucide-react';
import Packages from './Packages';
import Lenis from 'lenis';
import SplineMascot3D from './SplineMascot3D';
import BadgeCarousel from './BadgeCarousel';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  userProfile?: UserProfile | null;
}

const SCREENSHOT_SLIDES = [
  {
    id: 'dashboard',
    title: 'Dashboard Utama Siswa',
    desc: 'Pantau poin EXP, target harian, streak belajar harian, dan maskot edukatif.',
    image: '/aset/ss/dashboard.png',
    path: 'app.kavio.edu/student'
  },
  {
    id: 'modules',
    title: 'Pustaka Modul Belajar',
    desc: 'Katalog modul pelajaran lengkap dengan simpan favorit dan unduh PDF.',
    image: '/aset/ss/modul.png',
    path: 'app.kavio.edu/modules'
  },
  {
    id: 'assignments',
    title: 'Penugasan Belajar Saya',
    desc: 'Daftar tugas kelas interaktif dengan status pengerjaan dan nilai instan.',
    image: '/aset/ss/tugassoal.png',
    path: 'app.kavio.edu/assignments'
  },
  {
    id: 'evaluation',
    title: 'Lembar Kerja & Evaluasi',
    desc: 'Pengerjaan kuis interaktif dengan umpan balik dan penilaian otomatis real-time.',
    image: '/aset/ss/lembarsoal.png',
    path: 'app.kavio.edu/evaluation'
  },
  {
    id: 'schedule',
    title: 'Jadwal & Bimbingan Belajar',
    desc: 'Kelola jadwal belajar harian dan sesi bimbingan bersama pengajar.',
    image: '/aset/ss/penjadwalan.png',
    path: 'app.kavio.edu/schedule'
  },
  {
    id: 'inbox',
    title: 'Inbox & Pesan Pengumuman',
    desc: 'Terima notifikasi penting, pengumuman kelas, dan pesan dari guru.',
    image: '/aset/ss/inbox.png',
    path: 'app.kavio.edu/inbox'
  }
];

const FAQ_ITEMS = [
  {
    q: '1. Apa itu KAVIO EDU?',
    a: 'KAVIO EDU adalah platform pembelajaran Bahasa Inggris online yang menyediakan kelas Private dan Circle dengan metode belajar yang interaktif, fleksibel, dan disesuaikan dengan kemampuan setiap siswa.'
  },
  {
    q: '2. Siapa saja yang bisa belajar di KAVIO EDU?',
    a: 'KAVIO EDU terbuka untuk Anak-anak, Siswa SD, SMP, SMA, Mahasiswa, dan Umum. Program belajar akan disesuaikan dengan usia, kemampuan, dan tujuan belajar masing-masing peserta.'
  },
  {
    q: '3. Apa perbedaan Private Class dan Circle Class?',
    a: 'Private Class: 1 tutor : 1 siswa, materi disesuaikan, dan jadwal fleksibel. Circle Class: 2–5 siswa, lebih interaktif, biaya lebih hemat, dan cocok untuk latihan komunikasi.'
  },
  {
    q: '4. Apakah saya harus sudah bisa Bahasa Inggris?',
    a: 'Tidak. KAVIO EDU menerima siswa dari tingkat pemula hingga tingkat lanjutan. Tutor akan menyesuaikan materi dengan kemampuan awal setiap siswa.'
  },
  {
    q: '5. Program Bahasa Inggris apa saja yang tersedia?',
    a: 'Program yang tersedia meliputi: General English, English for Kids, Grammar, Speaking, Vocabulary, Reading, Writing, dan Conversation Class.'
  },
  {
    q: '6. Bagaimana sistem pembayarannya?',
    a: 'KAVIO EDU menggunakan sistem paket bulanan. Pembayaran dilakukan di awal sebelum paket dimulai.'
  },
  {
    q: '7. Apakah saya bisa mengubah jadwal belajar?',
    a: 'Bisa. Permintaan reschedule diajukan melalui aplikasi minimal 6 jam sebelum kelas dimulai dan harus mendapatkan persetujuan tutor.'
  },
  {
    q: '8. Bagaimana metode pembelajarannya?',
    a: 'Pembelajaran dilakukan secara interaktif melalui diskusi, latihan, praktik, serta evaluasi berkala agar siswa mampu menggunakan Bahasa Inggris secara aktif.'
  },
  {
    q: '9. Berapa biaya belajar di KAVIO EDU?',
    a: 'Biaya bimbingan disesuaikan dengan jenis kelas (Private atau Circle) dan paket bulanan yang dipilih (Seed, Grow, Boost, atau Master).'
  },
  {
    q: '10. Bagaimana cara mendaftar?',
    a: 'Alur pendaftaran sangat mudah: 1. Pilih paket belajar → 2. Isi formulir pendaftaran → 3. Lakukan pembayaran → 4. Tentukan jadwal → 5. Terima akun KAVIO EDU → 6. Mulai belajar.'
  }
];

const TESTIMONIALS = [
  {
    name: 'Amanda Rizky',
    grade: 'SMA Kelas 12 (Pejuang UTBK)',
    program: 'Private Class',
    text: 'Sejak ikut Private Class di KAVIO EDU, pemahaman Matematika & Fisika saya meningkat pesat. Tutor membimbing dengan sangat sabar dan jadwalnya fleksibel banget!',
    rating: 5
  },
  {
    name: 'Bintang Pratama',
    grade: 'SMP Kelas 9',
    program: 'Circle Class',
    text: 'Belajar di Circle Class seru banget! Teman-temannya asyik, harganya hemat, dan ada kuis interaktif yang bikin mengumpulkan EXP berasa main game.',
    rating: 5
  },
  {
    name: 'Ibu Nurtjahjani',
    grade: 'Orang Tua Siswa SD Kelas 5',
    program: 'Private Class',
    text: 'Sangat terbantu dengan laporan progres real-time KAVIO EDU. Nilai rapor anak saya meningkat signifikan dan anak jadi lebih aktif belajar tanpa perlu dipaksa.',
    rating: 5
  }
];

export default function LandingPage({ onNavigate, userProfile }: LandingPageProps) {
  const isLoggedIn = !!userProfile;
  const dashboardPath = userProfile?.role === 'teacher' ? '/teacher' : '/student';
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Trigger loader when switching slides
  useEffect(() => {
    setIsImageLoading(true);
  }, [currentSlideIndex]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  // Track scroll position for sticky header state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 130) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for Scroll Spy
  useEffect(() => {
    const sectionIds = ['hero', 'masalah', 'solusi', 'keunggulan', 'metode', 'program', 'paket', 'tampilan-aplikasi', 'testimoni', 'faq', 'kontak'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    setLenisInstance(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleSmoothScroll = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      if (lenisInstance) {
        lenisInstance.scrollTo(element, { offset: -80, duration: 1.4 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % SCREENSHOT_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + SCREENSHOT_SLIDES.length) % SCREENSHOT_SLIDES.length);
  };

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -250) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 250) {
      prevSlide();
    }
  };

  const activeSlide = SCREENSHOT_SLIDES[currentSlideIndex];

  const NAV_ITEMS = [
    { id: 'keunggulan', label: 'Keunggulan' },
    { id: 'metode', label: 'Alur Belajar' },
    { id: 'program', label: 'Program' },
    { id: 'paket', label: 'Paket Belajar' },
    { id: 'testimoni', label: 'Testimoni' },
    { id: 'faq', label: 'FAQ' },
    { id: 'kontak', label: 'Kontak' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#4B4B4B] flex flex-col font-sans selection:bg-[#58CC02] selection:text-white max-w-full overflow-x-hidden pb-16 lg:pb-0">
      {/* Navigation Header - Sticky Floating Glassmorphism Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-md py-3'
            : 'bg-transparent border-b-0 shadow-none py-5'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo inside Sticky Header */}
          <div 
            className="flex items-center cursor-pointer transition-all duration-300"
            onClick={() => onNavigate('/')}
          >
            <Logo className="h-8 sm:h-9 w-auto" />
          </div>

          {/* Nav Links with Scroll Spy Active Indicators */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSmoothScroll(item.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#1CB0F6]/10 text-[#0284C7] font-extrabold border border-[#1CB0F6]/30'
                      : 'text-[#3C3C3C] hover:text-[#1CB0F6] font-bold hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={() => onNavigate(dashboardPath)}
                className="btn-duo-green h-[44px] px-5 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Ke Dashboard Saya
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/login')}
                  className="btn-duo-slate h-[44px] px-4 text-xs font-bold uppercase tracking-wider cursor-pointer hidden sm:block"
                >
                  Masuk
                </button>
                <button
                  onClick={() => onNavigate('/register')}
                  className="btn-duo-green h-[44px] px-5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Daftar Sekarang
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section id="hero" className="relative overflow-hidden pt-24 pb-16 lg:pt-28 lg:pb-24 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* Left Column: 45% Desktop Content */}
            <div className="lg:col-span-6 space-y-6 text-left relative z-20">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#58CC02]/10 text-[#16A34A] font-bold text-xs uppercase tracking-wider border border-[#58CC02]/20">
                <Sparkles className="w-4 h-4 text-[#58CC02]" />
                PLATFORM BELAJAR TERPADU
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase leading-[1.15]">
                Naik Level Bahasa Inggrismu Bersama <span className="text-[#1CB0F6]">KAVIO EDU</span>.
              </h1>

              <p className="text-base sm:text-lg text-[#3C3C3C] font-medium leading-relaxed max-w-xl">
                Belajar lebih terarah dengan bimbingan tutor personal, kelas Private & Circle, modul interaktif, dan progres yang terpantau nyata.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('/register')}
                  className="btn-duo-green h-[50px] px-7 text-[15px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleSmoothScroll('program')}
                  className="btn-duo-slate h-[50px] px-6 text-[15px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Lihat Program</span>
                </button>
              </div>

              {/* Quick Value Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <Clock className="w-4 h-4 text-[#1CB0F6] mx-auto mb-1" />
                  <span className="text-xs font-bold text-[#3C3C3C] block">Jadwal Fleksibel</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <UserCheck className="w-4 h-4 text-[#58CC02] mx-auto mb-1" />
                  <span className="text-xs font-bold text-[#3C3C3C] block">Tutor Personal</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <Users className="w-4 h-4 text-[#FF9600] mx-auto mb-1" />
                  <span className="text-xs font-bold text-[#3C3C3C] block">Private & Circle</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <Target className="w-4 h-4 text-[#0284C7] mx-auto mb-1" />
                  <span className="text-xs font-bold text-[#3C3C3C] block">Materi Terarah</span>
                </div>
              </div>
            </div>

            {/* Right Column: Mascot (Background on Mobile, Grid Column on Desktop) */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-end justify-end overflow-hidden opacity-[0.15] lg:relative lg:inset-auto lg:col-span-6 lg:flex lg:items-center lg:justify-center lg:min-h-[400px] sm:lg:min-h-[480px] lg:opacity-100 lg:pointer-events-auto lg:overflow-visible">
              <div className="w-[320px] h-[320px] translate-x-12 translate-y-12 lg:w-full lg:max-w-none lg:h-[500px] lg:translate-x-8 lg:translate-y-6 lg:scale-125 flex items-center justify-center relative">
                <SplineMascot3D className="w-full h-full object-contain blur-[2px] lg:blur-none drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section id="masalah" className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-[#FF4B4B]/10 text-[#FF4B4B] font-bold text-xs uppercase tracking-wider border border-[#FF4B4B]/20">
              <AlertCircle className="w-4 h-4" />
              Tantangan Belajar Siswa
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
              Apakah Kamu Sering Mengalami Kendala Belajar Ini?
            </h2>
            <p className="text-base text-[#3C3C3C] font-medium leading-relaxed">
              Banyak siswa merasa kesulitan berkembang karena metode belajar konvensional yang tidak memperhatikan kebutuhan individual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-duo !bg-white p-6 space-y-3 border-l-4 border-l-[#FF4B4B]">
              <div className="w-10 h-10 rounded-xl bg-[#FF4B4B]/10 text-[#FF4B4B] font-bold flex items-center justify-center">
                01
              </div>
              <h3 className="text-lg font-bold text-[#3C3C3C]">Sulit Memahami Pelajaran</h3>
              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Penjelasan guru di sekolah sering kali terlalu cepat dan tidak ada waktu untuk bertanya secara mendalam.
              </p>
            </div>

            <div className="card-duo !bg-white p-6 space-y-3 border-l-4 border-l-[#FF4B4B]">
              <div className="w-10 h-10 rounded-xl bg-[#FF4B4B]/10 text-[#FF4B4B] font-bold flex items-center justify-center">
                02
              </div>
              <h3 className="text-lg font-bold text-[#3C3C3C]">Kurang Percaya Diri Saat Ujian</h3>
              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Merasa cemas dan ragu saat mengerjakan soal kuis atau ujian karena latihan soal yang terbatas.
              </p>
            </div>

            <div className="card-duo !bg-white p-6 space-y-3 border-l-4 border-l-[#FF4B4B]">
              <div className="w-10 h-10 rounded-xl bg-[#FF4B4B]/10 text-[#FF4B4B] font-bold flex items-center justify-center">
                03
              </div>
              <h3 className="text-lg font-bold text-[#3C3C3C]">Jadwal Les Kaku & Bentrok</h3>
              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Jadwal tempat les biasa kaku sehingga sering bentrok dengan kegiatan sekolah dan ekskul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section id="solusi" className="py-16 sm:py-20 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-[#58CC02]/10 text-[#16A34A] font-bold text-xs uppercase tracking-wider border border-[#58CC02]/20">
              <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
              Solusi Terbaik KAVIO EDU
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
              Bagaimana KAVIO EDU Membantumu Berprestasi
            </h2>
            <p className="text-base text-[#3C3C3C] font-medium leading-relaxed">
              Kami menggabungkan bimbingan tutor personal dengan platform digital interaktif untuk memberikan pengalaman belajar terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-duo-interactive !bg-white p-6 space-y-3">
              <UserCheck className="w-8 h-8 text-[#58CC02]" />
              <h3 className="text-lg font-bold text-[#3C3C3C]">Pendampingan Tutor Personal</h3>
              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Tutor membimbing secara sabar dan fokus pada area materi yang paling kamu butuhkan.
              </p>
            </div>

            <div className="card-duo-interactive !bg-white p-6 space-y-3">
              <Clock className="w-8 h-8 text-[#1CB0F6]" />
              <h3 className="text-lg font-bold text-[#3C3C3C]">Jadwal Bebas & Fleksibel</h3>
              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Tentukan hari dan jam bimbingan sesuai waktu luangmu tanpa takut bentrok acara.
              </p>
            </div>

            <div className="card-duo-interactive !bg-white p-6 space-y-3">
              <BarChart3 className="w-8 h-8 text-[#FF9600]" />
              <h3 className="text-lg font-bold text-[#3C3C3C]">Progres Belajar Terpantau</h3>
              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Hasil evaluasi, nilai kuis, dan grafik EXP dapat diakses secara transparan real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE KAVIO EDU */}
      <section id="keunggulan" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-xl bg-[#1CB0F6]/10 text-[#0284C7] font-bold text-xs uppercase tracking-wider border border-[#1CB0F6]/20">
              Solusi Belajar Terintegrasi
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
              Tiga Pilar Utama Pengalaman Belajar di KAVIO Edu
            </h2>
            <p className="text-base text-[#3C3C3C] font-medium leading-relaxed">
              Semua fasilitas belajar dirancang agar siswa semakin aktif, paham materi, dan bersemangat meningkatkan pencapaian akademik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div id="modul" className="card-duo-interactive !bg-white space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#58CC02] text-white font-bold text-lg flex items-center justify-center border-b-4 border-[#46A302]">
                01
              </div>
              <h3 className="text-xl font-bold text-[#3C3C3C] font-display uppercase tracking-wide">Pustaka Modul Belajar & Download PDF</h3>
              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Akses katalog materi pelajaran terlengkap untuk semua jenjang (Elementary, Junior, Senior). Siswa dapat menyimpan modul ke daftar <span className="font-bold text-[#0284C7]">Favorit Saya</span> serta mengunduh berkas PDF untuk dibaca kapan saja secara offline.
              </p>
            </div>

            <div className="card-duo-interactive !bg-white space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#1CB0F6] text-white font-bold text-lg flex items-center justify-center border-b-4 border-[#0092E0]">
                02
              </div>
              <h3 className="text-xl font-bold text-[#3C3C3C] font-display uppercase tracking-wide">Penugasan Terotomatisasi & Penilaian Instant</h3>
              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Guru mengirimkan tugas dan kuis interaktif langsung lewat aplikasi. Siswa mengerjakan secara real-time dan mendapatkan skor serta umpan balik penilaian otomatis secara instant dari sistem.
              </p>
            </div>

            <div className="card-duo-interactive !bg-white space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF9600] text-white font-bold text-lg flex items-center justify-center border-b-4 border-[#E58500]">
                03
              </div>
              <h3 className="text-xl font-bold text-[#3C3C3C] font-display uppercase tracking-wide">Sistem Leveling & Rangking Seperti Game</h3>
              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Semakin banyak tugas yang diselesaikan dengan benar dan streak belajar yang dijaga, semakin cepat siswa mengumpulkan EXP, menaikkan level akun, dan mendaki tangga Papan Peringkat (Leaderboard).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LEARNING PROCESS */}
      <section id="metode" className="py-16 sm:py-20 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-xl bg-[#58CC02]/10 text-[#16A34A] font-bold text-xs uppercase tracking-wider border border-[#58CC02]/20">
              Alur Pembelajaran
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
              5 Langkah Mudah Dimulai di KAVIO EDU
            </h2>
            <p className="text-base text-[#3C3C3C] font-medium leading-relaxed">
              Proses pendaftaran yang sederhana dan terstruktur agar siswa dapat langsung memulai bimbingan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="card-duo !bg-white p-5 space-y-3 text-center">
              <span className="w-8 h-8 rounded-full bg-[#1CB0F6] text-white font-extrabold text-sm flex items-center justify-center mx-auto">1</span>
              <h4 className="font-bold text-base text-[#3C3C3C]">Daftar Akun</h4>
              <p className="text-xs text-[#4B4B4B]">Buat akun siswa atau hubungi admin via WhatsApp.</p>
            </div>

            <div className="card-duo !bg-white p-5 space-y-3 text-center">
              <span className="w-8 h-8 rounded-full bg-[#1CB0F6] text-white font-extrabold text-sm flex items-center justify-center mx-auto">2</span>
              <h4 className="font-bold text-base text-[#3C3C3C]">Pilih Program</h4>
              <p className="text-xs text-[#4B4B4B]">Tentukan kelas Private 1-on-1 atau Circle Class.</p>
            </div>

            <div className="card-duo !bg-white p-5 space-y-3 text-center">
              <span className="w-8 h-8 rounded-full bg-[#1CB0F6] text-white font-extrabold text-sm flex items-center justify-center mx-auto">3</span>
              <h4 className="font-bold text-base text-[#3C3C3C]">Tentukan Jadwal</h4>
              <p className="text-xs text-[#4B4B4B]">Pilih hari dan jam belajar yang paling cocok.</p>
            </div>

            <div className="card-duo !bg-white p-5 space-y-3 text-center">
              <span className="w-8 h-8 rounded-full bg-[#1CB0F6] text-white font-extrabold text-sm flex items-center justify-center mx-auto">4</span>
              <h4 className="font-bold text-base text-[#3C3C3C]">Mulai Belajar</h4>
              <p className="text-xs text-[#4B4B4B]">Dapatkan bimbingan intensif dari tutor personal.</p>
            </div>

            <div className="card-duo !bg-white p-5 space-y-3 text-center">
              <span className="w-8 h-8 rounded-full bg-[#58CC02] text-white font-extrabold text-sm flex items-center justify-center mx-auto">5</span>
              <h4 className="font-bold text-base text-[#3C3C3C]">Pantau Progres</h4>
              <p className="text-xs text-[#4B4B4B]">Lacak hasil nilai kuis dan kenaikan level EXP.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROGRAM BELAJAR */}
      <section id="program" className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-xl bg-[#1CB0F6]/10 text-[#0284C7] font-bold text-xs uppercase tracking-wider border border-[#1CB0F6]/20">
              Format Pembelajaran
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
              Program Belajar Sesuai Kebutuhan Siswa
            </h2>
            <p className="text-base text-[#3C3C3C] font-medium leading-relaxed">
              Dua format bimbingan yang dirancang untuk efektivitas maksimal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Private Class Card */}
            <div className="card-duo-interactive !bg-white p-8 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center border-b-4 border-[#0092E0]">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#3C3C3C] uppercase">Private Class (1-on-1)</h3>
              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Bimbingan belajar personal 1-on-1 dengan perhatian 100% dari tutor. Sangat cocok bagi siswa yang membutuhkan pendampingan intensif.
              </p>
              <ul className="space-y-2 text-xs font-bold text-[#3C3C3C]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
                  <span>Jadwal 100% Fleksibel</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
                  <span>Materi Disesuaikan Kebutuhan Siswa</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
                  <span>Pendampingan Spesifik Ujian & UTBK</span>
                </li>
              </ul>
              <button
                onClick={() => handleSmoothScroll('paket')}
                className="w-full btn-duo-blue h-[48px] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Pilih Private Class
              </button>
            </div>

            {/* Circle Class Card */}
            <div className="card-duo-interactive !bg-white p-8 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[#58CC02] text-white flex items-center justify-center border-b-4 border-[#46A302]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#3C3C3C] uppercase">Circle Class (Kelompok Kecil)</h3>
              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Belajar kelompok kecil (3-5 siswa) dengan suasana interaktif yang seru dan biaya yang jauh lebih hemat.
              </p>
              <ul className="space-y-2 text-xs font-bold text-[#3C3C3C]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
                  <span>Maksimal 3-5 Siswa Per Kelompok</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
                  <span>Biaya Bulanan Lebih Terjangkau</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
                  <span>Diskusi Belajar Aktif & Menyenangkan</span>
                </li>
              </ul>
              <button
                onClick={() => handleSmoothScroll('paket')}
                className="w-full btn-duo-green h-[48px] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Pilih Circle Class
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section id="paket" className="py-16 sm:py-20 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-xl bg-[#58CC02]/10 text-[#16A34A] font-bold text-xs uppercase tracking-wider border border-[#58CC02]/20">
              Pilihan Paket & Harga
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
              Investasi Belajar Transparan
            </h2>
            <p className="text-base text-[#3C3C3C] font-medium leading-relaxed">
              Pilih Paket Private atau Circle sesuai kebutuhan belajarmu.
            </p>
          </div>

          <Packages 
            isLandingPage={true} 
            onNavigateToContact={() => handleSmoothScroll('kontak')} 
          />
        </div>
      </section>

      {/* 8. GALLERY / APP SHOWCASE */}
      <section id="tampilan-aplikasi" className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-xl bg-[#1CB0F6]/10 text-[#0284C7] font-bold text-xs uppercase tracking-wider border border-[#1CB0F6]/20">
              Antarmuka Aplikasi
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
              Galeri Tampilan Aplikasi KAVIO Edu
            </h2>
            <p className="text-base text-[#3C3C3C] font-medium leading-relaxed">
              Jelajahi kejelasan antarmuka yang bersih, ramah pengguna, dan interaktif pada setiap halaman utama aplikasi.
            </p>
          </div>

          {/* Screenshot Photo Slider Container */}
          <div className="bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 rounded-2xl p-3 sm:p-4 max-w-5xl mx-auto relative group shadow-md">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3 px-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF4B4B]" />
                <div className="w-3 h-3 rounded-full bg-[#FFC800]" />
                <div className="w-3 h-3 rounded-full bg-[#58CC02]" />
              </div>
              <div className="px-4 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-[#3C3C3C] border border-slate-200 truncate max-w-[240px] sm:max-w-md text-center">
                {activeSlide.path}
              </div>
              <div className="w-10" />
            </div>

            {/* Main Interactive Touch/Drag Swipe Image Frame - FIXED Container Size */}
            <motion.div
              key={currentSlideIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={handleDragEnd}
              className="relative h-[280px] xs:h-[340px] sm:h-[460px] md:h-[520px] lg:h-[580px] w-full rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 cursor-grab active:cursor-grabbing touch-pan-y select-none"
            >
              {/* Image Loading Spinner Overlay */}
              {isImageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-slate-100/90 backdrop-blur-2xs z-20 animate-fadeIn">
                  <Loader2 className="w-8 h-8 text-[#1CB0F6] animate-spin" />
                  <span className="text-xs font-bold text-[#3C3C3C] uppercase tracking-wider">Memuat Tampilan...</span>
                </div>
              )}

              {/* Main Screenshot Image */}
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                draggable={false}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
                className={`w-full h-full object-contain object-top rounded-xl transition-opacity duration-300 pointer-events-none ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
              />

              {/* Prev Floating Arrow Button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 btn-duo-slate p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md opacity-80 hover:opacity-100 z-30"
                title="Slide Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Floating Arrow Button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 btn-duo-slate p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md opacity-80 hover:opacity-100 z-30"
                title="Slide Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Description Card OUTSIDE Below Image */}
            <div className="card-duo mt-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 !bg-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-[#1CB0F6]/10 text-[#0284C7] px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                    {currentSlideIndex + 1} dari {SCREENSHOT_SLIDES.length}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-[#3C3C3C] font-display uppercase tracking-wide">
                    {activeSlide.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#4B4B4B] font-medium leading-relaxed">
                  {activeSlide.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-center sm:self-auto">
                {SCREENSHOT_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentSlideIndex === idx ? 'w-7 bg-[#1CB0F6]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Ke slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIAL SECTION */}
      <section id="testimoni" className="py-16 sm:py-20 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-xl bg-[#FF9600]/10 text-[#FF9600] font-bold text-xs uppercase tracking-wider border border-[#FF9600]/20">
              Bukti Sosial & Testimoni
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
              Kisah Sukses Siswa KAVIO EDU
            </h2>
            <p className="text-base text-[#3C3C3C] font-medium leading-relaxed">
              Dengarkan ulasan jujur dari siswa dan orang tua yang telah menguji keunggulan bimbingan KAVIO EDU.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item, idx) => (
              <div key={idx} className="card-duo !bg-white p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#FF9600]">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed italic">
                    "{item.text}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-base text-[#3C3C3C]">{item.name}</h4>
                  <p className="text-xs font-bold text-[#1CB0F6]">{item.grade} • {item.program}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section id="faq" className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-[#1CB0F6]/10 text-[#0284C7] font-bold text-xs uppercase tracking-wider border border-[#1CB0F6]/20">
              <HelpCircle className="w-4 h-4" />
              Pertanyaan Umum (FAQ)
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
              Semua yang Perlu Kamu Ketahui
            </h2>
            <p className="text-base text-[#3C3C3C] font-medium leading-relaxed">
              Temukan jawaban cepat atas pertanyaan seputar pendaftaran, sistem belajar, dan bimbingan.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="card-duo !bg-white p-0 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base text-[#3C3C3C] hover:text-[#1CB0F6] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 text-[#1CB0F6] shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5 text-sm text-[#4B4B4B] font-medium leading-relaxed border-t border-slate-100 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Tombol PERTANYAAN LAINNYA -> Navigasi ke /faq */}
          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('/faq')}
              className="btn-duo-blue h-[50px] px-8 text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              id="view-all-faq-button"
            >
              <HelpCircle className="w-4 h-4" />
              <span>PERTANYAAN LAINNYA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 11. CALL TO ACTION & CONTACT SECTION */}
      <section id="kontak" className="py-16 sm:py-20 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-xl bg-[#58CC02]/10 text-[#16A34A] font-bold text-xs uppercase tracking-wider border border-[#58CC02]/20">
              Mulai Langkah Belajarmu
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
              Siap Meningkatkan Hasil Belajarmu Bersama KAVIO EDU?
            </h2>
            <p className="text-base text-[#3C3C3C] font-medium leading-relaxed max-w-2xl mx-auto">
              Konsultasikan kebutuhan belajarmu sekarang atau langsung buat akun untuk memulai bimbingan bersama tutor personal terbaik.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => onNavigate('/register')}
              className="w-full sm:w-auto btn-duo-green h-[50px] px-8 text-[15px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Daftar Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="https://wa.me/6282111500190"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto btn-duo-blue h-[50px] px-8 text-[15px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Konsultasi WA</span>
            </a>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto pt-6">
            {/* Contact 1 */}
            <div className="card-duo !bg-white p-6 space-y-4 text-center">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-[#15803D] border border-emerald-200 inline-block uppercase">
                Founder KAVIO Edu
              </span>
              <h3 className="text-xl font-bold text-[#3C3C3C]">Fatih Farhat</h3>
              <p className="text-xs font-bold text-[#4B4B4B]">Konsultasi Utama & Kerjasama</p>
              <a
                href="https://wa.me/6282111500190"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-duo-green h-[44px] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Chat via WhatsApp</span>
              </a>
            </div>

            {/* Contact 2 */}
            <div className="card-duo !bg-white p-6 space-y-4 text-center">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-sky-50 text-[#0284C7] border border-sky-200 inline-block uppercase">
                Customer Service
              </span>
              <h3 className="text-xl font-bold text-[#3C3C3C]">Eni Eka Riyanti</h3>
              <p className="text-xs font-bold text-[#4B4B4B]">Layanan Pelanggan & Informasi</p>
              <a
                href="https://wa.me/6283813838883"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-duo-blue h-[44px] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white text-[#3C3C3C] text-xs font-bold border-t border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('/')}>
            <Logo className="h-7 w-auto" />
          </div>
          <p className="text-[#4B4B4B] font-medium">&copy; {new Date().getFullYear()} KAVIO Edu. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/faq')} className="hover:text-[#1CB0F6] transition-colors cursor-pointer uppercase font-bold">FAQ</button>
            <button onClick={() => onNavigate('/terms')} className="hover:text-[#1CB0F6] transition-colors cursor-pointer uppercase font-bold">Syarat & Ketentuan</button>
            <button onClick={() => onNavigate('/blog')} className="hover:text-[#1CB0F6] transition-colors cursor-pointer uppercase font-bold">Blog</button>
            <button onClick={() => onNavigate('/login')} className="hover:text-[#1CB0F6] transition-colors cursor-pointer uppercase font-bold">Masuk</button>
            <button onClick={() => onNavigate('/register')} className="hover:text-[#1CB0F6] transition-colors cursor-pointer uppercase font-bold">Daftar</button>
          </div>
        </div>
      </footer>

      {/* STICKY WHATSAPP FLOATING BUTTON (Always visible at bottom right) */}
      <a
        href="https://wa.me/6282111500190"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all group"
        aria-label="Konsultasi WhatsApp"
        title="Konsultasi Gratis via WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF4B4B] rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF4B4B] rounded-full border-2 border-white" />
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>

      {/* FLOATING MOBILE CTA BAR (Sticky on Mobile screens bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold text-[#1CB0F6] uppercase tracking-wider">KAVIO EDU</span>
          <span className="text-xs font-bold text-[#3C3C3C] truncate">Bimbingan Belajar Terpadu</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://wa.me/6282111500190"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-duo-blue h-[38px] px-3 text-xs font-bold flex items-center gap-1"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WA</span>
          </a>
          <button
            onClick={() => onNavigate('/register')}
            className="btn-duo-green h-[38px] px-3.5 text-xs font-bold uppercase tracking-wider"
          >
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}
