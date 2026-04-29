@echo off
title Okuma Genos Converter - Setup
echo.
echo  ================================================
echo   OKUMA GENOS CONVERTER - SETUP
echo  ================================================
echo.

set SCRIPT_DIR=%~dp0
set BASE=https://dtomlinsonairmethods.github.io/feedSpeedCalculatorV3

:: Step 1: Check Node.js
echo  [1/4] Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Node.js not found. Opening download page...
    echo  Install Node.js LTS then run Setup.bat again.
    start "" "https://nodejs.org/en/download"
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo  Node.js %NODE_VER% OK
echo.

:: Step 2: Download files using curl (built into Windows 10/11)
echo  [2/4] Downloading converter files...
cd /d "%SCRIPT_DIR%"

curl -L --ssl-no-revoke -o "OkumaConverter.js"      "%BASE%/OkumaConverter.js"      && echo   OK: OkumaConverter.js      || echo   FAILED: OkumaConverter.js
curl -L --ssl-no-revoke -o "OkumaConverter.bat"     "%BASE%/OkumaConverter.bat"     && echo   OK: OkumaConverter.bat     || echo   FAILED: OkumaConverter.bat
curl -L --ssl-no-revoke -o "OkumaConverter.vbs"     "%BASE%/OkumaConverter.vbs"     && echo   OK: OkumaConverter.vbs     || echo   FAILED: OkumaConverter.vbs
curl -L --ssl-no-revoke -o "OkumaConverter_PDF.js"  "%BASE%/OkumaConverter_PDF.js"  && echo   OK: OkumaConverter_PDF.js  || echo   FAILED: OkumaConverter_PDF.js
curl -L --ssl-no-revoke -o "OkumaConverter_PDF.vbs" "%BASE%/OkumaConverter_PDF.vbs" && echo   OK: OkumaConverter_PDF.vbs || echo   FAILED: OkumaConverter_PDF.vbs

echo.
:: Step 3: Install PDF libraries
echo  [3/4] Installing PDF libraries...
cd /d "%SCRIPT_DIR%"

if exist "%SCRIPT_DIR%node_modules\pdfjs-dist\legacy\build\pdf.js" (
    echo  Already installed. OK
) else (
    echo  Running npm install...
    call npm install pdfjs-dist@3.11.174 pdf-lib --silent
    if %errorlevel% neq 0 (
        echo  FAILED. Check internet and try again.
        pause
        exit /b 1
    )
    echo  PDF libraries installed. OK
)
echo.

:: Step 4: PDF right-click menu
echo  [4/4] Installing PDF right-click menu...
set PDF_PROGID=
for /f "tokens=3" %%p in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.pdf\UserChoice" /v ProgId 2^>nul') do set PDF_PROGID=%%p
if "%PDF_PROGID%"=="" set PDF_PROGID=Acrobat.Document.DC
echo  PDF handler: %PDF_PROGID%

reg delete "HKCU\Software\Classes\%PDF_PROGID%\shell\ConvertToOkuma" /f >nul 2>&1
reg add "HKCU\Software\Classes\%PDF_PROGID%\shell\ConvertToOkuma" /ve /d "Convert to Okuma Format" /f >nul
reg add "HKCU\Software\Classes\%PDF_PROGID%\shell\ConvertToOkuma" /v "Icon" /d "shell32.dll,277" /f >nul
reg add "HKCU\Software\Classes\%PDF_PROGID%\shell\ConvertToOkuma\command" /ve /d "wscript.exe \"%SCRIPT_DIR%OkumaConverter_PDF.vbs\" \"%%1\"" /f >nul
echo  Right-click menu installed. OK
echo.

:: Done
echo  ================================================
echo   SETUP COMPLETE
echo  ================================================
echo.
echo  ONE MANUAL STEP:
echo.
echo  In Mastercam:
echo  File ^> Configuration ^> Start/Exit ^> Editor
echo  Browse to: %SCRIPT_DIR%OkumaConverter.vbs
echo.
start "" "https://dtomlinsonairmethods.github.io/feedSpeedCalculatorV3/"
