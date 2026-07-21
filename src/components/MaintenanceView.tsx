import React from 'react';
import { motion } from 'motion/react';
import { Wrench, ShieldAlert, ArrowLeft, Clock, Sparkles } from 'lucide-react';

interface MaintenanceViewProps {
  featureName: string;
  message?: string;
  onBackToDashboard: () => void;
}

export default function MaintenanceView({ featureName, message, onBackToDashboard }: MaintenanceViewProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-8 animate-fadeIn font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 sm:p-12 text-center border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-400 dark:border-b-slate-900 shadow-xl space-y-6 relative overflow-hidden"
      >
        {/* Background accent glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FFC800]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#FF9600]/20 rounded-full blur-2xl pointer-events-none" />

        {/* 3D Icon Badge */}
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-[#FFC800] text-gray-900 rounded-3xl flex items-center justify-center mx-auto shadow-lg border-b-6 border-[#cca000] rotate-3 hover:rotate-0 transition-transform">
            <Wrench className="w-12 h-12" />
          </div>
          <span className="absolute -top-2 -right-2 bg-[#FF4B4B] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-bounce shadow-xs">
            MAINTENANCE
          </span>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-200 dark:border-amber-700">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>PEMELIHARAAN SISTEM</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase leading-tight font-display">
            {featureName} SEDANG DALAM PERBAIKAN 🛠️
          </h1>

          <p className="text-sm font-bold text-gray-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            {message || 'Fitur ini sedang dalam tahap peningkatan & perbaikan oleh Tim DEV Kavio Edu. Terima kasih atas kesabaran Anda, silakan coba beberapa saat lagi!'}
          </p>
        </div>

        {/* Mascot / Info Box */}
        <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFC800]" />
          <span>Pengembang sedang melakukan peningkatan performa server & pembaruan data.</span>
        </div>

        {/* Back Button */}
        <div className="pt-2">
          <button
            onClick={onBackToDashboard}
            className="w-full sm:w-auto bg-[#1CB0F6] hover:bg-[#0092E0] text-white text-sm font-black py-3.5 px-8 rounded-2xl border-b-4 border-[#0092E0] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-md"
            id="btn-back-from-maintenance"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE DASHBOARD</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
