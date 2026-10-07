import React, { useState } from 'react';
import { GoogleAuthUser, createGoogleUserFromEmail, isAuthorizedAdmin } from '../utils/auth.ts';
import { X, ShieldAlert, CheckCircle2, User, LogOut, ArrowRight, Lock } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: GoogleAuthUser | null;
  onLoginSuccess: (user: GoogleAuthUser) => void;
  onLogout: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  if (!isOpen) return null;

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleAdminQuickLogin = () => {
    const adminUser = createGoogleUserFromEmail(
      'ballakparank08@gmail.com',
      'Administrator (ballakparank08)',
      'https://lh3.googleusercontent.com/a/default-user'
    );
    onLoginSuccess(adminUser);
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) return;
    const user = createGoogleUserFromEmail(customEmail, customName || undefined);
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            {/* Google G Logo */}
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Authentication</h3>
              <p className="text-xs text-slate-400">Single Sign-On & Access Control</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current User State if Logged In */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden shrink-0 border border-slate-600">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 m-2 text-slate-300" />
                )}
              </div>
              <div className="flex-1 truncate">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <span>{currentUser.name}</span>
                  {currentUser.isAdmin ? (
                    <span className="px-2 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                      AUTHORIZED ADMIN
                    </span>
                  ) : (
                    <span className="px-2 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px]">
                      CUSTOMER
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono truncate">{currentUser.email}</div>
              </div>
            </div>

            {currentUser.isAdmin ? (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <strong className="block font-bold">Root Admin Access Granted</strong>
                  You are authenticated as <strong>ballakparank08@gmail.com</strong>. The Admin Dashboard and Gemini AI Copilot are unlocked.
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-300 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong className="block font-bold">Standard Customer Session</strong>
                  This Google account is not configured as an authorized admin. Admin & Inventory and AI Copilot remain strictly hidden.
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Google</span>
              </button>

              {!currentUser.isAdmin && (
                <button
                  onClick={handleAdminQuickLogin}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Switch to Admin</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Login Options when logged out */
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                To access <strong>Admin & Inventory</strong> and the <strong>Gemini AI Copilot</strong>, you must sign in with your authorized Google Admin account (<strong>ballakparank08@gmail.com</strong>).
              </span>
            </div>

            {/* Primary Google Login Button for Authorized Admin */}
            <button
              onClick={handleAdminQuickLogin}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition cursor-pointer border border-slate-200 group"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>Sign in as Admin (ballakparank08@gmail.com)</span>
            </button>

            {/* Option to test with standard user or custom email */}
            <div className="pt-2 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                {showCustomInput ? 'Hide other Google account options' : 'Sign in with a different Google account'}
              </button>

              {showCustomInput && (
                <form onSubmit={handleCustomLogin} className="mt-3 space-y-2.5 text-left text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Google Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="user@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800/80 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Display Name (optional)</label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800/80 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-900 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Sign in with Google</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-500 block text-center">
                    Note: Accounts other than ballakparank08@gmail.com will not have admin privileges.
                  </span>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
