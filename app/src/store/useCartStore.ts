/**
 * Xpixel Solar Panel Conditioner - Zustand Cart Store
 * Industrial-grade state management with 1-Cap Economy calculations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CartItem,
  CartTotals,
  CleaningPotential,
  Product,
  ProductVariant,
} from '@/types';
import { formatPrice } from '@/schemas';

// ============================================================================
// CONSTANTS - 1 CAP ECONOMY
// ============================================================================

/**
 * Core formula: 1 Cap (5ml) = 5 Panels
 * This is the foundation of all cleaning potential calculations
 */
export const CAP_VOLUME_ML = 5;           // 1 cap = 5ml
export const PANELS_PER_CAP = 5;          // 5 panels per cap
export const PANELS_PER_ML = PANELS_PER_CAP / CAP_VOLUME_ML;  // 1 panel per ml

/**
 * Standard system assumptions for calculations
 */
export const STANDARD_PANEL_SYSTEM = 10;  // Typical residential system size
export const RECOMMENDED_WASH_FREQUENCY_MONTHS = 1;  // Monthly washing

// ============================================================================
// STORE STATE INTERFACE
// ============================================================================

interface CartState {
  // Cart items
  items: CartItem[];
  
  // UI State
  isCartOpen: boolean;
  isB2BMode: boolean;
  b2bThreshold: number;
  
  // Actions
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  toggleB2BMode: () => void;
  setB2BMode: (isB2B: boolean) => void;
  
  // Selectors
  getCartTotals: () => CartTotals;
  getCleaningPotential: () => CleaningPotential;
  getItemCount: () => number;
  getTotalBottles: () => number;
  getTotalVolumeMl: () => number;
  isB2BEligible: () => boolean;
  getB2BBulkDiscount: () => number;
}

// ============================================================================
// 1-CAP ECONOMY CALCULATION ENGINE
// ============================================================================

/**
 * Calculate the cleaning potential based on total volume
 * This is the core "Efficiency Utility" function
 */
