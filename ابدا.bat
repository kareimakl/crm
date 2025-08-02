@echo off
REM Start backend
start cmd /k "cd backend && npm start"
REM Start frontend
start cmd /k "npm start" 