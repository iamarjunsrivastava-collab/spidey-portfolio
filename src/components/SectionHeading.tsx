import { useEffect, useRef } from "react";
import { DUR, EASE, gsap } from "@/lib/motion";

type Props = {
  eyebrow: string;
  title: string;
  className?: string;
};

/**
 * Centered editorial section heading: red eyebrow, heavy italic title with a
 * red offset shadow, and a short red rule underneath.
 */
export function SectionHeading({ eyebrow, title, className = "" }: Props) {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scope = root.current;
      if (!scope) return;
      const st = { trigger: scope, start: "top 85%" };
      gsap
        .timeline({ scrollTrigger: st, defaults: { ease: EASE.out } })
        .from(".sh-eyebrow", { y: 14, opacity: 0, duration: DUR.base })
        .from(
          ".sh-title",
          { yPercent: 60, rotateX: -45, opacity: 0, transformOrigin: "50% 100%", duration: DUR.reveal },
          "-=0.5",
        )
        .from(".sh-rule", { scaleX: 0, transformOrigin: "50% 50%", duration: 0.7 }, "-=0.7");
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={`text-center [perspective:1000px] ${className}`}>
      <p className="sh-eyebrow font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-primary">
        {eyebrow}
      </p>
      <h2 className="sh-title title-3d mt-3 font-display text-[clamp(1.9rem,4.2vw,3.4rem)] uppercase leading-[1.05] text-foreground">
        {title}
      </h2>
      <span className="sh-rule mx-auto mt-3 block h-[3px] w-12 bg-primary" />
    </div>
  );
}
