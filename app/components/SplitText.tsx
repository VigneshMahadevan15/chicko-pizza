"use client";

import { useRef, useEffect } from "react";

type Part = string | { text: string; className?: string };

interface SplitTextProps {
  parts: Part[];
  stagger?: number;
  delay?: number;
  by?: "char" | "word";
  className?: string;
}

/**
 * SplitText — renders each character or word as individually animated spans.
 * Each piece translates from Y:110% → 0 when the parent enters the viewport.
 */
export default function SplitText({
  parts,
  stagger = 30,
  delay = 0,
  by = "char",
  className = "",
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.querySelectorAll(".split-piece").forEach((piece) => {
        piece.classList.add("is-visible");
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll(".split-piece").forEach((piece) => {
              piece.classList.add("is-visible");
            });
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  let globalIndex = 0;

  const renderParts = () => {
    return parts.map((part, pi) => {
      const text = typeof part === "string" ? part : part.text;
      const partClass = typeof part === "string" ? "" : part.className || "";

      if (by === "word") {
        const words = text.split(/(\s+)/);
        return (
          <span key={pi} className={partClass}>
            {words.map((word, wi) => {
              if (/^\s+$/.test(word)) {
                return <span key={`${pi}-s-${wi}`}>{" "}</span>;
              }
              const idx = globalIndex++;
              return (
                <span key={`${pi}-w-${wi}`} className="split-piece">
                  <span
                    className="split-inner"
                    style={{
                      transitionDelay: `${delay + idx * stagger}ms`,
                    }}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </span>
        );
      }

      // by === "char"
      const chars = text.split("");
      return (
        <span key={pi} className={partClass}>
          {chars.map((char, ci) => {
            if (char === " ") {
              return (
                <span key={`${pi}-c-${ci}`} className="split-piece split-space">
                  <span className="split-inner">&nbsp;</span>
                </span>
              );
            }
            const idx = globalIndex++;
            return (
              <span key={`${pi}-c-${ci}`} className="split-piece">
                <span
                  className="split-inner"
                  style={{
                    transitionDelay: `${delay + idx * stagger}ms`,
                  }}
                >
                  {char}
                </span>
              </span>
            );
          })}
        </span>
      );
    });
  };

  return (
    <span ref={containerRef} className={className}>
      {renderParts()}
    </span>
  );
}
