"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";

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

  const rails = [
    { side: -1 as const, items: left },
    { side: 1 as const, items: right },
  ];
  const perRail = Math.max(left.length, 1);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      stage.classList.add("is-paused");
    }

    const setVars = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      stage.style.setProperty("--rail-spread", `${Math.min(w * 0.46, 620)}px`);
      stage.style.setProperty("--rail-h", `${h}px`);
    };
    setVars();

    const ro = new ResizeObserver(setVars);
    ro.observe(stage);

    const syncPause = (offscreen: boolean) => {
      stage.classList.toggle("is-paused", document.hidden || offscreen || reduced);
    };

    let offscreen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        offscreen = !entry?.isIntersecting;
        syncPause(offscreen);
      },
      { rootMargin: "120px 0px", threshold: 0 },
    );
    io.observe(stage);

    const onVis = () => syncPause(offscreen);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="image-stream-stage pointer-events-none absolute inset-0 overflow-hidden"
    >
      {rails.flatMap((rail) =>
        rail.items.map((image, i) => (
          <div
            key={`${rail.side}-${i}`}
            className="image-stream-card absolute top-[38%] left-1/2"
            style={
              {
                "--side": rail.side,
                "--offset": i / perRail,
              } as CSSProperties
            }
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
                sizes="214px"
                className="object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
            </div>
          </div>
        )),
      )}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ivory to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ivory/80 to-transparent" />
    </div>
  );
}
