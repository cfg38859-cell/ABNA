#!/usr/bin/env node
/**
 * بررسی سلامت پروژه (بدون وابستگی):
 *   node build/verify.mjs                          ← ساخت + همهٔ بررسی‌ها
 *   node build/verify.mjs --against فایل.html      ← مقایسهٔ بایت‌به‌بایت با یک نسخه
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { assemble, build } from './build.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let fails = 0;
const ok = (m) => console.log('  ✔ ' + m);
const bad = (m) => { fails++; console.log('  ✘ ' + m); };
const check = (c, m) => (c ? ok(m) : bad(m));

/** بلوک‌های <script> واقعی را به ترتیب برمی‌گرداند (رشته‌های داخل JS نادیده گرفته می‌شوند). */
function scripts(html) {
  const out = []; let pos = 0;
  for (;;) {
    const m = /<script([^>]*)>/.exec(html.slice(pos));
    if (!m) break;
    const start = pos + m.index + m[0].length;
    const end = html.indexOf('</script>', start);
    if (end < 0) break;
    out.push({ attrs: m[1], code: html.slice(start, end) });
    pos = end + 9;
  }
  return out;
}

const argAgainst = process.argv.indexOf('--against');
if (argAgainst > 0) {
  const f = path.resolve(ROOT, process.argv[argAgainst + 1]);
  const a = Buffer.from(assemble(), 'utf8'), b = fs.readFileSync(f);
  console.log('مقایسه با', path.relative(ROOT, f));
  check(a.equals(b), `خروجی ساخت با فایل مرجع بایت‌به‌بایت یکسان است (${a.length} بایت)`);
  process.exit(fails ? 1 : 0);
}

console.log('ساخت…');
build();

console.log('\nبررسی نسخهٔ تک‌فایل');
const single = fs.readFileSync(path.join(ROOT, 'dist/heyat-offline.html'), 'utf8');
check(!/\{\{(inline|inline-dir|asset):/.test(single), 'توکن جایگزین‌نشده‌ای نمانده');
check(single.startsWith('<!DOCTYPE html>'), 'DOCTYPE');
check(/<html lang="fa" dir="rtl">/.test(single), 'زبان فارسی و راست‌به‌چپ');
check(single.includes('<!--HEYAT-APP-->'), 'نشانگر HEYAT-APP (برای بخش به‌روزرسانی)');
const ver = /var APP_VER=(\d+)/.exec(single);
check(!!ver, 'APP_VER = ' + (ver ? ver[1] : '؟'));
const pkgV = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
check(!!ver && pkgV.split('.')[0] === ver[1], `نسخهٔ package.json (${pkgV}) با APP_VER هم‌خوان است (برای هم‌گام کردن: node build/bump.mjs ${ver ? ver[1] : ''})`);
check(single.length < 2 * 1024 * 1024, `حجم ${(single.length / 1024).toFixed(0)} KB (کمتر از ۲MB)`);

const sc = scripts(single);
let parsed = 0;
sc.forEach((s, i) => {
  try { new vm.Script(s.code, { filename: `script#${i}` }); parsed++; }
  catch (e) { bad(`خطای نحوی در اسکریپت شمارهٔ ${i}: ${e.message}`); }
});
check(parsed === sc.length, `همهٔ ${sc.length} اسکریپت بدون خطای نحوی`);

const ids = ['splash', 'home', 'grid', 'section', 'att', 'fin', 'sg', 'dc', 'iv', 'lgs', 'bk', 'toast', 'gtoast', 'ftoast', 'sheet'];
const missing = ids.filter((id) => !single.includes(`id="${id}"`));
check(!missing.length, 'عناصر کلیدی صفحه موجودند' + (missing.length ? ' — کم: ' + missing.join(',') : ''));
check(/@font-face\{font-family:'OnvanFD'/.test(single) && /data:font\/otf;base64,/.test(single), 'فونت داخل فایل جاسازی شده');
check(/data:image\/webp;base64,/.test(single), 'لوگو داخل فایل جاسازی شده');
check(!/https?:\/\/(?!wa\.me|www\.w3\.org)/.test(single.replace(/data:[^"')]+/g, '')), 'هیچ وابستگی به منبع خارجی/CDN نیست (آفلاین)');

console.log('\nبررسی نسخهٔ وب (PWA)');
const web = path.join(ROOT, 'dist/web');
['index.html', 'manifest.webmanifest', 'sw.js', '404.html', '.nojekyll'].forEach((f) => check(fs.existsSync(path.join(web, f)), 'dist/web/' + f));
const mf = JSON.parse(fs.readFileSync(path.join(web, 'manifest.webmanifest'), 'utf8'));
check(mf.display === 'standalone' && mf.lang === 'fa' && mf.dir === 'rtl', 'manifest: standalone / fa / rtl');
mf.icons.forEach((ic) => check(fs.existsSync(path.join(web, ic.src)), 'آیکون ' + ic.src));
const sw = fs.readFileSync(path.join(web, 'sw.js'), 'utf8');
check(!sw.includes('__BUILD_ID__'), 'شناسهٔ ساخت در sw.js جایگزین شد');
try { new vm.Script(sw); ok('sw.js بدون خطای نحوی'); } catch (e) { bad('sw.js: ' + e.message); }
const webHtml = fs.readFileSync(path.join(web, 'index.html'), 'utf8');
check(webHtml.includes('rel="manifest"') && webHtml.includes("serviceWorker"), 'index.html به manifest و service worker وصل است');
scripts(webHtml).forEach((s, i) => { try { new vm.Script(s.code); } catch (e) { bad(`PWA اسکریپت ${i}: ${e.message}`); } });

console.log('\nبررسی نسخهٔ اندروید');
const an = fs.readFileSync(path.join(ROOT, 'dist/android-www/index.html'), 'utf8');
check(an.includes('HTMLAnchorElement.prototype.click'), 'پل ذخیره/اشتراک‌گذاری فایل داخل نسخهٔ اندروید است');
check(an.indexOf('HTMLAnchorElement.prototype.click') < an.indexOf('var APP_VER='), 'پل قبل از کد برنامه اجرا می‌شود');
scripts(an).forEach((s, i) => { try { new vm.Script(s.code); } catch (e) { bad(`اندروید اسکریپت ${i}: ${e.message}`); } });
const cap = JSON.parse(fs.readFileSync(path.join(ROOT, 'capacitor.config.json'), 'utf8'));
check(cap.webDir === 'dist/android-www' && fs.existsSync(path.join(ROOT, cap.webDir, 'index.html')), 'capacitor.config.json به dist/android-www اشاره می‌کند');

console.log(fails ? `\n✘ ${fails} مورد ناموفق` : '\n✔ همه‌چیز سالم است');
process.exit(fails ? 1 : 0);
