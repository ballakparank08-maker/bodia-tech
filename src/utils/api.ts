import { AccountProduct, PlacedOrder, ServiceInquiry, SupportConfig, UserProfile, CopilotMessage } from '../types/index.ts';
import { saveCachedProducts, saveCachedOrders } from './storageSync.ts';
import { getStoredAuthUser } from './auth.ts';
import { INITIAL_PRODUCTS, INITIAL_SUPPORT_CONFIG, INITIAL_USER_PROFILE } from '../data/initialProducts.ts';

import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch, runTransaction, getDoc } from 'firebase/firestore';
import { db } from '../firebase.ts';

// In-memory / localStorage mock backend for configs and fallback
const getLocalItem = <T>(key: string, defaultVal: T): T => {
  const cached = localStorage.getItem(key);
  if (cached) {
    try { return JSON.parse(cached); } catch(e) {}
  }
  return defaultVal;
};
const setLocalItem = <T>(key: string, val: T): void => {
  localStorage.setItem(key, JSON.stringify(val));
};

export async function fetchProducts(): Promise<AccountProduct[]> {
  try {
    const col = collection(db, 'products');
    const snap = await getDocs(col);
    if (snap.empty) {
      return INITIAL_PRODUCTS; // Fallback or initial data
    }
    const products: AccountProduct[] = [];
    snap.forEach((d) => products.push(d.data() as AccountProduct));
    saveCachedProducts(products);
    return products;
  } catch (err) {
    console.error("Firebase fetchProducts failed", err);
    return getLocalItem<AccountProduct[]>('bodiatech_products_vault', INITIAL_PRODUCTS);
  }
}

export async function saveProduct(product: AccountProduct): Promise<AccountProduct> {
  const prodId = product.id || `bt-${Date.now()}`;
  const prodToSave = { ...product, id: prodId };
  await setDoc(doc(db, 'products', prodId), prodToSave, { merge: true });
  return prodToSave;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  await deleteDoc(doc(db, 'products', productId));
  return true;
}

export async function adjustGlobalMargin(delta: number): Promise<{ success: boolean; message: string; products: AccountProduct[] }> {
  const products = await fetchProducts();
  const batch = writeBatch(db);
  const updatedProducts: AccountProduct[] = [];

  for (const product of products) {
    const newPrice = Math.max(0.10, Math.round((product.pricePerUnit + delta) * 100) / 100);
    const prodRef = doc(db, 'products', product.id);
    batch.update(prodRef, { pricePerUnit: newPrice });
    updatedProducts.push({ ...product, pricePerUnit: newPrice });
  }
  
  await batch.commit();
  return { success: true, message: `Adjusted all ${products.length} products by ${delta >= 0 ? '+' : ''}$${delta.toFixed(2)}`, products: updatedProducts };
}

export async function ingestBatchStock(productId: string, rawAccountsText: string): Promise<{ success: boolean; message: string; newStockCount: number; product: AccountProduct }> {
  const lines = rawAccountsText.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) throw new Error('No valid accounts provided');
  
  let newStockCount = 0;
  let finalProduct: AccountProduct | null = null;
  
  await runTransaction(db, async (t) => {
    const prodRef = doc(db, 'products', productId);
    const docSnap = await t.get(prodRef);
    if (!docSnap.exists()) throw new Error('Product not found in Firestore');
    
    const prod = docSnap.data() as AccountProduct;
    newStockCount = (prod.stockCount || 0) + lines.length;
    
    t.update(prodRef, { stockCount: newStockCount });
    finalProduct = { ...prod, stockCount: newStockCount };
  });

  return { success: true, message: `Ingested ${lines.length} accounts`, newStockCount, product: finalProduct! };
}

export async function fetchOrders(): Promise<PlacedOrder[]> {
  try {
    const col = collection(db, 'orders');
    const snap = await getDocs(col);
    const orders: PlacedOrder[] = [];
    snap.forEach((d) => orders.push(d.data() as PlacedOrder));
    saveCachedOrders(orders);
    return orders;
  } catch (err) {
    console.error("Firebase fetchOrders failed", err);
    return getLocalItem<PlacedOrder[]>('bodiatech_orders_vault', []);
  }
}

