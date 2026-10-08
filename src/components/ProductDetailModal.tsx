import React, { useState } from 'react';
import { AccountProduct } from '../types/index.ts';
import { X, ShieldCheck, Check, ShoppingCart, Globe, Lock, Smartphone, Cookie, Terminal } from 'lucide-react';

interface ProductDetailModalProps {
  product: AccountProduct | null;
  onClose: () => void;
  onAddToCart: (product: AccountProduct, quantity: number) => void;
  onBuyNow: (product: AccountProduct, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const [qty, setQty] = useState<number>(product.minPurchase || 1);

  // Dynamic bulk discount calculation
  let discountPercent = 0;
  if (product.bulkPricing && product.bulkPricing.length > 0) {
    for (const tier of product.bulkPricing) {
      if (qty >= tier.minQty && tier.discountPercent > discountPercent) {
        discountPercent = tier.discountPercent;
      }
    }
  }
  const effectiveUnitPrice = Math.round(product.pricePerUnit * (1 - discountPercent / 100) * 100) / 100;
  const totalPrice = Math.round(effectiveUnitPrice * qty * 100) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                {product.platform}
              </span>
              <span className="text-xs font-mono text-slate-400">SKU: {product.id}</span>
              {/* Removed vault stock indicator */}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {product.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Technical specifications description */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Technical Description & Warmup Profile</h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800/80">
              {product.fullDesc}
            </p>
          </div>

          {/* Account Attributes Matrix */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2.5">Origin & Trust Metrics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Country Origin</div>
                  <div className="font-semibold text-white">{product.attributes.country}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">PVA Status</div>
                  <div className="font-semibold text-white">{product.attributes.isPVA ? 'Phone Verified' : 'Standard'}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">2FA Security</div>
                  <div className="font-semibold text-white">{product.attributes.has2FA ? 'TOTP Secret Key' : 'Standard Password'}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-2.5">
                <Cookie className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Cookies Included</div>
                  <div className="font-semibold text-white">{product.attributes.hasCookies ? 'JSON / Netscape' : 'No'}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Warmup Status</div>
                  <div className="font-semibold text-white">{product.attributes.warmupStatus}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Warranty Window</div>
                  <div className="font-semibold text-white">{product.attributes.warrantyHours} Hours Checkpoint</div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Format breakdown */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Automated Delivery Token Structure</h4>
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800/80 font-mono text-xs">
              <div className="text-slate-400 text-[11px] mb-1">Delivered Line Format:</div>
              <div className="text-red-300 font-bold break-all bg-slate-900 p-2 rounded border border-slate-800/80">
                {product.deliveryFormat}
              </div>
              <div className="mt-2 text-slate-400 text-[11px]">Delivery Sample:</div>
              <div className="text-slate-300 text-[11px] break-all bg-slate-900 p-2 rounded border border-slate-800/80 mt-0.5">
                {product.deliveryFormatExample}
              </div>
            </div>
          </div>

          {/* Bulk Tier Discount Table */}
          {product.bulkPricing && product.bulkPricing.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Tiered Bulk Discounts</h4>
              <div className="grid grid-cols-3 gap-2">
                {product.bulkPricing.map((tier) => (
                  <div
                    key={tier.minQty}
                    className={`p-2.5 rounded-xl text-center border text-xs ${
                      qty >= tier.minQty
                        ? 'bg-red-950/60 border-rose-500/60 text-white'
                        : 'bg-slate-900 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="font-bold">{tier.minQty}+ Accounts</div>
                    <div className="text-rose-400 font-semibold">{tier.discountPercent}% Discount</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      ${(product.pricePerUnit * (1 - tier.discountPercent / 100)).toFixed(2)}/ea
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Usage in Anti-detect browsers */}
          <div className="bg-blue-950/30 border border-blue-900/50 p-4 rounded-xl text-xs text-blue-200">
            <strong className="text-blue-300 block mb-1">Anti-Detect Browser Integration Tips:</strong>
            Import cookie JSON directly into Dolphin{'{anty}'} or AdsPower profiles. Always match the residential proxy geolocation to <strong>{product.attributes.country}</strong> before entering credentials to protect profile vintage score.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            {/* Quantity */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800/80 p-1">
              <button
                onClick={() => setQty((prev) => Math.max(product.minPurchase || 1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white font-bold"
              >
                -
              </button>
              <span className="w-10 text-center font-mono text-sm font-bold text-white">{qty}</span>
              <button
                onClick={() => setQty((prev) => Math.min(product.stockCount, prev + 1))}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white font-bold"
              >
                +
              </button>
            </div>

            <div>
              <div className="text-xs text-slate-400">Total Price:</div>
              <div className="text-xl font-black text-white font-mono">
                ${totalPrice.toFixed(2)}
                {discountPercent > 0 && (
                  <span className="ml-2 text-xs text-emerald-400 font-semibold">(-{discountPercent}%)</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onAddToCart(product, qty);
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-900 border border-slate-800/80 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>

            <button
              onClick={() => {
                onBuyNow(product, qty);
                onClose();
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Check className="w-4 h-4" />
              Instant Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
