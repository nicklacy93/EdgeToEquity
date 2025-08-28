"use client";

import { useState } from "react";

// Simulated emotional model for now
export function useEmotionalState() {
  const [mood, setMood] = useState("focused");        // default state
  const [confidence, setConfidence] = useState("??"); // emoji or numeric

  return { mood, confidence, setMood, setConfidence };
}
