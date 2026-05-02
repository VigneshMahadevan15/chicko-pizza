"use client";

import { ArrowRight } from "lucide-react";
import SplitText from "./SplitText";
import FloatingPizza from "./FloatingPizza";

export default function FinalCTA() {
  return (
    <section
      id="cta"
      className="relative flex items-center justify-center overflow-hidden border-t"
      style={{
        borderColor: "var(--color-hairline)",
        minHeight: "80vh",
      }}
    >
      {/* Floating pizzas */}
      <FloatingPizza
        size={700}
        frame={150}
        opacity={0.06}
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        spin
      />
      <FloatingPizza
        size={120}
        frame={30}
        opacity={0.08}
        className="-left-10 top-20"
        parallax={0.03}
      />
      <FloatingPizza
        size={90}
        frame={200}
        opacity={0.06}
        className="-right-6 bottom-20"
        parallax={-0.04}
        spin
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center md:px-8 md:py-32">
        {/* Section label */}
        <div className="mb-8" data-reveal>
          <span
            className="text-[10px] tracking-[0.3em] opacity-40"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            (07) — CTA
          </span>
        </div>

        {/* Big headline */}
        <div data-reveal data-reveal-delay="1">
          <h2
            className="text-4xl italic leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            <SplitText
              parts={["One bite."]}
              stagger={42}
              by="char"
            />
          </h2>
          <h2
            className="mt-2 text-4xl italic leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            <SplitText
              parts={[{ text: "You're hooked.", className: "text-red" }]}
              stagger={42}
              delay={400}
              by="char"
            />
          </h2>
        </div>

        {/* Hours */}
        <p
          className="mt-8 text-sm leading-relaxed opacity-40"
          data-reveal
          data-reveal-delay="2"
        >
          Tuesday – Sunday, 5pm – 11pm
          <br />
          Walk-ins welcome. Reservations honored.
        </p>

        {/* CTA buttons */}
        <div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6"
          data-reveal
          data-reveal-delay="3"
        >
          {/* Primary pill */}
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[12px] font-medium tracking-[0.15em] text-white transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--color-red)",
              boxShadow: "0 0 40px rgba(255,58,38,0.35)",
            }}
          >
            ORDER YOUR SLICE
            <ArrowRight size={14} />
          </a>

          {/* Ghost link */}
          <a
            href="#menu"
            className="inline-flex items-center gap-1 border-b pb-1 text-[11px] tracking-[0.15em] opacity-50 transition-opacity duration-300 hover:opacity-100"
            style={{
              fontFamily: "var(--font-mono)",
              borderColor: "var(--color-hairline)",
            }}
          >
            VIEW FULL MENU
          </a>
        </div>
      </div>
    </section>
  );
}
