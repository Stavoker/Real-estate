"use client";

import { motion } from "framer-motion";
import { luxuryEase } from "@/lib/utils";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: luxuryEase }}
    >
      {children}
    </motion.div>
  );
}
