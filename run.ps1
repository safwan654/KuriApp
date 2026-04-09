Write-Host "`n🚀 Launching KuriHub Next.js App (PowerShell Edition)...`n" -ForegroundColor Cyan

# Check for Node.js
try {
    $nodeVersion = node --version
    Write-Host "[CHECK] Node.js Version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Error "[ERROR] Node.js not found. Please install it from https://nodejs.org/"
    return
}

# Check for node_modules
if (!(Test-Path "node_modules")) {
    Write-Host "[INFO] node_modules not found. Installing dependencies... ⏳" -ForegroundColor Yellow
    npm install
}

Write-Host "`n[STEP 2] Starting Dev Server... 🔥" -ForegroundColor Cyan
Write-Host "Point your browser to: http://localhost:3000`n" -ForegroundColor Green

npm run dev
