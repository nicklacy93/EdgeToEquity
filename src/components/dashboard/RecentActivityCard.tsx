'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface ActivityItem {
  icon: string;
  text: string;
  impact?: string;
  time: string;
  tradeId: string;
}

interface RecentActivityCardProps {
  activities?: ActivityItem[];
}

export default function RecentActivityCard({ activities = [] }: RecentActivityCardProps) {
  const handleClick = (tradeId: string) => {
    console.log(`Navigate to trade ${tradeId}`);
  };

  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
            className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => handleClick(activity.tradeId)}
          >
            <div className="flex items-center gap-3">
              <span>{activity.icon}</span>
              <div className="flex flex-col text-sm">
                <span className="font-medium">{activity.text}</span>
                {activity.impact && <span className="text-xs text-muted-foreground">{activity.impact}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{activity.time}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
