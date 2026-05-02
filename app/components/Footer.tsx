"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Newsletter signup handler
    setEmail("");
  };

  return (
    <footer
      className="relative border-t py-16 md:py-24"
      style={{ borderColor: "var(--color-hairline)" }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Massive wordmark */}
        <div
          className="overflow-hidden leading-none"
          style={{
            fontFamily: "var(--font-bodoni)",
            fontStyle: "italic",
            fontSize: "clamp(4rem, 18vw, 20vw)",
            color: "var(--color-ink)",
            opacity: 0.08,
            userSelect: "none",
          }}
          aria-hidden="true"
        >
          chickopizza<span style={{ color: "var(--color-red)", opacity: 1 }}>.</span>
        </div>

        {/* Footer columns */}
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter */}
          <div>
            <h4
              className="text-[10px] tracking-[0.25em] opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              NEWSLETTER
            </h4>
            <form onSubmit={handleSubmit} className="mt-4 flex items-end gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border-b bg-transparent pb-2 text-sm outline-none placeholder:opacity-30"
                style={{
                  borderColor: "var(--color-hairline)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                }}
                required
              />
              <button
                type="submit"
                className="flex items-center gap-1 whitespace-nowrap pb-2 text-[11px] tracking-[0.1em] opacity-50 transition-opacity hover:opacity-100"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                SUBSCRIBE
                <ArrowRight size={12} />
              </button>
            </form>
          </div>

          {/* Visit */}
          <div>
            <h4
              className="text-[10px] tracking-[0.25em] opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              VISIT
            </h4>
            <div className="mt-4 text-sm leading-relaxed opacity-45">
              <p>4/758 Govindhappa naickar street</p>
              <p>porur,80138</p>
              <p className="mt-2">Tue–Sun, 5pm – 11pm</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-[10px] tracking-[0.25em] opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              CONTACT
            </h4>
            <div className="mt-4 text-sm leading-relaxed opacity-45">
              <p>+91 8072884429</p>
              <p>naandhandaleo249@gmail.com</p>
            </div>
          </div>

          {/* Follow */}
          <div>
            <h4
              className="text-[10px] tracking-[0.25em] opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              FOLLOW
            </h4>
            <div className="mt-4 flex gap-4">
              <a
                href="#"
                className="opacity-40 transition-opacity hover:opacity-100"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/>
                </svg>
              </a>
              <a
                href="#"
                className="opacity-40 transition-opacity hover:opacity-100"
                aria-label="X (Twitter)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l7.07 9.52L4 20h1.6l5.75-5.29L16 20h4.4L13 10.14 19.93 4H18.3l-5.3 4.87L8.4 4z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom legal row */}
        <div
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-6 text-[10px] tracking-[0.15em] opacity-30 sm:flex-row"
          style={{
            fontFamily: "var(--font-mono)",
            borderColor: "var(--color-hairline)",
          }}
        >
          <span>© 2024 CHICKOPIZZA. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <a href="#" className="transition-opacity hover:opacity-70">
              PRIVACY
            </a>
            <a href="#" className="transition-opacity hover:opacity-70">
              TERMS
            </a>
            <a href="#" className="transition-opacity hover:opacity-70">
              ACCESSIBILITY
            </a>
          </div>
          <span>V1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
