
/* quick backup from the home screen (standalone, works after the main script) */
(function(){
  function toast(t){var e=document.getElementById('gtoast');if(!e)return;e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove('on')},2600)}
  function lastBk(){try{return +localStorage.getItem('bk_last')||0}catch(x){return 0}}
  function open(){
    if(document.getElementById('qbkp'))return;
    var d=document.createElement('div');d.id='qbkp';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','پشتیبان سریع');
    d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:70;display:flex;align-items:center;justify-content:center;padding:20px';
    d.innerHTML='<div style="background:var(--card);color:var(--ink);border-radius:18px;padding:18px;width:100%;max-width:320px;text-align:center"><h3 style="margin:0 0 8px">پشتیبان سریع</h3><p style="margin:0 0 10px;font-size:.9rem">رمز عبور حساب خود را وارد کنید</p><input type="password" id="qbkpw" autocomplete="off" style="width:100%;padding:10px;border-radius:10px;border:1px solid #bbb;box-sizing:border-box"><div style="margin-top:12px;display:flex;gap:8px"><button id="qbkok" style="flex:1;padding:10px;border:0;border-radius:10px;background:var(--p);color:#fff;font-weight:700">ساخت و ذخیره</button><button id="qbkno" style="flex:1;padding:10px;border-radius:10px;border:1px solid var(--p);background:transparent;color:var(--p)">انصراف</button></div></div>';
    document.body.appendChild(d);
    setTimeout(function(){var i=document.getElementById('qbkpw');if(i)i.focus()},50);
    d.onclick=function(e){
      if(e.target===d||e.target.id==='qbkno'){d.remove();return}
      if(e.target.id!=='qbkok')return;
      var pw=document.getElementById('qbkpw').value;
      if(!pw){toast('رمز عبور را وارد کنید');return}
      var before=lastBk();
      d.remove();
      window.openBk();
      document.getElementById('kpw').value=pw;
      document.querySelector('[data-k="out"]').click();
      window.show('home');
      setTimeout(function(){toast(lastBk()>before?'پشتیبان ساخته و ذخیره شد':'پشتیبان ساخته نشد؛ رمز یا ورود به حساب را بررسی کنید')},2500);
    };
  }
  function addButton(){
    var g=document.getElementById('grid');
    if(!g||document.getElementById('qbkb'))return;
    var w=document.createElement('div');w.style.cssText='text-align:center;padding:10px 14px 0';
    w.innerHTML='<button id="qbkb" style="padding:11px 24px;border:0;border-radius:14px;background:var(--p);color:#fff;font-weight:700;font-size:.95rem">پشتیبان سریع</button>';
    g.parentNode.insertBefore(w,g);
  }
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('#qbkb');if(t)open()});
  var tries=0;var poll=setInterval(function(){addButton();if(document.getElementById('qbkb')||++tries>40)clearInterval(poll)},250);
})();
