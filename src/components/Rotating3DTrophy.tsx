import React from 'react';
import { motion } from 'motion/react';

interface Rotating3DTrophyProps {
  className?: string;
}

export default function Rotating3DTrophy({ className = "w-12 h-12" }: Rotating3DTrophyProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Soft Golden Glow Backdrop */}
      <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-md animate-pulse pointer-events-none" />

      {/* 3D Y-Axis Rotating Trophy SVG */}
      <div className="relative z-10 w-full h-full animate-spin-3d-y flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter drop-shadow-[0_4px_8px_rgba(180,110,0,0.4)] overflow-visible"
        >
          <defs>
            {/* Shiny Gold Metallic Gradients */}
            <linearGradient id="trophyGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF49C" />
              <stop offset="30%" stopColor="#FFC800" />
              <stop offset="70%" stopColor="#E69500" />
              <stop offset="100%" stopColor="#B36B00" />
            </linearGradient>

            <linearGradient id="trophyHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFC800" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="trophyBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A3425" />
              <stop offset="50%" stopColor="#2B1A0E" />
              <stop offset="100%" stopColor="#170C05" />
            </linearGradient>

            <linearGradient id="trophyBaseTop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#995C00" />
            </linearGradient>
          </defs>

          {/* Trophy Base Pedestal */}
          {/* Base bottom */}
          <path d="M 28 82 L 72 82 L 78 92 L 22 92 Z" fill="url(#trophyBaseGrad)" stroke="#1a0f08" strokeWidth="1" />
          {/* Base top tier */}
          <path d="M 33 74 L 67 74 L 72 82 L 28 82 Z" fill="url(#trophyBaseTop)" />

          {/* Stem Stem Ring */}
          <ellipse cx="50" cy="72" rx="10" ry="3" fill="url(#trophyGoldGrad)" />
          <path d="M 44 60 C 44 68, 56 68, 56 60 L 58 72 L 42 72 Z" fill="url(#trophyGoldGrad)" />

          {/* Trophy Handles (Left & Right) */}
          {/* Left Handle */}
          <path d="M 32 26 C 14 26, 14 52, 36 54 C 22 48, 22 32, 34 32 Z" fill="url(#trophyGoldGrad)" />
          {/* Right Handle */}
          <path d="M 68 26 C 86 26, 86 52, 64 54 C 78 48, 78 32, 66 32 Z" fill="url(#trophyGoldGrad)" />

          {/* Main Trophy Cup Bowl */}
          <path d="M 28 20 L 72 20 C 72 45, 62 62, 50 62 C 38 62, 28 45, 28 20 Z" fill="url(#trophyGoldGrad)" />
          
          {/* Cup Opening Rim */}
          <ellipse cx="50" cy="20" rx="22" ry="5" fill="#FFF8B3" stroke="#E69500" strokeWidth="1" />
          <ellipse cx="50" cy="20" rx="19" ry="3.5" fill="#B36B00" />

          {/* Specular Highlight Strip */}
          <path d="M 32 23 C 32 38, 38 52, 42 56 C 37 50, 34 38, 34 23 Z" fill="url(#trophyHighlight)" />

          {/* Star Emblem on Cup */}
          <polygon points="50,30 52,36 58,36 53,40 55,46 50,42 45,46 47,40 42,36 48,36" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>

      {/* Floating Sparkle Dots around trophy */}
      <motion.div
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_6px_rgba(253,224,71,1)] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 0.7, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,1)] pointer-events-none"
      />
    </div>
  );
}
