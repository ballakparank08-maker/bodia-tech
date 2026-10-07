import React from 'react';

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

  // The custom B SVG matching the theme - Highly Professional Geometric Tech Design
  const CustomBIcon = () => (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconDimensions} drop-shadow-[0_8px_16px_rgba(225,29,72,0.4)]`}
    >
      <defs>
        <linearGradient id="bodia-grad-1" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e11d48" /> {/* rose-600 */}
          <stop offset="100%" stopColor="#f59e0b" /> {/* amber-500 */}
        </linearGradient>
        <linearGradient id="bodia-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#94a3b8" /> {/* slate-400 */}
        </linearGradient>
        <linearGradient id="bodia-grad-3" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f43f5e" /> {/* rose-500 */}
          <stop offset="100%" stopColor="#fbbf24" /> {/* amber-400 */}
        </linearGradient>
      </defs>
      
      {/* Pillar */}
      <rect x="16" y="15" width="16" height="70" rx="8" fill="url(#bodia-grad-2)" />
      
      {/* Top loop (Stroke) */}
      <path 
        d="M 32 21 H 60 C 80 21, 80 41, 60 41 H 32" 
        stroke="url(#bodia-grad-1)" 
        strokeWidth="12" 
        strokeLinecap="round" 
        fill="none" 
      />
      
      {/* Bottom loop (Solid with cutout for evenodd) */}
      <path 
        d="M 32 47 H 65 C 92 47, 92 85, 65 85 H 32 Z M 32 59 H 63 C 76 59, 76 73, 63 73 H 32 Z" 
        fill="url(#bodia-grad-3)" 
        fillRule="evenodd" 
      />

      {/* Decorative Tech Nodes */}
      <circle cx="78" cy="66" r="4" fill="#ffffff" className="animate-pulse" />
      <circle cx="24" cy="23" r="3" fill="#0f172a" />
      <circle cx="24" cy="77" r="3" fill="#0f172a" />
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
          <div className={`font-extrabold tracking-tight text-white leading-none ${textSize}`}>
            BODI<span className="text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-amber-400">A</span>
          </div>
          <div className={`flex items-center justify-center gap-2 w-full mt-1 opacity-80`}>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-rose-600/50" />
            <span className={`${subTextSize} font-bold tracking-[0.3em] text-rose-400 uppercase leading-none`}>
              TECH
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-rose-600/50" />
          </div>
        </div>
      )}
    </div>
  );
};

