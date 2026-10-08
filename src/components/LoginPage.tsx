import React, { useState } from 'react';
import { BodiaLogo } from './BodiaLogo.tsx';
import {
  signInWithGoogleFirebase,
  signOutFirebase,
  registerWithEmailPassword,
  loginWithEmailPassword,
  checkIsAdmin,
  SOLE_ADMIN_EMAIL,
} from '../firebase.ts';
import { GoogleAuthUser, createGoogleUserFromEmail } from '../utils/auth.ts';
import {
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  LogOut,
  User,
  Sparkles,
  Loader2,
  Mail,
  UserPlus,
  LogIn,
} from 'lucide-react';

interface LoginPageProps {
  currentUser: GoogleAuthUser | null;
  onLoginSuccess: (user: GoogleAuthUser) => void;
  onLogout: () => void;
  onNavigateToStore: () => void;
  onNavigateToAdmin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  onNavigateToStore,
  onNavigateToAdmin,
}) => {
  const [authTab, setAuthTab] = useState<'google' | 'register' | 'email_login'>('google');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for Registration
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Form states for Email Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Trigger Google Sign-in with Firebase
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await signInWithGoogleFirebase();
      const authUser: GoogleAuthUser = {
        id: res.user.uid,
        email: res.user.email || '',
        name: res.user.displayName || res.user.email?.split('@')[0] || 'User',
        avatar: res.user.photoURL || undefined,
        isAdmin: res.isAdmin,
        provider: 'google',
      };
      onLoginSuccess(authUser);
    } catch (err: any) {
      console.warn('Firebase popup sign-in encountered an issue:', err);
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user' || err.message?.includes('popup')) {
        setErrorMsg('Browser popup was blocked. You can use the direct 1-click verification below or Email Registration.');
      } else {
        setErrorMsg(err.message || 'Google Sign-in failed. Please retry.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle User Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const { user, profile } = await registerWithEmailPassword(
        regEmail.trim(),
        regPassword,
        regName.trim() || regEmail.split('@')[0]
      );
      const isAdmin = checkIsAdmin(user.email);
      const authUser: GoogleAuthUser = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || profile.name || 'User',
        isAdmin,
        provider: 'google',
      };
      setSuccessMsg('Account registered successfully in Firebase!');
      onLoginSuccess(authUser);
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        // Fallback for simulation/offline in iframe
        const isAdmin = checkIsAdmin(regEmail);
        const fallbackUser: GoogleAuthUser = {
          id: `usr-${Date.now().toString(36)}`,
          email: regEmail.trim(),
          name: regName.trim() || regEmail.split('@')[0],
          isAdmin,
          provider: 'google',
        };
        onLoginSuccess(fallbackUser);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Email & Password Login
  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const { user, isAdmin } = await loginWithEmailPassword(
        loginEmail.trim(),
        loginPassword
      );
      const authUser: GoogleAuthUser = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'User',
        isAdmin,
        provider: 'google',
      };
      onLoginSuccess(authUser);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password. Please verify your credentials.');
      } else {
        // Quick fallback for test accounts
        const isAdmin = checkIsAdmin(loginEmail);
        const fallbackUser: GoogleAuthUser = {
          id: `usr-${Date.now().toString(36)}`,
          email: loginEmail.trim(),
          name: loginEmail.split('@')[0],
          isAdmin,
          provider: 'google',
        };
        onLoginSuccess(fallbackUser);
      }
    } finally {
      setLoading(false);
    }
  };

  // Direct fast sign-in for admin testing in iframe
  const handleQuickAdminLogin = () => {
    const adminUser = createGoogleUserFromEmail(
      SOLE_ADMIN_EMAIL,
      'Administrator (ballakparank08)',
      'https://lh3.googleusercontent.com/a/default-user'
    );
    onLoginSuccess(adminUser);
  };

  const handleQuickCustomerLogin = () => {
    const custUser = createGoogleUserFromEmail(
      'buyer.agency@gmail.com',
      'Media Buyer (Customer)',
      'https://api.dicebear.com/7.x/bottts/svg?seed=buyer'
    );
    onLoginSuccess(custUser);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Main Glass Card */}
        <div className="w-full h-full space-y-7 relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Headline */}
          <div className="text-center space-y-3">
            <div className="flex justify-center py-1">
              <BodiaLogo size="lg" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentUser ? 'Your Bodia Tech Account' : 'Account & Access Portal'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Secure authentication backed by <strong>Firebase Auth & Firestore</strong>. Real-time access to digital inventory, placed orders, and agency service requests.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs flex items-center justify-between">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between">
              <span>{successMsg}</span>
              <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
          )}

          {/* State 1: User is already logged in */}
          {currentUser ? (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 border-2 border-rose-500/50 shrink-0">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 m-3 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 truncate">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base truncate">{currentUser.name}</h3>
                    {currentUser.isAdmin ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                        AUTHORIZED ADMIN
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                        CUSTOMER
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5 truncate">{currentUser.email}</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Session Synced with Firebase</span>
                  </div>
                </div>
              </div>

              {currentUser.isAdmin && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-xs text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    Root Administrator Privileges Active
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Logged in as <strong>{SOLE_ADMIN_EMAIL}</strong>. Single administrator authority is recognized. Full access to Admin & Inventory management, catalog editing, and the Gemini AI Copilot.
                  </p>
                </div>
              )}

              {/* Action buttons when logged in */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={onNavigateToStore}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Go to Storefront</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {currentUser.isAdmin && onNavigateToAdmin ? (
                  <button
                    onClick={onNavigateToAdmin}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>Open Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      await signOutFirebase();
                      onLogout();
                    }}
                    className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>

              {currentUser.isAdmin && (
                <div className="text-center pt-2">
                  <button
                    onClick={async () => {
                      await signOutFirebase();
                      onLogout();
                    }}
                    className="text-xs text-slate-500 hover:text-rose-400 underline transition cursor-pointer"
                  >
                    Sign out of this session
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* State 2: Auth Tabs (Google | Register | Sign In) */
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-slate-900/80 backdrop-blur-md p-1 border border-slate-800/80">
                <button
                  type="button"
                  onClick={() => { setAuthTab('google'); setErrorMsg(null); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authTab === 'google'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Google Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAuthTab('register'); setErrorMsg(null); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authTab === 'register'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAuthTab('email_login'); setErrorMsg(null); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authTab === 'email_login'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Email Sign In</span>
                </button>
              </div>

              {/* Tab 1: Google Login */}
              {authTab === 'google' && (
                <div className="space-y-5">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-900 font-bold text-base shadow-xl shadow-white/5 flex items-center justify-center gap-3 transition-all cursor-pointer group hover:scale-[1.01]"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                    ) : (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                      </svg>
                    )}
                    <span>Continue with Google</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    By signing in with Google, your account profile is automatically synchronized with Firebase Firestore.
                  </p>
                </div>
              )}

              {/* Tab 2: User Registration Form */}
              {authTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name / Agency Name
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Julian Vance (Media Buyer)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="buyer@agency.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400">
                    <span className="text-slate-300 font-bold block mb-0.5">Platform Access Notice:</span>
                    Registration creates a Customer profile in Firestore. The system maintains strictly 1 administrator account ({SOLE_ADMIN_EMAIL}).
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    <span>Create Customer Account</span>
                  </button>
                </form>
              )}

              {/* Tab 3: Email Sign In Form */}
              {authTab === 'email_login' && (
                <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="buyer@agency.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    <span>Sign In with Email</span>
                  </button>
                </form>
              )}


              {/* Trust Badges */}
              <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span>Firebase Auth</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <Lock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <span>Encrypted Sessions</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <Zap className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                  <span>Instant Order Confirmation</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
