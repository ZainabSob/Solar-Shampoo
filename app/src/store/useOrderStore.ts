/**
 * Xpixel Solar Panel Conditioner - Order Management Store
 * Admin dashboard state management with SOP-01 production alignment
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Order,
  OrderStatus,
  BatchRequirement,
  DashboardStats,
  OrderFilter,
  B2BInquiry,
} from '@/types';
import { formatPrice } from '@/schemas';

// ============================================================================
// CONSTANTS - SOP-01 PRODUCTION PARAMETERS
// ============================================================================

/**
 * Formulation ratios (concentrate before dilution)
 * These align with SOP-01 industrial formulation standards
 */
export const FORMULATION_RATIOS = {
  surfactant: 0.08,        // 8% by volume
  siliconeEmulsion: 0.05,  // 5% by volume
  sodiumGluconate: 0.03,   // 3% by volume
  deionizedWater: 0.84,    // 84% by volume
};

/**
 * Production time estimates (in hours per 100 bottles)
 */
export const PRODUCTION_TIME_PER_100_BOTTLES = 2.5;

/**
 * Density factors for raw materials (kg per liter)
 */
export const DENSITY_FACTORS = {
  surfactant: 1.02,
  siliconeEmulsion: 0.95,
  sodiumGluconate: 1.5,  // Powder, so higher density
  deionizedWater: 1.0,
};

// ============================================================================
// STORE STATE INTERFACE
// ============================================================================

interface OrderState {
  // Data
  orders: Order[];
  inquiries: B2BInquiry[];
  
  // UI State
  selectedOrderId: string | null;
  filter: OrderFilter;
  isLoading: boolean;
  
  // Actions - Orders
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
  selectOrder: (orderId: string | null) => void;
  
  // Actions - Inquiries
  addInquiry: (inquiry: B2BInquiry) => void;
  updateInquiryStatus: (inquiryId: string, status: B2BInquiry['status']) => void;
  
  // Actions - Filters
  setFilter: (filter: OrderFilter) => void;
  clearFilter: () => void;
  
