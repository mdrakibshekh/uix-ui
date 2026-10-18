import { usePreset } from "../lib";
import { Link } from "../router";

export default function NotFound() {
  const { id } = usePreset();
  return (
    <main data-preset={id}>
      <div className="wrap" style={{ paddingBlock: "clamp(72px, 14vh, 160px) 120px", maxWidth: 720, marginInline: "auto", textAlign: "center" }}>
        <span className="eyebrow">404</span>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 500, letterSpacing: "-.03em", lineHeight: 1.1, margin: "0 0 16px" }}>This page does not exist</h1>
        <p style={{ color: "var(--muted)", fontSize: 17, margin: "0 0 32px" }}>The link may be old, or the address has a typo. Press ⌘K to search, or start from one of these.</p>
        <div className="acts" style={{ justifyContent: "center" }}>
          <Link className="btn b-brand lg" to="/">Home</Link>
          <Link className="btn b-line lg" to="/components">Components</Link>
          <Link className="btn b-line lg" to="/docs">Docs</Link>
        </div>
      </div>
    </main>
  );
}
