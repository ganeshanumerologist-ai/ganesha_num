@echo off
REM ===================================================================
REM  MOBILE.bat  -  Website ko phone par kholne ke liye
REM
REM  Ye ek kaam karta hai:
REM    1. Windows Firewall me port 5173 ko allow karta hai
REM       (yahi wajah hai ki phone par website nahi khulti)
REM    2. Website ka server chalu karta hai
REM    3. Link dikha deta hai
REM
REM  Ispar DOUBLE-CLICK kijiye. Windows puchega "Admin ke roop me
REM  chalaye?" — "Haan" / "Yes" chuna hoga. Bas.
REM ===================================================================

setlocal
set "PROJ=%~dp0"
set "GITDIR=C:\Users\vicky\git-portable"
set "NODEDIR=C:\Users\vicky\node-portable\node-v20.20.2-win-x64"
set "PATH=%GITDIR%\cmd;%GITDIR%\ucrt64\bin;%NODEDIR%;%PATH%"

cls
echo ============================================================
echo   Mobile par website kholne ka button
echo ============================================================
echo.

REM ---------- Step 1: Admin maango ----------
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Pehle admin rights chahiye. Window abhi khulega...
  echo.
  echo "User Account Control" me "Haan / Yes" daba dijiye.
  echo.
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

echo [1/3] Admin mil gaya.
echo.

REM ---------- Step 2: Firewall rule ----------
echo [2/3] Firewall rule check kar raha hoon...
netsh advfirewall firewall delete rule name="Ganesha Dev 5173" >nul 2>&1
netsh advfirewall firewall add rule name="Ganesha Dev 5173" ^
  dir=in action=allow protocol=TCP localport=5173 profile=any >nul 2>&1
if errorlevel 1 (
  echo [WARN] Firewall rule nahi ban payi. Admin se dobara chala ke dekhein.
) else (
  echo       Firewall rule tayyar hai - port 5173 khula hai.
)
echo.

REM ---------- Step 3: Server ----------
echo [3/3] Website server chalu kar raha hoon...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
cd /d "%PROJ%"
start "Ganesha Website" /min cmd /c "cd /d ""%PROJ%"" && npx vite --host --port 5173 --strictPort"
timeout /t 12 >nul

REM ---------- Link ----------
set "IP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
  for /f "tokens=* delims= " %%b in ("%%a") do set "IP=%%b"
)
if not defined IP set "IP=10.133.250.1"

echo.
echo ============================================================
echo   Website khul gayi
echo ============================================================
echo.
echo   Computer par:  http://localhost:5173/
echo.
echo   MOBILE par:    http://%IP%:5173/
echo.
echo   ------------------------------------------------------------
echo   Phone par ye link kholiye:
echo.
echo       http://%IP%:5173/
echo.
echo   IMPORTANT: Phone aur computer SAME WIFI par hone chahiye.
echo   Mobile data par nahi chalega.
echo   ------------------------------------------------------------
echo.

REM Phone par QR bhi dikha dein — scan karke seedha khul jayega
where npx >nul 2>&1
timeout /t 2 >nul
start "" "http://localhost:5173/"

echo Ye window band kar sakte hain.
echo Website tab tak chalegi jab ye background server chalta rahega.
echo.
pause
endlocal