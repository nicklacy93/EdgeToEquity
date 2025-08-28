'use client';

export default function RightAIPanel() {
  return (
    <aside className="hidden lg:flex flex-col w-[280px] p-4 space-y-4 glass-card text-white">
      <div>
        <h3 className="text-white font-bold mb-2">📊 AI Summary</h3>
        <p>Last 3 trades reviewed</p>
        <p>EdgeScore: <span className="text-emerald-300 font-bold">78%</span></p>
        <p>Bot Confidence: <span className="text-purple-300">High</span></p>
      </div>
      <div>
        <h3 className="text-white font-bold mb-2">🧠 Recent Activity</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Trade #3 flagged 🚩</li>
          <li>FVG setup detected</li>
          <li>3 new trades journaled</li>
        </ul>
      </div>
    </aside>
  );
}
