/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  AccountProduct,
  CartItem,
  PlacedOrder,
  ProductCategory,
  ServiceInquiry,
  SupportConfig,
  UserProfile,
} from './types/index.ts';
import {
  fetchProducts,
  fetchOrders,
  fetchInquiries,
  fetchSupportConfig,
  fetchUserProfile,
} from './utils/api.ts';
import { initializeVersionedCache } from './utils/storageSync.ts';
import {
  GoogleAuthUser,
  getStoredAuthUser,
  saveStoredAuthUser,
  createGoogleUserFromEmail,
} from './utils/auth.ts';
import {
  auth,
  onAuthStateChanged,
  syncUserWithFirestore,
  checkIsAdmin,
  saveOrderToFirestore,
  saveProductToFirestore,
} from './firebase.ts';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { CatalogFilterBar } from './components/CatalogFilterBar.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AdminCopilotModal } from './components/AdminCopilotModal.tsx';
import { AgencyServicesHub } from './components/AgencyServicesHub.tsx';
import { LoginPage } from './components/LoginPage.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { FloatingCustomerCare } from './components/FloatingCustomerCare.tsx';
import { GoogleAuthModal } from './components/GoogleAuthModal.tsx';
import { Footer } from './components/Footer.tsx';
import { Lock, ShieldAlert, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function App() {
  // Authentication state (Synced with Firebase Auth + Firestore)
  // Normal visitors start unauthenticated: Admin bar is completely UNSEEN until ballakparank08@gmail.com logs in
  const [authUser, setAuthUser] = useState<GoogleAuthUser | null>(() => {
    return getStoredAuthUser();
  });
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);

  // Navigation & View state - defaults to modern glassmorphism Landing Page
  const [currentTab, setCurrentTab] = useState<'home' | 'store' | 'agency' | 'admin' | 'login'>('home');

  // Core Data state
  const [products, setProducts] = useState<AccountProduct[]>([]);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [inquiries, setInquiries] = useState<ServiceInquiry[]>([]);
  const [supportConfig, setSupportConfig] = useState<SupportConfig>({
    telegramHandle: '@BodiaTechSupport',
    telegramUrl: 'https://t.me/BodiaTechSupport',
    whatsAppNumber: '+1 (555) 263-4283',
    whatsAppUrl: 'https://wa.me/15552634283',
    supportEmail: 'support@bodiatech.io',
    operatingHours: '24/7/365 — Automated Dispatch',
    warrantyPolicy: '48h replacement warranty on checkpoint failures.',
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'usr-client-2026',
    name: 'Julian Vance Media',
    email: 'media.buyer.pro@gmail.com',
    role: 'customer',
  });

  // Storefront Filtering & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'stock' | 'vintage'>('featured');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals state
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<AccountProduct | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscountPercent, setCheckoutDiscountPercent] = useState(0);
  const [completedOrder, setCompletedOrder] = useState<PlacedOrder | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialTab, setCopilotInitialTab] = useState<'chat' | 'generator'>('chat');
  const [prefillTicketOrderId, setPrefillTicketOrderId] = useState<string | undefined>(undefined);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const isAdmin = checkIsAdmin(fbUser.email);
        const profile = await syncUserWithFirestore(fbUser);
        const userObj: GoogleAuthUser = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          avatar: fbUser.photoURL || undefined,
          isAdmin,
          provider: 'google',
        };
        setAuthUser(userObj);
        saveStoredAuthUser(userObj);
        setUserProfile(profile);
      }
    });
    return () => unsubscribe();
  }, []);

  // Initialize data and versioned cache migration on mount
  useEffect(() => {
    const cached = initializeVersionedCache();
    if (cached.products.length > 0) {
      setProducts(cached.products);
    }
    if (cached.user) {
      setUserProfile(cached.user);
    }

    // Fetch live from server
    fetchProducts().then(setProducts).catch(console.error);
    fetchOrders().then(setOrders).catch(console.error);
    fetchInquiries().then(setInquiries).catch(console.error);
    fetchSupportConfig().then(setSupportConfig).catch(console.error);
    fetchUserProfile().then(setUserProfile).catch(console.error);
  }, []);

  const handleLoginSuccess = (user: GoogleAuthUser) => {
    setAuthUser(user);
    saveStoredAuthUser(user);
  };

  const handleLogout = () => {
    setAuthUser(null);
    saveStoredAuthUser(null);
    if (currentTab === 'admin') {
      setCurrentTab('store');
    }
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Platform filter
        if (selectedPlatform && p.platform.toLowerCase() !== selectedPlatform.toLowerCase()) {
          return false;
        }
        // Category filter
        if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        // In-stock filter
        if (inStockOnly && p.stockCount <= 0) {
          return false;
        }
        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchPlatform = p.platform.toLowerCase().includes(q);
          const matchDesc = p.shortDesc.toLowerCase().includes(q);
          const matchCountry = p.attributes.country.toLowerCase().includes(q);
          const matchYear = p.attributes.creationYear.includes(q);
          const matchFormat = p.deliveryFormat.toLowerCase().includes(q);
          if (!matchName && !matchPlatform && !matchDesc && !matchCountry && !matchYear && !matchFormat) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerUnit - b.pricePerUnit;
        if (sortBy === 'price-desc') return b.pricePerUnit - a.pricePerUnit;
        if (sortBy === 'stock') return b.stockCount - a.stockCount;
        if (sortBy === 'vintage') return parseInt(a.attributes.creationYear, 10) - parseInt(b.attributes.creationYear, 10);
        return 0;
      });
  }, [products, selectedPlatform, selectedCategory, inStockOnly, searchQuery, sortBy]);

  // Cart operations
  const handleAddToCart = (product: AccountProduct, quantity: number) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        const newQty = Math.min(product.stockCount, updated[idx].quantity + quantity);
        updated[idx] = { ...updated[idx], quantity: newQty };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = (discountPercent: number) => {
    setCheckoutDiscountPercent(discountPercent);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder: PlacedOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Save to Firestore backend as well
    saveOrderToFirestore(newOrder, authUser?.id);
    // Refresh products to reflect decremented stock
    fetchProducts().then(setProducts).catch(console.error);
    // Clear cart & show completed order confirmation
    setCartItems([]);
    setCompletedOrder(newOrder);
  };

  const handleBuyNowDirect = (product: AccountProduct, quantity: number) => {
    setCartItems([{ product, quantity }]);
    setIsCheckoutOpen(true);
  };

  const totalCartUnits = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070c18] via-[#091124] to-[#0c1630] text-slate-100 flex flex-col selection:bg-rose-500/30 selection:text-white pb-20 md:pb-0 relative overflow-hidden">
      {/* Header with Google Login and Role-Guarded Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={totalCartUnits}
        openCart={() => setIsCartOpen(true)}
        openCopilot={() => {
          if (authUser?.isAdmin) {
            setCopilotInitialTab('chat');
            setIsCopilotOpen(true);
          } else {
            setCurrentTab('login');
          }
        }}
        userProfile={userProfile}
        authUser={authUser}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
      />

      {/* Main Content Areas based on selected Tab */}
      <main className="flex-1 pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 pb-12 w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-[1300px] bg-slate-900/60 backdrop-blur-[24px] border border-slate-800/80 rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden relative z-10"
          >
            {/* Ambient Gradients for the global Glass Container */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none z-0" />

            <div className="relative z-10 w-full h-full">
              {/* TAB 0: MODERN GLASSMORPHISM LANDING PAGE */}
              {currentTab === 'home' && (
                <LandingPage
            onNavigateToServices={() => {
              setCurrentTab('agency');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToStore={() => {
              setCurrentTab('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenProductQuickView={(productId) => {
              const found = products.find((p) => p.id === productId);
              if (found) setSelectedProductForDetail(found);
            }}
          />
        )}

        {/* TAB 1: STOREFRONT */}
        {currentTab === 'store' && (
          <div>
            {/* Hero Banner */}
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              onExploreAgency={() => setCurrentTab('agency')}
            />

            {/* Catalog Filter Bar */}
            <CatalogFilterBar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalCount={filteredProducts.length}
            />

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/80">
                  <p className="text-base font-semibold text-slate-300">No inventory matches your active filter.</p>
                  <p className="text-xs text-slate-500 mt-1">Try resetting your platform or category selector.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedPlatform('');
                      setSelectedCategory('all');
                      setInStockOnly(false);
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 shadow-[0_0_15px_rgba(225,29,72,0.4)] text-white text-xs font-bold cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onQuickView={(p) => setSelectedProductForDetail(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AGENCY SERVICES HUB */}
        {currentTab === 'agency' && (
          <AgencyServicesHub
            onInquirySubmitted={(inq) => setInquiries((prev) => [inq, ...prev])}
            onSelectPlatform={(platform) => {
              setSelectedPlatform(platform);
              setCurrentTab('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 3: DEDICATED GOOGLE LOGIN & FIREBASE AUTH PAGE */}
        {currentTab === 'login' && (
          <LoginPage
            currentUser={authUser}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onNavigateToStore={() => setCurrentTab('store')}
            onNavigateToAdmin={() => setCurrentTab('admin')}
          />
        )}

        {/* TAB 5: ADMIN & INVENTORY (ONLY ACCESSIBLE BY ballakparank08@gmail.com) */}
        {currentTab === 'admin' && (
          authUser?.isAdmin ? (
            <AdminDashboard
              products={products}
              setProducts={setProducts}
              orders={orders}
              setOrders={setOrders}
              inquiries={inquiries}
              setInquiries={setInquiries}
              supportConfig={supportConfig}
              setSupportConfig={setSupportConfig}
              openAiListingGenerator={() => {
                setCopilotInitialTab('generator');
                setIsCopilotOpen(true);
              }}
            />
          ) : (
            /* Restricted Access Gate Screen when unauthorized */
            <div className="max-w-xl mx-auto px-4 pt-32 pb-20 mt-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-400 flex items-center justify-center mx-auto shadow-xl shadow-rose-950/40">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                  Access Restricted
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                  Authorized Administrator Only
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  The Admin & Inventory Management Dashboard and the Gemini AI Copilot are strictly restricted. You must sign in using your authorized Google account (<strong>ballakparank08@gmail.com</strong>).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 text-xs text-slate-300 text-left flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-white mb-0.5">Authorization Rule:</strong>
                  Only authenticated sessions matching <code>ballakparank08@gmail.com</code> are granted permissions to edit catalogs, adjust global margins, ingest batches, or prompt the AI Copilot.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentTab('login')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                  </svg>
                  <span>Open Google Login Page</span>
                </button>

                <button
                  onClick={() => setCurrentTab('store')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Return to Storefront</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Customer Care Desk */}
      <FloatingCustomerCare
        supportConfig={supportConfig}
        prefillTicketOrderId={prefillTicketOrderId}
      />

      {/* Modals */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNowDirect}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        promoDiscountPercent={checkoutDiscountPercent}
        userProfile={userProfile}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Order Confirmation Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-600 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-950/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-mono font-bold tracking-wider uppercase">
                Order Pending Confirmation
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-2.5">
                Thank You for Your Order!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Order Reference: <strong className="text-white font-mono">{completedOrder.id}</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-2 text-left">
              <div className="flex justify-between border-b border-[#152243] pb-2">
                <span className="text-slate-400">Recipient Email:</span>
                <strong className="text-white">{completedOrder.customerEmail}</strong>
              </div>
              <div className="flex justify-between border-b border-[#152243] pb-2">
                <span className="text-slate-400">Total Amount:</span>
                <span className="font-mono text-emerald-400 font-bold">${completedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-[#152243] pb-2">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="uppercase text-slate-300 font-mono font-semibold">{completedOrder.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-400">
                Items: {completedOrder.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-amber-800/80 text-[11px] text-amber-400/90 text-left">
              Your order is currently pending payment. An administrator will contact you shortly to confirm your order and provide the {completedOrder.paymentMethod === 'usdt_trc20' ? 'USDT TRC20 Address' : completedOrder.paymentMethod === 'qr_rupiah' ? 'QR Code Rupiah' : 'QR Code USD-kh'} for payment.
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCompletedOrder(null)}
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[0_0_15px_rgba(225,29,72,0.3)] transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Copilot Modal: ONLY RENDERED/OPENED IF AUTHORIZED ADMIN */}
      {authUser?.isAdmin && (
        <AdminCopilotModal
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          products={products}
          setProducts={(prods) => {
            setProducts(prods);
          }}
          initialTab={copilotInitialTab}
        />
      )}

      {/* Quick Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        currentUser={authUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </div>
  );
}
