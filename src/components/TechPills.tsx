import { useEffect, useRef } from "react";
import { canHover, DUR, EASE, gsap, on, pauseOffscreen, prefersReducedMotion } from "@/lib/motion";

type TechPillsProps = {
  technologies?: string[];
  className?: string;
  /** ScrollTrigger start position for the entrance. */
  start?: string;
};

const DEFAULT_TECH = [
  "React",
  "Node.js",
  "Express",
  "PostgreSQL",
  "MongoDB",
  "Docker",
];

/**
 * Premium technology pills.
 *
 * Entrance: scale 0.5 -> 1, opacity 0 -> 1, y 20 -> 0 with back.out + stagger.
 * Ambient: subtle vertical float, sine.inOut, yoyo, randomly staggered.
 * Hover: accent background, white text, slightly larger shadow — smooth.
 */
export function TechPills({
  technologies = DEFAULT_TECH,
  className = "",
  start = "top 85%",
}: TechPillsProps) {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const scope = root.current;
      if (!scope) return;
      const pills = gsap.utils.toArray<HTMLElement>(".tp-pill", scope);

      if (prefersReducedMotion()) {
        gsap.set(pills, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // ---- entrance ---------------------------------------------------
      // Minimal overshoot: they arrive, they don't pop.
      // The float loop also owns `y`, so it may only start once the entrance
      // has released that property — otherwise the two fight mid-reveal.
      const startFloat = () => {
        const float = gsap.to(pills, {
          y: -3,
          duration: 4.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.35, from: "random" },
        });
        pauseOffscreen(float, scope);
      };

      gsap
        .timeline({ scrollTrigger: { trigger: scope, start }, onComplete: startFloat })
        .from(pills, {
          scale: 0.8,
          opacity: 0,
          y: 14,
          duration: 0.9,
          ease: "back.out(1.1)",
          stagger: 0.06,
        });

      // ---- hover micro-interaction ------------------------------------
      if (!canHover()) return;

      pills.forEach((pill) => {
        cleanups.push(
          on(pill, "pointerenter", () =>
            gsap.to(pill, {
              yPercent: -14,
              duration: DUR.micro,
              ease: EASE.soft,
              overwrite: "auto",
            }),
          ),
          on(pill, "pointerleave", () =>
            gsap.to(pill, {
              yPercent: 0,
              duration: 0.45,
              ease: EASE.soft,
              overwrite: "auto",
            }),
          ),
        );
      });

    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [start]);

  return (
    <div ref={root} className={`tp flex flex-wrap gap-3 ${className}`}>
      {technologies.map((t) => (
        <span
          key={t}
          className="tp-pill cursor-default rounded-full border border-foreground/15 bg-background px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors duration-300 ease-out hover:border-transparent hover:bg-primary hover:text-primary-foreground will-change-transform"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
