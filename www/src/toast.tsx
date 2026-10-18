import * as React from "react";
import { Toast } from "./components/ui/toast";
import { usePreset } from "./lib";

type Item = { id: number; text: React.ReactNode; type?: "default" | "success" | "warning" | "error" };
const Ctx = React.createContext<(text: React.ReactNode, type?: Item["type"]) => void>(() => {});
export const useToast = () => React.useContext(Ctx);

/** A small stack of the real Toast component, themed by the page preset. Each toast leaves after 4 s. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Item[]>([]);
  const { id } = usePreset();
  const push = React.useCallback((text: React.ReactNode, type: Item["type"] = "success") => {
    const t = { id: Date.now() + Math.random(), text, type };
    setItems(s => [...s.slice(-2), t]);
    window.setTimeout(() => setItems(s => s.filter(x => x.id !== t.id)), 4000);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="toasts" data-preset={id} aria-live="polite">
        {items.map(t => <Toast key={t.id} type={t.type}>{t.text}</Toast>)}
      </div>
    </Ctx.Provider>
  );
}
