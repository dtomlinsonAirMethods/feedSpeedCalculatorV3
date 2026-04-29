@echo off
:: Installs "Convert to Okuma Format" right-click menu for PDF files
:: Run this once after placing OkumaConverter_PDF.vbs in the same folder

set SCRIPT_DIR=%~dp0
set VBS_PATH=%SCRIPT_DIR%OkumaConverter_PDF.vbs

:: Remove trailing backslash for registry
if "%VBS_PATH:~-1%"=="\" set VBS_PATH=%VBS_PATH:~0,-1%

echo Installing right-click menu for PDF files...
echo VBS path: %VBS_PATH%

reg add "HKCU\Software\Classes\SystemFileAssociations\.pdf\shell\ConvertToOkuma" /ve /d "Convert to Okuma Format" /f
reg add "HKCU\Software\Classes\SystemFileAssociations\.pdf\shell\ConvertToOkuma" /v "Icon" /d "shell32.dll,277" /f
reg add "HKCU\Software\Classes\SystemFileAssociations\.pdf\shell\ConvertToOkuma\command" /ve /d "wscript.exe \"%VBS_PATH%\" \"%%1\"" /f

echo.
echo Done! Right-click any PDF and choose "Convert to Okuma Format"
pause
