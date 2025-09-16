import type { StrategySpec, Rule } from "@/types/strategy";
import { StrategyRegistry } from "@/lib/strategy-registry";

export type Lint = {
    id: string;
    level: "warn" | "error";
    message: string;
    path?: string;
};

export function lintStrategy(spec: StrategySpec): Lint[] {
    const lints: Lint[] = [];

    // Check for empty strategy
    if (spec.entries.length === 0) {
        lints.push({
            id: "no-entries",
            level: "error",
            message: "Strategy has no entry rules",
            path: "entries",
        });
    }

    if (spec.exits.length === 0) {
        lints.push({
            id: "no-exits",
            level: "error",
            message: "Strategy has no exit rules",
            path: "exits",
        });
    }

    // Check for conflicting rules
    const entryActions = spec.entries.map(r => r.action);
    const exitActions = spec.exits.map(r => r.action);

    if (entryActions.includes("enter_long") && entryActions.includes("enter_short")) {
        lints.push({
            id: "conflicting-entries",
            level: "warn",
            message: "Strategy has both long and short entry rules",
            path: "entries",
        });
    }

    // Check risk parameters
    if (spec.risk.maxPositionSize > 0.5) {
        lints.push({
            id: "high-position-size",
            level: "warn",
            message: "Position size is very high (>50%)",
            path: "risk.maxPositionSize",
        });
    }

    if (spec.risk.stopLoss > 0.1) {
        lints.push({
            id: "wide-stop-loss",
            level: "warn",
            message: "Stop loss is very wide (>10%)",
            path: "risk.stopLoss",
        });
    }

    // Check for duplicate rule IDs
    const allRules = [...spec.entries, ...spec.exits];
    const ruleIds = allRules.map(r => r.id);
    const duplicateIds = ruleIds.filter((id, index) => ruleIds.indexOf(id) !== index);

    if (duplicateIds.length > 0) {
        lints.push({
            id: "duplicate-rule-ids",
            level: "error",
            message: `Duplicate rule IDs: ${duplicateIds.join(", ")}`,
            path: "rules",
        });
    }

    // Check for disabled rules
    const disabledRules = allRules.filter(r => !r.enabled);
    if (disabledRules.length > 0) {
        lints.push({
            id: "disabled-rules",
            level: "warn",
            message: `${disabledRules.length} rules are disabled`,
            path: "rules",
        });
    }

    // Check indicator dependencies
    const indicatorNames = spec.indicators.map(i => i.name.toLowerCase());
    const usedIndicators = new Set<string>();

    for (const rule of allRules) {
        // Simple check for indicator usage in conditions
        for (const indicatorName of Object.keys(StrategyRegistry)) {
            if (rule.condition.toLowerCase().includes(indicatorName)) {
                usedIndicators.add(indicatorName);
            }
        }
    }

    for (const used of usedIndicators) {
        if (!indicatorNames.includes(used)) {
            lints.push({
                id: "missing-indicator",
                level: "error",
                message: `Rule references ${used} indicator but it's not defined`,
                path: "indicators",
            });
        }
    }

    return lints;
}
