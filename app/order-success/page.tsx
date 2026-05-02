"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { CheckCircle, ArrowLeft, Clock, MapPin, Package } from "lucide-react";
import { useCart } from "../context/CartContext";

/* ─── Confetti System ────────────────────────────────────────── */

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  gravity: number;
  drag: number;
}

const CONFETTI_COLORS = [
  "#ff3a26", // red
  "#ffb627", // gold
  "#22c55e", // green
  "#4285F4", // blue
  "#f7f1e8", // cream
  "#ff6b00", // orange
  "#ff3a80", // pink
  "#a855f7", // purple
];

function createConfettiParticle(canvasWidth: number): ConfettiParticle {
  return {
    x: Math.random() * canvasWidth,
    y: -20 - Math.random() * 100,
    vx: (Math.random() - 0.5) * 8,
    vy: Math.random() * 3 + 2,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 12,
    width: Math.random() * 8 + 4,
    height: Math.random() * 6 + 2,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    opacity: 1,
    gravity: 0.12 + Math.random() * 0.08,
    drag: 0.97 + Math.random() * 0.02,
  };
}

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Size canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create initial burst
    const particles: ConfettiParticle[] = [];
    for (let i = 0; i < 150; i++) {
      const p = createConfettiParticle(canvas.width);
      p.vy = Math.random() * 6 + 4;
      p.vx = (Math.random() - 0.5) * 12;
      particles.push(p);
    }

    // Second wave
    setTimeout(() => {
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push(createConfettiParticle(canvas.width));
      }
    }, 500);

    // Third wave
    setTimeout(() => {
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push(createConfettiParticle(canvas.width));
      }
    }, 1200);

    particlesRef.current = particles;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const alive: ConfettiParticle[] = [];

      for (const p of particlesRef.current) {
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Fade out near bottom
        if (p.y > canvas.height * 0.7) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0 && p.y < canvas.height + 50) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
          ctx.restore();
          alive.push(p);
        }
      }

      particlesRef.current = alive;

      if (alive.length > 0) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden="true"
    />
  );
}

