import { z } from "zod";

export const Indicator = z.object({
  id: z.string().min(1),
  kind: z.enum(["SMA","EMA","RSI","MACD","ATR"]).or(z.string().min(1)),
  params: z.record(z.union([z.number(), z.string()])),
});

export const Rule = z.object({
  lhs: z.string().min(1),
  op: z.enum([">","<","==","!=","crossesAbove","crossesBelow"]),
  rhs: z.union([z.string().min(1), z.number()]),
  note: z.string().optional(),
});

export const Risk = z.object({
  stop: z.number().positive(),
  take: z.number().positive().optional(),
  maxPositionPct: z.number().min(0).max(100).optional(),
});

export const StrategySpec = z.object({
  version: z.literal("v1"),
  revision: z.number().int().nonnegative().default(0),
  name: z.string().min(1),
  description: z.string().default(""),
  indicators: z.array(Indicator).max(12),
  entries: z.array(Rule).max(24),
  exits: z.array(Rule).max(24),
  risk: Risk.optional(),
  meta: z.object({
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
    source: z.string().optional(), // 'architect' | 'doctor' | 'upload:json' | 'upload:pine' | 'upload:brief'
  }).default({}),
});

export type Indicator = z.infer<typeof Indicator>;
export type Rule = z.infer<typeof Rule>;
export type Risk = z.infer<typeof Risk>;
export type StrategySpec = z.infer<typeof StrategySpec>;
