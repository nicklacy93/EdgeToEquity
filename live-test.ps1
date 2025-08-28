# EdgeToEquity Live Testing Script
# Senior Developer Edition - Real-time API and System Testing

param(
    [switch]$APITest,
    [switch]$RoutingTest,
    [switch]$CostTest,
    [switch]$LoadTest,
    [switch]$All,
    [int]$Concurrent = 5,
    [string]$BaseUrl = "http://localhost:3000"
)

$global:TestResults = @{
    APITests = @()
    RoutingTests = @()
    CostTests = @()
    LoadTests = @()
    StartTime = Get-Date
}

function Write-LiveTestResult {
    param(
        [string]$TestName,
        [string]$Status,
        [string]$Message = "",
        [double]$ResponseTime = 0,
        [object]$Details = $null
    )
    
    $color = switch($Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "WARN" { "Yellow" }
        default { "White" }
    }
    
    $timestamp = (Get-Date).ToString("HH:mm:ss.fff")
    $rtText = if ($ResponseTime -gt 0) { " (${ResponseTime}ms)" } else { "" }
    
    Write-Host "[$timestamp] [$Status] $TestName$rtText" -ForegroundColor $color
    
    if ($Message) {
        Write-Host "    └─ $Message" -ForegroundColor Gray
    }
}

function Test-LiveAPIConnections {
    Write-Host "`n🌐 Testing Live API Connections..." -ForegroundColor Cyan
    
    # Get API keys from environment
    $envContent = Get-Content ".env.local" -Raw
    $openaiKey = ($envContent | Select-String "OPENAI_API_KEY=(.+)").Matches[0].Groups[1].Value.Trim()
    $anthropicKey = ($envContent | Select-String "ANTHROPIC_API_KEY=(.+)").Matches[0].Groups[1].Value.Trim()
    
    # Test OpenAI API with actual request
    try {
        $startTime = Get-Date
        
        $headers = @{
            "Authorization" = "Bearer $openaiKey"
            "Content-Type" = "application/json"
        }
        
        $body = @{
            model = "gpt-4o-mini"
            messages = @(@{
                role = "user"
                content = "Test message for API validation. Respond with 'API_TEST_SUCCESS'"
            })
            max_tokens = 10
        } | ConvertTo-Json -Depth 3
        
        $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" -Method POST -Headers $headers -Body $body -TimeoutSec 15
        $responseTime = ((Get-Date) - $startTime).TotalMilliseconds
        
        if ($response.choices[0].message.content -match "API_TEST_SUCCESS") {
            Write-LiveTestResult "OpenAI API Live Test" "PASS" "API responding correctly" $responseTime
            $global:TestResults.APITests += @{ Provider = "OpenAI"; Status = "PASS"; ResponseTime = $responseTime }
        } else {
            Write-LiveTestResult "OpenAI API Live Test" "WARN" "Unexpected response: $($response.choices[0].message.content)" $responseTime
        }
        
    } catch {
        Write-LiveTestResult "OpenAI API Live Test" "FAIL" "Error: $($_.Exception.Message)"
        $global:TestResults.APITests += @{ Provider = "OpenAI"; Status = "FAIL"; Error = $_.Exception.Message }
    }
    
    # Test Anthropic API with actual request
    try {
        $startTime = Get-Date
        
        $headers = @{
            "x-api-key" = $anthropicKey
            "anthropic-version" = "2023-06-01"
            "content-type" = "application/json"
        }
        
        $body = @{
            model = "claude-3-5-sonnet-20241022"
            max_tokens = 10
            messages = @(@{
                role = "user"
                content = "Test message for API validation. Respond with 'API_TEST_SUCCESS'"
            })
        } | ConvertTo-Json -Depth 3
        
        $response = Invoke-RestMethod -Uri "https://api.anthropic.com/v1/messages" -Method POST -Headers $headers -Body $body -TimeoutSec 15
        $responseTime = ((Get-Date) - $startTime).TotalMilliseconds
        
        if ($response.content[0].text -match "API_TEST_SUCCESS") {
            Write-LiveTestResult "Anthropic API Live Test" "PASS" "API responding correctly" $responseTime
            $global:TestResults.APITests += @{ Provider = "Anthropic"; Status = "PASS"; ResponseTime = $responseTime }
        } else {
            Write-LiveTestResult "Anthropic API Live Test" "WARN" "Unexpected response: $($response.content[0].text)" $responseTime
        }
        
    } catch {
        Write-LiveTestResult "Anthropic API Live Test" "FAIL" "Error: $($_.Exception.Message)"
        $global:TestResults.APITests += @{ Provider = "Anthropic"; Status = "FAIL"; Error = $_.Exception.Message }
    }
}

