import React from 'react';
import { motion } from 'motion/react';

interface SplineMascot3DProps {
  className?: string;
}

export default function SplineMascot3D({ className = "w-full h-full" }: SplineMascot3DProps) {
  return (
    <div className={`relative select-none flex items-end justify-end overflow-hidden lg:overflow-visible pointer-events-none ${className}`}>
      {/* Soft Ambient Radial Green Glow Aura */}
      <div className="absolute right-0 bottom-0 w-[300px] h-[300px] sm:w-[480px] sm:h-[480px] lg:w-[860px] lg:h-[860px] bg-gradient-to-tr from-[#58CC02]/25 via-[#89E219]/20 to-[#1CB0F6]/15 rounded-full blur-[70px] lg:blur-[110px] pointer-events-none z-0" />

      {/* Hero 3D Owl Mascot Illustration */}
      <motion.div
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 6,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
        className="relative z-10 w-full h-full flex items-end justify-end p-0 overflow-hidden lg:overflow-visible"
      >
        <img
          src="/aset/heromascot.png"
          alt="KAVIO Edu Owl Mascot"
          className="w-[280px] sm:w-[380px] lg:w-[135%] max-w-full lg:max-w-none h-auto max-h-[380px] sm:max-h-[500px] lg:max-h-[800px] object-contain object-bottom-right opacity-30 lg:opacity-100 transform translate-x-2 sm:translate-x-6 lg:translate-x-12 translate-y-2 sm:translate-y-6 lg:translate-y-10 filter drop-shadow-2xl transition-all duration-700 hover:scale-[1.01]"
          style={{
            maskImage: 'radial-gradient(ellipse at 60% 60%, black 80%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 60% 60%, black 80%, transparent 100%)',
          }}
          loading="eager"
        />
      </motion.div>
    </div>
  );
}
