@echo off
echo ============================================
echo Reset PostgreSQL Password
echo ============================================
echo.
echo This will reset the postgres user password to: postgres123
echo.
pause

set PGPATH=C:\Program Files\PostgreSQL\17\bin
set PGDATA=C:\Program Files\PostgreSQL\17\data

echo Stopping PostgreSQL...
net stop postgresql-x64-17

echo.
echo Starting PostgreSQL in single-user mode...
"%PGPATH%\postgres.exe" --single -D "%PGDATA%" postgres -c "ALTER USER postgres WITH PASSWORD 'postgres123';"

echo.
echo Starting PostgreSQL service...
net start postgresql-x64-17

echo.
echo ============================================
echo Password reset to: postgres123
echo ============================================
echo.
echo Now run setup-postgres.bat and use password: postgres123
echo.
pause
