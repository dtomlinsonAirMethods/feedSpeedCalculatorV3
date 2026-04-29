@echo off
title Okuma Genos Converter — Setup
color 0A
echo.
echo  ================================================
echo   OKUMA GENOS CONVERTER — SETUP
echo  ================================================
echo.

set SCRIPT_DIR=%~dp0
set BASE=https://dtomlinsonairmethods.github.io/feedSpeedCalculatorV3

:: ── STEP 1: Check Node.js ──────────────────────────────────
echo  [1/4] Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  Node.js not found. Opening download page...
    echo  Install Node.js LTS then run Setup.bat again.
    echo.
    start "" "https://nodejs.org/en/download"
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo  Node.js %NODE_VER% OK
echo.

:: ── STEP 2: Download files ─────────────────────────────────
echo  [2/4] Downloading converter files...
cd /d "%SCRIPT_DIR%"

powershell -ExecutionPolicy Bypass -Command "& { $files = 'OkumaConverter.js','OkumaConverter.bat','OkumaConverter.vbs','OkumaConverter_PDF.js','OkumaConverter_PDF.vbs'; foreach ($f in $files) { $url = '%BASE%/' + $f; $out = Join-Path '%SCRIPT_DIR%' $f; try { [System.Net.WebClient]::new().DownloadFile($url, $out); Write-Host ('  OK: ' + $f) } catch { Write-Host ('  FAILED: ' + $f + ' - ' + $_.Exception.Message) } } }"

echo.

:: ── STEP 3: Install npm dependencies ───────────────────────
echo  [3/4] Installing PDF libraries...
cd /d "%SCRIPT_DIR%"

if exist "%SCRIPT_DIR%node_modules\pdfjs-dist\legacy\build\pdf.js" (
    echo  Already installed. OK
) else (
    echo  Running npm install...
    call npm install pdfjs-dist@3.11.174 pdf-lib --silent
    if %errorlevel% neq 0 (
        echo  FAILED. Check internet connection and try again.
        pause
        exit /b 1
    )
    echo  PDF libraries installed. OK
)
echo.

:: ── STEP 4: Right-click menu ───────────────────────────────
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

:: ── DONE ───────────────────────────────────────────────────
echo  ================================================
echo   SETUP COMPLETE
echo  ================================================
echo.
echo  ONE MANUAL STEP REMAINING:
echo.
echo  In Mastercam:
echo  File ^> Configuration ^> Start/Exit ^> Editor
echo  Browse to: %SCRIPT_DIR%OkumaConverter.vbs
echo.
echo  Opening the app now to install as PWA...
start "" "https://dtomlinsonairmethods.github.io/feedSpeedCalculatorV3/"
echo.
pause
