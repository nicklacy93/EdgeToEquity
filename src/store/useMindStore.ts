import { create } from "zustand";

export type MoodType = "neutral" | "focused" | "frustrated" | "motivated" | "confident" | "burned_out" | null;

interface MindState {
  mood: MoodType;
  journalEntry: string;
  moodHistory: { mood: MoodType; timestamp: string }[];
  setMood: (m: MoodType) => void;
  setJournalEntry: (entry: string) => void;
  logMood: (m: MoodType) => void;
  resetMind: () => void;
}

export const useMindStore = create<MindState>((set) => ({
  mood: null,
  journalEntry: "",
  moodHistory: [],

  setMood: (mood) => set({ mood }),

  logMood: (mood) =>
    set((state) => ({
      mood,
      moodHistory: [...state.moodHistory, { mood, timestamp: new Date().toISOString() }],
    })),

  setJournalEntry: (entry) => set({ journalEntry: entry }),

  resetMind: () => set({ mood: null, journalEntry: "", moodHistory: [] }),
}));
