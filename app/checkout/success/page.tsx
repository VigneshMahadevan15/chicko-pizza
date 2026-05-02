"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentId = searchParams.get("pid") || "N/A";
  const total = searchParams.get("total") || "0";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center text-ink">
      {/* Success icon with glow */}
      <div
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full"
        style={{
          background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))",
          boxShadow: "0 0 60px rgba(34,197,94,0.2)",
        }}
      >
        <CheckCircle size={48} style={{ color: "#22c55e" }} />
      </div>

      <h1
        className="text-3xl italic sm:text-4xl md:text-5xl"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Payment{" "}
        <span style={{ color: "#22c55e" }}>Successful!</span>
      </h1>

      <p className="mt-4 max-w-md text-sm leading-relaxed opacity-50">
        Your order has been confirmed. Our kitchen is firing up the oven now.
        Expect your delivery in 20–30 minutes.
      </p>

      {/* Payment details */}
      <div
        className="mt-8 w-full max-w-sm space-y-3 rounded-sm border p-6 text-left"
        style={{ borderColor: "var(--color-hairline)" }}
      >
        <div className="flex justify-between">
          <span
            className="text-[10px] tracking-[0.2em] opacity-40"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            PAYMENT ID
          </span>
          <span
            className="text-[11px] tracking-[0.1em] opacity-70"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {paymentId}
          </span>
        </div>
        <div className="flex justify-between">
          <span
            className="text-[10px] tracking-[0.2em] opacity-40"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            AMOUNT PAID
          </span>
          <span
            className="text-sm italic"
            style={{
              fontFamily: "var(--font-bodoni)",
              color: "var(--color-gold)",
            }}
          >
            ₹{total}
          </span>
        </div>
        <div className="flex justify-between">
          <span
            className="text-[10px] tracking-[0.2em] opacity-40"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            STATUS
          </span>
          <span
            className="text-[11px] font-bold tracking-[0.1em]"
            style={{ fontFamily: "var(--font-mono)", color: "#22c55e" }}
          >
            CONFIRMED
          </span>
        </div>
      </div>

      {/* Back to menu */}
      <button
        onClick={() => router.push("/")}
        className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[11px] tracking-[0.15em] text-white transition-all duration-300 hover:scale-105"
        style={{
          fontFamily: "var(--font-mono)",
          background: "var(--color-red)",
          boxShadow: "0 0 24px rgba(255,58,38,0.3)",
        }}
      >
        <ArrowLeft size={14} />
        ORDER AGAIN
      </button>

      {/* Thank you */}
      <p
        className="mt-8 text-[10px] tracking-[0.2em] opacity-20"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        THANK YOU FOR CHOOSING CHICKOPIZZA
      </p>
    </div>
  );
}

export default function SuccessPage() {
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