export async function placeOrder(payload: { items: { productId: string; quantity: number }[]; customerEmail: string; paymentMethod: string; }): Promise<{ success: boolean; order: PlacedOrder; updatedUserBalance?: number }> {
  let fulfilledItems: any[] = [];
  let totalOrderAmount = 0;

  await runTransaction(db, async (t) => {
    fulfilledItems = [];
    totalOrderAmount = 0;

    for (const item of payload.items) {
      const prodRef = doc(db, 'products', item.productId);
      const prodSnap = await t.get(prodRef);
      if (!prodSnap.exists()) throw new Error(`Product not found: ${item.productId}`);
      
      const prod = prodSnap.data() as AccountProduct;
      if (prod.stockCount < item.quantity) throw new Error(`Insufficient stock for ${prod.name}`);
      
      const newStock = prod.stockCount - item.quantity;
      t.update(prodRef, { stockCount: newStock });

      let unitPrice = prod.pricePerUnit;
      if (prod.bulkPricing && prod.bulkPricing.length > 0) {
        const eligibleTiers = prod.bulkPricing.filter((tier) => item.quantity >= tier.minQty).sort((a, b) => b.discountPercent - a.discountPercent);
        if (eligibleTiers.length > 0) {
          unitPrice = Math.round(unitPrice * (1 - eligibleTiers[0].discountPercent / 100) * 100) / 100;
        }
      }
      const itemTotal = Math.round(unitPrice * item.quantity * 100) / 100;
      totalOrderAmount += itemTotal;
      
      fulfilledItems.push({
        productId: prod.id,
        productName: prod.name,
        platform: prod.platform,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
        credentials: [] 
      });
    }
  });

  const newOrder: PlacedOrder = {
    id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    customerEmail: payload.customerEmail,
    items: fulfilledItems,
    totalAmount: Math.round(totalOrderAmount * 100) / 100,
    status: 'pending_payment',
    paymentMethod: payload.paymentMethod as any || 'usdt_trc20',
  };

  await setDoc(doc(db, 'orders', newOrder.id), newOrder);
  
  return { success: true, order: newOrder };
}

export async function updateOrderStatus(orderId: string, status: string): Promise<PlacedOrder> {
  const orderRef = doc(db, 'orders', orderId);
  const snap = await getDoc(orderRef);
  if (!snap.exists()) throw new Error('Order not found in Firestore');
  
  await setDoc(orderRef, { status }, { merge: true });
  
  const updatedSnap = await getDoc(orderRef);
  return updatedSnap.data() as PlacedOrder;
}

export async function fetchInquiries(): Promise<ServiceInquiry[]> {
  return getLocalItem<ServiceInquiry[]>('bodiatech_inquiries', []);
}

export async function submitServiceInquiry(payload: Partial<ServiceInquiry>): Promise<ServiceInquiry> {
  const inquiries = getLocalItem<ServiceInquiry[]>('bodiatech_inquiries', []);
  const newInquiry: ServiceInquiry = {
    id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    clientName: payload.clientName || 'Unknown',
    clientEmail: payload.clientEmail || 'unknown@example.com',
    telegramHandle: payload.telegramHandle,
    serviceType: payload.serviceType || 'custom',
    budget: payload.budget || '$1,000 - $3,000',
    details: payload.details || '',
    status: 'new',
  };
  inquiries.unshift(newInquiry);
  setLocalItem('bodiatech_inquiries', inquiries);
  return newInquiry;
}

export async function subscribeNewsletter(email: string, preferences?: string[]): Promise<string> {
  return "Subscribed successfully locally";
}

export async function fetchSupportConfig(): Promise<SupportConfig> {
  return getLocalItem<SupportConfig>('bodiatech_support_cfg', INITIAL_SUPPORT_CONFIG);
}

export async function updateSupportConfig(cfg: Partial<SupportConfig>): Promise<SupportConfig> {
  const current = getLocalItem<SupportConfig>('bodiatech_support_cfg', INITIAL_SUPPORT_CONFIG);
  const updated = { ...current, ...cfg };
  setLocalItem('bodiatech_support_cfg', updated);
  return updated;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  return INITIAL_USER_PROFILE;
}

export async function fetchAdminUsers(): Promise<any[]> {
  return getLocalItem<any[]>('bodiatech_admin_users', []);
}

export async function updateAdminUserStatus(uid: string, status: 'active' | 'suspended'): Promise<void> {
  const users = getLocalItem<any[]>('bodiatech_admin_users', []);
  const user = users.find(u => u.uid === uid);
  if (user) {
    user.status = status;
    setLocalItem('bodiatech_admin_users', users);
  }
}

