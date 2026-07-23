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
    title: '5 RAHASIA MENJAGA STREAK BELAJAR SETIAP HARI TANPA PERNAH PUTUS',
    excerpt: 'Konsistensi adalah kunci utama menguasai materi baru. Pelajari bagaimana teknik mikro-belajar 10 menit sehari bisa mengubah kebiasaan belajarmu secara instan.',
    content: `Belajar setiap hari seringkali terasa berat jika kita membayangkan durasi yang panjang. Namun dengan pendekatan Gamifikasi di Kavio Edu, menjaga keberlanjutan belajar (Streak) jauh lebih mudah daripada yang kamu bayangkan!

### 1. Luangkan 10 Menit di Waktu yang Sama
Kunci dari kebiasaan baru adalah memicu aksi secara otomatis. Pilihlah waktu tetap seperti setelah sarapan atau tepat sebelum tidur untuk menyelesaikan minimal 1 modul singkat.

### 2. Manfaatkan Modul Interaktif & Kuis Singkat
Jangan langsung melompat ke tugas yang paling rumit. Mulailah dengan kuis interaktif 5 soal untuk memancing flow state otakmu.

### 3. Belajar Bersama Kelompok Circle
Ketika rasa malas datang, teman-teman di Kavio Circle-mu siap memberikan dorongan! Sistem poin kolektif membuat kalian saling mendukung.

### 4. Jangan Biarkan Api Streak-mu Padam
Streak bukan sekadar angka—ia adalah simbol komitmen pribadi dan bukti bahwa kamu makin dekat dengan impian akademikmu!`,
    category: 'Tips Belajar',
    author: 'Fatih Al-Ayyubi',
    authorRole: 'Head of Learning Design',
    date: '21 Juli 2026',
    readTime: '4 menit baca',
    badgeBg: 'bg-[#A1CD44]/20',
    badgeText: 'text-[#A1CD44]',
    image: '/aset/boostlogo.png',
    featured: true
  },
  {
    id: 'circle-learning',
    title: 'MENGENAL KAVIO CIRCLE: SOLUSI BELAJAR KELOMPOK SERU TANPA BIKIN BOSAN',
    excerpt: 'Belajar sendiri sering sepi? Fitur Circle memungkinkan kamu belajar dalam grup kecil 2-5 siswa dengan sistem reward terintegrasi.',
    content: `Riset menunjukkan bahwa siswa yang belajar dalam kelompok kecil dengan jumlah 2 hingga 5 orang memiliki tingkat pemahaman 40% lebih tinggi dibandingkan belajar secara soliter.

Dengan Kavio Circle (Paket DUO, TRIO, & SQUAD), setiap anggota kelompok mendapatkan bimbingan terfokus namun tetap merasakan keceriaan diskusi bersama.`,
    category: 'Fitur Terbaru',
    author: 'Aulia Rahma',
    authorRole: 'Product Specialist',
    date: '19 Juli 2026',
    readTime: '3 menit baca',
    badgeBg: 'bg-[#66C0F4]/20',
    badgeText: 'text-[#66C0F4]',
    image: '/aset/trio.png'
  },
  {
    id: 'gamification-psychology',
    title: 'MENGAPA SISTEM GAMIFIKASI MEMBUAT OTAK KITA KETAGIHAN BELAJAR',
    excerpt: 'Mengupas rahasia psikologi di balik sistem poin, badge 3D, dan piala yang dirancang khusus untuk meningkatkan motivasi akademik.',
    content: `Dopamin diproduksi bukan hanya saat kita menerima hadiah, namun saat kita mengantisipasi keberhasilan. Elemen 3D, efek aura keemasan, serta umpan balik suara menyenangkan di Kavio merangsang pusat pembelajaran di otak manusia secara alami.`,
    category: 'Metodologi',
    author: 'Dr. Irfan Santoso',
    authorRole: 'Cognitive Neuroscientist',
    date: '15 Juli 2026',
    readTime: '5 menit baca',
    badgeBg: 'bg-[#66C0F4]/20',
    badgeText: 'text-[#66C0F4]',
    image: '/aset/masterlogo.png'
  },
  {
    id: 'teacher-guide-modules',
    title: 'PANDUAN GURU: CARA MEMBUAT MODUL PEMBELAJARAN INTERAKTIF PENUH WARNA',
    excerpt: 'Buat kelasmu semakin dinamis! Simak panduan langkah demi langkah menyusun materi pembelajaran bergaya gamifikasi.',
    content: `Guru kini dapat mengunggah ringkasan materi, melampirkan tugas pilihan ganda dan isian singkat, serta memantau pengumpulan tugas siswa secara real-time melalui Teacher Dashboard yang responsif.`,
    category: 'Tips Belajar',
    author: 'Siti Nurhaliza, M.Pd.',
    authorRole: 'Edu Consultant',
    date: '12 Juli 2026',
    readTime: '6 menit baca',
    badgeBg: 'bg-[#A1CD44]/20',
    badgeText: 'text-[#A1CD44]',
    image: '/aset/seedloogo.png'
  },
  {
    id: 'student-success-story',
    title: 'KISAH FAIZ: DARI NILAI MATEMATIKA 60 JADI JUARA OLIMPIADE BERKAT KAVIO',
    excerpt: 'Simak pengalaman Faiz mengatasi rasa takut pada angka dan membangun kepercayaan diri lewat latihan konsisten di Kavio Edu.',
    content: `"Dulu aku takut banget sama tugas matematika. Tapi begitu coba latihan di Kavio dengan visual yang lucu dan tantangan harian, aku jadi merasa kayak lagi main game!" cerita Faiz dengan penuh semangat.`,
    category: 'Kisah Sukses',
    author: 'Tim Redaksi Kavio',
    authorRole: 'Editorial Team',
    date: '10 Juli 2026',
    readTime: '4 menit baca',
    badgeBg: 'bg-[#A1CD44]/20',
    badgeText: 'text-[#A1CD44]',
    image: '/aset/suqad.png'
  },
  {
    id: 'new-package-pricing',
    title: 'RESMI RILIS: PILIHAN PAKET PRIVATE & CIRCLE DENGAN HEMAT HINGGA 12%',
    excerpt: 'Temukan paket belajar yang paling cocok untuk kebutuhan akademismu, mulai dari Paket SEED hingga MASTER.',
    content: `Kavio Edu meluncurkan varian Paket Private dan Circle terbaru dengan desain kartu 3D interaktif. Dapatkan diskon khusus untuk pendaftaran di bulan ini!`,
    category: 'Fitur Terbaru',
    author: 'Marketing Kavio',
    authorRole: 'Official Update',
    date: '08 Juli 2026',
    readTime: '3 menit baca',
    badgeBg: 'bg-[#66C0F4]/20',
    badgeText: 'text-[#66C0F4]',
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
    } else if (userProfile?.role === 'student') {
      onNavigate('/student');
    } else {
      onNavigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#171A21] text-white flex flex-col font-sans">
      {/* Navigation Sidebar Drawer overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
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
      <header className="sticky top-0 z-40 bg-[#171A21] backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-[0_4px_16px_rgba(0,0,0,0.6)] text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-black/40 hover:bg-white/10 text-white rounded-[2px] border border-white/20 transition-all cursor-pointer"
            title="Buka Menu Navigasi Sidebar"
            id="btn-blog-hamburger"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToApp}>
            <Logo className="h-6 w-auto" />
            <span className="bg-[#66C0F4]/15 border border-[#66C0F4]/40 text-[#66C0F4] text-[9px] font-bold px-2 py-0.5 rounded-[2px] uppercase tracking-wider font-mono">
              BLOG
            </span>
          </div>
        </div>

        {/* Back to App Button */}
        <button
          onClick={handleBackToApp}
          className="flex items-center gap-2 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold py-2 px-4 rounded-[2px] transition-all cursor-pointer"
          id="btn-back-to-app"
        >
          <ArrowLeft className="w-4 h-4 text-[#171A21]" />
          <span className="hidden sm:inline uppercase tracking-wider">Kembali ke Aplikasi</span>
          <span className="sm:hidden uppercase tracking-wider">Aplikasi</span>
        </button>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <section className="bg-[#2F3138] rounded-[3px] p-8 sm:p-10 text-white relative overflow-hidden border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="bg-[#66C0F4]/20 text-[#66C0F4] text-[9px] font-bold px-2.5 py-0.5 rounded-[2px] border border-[#66C0F4]/30 uppercase tracking-wider font-mono inline-block">
              WAWASAN & CERITA EDUKASI
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-white uppercase tracking-tight leading-tight">
              JELAJAHI DUNIA BELAJAR KAVIO
            </h1>
            <p className="text-xs sm:text-sm text-[#C6D4DF] leading-relaxed">
              Temukan tips belajar cerdas, kabar fitur terbaru, panduan pedagogi, dan cerita inspiratif dari komunitas Kavio Edu.
            </p>

            {/* Search Input Bar */}
            <div className="pt-2">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
                <input
                  type="text"
                  placeholder="Cari artikel, topik, atau kata kunci..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 text-white placeholder-[#8A8A8A] pl-10 pr-4 py-2.5 rounded-[2px] font-medium text-xs border border-white/15 focus:outline-none focus:border-[#66C0F4] transition-all"
                />
              </div>
            </div>
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
                className={`px-4 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#66C0F4] text-[#171A21]'
                    : 'bg-black/40 text-[#C6D4DF] border border-white/15 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </section>

        {/* Featured Post Card */}
        {selectedCategory === 'Semua' && !searchQuery && featuredPost && (
          <section className="bg-[#2F3138] rounded-[3px] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
            <div className="w-full md:w-1/2 aspect-video bg-black/40 rounded-[2px] p-6 flex items-center justify-center relative overflow-hidden shrink-0 border border-white/10">
              <img src={featuredPost.image} alt={featuredPost.title} className="w-40 h-40 object-contain hover:scale-105 transition-transform duration-300" />
              <span className="absolute top-3 left-3 bg-[#A1CD44]/20 text-[#A1CD44] border border-[#A1CD44]/30 text-[9px] font-bold px-2.5 py-0.5 rounded-[2px] uppercase font-mono">
                UTAMA
              </span>
            </div>

            <div className="w-full md:w-1/2 space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-[#8A8A8A]">
                <span className="bg-[#66C0F4]/20 text-[#66C0F4] border border-[#66C0F4]/30 px-2 py-0.5 rounded-[2px] text-[9px] font-bold uppercase font-mono">
                  {featuredPost.category}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]"><Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}</span>
              </div>

              <h2 
                onClick={() => setActivePost(featuredPost)}
                className="text-xl sm:text-2xl font-bold text-white uppercase leading-tight hover:text-[#66C0F4] cursor-pointer transition-colors"
              >
                {featuredPost.title}
              </h2>

              <p className="text-xs text-[#C6D4DF] leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="pt-3 flex items-center justify-between border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[2px] bg-black/40 text-[#66C0F4] border border-white/10 font-bold flex items-center justify-center text-xs">
                    {featuredPost.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">{featuredPost.author}</p>
                    <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5">{featuredPost.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActivePost(featuredPost)}
                  className="bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] text-xs font-bold py-2 px-4 rounded-[2px] transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>Baca Artikel</span>
                  <ChevronRight className="w-4 h-4 text-[#171A21]" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Grid of Articles */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              {selectedCategory === 'Semua' ? 'Artikel Terbaru' : `Kategori: ${selectedCategory}`}
            </h2>
            <span className="text-xs font-bold text-[#8A8A8A] font-mono">
              Menampilkan {filteredPosts.length} artikel
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-[#2F3138] rounded-[3px] p-12 text-center space-y-3 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              <Newspaper className="w-10 h-10 text-[#8A8A8A] mx-auto" />
              <h3 className="text-sm font-bold text-white uppercase">Tidak ada artikel ditemukan</h3>
              <p className="text-xs text-[#C6D4DF]">Coba kata kunci lain atau pilih kategori yang berbeda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#2F3138] rounded-[3px] border border-white/10 hover:border-[#66C0F4] p-5 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer group text-white transition-all"
                  onClick={() => setActivePost(post)}
                >
                  <div className="space-y-3">
                    <div className="w-full aspect-video bg-black/40 rounded-[2px] p-4 flex items-center justify-center relative overflow-hidden border border-white/10">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-28 h-28 object-contain group-hover:scale-105 transition-transform duration-300" 
                      />
                      <span className="absolute top-2.5 left-2.5 bg-[#A1CD44]/20 text-[#A1CD44] border border-[#A1CD44]/30 text-[9px] font-bold px-2 py-0.5 rounded-[2px] uppercase font-mono">
                        {post.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-[#8A8A8A] font-mono">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white uppercase leading-snug group-hover:text-[#66C0F4] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#C6D4DF] line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#66C0F4] flex items-center gap-1 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                      Baca Selengkapnya <ChevronRight className="w-3.5 h-3.5 text-[#66C0F4]" />
                    </span>
                    <span className="text-[10px] font-bold text-[#8A8A8A] truncate max-w-[100px]">{post.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overscroll-contain overflow-y-auto">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[85vh] bg-[#2F3138] border border-white/15 rounded-[3px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-y-auto z-50 space-y-5 custom-scrollbar text-white font-sans my-auto"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="bg-[#66C0F4]/20 text-[#66C0F4] border border-[#66C0F4]/30 text-[10px] font-bold px-2.5 py-0.5 rounded-[2px] uppercase font-mono">
                    {activePost.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white uppercase leading-tight tracking-tight">
                    {activePost.title}
                  </h2>
                </div>

                <button
                  onClick={() => setActivePost(null)}
                  className="p-1.5 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-[2px] cursor-pointer shrink-0"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 py-2.5 border-y border-white/10 text-xs text-[#8A8A8A] font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[2px] bg-black/40 text-[#66C0F4] border border-white/10 font-bold flex items-center justify-center text-xs">
                    {activePost.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs leading-none">{activePost.author}</p>
                    <p className="text-[10px] text-[#8A8A8A] mt-0.5">{activePost.authorRole}</p>
                  </div>
                </div>
                <span>•</span>
                <span>{activePost.date}</span>
                <span>•</span>
                <span>{activePost.readTime}</span>
              </div>

              <div className="w-full aspect-video bg-black/40 rounded-[2px] p-6 flex items-center justify-center border border-white/10">
                <img src={activePost.image} alt={activePost.title} className="w-36 h-36 object-contain" />
              </div>

              <div className="text-xs sm:text-sm font-medium text-[#C6D4DF] leading-relaxed space-y-4 whitespace-pre-line">
                {activePost.content}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setActivePost(null)}
                  className="bg-black/40 hover:bg-white/10 text-white text-xs font-bold py-2.5 px-5 rounded-[2px] border border-white/20 uppercase tracking-wider cursor-pointer transition-all"
                >
                  TUTUP ARTIKEL
                </button>

                <button
                  onClick={handleBackToApp}
                  className="bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold py-2.5 px-5 rounded-[2px] cursor-pointer flex items-center gap-1.5 uppercase tracking-wider transition-all"
                >
                  <span>BUKA APLIKASI</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-[#171A21]" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Section */}
      <footer className="bg-[#2F3138] border-t border-white/10 py-8 px-4 sm:px-8 mt-12 text-center space-y-4 text-white">
        <div className="flex items-center justify-center gap-2">
          <Logo className="h-5 w-auto text-white" />
          <span className="text-xs font-bold text-[#66C0F4] uppercase tracking-widest font-mono">BLOG & INSIGHTS</span>
        </div>
        <p className="text-xs text-[#C6D4DF] max-w-md mx-auto">
          Media resmi informasi, panduan belajar, dan pembaruan sistem Kavio Edu.
        </p>
        <div className="pt-2">
          <button
            onClick={handleBackToApp}
            className="inline-flex items-center gap-2 bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] text-xs font-bold py-2.5 px-6 rounded-[2px] transition-all cursor-pointer shadow-md uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 text-[#171A21]" />
            <span>KEMBALI KE APLIKASI</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
