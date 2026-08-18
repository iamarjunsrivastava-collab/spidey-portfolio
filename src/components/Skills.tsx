import { useEffect, useRef } from "react";

import { SectionHeading } from "./SectionHeading";
import { HangingSpider } from "./HangingSpider";
import { Web } from "./Web";
import { DUR, EASE, gsap, pauseOffscreen, prefersReducedMotion } from "@/lib/motion";

const SKILLS = [
  { name: "Python", category: "Languages", level: "Advanced" },
  { name: "SQL", category: "Data", level: "Advanced" },
  { name: "Pandas / NumPy", category: "Data", level: "Advanced" },
  { name: "Scikit-learn", category: "Machine Learning", level: "Advanced" },
  { name: "TensorFlow", category: "Machine Learning", level: "Proficient" },
  { name: "Power BI", category: "Visualization", level: "Advanced" },
  { name: "Tableau / Excel", category: "Visualization", level: "Proficient" },
  { name: "NLP & LLMs", category: "Machine Learning", level: "Proficient" },
  { name: "AWS & IBM Cloud", category: "Cloud", level: "Proficient" },
  { name: "Git & GitHub", category: "Tools", level: "Advanced" },
];

export function Skills() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scope = root.current;
      if (!scope) return;

      gsap.fromTo(
        ".sk-card",
        { y: 42, opacity: 0, rotateX: -18, transformOrigin: "50% 0%" },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.05,
          stagger: 0.06,
          ease: EASE.out,
          scrollTrigger: { trigger: ".sk-grid", start: "top 85%" },
        },
      );


      if (prefersReducedMotion()) return;

      // corner webs breathe + slow opposite rotation (like hero)
      const ambient = [
        gsap.to(".sk-web-a", { rotate: "+=6", duration: 40, ease: EASE.ambient, repeat: -1, yoyo: true }),
        gsap.to(".sk-web-b", { rotate: "-=6", duration: 46, ease: EASE.ambient, repeat: -1, yoyo: true }),
        gsap.fromTo(
          [".sk-web-a", ".sk-web-b"],
          { scale: 0.86 },
          { scale: 1.08, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.6 },
        ),
      ];
      pauseOffscreen(ambient, scope);

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="skills" className="relative overflow-hidden bg-background py-20 sm:py-24 md:py-32">
      <HangingSpider className="-right-2 top-0 hidden h-[18rem] w-14 opacity-70 sm:block md:right-10 md:h-[30rem] md:w-36 md:opacity-100" />

      <Web className="sk-web-a -left-10 top-10 w-[13rem] sm:-left-16 sm:top-16 sm:w-[18rem] lg:w-[22rem]" opacity={0.16} />
      <Web className="sk-web-b -right-8 bottom-8 w-[11rem] sm:-right-12 sm:w-[16rem] lg:w-[20rem]" opacity={0.14} rotate={25} />



      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 md:px-8">
        <SectionHeading eyebrow="Arsenal & Expertise" title="Technical Skills." />

        <div className="sk-grid mt-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:mt-10 sm:gap-y-4 [perspective:1000px] sm:grid-cols-2">

          {SKILLS.map((s) => (
            <div
              key={s.name}
              className="sk-card group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-display text-[14px] font-bold uppercase leading-tight text-foreground">
                    {s.name}
                  </p>
                  <p className="mt-0.5 font-sans text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                    {s.category}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-border bg-background px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-foreground">
                {s.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
