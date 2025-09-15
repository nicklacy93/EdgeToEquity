import { z } from "zod";

export const Indicator = z.object({
    name: z.string().min(1),
    type: z.enum(["oscillator", "trend", "volume", "momentum", "volatility"]),
    params: z.record(z.union([z.string(), z.number(), z.boolean()])),
    timeframe: z.string().optional(),
});

export const Rule = z.object({
    id: z.string(),
    condition: z.string(),
    action: z.enum(["enter_long", "enter_short", "exit_long", "exit_short", "close_all"]),
    priority: z.number().min(1).max(10).default(5),
    enabled: z.boolean().default(true),
});

export const Risk = z.object({
    maxPositionSize: z.number().min(0).max(1).default(0.1),
    stopLoss: z.number().min(0).default(0.02),
    takeProfit: z.number().min(0).optional(),
    maxDrawdown: z.number().min(0).max(1).default(0.2),
    maxDailyLoss: z.number().min(0).max(1).default(0.05),
});

export const StrategySpec = z.object({
    version: z.literal("v1"),
    revision: z.number().int().min(0).default(0),
    name: z.string().min(1),
    description: z.string().optional(),
    timeframe: z.string().default("5m"),
    symbols: z.array(z.string()).min(1).default(["SPY"]),
    indicators: z.array(Indicator).default([]),
    entries: z.array(Rule).default([]),
    exits: z.array(Rule).default([]),
    risk: Risk.default({}),
    meta: z.object({
        createdAt: z.string().default(() => new Date().toISOString()),
        updatedAt: z.string().default(() => new Date().toISOString()),
        updatedBy: z.enum(["architect", "doctor", "user"]).default("user"),
        tags: z.array(z.string()).default([]),
    }).default({}),
});

export type Indicator = z.infer<typeof Indicator>;
export type Rule = z.infer<typeof Rule>;
export type Risk = z.infer<typeof Risk>;
export type StrategySpec = z.infer<typeof StrategySpec>;
