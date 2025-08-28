# EdgeToEquity Project Health Check
# Senior Developer Edition - Continuous Integration Ready

param(
    [switch]$Fix,
    [switch]$Detailed
)

$global:HealthIssues = @()
$global:Recommendations = @()

function Add-HealthIssue {
    param($Issue, $Severity = "Medium", $Fix = $null)
    $global:HealthIssues += @{
        Issue = $Issue
        Severity = $Severity
        Fix = $Fix
        Timestamp = Get-Date
    }
}

function Add-Recommendation {
    param($Recommendation)
    $global:Recommendations += $Recommendation
}

function Check-ProjectStructure {
    Write-Host "🏗️ Checking Project Structure..." -ForegroundColor Cyan
    
    $expectedStructure = @{
        "src/app" = "Next.js app directory"
        "src/components" = "React components"
        "src/lib" = "Utility libraries"
        "src/types" = "TypeScript type definitions"
        "public" = "Static assets"
        "data" = "Application data storage"
        ".next" = "Next.js build output"
        "node_modules" = "Dependencies"
    }
    
    foreach ($path in $expectedStructure.GetEnumerator()) {
        if (Test-Path $path.Key) {
            Write-Host "✅ $($path.Key) - $($path.Value)" -ForegroundColor Green
        } else {
            Add-HealthIssue "Missing directory: $($path.Key)" "High" "Create directory: mkdir '$($path.Key)'"
            Write-Host "❌ $($path.Key) - Missing" -ForegroundColor Red
        }
    }
    
    # Check critical files
    $criticalFiles = @{
        "package.json" = "Project configuration"
        "next.config.js" = "Next.js configuration"
        "tailwind.config.js" = "Tailwind CSS configuration"
        "tsconfig.json" = "TypeScript configuration"
        ".env.local" = "Environment variables"
        ".gitignore" = "Git ignore rules"
    }
    
    foreach ($file in $criticalFiles.GetEnumerator()) {
        if (Test-Path $file.Key) {
            Write-Host "✅ $($file.Key) - $($file.Value)" -ForegroundColor Green
        } else {
            Add-HealthIssue "Missing file: $($file.Key)" "Medium" "Create file: $($file.Key)"
            Write-Host "⚠️ $($file.Key) - Missing" -ForegroundColor Yellow
        }
    }
}

function Check-CodeQuality {
    Write-Host "`n🔍 Checking Code Quality..." -ForegroundColor Cyan
    
    # Check TypeScript files for common issues
    $tsFiles = Get-ChildItem -Recurse -Include "*.ts", "*.tsx" | Where-Object { $_.FullName -notmatch "node_modules" }
    
    if ($tsFiles.Count -eq 0) {
        Add-HealthIssue "No TypeScript files found" "High"
        return
    }
    
    Write-Host "Found $($tsFiles.Count) TypeScript files" -ForegroundColor White
    
    foreach ($file in $tsFiles) {
        $content = Get-Content $file.FullName -Raw
        
        # Check for console.log statements (should be removed in production)
        if ($content -match "console\.(log|error|warn|debug)") {
            Add-HealthIssue "Console statements found in $($file.Name)" "Low" "Remove console statements"
        }
        
        # Check for TODO comments
        if ($content -match "TODO|FIXME|HACK") {
            Add-HealthIssue "TODO/FIXME comments in $($file.Name)" "Low" "Address TODO items"
        }
        
        # Check for proper TypeScript typing
        if ($content -match "any\b" -and $file.Name -notmatch "\.d\.ts$") {
            Add-HealthIssue "Usage of 'any' type in $($file.Name)" "Medium" "Replace 'any' with proper types"
        }
    }
}

function Check-Security {
    Write-Host "`n🔒 Checking Security..." -ForegroundColor Cyan
    
    # Check .env.local for security issues
    if (Test-Path ".env.local") {
        $envContent = Get-Content ".env.local" -Raw
        
        # Check for placeholder values
        if ($envContent -match "your_.*_here") {
            Add-HealthIssue "Placeholder values in .env.local" "Critical" "Replace with actual API keys"
        }
        
        # Check for exposed secrets
        if ($envContent -match "sk-[A-Za-z0-9]{48,}") {
            Write-Host "✅ OpenAI API key format detected" -ForegroundColor Green
        }
        
        if ($envContent -match "sk-ant-[A-Za-z0-9\-_]{95,}") {
            Write-Host "✅ Anthropic API key format detected" -ForegroundColor Green
        }
    }
    
    # Check for sensitive files that shouldn't be committed
    $sensitiveFiles = @(".env", ".env.local", "*.key", "*.pem", "secrets.json")
    
    foreach ($pattern in $sensitiveFiles) {
        $files = Get-ChildItem -Recurse -Include $pattern | Where-Object { $_.FullName -notmatch "node_modules" }
        if ($files -and $pattern -ne ".env.local") {
            Add-HealthIssue "Sensitive file found: $($files[0].Name)" "High" "Add to .gitignore"
        }
    }
    
    # Check .gitignore
    if (Test-Path ".gitignore") {
        $gitignoreContent = Get-Content ".gitignore" -Raw
        $requiredIgnores = @(".env.local", "node_modules", ".next", "*.log")
        
        foreach ($ignore in $requiredIgnores) {
            if ($gitignoreContent -notmatch [regex]::Escape($ignore)) {
                Add-HealthIssue ".gitignore missing: $ignore" "Medium" "Add '$ignore' to .gitignore"
            }
        }
    }
}

