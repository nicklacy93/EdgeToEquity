'use client';

import React from 'react';
import { 
  MessageSquare, 
  TrendingUp, 
  Brain, 
  PieChart,
  Settings,
  User
} from 'lucide-react';

export function QuickActions() {
  const actions = [
    { 
      icon: MessageSquare, 
      label: 'Chat with AI', 
      color: 'bg-purple-600 hover:bg-purple-700',
      href: '/chat'
    },
    { 
      icon: TrendingUp, 
      label: 'Generate Strategy', 
      color: 'bg-blue-600 hover:bg-blue-700',
      href: '/strategies'
    },
    { 
      icon: Brain, 
      label: 'Psychology', 
      color: 'bg-pink-600 hover:bg-pink-700',
      href: '/psychology'
    },
    { 
      icon: PieChart, 
      label: 'Analytics', 
      color: 'bg-green-600 hover:bg-green-700',
      href: '/analytics'
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quick Actions</h3>
      <div className="grid gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg text-white transition-colors ${action.color}`}
          >
            <action.icon className="h-5 w-5" />
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
