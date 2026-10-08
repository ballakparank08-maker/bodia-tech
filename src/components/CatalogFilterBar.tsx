import React, { useRef } from 'react';
import { ProductCategory } from '../types/index.ts';
import { Filter, Share2, Mail, Briefcase, Globe, Server, CreditCard, Sparkles, Star, Heart, ArrowUpDown, Check, ChevronLeft, ChevronRight, Hash } from 'lucide-react';

interface CatalogFilterBarProps {
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  selectedPlatform: string;
  setSelectedPlatform: (plat: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'stock' | 'vintage';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'stock' | 'vintage') => void;
  totalCount: number;
}

const TIER_MAP: Record<string, { name: string; domain?: string }[]> = {
  'all': [],
  'social-media-messaging': [
    { name: 'Facebook', domain: 'facebook.com' },
    { name: 'Instagram', domain: 'instagram.com' },
    { name: 'Threads', domain: 'threads.net' },
    { name: 'TikTok', domain: 'tiktok.com' },
    { name: 'Reddit', domain: 'reddit.com' },
    { name: 'Twitter/X', domain: 'x.com' },
    { name: 'Telegram', domain: 'telegram.org' },
    { name: 'Discord', domain: 'discord.com' },
    { name: 'Pinterest', domain: 'pinterest.com' },
    { name: 'Quora', domain: 'quora.com' },
    { name: 'Snapchat', domain: 'snapchat.com' },
    { name: 'Twitch', domain: 'twitch.tv' },
    { name: 'WhatsApp', domain: 'whatsapp.com' },
  ],
  'email-services': [
    { name: 'Gmail', domain: 'gmail.com' },
    { name: 'Outlook', domain: 'outlook.com' },
    { name: 'Yahoo', domain: 'yahoo.com' },
    { name: 'ProtonMail', domain: 'proton.me' },
    { name: 'GMX', domain: 'gmx.com' },
    { name: 'Mail.ru', domain: 'mail.ru' },
    { name: 'AOL', domain: 'aol.com' },
    { name: 'Zoho', domain: 'zoho.com' },
    { name: 'Yandex', domain: 'yandex.com' },
  ],
  'ecommerce-professional': [
    { name: 'LinkedIn', domain: 'linkedin.com' },
    { name: 'Amazon', domain: 'amazon.com' },
    { name: 'eBay', domain: 'ebay.com' },
    { name: 'Temu', domain: 'temu.com' },
    { name: 'Airbnb', domain: 'airbnb.com' },
    { name: 'Indeed', domain: 'indeed.com' },
    { name: 'Craigslist', domain: 'craigslist.org' },
    { name: 'Walmart', domain: 'walmart.com' },
    { name: 'Etsy', domain: 'etsy.com' },
    { name: 'Uber', domain: 'uber.com' },
  ],
  'google-ecosystem': [
    { name: 'YouTube', domain: 'youtube.com' },
    { name: 'Google Voice', domain: 'voice.google.com' },
    { name: 'Google Ads', domain: 'ads.google.com' },
  ],
  'proxies-vps-software': [
    { name: 'Mobile Proxies', domain: 'verizon.com' },
    { name: 'RDP/VPS Servers', domain: 'windows.com' },
    { name: 'GitHub', domain: 'github.com' },
    { name: 'Roblox', domain: 'roblox.com' },
    { name: 'AWS Cloud', domain: 'aws.amazon.com' },
  ],
  'gift-cards-financial': [
    { name: 'Apple', domain: 'apple.com' },
    { name: 'Steam', domain: 'steampowered.com' },
    { name: 'Google Play', domain: 'play.google.com' },
    { name: 'Mastercard', domain: 'mastercard.com' },
    { name: 'PlayStation', domain: 'playstation.com' },
  ],
  'subscriptions-ai': [
    { name: 'Netflix', domain: 'netflix.com' },
    { name: 'VPN Services', domain: 'nordvpn.com' },
    { name: 'Canva', domain: 'canva.com' },
    { name: 'Gemini', domain: 'gemini.google.com' },
    { name: 'CapCut', domain: 'capcut.com' },
    { name: 'Spotify', domain: 'spotify.com' },
    { name: 'DeepSeek', domain: 'deepseek.com' },
    { name: 'ChatGPT', domain: 'openai.com' },
  ],
  'reviews-local': [
    { name: 'Trustpilot', domain: 'trustpilot.com' },
    { name: 'Yelp', domain: 'yelp.com' },
  ],
  'dating': [
    { name: 'Tinder', domain: 'tinder.com' },
    { name: 'Grindr', domain: 'grindr.com' },
    { name: 'eHarmony', domain: 'eharmony.com' },
    { name: 'Badoo', domain: 'badoo.com' },
  ],
};

