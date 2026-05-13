import Link from "next/link";
import { Heart, LayoutDashboard, ShoppingBag, UserRound } from "lucide-react";

import { logoutAction } from "@/app/actions/auth";
import { CartCount } from "@/components/cart/cart-count";
import { HeaderSearchForm } from "@/components/layout/header-search-form";
import { Logo } from "@/components/ui/logo";
import { mainNavigation } from "@/lib/constants/navigation";

export function SiteHeader({
  isAuthenticated,
  isAdmin,
  userEmail,
}: {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail: string | null;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-background/90 backdrop-blur-xl">
      <div className="content-wrap flex flex-col gap-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <HeaderSearchForm />
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white/70 text-foreground hover:border-brand/30 hover:bg-brand-soft/35 md:hidden"
                  aria-label="Admin dashboard"
                >
                  <LayoutDashboard className="size-4" />
                </Link>
                <Link
                  href="/admin"
                  className="hidden rounded-full border border-line bg-white/70 px-4 py-2 text-sm font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35 md:inline-flex"
                >
                  <LayoutDashboard className="mr-2 size-4" />
                  Dashboard
                </Link>
              </>
            ) : null}
            <Link
              href="/wishlist"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white/70 text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
              aria-label="Wishlist"
            >
              <Heart className="size-4" />
            </Link>
            <Link
              href="/bag"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2.5 text-sm font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden md:inline">Bag</span>
              <CartCount />
            </Link>
            {isAuthenticated ? (
              <Link
                href="/orders"
                className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white/70 text-foreground hover:border-brand/30 hover:bg-brand-soft/35 md:hidden"
                aria-label="My account"
              >
                <UserRound className="size-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white/70 text-foreground hover:border-brand/30 hover:bg-brand-soft/35 md:hidden"
                aria-label="Login"
              >
                <UserRound className="size-4" />
              </Link>
            )}
            {isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2.5 text-sm font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
                >
                  <UserRound className="size-4" />
                  {userEmail?.split("@")[0] ?? "Account"}
                </Link>
                <form action={logoutAction}>
                  <button
                    className="inline-flex rounded-full border border-line bg-transparent px-4 py-2.5 text-sm font-semibold text-muted hover:border-brand/30 hover:text-foreground"
                    type="submit"
                  >
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-strong md:inline-flex"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        <nav className="flex gap-5 overflow-x-auto pb-1 text-sm font-semibold text-muted">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link href="/orders" className="whitespace-nowrap text-foreground md:hidden">
                My Orders
              </Link>
              <form action={logoutAction} className="md:hidden">
                <button className="whitespace-nowrap text-foreground" type="submit">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="whitespace-nowrap text-foreground md:hidden">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
