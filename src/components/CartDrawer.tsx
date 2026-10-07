import React, { useState } from 'react';
import { CartItem } from '../types/index.ts';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (appliedDiscountPercent: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Compute item subtotal with item-level bulk pricing
  const subtotal = items.reduce((acc, item) => {
    let unitPrice = item.product.pricePerUnit;
    if (item.product.bulkPricing && item.product.bulkPricing.length > 0) {
      const best = item.product.bulkPricing
        .filter((t) => item.quantity >= t.minQty)
        .sort((a, b) => b.discountPercent - a.discountPercent)[0];
      if (best) {
        unitPrice = Math.round(unitPrice * (1 - best.discountPercent / 100) * 100) / 100;
      }
    }
    return acc + unitPrice * item.quantity;
  }, 0);

  const discountAmount = Math.round((subtotal * promoDiscount) / 100 * 100) / 100;
  const finalTotal = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'BODIA2026' || clean === 'VIPGROWTH' || clean === 'SCALING10') {
      setPromoDiscount(10);
      setPromoMessage('Promo code applied: 10% Extra Discount!');
    } else if (clean === 'FIRSTORDER5') {
      setPromoDiscount(5);
      setPromoMessage('Promo code applied: 5% Extra Discount!');
    } else {
      setPromoDiscount(0);
      setPromoMessage('Invalid coupon code. Try BODIA2026');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border-l border-slate-800/80 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-white">Your Cart</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-mono text-slate-300">
              {items.length} items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-[1.5] text-slate-600 mb-3" />
              <p className="text-base font-semibold text-slate-300">Your cart is empty</p>
              <p className="text-xs text-slate-500 mt-1">Select digital accounts from the storefront to get started.</p>
            </div>
          ) : (
            items.map((item) => {
              // Calculate bulk price for this item
              let unitPrice = item.product.pricePerUnit;
              let discountPct = 0;
              if (item.product.bulkPricing && item.product.bulkPricing.length > 0) {
                const best = item.product.bulkPricing
                  .filter((t) => item.quantity >= t.minQty)
                  .sort((a, b) => b.discountPercent - a.discountPercent)[0];
                if (best) {
                  discountPct = best.discountPercent;
                  unitPrice = Math.round(unitPrice * (1 - best.discountPercent / 100) * 100) / 100;
                }
              }
              const itemTotal = unitPrice * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-white uppercase">
                          {item.product.platform}
                        </span>
                        {discountPct > 0 && (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            Bulk -{discountPct}%
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{item.product.name}</h4>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800/80 p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockCount}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-white text-sm">${itemTotal.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400 font-mono">${unitPrice.toFixed(2)} / ea</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout button */}
        {items.length > 0 && (
          <div className="p-5 bg-slate-950 border-t border-slate-800/80 space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Coupon (e.g. BODIA2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-xs text-white uppercase outline-none focus:border-rose-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer"
              >
                Apply
              </button>
            </form>

            {promoMessage && (
              <div className={`text-xs ${promoDiscount > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {promoMessage}
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount ({promoDiscount}%):</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800/80">
                <span>Total Amount:</span>
                <span className="font-mono text-rose-400">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Instant Delivery Guarantee Note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant token delivery to your Orders Vault immediately after payment.</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClearCart}
                className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={() => onProceedToCheckout(promoDiscount)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
