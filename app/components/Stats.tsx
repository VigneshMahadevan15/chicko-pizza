"use client";

import { useEffect, useRef } from "react";
import SplitText from "./SplitText";

const STATS = [
  { value: 900, suffix: "°", label: "OVEN TEMP", detail: "Quercia oak fire" },
  { value: 60, suffix: "s", label: "BAKE TIME", detail: "Stone hearth, no shortcuts" },
  { value: 12, suffix: "d", label: "FERMENT", detail: "Slow, cold, deliberate" },
  { value: 2006, suffix: "", label: "EST.", detail: "Born from tradition" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            const start = performance.now();
            const duration = 1800;

            const tick = (now: number) => {
              const elapsed = now - start;
              const t = Math.min(elapsed / duration, 1);
              // Cubic ease-out
              const eased = 1 - Math.pow(1 - t, 3);
              const current = Math.round(eased * value);
              el.textContent = `${current}${suffix}`;

              if (t < 1) {
                requestAnimationFrame(tick);
              }
            };

            requestAnimationFrame(tick);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section
      id="stats"
      className="relative border-t py-20 md:py-32"
      style={{ borderColor: "var(--color-hairline)" }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-3" data-reveal>
            <span
              className="text-[10px] tracking-[0.3em] opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              (04)
            </span>
            <div
              className="mt-2 text-[11px] tracking-[0.25em] opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              STATS
            </div>
            <div
              className="mt-4 h-px w-12"
              style={{ background: "var(--color-hairline)" }}
            />
          </div>
          <div className="md:col-span-9" data-reveal data-reveal-delay="1">
            <h2
              className="text-3xl italic leading-tight sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-bodoni)" }}
            >
              <SplitText
                parts={[
                  "A pizza is the sum of its ",
                  { text: "discipline.", className: "text-red" },
                ]}
                stagger={30}
                by="char"
              />
            </h2>
          </div>
        </div>

        {/* Stats band */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4" data-reveal data-reveal-delay="2">
          {STATS.map((stat, i) => {
            const isLastInRowMobile = i % 2 === 1;
            const isLastInRowDesktop = i === STATS.length - 1;
            const isLastRowMobile = i >= STATS.length - 2;

            const borderRight = isLastInRowDesktop
              ? ""
              : isLastInRowMobile
              ? "md:border-r"
              : "border-r";
            const borderBottom = isLastRowMobile ? "" : "border-b md:border-b-0";

            return (
              <div
                key={stat.label}
                className={`px-4 py-8 text-center md:px-6 ${borderRight} ${borderBottom}`}
                style={{ borderColor: "var(--color-hairline)" }}
              >
                <div
                  className="text-4xl italic sm:text-5xl md:text-6xl"
                  style={{
                    fontFamily: "var(--font-bodoni)",
                    color: "var(--color-ink)",
                  }}
                >
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div
                  className="mt-3 text-[10px] tracking-[0.25em] opacity-50"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {stat.label}
                </div>
                <div
                  className="mt-1 text-xs italic opacity-30"
                  style={{ fontFamily: "var(--font-bodoni)" }}
                >
                  {stat.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
