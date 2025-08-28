import React, { createContext, useContext, useState, ReactNode } from "react";

export type SessionContextType = {
  mood: string;
  learningStreak: number;
  todayTimeSpent: string;
  currentModule: string;
  strategiesBuilt: number;
  conceptsLearned: number;
  journalEntries: number;
  confidence: number;
  // Add more fields as needed
  [key: string]: any;
};

const defaultSession: SessionContextType = {
  mood: "curious",
  learningStreak: 8,
  todayTimeSpent: "2h 15m",
  currentModule: "Psychology of Risk Management",
  strategiesBuilt: 4,
  conceptsLearned: 12,
  journalEntries: 15,
  confidence: 4,
};

const SessionContext = createContext<{
  session: SessionContextType;
  setSession: React.Dispatch<React.SetStateAction<SessionContextType>>;
}>({
  session: defaultSession,
  setSession: () => {},
});

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<SessionContextType>(defaultSession);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext);
