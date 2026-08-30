"use client";

import { motion } from "framer-motion";
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

const beds = [1, 2, 3, 4];

export interface FilterState {
  type: "All" | PropertyType;
  minPrice: number;
  maxPrice: number;
  beds: number;
  sort: SortOption;
}

interface FilterBarProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  maxBound: number;
}

export function FilterBar({ value, onChange, maxBound }: FilterBarProps) {
  const set = (partial: Partial<FilterState>) =>
    onChange({ ...value, ...partial });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass sticky top-24 z-30 mx-auto max-w-[1200px] rounded-[1.6rem] border border-white/60 p-4 shadow-[0_16px_40px_-28px_rgba(17,17,16,0.28)] md:top-28 md:p-5"
    >
      <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <p className="font-mono text-[10px] tracking-[0.22em] text-ink-soft uppercase">
            Property Type
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => set({ type })}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[12px] tracking-[0.08em] uppercase transition",
                  value.type === type
                    ? "bg-ink text-ivory"
                    : "bg-white/50 text-ink-soft hover:bg-white",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <p className="font-mono text-[10px] tracking-[0.22em] text-ink-soft uppercase">
            Price · ${Math.round(value.minPrice / 1_000_000)}M – $
            {Math.round(value.maxPrice / 1_000_000)}M
          </p>
          <div className="mt-3 space-y-2">
            <input
              type="range"
              min={500_000}
              max={maxBound}
              step={50_000}
              value={value.minPrice}
              onChange={(e) =>
                set({
                  minPrice: Math.min(Number(e.target.value), value.maxPrice - 100_000),
                })
              }
              className="w-full accent-ink"
            />
            <input
              type="range"
              min={500_000}
              max={maxBound}
              step={50_000}
              value={value.maxPrice}
              onChange={(e) =>
                set({
                  maxPrice: Math.max(Number(e.target.value), value.minPrice + 100_000),
                })
              }
              className="w-full accent-ink"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="font-mono text-[10px] tracking-[0.22em] text-ink-soft uppercase">
            Bedrooms
          </p>
          <div className="mt-2 flex gap-1.5">
            {beds.map((n) => (
              <button
                key={n}
                onClick={() => set({ beds: value.beds === n ? 0 : n })}
                className={cn(
                  "h-9 min-w-9 rounded-full px-2 text-xs transition",
                  value.beds === n
                    ? "bg-ink text-ivory"
                    : "bg-white/50 text-ink-soft hover:bg-white",
                )}
              >
                {n}+
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="font-mono text-[10px] tracking-[0.22em] text-ink-soft uppercase">
            Sort
          </p>
          <select
            value={value.sort}
            onChange={(e) => set({ sort: e.target.value as SortOption })}
            className="mt-2 w-full rounded-full bg-white/70 px-4 py-2 text-sm outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price">Price</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
