import React, { useState, useEffect, useRef } from 'react';

interface RollingProductShowcaseProps {
  onSelectPlatform: (platform: string) => void;
  onExploreAgency: () => void;
  filterModeProp?: 'all' | 'store' | 'service';
  hideFilters?: boolean;
}

export const RollingProductShowcase: React.FC<RollingProductShowcaseProps> = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Provided images in the public/images directory
  const images = [
    '/images/Generated Image October 09, 2026 - 5_22AM.jpg',
    '/images/Generated Image October 09, 2026 - 5_23AM.jpg',
    '/images/Generated Image October 09, 2026 - 5_23AM (1).jpg',
    '/images/Generated Image October 09, 2026 - 5_23AM (2).jpg',
    '/images/Generated Image October 09, 2026 - 5_26AM.jpg'
  ];

  // Auto-scroll animation logic
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollPos = 0;
    let isPaused = false;

    const handleMouseEnter = () => isPaused = true;
    const handleMouseLeave = () => isPaused = false;
    const handleTouchStart = () => isPaused = true;
    const handleTouchEnd = () => isPaused = false;

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd);

    const scroll = () => {
      if (!isPaused) {
        scrollPos += 0.5; // Adjust speed here
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      } else {
        // Keep scrollPos in sync if the user manually scrolls
        scrollPos = el.scrollLeft;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="mt-8 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl p-4 sm:p-6 backdrop-blur-md relative overflow-hidden w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
          <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
            <span>Digital Store Directory</span>
          </h3>
        </div>
      </div>

      {/* Rolling Marquee Container */}
      <div 
        className="w-full overflow-x-auto whitespace-nowrap cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" 
        ref={scrollRef}
      >
        <div className="inline-flex gap-4 sm:gap-6 w-max">
          {/* Duplicate the array to create a seamless loop */}
          {[...images, ...images].map((src, index) => (
            <img 
              key={index}
              src={src} 
              alt={`Store grid ${index}`} 
              className="h-[140px] sm:h-[200px] md:h-[250px] lg:h-[300px] w-auto rounded-xl object-contain border border-slate-700 shadow-lg hover:border-rose-500 transition-colors"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Please+add+image+to+public/images';
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
