
/* ===== پشتیبان سریع: اثر انگشت یا رمز + ورود پشتیبان سریع (افزودنی) ===== */
(function(){
function $(s){return document.querySelector(s)}
function toast(t){var e=$('#gtoast');if(!e)return;e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove('on')},3200)}
function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function hu(){return(window.HU||'').toLowerCase()}
function fpm(){try{return JSON.parse(localStorage.getItem('fp_map')||'{}')}catch(e){return{}}}
function fpOK(){return!!(window.PublicKeyCredential&&navigator.credentials&&(location.protocol==='https:'||location.hostname==='localhost'))}
function hasFp(){return fpOK()&&!!fpm()[hu()]}
function ub(s){var a=atob(s),u=new Uint8Array(a.length),i;for(i=0;i<a.length;i++)u[i]=a.charCodeAt(i);return u}
function verify(){var id=fpm()[hu()];if(!id)return Promise.resolve(false);
  return navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),allowCredentials:[{type:'public-key',id:ub(id),transports:['internal']}],userVerification:'required',timeout:60000}}).then(function(){return true},function(){return false})}
function spw(){try{var v=localStorage.getItem('bkfp_'+hu());return v?decodeURIComponent(escape(atob(v))):''}catch(e){return''}}
function setpw(p){try{localStorage.setItem('bkfp_'+hu(),btoa(unescape(encodeURIComponent(p))))}catch(e){}}
function clrpw(){try{localStorage.removeItem('bkfp_'+hu())}catch(e){}}
function lastBk(){try{return+localStorage.getItem('bk_last')||0}catch(x){return 0}}
var BTN='border:0;border-radius:10px;font-weight:700;padding:10px;';

/* ---- ساخت پشتیبان با اثر انگشت یا ذخیرهٔ رمز برای اثر انگشت ---- */
function runBackup(pw,cb){var before=lastBk();window.openBk();document.getElementById('kpw').value=pw;document.querySelector('[data-k="out"]').click();window.show('home');
  setTimeout(function(){var ok=lastBk()>before;toast(ok?'پشتیبان ساخته و ذخیره شد':'پشتیبان ساخته نشد؛ رمز یا ورود به حساب را بررسی کنید');if(cb)cb(ok)},2500)}
function decorate(d){var box=d.firstElementChild;if(!box||box.querySelector('#qbkfp')||box.querySelector('#qbkfpc'))return;var h='';
  if(hasFp())h='<label style="display:flex;gap:6px;align-items:center;margin-top:10px;font-size:.82rem;text-align:right"><input type="checkbox" id="qbkfpc"> ذخیرهٔ رمز روی همین گوشی برای استفاده با اثر انگشت</label>'+(spw()?'<button id="qbkfp" style="'+BTN+'width:100%;margin-top:10px;background:var(--gold);color:#fff">ساخت با اثر انگشت</button>':'<p class="hint" style="margin:8px 0 0;font-size:.8rem">یک‌بار با رمز پشتیبان بگیرید و این گزینه را تیک بزنید؛ از آن به بعد با اثر انگشت.</p>');
  else if(fpOK())h='<p class="hint" style="margin:8px 0 0;font-size:.8rem">برای اثر انگشت، ابتدا «فعال‌سازی اثر انگشت» را در بالای صفحهٔ اصلی بزنید.</p>';
  box.insertAdjacentHTML('beforeend',h)}
new MutationObserver(function(ms){ms.forEach(function(m){[].forEach.call(m.addedNodes,function(n){if(n.id==='qbkp')decorate(n)})})}).observe(document.body,{childList:true});
document.addEventListener('click',function(e){var t=e.target;
  if(t.id==='qbkok'){var c=$('#qbkfpc'),p=$('#qbkpw');if(c&&c.checked&&p&&p.value){var pw=p.value,before=lastBk();setTimeout(function(){if(lastBk()>before){setpw(pw);toast('اثر انگشت برای پشتیبان فعال شد')}},3000)}}
  else if(t.id==='qbkfp'){var q=$('#qbkp');verify().then(function(ok){if(!ok)return toast('تأیید اثر انگشت انجام نشد');var pw=spw();if(!pw)return toast('رمزی ذخیره نشده است');if(q)q.remove();runBackup(pw,function(good){if(!good){clrpw();toast('رمز ذخیره‌شده پاک شد؛ یک‌بار با رمز پشتیبان بگیرید')}})})}
},false);

