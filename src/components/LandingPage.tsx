import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { UserProfile } from '../types';
import { RANK_TIERS } from '../utils/leveling';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Packages from './Packages';
import Lenis from 'lenis';
import SplineMascot3D from './SplineMascot3D';
import BadgeCarousel from './BadgeCarousel';

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

export default function LandingPage({ onNavigate, userProfile }: LandingPageProps) {
  const isLoggedIn = !!userProfile;
  const dashboardPath = userProfile?.role === 'teacher' ? '/teacher' : '/student';
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

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
    const sectionIds = ['keunggulan', 'modul', 'tampilan-aplikasi', 'badge-leveling', 'paket', 'kontak'];
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

  const activeSlide = SCREENSHOT_SLIDES[currentSlideIndex];

  const NAV_ITEMS = [
    { id: 'keunggulan', label: 'Keunggulan' },
    { id: 'modul', label: 'Pustaka Modul' },
    { id: 'tampilan-aplikasi', label: 'Tampilan Aplikasi' },
    { id: 'badge-leveling', label: 'Badge Leveling' },
    { id: 'paket', label: 'Paket Belajar' },
    { id: 'kontak', label: 'Kontak' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#4B4B4B] flex flex-col font-sans selection:bg-[#58CC02] selection:text-white">
      {/* Navigation Header - Sticky Floating Glassmorphism Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-md border-b-2 border-slate-200 shadow-md py-3'
            : 'bg-transparent border-b-0 shadow-none py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo inside Sticky Header - Hidden at Hero Top, Fades in when Scrolled */}
          <div 
            className={`flex items-center cursor-pointer transition-all duration-300 ${
              isScrolled ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95 pointer-events-none'
            }`} 
            onClick={() => onNavigate('/')}
          >
            <Logo className="h-8 sm:h-9 w-auto" />
          </div>

          {/* Nav Links with Scroll Spy Active Indicators */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSmoothScroll(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#1CB0F6]/10 text-[#0284C7] font-black border border-[#1CB0F6]/30 shadow-2xs scale-105'
                      : 'text-slate-700 hover:text-slate-900 font-bold hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => onNavigate('/blog')}
              className="px-3.5 py-1.5 text-slate-700 hover:text-slate-900 font-bold hover:bg-slate-100/70 rounded-xl transition-all duration-300 cursor-pointer"
            >
              Blog
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={() => onNavigate(dashboardPath)}
                className="btn-duo-green px-5 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Ke Dashboard Saya
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/login')}
                  className="btn-duo-slate px-4 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  onClick={() => onNavigate('/register')}
                  className="btn-duo-green px-5 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Daftar Gratis
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-28 lg:pb-24 bg-[#F8FAFC] border-b-4 border-b-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* Left Content Column (45% - col-span-5) - Layered ALWAYS above mascot */}
            <div className="lg:col-span-5 text-left space-y-5 relative z-20">
              {/* KAVIO EDU Logo inside Hero Section (Primary Logo when at top) */}
              <div className="flex items-center cursor-pointer" onClick={() => onNavigate('/')}>
                <Logo className="h-10 sm:h-12 w-auto" />
              </div>

              {/* Plain Typography Tagline */}
              <span className="text-[#0284C7] font-black text-xs sm:text-sm uppercase tracking-widest block font-sans">
                PLATFORM BELAJAR TERPADU
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-slate-900 tracking-tight leading-tight uppercase text-left">
                Naik Level <span className="text-[#58CC02]">Bahasa Inggrismu</span> Bersama <span className="text-[#1CB0F6]">KAVIO EDU</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-bold leading-relaxed text-left">
                Belajar lebih terarah dengan modul interaktif, latihan harian, dan sistem progres yang membuat perkembanganmu terlihat nyata.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-start gap-4">
                {isLoggedIn ? (
                  <button
                    onClick={() => onNavigate(dashboardPath)}
                    className="btn-duo-green px-8 py-4 text-sm font-black uppercase tracking-wider cursor-pointer w-full sm:w-auto shadow-lg"
                  >
                    Buka Dashboard Utama
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onNavigate('/register')}
                      className="btn-duo-green px-8 py-4 text-sm font-black uppercase tracking-wider cursor-pointer w-full sm:w-auto shadow-lg"
                    >
                      Mulai Belajar Sekarang
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSmoothScroll('tampilan-aplikasi')}
                      className="btn-duo-blue px-8 py-4 text-sm font-black uppercase tracking-wider cursor-pointer w-full sm:w-auto shadow-lg"
                    >
                      Lihat Tampilan Aplikasi
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Full 55% Hero Illustration (col-span-7) - Layered behind text */}
            <div className="lg:col-span-7 flex justify-end items-end relative min-h-[460px] sm:min-h-[580px] lg:min-h-[660px] -mr-4 sm:-mr-8 lg:-mr-12 z-10 pointer-events-none">
              <SplineMascot3D className="w-full h-full" />
            </div>

          </div>
        </div>
      </section>

      {/* Keunggulan Utama Section - Duolingo 3D Cards */}
      <section id="keunggulan" className="py-20 bg-white border-b-4 border-b-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#1CB0F6]/10 text-[#0284C7] font-black text-xs uppercase tracking-wider border border-[#0284C7]/20">
              Solusi Belajar Terintegrasi
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight uppercase">
              Tiga Pilar Utama Pengalaman Belajar di KAVIO Edu
            </h2>
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
              Semua fasilitas belajar dirancang agar siswa semakin aktif, paham materi, dan bersemangat meningkatkan pencapaian akademik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Keunggulan 1: Pustaka Modul & PDF */}
            <div id="modul" className="bg-[#F8FAFC] border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#58CC02] text-white font-black text-lg flex items-center justify-center border-b-4 border-b-[#46A302] shadow-sm">
                01
              </div>
              <h3 className="text-xl font-black text-slate-900 font-display uppercase tracking-wide">Pustaka Modul Belajar & Download PDF</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                Akses katalog materi pelajaran terlengkap untuk semua jenjang (Elementary, Junior, Senior). Siswa dapat menyimpan modul ke daftar <span className="font-extrabold text-[#0284C7]">Favorit Saya</span> serta mengunduh berkas PDF untuk dibaca kapan saja secara offline.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-[11px] font-black text-slate-800 uppercase shadow-2xs">Download PDF</span>
                <span className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-[11px] font-black text-slate-800 uppercase shadow-2xs">Simpan Favorit</span>
              </div>
            </div>

            {/* Keunggulan 2: Penugasan Otomatis */}
            <div className="bg-[#F8FAFC] border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#1CB0F6] text-white font-black text-lg flex items-center justify-center border-b-4 border-b-[#0092E0] shadow-sm">
                02
              </div>
              <h3 className="text-xl font-black text-slate-900 font-display uppercase tracking-wide">Penugasan Terotomatisasi & Penilaian Instant</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                Guru mengirimkan tugas dan kuis interaktif langsung lewat aplikasi. Siswa mengerjakan secara real-time dan mendapatkan skor serta umpan balik penilaian otomatis secara instant dari sistem.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-[11px] font-black text-slate-800 uppercase shadow-2xs">Kuis Interaktif</span>
                <span className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-[11px] font-black text-slate-800 uppercase shadow-2xs">Nilai Otomatis</span>
              </div>
            </div>

            {/* Keunggulan 3: Leveling & Rangking */}
            <div className="bg-[#F8FAFC] border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#FF9600] text-white font-black text-lg flex items-center justify-center border-b-4 border-b-[#E58500] shadow-sm">
                03
              </div>
              <h3 className="text-xl font-black text-slate-900 font-display uppercase tracking-wide">Sistem Leveling & Rangking Seperti Game</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                Semakin banyak tugas yang diselesaikan dengan benar dan streak belajar yang dijaga, semakin cepat siswa mengumpulkan EXP, menaikkan level akun, dan mendaki tangga Papan Peringkat (Leaderboard).
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-[11px] font-black text-slate-800 uppercase shadow-2xs">Poin EXP</span>
                <span className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-[11px] font-black text-slate-800 uppercase shadow-2xs">Leaderboard Rangking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badge Leveling & Rangking Showcase - 3D Swipeable Carousel */}
      <section id="badge-leveling" className="py-20 bg-[#F8FAFC] border-b-4 border-b-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#FF9600]/10 text-[#D97706] font-black text-xs uppercase tracking-wider border border-[#D97706]/20">
              Sistem Leveling Gamifikasi
            </span>
            <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight uppercase">
              Tingkatan Badge Rangking Akun Siswa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-bold leading-relaxed">
              Kumpulkan poin EXP dari setiap pengerjaan lembar kerja harian untuk membuka badge peringkat bergengsi dari Novice hingga Immortal.
            </p>
          </div>

          {/* Render 3D Swipeable Badge Carousel */}
          <BadgeCarousel />
        </div>
      </section>

      {/* Section Screenshot Slide Photo Carousel - Duolingo 3D Browser Frame */}
      <section id="tampilan-aplikasi" className="py-20 bg-white border-b-4 border-b-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#58CC02]/10 text-[#16A34A] font-black text-xs uppercase tracking-wider border border-[#16A34A]/20">
              Antarmuka Aplikasi
            </span>
            <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight uppercase">
              Galeri Tampilan Aplikasi KAVIO Edu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-bold leading-relaxed">
              Jelajahi kejelasan antarmuka yang bersih, ramah pengguna, dan interaktif pada setiap halaman utama aplikasi.
            </p>
          </div>

          {/* Slide Category Buttons */}
          <div className="flex justify-center gap-3 flex-wrap">
            {SCREENSHOT_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(index)}
                className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer ${
                  currentSlideIndex === index
                    ? 'btn-duo-blue'
                    : 'btn-duo-slate'
                }`}
              >
                {slide.title}
              </button>
            ))}
          </div>

          {/* Screenshot Photo Slider Container - Duolingo 3D Frame */}
          <div className="bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-3 sm:p-5 max-w-6xl mx-auto relative group shadow-xl">
            {/* Top Browser Bar */}
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF4B4B] border border-red-600" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFC800] border border-amber-600" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#58CC02] border border-green-700" />
              </div>
              <div className="px-5 py-1.5 bg-[#F8FAFC] rounded-xl text-xs font-mono font-bold text-slate-700 border-2 border-slate-200">
                {activeSlide.path}
              </div>
              <div className="w-12" />
            </div>

            {/* Main Screenshot Image Frame with Controls */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border-2 border-slate-200">
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                className="w-full h-auto object-cover rounded-xl transition-all duration-300"
              />

              {/* Prev Button */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 btn-duo-slate p-3 rounded-2xl transition-all active:scale-90 cursor-pointer shadow-lg"
                title="Slide Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 btn-duo-slate p-3 rounded-2xl transition-all active:scale-90 cursor-pointer shadow-lg"
                title="Slide Selanjutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Description Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border-2 border-slate-200 text-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div>
                  <h4 className="font-black text-sm text-slate-900 uppercase font-display">{activeSlide.title}</h4>
                  <p className="text-xs text-slate-600 font-bold mt-0.5">{activeSlide.desc}</p>
                </div>
                <span className="text-xs font-mono font-black bg-[#1CB0F6] text-white px-3 py-1 rounded-xl uppercase shrink-0">
                  {currentSlideIndex + 1} / {SCREENSHOT_SLIDES.length}
                </span>
              </div>
            </div>

            {/* Slider Dots Indicator */}
            <div className="flex justify-center items-center gap-2 pt-4">
              {SCREENSHOT_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-3 rounded-full transition-all cursor-pointer ${
                    currentSlideIndex === idx ? 'w-8 bg-[#1CB0F6]' : 'w-3 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Ke slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Paket Belajar KAVIO Edu */}
      <section id="paket" className="py-20 bg-[#F8FAFC] border-b-4 border-b-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#58CC02]/10 text-[#16A34A] font-black text-xs uppercase tracking-wider border border-[#16A34A]/20">
              Pilihan Paket & Investasi Belajar
            </span>
            <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight uppercase">
              Paket Belajar Sesuai Kebutuhan Siswa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-bold leading-relaxed">
              Pilih Paket Private untuk bimbingan personal intensif atau Paket Circle untuk pengalaman belajar kelompok interaktif yang hemat dan menyenangkan.
            </p>
          </div>

          {/* Render Packages Component */}
          <Packages 
            isLandingPage={true} 
            onNavigateToContact={() => handleSmoothScroll('kontak')} 
          />
        </div>
      </section>

      {/* Section Kontak WhatsApp & Layanan Pendaftaran */}
      <section id="kontak" className="py-20 bg-white border-b-4 border-b-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#1CB0F6]/10 text-[#0284C7] font-black text-xs uppercase tracking-wider border border-[#0284C7]/20">
              Hubungi Tim KAVIO Edu
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight uppercase">
              Konsultasi & Informasi Pendaftaran Paket
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-bold leading-relaxed max-w-xl mx-auto">
              Pilih kontak WhatsApp di bawah ini untuk berdiskusi langsung mengenai bimbingan belajar, pendaftaran siswa, atau informasi seputar KAVIO Edu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Contact 1: Founder */}
            <div className="bg-[#F8FAFC] border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-7 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between space-y-6 text-center">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-[#15803D] border border-emerald-200">
                  Founder KAVIO Edu
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight pt-1">
                  Fatih Farhat
                </h3>
                <p className="text-xs font-bold text-slate-600">Konsultasi Utama & Kerjasama</p>
              </div>

              <a
                href="https://wa.me/6282111500190"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-duo-green py-3.5 px-5 text-xs font-black flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Chat WhatsApp</span>
              </a>
            </div>

            {/* Contact 2: Customer Service */}
            <div className="bg-[#F8FAFC] border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-7 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between space-y-6 text-center">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider bg-sky-50 text-[#0284C7] border border-sky-200">
                  Customer Service
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight pt-1">
                  Eni Eka Riyanti
                </h3>
                <p className="text-xs font-bold text-slate-600">Layanan Pelanggan & Informasi</p>
              </div>

              <a
                href="https://wa.me/6283813838883"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-duo-blue py-3.5 px-5 text-xs font-black flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Chat WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Duolingo Green Banner */}
      <section className="py-20 bg-[#58CC02] text-white relative overflow-hidden border-b-8 border-b-[#46A302]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight uppercase">
            Mulai Pengalaman Belajar Seru Bersama KAVIO Edu Hari Ini
          </h2>
          <p className="text-sm sm:text-base text-white max-w-xl mx-auto font-bold leading-relaxed">
            Dapatkan akses modul terstruktur, pengerjaan tugas interaktif, dan kumpulkan poin EXP untuk mendaki papan peringkat.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/register')}
              className="btn-duo-blue px-8 py-4 text-sm font-black uppercase tracking-wider cursor-pointer w-full sm:w-auto"
            >
              Daftar Sekarang
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="btn-duo-slate px-8 py-4 text-sm font-black uppercase tracking-wider cursor-pointer w-full sm:w-auto"
            >
              Masuk ke Akun
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white text-gray-700 text-xs font-bold border-t-4 border-t-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('/')}>
            <Logo className="h-7 w-auto" />
          </div>
          <p className="text-gray-600 font-semibold">&copy; {new Date().getFullYear()} KAVIO Edu. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/blog')} className="hover:text-[#1CB0F6] transition-colors cursor-pointer uppercase">Blog</button>
            <button onClick={() => onNavigate('/login')} className="hover:text-[#1CB0F6] transition-colors cursor-pointer uppercase">Masuk</button>
            <button onClick={() => onNavigate('/register')} className="hover:text-[#1CB0F6] transition-colors cursor-pointer uppercase">Daftar</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
