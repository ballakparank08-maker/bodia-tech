import React, { useState, useEffect, useRef } from 'react';
import { AccountProduct, CopilotMessage, CopilotAction } from '../types/index.ts';
import { sendCopilotMessage, generateBulkAiListings, adjustGlobalMargin, saveProduct } from '../utils/api.ts';
import {
  X,
  Cpu,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Database,
  PlusCircle,
  Zap,
  Bot,
} from 'lucide-react';

interface AdminCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: AccountProduct[];
  setProducts: React.Dispatch<React.SetStateAction<AccountProduct[]>>;
  initialTab?: 'chat' | 'generator';
}

export const AdminCopilotModal: React.FC<AdminCopilotModalProps> = ({
  isOpen,
  onClose,
  products,
  setProducts,
  initialTab = 'chat',
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'chat' | 'generator'>(initialTab);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your Bodia Tech AI Store Manager Copilot powered by Google Gemini SDK with live multi-model failover (gemini-3.8-flash ➔ gemini-3.1-flash-lite ➔ gemini-flash-latest).\n\nI have real-time visibility into your ${products.length} SKUs and ${products.reduce((acc, p) => acc + p.stockCount, 0)} total stock units. Ask me to analyze sales margins, craft new inventory listings, or adjust pricing across platforms.`,
      timestamp: new Date().toISOString(),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listing Generator form state
  const [generatorBrief, setGeneratorBrief] = useState('');
  const [generatorPlatform, setGeneratorPlatform] = useState('Instagram');
  const [generatorCategory, setGeneratorCategory] = useState('social-media-messaging');
  const [isGeneratingListing, setIsGeneratingListing] = useState(false);
  const [generatedListings, setGeneratedListings] = useState<AccountProduct[] | null>(null);
  const [listingSuccessMsg, setListingSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendCopilotMessage(userText, [...messages, userMsg]);
      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `Failover alert: ${err.message || 'Error communicating with Gemini models.'}`,
          timestamp: new Date().toISOString(),
          modelUsed: 'failover-handled',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute an interactive action proposed by Gemini
  const handleExecuteAction = async (action: CopilotAction) => {
    setActionStatus((prev) => ({ ...prev, [action.id]: 'loading' }));

    try {
      if (action.type === 'adjust_prices') {
        const delta = action.payload?.delta || 1.0;
        const res = await adjustGlobalMargin(delta);
        if (res.success) {
          setProducts(res.products);
          setActionStatus((prev) => ({ ...prev, [action.id]: 'applied' }));
        }
      } else if (action.type === 'create_product') {
        const newProd: AccountProduct = action.payload;
        const saved = await saveProduct(newProd);
        setProducts((prev) => [saved, ...prev]);
        setActionStatus((prev) => ({ ...prev, [action.id]: 'applied' }));
      } else if (action.type === 'restock_item') {
        const { productId, addStock } = action.payload;
        const prod = products.find((p) => p.id === productId);
        if (prod) {
          const updated = { ...prod, stockCount: prod.stockCount + (addStock || 50) };
          await saveProduct(updated);
          setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
          setActionStatus((prev) => ({ ...prev, [action.id]: 'applied' }));
        }
      } else {
        setActionStatus((prev) => ({ ...prev, [action.id]: 'applied' }));
      }
    } catch (err: any) {
      alert(`Action execution failed: ${err.message}`);
      setActionStatus((prev) => ({ ...prev, [action.id]: 'failed' }));
    }
  };

  // Generate Listing via dedicated 1-Click Form
  const handleGenerateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatorBrief.trim() || isGeneratingListing) return;

    setIsGeneratingListing(true);
    setGeneratedListings(null);
    setListingSuccessMsg(null);

    try {
      const result = await generateBulkAiListings(generatorBrief, generatorPlatform, generatorCategory);
      setGeneratedListings(result);
    } catch (err: any) {
      alert(`Listing generation failed: ${err.message}`);
    } finally {
      setIsGeneratingListing(false);
    }
  };

  const handleApplyGeneratedListings = async () => {
    if (!generatedListings || generatedListings.length === 0) return;
    try {
      const savedProducts: AccountProduct[] = [];
      for (const listing of generatedListings) {
        const saved = await saveProduct(listing);
        savedProducts.push(saved);
      }
      setProducts((prev) => [...savedProducts, ...prev]);
      setListingSuccessMsg(`Successfully created ${savedProducts.length} listings! They are now live on your storefront.`);
      setGeneratedListings(null);
      setGeneratorBrief('');
    } catch (err: any) {
      alert(`Failed to save listings: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl flex flex-col h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-purple-600 text-white shadow-md shadow-[0_0_15px_rgba(225,29,72,0.3)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Gemini AI Store Manager Copilot</h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">
                  @google/genai SDK
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Failover Chain: gemini-3.8-flash ➔ gemini-3.1-flash-lite ➔ gemini-flash-latest</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-header Tabs */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800/80 flex items-center gap-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Operational Copilot Chat
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'generator'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Bulk AI Listing Generator
          </button>
        </div>

        {/* TAB 1: COPILOT CHAT & ACTION EXECUTION */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>{isUser ? 'Administrator' : 'Gemini Copilot'}</span>
                      {msg.modelUsed && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {msg.modelUsed}
                        </span>
                      )}
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-rose-600 text-white font-medium rounded-br-none shadow-md shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                          : 'bg-slate-900 border border-slate-800/80 text-slate-200 rounded-bl-none shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content.replace(/```json[\s\S]*?```/, '')}</div>

                      {/* Interactive Propose Action Execution Framework */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            Actionable Proposals:
                          </div>

                          {msg.actions.map((act) => {
                            const status = actionStatus[act.id];
                            return (
                              <div
                                key={act.id}
                                className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                              >
                                <div>
                                  <div className="font-bold text-white">{act.title}</div>
                                  <div className="text-slate-400 text-[11px]">{act.description}</div>
                                </div>

                                <div>
                                  {status === 'applied' ? (
                                    <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-xs flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Applied!
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleExecuteAction(act)}
                                      disabled={status === 'loading'}
                                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center gap-1.5 transition cursor-pointer"
                                    >
                                      {status === 'loading' ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      )}
                                      <span>Apply to Store</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 p-3 rounded-2xl w-fit border border-slate-800/80">
                  <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                  <span>Gemini is synthesizing catalog state and optimizing margins...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-4 py-2 bg-slate-900 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-500 shrink-0">Quick prompts:</span>
              <button
                onClick={() => setInputMessage('Analyze low-stock items and suggest optimal restocking numbers')}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800/80 text-slate-300 hover:text-white shrink-0 cursor-pointer"
              >
                Analyze Low Stock
              </button>
              <button
                onClick={() => setInputMessage('Propose a +$1.00 margin increase on high-demand Facebook accounts')}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800/80 text-slate-300 hover:text-white shrink-0 cursor-pointer"
              >
                Increase Facebook Margins (+$1.00)
              </button>
              <button
                onClick={() => setInputMessage('Generate a new product listing for aged 2017 TikTok Creator accounts')}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800/80 text-slate-300 hover:text-white shrink-0 cursor-pointer"
              >
                Create Aged TikTok SKU
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800/80 flex gap-2">
              <input
                type="text"
                placeholder="Ask Gemini Store Copilot (e.g., 'What are our top revenue SKUs?', 'Propose a promotion strategy')..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center gap-1.5 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: 1-CLICK AI LISTING GENERATOR */}
        {activeTab === 'generator' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-950">
            <div className="max-w-2xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                1-Click AI Marketplace Listing Generator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter a raw brief for any account type. Gemini creates full technical specs, warmup attributes, delivery format schema, and bulk pricing tiers instantly.
              </p>
            </div>

            {listingSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs flex items-center justify-between">
                <span>{listingSuccessMsg}</span>
                <button onClick={() => setListingSuccessMsg(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>
            )}

            <form onSubmit={handleGenerateListing} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Listing Brief or Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Aged 2016 Instagram Accounts with 2,500 organic tech followers, organic DM history, phone verified, 72h replacement guarantee."
                  value={generatorBrief}
                  onChange={(e) => setGeneratorBrief(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Platform
                  </label>
                  <input
                    type="text"
                    value={generatorPlatform}
                    onChange={(e) => setGeneratorPlatform(e.target.value)}
                    placeholder="Instagram / Facebook / X / Discord"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={generatorCategory}
                    onChange={(e) => setGeneratorCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-white"
                  >
                    <option value="social-media-messaging">Social Media & Messaging</option>
                    <option value="email-services">Email Services & Leads</option>
                    <option value="ecommerce-professional">E-Commerce & Professional</option>
                    <option value="google-ecosystem">Google Ecosystem & Video</option>
                    <option value="proxies-vps-software">Proxies, VPS, Software & Gaming</option>
                    <option value="gift-cards-financial">Gift Cards & Financial Cards</option>
                    <option value="subscriptions-ai">Subscriptions, AI & Premium Apps</option>
                    <option value="reviews-local">Reviews & Local Business</option>
                    <option value="dating">Dating Platforms</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGeneratingListing || !generatorBrief.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-red-500 text-white font-bold text-xs shadow-lg shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center gap-2 transition cursor-pointer"
              >
                {isGeneratingListing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini is generating specs & schema...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Complete Listing</span>
                  </>
                )}
              </button>
            </form>

            {/* Generated Output Preview */}
            {generatedListings && generatedListings.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4 max-w-2xl max-h-[50vh] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                    Generated {generatedListings.length} Listing{generatedListings.length > 1 ? 's' : ''} Preview
                  </span>
                </div>
                
                {generatedListings.map((listing, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-mono text-slate-400">SKU: {listing.id}</div>
                      <div className="font-mono font-bold text-emerald-400 text-sm">
                        ${listing.pricePerUnit.toFixed(2)} USD
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{listing.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{listing.shortDesc}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-center">
                        <div className="text-[10px] text-slate-400">Origin</div>
                        <div className="text-white font-bold">{listing.attributes.country}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-center">
                        <div className="text-[10px] text-slate-400">Vintage</div>
                        <div className="text-white font-bold">Aged {listing.attributes.creationYear}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-center">
                        <div className="text-[10px] text-slate-400">Stock</div>
                        <div className="text-emerald-400 font-bold">{listing.stockCount} units</div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80 sticky bottom-0 bg-slate-900 p-2">
                  <button
                    onClick={() => setGeneratedListings(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleApplyGeneratedListings}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Insert All Directly into Storefront</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