  // Selectors
  getFilteredOrders: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  getPendingOrders: () => Order[];
  getB2BOrders: () => Order[];
  getDashboardStats: () => DashboardStats;
  getBatchRequirements: () => BatchRequirement;
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

// ============================================================================
// BATCH REQUIREMENT CALCULATOR (SOP-01)
// ============================================================================

/**
 * Calculate batch requirements for pending orders
 * This aligns with SOP-01 industrial formulation needs
 */
export function calculateBatchRequirements(orders: Order[]): BatchRequirement {
  // Get pending orders only
  const pendingOrders = orders.filter(
    (order) =>
      order.status === 'pending' ||
      order.status === 'confirmed' ||
      order.status === 'processing'
  );

  if (pendingOrders.length === 0) {
    return {
      totalPendingOrders: 0,
      totalBottlesNeeded: 0,
      totalConcentrateVolumeMl: 0,
      concentrateVolumeLiters: 0,
      bottlesBySize: {},
      estimatedProductionTime: 0,
      rawMaterialsNeeded: {
        surfactant: 0,
        siliconeEmulsion: 0,
        sodiumGluconate: 0,
        deionizedWater: 0,
      },
    };
  }

  // Calculate totals
  let totalBottlesNeeded = 0;
  let totalVolumeMl = 0;
  const bottlesBySize: Record<string, number> = {};

  pendingOrders.forEach((order) => {
    order.items.forEach((item) => {
      totalBottlesNeeded += item.quantity;
      totalVolumeMl += item.volumeMl * item.quantity;

      const sizeKey = `${item.volumeMl}ml`;
      bottlesBySize[sizeKey] = (bottlesBySize[sizeKey] || 0) + item.quantity;
    });
  });

  // Calculate concentrate volume (before dilution)
  // Assume concentrate is diluted 1:10 for final product
  const DILUTION_RATIO = 10;
  const totalConcentrateVolumeMl = totalVolumeMl / DILUTION_RATIO;
  const concentrateVolumeLiters = totalConcentrateVolumeMl / 1000;

  // Calculate raw materials needed
  const rawMaterialsNeeded = {
    surfactant:
      (concentrateVolumeLiters *
        FORMULATION_RATIOS.surfactant *
        DENSITY_FACTORS.surfactant),
    siliconeEmulsion:
      (concentrateVolumeLiters *
        FORMULATION_RATIOS.siliconeEmulsion *
        DENSITY_FACTORS.siliconeEmulsion),
    sodiumGluconate:
      (concentrateVolumeLiters *
        FORMULATION_RATIOS.sodiumGluconate *
        DENSITY_FACTORS.sodiumGluconate),
    deionizedWater:
      (concentrateVolumeLiters *
        FORMULATION_RATIOS.deionizedWater *
        DENSITY_FACTORS.deionizedWater),
  };

  // Estimate production time
  const estimatedProductionTime =
    (totalBottlesNeeded / 100) * PRODUCTION_TIME_PER_100_BOTTLES;

  return {
    totalPendingOrders: pendingOrders.length,
    totalBottlesNeeded,
    totalConcentrateVolumeMl: Math.round(totalConcentrateVolumeMl),
    concentrateVolumeLiters: Math.round(concentrateVolumeLiters * 100) / 100,
    bottlesBySize,
    estimatedProductionTime: Math.round(estimatedProductionTime * 10) / 10,
    rawMaterialsNeeded: {
      surfactant: Math.round(rawMaterialsNeeded.surfactant * 100) / 100,
      siliconeEmulsion:
        Math.round(rawMaterialsNeeded.siliconeEmulsion * 100) / 100,
      sodiumGluconate:
        Math.round(rawMaterialsNeeded.sodiumGluconate * 100) / 100,
      deionizedWater:
        Math.round(rawMaterialsNeeded.deionizedWater * 100) / 100,
    },
  };
}

// ============================================================================
// MOCK DATA GENERATOR
// ============================================================================

function generateMockOrders(): Order[] {
  const now = new Date();
  const orders: Order[] = [
    {
      id: 'ord_001',
      orderNumber: 'XP-2026-0001',
      customerType: 'retail',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '+1 555-0101',
      items: [
        {
          productId: 'prod_xpixel_300ml',
          variantId: 'var_300ml',
          productName: 'Xpixel Solar Panel Conditioner',
          variantLabel: '300ml Bottle',
          quantity: 2,
          unitPrice: 4600,
          unitPriceDisplay: 'PKR460',
          totalPrice: 9200,
          totalPriceDisplay: 'PKR 920',
          volumeMl: 300,
        },
      ],
      totals: {
        subtotal: 9998,
        subtotalDisplay: '$99.98',
        tax: 800,
        taxDisplay: '$8.00',
        shipping: 0,
        shippingDisplay: 'FREE',
        total: 10798,
        totalDisplay: '$107.98',
        itemCount: 2,
      },
      cleaningPotential: {
        totalBottles: 2,
        totalVolumeMl: 600,
        totalCaps: 120,
        totalPanelsPerWash: 600,
        totalPanelWashes: 600,
        equivalentPanelSystems: 60,
        monthsOfSupply: 60,
        displayText: '60 months supply for 10-panel system',
      },
      status: 'pending',
      paymentStatus: 'paid',
      shippingAddress: {
        name: 'John Smith',
        street: '123 Solar Street',
        city: 'Phoenix',
        state: 'AZ',
        postalCode: '85001',
        country: 'USA',
        phone: '+1 555-0101',
      },
      createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
    },
    {
      id: 'ord_002',
      orderNumber: 'XP-2026-0002',
      customerType: 'b2b',
      customerName: 'SunPower Installations LLC',
      customerEmail: 'orders@sunpower-install.com',
      customerPhone: '+1 555-0200',
      items: [
        {
          productId: 'prod_xpixel_300ml',
          variantId: 'var_300ml',
          productName: 'Xpixel Solar Panel Conditioner',
          variantLabel: '300ml Bottle',
          quantity: 25,
          unitPrice: 4249, // 15% B2B discount
          unitPriceDisplay: '$42.49',
          totalPrice: 106225,
          totalPriceDisplay: '$1,062.25',
          volumeMl: 300,
        },
        {
          productId: 'prod_xpixel_300ml',
          variantId: 'var_1l',
          productName: 'Xpixel Solar Panel Conditioner',
          variantLabel: '1L Refill',
          quantity: 5,
          unitPrice: 11049,
          unitPriceDisplay: '$110.49',
          totalPrice: 55245,
          totalPriceDisplay: '$552.45',
          volumeMl: 1000,
        },
      ],
      totals: {
        subtotal: 161470,
        subtotalDisplay: '$1,614.70',
        tax: 0, // B2B tax exempt
        taxDisplay: '$0.00',
        shipping: 0,
        shippingDisplay: 'FREE',
        total: 161470,
        totalDisplay: '$1,614.70',
        itemCount: 30,
      },
      cleaningPotential: {
        totalBottles: 30,
        totalVolumeMl: 12500,
        totalCaps: 2500,
        totalPanelsPerWash: 12500,
        totalPanelWashes: 12500,
        equivalentPanelSystems: 1250,
        monthsOfSupply: 1250,
        displayText: '1250 months supply for 10-panel system',
      },
      status: 'processing',
      paymentStatus: 'pending',
      shippingAddress: {
        name: 'SunPower Installations LLC',
        company: 'SunPower Installations LLC',
        street: '456 Industrial Blvd',
        city: 'Tempe',
        state: 'AZ',
        postalCode: '85281',
        country: 'USA',
        phone: '+1 555-0200',
      },
      b2bQuoteRequested: true,
      b2bQuoteApproved: true,
      bulkDiscountApplied: 15,
      createdAt: new Date(now.getTime() - 86400000 * 5).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000).toISOString(),
    },
    {
      id: 'ord_003',
      orderNumber: 'XP-2026-0003',
      customerType: 'distributor',
      customerName: 'EcoDistribute Inc',
      customerEmail: 'procurement@ecodistribute.com',
      customerPhone: '+1 555-0300',
      items: [
        {
          productId: 'prod_xpixel_300ml',
          variantId: 'var_300ml',
          productName: 'Xpixel Solar Panel Conditioner',
          variantLabel: '300ml Bottle',
          quantity: 100,
          unitPrice: 3499, // 30% distributor discount
          unitPriceDisplay: '$34.99',
          totalPrice: 349900,
          totalPriceDisplay: '$3,499.00',
          volumeMl: 300,
        },
      ],
      totals: {
        subtotal: 349900,
        subtotalDisplay: '$3,499.00',
        tax: 0,
        taxDisplay: '$0.00',
        shipping: 0,
        shippingDisplay: 'FREE',
        total: 349900,
        totalDisplay: '$3,499.00',
        itemCount: 100,
      },
      cleaningPotential: {
        totalBottles: 100,
        totalVolumeMl: 30000,
        totalCaps: 6000,
        totalPanelsPerWash: 30000,
        totalPanelWashes: 30000,
        equivalentPanelSystems: 3000,
        monthsOfSupply: 3000,
        displayText: '3000 months supply for 10-panel system',
      },
      status: 'formulating',
      paymentStatus: 'paid',
      shippingAddress: {
        name: 'EcoDistribute Inc',
        company: 'EcoDistribute Inc',
        street: '789 Distribution Way',
        city: 'Mesa',
        state: 'AZ',
        postalCode: '85201',
        country: 'USA',
        phone: '+1 555-0300',
      },
      b2bQuoteRequested: true,
      b2bQuoteApproved: true,
      bulkDiscountApplied: 30,
      createdAt: new Date(now.getTime() - 86400000 * 7).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
    },
    {
      id: 'ord_004',
      orderNumber: 'XP-2026-0004',
      customerType: 'retail',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '+1 555-0404',
      items: [
        {
          productId: 'prod_xpixel_300ml',
          variantId: 'var_300ml',
          productName: 'Xpixel Solar Panel Conditioner',
          variantLabel: '300ml Bottle',
          quantity: 1,
          unitPrice: 4999,
          unitPriceDisplay: '$49.99',
          totalPrice: 4999,
          totalPriceDisplay: '$49.99',
          volumeMl: 300,
        },
      ],
      totals: {
        subtotal: 4999,
        subtotalDisplay: '$49.99',
        tax: 400,
        taxDisplay: '$4.00',
        shipping: 999,
        shippingDisplay: '$9.99',
        total: 6398,
        totalDisplay: '$63.98',
        itemCount: 1,
      },
      cleaningPotential: {
        totalBottles: 1,
        totalVolumeMl: 300,
        totalCaps: 60,
        totalPanelsPerWash: 300,
        totalPanelWashes: 300,
        equivalentPanelSystems: 30,
        monthsOfSupply: 30,
        displayText: '30 months supply for 10-panel system',
      },
      status: 'shipped',
      paymentStatus: 'paid',
      shippingAddress: {
        name: 'Sarah Johnson',
        street: '321 Residential Rd',
        city: 'Scottsdale',
        state: 'AZ',
        postalCode: '85250',
        country: 'USA',
        phone: '+1 555-0404',
      },
      createdAt: new Date(now.getTime() - 86400000 * 10).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
    },
    {
      id: 'ord_005',
      orderNumber: 'XP-2026-0005',
      customerType: 'b2b',
      customerName: 'Desert Solar Solutions',
      customerEmail: 'orders@desertsolar.com',
      customerPhone: '+1 555-0505',
      items: [
        {
          productId: 'prod_xpixel_300ml',
          variantId: 'var_5l',
          productName: 'Xpixel Solar Panel Conditioner',
          variantLabel: '5L Commercial',
          quantity: 10,
          unitPrice: 39999, // 20% discount
          unitPriceDisplay: '$399.99',
          totalPrice: 399990,
          totalPriceDisplay: '$3,999.90',
          volumeMl: 5000,
        },
      ],
      totals: {
        subtotal: 399990,
        subtotalDisplay: '$3,999.90',
        tax: 0,
        taxDisplay: '$0.00',
        shipping: 0,
        shippingDisplay: 'FREE',
        total: 399990,
        totalDisplay: '$3,999.90',
        itemCount: 10,
      },
      cleaningPotential: {
        totalBottles: 10,
        totalVolumeMl: 50000,
        totalCaps: 10000,
        totalPanelsPerWash: 50000,
        totalPanelWashes: 50000,
        equivalentPanelSystems: 5000,
        monthsOfSupply: 5000,
        displayText: '5000 months supply for 10-panel system',
      },
      status: 'quality_check',
      paymentStatus: 'partial',
      shippingAddress: {
        name: 'Desert Solar Solutions',
        company: 'Desert Solar Solutions',
        street: '555 Commercial Center',
        city: 'Glendale',
        state: 'AZ',
        postalCode: '85301',
        country: 'USA',
        phone: '+1 555-0505',
      },
      b2bQuoteRequested: true,
      b2bQuoteApproved: true,
      bulkDiscountApplied: 20,
      createdAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 1).toISOString(),
    },
  ];

  return orders;
}

