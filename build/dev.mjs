#!/usr/bin/env node
/** سرور توسعه: ساخت خودکار با هر تغییر در src/ و نمایش روی http://localhost:8080
 *  (localhost «زمینهٔ امن» است؛ پس اثر انگشت و service worker هم قابل آزمایش‌اند). */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WEB = path.join(ROOT, 'dist/web');
const PORT = +process.env.PORT || 8080;
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.css': 'text/css' };

let timer = null;
const rebuild = () => { clearTimeout(timer); timer = setTimeout(() => { try { build(); } catch (e) { console.error('✘', e.message); } }, 200); };
build();
fs.watch(path.join(ROOT, 'src'), { recursive: true }, rebuild);

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(WEB, path.normalize(p));
  if (!f.startsWith(WEB) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log(`\n🌐 http://localhost:${PORT}  (با هر تغییر در src/ دوباره ساخته می‌شود؛ Ctrl+C برای توقف)`));
