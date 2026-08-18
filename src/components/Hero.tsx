import { useEffect, useRef } from "react";
import maskLight from "@/assets/hero-mask.png.asset.json";
import arjun from "@/assets/hero-face.png.asset.json";

import { Web } from "./Web";
import { Magnetic } from "./Magnetic";
import { canHover, DUR, EASE, gsap, on, pauseOffscreen, prefersReducedMotion } from "@/lib/motion";


export function Hero() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const el = root.current;
      if (!el) return;

      const tl = gsap.timeline({ defaults: { ease: EASE.out } });
      tl.set(".hero-title", { perspective: 1100 })
        .from(".hero-stack", { opacity: 0, duration: 1.6, ease: EASE.inOut }, 0)
        .from(".hero-eyebrow", { y: 16, opacity: 0, duration: DUR.base }, 0.35)
        .from(
          ".hero-line",
          {
            yPercent: 110,
            rotateX: -55,
            opacity: 0,
            transformOrigin: "50% 100%",
            duration: DUR.reveal,
            stagger: 0.12,
          },
          0.5,
        )
        .from(".hero-cta", { y: 18, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.8");

      if (reduced) return;

      const ambient = [
        gsap.to(".hero-web-a", { rotate: "+=6", duration: 40, ease: EASE.ambient, repeat: -1, yoyo: true }),
        gsap.to(".hero-web-b", { rotate: "-=6", duration: 46, ease: EASE.ambient, repeat: -1, yoyo: true }),
      ];
      pauseOffscreen(ambient, el);


      // corner webs breathe: small -> big -> small, offset from each other
      gsap.fromTo(
        ".hero-web-a",
        { scale: 0.86 },
        { scale: 1.08, duration: 5, ease: EASE.ambient, repeat: -1, yoyo: true, transformOrigin: "50% 50%" },
      );
      gsap.fromTo(
        ".hero-web-b",
        { scale: 1.08 },
        { scale: 0.86, duration: 5.8, ease: EASE.ambient, repeat: -1, yoyo: true, transformOrigin: "50% 50%" },
      );

      gsap.to(".hero-stack", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
      });

      const face = el.querySelector<HTMLElement>(".hero-face");

      // cursor-following window: only inside the circle is the real photo visible
      const pos = { x: 50, y: 40, r: 0 };
      const applyMask = () => {
        if (!face) return;
        const m = `radial-gradient(circle ${pos.r}px at ${pos.x}% ${pos.y}%, #000 0%, #000 55%, transparent 100%)`;
        face.style.maskImage = m;
        face.style.webkitMaskImage = m;
      };
      applyMask();

      // touch devices: drag / tap anywhere on the portrait to move the reveal
      if (!canHover()) {
        const radius = () => Math.min(window.innerWidth, 520) * 0.42;
        const move = (ev: PointerEvent) => {
          const rect = face?.getBoundingClientRect() ?? el.getBoundingClientRect();
          pos.x = ((ev.clientX - rect.left) / rect.width) * 100;
          pos.y = ((ev.clientY - rect.top) / rect.height) * 100;
          applyMask();
        };
        cleanups.push(
          on(el, "pointerdown", (ev) => {
            move(ev);
            gsap.to(pos, { r: radius(), duration: 0.5, ease: "power3.out", onUpdate: applyMask });
          }),
          on(el, "pointermove", (ev) => {
            if (pos.r > 0) move(ev);
          }),
          on(el, "pointerup", () => {
            gsap.to(pos, { r: 0, duration: 0.7, delay: 0.9, ease: "power2.out", onUpdate: applyMask });
          }),
          on(el, "pointercancel", () => {
            gsap.to(pos, { r: 0, duration: 0.6, ease: "power2.out", onUpdate: applyMask });
          }),
        );
        return;
      }

      const xTo = gsap.quickTo(".hero-stack", "x", { duration: 1.1, ease: "power3.out" });
      const yTo = gsap.quickTo(".hero-stack", "y", { duration: 1.1, ease: "power3.out" });
      const quickX = gsap.quickTo(pos, "x", { duration: 0.6, ease: "power3.out", onUpdate: applyMask });
      const quickY = gsap.quickTo(pos, "y", { duration: 0.6, ease: "power3.out", onUpdate: applyMask });

      cleanups.push(
        on(el, "pointermove", (ev) => {
          const rect = face?.getBoundingClientRect() ?? el.getBoundingClientRect();
          xTo((ev.clientX / window.innerWidth - 0.5) * -26);
          yTo((ev.clientY / window.innerHeight - 0.5) * -18);
          quickX(((ev.clientX - rect.left) / rect.width) * 100);
          quickY(((ev.clientY - rect.top) / rect.height) * 100);
        }),
        on(el, "pointerenter", () => {
          gsap.to(pos, { r: 230, duration: 0.7, ease: "power3.out", onUpdate: applyMask });
        }),
        on(el, "pointerleave", () => {
          gsap.to(pos, { r: 0, duration: 0.6, ease: "power2.out", onUpdate: applyMask });
        }),
      );



    }, root);


    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      id="hero"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-background pb-16 pt-24 sm:items-center sm:pb-0 sm:pt-0"
    >
      <div className="hero-stack pointer-events-none absolute inset-0">
        <img
          src={maskLight.url}
          alt=""
          aria-hidden="true"
          className="hero-plate absolute inset-0 h-full w-full object-cover object-[50%_top]"
        />
        <img
          src={arjun.url}
          alt=""
          aria-hidden="true"
          style={{
            maskImage: "radial-gradient(circle 0px at 50% 40%, #000 0%, #000 55%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(circle 0px at 50% 40%, #000 0%, #000 55%, transparent 100%)",
          }}
          className="hero-face absolute inset-0 h-full w-full object-cover object-[50%_top]"
        />
      </div>

      {/* mobile: bottom veil so the copy stays readable under the portrait */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background from-22% via-background/80 via-42% to-transparent to-62% sm:hidden" />
      {/* tablet / desktop: left veil only */}
      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-background from-12% via-background/70 via-26% to-transparent to-40% sm:block" />

      <Web className="hero-web-a -left-10 top-10 w-[13rem] sm:-left-16 sm:top-16 sm:w-[18rem] lg:w-[22rem]" opacity={0.16} />
      <Web className="hero-web-b -right-8 bottom-8 w-[11rem] sm:-right-12 sm:w-[16rem] lg:w-[20rem]" opacity={0.14} rotate={25} />

      <p className="hero-hint pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:block">
        Hover to reveal
      </p>
      <p className="pointer-events-none absolute left-1/2 top-20 z-10 -translate-x-1/2 whitespace-nowrap font-sans text-[9px] font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:hidden">
        Tap &amp; drag to reveal
      </p>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-10">
        <div className="max-w-full sm:max-w-[22ch] md:max-w-[30%]">
          <p className="hero-eyebrow max-w-[32rem] font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-primary sm:tracking-[0.28em] md:text-[11px]">
            Your friendly neighborhood data scientist
          </p>

          <h1 className="hero-title mt-5 font-display text-[clamp(2.1rem,9vw,3rem)] uppercase leading-[0.95] sm:mt-6 sm:text-[clamp(1.9rem,3.4vw,3rem)]">
            <span className="block overflow-hidden py-[0.03em]">
              <span className="hero-line title-3d inline-block text-foreground">Arjun</span>
            </span>
            <span className="block overflow-hidden py-[0.03em]">
              <span className="hero-line title-3d inline-block text-foreground">Srivastava.</span>
            </span>
          </h1>

          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
            <Magnetic
              href="#work"
              lift
              className="hero-cta inline-flex items-center rounded-md bg-primary px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-primary-foreground sm:px-6 sm:py-3.5 sm:text-[11px]"
            >
              Explore Projects
            </Magnetic>
            <Magnetic
              href="#contact"
              lift
              className="hero-cta inline-flex items-center rounded-md bg-ink px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-background sm:px-6 sm:py-3.5 sm:text-[11px]"
            >
              Get In Touch
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

