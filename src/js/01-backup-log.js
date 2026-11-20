
/* backup screen: activity log, full-restore switch, clear-all and delete-selected backup records */
(function(){
  function esc2(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function readLog(){try{return JSON.parse(localStorage.getItem('hdb_bk_log')||'{}')}catch(e){return{}}}
  function writeLog(m){try{localStorage.setItem('hdb_bk_log',JSON.stringify(m))}catch(e){}}
  window.bkLog=function(kind,detail){
    var e={by:window.HU||'ناشناس',at:Date.now(),kind:kind,detail:String(detail||'')};
    var m=readLog();m[e.at+'_'+Math.random().toString(36).slice(2,6)]=e;writeLog(m);
  };
  function clearAll(){
    if(!confirm('همهٔ داده‌های این گوشی (اعضا، مالی، دعوت‌ها، نظرها و…) پاک می‌شوند. حساب‌های کاربری و گزارش کاربران حفظ می‌شوند. ادامه می‌دهید؟'))return;
    var t=prompt('برای تأیید، عبارت «پاک کن» را بنویسید');
    if(t==null||t.trim()!=='پاک کن'){alert('عملیات لغو شد');return}
    var ks=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('hdb_')===0&&k!=='hdb_auth'&&k!=='hdb_bk_log')ks.push(k)}
    ks.push('hdb__del','hdb__arch');
    ks.forEach(function(k){localStorage.removeItem(k)});
    alert('داده‌ها پاک شد. برنامه دوباره باز می‌شود.');
    location.reload();
  }
  function deleteSelected(){
    var ids=[].map.call(document.querySelectorAll('#bklog input.bkdel:checked'),function(x){return x.getAttribute('data-id')});
    if(!ids.length)return alert('هیچ موردی انتخاب نشده است');
    if(!confirm(ids.length+' مورد از گزارش پشتیبان‌ها حذف شود؟'))return;
    var m=readLog();ids.forEach(function(id){delete m[id]});writeLog(m);render();
  }
  function render(){
    var c=document.getElementById('bksb');if(!c)return;
    ['fullcard','bklog','admincard'].forEach(function(id){var o=document.getElementById(id);if(o)o.remove()});
    var fc=document.createElement('div');fc.id='fullcard';fc.className='card';
    fc.innerHTML='<b>بازیابی کامل</b><p class="hint" style="margin:4px 0">اگر فعال شود، همهٔ داده‌های این گوشی (به جز حساب‌های کاربری) قبل از بازیابی با محتوای فایل پشتیبان جایگزین می‌شوند. کارهایی که بعد از آن پشتیبان ثبت شده‌اند حذف می‌شوند. پیش از این کار یک پشتیبان از وضعیت فعلی بگیرید.</p><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="fullr"> بازیابی کامل (جایگزینی)</label>';
    c.appendChild(fc);
    var log=readLog();
    var list=Object.keys(log).map(function(k){return[k,log[k]]}).sort(function(a,b){return b[1].at-a[1].at}).slice(0,50);
    var d=document.createElement('div');d.id='bklog';d.className='card';
    d.innerHTML='<b>گزارش کاربران</b>'+(list.length?list.map(function(p){
      var x=p[1];
      return'<div class="kv">'+(x.kind==='backup'?'<label style="display:flex;gap:6px;align-items:center"><input type="checkbox" class="bkdel" data-id="'+esc2(p[0])+'"><span>'+esc2(x.by)+' — پشتیبان</span></label>':'<span>'+esc2(x.by)+' — ادغام</span>')+'<small>'+esc2(new Date(x.at).toLocaleString('fa-IR'))+'</small></div>'+(x.detail?'<small class="hint">'+esc2(x.detail)+'</small>':'')
    }).join(''):'<p class="hint">هنوز فعالیتی ثبت نشده است.</p>');
    c.appendChild(d);
    var ac=document.createElement('div');ac.id='admincard';ac.className='card';
    ac.innerHTML='<b>مدیریت داده</b><p class="hint" style="margin:4px 0">حذف موارد انتخاب‌شده فقط گزارش را پاک می‌کند؛ فایل‌های پشتیبان روی گوشی را باید از مدیریت فایل خودتان پاک کنید.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button id="delsel" class="ib" style="flex:1">حذف موارد انتخاب‌شده</button><button id="clearall" class="ib" style="flex:1;background:#a33;color:#fff">پاک کردن همه داده‌ها</button></div>';
    c.appendChild(ac);
    document.getElementById('delsel').onclick=deleteSelected;
    document.getElementById('clearall').onclick=clearAll;
  }
  window.addEventListener('load',function(){
    var ob=window.openBk;
    if(typeof ob==='function')window.openBk=function(){ob();render()};
  });
})();
