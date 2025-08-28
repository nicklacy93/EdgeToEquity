// src/store/useStrategyStore.ts
import { create } from 'zustand';

type StrategyPlatform = 'NinjaScript' | 'PineScript';

interface StrategyState {
  generatedCode: string;
  selectedPlatform: StrategyPlatform;
  setGeneratedCode: (code: string) => void;
  setSelectedPlatform: (platform: StrategyPlatform) => void;
}

export const useStrategyStore = create<StrategyState>((set) => ({
  generatedCode: '',
  selectedPlatform: 'NinjaScript',
  setGeneratedCode: (code) => set({ generatedCode: code }),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
}));
