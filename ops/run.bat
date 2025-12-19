@echo off
echo Starting CS2Ranking stack in one terminal...

REM Angular client
cd /d "%~dp0..\client"
start "" /b ng serve

REM Main API
cd /d "%~dp0..\Main\CS2Ranking.Api"
start "" /b dotnet run

REM Auth microservice
cd /d "%~dp0..\Microservices\CS2Ranking.Authentication"
start "" /b dotnet run

echo All services started.
echo Press CTRL+C to stop.
pause >nul
