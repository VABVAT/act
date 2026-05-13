import { Search } from "lucide-react";

export function HeaderSearchForm() {
  return (
    <form action="/shop" className="relative hidden w-full max-w-md md:block">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <input
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-line bg-white/75 pl-11 pr-4 text-sm text-foreground shadow-sm outline-none focus:border-brand/35 focus:ring-2 focus:ring-brand/20"
        name="q"
        placeholder="Search suits, fabrics, colours..."
        type="search"
      />
    </form>
  );
}
