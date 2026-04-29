@echo off
title Okuma Genos Converter — Setup
color 0A
echo.
echo  ================================================
echo   OKUMA GENOS CONVERTER — SETUP
echo  ================================================
echo.

set SCRIPT_DIR=%~dp0
set BASE_URL=https://dtomlinsonairmethods.github.io/feedSpeedCalculatorV3

:: ── STEP 1: Check for Node.js ──────────────────────────────
echo  [1/5] Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  Node.js is not installed.
    echo  Opening the Node.js download page...
    echo.
    echo  IMPORTANT: Install Node.js LTS, then run this Setup.bat again.
    echo.
    start "" "https://nodejs.org/en/download"
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo  Node.js %NODE_VER% found. OK
echo.

:: ── STEP 2: Download all required files ────────────────────
echo  [2/5] Downloading converter files...
cd /d "%SCRIPT_DIR%"

powershell -Command "& {$files = @('OkumaConverter.js','OkumaConverter.bat','OkumaConverter.vbs','OkumaConverter_PDF.js','OkumaConverter_PDF.vbs'); foreach ($f in $files) { $url = '%BASE_URL%/' + $f; $dest = '%SCRIPT_DIR%' + $f; try { Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing; Write-Host ('  Downloaded: ' + $f) } catch { Write-Host ('  FAILED: ' + $f) } } }"

echo  Files downloaded. OK
echo.

:: ── STEP 3: Install npm dependencies ───────────────────────
echo  [3/5] Installing PDF libraries...
cd /d "%SCRIPT_DIR%"

if exist "%SCRIPT_DIR%node_modules\pdfjs-dist\legacy\build\pdf.js" (
    echo  PDF libraries already installed. OK
) else (
    echo  Running npm install ^(30-60 seconds^)...
    npm install pdfjs-dist@3.11.174 pdf-lib --silent 2>nul
    if %errorlevel% neq 0 (
        echo  npm install failed. Check internet connection and try again.
        pause
        exit /b 1
    )
    echo  PDF libraries installed. OK
)
echo.

:: ── STEP 4: Install PDF right-click menu ───────────────────
echo  [4/5] Installing PDF right-click menu...

set PDF_PROGID=
for /f "tokens=3" %%p in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.pdf\UserChoice" /v ProgId 2^>nul') do set PDF_PROGID=%%p
if "%PDF_PROGID%"=="" set PDF_PROGID=Acrobat.Document.DC

echo  PDF viewer: %PDF_PROGID%

reg delete "HKCU\Software\Classes\SystemFileAssociations\.pdf\shell\ConvertToOkuma" /f >nul 2>&1
reg delete "HKCU\Software\Classes\*\shell\ConvertToOkuma" /f >nul 2>&1
reg delete "HKCU\Software\Classes\AcroExch.Document.DC\shell\ConvertToOkuma" /f >nul 2>&1
reg delete "HKCU\Software\Classes\Acrobat.Document.DC\shell\ConvertToOkuma" /f >nul 2>&1
reg delete "HKCU\Software\Classes\%PDF_PROGID%\shell\ConvertToOkuma" /f >nul 2>&1

reg add "HKCU\Software\Classes\%PDF_PROGID%\shell\ConvertToOkuma" /ve /d "Convert to Okuma Format" /f >nul
reg add "HKCU\Software\Classes\%PDF_PROGID%\shell\ConvertToOkuma" /v "Icon" /d "shell32.dll,277" /f >nul
reg add "HKCU\Software\Classes\%PDF_PROGID%\shell\ConvertToOkuma\command" /ve /d "wscript.exe \"%SCRIPT_DIR%OkumaConverter_PDF.vbs\" \"%%1\"" /f >nul

echo  Right-click menu installed. OK
echo.

:: ── STEP 5: Done ───────────────────────────────────────────
echo  [5/5] Finalizing...
echo.
echo  ================================================
echo   SETUP COMPLETE
echo  ================================================
echo.
echo  FINAL STEPS ^(manual^):
echo.
echo  1. Point Mastercam to the G-code converter:
echo     File ^> Configuration ^> Start/Exit ^> Editor
echo     Browse to: %SCRIPT_DIR%OkumaConverter.vbs
echo.
echo  2. Install the PWA app ^(if not already^):
echo     Visit the URL below and click Install:
echo     https://dtomlinsonairmethods.github.io/feedSpeedCalculatorV3/
echo.
start "" "https://dtomlinsonairmethods.github.io/feedSpeedCalculatorV3/"
echo.
echo  Press any key to close.
pause >nul
