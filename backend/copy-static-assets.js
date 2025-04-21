const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src/ipfs/ipfs-uploader.mjs');
const dest = path.join(__dirname, 'dist/ipfs/ipfs-uploader.mjs');

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);

console.log('📦 Copied ipfs-uploader.mjs to dist/');