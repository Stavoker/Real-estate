import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ImageStreamRails } from "@/components/ImageStreamRails";

export interface StreamImage {
  src: string;
  alt: string;
}

interface ImageStreamHeroProps {
  images: StreamImage[];
  children?: ReactNode;
  className?: string;
}

const PER_RAIL = 8;

function shuffle<T>(arr: T[], seed: number) {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function ImageStreamHero({
  images,
  children,
  className,
}: ImageStreamHeroProps) {
  const left = shuffle(images, 23).slice(0, PER_RAIL);
  const right = shuffle(images, 91).slice(0, PER_RAIL);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-[#f3efe8] min-h-0 min-[1400px]:h-[100svh] min-[1400px]:min-h-[720px]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 h-[70%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(232,220,198,0.35)_45%,transparent_70%)]" />
        <div className="absolute top-[30%] left-[8%] h-64 w-64 rounded-full bg-gold/20 blur-[80px]" />
        <div className="absolute right-[6%] bottom-[10%] h-72 w-72 rounded-full bg-[#d7c4a4]/40 blur-[90px]" />
        <div className="grain opacity-40" />
      </div>

      <ImageStreamRails left={left} right={right} />

      <div className="relative z-10">{children}</div>
    </section>
  );
}
