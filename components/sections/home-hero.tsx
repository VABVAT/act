import Link from "next/link";
import Image from "next/image";

export function HomeHero() {
  return (
    <section className="content-wrap py-8 md:py-12">
      <div className="grain-overlay overflow-hidden rounded-[36px] border border-line/70 bg-gradient-to-br from-[#F9F2E5] via-[#F7E8D6] to-[#EAD0C6] px-6 py-8 shadow-[0_40px_140px_rgba(110,77,58,0.12)] md:px-10 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-brand/15 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-brand">
              Arteez Collection
            </span>
            <h1 className="mt-6 max-w-2xl font-display text-6xl leading-none text-balance text-foreground md:text-7xl lg:text-8xl">
              Premium suit sets with festive polish and everyday grace.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-8 text-muted md:text-lg">
              Discover thoughtfully curated women&apos;s suits designed for family occasions,
              elevated daily wear, and beautiful gifting moments.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-base font-semibold text-white shadow-[0_20px_60px_rgba(154,79,56,0.28)] hover:bg-brand-strong"
              >
                Shop collection
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-white/80 px-6 text-base font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
              >
                Our story
              </Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-[28px] border border-white/55 bg-white/70 p-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[22px]">
                <Image
                  alt="Rosewood Regal Suit Set"
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  src="/catalog/rosewood-regal-main.svg"
                />
              </div>
            </div>
            <div className="mt-10 hidden md:block">
              <div className="relative overflow-hidden rounded-[28px] border border-white/55 bg-white/70 p-3">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[22px]">
                  <Image
                    alt="Marigold Zari Celebration Set"
                    className="object-cover"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    src="/catalog/marigold-zari-main.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
