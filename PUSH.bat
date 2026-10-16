@echo off
REM ===================================================================
REM  PUSH.bat - GitHub me push karne ka sabse aasan tareeka
REM
REM  Kyun bana hai: is computer par git system PATH me nahi hai,
REM  isliye normal terminal me "git push" likhne par "not recognized"
REM  error aata hai. Ye file khud PATH set kar deti hai.
REM
REM  Chalane ka tarika: is file par DOUBLE-CLICK karo.
REM ===================================================================

setlocal

REM --- git ka location (yahin portable git rakha hai) ---
set "GITDIR=C:\Users\vicky\git-portable"

REM --- node bhi chahiye hoga build ke liye ---
set "NODEDIR=C:\Users\vicky\node-portable\node-v20.20.2-win-x64"

set "PATH=%GITDIR%\cmd;%GITDIR%\ucrt64\bin;%NODEDIR%;%PATH%"

REM --- project folder (ye script khud wahin hai) ---
cd /d "%~dp0"

echo ============================================================
echo   Ganesha Numerologist - GitHub push
echo ============================================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] git nahi mila. Expected: %GITDIR%
  echo.
  pause
  exit /b 1
)

echo [OK] git mil gaya.
echo.

echo --- Current branch ---
git branch --show-current
echo.

echo --- Commits jo abhi tak push nahi hue ---
git log --oneline "@{u}..HEAD" 2>nul
if errorlevel 1 (
  echo (upstream nahi mila - pehli baar push ho sakta hai)
) else (
  git log --oneline "@{u}..HEAD"
)
echo.

echo --- Files jo commit ho chuki hain, par status check --- 
git status --short
echo.

echo ============================================================
echo   Ab GitHub login hoga.
echo   Browser khul sakta hai - usme "Authorize" dabao.
echo   Agar na khule, to neeche dikh jayega link - usse
echo   browser me kholo aur code daalo.
echo ============================================================
echo.

git push origin main

echo.
if errorlevel 1 (
  echo ============================================================
  echo   PUSH FAIL HO GAYA. Neeche ke steps try karo:
  echo ============================================================
  echo.
  echo   1) Browser me kholo:  https://github.com/login/device
  echo      (ya  https://github.com/settings/tokens )
  echo.
  echo   2) Personal Access Token banao:
  echo      - "Fine-grained tokens" ya "Tokens (classic)"
  echo      - scope mein sirf repo ka access do
  echo      - token copy karke PASTE kar do (sirf ek baar dikhega)
  echo.
  echo   3) Phir ye file dobara double-click karo.
  echo      Token puchega - paste kar do.
  echo.
) else (
  echo ============================================================
  echo   PUSH SUCCESSFUL. Saara code GitHub par pahunch gaya.
  echo ============================================================
)

echo.
pause
endlocal