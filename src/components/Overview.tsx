import { 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  Smartphone, 
  Settings, 
  Compass, 
  MousePointer, 
  Info,
  Maximize,
  ArrowRight
} from 'lucide-react';

interface OverviewProps {
  onNextTab: () => void;
}

export default function Overview({ onNextTab }: OverviewProps) {
  return (
    <div className="space-y-10 max-w-4xl" id="overview-component">
      {/* Hero Welcome banner */}
      <div className="bg-gradient-to-br from-indigo-50/70 to-white border border-indigo-100/50 p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 text-[10px] font-bold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Kavio Edu Specification Live Preview
        </div>
        
        <h1 className="text-3xl font-display font-bold text-gray-900 tracking-tight leading-tight">
          Sistem Desain & Panduan UI/UX <br />
          <span className="text-indigo-600">KAVIO EDU</span>
        </h1>
        
        <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
          Sebuah cetak biru antarmuka pendidikan modern, dirancang menggunakan Vercel Design Language. Berfokus penuh pada minimalisme, ritme spasial 8px, kegunaan yang tinggi untuk pengajar dan siswa, serta aksesibilitas tinggi.
        </p>

        <div className="pt-2 flex flex-wrap gap-2.5">
          <button
            onClick={onNextTab}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-xs"
          >
            Pelajari Design Tokens
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Design Principles Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Filosofi & Prinsip Desain Utama
          </h2>
          <p className="text-xs text-gray-500">Lima pilar utama yang menjadi pondasi seluruh komponen Kavio Edu.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border border-gray-100 bg-white p-5 rounded-2xl shadow-3xs space-y-2">
            <span className="font-semibold text-xs text-gray-900 block">⚡ Fast & Responsive</span>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Meminimalkan layout shift dan flicker visual. Semua komponen didukung rendering instan, pemuatan skeleton transisi, serta layout elastis di mobile.
            </p>
          </div>

          <div className="border border-gray-100 bg-white p-5 rounded-2xl shadow-3xs space-y-2">
            <span className="font-semibold text-xs text-gray-900 block">🎨 Minimalist Vercel Language</span>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Warna dasar putih dipasangkan dengan abu-abu netral dan satu warna aksen Indigo (#4F46E5). Tidak ada dekorasi berlebih demi keterbacaan yang tinggi.
            </p>
          </div>

          <div className="border border-gray-100 bg-white p-5 rounded-2xl shadow-3xs space-y-2">
            <span className="font-semibold text-xs text-gray-900 block">📱 Mobile-Safety & Touch-First</span>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Memastikan area sentuh minimal 44x44 piksel pada elemen interaktif. Diuji ketat pada lebar viewport 320px, 375px, 390px, dan 430px.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile safety constraints information list */}
      <div className="border border-gray-100 bg-white p-6 rounded-2xl shadow-3xs space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Smartphone className="w-4.5 h-4.5 text-indigo-500" />
          Mobile Safety Constraints (Aturan Penyelamat Layout)
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Sistem desain Kavio Edu menerapkan aturan responsif ketat untuk mencegah layout overflow pada layar HP siswa yang kecil:
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 font-medium">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            Row horizontal otomatis di-stack vertikal jika sempit.
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            Tidak boleh ada overflow horizontal dalam satu viewport.
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            Satu layar fokus penuh pada tugas utama (White space).
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            Nama tombol dipotong atau wrap aman tanpa merusak baris.
          </li>
        </ul>
      </div>

      {/* Developer note */}
      <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
        <Info className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Informasi Sandbox Terintegrasi:</span>
          <p className="text-[11px] text-amber-700/90 mt-0.5 leading-relaxed">
            Gunakan sidebar menu di sebelah kiri untuk berpindah tab dan menguji performa komponen secara interaktif. Anda juga dapat mengekspor atau mereset seluruh modifikasi sesi Anda kapan saja melalui tab <strong className="underline">Settings & Dev Info</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
