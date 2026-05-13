"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteProductAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      disabled={isPending}
      size="sm"
      variant="danger"
      onClick={() => {
        const confirmed = window.confirm("Delete this product? This cannot be undone.");

        if (!confirmed) {
          return;
        }

        setIsPending(true);

        startTransition(async () => {
          const result = await deleteProductAction(productId);
          setIsPending(false);

          if (!result.ok) {
            toast.error(result.message || "Unable to delete product.");
            return;
          }

          toast.success("Product deleted.");
          router.refresh();
        });
      }}
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
