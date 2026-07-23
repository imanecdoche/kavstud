import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { UserProfile } from '../types';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  CreditCard, 
  UserCheck, 
  Users, 
  HelpCircle,
  BookOpen,
  Award,
  RefreshCw,
  Lock,
  MessageSquareQuote
} from 'lucide-react';
import { motion } from 'motion/react';

interface TermsAndConditionsProps {
  onNavigate: (path: string) => void;
  userProfile?: UserProfile | null;
}

export default function TermsAndConditions({ onNavigate, userProfile }: TermsAndConditionsProps) {
  const [activeSection, setActiveSection] = useState<string>('sec-1');

  const SECTIONS = [
    { id: 'sec-1', title: '1. Pendaftaran' },
    { id: 'sec-2', title: '2. Sistem Pembelajaran' },
    { id: 'sec-3', title: '3. Sistem Pembayaran' },
    { id: 'sec-4', title: '4. Masa Berlaku Paket' },
    { id: 'sec-5', title: '5. Jadwal Pembelajaran' },
    { id: 'sec-6', title: '6. Permintaan Reschedule' },
    { id: 'sec-7', title: '7. Ketidakhadiran' },
    { id: 'sec-8', title: '8. Ketentuan Circle Class' },
    { id: 'sec-9', title: '9. Pembatalan oleh Tutor' },
    { id: 'sec-10', title: '10. Etika Pembelajaran' },
    { id: 'sec-11', title: '11. Penggunaan Aplikasi' },
    { id: 'sec-12', title: '12. Sertifikat & Progress' },
    { id: 'sec-13', title: '13. Pengembalian Dana (Refund)' },
    { id: 'sec-14', title: '14. Perubahan Kebijakan' },
    { id: 'sec-penutup', title: 'Penutup' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#171A21] text-white font-sans flex flex-col">
      {/* Top Header */}
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
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#58CC02]/10 text-[#16A34A] font-bold text-xs uppercase tracking-wider border border-[#58CC02]/20">
            <ShieldCheck className="w-4 h-4 text-[#58CC02]" />
            LEGAL & TATA TERTIB
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
            Syarat & Ketentuan Pembelajaran KAVIO EDU
          </h1>
          <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
            Dokumen ini mengatur hak, kewajiban, serta tata tertib pembelajaran di <span className="font-bold text-[#3C3C3C]">KAVIO EDU</span>. Dengan melakukan pendaftaran dan pembayaran paket, siswa dan/atau orang tua dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan berikut.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 bg-[#2F3138] border border-white/10 rounded-[3px] p-5 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.5)] max-h-[calc(100vh-120px)] overflow-y-auto text-white">
            <h3 className="font-bold text-xs text-[#8A8A8A] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
              <FileText className="w-4 h-4 text-[#66C0F4]" />
              <span>Daftar Isi Dokumen</span>
            </h3>
            <nav className="space-y-1 text-xs">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-[2px] font-bold transition-all cursor-pointer truncate ${
                    activeSection === sec.id
                      ? 'bg-[#66C0F4]/15 text-[#66C0F4] border-l-2 border-[#66C0F4]'
                      : 'text-[#C6D4DF] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Column: Full Terms Content */}
          <article className="lg:col-span-8 bg-[#2F3138] border border-white/10 rounded-[3px] p-6 sm:p-10 space-y-10 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
            
            {/* 1. PENDAFTARAN */}
            <section id="sec-1" className="space-y-4 pt-2 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">1</span>
                <span>PENDAFTARAN</span>
              </h2>
              <ol className="list-decimal pl-5 space-y-2.5 text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                <li>Setiap siswa wajib mengisi data diri dengan benar dan lengkap.</li>
                <li>Setelah pendaftaran dikonfirmasi, siswa akan memperoleh akun KAVIO EDU.</li>
                <li>Akun hanya boleh digunakan oleh siswa yang terdaftar dan tidak boleh dipinjamkan kepada pihak lain.</li>
                <li>KAVIO EDU berhak menolak atau membatalkan pendaftaran apabila ditemukan data yang tidak valid.</li>
              </ol>
            </section>

            {/* 2. SISTEM PEMBELAJARAN */}
            <section id="sec-2" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">2</span>
                <span>SISTEM PEMBELAJARAN</span>
              </h2>
              <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                KAVIO EDU menyediakan dua jenis program pembelajaran:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-base text-[#3C3C3C] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#1CB0F6]" />
                    <span>Private Class</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4B4B4B]"><strong>Format:</strong> 1 Tutor : 1 Siswa</p>
                  <p className="text-xs sm:text-sm text-[#4B4B4B]"><strong>Jadwal:</strong> Fleksibel sesuai kesepakatan.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-base text-[#3C3C3C] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#58CC02]" />
                    <span>Circle Class</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4B4B4B]"><strong>Format:</strong> 1 Tutor : 2–5 Siswa</p>
                  <p className="text-xs sm:text-sm text-[#4B4B4B]"><strong>Jadwal:</strong> Mengikuti kesepakatan seluruh anggota Circle.</p>
                  <p className="text-xs sm:text-sm text-[#4B4B4B]"><strong>Materi:</strong> Seluruh peserta mendapatkan materi sesuai level kelas.</p>
                </div>
              </div>
            </section>

            {/* 3. SISTEM PEMBAYARAN */}
            <section id="sec-3" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">3</span>
                <span>SISTEM PEMBAYARAN</span>
              </h2>
              <ol className="list-decimal pl-5 space-y-2.5 text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                <li>Seluruh program menggunakan sistem paket bulanan, bukan pembayaran per sesi.</li>
                <li>Pembayaran dilakukan secara penuh sebelum paket dimulai.</li>
                <li>Pembayaran maksimal dilakukan H-1 sebelum pertemuan pertama.</li>
                <li>Paket akan aktif pada tanggal pertemuan pertama.</li>
                <li>Pembayaran yang telah dilakukan tidak dapat dialihkan kepada orang lain tanpa persetujuan KAVIO EDU.</li>
              </ol>
            </section>

            {/* 4. MASA BERLAKU PAKET */}
            <section id="sec-4" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">4</span>
                <span>MASA BERLAKU PAKET</span>
              </h2>
              <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                Seluruh paket memiliki masa berlaku <strong className="text-[#3C3C3C]">1 bulan sejak pertemuan pertama</strong>.
              </p>

              <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100 space-y-2">
                <h4 className="font-bold text-xs text-[#0284C7] uppercase tracking-wider">Rincian Sesi Paket:</h4>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-[#4B4B4B] space-y-1 font-medium">
                  <li>Paket Seed → 3 sesi dalam 1 bulan.</li>
                  <li>Paket Grow → 4 sesi dalam 1 bulan.</li>
                  <li>Paket Boost → 8 sesi dalam 1 bulan.</li>
                  <li>Paket Master → 8 sesi dalam 1 bulan.</li>
                </ul>
              </div>

              <p className="text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Sesi yang tidak digunakan hingga masa berlaku berakhir dianggap selesai, kecuali terdapat kebijakan khusus dari KAVIO EDU.
              </p>
            </section>

            {/* 5. JADWAL PEMBELAJARAN */}
            <section id="sec-5" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">5</span>
                <span>JADWAL PEMBELAJARAN</span>
              </h2>
              <ol className="list-decimal pl-5 space-y-2.5 text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                <li>Jadwal ditentukan berdasarkan kesepakatan tutor dan siswa.</li>
                <li>Jadwal tersimpan pada aplikasi KAVIO EDU.</li>
                <li>Guru dan siswa dapat melihat jadwal pembelajaran secara real-time.</li>
              </ol>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-xs text-[#3C3C3C] uppercase tracking-wider">Informasi jadwal meliputi:</h4>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-[#4B4B4B] space-y-1 font-medium">
                  <li>Hari</li>
                  <li>Tanggal</li>
                  <li>Jam mulai</li>
                  <li>Jam selesai</li>
                  <li>Jenis kelas: Private / Circle</li>
                </ul>
              </div>
            </section>

            {/* 6. PERMINTAAN RESCHEDULE */}
            <section id="sec-6" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">6</span>
                <span>PERMINTAAN RESCHEDULE</span>
              </h2>
              <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                KAVIO EDU memberikan fasilitas penggantian jadwal dengan ketentuan berikut.
              </p>

              <div className="space-y-3">
                <h3 className="font-bold text-base text-[#3C3C3C]">Syarat Pengajuan</h3>
                <p className="text-sm text-[#4B4B4B] font-medium">Siswa dapat mengajukan reschedule apabila:</p>
                <ul className="list-disc pl-5 text-sm text-[#4B4B4B] space-y-1 font-medium">
                  <li>Permintaan dilakukan minimal <strong className="text-[#FF4B4B]">6 jam sebelum kelas dimulai</strong>.</li>
                  <li>Permintaan diajukan melalui aplikasi KAVIO EDU.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-base text-[#3C3C3C]">Mekanisme</h3>
                <ol className="list-decimal pl-5 space-y-1.5 text-sm text-[#4B4B4B] font-medium">
                  <li>Siswa mengirim permintaan reschedule.</li>
                  <li>Sistem otomatis memeriksa selisih waktu.</li>
                  <li>Jika kurang dari 6 jam sebelum kelas dimulai, permintaan otomatis ditolak sistem.</li>
                  <li>Jika memenuhi syarat, permintaan diteruskan kepada tutor.</li>
                  <li>Tutor dapat menyetujui atau menolak permintaan.</li>
                  <li>Setelah disetujui, jadwal siswa dan guru akan otomatis diperbarui pada aplikasi.</li>
                </ol>
              </div>
            </section>

            {/* 7. KETIDAKHADIRAN */}
            <section id="sec-7" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">7</span>
                <span>KETIDAKHADIRAN</span>
              </h2>

              <div className="space-y-3">
                <h3 className="font-bold text-base text-[#3C3C3C]">Jika siswa tidak hadir tanpa pemberitahuan:</h3>
                <ul className="list-disc pl-5 text-sm text-[#4B4B4B] space-y-1 font-medium">
                  <li>Pertemuan dianggap selesai.</li>
                  <li>Siswa tidak memperoleh kelas pengganti.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-base text-[#3C3C3C]">Jika siswa terlambat:</h3>
                <ul className="list-disc pl-5 text-sm text-[#4B4B4B] space-y-1 font-medium">
                  <li>Tutor tetap mengajar sesuai jam yang telah dijadwalkan.</li>
                  <li>Waktu keterlambatan tidak menambah durasi belajar.</li>
                </ul>
              </div>
            </section>

            {/* 8. KETENTUAN CIRCLE CLASS */}
            <section id="sec-8" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">8</span>
                <span>KETENTUAN CIRCLE CLASS</span>
              </h2>
              <ol className="list-decimal pl-5 space-y-2.5 text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                <li>Jadwal Circle ditentukan berdasarkan kesepakatan seluruh anggota.</li>
                <li>Ketidakhadiran satu peserta tidak membatalkan kelas.</li>
                <li>Tutor tetap melaksanakan pembelajaran sesuai jadwal.</li>
                <li>Peserta yang tidak hadir dianggap mengikuti satu sesi pembelajaran.</li>
              </ol>
            </section>

            {/* 9. PEMBATALAN OLEH TUTOR */}
            <section id="sec-9" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">9</span>
                <span>PEMBATALAN OLEH TUTOR</span>
              </h2>
              <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                Apabila tutor berhalangan hadir:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-[#4B4B4B] space-y-1.5 font-medium">
                <li>KAVIO EDU akan menjadwalkan ulang kelas.</li>
                <li>Siswa tidak kehilangan hak sesi pembelajaran.</li>
              </ul>
            </section>

            {/* 10. ETIKA PEMBELAJARAN */}
            <section id="sec-10" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">10</span>
                <span>ETIKA PEMBELAJARAN</span>
              </h2>
              <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">Siswa diharapkan:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                <li>Hadir tepat waktu.</li>
                <li>Bersikap sopan kepada tutor maupun peserta lain.</li>
                <li>Mengikuti pembelajaran dengan baik.</li>
                <li>Tidak mengganggu jalannya kelas.</li>
                <li>Menjaga nama baik KAVIO EDU.</li>
              </ul>
            </section>

            {/* 11. PENGGUNAAN APLIKASI */}
            <section id="sec-11" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">11</span>
                <span>PENGGUNAAN APLIKASI</span>
              </h2>
              <ol className="list-decimal pl-5 space-y-2.5 text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                <li>Akun bersifat pribadi.</li>
                <li>Dilarang membagikan akun kepada orang lain.</li>
                <li>Materi, tugas, dan konten pembelajaran hanya digunakan untuk keperluan belajar.</li>
                <li>KAVIO EDU berhak menonaktifkan akun apabila ditemukan penyalahgunaan.</li>
              </ol>
            </section>

            {/* 12. SERTIFIKAT & PROGRESS BELAJAR */}
            <section id="sec-12" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">12</span>
                <span>SERTIFIKAT & PROGRESS BELAJAR</span>
              </h2>
              <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">Apabila tersedia:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                <li>Progress belajar dapat dipantau melalui aplikasi KAVIO EDU.</li>
                <li>Nilai dan umpan balik diberikan oleh tutor.</li>
                <li>Sertifikat diberikan sesuai ketentuan program yang diikuti.</li>
              </ul>
            </section>

            {/* 13. PENGEMBALIAN DANA (REFUND) */}
            <section id="sec-13" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">13</span>
                <span>PENGEMBALIAN DANA (REFUND)</span>
              </h2>
              <ol className="list-decimal pl-5 space-y-2.5 text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                <li>Pembayaran yang telah dilakukan tidak dapat dikembalikan (<strong className="text-[#FF4B4B]">non-refundable</strong>).</li>
                <li>Refund hanya dipertimbangkan apabila pembelajaran tidak dapat dilaksanakan karena alasan dari pihak KAVIO EDU dan tidak tersedia solusi pengganti.</li>
                <li>Keputusan mengenai refund menjadi hak KAVIO EDU.</li>
              </ol>
            </section>

            {/* 14. PERUBAHAN KEBIJAKAN */}
            <section id="sec-14" className="space-y-4 border-b border-slate-100 pb-8">
              <h2 className="text-2xl font-bold text-[#3C3C3C] font-display uppercase flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-sm font-extrabold">14</span>
                <span>PERUBAHAN KEBIJAKAN</span>
              </h2>
              <p className="text-sm sm:text-base text-[#4B4B4B] font-medium leading-relaxed">
                KAVIO EDU berhak melakukan perubahan terhadap syarat dan ketentuan sewaktu-waktu. Setiap perubahan akan diinformasikan melalui aplikasi atau media komunikasi resmi KAVIO EDU.
              </p>
            </section>

            {/* PENUTUP */}
            <section id="sec-penutup" className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-base text-[#3C3C3C] uppercase font-display">PENUTUP</h3>
              <p className="text-xs sm:text-sm text-[#4B4B4B] font-medium leading-relaxed">
                Dengan melakukan pendaftaran dan pembayaran paket, siswa dan/atau orang tua menyatakan telah membaca, memahami, serta menyetujui seluruh syarat dan ketentuan yang berlaku di KAVIO EDU.
              </p>
            </section>
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white text-[#3C3C3C] text-xs font-bold border-t border-[#E5E5E5] mt-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('/')}>
            <Logo className="h-7 w-auto" />
          </div>
          <p className="text-[#4B4B4B] font-medium">&copy; {new Date().getFullYear()} KAVIO Edu. Syarat & Ketentuan Pembelajaran.</p>
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-[#1CB0F6] transition-colors cursor-pointer uppercase font-bold"
          >
            Halaman Utama
          </button>
        </div>
      </footer>
    </div>
  );
}
