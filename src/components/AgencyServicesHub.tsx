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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [budget, setBudget] = useState('$2,500 - $5,000');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const agencyServices = [
    {
      id: 'web_app_dev',
      title: 'Web & App Development',
      tagline: 'Focuses on building the digital infrastructure and interfaces for businesses',
      icon: <Code className="w-6 h-6 text-emerald-400" />,
      features: [
        'Company Profile & Landing Pages: High-converting campaign pages.',
        'E-Commerce & Online Stores: Integrated with Stripe, Midtrans, Xendit.',
        'Custom Web Applications / SaaS: Admin dashboards, CRMs, ERP systems.',
        'Mobile App Development: Native and cross-platform (React Native/Flutter).',
        'Telegram BOT, WhatsApp API & Expert Uncensored AI (Self Hosted).',
        'Website Maintenance & DevOps: Performance optimization, DB backups.',
      ],
      typicalTurnaround: '2 — 6 Weeks',
      budgetRange: '$2,500 — $10,000+',
    },
    {
      id: 'digital_marketing',
      title: 'Digital Marketing & Growth',
      tagline: 'Drives qualified web traffic, sales leads, and online market visibility',
      icon: <Send className="w-6 h-6 text-blue-400" />,
      features: [
        'Search Engine Optimization (SEO): Technical audits & keyword strategy.',
        'Paid Ads: Google Ads, Meta Ads (FB/IG), and TikTok Ads.',
        'Social Media Management (SMM): Content calendars, Reels/TikTok production.',
        'Email & WhatsApp Marketing: Automated workflows and BSP broadcasts.',
      ],
      typicalTurnaround: 'Ongoing Monthly',
      budgetRange: '$1,000 — $5,000+/mo',
    },
    {
      id: 'ui_ux_branding',
      title: 'UI/UX Design & Branding',
      tagline: 'Establishes visual identity and user flows before development or marketing execution',
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      features: [
        'UI/UX Design: Journey mapping, wireframing, high-fidelity Figma prototypes.',
        'Brand Identity: Logo design, brand style guidelines (color systems, typography).',
        'Graphic Design: Packaging design, business stationery, investor pitch decks.',
      ],
      typicalTurnaround: '1 — 3 Weeks',
      budgetRange: '$1,500 — $4,000',
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

      {/* Interactive Rolling Product & Service Showcase */}
      <div className="w-full relative z-20">
        <RollingProductShowcase 
          onSelectPlatform={onSelectPlatform || (() => {})} 
          onExploreAgency={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} 
          filterModeProp="service"
          hideFilters={true}
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agencyServices.map((svc) => (
          <div
            key={svc.id}
            className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 hover:border-rose-500/50 transition-all duration-200 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                  {svc.icon}
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Turnaround</div>
                  <div className="text-xs font-bold text-white font-mono">{svc.typicalTurnaround}</div>
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
      <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
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
