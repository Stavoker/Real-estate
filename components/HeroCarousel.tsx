"use client";

import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroCarouselItem {
  id?: string | number;
  title: string;
  image: string;
  credit?: string;
  meta?: string[];
  accent?: string;
}

export interface HeroCarouselProps {
  items: HeroCarouselItem[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  brand?: React.ReactNode;
  onBack?: () => void;
  onMenu?: () => void;
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
}

const CARD_H = 0.3;
const CARD_AR = 0.78;
const GAP = 0.042;
const STRIP_TOP = 0.5;
const TITLE = 0.078;
const META = 0.0165;
const LABEL = 0.011;
const PAD = 0.042;
const RAIL = 0.2;
const COPIES = 3;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=80";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const wrap = (n: number, len: number) => {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
};

export function HeroCarousel({
  items,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  brand,
  onBack,
  onMenu,
  autoplay = false,
  autoplayDelay = 4000,
  className,
}: HeroCarouselProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const jumping = React.useRef(false);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [track, setTrack] = React.useState(
    items.length + clamp(defaultIndex, 0, Math.max(0, items.length - 1)),
  );
  const [paused, setPaused] = React.useState(false);
  const reduced = useReducedMotion();

  const count = items.length;
  const realIndex = wrap(track, Math.max(1, count));

  const goBy = React.useCallback((delta: number) => {
    setTrack((t) => t + delta);
  }, []);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const read = () => setBox({ w: stage.clientWidth, h: stage.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const fullH = clamp(box.h * CARD_H, 120, 420);
  const halfH = fullH * 0.58;
  const cardW = fullH * CARD_AR;
  const gap = Math.max(8, Math.round(cardW * GAP));
  const step = cardW + gap;
  const pad = Math.max(40, Math.round(box.w * PAD));
  const compact = box.w > 0 && box.w < 768;
  const label = Math.max(compact ? 16 : 10, Math.round(box.h * LABEL));
  const metaSize = Math.max(14, Math.round(box.h * META));

  const xFor = React.useCallback(
    (i: number) => box.w / 2 - (i * step + cardW / 2),
    [box.w, step, cardW],
  );
  const x = useMotionValue(0);
  const target = xFor(track);

  const swing = reduced
    ? { duration: 0 }
    : { duration: 0.7, ease: "easeOut" as const };
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 240, damping: 36, mass: 0.95 };

  React.useEffect(() => {
    if (jumping.current) {
      x.set(target);
      jumping.current = false;
      return;
    }
    const run = animate(x, target, {
      ...spring,
      onComplete: () => {
        if (count < 2) return;
        if (track >= count * 2) {
          jumping.current = true;
          setTrack((t) => t - count);
        } else if (track < count) {
          jumping.current = true;
          setTrack((t) => t + count);
        }
      },
    });
    return () => run.stop();
  }, [target, track, count, reduced, x]);

  React.useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    const id = window.setTimeout(() => goBy(1), autoplayDelay);
    return () => window.clearTimeout(id);
  }, [autoplay, autoplayDelay, count, goBy, paused, track]);

  const active = items[realIndex];
  if (!active || count === 0) return null;

  const looped = Array.from({ length: COPIES }, (_, copy) =>
    items.map((item, i) => ({
      ...item,
      loopKey: `${copy}-${item.id ?? i}`,
      loopIndex: copy * count + i,
    })),
  ).flat();

  const lines = active.title.split("\n");
  const accent = active.accent ?? "#b89a6a";

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured residences"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goBy(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goBy(1);
        }
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className={cn(
        "relative h-full min-h-[24rem] w-full overflow-hidden bg-[#161412] text-white select-none",
        "outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-inset",
        className,
      )}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={realIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={swing}
        >
          <motion.img
            src={active.image}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: reduced ? 1.28 : 1.42 }}
            animate={{ scale: 1.28 }}
            transition={
              reduced ? { duration: 0 } : { duration: 6, ease: "linear" }
            }
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: accent, mixBlendMode: "color" }}
          />
          <div
            className="absolute inset-0 opacity-55"
            style={{ backgroundColor: accent, mixBlendMode: "multiply" }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />

      <div
        className="absolute inset-x-0 flex items-center justify-center"
        style={{
          top: Math.max(16, box.h * 0.029),
          gap: `${Math.max(20, box.w * 0.06)}px`,
        }}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="opacity-90 transition-opacity hover:opacity-100"
            style={{ fontSize: label * 1.15 }}
          >
            <span aria-hidden>↖</span> Back
          </button>
        ) : null}
        {brand ? (
          <div
            className="font-display tracking-[0.18em] uppercase"
            style={{ fontSize: label * 1.5 }}
          >
            {brand}
          </div>
        ) : null}
        {onMenu ? (
          <button
            type="button"
            onClick={onMenu}
            className="opacity-90 transition-opacity hover:opacity-100"
            style={{ fontSize: label * 1.15 }}
          >
            Menu <span aria-hidden>☰</span>
          </button>
        ) : null}
      </div>

      <div
        className="absolute inset-x-0 top-0 flex flex-col justify-end"
        style={{
          height: `${STRIP_TOP * 100}%`,
          paddingLeft: pad,
          paddingRight: pad,
          paddingBottom: Math.round(box.h * 0.028),
        }}
      >
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-6 lg:gap-10">
          <div className="min-w-0 flex-1 basis-[52%] pr-2">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.h2
                key={realIndex}
                className="font-display max-w-[18ch] font-semibold leading-[0.88] tracking-[-0.03em]"
                style={{ fontSize: Math.max(32, Math.round(box.h * TITLE)) }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
              >
                {lines.map((line, i) => (
                  <span key={i} className="block overflow-hidden">
                    <motion.span
                      className="block"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={
                        reduced
                          ? { duration: 0 }
                          : {
                              duration: 0.62,
                              delay: i * 0.07,
                              ease: [0.22, 1, 0.36, 1],
                            }
                      }
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </motion.h2>
            </AnimatePresence>

            {active.credit ? (
              <motion.p
                key={`credit-${realIndex}`}
                className="mt-3 font-mono uppercase tracking-[0.16em] opacity-80"
                style={{ fontSize: label }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {active.credit}
              </motion.p>
            ) : null}
          </div>

          {active.meta?.length ? (
            <motion.div
              key={`meta-${realIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-w-[min(100%,34rem)] shrink-0 items-center rounded-full border border-white/30 bg-white/14 px-5 py-3 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-6"
            >
              {active.meta.map((fact, i) => (
                <React.Fragment key={`${realIndex}-${fact}`}>
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="mx-3 h-4 w-px bg-white/35 sm:mx-4"
                    />
                  )}
                  <span
                    className="font-mono whitespace-nowrap tracking-[0.12em] text-white uppercase"
                    style={{ fontSize: metaSize }}
                  >
                    {fact}
                  </span>
                </React.Fragment>
              ))}
            </motion.div>
          ) : null}
        </div>
      </div>

      <div
        className="absolute inset-x-0 overflow-hidden"
        style={{
          top: `${STRIP_TOP * 100}%`,
          height: fullH,
        }}
      >
        <motion.div className="flex items-start" style={{ gap, x }}>
          {looped.map((item) => (
            <motion.button
              key={item.loopKey}
              type="button"
              aria-label={item.title.replace(/\n/g, " ")}
              aria-current={item.loopIndex === track}
              onClick={() => {
                if (item.loopIndex === track) return;
                setTrack(item.loopIndex);
              }}
              className="relative shrink-0 cursor-pointer overflow-hidden bg-white/5"
              style={{
                width: cardW,
                borderRadius:
                  item.loopIndex === track
                    ? "1.75rem 0.45rem 1.75rem 1.35rem"
                    : "0.55rem",
              }}
              animate={{ height: item.loopIndex === track ? fullH : halfH }}
              transition={spring}
            >
              <img
                src={item.image}
                alt=""
                draggable={false}
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 62%" }}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-black"
                animate={{ opacity: item.loopIndex === track ? 0 : 0.12 }}
                transition={spring}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>

      <div
        className="absolute flex items-center gap-3"
        style={{
          left: pad,
          bottom: Math.max(14, box.h * 0.022),
          width: `calc(100% - ${pad * 2}px)`,
        }}
      >
        <div style={{ width: Math.min(box.w * RAIL, 220) }}>
          <div
            className="flex justify-between font-mono tabular-nums opacity-80"
            style={{ fontSize: label }}
          >
            <span>{String(realIndex + 1).padStart(2, "0")}</span>
            <span>{String(count).padStart(2, "0")}</span>
          </div>
          <div className="relative mt-2 h-px w-full bg-white/25">
            <motion.div
              className="absolute inset-y-0 bg-white"
              style={{ width: `${100 / Math.max(count, 1)}%` }}
              animate={{ left: `${(realIndex / Math.max(count, 1)) * 100}%` }}
              transition={spring}
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous residence"
            onClick={() => goBy(-1)}
            className={cn(
              "flex items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20",
              compact ? "h-12 w-12" : "h-11 w-11",
            )}
          >
            <ChevronLeft size={compact ? 22 : 18} />
          </button>
          <button
            type="button"
            aria-label="Next residence"
            onClick={() => goBy(1)}
            className={cn(
              "flex items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20",
              compact ? "h-12 w-12" : "h-11 w-11",
            )}
          >
            <ChevronRight size={compact ? 22 : 18} />
          </button>
        </div>
      </div>
    </div>
  );
}
