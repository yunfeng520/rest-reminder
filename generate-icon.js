const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// 创建 256x256 画布
const canvas = createCanvas(256, 256);
const ctx = canvas.getContext('2d');

// 渐变背景
const gradient = ctx.createLinearGradient(0, 0, 256, 256);
gradient.addColorStop(0, '#667eea');
gradient.addColorStop(1, '#764ba2');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 256, 256);

// 绘制龙虾 emoji（用文字代替）
ctx.font = 'bold 160px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 5;
ctx.fillStyle = 'white';
ctx.fillText('🦞', 128, 128);

// 导出 PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, 'icon.png'), buffer);

console.log('✅ 图标已生成：icon.png (256x256)');

// 同时生成一个更小的版本用于托盘
const smallCanvas = createCanvas(32, 32);
const smallCtx = smallCanvas.getContext('2d');

// 缩小版本
smallCtx.drawImage(canvas, 0, 0, 32, 32);
const smallBuffer = smallCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, 'icon-32.png'), smallBuffer);

console.log('✅ 小图标已生成：icon-32.png (32x32)');