/* ─── Success Content ────────────────────────────────────────── */

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const orderId = searchParams.get("oid") || "CKP-XXXXXXXX";
  const total = searchParams.get("total") || "0";
  const method = searchParams.get("method") || "gpay";
  const customerName = searchParams.get("name") || "Guest";
  const itemCount = searchParams.get("items") || "1";

  const [showContent, setShowContent] = useState(false);
  const [deliveryMins] = useState(() => Math.floor(Math.random() * 11) + 30); // 30–40 mins
  const hasClearedRef = useRef(false);

  // Clear cart only once on mount
  useEffect(() => {
    if (!hasClearedRef.current) {
      hasClearedRef.current = true;
      clearCart();
    }
  }, [clearCart]);

  // Play success sound on mount
  useEffect(() => {
    try {
      const ctx = new AudioContext();
      // Victory fanfare: ascending arpeggio
      const notes = [
        { freq: 523.25, time: 0 },      // C5
        { freq: 659.25, time: 0.12 },    // E5
        { freq: 783.99, time: 0.24 },    // G5
        { freq: 1046.5, time: 0.4 },     // C6
      ];

      notes.forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.4);
        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + 0.4);
      });
    } catch {
      // Audio not available
    }
  }, []);

  // Staggered content reveal
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const methodLabels: Record<string, string> = {
    gpay: "Google Pay",
    phonepe: "PhonePe",
    paytm: "Paytm",
    card: "Debit/Credit Card",
  };

  const getEstimatedTime = useCallback(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + deliveryMins);
    return now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, [deliveryMins]);

  return (
    <>
      <ConfettiCanvas />

      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12 text-center text-ink">
        {/* Success icon with animated glow */}
        <div
          className={`success-icon-entrance mb-8 flex h-28 w-28 items-center justify-center rounded-full transition-all duration-1000 ${showContent ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
          style={{
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))",
            boxShadow:
              "0 0 80px rgba(34,197,94,0.25), 0 0 160px rgba(34,197,94,0.1)",
          }}
        >
          <CheckCircle size={56} style={{ color: "#22c55e" }} />
        </div>

        {/* Title */}
        <h1
          className={`text-3xl italic transition-all duration-700 delay-200 sm:text-4xl md:text-5xl ${showContent ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          style={{ fontFamily: "var(--font-bodoni)" }}
        >
          Order Placed{" "}
          <span style={{ color: "#22c55e" }}>Successfully!</span> 🎉
        </h1>

        {/* Subtitle */}
        <p
          className={`mt-4 max-w-md text-sm leading-relaxed opacity-50 transition-all duration-700 delay-300 ${showContent ? "translate-y-0 opacity-50" : "translate-y-6 opacity-0"}`}
        >
          Hey {customerName}! Your order is confirmed and our kitchen is already
          firing up the wood-fired oven. Buon appetito!
        </p>

        {/* Order details card */}
        <div
          className={`mt-10 w-full max-w-sm overflow-hidden rounded-xl border transition-all duration-700 delay-500 ${showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          style={{
            borderColor: "var(--color-hairline)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {/* Card header */}
          <div
            className="border-b px-6 py-4"
            style={{ borderColor: "var(--color-hairline)" }}
          >
            <span
              className="text-[10px] tracking-[0.25em] opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ORDER CONFIRMATION
            </span>
          </div>

          {/* Card body */}
          <div className="space-y-4 px-6 py-5">
            {/* Order ID */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={14} className="opacity-40" />
                <span
                  className="text-[10px] tracking-[0.2em] opacity-40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ORDER ID
                </span>
              </div>
              <span
                className="rounded-md px-2.5 py-1 text-[11px] font-bold tracking-[0.1em]"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "rgba(255,58,38,0.1)",
                  color: "var(--color-red)",
                }}
              >
                {orderId}
              </span>
            </div>

            {/* Items */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] tracking-[0.2em] opacity-40"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ITEMS
              </span>
              <span
                className="text-[11px] tracking-[0.1em] opacity-70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {itemCount} item{Number(itemCount) > 1 ? "s" : ""}
              </span>
            </div>

            {/* Amount Paid */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] tracking-[0.2em] opacity-40"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                AMOUNT PAID
              </span>
              <span
                className="text-base italic"
                style={{
                  fontFamily: "var(--font-bodoni)",
                  color: "var(--color-gold)",
                }}
              >
                ₹{total}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] tracking-[0.2em] opacity-40"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                PAID VIA
              </span>
              <span
                className="text-[11px] tracking-[0.1em] opacity-70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {methodLabels[method] || method}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] tracking-[0.2em] opacity-40"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                STATUS
              </span>
              <span
                className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.1em]"
                style={{ fontFamily: "var(--font-mono)", color: "#22c55e" }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ background: "#22c55e" }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: "#22c55e" }}
                  />
                </span>
                CONFIRMED
              </span>
            </div>
          </div>

          {/* Delivery estimate */}
          <div
            className="border-t px-6 py-4"
            style={{
              borderColor: "var(--color-hairline)",
              background: "rgba(255,182,39,0.03)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "rgba(255,182,39,0.1)" }}
              >
                <Clock size={18} style={{ color: "var(--color-gold)" }} />
              </div>
              <div className="text-left">
                <p
                  className="text-[10px] tracking-[0.2em] opacity-40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ESTIMATED DELIVERY
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {deliveryMins} minutes{" "}
                  <span className="opacity-40">· by {getEstimatedTime()}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery address hint */}
        <div
          className={`mt-6 flex items-center gap-2 transition-all duration-700 delay-700 ${showContent ? "translate-y-0 opacity-30" : "translate-y-4 opacity-0"}`}
        >
          <MapPin size={14} />
          <span
            className="text-[10px] tracking-[0.1em]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            DELIVERING TO YOUR ADDRESS
          </span>
        </div>

        {/* Back to menu button */}
        <button
          onClick={() => router.push("/")}
          className={`mt-10 inline-flex items-center gap-2 rounded-full px-8 py-3 text-[12px] tracking-[0.15em] text-white transition-all duration-700 delay-[800ms] hover:scale-105 ${showContent ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          style={{
            fontFamily: "var(--font-mono)",
            background: "linear-gradient(135deg, #ff3a26 0%, #e02010 100%)",
            boxShadow: "0 0 40px rgba(255,58,38,0.3)",
          }}
        >
          <ArrowLeft size={14} />
          BACK TO MENU
        </button>

        {/* Thank you footer */}
        <p
          className={`mt-8 text-[10px] tracking-[0.2em] opacity-20 transition-all duration-700 delay-[900ms] ${showContent ? "translate-y-0 opacity-20" : "translate-y-4 opacity-0"}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          THANK YOU FOR CHOOSING CHICKOPIZZA 🍕
        </p>
      </div>
    </>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg text-ink">
          <span
            className="text-[11px] tracking-[0.2em] opacity-40"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            LOADING…
          </span>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