/* ---- ورود (بازیابی) پشتیبان سریع ---- */
function openRestore(){if($('#qrst'))return;var d=document.createElement('div');d.id='qrst';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
  d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:70;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto';
  d.innerHTML='<div style="background:var(--card);color:var(--ink);border-radius:18px;padding:18px;width:100%;max-width:360px;max-height:90vh;overflow:auto"><h3 style="margin:0 0 8px;text-align:center">ورود پشتیبان سریع</h3><p class="hint" style="margin:0 0 8px;font-size:.85rem">فایل(های) پشتیبان را انتخاب کنید. برای هر فایل، رمز عبور صاحب همان فایل را وارد کنید'+(hasFp()?' یا اگر فایل مال خودتان است «اثر انگشت من» را بزنید.':'.')+'</p><input type="file" id="qrfi" class="in" multiple><div id="qrl"></div><div style="margin-top:12px;display:flex;gap:8px"><button id="qrok" style="'+BTN+'flex:1;background:var(--p);color:#fff">بررسی فایل‌ها</button><button id="qrno" style="'+BTN+'flex:1;border:1px solid var(--p);background:transparent;color:var(--p)">انصراف</button></div></div>';
  document.body.appendChild(d);var files=[];
  d.addEventListener('change',function(e){if(e.target.id!=='qrfi')return;files=[].slice.call(e.target.files);
    $('#qrl').innerHTML=files.map(function(f,i){return'<label style="display:block;margin-top:10px;font-size:.85rem;word-break:break-all">'+esc(f.name)+'</label><div style="display:flex;gap:6px"><input class="in qrp" type="password" autocomplete="off" placeholder="رمز عبور صاحب فایل" style="flex:1;min-width:0">'+(hasFp()?'<button data-i="'+i+'" class="qrf" style="'+BTN+'background:var(--gold);color:#fff;white-space:nowrap">اثر انگشت من</button>':'')+'</div>'}).join('')});
  d.addEventListener('click',function(e){var t=e.target;
    if(t===d||t.id==='qrno'){d.remove();return}
    if(t.classList.contains('qrf')){var i=+t.dataset.i;verify().then(function(ok){if(!ok)return toast('تأیید اثر انگشت انجام نشد');var pw=spw();if(!pw)return toast('رمزی برای اثر انگشت ذخیره نشده است؛ ابتدا در «پشتیبان سریع» گزینهٔ ذخیرهٔ رمز را تیک بزنید');var inp=d.querySelectorAll('.qrp')[i];if(inp)inp.value=pw;toast('رمز شما برای این فایل وارد شد')});return}
    if(t.id==='qrok'){if(!files.length)return toast('ابتدا فایل پشتیبان را انتخاب کنید');var pws=[].map.call(d.querySelectorAll('.qrp'),function(x){return x.value});
      if(pws.some(function(x){return!x}))return toast('رمز همهٔ فایل‌ها را وارد کنید یا اثر انگشت بزنید');
      try{var dt=new DataTransfer();files.forEach(function(f){dt.items.add(f)});d.remove();window.openBk();var inp=document.getElementById('kfi');inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));
        [].forEach.call(document.querySelectorAll('.kpi'),function(x,i){x.value=pws[i]||''});document.querySelector('[data-k="chk"]').click();toast('فایل‌ها بررسی می‌شوند؛ خلاصه را ببینید و تأیید کنید')}
      catch(x){toast('این مرورگر انتقال خودکار فایل را پشتیبانی نمی‌کند؛ فایل را در بخش پشتیبان‌گیری انتخاب کنید')}}
  })}
function addBtn(){var q=document.getElementById('qbkb');if(!q||document.getElementById('qrb'))return;var b=document.createElement('button');b.id='qrb';b.textContent='ورود پشتیبان سریع';
  b.style.cssText='padding:11px 24px;border-radius:14px;border:2px solid var(--p);background:transparent;color:var(--p);font-weight:700;font-size:.95rem;margin:6px 4px 0';b.onclick=openRestore;q.parentNode.appendChild(b)}

/* ---- اثر انگشت در صفحهٔ اصلی پشتیبان‌گیری ---- */
function decBk(){var kb=document.getElementById('bksb');if(!kb)return;var out=kb.querySelector('[data-k="out"]');
  if(out&&!document.getElementById('bkfpo')){var h='';
    if(hasFp())h='<label style="display:flex;gap:6px;align-items:center;margin-top:8px;font-size:.85rem"><input type="checkbox" id="bkfps"> ذخیرهٔ رمز روی همین گوشی برای استفاده با اثر انگشت</label>'+(spw()?'<button class="sec" id="bkfpo" style="margin-top:8px">ساخت با اثر انگشت</button>':'<span id="bkfpo" hidden></span>');
    if(h)out.insertAdjacentHTML('afterend',h)}
  if(hasFp())[].forEach.call(kb.querySelectorAll('.kpi'),function(inp){var n=inp.nextElementSibling;if(n&&n.classList.contains('bkfpi'))return;inp.insertAdjacentHTML('afterend','<button class="sec bkfpi" style="margin:4px 0 8px">اثر انگشت من</button>')})}
var kbn=document.getElementById('bksb');if(kbn){new MutationObserver(decBk).observe(kbn,{childList:true,subtree:true});decBk()}
document.addEventListener('click',function(e){var t=e.target;
  if(t.dataset&&t.dataset.k==='out'){var c=$('#bkfps'),p=$('#kpw');if(c&&c.checked&&p&&p.value){var pw=p.value,b0=lastBk();setTimeout(function(){if(lastBk()>b0){setpw(pw);toast('اثر انگشت برای پشتیبان فعال شد')}},3000)}}
  else if(t.id==='bkfpo'&&t.tagName==='BUTTON'){verify().then(function(ok){if(!ok)return toast('تأیید اثر انگشت انجام نشد');var pw=spw();if(!pw)return toast('رمزی ذخیره نشده است');var b0=lastBk();$('#kpw').value=pw;document.querySelector('[data-k="out"]').click();setTimeout(function(){if(lastBk()<=b0){clrpw();toast('رمز ذخیره‌شده پاک شد؛ یک‌بار با رمز پشتیبان بگیرید')}},2500)})}
  else if(t.classList&&t.classList.contains('bkfpi')){verify().then(function(ok){if(!ok)return toast('تأیید اثر انگشت انجام نشد');var pw=spw();if(!pw)return toast('رمزی برای اثر انگشت ذخیره نشده است؛ ابتدا در بخش خروجی گزینهٔ ذخیرهٔ رمز را تیک بزنید');var i=t.previousElementSibling;if(i)i.value=pw;toast('رمز شما برای این فایل وارد شد')})}
},false);
var tries=0,poll=setInterval(function(){addBtn();if(document.getElementById('qrb')||++tries>60)clearInterval(poll)},250);
})();
