# Wnode Node Operator - Windows .msi Build Script

# 1. Read version from manifest
$ManifestPath = "..\..\dist\manifest.json"
if (-Not (Test-Path -Path $ManifestPath)) {
    Write-Error "Manifest not found at $ManifestPath"
    exit 1
}

$ManifestData = Get-Content -Raw -Path $ManifestPath | ConvertFrom-Json
$Version = $ManifestData.version
Write-Output "Building Windows .msi for Wnode Node Operator version $Version..."

# 2. Setup staging directory
$StagingDir = "$env:TEMP\WnodeNodeOperatorMsiStaging"
if (Test-Path -Path $StagingDir) { Remove-Item -Recurse -Force $StagingDir }
New-Item -ItemType Directory -Force -Path "$StagingDir\ProgramFiles\Wnode\NodeOperator" | Out-Null
New-Item -ItemType Directory -Force -Path "$StagingDir\ProgramData\Wnode\NodeOperator" | Out-Null

# 3. Copy binaries and assets into staging
Copy-Item -Path "..\..\dist\windows-amd64\node-operator.exe" -Destination "$StagingDir\ProgramFiles\Wnode\NodeOperator\"
Copy-Item -Path "ProgramFiles\Wnode\NodeOperator\node-operator-service.ps1" -Destination "$StagingDir\ProgramFiles\Wnode\NodeOperator\"
Copy-Item -Path "meta.json" -Destination "$StagingDir\ProgramData\Wnode\NodeOperator\"

# 4. Build .msi package (Placeholder for WiX Toolset / AdvancedInstaller)
Write-Output "[PLACEHOLDER] Running: candle.exe NodeOperator.wxs -out NodeOperator.wixobj"
Write-Output "[PLACEHOLDER] Running: light.exe NodeOperator.wixobj -out WnodeNodeOperator-${Version}.msi"

# 5. Signing (Placeholder)
Write-Output "[PLACEHOLDER] Running: signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a WnodeNodeOperator-${Version}.msi"

Write-Output "Windows .msi build complete."
