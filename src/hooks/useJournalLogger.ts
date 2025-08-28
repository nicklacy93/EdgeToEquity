"use client";

import { useState, useEffect } from "react";

export interface JournalEntry {
  id: string;
  timestamp: string;
  content: string;
  emotion: string;
  tags: string[];
}

export function useJournalLogger() {
  const [journal, setJournal] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("edgebot-journal");
    if (stored) setJournal(JSON.parse(stored));
  }, []);

  const logJournalEntry = (content: string, emotion: string = "neutral", tags: string[] = []) => {
    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      content,
      emotion,
      tags,
    };

    const updated = [...journal, newEntry];
    setJournal(updated);
    localStorage.setItem("edgebot-journal", JSON.stringify(updated));
  };

  return { journal, logJournalEntry };
}
