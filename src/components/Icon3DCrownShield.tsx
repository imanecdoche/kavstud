import React from 'react';

interface Icon3DProps {
  className?: string;
}

export default function Icon3DCrownShield({ className = "w-10 h-10" }: Icon3DProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 3D Crown & Shield SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_6px_10px_rgba(99,102,241,0.35)] overflow-visible">
        <defs>
          <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>

          <linearGradient id="shieldRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C7D2FE" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="50%" stopColor="#FBC02D" />
            <stop offset="100%" stopColor="#F57F17" />
          </linearGradient>
        </defs>

        {/* Shield Body */}
        <path d="M 50 14 C 75 14, 82 22, 82 46 C 82 70, 58 86, 50 90 C 42 86, 18 70, 18 46 C 18 22, 25 14, 50 14 Z" fill="url(#shieldBg)" stroke="url(#shieldRim)" strokeWidth="3" />

        {/* Inner Shield Ring */}
        <path d="M 50 22 C 68 22, 74 28, 74 46 C 74 64, 56 77, 50 80 C 44 77, 26 64, 26 46 C 26 28, 32 22, 50 22 Z" fill="none" stroke="#A5B4FC" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />

        {/* 3D Crown Overlay */}
        <g transform="translate(24, 30)">
          {/* Crown Base */}
          <path d="M 6 32 L 46 32 L 42 22 L 32 28 L 26 14 L 20 28 L 10 22 Z" fill="url(#crownGold)" stroke="#E65100" strokeWidth="1" />
          <rect x="8" y="30" width="36" height="6" rx="2" fill="#F57F17" />
          
          {/* Jewels */}
          <circle cx="26" cy="14" r="3.5" fill="#E91E63" />
          <circle cx="10" cy="22" r="2.5" fill="#00E676" />
          <circle cx="42" cy="22" r="2.5" fill="#00E676" />
          <circle cx="26" cy="33" r="2" fill="#00B0FF" />
          <circle cx="16" cy="33" r="2" fill="#00B0FF" />
          <circle cx="36" cy="33" r="2" fill="#00B0FF" />
        </g>
      </svg>
    </div>
  );
}
