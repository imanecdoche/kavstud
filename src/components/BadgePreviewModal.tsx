import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Lock, CheckCircle2, Sparkles, Star, Zap, ShieldAlert, Award } from 'lucide-react';
import { RANK_TIERS, RankTier, getRequiredExpForLevel } from '../utils/leveling';

interface BadgePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRankIndex: number;
  onSelectRankIndex: (index: number) => void;
  userLevel: number;
}

export default function BadgePreviewModal({
  isOpen,
  onClose,
  selectedRankIndex,
  onSelectRankIndex,
  userLevel
}: BadgePreviewModalProps) {
  const currentTier: RankTier = RANK_TIERS[selectedRankIndex] || RANK_TIERS[0];
  const isUnlocked = userLevel >= currentTier.minLevel;
  const isCurrentLevelRank = userLevel >= currentTier.minLevel && userLevel <= currentTier.maxLevel;
  const requiredExp = getRequiredExpForLevel(currentTier.minLevel);

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

  const handlePrev = () => {
    if (selectedRankIndex > 0) {
      onSelectRankIndex(selectedRankIndex - 1);
    } else {
      onSelectRankIndex(RANK_TIERS.length - 1);
    }
  };

  const handleNext = () => {
    if (selectedRankIndex < RANK_TIERS.length - 1) {
      onSelectRankIndex(selectedRankIndex + 1);
    } else {
      onSelectRankIndex(0);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 overscroll-contain overflow-y-auto animate-fadeIn"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#2F3138] border border-white/10 rounded-[3px] w-full max-w-2xl flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden relative text-white my-auto font-sans"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[2px] bg-black/40 text-[#66C0F4] flex items-center justify-center border border-white/10">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    Preview Full Badge LOGO
                  </h3>
                  <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider bg-black/40 text-[#66C0F4] border border-white/10 font-mono">
                    Tier {selectedRankIndex + 1} / {RANK_TIERS.length}
                  </span>
                </div>
                <p className="text-xs text-[#C6D4DF]">
                  Prinjinjauan visual badge lengkap dengan spesifikasi level.
                </p>
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

          {/* Body: Center Badge Visual Showcase */}
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden custom-scrollbar">
            
            {/* FLOATING BADGE LOGO */}
            <div className="relative z-10 py-4 flex items-center justify-center w-full">
              
              {/* Navigation Left Arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-white/10 text-white rounded-[2px] border border-white/15 shadow-md cursor-pointer transition-all z-20"
                title="Badge Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Navigation Right Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-white/10 text-white rounded-[2px] border border-white/15 shadow-md cursor-pointer transition-all z-20"
                title="Badge Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                <img
                  src={currentTier.badgePath}
                  alt={currentTier.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>

            {/* Badge Info Text & Status */}
            <div className="relative z-10 text-center space-y-3 max-w-md mx-auto">
              
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-[2px] text-xs font-bold uppercase tracking-wider bg-[#A1CD44]/20 text-[#A1CD44] border border-[#A1CD44]/30 font-mono">
                  RANK: {currentTier.name}
                </span>

                <span className="px-3 py-1 rounded-[2px] text-xs font-bold uppercase tracking-wider bg-[#66C0F4]/20 text-[#66C0F4] border border-[#66C0F4]/30 font-mono">
                  Level {currentTier.minLevel === currentTier.maxLevel ? currentTier.minLevel : `${currentTier.minLevel} – ${currentTier.maxLevel}`}
                </span>
              </div>

              {/* Status Pill */}
              <div className="pt-1 flex items-center justify-center">
                {isCurrentLevelRank ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-xs font-bold uppercase bg-[#A1CD44]/20 text-[#A1CD44] border border-[#A1CD44]/40">
                    <CheckCircle2 className="w-4 h-4 text-[#A1CD44]" /> Rank Aktif Anda
                  </span>
                ) : isUnlocked ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-xs font-bold uppercase bg-[#66C0F4]/20 text-[#66C0F4] border border-[#66C0F4]/40">
                    <CheckCircle2 className="w-4 h-4 text-[#66C0F4]" /> Peringkat Telah Terbuka
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-xs font-bold uppercase bg-black/40 text-[#8A8A8A] border border-white/10">
                    <Lock className="w-4 h-4 text-[#8A8A8A]" /> Terkunci di Level {currentTier.minLevel}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#C6D4DF] leading-relaxed font-medium pt-1">
                {currentTier.description}
              </p>

              {/* Requirement Box */}
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-[2px] text-xs space-y-1 text-[#C6D4DF] font-mono">
                <div className="flex items-center justify-between">
                  <span>EXP Kumulatif Dibutuhkan:</span>
                  <span className="text-[#A1CD44] font-bold">{requiredExp.toLocaleString('id-ID')} EXP</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Status Level Anda Saat Ini:</span>
                  <span className={isUnlocked ? 'text-[#66C0F4] font-bold' : 'text-[#8A8A8A] font-bold'}>
                    Level {userLevel} {isUnlocked ? '(Memenuhi syarat)' : `(Kurang ${currentTier.minLevel - userLevel} level)`}
                  </span>
                </div>
              </div>

            </div>

            {/* Rank Indicator Dots */}
            <div className="relative z-10 flex items-center justify-center gap-2 pt-2">
              {RANK_TIERS.map((tier, idx) => (
                <button
                  key={tier.name}
                  onClick={() => onSelectRankIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === selectedRankIndex
                      ? 'w-7 bg-[#66C0F4]'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  title={tier.name}
                />
              ))}
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between shrink-0">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-black/40 hover:bg-white/10 text-white border border-white/15 rounded-[2px] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              onClick={onClose}
              className="h-[38px] px-6 bg-black/40 hover:bg-white/10 text-white border border-white/20 text-xs font-bold rounded-[2px] uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center"
            >
              Tutup Preview
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-black/40 hover:bg-white/10 text-white border border-white/15 rounded-[2px] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
