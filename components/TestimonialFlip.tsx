"use client";

import { useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { Property } from "@/lib/properties";
import { formatPrice, formatNumber, cn, luxuryEase } from "@/lib/utils";

interface TestimonialFlipProps {
  property: Property;
  className?: string;
}

const TILT = 9;
const spring = { stiffness: 220, damping: 22, mass: 0.55 };

export function TestimonialFlip({
  property,
  className,
}: TestimonialFlipProps) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const springX = useSpring(rotateX, spring);
  const springY = useSpring(rotateY, spring);
  const springGlare = useSpring(glareOpacity, { stiffness: 180, damping: 24 });
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.26), transparent 54%)`;

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(py * TILT);
    rotateY.set(px * -TILT);
    glareX.set((px + 0.5) * 100);
    glareY.set((py + 0.5) * 100);
    glareOpacity.set(1);
  };

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onClick={() => setFlipped((v) => !v)}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: luxuryEase }}
      className={cn(
        "group relative w-[min(86vw,380px)] shrink-0 text-left",
        className,
      )}
      style={{ perspective: 1100 }}
      aria-label={`Flip ${property.title} testimonial`}
    >
      <motion.div
        className="relative will-change-transform"
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
          transformPerspective: 1100,
        }}
      >
        <motion.div
          className="relative"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.85, ease: luxuryEase }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="relative overflow-hidden bg-sand shadow-none transition-shadow duration-500 min-[1400px]:shadow-[0_32px_64px_-30px_rgba(17,17,16,0.5)] min-[1400px]:group-hover:shadow-[0_48px_90px_-22px_rgba(17,17,16,0.62)]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderRadius: "2.4rem 0.55rem 2.2rem 1.6rem",
            }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ borderRadius: "2.4rem 0.55rem 2.2rem 1.6rem" }}
              >
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              </div>
            </div>

            <motion.div
              className="glass absolute top-6 right-5 px-4 py-2"
              style={{ borderRadius: "1.15rem 0.3rem 1.15rem 1.15rem" }}
            >
              <p className="font-display text-2xl leading-none">
                {formatPrice(property.price)}
              </p>
            </motion.div>

            <span className="absolute top-6 left-5 rounded-full bg-ink/65 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-ivory uppercase backdrop-blur">
              Featured
            </span>

            <div className="absolute right-6 bottom-6 left-6">
              <h3 className="font-display text-[30px] leading-[0.9] text-ivory sm:text-[34px]">
                {property.title}
              </h3>
              <p className="mt-2 text-sm text-ivory/80">
                {property.city}, {property.state}
              </p>
              <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-ivory/70 uppercase">
                {property.beds} Beds · {property.baths} Baths ·{" "}
                {formatNumber(property.sqft)} sqft
              </p>
            </div>
          </div>

          <div
            className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-[#171512] p-8 text-ivory shadow-none min-[1400px]:shadow-[0_32px_64px_-30px_rgba(17,17,16,0.55)]"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderRadius: "0.55rem 2.4rem 1.6rem 2.2rem",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-[1.2rem_0.3rem_1.2rem_1.2rem]">
                <Image
                  src={property.buyer.photo}
                  alt={property.buyer.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div>
                <p className="font-display text-2xl leading-none">
                  {property.buyer.name}
                </p>
                <p className="mt-1 text-gold-soft">★★★★★</p>
              </div>
            </div>
            <blockquote className="font-display text-[22px] leading-[1.15] sm:text-[26px]">
              “{property.buyer.quote}”
            </blockquote>
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              Click to view residence
            </p>
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
          style={{
            backgroundImage: glare,
            opacity: springGlare,
            borderRadius: "2.4rem 0.55rem 2.2rem 1.6rem",
          }}
        />
      </motion.div>
    </motion.button>
  );
}
