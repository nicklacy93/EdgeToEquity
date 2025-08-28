# EdgeToEquity Master Testing Orchestrator
# Senior Developer Edition - Complete Testing Pipeline

param(
    [switch]$Quick,
    [switch]$Full,
    [switch]$Production,
    [switch]$ContinuousIntegration,
    [string]$ReportFormat = "console"
)

$global:MasterResults = @{
    StartTime = Get-Date
    TestSuites = @()
    OverallStatus = "UNKNOWN"
    CriticalIssues = @()
    Recommendations = @()
}

function Write-MasterLog {
    param([string]$Message, [string]$Level = "Info")
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $color = switch($Level) {
        "Success" { "Green" }
        "Warning" { "Yellow" }
        "Error" { "Red" }
        "Critical" { "Magenta" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

function Invoke-TestSuite {
    param(
        [string]$SuiteName,
        [string]$ScriptPath,
        [string[]]$Arguments = @(),
        [bool]$Required = $true
    )
    
    Write-MasterLog "Starting test suite: $SuiteName" "Info"
    
    if (-not (Test-Path $ScriptPath)) {
        Write-MasterLog "Test script not found: $ScriptPath" "Error"
        $global:MasterResults.TestSuites += @{
            Name = $SuiteName
            Status = "MISSING"
            Script = $ScriptPath
            StartTime = Get-Date
            EndTime = Get-Date
            Duration = 0
        }
        return $false
    }
    
    try {
        $startTime = Get-Date
        $process = Start-Process -FilePath "powershell.exe" -ArgumentList @("-File", $ScriptPath) + $Arguments -PassThru -Wait -WindowStyle Hidden
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds
        
        $status = if ($process.ExitCode -eq 0) { "PASS" } else { "FAIL" }
        $level = if ($status -eq "PASS") { "Success" } else { if ($Required) { "Error" } else { "Warning" } }
        
        Write-MasterLog "Test suite '$SuiteName' completed: $status (${duration}s)" $level
        
        $global:MasterResults.TestSuites += @{
            Name = $SuiteName
            Status = $status
            Script = $ScriptPath
            StartTime = $startTime
            EndTime = $endTime
            Duration = $duration
            ExitCode = $process.ExitCode
            Required = $Required
        }
        
        return $status -eq "PASS"
        
    } catch {
        Write-MasterLog "Test suite '$SuiteName' failed with exception: $($_.Exception.Message)" "Error"
        $global:MasterResults.TestSuites += @{
            Name = $SuiteName
            Status = "ERROR"
            Script = $ScriptPath
            Error = $_.Exception.Message
            Required = $Required
        }
        return $false
    }
}

function Test-Prerequisites {
    Write-MasterLog "Checking prerequisites..." "Info"
    
    # Check PowerShell version
    $psVersion = $PSVersionTable.PSVersion
    if ($psVersion.Major -lt 5) {
        Write-MasterLog "PowerShell version too old: $psVersion (require 5.0+)" "Critical"
        return $false
    }
    
    # Check required commands
    $requiredCommands = @("node", "npm", "git")
    foreach ($cmd in $requiredCommands) {
        try {
            $null = Get-Command $cmd -ErrorAction Stop
            Write-MasterLog "✅ $cmd command available" "Success"
        } catch {
            Write-MasterLog "❌ $cmd command not found" "Critical"
            return $false
        }
    }
    
    # Check project structure
    if (-not (Test-Path "package.json")) {
        Write-MasterLog "Not in a valid Node.js project directory" "Critical"
        return $false
    }
    
    Write-MasterLog "Prerequisites check passed" "Success"
    return $true
}

function Run-QuickTests {
    Write-MasterLog "Running Quick Test Suite..." "Info"
    
    $success = $true
    
    # Environment setup and validation
    $success = $success -and (Invoke-TestSuite "Environment Setup" "setup-env.ps1" @("-Validate") $true)
    
    # Basic system tests
    $success = $success -and (Invoke-TestSuite "System Tests" "test-system.ps1" @("-TestSuite", "prerequisites") $true)
    $success = $success -and (Invoke-TestSuite "Dependency Check" "test-system.ps1" @("-TestSuite", "dependencies") $true)
    $success = $success -and (Invoke-TestSuite "Environment Check" "test-system.ps1" @("-TestSuite", "environment") $true)
    
    # Project health check
    $success = $success -and (Invoke-TestSuite "Health Check" "health-check.ps1" @() $false)
    
    return $success
}

function Run-FullTests {
    Write-MasterLog "Running Full Test Suite..." "Info"
    
    $success = $true
    
    # Run quick tests first
    $success = Run-QuickTests
    
    if (-not $success) {
        Write-MasterLog "Quick tests failed, skipping advanced tests" "Warning"
        return $false
    }
    
    # Advanced system tests
    $success = $success -and (Invoke-TestSuite "AI Implementation" "test-system.ps1" @("-TestSuite", "ai") $true)
    $success = $success -and (Invoke-TestSuite "Database Structure" "test-system.ps1" @("-TestSuite", "database") $true)
    
    # Build process
    $success = $success -and (Invoke-TestSuite "Build Process" "test-system.ps1" @("-TestSuite", "build") $true)
    
    # Live testing (requires development server)
    Write-MasterLog "Starting development server for live tests..." "Info"
    $devServer = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
    
    Start-Sleep -Seconds 10  # Wait for server to start
    
    try {
        $success = $success -and (Invoke-TestSuite "API Connectivity" "live-test.ps1" @("-APITest") $true)
        $success = $success -and (Invoke-TestSuite "AI Routing" "live-test.ps1" @("-RoutingTest") $true)
        $success = $success -and (Invoke-TestSuite "Cost Tracking" "live-test.ps1" @("-CostTest") $true)
        $success = $success -and (Invoke-TestSuite "Load Performance" "live-test.ps1" @("-LoadTest") $false)
    } finally {
        # Clean up development server
        if ($devServer -and -not $devServer.HasExited) {
            $devServer.Kill()
            Write-MasterLog "Development server stopped" "Info"
        }
    }
    
    return $success
}

function Run-ProductionTests {
    Write-MasterLog "Running Production Readiness Tests..." "Info"
    
    $success = $true
    
    # Run full tests first
    $success = Run-FullTests
    
    if (-not $success) {
        Write-MasterLog "Full tests failed, not ready for production" "Critical"
        return $false
    }
    
    # Production-specific checks
    $success = $success -and (Invoke-TestSuite "Security Audit" "debug-system.ps1" @("-Network") $true)
    $success = $success -and (Invoke-TestSuite "Performance Audit" "debug-system.ps1" @("-Performance") $true)
    $success = $success -and (Invoke-TestSuite "Memory Analysis" "debug-system.ps1" @("-Memory") $false)
    
    # Advanced health check with fixes
    $success = $success -and (Invoke-TestSuite "Production Health" "health-check.ps1" @("-Fix", "-Detailed") $true)
    
    return $success
}

function Generate-TestReport {
    Write-MasterLog "Generating test report..." "Info"
    
    $totalDuration = ((Get-Date) - $global:MasterResults.StartTime).TotalSeconds
    $passedSuites = ($global:MasterResults.TestSuites | Where-Object { $_.Status -eq "PASS" }).Count
    $totalSuites = $global:MasterResults.TestSuites.Count
    $passRate = if ($totalSuites -gt 0) { [math]::Round(($passedSuites / $totalSuites) * 100, 1) } else { 0 }
    
    # Determine overall status
    $criticalFailures = ($global:MasterResults.TestSuites | Where-Object { $_.Status -ne "PASS" -and $_.Required }).Count
    $global:MasterResults.OverallStatus = if ($criticalFailures -eq 0) { "READY" } elseif ($passRate -ge 80) { "CAUTION" } else { "NOT_READY" }
    
    Write-Host "`n" + "="*80 -ForegroundColor Cyan
    Write-Host "🎯 EDGETOEQUITY MASTER TEST REPORT" -ForegroundColor Cyan
    Write-Host "="*80 -ForegroundColor Cyan
    
    Write-Host "Overall Status: $($global:MasterResults.OverallStatus)" -ForegroundColor $(
        switch($global:MasterResults.OverallStatus) {
            "READY" { "Green" }
            "CAUTION" { "Yellow" }
            "NOT_READY" { "Red" }
            default { "White" }
        }
    )
    
    Write-Host "Test Duration: $([math]::Round($totalDuration, 2)) seconds" -ForegroundColor White
    Write-Host "Test Suites: $passedSuites/$totalSuites passed ($passRate%)" -ForegroundColor White
    Write-Host "Critical Failures: $criticalFailures" -ForegroundColor $(if ($criticalFailures -eq 0) { "Green" } else { "Red" })
    
    Write-Host "`n📊 Test Suite Results:" -ForegroundColor Cyan
    foreach ($suite in $global:MasterResults.TestSuites) {
        $statusIcon = switch($suite.Status) {
            "PASS" { "✅" }
            "FAIL" { "❌" }
            "ERROR" { "🔥" }
            "MISSING" { "❓" }
            default { "⚠️" }
        }
        
        $requiredText = if ($suite.Required) { " (Required)" } else { " (Optional)" }
        $durationText = if ($suite.Duration) { " ($([math]::Round($suite.Duration, 1))s)" } else { "" }
        
        Write-Host "  $statusIcon $($suite.Name)$requiredText$durationText" -ForegroundColor White
        
        if ($suite.Error) {
            Write-Host "      Error: $($suite.Error)" -ForegroundColor Red
        }
    }
    
    # Production readiness assessment
    Write-Host "`n🚀 Production Readiness Assessment:" -ForegroundColor Cyan
    switch($global:MasterResults.OverallStatus) {
        "READY" {
            Write-Host "✅ READY FOR PRODUCTION DEPLOYMENT" -ForegroundColor Green
            Write-Host "   All critical tests passed. System is stable and secure." -ForegroundColor Green
        }
        "CAUTION" {
            Write-Host "⚠️ PROCEED WITH CAUTION" -ForegroundColor Yellow
            Write-Host "   Most tests passed but some issues detected. Review failures." -ForegroundColor Yellow
        }
        "NOT_READY" {
            Write-Host "❌ NOT READY FOR PRODUCTION" -ForegroundColor Red
            Write-Host "   Critical failures detected. Fix issues before deployment." -ForegroundColor Red
        }
    }
    
    Write-Host "`n" + "="*80 -ForegroundColor Cyan
    
    # Save detailed report
    try {
        $reportData = @{
            Timestamp = Get-Date
            OverallStatus = $global:MasterResults.OverallStatus
            Duration = $totalDuration
            PassRate = $passRate
            TestSuites = $global:MasterResults.TestSuites
            CriticalFailures = $criticalFailures
        }
        
        $reportData | ConvertTo-Json -Depth 10 | Out-File -FilePath "master-test-report.json" -Encoding UTF8
        Write-MasterLog "Detailed report saved to: master-test-report.json" "Success"
    } catch {
        Write-MasterLog "Failed to save detailed report: $($_.Exception.Message)" "Warning"
    }
}

# Main execution
Write-Host "🎯 EdgeToEquity Master Testing Orchestrator" -ForegroundColor Green
Write-Host "Senior Developer Edition - Complete Testing Pipeline" -ForegroundColor Yellow
Write-Host "="*80 -ForegroundColor Cyan

if (-not (Test-Prerequisites)) {
    Write-MasterLog "Prerequisites check failed. Cannot continue." "Critical"
    exit 1
}

$testSuccess = $false

try {
    if ($Quick) {
        Write-MasterLog "Running QUICK test mode" "Info"
        $testSuccess = Run-QuickTests
    } elseif ($Full) {
        Write-MasterLog "Running FULL test mode" "Info"
        $testSuccess = Run-FullTests
    } elseif ($Production) {
        Write-MasterLog "Running PRODUCTION READINESS test mode" "Info"
        $testSuccess = Run-ProductionTests
    } elseif ($ContinuousIntegration) {
        Write-MasterLog "Running CONTINUOUS INTEGRATION test mode" "Info"
        $testSuccess = Run-FullTests  # CI uses full test suite
    } else {
        Write-Host "`nUsage: .\master-test.ps1 [-Quick] [-Full] [-Production] [-ContinuousIntegration]" -ForegroundColor Yellow
        Write-Host "  -Quick: Basic functionality tests (5-10 minutes)" -ForegroundColor Gray
        Write-Host "  -Full: Comprehensive testing suite (15-20 minutes)" -ForegroundColor Gray
        Write-Host "  -Production: Complete production readiness (20-30 minutes)" -ForegroundColor Gray
        Write-Host "  -ContinuousIntegration: Automated CI/CD testing" -ForegroundColor Gray
        exit 1
    }
} catch {
    Write-MasterLog "Master test execution failed: $($_.Exception.Message)" "Critical"
    $testSuccess = $false
} finally {
    Generate-TestReport
}

# Exit with appropriate code for CI/CD
$exitCode = if ($testSuccess) { 0 } else { 1 }
Write-MasterLog "Master testing completed with exit code: $exitCode" $(if ($testSuccess) { "Success" } else { "Error" })

exit $exitCode