function Check-Performance {
    Write-Host "`n⚡ Checking Performance..." -ForegroundColor Cyan
    
    # Check bundle size
    if (Test-Path ".next") {
        $nextSize = (Get-ChildItem -Recurse ".next" | Measure-Object -Property Length -Sum).Sum
        $nextSizeMB = [math]::Round($nextSize / 1MB, 2)
        
        if ($nextSizeMB -gt 100) {
            Add-HealthIssue "Large build size: ${nextSizeMB}MB" "Medium" "Optimize bundle size"
        } else {
            Write-Host "✅ Build size: ${nextSizeMB}MB (acceptable)" -ForegroundColor Green
        }
    }
    
    # Check for large image files
    $imageFiles = Get-ChildItem -Recurse -Include "*.jpg", "*.png", "*.gif", "*.svg" | Where-Object { $_.FullName -notmatch "node_modules" }
    
    foreach ($img in $imageFiles) {
        $sizeMB = [math]::Round($img.Length / 1MB, 2)
        if ($sizeMB -gt 1) {
            Add-HealthIssue "Large image file: $($img.Name) (${sizeMB}MB)" "Low" "Optimize image size"
        }
    }
    
    # Check for unused dependencies
    try {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        $dependencies = $packageJson.dependencies.PSObject.Properties.Name
        
        Add-Recommendation "Consider using 'npm audit' to check for vulnerabilities"
        Add-Recommendation "Use 'npx depcheck' to find unused dependencies"
        
    } catch {
        Add-HealthIssue "Error reading package.json" "High"
    }
}

function Check-AI-Implementation {
    Write-Host "`n🤖 Checking AI Implementation..." -ForegroundColor Cyan
    
    $aiFiles = @{
        "src/lib/ai/SmartAIRouter.ts" = "Smart AI routing logic"
        "src/lib/ai/CostTracker.ts" = "Cost tracking system"
        "src/types/ai.ts" = "AI type definitions"
        "src/app/api/ai/route.ts" = "AI API endpoint"
    }
    
    foreach ($file in $aiFiles.GetEnumerator()) {
        if (Test-Path $file.Key) {
            Write-Host "✅ $($file.Value)" -ForegroundColor Green
            
            # Check file content for completeness
            $content = Get-Content $file.Key -Raw
            
            if ($file.Key -eq "src/lib/ai/SmartAIRouter.ts") {
                if ($content -match "routeRequest.*technical.*psychology") {
                    Write-Host "  ✅ Routing logic implemented" -ForegroundColor Green
                } else {
                    Add-HealthIssue "AI routing logic incomplete" "High"
                }
                
                if ($content -match "calculateCost") {
                    Write-Host "  ✅ Cost calculation implemented" -ForegroundColor Green
                } else {
                    Add-HealthIssue "Cost calculation missing" "High"
                }
            }
            
            if ($file.Key -eq "src/lib/ai/CostTracker.ts") {
                if ($content -match "COST_LIMIT.*150") {
                    Write-Host "  ✅ Budget limits configured" -ForegroundColor Green
                } else {
                    Add-HealthIssue "Budget limits not properly configured" "Medium"
                }
            }
            
        } else {
            Add-HealthIssue "Missing AI file: $($file.Key)" "Critical" "Implement $($file.Value)"
            Write-Host "❌ $($file.Value) - Missing" -ForegroundColor Red
        }
    }
}

