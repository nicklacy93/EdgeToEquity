"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

interface MoodTrendChartProps {
  moodPoints?: { timestamp: string; mood: string }[];
}

export default function MoodTrendChart({ moodPoints = [] }: MoodTrendChartProps) {
  const data = {
    labels: moodPoints.map((m) => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Mood",
        data: moodPoints.map((m) => moodToScore(m.mood)),
        borderColor: "#8B5CF6",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold mb-1">📈 Mood Trend</h3>
      <Line data={data} />
    </div>
  );
}

function moodToScore(mood: string) {
  const scale = {
    euphoric: 5,
    optimistic: 4,
    neutral: 3,
    cautious: 2,
    drawdown: 1,
  };
  return scale[mood.toLowerCase()] ?? 3;
}
