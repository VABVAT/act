import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/session";

export default async function CheckoutPage() {
  const [user, profile] = await Promise.all([getCurrentUser(), getCurrentProfile()]);

  return (
    <div className="content-wrap py-8 md:py-12">
      <CheckoutPageClient
        defaultEmail={user?.email ?? ""}
        defaultName={profile?.full_name ?? ""}
        defaultPhone={profile?.phone ?? ""}
      />
    </div>
  );
}
