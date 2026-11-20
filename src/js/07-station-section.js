
/* ===== ایستگاه صلواتی: بخش اصلی جدید (افزودنی؛ بخش‌های دیگر بدون تغییر) ===== */
(function(){
var $=function(s){return document.querySelector(s)};
var MN=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fa(s){return String(s).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})}
function pad(n){return n<10?'0'+n:''+n}
function today(){var o={};new Intl.DateTimeFormat('en-u-ca-persian-nu-latn',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).forEach(function(x){o[x.type]=x.value});return{y:+o.year,m:+o.month,d:+o.day}}
function tk(){var o=today();return o.y+'-'+pad(o.m)+'-'+pad(o.d)}
function fd(k){return k?fa(String(k).replace(/-/g,'/')):'—'}
function grp(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function mn(n){n=Math.round(n||0);return fa((n<0?'-':'')+grp(Math.abs(n)))+' تومان'}
function norm(s){return String(s||'').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/\u200c/g,' ').replace(/[٠-٩]/g,function(d){return'٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[۰-۹]/g,function(d){return'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)}).replace(/\s+/g,' ').trim().toLowerCase()}
function A(v){return parseFloat(String(v==null?'':v).replace(/[٠-٩]/g,function(d){return'٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[۰-۹]/g,function(d){return'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)}).replace('٫','.').replace(/[^\d.]/g,''))||0}
function ic(x){return Math.round(A(x.qty)*A(x.price))}
function full(m){return((m.first||'')+' '+(m.last||'')).trim()}
function gt(t){var e=$('#gtoast');if(!e)return;e.textContent=t;e.classList.add('on');clearTimeout(gt.t);gt.t=setTimeout(function(){e.classList.remove('on')},2600)}
function mins(s){if(!s||!s.in||!s.out)return 0;var a=s.in.split(':'),b=s.out.split(':'),x=+a[0]*60+ +a[1],y=+b[0]*60+ +b[1];if(isNaN(x)||isNaN(y))return 0;if(y<x)y+=1440;return y-x}
function dur(m){if(!m)return '—';var h=Math.floor(m/60),r=m%60;return(h?fa(h)+' ساعت':'')+(h&&r?' و ':'')+(r?fa(r)+' دقیقه':'')}
function nowT(){var d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())}

var D={members:[],st:[],st_staff:[],st_disc:[]},db=null,init=0;
var C={tab:'rep',stk:'',rq:'',open:null,txt:0,del:null,dv:'add',edit:null,sg:'p',fm:'',fs:'all',fst:'',sq:'',mq:'',dq:''};

/* ---------- screen ---------- */
var scr=document.createElement('div');scr.id='stn';scr.className='screen top';
scr.innerHTML='<div class="bar"><button class="back back2" aria-label="بازگشت">→</button><h2>ایستگاه صلواتی</h2></div><div class="tabs" id="sttabs"></div><div class="bd" id="stbody"></div>';
document.body.appendChild(scr);
var B=$('#stbody');

