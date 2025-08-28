import React, { createContext, useContext } from 'react';
import { useEmotionalState } from '../hooks/useEmotionalState';

const EdgeBotContext = createContext<any>(null);

export const EdgeBotProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useEmotionalState();
  return <EdgeBotContext.Provider value={value}>{children}</EdgeBotContext.Provider>;
};

export const useEdgeBot = () => useContext(EdgeBotContext);
