import * as React from "react";
import { useCopy } from "../lib";

/** A shell command with a copy button. */
export function Copy({ text, className = "pill", style, prompt = "$" }: { text: string; className?: string; style?: React.CSSProperties; prompt?: string }) {
  const { copy, done } = useCopy();
  return (
    <div className={className} style={style}>
      <span aria-hidden>{prompt}</span><code>{text}</code>
      <button type="button" onClick={() => copy(text)} aria-label={`Copy: ${text}`}>{done === text ? "Copied" : "Copy"}</button>
    </div>
  );
}

/** Section heading: eyebrow, title, lead, and optional actions on the right. */
export function Head({ eyebrow, title, lead, center, children }: { eyebrow?: string; title: React.ReactNode; lead?: React.ReactNode; center?: boolean; children?: React.ReactNode }) {
  return (
    <div className={`sh${center ? " center" : ""}`}>
      <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{lead && <p>{lead}</p>}</div>
      {children}
    </div>
  );
}

/** Adds .in to every .rv element once it scrolls into view (only when motion is allowed). */
export function useReveal() {
  React.useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll(".home .sh, .home .works2, .home .exbar, .home .frame, .home .tile, .home .car, .home .wear, .home .wstage, .home .console, .home .tmarq, .home .cta, .home .moods")];
    els.forEach(el => el.classList.add("rv"));
    document.querySelectorAll(".home .tile").forEach((t, i) => (t as HTMLElement).style.setProperty("--d", `${(i % 4) * 70}ms`));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}
