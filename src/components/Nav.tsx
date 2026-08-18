import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { DUR, EASE, gsap } from "@/lib/motion";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const root = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-item", {
        y: -14,
        opacity: 0,
        duration: DUR.base,
        stagger: 0.07,
        ease: EASE.soft,
        delay: 0.25,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // animate the mobile panel open/closed
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (open) {
        gsap.set(el, { display: "block" });
        gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.45, ease: EASE.soft });
        gsap.fromTo(
          el.querySelectorAll(".nav-mobile-item"),
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: EASE.soft, delay: 0.08 },
        );
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.32,
          ease: EASE.soft,
          onComplete: () => gsap.set(el, { display: "none" }),
        });
      }
    }, panel);
    return () => ctx.revert();
  }, [open]);

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-50 bg-ink/95 backdrop-blur-md">
      <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-6 md:px-10 md:py-5">
        <a
          href="#hero"
          className="nav-item min-w-0 truncate font-display text-lg font-extrabold italic uppercase tracking-tight text-background sm:text-xl"
        >
          <span className="text-primary">A</span>rjun<span className="text-primary">.</span>
        </a>

        {/* desktop / tablet links */}
        <ul className="hidden items-center gap-6 sm:flex md:gap-10">
          {LINKS.map((l) => (
            <li key={l.href} className="nav-item">
              <a
                href={l.href}
                className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-background/85 transition-colors duration-300 hover:text-primary md:text-[12px]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="nav-item -mr-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-background transition-colors duration-300 hover:text-primary sm:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* mobile panel */}
      <div ref={panel} className="hidden overflow-hidden border-t border-background/10 sm:!hidden">
        <ul className="flex flex-col px-5 py-2">
          {LINKS.map((l) => (
            <li key={l.href} className="nav-mobile-item">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.28em] text-background/85 transition-colors duration-300 hover:text-primary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
