import { getImageProps } from "next/image";
import { preload } from "react-dom";
import {
  CARD_SIZES,
  HeroCarouselClient,
  type HeroCarouselProps,
} from "./HeroCarouselClient";

export type { HeroCarouselItem, HeroCarouselProps } from "./HeroCarouselClient";
export { CARD_SIZES };

function wrap(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function preloadOptimized(
  src: string,
  kind: "hero" | "card",
  priority: "high" | "low",
) {
  const { props } = getImageProps(
    kind === "hero"
      ? { src, alt: "", width: 1920, height: 1080, sizes: "100vw" }
      : { src, alt: "", width: 1200, height: 1536, sizes: CARD_SIZES },
  );

  preload(props.src, {
    as: "image",
    imageSrcSet: props.srcSet,
    imageSizes: props.sizes,
    fetchPriority: priority,
  });
}

export function HeroCarousel(props: HeroCarouselProps) {
  const { items, defaultIndex = 0 } = props;
  const count = items.length;
  const start = wrap(defaultIndex, Math.max(1, count));
  const seen = new Set<string>();

  for (let i = 0; i < count; i++) {
    const item = items[i];
    if (!item || seen.has(item.image)) continue;
    seen.add(item.image);

    const dist = Math.min(
      Math.abs(i - start),
      count - Math.abs(i - start),
    );
    if (dist > 1) continue;

    const priority = dist === 0 ? "high" : "low";
    preloadOptimized(item.image, "card", priority);
    preloadOptimized(item.image, "hero", priority);
  }

  return <HeroCarouselClient {...props} />;
}
