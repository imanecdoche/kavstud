import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Users, 
  Sparkles, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Star 
} from 'lucide-react';

export interface PackageData {
  id: string;
  name: string;
  price: string;
  details: string;
  bgColor: string;
  borderClass: string;
  image: string;
  badge: string | null;
  badgePos: string;
  priceLabel?: string;
}

interface PackageDetailProps {
  pkg: PackageData;
  onBack: () => void;
  onRegister: (pkg: PackageData) => void;
}

export default function PackageDetail({ pkg, onBack, onRegister }: PackageDetailProps) {
  const isPrivate = pkg.id === 'seed' || pkg.id === 'grow' || pkg.id === 'boost' || pkg.id === 'master';

  const benefits = isPrivate ? [
    'Sesi tatap muka 1-on-1 terfokus penuh untuk 1 siswa',
    'Jadwal dan materi 100% fleksibel disesuaikan kecepatan belajar siswa',
    'Laporan perkembangan belajar mingguan dan evaluasi berkala',
    'Akses penuh ke Pustaka Modul Interaktif Kavio Edu',
    'Dukungan konsultasi PR & tugas sekolah via WhatsApp'
  ] : [
    'Belajar interaktif dalam kelompok kecil (2-5 siswa)',
    'Meningkatkan rasa percaya diri dan dorongan kolaboratif antar teman',
    'Diskon biaya belajar khusus dengan kualitas pengajaran setara',
    'Tugas kelompok interaktif dan kompetisi poin menyenangkan',
    'Pendampingan guru berpengalaman dengan metode gamifikasi'
  ];

  const highlights = [
    { title: 'Metode Gamifikasi 3D', desc: 'Sistem poin, streak, dan lencana interaktif agar belajar terasa seperti bermain game.', icon: Sparkles, color: 'text-[#FFC800]' },
    { title: 'Tutor Terverifikasi', desc: 'Pengajar profesional dengan seleksi ketat dan pendekatan ramah anak.', icon: ShieldCheck, color: 'text-[#58CC02]' },
    { title: 'Kurikulum Terbaru', desc: 'Materi pelajaran terkini disesuaikan dengan standar kurikulum nasional.', icon: BookOpen, color: 'text-[#1CB0F6]' },
    { title: 'Jadwal Fleksibel', desc: 'Pilihan opsi waktu pagi, siang, atau sore yang disesuaikan kebutuhan.', icon: Clock, color: 'text-[#CE82FF]' }
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-slate-900 text-[#4B4B4B] dark:text-slate-100 font-sans pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b-2 border-gray-200 dark:border-slate-700/60 px-4 sm:px-8 py-4 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-800 dark:text-white text-xs font-black py-2.5 px-4 rounded-2xl border-b-4 border-gray-300 dark:border-slate-900 active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="uppercase tracking-wider">Kembali ke Daftar Paket</span>
        </button>

        <span className="text-xs font-black uppercase text-gray-400 tracking-widest hidden sm:inline">
          {isPrivate ? 'Kavio Private Program' : 'Kavio Circle Group'}
        </span>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
        {/* Banner Section */}
        <section className={`${pkg.bgColor} ${pkg.borderClass} rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-md flex flex-col md:flex-row items-center justify-between gap-8`}>
          <div className="space-y-4 text-center md:text-left z-10 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white border border-gray-200/50">
              <Zap className="w-4 h-4 text-[#FF9600]" />
              <span>{isPrivate ? 'PAKET PRIVATE EXCLUSIVE' : 'PAKET CIRCLE KELOMPOK'}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight uppercase leading-none font-display">
              {pkg.name}
            </h1>

            <p className="text-sm font-bold text-gray-800 leading-relaxed">
              {pkg.details}
            </p>

            <div className="pt-2 flex items-end justify-center md:justify-start gap-1.5 text-gray-900">
              <span className="text-xl font-bold pb-1">Rp</span>
              <span className="text-4xl sm:text-5xl font-black leading-none">{pkg.price}</span>
              <span className="text-base font-bold pb-1 text-gray-800">
                {pkg.priceLabel || (isPrivate ? '/bulan' : '/sesi/siswa')}
              </span>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative w-full aspect-square max-w-[280px] shrink-0 z-10">
            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-contain filter drop-shadow-lg" />
            {pkg.badge && (
              <img src={pkg.badge} alt="Badge" className="absolute w-28 h-28 object-contain bottom-0 right-0 z-20" />
            )}
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {highlights.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-slate-700 border-b-6 border-b-gray-300 dark:border-b-slate-900 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center shrink-0 border-b-4 border-gray-300 dark:border-slate-900">
                  <IconComp className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight font-display">{item.title}</h3>
                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Detailed Benefits List */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-300 dark:border-b-slate-900 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-display">
              FASILITAS & BENEFIT PAKET {pkg.name}
            </h2>
            <p className="text-xs font-bold text-gray-400">
              Setiap pendaftaran menyakup fasilitas pembelajaran premium dari Kavio Edu.
            </p>
          </div>

          <ul className="space-y-3">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-[#58CC02] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-slate-200 leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Guarantee & Testimonial Accent */}
        <section className="bg-gradient-to-r from-[#58CC02] to-[#46A302] rounded-[2rem] p-6 text-white shadow-md flex items-center justify-between gap-4 border-b-4 border-[#3b8c00]">
          <div className="space-y-1">
            <h3 className="text-lg font-black uppercase font-display">GARANSI PEMBELAJARAN SERU & EFEKTIF</h3>
            <p className="text-xs font-bold text-white/90">
              Jika siswa kurang merasa cocok dengan tutor pada sesi pertama, Anda berhak mengajukan penggantian tutor gratis!
            </p>
          </div>
          <Star className="w-10 h-10 text-[#FFC800] fill-[#FFC800] shrink-0 hidden sm:block" />
        </section>
      </main>

      {/* Sticky Bottom Bar with DAFTAR SEKARANG Button */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-t-2 border-gray-200 dark:border-slate-700/80 p-4 sm:px-8 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PAKET TERPILIH</p>
            <p className="text-lg font-black text-gray-900 dark:text-white uppercase leading-none font-display">
              PAKET {pkg.name} — Rp {pkg.price}
            </p>
          </div>

          <button
            onClick={() => onRegister(pkg)}
            className="w-full sm:w-auto flex-1 sm:flex-initial bg-[#58CC02] hover:bg-[#46A302] text-white text-base font-black py-4 px-10 rounded-2xl shadow-lg border-b-4 border-[#3b8c00] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer uppercase tracking-wider text-center"
            id="btn-sticky-register"
          >
            DAFTAR SEKARANG 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
