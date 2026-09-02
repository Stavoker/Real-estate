"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 520, suffix: "+", label: "Homes Sold" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 180, prefix: "$", suffix: "M", label: "Property Value" },
  { value: 10, suffix: "", label: "Years Experience" },
];

function Counter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative py-8">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex justify-center rounded-[2.5rem_0.6rem_2.5rem_1.8rem] bg-[#171512] px-6 py-14 text-ivory sm:px-8 md:px-14">
          <div className="grid w-full grid-cols-2 justify-items-center gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="flex w-full max-w-[14rem] flex-col items-center text-center"
              >
                <p className="font-display text-5xl md:text-6xl">
                  <Counter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </p>
                <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-gold-soft uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
