"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "@/lib/properties";
import { luxuryEase } from "@/lib/utils";

export function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-28">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ink-soft uppercase">
            Questions
          </p>
          <h2 className="font-display mt-3 text-5xl leading-[0.95] md:text-6xl">
            Quietly answered.
          </h2>
        </div>

        <div className="lg:col-span-8">
          {faqs.map((item, i) => {
            const active = open === i;
            return (
              <div
                key={item.q}
                className="border-b border-ink/10"
              >
                <button
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                  onClick={() => setOpen(active ? -1 : i)}
                >
                  <span className="font-display text-[22px] leading-[1.15] sm:text-2xl md:text-3xl">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: active ? 45 : 0 }}
                    transition={{ duration: 0.35, ease: luxuryEase }}
                    className="mt-2 text-2xl leading-none"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: luxuryEase }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 text-[15px] leading-relaxed text-ink-soft">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
