import { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Wifi, 
  WifiOff, 
  Inbox, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ComponentShowcase() {
  // Local state for the showcase interaction
  const [globalState, setGlobalState] = useState<'normal' | 'loading' | 'disabled' | 'error' | 'success'>('normal');
  const [showPassword, setShowPassword] = useState(false);
  const [inputText, setInputText] = useState('John Doe');
  const [inputEmail, setInputEmail] = useState('john.doe@kavio.edu');
  const [inputPassword, setInputPassword] = useState('supersecret123');
  const [inputBio, setInputBio] = useState('Senior Chemistry Teacher at Kavio High School.');
  const [searchVal, setSearchVal] = useState('');

  // Active accordion item
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  // Active Tab showcase
  const [activeShowcaseTab, setActiveShowcaseTab] = useState('tab-1');
  // Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Dialog visibility
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Toasts stack state
  const [toasts, setToasts] = useState<{ id: string; type: 'success' | 'error' | 'info'; message: string }[]>([]);
  // Tooltip active element
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Key Event triggers for Modal (ESC closes modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsDialogOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when modal/dialog is open
  useEffect(() => {
    if (isModalOpen || isDialogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen, isDialogOpen]);

  // Toast dispatch
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const accordionItems = [
    { title: 'Apakah data saya aman di Kavio Edu?', content: 'Tentu saja. Semua data lokal disimpan di client browser Anda dengan enkripsi sandboxed, dan data server dilindungi dengan aturan otentikasi ketat.' },
    { title: 'Bagaimana cara export nilai siswa?', content: 'Anda dapat mendownload seluruh rekapitulasi nilai siswa dalam bentuk file JSON terformat melalui panel tab "Tables & Lists" atau tab "Settings" dengan satu klik.' },
    { title: 'Bagaimana cara menambahkan tugas baru?', content: 'Gunakan tombol "+ Buat Tugas Baru" di halaman layout Teacher Dashboard. Masukkan judul soal, skema poin nilai, dan berikan petunjuk pengerjaan.' }
  ];

  return (
    <div className="space-y-12 max-w-5xl" id="component-showcase">
      {/* Page Header */}
      <div className="border-b border-gray-100 dark:border-slate-700/50 pb-5">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white">
          Interactive Component Library
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Koleksi komponen UI fungsional siap pakai yang dibangun dengan Vercel design framework.
        </p>
      </div>

      {/* State Switcher (Satisfying state testing requirements) */}
      <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">Uji State Komponen</p>
            <p className="text-[10px] text-gray-500 dark:text-slate-400">Klik state berikut untuk mengubah status seluruh tombol dan input di bawah.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-gray-100 dark:border-slate-700/50">
          {(['normal', 'loading', 'disabled', 'error', 'success'] as const).map((state) => (
            <button
              key={state}
              onClick={() => setGlobalState(state)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                globalState === state 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-gray-600 dark:text-slate-300 hover:text-black hover:bg-gray-50 dark:bg-slate-900'
              }`}
              id={`state-toggle-${state}`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: BUTTONS & INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* BUTTONS COL */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 dark:border-slate-700/50 pb-2">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">1. Button Styles</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Berbagai variasi tombol dengan state fungsional.</p>
          </div>

          <div className="space-y-4">
            {/* Primary Button */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-gray-400">Primary Button (Indigo Premium)</span>
              <button
                disabled={globalState === 'disabled'}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition-all active:scale-98 flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:bg-gray-100 dark:bg-slate-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {globalState === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {globalState === 'loading' ? 'Memuat data...' : 'Simpan Perubahan'}
              </button>
            </div>

            {/* Secondary Button */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-gray-400">Secondary Button (Solid Gray)</span>
              <button
                disabled={globalState === 'disabled'}
                className="w-full py-2.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-medium transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-100 dark:bg-slate-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {globalState === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {globalState === 'loading' ? 'Harap tunggu...' : 'Kembali ke Beranda'}
              </button>
            </div>

            {/* Outline Button */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-gray-400">Outline Button (White Outline)</span>
              <button
                disabled={globalState === 'disabled'}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:text-black rounded-xl text-xs font-medium transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-50 dark:bg-slate-900 disabled:text-gray-400 disabled:border-gray-100 dark:border-slate-700/50 disabled:cursor-not-allowed"
              >
                {globalState === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />}
                {globalState === 'loading' ? 'Mengunduh...' : 'Download File CSV'}
              </button>
            </div>

            {/* Ghost Button */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-gray-400">Ghost Button (No Background)</span>
              <button
                disabled={globalState === 'disabled'}
                className="w-full py-2.5 px-4 bg-transparent hover:bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:text-white rounded-xl text-xs font-medium transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
              >
                {globalState === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-300" />}
                {globalState === 'loading' ? 'Sedang sinkron...' : 'Batalkan Pengiriman'}
              </button>
            </div>

            {/* Danger Button */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-gray-400">Danger Button (Red Alert)</span>
              <button
                disabled={globalState === 'disabled'}
                className="w-full py-2.5 px-4 bg-rose-50 border border-rose-200/50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-medium transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-50 dark:bg-slate-900 disabled:text-gray-300 disabled:border-gray-100 dark:border-slate-700/50 disabled:cursor-not-allowed"
              >
                {globalState === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {globalState === 'loading' ? 'Menghapus...' : 'Hapus Akun Siswa'}
              </button>
            </div>
          </div>
        </div>

        {/* INPUTS COL */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 dark:border-slate-700/50 pb-2">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">2. Input Fields & Validation</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Form input text dengan feedback validasi dinamis.</p>
          </div>

          <div className="space-y-4">
            {/* Standard Text Input with User Icon */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-slate-200 flex items-center gap-1">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={inputText}
                  disabled={globalState === 'disabled'}
                  onChange={(e) => setInputText(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-1 transition-all ${
                    globalState === 'error' ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/10' :
                    globalState === 'success' ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/30/10' :
                    'border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                  } disabled:bg-gray-50 dark:bg-slate-900 disabled:text-gray-400 disabled:cursor-not-allowed`}
                />
              </div>
              {globalState === 'error' && (
                <p className="text-[10px] text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Kolom nama wajib diisi dengan benar.
                </p>
              )}
              {globalState === 'success' && (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Nama tersedia dan valid.
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-slate-200">Email Kampus / Sekolah</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={inputEmail}
                  disabled={globalState === 'disabled'}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 dark:bg-slate-900 disabled:text-gray-400"
                />
              </div>
            </div>

            {/* Password Input with show/hide */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-slate-200">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputPassword}
                  disabled={globalState === 'disabled'}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 dark:bg-slate-900 disabled:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 dark:text-slate-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-slate-200">Biografi Guru / Profil</label>
              <textarea
                value={inputBio}
                disabled={globalState === 'disabled'}
                onChange={(e) => setInputBio(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 dark:bg-slate-900 disabled:text-gray-400 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SPECIFIC COMPONENTS & TRIGGERS */}
      <div className="space-y-6">
        <div className="border-b border-gray-100 dark:border-slate-700/50 pb-2">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">3. Specific UI & Interactive Overlays</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">Toast notification, Dialog modals, drop-downs, tabs, and load indicators.</p>
        </div>

        {/* Action Triggers Row */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:text-black bg-white dark:bg-slate-800 font-medium rounded-xl text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            id="btn-open-modal"
          >
            Buka Modal Overlay
          </button>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="px-4 py-2 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:text-black bg-white dark:bg-slate-800 font-medium rounded-xl text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            id="btn-open-dialog"
          >
            Buka Dialog Warning
          </button>
          <button
            onClick={() => addToast('success', 'Tugas "Kimia Organik" berhasil dinilai dengan 95 EXP!')}
            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100/50 text-indigo-700 font-medium rounded-xl text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            id="btn-toast-success"
          >
            Kirim Toast Sukses
          </button>
          <button
            onClick={() => addToast('error', 'Gagal memproses unggahan. Periksa koneksi internet Anda.')}
            className="px-4 py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100/50 text-rose-700 font-medium rounded-xl text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            id="btn-toast-error"
          >
            Kirim Toast Gagal
          </button>
        </div>

        {/* Tabs, Accordion, Tooltips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* TABS & ACCORDION COL */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Interactive Tab Panels</span>
              
              <div className="border border-gray-100 dark:border-slate-700/50 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-2xs space-y-4">
                <div className="flex border-b border-gray-100 dark:border-slate-700/50">
                  {['tab-1', 'tab-2', 'tab-3'].map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setActiveShowcaseTab(tab)}
                      className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer -mb-[1px] ${
                        activeShowcaseTab === tab 
                          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                          : 'border-transparent text-gray-400 hover:text-gray-600 dark:text-slate-300'
                      }`}
                    >
                      Tab Panel {i + 1}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed min-h-[40px]">
                  {activeShowcaseTab === 'tab-1' && 'Konten Tab 1: Menampilkan rekapitulasi data akademik siswa semester ini.'}
                  {activeShowcaseTab === 'tab-2' && 'Konten Tab 2: Petunjuk pengerjaan dan file referensi PDF dari pengajar.'}
                  {activeShowcaseTab === 'tab-3' && 'Konten Tab 3: Riwayat penilaian, revisi tugas, dan masukan audio dari guru.'}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Faq Accordion Component</span>
              
              <div className="border border-gray-100 dark:border-slate-700/50 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden divide-y divide-gray-50 shadow-2xs">
                {accordionItems.map((item, idx) => {
                  const isOpen = activeAccordion === idx;
                  return (
                    <div key={idx} className="transition-all">
                      <button
                        onClick={() => setActiveAccordion(isOpen ? null : idx)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50 dark:bg-slate-900/30"
                      >
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">{item.title}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500 dark:text-slate-400" /> : <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400" />}
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden bg-gray-50 dark:bg-slate-900/50"
                          >
                            <p className="px-5 pb-4 text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                              {item.content}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CHIPS, BADGES, AND META DATA COL */}
          <div className="space-y-6">
            {/* Status indicators */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Badges, Status Chips & Indicators</span>
              <div className="border border-gray-100 dark:border-slate-700/50 p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-2xs space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 border border-indigo-100 dark:border-indigo-800/50">
                    Kimia Organik
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border border-emerald-100 dark:border-emerald-800/50">
                    Selesai
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 border border-amber-100 dark:border-amber-800/50">
                    Menunggu Review
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                    Terlambat
                  </span>
                </div>

                <div className="flex items-center gap-6 pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-gray-600 dark:text-slate-300">Online State</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <span className="text-gray-400">Offline State</span>
                  </div>
                </div>

                {/* Custom user avataer & tooltip indicator */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      JD
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white block leading-none">Jane Doe</span>
                    <span className="text-[10px] text-gray-400">Asisten Dosen</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skeleton & Loading placeholders */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Skeleton Loader Component</span>
              <div className="border border-gray-100 dark:border-slate-700/50 p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 bg-gray-100 dark:bg-slate-700 animate-pulse rounded-lg" />
                    <div className="h-2 w-2/3 bg-gray-100 dark:bg-slate-700 animate-pulse rounded-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-gray-100 dark:bg-slate-700 animate-pulse rounded-lg" />
                  <div className="h-2 w-4/5 bg-gray-100 dark:bg-slate-700 animate-pulse rounded-lg" />
                </div>
              </div>
            </div>

            {/* Pagination Component */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Pagination Bar</span>
              <div className="border border-gray-100 dark:border-slate-700/50 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-2xs flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs text-gray-600 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Prev
                </button>
                <div className="flex items-center gap-1.5 text-xs">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg font-medium cursor-pointer ${
                        currentPage === page 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:bg-slate-900 hover:text-black'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs text-gray-600 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY: MODAL COMPONENT */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 w-full max-w-md rounded-2xl p-6 shadow-xl z-10"
              id="modal-container"
            >
              <h3 className="text-base font-display font-semibold text-gray-900 dark:text-white mb-2">
                Simpan Perubahan Sandbox?
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
                Semua modifikasi token, layout demo, dan backup JSON Anda akan disimpan dalam sesi active local storage saat ini secara otomatis.
              </p>

              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:text-black bg-white dark:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    addToast('success', 'Perubahan layout berhasil disimpan.');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Ya, Simpan Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OVERLAY: WARNING DIALOG COMPONENT */}
      <AnimatePresence>
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDialogOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Dialog Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative bg-white dark:bg-slate-800 border border-rose-100 w-full max-w-sm rounded-2xl p-6 shadow-xl z-10"
              id="dialog-container"
            >
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Konfirmasi Reset Data
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Tindakan ini tidak dapat dibatalkan. Seluruh rekapitulasi data pengajar dan siswa akan dikembalikan ke settingan default pabrik.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-3.5 py-1.5 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:text-black rounded-lg text-xs font-medium cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  onClick={() => {
                    setIsDialogOpen(false);
                    addToast('error', 'Semua data sandbox telah di-reset.');
                  }}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING TOASTS NOTIFIER */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none" id="toasts-stack">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 pointer-events-auto ${
                t.type === 'success' ? 'bg-white dark:bg-slate-800 border-emerald-100 dark:border-emerald-800/50 text-gray-900 dark:text-white' :
                t.type === 'error' ? 'bg-white dark:bg-slate-800 border-rose-100 text-gray-900 dark:text-white' :
                'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700/50 text-gray-900 dark:text-white'
              }`}
            >
              {t.type === 'success' && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />}
              {t.type === 'error' && <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />}
              {t.type === 'info' && <HelpCircle className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />}
              
              <div className="flex-1">
                <p className="text-xs font-semibold leading-tight mb-1">
                  {t.type === 'success' ? 'Notifikasi Sukses' : t.type === 'error' ? 'Sinyal Masalah' : 'Sistem Info'}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-normal">{t.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
