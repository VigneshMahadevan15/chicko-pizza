"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { TOTAL_FRAMES, framePath } from "../lib/frames";

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const orbRedRef = useRef<HTMLDivElement>(null);
  const orbGoldRef = useRef<HTMLDivElement>(null);

  // Overlay refs
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotateRef = useRef({ x: 0, y: 0, tx: 0 });
  const currentRotateRef = useRef({ x: 0, y: 0, tx: 0 });
  const rafIdRef = useRef(0);
  const tickingRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded >= Math.floor(TOTAL_FRAMES * 0.8)) {
          setReady(true);
        }
      };
      img.onerror = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
      };
      images[i - 1] = img;
    }

    imagesRef.current = images;
  }, []);

  // Draw a frame to canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    // CONTAIN fit with 10% breathing margin
    const scale = Math.min(cw / img.width, ch / img.height) * 0.9;
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Setup scroll handler + rAF loop + resize
  useEffect(() => {
    if (!ready) return;

    resizeCanvas();

    // Draw first frame immediately
    drawFrame(0);

    // Scroll handler with rAF throttle
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) {
          tickingRef.current = false;
          return;
        }
        const rect = section.getBoundingClientRect();
        const p = clamp01(
          -rect.top / (section.offsetHeight - window.innerHeight)
        );
        progressRef.current = p;

        const frameIdx = Math.round(p * (TOTAL_FRAMES - 1));
        if (frameIdx !== currentFrameRef.current) {
          currentFrameRef.current = frameIdx;
          drawFrame(frameIdx);
        }

        // Update overlay visibility via refs — NO setState
        if (eyebrowRef.current) {
          const eyeOpacity = p < 0.6 ? 1 : Math.max(0, 1 - (p - 0.6) / 0.2);
          eyebrowRef.current.style.opacity = String(eyeOpacity);
        }
        if (headlineRef.current) {
          const hlY = -p * 60;
          const hlScale = 1 - p * 0.12;
          headlineRef.current.style.transform = `translateY(${hlY}px) scale(${hlScale})`;
        }
        if (subheadRef.current) {
          const subOpacity = p > 0.75 ? (p - 0.75) / 0.25 : 0;
          const subY = p > 0.75 ? (1 - (p - 0.75) / 0.25) * 20 : 20;
          subheadRef.current.style.opacity = String(subOpacity);
          subheadRef.current.style.transform = `translateY(${subY}px)`;
        }
        if (scrollCueRef.current) {
          const cueOpacity = p < 0.2 ? 1 - p / 0.2 : 0;
          scrollCueRef.current.style.opacity = String(cueOpacity);
        }

        // Ambient orbs parallax
        if (orbRedRef.current) {
          orbRedRef.current.style.transform = `translateY(${p * -80}px)`;
        }
        if (orbGoldRef.current) {
          orbGoldRef.current.style.transform = `translateY(${p * 60}px)`;
        }

        // Canvas scale
        if (canvasWrapRef.current) {
          canvasWrapRef.current.style.transform = `translateY(${
            Math.sin(Date.now() * 0.0011) * 5
          }px) scale(${1 + p * 0.08})`;
        }

        tickingRef.current = false;
      });
    };

    // Mouse move handler for stage parallax + spotlight
    const onMouseMove = (e: MouseEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current = { x: e.clientX, y: e.clientY };
      targetRotateRef.current = {
        x: -y * 10,
        y: x * 12,
        tx: x * 10,
      };

      // Spotlight follow
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${e.clientX - 100}px, ${e.clientY - 100}px, 0)`;
        spotlightRef.current.classList.add("is-active");
      }
    };

    const onMouseLeave = () => {
      targetRotateRef.current = { x: 0, y: 0, tx: 0 };
      if (spotlightRef.current) {
        spotlightRef.current.classList.remove("is-active");
      }
    };

    // Continuous rAF loop
    const loop = () => {
      const t = Date.now() * 0.001;
      const lerp = 0.08;

      // Lerp rotation
      currentRotateRef.current.x +=
        (targetRotateRef.current.x - currentRotateRef.current.x) * lerp;
      currentRotateRef.current.y +=
        (targetRotateRef.current.y - currentRotateRef.current.y) * lerp;
      currentRotateRef.current.tx +=
        (targetRotateRef.current.tx - currentRotateRef.current.tx) * lerp;

      // Stage parallax
      if (stageRef.current) {
        stageRef.current.style.transform = `perspective(1200px) rotateX(${currentRotateRef.current.x}deg) rotateY(${currentRotateRef.current.y}deg) translateX(${currentRotateRef.current.tx}px)`;
      }

      // Bob on canvas wrap
      if (canvasWrapRef.current) {
        const p = progressRef.current;
        const bob = Math.sin(t * 1.1) * 5;
        canvasWrapRef.current.style.transform = `translateY(${bob}px) scale(${
          1 + p * 0.08
        })`;
      }

      // Halo bloom
      if (haloRef.current) {
        const scale = 1 + Math.sin(t * 0.7) * 0.04;
        haloRef.current.style.transform = `scale(${scale})`;
      }

      // Floor shadow
      if (shadowRef.current) {
        const bob = Math.sin(t * 1.1) * 5;
        const scaleY = 1 - (bob + 5) / 30;
        shadowRef.current.style.transform = `scaleY(${Math.max(0.4, scaleY)})`;
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas);
    const stage = stageRef.current;
    if (stage) {
      stage.addEventListener("mousemove", onMouseMove);
      stage.addEventListener("mouseleave", onMouseLeave);
    }

    rafIdRef.current = requestAnimationFrame(loop);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeCanvas);
      if (stage) {
        stage.removeEventListener("mousemove", onMouseMove);
        stage.removeEventListener("mouseleave", onMouseLeave);
      }
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [ready, drawFrame, resizeCanvas]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero relative"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-bg pt-16">
        {/* Loading veil */}
        {!ready && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-bg">
            <div className="mb-4 w-48">
              <div
                className="h-px"
                style={{ background: "var(--color-hairline)" }}
              >
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${loadProgress}%`,
                    background: "var(--color-ink)",
                  }}
                />
              </div>
            </div>
            <span
              className="text-[10px] tracking-[0.3em] opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              PREPARING… {loadProgress}%
            </span>
          </div>
        )}

        {/* Ambient orbs */}
        <div
          ref={orbRedRef}
          className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(255,58,38,0.3) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          ref={orbGoldRef}
          className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(255,182,39,0.25) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Cursor spotlight */}
        <div
          ref={spotlightRef}
          className="pointer-events-none fixed z-20 h-[200px] w-[200px] rounded-full opacity-0 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle, rgba(255,58,38,0.12) 0%, transparent 70%)",
            mixBlendMode: "screen",
          }}
          aria-hidden="true"
        >
          <style>{`.is-active { opacity: 1 !important; }`}</style>
        </div>

        {/* Text overlays */}
        <div className="relative z-10 flex flex-col items-center px-4 text-center">
          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            className="hero-entrance hero-entrance-eyebrow mb-3 md:mb-4"
          >
            <span
              className="text-[9px] tracking-[0.3em] opacity-50 sm:text-[10px] sm:tracking-[0.5em]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              — A SLICE OF NAPLES —
            </span>
          </div>

          {/* Headline */}
          <div
            ref={headlineRef}
            className="hero-entrance hero-entrance-headline"
          >
            <h1
              className="text-4xl italic sm:text-6xl md:text-7xl lg:text-8xl"
              style={{
                fontFamily: "var(--font-bodoni)",
                lineHeight: 1.05,
              }}
            >
              Taste the{" "}
              <span style={{ color: "var(--color-red)" }}>Tradition.</span>
            </h1>
          </div>

          {/* Subhead */}
          <div
            ref={subheadRef}
            className="hero-entrance hero-entrance-subhead mt-4 opacity-0"
          >
            <p
              className="text-xs tracking-[0.15em] opacity-50 sm:text-sm"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              900° wood-fired. 60 seconds. Centuries of devotion.
            </p>
          </div>
        </div>

        {/* Stage — canvas area */}
        <div
          ref={stageRef}
          className="hero-entrance hero-entrance-canvas relative flex-1 overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Halo bloom */}
          <div
            ref={haloRef}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div
              className="h-[70%] w-[70%] rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,58,38,0.08) 0%, rgba(255,182,39,0.04) 40%, transparent 70%)",
              }}
            />
          </div>

          {/* Canvas wrap */}
          <div
            ref={canvasWrapRef}
            className="relative h-full w-full"
            style={{ willChange: "transform" }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              style={{
                filter: "contrast(1.18) brightness(0.95) saturate(1.15)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 50% 60% at 50% 50%, #000 30%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.45) 70%, transparent 92%)",
                maskImage:
                  "radial-gradient(ellipse 50% 60% at 50% 50%, #000 30%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.45) 70%, transparent 92%)",
              }}
            />
          </div>

          {/* Floor shadow */}
          <div
            ref={shadowRef}
            className="pointer-events-none absolute bottom-8 left-1/2 h-8 w-[40%] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)",
              filter: "blur(12px)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Scroll cue */}
        <div
          ref={scrollCueRef}
          className="hero-entrance hero-entrance-credits absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center"
        >
          <span
            className="mb-2 text-[9px] tracking-[0.3em] opacity-40"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            SCROLL TO TASTE
          </span>
          <div
            className="h-8 w-px origin-top"
            style={{
              background: "var(--color-hairline)",
              animation: "pulseDown 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Side rails — hidden on mobile */}
        <div
          className="hero-entrance hero-entrance-rail-left pointer-events-none absolute bottom-0 left-4 top-20 z-10 hidden md:flex items-center"
          aria-hidden="true"
        >
          <span
            className="text-[9px] tracking-[0.3em] opacity-20"
            style={{
              fontFamily: "var(--font-mono)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            CHICKOPIZZA · NAPOLI · 2006 · ARTIGIANO
          </span>
        </div>
        <div
          className="hero-entrance hero-entrance-rail-right pointer-events-none absolute bottom-0 right-4 top-20 z-10 hidden md:flex items-center"
          aria-hidden="true"
        >
          <span
            className="text-[9px] tracking-[0.3em] opacity-20"
            style={{
              fontFamily: "var(--font-mono)",
              writingMode: "vertical-rl",
            }}
          >
            FOR. SCROLL — TASTE — TRADITION — ETERNAL
          </span>
        </div>

        {/* Top-corner micro-labels */}
        <div
          className="pointer-events-none absolute left-6 top-20 z-10 hidden md:block"
          aria-hidden="true"
        >
          <span
            className="text-[9px] tracking-[0.2em] opacity-25"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            (01) — HERO
          </span>
        </div>
        <div
          className="pointer-events-none absolute right-6 top-20 z-10 hidden md:block"
          aria-hidden="true"
        >
          <span
            className="text-[9px] tracking-[0.2em] opacity-25"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            NEAPOLITAN / WOOD-FIRED
          </span>
        </div>

        {/* Bottom credits row */}
        <div
          className="hero-entrance hero-entrance-credits absolute bottom-4 left-0 right-0 z-10 hidden items-center justify-between px-6 md:flex"
          aria-hidden="true"
        >
          <span
            className="text-[9px] tracking-[0.15em] opacity-25"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            FRESCO / DAILY · NO PRESERVATIVES
          </span>
          <span
            className="text-[9px] tracking-[0.15em] opacity-25"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            01 / 04 — SECTIONS
          </span>
        </div>
      </div>
    </section>
  );
}
