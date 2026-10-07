export type ProductCategory =
  | 'all'
  | 'email'
  | 'social'
  | 'dating'
  | 'messaging'
  | 'developer'
  | 'gaming';

export interface ProductAttributes {
  country: string;
  creationYear: string;
  isPVA: boolean;
  has2FA: boolean;
  hasCookies: boolean;
  warmupStatus: string;
  warrantyHours: number;
}

export interface BulkDiscountTier {
  minQty: number;
  discountPercent: number;
}

export interface AccountProduct {
  id: string;
  name: string;
  platform: string;
  category: string;
  imageUrl?: string;
  shortDesc: string;
  fullDesc: string;
  pricePerUnit: number;
  stockCount: number;
  minPurchase: number;
  maxPurchase: number;
  deliveryFormat: string;
  deliveryFormatExample: string;
  attributes: ProductAttributes;
  bulkPricing: BulkDiscountTier[];
}

export interface OrderCredential {
  id: string;
  rawLine: string;
  uid: string;
  password: string;
  twoFactorSecret?: string;
  email?: string;
  emailPassword?: string;
  cookiesJson?: string;
  country?: string;
  creationYear?: string;
}

export interface PlacedOrderItem {
  productId: string;
  productName: string;
  platform: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  credentials: OrderCredential[];
}

export interface PlacedOrder {
  id: string;
  createdAt: string;
  customerEmail: string;
  customerUid?: string;
  items: PlacedOrderItem[];
  totalAmount: number;
  status: 'pending_payment' | 'completed' | 'processing' | 'warranty_review';
  paymentMethod: 'usdt_trc20' | 'qr_rupiah' | 'qr_usd_kh';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt?: string;
  status?: 'active' | 'suspended';
}

export interface RegisteredUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'customer';
  createdAt: string;
  lastLoginAt: string;
  status: 'active' | 'suspended';
  ordersCount?: number;
  totalSpent?: number;
}

export interface ServiceInquiry {
  id: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  telegramHandle?: string;
  serviceType: 'custom_web' | 'bot_automation' | 'growth_marketing' | 'proxy_infrastructure';
  budget: string;
  details: string;
  status: 'new' | 'reviewed' | 'contacted' | 'closed';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  preferences: string[];
}

export interface SupportConfig {
  telegramHandle: string;
  telegramUrl: string;
  whatsAppNumber: string;
  whatsAppUrl: string;
  supportEmail: string;
  operatingHours: string;
  warrantyPolicy: string;
}

export interface CopilotAction {
  id: string;
  type: 'adjust_prices' | 'create_product' | 'restock_item' | 'apply_discount';
  title: string;
  description: string;
  payload: any;
  applied?: boolean;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  actions?: CopilotAction[];
}

export interface CartItem {
  product: AccountProduct;
  quantity: number;
}