/* ---------- data helpers ---------- */
function groups(){var g={};D.st.forEach(function(x){var k=x.station+'|'+x.time;(g[k]=g[k]||{k:k,station:x.station,time:x.time,items:[]}).items.push(x)});
return Object.keys(g).map(function(k){g[k].tot=g[k].items.reduce(function(s,i){return s+ic(i)},0);return g[k]}).sort(function(a,b){return(b.time||'')<(a.time||'')?-1:(b.time||'')>(a.time||'')?1:0})}
function gl(g){return g.station+' — '+fd(g.time)}
function sorted(){return D.members.slice().sort(function(a,b){return full(a).localeCompare(full(b),'fa')})}
function mname(id,fb){var m=D.members.filter(function(x){return x.id===id})[0];return m?full(m):(fb||'—')}
function stOpts(sel,none){var h=none?'<option value="">بدون ایستگاه مشخص</option>':'';return h+groups().map(function(g){return'<option value="'+esc(g.k)+'"'+(g.k===sel?' selected':'')+'>'+esc(gl(g))+'</option>'}).join('')}
function ensureStk(){var g=groups();if(!g.length){C.stk='';return}if(!g.some(function(x){return x.k===C.stk}))C.stk=g[0].k}
function staffOf(k){return D.st_staff.filter(function(x){return x.stk===k})}
function totMins(x){return(x.sessions||[]).reduce(function(s,v){return s+mins(v)},0)}
function dsel(k,v){var t=today(),p=v?v.split('-'):null,o=p?{y:+p[0],m:+p[1],d:+p[2]}:t,i,h='<div class="dp"><select id="'+k+'_d">';
for(i=1;i<=31;i++)h+='<option value="'+i+'"'+(i===o.d?' selected':'')+'>'+fa(i)+'</option>';
h+='</select><select id="'+k+'_m">';MN.forEach(function(n,j){h+='<option value="'+(j+1)+'"'+(j+1===o.m?' selected':'')+'>'+n+'</option>'});
h+='</select><select id="'+k+'_y">';for(i=Math.min(t.y-4,o.y);i<=Math.max(t.y+1,o.y);i++)h+='<option value="'+i+'"'+(i===o.y?' selected':'')+'>'+fa(i)+'</option>';return h+'</select></div>'}
function dget(k){var y=+$('#'+k+'_y').value,m=+$('#'+k+'_m').value,d=+$('#'+k+'_d').value;return y+'-'+pad(m)+'-'+pad(Math.min(d,window.jml?window.jml(y,m):30))}
function who(x){return typeof window.WHO==='function'?window.WHO(x):''}

/* ---------- views ---------- */
var TABS=[['rep','گزارش ایستگاه‌ها'],['staff','خادمین ایستگاه'],['disc','انضباطی'],['new','عضو جدید']];
function view(){
  $('#sttabs').innerHTML=TABS.map(function(t){return'<button class="'+(C.tab===t[0]?'on':'')+'" data-a="tab" data-t="'+t[0]+'">'+t[1]+'</button>'}).join('');
  ensureStk();
  if(C.tab==='rep')B.innerHTML='<input class="in" id="rq" placeholder="جستجوی عنوان ایستگاه" value="'+esc(C.rq)+'"><div id="rlist"></div>';
  else if(C.tab==='staff')B.innerHTML='<div class="card"><h3>ثبت خادمین ایستگاه</h3><label>ایستگاه</label><select id="stsel">'+stOpts(C.stk)+'</select><label>جستجوی عضو برای افزودن</label><input class="in" id="sq" placeholder="نام یا شماره تماس…" value="'+esc(C.sq)+'"><div class="rs" id="sres"></div></div><div id="slist"></div>';
  else if(C.tab==='disc')dshell();
  else nshell();
  fill();
}
function fill(){if(!scr.classList.contains('on'))return;if(C.tab==='rep')fRep();else if(C.tab==='staff')fStaff();else if(C.tab==='disc')fDisc();else fNew()}

