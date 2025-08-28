
# Path to EdgeBotGreetingCard.tsx
$greetingCardPath = "C:\Users\nickl\Documents\EdgeToEquity\edge-to-equity-next\src\components\EdgeBot\EdgeBotGreetingCard.tsx"

# Load content
$content = Get-Content $greetingCardPath -Raw

# Inject mood-based background, emoji glow, and polish label text
$content = $content -replace 'className="rounded-xl.*?"', 'className={`rounded-xl p-4 shadow-md transition-all duration-300 bg-gradient-to-br from-${theme?.color ?? "gray"} to-black text-white border border-white/10`}'
$content = $content -replace '>\?\?<', '>🤖 EdgeBot<'

# Add emoji pulse effect if not already in
if ($content -notmatch "animate-ping") {
    $content = $content -replace '<span>\{theme\.emoji\}</span>', '<span className="relative"><span className="absolute inline-flex h-3 w-3 rounded-full bg-current opacity-75 animate-ping top-1 left-1"></span><span>{theme.emoji}</span></span>'
}

# Save updated file
Set-Content -Path $greetingCardPath -Value $content -Encoding UTF8

Write-Host "`n✅ EdgeBotGreetingCard enhanced with mood-based glow, emoji pulse, and clean label." -ForegroundColor Green
