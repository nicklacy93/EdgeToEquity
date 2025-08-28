"use client";
import { useState, useEffect } from "react";
import { ChatMessageWithMeta } from "@/types/ChatTypes";
import { motion } from "framer-motion/client";

interface AgentSwitcherPreviewProps {
  selected: string;
  onSelect: (agent: string) => void;
}

export default function AgentSwitcherPreview({ selected, onSelect }: AgentSwitcherPreviewProps) {
  const [agentMemory, setAgentMemory] = useState<Record<string, ChatMessageWithMeta[]>>({});
  const agents = ["strategy", "debug", "psychology"];

  useEffect(() => {
    const data: Record<string, ChatMessageWithMeta[]> = {};
    agents.forEach((agent) => {
      const raw = localStorage.getItem(`edgebot_memory_${agent}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        data[agent] = parsed.messages?.slice(-3) || [];
      }
    });
    setAgentMemory(data);
  }, []);

  return (
    <div className="p-4 space-y-3">
      {agents.map((agent) => (
        <motion.div
          key={agent}
          whileHover={{ scale: 1.02 }}
          onClick={() => onSelect(agent)}
          className={`cursor-pointer border rounded-xl p-3 transition ${selected === agent ? "bg-purple-50 border-purple-400" : "bg-muted"
            }`}
        >
          <p className="font-semibold text-sm mb-1">
            {agent === "strategy" ? "?? Strategy" : agent === "debug" ? "??? Debug" : "?? Psychology"}
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            {agentMemory[agent]?.length ? (
              agentMemory[agent].map((m, i) => (
                <p key={i} className="truncate">
                  {m.sender === "user" ? "You:" : "Bot:"} {m.message}
                </p>
              ))
            ) : (
              <p className="italic text-gray-400">No messages</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
