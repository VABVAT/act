import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="mx-auto max-w-2xl text-center">
      <div className="mx-auto max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
          Arteez Collection
        </p>
        <h2 className="mt-4 font-display text-4xl leading-none text-foreground">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted md:text-base">{description}</p>
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </div>
    </Card>
  );
}
