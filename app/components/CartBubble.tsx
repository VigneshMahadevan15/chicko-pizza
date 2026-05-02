"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartBubble() {
  const { totalCount, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full text-white transition-all duration-300 hover:scale-105 sm:bottom-6 sm:right-6"
      style={{
        fontFamily: "var(--font-mono)",
        background: "var(--color-red)",
        boxShadow: "0 0 30px rgba(255,58,38,0.3)",
        height: "44px",
        padding: "0 12px",
      }}
      aria-label="Open cart"
    >
      <ShoppingBag size={16} />
      <span className="text-[10px] tracking-[0.1em] sm:text-[11px]">
        CART ({totalCount})
      </span>

      {/* Animated ping when items exist */}
      {totalCount > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-3 w-3"
          aria-hidden="true"
        >
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ background: "var(--color-gold)" }}
          />
          <span
            className="relative inline-flex h-3 w-3 rounded-full"
            style={{ background: "var(--color-gold)" }}
          />
        </span>
      )}
    </button>
  );
}
