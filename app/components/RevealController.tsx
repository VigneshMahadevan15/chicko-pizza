"use client";

import { useEffect } from "react";

/**
 * RevealController — mounts a single global IntersectionObserver
 * that watches any element with [data-reveal]. When it enters the
 * viewport, it receives .is-visible (fade-up + slide-in via CSS).
 * Uses MutationObserver to catch dynamically added nodes.
 * Disabled when prefers-reduced-motion: reduce.
 */
export default function RevealController() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      // Force all [data-reveal] to their end state
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-visible");
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    // Observe existing elements
    const observeAll = () => {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => {
        io.observe(el);
      });
    };

    observeAll();

    // Watch for dynamically added elements
    const mo = new MutationObserver(() => {
      observeAll();
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
