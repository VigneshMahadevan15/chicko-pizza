"use client";

import FloatingPizza from "./FloatingPizza";

const INGREDIENTS = [
  { label: "Dough", detail: "12-day cold ferment" },
  { label: "Tomato", detail: "San Marzano D.O.P." },
  { label: "Cheese", detail: "Mozzarella di Bufala" },
  { label: "Fire", detail: "Quercia oak, 900°F" },
];

export default function Prologue() {
  return (
    <section
      id="prologue"
      className="relative border-t py-20 md:py-32"
      style={{ borderColor: "var(--color-hairline)" }}
    >
      {/* Floating pizzas */}
      <FloatingPizza
        size={180}
        frame={45}
        opacity={0.06}
        className="-left-20 top-20"
        parallax={0.05}
      />
      <FloatingPizza
        size={120}
        frame={120}
        opacity={0.05}
        className="-right-10 bottom-32"
        parallax={-0.04}
        spin
      />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          {/* Left rail */}
          <div className="md:col-span-3" data-reveal>
            <span
              className="text-[10px] tracking-[0.3em] opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              (02)
            </span>
            <div
              className="mt-2 text-[11px] tracking-[0.25em] opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              PROLOGUE
            </div>
            <div
              className="mt-4 h-px w-12"
              style={{ background: "var(--color-hairline)" }}
            />
            <p
              className="mt-4 text-[11px] italic opacity-30"
              style={{ fontFamily: "var(--font-bodoni)" }}
            >
              Naples, 2006.
            </p>
          </div>

          {/* Right content */}
          <div className="md:col-span-9">
            <p
              data-reveal
              className="drop-cap text-lg leading-relaxed opacity-70 sm:text-xl md:text-2xl"
              style={{
                fontFamily: "var(--font-bodoni)",
                fontStyle: "italic",
              }}
            >
              In a narrow vicolo off Via dei Tribunali, where the scent of
              charred oak and tomato sauce has stained the limestone for
              generations, a family first pressed dough against stone. They did
              not call it artisanal. They did not call it craft. They called it
              dinner. Three generations later, the fire still burns, the dough
              still rests for twelve patient days, and every pizza emerges in
              sixty incandescent seconds — leopard-spotted, trembling with heat,
              faithful to the only recipe that ever mattered.
            </p>

            {/* Ingredient credits */}
            <div
              className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4"
              data-reveal
              data-reveal-delay="2"
            >
              {INGREDIENTS.map((ing) => (
                <div key={ing.label}>
                  <div
                    className="text-[10px] tracking-[0.2em] opacity-40"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {ing.label}
                  </div>
                  <div
                    className="mt-1 text-sm opacity-60"
                    style={{ fontFamily: "var(--font-bodoni)" }}
                  >
                    {ing.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
