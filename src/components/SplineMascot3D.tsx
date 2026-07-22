import React from 'react';
import { motion } from 'motion/react';

interface SplineMascot3DProps {
  className?: string;
}

export default function SplineMascot3D({ className = "w-full h-full" }: SplineMascot3DProps) {
  return (
    <div className={`relative select-none flex items-end justify-end overflow-visible pointer-events-none ${className}`}>
      {/* Expanded Soft Ambient Radial Green Glow Aura - Fills the Right Half */}
      <div className="absolute -right-16 -bottom-16 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[860px] lg:h-[860px] bg-gradient-to-tr from-[#58CC02]/25 via-[#89E219]/20 to-[#1CB0F6]/15 rounded-full blur-[110px] pointer-events-none z-0" />

      {/* Hero Full-Size 55% Owl Mascot Illustration - Anchored behind Left Content */}
      <motion.div
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 6,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
        className="relative z-10 w-full h-full flex items-end justify-end p-0 overflow-visible"
      >
        <img
          src="/aset/heromascot.png"
          alt="KAVIO Edu Owl Mascot"
          className="w-[115%] sm:w-[125%] lg:w-[135%] max-w-none h-auto max-h-[620px] sm:max-h-[720px] lg:max-h-[800px] object-contain object-bottom-right transform translate-x-4 sm:translate-x-8 lg:translate-x-12 translate-y-2 sm:translate-y-6 lg:translate-y-10 filter drop-shadow-2xl transition-transform duration-700 hover:scale-[1.01]"
          style={{
            maskImage: 'radial-gradient(ellipse at 55% 55%, black 80%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 55% 55%, black 80%, transparent 100%)',
          }}
          loading="eager"
        />
      </motion.div>
    </div>
  );
}
