import React, { useState } from 'react';
import { AccountProduct } from '../types/index.ts';
import { ShieldCheck, Cookie, Smartphone, Lock, Eye, ShoppingCart, Check, Globe } from 'lucide-react';

interface ProductCardProps {
  product: AccountProduct;
  onAddToCart: (product: AccountProduct, quantity: number) => void;
  onQuickView: (product: AccountProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
}) => {
  const [qty, setQty] = useState<number>(product.minPurchase || 1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Calculate dynamic bulk pricing
  const calculateEffectiveUnitPrice = (quantity: number): { unitPrice: number; discountPercent: number } => {
    let bestDiscount = 0;
    if (product.bulkPricing && product.bulkPricing.length > 0) {
      for (const tier of product.bulkPricing) {
        if (quantity >= tier.minQty && tier.discountPercent > bestDiscount) {
          bestDiscount = tier.discountPercent;
        }
      }
    }
    const finalPrice = Math.round(product.pricePerUnit * (1 - bestDiscount / 100) * 100) / 100;
    return { unitPrice: finalPrice, discountPercent: bestDiscount };
  };

  const { unitPrice: currentUnitPrice, discountPercent } = calculateEffectiveUnitPrice(qty);
  const isOutOfStock = product.stockCount === 0;
  const isLowStock = product.stockCount > 0 && product.stockCount < 20;

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, qty);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 hover:border-rose-500/50 p-5 transition-all duration-200 hover:shadow-xl hover:shadow-[0_0_20px_rgba(225,29,72,0.15)]">
      <div>
        {/* Top meta tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Platform Tag */}
            <span className="px-2.5 py-0.5 rounded-md bg-slate-800/50 border border-slate-700 text-white font-bold text-xs">
              {product.platform}
            </span>

            {/* Vintage Year */}
            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-slate-300 text-xs font-mono">
              Aged {product.attributes.creationYear}
            </span>
          </div>

          {/* Stock Status Badge */}
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/80 text-rose-400 border border-rose-800">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80 animate-pulse">
              Low Stock: {product.stockCount} left
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
              {product.stockCount} in Vault
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onQuickView(product)}
          className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
        >
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
          {product.shortDesc}
        </p>

        {/* Spec badges grid */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          {/* Origin Country */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/50 text-slate-300 border border-slate-700">
            <Globe className="w-3 h-3 text-blue-400" />
            {product.attributes.country}
          </span>

          {/* PVA */}
          {product.attributes.isPVA && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/50">
              <Smartphone className="w-3 h-3 text-emerald-400" />
              PVA
            </span>
          )}

          {/* 2FA */}
          {product.attributes.has2FA && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-800/50">
              <Lock className="w-3 h-3 text-blue-400" />
              2FA Seed
            </span>
          )}

          {/* Cookies */}
          {product.attributes.hasCookies && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800/50">
              <Cookie className="w-3 h-3 text-amber-400" />
              Cookies
            </span>
          )}

          {/* Warranty hours */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-800/50">
            <ShieldCheck className="w-3 h-3 text-rose-400" />
            {product.attributes.warrantyHours}h Warranty
          </span>
        </div>

        {/* Delivery format schema snippet */}
        <div className="mt-3 p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span className="text-slate-500">Format:</span>
          <span className="text-red-300 truncate ml-2 font-medium" title={product.deliveryFormat}>
            {product.deliveryFormat}
          </span>
        </div>
      </div>

      {/* Bottom Area: Dynamic Bulk Pricing Calculator & Purchase Action */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        {/* Dynamic bulk discount matrix preview */}
        {product.bulkPricing && product.bulkPricing.length > 0 && (
          <div className="mb-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Bulk Savings Tier:</span>
            <div className="flex items-center gap-1 text-[10px]">
              {product.bulkPricing.map((tier) => (
                <span
                  key={tier.minQty}
                  className={`px-1.5 py-0.5 rounded ${
                    qty >= tier.minQty
                      ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold shadow-[0_0_10px_rgba(225,29,72,0.3)]'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700'
                  }`}
                >
                  {tier.minQty}+: -{tier.discountPercent}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price & Quantity Selector */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white font-mono">
                ${currentUnitPrice.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-normal">/ unit</span>
            </div>

            {discountPercent > 0 && (
              <div className="text-[11px] text-emerald-400 font-medium">
                Save {discountPercent}% (${(product.pricePerUnit * qty - currentUnitPrice * qty).toFixed(2)})
              </div>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800/80 p-0.5">
            <button
              onClick={() => setQty((prev) => Math.max(product.minPurchase || 1, prev - 1))}
              disabled={qty <= (product.minPurchase || 1)}
              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              value={qty}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  setQty(Math.max(product.minPurchase || 1, Math.min(product.stockCount || 100, val)));
                }
              }}
              min={product.minPurchase || 1}
              max={product.maxPurchase || 100}
              className="w-10 text-center bg-transparent text-white font-mono text-xs outline-none"
            />
            <button
              onClick={() => setQty((prev) => Math.min(product.maxPurchase || 100, prev + 1))}
              disabled={qty >= (product.stockCount || 100)}
              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Specs
          </button>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : addedAnimation
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-[0_0_10px_rgba(225,29,72,0.4)] hover:shadow-[0_0_15px_rgba(225,29,72,0.6)]'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Add (${(currentUnitPrice * qty).toFixed(2)})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
