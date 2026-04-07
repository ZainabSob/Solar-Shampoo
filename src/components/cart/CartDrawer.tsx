/**
 * Xpixel Solar Panel Conditioner - Interactive Cart Drawer
 * Features Cleaning Potential indicator and B2B integration
 */

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useShallow } from 'zustand/react/shallow'; // Added for shallow comparison
import type { B2BInquiry } from '@/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  Droplets, 
  Zap, 
  Wind,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// CLEANING POTENTIAL INDICATOR COMPONENT
// ============================================================================

function CleaningPotentialIndicator() {
  // Use useShallow because getCleaningPotential returns a new object
  const cleaningPotential = useCartStore(useShallow((state) => state.getCleaningPotential()));
  const { totalBottles, displayText, monthsOfSupply } = cleaningPotential;

  if (totalBottles === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Droplets className="w-5 h-5 text-primary" />
        <span className="font-heading font-semibold text-sm">Cleaning Potential</span>
      </div>
      
      <p className="text-lg font-heading font-bold text-foreground mb-3">
        {displayText}
      </p>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-card rounded-xl p-2">
          <p className="text-2xl font-bold text-primary">{totalBottles}</p>
          <p className="text-xs text-muted-foreground">Bottles</p>
        </div>
        <div className="bg-card rounded-xl p-2">
          <p className="text-2xl font-bold text-primary">{cleaningPotential.totalCaps}</p>
          <p className="text-xs text-muted-foreground">Caps (5ml)</p>
        </div>
        <div className="bg-card rounded-xl p-2">
          <p className="text-2xl font-bold text-primary">{Math.round(monthsOfSupply)}</p>
          <p className="text-xs text-muted-foreground">Months</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-primary/10">
        <p className="text-xs text-muted-foreground">
          Based on 1 cap (5ml) = 5 panels formula
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// B2B BULK INQUIRY MODAL
// ============================================================================

interface B2BInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function B2BInquiryModal({ isOpen, onClose }: B2BInquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    businessType: 'installer' as const,
    estimatedMonthlyVolume: '',
    message: '',
    preferredContactMethod: 'email' as const,
  });

  // Use useShallow for computed totals
  const cartTotals = useCartStore(useShallow((state) => state.getCartTotals()));
  const totalBottles = useCartStore((state) => state.getTotalBottles());
  const addInquiry = useOrderStore((state) => state.addInquiry);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const inquiry: B2BInquiry = {
      id: `inq_${Date.now()}`,
      companyName: formData.companyName,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      businessType: formData.businessType,
      estimatedMonthlyVolume: parseInt(formData.estimatedMonthlyVolume) || totalBottles,
      message: formData.message || `Current cart: ${totalBottles} bottles`,
      preferredContactMethod: formData.preferredContactMethod,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    addInquiry(inquiry);

    toast.success('B2B inquiry submitted!', {
      description: 'Our team will contact you within 24 hours.',
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Request B2B Bulk Pricing
          </DialogTitle>
        </DialogHeader>

        <div className="bg-primary/5 rounded-xl p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">Current cart value</p>
          <p className="text-2xl font-heading font-bold">{cartTotals.totalDisplay}</p>
          <p className="text-sm text-muted-foreground">{totalBottles} bottles</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Acme Solar"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Business Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-000-0000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="United States"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => setFormData({ ...formData, businessType: value as typeof formData.businessType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="installer">Installer</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyVolume">Estimated Monthly Volume (bottles)</Label>
            <Input
              id="monthlyVolume"
              type="number"
              min="10"
              value={formData.estimatedMonthlyVolume}
              onChange={(e) => setFormData({ ...formData, estimatedMonthlyVolume: e.target.value })}
              placeholder={`${totalBottles} (current cart)`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredContact">Preferred Contact Method</Label>
            <Select
              value={formData.preferredContactMethod}
              onValueChange={(value) => setFormData({ ...formData, preferredContactMethod: value as typeof formData.preferredContactMethod })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="phone">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your business needs..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                Submit Inquiry
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// CART ITEM COMPONENT
// ============================================================================

interface CartItemRowProps {
  item: ReturnType<typeof useCartStore.getState>['items'][0];
}

function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 py-4">
      <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-16 h-16 object-contain"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{item.product.name}</h4>
        <p className="text-sm text-muted-foreground">{item.variant.label}</p>
        <p className="text-sm font-medium text-primary mt-1">{item.variant.priceDisplay}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
              className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
              className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.productId, item.variantId)}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CART DRAWER COMPONENT
// ============================================================================

export function CartDrawer() {
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [showQuoteSuccess, setShowQuoteSuccess] = useState(false);
  
  // Basic state values are fine as-is
  const items = useCartStore((state) => state.items);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const toggleB2BMode = useCartStore((state) => state.toggleB2BMode);
  const isB2BMode = useCartStore((state) => state.isB2BMode);
  const totalBottles = useCartStore((state) => state.getTotalBottles());
  const clearCart = useCartStore((state) => state.clearCart);

  // Use useShallow for any function that calculates and returns an object or result
  const isB2BEligible = useCartStore(useShallow((state) => state.isB2BEligible()));
  const b2bDiscount = useCartStore((state) => state.getB2BBulkDiscount());
  const cartTotals = useCartStore(useShallow((state) => state.getCartTotals()));

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (isB2BMode) {
      setShowQuoteSuccess(true);
      setTimeout(() => {
        setShowQuoteSuccess(false);
        clearCart();
        setCartOpen(false);
      }, 3000);
    } else {
      toast.success('Proceeding to checkout...', {
        description: 'Redirecting to payment gateway.',
      });
    }
  };

  const discountAmount = b2bDiscount > 0 ? cartTotals.subtotal * (b2bDiscount / 100) : 0;

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
        <SheetTrigger asChild>
          <button className="relative p-2 rounded-xl bg-card hover:bg-muted transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <Badge 
                variant="default" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                {itemCount}
              </Badge>
            )}
          </button>
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>Your Cart</span>
              {itemCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Add some Xpixel conditioner to get started
              </p>
              <Button onClick={() => setCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <CleaningPotentialIndicator />

                {isB2BEligible && (
                  <div className="flex items-center justify-between bg-muted rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">B2B Quote Mode</p>
                        <p className="text-xs text-muted-foreground">
                          {b2bDiscount}% bulk discount applied
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isB2BMode}
                      onCheckedChange={toggleB2BMode}
                    />
                  </div>
                )}

                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <CartItemRow key={`${item.productId}-${item.variantId}`} item={item} />
                  ))}
                </div>

                {totalBottles >= 10 && !isB2BMode && (
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Bulk order detected!</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          You qualify for B2B pricing. Request a quote for additional savings.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setIsB2BModalOpen(true)}
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          Request B2B Quote
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>

              <div className="border-t border-border pt-4 mt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{cartTotals.subtotalDisplay}</span>
                  </div>
                  
                  {b2bDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Bulk Discount ({b2bDiscount}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{cartTotals.taxDisplay}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={cartTotals.shipping === 0 ? 'text-green-600' : ''}>
                      {cartTotals.shippingDisplay}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-heading font-semibold">Total</span>
                    <span className="font-heading font-bold text-xl">{cartTotals.totalDisplay}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    {isB2BMode ? (
                      <>
                        <Wind className="w-5 h-5 mr-2" />
                        Request Quote
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Checkout
                      </>
                    )}
                  </Button>

                  {isB2BMode && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toggleB2BMode()}
                    >
                      Switch to Regular Checkout
                    </Button>
                  )}

                  <a
                    href={`https://wa.me/8613800000000?text=Hi, I'm interested in ordering ${totalBottles} bottles of Xpixel. Can you help me?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp for quick support
                  </a>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <B2BInquiryModal isOpen={isB2BModalOpen} onClose={() => setIsB2BModalOpen(false)} />

      <Dialog open={showQuoteSuccess} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl">Quote Requested!</DialogTitle>
          <DialogDescription>
            Our B2B team will contact you within 24 hours with your customized quote.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function CartBadge() {
  const itemCount = useCartStore((state) => 
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="relative p-2 rounded-xl bg-card hover:bg-muted transition-colors"
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <Badge 
          variant="default" 
          className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </button>
  );
}