# اپ اندروید (Capacitor)

اپ اندروید همان برنامه است که داخل یک WebView اجرا می‌شود. پروژهٔ بومی اندروید **در مخزن نگهداری نمی‌شود**؛ هر بار در GitHub Actions با `npx cap add android` ساخته می‌شود (پوشهٔ `android/` در `.gitignore` است). این‌طوری مخزن سبک می‌ماند و هر ساخت تمیز است.

## ساخت روی GitHub (توصیه‌شده)
workflow «ساخت APK اندروید» با هر push به `main` اجرا می‌شود (یا دستی: Actions ← ساخت APK اندروید ← Run workflow). خروجی: Artifact با نام `heyat-android-apk` شامل `heyat-debug.apk` (و در صورت تنظیم امضا، `heyat-release.apk`).

## نصب روی گوشی
فایل APK را به گوشی منتقل کنید و باز کنید. اگر پیام «نصب از منابع ناشناس» آمد، در تنظیمات اجازه بدهید. APK آزمایشی (debug) برای استفادهٔ خودتان کافی است؛ برای توزیع بین اعضا APK امضاشده بهتر است.

## امضای APK
یک‌بار روی کامپیوتر (Java لازم است):
```bash
keytool -genkeypair -v -keystore heyat-release.jks -alias heyat \
  -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 heyat-release.jks > keystore.b64      # مک: base64 -i heyat-release.jks | tr -d '\n' > keystore.b64
```
در GitHub: **Settings ← Secrets and variables ← Actions ← New repository secret**:

| نام Secret | مقدار |
|---|---|
| `KEYSTORE_BASE64` | محتوای `keystore.b64` |
| `KEYSTORE_PASSWORD` | رمز keystore |
| `KEY_ALIAS` | `heyat` |
| `KEY_PASSWORD` | رمز کلید |

از این به بعد `heyat-release.apk` هم ساخته می‌شود.

> ⚠️ فایل `.jks` و رمزها را در جای امن نگه دارید و **هرگز در مخزن نگذارید**. اگر گم شود، دیگر نمی‌توانید نسخهٔ جدید را روی نصب قبلی به‌روزرسانی کنید.

## تنظیمات
- **شناسهٔ اپ** (`appId`) و **نام** در `capacitor.config.json`. شناسه پس از انتشار نباید عوض شود (`com.heyat.abnaalhasan` پیش‌فرض است).
- **شمارهٔ نسخه**: `versionName` از `package.json` و `versionCode` از شمارندهٔ اجرای workflow گرفته می‌شود (`build/android-prepare.mjs`).
- **آیکون و صفحهٔ شروع**: از `assets/*.png` ساخته می‌شود (با `@capacitor/assets`). برای تغییر، فقط همین تصاویر را عوض کنید (آیکون ۱۰۲۴×۱۰۲۴، صفحهٔ شروع ۲۷۳۲×۲۷۳۲).

## ساخت روی کامپیوتر خودتان
نیازمند Node 18+، JDK 17 و Android SDK (Android Studio):
```bash
npm install
npm run android:apk          # build + cap add + sync + gradle assembleDebug
# خروجی: android/app/build/outputs/apk/debug/app-debug.apk
```

## رفتار فایل‌ها در اپ
WebView اندروید دانلود فایل را پشتیبانی نمی‌کند؛ پل `src/native/android-shim.js` هر «دانلود» (پشتیبان، PDF، Word/Excel، VCF) را به **ذخیره + برگهٔ اشتراک‌گذاری اندروید** تبدیل می‌کند. از آن برگه می‌توانید «ذخیره در فایل‌ها»، ایتا، واتساپ و ... را انتخاب کنید.

## محدودیت‌ها و نکته‌ها
- **ورود با اثر انگشت** در WebView ممکن است در دسترس نباشد (برنامه خودش را بررسی می‌کند و دکمه را نشان نمی‌دهد). جایگزین: نسخهٔ وب (PWA) روی `https`.
- اطلاعات اپ جدا از نسخهٔ وب و فایل HTML است؛ با «پشتیبان‌گیری» منتقل کنید.
- حذف اپ = حذف داده‌ها. قبل از حذف یا پاک‌کردن حافظهٔ اپ، **حتماً پشتیبان بگیرید**.
- اولین ساخت واقعی APK روی GitHub Actions انجام می‌شود؛ اگر Gradle خطایی داد، لاگ مرحلهٔ قرمز را بررسی کنید (معمولاً نسخهٔ Java/Gradle).
