import React, { useState } from 'react';
import { SupportConfig } from '../types/index.ts';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Mail,
  ShieldCheck,
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

          {/* Content Area */}
          <div className="p-4 overflow-y-auto space-y-4 max-h-[60vh] text-xs">
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
          </div>
        </div>
      )}
    </div>
  );
};
