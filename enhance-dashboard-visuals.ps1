
# Paths to TSX files (customize these as needed)
$dashboardPagePath = "C:\Users\nickl\Documents\EdgeToEquity\edge-to-equity-next\src\app\dashboard\page.tsx"
$heroSectionPath = "C:\Users\nickl\Documents\EdgeToEquity\edge-to-equity-next\src\components\dashboard\HeroSection.tsx"
$kpiGridPath = "C:\Users\nickl\Documents\EdgeToEquity\edge-to-equity-next\src\components\dashboard\KPIGrid.tsx"

# Update Dashboard Layout
(Get-Content $dashboardPagePath -Raw) -replace 'className="space-y-6"', 'className="max-w-6xl mx-auto space-y-8 px-4 py-6"' |
    Set-Content $dashboardPagePath -Encoding UTF8

# Enhance HeroSection
(Get-Content $heroSectionPath -Raw) `
-replace 'className="text-center', 'className="text-center bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-xl shadow-lg ring-1 ring-indigo-500/30 px-6 py-5' |
    Set-Content $heroSectionPath -Encoding UTF8

# Update KPI Cards with glow and motion
(Get-Content $kpiGridPath -Raw) `
-replace 'className="grid grid-cols-.*?"', 'className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"' `
-replace 'className="rounded-xl.*?"', 'className="rounded-xl bg-zinc-900/60 backdrop-blur border border-white/10 shadow-md p-4 transition hover:shadow-lg hover:scale-[1.02]"' |
    Set-Content $kpiGridPath -Encoding UTF8

Write-Host "`n✅ Visual polish enhancements applied. Run `npm run dev` to view the updated dashboard." -ForegroundColor Green
