Set objShell = CreateObject("WScript.Shell")
Set objArgs = WScript.Arguments

Dim filePath
If objArgs.Count > 0 Then
    filePath = objArgs(0)
Else
    filePath = ""
End If

Dim scriptDir
scriptDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))

' Run node hidden (0 = hidden window, False = don't wait)
objShell.Run "node """ & scriptDir & "OkumaConverter.js"" """ & filePath & """", 0, False
