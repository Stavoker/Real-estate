"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getImageProps } from "next/image";
import { LayoutGroup, motion } from "framer-motion";
import {
  FilterBar,
  PRICE_PRESETS,
  type FilterState,
} from "@/components/FilterBar";
import type { PropertyType } from "@/lib/properties";
import { luxuryEase } from "@/lib/utils";

export interface ListingMeta {
  id: string;
  type: PropertyType;
  price: number;
  beds: number;
  baths: number;
  city: string;
  popular: boolean;
  newest: boolean;
  image: string;
  gallery: string[];
  agentPhoto: string;
}

const warmed = new Set<string>();

function warmListing(meta: ListingMeta) {
  if (typeof window === "undefined" || warmed.has(meta.id)) return;
  warmed.add(meta.id);

  const sources = [
    { src: meta.image, width: 1280, height: 900, sizes: "(min-width: 1024px) 640px, 100vw" },
    ...meta.gallery.map((src) => ({
      src,
      width: 240,
      height: 176,
      sizes: "120px",
    })),
    { src: meta.agentPhoto, width: 96, height: 96, sizes: "48px" },
  ];

  for (const source of sources) {
    const { props } = getImageProps({
      src: source.src,
      alt: "",
      width: source.width,
      height: source.height,
      sizes: source.sizes,
    });
    const img = new window.Image();
    img.decoding = "async";
    if (props.srcSet) img.srcset = props.srcSet;
    if (props.sizes) img.sizes = props.sizes;
    img.src = props.src;
  }
}

function layoutList(list: ListingMeta[], expandedId: string | null) {
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

function isIgnoredClick(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest("a, select, [data-ignore-toggle]"))
  );
}

interface PropertyListingsProps {
  cities: string[];
  catalog: ListingMeta[];
  cards: Record<string, ReactNode>;
}

export function PropertyListings({
  cities,
  catalog,
  cards,
}: PropertyListingsProps) {
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

    const next = catalog.filter((p) => {
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
  }, [catalog, filters]);

  const items = useMemo(
    () => layoutList(list, expandedId),
    [list, expandedId],
  );

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-listing-id]");
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute("data-listing-id");
          const meta = catalog.find((p) => p.id === id);
          if (meta) warmListing(meta);
        }
      },
      { rootMargin: "240px 0px" },
    );

    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [catalog, items]);

  return (
    <section id="listings" className="relative bg-ivory pt-3 pb-28 md:pt-4 min-[1400px]:pt-8">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <FilterBar
          value={filters}
          onChange={(next) => {
            setExpandedId(null);
            setFilters(next);
          }}
          cities={cities}
        />

        <LayoutGroup>
          <div className="mt-8 grid grid-cols-1 items-stretch gap-3 lg:grid-cols-2">
            {items.map(({ property, wide }) => (
              <motion.div
                key={property.id}
                layout
                data-listing-id={property.id}
                data-expanded={wide ? "true" : "false"}
                transition={{ duration: 0.58, ease: luxuryEase }}
                onPointerEnter={() => warmListing(property)}
                onFocus={() => warmListing(property)}
                onClick={(e) => {
                  if (isIgnoredClick(e.target)) return;
                  warmListing(property);
                  setExpandedId(wide ? null : property.id);
                }}
                className={
                  wide
                    ? "group/listing h-auto cursor-pointer lg:col-span-2"
                    : "group/listing h-[22rem] cursor-pointer md:h-[15rem]"
                }
              >
                {cards[property.id]}
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
      </div>
    </section>
  );
}