/* ----- report ----- */
function fRep(){var L=$('#rlist');if(!L)return;var q=norm(C.rq),g=groups().filter(function(x){return!q||norm(x.station).indexOf(q)>-1});
var tot=g.reduce(function(s,x){return s+x.tot},0),sv=0,mm=0;g.forEach(function(x){var s=staffOf(x.k);sv+=s.length;s.forEach(function(y){mm+=totMins(y)})});
var h='<div class="card"><div class="fl"><b>'+fa(g.length)+' ایستگاه</b><span class="chip a">'+mn(tot)+'</span></div><p class="hint" style="margin:6px 0 0">جمع خادمین ثبت‌شده: '+fa(sv)+' نفر — جمع زمان خدمت: '+dur(mm)+'</p><p class="hint" style="margin:4px 0 0">اطلاعات هزینه‌ها از بخش «امور مالی» خوانده می‌شود و در این بخش قابل تغییر نیست.</p><div class="ia" style="margin-top:8px"><button class="ib pr" data-a="txt">گزارش متنی</button></div></div>';
if(C.txt){var t=repText(g);h+='<div class="card"><textarea id="rta" rows="10" readonly style="width:100%;font:inherit;background:var(--bg);color:var(--ink);border:1.5px solid var(--mute);border-radius:12px;padding:10px">'+esc(t)+'</textarea><button class="pri" data-a="cp">کپی</button>'+(navigator.share?'<button class="sec" data-a="shr" style="margin-top:8px">ارسال در پیام‌رسان</button>':'')+'<button class="ib" data-a="cx" style="margin-top:8px;width:100%;padding:10px">بستن</button></div>'}
h+=g.map(function(x){var op=C.open===x.k,s=staffOf(x.k),dc=D.st_disc.filter(function(d){return d.stk===x.k}).length,sm=s.reduce(function(a,y){return a+totMins(y)},0);
return'<div class="card"><div class="fl stc" data-a="op" data-k="'+esc(x.k)+'"><div><b>'+esc(x.station)+'</b><br><small class="hint">'+fd(x.time)+'</small></div><span class="chip a">'+mn(x.tot)+'</span></div><p class="hint" style="margin:6px 0 0">'+fa(x.items.length)+' قلم — '+fa(s.length)+' خادم'+(sm?' ('+dur(sm)+')':'')+(dc?' — '+fa(dc)+' مورد انضباطی':'')+'</p>'+
(op?'<table><tr><th>کالا</th><th>مقدار</th><th>قیمت واحد</th><th>جمع</th></tr>'+x.items.map(function(i){return'<tr><td>'+esc(i.name)+'</td><td>'+fa(A(i.qty))+' '+esc(i.unit||'')+'</td><td>'+fa(grp(Math.round(A(i.price))))+'</td><td>'+fa(grp(ic(i)))+'</td></tr>'}).join('')+'<tr><th colspan="3">جمع این ایستگاه</th><th>'+fa(grp(x.tot))+'</th></tr></table>'+(s.length?'<p style="margin:10px 0 2px"><b>خادمین:</b></p>'+s.map(function(y){return'<div class="fl" style="padding:3px 0"><span>'+esc(mname(y.mid,y.mname))+'</span><small class="hint">'+dur(totMins(y))+'</small></div>'}).join(''):''):'')+'</div>'}).join('')||'<p class="hint">ایستگاهی یافت نشد. ایستگاه‌ها را در «امور مالی ← ایستگاه صلواتی» ثبت کنید.</p>';
L.innerHTML=h}
function repText(g){var t='گزارش ایستگاه‌های صلواتی — هیئت معظم ابناءالحسن (علیهم السلام)\nتاریخ گزارش: '+fd(tk())+'\n';var tot=0;
g.forEach(function(x){tot+=x.tot;var s=staffOf(x.k);t+='\n● '+x.station+' ('+fd(x.time)+')\nهزینه: '+mn(x.tot)+' — اقلام: '+fa(x.items.length)+'\n';x.items.forEach(function(i){t+='   - '+i.name+': '+fa(A(i.qty))+' '+(i.unit||'')+' × '+fa(grp(Math.round(A(i.price))))+' = '+fa(grp(ic(i)))+'\n'});
if(s.length){t+='خادمین ('+fa(s.length)+' نفر):\n';s.forEach(function(y){t+='   - '+mname(y.mid,y.mname)+' — '+dur(totMins(y))+'\n'})}});
return t+'\nجمع کل هزینه‌ها: '+mn(tot)}

