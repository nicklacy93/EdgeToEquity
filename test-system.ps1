# EdgeToEquity Comprehensive Testing Script
# Senior Developer Edition - Production Testing Suite

param(
    [string]$TestSuite = "all",
    [switch]$Verbose,
    [switch]$StopOnError,
    [string]$OutputFile = "test-results.json"
)

# Test results tracking
$global:TestResults = @{
    Total = 0
    Passed = 0
    Failed = 0
    Skipped = 0
    Errors = @()
    StartTime = Get-Date
    Tests = @()
}

function Write-TestResult {
    param(
        [string]$TestName,
        [string]$Status,
        [string]$Message = "",
        [object]$Details = $null
    )
    
    $color = switch($Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "SKIP" { "Yellow" }
        default { "White" }
    }
    
    $timestamp = (Get-Date).ToString("HH:mm:ss")
    Write-Host "[$timestamp] [$Status] $TestName" -ForegroundColor $color
    
    if ($Message -and $Verbose) {
        Write-Host "    └─ $Message" -ForegroundColor Gray
    }
    
    # Track results
    $global:TestResults.Total++
    switch($Status) {
        "PASS" { $global:TestResults.Passed++ }
        "FAIL" { 
            $global:TestResults.Failed++
            $global:TestResults.Errors += @{
                Test = $TestName
                Message = $Message
                Details = $Details
                Timestamp = Get-Date
            }
        }
        "SKIP" { $global:TestResults.Skipped++ }
    }
    
    $global:TestResults.Tests += @{
        Name = $TestName
        Status = $Status
        Message = $Message
        Details = $Details
        Timestamp = Get-Date
    }
    
    if ($StopOnError -and $Status -eq "FAIL") {
        Write-Host "Stopping on error as requested" -ForegroundColor Red
        Save-TestResults
        exit 1
    }
}

function Test-Prerequisites {
    Write-Host "`n🔍 Testing Prerequisites..." -ForegroundColor Cyan
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-TestResult "Node.js Installation" "PASS" "Version: $nodeVersion"
        } else {
            Write-TestResult "Node.js Installation" "FAIL" "Node.js not found"
        }
    } catch {
        Write-TestResult "Node.js Installation" "FAIL" "Error checking Node.js: $($_.Exception.Message)"
    }
    
    # Check npm
    try {
        $npmVersion = npm --version 2>$null
        if ($npmVersion) {
            Write-TestResult "npm Installation" "PASS" "Version: $npmVersion"
        } else {
            Write-TestResult "npm Installation" "FAIL" "npm not found"
        }
    } catch {
        Write-TestResult "npm Installation" "FAIL" "Error checking npm: $($_.Exception.Message)"
    }
    
    # Check project files
    $requiredFiles = @(
        "package.json",
        "src/app/layout.tsx",
        "src/app/page.tsx",
        ".env.local"
    )
    
    foreach ($file in $requiredFiles) {
        if (Test-Path $file) {
            Write-TestResult "Required File: $file" "PASS"
        } else {
            Write-TestResult "Required File: $file" "FAIL" "File not found"
        }
    }
    
    # Check directories
    $requiredDirs = @(
        "src/lib/ai",
        "src/components/chat",
        "src/components/analytics",
        "src/app/api/ai",
        "data"
    )
    
    foreach ($dir in $requiredDirs) {
        if (Test-Path $dir) {
            Write-TestResult "Required Directory: $dir" "PASS"
        } else {
            Write-TestResult "Required Directory: $dir" "FAIL" "Directory not found"
        }
    }
}

function Test-Dependencies {
    Write-Host "`n📦 Testing Dependencies..." -ForegroundColor Cyan
    
    # Check if node_modules exists
    if (Test-Path "node_modules") {
        Write-TestResult "node_modules Directory" "PASS"
    } else {
        Write-TestResult "node_modules Directory" "FAIL" "Run 'npm install' first"
        return
    }
    
    # Check critical dependencies
    $criticalDeps = @("openai", "@anthropic-ai/sdk", "next", "react")
    
    try {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        $dependencies = $packageJson.dependencies
        
        foreach ($dep in $criticalDeps) {
            if ($dependencies.$dep) {
                Write-TestResult "Dependency: $dep" "PASS" "Version: $($dependencies.$dep)"
            } else {
                Write-TestResult "Dependency: $dep" "FAIL" "Not found in package.json"
            }
        }
    } catch {
        Write-TestResult "Package.json Analysis" "FAIL" "Error reading package.json: $($_.Exception.Message)"
    }
}

