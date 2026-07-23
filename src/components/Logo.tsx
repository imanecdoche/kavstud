import React from 'react';

interface LogoProps {
  className?: string;
  fillColor?: string;
  textColor?: string;
  iconOnly?: boolean;
}

export default function Logo({ 
  className = 'h-8 w-auto', 
  fillColor = '#FFFFFF', 
  textColor = 'text-white',
  iconOnly = false 
}: LogoProps) {
  const actualFill = fillColor === 'currentColor' ? 'currentColor' : fillColor;

  const icon = (
    <svg 
      className={iconOnly ? className : "h-full w-auto aspect-[65/60] shrink-0"} 
      viewBox="0 0 65 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      id="kavio-edu-svg-logomark"
    >
      <path 
        d="M40.6615 59.3671L61.7561 59.415C56.1265 54.6815 48.5597 46.9161 43.0806 41.6026L10.9885 10.5776C7.29051 7.09074 3.62942 3.56473 0.00610352 5.34058e-05L0.0253668 19.4312C8.57679 28.0283 17.1898 36.5635 25.8643 45.0365C30.6464 49.7036 36.0905 54.6514 40.6615 59.3671Z" 
        fill={actualFill}
      />
      <path 
        d="M39.0882 26.2542C39.5681 26.086 61.179 3.87232 63.5518 1.5536L53.1706 1.53154L42.1343 1.4931C38.3172 5.92724 32.4725 11.4771 28.2144 15.7146L39.0882 26.2542Z" 
        fill={actualFill}
      />
      <path 
        d="M0.0472578 59.353L26.4023 59.385C23.1064 56.7901 16.551 49.982 13.3203 46.7853C9.5981 43.1127 3.27959 37.2082 0 33.3045C0.15693 41.8698 -0.0417286 50.7338 0.0472578 59.353Z" 
        fill={actualFill}
      />
    </svg>
  );

  if (iconOnly) {
    return icon;
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {icon}
      <div className="flex items-center gap-1.5 leading-none">
        <span className={`font-bold text-lg sm:text-xl tracking-tight uppercase ${textColor}`}>
          KAVIO
        </span>
        <span className={`font-bold text-lg sm:text-xl tracking-tight uppercase ${textColor}`}>
          EDU
        </span>
      </div>
    </div>
  );
}
