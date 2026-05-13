import { BagPageClient } from "@/components/cart/bag-page-client";
import { SectionHeading } from "@/components/ui/section-heading";

export default function BagPage() {
  return (
    <div className="content-wrap py-8 md:py-12">
      <SectionHeading
        description="Review sizes, update quantities, and move into a secure Razorpay checkout."
        eyebrow="Bag"
        title="Your shopping bag"
      />
      <div className="mt-8">
        <BagPageClient />
      </div>
    </div>
  );
}