function Test-SmartRouting {
    Write-Host "`n🤖 Testing Smart AI Routing..." -ForegroundColor Cyan
    
    # Wait for development server
    Write-Host "Checking if development server is running..." -ForegroundColor Yellow
    
    try {
        $serverCheck = Invoke-WebRequest -Uri $BaseUrl -TimeoutSec 5 -UseBasicParsing
        Write-LiveTestResult "Development Server" "PASS" "Server is running"
    } catch {
        Write-LiveTestResult "Development Server" "FAIL" "Server not accessible at $BaseUrl"
        return
    }
    
    # Test routing scenarios
    $routingTests = @(
        @{
            Message = "What's the best RSI strategy for day trading?"
            ExpectedProvider = "openai"
            Type = "technical"
        },
        @{
            Message = "How do I control my emotions when losing money?"
            ExpectedProvider = "claude"
            Type = "psychology"
        },
        @{
            Message = "Can you explain what a moving average is?"
            ExpectedProvider = "claude"
            Type = "education"
        },
        @{
            Message = "Analyze EURUSD chart patterns"
            ExpectedProvider = "openai"
            Type = "technical"
        },
        @{
            Message = "I keep making impulsive trades. Help me build discipline."
            ExpectedProvider = "claude"
            Type = "psychology"
        }
    )
    
    foreach ($test in $routingTests) {
        try {
            $startTime = Get-Date
            $userId = "test_user_$(Get-Random)"
            
            $headers = @{
                "Content-Type" = "application/json"
            }
            
            $body = @{
                message = $test.Message
                userId = $userId
                requestType = $test.Type
            } | ConvertTo-Json
            
            $response = Invoke-RestMethod -Uri "$BaseUrl/api/ai" -Method POST -Headers $headers -Body $body -TimeoutSec 30
            $responseTime = ((Get-Date) - $startTime).TotalMilliseconds
            
            if ($response.provider -eq $test.ExpectedProvider) {
                Write-LiveTestResult "Routing: $($test.Type)" "PASS" "Correctly routed to $($response.provider)" $responseTime
                $global:TestResults.RoutingTests += @{ 
                    Type = $test.Type
                    Status = "PASS"
                    Expected = $test.ExpectedProvider
                    Actual = $response.provider
                    ResponseTime = $responseTime
                    Cost = $response.cost
                }
            } else {
                Write-LiveTestResult "Routing: $($test.Type)" "FAIL" "Expected $($test.ExpectedProvider), got $($response.provider)" $responseTime
                $global:TestResults.RoutingTests += @{ 
                    Type = $test.Type
                    Status = "FAIL"
                    Expected = $test.ExpectedProvider
                    Actual = $response.provider
                    ResponseTime = $responseTime
                }
            }
            
        } catch {
            Write-LiveTestResult "Routing: $($test.Type)" "FAIL" "API Error: $($_.Exception.Message)"
            $global:TestResults.RoutingTests += @{ 
                Type = $test.Type
                Status = "FAIL"
                Error = $_.Exception.Message
            }
        }
        
        # Small delay between tests
        Start-Sleep -Milliseconds 500
    }
}

