import React from 'react';
import { ShieldCheck, Zap, Terminal, RefreshCw, CheckCircle2, Search } from 'lucide-react';
import { RollingProductShowcase } from './RollingProductShowcase.tsx';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (p: string) => void;
  onExploreAgency: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  selectedPlatform,
  setSelectedPlatform,
  onExploreAgency,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 pt-10 pb-12">
      {/* Background cyber grid and subtle glow spheres */}
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Tier-1 Digital Inventory & Automated Reseller Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Enterprise Digital Assets & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
              Instant Credential Inventories
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Aged PVA accounts, verified Business Managers, and automation-primed profiles crafted for media buyers, growth hackers, and agency workflows. Delivered instantly with 2FA TOTP secrets and clean session cookies.
          </p>

          {/* Quick CTA actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[260px] max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by SKU, platform, vintage year (e.g. '2016', 'PVA', 'Marketplace')..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-white placeholder-slate-400 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={onExploreAgency}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-rose-500 text-slate-200 hover:text-white text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-sm w-full sm:w-auto"
            >
              <Terminal className="w-4 h-4 text-rose-400" />
              Custom Agency Solutions
            </button>
        </div>
        </div>

        {/* 10 Rolling Automatic Showcase for Product Store and Product Service */}
        <RollingProductShowcase
          onSelectPlatform={setSelectedPlatform}
          onExploreAgency={onExploreAgency}
          filterModeProp="store"
          hideFilters={true}
        />
      </div>
    </div>
  );
};
