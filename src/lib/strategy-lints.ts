import type { StrategySpec, Rule } from "@/types/strategy";

export type Lint = { id: string; level: "warn" | "error"; message: string; path?: string };

export function lintStrategy(spec: StrategySpec): Lint[] {
  const out: Lint[] = [];
  if (!spec.risk?.stop) out.push({ id: "risk.stop", level: "error", message: "Missing risk.stop" });

  const sig = (r: Rule) => `${r.lhs}|${r.op}|${typeof r.rhs}:${r.rhs}`;
  const seen = new Set<string>();
  for (const [i, r] of spec.entries.entries()) {
    const s = sig(r);
    if (seen.has(s)) out.push({ id: `dup.entry.${i}`, level: "warn", message: "Duplicate entry rule", path: `entries[${i}]` });
    seen.add(s);
  }
  seen.clear();
  for (const [i, r] of spec.exits.entries()) {
    const s = sig(r);
    if (seen.has(s)) out.push({ id: `dup.exit.${i}`, level: "warn", message: "Duplicate exit rule", path: `exits[${i}]` });
    seen.add(s);
  }

  const checkRSI = (side: "entries" | "exits") => {
    spec[side].forEach((r, i) => {
      if (/RSI\(/i.test(r.lhs) && typeof r.rhs === "number") {
        if (r.rhs > 100 || r.rhs < 0) out.push({ id: `rsi.bounds.${side}.${i}`, level: "error", message: "RSI bounds [0..100]", path: `${side}[${i}]` });
      }
    });
  };
  checkRSI("entries");
  checkRSI("exits");

  return out;
}
