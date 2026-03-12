@echo off
chcp 65001 >nul
echo ========================================
echo   🦞 休息提醒助手 - Windows 打包工具
echo ========================================
echo.

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装

REM 检查 npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未检测到 npm
    pause
    exit /b 1
)

echo ✅ npm 已安装
echo.
echo 📦 正在安装依赖...
call npm install

if errorlevel 1 (
    echo.
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo.
echo ✅ 依赖安装完成
echo.
echo 🚀 开始打包 Windows 版本...
echo.

call npm run build:win

if errorlevel 1 (
    echo.
    echo ❌ 打包失败
    echo.
    echo 可能的原因:
    echo 1. 需要安装 Wine (可选，用于签名)
    echo 2. 网络连接问题
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ 打包完成！
echo ========================================
echo.
echo 输出文件位置:
echo   dist\休息提醒助手 Setup 1.0.0.exe
echo.
echo 可以直接运行安装程序进行安装
echo.
pause
