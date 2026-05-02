import type { Metadata } from "next";
import { Bodoni_Moda, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHICKOPIZZA — Artisanal Neapolitan Pizzeria · Est. 2006",
  description:
    "900° wood-fired. 60 seconds. Centuries of devotion. Authentic Neapolitan pizza crafted with San Marzano D.O.P. tomatoes, Mozzarella di Bufala, and quercia oak fire.",
  keywords: [
    "Neapolitan pizza",
    "wood-fired",
    "artisanal",
    "Naples",
    "CHICKOPIZZA",
    "San Marzano",
    "Mozzarella di Bufala",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" as="image" href="/frames/frame_0001.jpg" />
      </head>
      <body className="min-h-full bg-bg text-ink">
        {/* SVG Film Grain Overlay */}
        <svg className="grain-overlay" aria-hidden="true">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
