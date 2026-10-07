import React, { useState } from 'react';

interface BodiaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  layout?: 'horizontal' | 'stacked';
}

export const BodiaLogo: React.FC<BodiaLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  layout = 'horizontal',
}) => {
  // Dimension mapping based on size
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-32 h-32 sm:w-40 sm:h-40',
  }[size];

  const textSize = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  }[size];

  const subTextSize = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-sm',
    xl: 'text-lg',
  }[size];

  // The custom B SVG matching the theme
  const CustomBIcon = () => (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconDimensions} drop-shadow-[0_5px_15px_rgba(225,29,72,0.4)]`}
    >
      <defs>
        <linearGradient id="bodia-rose-amber" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e11d48" /> {/* rose-600 */}
          <stop offset="100%" stopColor="#f59e0b" /> {/* amber-500 */}
        </linearGradient>
        <linearGradient id="bodia-white" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#94a3b8" /> {/* slate-400 */}
        </linearGradient>
      </defs>
      
      {/* Top white/silver curve of the B */}
      <path d="M 25 15 H 65 C 85 15, 85 45, 65 45 H 35 L 25 15 Z" fill="url(#bodia-white)" />
      {/* Top cutout to simulate the hole in the B, matching the slate-900 background */}
      <path d="M 40 28 H 60 C 68 28, 68 35, 60 35 H 48 Z" fill="#0f172a" />
      
      {/* Bottom red/amber gradient curve of the B */}
      <path d="M 15 45 H 75 C 95 45, 95 85, 75 85 H 20 L 30 55 H 45 Z" fill="url(#bodia-rose-amber)" />
      {/* Bottom cutout */}
      <path d="M 38 60 H 68 C 76 60, 76 72, 68 72 H 30 Z" fill="#0f172a" />
    </svg>
  );

  return (
    <div
      className={`flex select-none items-center ${
        layout === 'stacked' ? 'flex-col justify-center' : 'flex-row gap-3'
      } ${className}`}
      aria-label="Bodia Tech"
    >
      <div className="transform-gpu transition-transform duration-300 hover:scale-105 hover:rotate-1">
        <CustomBIcon />
      </div>

      {showText && (
        <div className={`flex flex-col ${layout === 'stacked' ? 'items-center mt-2' : 'justify-center'}`}>
          <div className={`font-black tracking-widest text-white leading-none ${textSize}`}>
            BODI<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500">A</span>
          </div>
          <div className={`flex items-center justify-center gap-2 w-full mt-1.5 opacity-90`}>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-rose-600 to-transparent" />
            <span className={`${subTextSize} font-mono font-bold tracking-[0.4em] text-rose-500 uppercase leading-none`}>
              Tech
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-rose-600 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
};

