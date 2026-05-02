"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatINR } from "../lib/menu-data";
import PaymentModal from "../components/PaymentModal";

/* ─── Checkout Page ──────────────────────────────────────────── */

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalCount, increment, decrement, removeItem } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paying, setPaying] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const TAX_RATE = 0.05; // 5% GST
  const tax = Math.round(subtotal * TAX_RATE);
  const deliveryFee = subtotal > 0 ? 49 : 0;
  const grandTotal = subtotal + tax + deliveryFee;

  const isFormValid =
    name.trim().length >= 2 &&
    phone.trim().length >= 10 &&
    address.trim().length >= 5 &&
    items.length > 0;

  const handlePay = (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid || paying) return;
    // Open payment method selection modal — do NOT clear cart
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (orderId: string, method: string) => {
    setPaying(true);
    setShowPaymentModal(false);
    // Cart is cleared on the success page, NOT here
    // Pass order info as URL params to the success page
    const params = new URLSearchParams({
      oid: orderId,
      total: String(grandTotal),
      method,
      name: name.trim(),
      items: String(totalCount),
    });
    router.push(`/order-success?${params.toString()}`);
  };

  const handlePaymentClose = () => {
    if (!paying) {
      setShowPaymentModal(false);
    }
  };

  // If cart is empty, show redirect
  if (items.length === 0 && !paying) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center text-ink">
        <p
          className="text-[11px] tracking-[0.2em] opacity-50"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          YOUR CART IS EMPTY
        </p>
        <p
          className="mt-2 text-sm italic opacity-30"
          style={{ fontFamily: "var(--font-bodoni)" }}
        >
          Add items from our menu first.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[11px] tracking-[0.15em] text-white transition-all duration-300 hover:scale-105"
          style={{
            fontFamily: "var(--font-mono)",
            background: "var(--color-red)",
            boxShadow: "0 0 24px rgba(255,58,38,0.3)",
          }}
        >
          <ArrowLeft size={14} />
          BACK TO MENU
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen bg-bg px-4 pb-20 pt-8 text-ink md:px-8 transition-all duration-500 ${showPaymentModal ? "scale-[0.98] opacity-80" : ""}`}>
        <div className="mx-auto max-w-5xl">
          {/* Back button */}
          <button
            onClick={() => router.push("/")}
            className="mb-8 inline-flex items-center gap-2 text-[11px] tracking-[0.15em] opacity-50 transition-opacity duration-300 hover:opacity-100"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <ArrowLeft size={14} />
            BACK TO MENU
          </button>

          {/* Page title */}
          <h1
            className="text-4xl italic sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            Checkout<span style={{ color: "var(--color-red)" }}>.</span>
          </h1>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* ── Left: Order Summary ── */}
            <div className="lg:col-span-7">
              <h2
                className="text-[11px] tracking-[0.25em] opacity-50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ORDER SUMMARY ({totalCount} ITEM{totalCount > 1 ? "S" : ""})
              </h2>

              <div
                className="mt-6 divide-y"
                style={
                  {
                    "--tw-divide-opacity": 1,
                    borderColor: "var(--color-hairline)",
                  } as React.CSSProperties
                }
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-4"
                    style={{ borderColor: "var(--color-hairline)" }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="h-16 w-16 flex-shrink-0 rounded-sm bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        filter: "contrast(1.1) brightness(0.85) saturate(1.1)",
                      }}
                    />

                    {/* Name + qty */}
                    <div className="flex-1">
                      <h3
                        className="text-sm italic"
                        style={{ fontFamily: "var(--font-bodoni)" }}
                      >
                        {item.name}
                      </h3>
                      <span
                        className="text-[10px] tracking-[0.1em] opacity-40"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {formatINR(item.price)} each
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-0">
                      <button
                        onClick={() => decrement(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-l-sm border opacity-60 transition-opacity hover:opacity-100"
                        style={{ borderColor: "var(--color-hairline)" }}
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        className="flex h-7 w-8 items-center justify-center border-y text-[11px] tabular-nums"
                        style={{
                          borderColor: "var(--color-hairline)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increment(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-r-sm border opacity-60 transition-opacity hover:opacity-100"
                        style={{ borderColor: "var(--color-hairline)" }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Line total */}
                    <span
                      className="w-16 text-right text-sm italic tabular-nums"
                      style={{
                        fontFamily: "var(--font-bodoni)",
                        color: "var(--color-gold)",
                      }}
                    >
                      {formatINR(item.price * item.quantity)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="opacity-30 transition-opacity hover:opacity-100"
                      style={{ color: "var(--color-red)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div
                className="mt-6 space-y-2 border-t pt-4"
                style={{ borderColor: "var(--color-hairline)" }}
              >
                <div className="flex justify-between text-sm opacity-50">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em" }}>
                    SUBTOTAL
                  </span>
                  <span style={{ fontFamily: "var(--font-bodoni)", fontStyle: "italic" }}>
                    {formatINR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm opacity-50">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em" }}>
                    GST (5%)
                  </span>
                  <span style={{ fontFamily: "var(--font-bodoni)", fontStyle: "italic" }}>
                    {formatINR(tax)}
                  </span>
                </div>
                <div className="flex justify-between text-sm opacity-50">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em" }}>
                    DELIVERY
                  </span>
                  <span style={{ fontFamily: "var(--font-bodoni)", fontStyle: "italic" }}>
                    {formatINR(deliveryFee)}
                  </span>
                </div>
                <div
                  className="flex justify-between border-t pt-3"
                  style={{ borderColor: "var(--color-hairline)" }}
                >
                  <span
                    className="text-[12px] tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    TOTAL
                  </span>
                  <span
                    className="text-xl italic tabular-nums"
                    style={{
                      fontFamily: "var(--font-bodoni)",
                      color: "var(--color-gold)",
                    }}
                  >
                    {formatINR(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Right: Customer Details + Pay ── */}
            <div className="lg:col-span-5">
              <h2
                className="text-[11px] tracking-[0.25em] opacity-50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                DELIVERY DETAILS
              </h2>

              <form onSubmit={handlePay} className="mt-6 space-y-5">
                {/* Name */}
                <div>
                  <label
                    className="text-[10px] tracking-[0.2em] opacity-40"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arjun Sharma"
                    required
                    minLength={2}
                    className="mt-1 w-full border-b bg-transparent py-2 text-sm outline-none placeholder:opacity-20 focus:border-[var(--color-red)]"
                    style={{
                      borderColor: "var(--color-hairline)",
                      fontFamily: "var(--font-inter)",
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    className="text-[10px] tracking-[0.2em] opacity-40"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    minLength={10}
                    className="mt-1 w-full border-b bg-transparent py-2 text-sm outline-none placeholder:opacity-20 focus:border-[var(--color-red)]"
                    style={{
                      borderColor: "var(--color-hairline)",
                      fontFamily: "var(--font-inter)",
                    }}
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    className="text-[10px] tracking-[0.2em] opacity-40"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    DELIVERY ADDRESS
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat/House No, Street, Landmark, City, Pincode"
                    required
                    minLength={5}
                    rows={3}
                    className="mt-1 w-full resize-none border-b bg-transparent py-2 text-sm outline-none placeholder:opacity-20 focus:border-[var(--color-red)]"
                    style={{
                      borderColor: "var(--color-hairline)",
                      fontFamily: "var(--font-inter)",
                    }}
                  />
                </div>

                {/* Pay button */}
                <button
                  type="submit"
                  disabled={!isFormValid || paying}
                  className="group flex w-full items-center justify-center gap-2 rounded-full py-4 text-[13px] font-medium tracking-[0.15em] text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: isFormValid
                      ? "linear-gradient(135deg, #ff3a26 0%, #e02010 100%)"
                      : "rgba(255,58,38,0.3)",
                    boxShadow: isFormValid
                      ? "0 0 40px rgba(255,58,38,0.35)"
                      : "none",
                  }}
                >
                  {paying ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      REDIRECTING…
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      PAY {formatINR(grandTotal)}
                    </>
                  )}
                </button>

                {/* Payment method icons */}
                <div className="flex items-center justify-center gap-4">
                  {["GPay", "PhonePe", "Paytm", "Cards"].map((m) => (
                    <span
                      key={m}
                      className="text-[9px] tracking-[0.1em] opacity-20"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {m}
                    </span>
                  ))}
                </div>

                {/* Security note */}
                <p
                  className="text-center text-[9px] tracking-[0.1em] opacity-25"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  🔒 SECURE PAYMENT · 256-BIT ENCRYPTION
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        grandTotal={grandTotal}
        customerName={name}
        onClose={handlePaymentClose}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
