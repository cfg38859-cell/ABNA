#!/usr/bin/env node
/** افزایش شمارهٔ نسخه در یک حرکت:  node build/bump.mjs        (۴۱ → ۴۲)
 *                                   node build/bump.mjs 50     (مستقیم ۵۰)
 *  هم APP_VER داخل برنامه (که بخش «به‌روزرسانی» به آن نگاه می‌کند) و هم version در package.json عوض می‌شود. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const f = path.join(ROOT, 'src/js/02-self-update-loader.js');
const src = fs.readFileSync(f, 'utf8');
const cur = +/var APP_VER=(\d+)/.exec(src)[1];
const next = +process.argv[2] || cur + 1;
fs.writeFileSync(f, src.replace(/var APP_VER=\d+/, `var APP_VER=${next}`));
const pj = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pj, 'utf8'));
pkg.version = `${next}.0.0`;
fs.writeFileSync(pj, JSON.stringify(pkg, null, 2) + '\n');
console.log(`✔ نسخه ${cur} → ${next}  (package.json: ${pkg.version})`);
console.log(`  بعدش:  git commit -am "v${next}" && git tag v${next}.0.0 && git push --follow-tags`);
