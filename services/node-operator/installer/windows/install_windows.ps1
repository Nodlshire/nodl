param (
    [string]$Token = $env:NODL_DEVICE_TOKEN
)

$ErrorActionPreference = "Stop"
$installPath = "$env:ProgramData\NODL"
New-Item -ItemType Directory -Force -Path $installPath | Out-Null

$binPath = "$installPath\nodl-core.exe"
if (Test-Path ".\nodl-core-windows-amd64.exe") {
    Copy-Item ".\nodl-core-windows-amd64.exe" -Destination $binPath -Force
} elseif (Test-Path ".\nodl-core.exe") {
    Copy-Item ".\nodl-core.exe" -Destination $binPath -Force
} else {
    Invoke-WebRequest -Uri "https://nodlr.wnode.one/releases/nodl-core-windows-amd64.exe" -OutFile $binPath
}

if ($Token) {
    Set-Content -Path "$installPath\token" -Value $Token
}

$taskName = "NODL-Core-Daemon"
$action = New-ScheduledTaskAction -Execute $binPath -Argument "--profile earth" -WorkingDirectory $installPath
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId "NT AUTHORITY\SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Force | Out-Null
Start-ScheduledTask -TaskName $taskName

Write-Host "[NODL] Headless daemon installed and registered to start automatically at system boot."
