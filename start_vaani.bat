@echo off
title VAANI AI - Production Startup Sequence
echo ====================================================================
echo             VAANI AI - SECURE SPEECH INTELLIGENCE PLATFORM
echo                     Master Startup Sequence
echo ====================================================================
echo.

echo [1/4] Starting Ollama Daemon...
start "VAANI AI - Ollama" cmd /c "ollama serve"
echo Waiting for Ollama (http://127.0.0.1:11434) to become available...
:wait_ollama
powershell -Command "try { $r = Invoke-WebRequest -Uri http://127.0.0.1:11434/ -UseBasicParsing; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %errorlevel% neq 0 (
    timeout /t 2 >nul
    goto wait_ollama
)
echo [OK] Ollama is online.
echo.

echo [2/4] Skipping OmniVoice Studio startup (Disabled by user).
echo.

echo [3/4] Starting Flask Backend...
start "VAANI AI - Flask Backend" cmd /c "cd backend && python app.py"
echo Waiting for Flask (http://127.0.0.1:5000/health) to become available...
:wait_flask
powershell -Command "try { $r = Invoke-WebRequest -Uri http://127.0.0.1:5000/health -UseBasicParsing; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %errorlevel% neq 0 (
    timeout /t 2 >nul
    goto wait_flask
)
echo [OK] Flask is online.
echo.

echo [4/4] Starting React Frontend...
start "VAANI AI - React Frontend" cmd /c "npm run dev"
echo.
echo ====================================================================
echo ALL SERVICES STARTED SUCCESSFULLY!
echo Access the application at: http://localhost:5173/
echo ====================================================================
pause
