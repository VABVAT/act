"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { deliveryFee } from "@/lib/constants/commerce";
import { formatCurrency } from "@/lib/utils/currency";
import { getCartSubtotal, useCartStore } from "@/stores/cart-store";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

async function loadRazorpayScript() {
  if (window.Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutPageClient({
  defaultEmail = "",
  defaultName = "",
  defaultPhone = "",
}: {
  defaultEmail?: string;
  defaultName?: string;
  defaultPhone?: string;
}) {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clear);
  const couponCode = useCartStore((state) => state.couponCode);
  const items = useCartStore((state) => state.items);
  const setCouponCode = useCartStore((state) => state.setCouponCode);
  const subtotal = getCartSubtotal(items);
  const shipping = deliveryFee;
  const estimatedTotal = subtotal + shipping;
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your bag is empty"
        description="Add products to your bag before moving into checkout."
        action={
          <Link
            href="/shop"
            className="inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
          >
            Shop collection
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          setIsSubmitting(true);

          const formData = new FormData(event.currentTarget);
          const shippingAddress = {
            fullName: String(formData.get("fullName") || ""),
            phone: String(formData.get("phone") || ""),
            email: String(formData.get("email") || ""),
            addressLine1: String(formData.get("addressLine1") || ""),
            addressLine2: String(formData.get("addressLine2") || ""),
            state: String(formData.get("state") || ""),
            city: String(formData.get("city") || ""),
            pincode: String(formData.get("pincode") || ""),
            landmark: String(formData.get("landmark") || ""),
          };

          startTransition(async () => {
            try {
              const orderResponse = await fetch("/api/checkout/create-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  shippingAddress,
                  items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    selectedSize: item.selectedSize,
                  })),
                  couponCode: couponCode || undefined,
                }),
              });

              const orderPayload = await orderResponse.json();

              if (!orderResponse.ok) {
                toast.error(orderPayload.message || "Unable to start checkout.");
                setIsSubmitting(false);
                return;
              }

              const scriptLoaded = await loadRazorpayScript();

              if (!scriptLoaded || !window.Razorpay) {
                toast.error("Unable to load Razorpay checkout.");
                setIsSubmitting(false);
                return;
              }

              const razorpay = new window.Razorpay({
                key: orderPayload.keyId,
                amount: orderPayload.amountInSubunits,
                currency: orderPayload.currency,
                name: "Arteez Collection",
                description: `Order ${orderPayload.orderNumber}`,
                order_id: orderPayload.razorpayOrderId,
                prefill: {
                  name: shippingAddress.fullName,
                  email: shippingAddress.email,
                  contact: shippingAddress.phone,
                },
                theme: {
                  color: "#9A4F38",
                },
                handler: async (response: {
                  razorpay_order_id: string;
                  razorpay_payment_id: string;
                  razorpay_signature: string;
                }) => {
                  const verifyResponse = await fetch("/api/checkout/verify-payment", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      orderId: orderPayload.orderId,
                      razorpayOrderId: response.razorpay_order_id,
                      razorpayPaymentId: response.razorpay_payment_id,
                      razorpaySignature: response.razorpay_signature,
                    }),
                  });

                  const verifyPayload = await verifyResponse.json();

                  if (!verifyResponse.ok) {
                    toast.error(verifyPayload.message || "Payment verification failed.");
                    setIsSubmitting(false);
                    return;
                  }

                  clearCart();
                  toast.success("Payment successful.");
                  router.push(verifyPayload.redirectTo || `/orders/${verifyPayload.orderNumber}`);
                },
                modal: {
                  ondismiss: async () => {
                    await fetch("/api/checkout/payment-failure", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        orderId: orderPayload.orderId,
                        reason: "Checkout dismissed before payment completed",
                      }),
                    });
                    setIsSubmitting(false);
                  },
                },
              });

              razorpay.open();
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Unable to continue with checkout.",
              );
              setIsSubmitting(false);
            }
          });
        }}
      >
        <Card className="grid gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
              Delivery details
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none text-foreground">
              Checkout
            </h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Full name">
              <Input defaultValue={defaultName} name="fullName" required />
            </FormField>
            <FormField label="Phone number">
              <Input defaultValue={defaultPhone} name="phone" required type="tel" />
            </FormField>
            <FormField label="Email">
              <Input defaultValue={defaultEmail} name="email" required type="email" />
            </FormField>
            <FormField label="State">
              <Input name="state" required />
            </FormField>
            <FormField label="City">
              <Input name="city" required />
            </FormField>
            <FormField label="Pincode">
              <Input name="pincode" required type="text" />
            </FormField>
          </div>
          <FormField label="Address">
            <Textarea name="addressLine1" required />
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Apartment / area (optional)">
              <Input name="addressLine2" />
            </FormField>
            <FormField label="Landmark (optional)">
              <Input name="landmark" />
            </FormField>
          </div>
        </Card>
        <Card className="grid gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Coupon code</p>
              <p className="text-sm text-muted">Optional. Applied when the order is created.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              placeholder="ARTEEZ10"
            />
          </div>
        </Card>
        <div className="flex justify-end">
          <Button disabled={isSubmitting} size="lg" type="submit">
            {isSubmitting ? "Processing..." : "Pay securely with Razorpay"}
          </Button>
        </div>
      </form>
      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <Card className="grid gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
              Order summary
            </p>
            <h2 className="mt-3 font-display text-4xl leading-none text-foreground">
              Before payment
            </h2>
          </div>
          <div className="grid gap-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.selectedSize}`}
                className="flex items-center justify-between gap-4 rounded-2xl bg-background-soft px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted">
                    {item.selectedSize} • Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 border-t border-line pt-3 text-sm text-muted">
            <div className="flex items-center justify-between">
              <span>Product total</span>
              <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span className="font-semibold text-foreground">
                {shipping === 0 ? "Free across India" : formatCurrency(shipping)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Coupon</span>
              <span className="font-semibold text-foreground">
                {couponCode ? "Applied on order creation" : "None"}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <span>Total estimate</span>
              <span className="text-lg font-semibold text-foreground">
                {formatCurrency(estimatedTotal)}
              </span>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
