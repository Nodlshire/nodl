# Wnode Node Operator - Windows Service Installation Script
# Requires Administrator privileges to execute.

$ServiceName = "WnodeNodeOperator"
$ServiceDisplayName = "Wnode Node Operator"
$ServiceDescription = "Runs the Wnode background operator mesh node."
$BinaryPath = "C:\Program Files\Wnode\NodeOperator\node-operator.exe"
$LogPath = "C:\ProgramData\Wnode\NodeOperator\logs\"

# Ensure the binary exists before trying to install the service
if (-Not (Test-Path -Path $BinaryPath)) {
    Write-Error "Binary not found at $BinaryPath"
    exit 1
}

# Ensure the log directory exists
if (-Not (Test-Path -Path $LogPath)) {
    New-Item -ItemType Directory -Force -Path $LogPath | Out-Null
}

# Stop and remove the service if it already exists
$existingService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($existingService) {
    Write-Output "Stopping existing service..."
    Stop-Service -Name $ServiceName -Force
    Write-Output "Removing existing service..."
    sc.exe delete $ServiceName
    Start-Sleep -Seconds 2
}

Write-Output "Creating new service $ServiceName..."
New-Service -Name $ServiceName `
            -DisplayName $ServiceDisplayName `
            -Description $ServiceDescription `
            -BinaryPathName $BinaryPath `
            -StartupType Automatic

Write-Output "Starting service $ServiceName..."
Start-Service -Name $ServiceName

Write-Output "Service installation complete."
