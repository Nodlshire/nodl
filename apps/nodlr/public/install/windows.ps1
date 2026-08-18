param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

$ErrorActionPreference = 'Stop'
$Version = "v1.0.0"
$Arch = if ($env:PROCESSOR_ARCHITECTURE -eq "AMD64") { "amd64" } else { "386" }
$BinaryName = "nodl-core-windows-${Arch}.exe"
$DownloadUrl = "https://nodlr.wnode.one/download/windows"

$InstallDir = "$env:ProgramFiles\Wnode"
$ConfigDir = "$env:USERPROFILE\.wnode"
$BinaryPath = Join-Path $InstallDir "nodl-core.exe"

Write-Host "Downloading Wnode Headless Node Operator ($Arch)..."
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
New-Item -ItemType Directory -Force -Path $ConfigDir | Out-Null

Invoke-WebRequest -Uri $DownloadUrl -OutFile $BinaryPath

Write-Host "Writing registration token..."
Set-Content -Path (Join-Path $ConfigDir "token") -Value $Token

Write-Host "Creating Windows Service..."
# Note: In a production environment, nodl-core must be compiled to support the Windows Service API.
# Alternatively, use NSSM (Non-Sucking Service Manager) here if nodl-core doesn't natively support it.
sc.exe create wnode-no binPath= "$BinaryPath --profile=earth-headless" start= auto obj= LocalSystem
sc.exe start wnode-no

Write-Host "Installation complete. Service 'wnode-no' is running."
