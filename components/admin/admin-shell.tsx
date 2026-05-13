import Link from "next/link";

import { adminNavigation } from "@/lib/constants/navigation";

export function AdminShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#F7F1E7]">
      <div className="content-wrap grid gap-6 py-6 md:grid-cols-[240px_1fr]">
        <aside className="surface-card h-fit rounded-[28px] border border-line/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
            Arteez Admin
          </p>
          <nav className="mt-6 grid gap-2">
            {adminNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-muted hover:bg-brand-soft/35 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full border border-line bg-white/70 px-4 py-2.5 text-sm font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
          >
            View storefront
          </Link>
        </aside>
        <div className="grid gap-6">{children}</div>
      </div>
    </div>
  );
}
