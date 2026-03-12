/**
 * 渲染进程 - 界面逻辑
 */

let currentConfig = {
  workDuration: 45,
  restDuration: 5,
  enableLock: false,
  sound: true
};

let isRunning = false;
let isWorkMode = false;
let remainingSeconds = 0;
let totalSeconds = 0;
let timerInterval = null;

// 统计数据
let stats = {
  workCount: 0,
  restCount: 0,
  totalWorkTime: 0,
  totalRestTime: 0
};

// DOM 元素
const timerLabel = document.getElementById('timerLabel');
const timerTime = document.getElementById('timerTime');
const timerStatus = document.getElementById('timerStatus');
const statusDot = document.querySelector('.status-dot');
const statusText = document.querySelector('.status-text');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const startWorkBtn = document.getElementById('startWorkBtn');
const startRestBtn = document.getElementById('startRestBtn');
const stopBtn = document.getElementById('stopBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

// 设置输入
const workDurationInput = document.getElementById('workDuration');
const restDurationInput = document.getElementById('restDuration');
const enableLockInput = document.getElementById('enableLock');
const soundInput = document.getElementById('sound');

// 统计显示
const workCountEl = document.getElementById('workCount');
const restCountEl = document.getElementById('restCount');
const totalWorkTimeEl = document.getElementById('totalWorkTime');
const totalRestTimeEl = document.getElementById('totalRestTime');

// 格式化时间
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 更新计时器显示
function updateTimerDisplay() {
  timerTime.textContent = formatTime(remainingSeconds);
  
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${Math.round(progress)}%`;
}

// 更新状态
function updateStatus(status, text) {
  statusDot.className = 'status-dot ' + status;
  statusText.textContent = text;
}

// 开始工作计时
function startWork() {
  if (isRunning) return;
  
  isRunning = true;
  isWorkMode = true;
  remainingSeconds = currentConfig.workDuration * 60;
  totalSeconds = remainingSeconds;
  
  timerLabel.textContent = '工作中...';
  updateStatus('working', '专注工作');
  document.querySelector('.timer-display').classList.add('active');
  
  startWorkBtn.disabled = true;
  startRestBtn.disabled = true;
  stopBtn.disabled = false;
  
  updateTimerDisplay();
  
  // 通知主进程启动计时器
  window.electronAPI.startTimer('work', currentConfig.workDuration);
  
  // 本地倒计时
  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();
    
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      stats.workCount++;
      stats.totalWorkTime += currentConfig.workDuration;
      updateStats();
    }
  }, 1000);
}

// 开始休息计时
function startRest() {
  if (isRunning) return;
  
  isRunning = true;
  isWorkMode = false;
  remainingSeconds = currentConfig.restDuration * 60;
  totalSeconds = remainingSeconds;
  
  timerLabel.textContent = '休息中...';
  updateStatus('resting', '放松休息');
  document.querySelector('.timer-display').classList.add('active');
  
  startWorkBtn.disabled = true;
  startRestBtn.disabled = true;
  stopBtn.disabled = false;
  
  updateTimerDisplay();
  
  // 通知主进程启动计时器
  window.electronAPI.startTimer('rest', currentConfig.restDuration);
  
  // 本地倒计时
  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();
    
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      stats.restCount++;
      stats.totalRestTime += currentConfig.restDuration;
      updateStats();
    }
  }, 1000);
}

// 停止计时
function stopTimer() {
  isRunning = false;
  isWorkMode = false;
  remainingSeconds = 0;
  totalSeconds = 0;
  
  clearInterval(timerInterval);
  timerInterval = null;
  
  timerLabel.textContent = '已停止';
  timerTime.textContent = formatTime(currentConfig.workDuration * 60);
  updateStatus('', '已停止');
  document.querySelector('.timer-display').classList.remove('active');
  progressFill.style.width = '0%';
  progressText.textContent = '0%';
  
  // 通知主进程停止计时器
  if (isWorkMode) {
    window.electronAPI.stopTimer('work');
  } else {
    window.electronAPI.stopTimer('rest');
  }
  
  startWorkBtn.disabled = false;
  startRestBtn.disabled = false;
  stopBtn.disabled = true;
}

// 更新统计显示
function updateStats() {
  workCountEl.textContent = stats.workCount;
  restCountEl.textContent = stats.restCount;
  totalWorkTimeEl.textContent = stats.totalWorkTime;
  totalRestTimeEl.textContent = stats.totalRestTime;
}

// 保存设置
function saveSettings() {
  const newConfig = {
    workDuration: parseInt(workDurationInput.value) || 45,
    restDuration: parseInt(restDurationInput.value) || 5,
    enableLock: enableLockInput.checked,
    sound: soundInput.checked
  };
  
  currentConfig = newConfig;
  window.electronAPI.saveConfig(newConfig);
  
  // 更新计时器显示
  if (!isRunning) {
    timerTime.textContent = formatTime(currentConfig.workDuration * 60);
  }
  
  // 显示保存成功提示
  saveSettingsBtn.textContent = '✅ 已保存';
  setTimeout(() => {
    saveSettingsBtn.textContent = '💾 保存设置';
  }, 2000);
}

// 加载设置
function loadSettings() {
  workDurationInput.value = currentConfig.workDuration;
  restDurationInput.value = currentConfig.restDuration;
  enableLockInput.checked = currentConfig.enableLock;
  soundInput.checked = currentConfig.sound;
  
  timerTime.textContent = formatTime(currentConfig.workDuration * 60);
}

// 事件监听
startWorkBtn.addEventListener('click', startWork);
startRestBtn.addEventListener('click', startRest);
stopBtn.addEventListener('click', stopTimer);
saveSettingsBtn.addEventListener('click', saveSettings);

// 从主进程接收事件
window.electronAPI.onConfigLoaded((config) => {
  currentConfig = config;
  loadSettings();
});

window.electronAPI.onConfigSaved((data) => {
  console.log('配置已保存', data);
});

window.electronAPI.onWorkComplete(() => {
  console.log('工作完成');
});

window.electronAPI.onRestComplete(() => {
  console.log('休息完成');
});

window.electronAPI.onStartRestAuto(() => {
  // 自动开始休息
  stopTimer();
  setTimeout(startRest, 1000);
});

window.electronAPI.onStartWork(() => {
  if (!isRunning) {
    startWork();
  }
});

window.electronAPI.onStartRest(() => {
  if (!isRunning) {
    startRest();
  }
});

// 初始化
loadSettings();
updateStats();
