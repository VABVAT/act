import { MessageCircle } from "lucide-react";

import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export function WhatsAppSupportButton() {
  const whatsappUrl = buildWhatsAppUrl(
    "Hi Arteez Collection, I need help with a product inquiry.",
  );

  if (!whatsappUrl) {
    return null;
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(37,211,102,0.28)] hover:-translate-y-0.5"
    >
      <MessageCircle className="size-4" />
      WhatsApp
    </a>
  );
}
