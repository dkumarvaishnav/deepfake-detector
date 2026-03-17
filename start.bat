@echo off
TITLE Deepfake Detector - Launcher
echo ========================================
echo   Starting Deepfake Detector Project
echo ========================================

:: 1. Start the Backend Server in a new window
echo [1/3] Launching Backend (FastAPI)...
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --reload"

:: 2. Start the Frontend Server in a new window
echo [2/3] Launching Frontend (Vite)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

:: 3. Wait a few seconds for servers to initialize
echo [3/3] Waiting for servers to start...
timeout /t 5 /nobreak > nul

:: 4. Open the browser
echo Opening browser to http://localhost:5173...
start http://localhost:5173

echo.
echo All systems are starting! 
echo You can keep the other two terminal windows open to see logs.
echo.
pause
