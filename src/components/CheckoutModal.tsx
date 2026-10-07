import React, { useState } from 'react';
import { CartItem, UserProfile, PlacedOrder } from '../types/index.ts';
import { placeOrder } from '../utils/api.ts';
import { X, ShieldCheck, Zap, Wallet, CreditCard, Copy, Check, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  promoDiscountPercent: number;
  userProfile: UserProfile;
  onOrderCompleted: (order: PlacedOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  promoDiscountPercent,
  userProfile,
  onOrderCompleted,
}) => {
  if (!isOpen || items.length === 0) return null;

  const [customerEmail, setCustomerEmail] = useState(userProfile.email || 'buyer@agencygrowth.com');
  const [paymentMethod, setPaymentMethod] = useState<'usdt_trc20' | 'qr_rupiah' | 'qr_usd_kh'>('usdt_trc20');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calculate order total
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

  const discountAmount = Math.round((subtotal * promoDiscountPercent) / 100 * 100) / 100;
  const finalTotal = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

  const usdtDepositAddress = usdtNetwork === 'TRC20'
    ? 'TXb9LzF8yPq7kM3j4N2V1sA0wR9eDtK6hB'
    : '0x71C...B9aF4932014B7012Da';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(usdtDepositAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleProcessOrder = async () => {
    if (!customerEmail || !customerEmail.includes('@')) {
      setErrorMsg('Please enter a valid recipient email for your credential vault receipt.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const orderPayload = {
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        customerEmail,
        paymentMethod,
      };

      const res = await placeOrder(orderPayload);
      if (res.success && res.order) {
        onOrderCompleted(res.order);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-white">Instant Checkout & Provisioning</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Recipient Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Recipient Email (Receipt & Delivery Backup)
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="buyer@agency.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Official invoice and delivery confirmation receipt are dispatched directly to this email.
            </span>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Payment Gateway
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Crypto USDT TRC20 */}
              <button
                type="button"
                onClick={() => setPaymentMethod('usdt_trc20')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition cursor-pointer ${
                  paymentMethod === 'usdt_trc20'
                    ? 'bg-rose-600/20 border-rose-500 text-white shadow-md'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className="font-bold text-emerald-400 text-sm">USDT</span>
                <span>TRC20 Only</span>
              </button>

              {/* QR Rupiah */}
              <button
                type="button"
                onClick={() => setPaymentMethod('qr_rupiah')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition cursor-pointer ${
                  paymentMethod === 'qr_rupiah'
                    ? 'bg-rose-600/20 border-rose-500 text-white shadow-md'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className="font-bold text-blue-400 text-sm">QRIS</span>
                <span>QR Rupiah</span>
              </button>

              {/* QR USD-KH */}
              <button
                type="button"
                onClick={() => setPaymentMethod('qr_usd_kh')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition cursor-pointer ${
                  paymentMethod === 'qr_usd_kh'
                    ? 'bg-rose-600/20 border-rose-500 text-white shadow-md'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className="font-bold text-amber-400 text-sm">KHQR</span>
                <span>QR USD-KH</span>
              </button>
            </div>
          </div>

          {/* Payment Details Panel */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-amber-500/30 text-xs text-slate-300 space-y-2">
            <div className="text-amber-400 font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Pending Admin Confirmation
            </div>
            <p>
              Your order will be placed in a pending state. Please wait for an administrator to confirm the order and provide the exact payment address/QR code for your selected gateway.
            </p>
          </div>

          {/* Order Summary breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1.5">
            <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider mb-1">
              Order Items Summary ({items.length} SKUs)
            </div>
            {items.map((i) => (
              <div key={i.product.id} className="flex justify-between text-slate-300">
                <span className="truncate max-w-[280px]">
                  {i.quantity}x {i.product.name}
                </span>
                <span className="font-mono text-white">
                  ${(i.product.pricePerUnit * i.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            {promoDiscountPercent > 0 && (
              <div className="flex justify-between text-emerald-400 pt-1">
                <span>Promo Discount ({promoDiscountPercent}%):</span>
                <span className="font-mono">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800/80">
              <span>Grand Total:</span>
              <span className="font-mono text-rose-400">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Automatic replacement guarantee included under 48h checkpoint window.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleProcessOrder}
            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming Order...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Confirm & Place Order (${finalTotal.toFixed(2)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
