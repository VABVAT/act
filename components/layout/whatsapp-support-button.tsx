import { MessageCircle } from "lucide-react";

import { getWhatsAppNumber } from "@/lib/utils/env";

export function WhatsAppSupportButton() {
  const whatsappNumber = getWhatsAppNumber();

  if (!whatsappNumber) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=Hi%20Arteez%20Collection,%20I%20need%20help%20with%20a%20product.`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(37,211,102,0.28)] hover:-translate-y-0.5"
    >
      <MessageCircle className="size-4" />
      WhatsApp
    </a>
  );
}