export function calculateCleaningPotential(
  totalVolumeMl: number,
  totalBottles: number
): CleaningPotential {
  // Total caps available (each cap is 5ml)
  const totalCaps = Math.floor(totalVolumeMl / CAP_VOLUME_ML);
  
  // Total panels that can be cleaned per wash
  // Each cap cleans 5 panels, so totalCaps * 5
  const totalPanelsPerWash = totalCaps * PANELS_PER_CAP;
  
  // Total panel washes possible
  // This is the key metric: how many times can we clean panels
  const totalPanelWashes = totalPanelsPerWash;
  
  // Equivalent panel systems (based on 10-panel system)
  const equivalentPanelSystems = totalPanelsPerWash / STANDARD_PANEL_SYSTEM;
  
  // Months of supply for a 10-panel system (washing monthly)
  const monthsOfSupply = totalPanelWashes / STANDARD_PANEL_SYSTEM;
  
  // Generate human-readable display text
  let displayText: string;
  
  if (totalBottles === 0) {
    displayText = 'Add bottles to see cleaning potential';
  } else if (totalPanelWashes < STANDARD_PANEL_SYSTEM) {
    displayText = `Cleans ${totalPanelsPerWash} panels once`;
  } else if (monthsOfSupply < 1) {
    displayText = `Cleans ${Math.floor(equivalentPanelSystems * 10) / 10} systems once`;
  } else if (monthsOfSupply < 12) {
    displayText = `${Math.floor(monthsOfSupply)} months supply for 10-panel system`;
  } else {
    const years = Math.floor(monthsOfSupply / 12);
    const remainingMonths = Math.floor(monthsOfSupply % 12);
    displayText = `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} months` : ''} supply`;
  }
  
  return {
    totalBottles,
    totalVolumeMl,
    totalCaps,
    totalPanelsPerWash,
    totalPanelWashes,
    equivalentPanelSystems: Math.floor(equivalentPanelSystems * 10) / 10,
    monthsOfSupply: Math.floor(monthsOfSupply * 10) / 10,
    displayText,
  };
}

/**
 * Calculate how many bottles are needed for a specific panel system
 */
export function calculateBottlesNeeded(
  panelCount: number,
  monthsOfOperation: number,
  washFrequencyMonths: number = RECOMMENDED_WASH_FREQUENCY_MONTHS,
  bottleVolumeMl: number = 300
): number {
  // Total washes needed
  const totalWashes = Math.ceil(monthsOfOperation / washFrequencyMonths);
  
  // Total panels to clean across all washes
  const totalPanelsToClean = panelCount * totalWashes;
  
  // Caps needed (5 panels per cap)
  const capsNeeded = Math.ceil(totalPanelsToClean / PANELS_PER_CAP);
  
  // Volume needed in ml
  const volumeNeededMl = capsNeeded * CAP_VOLUME_ML;
  
  // Bottles needed
  const bottlesNeeded = Math.ceil(volumeNeededMl / bottleVolumeMl);
  
  return bottlesNeeded;
}

/**
 * Calculate cost per panel wash
 */
export function calculateCostPerWash(
  bottlePriceCents: number,
  bottleVolumeMl: number
): number {
  // Caps per bottle
  const capsPerBottle = Math.floor(bottleVolumeMl / CAP_VOLUME_ML);
  
  // Panels per bottle
  const panelsPerBottle = capsPerBottle * PANELS_PER_CAP;
  
  // Cost per panel wash
  const costPerWash = bottlePriceCents / panelsPerBottle;
  
  return Math.round(costPerWash);
}

// ============================================================================
// CART STORE IMPLEMENTATION
// ============================================================================

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isCartOpen: false,
      isB2BMode: false,
      b2bThreshold: 10,  // 10 bottles triggers B2B mode

      // ======================================================================
      // ACTIONS
      // ======================================================================

      /**
       * Add item to cart
       */
      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === product.id && item.variantId === variant.id
          );

          if (existingItemIndex >= 0) {
            // Update existing item
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
            };
            return { items: updatedItems };
          }

          // Add new item
          const newItem: CartItem = {
            productId: product.id,
            variantId: variant.id,
            quantity,
            product,
            variant,
            addedAt: new Date().toISOString(),
          };

          return { items: [...state.items, newItem] };
        });
      },

      /**
       * Remove item from cart
       */
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          ),
        }));
      },

      /**
       * Update item quantity
       */
      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      /**
       * Clear all items from cart
       */
      clearCart: () => {
        set({ items: [] });
      },

      /**
       * Toggle cart drawer
       */
      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      /**
       * Set cart drawer state
       */
      setCartOpen: (open) => {
        set({ isCartOpen: open });
      },

      /**
       * Toggle B2B mode
       */
      toggleB2BMode: () => {
        set((state) => ({ isB2BMode: !state.isB2BMode }));
      },

      /**
       * Set B2B mode explicitly
       */
      setB2BMode: (isB2B) => {
        set({ isB2BMode: isB2B });
      },

      // ======================================================================
      // SELECTORS
      // ======================================================================

      /**
       * Get cart totals including B2B discounts
       */
      getCartTotals: (): CartTotals => {
        const state = get();
        const { items, isB2BMode } = state;

        // Calculate subtotal
        let subtotal = 0;
        let totalVolumeMl = 0;

        items.forEach((item) => {
          const itemTotal = item.variant.price * item.quantity;
          subtotal += itemTotal;
          totalVolumeMl += item.variant.volumeMl * item.quantity;
        });

        // Apply B2B bulk discount if eligible
        const totalBottles = state.getTotalBottles();
        let discountPercent = 0;

        if (isB2BMode || totalBottles >= state.b2bThreshold) {
          // Progressive discount based on volume
          if (totalBottles >= 100) {
            discountPercent = 30;
          } else if (totalBottles >= 50) {
            discountPercent = 25;
          } else if (totalBottles >= 25) {
            discountPercent = 20;
          } else if (totalBottles >= 10) {
            discountPercent = 15;
          }
        }

        const discountAmount = Math.round(subtotal * (discountPercent / 100));
        const discountedSubtotal = subtotal - discountAmount;

        // Calculate tax (8% default)
        const taxRate = 0.08;
        const tax = Math.round(discountedSubtotal * taxRate);

        // Calculate shipping (free over PKR 1500)
        const shipping = discountedSubtotal >= 10000 ? 0 : 999; // $9.99 shipping

        // Calculate total
        const total = discountedSubtotal + tax + shipping;

        return {
          subtotal,
          subtotalDisplay: formatPrice(subtotal),
          tax,
          taxDisplay: formatPrice(tax),
          shipping,
          shippingDisplay: shipping === 0 ? 'FREE' : formatPrice(shipping),
          total,
          totalDisplay: formatPrice(total),
          itemCount: state.getItemCount(),
        };
      },

      /**
       * Get cleaning potential based on 1-Cap Economy
       */
      getCleaningPotential: (): CleaningPotential => {
        const totalVolumeMl = get().getTotalVolumeMl();
        const totalBottles = get().getTotalBottles();
        return calculateCleaningPotential(totalVolumeMl, totalBottles);
      },

      /**
       * Get total item count (sum of all quantities)
       */
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      /**
       * Get total number of bottles
       */
      getTotalBottles: () => {
        return get().getItemCount();
      },

      /**
       * Get total volume in ml
       */
      getTotalVolumeMl: () => {
        return get().items.reduce(
          (sum, item) => sum + item.variant.volumeMl * item.quantity,
          0
        );
      },

      /**
       * Check if cart qualifies for B2B pricing
       */
      isB2BEligible: () => {
        return get().getTotalBottles() >= get().b2bThreshold;
      },

      /**
       * Get applicable B2B bulk discount percentage
       */
      getB2BBulkDiscount: () => {
        const totalBottles = get().getTotalBottles();

        if (totalBottles >= 100) return 30;
        if (totalBottles >= 50) return 25;
        if (totalBottles >= 25) return 20;
        if (totalBottles >= 10) return 15;

        return 0;
      },
    }),
    {
      name: 'xpixel-cart-storage',
      partialize: (state) => ({
        items: state.items,
        isB2BMode: state.isB2BMode,
      }),
    }
  )
);

// ============================================================================
// DERIVED STORE HOOKS (for convenience)
// ============================================================================

/**
 * Hook to get cart item by product/variant ID
 */
export function useCartItem(productId: string, variantId: string) {
  return useCartStore((state) =>
    state.items.find(
      (item) => item.productId === productId && item.variantId === variantId
    )
  );
}

/**
 * Hook to check if product is in cart
 */
export function useIsInCart(productId: string, variantId: string) {
  return useCartStore((state) =>
    state.items.some(
      (item) => item.productId === productId && item.variantId === variantId
    )
  );
}

/**
 * Hook to get cleaning potential display text
 */
export function useCleaningPotentialDisplay() {
  return useCartStore((state) => state.getCleaningPotential().displayText);
}

// ============================================================================
// MOCK PRODUCTS (for development)
// ============================================================================

export const MOCK_PRODUCT: Product = {
  id: 'prod_xpixel_300ml',
  sku: 'XP-300-001',
  name: 'Xpixel Solar Panel Conditioner',
  description: 'Industrial-grade solar panel cleaning and conditioning solution with anti-static protection.',
  volumeMl: 300,
  price: 4999,  // PKR 460
  priceDisplay: 'PKR 460',
  imageUrl: '/images/product-bottle.jpg',
  inStock: true,
  stockQuantity: 500,
  isB2BEligible: true,
  minB2BQuantity: 10,
  b2bDiscountPercent: 15,
};

export const MOCK_VARIANTS: ProductVariant[] = [
  {
    id: 'var_300ml',
    volumeMl: 300,
    price: 4999,
    priceDisplay: 'PKR 460',
    label: '300ml Bottle',
  },
  {
    id: 'var_1l',
    volumeMl: 1000,
    price: 12999,
    priceDisplay: 'PKR 1534',
    label: '1L Refill',
  },
  {
    id: 'var_5l',
    volumeMl: 5000,
    price: 49999,
    priceDisplay: 'PKR 7667',
    label: '5L Commercial',
  },
];
