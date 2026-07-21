import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Search, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Sparkles, 
  BookOpen, 
  Flame, 
  Share2, 
  ThumbsUp, 
  ChevronRight,
  Newspaper
} from 'lucide-react';
import Logo from './Logo';
import { UserProfile } from '../types';
import NavigationSidebar from './NavigationSidebar';

interface KavioBlogProps {
  onNavigate: (path: string) => void;
  userProfile?: UserProfile | null;
  onLogout?: () => void;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Tips Belajar' | 'Fitur Terbaru' | 'Metodologi' | 'Kisah Sukses';
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  badgeBg: string;
  badgeText: string;
  image: string;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'streak-mastery',
    title: '5 Rahasia Menjaga Streak Belajar Setiap Hari Tanpa Pernah Putus! 🔥',
    excerpt: 'Konsistensi adalah kunci utama menguasai materi baru. Pelajari bagaimana teknik mikro-belajar 10 menit sehari bisa mengubah kebiasaan belajarmu secara instan.',
    content: `Belajar setiap hari seringkali terasa berat jika kita membayangkan durasi yang panjang. Namun dengan pendekatan Gamifikasi di Kavio Edu, menjaga keberlanjutan belajar (Streak) jauh lebih mudah daripada yang kamu bayangkan!

### 1. Luangkan 10 Menit di Waktu yang Sama
Kunci dari kebiasaan baru adalah memicu aksi secara otomatis. Pilihlah waktu tetap seperti setelah sarapan atau tepat sebelum tidur untuk menyelesaikan minimal 1 modul singkat.

### 2. Manfaatkan Modul Interaktif & Kuis Singkat
Jangan langsung melompat ke tugas yang paling rumit. Mulailah dengan kuis interaktif 5 soal untuk memancing *flow state* otakmu.

### 3. Belajar Bersama Kelompok Circle
Ketika rasa malas datang, teman-teman di Kavio Circle-mu siap memberikan dorongan! Sistem poin kolektif membuat kalian saling mendukung.

### 4. Jangan Biarkan Api Streak-mu Padam
Streak bukan sekadar angka—ia adalah simbol komitmen pribadi dan bukti bahwa kamu makin dekat dengan impian akademikmu!`,
    category: 'Tips Belajar',
    author: 'Fatih Al-Ayyubi',
    authorRole: 'Head of Learning Design',
    date: '21 Juli 2026',
    readTime: '4 menit baca',
    badgeBg: 'bg-[#FF9600]',
    badgeText: 'text-white',
    image: '/aset/boostlogo.png',
    featured: true
  },
  {
    id: 'circle-learning',
    title: 'Mengenal Kavio Circle: Solusi Belajar Kelompok Seru Tanpa Bikin Bosan 👨‍👩‍👦‍👦',
    excerpt: 'Belajar sendiri sering sepi? Fitur Circle memungkinkan kamu belajar dalam grup kecil 2-5 siswa dengan sistem reward terintegrasi.',
    content: `Riset menunjukkan bahwa siswa yang belajar dalam kelompok kecil dengan jumlah 2 hingga 5 orang memiliki tingkat pemahaman 40% lebih tinggi dibandingkan belajar secara soliter.

Dengan Kavio Circle (Paket DUO, TRIO, & SQUAD), setiap anggota kelompok mendapatkan bimbingan terfokus namun tetap merasakan keceriaan diskusi bersama.`,
    category: 'Fitur Terbaru',
    author: 'Aulia Rahma',
    authorRole: 'Product Specialist',
    date: '19 Juli 2026',
    readTime: '3 menit baca',
    badgeBg: 'bg-[#1CB0F6]',
    badgeText: 'text-white',
    image: '/aset/trio.png'
  },
  {
    id: 'gamification-psychology',
    title: 'Mengapa Sistem Gamifikasi Membuat Otak Kita Ketagihan Belajar? 🧠',
    excerpt: 'Mengupas rahasia psikologi di balik sistem poin, badge 3D, dan piala yang dirancang khusus untuk meningkatkan motivasi akademik.',
    content: `Dopamin diproduksi bukan hanya saat kita menerima hadiah, namun saat kita mengantisipasi keberhasilan. Elemen 3D, efek aura keemasan, serta umpan balik suara menyenangkan di Kavio merangsang pusat pembelajaran di otak manusia secara alami.`,
    category: 'Metodologi',
    author: 'Dr. Irfan Santoso',
    authorRole: 'Cognitive Neuroscientist',
    date: '15 Juli 2026',
    readTime: '5 menit baca',
    badgeBg: 'bg-[#CE82FF]',
    badgeText: 'text-white',
    image: '/aset/masterlogo.png'
  },
  {
    id: 'teacher-guide-modules',
    title: 'Panduan Guru: Cara Membuat Modul Pembelajaran Interaktif Penuh Warna 📚',
    excerpt: 'Buat kelasmu semakin dinamis! Simak panduan langkah demi langkah menyusun materi pembelajaran bergaya gamifikasi.',
    content: `Guru kini dapat mengunggah ringkasan materi, melampirkan tugas pilihan ganda dan isian singkat, serta memantau pengumpulan tugas siswa secara real-time melalui Teacher Dashboard yang responsif.`,
    category: 'Tips Belajar',
    author: 'Siti Nurhaliza, M.Pd.',
    authorRole: 'Edu Consultant',
    date: '12 Juli 2026',
    readTime: '6 menit baca',
    badgeBg: 'bg-[#58CC02]',
    badgeText: 'text-white',
    image: '/aset/seedloogo.png'
  },
  {
    id: 'student-success-story',
    title: 'Kisah Faiz: Dari Nilai Matematika 60 Jadi Juara Olimpiade Berkat Kavio! 🏆',
    excerpt: 'Simak pengalaman Faiz mengatasi rasa takut pada angka dan membangun kepercayaan diri lewat latihan konsisten di Kavio Edu.',
    content: `"Dulu aku takut banget sama tugas matematika. Tapi begitu coba latihan di Kavio dengan visual yang lucu dan tantangan harian, aku jadi merasa kayak lagi main game!" cerita Faiz dengan penuh semangat.`,
    category: 'Kisah Sukses',
    author: 'Tim Redaksi Kavio',
    authorRole: 'Editorial Team',
    date: '10 Juli 2026',
    readTime: '4 menit baca',
    badgeBg: 'bg-[#FFC800]',
    badgeText: 'text-gray-900',
    image: '/aset/suqad.png'
  },
  {
    id: 'new-package-pricing',
    title: 'Resmi Rilis! Pilihan Paket Private & Circle dengan Hemat Hingga 12% 🎁',
    excerpt: 'Temukan paket belajar yang paling cocok untuk kebutuhan akademismu, mulai dari Paket SEED hingga MASTER.',
    content: `Kavio Edu meluncurkan varian Paket Private dan Circle terbaru dengan desain kartu 3D interaktif. Dapatkan diskon khusus untuk pendaftaran di bulan ini!`,
    category: 'Fitur Terbaru',
    author: 'Marketing Kavio',
    authorRole: 'Official Update',
    date: '08 Juli 2026',
    readTime: '3 menit baca',
    badgeBg: 'bg-[#FF4B4B]',
    badgeText: 'text-white',
    image: '/aset/growlogo.png'
  }
];

