@echo off
echo Connecting to finance_tracker database...
echo.
set PGPASSWORD=Dami@1983
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d finance_tracker
