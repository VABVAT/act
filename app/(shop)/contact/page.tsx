import Link from "next/link";

import { buildMetadata } from "@/lib/utils/metadata";
import { getWhatsAppNumber } from "@/lib/utils/env";

export const metadata = buildMetadata({
  title: "Contact",
  path: "/contact",
});

export default function ContactPage() {
  const whatsappNumber = getWhatsAppNumber();

  return (
    <div className="content-wrap py-10 md:py-14">
      <section className="grid gap-6 rounded-[36px] border border-line/70 bg-white/72 p-6 shadow-[0_24px_80px_rgba(106,72,56,0.08)] md:grid-cols-2 md:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
            Contact
          </p>
          <h1 className="mt-4 font-display text-6xl leading-none text-balance text-foreground">
            Need sizing help, styling advice, or order support?
          </h1>
          <p className="mt-6 text-sm leading-8 text-muted md:text-lg">
            Reach out to Arteez Collection for product questions, availability checks,
            or direct WhatsApp inquiries about anything you want to buy.
          </p>
        </div>
        <div className="rounded-[28px] bg-background-soft p-6">
          <div className="grid gap-5 text-sm text-muted">
            <div>
              <p className="font-semibold text-foreground">Email</p>
              <p className="mt-2">support@arteezcollection.com</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">WhatsApp</p>
              {whatsappNumber ? (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
                >
                  Chat now
                </a>
              ) : (
                <p className="mt-2">Add `NEXT_PUBLIC_WHATSAPP_NUMBER` to enable direct chat.</p>
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">Helpful links</p>
              <div className="mt-2 flex flex-col gap-2">
                <Link href="/privacy-policy" className="hover:text-foreground">
                  Privacy policy
                </Link>
                <Link href="/terms" className="hover:text-foreground">
                  Terms & conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
