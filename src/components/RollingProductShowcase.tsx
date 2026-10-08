import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Code,
  Bot,
  Layers,
  Sparkles,
  TrendingUp,
  Server,
  Headphones,
  Check,
} from 'lucide-react';

export interface ShowcaseItem {
  id: string;
  type: 'store' | 'service';
  title: string;
  badge: string;
  platformOrDomain: string;
  highlightStat: string;
  priceOrRate: string;
  description: string;
  gradientTheme: string;
  borderTheme: string;
  accentColor: string;
  icon: string;
  svgGraphic: React.ReactNode;
  actionText: string;
  actionType: 'platform_filter' | 'agency_view';
  actionTarget: string;
}

interface RollingProductShowcaseProps {
  onSelectPlatform: (platform: string) => void;
  onExploreAgency: () => void;
  filterModeProp?: 'all' | 'store' | 'service';
  hideFilters?: boolean;
}

export const RollingProductShowcase: React.FC<RollingProductShowcaseProps> = ({
  onSelectPlatform,
  onExploreAgency,
  filterModeProp = 'all',
  hideFilters = false,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'store' | 'service'>(filterModeProp);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRolling, setIsAutoRolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 10 Distinct Showcase Items (5 Product Store + 5 Product Service)
  const items: ShowcaseItem[] = [
    // 1. STORE: Facebook PVA & Marketplace
    {
      id: 'store-fb',
      type: 'store',
      title: 'Facebook Marketplace Active — Aged US PVA',
      badge: 'PRODUCT STORE',
      platformOrDomain: 'Facebook',
      highlightStat: '2014-2018 Vintage',
      priceOrRate: '$14.50 / unit',
      description: 'Pre-warmed on US residential proxies. Full Marketplace tab unlocked, 2FA secret seeds & session cookies.',
      gradientTheme: 'from-[#0b1f47] via-[#081533] to-[#050b1c]',
      borderTheme: 'border-blue-500/40 hover:border-blue-400',
      accentColor: '#3b82f6',
      icon: 'fb',
      actionText: 'Browse Facebook Stock',
      actionType: 'platform_filter',
      actionTarget: 'Facebook',
      svgGraphic: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="bg-fb" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1877F2" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0B132B" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#bg-fb)" />
          {/* Cyber grid lines */}
          <g stroke="#1e3a8a" strokeWidth="1" opacity="0.3">
            <line x1="0" y1="44" x2="400" y2="44" />
            <line x1="0" y1="88" x2="400" y2="88" />
            <line x1="0" y1="132" x2="400" y2="132" />
            <line x1="0" y1="176" x2="400" y2="176" />
            <line x1="80" y1="0" x2="80" y2="220" />
            <line x1="160" y1="0" x2="160" y2="220" />
            <line x1="240" y1="0" x2="240" y2="220" />
            <line x1="320" y1="0" x2="320" y2="220" />
          </g>
          {/* Glowing Center Graphic */}
          <circle cx="200" cy="110" r="60" fill="#1877F2" opacity="0.15" filter="blur(20px)" />
          <path d="M190 75 h25 a15 15 0 0 1 15 15 v10 h-15 v55 h-20 v-55 h-12 v-15 h12 v-8 a15 15 0 0 1 15 -15" fill="none" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
          <circle cx="200" cy="110" r="75" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 6" fill="none" />
          {/* Status chips */}
          <rect x="20" y="20" width="110" height="26" rx="6" fill="#1e3a8a" opacity="0.8" />
          <text x="32" y="37" fill="#93C5FD" fontSize="11" fontFamily="monospace" fontWeight="bold">MARKETPLACE: ON</text>
          <rect x="270" y="174" width="110" height="26" rx="6" fill="#064e3b" opacity="0.8" />
          <text x="282" y="191" fill="#6EE7B7" fontSize="11" fontFamily="monospace" fontWeight="bold">2FA PROTECTED</text>
        </svg>
      ),
    },

    // 2. STORE: Facebook Business Manager BM2500
    {
      id: 'store-bm',
      type: 'store',
      title: 'Business Manager BM2500 Agency Tier (Unlimited)',
      badge: 'PRODUCT STORE',
      platformOrDomain: 'Facebook Ads',
      highlightStat: 'BM2500 Verified',
      priceOrRate: '$89.00 / unit',
      description: 'Tier-1 verified Business Manager. Unlimited daily ad spend threshold, 5 active ad account slots created.',
      gradientTheme: 'from-[#141d3b] via-[#0e172e] to-[#070b17]',
      borderTheme: 'border-emerald-500/40 hover:border-emerald-400',
      accentColor: '#10b981',
      icon: 'bm',
      actionText: 'Inspect BM Inventory',
      actionType: 'platform_filter',
      actionTarget: 'Facebook',
      svgGraphic: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="bg-bm" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#bg-bm)" />
          <g stroke="#047857" strokeWidth="1" opacity="0.3">
            <line x1="0" y1="50" x2="400" y2="50" />
            <line x1="0" y1="110" x2="400" y2="110" />
            <line x1="0" y1="170" x2="400" y2="170" />
            <line x1="100" y1="0" x2="100" y2="220" />
            <line x1="200" y1="0" x2="200" y2="220" />
            <line x1="300" y1="0" x2="300" y2="220" />
          </g>
          {/* Holographic Verification Badge */}
          <circle cx="200" cy="110" r="50" fill="#10B981" opacity="0.15" />
          <path d="M175 110 l18 18 l35 -35" fill="none" stroke="#34D399" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="150" y="60" width="100" height="100" rx="20" stroke="#10B981" strokeWidth="2" fill="none" />
          <rect x="20" y="20" width="130" height="26" rx="6" fill="#065f46" opacity="0.8" />
          <text x="30" y="37" fill="#A7F3D0" fontSize="11" fontFamily="monospace" fontWeight="bold">UNLIMITED SPEND</text>
          <rect x="250" y="174" width="130" height="26" rx="6" fill="#1e1b4b" opacity="0.8" />
          <text x="262" y="191" fill="#C7D2FE" fontSize="11" fontFamily="monospace" fontWeight="bold">5 AD ACCOUNTS</text>
        </svg>
      ),
    },

    // 3. STORE: Gmail Enterprise Vintage 2012-2016
    {
      id: 'store-gmail',
      type: 'store',
      title: 'Gmail Aged Enterprise PVA (2012–2016 Vintage)',
      badge: 'PRODUCT STORE',
      platformOrDomain: 'Google Suite',
      highlightStat: '10+ Years Aged',
      priceOrRate: '$6.80 / unit',
      description: 'Clean vintage inbox activity with zero spam flags. Unlocked for Google Ads, YouTube, and enterprise outreach.',
      gradientTheme: 'from-[#2b1218] via-[#1c0d14] to-[#0a0508]',
      borderTheme: 'border-rose-500/40 hover:border-rose-400',
      accentColor: '#ef4444',
      icon: 'gmail',
      actionText: 'Filter Gmail Accounts',
      actionType: 'platform_filter',
      actionTarget: 'Gmail',
      svgGraphic: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="bg-gmail" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA4335" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#FBBC05" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#1e1014" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#bg-gmail)" />
          {/* Glowing Mail Envelope Hologram */}
          <circle cx="200" cy="110" r="55" fill="#EA4335" opacity="0.15" />
          <rect x="155" y="75" width="90" height="70" rx="10" stroke="#F87171" strokeWidth="3" fill="none" />
          <path d="M155 85 l45 35 l45 -35" stroke="#FCA5A5" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="20" y="20" width="125" height="26" rx="6" fill="#7f1d1d" opacity="0.8" />
          <text x="32" y="37" fill="#FECACA" fontSize="11" fontFamily="monospace" fontWeight="bold">AGED REPUTATION</text>
          <rect x="260" y="174" width="120" height="26" rx="6" fill="#14532d" opacity="0.8" />
          <text x="272" y="191" fill="#BBF7D0" fontSize="11" fontFamily="monospace" fontWeight="bold">POP3/IMAP ACTIVE</text>
        </svg>
      ),
    },

    // 4. STORE: Twitter / X Aged Blue-Ready
    {
      id: 'store-x',
      type: 'store',
      title: 'Twitter / X Aged 2013–2018 (API & Premium Primed)',
      badge: 'PRODUCT STORE',
      platformOrDomain: 'Twitter / X',
      highlightStat: 'High Trust Karma',
      priceOrRate: '$11.20 / unit',
      description: 'Vintage timeline activity with zero shadowbans. Ideal for X Premium blue verification and mass quote tweeting.',
      gradientTheme: 'from-[#141b2a] via-[#0d121c] to-[#06090e]',
      borderTheme: 'border-slate-500/40 hover:border-slate-300',
      accentColor: '#94a3b8',
      icon: 'x',
      actionText: 'Filter Twitter / X',
      actionType: 'platform_filter',
      actionTarget: 'Twitter/X',
      svgGraphic: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
          <rect width="400" height="220" fill="#080c14" />
          <circle cx="200" cy="110" r="50" fill="#38bdf8" opacity="0.1" />
          {/* X Minimalist Graphic */}
          <path d="M165 70 L235 150 M235 70 L165 150" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" />
          <circle cx="200" cy="110" r="70" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 5" fill="none" />
          <rect x="20" y="20" width="130" height="26" rx="6" fill="#1e293b" opacity="0.8" />
          <text x="32" y="37" fill="#E2E8F0" fontSize="11" fontFamily="monospace" fontWeight="bold">ZERO SHADOWBAN</text>
          <rect x="260" y="174" width="120" height="26" rx="6" fill="#0369a1" opacity="0.8" />
          <text x="272" y="191" fill="#BAE6FD" fontSize="11" fontFamily="monospace" fontWeight="bold">TOKEN INCLUDED</text>
        </svg>
      ),
    },

    // 5. STORE: Telegram Sessions & TData
    {
      id: 'store-tg',
      type: 'store',
      title: 'Telegram Aged Sessions (TData + Session Strings)',
      badge: 'PRODUCT STORE',
      platformOrDomain: 'Telegram',
      highlightStat: 'Flood-Wait Immune',
      priceOrRate: '$8.50 / unit',
      description: 'Physical European & US carrier registered. TData directory + Telethon session file bundle for instant automation.',
      gradientTheme: 'from-[#0b2438] via-[#081926] to-[#040e17]',
      borderTheme: 'border-cyan-500/40 hover:border-cyan-400',
      accentColor: '#06b6d4',
      icon: 'tg',
      actionText: 'View Telegram Stock',
      actionType: 'platform_filter',
      actionTarget: 'Telegram',
      svgGraphic: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="bg-tg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0088cc" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#04121d" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#bg-tg)" />
          {/* Telegram Airplane */}
          <circle cx="200" cy="110" r="50" fill="#0088cc" opacity="0.2" />
          <path d="M160 110 l80 -30 l-40 60 l-15 -15 l-10 10 v-15" fill="#22D3EE" />
          <circle cx="200" cy="110" r="65" stroke="#0891B2" strokeWidth="2" fill="none" />
          <rect x="20" y="20" width="125" height="26" rx="6" fill="#164e63" opacity="0.8" />
          <text x="32" y="37" fill="#A5F3FC" fontSize="11" fontFamily="monospace" fontWeight="bold">TDATA ARCHIVES</text>
          <rect x="260" y="174" width="120" height="26" rx="6" fill="#065f46" opacity="0.8" />
          <text x="272" y="191" fill="#A7F3D0" fontSize="11" fontFamily="monospace" fontWeight="bold">WARM SESSIONS</text>
        </svg>
      ),
    },

    // 6. SERVICE: Custom SaaS & FinTech Web Development
    {
      id: 'srv-web',
      type: 'service',
      title: 'Custom Web & FinTech App Development',
      badge: 'PRODUCT SERVICE',
      platformOrDomain: 'Engineering Service',
      highlightStat: 'React 18 / Node Full-Stack',
      priceOrRate: 'From $3,500',
      description: 'End-to-end bespoke marketplaces, escrow engines, crypto checkout gateways, and automated affiliate hubs.',
      gradientTheme: 'from-[#190c33] via-[#100721] to-[#080312]',
      borderTheme: 'border-purple-500/40 hover:border-purple-400',
      accentColor: '#a855f7',
      icon: 'code',
      actionText: 'Request Custom App Scope',
      actionType: 'agency_view',
      actionTarget: 'custom_web',
      svgGraphic: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="bg-web" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333EA" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#130722" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#bg-web)" />
          {/* Holographic Code Matrix / Dashboard Display */}
          <rect x="130" y="60" width="140" height="95" rx="8" stroke="#C084FC" strokeWidth="2" fill="#1e1035" opacity="0.7" />
          <line x1="130" y1="80" x2="270" y2="80" stroke="#A855F7" strokeWidth="1" />
          <circle cx="145" cy="70" r="3" fill="#EF4444" />
          <circle cx="155" cy="70" r="3" fill="#F59E0B" />
          <circle cx="165" cy="70" r="3" fill="#10B981" />
          <path d="M150 100 l15 15 l-15 15 M180 130 h35" stroke="#E9D5FF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <rect x="20" y="20" width="135" height="26" rx="6" fill="#581c87" opacity="0.8" />
          <text x="30" y="37" fill="#F3E8FF" fontSize="11" fontFamily="monospace" fontWeight="bold">FULL-STACK SAAS</text>
          <rect x="250" y="174" width="130" height="26" rx="6" fill="#14532d" opacity="0.8" />
          <text x="260" y="191" fill="#BBF7D0" fontSize="11" fontFamily="monospace" fontWeight="bold">SECURITY AUDITED</text>
        </svg>
      ),
    },

    // 7. SERVICE: Telegram & Discord Bot Automation
    {
      id: 'srv-bots',
      type: 'service',
      title: 'Telegram & Discord Autonomous Bot Hubs',
      badge: 'PRODUCT SERVICE',
      platformOrDomain: 'Bot Engineering',
      highlightStat: '99.99% Uptime Cluster',
      priceOrRate: 'From $1,200',
      description: 'Autonomous lead scraping, crypto tipping, subscriber verification, and multi-channel broadcast automation.',
      gradientTheme: 'from-[#0d2a3a] via-[#091b26] to-[#040e14]',
      borderTheme: 'border-teal-500/40 hover:border-teal-400',
      accentColor: '#14b8a6',
      icon: 'bot',
      actionText: 'Configure Bot Architecture',
      actionType: 'agency_view',
      actionTarget: 'bot_automation',
      svgGraphic: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="bg-bot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#041f1c" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#bg-bot)" />
          {/* Futuristic Robot Circuit Head */}
          <rect x="155" y="70" width="90" height="75" rx="16" stroke="#2DD4BF" strokeWidth="3" fill="#042f2e" />
          <circle cx="180" cy="100" r="8" fill="#5EEAD4" />
          <circle cx="220" cy="100" r="8" fill="#5EEAD4" />
          <line x1="185" y1="125" x2="215" y2="125" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" />
          <line x1="200" y1="50" x2="200" y2="70" stroke="#2DD4BF" strokeWidth="3" />
          <circle cx="200" cy="46" r="5" fill="#14B8A6" />
          <rect x="20" y="20" width="130" height="26" rx="6" fill="#134e4a" opacity="0.8" />
          <text x="32" y="37" fill="#CCFBF1" fontSize="11" fontFamily="monospace" fontWeight="bold">AUTONOMOUS DISPATCH</text>
          <rect x="250" y="174" width="130" height="26" rx="6" fill="#701a75" opacity="0.8" />
          <text x="262" y="191" fill="#F5D0FE" fontSize="11" fontFamily="monospace" fontWeight="bold">CRM SYNC HOOKS</text>
        </svg>
      ),
    },

    // 8. SERVICE: Anti-Detect & Proxy Infrastructure
    {
      id: 'srv-proxy',
      type: 'service',
      title: 'Anti-Detect Browser & Proxy Infrastructure',
      badge: 'PRODUCT SERVICE',
      platformOrDomain: 'DevOps & Privacy',
      highlightStat: 'Zero Fingerprint Leak',
      priceOrRate: 'From $800 / setup',
      description: 'Hardened AdsPower, Dolphin{anty}, and Multilogin cluster deployment with private residential IP backbones.',
      gradientTheme: 'from-[#0e1f38] via-[#091426] to-[#040a14]',
      borderTheme: 'border-blue-500/40 hover:border-blue-400',
      accentColor: '#38bdf8',
      icon: 'server',
      actionText: 'Deploy Fingerprint Rig',
      actionType: 'agency_view',
      actionTarget: 'proxy_infrastructure',
      svgGraphic: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="bg-srv-proxy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#081b2e" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#bg-srv-proxy)" />
          {/* Server Stacks & Mask Network */}
          <rect x="145" y="65" width="110" height="25" rx="5" stroke="#38BDF8" strokeWidth="1.5" fill="#0c233c" />
          <rect x="145" y="98" width="110" height="25" rx="5" stroke="#38BDF8" strokeWidth="1.5" fill="#0c233c" />
          <rect x="145" y="131" width="110" height="25" rx="5" stroke="#38BDF8" strokeWidth="1.5" fill="#0c233c" />
          <circle cx="160" cy="77" r="3" fill="#10B981" />
          <circle cx="160" cy="110" r="3" fill="#10B981" />
          <circle cx="160" cy="143" r="3" fill="#10B981" />
          <rect x="20" y="20" width="130" height="26" rx="6" fill="#0c4a6e" opacity="0.8" />
          <text x="32" y="37" fill="#BAE6FD" fontSize="11" fontFamily="monospace" fontWeight="bold">CANVAS / WEBGL MASK</text>
          <rect x="250" y="174" width="130" height="26" rx="6" fill="#065f46" opacity="0.8" />
          <text x="262" y="191" fill="#A7F3D0" fontSize="11" fontFamily="monospace" fontWeight="bold">RESIDENTIAL 4G/5G</text>
        </svg>
      ),
    },

    // 9. SERVICE: Growth Hacking & Viral Media Buying
    {
      id: 'srv-growth',
      type: 'service',
      title: 'Growth Hacking & Viral Ad Scaling Operations',
      badge: 'PRODUCT SERVICE',
      platformOrDomain: 'Ad Growth Retainer',
      highlightStat: '10x Spend Multiplier',
      priceOrRate: 'From $2,000 / mo',
      description: 'Scale ad spend past network limits using multi-BM architectures, warm cloakers, and high-converting funnel setups.',
      gradientTheme: 'from-[#33180c] via-[#210f07] to-[#0f0703]',
      borderTheme: 'border-amber-500/40 hover:border-amber-400',
      accentColor: '#f59e0b',
      icon: 'growth',
      actionText: 'Explore Media Buying Retainer',
      actionType: 'agency_view',
      actionTarget: 'growth_marketing',
      svgGraphic: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="bg-growth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#241005" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#bg-growth)" />
          {/* Rocket Trajectory Curve */}
          <path d="M120 160 Q 200 130 260 60" fill="none" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
          <circle cx="260" cy="60" r="8" fill="#F59E0B" />
          <circle cx="260" cy="60" r="16" stroke="#FDE68A" strokeWidth="2" fill="none" opacity="0.6" />
          <rect x="20" y="20" width="130" height="26" rx="6" fill="#78350f" opacity="0.8" />
          <text x="32" y="37" fill="#FDE68A" fontSize="11" fontFamily="monospace" fontWeight="bold">AGGRESSIVE ROI</text>
          <rect x="250" y="174" width="130" height="26" rx="6" fill="#831843" opacity="0.8" />
          <text x="262" y="191" fill="#FBCFE8" fontSize="11" fontFamily="monospace" fontWeight="bold">MULTI-BM BYPASS</text>
        </svg>
      ),
    },

    // 10. SERVICE: 24/7 Priority SLA & Emergency Shift Dispatch
    {
      id: 'srv-sla',
      type: 'service',
      title: '24/7 Dedicated Shift Engineers & Instant Warranty',
      badge: 'PRODUCT SERVICE',
      platformOrDomain: 'Emergency Desk',
      highlightStat: '< 5 Min Response',
      priceOrRate: 'Enterprise SLA',
      description: 'Dedicated shift technicians on Telegram hotline for live checkpoint swaps, credential regeneration, and monitoring.',
      gradientTheme: 'from-[#0b2920] via-[#071a14] to-[#030d0a]',
      borderTheme: 'border-emerald-500/40 hover:border-emerald-400',
      accentColor: '#10b981',
      icon: 'support',
      actionText: 'Connect with Shift Team',
      actionType: 'agency_view',
      actionTarget: 'custom_web',
      svgGraphic: (
        <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="bg-sla" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#031f17" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#bg-sla)" />
          {/* 24/7 Hologram Radar Pulse */}
          <circle cx="200" cy="110" r="30" fill="#10B981" opacity="0.2" />
          <circle cx="200" cy="110" r="55" stroke="#34D399" strokeWidth="2" strokeDasharray="5 5" fill="none" />
          <circle cx="200" cy="110" r="80" stroke="#059669" strokeWidth="1" fill="none" opacity="0.5" />
          <text x="175" y="117" fill="#6EE7B7" fontSize="22" fontFamily="monospace" fontWeight="bold">24/7</text>
          <rect x="20" y="20" width="130" height="26" rx="6" fill="#064e3b" opacity="0.8" />
          <text x="32" y="37" fill="#A7F3D0" fontSize="11" fontFamily="monospace" fontWeight="bold">SHIFT DISPATCH</text>
          <rect x="250" y="174" width="130" height="26" rx="6" fill="#1e1b4b" opacity="0.8" />
          <text x="262" y="191" fill="#C7D2FE" fontSize="11" fontFamily="monospace" fontWeight="bold">INSTANT SWAPS</text>
        </svg>
      ),
    },
  ];

  // Filter items if user filters by Store or Service
  const displayedItems = items.filter((item) => {
    if (filterMode === 'all') return true;
    return item.type === filterMode;
  });

  // Automatic Rolling Interval (3.5 seconds)
  useEffect(() => {
    if (!isAutoRolling || isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayedItems.length);
    }, 3500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoRolling, isHovered, displayedItems.length]);

  // Handle Wrap-around on filter change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filterMode]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayedItems.length) % displayedItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayedItems.length);
  };

  const handleAction = (item: ShowcaseItem) => {
    if (item.actionType === 'platform_filter') {
      onSelectPlatform(item.actionTarget);
    } else {
      onExploreAgency();
    }
  };

  const currentItem = displayedItems[currentIndex] || displayedItems[0];

  return (
    <div
      className="mt-8 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl p-4 sm:p-6 backdrop-blur-md relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Bar with 10 Items Title, Filter Tabs & Auto-Roll Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>Rolling Product & Services Showcase</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 font-mono font-bold">
                10 Rolling Items
              </span>
            </h3>
          </div>

          {/* Filter Pills */}
          {!hideFilters && (
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800/80">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All (10)
              </button>
              <button
                onClick={() => setFilterMode('store')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  filterMode === 'store'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Product Store (5)
              </button>
              <button
                onClick={() => setFilterMode('service')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  filterMode === 'service'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Product Services (5)
              </button>
            </div>
          )}
        </div>

        {/* Rolling Controls & Status */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsAutoRolling(!isAutoRolling)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
              isAutoRolling
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
            title={isAutoRolling ? 'Pause Auto-Rolling' : 'Resume Auto-Rolling'}
          >
            {isAutoRolling ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">{isAutoRolling ? 'Auto-Rolling' : 'Paused'}</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-400 cursor-pointer transition"
              aria-label="Previous item"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-400 cursor-pointer transition"
              aria-label="Next item"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Rolling Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Column: Visual Artwork Graphic (Aspect 16:9) */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl bg-black group">
          <div className="aspect-[16/9] w-full relative">
            {currentItem.svgGraphic}

            {/* Glowing Category Overlay Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-lg ${
                  currentItem.type === 'store'
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {currentItem.badge}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-black/70 border border-slate-700 text-slate-300 text-[10px] font-bold">
                {currentItem.platformOrDomain}
              </span>
            </div>

            {/* Pricing / Stat Chip in Artwork */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-slate-700 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Listing Pricing</div>
              <div className="text-sm font-black text-emerald-400 font-mono">
                {currentItem.priceOrRate}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Spec Details & 1-Click Action */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                Item {currentIndex + 1} of {displayedItems.length}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{currentItem.highlightStat}</span>
            </div>

            <h4 className="text-lg sm:text-xl font-black text-white leading-tight">
              {currentItem.title}
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {currentItem.description}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Category Scope:</span>
              <strong className="text-white">
                {currentItem.type === 'store' ? 'Digital Account Inventory' : 'Agency Professional Service'}
              </strong>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Delivery SLA:</span>
              <strong className="text-emerald-400">
                {currentItem.type === 'store' ? '< 15s Instant Provisioning' : 'Priority Sprint & Retainer'}
              </strong>
            </div>
          </div>

          <button
            onClick={() => handleAction(currentItem)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 cursor-pointer transition group"
          >
            <span>{currentItem.actionText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Mini Thumbnail Strip (10 Items) for Quick Clicking */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {displayedItems.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-1 min-w-[70px] sm:min-w-[90px] p-1.5 rounded-lg border text-left transition cursor-pointer ${
                isActive
                  ? 'bg-slate-900 border-rose-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-mono mb-0.5">
                <span className={item.type === 'store' ? 'text-blue-400 font-bold' : 'text-purple-400 font-bold'}>
                  {item.type === 'store' ? 'STORE' : 'SERVICE'}
                </span>
                <span className="text-slate-400">#{idx + 1}</span>
              </div>
              <div className="text-[10px] font-bold truncate text-slate-200">
                {item.platformOrDomain}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