export default function KavioBlog({ onNavigate, userProfile, onLogout }: KavioBlogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dummyActiveTab, setDummyActiveTab] = useState<'dashboard' | 'assignments' | 'settings' | 'circles' | 'students' | 'modules' | 'packages'>('dashboard');

  const categories = ['Semua', 'Tips Belajar', 'Fitur Terbaru', 'Metodologi', 'Kisah Sukses'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'Semua' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];

  const handleBackToApp = () => {
    if (userProfile?.role === 'teacher') {
      onNavigate('/teacher');
    } else {
      onNavigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-slate-900 text-[#4B4B4B] dark:text-slate-100 flex flex-col font-sans">
      {/* Navigation Sidebar Drawer overlay for hamburger toggle */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            {/* Sidebar drawer */}
            <div className="relative z-50">
              <NavigationSidebar 
                role={userProfile?.role || 'student'}
                activeTab={dummyActiveTab}
                setActiveTab={(tab) => {
                  setDummyActiveTab(tab);
                  setIsSidebarOpen(false);
                  handleBackToApp();
                }}
                userProfile={userProfile || null}
                onLogout={onLogout || (() => {})}
                isMobileOpen={true}
                setIsMobileOpen={setIsSidebarOpen}
                onNavigate={onNavigate}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b-2 border-gray-200 dark:border-slate-700/60 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {/* Hamburger Sidebar Trigger Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 rounded-2xl bg-gray-100 dark:bg-slate-700/80 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-white transition-all active:scale-95 border-b-4 border-gray-300 dark:border-slate-900 active:border-b-0 active:translate-y-[4px] cursor-pointer"
            title="Buka Menu Navigasi Sidebar"
            id="btn-blog-hamburger"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToApp}>
            <Logo className="h-6 w-auto text-indigo-600 dark:text-indigo-400" />
            <span className="bg-[#1CB0F6] text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border-b-2 border-[#0092E0]">
              BLOG
            </span>
          </div>
        </div>

        {/* Back to App Button */}
        <button
          onClick={handleBackToApp}
          className="flex items-center gap-2 bg-[#58CC02] hover:bg-[#46A302] text-white text-xs font-black py-2.5 px-4 rounded-2xl shadow-sm border-b-4 border-[#46A302] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer"
          id="btn-back-to-app"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline uppercase tracking-wider">Kembali ke Aplikasi</span>
          <span className="sm:hidden uppercase tracking-wider">Aplikasi</span>
        </button>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1CB0F6] to-[#2B70C9] rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-lg border-b-8 border-[#0092E0]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-[#FFC800]" />
              <span>Wawasan & Cerita Edukasi</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase font-display">
              JELAJAHI DUNIA BELAJAR KAVIO! 🚀
            </h1>
            <p className="text-sm sm:text-base font-bold text-white/90 leading-relaxed font-sans">
              Temukan tips belajar cerdas, kabar fitur terbaru, panduan pedagogi, dan cerita inspiratif dari komunitas Kavio Edu.
            </p>

            {/* Search Input Bar */}
            <div className="pt-2">
              <div className="relative max-w-md">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari artikel, topik, atau kata kunci..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-gray-900 placeholder-gray-400 pl-11 pr-4 py-3.5 rounded-2xl font-bold text-xs shadow-md border-b-4 border-gray-300 focus:outline-none focus:ring-4 focus:ring-[#FFC800]/50"
                />
              </div>
            </div>
          </div>

          {/* Decorative Illustration background accent */}
          <div className="absolute right-4 bottom-0 opacity-20 sm:opacity-40 pointer-events-none transform translate-y-6">
            <img src="/aset/masterlogo.png" alt="Hero Illustration" className="w-64 sm:w-80 h-auto object-contain" />
          </div>
        </section>

        {/* Category Pills Filter */}
        <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border-b-4 ${
                  isSelected
                    ? 'bg-[#58CC02] text-white border-[#46A302] shadow-md -translate-y-0.5'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </section>

        {/* Featured Post Card */}
        {selectedCategory === 'Semua' && !searchQuery && featuredPost && (
          <section className="bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-300 dark:border-b-slate-900 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center shadow-sm hover:shadow-md transition-all">
            <div className="w-full md:w-1/2 aspect-video bg-[#FADBD8] rounded-2xl p-6 flex items-center justify-center relative overflow-hidden shrink-0 border-2 border-[#F0B8B2]">
              <img src={featuredPost.image} alt={featuredPost.title} className="w-48 h-48 object-contain hover:scale-110 transition-transform duration-500" />
              <span className="absolute top-4 left-4 bg-[#FF4B4B] text-white text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wider shadow-sm border-b-2 border-[#D93838]">
                UTAMA 🔥
              </span>
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-slate-400">
                <span className={`${featuredPost.badgeBg} ${featuredPost.badgeText} px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase`}>
                  {featuredPost.category}
                </span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}</span>
              </div>

              <h2 
                onClick={() => setActivePost(featuredPost)}
                className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase leading-tight hover:text-[#1CB0F6] cursor-pointer transition-colors"
              >
                {featuredPost.title}
              </h2>

              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1CB0F6] text-white font-black flex items-center justify-center text-xs">
                    {featuredPost.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 dark:text-white leading-none">{featuredPost.author}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{featuredPost.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActivePost(featuredPost)}
                  className="bg-[#1CB0F6] hover:bg-[#0092E0] text-white text-xs font-black py-2 px-4 rounded-xl shadow-xs border-b-4 border-[#0092E0] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Baca Artikel</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Grid of Articles */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wide">
              {selectedCategory === 'Semua' ? 'Artikel Terbaru' : `Kategori: ${selectedCategory}`}
            </h2>
            <span className="text-xs font-bold text-gray-400">
              Menampilkan {filteredPosts.length} artikel
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center space-y-3 border-2 border-dashed border-gray-200 dark:border-slate-700">
              <Newspaper className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-black text-gray-800 dark:text-slate-200">Tidak ada artikel ditemukan</h3>
              <p className="text-xs text-gray-400 font-bold">Coba kata kunci lain atau pilih kategori yang berbeda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  whileHover={{ y: -6 }}
                  className="bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-gray-200 dark:border-slate-700 border-b-6 border-b-gray-300 dark:border-b-slate-900 p-6 flex flex-col justify-between shadow-xs cursor-pointer group"
                  onClick={() => setActivePost(post)}
                >
                  <div className="space-y-4">
                    {/* Image Placeholder Frame */}
                    <div className="w-full aspect-video bg-[#F7F7F7] dark:bg-slate-900 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden border border-gray-100 dark:border-slate-700/50">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-500" 
                      />
                      <span className={`absolute top-3 left-3 ${post.badgeBg} ${post.badgeText} text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider shadow-2xs`}>
                        {post.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>

                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase leading-snug group-hover:text-[#1CB0F6] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-between">
                    <span className="text-xs font-black text-[#1CB0F6] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Baca Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">{post.author}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePost(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-400 overflow-y-auto z-50 space-y-6 custom-scrollbar"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className={`${activePost.badgeBg} ${activePost.badgeText} text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider`}>
                    {activePost.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase leading-tight font-display">
                    {activePost.title}
                  </h2>
                </div>

                <button
                  onClick={() => setActivePost(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Author & Info Bar */}
              <div className="flex items-center gap-4 py-3 border-y border-gray-100 dark:border-slate-700/60 text-xs font-bold text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1CB0F6] text-white font-black flex items-center justify-center text-xs">
                    {activePost.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white text-xs leading-none">{activePost.author}</p>
                    <p className="text-[10px] text-gray-400">{activePost.authorRole}</p>
                  </div>
                </div>
                <span>•</span>
                <span>{activePost.date}</span>
                <span>•</span>
                <span>{activePost.readTime}</span>
              </div>

              {/* Image banner inside modal */}
              <div className="w-full aspect-video bg-[#F7F7F7] dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-center border border-gray-100 dark:border-slate-700/50">
                <img src={activePost.image} alt={activePost.title} className="w-44 h-44 object-contain" />
              </div>

              {/* Main Article Content */}
              <div className="prose dark:prose-invert text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-200 leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {activePost.content}
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
                <button
                  onClick={() => setActivePost(null)}
                  className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white text-xs font-black py-2.5 px-5 rounded-2xl border-b-4 border-gray-300 dark:border-slate-900 active:border-b-0 active:translate-y-[4px] cursor-pointer"
                >
                  Tutup Artikel
                </button>

                <button
                  onClick={handleBackToApp}
                  className="bg-[#58CC02] text-white text-xs font-black py-2.5 px-5 rounded-2xl border-b-4 border-[#46A302] active:border-b-0 active:translate-y-[4px] cursor-pointer flex items-center gap-1.5"
                >
                  <span>Buka Aplikasi</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Section */}
      <footer className="bg-white dark:bg-slate-800 border-t-2 border-gray-200 dark:border-slate-700/60 py-8 px-4 sm:px-8 mt-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Logo className="h-5 w-auto text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">BLOG & INSIGHTS</span>
        </div>
        <p className="text-xs text-gray-400 font-bold max-w-md mx-auto">
          Media resmi informasi, panduan belajar, dan pembaruan sistem Kavio Edu.
        </p>
        <div className="pt-2">
          <button
            onClick={handleBackToApp}
            className="inline-flex items-center gap-2 bg-[#1CB0F6] hover:bg-[#0092E0] text-white text-xs font-black py-2.5 px-6 rounded-2xl border-b-4 border-[#0092E0] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE APLIKASI</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
