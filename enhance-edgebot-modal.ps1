
# Path to EdgeBotModal.tsx
$modalPath = "C:\Users\nickl\Documents\EdgeToEquity\edge-to-equity-next\src\components\EdgeBot\EdgeBotModal.tsx"

# Load content
$content = Get-Content $modalPath -Raw

# Add mood-aware styling to modal background and emoji intro
$content = $content -replace 'className="rounded-xl.*?"', 'className={`rounded-xl w-full max-w-md mx-auto bg-gradient-to-br from-${theme?.color ?? "gray"} to-black text-white p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur`}'
$content = $content -replace '<h2 className="text-lg font-semibold">', '<h2 className="text-lg font-semibold flex items-center gap-2">'
$content = $content -replace '\{theme\.emoji\}', '<span className="text-2xl animate-bounce">{theme.emoji}</span>'

# Ensure there's a subtle transition for open/close motion
if ($content -notmatch "motion.div") {
    $content = $content -replace '<div ', '<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} '
    $content = "import { motion } from 'framer-motion';`n" + $content
}

# Save file
Set-Content -Path $modalPath -Value $content -Encoding UTF8

Write-Host "`n✅ EdgeBotModal enhanced with mood color, emoji bounce, motion transition, and glass effect." -ForegroundColor Green