function Apply-Fixes {
    Write-Host "`n🔧 Applying Automatic Fixes..." -ForegroundColor Cyan
    
    $fixableIssues = $global:HealthIssues | Where-Object { $_.Fix -and $_.Severity -ne "Critical" }
    
    foreach ($issue in $fixableIssues) {
        Write-Host "Fixing: $($issue.Issue)" -ForegroundColor Yellow
        
        try {
            # Apply basic fixes
            if ($issue.Fix -match "mkdir '(.+)'") {
                $dir = $matches[1]
                New-Item -ItemType Directory -Path $dir -Force | Out-Null
                Write-Host "  ✅ Created directory: $dir" -ForegroundColor Green
            }
            elseif ($issue.Fix -match "Add '(.+)' to \.gitignore") {
                $entry = $matches[1]
                Add-Content -Path ".gitignore" -Value "`n$entry"
                Write-Host "  ✅ Added to .gitignore: $entry" -ForegroundColor Green
            }
        } catch {
            Write-Host "  ❌ Failed to fix: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

function Show-HealthReport {
    Write-Host "`n" + "="*70 -ForegroundColor Cyan
    Write-Host "🏥 PROJECT HEALTH REPORT" -ForegroundColor Cyan
    Write-Host "="*70 -ForegroundColor Cyan
    
    $criticalIssues = $global:HealthIssues | Where-Object { $_.Severity -eq "Critical" }
    $highIssues = $global:HealthIssues | Where-Object { $_.Severity -eq "High" }
    $mediumIssues = $global:HealthIssues | Where-Object { $_.Severity -eq "Medium" }
    $lowIssues = $global:HealthIssues | Where-Object { $_.Severity -eq "Low" }
    
    Write-Host "Critical Issues: $($criticalIssues.Count)" -ForegroundColor Red
    Write-Host "High Priority: $($highIssues.Count)" -ForegroundColor $(if($highIssues.Count -gt 0){"Red"}else{"Green"})
    Write-Host "Medium Priority: $($mediumIssues.Count)" -ForegroundColor $(if($mediumIssues.Count -gt 0){"Yellow"}else{"Green"})
    Write-Host "Low Priority: $($lowIssues.Count)" -ForegroundColor $(if($lowIssues.Count -gt 0){"Yellow"}else{"Green"})
    
    if ($criticalIssues.Count -gt 0) {
        Write-Host "`n🚨 CRITICAL ISSUES (Must Fix Before Launch):" -ForegroundColor Red
        foreach ($issue in $criticalIssues) {
            Write-Host "  • $($issue.Issue)" -ForegroundColor Red
            if ($issue.Fix) {
                Write-Host "    Fix: $($issue.Fix)" -ForegroundColor Gray
            }
        }
    }
    
    if ($highIssues.Count -gt 0 -and $Detailed) {
        Write-Host "`n⚠️ HIGH PRIORITY ISSUES:" -ForegroundColor Yellow
        foreach ($issue in $highIssues) {
            Write-Host "  • $($issue.Issue)" -ForegroundColor Yellow
            if ($issue.Fix) {
                Write-Host "    Fix: $($issue.Fix)" -ForegroundColor Gray
            }
        }
    }
    
    if ($global:Recommendations.Count -gt 0) {
        Write-Host "`n💡 RECOMMENDATIONS:" -ForegroundColor Cyan
        foreach ($rec in $global:Recommendations) {
            Write-Host "  • $rec" -ForegroundColor Cyan
        }
    }
    
    # Overall health score
    $totalIssues = $global:HealthIssues.Count
    $healthScore = if ($totalIssues -eq 0) { 100 } else {
        $weightedScore = 100 - ($criticalIssues.Count * 40) - ($highIssues.Count * 20) - ($mediumIssues.Count * 10) - ($lowIssues.Count * 5)
        [Math]::Max(0, $weightedScore)
    }
    
    $healthColor = if ($healthScore -ge 90) { "Green" } elseif ($healthScore -ge 70) { "Yellow" } else { "Red" }
    Write-Host "`n🎯 Overall Health Score: $healthScore%" -ForegroundColor $healthColor
    
    if ($healthScore -ge 90) {
        Write-Host "🎉 Excellent! Project is ready for production." -ForegroundColor Green
    } elseif ($healthScore -ge 70) {
        Write-Host "⚠️ Good, but some improvements needed." -ForegroundColor Yellow
    } else {
        Write-Host "❌ Poor health. Critical fixes required." -ForegroundColor Red
    }
    
    Write-Host "`n" + "="*70 -ForegroundColor Cyan
}

# Main execution
Write-Host "🏥 EdgeToEquity Project Health Check" -ForegroundColor Green
Write-Host "Senior Developer Edition - Comprehensive Analysis" -ForegroundColor Yellow
Write-Host "="*70 -ForegroundColor Cyan

Check-ProjectStructure
Check-CodeQuality
Check-Security
Check-Performance
Check-AI-Implementation

if ($Fix) {
    Apply-Fixes
}

Show-HealthReport

# Create health report file
$healthReport = @{
    Timestamp = Get-Date
    HealthScore = if ($global:HealthIssues.Count -eq 0) { 100 } else {
        $criticalCount = ($global:HealthIssues | Where-Object { $_.Severity -eq "Critical" }).Count
        $highCount = ($global:HealthIssues | Where-Object { $_.Severity -eq "High" }).Count
        $mediumCount = ($global:HealthIssues | Where-Object { $_.Severity -eq "Medium" }).Count
        $lowCount = ($global:HealthIssues | Where-Object { $_.Severity -eq "Low" }).Count
        
        $weightedScore = 100 - ($criticalCount * 40) - ($highCount * 20) - ($mediumCount * 10) - ($lowCount * 5)
        [Math]::Max(0, $weightedScore)
    }
    Issues = $global:HealthIssues
    Recommendations = $global:Recommendations
}

try {
    $healthReport | ConvertTo-Json -Depth 10 | Out-File -FilePath "health-report.json" -Encoding UTF8
    Write-Host "`n💾 Health report saved to: health-report.json" -ForegroundColor Green
} catch {
    Write-Host "Failed to save health report: $($_.Exception.Message)" -ForegroundColor Red
}
