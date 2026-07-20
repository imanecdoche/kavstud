import { useState } from 'react';
import { Copy, Check, Type, Square, Layers, Search, Sun, Moon } from 'lucide-react';
import { ColorToken, TypographyToken, RadiusToken, ShadowToken } from '../types';

export default function TokenExplorer() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const colors: ColorToken[] = [
    { name: 'Primary (Indigo)', variable: '--color-primary-500', hex: '#4F46E5', description: 'Gaya utama tombol, accent state, dan highlight branding.', category: 'primary' },
    { name: 'Primary Hover', variable: '--color-primary-600', hex: '#4338CA', description: 'State hover untuk elemen utama.', category: 'primary' },
    { name: 'Primary Accent Light', variable: '--color-primary-50', hex: '#EEF2FF', description: 'Latar belakang badge, tab aktif, dan warning highlight.', category: 'primary' },
    
    { name: 'Secondary Slate', variable: 'text-gray-600 dark:text-slate-300', hex: '#4B5563', description: 'Teks deskripsi kedua, icon pendukung, border tidak aktif.', category: 'secondary' },
    { name: 'Muted Gray', variable: 'text-gray-400', hex: '#9CA3AF', description: 'Placeholder, text disabled, garis pemisah halus.', category: 'secondary' },
    
    { name: 'Success Green', variable: 'bg-emerald-500', hex: '#10B981', description: 'Indikator lulus, tugas selesai, dan tombol status sukses.', category: 'functional' },
    { name: 'Warning Yellow', variable: 'bg-amber-500', hex: '#F59E0B', description: 'Tugas menunggu review, score pas-pasan, alert ringan.', category: 'functional' },
    { name: 'Error Red', variable: 'bg-rose-500', hex: '#F43F5E', description: 'Sinyal error, tugas terlambat, feedback negatif.', category: 'functional' },
    
    { name: 'White Background', variable: 'bg-white dark:bg-slate-800', hex: '#FFFFFF', description: 'Kanvas utama dan halaman.', category: 'neutral' },
    { name: 'Surface Gray', variable: 'bg-gray-50 dark:bg-slate-900', hex: '#F9FAFB', description: 'Latar belakang section, table head, card inner body.', category: 'neutral' },
    { name: 'Border Light', variable: 'border-gray-100 dark:border-slate-700/50', hex: '#F3F4F6', description: 'Garis pembatas panel, grid halus, separator.', category: 'neutral' },
    { name: 'Text Primary', variable: 'text-gray-900 dark:text-white', hex: '#111827', description: 'Typography utama, judul, text dominan.', category: 'neutral' },
  ];

  const typography: TypographyToken[] = [
    { name: 'Display', specs: 'Space Grotesk, Bold, tracking-tight', usage: 'Digunakan untuk Headline, branding, hero-section besar.', example: 'KAVIO EDU DESIGN SYSTEM' },
    { name: 'Heading', specs: 'Inter, SemiBold (600), tracking-tight, text-lg/xl', usage: 'Section title, sub-module titles, card header.', example: 'Student Performance Report' },
    { name: 'Title', specs: 'Inter, Medium (500), text-md/base', usage: 'Nama item list, input label, item detail subtitle.', example: 'Introduction to Calculus' },
    { name: 'Body', specs: 'Inter, Regular (400), text-sm, leading-relaxed', usage: 'Semua paragraf, penjelasan soal, feedback tertulis.', example: 'Please review the assignment details below and submit before the deadline.' },
    { name: 'Small & Caption', specs: 'Inter, Medium, text-xs, text-gray-500 dark:text-slate-400', usage: 'Meta info, tanggal release, status indikator kecil.', example: 'Modified: 20 hours ago' },
    { name: 'Button Label', specs: 'Inter, SemiBold (600), text-sm', usage: 'Label tombol aksi, link navigasi tabs.', example: 'Submit Grading' },
  ];

  const radii: RadiusToken[] = [
    { name: 'Small', value: '4px (rounded-sm)', className: 'rounded-sm', description: 'Digunakan untuk Checkbox, Tooltip, Badge kecil.' },
    { name: 'Medium', value: '8px (rounded-lg)', className: 'rounded-lg', description: 'Digunakan untuk Input fields, Buttons, Dropdown items.' },
    { name: 'Large', value: '12px (rounded-xl)', className: 'rounded-xl', description: 'Default radius untuk Cards, Popups, Modals.' },
    { name: 'Extra Large', value: '16px (rounded-2xl)', className: 'rounded-2xl', description: 'Digunakan untuk Hero Panels, Outer Dashboard Wrappers.' },
  ];

  const shadows: ShadowToken[] = [
    { name: 'Small', value: 'shadow-xs', className: 'shadow-xs border border-gray-100 dark:border-slate-700/50', description: 'Subtle border shadow untuk input fields & card flat.' },
    { name: 'Medium', value: 'shadow-sm', className: 'shadow-sm border border-gray-100 dark:border-slate-700/50/70', description: 'Hover states untuk card, dropdown menu overlay.' },
    { name: 'Large', value: 'shadow-md', className: 'shadow-md border border-gray-100 dark:border-slate-700/50', description: 'Popup dialogs, Floating Action Buttons (FAB), Toast notification.' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const filteredColors = colors.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.hex.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.variable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 max-w-5xl" id="token-explorer">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-slate-700/50 pb-5">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white">
          Design Tokens
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Kumpulan variabel dasar, warna, typografi, radius, dan bayangan yang mendefinisikan Vercel Design Language untuk KAVIO EDU.
        </p>
      </div>

      {/* Colors Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Sun className="w-5 h-5 text-indigo-500" />
              1. Color Palette (Light Mode Base)
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Dua aksen utama: Indigo premium dan Charcoal neutral gray.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari warna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredColors.map((color) => (
            <div 
              key={color.name} 
              className="border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-gray-200 dark:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{color.name}</span>
                  <button 
                    onClick={() => copyToClipboard(color.hex)}
                    className="p-1 text-gray-400 hover:text-indigo-600 dark:text-indigo-400 rounded-md hover:bg-gray-50 dark:bg-slate-900 transition-colors"
                    title="Copy hex code"
                  >
                    {copiedText === color.hex ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {/* Visual patch */}
                <div 
                  className="h-12 w-full rounded-lg mb-3 border border-black/5"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-normal">{color.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>{color.hex}</span>
                <span className="text-gray-500 dark:text-slate-400 font-medium group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">{color.variable}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-indigo-500" />
            2. Typography System
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Sistem font sans-serif Inter premium didukung oleh headline Space Grotesk yang modern.</p>
        </div>

        <div className="border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden divide-y divide-gray-50 shadow-2xs">
          {typography.map((t) => (
            <div key={t.name} className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-gray-50 dark:bg-slate-900/50 transition-colors">
              <div className="space-y-1 max-w-xs">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{t.name}</span>
                <p className="text-xs font-mono text-gray-500 dark:text-slate-400">{t.specs}</p>
                <p className="text-xs text-gray-400 leading-normal">{t.usage}</p>
              </div>
              <div className="flex-1 md:pl-8">
                <span className={`text-gray-900 dark:text-white block ${
                  t.name === 'Display' ? 'font-display font-bold text-xl tracking-tight' :
                  t.name === 'Heading' ? 'font-sans font-semibold text-base tracking-tight' :
                  t.name === 'Title' ? 'font-sans font-medium text-sm' :
                  t.name === 'Small & Caption' ? 'font-sans text-xs text-gray-400' :
                  t.name === 'Button Label' ? 'font-sans font-semibold text-xs tracking-wider uppercase' :
                  'font-sans text-sm leading-normal'
                }`}>
                  {t.example}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(t.specs)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-gray-50 dark:bg-slate-900"
                title="Copy specs"
              >
                {copiedText === t.specs ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Radii & Shadows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radius Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Square className="w-5 h-5 text-indigo-500" />
              3. Border Radius Scale
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Sudut membulat yang konsisten dari elemen micro ke panel besar.</p>
          </div>

          <div className="space-y-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-2xl p-5 shadow-2xs">
            {radii.map((r) => (
              <div key={r.name} className="flex items-center gap-4 justify-between text-xs py-2 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="space-y-0.5 max-w-[200px]">
                  <span className="font-semibold text-gray-900 dark:text-white">{r.name}</span>
                  <p className="text-[11px] text-gray-400">{r.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-gray-500 dark:text-slate-400">{r.value}</span>
                  <div className={`w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-200/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold ${r.className}`}>
                    Aa
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shadows Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              4. Elevation Shadows
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Memberikan kesan kedalaman layout 3D yang elegan dan minimal.</p>
          </div>

          <div className="space-y-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-2xl p-5 shadow-2xs">
            {shadows.map((s) => (
              <div key={s.name} className="flex items-center gap-4 justify-between text-xs py-2 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="space-y-0.5 max-w-[180px]">
                  <span className="font-semibold text-gray-900 dark:text-white">{s.name}</span>
                  <p className="text-[11px] text-gray-400">{s.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-gray-500 dark:text-slate-400">{s.value}</span>
                  <div className={`w-14 h-10 bg-white dark:bg-slate-800 rounded-xl ${s.className}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
