export const standardSizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const deliveryFee = 149;
export const freeDeliveryThreshold = 5999;

export const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
  { value: "popularity", label: "Popularity" },
] as const;

export const availabilityOptions = [
  { value: "all", label: "All stock" },
  { value: "in_stock", label: "In stock" },
  { value: "out_of_stock", label: "Out of stock" },
] as const;

export const orderStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const orderStatusLabelMap = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
} as const;

export const paymentStatusLabelMap = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
} as const;
