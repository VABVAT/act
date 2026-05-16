import { site } from "@/lib/constants/site";
import type { BagItemSnapshot } from "@/lib/data/types";
import { getWhatsAppNumber } from "@/lib/utils/env";
import { formatCurrency } from "@/lib/utils/currency";

type ProductInquiryInput = {
  color: string;
  name: string;
  price: number | null;
  quantity: number;
  selectedSize?: string | null;
  url?: string;
};

function sanitizeWhatsAppNumber(value: string) {
  return value.replace(/\D/g, "");
}

export function buildWhatsAppUrl(message: string) {
  const whatsappNumber = sanitizeWhatsAppNumber(getWhatsAppNumber());

  if (!whatsappNumber) {
    return null;
  }

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildCartInquiryMessage(items: BagItemSnapshot[]) {
  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const lines = items.map((item, index) => {
    const lineTotal = item.unitPrice * item.quantity;

    return [
      `${index + 1}. ${item.name}`,
      `- Size: ${item.selectedSize}`,
      `- Color: ${item.color}`,
      `- Quantity: ${item.quantity}`,
      `- Price: ${formatCurrency(item.unitPrice)} each`,
      `- Line total: ${formatCurrency(lineTotal)}`,
    ].join("\n");
  });

  return [
    `Hi ${site.name}, I would like to inquire about these items:`,
    "",
    ...lines.flatMap((line, index) => (index === 0 ? [line] : ["", line])),
    "",
    `Estimated total: ${formatCurrency(subtotal)}`,
    "",
    "Please confirm availability and share the next steps on WhatsApp.",
  ].join("\n");
}

export function buildProductInquiryMessage(input: ProductInquiryInput) {
  const detailLines = [
    `Product: ${input.name}`,
    `Size: ${input.selectedSize || "Not selected yet"}`,
    `Color: ${input.color}`,
    `Quantity: ${input.quantity}`,
  ];

  if (input.price !== null) {
    detailLines.push(`Price: ${formatCurrency(input.price)}`);
  }

  if (input.url) {
    detailLines.push(`Product link: ${input.url}`);
  }

  return [
    `Hi ${site.name}, I would like to inquire about this product:`,
    "",
    ...detailLines,
    "",
    "Please share availability and the next steps.",
  ].join("\n");
}
