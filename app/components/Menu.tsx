"use client";

import { useState } from "react";
import SplitText from "./SplitText";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  MENU_ITEMS,
  CATEGORIES,
  formatINR,
  type MenuItem,
  type MenuCategory,
} from "../lib/menu-data";

/* ─── Add to Cart Button (pill style with feedback) ──────────── */

function AddToCartButton({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = () => {
    if (justAdded) return;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <button
      onClick={handleClick}
      disabled={justAdded}
      className={`group/btn mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-white transition-all duration-300 ${
        justAdded
          ? "scale-95"
          : "hover:scale-105 hover:shadow-[0_0_24px_rgba(255,58,38,0.4)]"
      }`}
      style={{
        fontFamily: "var(--font-mono)",
        background: justAdded
          ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
          : "linear-gradient(135deg, #ff3a26 0%, #e02010 100%)",
        boxShadow: justAdded
          ? "0 0 20px rgba(34,197,94,0.3)"
          : "0 0 16px rgba(255,58,38,0.25)",
      }}
    >
      {justAdded ? (
        <>
          <Check size={14} className="animate-bounce" />
          ADDED!
        </>
      ) : (
        <>
          <ShoppingCart size={14} className="transition-transform duration-300 group-hover/btn:rotate-[-8deg]" />
          ADD TO CART
        </>
      )}
    </button>
  );
}

/* ─── Category Tab Bar ───────────────────────────────────────── */

function CategoryTabs({
  active,
  onChange,
}: {
  active: MenuCategory | "All";
  onChange: (cat: MenuCategory | "All") => void;
}) {
  const tabs: (MenuCategory | "All")[] = ["All", ...CATEGORIES];

  return (
    <div className="mt-10 flex flex-wrap gap-2" data-reveal data-reveal-delay="2">
      {tabs.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className="rounded-full border px-4 py-1.5 text-[10px] tracking-[0.18em] transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: "var(--font-mono)",
              borderColor: isActive
                ? "var(--color-red)"
                : "var(--color-hairline)",
              background: isActive ? "var(--color-red)" : "transparent",
              color: isActive ? "#fff" : "var(--color-ink)",
              opacity: isActive ? 1 : 0.5,
            }}
          >
            {tab.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Menu Section ───────────────────────────────────────────── */

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "All">(
    "All"
  );

  const filtered =
    activeCategory === "All"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section
      id="menu"
      className="relative border-t py-20 md:py-32"
      style={{ borderColor: "var(--color-hairline)" }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Section header */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-3" data-reveal>
            <span
              className="text-[10px] tracking-[0.3em] opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              (03)
            </span>
            <div
              className="mt-2 text-[11px] tracking-[0.25em] opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              MENU
            </div>
            <div
              className="mt-4 h-px w-12"
              style={{ background: "var(--color-hairline)" }}
            />
          </div>
          <div className="md:col-span-9">
            <div data-reveal data-reveal-delay="1">
              <h2
                className="text-3xl italic leading-tight sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-bodoni)" }}
              >
                <SplitText
                  parts={[
                    "Our craft. ",
                    { text: "Your craving.", className: "text-red" },
                  ]}
                  stagger={35}
                  by="char"
                />
              </h2>
            </div>

            {/* Category tabs */}
            <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
          </div>
        </div>

        {/* Menu grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-sm border transition-all duration-500 hover:border-[rgba(255,58,38,0.3)]"
              style={{ borderColor: "var(--color-hairline)" }}
              data-reveal
              data-reveal-delay={String(Math.min((i % 4) + 1, 4))}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    filter: "contrast(1.1) brightness(0.85) saturate(1.15)",
                  }}
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                  }}
                />

                {/* Badge */}
                {item.badge && (
                  <div
                    className="absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-[8px] font-bold tracking-[0.15em]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background:
                        item.badge.includes("🔥")
                          ? "linear-gradient(135deg, #ff3a26, #ff6b00)"
                          : item.badge === "NEW"
                          ? "var(--color-gold)"
                          : "var(--color-red)",
                      color: item.badge === "NEW" ? "#000" : "#fff",
                    }}
                  >
                    {item.badge}
                  </div>
                )}

                {/* Category label */}
                <div
                  className="absolute bottom-2 left-3 text-[9px] tracking-[0.2em] opacity-50"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item.category.toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Name + Price row */}
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="text-lg italic leading-tight sm:text-xl"
                    style={{ fontFamily: "var(--font-bodoni)" }}
                  >
                    {item.name}
                  </h3>
                  <span
                    className="flex-shrink-0 text-base italic tabular-nums"
                    style={{
                      fontFamily: "var(--font-bodoni)",
                      color: "var(--color-gold)",
                    }}
                  >
                    {formatINR(item.price)}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-2 text-xs leading-relaxed opacity-40">
                  {item.description}
                </p>

                {/* Ingredients */}
                <div
                  className="mt-2 text-[9px] tracking-[0.1em] opacity-30"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item.ingredients.join(" · ")}
                </div>

                {/* Add to cart */}
                <AddToCartButton item={item} />
              </div>
            </div>
          ))}
        </div>

        {/* Item count */}
        <div
          className="mt-8 text-center text-[10px] tracking-[0.2em] opacity-25"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          SHOWING {filtered.length} OF {MENU_ITEMS.length} ITEMS
        </div>
      </div>
    </section>
  );
}
