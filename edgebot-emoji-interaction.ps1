
# Path to EdgeBotGreetingCard.tsx
$cardPath = "C:\Users\nickl\Documents\EdgeToEquity\edge-to-equity-next\src\components\EdgeBot\EdgeBotGreetingCard.tsx"

# Load content
$content = Get-Content $cardPath -Raw

# Enhance emoji to be clickable with hover animation and mood tooltip
$content = $content -replace '\{theme\.emoji\}', '<button onClick={toggleModal} title={`Current mood: ${mood}`} className="hover:scale-110 transition duration-200"><span className="text-2xl">{theme.emoji}</span></button>'

# Make sure toggleModal is declared (import useModal or context pattern)
if ($content -notmatch 'toggleModal') {
    $content = $content -replace 'export default function EdgeBotGreetingCard', 'import { useEdgeBotModal } from "@/hooks/useEdgeBotModal";\n\nexport default function EdgeBotGreetingCard'
    $content = $content -replace 'const \{ mood, theme, contextMessage \}', 'const { mood, theme, contextMessage };\n  const { toggle: toggleModal } = useEdgeBotModal()'
}

# Save updated file
Set-Content -Path $cardPath -Value $content -Encoding UTF8

Write-Host "`n✅ EdgeBot emoji is now interactive with tooltip, hover animation, and modal trigger." -ForegroundColor Green
