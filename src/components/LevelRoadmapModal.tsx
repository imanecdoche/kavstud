import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Sparkles, CheckCircle2, Zap, Lock, ShieldCheck, Eye } from 'lucide-react';
import { RANK_TIERS, calculateLevelData } from '../utils/leveling';
import BadgePreviewModal from './BadgePreviewModal';

interface LevelRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalExp: number;
}

export default function LevelRoadmapModal({ isOpen, onClose, totalExp }: LevelRoadmapModalProps) {
  const levelData = calculateLevelData(totalExp);
  const { level, rankTier, progressPercent, currentExpInLevel, expNeededForNextLevel, nextLevelMinExp } = levelData;

  const [previewRankIndex, setPreviewRankIndex] = useState<number | null>(null);

  // Body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overscroll-contain overflow-y-auto animate-fadeIn"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative overscroll-contain my-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shadow-3xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Roadmap Level & Rank Badge
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Tingkatkan EXP dari pengerjaan tugas untuk menaikkan level dan membuka badge kehormatan! Klik kartu badge untuk preview full HD & efek visual.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="p-6 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
            
            {/* Current Active Status Box */}
            <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-indigo-500/30">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Badge & Level Info */}
                <div className="flex items-center gap-5">
                  <div 
                    onClick={() => setPreviewRankIndex(RANK_TIERS.findIndex(t => t.name === rankTier.name))}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center cursor-pointer group"
                    title="Klik untuk Preview Full Badge"
                  >
                    {rankTier.isTop3 && (
                      <div 
                        className="absolute inset-0 rounded-full blur-md opacity-80 animate-pulse pointer-events-none"
                        style={{ backgroundColor: rankTier.glowColor }}
                      />
                    )}
                    <img 
                      src={rankTier.badgePath} 
                      alt={rankTier.name} 
                      className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                      <Eye className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/40">
                        Level {level}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r ${rankTier.color} text-white shadow-sm`}>
                        {rankTier.name}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                      Total Akumulasi: <span className="text-yellow-300 font-mono">{totalExp.toLocaleString('id-ID')} EXP</span>
                    </h3>

                    <p className="text-xs text-gray-300 max-w-md">
                      {rankTier.description}
                    </p>
                  </div>
                </div>

                {/* EXP Progress Box */}
                <div className="w-full md:w-72 bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl space-y-2 shrink-0">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-300">Progress Level {level}:</span>
                    <span className="text-yellow-300 font-mono">{Math.round(progressPercent)}%</span>
                  </div>

                  <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-emerald-400 rounded-full shadow-xs"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-300 font-mono">
                    <span>{totalExp} EXP</span>
                    <span>Target: {nextLevelMinExp} EXP</span>
                  </div>
                  
                  {level < 100 && (
                    <p className="text-[10px] text-indigo-200 text-center font-medium pt-1">
                      Butuh <strong className="text-white">{(nextLevelMinExp - totalExp).toLocaleString('id-ID')} EXP</strong> lagi untuk naik level!
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* How to Earn EXP Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Cara Mendapatkan EXP
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Kerjakan Tugas Harian</h4>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">
                    Setiap soal yang dijawab dengan benar memberikan nilai EXP langsung sesuai bobot soal yang ditentukan guru.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Kuis & Ujian Kompetensi</h4>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">
                    Selesaikan kuis composite & lembar ujian untuk mendapatkan akumulasi EXP dalam jumlah besar secara cepat.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Streak & Pengumpulan Tepat Waktu</h4>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">
                    Pertahankan streak belajar harianmu dan kumpulkan tugas sebelum batas waktu untuk bonus performa terbaik.
                  </p>
                </div>
              </div>
            </div>

            {/* Complete Ranking Tiers Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" />
                  Daftar Tingkatan Rank & Logo Badge (Klik Kartu Untuk Preview)
                </h3>
                <span className="text-xs font-semibold text-gray-400">10 Tingkatan Peringkat</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RANK_TIERS.map((tier, idx) => {
                  const isCurrent = level >= tier.minLevel && level <= tier.maxLevel;
                  const isUnlocked = level >= tier.minLevel;
                  const isTop3 = tier.isTop3;

                  return (
                    <div
                      key={tier.name}
                      onClick={() => setPreviewRankIndex(idx)}
                      className={`relative p-5 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group ${
                        isCurrent
                          ? 'bg-gradient-to-r from-indigo-50/90 via-purple-50/90 to-sky-50/90 dark:from-indigo-950/60 dark:via-purple-950/60 dark:to-slate-900 border-2 border-indigo-500 shadow-md hover:scale-[1.02]'
                          : isUnlocked
                            ? 'bg-white dark:bg-slate-800/80 border-gray-200 dark:border-slate-700/60 shadow-3xs hover:border-indigo-400 hover:shadow-md'
                            : 'bg-gray-50/70 dark:bg-slate-900/40 border-gray-100 dark:border-slate-800/50 hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {/* Top 3 Glow & Smoke/Mist Overlay */}
                      {isTop3 && (
                        <>
                          {/* Radial Glow Layer */}
                          <div 
                            className="absolute -inset-10 rounded-full blur-2xl opacity-40 pointer-events-none animate-mist-glow"
                            style={{ background: `radial-gradient(circle, ${tier.glowColor} 0%, transparent 70%)` }}
                          />
                          
                          {/* Soft Smoke/Mist Effect */}
                          <div 
                            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none"
                          />
                        </>
                      )}

                      <div className="relative z-10 flex items-center gap-4">
                        
                        {/* Badge Logo with Top 3 Glow Effect */}
                        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                          {isTop3 && (
                            <div 
                              className="absolute inset-0 rounded-full blur-md opacity-80 animate-pulse pointer-events-none"
                              style={{ backgroundColor: tier.glowColor }}
                            />
                          )}

                          <img
                            src={tier.badgePath}
                            alt={tier.name}
                            className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 ${
                              !isUnlocked ? 'filter contrast-90 group-hover:contrast-100' : 'drop-shadow-md'
                            }`}
                          />
                        </div>

                        {/* Rank Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-extrabold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {tier.name}
                              </h4>
                              {isTop3 && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-amber-400 text-amber-950 shadow-xs">
                                  TOP RANK
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] font-bold font-mono px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-md shrink-0">
                              Lvl {tier.minLevel === tier.maxLevel ? tier.minLevel : `${tier.minLevel}–${tier.maxLevel}`}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight line-clamp-2">
                            {tier.description}
                          </p>

                          <div className="pt-1 flex items-center justify-between gap-2">
                            {isCurrent ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-100/80 dark:bg-indigo-900/40 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" /> Peringkat Saat Ini
                              </span>
                            ) : isUnlocked ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> Terbuka
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                                <Lock className="w-3 h-3" /> Terkunci (Butuh Lvl {tier.minLevel})
                              </span>
                            )}

                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="w-3 h-3" /> Preview Full
                            </span>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between shrink-0">
            <span className="text-xs text-gray-400 font-medium">
              Klik pada kartu badge mana saja untuk pratinjau full HD & efek visual aura.
            </span>
            <button
              onClick={onClose}
              className="btn-duo-blue px-6 py-2.5 text-xs font-black cursor-pointer"
            >
              Tutup Modal
            </button>
          </div>

        </motion.div>
      </div>

      {/* Full Size Badge Preview Modal */}
      {previewRankIndex !== null && (
        <BadgePreviewModal
          isOpen={previewRankIndex !== null}
          onClose={() => setPreviewRankIndex(null)}
          selectedRankIndex={previewRankIndex}
          onSelectRankIndex={(idx) => setPreviewRankIndex(idx)}
          userLevel={level}
        />
      )}
    </AnimatePresence>
  );
}
