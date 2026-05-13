import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="content-wrap py-24">
      <EmptyState
        title="We couldn't find that page"
        description="The link may have moved, or the product you're looking for is no longer available."
        action={
          <Link
            href="/shop"
            className="inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
          >
            Continue shopping
          </Link>
        }
      />
    </div>
  );
}
