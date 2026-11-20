# برنامهٔ هیئت معظم ابناءالحسن (علیهم السلام)

برنامهٔ مدیریت امور هیئت — فارسی، راست‌به‌چپ، **کاملاً آفلاین** و بدون سرور.
این مخزن، نسخهٔ **۴۱** برنامه را به‌صورت پروژهٔ مرتب درآورده است و با **GitHub Actions** سه خروجی می‌سازد:

| خروجی | چیست؟ | چطور به دست می‌آید؟ |
|---|---|---|
| `heyat-offline.html` | همان فایل تک‌فایل؛ با هر مرورگر باز می‌شود | Actions ← Artifacts، یا صفحهٔ Releases |
| نسخهٔ وب نصب‌شدنی (PWA) | آدرس اینترنتی؛ «افزودن به صفحهٔ اصلی» و کار بدون اینترنت | GitHub Pages (خودکار) |
| `heyat-debug.apk` / `heyat-release.apk` | اپ اندروید | Actions ← Artifacts، یا صفحهٔ Releases |

> فایل ساخته‌شده از این پروژه با فایل اصلی `heyat-offline-v41.html` **بایت‌به‌بایت یکسان** است
> (`npm run check:v41` همین را ثابت می‌کند)؛ یعنی هیچ قابلیتی کم یا زیاد نشده است.

## شروع سریع (۵ مرحله)

1. در GitHub یک مخزن جدید بسازید (ترجیحاً **Private**، دلیلش پایین‌تر).
2. محتوای این پوشه را در آن بریزید:
   ```bash
   git init -b main
   git add .
   git commit -m "نسخهٔ ۴۱"
   git remote add origin https://github.com/<نام‌کاربری>/<نام‌مخزن>.git
   git push -u origin main
   ```
3. در GitHub: **Settings ← Pages ← Source: GitHub Actions** (برای نسخهٔ وب).
4. به تب **Actions** بروید؛ بعد از چند دقیقه:
   - workflow «CI» فایل `heyat-offline-html` را می‌سازد،
   - «انتشار نسخهٔ وب» آدرس سایت را می‌دهد،
   - «ساخت APK اندروید» فایل `heyat-android-apk` را می‌سازد (Artifacts پایین صفحهٔ اجرا).
5. برای انتشار رسمی نسخه: `node build/bump.mjs` سپس
   ```bash
   git commit -am "نسخهٔ ۴۲" && git tag v42.0.0 && git push --follow-tags
   ```
   فایل‌ها خودکار در **Releases** قرار می‌گیرند.

راهنمای کامل‌تر با تصویرِ مرحله‌ها: [`docs/GITHUB-GUIDE.md`](docs/GITHUB-GUIDE.md)

## کار روی کد (روی کامپیوتر)

فقط **Node.js 18 یا بالاتر** لازم است؛ برای ساخت وب هیچ پکیجی نصب نمی‌شود.

```bash
npm run dev      # ساخت خودکار + نمایش روی http://localhost:8080
npm run build    # ساخت dist/
npm test         # ساخت + 27 بررسی سلامت
node build/bump.mjs   # افزایش شماره نسخه (برنامه + package.json)
```

## ساختار پوشه‌ها

```
src/
  index.template.html      قالب صفحه (توکن‌هایی مثل {{inline:...}})
  css/                     استایل‌ها به ترتیب اجرا
  js/                      اسکریپت‌های کمکی (پشتیبان سریع، موتور مالی، ایستگاه صلواتی، …)
  js/main/                 هستهٔ برنامه، یک فایل برای هر بخش (حضور، مالی، انضباطی، …)
  assets/                  فونت و لوگو (هنگام ساخت داخل HTML جاسازی می‌شوند)
  pwa/                     manifest، service worker، آیکون‌ها
  native/android-shim.js   پل ذخیره/اشتراک‌گذاری فایل برای اندروید
build/                     ساخت، تست، سرور توسعه، نسخه‌دهی، آماده‌سازی اندروید
assets/                    تصاویر آیکون و صفحهٔ شروع اندروید (ورودی capacitor-assets)
legacy/                    فایل اصلی v41 برای مقایسه
docs/                      مستندات
.github/workflows/         ci / pages / android / release
```

## مستندات

- [`docs/FEATURES.md`](docs/FEATURES.md) — فهرست کامل قابلیت‌های برنامه
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — ساختار فنی و نحوهٔ ساخت
- [`docs/GITHUB-GUIDE.md`](docs/GITHUB-GUIDE.md) — راه‌اندازی GitHub، Pages و Releases
- [`docs/ANDROID.md`](docs/ANDROID.md) — ساخت و امضای APK
- [`docs/DATA-AND-BACKUP.md`](docs/DATA-AND-BACKUP.md) — محل ذخیرهٔ داده و فرمت پشتیبان
- [`docs/UPDATING.md`](docs/UPDATING.md) — چطور تغییر بدهیم و نسخهٔ جدید بدهیم

## نکتهٔ مهم دربارهٔ حریم خصوصی

- همهٔ داده‌ها فقط در **حافظهٔ مرورگر/اپ همان دستگاه** ذخیره می‌شود؛ هیچ داده‌ای به GitHub نمی‌رود.
- اما **کد برنامه** شامل نام چند نفر (مسئولان انتقاد/پیشنهاد و انضباطی) است. اگر مخزن **Public** باشد این نام‌ها برای همه دیده می‌شود. پس مخزن را **Private** نگه دارید.
- GitHub Pages برای مخزن Private فقط در پلن‌های پولی کار می‌کند. اگر پلن رایگان دارید، از **APK** یا **فایل HTML** (که از Actions/Releases می‌گیرید) استفاده کنید، یا خروجی `dist/web` را روی Cloudflare Pages / Netlify بگذارید.

## محدودیت‌های شناخته‌شده

- هر نسخه (فایل HTML، آدرس وب، اپ اندروید) **حافظهٔ جداگانه** دارد. برای انتقال داده بین آن‌ها از «پشتیبان‌گیری» استفاده کنید.
- اثر انگشت (WebAuthn) فقط روی `https` یا `localhost` کار می‌کند؛ روی فایل HTML باز شده از حافظهٔ گوشی و احتمالاً داخل WebView اندروید در دسترس نیست.
- پیام‌رسان ایتا/تلگرام/واتساپ لینک `wa.me` را باز می‌کنند؛ ارسال خودکار پیام ممکن نیست و کاربر باید دکمهٔ ارسال را بزند.
