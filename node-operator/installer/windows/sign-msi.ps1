# Wnode Node Operator - Windows MSI Signing Pipeline

# 1. Read version from manifest
$ManifestPath = "..\..\dist\manifest.json"
if (-Not (Test-Path -Path $ManifestPath)) {
    Write-Error "Manifest not found at $ManifestPath"
    exit 1
}

$ManifestData = Get-Content -Raw -Path $ManifestPath | ConvertFrom-Json
$Version = $ManifestData.version
$MsiName = "WnodeNodeOperator-${Version}.msi"

Write-Output "Starting Windows signing pipeline for $MsiName..."

# Credentials (Placeholders)
$CertThumbprint = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
$TimestampServer = "http://timestamp.digicert.com"

# 2. Sign the .msi (Placeholder)
Write-Output "[PLACEHOLDER] Running: signtool sign /sha1 $CertThumbprint /fd SHA256 /tr $TimestampServer /td SHA256 $MsiName"

Write-Output "Windows MSI Signing pipeline complete."
