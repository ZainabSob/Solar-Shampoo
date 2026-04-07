/**
 * Xpixel Solar Panel Conditioner - Admin Dashboard
 * High-density operations dashboard with SOP-01 production alignment
 */

import { useState } from 'react';
import { useOrderStore, useOrderStats, useBatchRequirements } from '@/store/useOrderStore';
import type { Order, OrderStatus, B2BInquiry } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  FlaskConical,
  Droplet,
  Wind,
  Search,
  Filter,
  Beaker,
  Factory,
  DollarSign,
  MapPin,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// STATUS CONFIGURATION
// ============================================================================

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500', icon: CheckCircle2 },
  processing: { label: 'Processing', color: 'bg-indigo-500', icon: Package },
  formulating: { label: 'Formulating', color: 'bg-purple-500', icon: FlaskConical },
  quality_check: { label: 'QC Check', color: 'bg-pink-500', icon: CheckCircle2 },
  shipped: { label: 'Shipped', color: 'bg-cyan-500', icon: Package },
  delivered: { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: AlertCircle },
};

const CUSTOMER_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  retail: { label: 'Retail', color: 'bg-blue-500' },
  b2b: { label: 'B2B', color: 'bg-purple-500' },
  distributor: { label: 'Distributor', color: 'bg-primary' },
};

