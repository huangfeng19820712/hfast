@echo off

echo del core
del /f /s /q .\core\*.*
rd /s /q  .\core\*
xcopy ..\..\framework\framework-view\src\main\resources\META-INF\web-resources\core .\core\ /s /e /y

echo del framework
del /f /s /q .\framework\*.*
rd /s /q  .\framework\*
xcopy ..\..\framework\framework-view\src\main\resources\META-INF\web-resources\framework .\framework\ /s /e /y


echo del lib
del /f /s /q .\lib\*.*
rd /s /q  .\lib\*
xcopy ..\..\framework\framework-view\src\main\resources\META-INF\web-resources\lib .\lib\ /s /e /y

echo del resources
del /f /s /q .\resources\*.*
rd /s /q  .\resources\*
xcopy ..\..\framework\framework-view\src\main\resources\META-INF\web-resources\resources .\resources\ /s /e /y

echo del example
del /f /s /q .\example\*.*
rd /s /q  .\example\*
xcopy ..\..\framework\framework-demo\src\main\webapp\demo .\example\ /s /e /y
