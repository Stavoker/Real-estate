"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";

const nav = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const [sent, setSent] = useState(false);

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#161412] text-ivory"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-gold/20 blur-[90px]" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#3a2e22] blur-[80px]" />
        <div className="grain opacity-30" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-24 pb-10 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] tracking-[0.28em] text-gold-soft uppercase">
              Private Client Desk
            </p>
            <h2 className="font-display mt-4 max-w-md text-5xl leading-[0.95] md:text-6xl">
              Begin a quieter search.
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">
              Share a few words about how you live. We reply within one business
              day with a private shortlist.
            </p>
          </div>

          <form
            className="lg:col-span-7"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase">
                  Name
                </span>
                <input
                  required
                  className="mt-2 w-full rounded-[1.4rem_0.4rem_1.4rem_1.4rem] border border-white/10 bg-white/5 px-5 py-4 text-sm outline-none transition focus:border-gold/50"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase">
                  Email
                </span>
                <input
                  required
                  type="email"
                  className="mt-2 w-full rounded-[1.4rem_1.4rem_0.4rem_1.4rem] border border-white/10 bg-white/5 px-5 py-4 text-sm outline-none transition focus:border-gold/50"
                  placeholder="you@studio.com"
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase">
                Newsletter
              </span>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Private market notes, monthly"
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-4 text-sm outline-none transition focus:border-gold/50"
                />
                <MagneticButton type="submit" variant="light">
                  {sent ? "Received" : "Join List"}
                </MagneticButton>
              </div>
            </label>
          </form>
        </div>

        <div className="mt-20 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px_4px_10px_4px] bg-ivory font-display text-ink">
                É
              </span>
              <span className="font-display text-2xl">EasyEstate</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              A private residential studio for Miami, Austin, and Los Angeles.
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-white/40 uppercase">
              Navigation
            </p>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-white/40 uppercase">
              Contact
            </p>
            <p className="mt-4 text-sm text-white/70">+1 (305) 555-0148</p>
            <p className="text-sm text-white/70">hello@easyestate.com</p>
            <p className="mt-3 text-sm text-white/50">By appointment only.</p>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-white/40 uppercase">
              Socials
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Pinterest
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[11px] tracking-[0.16em] text-white/35 uppercase sm:flex-row">
          <span>© {new Date().getFullYear()} EasyEstate. All rights reserved.</span>
          <span>Crafted for private residential clients.</span>
        </div>
      </div>

      {sent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute right-8 bottom-24 rounded-full bg-gold/20 px-4 py-2 text-xs tracking-widest text-gold-soft uppercase"
        >
          We will be in touch.
        </motion.div>
      )}
    </footer>
  );
}
