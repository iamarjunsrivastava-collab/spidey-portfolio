import { useEffect, useRef } from "react";
import hangAsset from "@/assets/spydy_hang.png.asset.json";
import { DUR, EASE, gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Decorative figure hanging from a thin web thread anchored to the top of the
 * parent section. Drops in on scroll, then swings gently from the anchor point.
 */
export function HangingSpider({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement | null>(null);
  const pendulum = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const scope = root.current;
      const rig = pendulum.current;
      if (!scope || !rig) return;

      gsap.from(scope, {
        y: () => (window.matchMedia("(min-width: 768px)").matches ? -680 : -420),
        opacity: 0,
        duration: DUR.drop,
        ease: EASE.hang,
        scrollTrigger: { trigger: scope, start: "top 95%", invalidateOnRefresh: true },
      });

      if (reduced) return;
      gsap.set(rig, { transformOrigin: "top center" });
      gsap.fromTo(
        rig,
        { rotate: -3.5 },
        {
          rotate: 3.5,
          duration: 4.75,
          ease: EASE.ambient,
          yoyo: true,
          repeat: -1,
        },
      );

    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 ${className}`}
    >
      <div ref={pendulum} className="flex h-full w-full flex-col items-center will-change-transform">
        <span className="w-px flex-1 bg-foreground/25" />
        <img src={hangAsset.url} alt="" className="w-full object-contain" />
      </div>
    </div>
  );
}
