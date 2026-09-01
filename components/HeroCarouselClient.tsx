"use client";

import * as React from "react";
import Image, { getImageProps } from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const CARD_SIZES =
  "(max-width: 768px) 72vw, (max-width: 1280px) 560px, 520px";

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

const CARD_H = 0.64;
const CARD_AR = 0.78;
const GAP = 0.042;
const TITLE = 0.078;
const META = 0.0165;
const LABEL = 0.011;
const PAD = 0.042;
const RAIL = 0.2;
const MIN_CARD_H = 340;
const MAX_CARD_H = 390;
const TITLE_BLOCK_MIN = 128;
const TITLE_BLOCK_MAX = 148;
const TYPE_H = 580;
const SSR_BOX = { w: 1280, h: 560 };
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=80";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const decodedImages = new Map<string, HTMLImageElement>();

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const wrap = (n: number, len: number) => {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
};

function rotateFwd(order: number[]) {
  if (order.length === 0) return order;
  return [...order.slice(1), order[0]];
}

function rotateBack(order: number[]) {
  if (order.length === 0) return order;
  return [order[order.length - 1], ...order.slice(0, -1)];
}

function orderWithActiveAt(count: number, active: number, anchor: number) {
  const ids = Array.from({ length: count }, (_, i) => i);
  if (count === 0) return ids;
  const k = wrap(active - anchor, count);
  return [...ids.slice(k), ...ids.slice(0, k)];
}

function warmImage(src: string, srcSet?: string, sizes?: string) {
  const key = `${src}::${srcSet ?? ""}::${sizes ?? ""}`;
  const cached = decodedImages.get(key);
  if (cached) return cached;

  const img = new window.Image();
  img.decoding = "async";
  if (srcSet) img.srcset = srcSet;
  if (sizes) img.sizes = sizes;
  img.src = src;
  decodedImages.set(key, img);
  return img;
}

function CarouselPhoto({
  src,
  alt,
  sizes,
  priority,
  className,
  objectPosition,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  objectPosition?: string;
}) {
  const [failed, setFailed] = React.useState(false);

  return (
    <Image
      src={failed ? FALLBACK_IMAGE : src}
      alt={alt}
      fill
      sizes={sizes}
      preload={priority}
      loading="eager"
      draggable={false}
      className={className}
      style={objectPosition ? { objectPosition } : undefined}
      onError={() => setFailed(true)}
    />
  );
}

type Snap = { order: number[]; track: number };

