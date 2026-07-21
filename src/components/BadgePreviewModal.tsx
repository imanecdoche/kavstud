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
        className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 z-50 overscroll-contain overflow-y-auto animate-fadeIn"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden relative text-white my-auto"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-display font-extrabold text-white tracking-tight">
                    Preview Full Badge LOGO
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                    Tier {selectedRankIndex + 1} / {RANK_TIERS.length}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Prinjinjauan visual badge lengkap dengan efek visual aura & spesifikasi level
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Center Badge Visual Showcase */}
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden custom-scrollbar">
            
            {/* Background Rotating Rays & Radial Aura */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              {/* Rotating Light Rays */}
              <div 
                className="w-[500px] h-[500px] rounded-full animate-rotate-rays"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, ${currentTier.glowColor} 20deg, transparent 40deg, ${currentTier.glowColor} 60deg, transparent 80deg, ${currentTier.glowColor} 100deg, transparent 120deg, ${currentTier.glowColor} 140deg, transparent 160deg, ${currentTier.glowColor} 180deg, transparent 200deg, ${currentTier.glowColor} 220deg, transparent 240deg, ${currentTier.glowColor} 260deg, transparent 280deg, ${currentTier.glowColor} 300deg, transparent 320deg, ${currentTier.glowColor} 340deg, transparent 360deg)`
                }}
              />
              {/* Center Soft Blur Glow */}
              <div 
                className="absolute w-80 h-80 rounded-full blur-3xl opacity-80 animate-mist-glow"
                style={{ backgroundColor: currentTier.glowColor }}
              />
            </div>

            {/* FLOATING BADGE LOGO (FULL COLOR & HIGH DEFINITION) */}
            <div className="relative z-10 py-4 flex items-center justify-center">
              
              {/* Navigation Left Arrow */}
              <button
                onClick={handlePrev}
                className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full border border-slate-700 shadow-xl cursor-pointer transition-all hover:scale-110 active:scale-95 z-20"
                title="Badge Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Navigation Right Arrow */}
              <button
                onClick={handleNext}
                className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full border border-slate-700 shadow-xl cursor-pointer transition-all hover:scale-110 active:scale-95 z-20"
                title="Badge Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <motion.div
                key={currentTier.name}
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
                className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center"
              >
                {/* Floating particle sparkles */}
                <motion.div
                  animate={{ y: [-6, 6, -6], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-2 left-4 text-yellow-300"
                >
                  <Sparkles className="w-6 h-6 filter drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
                </motion.div>

                <motion.div
                  animate={{ y: [6, -6, 6], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute bottom-4 right-4 text-amber-400"
                >
                  <Star className="w-5 h-5 fill-amber-300 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  {/* Outer Glowing Ring */}
                  <div 
                    className="absolute inset-2 rounded-full blur-xl opacity-70 animate-pulse pointer-events-none"
                    style={{ backgroundColor: currentTier.glowColor }}
                  />

                  {/* 3D BADGE IMAGE - ALWAYS RENDERED IN VIBRANT FULL COLOR FOR PREVIEW */}
                  <img
                    src={currentTier.badgePath}
                    alt={currentTier.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Badge Info Text & Status */}
            <div className="relative z-10 text-center space-y-3 max-w-md mx-auto">
              
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r ${currentTier.color} text-white shadow-md`}>
                  RANK: {currentTier.name}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-800 text-indigo-300 border border-slate-700 font-mono">
                  Level {currentTier.minLevel === currentTier.maxLevel ? currentTier.minLevel : `${currentTier.minLevel} – ${currentTier.maxLevel}`}
                </span>
              </div>

              {/* Status Pill */}
              <div className="pt-1 flex items-center justify-center">
                {isCurrentLevelRank ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Rank Aktif Anda
                  </span>
                ) : isUnlocked ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Peringkat Telah Terbuka
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Lock className="w-4 h-4 text-amber-400" /> Mode Preview (Terkunci di Level {currentTier.minLevel})
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium pt-1">
                {currentTier.description}
              </p>

              {/* Requirement Box */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs space-y-1 text-slate-400 font-mono">
                <div className="flex items-center justify-between">
                  <span>EXP Kumulatif Dibutuhkan:</span>
                  <span className="text-yellow-400 font-bold">{requiredExp.toLocaleString('id-ID')} EXP</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Status Level Anda Saat Ini:</span>
                  <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>
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
                      ? 'w-7 bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]'
                      : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={tier.name}
                />
              ))}
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between shrink-0">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              onClick={onClose}
              className="btn-duo-blue px-6 py-2 text-xs font-black cursor-pointer"
            >
              Tutup Preview
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
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
