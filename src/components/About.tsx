import { useEffect, useRef } from "react";

import { HangingPortrait } from "./HangingPortrait";
import { Web } from "./Web";

import { Paragraph3D } from "./Paragraph3D";
import { TechPills } from "./TechPills";
import { DUR, EASE, gsap, pauseOffscreen, prefersReducedMotion } from "@/lib/motion";

export function About() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const scope = root.current;
      if (!scope) return;
      const rig = scope.querySelector<HTMLElement>(".hp-rig");
      // function-based so a breakpoint change is picked up on refresh
      const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
      const drop = () => (isDesktop() ? -800 : -480);

      // ---- master entrance timeline ----------------------------------
      // Reads top-down like a camera move: the room settles, the label arrives,
      // the headline lifts, and the portrait falls in on the same beat.
      const tl = gsap.timeline({
        defaults: { ease: EASE.out },
        scrollTrigger: { trigger: scope, start: "top 68%", invalidateOnRefresh: true },
        onComplete: () => rig?.dispatchEvent(new CustomEvent("hp:settled")),
      });


      // 2 — eyebrow wipes in from the left
      tl.from(
        ".about-eyebrow",
        {
          x: -28,
          opacity: 0,
          clipPath: "inset(0 100% 0 0)",
          duration: DUR.base,
          ease: EASE.soft,
        },
        0.2,
      );

      // 3 — heading rises behind a clip mask
      tl.from(
        ".about-heading",
        {
          clipPath: "inset(0 0 100% 0)",
          yPercent: 10,
          duration: DUR.reveal,
        },
        0.34,
      );

      // 4 — the portrait falls on the heading's beat, with real weight
      if (rig) {
        tl.from(rig, { y: drop, duration: DUR.drop, ease: EASE.hang }, 0.28);
      }

      // 5 — paragraphs owned by Paragraph3D, 6 — pills owned by TechPills

      if (reduced) return;

      // ---- ambient loop (idles while the section is off-screen) --------
      // corner webs breathe: small -> big -> small, offset from each other
      const ambient = [
        gsap.to(".about-web-a", { rotate: "+=6", duration: 40, ease: EASE.ambient, repeat: -1, yoyo: true }),
        gsap.to(".about-web-b", { rotate: "-=6", duration: 46, ease: EASE.ambient, repeat: -1, yoyo: true }),
        gsap.fromTo(
          [".about-web-a", ".about-web-b"],
          { scale: 0.86 },
          { scale: 1.08, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.6 },
        ),
      ];
      pauseOffscreen(ambient, scope);

      // ---- parallax (one shared scrub trigger) -------------------------
      // Three planes: decor drifts most, portrait a little, copy least.
      gsap
        .timeline({
          scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 1.1 },
        })
        .to(".about-portrait-wrap", { yPercent: -10, ease: "none" }, 0)
        .to(".about-copy", { yPercent: 4, ease: "none" }, 0)
    }, root);

    return () => ctx.revert();
  }, []);



  return (
    <section ref={root} id="about" className="relative overflow-hidden bg-background py-20 sm:py-24 md:py-32">

      <Web className="about-web-a -left-10 top-10 w-[13rem] sm:-left-16 sm:top-16 sm:w-[18rem] lg:w-[22rem]" opacity={0.16} />
      <Web className="about-web-b -right-8 bottom-8 w-[11rem] sm:-right-12 sm:w-[16rem] lg:w-[20rem]" opacity={0.14} rotate={25} />




      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-y-14 px-5 sm:gap-y-20 sm:px-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-x-12 md:px-10 lg:gap-x-20">
        <div className="about-copy">
          <p className="about-eyebrow mb-6 flex items-center gap-3 font-sans text-[11px] font-bold uppercase tracking-[0.32em] text-primary">
            <span className="inline-block h-3 w-4 bg-primary" />
            Behind the Mask
          </p>
          <h2 className="about-heading title-3d font-display text-[clamp(2rem,8vw,4.2rem)] uppercase leading-[1.05] text-foreground">
            Arjun Srivastava.
          </h2>
          <Paragraph3D className="mt-8 space-y-6" itemClassName="max-w-[46ch] text-[15px] leading-[1.8] text-muted-foreground">
            <p>
              I'm a final-year Computer Science undergraduate at United University, Prayagraj,
              specializing in Data Science and building toward roles in analytics and machine
              learning.
            </p>
            <p>
              From building interactive election dashboards at Infosys to shipping an IBM Cloud &amp;
              Watson-powered chatbot with Edunet / AICTE, I thrive on turning messy data into clear,
              high-impact decisions.
            </p>
          </Paragraph3D>

          <p className="mt-10 font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Primary Tech Stack
          </p>
          <TechPills
            className="mt-4"
            technologies={[
              "Python",
              "SQL",
              "Scikit-learn",
              "TensorFlow",
              "Power BI",
              "AWS",
              "LLMs",
              "NLP",
            ]}
          />
        </div>

        {/* hanging portrait */}
        <div className="about-portrait-wrap relative flex justify-center">
          <HangingPortrait className="about-glow-scope" autoEntrance={false} />
        </div>
      </div>

    </section>
  );
}
