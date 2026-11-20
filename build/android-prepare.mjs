#!/usr/bin/env node
/** بعد از «npx cap add android»: شمارهٔ نسخهٔ اپ را در build.gradle می‌گذارد.
 *  VERSION_CODE و VERSION_NAME را می‌توان از محیط داد (در GitHub Actions از شمارندهٔ اجرا). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const g = path.join(ROOT, 'android/app/build.gradle');
if (!fs.existsSync(g)) { console.error('android/app/build.gradle پیدا نشد؛ اول «npx cap add android» را اجرا کنید.'); process.exit(1); }

const [maj, min, pat] = pkg.version.split('.').map(Number);
const code = +process.env.VERSION_CODE || maj * 10000 + min * 100 + pat;
const name = process.env.VERSION_NAME || pkg.version;
let s = fs.readFileSync(g, 'utf8');
s = s.replace(/versionCode\s+\d+/, `versionCode ${code}`).replace(/versionName\s+"[^"]*"/, `versionName "${name}"`);
fs.writeFileSync(g, s);
console.log(`✔ android versionCode=${code} versionName=${name}`);
