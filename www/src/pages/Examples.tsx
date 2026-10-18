import * as React from "react";
import { Link } from "../router";
import { usePreset, useInView } from "../lib";
import { LOOKS } from "../home/brand";
import { useDemo } from "../home/look";
import { SCENES } from "../Studio";
import { H2, PageHeader } from "../site/Docs";
import "./themes.css";

/* The six example screens, one after another, wearing the theme and mode picked in the bar. */

function Scene({ s, first }: { s: (typeof SCENES)[number]; first: boolean }) {
  const demo = useDemo();
  const [ref, seen] = useInView<HTMLDivElement>(undefined, "0px 0px 600px 0px");
  return (
    <section className="th-scene" aria-labelledby={`ex-${s.id}`}>
      <H2 id={`ex-${s.id}`}>{s.name}</H2>
      <p className="note">{s.note}</p>
      <div className="frame" {...demo} ref={ref}>
        <div className="cw-bar"><i /><i /><i /><span>{s.url}</span></div>
        <div className="stage-body">{first || seen ? <div className="scene-anim"><s.C /></div> : <div className="th-ph">Loading the screen…</div>}</div>
      </div>
      <p className="th-uses">Components in this screen: {s.slugs.map((slug, i) => <React.Fragment key={slug}>{i ? ", " : ""}<Link to={`/components/${slug}`}>{slug.replace(/-/g, " ")}</Link></React.Fragment>)}.</p>
    </section>
  );
}

export default function Examples() {
  const { id, set, mode, setMode } = usePreset();
  return (
    <main className="wrap th-page" id="content">
      <PageHeader title="Examples" lead="Six full screens built only from uix-ui components. Click, type and open things. Switch the theme or light and dark below and every screen follows." />
      <div className="th-bar">
        <label className="th-field"><span>Theme</span>
          <select value={id} onChange={e => set(e.target.value)}>{LOOKS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
        </label>
        <div className="segm" role="group" aria-label="Light or dark">
          <button type="button" aria-pressed={mode === "light"} onClick={() => setMode("light")}>Light</button>
          <button type="button" aria-pressed={mode === "dark"} onClick={() => setMode("dark")}>Dark</button>
        </div>
        <Link className="btn b-line sm" to={`/themes/${id}`}>About this theme</Link>
      </div>
      {SCENES.map((s, i) => <Scene key={s.id} s={s} first={i === 0} />)}
    </main>
  );
}
