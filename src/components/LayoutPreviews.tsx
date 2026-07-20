import { useState } from 'react';
import { 
  BarChart, 
  Users, 
  BookOpen, 
  Clock, 
  HelpCircle,
  TrendingUp,
  Award,
  ChevronRight,
  ArrowRight,
  User,
  Settings,
  Shield,
  FileText,
  Mail,
  Lock,
  Compass,
  AlertCircle,
  Inbox,
  X,
  AlertTriangle,
  Download,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

export default function LayoutPreviews() {
  const [activeLayout, setActiveLayout] = useState<'teacher-dash' | 'student-dash' | 'login' | 'register' | 'assignment-detail' | 'profile' | '404-page'>('teacher-dash');
  const [layoutState, setLayoutState] = useState<'normal' | 'loading' | 'empty'>('normal');

  // Login/Register demo state
  const [demoLoginEmail, setDemoLoginEmail] = useState('kazokuhairy@gmail.com');
  const [demoLoginPass, setDemoLoginPass] = useState('••••••••••••');
  const [demoRegName, setDemoRegName] = useState('');
  const [demoRegEmail, setDemoRegEmail] = useState('');

  // 1. LOADING COMPONENT (Skeleton Block Helper)
  const SkeletonLine = ({ width = 'w-full', height = 'h-3' }) => (
    <div className={`${width} ${height} bg-gray-100 rounded-md animate-pulse`} />
  );

  return (
    <div className="space-y-8 max-w-5xl" id="layout-previews">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900">
          Application Layout Mockups
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Simulasi halaman produk utama Kavio Edu. Uji layout dalam keadaan loading (skeleton) atau empty state secara langsung.
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Screen selector */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-gray-100 w-full md:w-auto">
          {[
            { id: 'teacher-dash', label: 'Teacher Dash' },
            { id: 'student-dash', label: 'Student Dash' },
            { id: 'assignment-detail', label: 'Assign Detail' },
            { id: 'login', label: 'Login UI' },
            { id: 'register', label: 'Register UI' },
            { id: 'profile', label: 'Profile UI' },
            { id: '404-page', label: '404 View' },
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => setActiveLayout(sc.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeLayout === sc.id 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* State selector */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-100 shrink-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">State:</span>
          {(['normal', 'loading', 'empty'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setLayoutState(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                layoutState === st 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER ACTIVE SCREEN LAYOUT VIEW */}
      <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 sm:p-6 min-h-[460px] flex flex-col justify-between overflow-hidden shadow-2xs">
        
        {/* RENDER MOCK: TEACHER DASHBOARD */}
        {activeLayout === 'teacher-dash' && (
          <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-base font-display font-bold text-gray-900">Selamat pagi, Ibu Jane Doe!</h2>
                <p className="text-xs text-gray-400 mt-0.5">Beranda pengawas dan rekap kelas Kimia Dasar - Semester Genap.</p>
              </div>
              <button className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold self-start sm:self-center cursor-pointer transition-all active:scale-95">
                + Buat Tugas
              </button>
            </div>

            {/* CONDITIONAL RENDER BY STATE */}
            {layoutState === 'loading' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-gray-100 p-4 rounded-xl space-y-3">
                      <SkeletonLine width="w-1/3" />
                      <SkeletonLine width="w-2/3" height="h-6" />
                      <SkeletonLine width="w-1/2" />
                    </div>
                  ))}
                </div>
                <div className="bg-white border border-gray-100 p-6 rounded-xl space-y-4">
                  <SkeletonLine width="w-1/4" />
                  <div className="space-y-2">
                    <SkeletonLine />
                    <SkeletonLine />
                    <SkeletonLine width="w-3/4" />
                  </div>
                </div>
              </div>
            ) : layoutState === 'empty' ? (
              <div className="bg-white border border-gray-100 p-12 rounded-xl text-center space-y-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <Inbox className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-gray-900">Belum ada kelas terdaftar</h3>
                  <p className="text-[11px] text-gray-400 max-w-xs leading-normal">
                    Silakan hubungi administrator Kavio Edu untuk menambahkan data kurikulum dan registrasi kode sekolah Anda.
                  </p>
                </div>
                <button className="px-4 py-2 border border-gray-200 hover:border-gray-300 bg-white text-xs font-semibold rounded-lg cursor-pointer">
                  Hubungi Admin Support
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Statistics bento block */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-3xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Siswa</span>
                      <span className="text-base font-bold text-gray-800">42 Siswa</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-3xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Tugas Aktif</span>
                      <span className="text-base font-bold text-gray-800">3 Terpublish</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-3xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Butuh Penilaian</span>
                      <span className="text-base font-bold text-gray-800">12 Jawaban</span>
                    </div>
                  </div>
                </div>

                {/* Performance chart widget */}
                <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-3xs space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                      Rata-Rata Kurva Nilai Kelas (IPA-1 vs IPA-2)
                    </h3>
                    <span className="text-gray-400 font-mono text-[10px]">Tugas ASG-102</span>
                  </div>

                  {/* Inline clean SVG graph for performance metrics */}
                  <div className="h-28 w-full bg-gray-50/50 rounded-lg border border-gray-100/50 flex items-end justify-between px-6 pt-4 pb-2">
                    <div className="flex flex-col items-center flex-1 h-full justify-end">
                      <div className="w-8 bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-all" style={{ height: '70%' }} />
                      <span className="text-[9px] text-gray-400 font-mono mt-1">Kim-1</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 h-full justify-end">
                      <div className="w-8 bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-all" style={{ height: '85%' }} />
                      <span className="text-[9px] text-gray-400 font-mono mt-1">Kim-2</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 h-full justify-end">
                      <div className="w-8 bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-all" style={{ height: '40%' }} />
                      <span className="text-[9px] text-gray-400 font-mono mt-1">Bio-1</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 h-full justify-end">
                      <div className="w-8 bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-all" style={{ height: '95%' }} />
                      <span className="text-[9px] text-gray-400 font-mono mt-1">Bio-2</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RENDER MOCK: STUDENT DASHBOARD */}
        {activeLayout === 'student-dash' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-base font-display font-bold text-gray-900">Halo, Ahmad Rafli!</h2>
                <p className="text-xs text-gray-400 mt-0.5">Semoga harimu menyenangkan. Periksa agenda tugas sekolah hari ini.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-gray-500">Connected to Kavio Sync</span>
              </div>
            </div>

            {layoutState === 'loading' ? (
              <div className="space-y-4">
                <div className="border border-gray-100 bg-white p-5 rounded-xl space-y-3">
                  <SkeletonLine width="w-1/4" />
                  <SkeletonLine />
                  <SkeletonLine width="w-1/2" />
                </div>
              </div>
            ) : layoutState === 'empty' ? (
              <div className="bg-white border border-gray-100 p-12 rounded-xl text-center space-y-3 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <Inbox className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-900">Agenda tugas kosong</h3>
                  <p className="text-[11px] text-gray-400">Wah, semua tugas sekolahmu telah diselesaikan dengan rapi!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Timeline agenda */}
                <div className="md:col-span-2 space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tugas Mendatang</span>
                  
                  <div className="border border-indigo-100 bg-white p-4 rounded-xl shadow-3xs space-y-3 relative overflow-hidden">
                    {/* Ribbon accent */}
                    <div className="absolute top-0 right-0 h-1.5 w-16 bg-indigo-500" />
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-indigo-600 font-bold uppercase">Kimia Dasar</span>
                        <h4 className="text-xs font-semibold text-gray-900 mt-1">Evaluasi Polarisasi Ikatan Kimia</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-bold">5 Hari Lagi</span>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-2">Sebutkan perbedaan ikatan kovalen polar dan kovalen non-polar serta berikan contohnya...</p>
                    <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">Mulai Kerjakan <ArrowRight className="w-3 h-3" /></button>
                  </div>
                </div>

                {/* Side scores */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Prestasi Belajar</span>
                  <div className="border border-gray-100 bg-white p-4 rounded-xl shadow-3xs text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block font-medium">IPK Rata-Rata</span>
                      <span className="font-mono text-xl font-bold text-gray-800">92.5 <span className="text-xs text-gray-400">/ 100</span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RENDER MOCK: ASSIGNMENT DETAIL */}
        {activeLayout === 'assignment-detail' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-xs">
              <span className="text-gray-400 hover:text-black cursor-pointer">Tugas</span>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-400">Kimia Dasar</span>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="font-semibold text-gray-800">Detail ASG-102</span>
            </div>

            {layoutState === 'loading' ? (
              <div className="space-y-4">
                <SkeletonLine width="w-1/3" />
                <SkeletonLine />
              </div>
            ) : layoutState === 'empty' ? (
              <div className="p-8 text-center text-gray-400 text-xs">Tugas tidak ditemukan.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start bg-white border border-gray-100 p-5 rounded-xl shadow-3xs">
                {/* Left side details */}
                <div className="md:col-span-3 space-y-4">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase">Assignment Sheet</span>
                    <h3 className="text-sm font-semibold text-gray-900 mt-1">Kimia Dasar: Persamaan Reaksi Redoks</h3>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    Kimia organik dasar mencakup pemahaman hibridisasi karbon sp3, sp2, dan sp. Tuliskan jawaban Anda mengenai reaksi kimia reduksi oksidasi secara runut.
                  </p>
                </div>

                {/* Right side download attachment box */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100/50 space-y-3">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">File Lampiran Guru</span>
                  <div className="flex items-center justify-between text-xs p-2 bg-white rounded-lg border border-gray-100">
                    <span className="font-medium text-gray-700 truncate max-w-[120px]">Panduan_Redoks.pdf</span>
                    <button className="p-1 text-indigo-600 hover:bg-gray-50 rounded-md">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RENDER MOCK: LOGIN PAGE */}
        {activeLayout === 'login' && (
          <div className="flex items-center justify-center py-6">
            <div className="w-full max-w-sm bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              
              {/* Header logo */}
              <div className="text-center space-y-2">
                <Logo className="h-8 w-auto text-indigo-600 mx-auto" />
                <p className="text-xs text-gray-400">Masuk ke ruang kelas digital Anda.</p>
              </div>

              {layoutState === 'loading' ? (
                <div className="space-y-3">
                  <SkeletonLine />
                  <SkeletonLine />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">Email Kampus</label>
                    <input
                      type="text"
                      value={demoLoginEmail}
                      onChange={(e) => setDemoLoginEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-700 block">Password</label>
                      <span className="text-[10px] text-indigo-600 hover:underline cursor-pointer">Lupa password?</span>
                    </div>
                    <input
                      type="password"
                      value={demoLoginPass}
                      onChange={(e) => setDemoLoginPass(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <button className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all cursor-pointer">
                    Masuk Sekarang
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RENDER MOCK: REGISTER PAGE */}
        {activeLayout === 'register' && (
          <div className="flex items-center justify-center py-4">
            <div className="w-full max-w-sm bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-5">
              
              <div className="text-center space-y-2">
                <Logo className="h-8 w-auto text-indigo-600 mx-auto" />
                <p className="text-xs text-gray-400">Registrasi akun mahasiswa baru.</p>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Nama Lengkap</label>
                  <input
                    type="text"
                    value={demoRegName}
                    placeholder="Jane Doe"
                    onChange={(e) => setDemoRegName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Alamat Email Kampus</label>
                  <input
                    type="email"
                    value={demoRegEmail}
                    placeholder="jane.doe@kavio.edu"
                    onChange={(e) => setDemoRegEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="terms-check" className="rounded text-indigo-600" />
                  <label htmlFor="terms-check" className="text-[10px] text-gray-400">Saya setuju dengan syarat & ketentuan Kavio Edu.</label>
                </div>

                <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer">
                  Daftar Akun Baru
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RENDER MOCK: PROFILE PAGE */}
        {activeLayout === 'profile' && (
          <div className="bg-white border border-gray-100 p-5 sm:p-6 rounded-xl shadow-3xs space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg border-2 border-white shadow-xs">
                JD
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Ibu Jane Doe</h3>
                <p className="text-xs text-gray-400">NIDN: 0420072026 • Kimia Dasar & Analisis Sel</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-[9px] text-gray-400 uppercase font-bold block">Grup Pengajaran</span>
                <span className="text-xs font-semibold text-gray-700 block mt-1">Kelas Kimia Dasar IPA-1, IPA-2</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-[9px] text-gray-400 uppercase font-bold block">Status Kepegawaian</span>
                <span className="text-xs font-semibold text-gray-700 block mt-1">Dosen Tetap Kampus Utama</span>
              </div>
            </div>
          </div>
        )}

        {/* RENDER MOCK: 404 PAGE */}
        {activeLayout === '404-page' && (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-display font-bold text-gray-900">404 - Halaman Tidak Ditemukan</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto leading-normal">
                Oops, tautan kurikulum atau kode kelas yang Anda masukkan salah atau telah kedaluwarsa dari server.
              </p>
            </div>
            <button className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl cursor-pointer">
              Kembali ke Beranda
            </button>
          </div>
        )}

        {/* Footer layout indicator */}
        <div className="mt-8 pt-4 border-t border-gray-100/50 flex items-center justify-between text-[10px] text-gray-400">
          <span>Kavio Layout Specs v1.2.0</span>
          <span>Environment: Sandbox Mode</span>
        </div>
      </div>
    </div>
  );
}
