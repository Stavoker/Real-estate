"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const x = useSpring(0, { stiffness: 180, damping: 28, mass: 0.4 });
  const y = useSpring(0, { stiffness: 180, damping: 28, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[60] hidden h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
      style={{
        x,
        y,
        opacity: visible ? 1 : 0,
        background:
          "radial-gradient(circle, rgba(184,154,106,0.22) 0%, rgba(184,154,106,0.06) 42%, transparent 70%)",
        mixBlendMode: "multiply",
      }}
    />
  );
}
