"use client";

import { ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { label: "01 MENU", href: "#menu" },
  { label: "02 STORY", href: "#prologue" },
  { label: "03 LOCAL", href: "#features" },
  { label: "04 CONTACT", href: "#cta" },
];

export default function Nav() {
  return (
    <nav
      id="nav"
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
      style={{
        borderColor: "var(--color-hairline)",
        background: "rgba(0,0,0,0.7)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Wordmark */}
        <a href="#hero" className="flex items-baseline gap-2">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            CHICKOPIZZA<span style={{ color: "var(--color-red)" }}>.</span>
          </span>
          <span
            className="hidden text-[9px] tracking-[0.2em] opacity-40 sm:inline"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            EST. 2006
          </span>
        </a>

        {/* Center links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] tracking-[0.15em] opacity-50 transition-opacity duration-300 hover:opacity-100"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Order Now pill */}
        <a
          href="#cta"
          className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-[0.1em] transition-all duration-300 hover:shadow-lg sm:px-4 sm:py-2"
          style={{
            fontFamily: "var(--font-mono)",
            background: "var(--color-red)",
            color: "#fff",
            boxShadow: "0 0 20px rgba(255,58,38,0.3)",
          }}
        >
          {/* Pulsing presence dot */}
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: "rgba(255,255,255,0.6)" }}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          ORDER<span className="hidden sm:inline">&nbsp;NOW</span>
          <ArrowUpRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </nav>
  );
}
