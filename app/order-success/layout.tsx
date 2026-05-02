import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed — CHICKOPIZZA",
  description: "Your CHICKOPIZZA order has been placed successfully!",
};

export default function OrderSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
