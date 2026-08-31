"use client";

import type { ReactNode } from "react";
import type { PropertyType, SortOption } from "@/lib/properties";
import { cn } from "@/lib/utils";

const types: Array<"All" | PropertyType> = [
  "All",
  "House",
  "Apartment",
  "Villa",
  "Penthouse",
  "Commercial",
];

const counts = [1, 2, 3, 4];

export const PRICE_PRESETS = [
  { id: "any", label: "Any", min: 0, max: Infinity },
  { id: "under1", label: "Under $1M", min: 0, max: 1_000_000 },
  { id: "1to2", label: "$1M – $2M", min: 1_000_000, max: 2_000_000 },
  { id: "2to3", label: "$2M – $3M", min: 2_000_000, max: 3_000_000 },
  { id: "3plus", label: "$3M+", min: 3_000_000, max: Infinity },
] as const;

export type PricePreset = (typeof PRICE_PRESETS)[number]["id"];

export interface FilterState {
  type: "All" | PropertyType;
  price: PricePreset;
  beds: number;
  baths: number;
  city: string;
  sort: SortOption;
}

interface FilterBarProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  cities: string[];
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1.5 text-[12px] tracking-[0.06em] uppercase transition",
        active
          ? "bg-ink text-ivory"
          : "bg-white/60 text-ink-soft hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}

function Group({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="font-mono text-[10px] tracking-[0.22em] text-ink-soft uppercase">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function FilterBar({ value, onChange, cities }: FilterBarProps) {
  const set = (partial: Partial<FilterState>) =>
    onChange({ ...value, ...partial });

  return (
    <div className="w-full rounded-[1.35rem] border border-ink/8 bg-white/55 px-5 py-4 backdrop-blur-md md:px-6 md:py-5">
      <div className="flex w-full flex-wrap items-start justify-between gap-x-4 gap-y-5 xl:flex-nowrap">
        <Group label="Property Type" className="xl:flex-1">
          {types.map((type) => (
            <Chip
              key={type}
              active={value.type === type}
              onClick={() => set({ type })}
            >
              {type}
            </Chip>
          ))}
        </Group>

        <Group label="Price" className="xl:flex-1">
          {PRICE_PRESETS.map((preset) => (
            <Chip
              key={preset.id}
              active={value.price === preset.id}
              onClick={() => set({ price: preset.id })}
            >
              {preset.label}
            </Chip>
          ))}
        </Group>

        <Group label="Bedrooms" className="xl:flex-1">
          <Chip active={value.beds === 0} onClick={() => set({ beds: 0 })}>
            Any
          </Chip>
          {counts.map((n) => (
            <Chip
              key={n}
              active={value.beds === n}
              onClick={() => set({ beds: value.beds === n ? 0 : n })}
            >
              {n}+
            </Chip>
          ))}
        </Group>

        <Group label="Bathrooms" className="xl:flex-1">
          <Chip active={value.baths === 0} onClick={() => set({ baths: 0 })}>
            Any
          </Chip>
          {counts.map((n) => (
            <Chip
              key={n}
              active={value.baths === n}
              onClick={() => set({ baths: value.baths === n ? 0 : n })}
            >
              {n}+
            </Chip>
          ))}
        </Group>

        <Group label="Location" className="xl:flex-1">
          <Chip
            active={value.city === "All"}
            onClick={() => set({ city: "All" })}
          >
            All
          </Chip>
          {cities.map((city) => (
            <Chip
              key={city}
              active={value.city === city}
              onClick={() => set({ city: value.city === city ? "All" : city })}
            >
              {city}
            </Chip>
          ))}
        </Group>

        <div className="min-w-[9.5rem] shrink-0">
          <p className="font-mono text-[10px] tracking-[0.22em] text-ink-soft uppercase">
            Sort
          </p>
          <select
            value={value.sort}
            onChange={(e) => set({ sort: e.target.value as SortOption })}
            className="mt-2 w-full rounded-full bg-white/80 px-4 py-1.5 text-sm outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price">Price</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>
    </div>
  );
}
