"use client";

import SplitText from "./SplitText";

const FEATURES = [
  {
    num: "01",
    title: "Lightning Fast",
    desc: "Specialized e-scooters dispatch within five city blocks. Twenty minutes, door to door, never less than piping hot.",
  },
  {
    num: "02",
    title: "900° Wood-Fired",
    desc: "Stone hearth fired with quercia oak. The crust leopards in seconds; the cheese settles in milliseconds.",
  },
  {
    num: "03",
    title: "100% Organic",
    desc: "San Marzano tomatoes and Mozzarella di Bufala flown in weekly from the slopes of Vesuvius and the plains of Campania.",
  },
  {
    num: "04",
    title: "Heritage Craft",
    desc: "Twelve days of cold fermentation. Three generations of dough wisdom. Passed by hand, never by paper.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative border-t py-20 md:py-32"
      style={{ borderColor: "var(--color-hairline)" }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-3" data-reveal>
            <span
              className="text-[10px] tracking-[0.3em] opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              (06)
            </span>
            <div
              className="mt-2 text-[11px] tracking-[0.25em] opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              FEATURES
            </div>
            <div
              className="mt-4 h-px w-12"
              style={{ background: "var(--color-hairline)" }}
            />
          </div>
          <div className="md:col-span-9">
            <h2
              className="text-3xl italic leading-tight sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-bodoni)" }}
              data-reveal
              data-reveal-delay="1"
            >
              <SplitText
                parts={[
                  "Rooted in ",
                  { text: "centuries.", className: "text-red" },
                ]}
                stagger={35}
                by="char"
              />
            </h2>
            <h2
              className="mt-1 text-3xl italic leading-tight sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-bodoni)" }}
              data-reveal
              data-reveal-delay="2"
            >
              <SplitText
                parts={["Refined for today."]}
                stagger={35}
                delay={400}
                by="char"
              />
            </h2>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid grid-cols-1 gap-0 sm:grid-cols-2">
          {FEATURES.map((feature, i) => {
            const isLastInRowDesktop = i % 2 === 1;
            const isLastRowDesktop = i >= FEATURES.length - 2;
            const isLastItem = i === FEATURES.length - 1;

            const borderRight = isLastInRowDesktop ? "" : "sm:border-r";
            const borderBottom = isLastItem
              ? ""
              : isLastRowDesktop
              ? "border-b sm:border-b-0"
              : "border-b";

            return (
              <div
                key={feature.num}
                className={`group relative p-6 md:p-10 ${borderRight} ${borderBottom}`}
                style={{ borderColor: "var(--color-hairline)" }}
                data-reveal
                data-reveal-delay={String(Math.min(i + 1, 4))}
              >
                {/* Number */}
                <span
                  className="text-[10px] tracking-[0.3em] opacity-30"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {feature.num}
                </span>

                {/* Title with hover underline */}
                <h3 className="relative mt-3 inline-block">
                  <span
                    className="text-xl italic sm:text-2xl"
                    style={{ fontFamily: "var(--font-bodoni)" }}
                  >
                    {feature.title}
                  </span>
                  {/* Animated underline */}
                  <span
                    className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-500 group-hover:w-12"
                    style={{ background: "var(--color-red)" }}
                  />
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-45">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
