"use client";

import SplitText from "./SplitText";
import FloatingPizza from "./FloatingPizza";

export default function Quote() {
  return (
    <section
      id="quote"
      className="relative flex items-center justify-center border-t"
      style={{
        borderColor: "var(--color-hairline)",
        minHeight: "60vh",
      }}
    >
      {/* Ghost pizza */}
      <FloatingPizza
        size={500}
        frame={100}
        opacity={0.08}
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        spin
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center md:px-8 md:py-32">
        {/* Section label */}
        <div className="mb-8" data-reveal>
          <span
            className="text-[10px] tracking-[0.3em] opacity-40"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            (05) — QUOTE
          </span>
        </div>

        {/* Opening quote glyph */}
        <div
          data-reveal
          className="mb-4 text-7xl italic leading-none sm:text-8xl md:text-9xl"
          style={{
            fontFamily: "var(--font-bodoni)",
            color: "var(--color-red)",
          }}
        >
          &ldquo;
        </div>

        {/* Quote text */}
        <blockquote
          data-reveal
          data-reveal-delay="1"
          className="text-2xl italic leading-relaxed sm:text-3xl md:text-4xl lg:text-5xl"
          style={{
            fontFamily: "var(--font-bodoni)",
            lineHeight: 1.3,
          }}
        >
          <SplitText
            parts={[
              "In the center of Naples, time is measured in dough rises and oven flares — ",
              { text: "never minutes.", className: "text-red" },
            ]}
            stagger={60}
            by="word"
          />
        </blockquote>

        {/* Attribution */}
        <div
          className="mt-12 flex flex-col items-center gap-3"
          data-reveal
          data-reveal-delay="3"
        >
          <div
            className="h-px w-12"
            style={{ background: "var(--color-hairline)" }}
          />
          <span
            className="text-[11px] tracking-[0.3em]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            NONNA LUCIA
          </span>
          <span
            className="text-[10px] tracking-[0.2em] opacity-40"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            PIZZAIOLA · NAPLES · 2006
          </span>
        </div>
      </div>
    </section>
  );
}
