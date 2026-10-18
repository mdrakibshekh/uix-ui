import * as React from "react";
import { Hero } from "../home/Hero";
import { LogoStrip, ThemesSection } from "../home/Themes";
import { Examples, Gallery } from "../home/Showcase";
import { Workflow } from "../home/Workflow";
import { Templates, GetStarted, Cta } from "../home/Start";
import { useReveal } from "../home/bits";

export default function Home() {
  useReveal();
  return (
    <main className="wrap home">
      <Hero />
      <LogoStrip />
      <ThemesSection />
      <Examples />
      <Gallery />
      <Workflow />
      <Templates />
      <GetStarted />
      <Cta />
    </main>
  );
}
