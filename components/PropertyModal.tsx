"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Property } from "@/lib/properties";
import { formatPrice, formatNumber, luxuryEase } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
}

export function PropertyModal({ property, onClose }: PropertyModalProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
    if (!property) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [property, onClose]);

  return (
    <AnimatePresence>
      {property && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-stretch justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            aria-label="Close property details"
            className="absolute inset-0 bg-[#111110]/35 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="property-title"
            initial={{ opacity: 0, y: 40, scale: 0.98, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: luxuryEase }}
            className="relative z-10 m-0 flex h-[100svh] w-full flex-col overflow-y-auto bg-ivory md:m-4 md:h-[calc(100svh-2rem)] md:rounded-[2.2rem_0.6rem_2.2rem_1.6rem]"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-ink backdrop-blur-xl"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="relative h-[46vh] min-h-[280px] w-full overflow-hidden md:h-[52vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: luxuryEase }}
                >
                  <Image
                    src={property.gallery[active]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-ivory via-transparent to-black/20" />
              <div className="absolute bottom-8 left-6 md:left-12">
                <p className="font-mono text-[11px] tracking-[0.24em] text-ink-soft uppercase">
                  {property.city}, {property.state}
                </p>
                <h2
                  id="property-title"
                  className="font-display mt-2 text-5xl leading-none md:text-7xl"
                >
                  {property.title}
                </h2>
              </div>
            </div>

            <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 py-10 md:px-12 lg:grid-cols-12">
              <div className="flex gap-3 overflow-x-auto pb-2 lg:col-span-12">
                {property.gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    aria-label={`Show photo ${i + 1}`}
                    className={`relative h-20 w-28 shrink-0 cursor-pointer overflow-hidden touch-manipulation transition duration-300 ${
                      i === active
                        ? "opacity-100 ring-2 ring-ink ring-offset-2 ring-offset-ivory"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={{
                      borderRadius:
                        i % 2 === 0
                          ? "1.1rem 0.3rem 1.1rem 0.9rem"
                          : "0.3rem 1.1rem 0.9rem 1.1rem",
                    }}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="112px" />
                  </button>
                ))}
              </div>

              <div className="lg:col-span-7">
                <p className="font-display text-5xl">{formatPrice(property.price)}</p>
                <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {[
                    ["Location", `${property.city}, ${property.state}`],
                    ["Bedrooms", String(property.beds)],
                    ["Bathrooms", String(property.baths)],
                    ["Square footage", `${formatNumber(property.sqft)} sqft`],
                    ["Year built", String(property.yearBuilt)],
                    ["Residence", property.type],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-mono text-[10px] tracking-[0.2em] text-ink-soft uppercase">
                        {k}
                      </dt>
                      <dd className="mt-1 text-lg">{v}</dd>
                    </div>
                  ))}
                </dl>

                <p className="font-display mt-10 text-[28px] leading-[1.25] text-ink">
                  {property.description}
                </p>

                <div className="mt-10">
                  <p className="font-mono text-[10px] tracking-[0.22em] text-ink-soft uppercase">
                    Features
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {property.features.map((f) => (
                      <li
                        key={f}
                        className="rounded-full bg-white/70 px-4 py-2 text-sm ring-1 ring-black/5"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <aside className="lg:col-span-5">
                <div className="glass sticky top-6 rounded-[2rem_0.5rem_2rem_1.5rem] p-6 shadow-[0_24px_50px_-28px_rgba(17,17,16,0.35)]">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-[1.15rem_0.3rem_1.15rem_1.15rem]">
                      <Image
                        src={property.agent.photo}
                        alt={property.agent.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <p className="font-display text-2xl leading-none">
                        {property.agent.name}
                      </p>
                      <p className="mt-1 text-sm text-ink-soft">
                        {property.agent.title}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm">{property.agent.phone}</p>
                  <p className="text-sm text-ink-soft">{property.agent.email}</p>
                  <div className="mt-6 flex flex-col gap-3">
                    <MagneticButton href="#contact">Schedule Tour</MagneticButton>
                    <MagneticButton href="#contact" variant="light">
                      Contact Agent
                    </MagneticButton>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
