
# Path to EdgeBotModal.tsx
$modalPath = "C:\Users\nickl\Documents\EdgeToEquity\edge-to-equity-next\src\components\EdgeBot\EdgeBotModal.tsx"

# Load content
$content = Get-Content $modalPath -Raw

# Insert moodHistory display section and reset button if not already present
if ($content -notmatch 'Mood History') {
    $content = $content -replace '(</h2>)', '$1\n<p className="text-sm text-muted-foreground mb-4">Here’s how you’ve been feeling lately:</p>\n<ul className="flex gap-2 text-lg mb-4">{moodHistory.map((m, i) => <li key={i}>{m}</li>)}</ul>'
}

# Add reset button before modal close or footer
if ($content -notmatch 'Reset Bot') {
    $content = $content -replace '(</motion.div>)', '<button onClick={() => { localStorage.removeItem("edgeBotMood"); location.reload(); }} className="mt-4 text-xs text-red-400 underline hover:text-red-500">Reset Bot</button>`n$1'
}

# Ensure useEdgeBotState and moodHistory is being imported/used
if ($content -notmatch 'moodHistory') {
    $content = $content -replace 'const \{ mood, theme, contextMessage \}', 'const { mood, theme, contextMessage, moodHistory }'
}

# Save file
Set-Content -Path $modalPath -Value $content -Encoding UTF8

Write-Host "`n✅ EdgeBotModal now displays mood history and includes a Reset Bot button." -ForegroundColor Green
