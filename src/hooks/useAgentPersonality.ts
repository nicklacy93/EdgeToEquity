import { useEffect, useState } from "react";
import { PersonalityProfile } from "@/types/ChatTypes";
import { defaultPersonality } from "@/utils/personalityDefaults";

export function useAgentPersonality(agent: string) {
  const [personality, setPersonality] = useState<PersonalityProfile>(defaultPersonality[agent] || {});

  useEffect(() => {
    const raw = localStorage.getItem(`personality_${agent}`);
    if (raw) {
      setPersonality(JSON.parse(raw));
    }
  }, [agent]);

  const savePersonality = (updated: PersonalityProfile) => {
    setPersonality(updated);
    localStorage.setItem(`personality_${agent}`, JSON.stringify(updated));
  };

  return { personality, savePersonality };
}
