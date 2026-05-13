"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistToggleButton } from "@/components/wishlist/wishlist-toggle-button";
import type { ProductRecord } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils/currency";
import { useCartStore } from "@/stores/cart-store";

export function AddToBagPanel({
  isAuthenticated,
  isWishlisted,
  path,
  product,
}: {
  isAuthenticated: boolean;
  isWishlisted: boolean;
  path: string;
  product: ProductRecord;
}) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.find((size) => size.quantity > 0)?.size ?? "",
  );
  const [quantity, setQuantity] = useState(1);

  const availableSize = product.sizes.find((size) => size.size === selectedSize);
  const isOutOfStock = product.stock <= 0 || !availableSize || availableSize.quantity <= 0;

  const handleAdd = (redirectToCheckout = false) => {
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }

    if (isOutOfStock) {
      toast.error("This size is currently out of stock.");
      return;
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.images[0]?.imageUrl ?? "/catalog/noor-teal-main.svg",
      unitPrice: product.effectivePrice,
      originalPrice: product.discountedPrice ? product.price : null,
      selectedSize,
      quantity,
      color: product.color,
      fabric: product.fabric,
      sku: product.sku,
    });

    toast.success(redirectToCheckout ? "Taking you to checkout." : "Added to bag.");

    startTransition(() => {
      router.push(redirectToCheckout ? "/checkout" : "/bag");
    });
  };

  return (
    <div className="surface-card rounded-[28px] border border-line/70 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            {product.category?.name || "Suit set"}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-balance text-foreground md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted md:text-base">
            {product.description}
          </p>
        </div>
        <WishlistToggleButton
          initialValue={isWishlisted}
          isAuthenticated={isAuthenticated}
          path={path}
          productId={product.id}
        />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-3xl font-semibold text-foreground">
          {formatCurrency(product.effectivePrice)}
        </span>
        {product.discountedPrice ? (
          <span className="text-lg text-muted line-through">{formatCurrency(product.price)}</span>
        ) : null}
        {product.stock > 0 ? <Badge tone="success">In stock</Badge> : <Badge tone="danger">Out of stock</Badge>}
      </div>
      <div className="mt-8">
        <p className="text-sm font-semibold text-foreground">Select size</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {product.sizes.map((size) => (
            <button
              key={size.id}
              className={`inline-flex min-w-14 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold ${
                size.size === selectedSize
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-white/75 text-foreground hover:border-brand/30"
              } ${size.quantity <= 0 ? "cursor-not-allowed opacity-40" : ""}`}
              disabled={size.quantity <= 0}
              type="button"
              onClick={() => setSelectedSize(size.size)}
            >
              {size.size}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <p className="text-sm font-semibold text-foreground">Quantity</p>
        <div className="mt-3 inline-flex items-center rounded-full border border-line bg-white/75 p-1">
          <button
            className="size-10 rounded-full text-lg hover:bg-brand-soft/35"
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            -
          </button>
          <span className="inline-flex min-w-10 items-center justify-center text-sm font-semibold">
            {quantity}
          </span>
          <button
            className="size-10 rounded-full text-lg hover:bg-brand-soft/35"
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.min(current + 1, Math.max(availableSize?.quantity ?? 1, 1)),
              )
            }
          >
            +
          </button>
        </div>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Button disabled={isOutOfStock} size="lg" onClick={() => handleAdd(false)}>
          <ShoppingBag className="size-4" />
          Add to bag
        </Button>
        <Button disabled={isOutOfStock} size="lg" variant="secondary" onClick={() => handleAdd(true)}>
          Buy now
        </Button>
      </div>
      <div className="mt-8 grid gap-4 rounded-[24px] border border-line/70 bg-background-soft px-5 py-4 text-sm text-muted">
        <div>
          <p className="font-semibold text-foreground">Fabric</p>
          <p className="mt-1">{product.fabric}</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Colour</p>
          <p className="mt-1">{product.color}</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">SKU</p>
          <p className="mt-1">{product.sku}</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Delivery</p>
          <p className="mt-1">{product.deliveryInformation}</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Returns & exchange</p>
          <p className="mt-1">{product.returnPolicy}</p>
        </div>
      </div>
    </div>
  );
}
