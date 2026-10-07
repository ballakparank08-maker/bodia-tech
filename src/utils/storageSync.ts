import { AccountProduct, PlacedOrder, UserProfile } from '../types/index.ts';
import { INITIAL_PRODUCTS, INITIAL_USER_PROFILE } from '../data/initialProducts.ts';

export const CACHE_VERSION_KEY = 'bodiatech_cache_version';
export const CURRENT_CACHE_VERSION = 'bodiatech_v2_fb_stocks_plus_1';
export const PRODUCTS_STORAGE_KEY = 'bodiatech_products_vault';
export const ORDERS_STORAGE_KEY = 'bodiatech_orders_vault';
export const USER_STORAGE_KEY = 'bodiatech_user_profile';
export const CART_STORAGE_KEY = 'bodiatech_active_cart';

export function initializeVersionedCache(): {
  products: AccountProduct[];
  user: UserProfile;
} {
  try {
    const existingVersion = localStorage.getItem(CACHE_VERSION_KEY);

    if (existingVersion !== CURRENT_CACHE_VERSION) {
      // Version migration: Invalidate and upgrade cache
      console.log(`[Storage Migration] Migrating cache to ${CURRENT_CACHE_VERSION}`);
      localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(INITIAL_USER_PROFILE));
      return {
        products: INITIAL_PRODUCTS,
        user: INITIAL_USER_PROFILE,
      };
    }

    const savedProds = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    const parsedProds = savedProds ? JSON.parse(savedProds) : INITIAL_PRODUCTS;

    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    const parsedUser = savedUser ? JSON.parse(savedUser) : INITIAL_USER_PROFILE;

    return {
      products: parsedProds,
      user: parsedUser,
    };
  } catch (err) {
    console.warn('[Storage Migration Error] Fallback to defaults', err);
    return {
      products: INITIAL_PRODUCTS,
      user: INITIAL_USER_PROFILE,
    };
  }
}

export function saveCachedProducts(products: AccountProduct[]) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save cached products:', e);
  }
}

export function getCachedOrders(): PlacedOrder[] {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCachedOrders(orders: PlacedOrder[]) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save cached orders:', e);
  }
}
