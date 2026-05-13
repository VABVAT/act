import type { Database, Json } from "@/lib/supabase/database.types";

export type CategoryRecord = Database["public"]["Tables"]["categories"]["Row"];
export type CouponRecord = Database["public"]["Tables"]["coupons"]["Row"];
export type PaymentRecord = Database["public"]["Tables"]["payments"]["Row"];

export type ProductImageRecord = {
  id: string;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
  isPrimary: boolean;
};

export type ProductSizeRecord = {
  id: string;
  size: string;
  quantity: number;
  inStock: boolean;
};

export type ProductRecord = {
  id: string;
  categoryId: string | null;
  category: CategoryRecord | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice: number | null;
  effectivePrice: number;
  stock: number;
  fabric: string;
  color: string;
  sku: string;
  featured: boolean;
  isActive: boolean;
  availabilityStatus: Database["public"]["Enums"]["availability_status"];
  popularityScore: number;
  deliveryInformation: string;
  returnPolicy: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImageRecord[];
  sizes: ProductSizeRecord[];
  tags: string[];
};

export type CatalogFilters = {
  availability: "all" | "in_stock" | "out_of_stock";
  maxPrice: number | null;
  minPrice: number | null;
  q: string;
  size: string;
  sort: "newest" | "price-asc" | "price-desc" | "popularity";
};

export type StorefrontHomeData = {
  featuredProducts: ProductRecord[];
  bestSellers: ProductRecord[];
  newArrivals: ProductRecord[];
};

export type CheckoutItemInput = {
  productId: string;
  quantity: number;
  selectedSize: string;
};

export type CheckoutPricedItem = {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string;
  stockAvailable: number;
};

export type CheckoutPricingResult = {
  items: CheckoutPricedItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  appliedCoupon: CouponRecord | null;
};

export type BagItemSnapshot = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  originalPrice: number | null;
  selectedSize: string;
  quantity: number;
  color: string;
  fabric: string;
  sku: string;
};

export type ShippingAddressSnapshot = {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
};

export type OrderItemRecord = {
  id: string;
  productId: string | null;
  productName: string;
  productSlug: string | null;
  productSku: string | null;
  imageUrl: string | null;
  quantity: number;
  selectedSize: string;
  price: number;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  fullName: string;
  phone: string;
  email: string;
  userId: string | null;
  subtotalAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  orderStatus: Database["public"]["Enums"]["order_status"];
  paymentStatus: Database["public"]["Enums"]["payment_status"];
  shippingAddress: ShippingAddressSnapshot;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemRecord[];
  payment: PaymentRecord | null;
};

export type AdminDashboardData = {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  topSellingProducts: Array<{
    productId: string | null;
    productName: string;
    quantitySold: number;
    productSlug: string | null;
    imageUrl: string | null;
  }>;
  recentOrders: OrderRecord[];
};

export type ProductRowWithRelations =
  Database["public"]["Tables"]["products"]["Row"] & {
    categories: CategoryRecord | null;
    product_images: Database["public"]["Tables"]["product_images"]["Row"][];
    product_sizes: Database["public"]["Tables"]["product_sizes"]["Row"][];
    product_tags: Database["public"]["Tables"]["product_tags"]["Row"][];
  };

export type OrderRowWithRelations = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items: Database["public"]["Tables"]["order_items"]["Row"][];
  payments: Database["public"]["Tables"]["payments"]["Row"][] | null;
};

export type JsonObject = Extract<Json, Record<string, Json | undefined>>;
