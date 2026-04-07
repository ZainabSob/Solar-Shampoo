/**
 * Xpixel Solar Panel Conditioner - Zod Validation Schemas
 * Industrial-grade form validation for checkout and B2B processes
 */

import { z } from 'zod';

// ============================================================================
// CHECKOUT FORM SCHEMA
// ============================================================================

export const checkoutFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[\d\s\-\(\)]{8,20}$/, 'Please enter a valid phone number'),
  
  street: z
    .string()
    .min(1, 'Street address is required')
    .min(5, 'Please enter a complete street address')
    .max(100, 'Street address must be less than 100 characters'),
  
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City name must be at least 2 characters')
    .max(50, 'City name must be less than 50 characters'),
  
  state: z
    .string()
    .min(1, 'State/Province is required')
    .min(2, 'State name must be at least 2 characters'),
  
  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .regex(/^[\w\-\s]{3,10}$/, 'Please enter a valid postal code'),
  
  country: z
    .string()
    .min(1, 'Country is required'),
  
  sameAsShipping: z.boolean().default(true),
  
  // Billing address (conditional)
  billingStreet: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPostalCode: z.string().optional(),
  billingCountry: z.string().optional(),
  
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
}).refine(
  (data) => {
    if (data.sameAsShipping) return true;
    // If not same as shipping, billing fields are required
    return (
      data.billingStreet &&
      data.billingStreet.length >= 5 &&
      data.billingCity &&
      data.billingCity.length >= 2 &&
      data.billingState &&
      data.billingState.length >= 2 &&
      data.billingPostalCode &&
      data.billingPostalCode.length >= 3 &&
      data.billingCountry
    );
  },
  {
    message: 'Billing address is required when different from shipping',
    path: ['billingStreet'],
  }
);

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>;

// ============================================================================
// B2B INQUIRY FORM SCHEMA
// ============================================================================

export const b2bInquiryFormSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  
  contactName: z
    .string()
    .min(1, 'Contact name is required')
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name must be less than 100 characters'),
  
  email: z
    .string()
    .min(1, 'Business email is required')
    .email('Please enter a valid email address'),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[\d\s\-\(\)]{8,20}$/, 'Please enter a valid phone number'),
  
  country: z
    .string()
    .min(1, 'Country is required'),
  
  businessType: z.enum(
    ['installer', 'distributor', 'reseller', 'other']
  ),
  
  estimatedMonthlyVolume: z
    .number()
    .min(1, 'Volume must be at least 1 bottle')
    .max(10000, 'Please contact us directly for volumes over 10,000 bottles'),
  
  message: z
    .string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional(),
  
  preferredContactMethod: z.enum(
    ['email', 'phone', 'whatsapp']
  ),
});

export type B2BInquiryFormSchema = z.infer<typeof b2bInquiryFormSchema>;

// ============================================================================
// QUICK QUOTE SCHEMA (Simplified B2B)
// ============================================================================

export const quickQuoteSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  quantity: z
    .number()
    .min(10, 'Minimum quantity for B2B quotes is 10 bottles')
    .max(5000, 'Please contact us directly for quantities over 5,000'),
  
  message: z
    .string()
    .max(500, 'Message must be less than 500 characters')
    .optional(),
});

export type QuickQuoteSchema = z.infer<typeof quickQuoteSchema>;

// ============================================================================
// CART ITEM SCHEMA (For validation before checkout)
// ============================================================================

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z
    .number()
    .min(1, 'Quantity must be at least 1')
    .max(999, 'Maximum quantity per item is 999'),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
});

// ============================================================================
// ORDER UPDATE SCHEMA (Admin)
// ============================================================================

export const orderStatusUpdateSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'formulating',
    'quality_check',
    'shipped',
    'delivered',
    'cancelled',
  ]),
  notes: z.string().max(500).optional(),
});

// ============================================================================
// PRODUCT SCHEMA (Admin)
// ============================================================================

export const productSchema = z.object({
  sku: z
    .string()
    .min(1, 'SKU is required')
    .regex(/^[A-Z0-9\-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens'),
  
  name: z
    .string()
    .min(1, 'Product name is required')
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must be less than 100 characters'),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  volumeMl: z
    .number()
    .min(50, 'Volume must be at least 50ml')
    .max(5000, 'Volume must be less than 5000ml'),
  
  price: z
    .number()
    .min(100, 'Price must be at least $1.00')
    .max(100000, 'Price must be less than $1,000'),
  
  stockQuantity: z
    .number()
    .min(0, 'Stock quantity cannot be negative')
    .max(100000, 'Stock quantity must be less than 100,000'),
  
  isB2BEligible: z.boolean().default(true),
  minB2BQuantity: z.number().min(1).default(10),
  b2bDiscountPercent: z.number().min(0).max(50).default(15),
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format price from cents to display string
 */
export function formatPrice(cents: number, currency = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return formatter.format(cents / 100);
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
