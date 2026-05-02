"use client";

import { CartProvider } from "../context/CartContext";

/**
 * Client-side providers wrapper.
 * Keeps layout.tsx as a server component so metadata exports work.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
