"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { toggleWishlistAction } from "@/app/actions/wishlist";
import { cn } from "@/lib/utils/cn";

export function WishlistToggleButton({
  className,
  initialValue = false,
  isAuthenticated,
  path = "/shop",
  productId,
}: {
  className?: string;
  initialValue?: boolean;
  isAuthenticated: boolean;
  path?: string;
  productId: string;
}) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(initialValue);
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-line bg-white/82 text-foreground shadow-sm hover:border-brand/30 hover:bg-brand-soft/35",
        className,
      )}
      disabled={isPending}
      type="button"
      onClick={() => {
        if (!isAuthenticated) {
          router.push(`/login?next=${encodeURIComponent(path)}`);
          return;
        }

        const nextValue = !isWishlisted;
        setIsPending(true);
        setIsWishlisted(nextValue);

        startTransition(async () => {
          const result = await toggleWishlistAction({
            productId,
            shouldAdd: nextValue,
            path,
          });

          setIsPending(false);

          if (!result.ok) {
            setIsWishlisted(!nextValue);
            if (result.requiresAuth) {
              router.push(`/login?next=${encodeURIComponent(path)}`);
              return;
            }

            toast.error(result.message || "Unable to update wishlist.");
            return;
          }

          toast.success(result.message || "Wishlist updated.");
        });
      }}
    >
      <Heart
        className={cn("size-4", isWishlisted && "fill-current text-brand")}
      />
    </button>
  );
}
