import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, CheckCircle2, Zap, Lock, Eye } from 'lucide-react';
import { RANK_TIERS, calculateLevelData } from '../utils/leveling';
import BadgePreviewModal from './BadgePreviewModal';
import Rotating3DTrophy from './Rotating3DTrophy';
import Icon3DTaskSheet from './Icon3DTaskSheet';
import Icon3DCrownShield from './Icon3DCrownShield';
import Icon3DFireFlame from './Icon3DFireFlame';

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
            className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 overscroll-contain overflow-y-auto animate-fadeIn"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2F3138] border border-white/10 rounded-[3px] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden relative overscroll-contain my-auto text-white font-sans"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40 shrink-0">
                <div className="flex items-center gap-3.5">
                  <Rotating3DTrophy className="w-10 h-10 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#66C0F4] tracking-wider block">LEVEL & RANK ROADMAP</span>
                    <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight mt-0.5">
                      Roadmap Level & Rank Badge
                    </h2>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-[2px] cursor-pointer transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                
                {/* Current Active Status Box */}
                <div className="relative rounded-[3px] bg-black/40 p-6 sm:p-8 text-white shadow-md overflow-hidden border border-white/10 space-y-6">
                  {/* Top Section: Large Featured Rank Badge & Info Below */}
                  <div className="flex flex-col items-center text-center space-y-3.5 w-full">
                    {/* Large Rank Badge Image */}
                    <div 
                      onClick={() => setPreviewRankIndex(RANK_TIERS.findIndex(t => t.name === rankTier.name))}
                      className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center cursor-pointer group"
                      title="Klik untuk Preview Full Badge"
                    >
                      <img 
                        src={rankTier.badgePath} 
                        alt={rankTier.name} 
                        className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-200" 
                      />
                      <div className="absolute inset-0 rounded-[2px] bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Eye className="w-7 h-7 text-[#66C0F4]" />
                      </div>
                    </div>

                    {/* Level & Rank Pills */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <span className="px-3 py-1 rounded-[2px] text-xs font-bold uppercase tracking-wider bg-[#66C0F4]/20 text-[#66C0F4] border border-[#66C0F4]/30 font-mono">
                        Level {level}
                      </span>
                      <span className="px-3 py-1 rounded-[2px] text-xs font-bold uppercase tracking-wider bg-[#A1CD44]/20 text-[#A1CD44] border border-[#A1CD44]/30 font-mono">
                        {rankTier.name}
                      </span>
                    </div>

                    {/* Total Akumulasi EXP below badge */}
                    <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                      Total Akumulasi: <span className="text-[#A1CD44] font-mono">{totalExp.toLocaleString('id-ID')} EXP</span>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#C6D4DF] max-w-lg leading-relaxed">
                      {rankTier.description}
                    </p>
                  </div>

                  {/* Bottom Section: Full Width Thick EXP Progress Bar with Barber Pole animation */}
                  <div className="w-full bg-[#2F3138] border border-white/10 p-5 rounded-[3px] space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#8A8A8A] uppercase tracking-wider font-mono">Progress Level {level}:</span>
                      <span className="text-[#66C0F4] font-mono text-sm">{Math.round(progressPercent)}%</span>
                    </div>

                    {/* Thick Progress Bar with Looping Barber-Pole Striped Effect */}
                    <div className="w-full h-5 sm:h-6 bg-black/60 rounded-[2px] overflow-hidden p-0.5 border border-white/15 relative shadow-inner">
                      <div
                        className="h-full bg-[#A1CD44] rounded-[2px] transition-all duration-500 relative overflow-hidden shadow-[0_0_12px_rgba(161,205,68,0.5)]"
                        style={{ width: `${Math.max(3, progressPercent)}%` }}
                      >
                        {/* Looping Barber Pole Animation Layer */}
                        <div 
                          className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-barberPole" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#C6D4DF] font-mono pt-0.5">
                      <span className="font-bold">{totalExp.toLocaleString('id-ID')} EXP</span>
                      <span>Target: <strong className="text-white">{nextLevelMinExp.toLocaleString('id-ID')} EXP</strong></span>
                    </div>
                    
                    {level < 100 && (
                      <p className="text-xs text-[#C6D4DF] text-center font-medium pt-1 border-t border-white/10">
                        Butuh <strong className="text-[#66C0F4] font-mono">{(nextLevelMinExp - totalExp).toLocaleString('id-ID')} EXP</strong> lagi untuk naik level!
                      </p>
                    )}
                  </div>
                </div>

                {/* How to Earn EXP Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#66C0F4]" />
                    <span>Cara Mendapatkan EXP</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Card 1: Tugas Harian */}
                    <div className="p-4 bg-black/40 rounded-[2px] border border-white/10 space-y-2 hover:border-[#66C0F4] transition-colors">
                      <div className="w-9 h-9 rounded-[2px] bg-black/50 border border-white/10 flex items-center justify-center">
                        <Icon3DTaskSheet className="w-7 h-7" />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase">Kerjakan Tugas Harian</h4>
                      <p className="text-[11px] text-[#C6D4DF]">
                        Setiap soal yang dijawab dengan benar memberikan nilai EXP langsung sesuai bobot soal yang ditentukan guru.
                      </p>
                    </div>

                    {/* Card 2: Kuis & Ujian */}
                    <div className="p-4 bg-black/40 rounded-[2px] border border-white/10 space-y-2 hover:border-[#66C0F4] transition-colors">
                      <div className="w-9 h-9 rounded-[2px] bg-black/50 border border-white/10 flex items-center justify-center">
                        <Icon3DCrownShield className="w-7 h-7" />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase">Kuis & Ujian Kompetensi</h4>
                      <p className="text-[11px] text-[#C6D4DF]">
                        Selesaikan kuis composite & lembar ujian untuk mendapatkan akumulasi EXP dalam jumlah besar secara cepat.
                      </p>
                    </div>

                    {/* Card 3: Streak & On-Time */}
                    <div className="p-4 bg-black/40 rounded-[2px] border border-white/10 space-y-2 hover:border-[#A1CD44] transition-colors">
                      <div className="w-9 h-9 rounded-[2px] bg-black/50 border border-white/10 flex items-center justify-center">
                        <Icon3DFireFlame className="w-7 h-7" />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase">Streak & Pengumpulan Tepat Waktu</h4>
                      <p className="text-[11px] text-[#C6D4DF]">
                        Pertahankan streak belajar harianmu dan kumpulkan tugas sebelum batas waktu untuk bonus performa terbaik.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Complete Ranking Tiers Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#A1CD44]" />
                      <span>Daftar Tingkatan Rank & Logo Badge (Klik Kartu Untuk Preview)</span>
                    </h3>
                    <span className="text-xs font-bold text-[#8A8A8A] font-mono">10 Tingkatan Peringkat</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {RANK_TIERS.map((tier, idx) => {
                      const isCurrent = level >= tier.minLevel && level <= tier.maxLevel;
                      const isUnlocked = level >= tier.minLevel;

                      return (
                        <div
                          key={tier.name}
                          onClick={() => setPreviewRankIndex(idx)}
                          className={`relative p-5 rounded-[2px] border transition-all duration-200 overflow-hidden cursor-pointer group ${
                            isCurrent
                              ? 'bg-[#66C0F4]/15 border-2 border-[#66C0F4] shadow-md'
                              : isUnlocked
                                ? 'bg-black/40 border-white/10 hover:border-[#66C0F4]'
                                : 'bg-black/60 border-white/5 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="relative z-10 flex items-center gap-4">
                            
                            {/* Badge Logo */}
                            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                              <img
                                src={tier.badgePath}
                                alt={tier.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>

                            {/* Rank Info */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-bold text-white uppercase group-hover:text-[#66C0F4] transition-colors">
                                    {tier.name}
                                  </h4>
                                </div>

                                <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-black/40 text-[#C6D4DF] border border-white/10 rounded-[2px] shrink-0">
                                  Lvl {tier.minLevel === tier.maxLevel ? tier.minLevel : `${tier.minLevel}–${tier.maxLevel}`}
                                </span>
                              </div>

                              <p className="text-[11px] text-[#C6D4DF] leading-tight line-clamp-2">
                                {tier.description}
                              </p>

                              <div className="pt-1 flex items-center justify-between gap-2">
                                {isCurrent ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#66C0F4] bg-[#66C0F4]/15 px-2 py-0.5 rounded-[2px]">
                                    <CheckCircle2 className="w-3 h-3" /> Peringkat Saat Ini
                                  </span>
                                ) : isUnlocked ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#A1CD44]">
                                    <CheckCircle2 className="w-3 h-3" /> Terbuka
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#8A8A8A]">
                                    <Lock className="w-3 h-3" /> Terkunci (Lvl {tier.minLevel})
                                  </span>
                                )}

                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#66C0F4] opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye className="w-3 h-3" /> Preview
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
              <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-end shrink-0">
                <button
                  onClick={onClose}
                  className="h-[38px] px-6 bg-black/40 hover:bg-white/10 text-white border border-white/20 text-xs font-bold rounded-[2px] uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center"
                >
                  TUTUP MODAL
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
