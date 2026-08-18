import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";

import { SectionHeading } from "./SectionHeading";
import { Web } from "./Web";
import standAsset from "@/assets/spydy_stand.png.asset.json";
import { DUR, EASE, gsap, pauseOffscreen, prefersReducedMotion } from "@/lib/motion";

const PROJECTS = [
  {
    title: "Chat Cleaner",
    description:
      "Built an NLP pipeline using Sentence-BERT embeddings to de-duplicate and clean noisy chat exports into structured, analysis-ready conversations.",
    tags: ["Python", "Sentence-BERT", "NLP", "Pandas"],
  },
  {
    title: "Amazon Sentiment Analysis",
    description:
      "Classified thousands of product reviews with a tuned NLP model reaching an 87% F1 score, surfacing recurring themes behind negative feedback.",
    tags: ["Python", "NLP", "Scikit-learn", "TF-IDF"],
  },
  {
    title: "Customer Churn Prediction",
    description:
      "Trained a Random Forest churn model on subscriber behaviour and shipped the results as an interactive Power BI retention dashboard.",
    tags: ["Random Forest", "Power BI", "SQL"],
  },
  {
    title: "House Price Prediction",
    description:
      "Engineered features and benchmarked regression models to estimate housing prices, with residual analysis and cross-validated tuning.",
    tags: ["Regression", "Scikit-learn", "NumPy"],
  },
];

export function Work() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scope = root.current;
      if (!scope) return;

      gsap.fromTo(
        ".work-card",
        { y: 52, opacity: 0, rotateX: -14, transformOrigin: "50% 0%" },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.15,
          stagger: 0.1,
          ease: EASE.out,
          scrollTrigger: { trigger: ".work-grid", start: "top 82%" },
        },
      );
      gsap.fromTo(
        ".work-stand",
        { y: 120, opacity: 0, scale: 0.94 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: DUR.reveal,
          ease: EASE.out,
          scrollTrigger: { trigger: ".work-grid", start: "top 90%" },
        },
      );


      if (prefersReducedMotion()) return;

      const ambient = [
        gsap.to(".work-stand", { y: -10, duration: 5.6, ease: EASE.ambient, repeat: -1, yoyo: true }),
        gsap.to(".work-web-a", { rotate: "+=6", duration: 40, ease: EASE.ambient, repeat: -1, yoyo: true }),
        gsap.to(".work-web-b", { rotate: "-=6", duration: 46, ease: EASE.ambient, repeat: -1, yoyo: true }),
        gsap.fromTo(
          [".work-web-a", ".work-web-b"],
          { scale: 0.86 },
          { scale: 1.08, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.6 },
        ),
      ];
      pauseOffscreen(ambient, scope);


      gsap.to(".work-stand", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="relative overflow-hidden bg-background py-20 sm:py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 md:px-8">
        <SectionHeading eyebrow="Featured Works" title="Projects." />

      <Web className="work-web-a -left-10 top-10 w-[13rem] sm:-left-16 sm:top-16 sm:w-[18rem] lg:w-[22rem]" opacity={0.16} />
      <Web className="work-web-b -right-8 bottom-8 w-[11rem] sm:-right-12 sm:w-[16rem] lg:w-[20rem]" opacity={0.14} rotate={25} />


        <div className="work-grid mt-8 grid grid-cols-1 gap-4 [perspective:1000px] sm:mt-10 sm:gap-5 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              className="work-card group rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-[15px] font-bold uppercase leading-snug text-foreground">
                  {p.title}
                </h3>
                <ExternalLink className="mt-1 h-[15px] w-[15px] shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{p.description}</p>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-background px-2 py-[3px] font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <img
        src={standAsset.url}
        alt=""
        aria-hidden="true"
        className="work-stand pointer-events-none absolute bottom-0 left-0 z-0 hidden w-40 origin-bottom object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.18)] lg:block xl:left-4 xl:w-52"
      />
    </section>
  );
}
