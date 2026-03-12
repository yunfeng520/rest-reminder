/**
 * 预加载脚本 - 安全桥接主进程和渲染进程
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 获取配置
  getConfig: () => ipcRenderer.invoke('get-config'),
  
  // 保存配置
  saveConfig: (config) => ipcRenderer.send('save-config', config),
  
  // 启动计时器
  startTimer: (type, duration) => ipcRenderer.send('start-timer', { type, duration }),
  
  // 停止计时器
  stopTimer: (type) => ipcRenderer.send('stop-timer', { type }),
  
  // 监听配置加载
  onConfigLoaded: (callback) => ipcRenderer.on('config-loaded', (event, config) => callback(config)),
  
  // 监听配置保存
  onConfigSaved: (callback) => ipcRenderer.on('config-saved', (event, data) => callback(data)),
  
  // 监听工作完成
  onWorkComplete: (callback) => ipcRenderer.on('work-complete', () => callback()),
  
  // 监听休息完成
  onRestComplete: (callback) => ipcRenderer.on('rest-complete', () => callback()),
  
  // 监听自动开始休息
  onStartRestAuto: (callback) => ipcRenderer.on('start-rest-auto', () => callback()),
  
  // 监听开始工作（从托盘）
  onStartWork: (callback) => ipcRenderer.on('start-work', () => callback()),
  
  // 监听开始休息（从托盘）
  onStartRest: (callback) => ipcRenderer.on('start-rest', () => callback())
});
