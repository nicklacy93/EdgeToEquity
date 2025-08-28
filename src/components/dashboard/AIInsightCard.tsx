'use client';

import { Card } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function AIInsightCard() {
  return (
    <Card className="p-6 mb-6 flex items-start gap-4 border-l-4 border-primary">
      <Brain className="h-6 w-6 text-primary mt-1" />
      <div>
        <h3 className="text-lg font-semibold mb-1">Today’s Edge Insight</h3>
        <p className="text-muted-foreground text-sm">
          Your strategy had a 72% win rate this morning between 9–11 AM. You exited early on Trade #3 — consider holding until confirmation.
        </p>
      </div>
    </Card>
  );
}
