/**
 * 休息提醒助手 - Electron 主进程
 * 龙虾编辑部 - 技术开发
 */

const { app, BrowserWindow, Tray, Menu, ipcMain, Notification, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray = null;
let workTimer = null;
let restTimer = null;

// 配置文件路径
const CONFIG_PATH = path.join(__dirname, 'config.json');

// 默认配置
const DEFAULT_CONFIG = {
  workDuration: 45,
  restDuration: 5,
  enableLock: false,
  sound: true
};

// 加载配置
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('加载配置失败:', e);
  }
  return DEFAULT_CONFIG;
}

// 保存配置
function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

let config = loadConfig();

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 600,
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'icon.png'),
    show: true,
    alwaysOnTop: false
  });

  mainWindow.loadFile('index.html');
  
  // 窗口关闭时最小化到托盘（而不是退出）
  mainWindow.on('close', (e) => {
    if (app.isQuiting) {
      mainWindow = null;
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  // 发送初始配置到渲染进程
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (mainWindow) {
      mainWindow.webContents.send('config-loaded', config);
    }
  });
}

// 创建系统托盘
function createTray() {
  const iconPath = path.join(__dirname, 'icon.png');
  tray = new Tray(iconPath);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主界面',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: '开始工作',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('start-work');
        }
      }
    },
    {
      label: '开始休息',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('start-rest');
        }
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('休息提醒助手');
  tray.setContextMenu(contextMenu);
  
  // 点击托盘图标显示窗口
  tray.on('click', () => {
    mainWindow.show();
  });
}

// 发送通知
function sendNotification(title, body) {
  new Notification({
    title: title,
    body: body,
    icon: path.join(__dirname, 'icon.png'),
    silent: !config.sound
  }).show();
}

// 锁定屏幕
function lockScreen() {
  const { exec } = require('child_process');
  const os = require('os');
  const platform = os.platform();
  
  if (platform === 'win32') {
    exec('rundll32.exe user32.dll,LockWorkStation');
  } else if (platform === 'darwin') {
    exec('/System/Library/CoreServices/Menu\\ Extras/User.menu/Contents/Resources/CGSession -suspend');
  } else if (platform === 'linux') {
    exec('gnome-screensaver-command -l || dbus-send --type=method_call --dest=org.gnome.ScreenSaver /org/gnome/ScreenSaver org.gnome.ScreenSaver.Lock');
  }
}

// IPC 通信处理
ipcMain.on('get-config', (event) => {
  event.reply('config-loaded', config);
});

ipcMain.on('save-config', (event, newConfig) => {
  config = newConfig;
  saveConfig(config);
  event.reply('config-saved', { success: true });
});

ipcMain.on('start-timer', (event, { type, duration }) => {
  const minutes = duration * 60 * 1000;
  
  if (type === 'work') {
    workTimer = setTimeout(() => {
      sendNotification('⏰ 该休息了', '已经工作 ' + config.workDuration + ' 分钟了，站起来休息一下吧！');
      if (mainWindow) {
        mainWindow.webContents.send('work-complete');
      }
      // 自动开始休息
      startRestTimer();
    }, minutes);
  } else if (type === 'rest') {
    restTimer = setTimeout(() => {
      sendNotification('💪 休息结束', '休息时间到了！回来继续工作吧~');
      if (mainWindow) {
        mainWindow.webContents.send('rest-complete');
      }
    }, minutes);
    
    // 如果启用锁屏
    if (config.enableLock) {
      lockScreen();
    }
  }
});

ipcMain.on('stop-timer', (event, { type }) => {
  if (type === 'work' && workTimer) {
    clearTimeout(workTimer);
    workTimer = null;
  } else if (type === 'rest' && restTimer) {
    clearTimeout(restTimer);
    restTimer = null;
  }
});

function startRestTimer() {
  if (mainWindow) {
    mainWindow.webContents.send('start-rest-auto');
  }
}

// 应用就绪时创建窗口
app.whenReady().then(() => {
  createWindow();
  createTray();
});

// 所有窗口关闭时退出（除非是隐藏到托盘）
app.on('window-all-closed', () => {
  // Mac 上保持运行
  if (process.platform !== 'darwin') {
    // 不退出，保持托盘运行
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 退出前清理定时器
app.on('before-quit', () => {
  if (workTimer) clearTimeout(workTimer);
  if (restTimer) clearTimeout(restTimer);
});