function Test-Environment {
    Write-Host "`n🔑 Testing Environment Configuration..." -ForegroundColor Cyan
    
    if (-not (Test-Path ".env.local")) {
        Write-TestResult "Environment File" "FAIL" ".env.local not found"
        return
    }
    
    try {
        $envContent = Get-Content ".env.local" -Raw
        
        # Check for required environment variables
        $requiredVars = @("OPENAI_API_KEY", "ANTHROPIC_API_KEY")
        
        foreach ($var in $requiredVars) {
            if ($envContent -match "$var=.+") {
                $value = ($envContent | Select-String "$var=(.+)").Matches[0].Groups[1].Value.Trim()
                if ($value -and $value -ne "your_${var}_here") {
                    Write-TestResult "Environment Variable: $var" "PASS" "Configured"
                } else {
                    Write-TestResult "Environment Variable: $var" "FAIL" "Not configured"
                }
            } else {
                Write-TestResult "Environment Variable: $var" "FAIL" "Not found"
            }
        }
    } catch {
        Write-TestResult "Environment Analysis" "FAIL" "Error reading .env.local: $($_.Exception.Message)"
    }
}

function Test-BuildProcess {
    Write-Host "`n🔨 Testing Build Process..." -ForegroundColor Cyan
    
    try {
        Write-Host "Running 'npm run build' (this may take a moment)..." -ForegroundColor Yellow
        $buildOutput = npm run build 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-TestResult "Production Build" "PASS" "Build completed successfully"
        } else {
            Write-TestResult "Production Build" "FAIL" "Build failed" -Details $buildOutput
        }
    } catch {
        Write-TestResult "Production Build" "FAIL" "Error running build: $($_.Exception.Message)"
    }
}

function Test-AIRouting {
    Write-Host "`n🤖 Testing AI Routing Logic..." -ForegroundColor Cyan
    
    # This is a static analysis test - we'll test the routing logic
    $routerFile = "src/lib/ai/SmartAIRouter.ts"
    
    if (Test-Path $routerFile) {
        Write-TestResult "AI Router File" "PASS"
        
        try {
            $routerContent = Get-Content $routerFile -Raw
            
            # Check for key routing logic components
            $routingChecks = @{
                "Technical Keywords" = "technical.*chart.*indicator.*strategy"
                "Psychology Keywords" = "psychology.*emotion.*mindset.*discipline"
                "OpenAI Provider" = "openai.*gpt-4o-mini"
                "Claude Provider" = "claude.*claude-3-5-sonnet"
                "Cost Calculation" = "calculateCost.*inputTokens.*outputTokens"
            }
            
            foreach ($check in $routingChecks.GetEnumerator()) {
                if ($routerContent -match $check.Value) {
                    Write-TestResult "Routing Logic: $($check.Key)" "PASS"
                } else {
                    Write-TestResult "Routing Logic: $($check.Key)" "FAIL" "Pattern not found"
                }
            }
        } catch {
            Write-TestResult "AI Router Analysis" "FAIL" "Error analyzing router: $($_.Exception.Message)"
        }
    } else {
        Write-TestResult "AI Router File" "FAIL" "SmartAIRouter.ts not found"
    }
}

function Test-DatabaseStructure {
    Write-Host "`n🗄️ Testing Database Structure..." -ForegroundColor Cyan
    
    $dataFile = "data/usage.json"
    
    if (Test-Path $dataFile) {
        Write-TestResult "Usage Data File" "PASS"
        
        try {
            $dataContent = Get-Content $dataFile -Raw | ConvertFrom-Json
            if ($dataContent -is [array]) {
                Write-TestResult "Data Structure" "PASS" "Valid JSON array"
            } else {
                Write-TestResult "Data Structure" "FAIL" "Invalid structure"
            }
        } catch {
            Write-TestResult "Data Structure" "FAIL" "Invalid JSON: $($_.Exception.Message)"
        }
    } else {
        Write-TestResult "Usage Data File" "FAIL" "data/usage.json not found"
    }
}

