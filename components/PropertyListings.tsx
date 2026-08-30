"use client";

import { useMemo, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { FilterBar, type FilterState } from "@/components/FilterBar";
import { PropertyCard } from "@/components/PropertyCard";
import { properties, type Property } from "@/lib/properties";
import { luxuryEase } from "@/lib/utils";

function layoutList(list: Property[], expandedId: string | null) {
  if (!expandedId) {
    return list.map((property) => ({ property, wide: false }));
  }

  const idx = list.findIndex((p) => p.id === expandedId);
  if (idx < 0) {
    return list.map((property) => ({ property, wide: false }));
  }

  const pairStart = idx - (idx % 2);
  const pair = list.slice(pairStart, pairStart + 2);
  const expanded = list[idx];
  const neighbor = pair.find((p) => p.id !== expanded.id);
  const before = list.slice(0, pairStart);
  const after = list.slice(pairStart + pair.length);

  return [
    ...before.map((property) => ({ property, wide: false })),
    { property: expanded, wide: true },
    ...(neighbor ? [{ property: neighbor, wide: false }] : []),
    ...after.map((property) => ({ property, wide: false })),
  ];
}

const maxBound = Math.max(...properties.map((p) => p.price));

export function PropertyListings() {
  const [filters, setFilters] = useState<FilterState>({
    type: "All",
    minPrice: 500_000,
    maxPrice: maxBound,
    beds: 0,
    sort: "newest",
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const list = useMemo(() => {
    const next = properties.filter((p) => {
      if (filters.type !== "All" && p.type !== filters.type) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (filters.beds && p.beds < filters.beds) return false;
      return true;
    });

    next.sort((a, b) => {
      if (filters.sort === "price") return b.price - a.price;
      if (filters.sort === "popular")
        return Number(b.popular) - Number(a.popular);
      return Number(b.newest) - Number(a.newest);
    });

    return next;
  }, [filters]);

  const items = useMemo(
    () => layoutList(list, expandedId),
    [list, expandedId],
  );

  return (
    <section id="listings" className="relative bg-ivory pt-3 pb-28 md:pt-4 min-[1400px]:pt-8">
      <div className="px-4 md:px-8">
        <FilterBar
          value={filters}
          onChange={(next) => {
            setExpandedId(null);
            setFilters(next);
          }}
          maxBound={maxBound}
        />
      </div>

      <LayoutGroup>
        <div className="mx-auto mt-8 grid max-w-[1400px] grid-cols-1 items-start gap-3 px-5 md:px-8 lg:grid-cols-2">
          {items.map(({ property, wide }, i) => (
            <motion.div
              key={property.id}
              layout
              transition={{ duration: 0.58, ease: luxuryEase }}
              className={wide ? "lg:col-span-2" : undefined}
            >
              <PropertyCard
                property={property}
                index={i}
                expanded={wide}
                onToggle={() => setExpandedId(wide ? null : property.id)}
              />
            </motion.div>
          ))}
        </div>
      </LayoutGroup>

      {list.length === 0 && (
        <p className="mx-auto mt-16 max-w-md text-center text-ink-soft">
          No residences match these filters. Widen the range — the right home
          is rarely the first grid.
        </p>
      )}
    </section>
  );
}
