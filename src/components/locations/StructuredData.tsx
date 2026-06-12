import { useEffect } from "react";

/**
 * Injects a JSON-LD <script> into document.head and removes it on unmount.
 * Multiple instances coexist because each gets a unique id.
 */
const StructuredData = ({ id, data }: { id: string; data: object }) => {
  useEffect(() => {
    const scriptId = `ld-${id}`;
    let el = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = scriptId;
      document.head.appendChild(el);
    }
    el.text = JSON.stringify(data);
    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [id, data]);
  return null;
};

export default StructuredData;
