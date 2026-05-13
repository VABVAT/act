import "server-only";

import { deliveryFee } from "@/lib/constants/commerce";
import type { CheckoutItemInput, CheckoutPricingResult } from "@/lib/data/types";
import { getCouponByCode, getProductsByIds } from "@/lib/data/products";

export async function priceCheckoutItems(
  items: CheckoutItemInput[],
  couponCode?: string,
): Promise<CheckoutPricingResult> {
  const products = await getProductsByIds(items.map((item) => item.productId));
  const productMap = new Map(products.map((product) => [product.id, product]));

  const pricedItems = items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error("One of the selected products is no longer available.");
    }

    const selectedSize = product.sizes.find((size) => size.size === item.selectedSize);

    if (!selectedSize || selectedSize.quantity <= 0) {
      throw new Error(`Size ${item.selectedSize} is no longer available for ${product.name}.`);
    }

    if (selectedSize.quantity < item.quantity) {
      throw new Error(`Only ${selectedSize.quantity} pieces are left for ${product.name}.`);
    }

    return {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      unitPrice: product.effectivePrice,
      lineTotal: product.effectivePrice * item.quantity,
      imageUrl: product.images[0]?.imageUrl ?? "/catalog/noor-teal-main.svg",
      stockAvailable: selectedSize.quantity,
    };
  });

  const subtotal = pricedItems.reduce((total, item) => total + item.lineTotal, 0);
  const shipping = deliveryFee;
  const coupon = couponCode ? await getCouponByCode(couponCode) : null;

  let discountAmount = 0;

  if (coupon && subtotal >= coupon.minimum_order_amount) {
    if (coupon.discount_type === "percentage") {
      discountAmount = (subtotal * coupon.value) / 100;
    } else {
      discountAmount = coupon.value;
    }

    if (coupon.maximum_discount_amount !== null) {
      discountAmount = Math.min(discountAmount, coupon.maximum_discount_amount);
    }
  }

  const total = Math.max(subtotal + shipping - discountAmount, 0);

  return {
    items: pricedItems,
    subtotal,
    deliveryFee: shipping,
    discountAmount,
    total,
    appliedCoupon: discountAmount > 0 ? coupon : null,
  };
}
