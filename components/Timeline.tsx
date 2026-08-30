"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Consultation",
    copy: "A private conversation about how you live, not a checklist of rooms.",
  },
  {
    n: "02",
    title: "Property Discovery",
    copy: "A short, considered list — on and off market — assembled by a single advisor.",
  },
  {
    n: "03",
    title: "Private Tours",
    copy: "After-hours access so each residence can be felt, not simply seen.",
  },
  {
    n: "04",
    title: "Closing",
    copy: "Negotiation, diligence, and keys — composed so nothing feels hurried.",
  },
];

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 50%"],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.08, 1]);

  return (
    <section className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="font-mono text-[11px] tracking-[0.28em] text-ink-soft uppercase">
          The Process
        </p>
        <h2 className="font-display mt-3 max-w-xl text-5xl leading-[0.95] md:text-6xl">
          Four quiet steps to the door.
        </h2>

        <div ref={ref} className="relative mt-16">
          <div className="absolute top-[34px] right-0 left-0 hidden h-px bg-mist lg:block" />
          <motion.div
            className="absolute top-[34px] left-0 hidden h-px origin-left bg-gold lg:block"
            style={{ scaleX, width: "100%" }}
          />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="relative z-10 mb-6 flex h-[68px] items-start">
                  <span className="relative flex h-[18px] w-[18px] items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-gold/40 blur-[8px]" />
                    <motion.span
                      className="relative h-[10px] w-[10px] rounded-full bg-gold"
                      animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.15, 1] }}
                      transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.35 }}
                    />
                  </span>
                </div>
                <p className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">
                  {step.n}
                </p>
                <h3 className="font-display mt-2 text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
                  {step.copy}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
