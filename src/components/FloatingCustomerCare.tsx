import React, { useState } from 'react';
import { SupportConfig } from '../types/index.ts';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Mail,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface FloatingCustomerCareProps {
  supportConfig: SupportConfig;
  prefillTicketOrderId?: string;
}

export const FloatingCustomerCare: React.FC<FloatingCustomerCareProps> = ({
  supportConfig,
  prefillTicketOrderId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'channels' | 'ticket' | 'faq'>('channels');

  // Ticket Form
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketOrder, setTicketOrder] = useState(prefillTicketOrderId || '');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the warranty policy for checkpoint replacements?',
      a: 'We provide an unconditional replacement guarantee within 48 to 72 hours if you encounter an initial phone checkpoint or invalid password upon first login, provided anti-detect browser instructions were observed.',
    },
    {
      q: 'Which anti-detect browsers are officially recommended?',
      a: 'We strongly suggest AdsPower, Dolphin{anty}, or Multilogin. Ensure you import the provided session cookie JSON and configure a clean residential or mobile 4G/5G proxy matching the account geolocation.',
    },
    {
      q: 'How does 2FA TOTP authentication work?',
      a: 'Each credential listing with 2FA includes a 16-character secret key. You can input this key into Google Authenticator or any standard TOTP authenticator to retrieve the dynamic 6-digit verification code.',
    },
    {
      q: 'Are these accounts phone-verified with VoIP or real SIMs?',
      a: 'All PVA listings are registered and verified using genuine physical SIM carriers (e.g. US T-Mobile/Verizon, German Telekom). We do not use non-VoIP public virtual numbers that trigger instant security flags.',
    },
  ];

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketEmail || !ticketMessage) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketMessage('');
      setTicketOrder('');
      setIsOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-rose-600/50 hover:scale-105 transition-all cursor-pointer group"
          aria-label="Open 24/7 customer care"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <MessageSquare className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span>24/7 Care Desk</span>
        </button>
      )}

      {/* Popover Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-white">Bodia Tech 24/7 Care Desk</h3>
                <p className="text-[10px] text-slate-400">{supportConfig.operatingHours}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center border-b border-slate-800/80 bg-slate-900 text-xs">
            <button
              onClick={() => setActiveTab('channels')}
              className={`flex-1 py-2 font-semibold text-center transition cursor-pointer ${
                activeTab === 'channels'
                  ? 'text-white border-b-2 border-b-red-500 bg-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hotlines
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`flex-1 py-2 font-semibold text-center transition cursor-pointer ${
                activeTab === 'ticket'
                  ? 'text-white border-b-2 border-b-red-500 bg-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Priority Ticket
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-2 font-semibold text-center transition cursor-pointer ${
                activeTab === 'faq'
                  ? 'text-white border-b-2 border-b-red-500 bg-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Warranty FAQ
            </button>
          </div>

          {/* Content Area */}
          <div className="p-4 overflow-y-auto space-y-4 max-h-[60vh] text-xs">
            {/* CHANNELS TAB */}
            {activeTab === 'channels' && (
              <div className="space-y-2.5">
                {/* Telegram */}
                <a
                  href={supportConfig.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-blue-500 flex items-center justify-between gap-3 text-white transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Official Telegram Channel</div>
                      <div className="text-[11px] text-blue-400 font-mono">{supportConfig.telegramHandle}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                </a>

                {/* WhatsApp */}
                <a
                  href={supportConfig.whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500 flex items-center justify-between gap-3 text-white transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">WhatsApp Direct Desk</div>
                      <div className="text-[11px] text-emerald-400 font-mono">{supportConfig.whatsAppNumber}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                </a>

                {/* Email */}
                <a
                  href={`mailto:${supportConfig.supportEmail}`}
                  className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-rose-500 flex items-center justify-between gap-3 text-white transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Priority Email Ticket</div>
                      <div className="text-[11px] text-red-300 font-mono">{supportConfig.supportEmail}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400" />
                </a>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-400 text-[11px] leading-relaxed">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Coverage Policy
                  </div>
                  {supportConfig.warrantyPolicy}
                </div>
              </div>
            )}

            {/* TICKET TAB */}
            {activeTab === 'ticket' && (
              <div>
                {ticketSubmitted ? (
                  <div className="text-center py-8 space-y-2 text-emerald-400">
                    <CheckCircle2 className="w-10 h-10 mx-auto" />
                    <div className="font-bold text-white text-sm">Ticket Dispatched</div>
                    <div className="text-slate-400 text-xs">
                      An on-duty engineer has been paged. You will receive an immediate response at {ticketEmail}.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendTicket} className="space-y-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        value={ticketEmail}
                        onChange={(e) => setTicketEmail(e.target.value)}
                        placeholder="buyer@agency.com"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800/80 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Order ID (if warranty inquiry)</label>
                      <input
                        type="text"
                        value={ticketOrder}
                        onChange={(e) => setTicketOrder(e.target.value)}
                        placeholder="e.g. ORD-2026-9812"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800/80 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Describe Issue or Request</label>
                      <textarea
                        rows={3}
                        required
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        placeholder="Details of login error, checkpoint trigger, or proxy location..."
                        className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold shadow-md shadow-[0_0_15px_rgba(225,29,72,0.3)] transition cursor-pointer"
                    >
                      Submit Priority Ticket
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* FAQ TAB */}
            {activeTab === 'faq' && (
              <div className="space-y-2">
                {faqs.map((faq, idx) => {
                  const isOpenItem = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl bg-slate-900/50 border border-slate-800/80 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpenItem ? null : idx)}
                        className="w-full p-3 text-left font-bold text-white flex items-center justify-between gap-2 hover:bg-slate-800/40 cursor-pointer"
                      >
                        <span className="line-clamp-1">{faq.q}</span>
                        {isOpenItem ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                      {isOpenItem && (
                        <div className="p-3 pt-0 text-slate-300 text-[11px] leading-relaxed border-t border-slate-800/80">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
