@echo off

ECHO Starting react frontend
start "Frontend" cmd /k "cd frontend && npm run dev"


ECHO Starting express server
start "Backend" cmd /k "cd express && npm run dev"


ECHO Starting csv worker
start "Worker" cmd /k "cd express && npm run worker:dev"

ECHO done boss

REM to run, command is start.bat