import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RANK_TIERS, RankTier } from '../utils/leveling';

function BadgeCardItem({
  tier,
  offset,
  isActive,
  goNext,
  goPrev
}: {
  key?: string;
  tier: RankTier;
  offset: number;
  isActive: boolean;
  goNext: () => void;
  goPrev: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const xMouse = useMotionValue(0);
  const yMouse = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 24 };
  const mouseRotateX = useSpring(useTransform(yMouse, [-0.5, 0.5], [14, -14]), springConfig);
  const mouseRotateY = useSpring(useTransform(xMouse, [-0.5, 0.5], [-14, 14]), springConfig);

  const imgTranslateX = useSpring(useTransform(xMouse, [-0.5, 0.5], [-18, 18]), springConfig);
  const imgTranslateY = useSpring(useTransform(yMouse, [-0.5, 0.5], [-18, 18]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    xMouse.set(x);
    yMouse.set(y);
  };

  const handleMouseEnter = () => {
    if (isActive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    xMouse.set(0);
    yMouse.set(0);
  };

  const absOffset = Math.abs(offset);
  const xPos = offset * 290;
  const scale = isActive ? (isHovered ? 1.05 : 1.02) : 0.85;
  const opacity = isActive ? 1 : absOffset === 1 ? 0.75 : 0.2;
  const zIndex = isActive ? 20 : 10 - absOffset;
  const carouselRotateY = isActive ? 0 : offset < 0 ? 22 : -22;
  const blur = isActive ? 0 : 1.5;

  return (
    <motion.div
      key={tier.name}
      animate={{
        x: xPos,
        scale,
        opacity,
        rotateY: carouselRotateY,
        filter: `blur(${blur}px)`,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 26,
      }}
      onClick={() => {
        if (offset === 1) goNext();
        if (offset === -1) goPrev();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        zIndex,
        left: '50%',
        marginLeft: '-160px',
        rotateX: isActive ? mouseRotateX : 0,
        rotateY: isActive ? mouseRotateY : carouselRotateY,
        transformStyle: 'preserve-3d',
      }}
      className="absolute w-[320px] h-[390px] bg-white border-2 border-gray-200 border-b-6 border-b-gray-300 rounded-[2.2rem] p-6 flex flex-col items-center justify-between text-center overflow-hidden shadow-xl cursor-pointer transition-shadow duration-300 hover:shadow-2xl"
    >
      {/* Glow Effect for Top Tiers */}
      {tier.isTop3 && (
        <div
          className="absolute inset-0 rounded-[2.2rem] opacity-20 blur-md pointer-events-none"
          style={{ backgroundColor: tier.glowColor }}
        />
      )}

      {/* Header Info */}
      <div className="w-full text-center space-y-2 z-10 pointer-events-none" style={{ transform: 'translateZ(25px)' }}>
        <span className="inline-block px-4 py-1 bg-[#1CB0F6] text-white font-mono font-black text-xs uppercase rounded-xl border border-[#0092E0] shadow-2xs">
          LVL. {tier.minLevel} - {tier.maxLevel}
        </span>
        <h3 className="text-2xl font-black font-display text-gray-900 uppercase tracking-wider">
          {tier.name}
        </h3>
      </div>

      {/* 3D Badge Image */}
      <motion.div
        className="relative w-36 h-36 flex items-center justify-center my-2 pointer-events-none"
        style={{
          x: isActive ? imgTranslateX : 0,
          y: isActive ? imgTranslateY : 0,
          transform: 'translateZ(45px)',
        }}
      >
        <img
          src={tier.badgePath}
          alt={tier.name}
          className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-300 hover:scale-110"
        />
      </motion.div>

      {/* Description */}
      <p className="text-xs font-bold text-gray-600 leading-relaxed max-w-[260px] line-clamp-2 z-10 pointer-events-none" style={{ transform: 'translateZ(20px)' }}>
        {tier.description}
      </p>
    </motion.div>
  );
}

export default function BadgeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => {
    if (activeIndex < RANK_TIERS.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center space-y-6">
      {/* Swipeable Carousel Container */}
      <div className="relative w-full flex items-center justify-center">
        {/* Prev button */}
        <button
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="absolute left-0 sm:left-2 z-30 w-12 h-12 bg-white text-gray-800 rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 border-b-4 border-b-gray-300 hover:scale-110 active:scale-90 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title="Badge Sebelumnya"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Carousel Window Track */}
        <div className="relative w-full h-[470px] py-6 flex items-center justify-center overflow-hidden sm:overflow-visible">
          <div className="relative w-full h-full flex items-center justify-center">
            {RANK_TIERS.map((tier, index) => {
              const offset = index - activeIndex;
              if (Math.abs(offset) > 2) return null;
              return (
                <BadgeCardItem
                  key={tier.name}
                  tier={tier}
                  offset={offset}
                  isActive={offset === 0}
                  goNext={goNext}
                  goPrev={goPrev}
                />
              );
            })}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={goNext}
          disabled={activeIndex === RANK_TIERS.length - 1}
          className="absolute right-0 sm:right-2 z-30 w-12 h-12 bg-white text-gray-800 rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 border-b-4 border-b-gray-300 hover:scale-110 active:scale-90 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title="Badge Selanjutnya"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2 justify-center flex-wrap max-w-xs">
        {RANK_TIERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === activeIndex
                ? 'w-8 h-3 bg-[#FF9600] border border-[#E58500]'
                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Ke badge ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
