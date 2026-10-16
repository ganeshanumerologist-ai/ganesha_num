@echo off
REM ===================================================================
REM  PUSH.bat  -  GitHub me code bhejne ka button
REM
REM  Ye aapko poori tarah step-by-step lekar chalayega:
REM    1. pehle check karega ki SSH key GitHub par lagi hai ya nahi
REM    2. agar nahi lagi, to browser khol dega aur screen par hi
REM       key dikha dega (copy-paste ki bhi zaroorat nahi)
REM    3. aap sirf Enter dabao, aur code chala jaayega
REM ===================================================================

setlocal enabledelayedexpansion

set "GITDIR=C:\Users\vicky\git-portable"
set "NODEDIR=C:\Users\vicky\node-portable\node-v20.20.2-win-x64"
set "PROJ=%~dp0"
set "SSH=%GITDIR%\usr\bin\ssh.exe"
set "KEYFILE=%USERPROFILE%\.ssh\id_ed25519"

set "PATH=%GITDIR%\cmd;%GITDIR%\ucrt64\bin;%GITDIR%\usr\bin;%NODEDIR%;%PATH%"
cd /d "%PROJ%"
REM Note: git ka core.sshCommand project config me set hai -
REM (C:/Users/vicky/git-portable/usr/bin/ssh.exe, forward slashes ke saath).
REM GIT_SSH_COMMAND yahan mat set karein: backslash shell me shudh jaate hain
REM aur git "command not found" de deta hai.

echo.
echo ==========================================================
echo    GANESHA NUMEROLOGIST - GitHub push
echo ==========================================================
echo.

if not exist "%KEYFILE%" (
  echo [ERROR] SSH key nahi mili: %KEYFILE%
  echo.
  pause
  exit /b 1
)

echo [1/3] Check kar raha hoon ki GitHub se connection hai...
echo.

"%SSH%" -o BatchMode=yes -o ConnectTimeout=15 -T git@github.com >nul 2>&1
if errorlevel 1 (
  goto NEED_LOGIN
) else (
  goto DO_PUSH
)

:NEED_LOGIN
echo ==========================================================
echo    STEP 1: Browser me GitHub login karo
echo ==========================================================
echo.
echo    Abhi main aapka browser khol raha hoon.
echo    Wahan aapko apne GitHub account se login karna hai.
echo.
echo    (Agar pehle se login ho, to seedha aage badh jayega)
echo.

start "" "https://github.com/login"
echo    Browser khul gaya. Login kar lijiye...
echo.

echo ==========================================================
echo    STEP 2: Ye link kholiye (browser me hi)
echo ==========================================================
echo.
start "" "https://github.com/settings/ssh/new"
echo    Link khol diya hai.
echo.

echo ==========================================================
echo    STEP 3: Form bhariye
echo ==========================================================
echo.
echo    Title box me likhiye:      vicky-laptop
echo.
echo    Key box me ye poori line copy-paste kar dijiye:
echo.
echo    -----------------------------------------------------------------
type "%KEYFILE%.pub"
echo    -----------------------------------------------------------------
echo.
echo    (Key box par click karke  Ctrl + V  daba dijiye)
echo.
echo    Neeche dropdown: "Authentication key" chuniye (default yahi hota hai)
echo.
echo    Phir GREEN "Add SSH key" button daba dijiye.
echo.
echo    Green button dikh jaye to ENTER daba dijiye.
echo.

set /p ans="    Kya green button daba diya? (ENTER = haan, n = nahi) "

if /i "%ans%"=="n" (
  echo.
  echo Theek hai, jab ready ho tab ENTER daba dijiye.
  pause
)

echo.
echo [2/3] Dobara check kar raha hoon...
echo.

"%SSH%" -o BatchMode=yes -o ConnectTimeout=15 -T git@github.com
echo.

:DO_PUSH
echo [3/3] GitHub me bhej raha hoon...
echo.
git push origin main
echo.

if errorlevel 1 (
  echo ==========================================================
  echo    PUSH FAIL. Sabse aam wajah: key galat account par lagi.
  echo ==========================================================
  echo.
  echo    Check kijiye:
  echo.
  echo    a) Kholiye:  https://github.com/settings/keys
  echo    b) Jo account login hai wo "ganeshanumerologist-ai"
  echo       hona chahiye.
  echo    c) Key ki Type "Authentication Key" honi chahiye,
  echo       "Signing Key" nahi.
  echo    d) Is file ko dobara double-click karein.
  echo.
) else (
  echo ==========================================================
  echo    HO GAYA! Saara code GitHub par pahunch gaya.
  echo ==========================================================
)

echo.
pause
endlocal