"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Property } from "@/lib/properties";
import { formatPrice, formatNumber, cn, luxuryEase } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";

interface PropertyCardProps {
  property: Property;
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
  index?: number;
}

export function PropertyCard({
  property,
  expanded = false,
  onToggle,
  className,
  index = 0,
}: PropertyCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: (index % 4) * 0.04,
        ease: luxuryEase,
        layout: { duration: 0.58, ease: luxuryEase },
      }}
      onClick={onToggle}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/45 shadow-[0_18px_40px_-28px_rgba(17,17,16,0.28)] backdrop-blur-xl",
        "hover:shadow-[0_24px_48px_-24px_rgba(17,17,16,0.36)]",
        className,
      )}
    >
      <AnimatePresence>
        {expanded && (
          <motion.button
            type="button"
            aria-label={`Close ${property.title}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.35, ease: luxuryEase }}
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/65 bg-white/50 text-ink shadow-[0_10px_24px_-16px_rgba(17,17,16,0.4)] backdrop-blur-xl"
          >
            <X size={15} strokeWidth={1.75} />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "flex flex-col md:flex-row",
          expanded && "lg:min-h-[280px]",
        )}
      >
        <motion.div
          layout
          className={cn(
            "relative overflow-hidden bg-sand",
            expanded
              ? "aspect-[16/10] md:w-[46%] md:aspect-auto md:min-h-[320px]"
              : "aspect-[16/11] md:aspect-auto md:w-[40%] md:min-h-[196px]",
          )}
        >
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            sizes={expanded ? "90vw" : "(min-width: 1024px) 28vw, 90vw"}
          />
          {(property.premium || property.featured) && (
            <span className="absolute top-4 left-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-ivory uppercase backdrop-blur-md">
              {property.featured ? "Featured" : "Premium"}
            </span>
          )}
        </motion.div>

        <div className="flex flex-1 flex-col justify-center px-5 py-5 md:px-7 md:py-6">
          <div
            className={cn(
              "flex items-start justify-between gap-4",
              expanded && "pr-12",
            )}
          >
            <div className="min-w-0">
              <h3 className="font-display text-[26px] leading-[0.95] break-words sm:text-[30px] md:text-[34px]">
                {property.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-soft">
                {property.city}, {property.state}
              </p>
            </div>
            <p className="font-display shrink-0 text-[24px] leading-none text-ink sm:text-[28px] md:text-[32px]">
              {formatPrice(property.price)}
            </p>
          </div>

          <p className="mt-3 font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
            {property.beds} Beds • {property.baths} Baths •{" "}
            {formatNumber(property.sqft)} sqft
          </p>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink/80">
            “{property.blurb}”
          </p>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 18, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                transition={{ duration: 0.5, ease: luxuryEase }}
                className="overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mt-6 border-t border-ink/10 pt-6">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {property.gallery.map((src) => (
                      <div
                        key={src}
                        className="relative h-[88px] w-[120px] shrink-0 overflow-hidden rounded-[1rem_0.35rem_1rem_0.85rem]"
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="font-display mt-5 max-w-3xl text-[22px] leading-[1.3] text-ink">
                    {property.description}
                  </p>

                  <div className="mt-5">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-ink-soft uppercase">
                      Features
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {property.features.map((f) => (
                        <li
                          key={f}
                          className="rounded-full bg-white/70 px-3.5 py-1.5 text-sm ring-1 ring-black/5"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-[0.9rem_0.25rem_0.9rem_0.9rem]">
                        <Image
                          src={property.agent.photo}
                          alt={property.agent.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="font-display text-xl leading-none">
                          {property.agent.name}
                        </p>
                        <p className="mt-1 text-sm text-ink-soft">
                          {property.agent.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <MagneticButton href="#contact" className="!px-5 !py-2.5 !text-[11px]">
                        Schedule Tour
                      </MagneticButton>
                      <MagneticButton
                        href="#contact"
                        variant="light"
                        className="!px-5 !py-2.5 !text-[11px]"
                      >
                        Contact
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}
