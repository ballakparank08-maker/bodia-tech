import React, { useState, useEffect } from 'react';
import { AccountProduct, PlacedOrder, ServiceInquiry, SupportConfig, RegisteredUser } from '../types/index.ts';
import { adjustGlobalMargin, ingestBatchStock, saveProduct, deleteProduct, updateOrderStatus, updateSupportConfig, fetchAdminUsers, updateAdminUserStatus } from '../utils/api.ts';
import { fetchRegisteredUsers, updateUserStatusInFirestore, SOLE_ADMIN_EMAIL } from '../firebase.ts';
import {
  Layers,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Check,
  Phone,
  Mail,
  Send,
  Sliders,
  Database,
  FileText,
  Clock,
  Sparkles,
  Search,
  Users,
  UserCheck,
  UserX,
  Shield,
  Copy,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';

interface AdminDashboardProps {
  products: AccountProduct[];
  setProducts: React.Dispatch<React.SetStateAction<AccountProduct[]>>;
  orders: PlacedOrder[];
  setOrders: React.Dispatch<React.SetStateAction<PlacedOrder[]>>;
  inquiries: ServiceInquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<ServiceInquiry[]>>;
  supportConfig: SupportConfig;
  setSupportConfig: React.Dispatch<React.SetStateAction<SupportConfig>>;
  openAiListingGenerator: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  setProducts,
  orders,
  setOrders,
  inquiries,
  setInquiries,
  supportConfig,
  setSupportConfig,
  openAiListingGenerator,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'margin' | 'ingestion' | 'orders' | 'inquiries' | 'support' | 'users'>('inventory');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // User Management State (Single Admin Architecture)
  const [usersList, setUsersList] = useState<RegisteredUser[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isAddingUserModal, setIsAddingUserModal] = useState(false);
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustName, setNewCustName] = useState('');

  // Ingestion form state
  const [ingestProductId, setIngestProductId] = useState<string>(products[0]?.id || '');
  const [rawIngestAccounts, setRawIngestAccounts] = useState<string>('');

  // Product editor modal / state
  const [editingProduct, setEditingProduct] = useState<AccountProduct | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Margin adjustment slider / delta
  const [customMarginDelta, setCustomMarginDelta] = useState<number>(1.00);

  // Analytics Computations
  const totalSkus = products.length;
  const totalUnitsInStock = products.reduce((acc, p) => acc + p.stockCount, 0);
  const lowStockProducts = products.filter((p) => p.stockCount < 20);
  const facebookUnits = products.filter((p) => p.platform === 'Facebook').reduce((acc, p) => acc + p.stockCount, 0);
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  // Handle Global Margin Adjustment
  const handleApplyMargin = async (delta: number) => {
    setLoadingAction(true);
    setStatusMessage(null);
    try {
      const res = await adjustGlobalMargin(delta);
      if (res.success) {
        setProducts(res.products);
        setStatusMessage(res.message);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err: any) {
      setStatusMessage(`Margin update failed: ${err.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  // Handle Batch Ingestion
  const handleBatchIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingestProductId || !rawIngestAccounts.trim()) {
      setStatusMessage('Please select a target product and paste account credential lines.');
      return;
    }

    setLoadingAction(true);
    setStatusMessage(null);
    try {
      const res = await ingestBatchStock(ingestProductId, rawIngestAccounts);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === ingestProductId ? res.product : p))
        );
        setStatusMessage(res.message);
        setRawIngestAccounts('');
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err: any) {
      setStatusMessage(`Ingestion failed: ${err.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Handle Product Save
  const handleSaveProduct = async (product: AccountProduct) => {
    try {
      const saved = await saveProduct(product);
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === saved.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = saved;
          return updated;
        }
        return [saved, ...prev];
      });
      setEditingProduct(null);
      setIsCreatingProduct(false);
      setStatusMessage(`Saved product "${saved.name}" successfully.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this SKU from the storefront?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // User Management System logic
  const loadRegisteredUsers = async () => {
    setLoadingUsers(true);
    try {
      const list = await fetchRegisteredUsers();
      setUsersList(list);
    } catch {
      const fallback = await fetchAdminUsers().catch(() => []);
      if (fallback.length > 0) setUsersList(fallback);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadRegisteredUsers();
  }, []);

  const handleToggleUserStatus = async (user: RegisteredUser) => {
    if (user.email.toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase()) {
      setStatusMessage('Root administrator cannot be suspended.');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await updateUserStatusInFirestore(user.uid, newStatus);
      await updateAdminUserStatus(user.uid, newStatus).catch(() => {});
      setUsersList((prev) =>
        prev.map((u) => (u.uid === user.uid ? { ...u, status: newStatus } : u))
      );
      setStatusMessage(`User "${user.email}" marked as ${newStatus}.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(`Error updating user status: ${err.message}`);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustEmail.trim() || !newCustEmail.includes('@')) {
      alert('Please enter a valid customer email.');
      return;
    }
    const email = newCustEmail.trim().toLowerCase();
    if (email === SOLE_ADMIN_EMAIL.toLowerCase()) {
      alert('This email is the fixed root administrator.');
      return;
    }
    const newCust: RegisteredUser = {
      uid: `usr-${Date.now().toString(36)}`,
      email,
      displayName: newCustName.trim() || email.split('@')[0],
      role: 'customer', // Single admin rule strictly enforced
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: 'Never logged in',
      ordersCount: 0,
      totalSpent: 0,
    };
    setUsersList((prev) => [newCust, ...prev]);
    setIsAddingUserModal(false);
    setNewCustEmail('');
    setNewCustName('');
    setStatusMessage(`Registered new customer "${email}" in Admin Management System.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="w-full h-full space-y-8">
      {/* Top Banner & Analytics Cards */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              Admin Inventory Management & Control
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 uppercase font-mono font-bold">
                ROOT PRIVILEGES
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live inventory monitoring, margin controls, batch parser ingestion, and support management.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if(window.confirm('This will load the 500+ PDF products into the database. Proceed?')) {
                  try {
                    setStatusMessage('Loading 500+ PDF products... This may take a minute.');
                    const { INITIAL_PRODUCTS } = await import('../data/initialProducts.ts');
                    const { saveProduct } = await import('../utils/api.ts');
                    for (const p of INITIAL_PRODUCTS) {
                      await saveProduct(p);
                    }
                    setStatusMessage('Successfully loaded 500+ PDF products!');
                    window.location.reload();
                  } catch (e: any) {
                    alert('Error saving products: ' + e.message);
                    setStatusMessage(null);
                  }
                }
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer"
            >
              <Database className="w-4 h-4 inline mr-2" />
              Load PDF Products
            </button>
            <button
              onClick={openAiListingGenerator}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[0_0_15px_rgba(225,29,72,0.3)] transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              1-Click AI Listing Generator
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Catalog SKUs</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1.5">{totalSkus}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Active listings</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Units in Stock</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1.5">{totalUnitsInStock}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Available for instant delivery</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Low-Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1.5">{lowStockProducts.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">&lt;20 units remaining</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Facebook Stock</span>
              <span className="font-bold text-blue-400 text-xs font-mono">FB</span>
            </div>
            <div className="text-2xl font-black text-blue-400 font-mono mt-1.5">{facebookUnits}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Marketplace & BM units</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Gross Sales Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1.5">${totalRevenue.toFixed(2)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{orders.length} orders settled</div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-slate-800 border-t border-x border-slate-700 text-white border-b-2 border-b-rose-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-400" />
          Catalog Editor ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('margin')}
          className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'margin'
              ? 'bg-slate-800 border-t border-x border-slate-700 text-white border-b-2 border-b-rose-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Global Margin Adjuster
        </button>

        <button
          onClick={() => setActiveTab('ingestion')}
          className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'ingestion'
              ? 'bg-slate-800 border-t border-x border-slate-700 text-white border-b-2 border-b-rose-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4 text-purple-400" />
          Batch Stock Ingest Parser
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-slate-800 border-t border-x border-slate-700 text-white border-b-2 border-b-rose-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          Orders Manager ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'inquiries'
              ? 'bg-slate-800 border-t border-x border-slate-700 text-white border-b-2 border-b-rose-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Send className="w-4 h-4 text-cyan-400" />
          Agency Leads ({inquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'support'
              ? 'bg-slate-800 border-t border-x border-slate-700 text-white border-b-2 border-b-rose-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Phone className="w-4 h-4 text-rose-400" />
          Support Config
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-slate-800 border-t border-x border-slate-700 text-white border-b-2 border-b-rose-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          Users & Admin System ({usersList.length})
        </button>
      </div>

      {/* TAB 1: INVENTORY & CATALOG */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-800/80">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter catalog by SKU, name, or platform..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-white outline-none focus:border-rose-500"
              />
            </div>

            <button
              onClick={() => {
                setIsCreatingProduct(true);
                setEditingProduct({
                  id: `bt-custom-${Date.now().toString(36)}`,
                  name: 'New Premium Account Listing',
                  platform: 'Facebook',
                  category: 'social-media-messaging',
                  shortDesc: 'Handcrafted verified accounts with full warranty.',
                  fullDesc: 'Aged profiles created with residential IPs, PVA verified.',
                  pricePerUnit: 12.00,
                  stockCount: 50,
                  minPurchase: 1,
                  maxPurchase: 100,
                  deliveryFormat: 'uid:password:2fa_secret:email:email_password',
                  deliveryFormatExample: '10009210491:Pass2026:JBSWY3DPEHPK3PXP:mail@gmail.com:MailPass99',
                  attributes: {
                    country: 'United States',
                    creationYear: '2021',
                    isPVA: true,
                    has2FA: true,
                    hasCookies: true,
                    warmupStatus: 'Organic Farmed',
                    warrantyHours: 48,
                  },
                  bulkPricing: [
                    { minQty: 5, discountPercent: 10 },
                    { minQty: 20, discountPercent: 20 },
                  ],
                });
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New SKU
            </button>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800/80">
                <tr>
                  <th className="py-3 px-4 font-semibold">SKU / Platform</th>
                  <th className="py-3 px-4 font-semibold">Listing Title</th>
                  <th className="py-3 px-4 font-semibold text-right">Price (USD)</th>
                  <th className="py-3 px-4 font-semibold text-center">Stock</th>
                  <th className="py-3 px-4 font-semibold">Origin & Specs</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {products
                  .filter((p) =>
                    !searchFilter ||
                    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                    p.platform.toLowerCase().includes(searchFilter.toLowerCase()) ||
                    p.id.toLowerCase().includes(searchFilter.toLowerCase())
                  )
                  .map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-800/60 transition">
                      <td className="py-3 px-4">
                        <div className="font-mono text-white font-bold">{prod.id}</div>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold">
                          {prod.platform}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-white line-clamp-1">{prod.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">{prod.deliveryFormat}</div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        ${prod.pricePerUnit.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded ${
                            prod.stockCount === 0
                              ? 'bg-rose-950 text-rose-400'
                              : prod.stockCount < 20
                              ? 'bg-amber-950 text-amber-300'
                              : 'bg-emerald-950 text-emerald-400'
                          }`}
                        >
                          {prod.stockCount}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-300">{prod.attributes.country} • Aged {prod.attributes.creationYear}</div>
                        <div className="text-[10px] text-slate-500">
                          {prod.attributes.isPVA ? 'PVA ' : ''}
                          {prod.attributes.has2FA ? '• 2FA ' : ''}
                          {prod.attributes.hasCookies ? '• Cookies' : ''}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          title="Delete SKU"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL MARGIN ADJUSTMENT */}
      {activeTab === 'margin' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 space-y-6 max-w-3xl">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Global Margin & Price Delta Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Section 4.2 Spec: Adjust catalog margins across all SKUs with 1-click. Built-in hard floor protection ensures no product drops below <strong>$0.10</strong>.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleApplyMargin(1.00)}
              disabled={loadingAction}
              className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 border border-emerald-500/50 hover:border-emerald-400 text-left transition cursor-pointer group"
            >
              <div className="text-emerald-400 font-extrabold text-base flex items-center justify-between">
                <span>+$1.00 Each Account Price</span>
                <span className="text-xs bg-emerald-500/20 px-2 py-0.5 rounded font-mono">+1.00 USD</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Increases unit prices across all {products.length} products by $1.00 immediately.
              </p>
            </button>

            <button
              onClick={() => handleApplyMargin(-1.00)}
              disabled={loadingAction}
              className="p-4 rounded-xl bg-gradient-to-r from-rose-950/60 to-rose-900/40 border border-rose-500/50 hover:border-rose-400 text-left transition cursor-pointer group"
            >
              <div className="text-rose-400 font-extrabold text-base flex items-center justify-between">
                <span>-$1.00 Each Account Price</span>
                <span className="text-xs bg-rose-500/20 px-2 py-0.5 rounded font-mono">-1.00 USD</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Applies a global discount of $1.00 to all inventory items (safeguarded by $0.10 minimum floor).
              </p>
            </button>
          </div>

          {/* Custom Delta Input */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Custom Margin Adjustment Delta
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.25"
                value={customMarginDelta}
                onChange={(e) => setCustomMarginDelta(parseFloat(e.target.value) || 0)}
                className="w-36 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-sm text-white outline-none focus:border-rose-500"
              />
              <button
                onClick={() => handleApplyMargin(customMarginDelta)}
                disabled={loadingAction}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold transition shadow-md cursor-pointer"
              >
                Apply Custom Margin ({customMarginDelta >= 0 ? `+` : ``}${customMarginDelta.toFixed(2)})
              </button>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Floor protection active: If current price + delta &lt; $0.10, price is locked at $0.10.
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: BATCH STOCK INGESTION */}
      {activeTab === 'ingestion' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 space-y-6 max-w-3xl">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              Batch Raw Format Stock Ingestion
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Section 4.2 Spec: Paste bulk accounts directly in standard token format (e.g. <code>uid:pass:2fa:email:emailpass</code>). The parser counts and appends new stock automatically.
            </p>
          </div>

          <form onSubmit={handleBatchIngest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Inventory SKU
              </label>
              <select
                value={ingestProductId}
                onChange={(e) => setIngestProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-white outline-none focus:border-rose-500"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900">
                    [{p.platform}] {p.name} (Current Stock: {p.stockCount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Raw Account Credentials (1 per line)
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {rawIngestAccounts.split('\n').filter((l) => l.trim().length > 0).length} lines detected
                </span>
              </div>
              <textarea
                rows={7}
                placeholder="100084920194821:Str0ngP@ss:JBSWY3DPEHPK3PXP:buyer@gmail.com:MailPass&#10;100092104918231:AlphaVortex:HXDMVJECJJWSRB3H:user2@gmail.com:MailPass"
                value={rawIngestAccounts}
                onChange={(e) => setRawIngestAccounts(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={loadingAction}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition cursor-pointer"
            >
              Parse & Ingest Stock
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Review completed customer orders, inspect delivered tokens, and triage warranty claims.
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800/80">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer Email</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold text-right">Total</th>
                  <th className="py-3 px-4 font-semibold">Payment</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {ord.id}
                      <div className="text-[10px] text-slate-500 font-normal">
                        {new Date(ord.createdAt).toLocaleString()}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">{ord.customerEmail}</td>

                    <td className="py-3 px-4">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="line-clamp-1">
                          {i.quantity}x {i.productName}
                        </div>
                      ))}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ${ord.totalAmount.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-400">
                      {ord.paymentMethod.replace('_', ' ')}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-amber-950 text-amber-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {ord.status === 'warranty_review' ? (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                          className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition cursor-pointer"
                        >
                          Resolve & Complete
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'warranty_review')}
                          className="px-2.5 py-1 rounded bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition cursor-pointer"
                        >
                          Flag Warranty
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AGENCY LEADS */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Review incoming bespoke agency project proposals (Telegram bots, custom automation, proxy setups).
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800/80">
              No agency proposals submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-white">{inq.id}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold uppercase">
                      {inq.serviceType.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{inq.clientName}</h4>
                    <div className="text-xs text-slate-400 font-mono">{inq.clientEmail}</div>
                    {inq.telegramHandle && (
                      <div className="text-xs text-blue-400 font-mono">TG: {inq.telegramHandle}</div>
                    )}
                  </div>

                  <div className="text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Scope & Budget: {inq.budget}</div>
                    <div className="mt-1">{inq.details}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                      Status: {inq.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SUPPORT CONFIG */}
      {activeTab === 'support' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 space-y-5 max-w-2xl">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-rose-400" />
              Customer Care Hotline & Channel Setup
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Section 4.2 Spec: Configure 24/7 hotline links, Telegram handle, WhatsApp number, and operating warranty terms.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Telegram Support Handle</label>
              <input
                type="text"
                value={supportConfig.telegramHandle}
                onChange={(e) => setSupportConfig({ ...supportConfig, telegramHandle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">WhatsApp Hotline Number</label>
              <input
                type="text"
                value={supportConfig.whatsAppNumber}
                onChange={(e) => setSupportConfig({ ...supportConfig, whatsAppNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Priority Desk Email</label>
              <input
                type="email"
                value={supportConfig.supportEmail}
                onChange={(e) => setSupportConfig({ ...supportConfig, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Operating Hours Description</label>
              <input
                type="text"
                value={supportConfig.operatingHours}
                onChange={(e) => setSupportConfig({ ...supportConfig, operatingHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Warranty Policy Text</label>
              <textarea
                rows={3}
                value={supportConfig.warrantyPolicy}
                onChange={(e) => setSupportConfig({ ...supportConfig, warrantyPolicy: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 text-white"
              />
            </div>

            <button
              onClick={async () => {
                await updateSupportConfig(supportConfig);
                setStatusMessage('Support channels updated successfully.');
                setTimeout(() => setStatusMessage(null), 3000);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Save Support Configuration
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: ADMIN MANAGEMENT SYSTEM & REGISTERED USERS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Sole Administrator Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1b3a] via-[#09152e] to-[#070c18] border border-emerald-600/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/50 shrink-0">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-mono font-bold uppercase tracking-wider">
                      Single Root Administrator
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono">
                      Master Key Locked
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {SOLE_ADMIN_EMAIL}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Sole platform administrator with unlimited authority over inventory, margins, and the Gemini AI Copilot.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SOLE_ADMIN_EMAIL);
                    setStatusMessage('Admin email copied to clipboard.');
                    setTimeout(() => setStatusMessage(null), 2500);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Email</span>
                </button>
                <div className="px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-bold font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sole Admin Verified</span>
                </div>
              </div>
            </div>

            {/* Architecture Rule Banner */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">Single Admin Architecture Enforced:</strong>
                Exactly 1 administrator account exists across the entire Bodia Tech platform (<code>{SOLE_ADMIN_EMAIL}</code>). All new user registrations, whether created through Google Auth or Email signup, are permanently assigned standard <strong>Customer</strong> permissions. Role elevation is strictly disabled by Firebase security rules.
              </div>
            </div>

            {/* User Statistics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Accounts</div>
                <div className="text-xl font-bold text-white font-mono mt-1">{usersList.length}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Active Customers</div>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                  {usersList.filter((u) => u.status === 'active' && u.email.toLowerCase() !== SOLE_ADMIN_EMAIL.toLowerCase()).length}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Fixed Admins</div>
                <div className="text-xl font-bold text-blue-400 font-mono mt-1">1 (Sole)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Suspended</div>
                <div className="text-xl font-bold text-rose-400 font-mono mt-1">
                  {usersList.filter((u) => u.status === 'suspended').length}
                </div>
              </div>
            </div>
          </div>

          {/* User Directory Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800/80">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search registered users by email or display name..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={loadRegisteredUsers}
                className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddingUserModal(true)}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[0_0_15px_rgba(225,29,72,0.3)] cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Customer</span>
              </button>
            </div>
          </div>

          {/* User Directory Cards / Table */}
          <div className="space-y-3">
            {usersList
              .filter((u) => {
                if (!userSearch.trim()) return true;
                const q = userSearch.toLowerCase();
                return u.email.toLowerCase().includes(q) || (u.displayName || '').toLowerCase().includes(q);
              })
              .map((u) => {
                const isRootAdmin = u.email.toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase();

                return (
                  <div
                    key={u.uid}
                    className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isRootAdmin
                        ? 'bg-slate-900 border-emerald-600/50 shadow-md'
                        : u.status === 'suspended'
                        ? 'bg-slate-950 border-rose-900/50 opacity-80'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                          isRootAdmin
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {isRootAdmin ? <Shield className="w-5 h-5" /> : <Users className="w-5 h-5 text-slate-400" />}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-white text-sm truncate">{u.displayName || u.email.split('@')[0]}</h4>
                          {isRootAdmin ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-mono font-bold">
                              SOLE ADMIN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                              CUSTOMER
                            </span>
                          )}

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'active'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {u.status === 'active' ? 'Active' : 'Suspended'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 font-mono mt-0.5 truncate flex items-center gap-2">
                          <span>{u.email}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(u.email);
                              setStatusMessage(`Copied ${u.email}`);
                              setTimeout(() => setStatusMessage(null), 2000);
                            }}
                            className="text-slate-500 hover:text-slate-300 cursor-pointer"
                            title="Copy email"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 text-xs border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
                      <div className="text-slate-400 space-y-0.5 text-left md:text-right">
                        <div>
                          Registered: <span className="text-slate-300 font-mono">{new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          Orders: <strong className="text-white font-mono">{u.ordersCount || 0}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isRootAdmin ? (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-[11px] font-semibold text-emerald-300">
                            Permanent Master Admin
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u)}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs border transition cursor-pointer ${
                              u.status === 'active'
                                ? 'bg-rose-950/50 hover:bg-rose-900 border-rose-700/60 text-rose-300'
                                : 'bg-emerald-950/50 hover:bg-emerald-900 border-emerald-700/60 text-emerald-300'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend Access' : 'Reactivate Access'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Quick Register Customer Modal */}
          {isAddingUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
              <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-rose-500" />
                    <h3 className="font-bold text-white text-base">Register New Customer</h3>
                  </div>
                  <button
                    onClick={() => setIsAddingUserModal(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Customer Full Name / Agency</label>
                    <input
                      type="text"
                      required
                      placeholder="Agency Media Lead"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Customer Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="client@agency.com"
                      value={newCustEmail}
                      onChange={(e) => setNewCustEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                    <span className="text-white font-bold block mb-0.5">Role Policy:</span>
                    This user will be registered with <strong>Customer</strong> role and active status. Only <code>{SOLE_ADMIN_EMAIL}</code> holds administrative authority.
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setIsAddingUserModal(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold shadow-md cursor-pointer"
                    >
                      Confirm Registration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Edit / Create Modal */}
      {(editingProduct || isCreatingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {isCreatingProduct ? 'Create New SKU' : `Edit Product: ${editingProduct?.name}`}
            </h3>

            {editingProduct && (
              <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Platform</label>
                    <input
                      type="text"
                      value={editingProduct.platform}
                      onChange={(e) => setEditingProduct({ ...editingProduct, platform: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white"
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

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Price Per Unit ($ USD)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingProduct.pricePerUnit}
                      onChange={(e) => setEditingProduct({ ...editingProduct, pricePerUnit: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Stock Count</label>
                    <input
                      type="number"
                      value={editingProduct.stockCount}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Delivery Format</label>
                  <input
                    type="text"
                    value={editingProduct.deliveryFormat}
                    onChange={(e) => setEditingProduct({ ...editingProduct, deliveryFormat: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Full Technical Specs</label>
                  <textarea
                    rows={3}
                    value={editingProduct.fullDesc}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fullDesc: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-white"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingProduct(false);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => editingProduct && handleSaveProduct(editingProduct)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs"
              >
                Save Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
