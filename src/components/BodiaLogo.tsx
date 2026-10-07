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
}) => {
  const [hasError, setHasError] = useState(false);

  // Typography text classes based on size
  const textSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  }[size];

  if (hasError) {
    // Stylish typography-based brand logo fallback
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <div className={`font-black tracking-widest text-white ${textSize}`}>
          BODI<span className="text-rose-600">A</span>
        </div>
        {showText && (
          <div className="flex flex-col justify-center">
            <div className="h-[2px] w-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full" />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] text-amber-500 mt-1 uppercase">
              Tech
            </span>
          </div>
        )}
      </div>
    );
  }

  const imgSize = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-24 sm:h-28',
    xl: 'h-32 sm:h-40',
  }[size];

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 drop-shadow-[0_8px_24px_rgba(220,38,38,0.3)] select-none ${className}`}
      aria-label="Bodia Tech"
    >
      <img
        src="/images/logo.jpg"
        alt="Bodia Tech Logo"
        onError={() => setHasError(true)}
        className={`${imgSize} w-auto object-contain rounded-xl transform-gpu transition-transform duration-300 hover:scale-105`}
      />
    </div>
  );
};

