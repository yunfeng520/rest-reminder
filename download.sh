#!/bin/bash

# 休息提醒助手 - 快速下载脚本
# 使用方法：bash download.sh

SERVER_IP="10.3.0.3"
SERVER_PORT="8080"
DIST_DIR="/root/.openclaw/agents/dev/workspace/rest-reminder-gui/dist"

echo "========================================"
echo "  🦞 休息提醒助手 - 下载工具"
echo "========================================"
echo ""
echo "可用版本："
echo ""
echo "1. Windows GUI 版 (推荐) - 51MB"
echo "   文件：休息提醒助手-GUI.exe"
echo ""
echo "2. Windows 命令行版 - 47MB"
echo "   文件：休息提醒助手.exe"
echo ""
echo "3. Linux AppImage 版 - 100MB"
echo "   文件：休息提醒助手 -1.0.0.AppImage"
echo ""
echo "4. Linux Snap 版 - 84MB"
echo "   文件：rest-reminder-gui_1.0.0_amd64.snap"
echo ""
echo "========================================"
echo ""

# 检查是否在服务器本地
if [ -d "$DIST_DIR" ]; then
    echo "✅ 检测到您在服务器本地"
    echo ""
    echo "文件位置：$DIST_DIR"
    echo ""
    echo "可以直接复制文件，或使用以下命令下载："
    echo ""
    echo "  cd $DIST_DIR"
    echo "  ls -lh"
    echo ""
else
    echo "❌ 您不在服务器本地"
    echo ""
    echo "请使用以下方式下载："
    echo ""
    echo "方法 1: SCP 下载"
    echo "  scp root@${SERVER_IP}:${DIST_DIR}/休息提醒助手-GUI.exe ./"
    echo ""
    echo "方法 2: 浏览器访问"
    echo "  http://${SERVER_IP}:${SERVER_PORT}/"
    echo ""
    echo "方法 3: curl 下载"
    echo "  curl -O http://${SERVER_IP}:${SERVER_PORT}/休息提醒助手-GUI.exe"
    echo ""
fi

echo "========================================"
