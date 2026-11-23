@echo off
title PharmaPulse FT-2000 Dashboard Server
cd /d "%~dp0"
echo ========================================================
echo   Starting PharmaPulse FT-2000 Monitoring System
echo   Opening: http://localhost:5173/
echo ========================================================
timeout /t 2 /nobreak >nul
start http://localhost:5173/
call npm run dev
pause