// ============================================================================
// STATS CARD COMPONENT
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof LayoutDashboard;
  trend?: { value: number; positive: boolean };
  alert?: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, alert }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-heading font-bold mt-2">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-3 h-3" />
                {trend.value}% {trend.positive ? 'increase' : 'decrease'}
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert ? 'bg-red-100' : 'bg-primary/10'}`}>
            <Icon className={`w-6 h-6 ${alert ? 'text-red-600' : 'text-primary'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ORDER DETAILS DIALOG
// ============================================================================

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

function OrderDetailsDialog({ order, isOpen, onClose }: OrderDetailsDialogProps) {
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  if (!order) return null;

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus);
    toast.success(`Order status updated to ${STATUS_CONFIG[newStatus].label}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Order {order.orderNumber}</span>
            <Badge className={STATUS_CONFIG[order.status].color}>
              {STATUS_CONFIG[order.status].label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-xl">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Customer
              </h4>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
              <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
              <Badge className={`mt-2 ${CUSTOMER_TYPE_CONFIG[order.customerType].color}`}>
                {CUSTOMER_TYPE_CONFIG[order.customerType].label}
              </Badge>
            </div>

            <div className="p-4 bg-muted rounded-xl">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping Address
              </h4>
              <p className="font-medium">{order.shippingAddress.name}</p>
              {order.shippingAddress.company && (
                <p className="text-sm text-muted-foreground">{order.shippingAddress.company}</p>
              )}
              <p className="text-sm text-muted-foreground">{order.shippingAddress.street}</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-sm text-muted-foreground">{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-medium text-sm mb-3">Order Items</h4>
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.variantLabel}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.unitPriceDisplay}</TableCell>
                      <TableCell className="text-right">{item.totalPriceDisplay}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Cleaning Potential */}
          <div className="p-4 bg-primary/5 rounded-xl">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-primary" />
              Cleaning Potential
            </h4>
            <p className="text-lg font-heading font-bold">{order.cleaningPotential.displayText}</p>
            <div className="grid grid-cols-3 gap-4 mt-3 text-center">
              <div>
                <p className="text-xl font-bold">{order.cleaningPotential.totalBottles}</p>
                <p className="text-xs text-muted-foreground">Bottles</p>
              </div>
              <div>
                <p className="text-xl font-bold">{order.cleaningPotential.totalCaps}</p>
                <p className="text-xs text-muted-foreground">Caps (5ml)</p>
              </div>
              <div>
                <p className="text-xl font-bold">{order.cleaningPotential.monthsOfSupply}</p>
                <p className="text-xs text-muted-foreground">Months Supply</p>
              </div>
            </div>
          </div>

          {/* Order Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{order.totals.subtotalDisplay}</span>
            </div>
            {order.bulkDiscountApplied && order.bulkDiscountApplied > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Bulk Discount ({order.bulkDiscountApplied}%)</span>
                <span>
                  -
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format((order.totals.subtotal * order.bulkDiscountApplied) / 100 / 100)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{order.totals.taxDisplay}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.totals.shippingDisplay}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-heading font-bold text-lg">
              <span>Total</span>
              <span>{order.totals.totalDisplay}</span>
            </div>
          </div>

          {/* Update Status */}
          <div>
            <Label htmlFor="status-update">Update Status</Label>
            <Select value={order.status} onValueChange={(v) => handleStatusChange(v as OrderStatus)}>
              <SelectTrigger id="status-update" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.color}`} />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// PRODUCTION SYNC PANEL
// ============================================================================

function ProductionSyncPanel() {
  const batchRequirements = useBatchRequirements();
  const pendingOrders = useOrderStore((state) => state.getPendingOrders());

  if (batchRequirements.totalPendingOrders === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-primary" />
            Production Sync (SOP-01)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No pending orders requiring production</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const rawMaterials = batchRequirements.rawMaterialsNeeded;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Factory className="w-5 h-5 text-primary" />
          Production Sync (SOP-01)
        </CardTitle>
        <CardDescription>
          Batch requirements calculated from {batchRequirements.totalPendingOrders} pending orders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted rounded-xl text-center">
            <p className="text-2xl font-bold">{batchRequirements.totalBottlesNeeded}</p>
            <p className="text-xs text-muted-foreground">Bottles Needed</p>
          </div>
          <div className="p-4 bg-muted rounded-xl text-center">
            <p className="text-2xl font-bold">{batchRequirements.concentrateVolumeLiters}L</p>
            <p className="text-xs text-muted-foreground">Concentrate</p>
          </div>
          <div className="p-4 bg-muted rounded-xl text-center">
            <p className="text-2xl font-bold">{batchRequirements.estimatedProductionTime}h</p>
            <p className="text-xs text-muted-foreground">Est. Production</p>
          </div>
          <div className="p-4 bg-muted rounded-xl text-center">
            <p className="text-2xl font-bold">{pendingOrders.length}</p>
            <p className="text-xs text-muted-foreground">Pending Orders</p>
          </div>
        </div>

        {/* Bottles by Size */}
        <div>
          <h4 className="font-medium text-sm mb-3">Bottles by Size</h4>
          <div className="space-y-2">
            {Object.entries(batchRequirements.bottlesBySize).map(([size, count]) => (
              <div key={size} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <span className="text-sm">{size} bottles</span>
                <Badge variant="secondary">{count} units</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Raw Materials */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Beaker className="w-4 h-4" />
            Raw Materials Required (SOP-01 Formula)
          </h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 bg-primary/5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Surfactant</span>
              </div>
              <p className="text-xl font-bold">{rawMaterials.surfactant} kg</p>
              <p className="text-xs text-muted-foreground">8% concentrate ratio</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Silicone Emulsion</span>
              </div>
              <p className="text-xl font-bold">{rawMaterials.siliconeEmulsion} kg</p>
              <p className="text-xs text-muted-foreground">5% concentrate ratio</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Sodium Gluconate</span>
              </div>
              <p className="text-xl font-bold">{rawMaterials.sodiumGluconate} kg</p>
              <p className="text-xs text-muted-foreground">3% concentrate ratio</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Deionized Water</span>
              </div>
              <p className="text-xl font-bold">{rawMaterials.deionizedWater} L</p>
              <p className="text-xs text-muted-foreground">84% concentrate ratio</p>
            </div>
          </div>
        </div>

        {/* Production Timeline */}
        <div>
          <h4 className="font-medium text-sm mb-3">Production Timeline</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Raw Material Preparation</p>
                <Progress value={100} className="h-2 mt-1" />
              </div>
              <span className="text-xs text-muted-foreground">~30 min</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/60 flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Formulation & Mixing</p>
                <Progress value={0} className="h-2 mt-1" />
              </div>
              <span className="text-xs text-muted-foreground">
                ~{Math.round(batchRequirements.estimatedProductionTime * 0.6)}h
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Bottling & Packaging</p>
                <Progress value={0} className="h-2 mt-1" />
              </div>
              <span className="text-xs text-muted-foreground">
                ~{Math.round(batchRequirements.estimatedProductionTime * 0.4)}h
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ORDER TRACKER COMPONENT
// ============================================================================

function OrderTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const orders = useOrderStore((state) => state.getFilteredOrders());

  // Apply filters
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (customerTypeFilter !== 'all' && order.customerType !== customerTypeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <SelectItem key={status} value={status}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <Users className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(CUSTOMER_TYPE_CONFIG).map(([type, config]) => (
                <SelectItem key={type} value={type}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={CUSTOMER_TYPE_CONFIG[order.customerType].color}>
                      {CUSTOMER_TYPE_CONFIG[order.customerType].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.cleaningPotential.totalVolumeMl >= 1000
                      ? `${(order.cleaningPotential.totalVolumeMl / 1000).toFixed(1)}L`
                      : `${order.cleaningPotential.totalVolumeMl}ml`}
                  </TableCell>
                  <TableCell className="font-medium">{order.totals.totalDisplay}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[order.status].color}`} />
                      <span className="text-sm">{STATUS_CONFIG[order.status].label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}

// ============================================================================
// B2B INQUIRIES COMPONENT
// ============================================================================

function B2BInquiries() {
  const inquiries = useOrderStore((state) => state.inquiries);
  const updateInquiryStatus = useOrderStore((state) => state.updateInquiryStatus);

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500',
    qualified: 'bg-indigo-500',
    quoted: 'bg-purple-500',
    converted: 'bg-green-500',
    lost: 'bg-red-500',
  };

  return (
    <div className="space-y-4">
      <Card>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{inquiry.companyName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{inquiry.businessType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{inquiry.contactName}</p>
                      <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{inquiry.estimatedMonthlyVolume} bottles/mo</TableCell>
                  <TableCell className="capitalize">{inquiry.preferredContactMethod}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[inquiry.status]}>
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={inquiry.status}
                      onValueChange={(v) => updateInquiryStatus(inquiry.id, v as B2BInquiry['status'])}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN ADMIN DASHBOARD
// ============================================================================

export function AdminDashboard() {
  const stats = useOrderStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-lg">Xpixel Admin</h1>
                <p className="text-xs text-muted-foreground">Operations Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System Online
              </Badge>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                Exit Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            subtitle="All time"
            icon={ShoppingCart}
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenueDisplay}
            subtitle="Lifetime sales"
            icon={DollarSign}
            trend={{ value: 8, positive: true }}
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            subtitle="Awaiting fulfillment"
            icon={Clock}
          />
          <StatCard
            title="B2B Inquiries"
            value={stats.b2bInquiries}
            subtitle="New leads"
            icon={Building2}
            alert={stats.b2bInquiries > 5}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="production" className="flex items-center gap-2">
              <Factory className="w-4 h-4" />
              <span className="hidden sm:inline">Production</span>
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">B2B Inquiries</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">Order Tracker</h2>
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
            </div>
            <OrderTracker />
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">Production Sync</h2>
              <Badge variant="outline">SOP-01 Compliant</Badge>
            </div>
            <ProductionSyncPanel />
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">B2B Inquiries</h2>
              <Button variant="outline" size="sm">
                Export Leads
              </Button>
            </div>
            <B2BInquiries />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default AdminDashboard;
