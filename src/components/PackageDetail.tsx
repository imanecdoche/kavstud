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
    { title: 'Metode Gamifikasi 3D', desc: 'Sistem poin, streak, dan lencana interaktif agar belajar terasa lebih efisien.', icon: Sparkles, color: 'text-[#B9A074]' },
    { title: 'Tutor Terverifikasi', desc: 'Pengajar profesional dengan seleksi ketat dan pendekatan akademis terukur.', icon: ShieldCheck, color: 'text-[#A1CD44]' },
    { title: 'Kurikulum Terbaru', desc: 'Materi pelajaran terkini disesuaikan dengan standar kurikulum nasional.', icon: BookOpen, color: 'text-[#66C0F4]' },
    { title: 'Jadwal Fleksibel', desc: 'Pilihan opsi waktu pagi, siang, atau sore yang disesuaikan kebutuhan.', icon: Clock, color: 'text-[#66C0F4]' }
  ];

  return (
    <div className="min-h-screen bg-[#171A21] text-white font-sans pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#2F3138] border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-black/40 hover:bg-white/10 text-white text-xs font-bold py-2.5 px-4 rounded-[2px] border border-white/20 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="uppercase tracking-wider">Kembali ke Daftar Paket</span>
        </button>

        <span className="text-xs font-bold uppercase text-[#8A8A8A] tracking-widest hidden sm:inline">
          {isPrivate ? 'Kavio Private Program' : 'Kavio Circle Group'}
        </span>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn text-white">
        {/* Banner Section */}
        <section className="bg-[#2F3138] border border-white/15 rounded-[4px] p-8 sm:p-12 relative overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="space-y-4 text-center md:text-left z-10 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/40 rounded-[2px] text-xs font-bold uppercase tracking-wider text-[#66C0F4] border border-white/15">
              <Zap className="w-4 h-4 text-[#66C0F4]" />
              <span>{isPrivate ? 'PAKET PRIVATE EXCLUSIVE' : 'PAKET CIRCLE KELOMPOK'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight uppercase leading-none">
              {pkg.name}
            </h1>

            <p className="text-sm font-semibold text-[#C6D4DF] leading-relaxed">
              {pkg.details}
            </p>

            <div className="pt-2 flex items-end justify-center md:justify-start gap-1.5 text-[#A1CD44]">
              <span className="text-xl font-bold pb-1">Rp</span>
              <span className="text-4xl sm:text-5xl font-bold font-mono leading-none">{pkg.price}</span>
              <span className="text-base font-bold pb-1 text-[#C6D4DF]">
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
              <div key={idx} className="bg-[#2F3138] rounded-[3px] p-6 border border-white/10 shadow-xs flex items-start gap-4 text-white">
                <div className="w-12 h-12 rounded-[2px] bg-black/40 flex items-center justify-center shrink-0 border border-white/10">
                  <IconComp className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">{item.title}</h3>
                  <p className="text-xs font-medium text-[#C6D4DF] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Detailed Benefits List */}
        <section className="bg-[#2F3138] rounded-[4px] p-8 border border-white/10 shadow-md space-y-6 text-white">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">
              FASILITAS & BENEFIT PAKET {pkg.name}
            </h2>
            <p className="text-xs font-bold text-[#8A8A8A]">
              Setiap pendaftaran menyakup fasilitas pembelajaran premium dari Kavio Edu.
            </p>
          </div>

          <ul className="space-y-3">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 bg-black/40 p-4 rounded-[2px] border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-[#A1CD44] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-bold text-white leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Guarantee Accent */}
        <section className="bg-black/40 rounded-[3px] p-6 text-white shadow-md flex items-center justify-between gap-4 border border-[#A1CD44]/40">
          <div className="space-y-1">
            <h3 className="text-base font-bold uppercase text-[#A1CD44]">GARANSI PEMBELAJARAN SERU & EFEKTIF</h3>
            <p className="text-xs font-medium text-[#C6D4DF]">
              Jika siswa kurang merasa cocok dengan tutor pada sesi pertama, Anda berhak mengajukan penggantian tutor gratis!
            </p>
          </div>
          <Star className="w-10 h-10 text-[#B9A074] fill-[#B9A074] shrink-0 hidden sm:block" />
        </section>
      </main>

      {/* Sticky Bottom Bar with DAFTAR SEKARANG Button */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#2F3138] border-t border-white/10 p-4 sm:px-8 shadow-2xl text-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-widest">PAKET TERPILIH</p>
            <p className="text-lg font-bold text-white uppercase leading-none mt-0.5">
              PAKET {pkg.name} — Rp {pkg.price}
            </p>
          </div>

          <button
            onClick={() => onRegister(pkg)}
            className="w-full sm:w-auto flex-1 sm:flex-initial bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold py-3.5 px-10 rounded-[2px] shadow-md transition-all cursor-pointer uppercase tracking-wider text-center"
            id="btn-sticky-register"
          >
            Daftar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
