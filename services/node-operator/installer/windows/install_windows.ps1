$ErrorActionPreference = "Stop"
$installPath = "$env:ProgramFiles\Wnode"
New-Item -ItemType Directory -Force -Path $installPath | Out-Null
Copy-Item "nodl-core.exe" -Destination $installPath
Copy-Item "winsw.exe" -Destination "$installPath\nodl-core-service.exe"
Copy-Item "winsw.xml" -Destination "$installPath\nodl-core-service.xml"
Start-Process -FilePath "$installPath\nodl-core-service.exe" -ArgumentList "install" -Wait -NoNewWindow
Start-Process -FilePath "$installPath\nodl-core-service.exe" -ArgumentList "start" -Wait -NoNewWindow
