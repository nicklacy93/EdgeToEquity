import { create } from "zustand";

interface WorkspaceState {
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeTab: null, // start with no active tab
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
