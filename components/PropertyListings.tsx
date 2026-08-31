"use client";

import { useMemo, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import {
  FilterBar,
  PRICE_PRESETS,
  type FilterState,
} from "@/components/FilterBar";
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

const cities = [...new Set(properties.map((p) => p.city))];

export function PropertyListings() {
  const [filters, setFilters] = useState<FilterState>({
    type: "All",
    price: "any",
    beds: 0,
    baths: 0,
    city: "All",
    sort: "newest",
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const list = useMemo(() => {
    const preset =
      PRICE_PRESETS.find((p) => p.id === filters.price) ?? PRICE_PRESETS[0];

    const next = properties.filter((p) => {
      if (filters.type !== "All" && p.type !== filters.type) return false;
      const inPrice =
        preset.max === Infinity
          ? p.price >= preset.min
          : p.price >= preset.min && p.price < preset.max;
      if (!inPrice) return false;
      if (filters.beds && p.beds < filters.beds) return false;
      if (filters.baths && p.baths < filters.baths) return false;
      if (filters.city !== "All" && p.city !== filters.city) return false;
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
          cities={cities}
        />
      </div>

      <LayoutGroup>
        <div className="mx-auto mt-8 grid max-w-[1400px] grid-cols-1 items-stretch gap-3 px-5 md:px-8 lg:grid-cols-2">
          {items.map(({ property, wide }, i) => (
            <motion.div
              key={property.id}
              layout
              transition={{ duration: 0.58, ease: luxuryEase }}
              className={
                wide
                  ? "h-auto lg:col-span-2"
                  : "h-[360px] overflow-hidden md:h-[232px]"
              }
            >
              <PropertyCard
                property={property}
                index={i}
                expanded={wide}
                onToggle={() => setExpandedId(wide ? null : property.id)}
                className="h-full"
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
