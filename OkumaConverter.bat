@echo off
echo %1 > "C:\Users\dtomlinson\Desktop\debug.txt"
node "C:\Users\dtomlinson\Desktop\OkumaConverter.js" %1 >> "C:\Users\dtomlinson\Desktop\debug.txt" 2>&1