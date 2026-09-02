"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HERO_IMAGE } from "@/lib/properties";
import { luxuryEase } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";

export function Hero() {
  return (
    <section className="relative h-[min(78svh,40rem)] min-h-[32rem] overflow-hidden bg-ink md:h-[100svh] md:min-h-[720px]">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Luxury waterfront residence at dusk"
          fill
          priority
          className="object-cover object-[center_58%] md:object-center"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/18 to-[#111110]/72" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/20" />
      <div
        aria-hidden
        className="absolute top-[-18%] left-[-8%] h-[62%] w-[50%] rounded-full bg-[radial-gradient(circle,rgba(255,236,205,0.22),transparent_62%)]"
      />
      <div className="grain z-10 opacity-20" />

      <div className="relative z-20 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-12 md:justify-center md:px-10 md:pb-0">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="font-mono text-[11px] tracking-[0.32em] text-gold-soft uppercase"
        >
          Miami · Austin · Los Angeles
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.08, ease: luxuryEase }}
          className="font-display mt-4 w-full max-w-[72rem] text-[clamp(2.6rem,11vw,3.5rem)] leading-[1.12] text-ivory sm:text-7xl md:text-[92px] lg:max-w-[78%] xl:max-w-[68rem] xl:text-[108px]"
        >
          <span className="block">Luxury Living</span>
          <span className="block whitespace-nowrap">Made Effortless.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18, ease: luxuryEase }}
          className="mt-6 max-w-lg text-[16px] leading-relaxed text-white/75 md:max-w-xl"
        >
          We help families discover exceptional homes through a seamless and
          premium buying experience.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: luxuryEase }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <MagneticButton href="/properties" variant="light">
            Explore Properties
          </MagneticButton>
          <MagneticButton href="#contact" variant="ghost">
            Book Consultation
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
