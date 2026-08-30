"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Property } from "@/lib/properties";
import { luxuryEase } from "@/lib/utils";
import { TestimonialFlip } from "./TestimonialFlip";

interface TestimonialGalleryProps {
  properties: Property[];
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function TestimonialGallery({ properties }: TestimonialGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const readActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-sale-card]");
    if (!cards.length) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    cards.forEach((card, i) => {
      const mid = card.offsetLeft + card.offsetWidth / 2;
      const next = Math.abs(mid - center);
      if (next < dist) {
        dist = next;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    readActive();
    const onScroll = () => readActive();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [readActive, properties.length]);

  const scrollByCard = useCallback((direction: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-sale-card]");
    const styles = getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 28;
    const amount = (card?.offsetWidth ?? 380) + gap;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }, []);

  return (
    <div className="relative mt-16">
      <div className="mx-auto flex max-w-[1400px] items-center justify-end gap-2 px-6 md:px-10">
        <button
          type="button"
          aria-label="Previous featured sale"
          onClick={() => scrollByCard(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/55 text-ink shadow-[0_10px_28px_-18px_rgba(17,17,16,0.35)] backdrop-blur-xl transition hover:bg-white"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Next featured sale"
          onClick={() => scrollByCard(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/55 text-ink shadow-[0_10px_28px_-18px_rgba(17,17,16,0.35)] backdrop-blur-xl transition hover:bg-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="hide-scrollbar mt-6 flex snap-x snap-mandatory gap-7 overflow-x-auto overscroll-x-contain pt-6 pb-8 touch-pan-x max-md:px-[max(1.5rem,calc((100%-min(86vw,380px))/2))] md:mx-auto md:max-w-[1400px] md:px-10 md:pb-12 min-[1400px]:mx-0 min-[1400px]:max-w-none"
      >
        {properties.map((property) => (
          <div
            key={property.id}
            data-sale-card
            className="shrink-0 snap-center md:snap-start"
          >
            <TestimonialFlip property={property} />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 px-6 md:hidden">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Testimonial position">
          {properties.map((property, i) => (
            <span
              key={property.id}
              aria-hidden
              className="block rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: i === active ? 7 : 5,
                height: i === active ? 7 : 5,
                background:
                  i === active ? "var(--ink)" : "color-mix(in srgb, var(--ink) 22%, transparent)",
              }}
            />
          ))}
        </div>
        <p className="font-mono text-[10px] tracking-[0.22em] text-ink-soft uppercase">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={active}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: luxuryEase }}
              className="inline-block"
            >
              {pad(active + 1)}
            </motion.span>
          </AnimatePresence>
          <span className="mx-1.5 opacity-40">/</span>
          <span>{pad(properties.length)}</span>
        </p>
      </div>
    </div>
  );
}
