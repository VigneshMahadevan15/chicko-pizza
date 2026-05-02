"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatINR } from "../lib/menu-data";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    increment,
    decrement,
    removeItem,
    clearCart,
    subtotal,
    totalCount,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Lock body scroll when open
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

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 ${
          isOpen
            ? "pointer-events-auto bg-black/60 backdrop-blur-sm"
            : "pointer-events-none bg-transparent"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full flex-col border-l transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[420px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "rgba(10, 10, 10, 0.97)",
          borderColor: "var(--color-hairline)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between border-b px-6 py-5"
          style={{ borderColor: "var(--color-hairline)" }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} style={{ color: "var(--color-red)" }} />
            <h2
              className="text-[12px] tracking-[0.25em]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              YOUR ORDER
            </h2>
            {totalCount > 0 && (
              <span
                className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[9px] font-bold text-white"
                style={{ background: "var(--color-red)" }}
              >
                {totalCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-full opacity-50 transition-all duration-300 hover:opacity-100"
            style={{ background: "var(--color-hairline)" }}
            aria-label="Close cart"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Items list ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ background: "var(--color-hairline)" }}
              >
                <ShoppingBag size={28} className="opacity-30" />
              </div>
              <p
                className="text-[11px] tracking-[0.2em] opacity-40"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                YOUR CART IS EMPTY
              </p>
              <p
                className="max-w-[200px] text-xs italic opacity-25"
                style={{ fontFamily: "var(--font-bodoni)" }}
              >
                Add a pie from our menu to get started.
              </p>
              <button
                onClick={closeCart}
                className="mt-2 text-[11px] tracking-[0.15em] opacity-50 transition-opacity duration-300 hover:opacity-100"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-red)",
                }}
              >
                ← BACK TO MENU
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="cart-item-enter flex gap-4 rounded-sm border p-3 transition-all duration-300"
                  style={{ borderColor: "var(--color-hairline)" }}
                >
                  {/* Thumbnail */}
                  <div
                    className="h-20 w-20 flex-shrink-0 rounded-sm bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${item.image})`,
                      filter: "contrast(1.1) brightness(0.9) saturate(1.1)",
                    }}
                  />

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3
                        className="text-sm italic"
                        style={{ fontFamily: "var(--font-bodoni)" }}
                      >
                        {item.name}
                      </h3>
                      <span
                        className="text-[10px] tracking-[0.15em] opacity-40"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {formatINR(item.price)} each
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0">
                        <button
                          onClick={() => decrement(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-l-sm border opacity-60 transition-opacity duration-200 hover:opacity-100"
                          style={{ borderColor: "var(--color-hairline)" }}
                          aria-label={`Decrease ${item.name} quantity`}
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
                          className="flex h-7 w-7 items-center justify-center rounded-r-sm border opacity-60 transition-opacity duration-200 hover:opacity-100"
                          style={{ borderColor: "var(--color-hairline)" }}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs italic tabular-nums"
                          style={{
                            fontFamily: "var(--font-bodoni)",
                            color: "var(--color-gold)",
                          }}
                        >
                          {formatINR(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full opacity-30 transition-all duration-200 hover:opacity-100"
                          style={{ color: "var(--color-red)" }}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer (only when items exist) ── */}
        {items.length > 0 && (
          <div
            className="border-t px-6 py-5"
            style={{ borderColor: "var(--color-hairline)" }}
          >
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span
                className="text-[11px] tracking-[0.2em] opacity-50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                SUBTOTAL
              </span>
              <span
                className="text-lg italic tabular-nums"
                style={{
                  fontFamily: "var(--font-bodoni)",
                  color: "var(--color-gold)",
                }}
              >
                {formatINR(subtotal)}
              </span>
            </div>

            <p
              className="mt-1 text-[10px] tracking-[0.1em] opacity-25"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              TAXES CALCULATED AT CHECKOUT
            </p>

            {/* Checkout button — navigates to /checkout */}
            <button
              onClick={handleCheckout}
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[12px] font-medium tracking-[0.15em] text-white transition-all duration-300 hover:scale-[1.02]"
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--color-red)",
                boxShadow: "0 0 40px rgba(255,58,38,0.3)",
              }}
            >
              PROCEED TO CHECKOUT
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="mt-3 w-full text-center text-[10px] tracking-[0.15em] opacity-30 transition-opacity duration-300 hover:opacity-60"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              CLEAR CART
            </button>
          </div>
        )}
      </div>
    </>
  );
}