function Test-CostTracking {
    Write-Host "`n💰 Testing Cost Tracking..." -ForegroundColor Cyan
    
    $userId = "cost_test_user_$(Get-Random)"
    $totalExpectedCost = 0
    
    # Send multiple requests to accumulate costs
    for ($i = 1; $i -le 3; $i++) {
        try {
            $headers = @{ "Content-Type" = "application/json" }
            $body = @{
                message = "Cost tracking test message #$i"
                userId = $userId
                requestType = "general"
            } | ConvertTo-Json
            
            $response = Invoke-RestMethod -Uri "$BaseUrl/api/ai" -Method POST -Headers $headers -Body $body -TimeoutSec 30
            $totalExpectedCost += $response.cost
            
            Write-LiveTestResult "Cost Tracking Request $i" "PASS" "Cost: `$([math]::Round($response.cost, 6))"
            
        } catch {
            Write-LiveTestResult "Cost Tracking Request $i" "FAIL" "Error: $($_.Exception.Message)"
        }
        
        Start-Sleep -Milliseconds 300
    }
    
    # Verify analytics endpoint
    try {
        $analyticsResponse = Invoke-RestMethod -Uri "$BaseUrl/api/ai?userId=$userId" -TimeoutSec 10
        $reportedCost = $analyticsResponse.userStats.totalCost
        
        $costDifference = [math]::Abs($totalExpectedCost - $reportedCost)
        
        if ($costDifference -lt 0.000001) {
            Write-LiveTestResult "Cost Accuracy" "PASS" "Expected: `$([math]::Round($totalExpectedCost, 6)), Reported: `$([math]::Round($reportedCost, 6))"
        } else {
            Write-LiveTestResult "Cost Accuracy" "FAIL" "Cost mismatch: Expected `$([math]::Round($totalExpectedCost, 6)), Reported `$([math]::Round($reportedCost, 6))"
        }
        
        $global:TestResults.CostTests += @{
            ExpectedCost = $totalExpectedCost
            ReportedCost = $reportedCost
            Accuracy = $costDifference -lt 0.000001
        }
        
    } catch {
        Write-LiveTestResult "Analytics Endpoint" "FAIL" "Error: $($_.Exception.Message)"
    }
}

