import React, { useState } from 'react';
import { submitServiceInquiry } from '../utils/api.ts';
import { ServiceInquiry } from '../types/index.ts';
import {
  Code,
  Layers,
  Zap,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Send,
  Loader2,
  X,
  ShieldCheck,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Database,
  Smartphone,
  Bot,
  Server,
  LineChart,
  Target,
  Share2,
  Mail,
  PenTool,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import { RollingProductShowcase } from './RollingProductShowcase.tsx';

interface AgencyServicesHubProps {
  onInquirySubmitted?: (inq: ServiceInquiry) => void;
  onSelectPlatform?: (platform: string) => void;
}

export const AgencyServicesHub: React.FC<AgencyServicesHubProps> = ({ 
  onInquirySubmitted,
  onSelectPlatform
}) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [budget, setBudget] = useState('Negotiable');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);

  const banners = [
    '/images/web_app_dev_banner.jpg',
    '/images/digital_marketing_banner.jpg',
    '/images/ui_ux_banner.jpg'
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', label: 'All Services', icon: <Filter className="w-3.5 h-3.5" /> },
    { id: 'web_app_dev', label: 'Web-App Development', icon: <Code className="w-3.5 h-3.5" /> },
    { id: 'digital_marketing', label: 'Digital Marketing', icon: <Send className="w-3.5 h-3.5" /> },
    { id: 'ui_ux_branding', label: 'UI/UX Design', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const agencyServices = [
    {
      id: 'web_1',
      categoryId: 'web_app_dev',
      title: 'Company Profile & Landing Pages',
      tagline: 'High-converting campaign pages.',
      icon: <Code className="w-6 h-6 text-emerald-400" />,
      features: ['Custom UI/UX Design', 'Mobile Responsive', 'SEO Optimized', 'Fast Load Times'],
      typicalTurnaround: '1 — 2 Weeks',
      budgetRange: 'Negotiable',
    },
    {
      id: 'web_2',
      categoryId: 'web_app_dev',
      title: 'E-Commerce & Online Stores',
      tagline: 'Integrated with Stripe, Midtrans, Xendit.',
      icon: <ShoppingCart className="w-6 h-6 text-emerald-400" />,
      features: ['Payment Gateway Integration', 'Inventory Management', 'User Dashboards', 'Scalable Architecture'],
      typicalTurnaround: '3 — 6 Weeks',
      budgetRange: 'Negotiable',
    },
    {
      id: 'web_3',
      categoryId: 'web_app_dev',
      title: 'Custom Web Applications / SaaS',
      tagline: 'Admin dashboards, CRMs, ERP systems.',
      icon: <Database className="w-6 h-6 text-emerald-400" />,
      features: ['Complex Business Logic', 'Secure Authentication', 'Real-time Data', 'API Development'],
      typicalTurnaround: '1 — 3 Months',
      budgetRange: 'Negotiable',
    },
    {
      id: 'web_4',
      categoryId: 'web_app_dev',
      title: 'Mobile App Development',
      tagline: 'Native and cross-platform (React Native/Flutter).',
      icon: <Smartphone className="w-6 h-6 text-emerald-400" />,
      features: ['iOS & Android Support', 'App Store Publishing', 'Push Notifications', 'Offline Capabilities'],
      typicalTurnaround: '2 — 3 Months',
      budgetRange: 'Negotiable',
    },
    {
      id: 'web_5',
      categoryId: 'web_app_dev',
      title: 'Telegram BOT & WhatsApp API',
      tagline: 'Expert Uncensored AI (Self Hosted).',
      icon: <Bot className="w-6 h-6 text-emerald-400" />,
      features: ['Custom Bot Workflows', 'Self-Hosted AI Models', 'Auto-Replies & CRM', 'High-Volume Messaging'],
      typicalTurnaround: '2 — 4 Weeks',
      budgetRange: 'Negotiable',
    },
    {
      id: 'web_6',
      categoryId: 'web_app_dev',
      title: 'Website Maintenance & DevOps',
      tagline: 'Performance optimization, DB backups.',
      icon: <Server className="w-6 h-6 text-emerald-400" />,
      features: ['Uptime Monitoring', 'Security Patches', 'Automated Backups', 'Server Scaling'],
      typicalTurnaround: 'Ongoing Monthly',
      budgetRange: 'Negotiable',
    },
    {
      id: 'dm_1',
      categoryId: 'digital_marketing',
      title: 'Search Engine Optimization (SEO)',
      tagline: 'Technical audits & keyword strategy.',
      icon: <LineChart className="w-6 h-6 text-blue-400" />,
      features: ['On-Page & Off-Page SEO', 'Technical Audits', 'Keyword Research', 'Monthly Reporting'],
      typicalTurnaround: 'Ongoing Monthly',
      budgetRange: 'Negotiable',
    },
    {
      id: 'dm_2',
      categoryId: 'digital_marketing',
      title: 'Paid Ads',
      tagline: 'Google Ads, Meta Ads (FB/IG), and TikTok Ads.',
      icon: <Target className="w-6 h-6 text-blue-400" />,
      features: ['Campaign Strategy', 'A/B Testing', 'ROI Tracking', 'Audience Targeting'],
      typicalTurnaround: 'Ongoing Monthly',
      budgetRange: 'Negotiable',
    },
    {
      id: 'dm_3',
      categoryId: 'digital_marketing',
      title: 'Social Media Management (SMM)',
      tagline: 'Content calendars, Reels/TikTok production.',
      icon: <Share2 className="w-6 h-6 text-blue-400" />,
      features: ['Content Creation', 'Community Management', 'Trend Analysis', 'Video Production'],
      typicalTurnaround: 'Ongoing Monthly',
      budgetRange: 'Negotiable',
    },
    {
      id: 'dm_4',
      categoryId: 'digital_marketing',
      title: 'Email & WhatsApp Marketing',
      tagline: 'Automated workflows and BSP broadcasts.',
      icon: <Mail className="w-6 h-6 text-blue-400" />,
      features: ['Lead Nurturing', 'List Segmentation', 'High Deliverability', 'Copywriting'],
      typicalTurnaround: 'Ongoing Monthly',
      budgetRange: 'Negotiable',
    },
    {
      id: 'ui_1',
      categoryId: 'ui_ux_branding',
      title: 'UI/UX Design',
      tagline: 'Journey mapping, wireframing, high-fidelity Figma prototypes.',
      icon: <PenTool className="w-6 h-6 text-purple-400" />,
      features: ['User Research', 'Wireframing', 'Interactive Prototypes', 'Design Systems'],
      typicalTurnaround: '2 — 4 Weeks',
      budgetRange: 'Negotiable',
    },
    {
      id: 'ui_2',
      categoryId: 'ui_ux_branding',
      title: 'Brand Identity',
      tagline: 'Logo design, brand style guidelines.',
      icon: <Palette className="w-6 h-6 text-purple-400" />,
      features: ['Logo Creation', 'Color Palette', 'Typography', 'Brand Book'],
      typicalTurnaround: '1 — 2 Weeks',
      budgetRange: 'Negotiable',
    },
    {
      id: 'ui_3',
      categoryId: 'ui_ux_branding',
      title: 'Graphic Design',
      tagline: 'Packaging design, business stationery, investor pitch decks.',
      icon: <ImageIcon className="w-6 h-6 text-purple-400" />,
      features: ['Print Materials', 'Pitch Decks', 'Packaging', 'Social Media Assets'],
      typicalTurnaround: '1 — 2 Weeks',
      budgetRange: 'Negotiable',
    },
  ];

  const handleOpenInquiry = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsModalOpen(true);
    setSubmittedSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !details) return;

    setIsSubmitting(true);
    try {
      const inq = await submitServiceInquiry({
        clientName,
        clientEmail,
        telegramHandle,
        serviceType: (selectedService || 'custom_web') as any,
        budget,
        details,
      });
      if (onInquirySubmitted) onInquirySubmitted(inq);
      setSubmittedSuccess(true);
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredServices = agencyServices.filter(svc => 
    selectedCategory === 'all' || svc.id === selectedCategory
  );

  return (
    <div className="w-full h-full space-y-12">
      {/* Eyebrow and Headline */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-600/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Terminal className="w-3.5 h-3.5" />
          Bodia Tech Agency Engineering Services
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Bespoke Automation & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
            Growth Infrastructure Solutions
          </span>
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Need more than standard off-the-shelf credentials? Our engineering team builds dedicated proxy arrays, custom Telegram automation engines, and scalable digital platforms for top media buyers.
        </p>
      </div>

      {/* Auto-Rolling Service Banners */}
      <div className="w-full relative z-20 max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900/50 aspect-[1024/571]">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
        >
          {banners.map((banner, idx) => (
            <div key={idx} className="min-w-full h-full flex-shrink-0 relative">
              <img 
                src={banner} 
                alt={`Service Banner ${idx + 1}`} 
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            </div>
          ))}
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBannerIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentBannerIndex ? 'w-6 bg-rose-500' : 'w-2 bg-slate-500/50 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-2 sm:p-3 flex items-center w-full shadow-sm max-w-5xl mx-auto">
        <button 
          onClick={() => scroll('left')}
          className="hidden sm:flex bg-slate-900 border border-slate-800/80 hover:border-slate-600 text-slate-400 hover:text-white w-8 h-8 rounded-full items-center justify-center cursor-pointer flex-shrink-0 mr-2 shadow-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div ref={scrollRef} className="flex items-center gap-2 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none scroll-smooth px-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
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
          onClick={() => scroll('right')}
          className="hidden sm:flex bg-slate-900 border border-slate-800/80 hover:border-slate-600 text-slate-400 hover:text-white w-8 h-8 rounded-full items-center justify-center cursor-pointer flex-shrink-0 ml-2 shadow-sm transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 flex flex-col justify-between space-y-6 glass-card-hover"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                  {svc.icon}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{svc.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{svc.tagline}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {svc.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Scope Budget</div>
                <div className="text-xs font-bold text-rose-400 font-mono">{svc.budgetRange}</div>
              </div>

              <button
                onClick={() => handleOpenInquiry(svc.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-[0_0_15px_rgba(225,29,72,0.3)]"
              >
                <span>Request Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Methodology Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs glass-card-hover">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white text-sm">Direct Engineer Access</div>
            <p className="text-slate-400 mt-0.5">Direct Telegram chat with our lead dev throughout the sprint.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white text-sm">Strict NDA & Operational Security</div>
            <p className="text-slate-400 mt-0.5">Your traffic funnels, proxy IPs, and codebases remain 100% confidential.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Terminal className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white text-sm">Turnkey Handover & Docs</div>
            <p className="text-slate-400 mt-0.5">Full source code, deployment scripts, and video walkthroughs provided.</p>
          </div>
        </div>
      </div>

      {/* Proposal Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-rose-500" />
                Request Custom Agency Proposal
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Proposal Request Received</h4>
                <p className="text-xs text-slate-300">
                  Our engineering lead has received your specifications. We will contact you via Telegram or Email within <strong>4 hours</strong> with a technical breakdown and milestone schedule.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Your Name or Alias</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="alex@growth.io"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Telegram Handle</label>
                    <input
                      type="text"
                      value={telegramHandle}
                      onChange={(e) => setTelegramHandle(e.target.value)}
                      placeholder="@alex_media"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Estimated Budget</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white"
                  >
                    <option value="$1,000 - $2,500">$1,000 — $2,500 USD</option>
                    <option value="$2,500 - $5,000">$2,500 — $5,000 USD</option>
                    <option value="$5,000 - $10,000">$5,000 — $10,000 USD</option>
                    <option value="$10,000+">$10,000+ USD (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Project Requirements & Target Platforms</label>
                  <textarea
                    rows={4}
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Describe your desired workflow, target platforms (Telegram, Facebook, WhatsApp), expected volume, and specific APIs..."
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[0_0_15px_rgba(225,29,72,0.3)] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Send Project Proposal</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
