// src/store/useStrategyStore.ts
import { create } from 'zustand';
import type { StrategySpec } from '@/types/strategy';
import type { Lint } from '@/lib/strategy-lints';

type StrategyPlatform = 'NinjaScript' | 'PineScript';

interface StrategyState {
  // Legacy state (preserved for compatibility)
  generatedCode: string;
  selectedPlatform: StrategyPlatform;
  setGeneratedCode: (code: string) => void;
  setSelectedPlatform: (platform: StrategyPlatform) => void;
  
  // New strategy workspace state
  spec: StrategySpec | null;
  history: StrategySpec[];
  future: StrategySpec[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  lints: Lint[];
  compile: {
    code: string | null;
    diagnostics: string[];
  };
  
  // Actions
  setSpec: (spec: StrategySpec | null) => void;
  undo: () => void;
  redo: () => void;
  generate: (brief: string, constraints?: string) => Promise<void>;
  edit: (instruction: string, mode?: 'patch' | 'replace') => Promise<void>;
  compileSpec: () => Promise<void>;
  importSpec: (content: string, kind: 'json' | 'pine' | 'brief') => Promise<void>;
}

export const useStrategyStore = create<StrategyState>((set, get) => ({
  // Legacy state
  generatedCode: '',
  selectedPlatform: 'NinjaScript',
  setGeneratedCode: (code) => set({ generatedCode: code }),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  
  // New state
  spec: null,
  history: [],
  future: [],
  status: 'idle',
  error: null,
  lints: [],
  compile: {
    code: null,
    diagnostics: [],
  },
  
  // Actions
  setSpec: (spec) => {
    const state = get();
    if (state.spec) {
      set({ 
        spec, 
        history: [...state.history, state.spec],
        future: [],
        error: null 
      });
    } else {
      set({ spec, error: null });
    }
  },
  
  undo: () => {
    const state = get();
    if (state.history.length > 0) {
      const previous = state.history[state.history.length - 1];
      set({
        spec: previous,
        history: state.history.slice(0, -1),
        future: [state.spec!, ...state.future],
        error: null
      });
    }
  },
  
  redo: () => {
    const state = get();
    if (state.future.length > 0) {
      const next = state.future[0];
      set({
        spec: next,
        history: [...state.history, state.spec!],
        future: state.future.slice(1),
        error: null
      });
    }
  },
  
  generate: async (brief, constraints) => {
    set({ status: 'loading', error: null });
    try {
      const response = await fetch('/api/strategy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, constraints }),
      });
      const data = await response.json();
      if (data.ok) {
        get().setSpec(data.spec);
      } else {
        set({ error: 'Failed to generate strategy' });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      set({ status: 'idle' });
    }
  },
  
  edit: async (instruction, mode = 'patch') => {
    const state = get();
    if (!state.spec) return;
    
    set({ status: 'loading', error: null });
    try {
      const response = await fetch('/api/strategy/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec: state.spec, instruction, mode }),
      });
      const data = await response.json();
      if (data.ok) {
        get().setSpec(data.spec);
      } else {
        set({ error: 'Failed to edit strategy' });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      set({ status: 'idle' });
    }
  },
  
  compileSpec: async () => {
    const state = get();
    if (!state.spec) return;
    
    set({ status: 'loading', error: null });
    try {
      const response = await fetch('/api/strategy/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec: state.spec }),
      });
      const data = await response.json();
      set({ 
        compile: { code: data.code, diagnostics: data.diagnostics },
        status: 'idle'
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', status: 'idle' });
    }
  },
  
  importSpec: async (content, kind) => {
    set({ status: 'loading', error: null });
    try {
      const response = await fetch('/api/strategy/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, kind }),
      });
      const data = await response.json();
      if (data.ok) {
        get().setSpec(data.spec);
      } else {
        set({ error: 'Failed to import strategy' });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      set({ status: 'idle' });
    }
  },
}));