function Test-LoadPerformance {
    Write-Host "`n⚡ Testing Load Performance..." -ForegroundColor Cyan
    
    $jobs = @()
    $results = @()
    
    Write-Host "Starting $Concurrent concurrent requests..." -ForegroundColor Yellow
    
    # Create concurrent jobs
    for ($i = 1; $i -le $Concurrent; $i++) {
        $job = Start-Job -ScriptBlock {
            param($BaseUrl, $RequestId)
            
            try {
                $startTime = Get-Date
                
                $headers = @{ "Content-Type" = "application/json" }
                $body = @{
                    message = "Load test request #$RequestId"
                    userId = "load_test_user_$RequestId"
                    requestType = "general"
                } | ConvertTo-Json
                
                $response = Invoke-RestMethod -Uri "$BaseUrl/api/ai" -Method POST -Headers $headers -Body $body -TimeoutSec 45
                $responseTime = ((Get-Date) - $startTime).TotalMilliseconds
                
                return @{
                    RequestId = $RequestId
                    Success = $true
                    ResponseTime = $responseTime
                    Cost = $response.cost
                    Provider = $response.provider
                }
                
            } catch {
                return @{
                    RequestId = $RequestId
                    Success = $false
                    Error = $_.Exception.Message
                    ResponseTime = 0
                }
            }
        } -ArgumentList $BaseUrl, $i
        
        $jobs += $job
    }
    
    # Wait for all jobs to complete
    $completed = 0
    $timeout = 60 # seconds
    $startTime = Get-Date
    
    while ($completed -lt $Concurrent -and ((Get-Date) - $startTime).TotalSeconds -lt $timeout) {
        $completed = ($jobs | Where-Object { $_.State -eq "Completed" }).Count
        Write-Host "Completed: $completed/$Concurrent" -ForegroundColor Gray
        Start-Sleep -Seconds 1
    }
    
    # Collect results
    foreach ($job in $jobs) {
        if ($job.State -eq "Completed") {
            $result = Receive-Job $job
            $results += $result
            
            if ($result.Success) {
                Write-LiveTestResult "Concurrent Request $($result.RequestId)" "PASS" "Response time: $([math]::Round($result.ResponseTime, 0))ms"
            } else {
                Write-LiveTestResult "Concurrent Request $($result.RequestId)" "FAIL" $result.Error
            }
        } else {
            Write-LiveTestResult "Concurrent Request (Timeout)" "FAIL" "Request timed out after $timeout seconds"
        }
        
        Remove-Job $job -Force
    }
    
    # Analyze performance results
    $successfulRequests = $results | Where-Object { $_.Success }
    $failedRequests = $results | Where-Object { -not $_.Success }
    
    if ($successfulRequests.Count -gt 0) {
        $avgResponseTime = ($successfulRequests | Measure-Object -Property ResponseTime -Average).Average
        $maxResponseTime = ($successfulRequests | Measure-Object -Property ResponseTime -Maximum).Maximum
        $minResponseTime = ($successfulRequests | Measure-Object -Property ResponseTime -Minimum).Minimum
        
        Write-LiveTestResult "Load Test Summary" "PASS" "Success: $($successfulRequests.Count)/$Concurrent, Avg: $([math]::Round($avgResponseTime, 0))ms"
        Write-Host "    └─ Min: $([math]::Round($minResponseTime, 0))ms, Max: $([math]::Round($maxResponseTime, 0))ms" -ForegroundColor Gray
        
        $global:TestResults.LoadTests += @{
            TotalRequests = $Concurrent
            SuccessfulRequests = $successfulRequests.Count
            FailedRequests = $failedRequests.Count
            AverageResponseTime = $avgResponseTime
            MaxResponseTime = $maxResponseTime
            MinResponseTime = $minResponseTime
        }
        
        # Performance benchmarks
        if ($avgResponseTime -lt 5000) {
            Write-LiveTestResult "Performance Benchmark" "PASS" "Average response time under 5 seconds"
        } elseif ($avgResponseTime -lt 10000) {
            Write-LiveTestResult "Performance Benchmark" "WARN" "Average response time acceptable but could be improved"
        } else {
            Write-LiveTestResult "Performance Benchmark" "FAIL" "Average response time too high (>10 seconds)"
        }
        
    } else {
        Write-LiveTestResult "Load Test Summary" "FAIL" "All requests failed"
    }
}

