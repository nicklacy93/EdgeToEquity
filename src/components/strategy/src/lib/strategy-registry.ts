export type Param = {
    name: string;
    type: "number" | "string" | "boolean";
    default: any;
    min?: number;
    max?: number;
    options?: string[];
};

export type IndicatorDef = {
    name: string;
    type: "oscillator" | "trend" | "volume" | "momentum" | "volatility";
    description: string;
    params: Param[];
    timeframe?: string;
};

export const StrategyRegistry: Record<string, IndicatorDef> = {
    rsi: {
        name: "RSI",
        type: "oscillator",
        description: "Relative Strength Index - momentum oscillator",
        params: [
            { name: "period", type: "number", default: 14, min: 2, max: 50 },
            { name: "overbought", type: "number", default: 70, min: 50, max: 95 },
            { name: "oversold", type: "number", default: 30, min: 5, max: 50 },
        ],
    },
    sma: {
        name: "SMA",
        type: "trend",
        description: "Simple Moving Average - trend following",
        params: [
            { name: "period", type: "number", default: 20, min: 1, max: 200 },
        ],
    },
    ema: {
        name: "EMA",
        type: "trend",
        description: "Exponential Moving Average - trend following",
        params: [
            { name: "period", type: "number", default: 20, min: 1, max: 200 },
        ],
    },
    macd: {
        name: "MACD",
        type: "momentum",
        description: "Moving Average Convergence Divergence",
        params: [
            { name: "fast", type: "number", default: 12, min: 1, max: 50 },
            { name: "slow", type: "number", default: 26, min: 1, max: 100 },
            { name: "signal", type: "number", default: 9, min: 1, max: 50 },
        ],
    },
    bollinger: {
        name: "Bollinger Bands",
        type: "volatility",
        description: "Bollinger Bands - volatility and mean reversion",
        params: [
            { name: "period", type: "number", default: 20, min: 1, max: 100 },
            { name: "std", type: "number", default: 2, min: 1, max: 3 },
        ],
    },
    atr: {
        name: "ATR",
        type: "volatility",
        description: "Average True Range - volatility measurement",
        params: [
            { name: "period", type: "number", default: 14, min: 1, max: 50 },
        ],
    },
    volume: {
        name: "Volume",
        type: "volume",
        description: "Volume analysis",
        params: [
            { name: "sma_period", type: "number", default: 20, min: 1, max: 100 },
        ],
    },
};

export function validateIndicator(indicator: any): boolean {
    const def = StrategyRegistry[indicator.name.toLowerCase()];
    if (!def) return false;

    // Check required params
    for (const param of def.params) {
        if (!(param.name in indicator.params)) {
            return false;
        }
    }

    return true;
}

export function getIndicatorDef(name: string): IndicatorDef | undefined {
    return StrategyRegistry[name.toLowerCase()];
}