/* ----- staff ----- */
function fStaff(){var R=$('#sres'),L=$('#slist');if(!R||!L)return;
if(!groups().length){R.innerHTML='';L.innerHTML='<p class="hint">ابتدا باید در بخش «امور مالی» یک ایستگاه صلواتی ثبت شود.</p>';return}
var inn={};staffOf(C.stk).forEach(function(x){inn[x.mid]=1});var q=norm(C.sq);
var r=sorted().filter(function(m){return!inn[m.id]&&(!q||norm(full(m)).indexOf(q)>-1||norm(m.phone).indexOf(q)>-1)}).slice(0,40);
R.innerHTML=r.map(function(m){return'<div class="fl" style="padding:6px 0;border-bottom:1px solid var(--bg)"><span>'+esc(full(m))+(m.phone?' <small class="hint">'+esc(m.phone)+'</small>':'')+'</span><button class="ib pr" data-a="addm" data-id="'+m.id+'">افزودن</button></div>'}).join('')||'<p class="hint">عضوی یافت نشد. می‌توانید از تب «عضو جدید» عضو تازه ثبت کنید.</p>';
var s=staffOf(C.stk).sort(function(a,b){return mname(a.mid,a.mname).localeCompare(mname(b.mid,b.mname),'fa')});
L.innerHTML='<h3 style="margin:12px 2px 6px">خادمین ثبت‌شده ('+fa(s.length)+' نفر)</h3>'+(s.map(function(x){var ss=x.sessions||[];
return'<div class="card"><div class="fl"><b>'+esc(mname(x.mid,x.mname))+'</b><span class="chip p">'+dur(totMins(x))+'</span></div>'+
ss.map(function(v,i){return'<div class="tm"><small>ورود</small><input class="in" type="time" data-a="tm" data-f="in" data-id="'+x.id+'" data-i="'+i+'" value="'+esc(v.in||'')+'"><button class="ib" data-a="now" data-f="in" data-id="'+x.id+'" data-i="'+i+'">اکنون</button><small>خروج</small><input class="in" type="time" data-a="tm" data-f="out" data-id="'+x.id+'" data-i="'+i+'" value="'+esc(v.out||'')+'"><button class="ib" data-a="now" data-f="out" data-id="'+x.id+'" data-i="'+i+'">اکنون</button>'+(ss.length>1?'<button class="ib dg" data-a="rs" data-id="'+x.id+'" data-i="'+i+'">×</button>':'')+'</div>'}).join('')+
'<div class="ia"><button class="ib pr" data-a="as" data-id="'+x.id+'">+ افزودن زمان ورود و خروج</button><button class="ib dg" data-a="dx" data-id="'+x.id+'">'+(C.del===x.id?'تأیید حذف خادم':'حذف خادم')+'</button></div>'+who(x)+'</div>'}).join('')||'<p class="hint">هنوز خادمی برای این ایستگاه ثبت نشده است.</p>')}
function saveSess(id,fn){var x=D.st_staff.filter(function(y){return y.id===id})[0];if(!x||!db)return gt('اتصال برقرار نیست؛ وارد حساب شوید');var ss=(x.sessions||[]).map(function(v){return{in:v.in||'',out:v.out||''}});fn(ss);
Promise.resolve(db.collection('st_staff').doc(id).update({sessions:ss})).catch(function(){gt('ثبت نشد')})}

