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

const PER_RAIL = 5;

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
        "relative isolate overflow-hidden bg-[#f3efe8] min-h-0 contain-paint min-[1400px]:h-[100svh] min-[1400px]:min-h-[720px]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 h-[70%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(232,220,198,0.35)_45%,transparent_70%)]" />
        <div
          aria-hidden
          className="absolute top-[4%] left-[-28%] h-[min(88vw,48rem)] w-[min(88vw,48rem)] rounded-full bg-[radial-gradient(circle,rgba(184,154,106,0.22)_0%,rgba(184,154,106,0.08)_42%,transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute right-[-30%] bottom-[-18%] h-[min(96vw,54rem)] w-[min(96vw,54rem)] rounded-full bg-[radial-gradient(circle,rgba(215,196,164,0.34)_0%,rgba(215,196,164,0.12)_46%,transparent_72%)]"
        />
      </div>

      <ImageStreamRails left={left} right={right} />

      <div className="relative z-10">{children}</div>
    </section>
  );
}
