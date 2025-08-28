
# Path to useEdgeBotState.ts
$hookPath = "C:\Users\nickl\Documents\EdgeToEquity\edge-to-equity-next\src\hooks\useEdgeBotState.ts"

# Load file content
$content = Get-Content $hookPath -Raw

# Replace state initialization for full mood intelligence
$content = $content -replace 'const \[mood, setMood\] = useState<.*?;', @'
const [mood, setMood] = useState<Mood>(() => {
  const saved = localStorage.getItem("edgeBotMood");
  return saved as Mood ?? "neutral";
});
'@

# Add mood history array + P&L intelligence update function
if ($content -notmatch 'const \[moodHistory') {
    $content = $content -replace 'const \[contextMessage, setContextMessage\] = useState\(""\);', @'
const [contextMessage, setContextMessage] = useState("");
const [moodHistory, setMoodHistory] = useState<Mood[]>([]);

function updateMoodFromStats(winRate: number, pnl: number) {
  let newMood: Mood = "neutral";
  if (winRate > 70 && pnl > 500) newMood = "confident";
  else if (winRate > 50 && pnl > 0) newMood = "focused";
  else if (pnl < -500) newMood = "alert";
  else if (winRate < 40) newMood = "supportive";

  setMood(prev => {
    if (prev !== newMood) {
      setMoodHistory(h => [...h.slice(-9), newMood]);
      localStorage.setItem("edgeBotMood", newMood);
    }
    return newMood;
  });
}
'@
}

# Save updated hook
Set-Content -Path $hookPath -Value $content -Encoding UTF8

Write-Host "`n✅ EdgeBot now has mood auto-updating, local persistence, and emotional history logging." -ForegroundColor Green
