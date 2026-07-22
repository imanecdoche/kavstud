import React from 'react';

interface Icon3DProps {
  className?: string;
}

export default function Icon3DFireFlame({ className = "w-10 h-10" }: Icon3DProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 3D Duolingo-style Flame & Clock SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_6px_10px_rgba(236,72,153,0.35)] overflow-visible">
        <defs>
          <linearGradient id="flameOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="50%" stopColor="#FF1744" />
            <stop offset="100%" stopColor="#D50000" />
          </linearGradient>

          <linearGradient id="flameMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#FF9100" />
            <stop offset="100%" stopColor="#FF3D00" />
          </linearGradient>

          <linearGradient id="flameInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF59D" />
          </linearGradient>
        </defs>

        {/* Outer Flame Shape */}
        <path d="M 50 10 C 65 30, 85 45, 85 66 C 85 82, 70 92, 50 92 C 30 92, 15 82, 15 66 C 15 45, 35 30, 50 10 Z" fill="url(#flameOuter)" />

        {/* Middle Flame Shape */}
        <path d="M 50 24 C 60 40, 74 52, 74 68 C 74 80, 64 86, 50 86 C 36 86, 26 80, 26 68 C 26 52, 40 40, 50 24 Z" fill="url(#flameMid)" />

        {/* Inner Flame Core */}
        <path d="M 50 42 C 56 52, 64 62, 64 72 C 64 78, 58 82, 50 82 C 42 82, 36 78, 36 72 C 36 62, 44 52, 50 42 Z" fill="url(#flameInner)" />

        {/* Mini 3D Clock Badge Overlay at bottom right */}
        <g transform="translate(56, 56)">
          <circle cx="16" cy="16" r="16" fill="#3F51B5" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="16" cy="16" r="13" fill="#1A237E" />
          <path d="M 16 8 L 16 16 L 22 20" stroke="#FFD54F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>
    </div>
  );
}
