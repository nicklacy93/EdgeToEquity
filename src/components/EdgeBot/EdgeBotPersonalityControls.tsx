"use client";
import { useState, useEffect } from "react";
import { PersonalityProfile } from "@/types/ChatTypes";

export default function EdgeBotPersonalityControls({
  personality,
  onChange,
}: {
  personality: PersonalityProfile;
  onChange: (p: PersonalityProfile) => void;
}) {
  const [temp, setTemp] = useState(personality);

  useEffect(() => {
    setTemp(personality);
  }, [personality]);

  return (
    <div className="space-y-2 text-sm p-2 border rounded-lg bg-muted/30 mt-2">
      <label className="block">
        Tone:
        <select
          value={temp.preferredTone}
          onChange={(e) => {
            const updated = { ...temp, preferredTone: e.target.value };
            setTemp(updated);
            onChange(updated);
          }}
          className="w-full border px-2 py-1 rounded mt-1"
        >
          <option value="encouraging">Encouraging</option>
          <option value="tough-love">Tough Love</option>
          <option value="neutral">Neutral</option>
        </select>
      </label>
      <label className="block">
        Style:
        <select
          value={temp.coachStyle}
          onChange={(e) => {
            const updated = { ...temp, coachStyle: e.target.value };
            setTemp(updated);
            onChange(updated);
          }}
          className="w-full border px-2 py-1 rounded mt-1"
        >
          <option value="mentor">Mentor</option>
          <option value="socratic">Socratic</option>
          <option value="friend">Supportive Friend</option>
        </select>
      </label>
      <label className="block">
        Your Name:
        <input
          value={temp.userName}
          onChange={(e) => {
            const updated = { ...temp, userName: e.target.value };
            setTemp(updated);
            onChange(updated);
          }}
          className="w-full border px-2 py-1 rounded mt-1"
        />
      </label>
    </div>
  );
}
