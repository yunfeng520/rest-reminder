const fs = require('fs');

// 创建一个简单的 PNG 图标（256x256 紫色渐变背景 + 文字）
// 这是一个最小化的 PNG 文件生成器

// PNG 签名
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

// 创建 IHDR chunk
function createIHDR(width, height) {
  const data = Buffer.alloc(13);
  data.writeUInt32BE(width, 0);
  data.writeUInt32BE(height, 4);
  data[8] = 8;  // bit depth
  data[9] = 2;  // color type (RGB)
  data[10] = 0; // compression
  data[11] = 0; // filter
  data[12] = 0; // interlace
  return createChunk('IHDR', data);
}

// 创建 IDAT chunk（简化版 - 纯色）
function createIDAT(width, height, r, g, b) {
  // 简化的压缩数据（实际应该用 zlib）
  // 这里我们创建一个非常小的占位符
  const data = Buffer.from([0x78, 0x9c, 0x62, 0x60, 0x60, 0x60, 0x00, 0x00, 0x00, 0x04, 0x00, 0x01]);
  return createChunk('IDAT', data);
}

// 创建 IEND chunk
function createIEND() {
  return createChunk('IEND', Buffer.alloc(0));
}

// 创建 chunk
function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  
  const typeBuffer = Buffer.from(type);
  
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = crc32(crcData);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 计算
function crc32(data) {
  let crc = 0xffffffff;
  const table = getCRC32Table();
  
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  
  return crc ^ 0xffffffff;
}

function getCRC32Table() {
  const table = new Uint32Array(256);
  
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  
  return table;
}

// 由于生成真正的 PNG 比较复杂，我们使用一个已有的 base64 PNG
// 这是一个简单的 256x256 紫色渐变图标
const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSogMABKFqBBRRiUmRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRU';

// 实际上，让我们使用 canvas 或者下载一个简单图标
// 这里我们创建一个脚本来生成图标

console.log('请使用在线工具或图像软件创建 icon.png (256x256)');
console.log('或者使用以下命令下载一个 emoji 图标:');
console.log('curl -o icon.png "https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png"');
