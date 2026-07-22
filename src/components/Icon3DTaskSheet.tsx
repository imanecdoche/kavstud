import React from 'react';

interface Icon3DProps {
  className?: string;
}

export default function Icon3DTaskSheet({ className = "w-10 h-10" }: Icon3DProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 3D Task Clipboard SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_6px_10px_rgba(245,158,11,0.35)] overflow-visible">
        <defs>
          <linearGradient id="clipBoardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA000" />
            <stop offset="50%" stopColor="#FF6F00" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>

          <linearGradient id="paperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF3E0" />
          </linearGradient>

          <linearGradient id="clipMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="50%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#FF8F00" />
          </linearGradient>

          <linearGradient id="pencilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E676" />
            <stop offset="100%" stopColor="#00A152" />
          </linearGradient>
        </defs>

        {/* Board Background */}
        <rect x="18" y="16" width="64" height="74" rx="10" fill="url(#clipBoardGrad)" stroke="#B71C1C" strokeWidth="1" />
        
        {/* Paper Sheet */}
        <rect x="24" y="24" width="52" height="60" rx="6" fill="url(#paperGrad)" />

        {/* Metal Top Clip */}
        <rect x="36" y="10" width="28" height="12" rx="4" fill="url(#clipMetal)" stroke="#E65100" strokeWidth="1" />
        <circle cx="50" cy="16" r="3" fill="#FFE082" />

        {/* Checked List items */}
        {/* Line 1 with check */}
        <circle cx="34" cy="38" r="5" fill="#4CAF50" />
        <path d="M 31 38 L 33 40 L 37 36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="44" y="36" width="24" height="4" rx="2" fill="#FFE0B2" />

        {/* Line 2 with check */}
        <circle cx="34" cy="52" r="5" fill="#4CAF50" />
        <path d="M 31 52 L 33 54 L 37 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="44" y="50" width="26" height="4" rx="2" fill="#FFE0B2" />

        {/* Line 3 with check */}
        <circle cx="34" cy="66" r="5" fill="#FF9800" />
        <path d="M 31 66 L 33 68 L 37 64" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="44" y="64" width="18" height="4" rx="2" fill="#FFE0B2" />

        {/* 3D Pencil Overlay */}
        <g transform="translate(48, 48) rotate(-35)">
          <path d="M 0 0 L 10 0 L 10 32 L 5 38 L 0 32 Z" fill="url(#pencilGrad)" />
          <path d="M 0 0 L 10 0 L 10 6 L 0 6 Z" fill="#FF4081" />
          <polygon points="0,32 10,32 5,38" fill="#FFE0B2" />
          <polygon points="3.5,35 6.5,35 5,38" fill="#212121" />
        </g>
      </svg>
    </div>
  );
}
