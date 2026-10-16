@echo off
REM ===================================================================
REM  PUSH.bat  -  GitHub me code bhejne ka button
REM
REM  Ab ka flow bahut simple hai:
REM    1. Git automatically browser kholega
REM    2. Aap sirf "Authorize" par click kijiye
REM    3. Code chala jaayega
REM ===================================================================

setlocal

set "GITDIR=C:\Users\vicky\git-portable"
set "NODEDIR=C:\Users\vicky\node-portable\node-v20.20.2-win-x64"
set "PATH=%GITDIR%\cmd;%GITDIR%\ucrt64\bin;%GITDIR%\usr\bin;%NODEDIR%;%PATH%"
cd /d "%~dp0"

echo.
echo ==========================================================
echo    GANESHA NUMEROLOGIST - GitHub push
echo ==========================================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] git nahi mila.
  pause
  exit /b 1
)

echo Ye command chal rahi hai:
echo    git push origin main
echo.
echo Ab ek browser window khulegi. Usme:
echo.
echo    1. Apna GitHub account chuniye (agar list aaye)
echo    2. Green "Authorize" button daba dijiye
echo.
echo Ye sirf ek baar karna hai. Uske baad har push
echo automatic ho jayegi - bina kuch poochhe.
echo.
echo --------------------------------------------------
echo.

git push origin main
echo.

if errorlevel 1 (
  echo ==========================================================
  echo    PUSH NAHI HUA
  echo ==========================================================
  echo.
  echo    Browser me jo page khula tha usme "Authorize" dabana
  echo    mat bhooliye. Is file ko dobara double-click karein.
  echo.
) else (
  echo ==========================================================
  echo    HO GAYA! Saara code GitHub par pahunch gaya.
  echo ==========================================================
)

echo.
pause
endlocal