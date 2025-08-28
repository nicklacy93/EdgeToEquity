param (
    [string]$Feature,
    [string]$UpdatedBy,
    [string]$Update
)

$docPath = ".\docs\feature-log.md"

if (-not (Test-Path $docPath)) {
    New-Item -ItemType File -Path $docPath -Force | Out-Null
    Add-Content -Path $docPath -Value "# EdgeToEquity Feature Log`n"
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$logEntry = @"
### $Feature

- **Updated By:** $UpdatedBy  
- **Time:** $timestamp  
- **Update:** $Update  

---
"@

Add-Content -Path $docPath -Value $logEntry
Write-Host "✅ Feature '$Feature' updated and logged by $UpdatedBy." -ForegroundColor Green
