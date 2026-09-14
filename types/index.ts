export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roles: string[];
}

export interface UserPreferences {
  phone?: string;
  birthday?: string;
  flowerStyles: string[];
  flowerColors: string[];
  favoriteBlooms?: string;
  emailConsent: boolean;
  smsConsent: boolean;
  avatarUrl?: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  password?: string;
  currentPassword?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  imageUrl?: string | null;
  price: number;
  stock: number;
  lowStockThreshold?: number | null;
  isActive: boolean;
  categoryId: string | null;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
  // Frontend-only design fields used for mock data / catalog badges
  sameDayDelivery?: boolean;
  salePrice?: number | null;
  isBestSeller?: boolean;
  tags?: string[];
  occasions?: string[];
  variants?: ProductVariant[];
  images?: ProductImage[];
  backorder?: boolean;
  featured?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  slug?: string | null;
  funeralLocation?: boolean;
  funeralTime?: boolean;
  allowRibbon?: boolean;
  leadTime?: number;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Occasion {
  id: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export interface CartItem {
  id?: string;
  productId: string;
  name?: string;
  price?: number;
  quantity: number;
  note?: string;
}

export interface Cart {
  items: CartItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  note: string | null;
  product: Product;
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "payment_failed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export interface Payment {
  id: string;
  orderId: string;
  gateway: string;
  amount: number;
  fee: number;
  status: string;
  transactionId: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment: Payment | null;
  shippingAddress: Address;
  billingAddress: Address;
  discount?: number;
  discountCode?: string | null;
  requestedDeliveryDate?: string | null;
  requestedDeliverySlot?: string | null;
}

export interface OrdersResponse {
  data: Order[];
  pagination: Pagination;
}

export interface Address {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutResponse {
  orderId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  clientSecret: string | null;
  discount?: number;
  discountCode?: string | null;
  requestedDeliveryDate?: string | null;
  requestedDeliverySlot?: string | null;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface WishlistResponse {
  data: WishlistItem[];
}
export * from "./gift-card";