/* ----- station disciplinary ----- */
function dshell(){var s=C.dv;
B.innerHTML='<div class="sub">'+[['add','ثبت'],['list','لیست']].map(function(t){return'<button class="'+(s===t[0]?'on':'')+'" data-a="dv" data-v="'+t[0]+'">'+(t[0]==='add'&&C.edit?'ویرایش':t[1])+'</button>'}).join('')+'</div><div id="dwrap"></div>';
if(s==='add'){var e=C.edit&&D.st_disc.filter(function(x){return x.id===C.edit})[0]||{};C.sg=e.sign||C.sg;
$('#dwrap').innerHTML='<div class="card"><h3>'+(C.edit?'ویرایش مورد انضباطی ایستگاه':'ثبت مورد انضباطی ایستگاه صلواتی')+'</h3><label>ایستگاه</label><select id="dst">'+stOpts(e.stk||C.fst||C.stk,1)+'</select><label>جستجوی عضو</label><input class="in" id="dmq" placeholder="نام یا شماره…" value=""><select id="dmem">'+mopts(e.mid,'')+'</select><label>نوع</label><div class="seg" id="dsg"><button data-a="sg" data-v="p" class="'+(C.sg!=='m'?'on':'')+'">+ مثبت</button><button data-a="sg" data-v="m" class="'+(C.sg==='m'?'on':'')+'">− منفی</button></div><label>تاریخ</label>'+dsel('dd',e.date)+'<label>توضیحات کامل</label><textarea id="dtx" rows="5" placeholder="شرح کامل را بنویسید…">'+esc(e.text)+'</textarea><button class="pri" data-a="dsend">'+(C.edit?'ذخیرهٔ ویرایش':'ثبت')+'</button></div>'}
else $('#dwrap').innerHTML='<select id="dfm">'+mopts(C.fm,'همهٔ اعضا')+'</select><select id="dfs2" style="margin-top:6px"><option value="">همهٔ ایستگاه‌ها</option>'+stOpts(C.fst,0)+'</select><div class="sub">'+[['all','همه'],['p','مثبت'],['m','منفی']].map(function(t){return'<button class="'+(C.fs===t[0]?'on':'')+'" data-a="fs" data-v="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div><div id="dlist"></div>'}
function mopts(sel,all,q){var qq=norm(q||'');return'<option value="">'+(all||'انتخاب عضو…')+'</option>'+sorted().filter(function(m){return m.id===sel||!qq||norm(full(m)).indexOf(qq)>-1||norm(m.phone).indexOf(qq)>-1}).map(function(m){return'<option value="'+m.id+'"'+(m.id===sel?' selected':'')+'>'+esc(full(m))+'</option>'}).join('')}
function fDisc(){var L=$('#dlist');if(!L)return;
var a=D.st_disc.filter(function(x){return(!C.fm||x.mid===C.fm)&&(C.fs==='all'||x.sign===C.fs)&&(!C.fst||x.stk===C.fst)}).sort(function(a,b){return(b.at||0)-(a.at||0)});
var p=a.filter(function(x){return x.sign==='p'}).length;
L.innerHTML='<p class="hint">'+fa(a.length)+' مورد — مثبت: '+fa(p)+' — منفی: '+fa(a.length-p)+'</p>'+(a.map(function(x){var ps=x.sign==='p';return'<div class="card"><div class="fl"><span class="chip '+(ps?'p':'a')+'">'+(ps?'+ مثبت':'− منفی')+'</span><small class="hint">'+fd(x.date)+'</small></div><b>'+esc(mname(x.mid,x.mname))+'</b>'+(x.station?'<br><small class="hint">ایستگاه: '+esc(x.station)+(x.time?' — '+fd(x.time):'')+'</small>':'')+'<p style="white-space:pre-wrap;margin:6px 0">'+esc(x.text)+'</p>'+(who(x)||'<small class="hint">ثبت‌کننده: '+esc(x.by)+'</small>')+'<div class="ia" style="margin-top:8px"><button class="ib" data-a="ded" data-id="'+x.id+'">ویرایش</button><button class="ib dg" data-a="ddl" data-id="'+x.id+'">'+(C.del===x.id?'تأیید حذف':'حذف')+'</button></div></div>'}).join('')||'<p class="hint">موردی ثبت نشده است.</p>')}

/* ----- new members ----- */
function nshell(){B.innerHTML='<div class="card"><h3>ثبت عضو جدید</h3><p class="hint" style="margin:0 0 6px">عضو ثبت‌شده مستقیم به «اعضا» افزوده می‌شود و جزو اعضای هیئت حساب می‌شود.</p><input class="in" id="n1" placeholder="نام"><input class="in" id="n2" placeholder="نام خانوادگی"><input class="in" id="n3" type="tel" placeholder="شماره تماس"><input class="in" id="n4" placeholder="آدرس"><label>معرف (اختیاری)</label><select id="n5">'+mopts('','بدون معرف')+'</select><label>افزودن همزمان به خادمین ایستگاه (اختیاری)</label><select id="n6">'+stOpts('',1)+'</select><button class="pri" data-a="nsave">ثبت عضو</button></div><div id="nlist"></div>'}
function fNew(){var L=$('#nlist');if(!L)return;var a=D.members.filter(function(m){return m.src==='st'}).sort(function(a,b){return(b.at||0)-(a.at||0)});
L.innerHTML='<h3 style="margin:12px 2px 6px">اعضای ثبت‌شده از این بخش ('+fa(a.length)+')</h3>'+(a.map(function(m){return'<div class="card"><b>'+esc(full(m))+'</b>'+(m.phone?'<br><small class="hint">'+esc(m.phone)+'</small>':'')+(m.address?'<br><small class="hint">'+esc(m.address)+'</small>':'')+(m.at?'<br><small class="hint">'+fa(new Date(m.at).toLocaleDateString('fa-IR'))+'</small>':'')+who(m)+'</div>'}).join('')||'<p class="hint">هنوز عضوی از این بخش ثبت نشده است. ویرایش یا حذف اعضا از بخش «اعضا» انجام می‌شود.</p>')}

/* ---------- events ---------- */
function v(id){var e=$('#'+id);return e?e.value.trim():''}
scr.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,id=b.dataset.id,i=+b.dataset.i;
if(a==='tab'){C.tab=b.dataset.t;C.del=null;C.edit=null;C.txt=0;view()}
else if(a==='op'){C.open=C.open===b.dataset.k?null:b.dataset.k;fill()}
else if(a==='txt'){C.txt=1;fill()}else if(a==='cx'){C.txt=0;fill()}
else if(a==='cp'){var t=$('#rta');t.select();try{navigator.clipboard.writeText(t.value).then(function(){gt('کپی شد')},function(){document.execCommand('copy');gt('کپی شد')})}catch(x){try{document.execCommand('copy');gt('کپی شد')}catch(y){}}}
else if(a==='shr')navigator.share({text:$('#rta').value}).catch(function(){});
else if(a==='addm'){if(!db||!C.stk)return gt('اتصال برقرار نیست؛ وارد حساب شوید');var g=groups().filter(function(x){return x.k===C.stk})[0];if(!g)return;
 Promise.resolve(db.collection('st_staff').add({stk:g.k,station:g.station,time:g.time,mid:id,mname:mname(id),sessions:[{in:'',out:''}],by:window.HU||'',at:Date.now()})).then(function(){gt('خادم افزوده شد')}).catch(function(){gt('ثبت نشد')})}
else if(a==='as')saveSess(id,function(s){s.push({in:'',out:''})});
else if(a==='rs')saveSess(id,function(s){s.splice(i,1)});
else if(a==='now')saveSess(id,function(s){if(s[i])s[i][b.dataset.f]=nowT()});
else if(a==='dx'){if(C.del===id){C.del=null;db&&db.collection('st_staff').doc(id).delete().catch(function(){gt('حذف نشد')})}else{C.del=id;fill()}}
else if(a==='dv'){C.dv=b.dataset.v;if(C.dv==='list')C.edit=null;view()}
else if(a==='sg'){C.sg=b.dataset.v;[].forEach.call($('#dsg').children,function(x){x.classList.toggle('on',x===b)})}
else if(a==='fs'){C.fs=b.dataset.v;dshell();fill()}
else if(a==='ded'){C.edit=id;C.dv='add';view()}
else if(a==='ddl'){if(C.del===id){C.del=null;db&&db.collection('st_disc').doc(id).delete().catch(function(){gt('حذف نشد')})}else{C.del=id;fill()}}
else if(a==='dsend'){var mid=v('dmem'),tx=v('dtx'),sk=v('dst');if(!mid)return gt('عضو را انتخاب کنید');if(tx.length<3)return gt('توضیحات را بنویسید');if(!db)return gt('اتصال برقرار نیست؛ وارد حساب شوید');
 var g2=groups().filter(function(x){return x.k===sk})[0],o={mid:mid,mname:mname(mid),sign:C.sg,text:tx,date:dget('dd'),stk:g2?g2.k:'',station:g2?g2.station:'',time:g2?g2.time:''},ed=C.edit;C.fst=sk;
 var p=ed?db.collection('st_disc').doc(ed).update(o):db.collection('st_disc').add(Object.assign(o,{by:window.HU||'',at:Date.now()}));
 Promise.resolve(p).then(function(){gt(ed?'ویرایش شد':'ثبت شد');C.edit=null;C.dv=ed?'list':'add';view()}).catch(function(){gt('ثبت نشد؛ سطح دسترسی را بررسی کنید')})}
else if(a==='nsave'){var o2={first:v('n1'),last:v('n2'),phone:v('n3'),address:v('n4'),ref:v('n5')},sk2=v('n6');
 if(!o2.first&&!o2.last)return gt('نام را وارد کنید');if(!db)return gt('اتصال برقرار نیست؛ وارد حساب شوید');
 var nn=norm(full(o2));if(D.members.some(function(m){return norm(full(m))===nn}))return gt('عضوی با همین نام قبلاً ثبت شده است');
 Promise.resolve(db.collection('members').add(Object.assign(o2,{at:Date.now(),src:'st'}))).then(function(r){
  var g3=groups().filter(function(x){return x.k===sk2})[0];
  if(g3&&r&&r.id)return db.collection('st_staff').add({stk:g3.k,station:g3.station,time:g3.time,mid:r.id,mname:full(o2),sessions:[{in:'',out:''}],by:window.HU||'',at:Date.now()})}).then(function(){gt('عضو جدید ثبت شد');nshell();fill()}).catch(function(){gt('ثبت نشد')})}
});
scr.addEventListener('change',function(e){var t=e.target,a=t.dataset&&t.dataset.a;
if(t.id==='stsel'){C.stk=t.value;C.del=null;fill()}
else if(t.id==='dfm'){C.fm=t.value;fill()}
else if(t.id==='dfs2'){C.fst=t.value;fill()}
else if(a==='tm'){var f=t.dataset.f,val=t.value;saveSess(t.dataset.id,function(s){var k=+t.dataset.i;if(s[k])s[k][f]=val})}});
scr.addEventListener('input',function(e){var t=e.target;
if(t.id==='rq'){C.rq=t.value;fRep()}
else if(t.id==='sq'){C.sq=t.value;fStaff()}
else if(t.id==='dmq'){var s=$('#dmem');if(s)s.innerHTML=mopts(s.value,'',t.value)}});

