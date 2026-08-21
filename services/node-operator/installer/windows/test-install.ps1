# Wnode Node Operator - Windows Install Verification Script

$ManifestPath = "..\..\dist\manifest.json"
if (-Not (Test-Path -Path $ManifestPath)) {
    Write-Error "Manifest not found at $ManifestPath"
    exit 1
}

$ManifestData = Get-Content -Raw -Path $ManifestPath | ConvertFrom-Json
$Version = $ManifestData.version

Write-Output "Simulating Windows Install Verification for v$Version..."

$StagingDir = "$env:TEMP\WnodeNodeOperatorMsiStaging"

Write-Output "[PLACEHOLDER] Verifying MSI staging structure in $StagingDir..."
# if (-Not (Test-Path "$StagingDir\ProgramFiles\Wnode\NodeOperator\node-operator.exe")) { Write-Error "Missing binary"; exit 1 }
# if (-Not (Test-Path "$StagingDir\ProgramFiles\Wnode\NodeOperator\node-operator-service.ps1")) { Write-Error "Missing service script"; exit 1 }
# if (-Not (Test-Path "$StagingDir\ProgramData\Wnode\NodeOperator\meta.json")) { Write-Error "Missing meta.json"; exit 1 }

Write-Output "[PLACEHOLDER] Validating meta.json version match for $Version..."
# $MetaData = Get-Content -Raw -Path "$StagingDir\ProgramData\Wnode\NodeOperator\meta.json" | ConvertFrom-Json
# if ($MetaData.version -ne $Version) { Write-Error "Version mismatch!"; exit 1 }

Write-Output "Windows install verification complete (Placeholder)."
