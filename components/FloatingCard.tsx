"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  label: string;
  value: string;
  className?: string;
  float?: "a" | "b" | "c";
  delay?: number;
}

export function FloatingCard({
  label,
  value,
  className,
  float = "a",
  delay = 0,
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("absolute z-20", className)}
    >
      <div
        className={cn(
          "glass asymmetric min-w-[158px] px-5 py-4 shadow-[0_30px_60px_-28px_rgba(17,17,16,0.45)]",
          float === "a" && "float-a",
          float === "b" && "float-b",
          float === "c" && "float-c",
        )}
        style={{ animationDelay: `${delay}s` }}
      >
        <p className="font-mono text-[10px] tracking-[0.22em] text-ink-soft uppercase">
          {label}
        </p>
        <p className="font-display mt-1 text-3xl leading-none text-ink">
          {value}
        </p>
      </div>
    </motion.div>
  );
}
