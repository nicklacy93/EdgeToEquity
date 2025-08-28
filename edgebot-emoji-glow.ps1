
# Path to EdgeBotGreetingCard.tsx
$cardPath = "C:\Users\nickl\Documents\EdgeToEquity\edge-to-equity-next\src\components\EdgeBot\EdgeBotGreetingCard.tsx"

# Read the file
$content = Get-Content $cardPath -Raw

# Wrap emoji in animated glow ring container if not already added
if ($content -notmatch 'emoji-ring') {
    $content = $content -replace '<span className="text-2xl">\{theme\.emoji\}</span>', '<span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/40 ring-2 ring-offset-2 ring-${theme?.color} transition-all duration-300 emoji-ring"><span className="text-xl">{theme.emoji}</span></span>'
}

# Save file
Set-Content -Path $cardPath -Value $content -Encoding UTF8

Write-Host "`n✅ Animated glow ring added around mood emoji. Mood transitions will now visually reflect theme color." -ForegroundColor Green
