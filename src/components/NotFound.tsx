import React from 'react';
import { HelpCircle, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (path: string) => void;
}

export default function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4 text-center space-y-6" id="not-found-page">
      <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
        <HelpCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-sm">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">404 - Halaman Hilang</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
          Tautan yang Anda kunjungi mungkin tidak valid atau halaman telah dipindahkan oleh sistem Kavio Edu.
        </p>
      </div>

      <button
        onClick={() => onNavigate('/login')}
        className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        style={{ minHeight: '44px' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </button>
    </div>
  );
}
