"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { deliveryFee } from "@/lib/constants/commerce";
import { formatCurrency } from "@/lib/utils/currency";
import { getCartSubtotal, useCartStore } from "@/stores/cart-store";

export function BagPageClient() {
  const items = useCartStore((state) => state.items);
  const hydrated = useCartStore((state) => state.hydrated);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  if (hydrated && items.length === 0) {
    return (
      <EmptyState
        title="Your bag is empty"
        description="Add a few favourites to your bag and come back here to review your order summary."
        action={
          <Link
            href="/shop"
            className="inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
          >
            Start shopping
          </Link>
        }
      />
    );
  }

  const subtotal = getCartSubtotal(items);
  const shipping = deliveryFee;
  const total = subtotal + shipping;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="grid gap-4">
        {items.map((item) => (
          <Card key={`${item.productId}-${item.selectedSize}`} className="grid gap-4 sm:grid-cols-[150px_1fr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-background-soft">
              <Image
                alt={item.name}
                className="object-cover"
                fill
                sizes="150px"
                src={item.imageUrl}
              />
            </div>
            <div className="grid gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link href={`/shop/${item.slug}`} className="text-lg font-semibold text-foreground hover:text-brand-strong">
                    {item.name}
                  </Link>
                  <p className="mt-2 text-sm text-muted">
                    {item.fabric} • {item.color}
                  </p>
                  <p className="mt-1 text-sm text-muted">Size {item.selectedSize}</p>
                </div>
                <button
                  className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-white/80 text-muted hover:border-brand/30 hover:text-foreground"
                  type="button"
                  onClick={() => removeItem(item.productId, item.selectedSize)}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center rounded-full border border-line bg-background-soft p-1">
                  <button
                    className="inline-flex size-9 items-center justify-center rounded-full hover:bg-brand-soft/35"
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.selectedSize,
                        Math.max(1, item.quantity - 1),
                      )
                    }
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="inline-flex min-w-10 items-center justify-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    className="inline-flex size-9 items-center justify-center rounded-full hover:bg-brand-soft/35"
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.selectedSize, item.quantity + 1)
                    }
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </p>
                  {item.originalPrice ? (
                    <p className="text-sm text-muted line-through">
                      {formatCurrency(item.originalPrice * item.quantity)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>
      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <Card className="grid gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
              Order summary
            </p>
            <h2 className="mt-3 font-display text-4xl leading-none text-foreground">
              Review your bag
            </h2>
          </div>
          <div className="grid gap-3 text-sm text-muted">
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
            <div className="flex items-center justify-between border-t border-line pt-3">
              <span>Total</span>
              <span className="text-lg font-semibold text-foreground">{formatCurrency(total)}</span>
            </div>
          </div>
          <p className="rounded-2xl bg-brand-soft/35 px-4 py-3 text-sm text-muted">
            Free delivery is included on every order, anywhere in India.
          </p>
          <Link
            href="/checkout"
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-base font-semibold text-white shadow-[0_20px_60px_rgba(154,79,56,0.28)] hover:bg-brand-strong"
          >
            Continue to checkout
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-white px-6 text-base font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
          >
            Keep shopping
          </Link>
        </Card>
      </aside>
    </div>
  );
}
