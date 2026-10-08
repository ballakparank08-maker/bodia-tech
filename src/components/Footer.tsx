import React, { useState } from 'react';
import { BodiaLogo } from './BodiaLogo.tsx';
import { subscribeNewsletter } from '../utils/api.ts';
import { ShieldCheck, Mail, Check, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subMsg, setSubMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    try {
      const msg = await subscribeNewsletter(email);
      setSubscribed(true);
      setSubMsg(msg);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    } catch (err: any) {
      alert(`Subscription failed: ${err.message}`);
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800/80 text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <BodiaLogo size="md" />
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              Premier digital asset marketplace, automated credential delivery infrastructure, and agency engineering hub. Dedicated to high-performing media buyers, growth hackers, and automation specialists worldwide.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                API Nodes Operational
              </span>
              <span>•</span>
              <span>Encrypted Auto-Delivery</span>
              <span>•</span>
              <span>24/7/365 Dispatch</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-xs">Inventory Categories</div>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-white transition cursor-pointer">Facebook Marketplace & BM</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Gmail Aged & Clean Sender</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Twitter/X Organic Vintage</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Telegram Physical SIM PVA</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Discord Early Supporter</span></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-xs">Product Drops & VIP Discounts</div>
            <p className="text-[11px] text-slate-400">
              Receive notifications for fresh aged Facebook Marketplace restocks and flash coupon discounts.
            </p>

            {subscribed ? (
              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{subMsg || 'Subscribed!'}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="buyer@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white rounded-lg transition cursor-pointer"
                  title="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Bodia Tech. All digital credentials and accounts are delivered for testing, automation, and marketing agency operations.
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Warranty Replacement Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Security & Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
