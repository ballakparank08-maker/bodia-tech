import React from 'react';
import { BodiaLogo } from './BodiaLogo.tsx';
import { ShoppingCart, ShieldCheck, Cpu, Layers, User, LogIn, Sparkles, Wand2 } from 'lucide-react';
import { UserProfile } from '../types/index.ts';
import { GoogleAuthUser } from '../utils/auth.ts';

interface HeaderProps {
  currentTab: 'home' | 'store' | 'agency' | 'admin' | 'login';
  setCurrentTab: (tab: 'home' | 'store' | 'agency' | 'admin' | 'login') => void;
  cartCount: number;
  openCart: () => void;
  openCopilot: () => void;
  userProfile: UserProfile;
  authUser: GoogleAuthUser | null;
  onOpenGoogleAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  openCart,
  openCopilot,
  authUser,
  onOpenGoogleAuth,
}) => {
  const isAdmin = !!authUser?.isAdmin;

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/85 backdrop-blur-md border-b border-white/5 py-3.5 px-4 sm:px-6 md:px-8 flex items-center justify-between transition-all">
      {/* Brand Logo */}
      <button
        onClick={() => setCurrentTab('home')}
        className="flex items-center gap-3 cursor-pointer group hover:opacity-95 transition-opacity text-left"
        aria-label="Bodia Tech Home"
      >
        <BodiaLogo size="md" />
      </button>

      {/* Center Nav Links (Desktop) */}
      <div className="hidden md:flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-full border border-slate-800/80 shadow-inner">
        {/* Home */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
            currentTab === 'home'
              ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        {/* Storefront */}
        <button
          onClick={() => setCurrentTab('store')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
            currentTab === 'store'
              ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Store</span>
        </button>

        {/* Agency Hub */}
        <button
          onClick={() => setCurrentTab('agency')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
            currentTab === 'agency'
              ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Service</span>
        </button>

        {isAdmin && (
          <>
            {/* Divider */}
            <div className="w-px h-5 bg-slate-800 mx-1.5" />

            {/* Admin Inventory Management */}
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-slate-950 text-white border border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                  : 'text-rose-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-rose-500" />
              <span>Admin & Inventory</span>
            </button>
          </>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* AI Copilot Trigger (Available for admin) */}
        {isAdmin && (
          <button
            onClick={openCopilot}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:text-white hover:border-rose-500 text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>AI Copilot</span>
          </button>
        )}

        {/* Cart Trigger */}
        <button
          onClick={openCart}
          className="relative w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          aria-label="View shopping cart"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-extrabold text-[10px] flex items-center justify-center shadow-[0_0_10px_rgba(225,29,72,0.5)]">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Profile Pill / Login */}
        <button
          onClick={() => setCurrentTab('login')}
          className="flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full cursor-pointer transition-all text-xs"
        >
          {authUser ? (
            <>
              {authUser.avatar ? (
                <img
                  src={authUser.avatar}
                  alt={authUser.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full border border-rose-500/50"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                  {authUser.name.charAt(0)}
                </div>
              )}
              <div className="flex flex-col text-left pr-1">
                <span className="text-[11px] font-bold text-white leading-tight truncate max-w-[100px]">
                  {authUser.name.split(' ')[0]}
                </span>
                <span
                  className={`text-[9px] font-extrabold tracking-wide uppercase leading-none ${
                    authUser.isAdmin ? 'text-amber-400' : 'text-slate-400'
                  }`}
                >
                  {authUser.isAdmin ? 'Admin' : 'Client'}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-300 hover:text-white">
              <LogIn className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-semibold text-xs">Sign In</span>
            </div>
          )}
        </button>
      </div>

      {/* Mobile Bottom Navigation Strip */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 py-2 px-3 flex items-center justify-around pb-safe">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'home' ? 'text-rose-400 bg-rose-950/30 shadow-[0_0_15px_rgba(225,29,72,0.15)]' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('store')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'store' ? 'text-rose-400 bg-rose-950/30 shadow-[0_0_15px_rgba(225,29,72,0.15)]' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Store</span>
        </button>

        <button
          onClick={() => setCurrentTab('agency')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'agency' ? 'text-rose-400 bg-rose-950/30 shadow-[0_0_15px_rgba(225,29,72,0.15)]' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Service</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setCurrentTab('admin')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
              currentTab === 'admin' ? 'text-rose-400 bg-rose-950/30 shadow-[0_0_15px_rgba(225,29,72,0.15)]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Cpu className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Admin</span>
          </button>
        )}

        <button
          onClick={() => setCurrentTab('login')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'login' ? 'text-amber-400 bg-amber-950/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{authUser ? 'Account' : 'Login'}</span>
        </button>
      </div>
    </nav>
  );
};