export function HeroCarouselClient({
  items,
  defaultIndex = 0,
  onIndexChange,
  brand,
  onBack,
  onMenu,
  autoplay = false,
  autoplayDelay = 2000,
  className,
}: HeroCarouselProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const jumping = React.useRef(false);
  const positioned = React.useRef(false);
  const lastBoxKey = React.useRef(SSR_BOX.w * 1e5 + SSR_BOX.h);
  const busy = React.useRef(false);
  const pending = React.useRef(0);
  const dirRef = React.useRef(0);
  const goByRef = React.useRef<(delta: number) => void>(() => {});

  const count = items.length;
  const initialReal = wrap(
    clamp(defaultIndex, 0, Math.max(0, count - 1)),
    Math.max(1, count),
  );
  const anchor = count > 2 ? Math.min(2, count - 1) : 0;

  const [box, setBox] = React.useState(SSR_BOX);
  const [snap, setSnap] = React.useState<Snap>(() => ({
    order: orderWithActiveAt(count, initialReal, anchor),
    track: anchor,
  }));
  const reduced = useReducedMotion();

  const { order, track } = snap;

  const compact = box.w > 0 && box.w < 768;
  const typeH = Math.min(box.h, TYPE_H);
  const fullH = Math.round(
    clamp(
      compact
        ? Math.min((box.w * 0.62) / CARD_AR, box.h * 0.48)
        : box.h * CARD_H,
      compact ? 340 : MIN_CARD_H,
      compact ? 400 : MAX_CARD_H,
    ),
  );
  const halfH = Math.round(fullH * 0.58);
  const cardW = Math.round(fullH * CARD_AR);
  const gap = Math.max(8, Math.round(cardW * GAP));
  const step = cardW + gap;
  const pad = Math.max(40, Math.round(box.w * PAD));
  const edge = Math.max(18, Math.round(box.h * 0.032));
  const label = Math.max(compact ? 16 : 10, Math.round(typeH * LABEL));
  const metaSize = Math.max(14, Math.round(typeH * META));
  const titleBlock = clamp(
    Math.round(typeH * 0.28),
    TITLE_BLOCK_MIN,
    TITLE_BLOCK_MAX,
  );

  const realIndex =
    count > 0 ? (order[wrap(track, count)] ?? initialReal) : 0;

  const goBy = React.useCallback(
    (delta: number) => {
      if (count < 2 || delta === 0) return;
      const dir = delta > 0 ? 1 : -1;
      const rest = delta - dir;
      if (busy.current) {
        pending.current += delta;
        return;
      }
      pending.current += rest;
      busy.current = true;
      dirRef.current = dir;
      setSnap((s) => ({ ...s, track: anchor + dir }));
    },
    [count, anchor],
  );
  goByRef.current = goBy;

  const xFor = React.useCallback(
    (i: number) => box.w / 2 - (i * step + cardW / 2),
    [box.w, step, cardW],
  );

  const x = useMotionValue(xFor(track));
  const target = xFor(track);
  const boxKey = box.w * 1e5 + box.h;

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const read = () => {
      const next = { w: stage.clientWidth, h: stage.clientHeight };
      setBox((prev) =>
        prev.w === next.w && prev.h === next.h ? prev : next,
      );
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    onIndexChange?.(realIndex);
  }, [onIndexChange, realIndex]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    for (const item of items) {
      const hero = getImageProps({
        src: item.image,
        alt: "",
        width: 1920,
        height: 1080,
        sizes: "100vw",
      }).props;
      const card = getImageProps({
        src: item.image,
        alt: "",
        width: 1600,
        height: 2048,
        sizes: CARD_SIZES,
      }).props;
      warmImage(hero.src, hero.srcSet, hero.sizes);
      warmImage(card.src, card.srcSet, card.sizes);
    }
  }, [items]);

  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 240, damping: 36, mass: 0.95 };

  const finishStep = React.useCallback(() => {
    const dir = dirRef.current;
    if (dir === 0) {
      busy.current = false;
      return;
    }

    jumping.current = true;
    setSnap((s) => ({
      order: dir > 0 ? rotateFwd(s.order) : rotateBack(s.order),
      track: anchor,
    }));
    dirRef.current = 0;
    busy.current = false;

    const extra = pending.current;
    pending.current = 0;
    if (extra !== 0) {
      requestAnimationFrame(() => goByRef.current(extra));
    }
  }, [anchor]);

  React.useLayoutEffect(() => {
    const boxChanged = lastBoxKey.current !== boxKey;
    lastBoxKey.current = boxKey;

    if (count < 2) {
      x.set(target);
      positioned.current = true;
      jumping.current = false;
      busy.current = false;
      return;
    }

    if (!positioned.current || jumping.current) {
      x.set(target);
      positioned.current = true;
      jumping.current = false;
      return;
    }

    if (boxChanged) {
      x.set(target);
      if (track !== anchor) finishStep();
      return;
    }

    const run = animate(x, target, {
      ...(reduced
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 240, damping: 36, mass: 0.95 }),
      onComplete: finishStep,
    });
    return () => run.stop();
  }, [target, track, count, reduced, x, boxKey, anchor, finishStep]);

  React.useEffect(() => {
    if (!autoplay || reduced || count < 2) return;
    const id = window.setTimeout(() => goBy(1), autoplayDelay);
    return () => window.clearTimeout(id);
  }, [autoplay, autoplayDelay, count, goBy, reduced, track, order]);

  const active = items[realIndex];
  if (!active || count === 0) return null;

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
      className={cn(
        "relative h-full min-h-[24rem] w-full overflow-hidden bg-[#161412] text-white select-none",
        "outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-inset",
        className,
      )}
    >
      {items.map((item, i) => {
        const on = i === realIndex;
        return (
          <div
            key={item.id ?? i}
            className="absolute inset-0"
            style={{
              opacity: on ? 1 : 0,
              zIndex: on ? 1 : 0,
              transition: reduced ? undefined : "opacity 0.7s ease-out",
              pointerEvents: "none",
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ scale: on ? 1.28 : 1.42 }}
              transition={
                reduced || !on
                  ? { duration: 0 }
                  : { duration: 6, ease: "linear" }
              }
            >
              <CarouselPhoto
                src={item.image}
                alt=""
                sizes="100vw"
                priority={i === initialReal || on}
                className="object-cover"
              />
            </motion.div>
            <div
              className="absolute inset-0"
              style={{ backgroundColor: item.accent ?? accent, mixBlendMode: "color" }}
            />
            <div
              className="absolute inset-0 opacity-55"
              style={{
                backgroundColor: item.accent ?? accent,
                mixBlendMode: "multiply",
              }}
            />
          </div>
        );
      })}

      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/40 via-transparent to-black/45" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.22] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />

      <div
        className="absolute inset-x-0 z-20 flex items-center justify-center"
        style={{
          top: edge,
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
        className="absolute inset-x-0 top-0 z-20 flex flex-col justify-end"
        style={{
          height: titleBlock,
          paddingLeft: pad,
          paddingRight: pad,
          paddingBottom: Math.round(typeH * 0.028),
        }}
      >
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-6 lg:gap-10">
          <div className="min-w-0 flex-1 basis-[52%] pr-2">
            <h2
              key={realIndex}
              className="font-display max-w-[18ch] font-semibold leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: Math.max(32, Math.round(typeH * TITLE)) }}
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
            </h2>

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
        className="absolute inset-x-0 z-10 overflow-hidden"
        style={{
          top: titleBlock,
          height: fullH,
        }}
      >
        <motion.div
          className="flex items-start will-change-transform"
          style={{ gap, x }}
        >
          {order.map((real, slot) => {
            const item = items[real];
            if (!item) return null;
            const isActive = real === realIndex;

            return (
              <motion.button
                key={item.id ?? real}
                type="button"
                aria-label={item.title.replace(/\n/g, " ")}
                aria-current={slot === track}
                onClick={() => {
                  if (slot === track) return;
                  goBy(slot - track);
                }}
                className="relative shrink-0 cursor-pointer overflow-hidden bg-white/5"
                style={{
                  width: cardW,
                  height: isActive ? fullH : halfH,
                  borderRadius: isActive
                    ? "1.75rem 0.45rem 1.75rem 1.35rem"
                    : "0.55rem",
                }}
                animate={{ height: isActive ? fullH : halfH }}
                transition={spring}
              >
                <CarouselPhoto
                  src={item.image}
                  alt=""
                  sizes={CARD_SIZES}
                  priority
                  className="object-cover"
                  objectPosition="50% 62%"
                />
                <motion.span
                  aria-hidden
                  className="absolute inset-0 bg-black"
                  animate={{ opacity: isActive ? 0 : 0.12 }}
                  transition={spring}
                />
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div
        className="absolute z-20 flex items-center gap-3"
        style={{
          left: pad,
          bottom: edge,
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
      </div>
    </div>
  );
}
