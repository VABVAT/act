import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 font-display text-4xl leading-none text-balance text-foreground md:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-sm leading-7 text-muted md:text-base">{description}</p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center rounded-full border border-line bg-white/70 px-5 py-3 text-sm font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
