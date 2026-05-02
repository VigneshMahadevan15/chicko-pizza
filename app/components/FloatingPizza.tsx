"use client";

import { useRef, useEffect } from "react";
import { framePath } from "../lib/frames";

interface FloatingPizzaProps {
  size?: number;
  frame?: number;
  opacity?: number;
  spin?: boolean;
  parallax?: number;
  className?: string;
}

/**
 * FloatingPizza — decorative pizza orb using a single frame as background-image.
 * Circular, soft red drop-shadow, CSS float-y bob animation.
 * Optional spin and scroll-driven parallax.
 */
export default function FloatingPizza({
  size = 200,
  frame = 1,
  opacity = 0.08,
  spin = false,
  parallax = 0,
  className = "",
}: FloatingPizzaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!parallax || !ref.current) return;

    let ticking = false;
    const el = ref.current;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const offset = (center - viewCenter) * parallax;
        el.style.setProperty("--parallax-y", `${offset}px`);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [parallax]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
        borderRadius: "50%",
        backgroundImage: `url(${framePath(frame)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 0 80px 20px rgba(255, 58, 38, 0.15)",
        animation: `float-y 8s ease-in-out infinite${
          spin ? ", spin-slow 40s linear infinite" : ""
        }`,
        transform: "translate3d(0, var(--parallax-y, 0px), 0)",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}
