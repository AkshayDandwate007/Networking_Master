$env:JAVA_HOME = 'C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot'
$env:PATH = 'C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot\bin;C:\Users\Akshay\AppData\Local\Programs\apache-maven-3.9.9\bin;' + $env:PATH
Set-Location 'C:\Users\Akshay\Downloads\files\backend'
& 'C:\Users\Akshay\AppData\Local\Programs\apache-maven-3.9.9\bin\mvn.cmd' -DskipTests spring-boot:run
