import Link from "next/link";

import { footerNavigation } from "@/lib/constants/navigation";
import { site } from "@/lib/constants/site";
import { getWhatsAppNumber } from "@/lib/utils/env";

export function SiteFooter() {
  const whatsappNumber = getWhatsAppNumber();

  return (
    <footer className="border-t border-line/70 bg-[#F4ECDE]">
      <div className="content-wrap grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand">
            Arteez Collection
          </p>
          <h2 className="mt-4 max-w-lg font-display text-4xl leading-none text-balance text-foreground">
            Thoughtfully curated ethnic wear with a personal touch.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted md:text-base">
            Designed for festive dressing, family occasions, and elevated everyday wear,
            with direct support for sizing and order assistance.
          </p>
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
            >
              Chat on WhatsApp
            </a>
          ) : null}
        </div>
        <div className="grid gap-3 rounded-[28px] border border-line/70 bg-white/65 p-6">
          <p className="text-sm font-semibold text-foreground">Explore</p>
          {footerNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <p className="mt-6 text-xs text-muted">
            {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
