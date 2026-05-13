"use client";

import { useCartStore } from "@/stores/cart-store";

export function CartCount() {
  const items = useCartStore((state) => state.items);
  const hydrated = useCartStore((state) => state.hydrated);
  const count = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-[11px] font-semibold text-white">
      {hydrated ? count : 0}
    </span>
  );
}
