"use client";

import React, { createContext, useContext } from "react";
import { useEdgeBotState } from "@/hooks/useEdgeBotState";

const EdgeBotMoodContext = createContext(null);

export const EdgeBotMoodProvider = ({ children }) => {
  const bot = useEdgeBotState();
  return (
    <EdgeBotMoodContext.Provider value={bot}>
      {children}
    </EdgeBotMoodContext.Provider>
  );
};

export const useEdgeBotMood = () => {
  const context = useContext(EdgeBotMoodContext);
  if (!context) throw new Error("useEdgeBotMood must be used within EdgeBotMoodProvider");
  return context;
};
