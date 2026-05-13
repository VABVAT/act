"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import { adminNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";

const mobileAdminActions = [
  ...adminNavigation,
  { label: "New product", href: "/admin/products/new" },
] as const;

function isActiveAdminPath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  if (href === "/admin/products") {
    if (pathname === "/admin/products/new") {
      return false;
    }

    return pathname === href || (pathname.startsWith("/admin/products/") && pathname.endsWith("/edit"));
  }

  if (href === "/admin/orders") {
    return pathname === href || pathname.startsWith("/admin/orders/");
  }

  return pathname === href;
}

export function AdminShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F7F1E7]">
      <div className="content-wrap py-4 md:py-6">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <aside className="surface-card hidden h-fit rounded-[28px] border border-line/70 p-5 md:sticky md:top-6 md:block">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
              Arteez Admin
            </p>
            <nav className="mt-6 grid gap-2">
              {adminNavigation.map((item) => {
                const isActive = isActiveAdminPath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-brand text-white shadow-[0_20px_60px_rgba(154,79,56,0.22)]"
                        : "text-muted hover:bg-brand-soft/35 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/admin/products/new"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(154,79,56,0.22)] hover:bg-brand-strong"
            >
              <Plus className="size-4" />
              Add product
            </Link>
            <Link
              href="/"
              className="mt-3 inline-flex rounded-full border border-line bg-white/70 px-4 py-2.5 text-sm font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
            >
              View storefront
            </Link>
          </aside>

          <div className="grid min-w-0 gap-6">
            <div className="surface-card sticky top-3 z-20 rounded-[24px] border border-line/70 p-4 md:hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
                    Arteez Admin
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Open the dashboard, manage orders, or add products from your phone.
                  </p>
                </div>
                <Link
                  href="/"
                  className="shrink-0 rounded-full border border-line bg-white/70 px-4 py-2.5 text-sm font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
                >
                  Store
                </Link>
              </div>
              <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {mobileAdminActions.map((item) => {
                  const isActive = isActiveAdminPath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-brand text-white shadow-[0_16px_40px_rgba(154,79,56,0.2)]"
                          : "border border-line bg-white/75 text-foreground hover:border-brand/30 hover:bg-brand-soft/35",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="grid min-w-0 gap-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
