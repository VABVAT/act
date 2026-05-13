"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { BagItemSnapshot as CartItem } from "@/lib/data/types";

type CartStore = {
  couponCode: string;
  hydrated: boolean;
  items: CartItem[];
  addItem: (item: CartItem) => void;
  clear: () => void;
  removeItem: (productId: string, selectedSize: string) => void;
  setCouponCode: (couponCode: string) => void;
  setHydrated: (hydrated: boolean) => void;
  setItems: (items: CartItem[]) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
};

export function getCartItemKey(item: { productId: string; selectedSize: string }) {
  return `${item.productId}::${item.selectedSize}`;
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

export function mergeCartItems(primary: CartItem[], secondary: CartItem[]) {
  const merged = new Map<string, CartItem>();

  [...primary, ...secondary].forEach((item) => {
    const key = getCartItemKey(item);
    const existing = merged.get(key);

    if (existing) {
      merged.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
      return;
    }

    merged.set(key, item);
  });

  return [...merged.values()];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      couponCode: "",
      hydrated: false,
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (entry) =>
              entry.productId === item.productId &&
              entry.selectedSize === item.selectedSize,
          );

          if (!existing) {
            return {
              items: [...state.items, item],
            };
          }

          return {
            items: state.items.map((entry) =>
              entry.productId === item.productId &&
              entry.selectedSize === item.selectedSize
                ? {
                    ...entry,
                    quantity: entry.quantity + item.quantity,
                  }
                : entry,
            ),
          };
        }),
      clear: () => set({ couponCode: "", items: [] }),
      removeItem: (productId, selectedSize) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.selectedSize === selectedSize),
          ),
        })),
      setCouponCode: (couponCode) => set({ couponCode }),
      setHydrated: (hydrated) => set({ hydrated }),
      setItems: (items) => set({ items }),
      updateQuantity: (productId, selectedSize, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId && item.selectedSize === selectedSize
                ? {
                    ...item,
                    quantity,
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
    }),
    {
      name: "arteez-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        couponCode: state.couponCode,
        items: state.items,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
