@echo off
setlocal

echo Starting rkitech backend...
start "" cmd /k "cd backend && npm run dev"

echo Starting rkitech frontend...
start "" cmd /k "cd frontend && npm run dev"

echo Starting rkitech CLI...
start "" cmd /k "cd cli && rkitech-cli"

echo All services launched.

endlocal
