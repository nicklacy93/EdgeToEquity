'use client';
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEdgeBotMood } from "@/context/EdgeBotMoodContext";
import { ArrowRight } from "lucide-react";

interface ActivityItem {
  icon: string;
  text: string;
  impact?: "positive" | "neutral" | "negative";
  time: string;
  tradeId: string;
}

interface InteractiveActivityProps {
  activities: ActivityItem[];
}

export default function InteractiveActivity({ activities }: InteractiveActivityProps) {
  const router = useRouter();
  const { mood } = useEdgeBotMood();

  const moodHover = {
    confident: "hover:border-l-2 hover:border-emerald-400/80",
    focused: "hover:border-l-2 hover:border-blue-400/70",
    supportive: "hover:border-l-2 hover:border-amber-400/70",
    alert: "hover:border-l-2 hover:border-red-400/70"
  };

  const impactColor = {
    positive: "text-green-400",
    neutral: "text-white/80",
    negative: "text-red-400"
  };

  const handleClick = (tradeId: string) => {
    router.push(`/trades/${tradeId}`);
  };

  return (
    <div className="space-y-2">
      {activities.map((activity, index) => (
        <motion.div
          key={index}
          whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.05)" }}
          onClick={() => handleClick(activity.tradeId)}
          className={\`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 \${moodHover[mood]}\`}
        >
          <div className="text-white/70">
            <ArrowRight className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className={impactColor[activity.impact ?? "neutral"]}>{activity.text}</p>
            <p className="text-xs text-white/50 mt-0.5">{activity.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

