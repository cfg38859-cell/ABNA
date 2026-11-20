/* پل اندروید (فقط در اپ Capacitor)
 * WebView اندروید دانلود فایل blob: و navigator.share را پشتیبانی نمی‌کند.
 * این پل «دانلود» را به ذخیره در حافظهٔ موقت + برگهٔ اشتراک‌گذاری اندروید تبدیل می‌کند
 * تا پشتیبان، PDF، Word/Excel و VCF از داخل اپ قابل ذخیره و ارسال باشد.
 * اگر پلاگین‌ها در دسترس نباشند، هیچ کاری نمی‌کند و رفتار قبلی حفظ می‌شود. */
(function () {
  'use strict';
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;

  function plugin(n) { try { return (C.Plugins || {})[n] || null; } catch (e) { return null; } }
  function toast(t) {
    try {
      var e = document.getElementById('gtoast') || document.getElementById('ftoast') || document.getElementById('toast');
      if (!e) return;
      e.textContent = t; e.classList.add('on');
      setTimeout(function () { e.classList.remove('on'); }, 2600);
    } catch (x) {}
  }
  function blobToBase64(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(String(r.result).split(',')[1] || ''); };
      r.onerror = function () { rej(r.error); };
      r.readAsDataURL(blob);
    });
  }
  function safeName(n) { return String(n || 'file').replace(/[\\/:*?"<>|]+/g, '_'); }

  function saveAndShare(blob, name) {
    var FS = plugin('Filesystem'), SH = plugin('Share');
    if (!FS || !SH) { toast('ذخیرهٔ فایل در این دستگاه ممکن نیست'); return Promise.resolve(false); }
    name = safeName(name);
    return blobToBase64(blob).then(function (b64) {
      return FS.writeFile({ path: name, data: b64, directory: 'CACHE' });
    }).then(function (r) {
      return SH.share({ title: name, url: r.uri, dialogTitle: 'ذخیره یا ارسال فایل' });
    }).then(function () { return true; }).catch(function (e) {
      if (e && /cancel/i.test(String(e.message || e))) return false;
      toast('ذخیرهٔ فایل انجام نشد'); return false;
    });
  }

  /* ۱) a.download + blob: ← ذخیره و اشتراک‌گذاری */
  var origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    var a = this;
    if (a.download && /^blob:/.test(a.href)) {
      fetch(a.href).then(function (r) { return r.blob(); }).then(function (b) { return saveAndShare(b, a.download); });
      return;
    }
    return origClick.apply(a, arguments);
  };

  /* ۲) navigator.share برای متن (ارسال در پیام‌رسان) */
  if (!navigator.share) {
    navigator.share = function (d) {
      var SH = plugin('Share');
      if (!SH) return Promise.reject(new Error('no share'));
      d = d || {};
      return SH.share({ title: d.title || '', text: d.text || '', url: d.url || undefined, dialogTitle: 'ارسال' });
    };
  }
  /* canShare عمداً تعریف نمی‌شود تا برنامه برای فایل‌ها به مسیر a.download برگردد (بند ۱). */

  /* ۳) خروج از برنامه: «بله، خروج» در پنجرهٔ خروج برنامه، window.close() را صدا می‌زند.
   *    دکمهٔ برگشت اندروید عمداً دست‌نخورده می‌ماند تا منطق history/popstate خود برنامه کار کند. */
  var App = plugin('App');
  if (App && App.exitApp) {
    window.close = function () { try { App.exitApp(); } catch (e) {} };
  }
})();
