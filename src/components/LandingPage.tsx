import React from 'react';
import { BodiaLogo } from './BodiaLogo.tsx';
import { ArrowRight, ShoppingBag, Sparkles, Headphones, ExternalLink } from 'lucide-react';
import { Testimonials } from './Testimonials.tsx';

interface LandingPageProps {
  onNavigateToServices: () => void;
  onNavigateToStore: () => void;
  onOpenProductQuickView?: (productId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToServices,
  onNavigateToStore,
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Top Bar with Live Badges */}
      <div className="flex justify-between items-center w-full flex-wrap gap-4 mb-8 sm:mb-10 relative z-10">
        <div className="inline-flex items-center gap-2.5 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full absolute" />
          <span className="ml-1">Available for New Projects</span>
        </div>

        <div className="inline-flex items-center gap-2 bg-red-950/50 border border-rose-500/40 text-red-300 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
          <Sparkles className="w-4 h-4 text-rose-400" />
          Agency & Digital Store
        </div>
      </div>

      {/* Logo Container */}
      <div className="relative z-10 flex justify-center mb-6 sm:mb-8">
        <BodiaLogo size="lg" />
      </div>

      {/* Hero Content Section */}
      <div className="text-center relative z-10">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-['Inter',sans-serif]">
          Your Reliable Partner in the
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-600 drop-shadow-[0_2px_20px_rgba(239,68,68,0.4)]">
            Digital Industry
          </span>
        </h1>

        <p className="max-w-[800px] mx-auto mt-6 text-slate-300 leading-relaxed text-base sm:text-lg">
          We provide comprehensive digital services and premium e-commerce store solutions. From custom software
          development and UI/UX design to high-converting digital storefronts, we build the technology that scales your
          business.
        </p>

        {/* Interactive Action Buttons */}
        <div className="flex justify-center items-center gap-4 flex-wrap mt-9">
          <button
            onClick={onNavigateToServices}
            className="px-7 py-3.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_25px_rgba(239,68,68,0.4)] flex items-center gap-2.5 cursor-pointer text-sm sm:text-base group"
          >
            <span>Explore Digital Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onNavigateToStore}
            className="px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800/80 hover:border-rose-500/50 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2.5 cursor-pointer text-sm sm:text-base shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-rose-400" />
            <span>Visit Our Store</span>
          </button>
        </div>
      </div>

      {/* 3 Interactive Feature Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-4 sm:gap-5 mt-12 sm:mt-16 relative z-10">
        {/* Metric 1 */}
        <div
          onClick={onNavigateToServices}
          className="bg-slate-900/80 border border-slate-800/80 hover:border-rose-500/50 rounded-[20px] p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group shadow-sm"
        >
          <div className="text-[#94a3b8] text-xs sm:text-sm font-medium mb-2.5 flex items-center justify-between">
            <span>Digital Services</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-rose-400" />
          </div>
          <div className="text-xl sm:text-[22px] font-bold text-rose-400">
            Web & App Dev
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={onNavigateToStore}
          className="bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/50 rounded-[20px] p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group shadow-sm"
        >
          <div className="text-[#94a3b8] text-xs sm:text-sm font-medium mb-2.5 flex items-center justify-between">
            <span>E-Commerce</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
          </div>
          <div className="text-xl sm:text-[22px] font-bold text-amber-400">
            Storefronts
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={onNavigateToServices}
          className="bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/50 rounded-[20px] p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group shadow-sm"
        >
          <div className="text-[#94a3b8] text-xs sm:text-sm font-medium mb-2.5 flex items-center justify-between">
            <span>Client Support</span>
            <Headphones className="w-3.5 h-3.5 text-emerald-400 opacity-70" />
          </div>
          <div className="text-xl sm:text-[22px] font-bold text-emerald-400">
            24/7 Dedicated
          </div>
        </div>
      </div>

      {/* Testimonials Component (4 Glassmorphism Cards with Cambodia & Indonesia Slang) */}
      <div className="w-full mt-10 relative z-10">
        <Testimonials />
      </div>
    </div>
  );
};
