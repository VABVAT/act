import Link from "next/link";

import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen px-4 py-8 md:px-6">
      <div className="content-wrap">
        <div className="mb-10 flex justify-center md:justify-start">
          <Logo />
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 rounded-[32px] border border-line/70 bg-white/70 p-6 shadow-[0_32px_120px_rgba(85,54,39,0.1)] backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <section className="grain-overlay rounded-[28px] bg-gradient-to-br from-brand/95 via-brand-strong to-[#5C2C1F] p-8 text-white md:p-12">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-white/80">
              Arteez Collection
            </span>
            <h1 className="mt-6 max-w-lg font-display text-5xl leading-none text-balance md:text-6xl">
              Save your favourites and come back faster whenever you need them.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/78 md:text-base">
              Create an account to keep your wishlist and profile details handy.
              WhatsApp inquiries are always available even if you stay signed out.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="rounded-full border border-white/15 px-4 py-2">
                Wishlist sync
              </span>
              <span className="rounded-full border border-white/15 px-4 py-2">
                Faster repeat visits
              </span>
              <span className="rounded-full border border-white/15 px-4 py-2">
                Saved profile details
              </span>
            </div>
            <p className="mt-12 text-sm text-white/70">
              Need help before buying?{" "}
              <Link href="/contact" className="underline decoration-white/40 underline-offset-4">
                Reach out to us
              </Link>
              .
            </p>
          </section>
          <section className="rounded-[28px] bg-background-soft p-4 md:p-6">{children}</section>
        </div>
      </div>
    </main>
  );
}
