# Updated validation function for new OpenAI key formats
function Test-APIKey {
    param($KeyName, $KeyValue)
    
    if ([string]::IsNullOrWhiteSpace($KeyValue) -or $KeyValue -eq "your_${KeyName}_here") {
        return $false
    }
    
    # Updated format validation for new OpenAI keys
    switch($KeyName) {
        "openai_api_key" { 
            # Support both old (sk-) and new (sk-proj-) formats
            return ($KeyValue -match "^sk-[A-Za-z0-9]{40,}" -or $KeyValue -match "^sk-proj-[A-Za-z0-9\-_]{140,}")
        }
        "anthropic_api_key" { return $KeyValue -match "^sk-ant-[A-Za-z0-9\-_]{95,}" }
        default { return $true }
    }
}

Write-Host "🔑 EdgeToEquity Environment Setup (Updated)" -ForegroundColor Green
Write-Host "Fixed for new OpenAI project-based API keys" -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "[Success] .env.local file found" -ForegroundColor Green
    
    $content = Get-Content ".env.local" -Raw
    
    # Extract API keys
    $openaiMatch = $content | Select-String "OPENAI_API_KEY=(.+)" -AllMatches
    $anthropicMatch = $content | Select-String "ANTHROPIC_API_KEY=(.+)" -AllMatches
    
    $openaiKey = if ($openaiMatch) { $openaiMatch.Matches[0].Groups[1].Value.Trim() } else { $null }
    $anthropicKey = if ($anthropicMatch) { $anthropicMatch.Matches[0].Groups[1].Value.Trim() } else { $null }
    
    # Validate with updated logic
    $openaiValid = Test-APIKey "openai_api_key" $openaiKey
    $anthropicValid = Test-APIKey "anthropic_api_key" $anthropicKey
    
    if ($openaiValid) {
        Write-Host "[Success] OPENAI_API_KEY format valid (project-based key detected)" -ForegroundColor Green
    } else {
        Write-Host "[Error] OPENAI_API_KEY missing or invalid format" -ForegroundColor Red
    }
    
    if ($anthropicValid) {
        Write-Host "[Success] ANTHROPIC_API_KEY format valid" -ForegroundColor Green
    } else {
        Write-Host "[Error] ANTHROPIC_API_KEY missing or invalid format" -ForegroundColor Red
    }
    
    if ($openaiValid -and $anthropicValid) {
        Write-Host "🎉 All API keys configured correctly!" -ForegroundColor Green
    }
} else {
    Write-Host "[Error] .env.local file not found" -ForegroundColor Red
}
