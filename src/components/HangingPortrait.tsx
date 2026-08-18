import { useEffect, useRef } from "react";
import portrait from "@/assets/arjun.png.asset.json";
import { DUR, EASE, gsap, on, pauseOffscreen, prefersReducedMotion, canHover } from "@/lib/motion";

/**
 * A hanging profile image:
 *  - drops in from y: -800 with elastic.out
 *  - then swings continuously around "top center" (sine.inOut, yoyo, repeat -1)
 *  - grayscale by default → full color on hover
 *  - thick accent ring + breathing glow (opacity-only, no box-shadow repaint)
 *  - thread is longer on desktop
 */
export function HangingPortrait({
  className = "",
  autoEntrance = true,
}: {
  className?: string;
  /** When false, a parent timeline owns the drop-in and fires `hp:settled` on the rig. */
  autoEntrance?: boolean;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const el = root.current;
      const img = imgRef.current;
      const frame = frameRef.current;
      if (!el || !img || !frame) return;

      // ---- ambient: pendulum + breath, started once the drop settles ----
      const startAmbient = () => {
        if (reduced) return;
        // Slow, low-amplitude pendulum around the thread's anchor. Offset so it
        // swings through rest rather than starting at one extreme.
        const swing = gsap.fromTo(
          el,
          { rotation: -1.4 },
          {
            rotation: 1.4,
            duration: 6.5,
            ease: EASE.ambient,
            repeat: -1,
            yoyo: true,
            transformOrigin: "top center",
            overwrite: "auto",
          },
        );
        // A single breath layer — one soft accent halo, fading rather than
        // pulsing in scale, so it never reads as a glow effect.
        const breath = gsap.to(".hp-breath", {
          opacity: 0.85,
          duration: 3.4,
          ease: EASE.ambient,
          repeat: -1,
          yoyo: true,
        });
        pauseOffscreen([swing, breath], el);
      };

      if (autoEntrance) {
        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: "top 85%" },
            onComplete: startAmbient,
          })
          .from(el, { y: -800, duration: DUR.drop, ease: EASE.hang });
      } else {
        cleanups.push(on(el, "hp:settled" as keyof HTMLElementEventMap, startAmbient));
      }


      // ---- hover: grayscale -> color + slight frame scale ----------------
      if (!canHover()) return;

      cleanups.push(
        on(el, "pointerenter", () => {
          gsap.to(img, {
            filter: "grayscale(0)",
            scale: 1.14,
            duration: 0.7,
            ease: EASE.soft,
            overwrite: "auto",
          });
          gsap.to(frame, { scale: 1.02, duration: 0.55, ease: EASE.soft, overwrite: "auto" });
        }),
        on(el, "pointerleave", () => {
          gsap.to(img, {
            filter: "grayscale(1)",
            scale: 1.1,
            duration: 0.8,
            ease: EASE.soft,
            overwrite: "auto",
          });
          gsap.to(frame, { scale: 1, duration: 0.6, ease: EASE.soft, overwrite: "auto" });
        }),
      );

    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [autoEntrance]);

  return (
    <div ref={root} className={`hp-rig relative flex flex-col items-center ${className}`}>
      {/* long thin vertical thread — longer on desktop */}
      <div className="hp-thread w-px bg-gradient-to-b from-transparent via-foreground/30 to-foreground/60 h-36 sm:h-52 md:h-80" />

      {/* pivot knot */}
      <div className="hp-knot h-2 w-2 -translate-y-1 rounded-full bg-foreground/70" />

      {/* circular portrait */}
      <div className="relative mt-3">
        <div
          ref={frameRef}
          className="hp-frame group relative h-52 w-52 overflow-hidden rounded-full border-4 border-primary sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.55)]"
        >
          <img
            ref={imgRef}
            src={portrait.url}
            alt="Portrait of the developer"
            className="hp-img h-full w-full object-cover scale-110"
            style={{ filter: "grayscale(1)" }}
          />
        </div>

        {/* single breathing accent ring (opacity-animated, never re-paints a shadow) */}
        <div
          aria-hidden="true"
          className="hp-breath pointer-events-none absolute -inset-px rounded-full opacity-0 shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_35%,transparent)]"
        />
      </div>

    </div>
  );
}
