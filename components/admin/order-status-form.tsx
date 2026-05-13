"use client";

import { startTransition, useState } from "react";
import { toast } from "sonner";

import { updateOrderStatusAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { orderStatusOptions } from "@/lib/constants/commerce";

export function OrderStatusForm({
  orderId,
  orderStatus,
}: {
  orderId: string;
  orderStatus: string;
}) {
  const [value, setValue] = useState(orderStatus);
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={value} onChange={(event) => setValue(event.target.value)}>
        {orderStatusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Button
        disabled={isPending}
        size="sm"
        onClick={() => {
          setIsPending(true);
          startTransition(async () => {
            const result = await updateOrderStatusAction({
              orderId,
              orderStatus: value,
            });
            setIsPending(false);

            if (!result.ok) {
              toast.error(result.message || "Unable to update order.");
              return;
            }

            toast.success("Order updated.");
          });
        }}
      >
        {isPending ? "Saving..." : "Save status"}
      </Button>
    </div>
  );
}