export const CatalogFilterBar: React.FC<CatalogFilterBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedPlatform,
  setSelectedPlatform,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy,
  totalCount,
}) => {
  const categories: { id: ProductCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Inventory', icon: <Filter className="w-3.5 h-3.5" /> },
    { id: 'social-media-messaging', label: 'Social Media and Messaging', icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: 'email-services', label: 'Email Services & Leads', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'ecommerce-professional', label: 'E-Commerce & Professional', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'google-ecosystem', label: 'Google Ecosystem & Video', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'proxies-vps-software', label: 'Proxies, VPS, Software & Gaming', icon: <Server className="w-3.5 h-3.5" /> },
    { id: 'gift-cards-financial', label: 'Gift Cards & Financial Cards', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'subscriptions-ai', label: 'Subscriptions, AI & Premium Apps', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'reviews-local', label: 'Reviews & Local Business', icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'dating', label: 'Dating Platforms', icon: <Heart className="w-3.5 h-3.5" /> },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const platformScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 250;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategorySelect = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setSelectedPlatform(''); // Reset platform when category changes
  };

  const activePlatforms = TIER_MAP[selectedCategory] || [];

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border-y border-slate-800/80 py-3.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex items-center w-full md:flex-1 min-w-0 md:mr-4">
          <button 
            onClick={() => scroll(scrollRef, 'left')}
            className="hidden md:flex bg-slate-900 border border-slate-800/80 hover:border-slate-600 text-slate-400 hover:text-white w-8 h-8 rounded-full items-center justify-center cursor-pointer flex-shrink-0 mr-2 shadow-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div ref={scrollRef} className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 md:pb-0 scrollbar-none scroll-smooth">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]'
                      : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => scroll(scrollRef, 'right')}
            className="hidden md:flex bg-slate-900 border border-slate-800/80 hover:border-slate-600 text-slate-400 hover:text-white w-8 h-8 rounded-full items-center justify-center cursor-pointer flex-shrink-0 ml-2 shadow-sm transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right controls: In-stock toggle & Sort selector */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto text-xs">
          {/* In Stock only switch */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-white transition-colors group">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                inStockOnly
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-900 border-slate-700 text-transparent group-hover:border-slate-600'
              }`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="font-medium">In-Stock</span>
          </label>

          <div className="hidden sm:block w-px h-5 bg-slate-700/50"></div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/60 hover:border-slate-600 rounded-lg px-3 py-1.5 text-slate-300 transition-colors shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white outline-none cursor-pointer text-xs pr-1 font-medium"
            >
              <option value="featured" className="bg-slate-900">Sort: Featured</option>
              <option value="price-asc" className="bg-slate-900">Price: Low to High</option>
              <option value="price-desc" className="bg-slate-900">Price: High to Low</option>
              <option value="stock" className="bg-slate-900">Stock: Highest</option>
              <option value="vintage" className="bg-slate-900">Vintage: Oldest</option>
            </select>
          </div>

          <div className="hidden lg:block w-px h-5 bg-slate-700/50"></div>

          <div className="text-slate-400 text-xs hidden lg:flex items-center bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800/40">
            Found <strong className="text-white font-mono mx-1">{totalCount}</strong> items
          </div>
        </div>
      </div>

      {/* Platform Sub-Filters (only show if category has platforms) */}
      {activePlatforms.length > 0 && (
        <div className="max-w-7xl mx-auto mt-3.5 pt-3 border-t border-slate-800/40 flex items-center">
          <div className="flex items-center w-full min-w-0">
            <button 
              onClick={() => scroll(platformScrollRef, 'left')}
              className="hidden md:flex bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white w-6 h-6 rounded-full items-center justify-center cursor-pointer flex-shrink-0 mr-2 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            
            <div ref={platformScrollRef} className="flex items-center gap-2 overflow-x-auto w-full pb-1 md:pb-0 scrollbar-none scroll-smooth px-1">
              {/* Specific Platforms with Logos */}
              {activePlatforms.map((plat) => {
                const active = selectedPlatform === plat.name;
                return (
                  <button
                    key={plat.name}
                    onClick={() => setSelectedPlatform(active ? '' : plat.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      active
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm shadow-rose-900/20'
                        : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/50'
                    }`}
                  >
                    {plat.domain ? (
                      <img 
                        src={`https://logo.clearbit.com/${plat.domain}`} 
                        alt={plat.name} 
                        className="w-3.5 h-3.5 rounded-sm object-contain bg-white/10"
                        onError={(e) => {
                          // Fallback if logo not found
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${plat.name}&backgroundColor=1e293b&textColor=f8fafc`;
                        }}
                      />
                    ) : (
                      <Hash className="w-3.5 h-3.5" />
                    )}
                    {plat.name}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => scroll(platformScrollRef, 'right')}
              className="hidden md:flex bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white w-6 h-6 rounded-full items-center justify-center cursor-pointer flex-shrink-0 ml-2 transition-colors"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