export async function sendCopilotMessage(message: string, history: CopilotMessage[]): Promise<CopilotMessage> {
  return {
    role: 'assistant',
    content: "Static mode: Offline mock response.",
    timestamp: new Date().toISOString()
  };
}

export async function generateAiListing(brief: string, platform?: string, category?: string): Promise<AccountProduct> {
  const result = await generateBulkAiListings(brief, platform, category);
  return result[0];
}

export async function generateBulkAiListings(brief: string, platform?: string, category?: string): Promise<AccountProduct[]> {
  // Free AI Heuristic Store Manager (Client-Side Parser)
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI thinking delay
  
  const lowerBrief = brief.toLowerCase();
  
  // Try to find quantity (e.g., "50 accounts", "add 10", "bulk 100")
  let quantity = 1;
  const quantityMatch = lowerBrief.match(/(?:add|create|bulk|generate|make)\s+(\d+)/i) || lowerBrief.match(/(\d+)\s+(?:accounts|items|products|units)/i);
  if (quantityMatch) {
    quantity = Math.min(parseInt(quantityMatch[1], 10), 50); // Cap at 50 for safety
  }

  // Parse price
  let price = 10.00;
  const priceMatch = lowerBrief.match(/\$(\d+(?:\.\d+)?)/);
  if (priceMatch) {
    price = parseFloat(priceMatch[1]);
  } else if (lowerBrief.includes('premium') || lowerBrief.includes('high tier')) {
    price = 45.00;
  } else if (lowerBrief.includes('cheap') || lowerBrief.includes('low tier')) {
    price = 5.00;
  }

  // Determine platform if not provided
  let detPlatform = platform || 'Unknown';
  if (!platform || platform === 'Unknown') {
    if (lowerBrief.includes('facebook') || lowerBrief.includes('fb')) detPlatform = 'Facebook';
    else if (lowerBrief.includes('tiktok') || lowerBrief.includes('tt')) detPlatform = 'TikTok';
    else if (lowerBrief.includes('google') || lowerBrief.includes('gmail')) detPlatform = 'Google';
    else if (lowerBrief.includes('instagram') || lowerBrief.includes('ig')) detPlatform = 'Instagram';
    else if (lowerBrief.includes('twitter') || lowerBrief.includes('x')) detPlatform = 'Twitter';
  }

  // Determine Category
  let detCategory = category || 'social';
  if (!category || category === 'social') {
     if (lowerBrief.includes('ads') || lowerBrief.includes('bm') || lowerBrief.includes('business')) detCategory = 'ads';
     else if (lowerBrief.includes('pva') || lowerBrief.includes('verified')) detCategory = 'pva';
  }

  const generatedProducts: AccountProduct[] = [];
  
  for (let i = 0; i < quantity; i++) {
    const variance = (Math.random() * 2) - 1; // -1 to 1
    const adjustedPrice = Math.max(1, price + (price * variance * 0.05)); // 5% variance

    generatedProducts.push({
      id: `AI-GEN-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
      name: `${detPlatform} ${detCategory === 'ads' ? 'Business Manager' : 'Premium Profile'} - Batch ${Math.floor(Math.random() * 1000)}`,
      platform: detPlatform,
      category: detCategory,
      shortDesc: `Auto-generated ${detPlatform} asset based on: "${brief.substring(0, 30)}..."`,
      fullDesc: `Automatically generated by Bodia AI Store Manager based on brief: "${brief}". This is a premium ${detPlatform} asset tailored for growth scaling. Includes all necessary recovery materials.`,
      pricePerUnit: parseFloat(adjustedPrice.toFixed(2)),
      stockCount: Math.floor(Math.random() * 50) + 10,
      minPurchase: 1,
      maxPurchase: 100,
      deliveryFormat: 'uid:pass:2fa:email:emailpass',
      deliveryFormatExample: '1000123:password123:ABCDEFGHIJKLMNOP:user@email.com:emailpass123',
      imageUrl: 'https://images.unsplash.com/photo-1614064641913-a520faff3e01?w=800&auto=format&fit=crop&q=80',
      attributes: {
        country: 'US',
        creationYear: '2022',
        isPVA: true,
        has2FA: true,
        hasCookies: true,
        warmupStatus: 'Fully Warmed',
        warrantyHours: 72
      },
      bulkPricing: [
        { minQty: 10, discountPercent: 5 },
        { minQty: 50, discountPercent: 15 }
      ]
    });
  }

  return generatedProducts;
}

