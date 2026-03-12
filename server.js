#!/usr/bin/env node

/**
 * 简单的文件下载服务器
 * 用于提供休息提醒助手的安装包下载
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.exe': 'application/x-msdownload',
  '.dmg': 'application/x-apple-diskimage',
  '.AppImage': 'application/x-executable',
  '.snap': 'application/vnd.snap',
  '.deb': 'application/vnd.debian.binary-package',
  '.zip': 'application/zip',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // 处理下载请求
  if (req.url === '/' || req.url === '/index.html') {
    serveFile(res, path.join(__dirname, 'download.html'), 'text/html');
    return;
  }
  
  if (req.url === '/api/files') {
    serveFilesList(res);
    return;
  }
  
  // 处理静态文件
  let filePath = path.join(DIST_DIR, req.url);
  
  // 安全检查
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  if (fs.existsSync(filePath)) {
    serveFile(res, filePath);
  } else {
    res.writeHead(404);
    res.end('File not found');
  }
});

function serveFile(res, filePath, contentType) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = contentType || MIME_TYPES[ext] || 'application/octet-stream';
  
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    
    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': stats.size,
      'Content-Disposition': ext === '.html' ? 'inline' : `attachment; filename="${path.basename(filePath)}"`
    });
    
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

function serveFilesList(res) {
  fs.readdir(DIST_DIR, (err, files) => {
    if (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to read directory' }));
      return;
    }
    
    const fileList = files.map(file => {
      const filePath = path.join(DIST_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeHuman: formatSize(stats.size),
        isDirectory: stats.isDirectory(),
        downloadUrl: `/${file}`
      };
    }).filter(f => !f.isDirectory);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ files: fileList }, null, 2));
  });
}

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🦞 休息提醒助手 - 下载服务器');
  console.log('=====================================');
  console.log(`📡 服务器地址：http://localhost:${PORT}`);
  console.log(`📂 文件目录：${DIST_DIR}`);
  console.log('');
  console.log('可用端点:');
  console.log(`  - http://localhost:${PORT}/          下载页面`);
  console.log(`  - http://localhost:${PORT}/api/files 文件列表 API`);
  console.log(`  - http://localhost:${PORT}/<文件>     直接下载`);
  console.log('');
  console.log('按 Ctrl+C 停止服务器');
  console.log('');
});
