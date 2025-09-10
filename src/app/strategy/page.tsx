'use client';

import { useState } from "react";
import { useStrategyStore } from "@/store/useStrategyStore";
import StrategyGenerator from "@/components/strategy/StrategyGenerator";
import StrategyExplainer from "@/components/strategy/StrategyExplainer";
import StrategyDebugger from "@/components/strategy/StrategyDebugger";

export default function StrategyWorkspacePage() {
    const [tab, setTab] = useState<"architect" | "doctor" | "compile">("architect");
    const { spec, lints, compile, status, error, compileSpec } = useStrategyStore();

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-2">
                {(["architect", "doctor", "compile"] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-3 py-2 rounded-lg border ${tab === t ? "bg-[#2563eb] text-white" : "hover:bg-[hsl(var(--card-bg-hsl))]"}`}
                        aria-current={tab === t ? "page" : undefined}
                    >
                        {t[0].toUpperCase() + t.slice(1)}
                    </button>
                ))}
                <div className="ml-auto text-sm text-[hsl(var(--text-muted))]">
                    {status === "loading" ? "Working…" : error ? `Error: ${error}` : ""}
                </div>
            </div>

            {tab === "architect" && (
                <div className="space-y-4">
                    <StrategyGenerator />
                    {spec && (
                        <div className="rounded-lg border p-4">
                            <div className="font-semibold mb-2">Lints</div>
                            {lints.length ? (
                                <ul className="text-sm list-disc pl-5">
                                    {lints.map(l => (
                                        <li key={l.id} className={l.level === "error" ? "text-red-500" : "text-yellow-500"}>
                                            [{l.level}] {l.message} {l.path ? `(${l.path})` : ""}
                                        </li>
                                    ))}
                                </ul>
                            ) : <div className="text-sm text-[hsl(var(--text-muted))]">No issues.</div>}
                        </div>
                    )}
                </div>
            )}

            {tab === "doctor" && (
                <div className="space-y-4">
                    <StrategyExplainer integratedMode themeColor="brand" />
                    <StrategyDebugger />
                </div>
            )}

            {tab === "compile" && (
                <div className="space-y-4">
                    <button
                        className="px-4 py-2 rounded-lg bg-[#22c55e] text-white hover:bg-[#22c55e]/90"
                        onClick={() => compileSpec()}
                        disabled={!spec}
                    >
                        Compile Strategy
                    </button>
                    <div className="rounded-lg border p-4">
                        <div className="font-semibold mb-2">Diagnostics</div>
                        {compile.diagnostics?.length ? (
                            <ul className="text-sm list-disc pl-5">
                                {compile.diagnostics.map((d, i) => <li key={i}>{d}</li>)}
                            </ul>
                        ) : <div className="text-sm text-[hsl(var(--text-muted))]">No diagnostics.</div>}
                    </div>
                    {compile.code && (
                        <pre className="rounded-lg border p-4 overflow-auto text-xs bg-[hsl(var(--card-bg-hsl))]">
                            {compile.code}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
}
