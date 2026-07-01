@echo off
title VAANI AI - Unified Startup
echo ====================================================================
echo             VAANI AI - SECURE SPEECH INTELLIGENCE PLATFORM
echo                     Unified Platform Startup
echo ====================================================================
echo.

echo [INFO] Starting Flask Backend Server in a new window...
start "VAANI AI Backend" cmd /c "cd backend && python app.py"

echo [INFO] Starting Vite Frontend Server in a new window...
start "VAANI AI Frontend" cmd /c "npm run dev"

echo.
echo [SUCCESS] Both services have been launched!
echo [INFO] The frontend will be available at: http://localhost:5173/
echo [INFO] The backend is running on: http://127.0.0.1:5000/
echo.
pause
