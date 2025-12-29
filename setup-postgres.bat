@echo off
echo ============================================
echo PostgreSQL Database Setup for Finance Tracker
echo ============================================
echo.

set PGPATH=C:\Program Files\PostgreSQL\17\bin
set PGPASSWORD=

echo Step 1: Enter your PostgreSQL password
echo (This is the password you set when installing PostgreSQL)
echo.
set /p PGPASSWORD="Enter PostgreSQL password: "

echo.
echo Step 2: Creating database...
echo.

"%PGPATH%\psql.exe" -U postgres -c "CREATE DATABASE finance_tracker;" 2>nul

if errorlevel 1 (
    echo.
    echo Database might already exist or connection failed.
    echo Let's check if it exists...
    "%PGPATH%\psql.exe" -U postgres -c "\l" | findstr finance_tracker
    if errorlevel 1 (
        echo ERROR: Could not create or find database
        echo.
        echo Please check:
        echo 1. PostgreSQL is running
        echo 2. Password is correct
        echo 3. You have administrator privileges
        pause
        exit /b 1
    ) else (
        echo Database 'finance_tracker' already exists - OK!
    )
) else (
    echo SUCCESS: Database 'finance_tracker' created!
)

echo.
echo Step 3: Testing connection...
"%PGPATH%\psql.exe" -U postgres -d finance_tracker -c "SELECT 'Connection successful!' as status;"

if errorlevel 0 (
    echo.
    echo ============================================
    echo SUCCESS! PostgreSQL is ready!
    echo ============================================
    echo.
    echo Database: finance_tracker
    echo Host: localhost (127.0.0.1)
    echo Port: 5432
    echo User: postgres
    echo.
    echo Next: Update your Laravel .env file
    echo.
) else (
    echo ERROR: Connection failed
)

pause
