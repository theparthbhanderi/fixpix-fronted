@echo off
echo Starting FixPix...

:: Start Backend
start "FixPix Backend" cmd /k "cd backend && python manage.py runserver"

:: Start Frontend (assuming we are in root)
start "FixPix Frontend" cmd /k "npm run dev"
