import type { StrategySpec } from "@/types/strategy";

export function compileToTS(spec: StrategySpec): { code: string; diagnostics: string[] } {
    const diagnostics: string[] = [];

    // Basic validation
    if (spec.entries.length === 0) {
        diagnostics.push("Warning: No entry rules defined");
    }

    if (spec.exits.length === 0) {
        diagnostics.push("Warning: No exit rules defined");
    }

    // Generate TypeScript code stub
    const code = `// Generated strategy: ${spec.name}
// Version: ${spec.version}, Revision: ${spec.revision}
// Generated at: ${new Date().toISOString()}

interface StrategyConfig {
  symbols: string[];
  timeframe: string;
  indicators: any[];
  entries: any[];
  exits: any[];
  risk: any;
}

const config: StrategyConfig = {
  symbols: ${JSON.stringify(spec.symbols, null, 2)},
  timeframe: "${spec.timeframe}",
  indicators: ${JSON.stringify(spec.indicators, null, 2)},
  entries: ${JSON.stringify(spec.entries, null, 2)},
  exits: ${JSON.stringify(spec.exits, null, 2)},
  risk: ${JSON.stringify(spec.risk, null, 2)},
};

// TODO: Implement actual strategy logic
export class ${spec.name.replace(/[^a-zA-Z0-9]/g, '')}Strategy {
  private config: StrategyConfig;
  
  constructor() {
    this.config = config;
  }
  
  // Entry logic
  checkEntries(data: any): boolean {
    // TODO: Implement entry conditions
    return false;
  }
  
  // Exit logic
  checkExits(data: any): boolean {
    // TODO: Implement exit conditions
    return false;
  }
  
  // Risk management
  calculatePositionSize(): number {
    return this.config.risk.maxPositionSize;
  }
  
  calculateStopLoss(): number {
    return this.config.risk.stopLoss;
  }
  
  calculateTakeProfit(): number | null {
    return this.config.risk.takeProfit || null;
  }
}

export default ${spec.name.replace(/[^a-zA-Z0-9]/g, '')}Strategy;
`;

    return { code, diagnostics };
}
