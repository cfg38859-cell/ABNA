#!/usr/bin/env node
/**
 * ساخت برنامهٔ هیئت از روی فایل‌های src/
 *
 * خروجی‌ها (پوشهٔ dist/):
 *   heyat-offline.html     نسخهٔ تک‌فایل (همان فایلی که کاربران باز می‌کنند)
 *   web/                   نسخهٔ وب نصب‌شدنی (PWA) برای GitHub Pages
 *   android-www/           نسخهٔ داخل اپ اندروید (Capacitor)
 *   heyat-web.zip          آرشیو نسخهٔ وب (در صورت وجود دستور zip)
 *
 * بدون هیچ وابستگی؛ فقط Node.js 18 به بالا.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const MIME = { '.otf': 'font/otf', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');

/** جایگزینی توکن‌های قالب با محتوای فایل‌ها. */
export function assemble() {
  let html = read('index.template.html');
  html = html.replace(/\{\{inline-dir:([^}]+)\}\}/g, (_, dir) => {
    const abs = path.join(SRC, dir);
    return fs.readdirSync(abs).filter((f) => !f.startsWith('.')).sort().map((f) => fs.readFileSync(path.join(abs, f), 'utf8')).join('');
  });
  html = html.replace(/\{\{inline:([^}]+)\}\}/g, (_, f) => read(f));
  // دارایی‌ها (فونت، لوگو) داخل CSS هم هستند؛ بنابراین بعد از inline جایگزین می‌شوند.
  html = html.replace(/\{\{asset:([^}]+)\}\}/g, (_, f) => {
    const buf = fs.readFileSync(path.join(SRC, f));
    return `data:${MIME[path.extname(f)]};base64,${buf.toString('base64')}`;
  });
  const left = html.match(/\{\{(inline|inline-dir|asset):[^}]*\}\}/);
  if (left) throw new Error('توکن جایگزین‌نشده: ' + left[0]);
  return html;
}

/** وارد کردن تکه‌ای در محل دقیق (فقط ساختار واقعی صفحه؛ رشته‌های داخل JS نادیده گرفته می‌شوند). */
function injectHead(html, snippet) {
  const i = html.indexOf('</head>');
  if (i < 0) throw new Error('</head> پیدا نشد');
  return html.slice(0, i) + snippet + html.slice(i);
}
function injectHeadStart(html, snippet) {
  const mark = '<!--HEYAT-APP-->';
  const i = html.indexOf(mark);
  if (i < 0) throw new Error('نشانگر HEYAT-APP پیدا نشد');
  return html.slice(0, i + mark.length) + snippet + html.slice(i + mark.length);
}
function injectBodyEnd(html, snippet) {
  const i = html.lastIndexOf('</body>');
  if (i < 0) throw new Error('</body> پیدا نشد');
  return html.slice(0, i) + snippet + html.slice(i);
}

const rimraf = (p) => fs.rmSync(p, { recursive: true, force: true });
const mkdirp = (p) => fs.mkdirSync(p, { recursive: true });
const copyDir = (a, b) => fs.cpSync(a, b, { recursive: true });

function pwaHead() {
  return [
    '<link rel="manifest" href="manifest.webmanifest">',
    '<link rel="icon" type="image/png" href="icons/icon-192.png">',
    '<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">',
    '<meta name="mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-title" content="هیئت">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
    '',
  ].join('\n');
}
const swRegister = `<script>if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}</script>\n`;

export function build() {
  rimraf(DIST);
  mkdirp(DIST);

  // ۱) نسخهٔ تک‌فایل — بدون هیچ تغییری نسبت به قالب
  const single = assemble();
  fs.writeFileSync(path.join(DIST, 'heyat-offline.html'), single);

  // ۲) نسخهٔ وب نصب‌شدنی (PWA)
  const web = path.join(DIST, 'web');
  mkdirp(web);
  let webHtml = injectHead(single, pwaHead());
  webHtml = injectBodyEnd(webHtml, swRegister);
  fs.writeFileSync(path.join(web, 'index.html'), webHtml);
  copyDir(path.join(SRC, 'pwa', 'icons'), path.join(web, 'icons'));
  const manifest = fs.readFileSync(path.join(SRC, 'pwa', 'manifest.webmanifest'), 'utf8');
  fs.writeFileSync(path.join(web, 'manifest.webmanifest'), manifest);
  fs.writeFileSync(path.join(web, '.nojekyll'), '');
  fs.writeFileSync(path.join(web, '404.html'), webHtml); // جلوگیری از صفحهٔ ۴۰۴ در GitHub Pages
  const hash = crypto.createHash('sha256').update(webHtml).digest('hex').slice(0, 10);
  const sw = fs.readFileSync(path.join(SRC, 'pwa', 'sw.js'), 'utf8').replace('__BUILD_ID__', `${pkg.version}-${hash}`);
  fs.writeFileSync(path.join(web, 'sw.js'), sw);

  // ۳) نسخهٔ اندروید (Capacitor): با پل ذخیره/اشتراک‌گذاری فایل
  const www = path.join(DIST, 'android-www');
  mkdirp(www);
  const shim = `<script>\n${read('native/android-shim.js')}\n</script>`;
  fs.writeFileSync(path.join(www, 'index.html'), injectHeadStart(single, shim));

  // ۴) zip نسخهٔ وب (اختیاری)
  try {
    execSync('zip -qr ../heyat-web.zip .', { cwd: web, stdio: 'ignore' });
  } catch { /* zip نصب نیست؛ مهم نیست */ }

  const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0) + ' KB';
  console.log('✔ ساخته شد');
  console.log('  dist/heyat-offline.html  ', kb(path.join(DIST, 'heyat-offline.html')));
  console.log('  dist/web/                (PWA، ' + `build ${pkg.version}-${hash})`);
  console.log('  dist/android-www/        (Capacitor)');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
