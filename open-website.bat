@echo off
title NOIR CHD - Launching Cinematic Experience
echo ========================================================
echo   NOIR CHD - Chandigarh After Dark
echo   Starting local dev server at http://localhost:5173 ...
echo ========================================================
echo.
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173"
call "C:\Program Files\nodejs\npx.cmd" vite --port 5173 --host
pause