function Show-LiveTestSummary {
    Write-Host "`n" + "="*70 -ForegroundColor Cyan
    Write-Host "🚀 LIVE TEST SUMMARY" -ForegroundColor Cyan
    Write-Host "="*70 -ForegroundColor Cyan
    
    $duration = ((Get-Date) - $global:TestResults.StartTime).TotalSeconds
    Write-Host "Test Duration: $([math]::Round($duration, 2)) seconds" -ForegroundColor White
    
    # API Tests Summary
    if ($global:TestResults.APITests.Count -gt 0) {
        Write-Host "`n🌐 API Connection Tests:" -ForegroundColor Cyan
        foreach ($test in $global:TestResults.APITests) {
            $status = if ($test.Status -eq "PASS") { "✅" } else { "❌" }
            $time = if ($test.ResponseTime) { " ($([math]::Round($test.ResponseTime, 0))ms)" } else { "" }
            Write-Host "  $status $($test.Provider) API$time" -ForegroundColor White
        }
    }
    
    # Routing Tests Summary
    if ($global:TestResults.RoutingTests.Count -gt 0) {
        Write-Host "`n🤖 AI Routing Tests:" -ForegroundColor Cyan
        $routingSuccess = ($global:TestResults.RoutingTests | Where-Object { $_.Status -eq "PASS" }).Count
        $routingTotal = $global:TestResults.RoutingTests.Count
        $routingAccuracy = if ($routingTotal -gt 0) { [math]::Round(($routingSuccess / $routingTotal) * 100, 1) } else { 0 }
        
        Write-Host "  Routing Accuracy: $routingAccuracy% ($routingSuccess/$routingTotal)" -ForegroundColor $(if ($routingAccuracy -ge 90) { "Green" } elseif ($routingAccuracy -ge 70) { "Yellow" } else { "Red" })
        
        foreach ($test in $global:TestResults.RoutingTests) {
            $status = if ($test.Status -eq "PASS") { "✅" } else { "❌" }
            $provider = if ($test.Actual) { " → $($test.Actual)" } else { "" }
            $time = if ($test.ResponseTime) { " ($([math]::Round($test.ResponseTime, 0))ms)" } else { "" }
            Write-Host "  $status $($test.Type)$provider$time" -ForegroundColor White
        }
    }
    
    # Cost Tests Summary
    if ($global:TestResults.CostTests.Count -gt 0) {
        Write-Host "`n💰 Cost Tracking Tests:" -ForegroundColor Cyan
        foreach ($test in $global:TestResults.CostTests) {
            $status = if ($test.Accuracy) { "✅" } else { "❌" }
            Write-Host "  $status Cost Accuracy: `$([math]::Round($test.ReportedCost, 6))" -ForegroundColor White
        }
    }
    
    # Load Tests Summary
    if ($global:TestResults.LoadTests.Count -gt 0) {
        Write-Host "`n⚡ Load Performance Tests:" -ForegroundColor Cyan
        foreach ($test in $global:TestResults.LoadTests) {
            $successRate = [math]::Round(($test.SuccessfulRequests / $test.TotalRequests) * 100, 1)
            $status = if ($successRate -ge 95) { "✅" } elseif ($successRate -ge 80) { "⚠️" } else { "❌" }
            Write-Host "  $status Concurrent Requests: $successRate% success rate" -ForegroundColor White
            Write-Host "      Avg Response: $([math]::Round($test.AverageResponseTime, 0))ms" -ForegroundColor Gray
        }
    }
    
    Write-Host "`n" + "="*70 -ForegroundColor Cyan
}

# Main execution
Write-Host "🚀 EdgeToEquity Live Testing Suite" -ForegroundColor Green
Write-Host "Senior Developer Edition - Real-time System Validation" -ForegroundColor Yellow
Write-Host "="*70 -ForegroundColor Cyan

Write-Host "Base URL: $BaseUrl" -ForegroundColor White
Write-Host "Concurrent Users: $Concurrent" -ForegroundColor White

if ($All -or $APITest) { Test-LiveAPIConnections }
if ($All -or $RoutingTest) { Test-SmartRouting }
if ($All -or $CostTest) { Test-CostTracking }
if ($All -or $LoadTest) { Test-LoadPerformance }

if (-not ($APITest -or $RoutingTest -or $CostTest -or $LoadTest -or $All)) {
    Write-Host "`nUsage: .\live-test.ps1 [-APITest] [-RoutingTest] [-CostTest] [-LoadTest] [-All]" -ForegroundColor Yellow
    Write-Host "Use -All to run complete live testing suite" -ForegroundColor Gray
    Write-Host "Optional: -Concurrent <number> -BaseUrl <url>" -ForegroundColor Gray
}

Show-LiveTestSummary

# Save detailed results
try {
    $global:TestResults | ConvertTo-Json -Depth 10 | Out-File -FilePath "live-test-results.json" -Encoding UTF8
    Write-Host "`n💾 Detailed results saved to: live-test-results.json" -ForegroundColor Green
} catch {
    Write-Host "Failed to save test results: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Live testing complete!" -ForegroundColor Green
