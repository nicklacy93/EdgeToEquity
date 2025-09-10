import type { StrategySpec } from "@/types/strategy";

export function compileToTS(spec: StrategySpec): { code: string; diagnostics: string[] } {
  const diagnostics: string[] = [];
  if (!spec.entries.length) diagnostics.push("No entry rules");
  if (!spec.exits.length) diagnostics.push("No exit rules");

  const header = `// Generated from StrategySpec v1
// name: ${spec.name} (rev ${spec.revision})
`;

  const indicators = spec.indicators.map(i => `// ${i.id}: ${i.kind} ${JSON.stringify(i.params)}`).join("\n");

  const body = `
export function run(inputs:{ close:number[] }) {
  const N = inputs.close.length;
  if (N < 10) return { ok:false, reason:"insufficient data" };
  // TODO: Replace with real engine in Part 3
  const signals = { entries: [], exits: [] };
  return { ok:true, signals };
}
`;

  return { code: header + indicators + "\n" + body, diagnostics };
}
