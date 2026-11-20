# راهنمای گام‌به‌گام GitHub

## ۱) ساخت مخزن
1. وارد github.com شوید ← **New repository**.
2. نام مثلاً `heyat-app`. نوع را **Private** بگذارید (دلیل: [README](../README.md#نکتهٔ-مهم-دربارهٔ-حریم-خصوصی)).
3. گزینه‌های README/.gitignore/License را **خالی** بگذارید (در پروژه هست).

## ۲) بارگذاری پروژه
اگر Git نصب دارید:
```bash
cd heyat-app
git init -b main
git add .
git commit -m "نسخهٔ ۴۱"
git remote add origin https://github.com/<نام‌کاربری>/heyat-app.git
git push -u origin main
```
بدون Git: در صفحهٔ مخزن **Add file ← Upload files** و کل پوشه را بکشید (پوشهٔ `.github` را هم حتماً بگذارید؛ در بعضی سیستم‌ها پوشه‌های نقطه‌دار پنهان‌اند).

## ۳) فعال‌کردن نسخهٔ وب
**Settings ← Pages ← Build and deployment ← Source: GitHub Actions.**
بعد از اولین اجرای workflow، آدرس سایت (مثل `https://<نام‌کاربری>.github.io/heyat-app/`) در تب Actions و صفحهٔ Pages دیده می‌شود. اعضا آدرس را باز می‌کنند ← منوی مرورگر ← **افزودن به صفحهٔ اصلی**.

## ۴) گرفتن فایل‌ها
| چه می‌خواهید | کجا |
|---|---|
| فایل HTML | Actions ← آخرین اجرای **CI** ← پایین صفحه ← Artifacts ← `heyat-offline-html` |
| APK | Actions ← آخرین اجرای **ساخت APK اندروید** ← Artifacts ← `heyat-android-apk` |
| نسخهٔ رسمی | صفحهٔ **Releases** (بعد از زدن تگ) |

> Artifactها ۳۰ روز می‌مانند؛ برای نگهداری دائمی، Release بسازید.

## ۵) انتشار نسخهٔ رسمی (Release)
```bash
node build/bump.mjs                 # ۴۱ → ۴۲ (برنامه + package.json)
git commit -am "نسخهٔ ۴۲"
git tag v42.0.0
git push --follow-tags
```
تگ باید دقیقاً `v` + نسخهٔ package.json باشد (workflow این را چک می‌کند). نتیجه: Release با `heyat-offline-v42.0.0.html`، `heyat-web-v42.0.0.zip` و APK ها.

## ۶) امضای APK نهایی (اختیاری، یک‌بار)
بدون این مرحله فقط APK آزمایشی (debug) ساخته می‌شود که نصبش روی گوشی هم ممکن است. برای APK امضاشده: [`ANDROID.md`](ANDROID.md#امضای-apk).

## عیب‌یابی
| مشکل | راه‌حل |
|---|---|
| Pages خطای ۴۰۴ می‌دهد | Source باید «GitHub Actions» باشد (نه «Deploy from a branch»)؛ بعد workflow را دوباره اجرا کنید |
| Pages روی مخزن Private کار نمی‌کند | پلن رایگان پشتیبانی نمی‌کند؛ از APK/HTML استفاده کنید یا `dist/web` را روی Cloudflare Pages/Netlify بگذارید |
| workflow APK قرمز شد | لاگ مرحلهٔ قرمز را باز کنید؛ معمولاً Gradle یا نسخهٔ Java. مرحلهٔ آیکون عمداً `continue-on-error` است و نباید ساخت را متوقف کند |
| Release ساخته نشد | تگ با نسخهٔ package.json نمی‌خواند؛ `node build/bump.mjs` را اجرا و دوباره تگ بزنید (`git tag -d vX` و `git push --delete origin vX` برای حذف تگ اشتباه) |
| بعد از به‌روزرسانی، نسخهٔ قدیمی را نشان می‌دهد | اگر قبلاً از بخش «به‌روزرسانی» برنامه نسخه‌ای نصب کرده‌اید، همان اولویت دارد؛ در بخش به‌روزرسانی «حذف نسخهٔ نصب» را بزنید. PWA: یک‌بار بسته و باز کنید تا service worker جدید فعال شود |
