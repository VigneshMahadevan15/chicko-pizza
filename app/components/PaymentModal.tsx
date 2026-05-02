"use client";

import { useState, useEffect, useCallback } from "react";
import { X, CreditCard, Loader2, CheckCircle } from "lucide-react";
import { formatINR } from "../lib/menu-data";

/* ─── Types ──────────────────────────────────────────────────── */

type PaymentMethod = "gpay" | "phonepe" | "paytm" | "card";

interface PaymentModalProps {
  isOpen: boolean;
  grandTotal: number;
  customerName: string;
  onClose: () => void;
  onSuccess: (orderId: string, method: PaymentMethod) => void;
}

/* ─── Payment method configs ─────────────────────────────────── */

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  sublabel: string;
  icon: string;
  gradient: string;
  glow: string;
}[] = [
  {
    id: "gpay",
    label: "Google Pay",
    sublabel: "UPI · Instant",
    icon: "G",
    gradient: "linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 75%, #EA4335 100%)",
    glow: "rgba(66,133,244,0.3)",
  },
  {
    id: "phonepe",
    label: "PhonePe",
    sublabel: "UPI · Instant",
    icon: "₱",
    gradient: "linear-gradient(135deg, #5f259f 0%, #7b3bb5 100%)",
    glow: "rgba(95,37,159,0.3)",
  },
  {
    id: "paytm",
    label: "Paytm",
    sublabel: "UPI · Wallet",
    icon: "P",
    gradient: "linear-gradient(135deg, #00BAF2 0%, #0097CC 100%)",
    glow: "rgba(0,186,242,0.3)",
  },
  {
    id: "card",
    label: "Debit / Credit Card",
    sublabel: "Visa · Mastercard · RuPay",
    icon: "💳",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    glow: "rgba(255,255,255,0.1)",
  },
];

/* ─── Generate fake order ID ─────────────────────────────────── */

function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "CKP-";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/* ─── Processing status messages ─────────────────────────────── */

const UPI_STEPS = [
  "Initializing secure connection…",
  "Opening payment app…",
  "Waiting for authorization…",
  "Verifying payment…",
  "Payment confirmed!",
];

const CARD_STEPS = [
  "Encrypting card details…",
  "Contacting bank server…",
  "Processing transaction…",
  "Verifying 3D Secure…",
  "Payment authorized!",
];

/* ─── Component ──────────────────────────────────────────────── */

