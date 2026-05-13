"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type RecentProduct = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice: number | null;
};

type RecentProductsStore = {
  items: RecentProduct[];
  add: (item: RecentProduct) => void;
};

export const useRecentProductsStore = create<RecentProductsStore>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const deduped = state.items.filter(
            (entry) => entry.productId !== item.productId,
          );

          return {
            items: [item, ...deduped].slice(0, 6),
          };
        }),
    }),
    {
      name: "arteez-recent-products",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
