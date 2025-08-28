'use client';

"use client";

import { useSessionStore } from "@/hooks/useSessionStore";
import { RotateCcw } from "lucide-react";

export default function ResetSessionButton() {
  const { clearSession } = useSessionStore();

  return (
    <button
      onClick={clearSession}
      className="flex items-center gap-2 px-3 py-1 border text-sm rounded-lg hover:bg-muted transition"
    >
      <RotateCcw size={16} />
      Reset Session
    </button>
  );
}

