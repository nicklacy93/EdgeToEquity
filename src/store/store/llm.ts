import { create } from 'zustand';
type Mode = 'LIVE' | 'MOCK' | 'MOCK_FALLBACK';
export const useLLM = create<{
    mode: Mode; setMode: (m: Mode) => void;
    pending: boolean; setPending: (b: boolean) => void;
    lastReqId?: string; setReqId: (id?: string) => void;
}>((set) => ({
    mode: 'LIVE',
    setMode: (m) => set({ mode: m }),
    pending: false, setPending: (b) => set({ pending: b }),
    lastReqId: undefined, setReqId: (id) => set({ lastReqId: id }),
}));

