"use client";

import { useState } from "react";
import EdgeBotModal from "./EdgeBotModal";

export default function EdgeBotLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-purple-700 transition"
      >
        ?? Open EdgeBot
      </button>

      <EdgeBotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
