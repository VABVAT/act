"use client";

import { useEffect, useEffectEvent, useRef } from "react";

import { replaceCartAction } from "@/app/actions/cart";
import type { BagItemSnapshot } from "@/lib/data/types";
import {
  mergeCartItems,
  useCartStore,
} from "@/stores/cart-store";

type CartSyncBridgeProps = {
  userId: string | null;
  serverItems: BagItemSnapshot[];
};

export function CartSyncBridge({ userId, serverItems }: CartSyncBridgeProps) {
  const hydrated = useCartStore((state) => state.hydrated);
  const items = useCartStore((state) => state.items);
  const setItems = useCartStore((state) => state.setItems);
  const hasMergedRef = useRef(false);
  const lastSyncedSignature = useRef("");

  const syncCart = useEffectEvent(async (nextItems: BagItemSnapshot[]) => {
    if (!userId) {
      return;
    }

    const signature = JSON.stringify(
      nextItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
      })),
    );

    if (signature === lastSyncedSignature.current) {
      return;
    }

    lastSyncedSignature.current = signature;
    await replaceCartAction(
      nextItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
      })),
    );
  });

  useEffect(() => {
    if (!hydrated || !userId || hasMergedRef.current) {
      return;
    }

    const mergedItems = mergeCartItems(serverItems, items);
    hasMergedRef.current = true;
    setItems(mergedItems);
    void syncCart(mergedItems);
  }, [hydrated, items, serverItems, setItems, userId]);

  useEffect(() => {
    if (!hydrated || !userId || !hasMergedRef.current) {
      return;
    }

    void syncCart(items);
  }, [hydrated, items, userId]);

  return null;
}
