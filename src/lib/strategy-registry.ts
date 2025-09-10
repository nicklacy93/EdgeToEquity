export type Param = {
  key: string;
  type: "int" | "float" | "enum";
  min?: number;
  max?: number;
  options?: string[];
  default?: number | string;
};

export type IndicatorDef = {
  kind: string;
  label: string;
  params: Param[];
  validate: (p: Record<string, unknown>) => string[];
};

export const StrategyRegistry: Record<string, IndicatorDef> = {
  SMA: {
    kind: "SMA",
    label: "Simple Moving Average",
    params: [{ key: "length", type: "int", min: 1, max: 1000, default: 20 }],
    validate: (p) => {
      const errs: string[] = [];
      const len = Number(p.length);
      if (!Number.isFinite(len) || len < 1) errs.push("SMA.length must be >= 1");
      return errs;
    },
  },
  EMA: {
    kind: "EMA",
    label: "Exponential Moving Average",
    params: [{ key: "length", type: "int", min: 1, max: 1000, default: 20 }],
    validate: (p) => {
      const errs: string[] = [];
      const len = Number(p.length);
      if (!Number.isFinite(len) || len < 1) errs.push("EMA.length must be >= 1");
      return errs;
    },
  },
  RSI: {
    kind: "RSI",
    label: "Relative Strength Index",
    params: [{ key: "length", type: "int", min: 2, max: 100, default: 14 }],
    validate: (p) => {
      const errs: string[] = [];
      const len = Number(p.length);
      if (!Number.isFinite(len) || len < 2 || len > 100) errs.push("RSI.length in [2,100]");
      return errs;
    },
  },
  MACD: {
    kind: "MACD",
    label: "MACD",
    params: [
      { key: "fast", type: "int", min: 1, max: 1000, default: 12 },
      { key: "slow", type: "int", min: 1, max: 1000, default: 26 },
      { key: "signal", type: "int", min: 1, max: 1000, default: 9 },
    ],
    validate: (p) => {
      const errs: string[] = [];
      const fast = Number(p.fast), slow = Number(p.slow), signal = Number(p.signal);
      if (!(fast > 0 && slow > 0 && signal > 0)) errs.push("MACD params must be > 0");
      if (fast >= slow) errs.push("MACD.fast should be < slow");
      return errs;
    },
  },
  ATR: {
    kind: "ATR",
    label: "Average True Range",
    params: [{ key: "length", type: "int", min: 1, max: 1000, default: 14 }],
    validate: (p) => {
      const errs: string[] = [];
      const len = Number(p.length);
      if (!Number.isFinite(len) || len < 1) errs.push("ATR.length must be >= 1");
      return errs;
    },
  },
};
