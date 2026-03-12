#!/bin/bash

echo "========================================"
echo "  🦞 休息提醒助手 - macOS 打包工具"
echo "========================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 已安装: $(node --version)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未检测到 npm"
    exit 1
fi

echo "✅ npm 已安装: $(npm --version)"
echo ""
echo "📦 正在安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 依赖安装失败"
    exit 1
fi

echo ""
echo "✅ 依赖安装完成"
echo ""
echo "🚀 开始打包 macOS 版本..."
echo ""

npm run build:mac

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 打包失败"
    exit 1
fi

echo ""
echo "========================================"
echo "  ✅ 打包完成！"
echo "========================================"
echo ""
echo "输出文件位置:"
echo "  dist/休息提醒助手-1.0.0.dmg"
echo ""
echo "可以直接运行 DMG 文件进行安装"
echo ""
