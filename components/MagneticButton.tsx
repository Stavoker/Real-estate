"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "dark" | "light" | "ghost";
  type?: "button" | "submit";
}

const hover = {
  scale: 1.035,
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

export function MagneticButton({
  children,
  className,
  href,
  onClick,
  variant = "dark",
  type = "button",
}: MagneticButtonProps) {
  const styles = {
    dark: "bg-ink text-ivory shadow-[0_12px_28px_-16px_rgba(17,17,16,0.5)] hover:shadow-[0_18px_34px_-14px_rgba(17,17,16,0.58)]",
    light:
      "bg-white/70 text-ink backdrop-blur-xl border border-white/70 shadow-[0_10px_24px_-18px_rgba(17,17,16,0.28)] hover:shadow-[0_16px_32px_-16px_rgba(17,17,16,0.38)] hover:bg-white",
    ghost:
      "border border-white/30 bg-white/14 text-ivory shadow-[0_12px_40px_-18px_rgba(0,0,0,0.45)] backdrop-blur-2xl hover:bg-white/20 hover:shadow-[0_12px_40px_-18px_rgba(0,0,0,0.45)]",
  }[variant];

  const shared = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[13px] font-medium tracking-[0.14em] uppercase cursor-pointer select-none origin-center",
    styles,
    className,
  );

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        whileHover={hover}
        whileTap={{ scale: 0.985 }}
        className={shared}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={hover}
      whileTap={{ scale: 0.985 }}
      className={shared}
    >
      {children}
    </motion.button>
  );
}
