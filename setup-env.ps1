# EdgeToEquity Environment Setup - Production Ready
# Senior Developer Edition with comprehensive validation

param(
    [switch]$Validate,
    [switch]$Force
)

function Write-Status {
    param($Message, $Status = "Info")
    $color = switch($Status) {
        "Success" { "Green" }
        "Warning" { "Yellow" }
        "Error" { "Red" }
        default { "White" }
    }
    Write-Host "[$Status] $Message" -ForegroundColor $color
}

function Test-APIKey {
    param($KeyName, $KeyValue)
    
    if ([string]::IsNullOrWhiteSpace($KeyValue) -or $KeyValue -eq "your_${KeyName}_here") {
        return $false
    }
    
    # Basic format validation
    switch($KeyName) {
        "openai_api_key" { return $KeyValue -match "^sk-[A-Za-z0-9]{40,}" }
        "anthropic_api_key" { return $KeyValue -match "^sk-ant-[A-Za-z0-9\-_]{95,}" }
        default { return $true }
    }
}

function Test-NetworkConnectivity {
    Write-Status "Testing network connectivity..." "Info"
    
    $openaiTest = Test-NetConnection -ComputerName "api.openai.com" -Port 443 -InformationLevel Quiet
    $anthropicTest = Test-NetConnection -ComputerName "api.anthropic.com" -Port 443 -InformationLevel Quiet
    
    if (-not $openaiTest) {
        Write-Status "Cannot reach OpenAI API. Check your internet connection." "Error"
        return $false
    }
    
    if (-not $anthropicTest) {
        Write-Status "Cannot reach Anthropic API. Check your internet connection." "Error"
        return $false
    }
    
    Write-Status "Network connectivity verified" "Success"
    return $true
}

Write-Host "🔑 EdgeToEquity Environment Setup" -ForegroundColor Green
Write-Host "Production-ready configuration with validation" -ForegroundColor Yellow

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Status ".env.local file found" "Success"
    
    try {
        $content = Get-Content ".env.local" -Raw -ErrorAction Stop
        
        # Extract API keys with improved regex
        $openaiMatch = $content | Select-String "OPENAI_API_KEY=(.+)" -AllMatches
        $anthropicMatch = $content | Select-String "ANTHROPIC_API_KEY=(.+)" -AllMatches
        
        $openaiKey = if ($openaiMatch) { $openaiMatch.Matches[0].Groups[1].Value.Trim() } else { $null }
        $anthropicKey = if ($anthropicMatch) { $anthropicMatch.Matches[0].Groups[1].Value.Trim() } else { $null }
        
        # Validate API keys
        $openaiValid = Test-APIKey "openai_api_key" $openaiKey
        $anthropicValid = Test-APIKey "anthropic_api_key" $anthropicKey
        
        if ($openaiValid) {
            Write-Status "OPENAI_API_KEY format valid" "Success"
        } else {
            Write-Status "OPENAI_API_KEY missing or invalid format" "Error"
        }
        
        if ($anthropicValid) {
            Write-Status "ANTHROPIC_API_KEY format valid" "Success"
        } else {
            Write-Status "ANTHROPIC_API_KEY missing or invalid format" "Error"
        }
        
        if ($openaiValid -and $anthropicValid) {
            Write-Status "All API keys configured correctly!" "Success"
            
            if ($Validate) {
                # Test actual API connectivity
                if (Test-NetworkConnectivity) {
                    Write-Status "Ready for API testing phase" "Success"
                }
            }
        } else {
            Write-Status "Please fix API key issues before proceeding" "Warning"
            
            if ($Force) {
                Write-Status "Continuing with --Force flag..." "Warning"
            } else {
                Write-Status "Use -Force to continue with invalid keys" "Info"
                exit 1
            }
        }
        
    } catch {
        Write-Status "Error reading .env.local: $($_.Exception.Message)" "Error"
        exit 1
    }
    
} else {
    Write-Status ".env.local file not found" "Warning"
    Write-Status "Creating production-ready .env.local template..." "Info"
    
    $envTemplate = @"
# EdgeToEquity API Keys - Production Configuration
# Replace with your actual API keys

# OpenAI API Key (format: sk-...)
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API Key (format: sk-ant-...)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Database Configuration (for production deployment)
# DATABASE_URL=postgresql://username:password@localhost:5432/edgetoequity

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_PAYMENT_PROCESSING=false
ENABLE_SOCIAL_FEATURES=false

# Performance Configuration
AI_TIMEOUT_MS=30000
MAX_CONCURRENT_REQUESTS=10
CACHE_TTL_SECONDS=300
"@

    try {
        $envTemplate | Out-File -FilePath ".env.local" -Encoding UTF8 -ErrorAction Stop
        Write-Status "Created .env.local template successfully" "Success"
    } catch {
        Write-Status "Failed to create .env.local: $($_.Exception.Message)" "Error"
        exit 1
    }
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Add your actual API keys to .env.local" -ForegroundColor White
Write-Host "2. Run: .\setup-env.ps1 -Validate (to test API connectivity)" -ForegroundColor White
Write-Host "3. Run: npm run dev (start development server)" -ForegroundColor White
Write-Host "4. Run: .\test-system.ps1 (comprehensive testing)" -ForegroundColor White

Write-Host "`n🎯 API Key Sources:" -ForegroundColor Cyan
Write-Host "• OpenAI: https://platform.openai.com/api-keys" -ForegroundColor White
Write-Host "• Anthropic: https://console.anthropic.com/" -ForegroundColor White

Write-Host "`n🔍 Validation Options:" -ForegroundColor Cyan
Write-Host "• -Validate: Test API connectivity" -ForegroundColor White
Write-Host "• -Force: Continue despite validation errors" -ForegroundColor White

if ($Validate) {
    Write-Host "`n✅ Environment validation complete!" -ForegroundColor Green
} else {
    Write-Host "`n💡 Run with -Validate flag to test API connections" -ForegroundColor Yellow
}
