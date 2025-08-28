'use client';

interface Props {
  durationText: string;
  startMood: string;
  endMood: string;
  coachingNudges: number;
  messageCount: number;
}

export default function SessionSummaryCard({
  durationText,
  startMood,
  endMood,
  coachingNudges,
  messageCount
}: Props) {
  return (
    <div className="p-4 rounded-xl border bg-card space-y-3 shadow-md">
      <h3 className="text-lg font-semibold">?? Session Summary</h3>
      <div className="text-sm text-muted-foreground space-y-1">
        <p><strong>?? Duration:</strong> {durationText}</p>
        <p><strong>?? Mood:</strong> {startMood} ? {endMood}</p>
        <p><strong>?? Messages:</strong> {messageCount}</p>
        <p><strong>?? Coaching Nudges:</strong> {coachingNudges}</p>
      </div>
    </div>
  );
}
