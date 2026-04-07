/**
 * Xpixel Solar Panel Conditioner - TypeScript Interfaces
 * Industrial-grade type definitions for cart, product, and order management
 */

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  volumeMl: number;        // Bottle volume in ml (e.g., 300)
  price: number;           // Price in cents (for precision)
  priceDisplay: string;    // Formatted price (e.g., "$49.99")
  imageUrl: string;
  inStock: boolean;
  stockQuantity: number;
  isB2BEligible: boolean;  // Can be purchased in bulk
  minB2BQuantity: number;  // Minimum quantity for B2B pricing
  b2bDiscountPercent: number;
}

// Product variant for different bottle sizes
export interface ProductVariant {
  id: string;
  volumeMl: number;
  price: number;
  priceDisplay: string;
  label: string;           // e.g., "300ml Bottle", "1L Refill"
}

// ============================================================================
// CART TYPES
// ============================================================================

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
  addedAt: string;         // ISO timestamp
}

export interface CartTotals {
  subtotal: number;        // In cents
  subtotalDisplay: string;
  tax: number;             // In cents
  taxDisplay: string;
  shipping: number;        // In cents
  shippingDisplay: string;
  total: number;           // In cents
  totalDisplay: string;
  itemCount: number;
}

// 1-Cap Economy Calculation Result
export interface CleaningPotential {
  totalBottles: number;
  totalVolumeMl: number;
  totalCaps: number;              // Total 5ml caps available
  totalPanelsPerWash: number;     // Panels cleaned per cap (5 panels)
  totalPanelWashes: number;       // Total number of panel washes possible
  equivalentPanelSystems: number; // Based on 10-panel system
  monthsOfSupply: number;         // For 10-panel system, washing monthly
  displayText: string;            // Human-readable summary
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'formulating'    // SOP-01: Production phase
  | 'quality_check' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type CustomerType = 'retail' | 'b2b' | 'distributor';

export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded' | 'failed';

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;       // In cents
  unitPriceDisplay: string;
  totalPrice: number;      // In cents
  totalPriceDisplay: string;
  volumeMl: number;
}

export interface ShippingAddress {
  name: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;           // Human-readable (e.g., "XP-2026-0001")
  customerType: CustomerType;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totals: CartTotals;
  cleaningPotential: CleaningPotential;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  notes?: string;
  b2bQuoteRequested?: boolean;
  b2bQuoteApproved?: boolean;
  bulkDiscountApplied?: number;  // Percentage
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// B2B INQUIRY TYPES
// ============================================================================

export interface B2BInquiry {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  businessType: 'installer' | 'distributor' | 'reseller' | 'other';
  estimatedMonthlyVolume: number;  // In bottles
  message?: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp';
  status: 'new' | 'contacted' | 'qualified' | 'quoted' | 'converted' | 'lost';
  createdAt: string;
}

// ============================================================================
// PRODUCTION TYPES (SOP-01 Alignment)
// ============================================================================

export interface BatchRequirement {
  totalPendingOrders: number;
  totalBottlesNeeded: number;
  totalConcentrateVolumeMl: number;  // Raw concentrate before dilution
  concentrateVolumeLiters: number;
  bottlesBySize: Record<string, number>;  // { "300ml": 150, "1L": 50 }
  estimatedProductionTime: number;   // In hours
  rawMaterialsNeeded: {
    surfactant: number;      // In kg
    siliconeEmulsion: number; // In kg
    sodiumGluconate: number;  // In kg
    deionizedWater: number;   // In liters
  };
}

// ============================================================================
// ADMIN DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;           // In cents
  totalRevenueDisplay: string;
  pendingOrders: number;
  b2bInquiries: number;
  lowStockProducts: number;
  avgOrderValue: number;          // In cents
  avgOrderValueDisplay: string;
}

export interface OrderFilter {
  status?: OrderStatus;
  customerType?: CustomerType;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  sameAsShipping: boolean;
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  notes?: string;
}

export interface B2BInquiryFormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  businessType: 'installer' | 'distributor' | 'reseller' | 'other';
  estimatedMonthlyVolume: number;
  message?: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp';
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
