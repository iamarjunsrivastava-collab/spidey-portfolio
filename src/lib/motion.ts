import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once for the whole app; components just import from here.
gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined") {
  // Mobile browsers fire `resize` when the URL bar collapses. Without this,
  // every scroll direction change re-measures triggers and entrance
  // animations can re-fire / jump mid-scroll on phones.
  ScrollTrigger.config({ ignoreMobileResize: true });
  // Images (portrait, masks, webs) settle after first paint and change layout
  // height, which leaves trigger positions stale.
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

export { gsap, ScrollTrigger };

/**
 * One shared motion language for the whole site.
 *
 * Deliberately small: cinematic reveals use a single long-tailed curve so every
 * section decelerates the same way. Elastic is reserved for the one object that
 * physically hangs — everything else settles, it doesn't bounce.
 */
export const EASE = {
  /** Primary reveal curve — fast attack, long quiet settle. */
  out: "power4.out",
  /** Secondary/supporting elements, slightly gentler. */
  soft: "power3.out",
  /** Scrubbed or two-way motion. */
  inOut: "power2.inOut",
  /** Pendulum drop. Low amplitude, well damped — reads as weight, not bounce. */
  hang: "elastic.out(0.55, 0.42)",
  /** Ambient loops. */
  ambient: "sine.inOut",
} as const;

/** Shared timing scale, so durations stay in proportion across sections. */
export const DUR = {
  micro: 0.32,
  quick: 0.6,
  base: 1.0,
  reveal: 1.4,
  drop: 2.1,
} as const;


export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True for real hover-capable pointers (skips phone/tablet hover work). */
export const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

/**
 * Keeps infinite ambient tweens from burning CPU while their section is
 * off-screen. The ScrollTrigger is created inside the active gsap.context(),
 * so ctx.revert() kills it along with the tween.
 */
export function pauseOffscreen(
  anim: gsap.core.Animation | gsap.core.Animation[],
  trigger: Element | null,
) {
  const anims = Array.isArray(anim) ? anim : [anim];
  if (!trigger) return;
  anims.forEach((a) => a.pause());
  const st = ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => anims.forEach((a) => (self.isActive ? a.resume() : a.pause())),
  });
  // onToggle does not fire for a trigger that is already on-screen at creation
  // time, which would leave the loops permanently paused above the fold.
  if (st.isActive) anims.forEach((a) => a.resume());
}

/**
 * Attach listeners and get a single cleanup back — used so pointer handlers
 * created inside gsap.context() are still removed on unmount.
 */
export function on<K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  type: K,
  handler: (e: HTMLElementEventMap[K]) => void,
) {
  el.addEventListener(type, handler as EventListener);
  return () => el.removeEventListener(type, handler as EventListener);
}

/**
 * Magnetic hover: element eases toward the pointer, snaps back on leave.
 * Returns a cleanup function. Skipped on coarse pointers / reduced motion.
 */
export function magnetic(el: HTMLElement, strength = 0.2) {
  if (prefersReducedMotion() || !canHover()) return () => {};

  const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power4" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power4" });


  const offMove = on(el, "pointermove", (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  });
  const offLeave = on(el, "pointerleave", () => {
    xTo(0);
    yTo(0);
  });

  return () => {
    offMove();
    offLeave();
    gsap.killTweensOf(el);
  };
}

/**
 * Soft button lift: the inner content rises a couple of pixels while the
 * element's shadow expands. Fast, transform/shadow only, no bounce.
 * Returns a cleanup function.
 */
export function hoverLift(
  el: HTMLElement,
  {
    y = -2,
    shadow = "0 14px 26px -16px rgba(0,0,0,0.38)",
    inner,
  }: { y?: number; shadow?: string; inner?: HTMLElement | null } = {},
) {
  if (prefersReducedMotion() || !canHover()) return () => {};

  const target = inner ?? el;
  const offEnter = on(el, "pointerenter", () => {
    gsap.to(target, { y, duration: DUR.micro, ease: EASE.soft, overwrite: "auto" });
    gsap.to(el, { boxShadow: shadow, duration: DUR.micro, ease: EASE.soft, overwrite: "auto" });
  });
  const offLeave = on(el, "pointerleave", () => {
    gsap.to(target, { y: 0, duration: 0.45, ease: EASE.soft, overwrite: "auto" });
    gsap.to(el, {
      boxShadow: "0 0px 0px 0px rgba(0,0,0,0)",
      duration: 0.45,
      ease: EASE.soft,
      overwrite: "auto",
    });
  });


  return () => {
    offEnter();
    offLeave();
    gsap.killTweensOf([el, target]);
  };
}

/** Split a string into per-character spans for 3D text reveals. */
export function splitChars(text: string) {
  return text.split("");
}
