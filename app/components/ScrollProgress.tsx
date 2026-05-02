"use client";

import { useState, useEffect } from "react";

const CHAPTERS = [
  { id: "hero", label: "HERO" },
  { id: "prologue", label: "PROLOGUE" },
  { id: "menu", label: "MENU" },
  { id: "stats", label: "STATS" },
  { id: "quote", label: "QUOTE" },
  { id: "features", label: "FEATURES" },
  { id: "cta", label: "CTA" },
];

/**
 * ScrollProgress — fixed right-side rail with chapter labels.
 * Active chapter highlights as user scrolls.
 * Hidden below 1024px (lg breakpoint).
 */
export default function ScrollProgress() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const scrollMax =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollMax > 0 ? scrollY / scrollMax : 0;
        const idx = Math.min(
          Math.floor(progress * CHAPTERS.length),
          CHAPTERS.length - 1
        );
        setActive(idx);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:flex flex-col gap-3"
      aria-label="Page sections"
    >
      {CHAPTERS.map((ch, i) => {
        const isActive = i === active;
        return (
          <button
            key={ch.id}
            onClick={() => handleClick(ch.id)}
            className="group flex items-center gap-2 text-right"
            aria-current={isActive ? "true" : undefined}
          >
            <span
              className="block transition-all duration-500"
              style={{
                width: isActive ? 32 : 18,
                height: 1,
                background: isActive
                  ? "var(--color-red)"
                  : "rgba(247,241,232,0.2)",
              }}
            />
            <span
              className="text-[10px] tracking-[0.15em] transition-all duration-500"
              style={{
                fontFamily: "var(--font-mono)",
                color: isActive
                  ? "var(--color-ink)"
                  : "rgba(247,241,232,0.3)",
              }}
            >
              {ch.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
