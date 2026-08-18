import { useEffect, useRef } from "react";
import { EASE, gsap, prefersReducedMotion } from "@/lib/motion";


type Paragraph3DProps = {
  /** Each child is animated as an independent 3D paragraph. */
  children: React.ReactNode;
  className?: string;
  /** Extra classes applied to each paragraph wrapper. */
  itemClassName?: string;
  /** ScrollTrigger start position. Defaults to "top 82%". */
  start?: string;
  /** Stagger between paragraphs (seconds). */
  stagger?: number;
};

/**
 * Premium 3D paragraph reveal.
 *
 * Each paragraph starts tilted back in space (rotationX: -45, y: 40, opacity: 0)
 * and settles flat with a soft back.out easing, staggered through a ScrollTrigger
 * timeline. Kept subtle so the copy stays readable.
 */
export function Paragraph3D({
  children,
  className = "",
  itemClassName = "",
  start = "top 82%",
  stagger = 0.15,
}: Paragraph3DProps) {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scope = root.current;
      if (!scope) return;
      // scoped: gsap.utils.toArray is NOT limited by gsap.context(), so an
      // unscoped selector grabbed every Paragraph3D on the page.
      const items = gsap.utils.toArray<HTMLElement>(".p3d-item", scope);

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0, rotateX: 0 });
        return;
      }

      gsap
        .timeline({
          scrollTrigger: { trigger: scope, start },
        })
        .from(items, {
          y: 28,
          opacity: 0,
          rotateX: -28,
          transformOrigin: "50% 100%",
          duration: 1.3,
          ease: EASE.out,
          stagger,
        });

    }, root);

    return () => ctx.revert();
  }, [start, stagger]);

  const nodes = Array.isArray(children) ? children : [children];

  return (
    <div ref={root} className={`p3d [perspective:1000px] ${className}`}>
      {nodes.map((node, i) => (
        <div
          key={i}
          className={`p3d-item will-change-transform [transform-style:preserve-3d] [backface-visibility:hidden] ${itemClassName}`}
        >
          {node}
        </div>
      ))}
    </div>
  );
}
