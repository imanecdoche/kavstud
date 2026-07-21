import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  NotebookText, 
  CircleDot, 
  Package, 
  Newspaper, 
  Inbox,
  Sliders,
  Check,
  X
} from 'lucide-react';
import { FeatureFlag, DEFAULT_FEATURE_FLAGS, getLocalFeatureFlags, saveLocalFeatureFlags } from '../utils/featureFlags';

export default function DevToolsMaintenance() {
  const [flags, setFlags] = useState<FeatureFlag[]>(() => getLocalFeatureFlags());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setFlags(getLocalFeatureFlags());
    window.addEventListener('kavio_feature_flags_updated', handleUpdate);
    return () => window.removeEventListener('kavio_feature_flags_updated', handleUpdate);
  }, []);

  const handleToggle = (id: string) => {
    const next = flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f);
    setFlags(next);
    saveLocalFeatureFlags(next);
    triggerSavedToast();
  };

  const handleMessageChange = (id: string, msg: string) => {
    const next = flags.map(f => f.id === id ? { ...f, maintenanceMessage: msg } : f);
    setFlags(next);
    saveLocalFeatureFlags(next);
  };

  const handleResetDefault = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh fitur ke kondisi aktif default?')) {
      setFlags(DEFAULT_FEATURE_FLAGS);
      saveLocalFeatureFlags(DEFAULT_FEATURE_FLAGS);
      triggerSavedToast();
    }
  };

  const triggerSavedToast = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const activeCount = flags.filter(f => f.enabled).length;
  const maintenanceCount = flags.filter(f => !f.enabled).length;

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return BookOpen;
      case 'NotebookText': return NotebookText;
      case 'CircleDot': return CircleDot;
      case 'Package': return Package;
      case 'Newspaper': return Newspaper;
      case 'Inbox': return Inbox;
      default: return Sliders;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn font-sans pb-16">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-300 dark:border-b-slate-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC800] text-gray-900 flex items-center justify-center shadow-md border-b-4 border-[#cca000] shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FF4B4B] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  DEV TOOL EXCLUSIVE
                </span>
                {savedSuccess && (
                  <span className="bg-[#58CC02] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider animate-bounce">
                    TERSIMPAN!
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-display mt-0.5">
                KONTROL FITUR & MAINTENANCE MODE
              </h1>
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400">
                Nonaktifkan tab & fitur tertentu secara instan untuk pemeliharaan atau perbaikan sistem.
              </p>
            </div>
          </div>
        </div>

        {/* System Health Overview Pills */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl px-4 py-2 text-center">
            <span className="block text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">FITUR AKTIF</span>
            <span className="text-xl font-black text-[#58CC02]">{activeCount} / {flags.length}</span>
          </div>

          <div className={`border rounded-2xl px-4 py-2 text-center ${
            maintenanceCount > 0 
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' 
              : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700'
          }`}>
            <span className="block text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">MAINTENANCE MODE</span>
            <span className={`text-xl font-black ${maintenanceCount > 0 ? 'text-[#FF9600]' : 'text-gray-400'}`}>
              {maintenanceCount} Fitur
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight font-display">
          DAFTAR FITUR & TAB SISTEM
        </h2>

        <button
          onClick={handleResetDefault}
          className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 text-xs font-bold py-2 px-3.5 rounded-xl border border-gray-300 dark:border-slate-600 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Kondisi Aktif</span>
        </button>
      </div>

      {/* Feature Flags Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flags.map((flag) => {
          const IconComp = getFeatureIcon(flag.iconName);

          return (
            <motion.div
              key={flag.id}
              layout
              className={`bg-white dark:bg-slate-800 rounded-[2rem] p-6 border-2 transition-all shadow-xs space-y-4 relative overflow-hidden ${
                flag.enabled
                  ? 'border-gray-200 dark:border-slate-700 border-b-6 border-b-gray-300 dark:border-b-slate-900'
                  : 'border-[#FFC800] dark:border-[#FFC800]/80 border-b-6 border-b-[#cca000] bg-amber-50/20'
              }`}
            >
              {/* Header Info & Toggle */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border-b-4 ${
                    flag.enabled 
                      ? 'bg-[#1CB0F6] text-white border-[#0092E0]' 
                      : 'bg-[#FFC800] text-gray-900 border-[#cca000]'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-gray-900 dark:text-white uppercase font-display leading-tight">
                      {flag.name}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                      {flag.description}
                    </p>
                  </div>
                </div>

                {/* 3D Switch Toggle */}
                <button
                  onClick={() => handleToggle(flag.id)}
                  className={`w-16 h-9 rounded-full p-1 transition-colors cursor-pointer border-b-2 relative ${
                    flag.enabled 
                      ? 'bg-[#58CC02] border-[#3b8c00]' 
                      : 'bg-gray-300 dark:bg-slate-600 border-gray-400'
                  }`}
                  id={`toggle-feature-${flag.id}`}
                  title={flag.enabled ? 'Klik untuk nonaktifkan (Maintenance)' : 'Klik untuk aktifkan fitur'}
                >
                  <motion.div
                    animate={{ x: flag.enabled ? 28 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center text-xs font-black"
                  >
                    {flag.enabled ? (
                      <Check className="w-4 h-4 text-[#58CC02]" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                  </motion.div>
                </button>
              </div>

              {/* Status Badge & Custom Maintenance Message Input */}
              <div className="pt-2 border-t border-gray-100 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    STATUS SEKARANG:
                  </span>
                  {flag.enabled ? (
                    <span className="bg-[#58CC02] text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                      <CheckCircle2 className="w-3 h-3" />
                      FITUR AKTIF
                    </span>
                  ) : (
                    <span className="bg-[#FFC800] text-gray-900 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-2xs animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      MAINTENANCE MODE
                    </span>
                  )}
                </div>

                {/* Maintenance Message Input */}
                {!flag.enabled && (
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest">
                      Pesan Pemeliharaan (Tampil untuk Pengguna):
                    </label>
                    <input
                      type="text"
                      value={flag.maintenanceMessage || ''}
                      onChange={(e) => handleMessageChange(flag.id, e.target.value)}
                      placeholder="Masukkan catatan maintenance..."
                      className="w-full bg-white dark:bg-slate-900 text-xs font-bold p-2.5 rounded-xl border-2 border-amber-300 dark:border-amber-700 focus:outline-none focus:border-[#FFC800] text-gray-800 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
