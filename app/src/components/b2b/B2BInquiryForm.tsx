/**
 * Xpixel Solar Panel Conditioner - B2B Inquiry Form
 * Comprehensive wholesale pricing request with Zod validation
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { b2bInquiryFormSchema, type B2BInquiryFormSchema } from '@/schemas';
import { useOrderStore } from '@/store/useOrderStore';
import type { B2BInquiry } from '@/types';

import { Button } from '@/components/ui/button';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Mail,
  Phone,
  MessageCircle,
  Package,
  Send,
  CheckCircle2,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// B2B BENEFITS DATA
// ============================================================================

const B2B_BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Volume Discounts',
    description: 'Save up to 30% on bulk orders',
  },
  {
    icon: Zap,
    title: 'Priority Shipping',
    description: 'Express delivery for urgent orders',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Personal account manager',
  },
  {
    icon: Package,
    title: 'Custom Labeling',
    description: 'White-label options available',
  },
];

const VOLUME_TIERS = [
  { min: 10, discount: 15, label: '10-24 bottles', color: 'bg-blue-500' },
  { min: 25, discount: 20, label: '25-49 bottles', color: 'bg-indigo-500' },
  { min: 50, discount: 25, label: '50-99 bottles', color: 'bg-purple-500' },
  { min: 100, discount: 30, label: '100+ bottles', color: 'bg-primary' },
];

// ============================================================================
// MAIN B2B INQUIRY FORM COMPONENT
// ============================================================================

interface B2BInquiryFormProps {
  onSuccess?: () => void;
  embedded?: boolean;
}

export function B2BInquiryForm({ onSuccess, embedded = false }: B2BInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const addInquiry = useOrderStore((state) => state.addInquiry);

  const form = useForm<B2BInquiryFormSchema>({
    resolver: zodResolver(b2bInquiryFormSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      country: '',
      businessType: 'installer',
      estimatedMonthlyVolume: 25,
      message: '',
      preferredContactMethod: 'email',
    },
  });

  const onSubmit = async (data: B2BInquiryFormSchema) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const inquiry: B2BInquiry = {
      id: `inq_${Date.now()}`,
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      businessType: data.businessType,
      estimatedMonthlyVolume: data.estimatedMonthlyVolume,
      message: data.message,
      preferredContactMethod: data.preferredContactMethod,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    addInquiry(inquiry);

    toast.success('B2B inquiry submitted successfully!', {
      description: 'Our team will contact you within 24 hours.',
    });

    setIsSubmitting(false);
    setIsSuccess(true);

    if (onSuccess) {
      onSuccess();
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="font-heading text-2xl font-bold mb-3">
            Inquiry Submitted!
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Thank you for your interest in Xpixel B2B partnership. Our wholesale team will review your inquiry and contact you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setIsSuccess(false)} variant="outline">
              Submit Another Inquiry
            </Button>
            <Button onClick={() => window.location.href = '/'}>
              Return to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Left Column - Benefits & Tiers */}
      {!embedded && (
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">
              B2B Partnership Benefits
            </h3>
            <div className="space-y-4">
              {B2B_BENEFITS.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{benefit.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-heading text-lg font-bold mb-4">
              Volume Discount Tiers
            </h3>
            <div className="space-y-3">
              {VOLUME_TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className="flex items-center justify-between p-3 bg-muted rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${tier.color}`} />
                    <span className="text-sm">{tier.label}</span>
                  </div>
                  <Badge variant="secondary">{tier.discount}% off</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right Column - Form */}
      <div className={embedded ? 'lg:col-span-5' : 'lg:col-span-3'}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Request Wholesale Pricing
            </CardTitle>
            <CardDescription>
              Fill out the form below and our B2B team will get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Company Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Company Information
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Acme Solar Inc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="installer">
                                Solar Installer
                              </SelectItem>
                              <SelectItem value="distributor">
                                Distributor
                              </SelectItem>
                              <SelectItem value="reseller">
                                Reseller
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="United States"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Contact Information
                  </h4>

                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+1 555-000-0000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="preferredContactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Volume Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Volume Requirements
                  </h4>

                  <FormField
                    control={form.control}
                    name="estimatedMonthlyVolume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Monthly Volume (bottles) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={10}
                            placeholder="25"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Volume Preview */}
                  {form.watch('estimatedMonthlyVolume') >= 10 && (
                    <div className="p-4 bg-primary/5 rounded-xl">
                      <p className="text-sm font-medium mb-2">
                        Estimated Discount
                      </p>
                      <div className="flex items-center gap-2">
                        {VOLUME_TIERS.map((tier) => {
                          const volume = form.watch('estimatedMonthlyVolume');
                          const isActive =
                            volume >= tier.min &&
                            (tier.min === 100 || volume < (VOLUME_TIERS.find((t) => t.min > tier.min)?.min || Infinity));
                          return (
                            <div
                              key={tier.label}
                              className={`flex-1 h-2 rounded-full transition-colors ${
                                isActive ? tier.color : 'bg-muted'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-lg font-bold text-primary mt-2">
                        {VOLUME_TIERS.find(
                          (t) => {
                            const volume = form.watch('estimatedMonthlyVolume');
                            return volume >= t.min && 
                              (t.min === 100 || volume < (VOLUME_TIERS.find((tier) => tier.min > t.min)?.min || Infinity));
                          }
                        )?.discount || 15}
                        % off retail price
                      </p>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your business, specific requirements, or any questions..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit B2B Inquiry
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">
                    B2B Terms
                  </a>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Become a B2B Partner
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our network of solar professionals and enjoy exclusive wholesale pricing, priority support, and custom solutions.
          </p>
        </div>
        {content}
      </div>
    </div>
  );
}

// ============================================================================
// QUICK QUOTE FORM (Simplified version for cart)
// ============================================================================

interface QuickQuoteFormProps {
  defaultQuantity?: number;
  onSubmit?: (data: { email: string; quantity: number; message?: string }) => void;
}

export function QuickQuoteForm({ defaultQuantity = 10, onSubmit }: QuickQuoteFormProps) {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, quantity, message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="quick-email">Email *</Label>
        <Input
          id="quick-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      <div>
        <Label htmlFor="quick-quantity">Quantity (bottles) *</Label>
        <Input
          id="quick-quantity"
          type="number"
          min={10}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 10)}
          required
        />
      </div>
      <div>
        <Label htmlFor="quick-message">Message (Optional)</Label>
        <Textarea
          id="quick-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Any specific requirements..."
          rows={2}
        />
      </div>
      <Button type="submit" className="w-full">
        <Send className="w-4 h-4 mr-2" />
        Get Quote
      </Button>
    </form>
  );
}
