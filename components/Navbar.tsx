"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn, luxuryEase } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
];

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(Math.min(1, window.scrollY / 320));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6">
      <div className="pointer-events-auto relative mx-auto max-w-[1180px]">
        <div
          className="relative z-50 flex items-center justify-between rounded-full border border-white/60 px-3.5 py-1.5 shadow-[0_10px_40px_-20px_rgba(17,17,16,0.2)] sm:px-4 sm:py-2 md:px-5"
          style={{
            background: `rgba(255, 252, 247, ${0.4 + scrolled * 0.22})`,
            backdropFilter: `blur(${20 + scrolled * 8}px) saturate(1.55)`,
            WebkitBackdropFilter: `blur(${20 + scrolled * 8}px) saturate(1.55)`,
          }}
        >
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
              <span className="absolute inset-0 rounded-[10px_4px_10px_4px] bg-ink" />
              <span className="relative font-display text-[15px] leading-none text-ivory">
                É
              </span>
            </span>
            <span className="font-display text-[22px] tracking-tight text-ink">
              EasyEstate
            </span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 min-[1400px]:block">
            <ul className="relative flex items-center gap-1 rounded-full bg-white/30 p-1 ring-1 ring-white/40">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      className={cn(
                        "relative z-10 block rounded-full px-5 py-2 text-[12px] font-medium tracking-[0.16em] uppercase transition-colors",
                        active ? "text-ivory" : "text-ink-soft hover:text-ink",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-ink"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 34,
                          }}
                        />
                      )}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center min-[1400px]:flex">
            <MagneticButton href="#contact" className="!px-5 !py-2.5 !text-[11px]">
              Contact
            </MagneticButton>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/40 text-ink backdrop-blur-xl transition hover:bg-white/70 min-[1400px]:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <>
              <motion.button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: luxuryEase }}
                className="fixed inset-0 z-40 cursor-default bg-ink/10 backdrop-blur-[2px] min-[1400px]:hidden"
              />
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.38, ease: luxuryEase }}
                className="relative z-50 mt-2 overflow-hidden rounded-[1.7rem] border border-white/55 px-2 py-2 shadow-[0_24px_60px_-28px_rgba(17,17,16,0.35)] min-[1400px]:hidden"
                style={{
                  background: "rgba(255, 252, 247, 0.62)",
                  backdropFilter: "blur(28px) saturate(1.6)",
                  WebkitBackdropFilter: "blur(28px) saturate(1.6)",
                }}
              >
                <ul className="flex flex-col">
                  {menuLinks.map((link, i) => {
                    const active =
                      link.href !== "#contact" && pathname === link.href;
                    return (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.04 + i * 0.05,
                          ease: luxuryEase,
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex min-h-14 items-center rounded-[1.2rem] px-5 text-[15px] font-medium tracking-[0.18em] uppercase transition-colors",
                            active
                              ? "bg-ink text-ivory"
                              : "text-ink hover:bg-white/55",
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
