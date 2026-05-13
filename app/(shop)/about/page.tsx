import { aboutHighlights } from "@/lib/constants/site";
import { buildMetadata } from "@/lib/utils/metadata";

export const metadata = buildMetadata({
  title: "About",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="content-wrap py-10 md:py-14">
      <section className="rounded-[36px] border border-line/70 bg-white/72 p-6 shadow-[0_24px_80px_rgba(106,72,56,0.08)] md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
          About Arteez Collection
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-6xl leading-none text-balance text-foreground md:text-7xl">
          A boutique women&apos;s wear label shaped by care, elegance, and versatility.
        </h1>
        <p className="mt-6 max-w-3xl text-sm leading-8 text-muted md:text-lg">
          Arteez Collection was created to make premium Indian ethnic wear feel more
          personal, more wearable, and more thoughtfully chosen for real people and
          real occasions.
        </p>
      </section>
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {aboutHighlights.map((highlight) => (
          <div
            key={highlight.title}
            className="rounded-[28px] border border-line/70 bg-[#F8F1E6] p-6"
          >
            <h2 className="text-xl font-semibold text-foreground">{highlight.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{highlight.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
