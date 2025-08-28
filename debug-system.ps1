# EdgeToEquity Advanced Debugging Script
# Senior Developer Edition - Deep System Analysis

param(
    [switch]$Network,
    [switch]$Performance,
    [switch]$Memory,
    [switch]$Logs,
    [switch]$All
)

function Test-APIConnectivity {
    Write-Host "`n🌐 Testing API Connectivity..." -ForegroundColor Cyan
    
    # Test OpenAI API
    try {
        Write-Host "Testing OpenAI API..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/models" -Headers @{
            "Authorization" = "Bearer $($(Get-Content .env.local | Select-String 'OPENAI_API_KEY=(.+)').Matches[0].Groups[1].Value)"
        } -TimeoutSec 10
        
        Write-Host "✅ OpenAI API: Connected" -ForegroundColor Green
        Write-Host "   Available models: $($response.data.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ OpenAI API: Failed - $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test Anthropic API
    try {
        Write-Host "Testing Anthropic API..." -ForegroundColor Yellow
        $headers = @{
            "x-api-key" = "$($(Get-Content .env.local | Select-String 'ANTHROPIC_API_KEY=(.+)').Matches[0].Groups[1].Value)"
            "anthropic-version" = "2023-06-01"
            "content-type" = "application/json"
        }
        
        $body = @{
            model = "claude-3-5-sonnet-20241022"
            max_tokens = 10
            messages = @(@{
                role = "user"
                content = "Hello"
            })
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "https://api.anthropic.com/v1/messages" -Method POST -Headers $headers -Body $body -TimeoutSec 10
        Write-Host "✅ Anthropic API: Connected" -ForegroundColor Green
    } catch {
        Write-Host "❌ Anthropic API: Failed - $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Test-Performance {
    Write-Host "`n⚡ Performance Analysis..." -ForegroundColor Cyan
    
    # Test development server startup time
    $startTime = Get-Date
    Write-Host "Starting development server..." -ForegroundColor Yellow
    
    $devServer = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
    
    # Wait for server to be ready (check localhost:3000)
    $timeout = 30
    $elapsed = 0
    $serverReady = $false
    
    while ($elapsed -lt $timeout -and -not $serverReady) {
        Start-Sleep -Seconds 1
        $elapsed++
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                $serverReady = $true
                $startupTime = (Get-Date) - $startTime
                Write-Host "✅ Server ready in $([math]::Round($startupTime.TotalSeconds, 2)) seconds" -ForegroundColor Green
            }
        } catch {
            # Server not ready yet
        }
    }
    
    if (-not $serverReady) {
        Write-Host "❌ Server failed to start within $timeout seconds" -ForegroundColor Red
    }
    
    # Clean up
    if ($devServer -and -not $devServer.HasExited) {
        $devServer.Kill()
        Write-Host "🧹 Development server stopped" -ForegroundColor Gray
    }
}

function Test-Memory {
    Write-Host "`n🧠 Memory Usage Analysis..." -ForegroundColor Cyan
    
    # Get system memory info
    $memory = Get-WmiObject -Class Win32_ComputerSystem
    $totalMemory = [math]::Round($memory.TotalPhysicalMemory / 1GB, 2)
    
    Write-Host "Total System Memory: ${totalMemory}GB" -ForegroundColor White
    
    # Check Node.js processes
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    
    if ($nodeProcesses) {
        Write-Host "Active Node.js Processes:" -ForegroundColor Yellow
        foreach ($process in $nodeProcesses) {
            $memoryMB = [math]::Round($process.WorkingSet / 1MB, 2)
            Write-Host "  PID $($process.Id): ${memoryMB}MB" -ForegroundColor Gray
        }
    } else {
        Write-Host "No active Node.js processes found" -ForegroundColor Gray
    }
}

function Analyze-Logs {
    Write-Host "`n📝 Log Analysis..." -ForegroundColor Cyan
    
    # Check for common log files
    $logFiles = @(
        ".next/cache",
        "npm-debug.log",
        "yarn-error.log",
        "console.log"
    )
    
    foreach ($logFile in $logFiles) {
        if (Test-Path $logFile) {
            Write-Host "Found log file: $logFile" -ForegroundColor Yellow
            
            if ($logFile -match "\.log$") {
                $content = Get-Content $logFile -Tail 10
                Write-Host "Last 10 lines:" -ForegroundColor Gray
                $content | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
            }
        }
    }
    
    # Check .next build artifacts
    if (Test-Path ".next") {
        $nextSize = (Get-ChildItem -Recurse ".next" | Measure-Object -Property Length -Sum).Sum
        $nextSizeMB = [math]::Round($nextSize / 1MB, 2)
        Write-Host ".next directory size: ${nextSizeMB}MB" -ForegroundColor White
    }
}

# Main execution
Write-Host "🔍 EdgeToEquity Advanced Debugging" -ForegroundColor Green
Write-Host "Senior Developer Edition - Deep System Analysis" -ForegroundColor Yellow

if ($All -or $Network) { Test-APIConnectivity }
if ($All -or $Performance) { Test-Performance }
if ($All -or $Memory) { Test-Memory }
if ($All -or $Logs) { Analyze-Logs }

if (-not ($Network -or $Performance -or $Memory -or $Logs -or $All)) {
    Write-Host "`nUsage: .\debug-system.ps1 [-Network] [-Performance] [-Memory] [-Logs] [-All]" -ForegroundColor Yellow
    Write-Host "Use -All to run all diagnostic tests" -ForegroundColor Gray
}

Write-Host "`n🎯 Debugging complete!" -ForegroundColor Green
