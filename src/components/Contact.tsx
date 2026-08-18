import { useEffect, useRef } from "react";

import { SectionHeading } from "./SectionHeading";
import { HangingSpider } from "./HangingSpider";
import { Web } from "./Web";
import { Magnetic } from "./Magnetic";
import { EASE, gsap, pauseOffscreen, prefersReducedMotion } from "@/lib/motion";
import resumeAsset from "@/assets/ARJUN.pdf.asset.json";

export function Contact() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scope = root.current;
      if (!scope) return;

      gsap.fromTo(
        ".contact-card",
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          ease: EASE.out,
          scrollTrigger: { trigger: ".contact-card", start: "top 88%" },
        },
      );
      gsap.fromTo(
        ".contact-field",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: EASE.soft,
          scrollTrigger: { trigger: ".contact-card", start: "top 85%" },
        },
      );


      if (prefersReducedMotion()) return;

      const ambient = [
        gsap.to(".contact-web-a", { rotate: "+=6", duration: 40, ease: EASE.ambient, repeat: -1, yoyo: true }),
        gsap.to(".contact-web-b", { rotate: "-=6", duration: 46, ease: EASE.ambient, repeat: -1, yoyo: true }),
        gsap.fromTo(
          [".contact-web-a", ".contact-web-b"],
          { scale: 0.86 },
          { scale: 1.08, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.6 },
        ),
      ];
      pauseOffscreen(ambient, scope);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="contact" className="relative overflow-hidden bg-background py-20 sm:py-24 md:py-32">

      <HangingSpider className="-right-2 top-0 hidden h-[18rem] w-14 opacity-70 sm:block md:right-12 md:h-[32rem] md:w-36 md:opacity-100" />

      <Web className="contact-web-a -left-10 top-10 w-[13rem] sm:-left-16 sm:top-16 sm:w-[18rem] lg:w-[22rem]" opacity={0.16} />
      <Web className="contact-web-b -right-8 bottom-8 w-[11rem] sm:-right-12 sm:w-[16rem] lg:w-[20rem]" opacity={0.14} rotate={25} />


      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 md:px-10">
        <SectionHeading eyebrow="Get In Touch" title="Contact." />

        <form
          className="contact-card mt-10 rounded-xl border border-border bg-card p-5 shadow-sm sm:mt-12 sm:p-6 md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const subject = encodeURIComponent(`Portfolio enquiry — ${data.get("name")}`);
            const body = encodeURIComponent(
              `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`,
            );
            window.location.href = `mailto:iamarjunsrivastava@gmail.com?subject=${subject}&body=${body}`;
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            <label className="contact-field block">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
                Your Name
              </span>
              <input
                name="name"
                required
                placeholder="Peter Parker"
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
              />
            </label>
            <label className="contact-field block">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
                Your Email
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="peter@stark.com"
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
              />
            </label>
          </div>

          <label className="contact-field mt-5 block">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
              Message
            </span>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Let's build something amazing together…"
              className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="contact-field mt-6 w-full rounded-lg bg-primary px-8 py-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-colors duration-300 hover:bg-ink"
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          <Magnetic
            href="mailto:iamarjunsrivastava@gmail.com"
            lift
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            Email
          </Magnetic>
          <Magnetic
            href="tel:+918810761322"
            lift
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            Phone
          </Magnetic>
          <Magnetic
            href="https://www.linkedin.com/in/arjun-srivastava-228021282"
            lift
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            LinkedIn
          </Magnetic>
          <Magnetic
            href="https://github.com/iamarjunsrivastava-collab"
            lift
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            GitHub
          </Magnetic>
          <Magnetic
            href={resumeAsset.url}
            lift
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            Resume
          </Magnetic>
        </div>

        <p className="mt-14 text-center font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          © 2026 Arjun Srivastava — Built with React &amp; GSAP
        </p>
      </div>
    </section>
  );
}