function generateMockInquiries(): B2BInquiry[] {
  return [
    {
      id: 'inq_001',
      companyName: 'Arizona Solar Pros',
      contactName: 'Michael Chen',
      email: 'm.chen@azsolarpros.com',
      phone: '+1 555-1001',
      country: 'USA',
      businessType: 'installer',
      estimatedMonthlyVolume: 50,
      message: 'Looking for wholesale pricing for our installation business.',
      preferredContactMethod: 'email',
      status: 'quoted',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'inq_002',
      companyName: 'Green Energy Distributors',
      contactName: 'Lisa Rodriguez',
      email: 'lisa@greenenergydist.com',
      phone: '+1 555-1002',
      country: 'USA',
      businessType: 'distributor',
      estimatedMonthlyVolume: 200,
      message: 'Interested in becoming a regional distributor.',
      preferredContactMethod: 'phone',
      status: 'new',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'inq_003',
      companyName: 'SolarClean Co',
      contactName: 'David Park',
      email: 'dpark@solarclean.co',
      phone: '+1 555-1003',
      country: 'USA',
      businessType: 'reseller',
      estimatedMonthlyVolume: 25,
      preferredContactMethod: 'whatsapp',
      status: 'contacted',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];
}

// ============================================================================
// ORDER STORE IMPLEMENTATION
// ============================================================================

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      // Initial state with mock data
      orders: generateMockOrders(),
      inquiries: generateMockInquiries(),
      selectedOrderId: null,
      filter: {},
      isLoading: false,

      // ======================================================================
      // ACTIONS - Orders
      // ======================================================================

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      updateOrderStatus: (orderId, status, notes) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  notes: notes || order.notes,
                  updatedAt: new Date().toISOString(),
                }
              : order
          ),
        }));
      },

      updateOrder: (orderId, updates) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, ...updates, updatedAt: new Date().toISOString() }
              : order
          ),
        }));
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
          selectedOrderId:
            state.selectedOrderId === orderId ? null : state.selectedOrderId,
        }));
      },

      selectOrder: (orderId) => {
        set({ selectedOrderId: orderId });
      },

      // ======================================================================
      // ACTIONS - Inquiries
      // ======================================================================

      addInquiry: (inquiry) => {
        set((state) => ({
          inquiries: [inquiry, ...state.inquiries],
        }));
      },

      updateInquiryStatus: (inquiryId, status) => {
        set((state) => ({
          inquiries: state.inquiries.map((inquiry) =>
            inquiry.id === inquiryId ? { ...inquiry, status } : inquiry
          ),
        }));
      },

      // ======================================================================
      // ACTIONS - Filters
      // ======================================================================

      setFilter: (filter) => {
        set({ filter });
      },

      clearFilter: () => {
        set({ filter: {} });
      },

      // ======================================================================
      // SELECTORS
      // ======================================================================

      getFilteredOrders: () => {
        const { orders, filter } = get();

        return orders.filter((order) => {
          // Filter by status
          if (filter.status && order.status !== filter.status) {
            return false;
          }

          // Filter by customer type
          if (filter.customerType && order.customerType !== filter.customerType) {
            return false;
          }

          // Filter by date range
          if (filter.dateFrom) {
            const orderDate = new Date(order.createdAt);
            const fromDate = new Date(filter.dateFrom);
            if (orderDate < fromDate) return false;
          }

          if (filter.dateTo) {
            const orderDate = new Date(order.createdAt);
            const toDate = new Date(filter.dateTo);
            if (orderDate > toDate) return false;
          }

          // Filter by search query
          if (filter.searchQuery) {
            const query = filter.searchQuery.toLowerCase();
            const searchableText = `
              ${order.orderNumber}
              ${order.customerName}
              ${order.customerEmail}
              ${order.shippingAddress.name}
            `.toLowerCase();
            if (!searchableText.includes(query)) return false;
          }

          return true;
        });
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      getPendingOrders: () => {
        return get().orders.filter(
          (order) =>
            order.status === 'pending' ||
            order.status === 'confirmed' ||
            order.status === 'processing'
        );
      },

      getB2BOrders: () => {
        return get().orders.filter(
          (order) => order.customerType === 'b2b' || order.customerType === 'distributor'
        );
      },

      getDashboardStats: (): DashboardStats => {
        const { orders } = get();

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce(
          (sum, order) => sum + order.totals.total,
          0
        );
        const pendingOrders = orders.filter(
          (order) =>
            order.status === 'pending' ||
            order.status === 'confirmed' ||
            order.status === 'processing'
        ).length;
        const b2bInquiries = get().inquiries.filter(
          (inq) => inq.status === 'new' || inq.status === 'contacted'
        ).length;

        // Mock low stock (would come from inventory system)
        const lowStockProducts = 2;

        const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        return {
          totalOrders,
          totalRevenue,
          totalRevenueDisplay: formatPrice(totalRevenue),
          pendingOrders,
          b2bInquiries,
          lowStockProducts,
          avgOrderValue,
          avgOrderValueDisplay: formatPrice(avgOrderValue),
        };
      },

      getBatchRequirements: () => {
        return calculateBatchRequirements(get().orders);
      },

      getOrdersByStatus: (status) => {
        return get().orders.filter((order) => order.status === status);
      },
    }),
    {
      name: 'xpixel-order-storage',
      partialize: (state) => ({
        orders: state.orders,
        inquiries: state.inquiries,
      }),
    }
  )
);

// ============================================================================
// DERIVED HOOKS
// ============================================================================

export function useSelectedOrder() {
  return useOrderStore((state) =>
    state.selectedOrderId
      ? state.getOrderById(state.selectedOrderId)
      : undefined
  );
}

export function useOrderStats() {
  return useOrderStore((state) => state.getDashboardStats());
}

export function useBatchRequirements() {
  return useOrderStore((state) => state.getBatchRequirements());
}