function Save-TestResults {
    try {
        $global:TestResults.EndTime = Get-Date
        $global:TestResults.Duration = ($global:TestResults.EndTime - $global:TestResults.StartTime).TotalSeconds
        $global:TestResults | ConvertTo-Json -Depth 10 | Out-File -FilePath $OutputFile -Encoding UTF8
        Write-Host "`n💾 Test results saved to: $OutputFile" -ForegroundColor Green
    } catch {
        Write-Host "Failed to save test results: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Show-TestSummary {
    $results = $global:TestResults
    
    Write-Host "`n" + "="*60 -ForegroundColor Cyan
    Write-Host "🧪 TEST SUMMARY" -ForegroundColor Cyan
    Write-Host "="*60 -ForegroundColor Cyan
    
    Write-Host "Total Tests: $($results.Total)" -ForegroundColor White
    Write-Host "Passed: $($results.Passed)" -ForegroundColor Green
    Write-Host "Failed: $($results.Failed)" -ForegroundColor Red
    Write-Host "Skipped: $($results.Skipped)" -ForegroundColor Yellow
    Write-Host "Duration: $([math]::Round($results.Duration, 2)) seconds" -ForegroundColor White
    
    $passRate = if ($results.Total -gt 0) { [math]::Round(($results.Passed / $results.Total) * 100, 1) } else { 0 }
    Write-Host "Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 90) { "Green" } elseif ($passRate -ge 70) { "Yellow" } else { "Red" })
    
    if ($results.Failed -gt 0) {
        Write-Host "`n❌ FAILED TESTS:" -ForegroundColor Red
        foreach ($error in $results.Errors) {
            Write-Host "  • $($error.Test): $($error.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "`n" + "="*60 -ForegroundColor Cyan
    
    if ($results.Failed -eq 0) {
        Write-Host "🎉 All tests passed! System ready for deployment." -ForegroundColor Green
    } elseif ($results.Failed -le 2) {
        Write-Host "⚠️ Minor issues found. Review and fix before deployment." -ForegroundColor Yellow
    } else {
        Write-Host "❌ Critical issues found. Fix required before deployment." -ForegroundColor Red
    }
}

# Main execution
Write-Host "🧪 EdgeToEquity Comprehensive Testing Suite" -ForegroundColor Green
Write-Host "Senior Developer Edition - Production Testing" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

Write-Host "Test Suite: $TestSuite" -ForegroundColor White
Write-Host "Verbose Mode: $Verbose" -ForegroundColor White
Write-Host "Stop on Error: $StopOnError" -ForegroundColor White
Write-Host "Output File: $OutputFile" -ForegroundColor White

# Run test suites based on parameter
switch ($TestSuite.ToLower()) {
    "prerequisites" { Test-Prerequisites }
    "dependencies" { Test-Dependencies }
    "environment" { Test-Environment }
    "build" { Test-BuildProcess }
    "ai" { Test-AIRouting }
    "database" { Test-DatabaseStructure }
    "all" {
        Test-Prerequisites
        Test-Dependencies
        Test-Environment
        Test-AIRouting
        Test-DatabaseStructure
        if ($global:TestResults.Failed -eq 0) {
            Test-BuildProcess
        } else {
            Write-TestResult "Build Process" "SKIP" "Skipped due to previous failures"
        }
    }
    default {
        Write-Host "Unknown test suite: $TestSuite" -ForegroundColor Red
        Write-Host "Available suites: prerequisites, dependencies, environment, build, ai, database, all" -ForegroundColor Yellow
        exit 1
    }
}

Show-TestSummary
Save-TestResults

# Exit with appropriate code
exit $(if ($global:TestResults.Failed -gt 0) { 1 } else { 0 })
