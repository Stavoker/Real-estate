"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const CYCLE = 11;

interface RailImage {
  src: string;
  alt: string;
}

interface ImageStreamRailsProps {
  left: RailImage[];
  right: RailImage[];
}

export function ImageStreamRails({ left, right }: ImageStreamRailsProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const reducedRef = useRef(false);

  const rails = [
    { side: -1 as const, items: left },
    { side: 1 as const, items: right },
  ];
  const perRail = Math.max(left.length, 1);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - t0) / 1000;
      const w = stage.clientWidth;
      const h = stage.clientHeight;

      cardsRef.current.forEach((el) => {
        if (!el) return;
        const side = Number(el.dataset.side);
        const offset = Number(el.dataset.offset);
        const t = reducedRef.current
          ? (offset % 1) * 0.55 + 0.2
          : ((elapsed / CYCLE + offset) % 1 + 1) % 1;

        const ease = t * t;
        const z = -980 + t * 1180;
        const x = side * (18 + ease * Math.min(w * 0.46, 620));
        const y = -h * 0.02 + t * (h * 0.08);
        const ry = side * (10 + t * 22);
        const rx = 6 + t * 4;
        const scale = 0.32 + ease * 0.95;
        const blur = Math.max(0, (1 - t) * 7);
        const opacity =
          t < 0.06 ? t / 0.06 : t > 0.88 ? Math.max(0, (1 - t) / 0.12) : 1;

        el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${scale})`;
        el.style.filter = `blur(${blur}px)`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(Math.round(t * 100));
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  let n = 0;

  return (
    <div
      ref={stageRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        perspective: "1100px",
        perspectiveOrigin: "50% 42%",
      }}
    >
      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {rails.flatMap((rail) =>
          rail.items.map((image, i) => {
            const idx = n++;
            return (
              <div
                key={`${rail.side}-${i}`}
                ref={(el) => {
                  if (el) cardsRef.current[idx] = el;
                }}
                data-side={rail.side}
                data-offset={i / perRail}
                className="absolute top-[38%] left-1/2 will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="relative h-[210px] w-[150px] overflow-hidden bg-sand shadow-[0_30px_60px_-24px_rgba(17,17,16,0.55)] sm:h-[260px] sm:w-[186px] md:h-[300px] md:w-[214px]"
                  style={{
                    borderRadius: "1.7rem 0.45rem 1.6rem 1.15rem",
                    marginLeft: "-50%",
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 150px, (max-width: 768px) 186px, 214px"
                    className="object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
                </div>
              </div>
            );
          }),
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ivory to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ivory/80 to-transparent" />
    </div>
  );
}
