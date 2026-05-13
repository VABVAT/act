import { getCurrentProfile, getCurrentUser } from "@/lib/auth/session";
import { getPersistedCartItems } from "@/lib/data/products";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CartSyncBridge } from "@/components/providers/cart-sync-bridge";
import { WhatsAppSupportButton } from "@/components/layout/whatsapp-support-button";

export default async function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, profile] = await Promise.all([getCurrentUser(), getCurrentProfile()]);
  const serverCartItems = user ? await getPersistedCartItems(user.id) : [];

  return (
    <div className="page-shell min-h-screen">
      <CartSyncBridge userId={user?.id ?? null} serverItems={serverCartItems} />
      <AnnouncementBar />
      <SiteHeader
        isAuthenticated={Boolean(user)}
        isAdmin={profile?.role === "admin"}
        userEmail={user?.email ?? null}
      />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
      <WhatsAppSupportButton />
    </div>
  );
}