/* ---------- connect + open ---------- */
async function connect(){try{var d=window.claude&&await claude.use('db');if(!d){B.insertAdjacentHTML('afterbegin','<p class="warn">برای مشاهده و ثبت باید با حساب خود وارد شوید.</p>');return}db=d;
['members','st','st_staff','st_disc'].forEach(function(c){d.collection(c).onSnapshot(function(q){D[c]=q.docs.map(function(x){return Object.assign({id:x.id},x.data())});fill()})})}catch(e){}}
window.openSt=function(){window.show('stn');if(!init){init=1;connect()}view()};

/* ---------- home button (appended; existing buttons untouched) ---------- */
function addBtn(){var g=document.getElementById('grid');if(!g||document.getElementById('stnb'))return;var b=document.createElement('button');b.className='app';b.id='stnb';b.style.animationDelay=(g.children.length*0.09)+'s';
b.innerHTML='<span class="circle"><svg viewBox="0 0 48 48"><path d="M12 16h24l-2.4 22a4 4 0 0 1-4 3.6H18.4a4 4 0 0 1-4-3.6z"/><path class="a" d="M17 25h14M20 6.5v4M24 5v5.5M28 6.5v4"/></svg></span><b>ایستگاه صلواتی</b>';
b.onclick=function(){window.openSt()};g.appendChild(b)}
addBtn();var tries=0,poll=setInterval(function(){addBtn();if(document.getElementById('stnb')||++tries>40)clearInterval(poll)},250);
})();
