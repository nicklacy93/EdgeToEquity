# ---- scripts/dev-reset.ps1 ----
param([switch]$Hard)

# Stop any dev servers
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Use pnpm only
corepack enable | Out-Null

# Clean working dirs
Remove-Item -Recurse -Force node_modules, .next -ErrorAction SilentlyContinue
if ($Hard) {
  Remove-Item -Force package-lock.json, yarn.lock -ErrorAction SilentlyContinue
  Remove-Item -Force pnpm-lock.yaml -ErrorAction SilentlyContinue
  pnpm store prune
}

# Fresh install
pnpm install

Write-Host "`n✅ Reset complete. Start dev with: pnpm dev`" -ForegroundColor Green
