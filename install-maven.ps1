$zip = Join-Path $env:TEMP 'apache-maven-3.9.9-bin.zip'
$dest = Join-Path $env:LOCALAPPDATA 'Programs\apache-maven-3.9.9'
if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
Invoke-WebRequest -Uri 'https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip' -OutFile $zip
Expand-Archive -Path $zip -DestinationPath (Join-Path $env:LOCALAPPDATA 'Programs')
Remove-Item $zip
Write-Output "Maven extracted to $dest"