export default function PaymentModal({
  isOpen,
  grandTotal,
  customerName,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [step, setStep] = useState<"select" | "processing" | "done">("select");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setSelectedMethod(null);
      setProcessingStep(0);
      setProgressPercent(0);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && step === "select") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, step, onClose]);

  // Processing simulation
  const startProcessing = useCallback(
    (method: PaymentMethod) => {
      setStep("processing");
      const steps = method === "card" ? CARD_STEPS : UPI_STEPS;
      const totalDuration = method === "card" ? 4000 : 3000;
      const stepDuration = totalDuration / steps.length;

      // Animate progress bar
      const progressInterval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 1;
        });
      }, totalDuration / 100);

      // Step through status messages
      steps.forEach((_, i) => {
        setTimeout(() => {
          setProcessingStep(i);
        }, i * stepDuration);
      });

      // Complete after total duration
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgressPercent(100);
        setStep("done");

        // Play success sound (Web Audio API)
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          // Pleasant success chime: C5 → E5 → G5
          const notes = [523.25, 659.25, 783.99];
          osc.type = "sine";
          gain.gain.setValueAtTime(0.15, ctx.currentTime);

          notes.forEach((freq, i) => {
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
          });

          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.6);
        } catch {
          // Audio not available
        }

        // Redirect after success animation
        setTimeout(() => {
          const orderId = generateOrderId();
          onSuccess(orderId, method);
        }, 1200);
      }, totalDuration + 400);
    },
    [onSuccess]
  );

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleProceed = () => {
    if (!selectedMethod) return;
    startProcessing(selectedMethod);
  };

  if (!isOpen) return null;

  const methodConfig = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
  const steps = selectedMethod === "card" ? CARD_STEPS : UPI_STEPS;

  return (
    <>
      {/* Backdrop */}
      <div
        className="payment-modal-backdrop fixed inset-0 z-[80]"
        onClick={step === "select" ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div
          className="payment-modal-content relative w-full max-w-md overflow-hidden rounded-2xl border"
          style={{
            background: "rgba(12, 12, 12, 0.98)",
            borderColor: "var(--color-hairline)",
            backdropFilter: "blur(40px)",
            boxShadow:
              "0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(255,58,38,0.08)",
          }}
        >
          {/* ── Step 1: Method Selection ── */}
          {step === "select" && (
            <div className="payment-step-enter">
              {/* Header */}
              <div
                className="flex items-center justify-between border-b px-6 py-5"
                style={{ borderColor: "var(--color-hairline)" }}
              >
                <div>
                  <h2
                    className="text-[12px] tracking-[0.25em]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    PAYMENT METHOD
                  </h2>
                  <p
                    className="mt-1 text-[10px] tracking-[0.1em] opacity-40"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    TOTAL: {formatINR(grandTotal)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full opacity-50 transition-all duration-300 hover:opacity-100"
                  style={{ background: "var(--color-hairline)" }}
                  aria-label="Close payment"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Payment options */}
              <div className="space-y-3 p-6">
                {PAYMENT_METHODS.map((method, i) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      className="payment-method-item group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300"
                      style={{
                        animationDelay: `${i * 60}ms`,
                        borderColor: isSelected
                          ? "var(--color-red)"
                          : "var(--color-hairline)",
                        background: isSelected
                          ? "rgba(255,58,38,0.06)"
                          : "transparent",
                        boxShadow: isSelected
                          ? "0 0 20px rgba(255,58,38,0.1)"
                          : "none",
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: method.gradient,
                          boxShadow: `0 4px 16px ${method.glow}`,
                          fontFamily:
                            method.id === "card"
                              ? "inherit"
                              : "var(--font-mono)",
                        }}
                      >
                        {method.icon}
                      </div>

                      {/* Label */}
                      <div className="flex-1">
                        <span
                          className="text-sm font-medium"
                          style={{
                            fontFamily: "var(--font-inter)",
                            color: isSelected
                              ? "var(--color-ink)"
                              : "rgba(247,241,232,0.8)",
                          }}
                        >
                          {method.label}
                        </span>
                        <span
                          className="mt-0.5 block text-[10px] tracking-[0.1em] opacity-40"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {method.sublabel}
                        </span>
                      </div>

                      {/* Selection indicator */}
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300"
                        style={{
                          borderColor: isSelected
                            ? "var(--color-red)"
                            : "var(--color-hairline)",
                          background: isSelected
                            ? "var(--color-red)"
                            : "transparent",
                        }}
                      >
                        {isSelected && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Proceed button */}
              <div className="border-t px-6 py-5" style={{ borderColor: "var(--color-hairline)" }}>
                <button
                  onClick={handleProceed}
                  disabled={!selectedMethod}
                  className="group flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[12px] font-medium tracking-[0.15em] text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-30 disabled:hover:scale-100"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: selectedMethod
                      ? "linear-gradient(135deg, #ff3a26 0%, #e02010 100%)"
                      : "rgba(255,58,38,0.2)",
                    boxShadow: selectedMethod
                      ? "0 0 40px rgba(255,58,38,0.3)"
                      : "none",
                  }}
                >
                  {selectedMethod ? (
                    <>
                      PAY {formatINR(grandTotal)}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  ) : (
                    "SELECT A METHOD"
                  )}
                </button>

                <p
                  className="mt-3 text-center text-[9px] tracking-[0.1em] opacity-25"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  🔒 SECURED · 256-BIT ENCRYPTION · SIMULATION ONLY
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2: Processing ── */}
          {step === "processing" && methodConfig && (
            <div className="payment-step-enter px-6 py-10">
              {/* Method icon large */}
              <div className="flex flex-col items-center">
                <div
                  className="payment-icon-pulse mb-6 flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white"
                  style={{
                    background: methodConfig.gradient,
                    boxShadow: `0 0 40px ${methodConfig.glow}, 0 0 80px ${methodConfig.glow}`,
                    fontFamily:
                      methodConfig.id === "card"
                        ? "inherit"
                        : "var(--font-mono)",
                  }}
                >
                  {methodConfig.icon}
                </div>

                <h3
                  className="text-lg font-medium"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {methodConfig.id === "card"
                    ? "Processing Card Payment"
                    : `Opening ${methodConfig.label}…`}
                </h3>

                <p
                  className="mt-1 text-[10px] tracking-[0.15em] opacity-40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {formatINR(grandTotal)} · {customerName.toUpperCase()}
                </p>

                {/* Progress bar */}
                <div className="mt-8 w-full">
                  <div
                    className="h-1 w-full overflow-hidden rounded-full"
                    style={{ background: "var(--color-hairline)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-200 ease-out"
                      style={{
                        width: `${progressPercent}%`,
                        background:
                          "linear-gradient(90deg, var(--color-red), var(--color-gold))",
                        boxShadow: "0 0 12px rgba(255,58,38,0.5)",
                      }}
                    />
                  </div>
                </div>

                {/* Status message */}
                <div className="mt-5 flex items-center gap-2">
                  <Loader2
                    size={14}
                    className="animate-spin"
                    style={{ color: "var(--color-red)" }}
                  />
                  <span
                    className="payment-status-text text-[11px] tracking-[0.1em] opacity-60"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {steps[processingStep]}
                  </span>
                </div>

                {/* Simulated phone interaction hint */}
                {methodConfig.id !== "card" && processingStep >= 1 && processingStep < 3 && (
                  <div className="mt-6 rounded-lg border p-3" style={{ borderColor: "var(--color-hairline)" }}>
                    <p
                      className="text-[10px] tracking-[0.1em] opacity-30"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      💡 IN REAL FLOW: CHECK YOUR PHONE FOR {methodConfig.label.toUpperCase()} NOTIFICATION
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Done (brief flash before redirect) ── */}
          {step === "done" && (
            <div className="payment-step-enter px-6 py-16">
              <div className="flex flex-col items-center">
                <div
                  className="payment-success-check mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))",
                    boxShadow: "0 0 60px rgba(34,197,94,0.3)",
                  }}
                >
                  <CheckCircle size={40} style={{ color: "#22c55e" }} />
                </div>

                <h3
                  className="text-xl italic"
                  style={{ fontFamily: "var(--font-bodoni)" }}
                >
                  Payment{" "}
                  <span style={{ color: "#22c55e" }}>Successful!</span>
                </h3>

                <p
                  className="mt-2 text-[10px] tracking-[0.15em] opacity-40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  REDIRECTING TO ORDER CONFIRMATION…
                </p>

                <Loader2
                  size={16}
                  className="mt-4 animate-spin opacity-30"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
