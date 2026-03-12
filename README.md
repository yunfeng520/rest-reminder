# 🦞 休息提醒助手

一个美观的桌面休息提醒工具，每 45 分钟提醒你站起来休息。

## 📦 下载

### Linux 用户
- **AppImage**: `休息提醒助手-1.0.0.AppImage` (100MB)
  ```bash
  chmod +x 休息提醒助手 -1.0.0.AppImage
  ./休息提醒助手 -1.0.0.AppImage
  ```

### Windows 用户
需要自行打包（见下方"打包说明"）

### macOS 用户
需要自行打包（见下方"打包说明"）

## ✨ 功能特点

- ⏰ **智能计时**：45 分钟工作 + 5 分钟休息（可自定义）
- 🔔 **系统通知**：原生桌面通知提醒
- 🔒 **可选锁屏**：休息时自动锁定屏幕
- 🎨 **精美界面**：现代化渐变 UI 设计
- 📊 **使用统计**：记录每日工作/休息数据
- 🖥️ **系统托盘**：最小化到托盘，开机自启（需手动设置）

## 📸 界面预览

- 紫色渐变主题
- 大字体计时器显示
- 实时进度条
- 一键开始/停止
- 灵活设置面板

## 🚀 打包说明

### Windows 打包

1. 安装 Node.js (v18+)
2. 安装 Wine（用于 cross-compile）：
   ```bash
   sudo apt-get install wine
   ```
3. 打包：
   ```bash
   npm install
   npm run build:win
   ```
4. 输出位置：`dist/休息提醒助手 Setup 1.0.0.exe`

### macOS 打包

```bash
npm install
npm run build:mac
```

### Linux 打包

```bash
npm install
npm run build
```

## ⚙️ 配置说明

首次运行会自动创建 `config.json`：

```json
{
  "workDuration": 45,    // 工作时长（分钟）
  "restDuration": 5,     // 休息时长（分钟）
  "enableLock": false,   // 休息时锁屏
  "sound": true          // 提示音
}
```

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 开发模式运行
npm start

# 打包
npm run build
```

## 📁 文件结构

```
rest-reminder-gui/
├── main.js           # Electron 主进程
├── preload.js        # 预加载脚本
├── index.html        # 界面 HTML
├── styles.css        # 样式文件
├── renderer.js       # 界面逻辑
├── config.json       # 配置文件
├── icon.png          # 应用图标
└── package.json      # 项目配置
```

## 🔧 故障排除

### Windows 打包失败
- 确保安装了 Wine: `wine --version`
- 确保网络连接正常（需要下载 Electron）

### 通知不显示
- Windows: 检查系统通知设置
- Linux: 确保安装了通知守护进程
- macOS: 检查系统偏好设置 - 通知

### 锁屏功能无效
- Windows: 需要管理员权限
- Linux: 需要 GNOME/KDE 桌面环境
- macOS: 系统自动管理

## 📝 更新日志

### v1.0.0 (2026-03-12)
- ✅ 首次发布
- ✅ 基础计时功能
- ✅ GUI 界面
- ✅ 系统托盘
- ✅ 使用统计

## 🦞 关于

**作者**: 龙虾编辑部 - 技术开发  
**许可证**: MIT  
**技术支持**: OpenClaw 社区

---

💡 **健康提示**: 长时间工作有害健康，记得定时休息！
