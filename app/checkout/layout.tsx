import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — CHICKOPIZZA",
  description: "Complete your order from CHICKOPIZZA.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
