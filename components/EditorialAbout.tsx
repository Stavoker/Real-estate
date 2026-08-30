"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EDITORIAL_IMAGES } from "@/lib/properties";

const blocks = [
  {
    kicker: "01 — Search",
    title: "Personalized Search",
    copy: "We begin with how you live. Light, privacy, the way a kitchen should feel at seven in the evening. The list we return is short on purpose.",
    image: EDITORIAL_IMAGES.search,
    radius: "2.8rem 0.5rem 2.2rem 1.6rem",
    reverse: false,
  },
  {
    kicker: "02 — Market",
    title: "Market Expertise",
    copy: "Miami, Austin, Los Angeles. We read off-market movement the way others read listings — quietly, ahead of the noise, with relationships that open doors.",
    image: EDITORIAL_IMAGES.expertise,
    radius: "0.5rem 2.8rem 1.4rem 2.4rem",
    reverse: true,
  },
  {
    kicker: "03 — Process",
    title: "Stress-Free Process",
    copy: "Tours, diligence, and closing are choreographed so you never feel the machinery. You feel the house, and then you have the keys.",
    image: EDITORIAL_IMAGES.process,
    radius: "2.2rem 2.2rem 0.45rem 2.4rem",
    reverse: false,
  },
];

function EditorialBlock({
  block,
}: {
  block: (typeof blocks)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-36, 36]);

  return (
    <div
      ref={ref}
      className={`grid items-center gap-10 lg:grid-cols-12 ${
        block.reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="relative lg:col-span-7">
        <div
          className="relative aspect-[5/4] overflow-hidden bg-sand shadow-[0_40px_80px_-40px_rgba(17,17,16,0.45)]"
          style={{ borderRadius: block.radius }}
        >
          <motion.div className="absolute -inset-8" style={{ y }}>
            <Image
              src={block.image}
              alt={block.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </motion.div>
        </div>
        <div
          className="absolute -right-6 -bottom-8 hidden h-[46%] w-[38%] overflow-hidden shadow-2xl lg:block"
          style={{ borderRadius: "1.6rem 0.35rem 1.6rem 1.2rem" }}
        >
          <Image src={block.image} alt="" fill className="object-cover scale-125" sizes="200px" />
        </div>
      </div>
      <div className="lg:col-span-5">
        <p className="font-mono text-[11px] tracking-[0.26em] text-gold uppercase">
          {block.kicker}
        </p>
        <h3 className="font-display mt-4 text-5xl leading-[0.95]">
          {block.title}
        </h3>
        <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-ink-soft">
          {block.copy}
        </p>
      </div>
    </div>
  );
}

export function EditorialAbout() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-[1400px] space-y-28 px-6 md:px-10">
        <div>
          <p className="font-mono text-[11px] tracking-[0.28em] text-ink-soft uppercase">
            The Studio
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-[clamp(2.4rem,8vw,3rem)] leading-[0.95] md:text-7xl">
            A quieter way to find an extraordinary home.
          </h2>
        </div>
        {blocks.map((block) => (
          <EditorialBlock key={block.title} block={block} />
        ))}
      </div>
    </section>
  );
}
