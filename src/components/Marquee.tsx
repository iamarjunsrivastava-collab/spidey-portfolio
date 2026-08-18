import { useEffect, useRef } from "react";
import { gsap, pauseOffscreen, prefersReducedMotion } from "@/lib/motion";
import maskAsset from "@/assets/mask-red.png.asset.json";
import webAsset from "@/assets/web.png.asset.json";

const ITEMS = [
  "Data Science",
  "Machine Learning",
  "Power BI Dashboards",
  "Python & SQL",
  "NLP / LLMs",
  "Cloud & Analytics",
];

function Row({ rowClass, tone }: { rowClass: string; tone: "red" | "black" }) {
  return (
    <div className={`${rowClass} flex shrink-0 items-center gap-5 pr-5 sm:gap-8 sm:pr-8 md:gap-12 md:pr-12`}>
      {ITEMS.map((item, i) => (
        <span key={item} className="flex items-center gap-5 sm:gap-8 md:gap-12">
          <span className="font-display whitespace-nowrap text-lg uppercase tracking-tight sm:text-2xl md:text-4xl">
            {item}
          </span>
          {i % 2 === 0 ? (
            <img
              src={maskAsset.url}
              alt=""
              aria-hidden
              className="h-7 w-12 shrink-0 rounded-[2px] object-cover sm:h-9 sm:w-16 md:h-12 md:w-20"
            />
          ) : (
            <img
              src={webAsset.url}
              alt=""
              aria-hidden
              className={`h-5 w-5 shrink-0 object-contain sm:h-7 sm:w-7 md:h-9 md:w-9 ${
                tone === "red" ? "opacity-70 invert-0" : "opacity-80 invert"
              }`}
            />
          )}
        </span>
      ))}
    </div>
  );
}

function Strip({
  rowClass,
  wrapClass,
  tone,
}: {
  rowClass: string;
  wrapClass: string;
  tone: "red" | "black";
}) {
  return (
    <div className={`w-[130%] -ml-[15%] overflow-hidden py-3 md:py-4 ${wrapClass}`}>
      <div className="flex w-max">
        <Row rowClass={rowClass} tone={tone} />
        <Row rowClass={rowClass} tone={tone} />
        <Row rowClass={rowClass} tone={tone} />
      </div>
    </div>
  );
}

export function Marquee() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const scope = root.current;
      if (!scope) return;

      gsap.set(".marquee-b", { xPercent: -100 });
      const a = gsap.to(".marquee-a", { xPercent: -100, duration: 28, ease: "none", repeat: -1 });
      const b = gsap.to(".marquee-b", { xPercent: 0, duration: 34, ease: "none", repeat: -1 });
      pauseOffscreen(a, scope);
      pauseOffscreen(b, scope);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative isolate overflow-hidden py-8 sm:py-12 md:py-16">
      {/* black strip, rising left-to-right, sits behind */}
      <div className="relative z-0 -rotate-3">
        <Strip
          wrapClass="bg-foreground text-primary border-y-2 border-primary"
          rowClass="marquee-b"
          tone="black"
        />
      </div>
      {/* red strip, descending left-to-right, crosses on top */}
      <div className="relative z-10 rotate-3 -mt-[3.25rem] sm:-mt-[4.5rem] md:-mt-24">
        <Strip
          wrapClass="bg-primary text-primary-foreground border-y-2 border-foreground/70"
          rowClass="marquee-a"
          tone="red"
        />
      </div>
    </div>
  );
}
