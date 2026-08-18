import { useEffect, useRef, type ReactNode } from "react";
import { hoverLift, magnetic } from "@/lib/motion";

export function Magnetic({
  children,
  className,
  href,
  strength = 0.3,
  lift = false,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  strength?: number;
  /** Soft lift + shadow expansion on hover (buttons / CTAs). */
  lift?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    return magnetic(ref.current, strength);
  }, [strength]);

  useEffect(() => {
    if (!lift || !ref.current) return;
    return hoverLift(ref.current, { inner: innerRef.current });
  }, [lift]);

  return (
    <a ref={ref} href={href} className={className}>
      <span ref={innerRef} className="pointer-events-none block will-change-transform">
        {children}
      </span>
    </a>
  );
}
