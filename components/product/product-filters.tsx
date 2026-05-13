import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { availabilityOptions, sortOptions, standardSizes } from "@/lib/constants/commerce";
import type { CatalogFilters, CategoryRecord } from "@/lib/data/types";

export function ProductFilters({
  categories,
  filters,
}: {
  categories: CategoryRecord[];
  filters: CatalogFilters;
}) {
  return (
    <form className="grid gap-4 rounded-[28px] border border-line/70 bg-white/70 p-5 shadow-[0_24px_80px_rgba(106,72,56,0.08)] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto]">
      <Input defaultValue={filters.q} name="q" placeholder="Search by name, fabric, colour..." type="search" />
      <Select defaultValue={filters.category} name="category">
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </Select>
      <Select defaultValue={filters.size} name="size">
        <option value="">All sizes</option>
        {standardSizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </Select>
      <Select defaultValue={filters.availability} name="availability">
        {availabilityOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Select defaultValue={filters.sort} name="sort">
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input
        defaultValue={filters.minPrice ?? ""}
        min="0"
        name="minPrice"
        placeholder="Min price"
        type="number"
      />
      <Input
        defaultValue={filters.maxPrice ?? ""}
        min="0"
        name="maxPrice"
        placeholder="Max price"
        type="number"
      />
      <div className="flex gap-3">
        <Button className="flex-1 lg:flex-none" type="submit">
          Apply
        </Button>
        <Link
          className="hidden h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35 lg:inline-flex"
          href="/shop"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
