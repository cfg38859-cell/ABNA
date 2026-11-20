(function(){
var $=function(s){return document.querySelector(s)};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fa(s){return String(s).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})}
function pad(n){return n<10?'0'+n:''+n}
function today(){var o={};new Intl.DateTimeFormat('en-u-ca-persian-nu-latn',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).forEach(function(x){o[x.type]=x.value});return{y:+o.year,m:+o.month,d:+o.day}}
function tk(){var o=today();return o.y+'-'+pad(o.m)+'-'+pad(o.d)}
function fd(k){return k?fa(String(k).replace(/-/g,'/')):'—'}
function mn(n){n=Math.round(n||0);return fa((n<0?'-':'')+Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,','))+' تومان'}
function gt(t){var e=$('#gtoast');e.textContent=t;e.classList.add('on');clearTimeout(gt.t);gt.t=setTimeout(function(){e.classList.remove('on')},3000)}
function norm(s){return String(s||'').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/\u200c/g,' ').replace(/\s+/g,' ').trim().toLowerCase()}
function nn(s){return String(s).replace(/[٠-٩]/g,function(d){return'٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[۰-۹]/g,function(d){return'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)})}
function sum(a,f){var s=0;a.forEach(function(x){s+=f(x)});return s}
var MN=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
window.show=function(id){[].forEach.call(document.querySelectorAll('.screen'),function(e){e.classList.toggle('on',e.id===id)})};
/* unified back: app arrow, phone back (popstate) and native hook all use window.appBack */
var _sh=window.show,NV=[],nb=0;
function curScr(){var e=document.querySelector('.screen.on:not(#splash)');return e?e.id:''}
window.show=function(id){if(!nb){var c=curScr();if(id==='home')NV=[];else if(c&&c!==id){NV.push(c);if(NV.length>30)NV.shift()}}_sh(id)};
function closeOv(){var q=document.getElementById('qbkp');if(q){q.remove();return true}var o=document.querySelector('#thp.on,#bk.on,#sheet.on,#dsh.on,#ish.on');if(o){o.classList.remove('on');return true}return false}
window.appBack=function(){if(closeOv())return true;var c=curScr();if(!c||c==='home'||c==='lgs')return false;var p=NV.length?NV.pop():(window.HU?'home':'lgs');nb=1;try{var f={rs:'openRs',ds:'openDs'}[p];if(f&&window[f])window[f]();else _sh(p)}finally{nb=0}return true};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.back');if(!b)return;e.stopPropagation();e.preventDefault();window.appBack()},true);
var exT=0;function arm(){try{history.pushState({h:1},'')}catch(e){}}
try{history.replaceState({h:0},'');arm()}catch(e){}
var exOK=0;
function exDlg(){return document.getElementById('qexit')}
function askExit(){if(exDlg())return;var d=document.createElement('div');d.id='qexit';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px';
var bs='border:0;border-radius:12px;font:inherit;font-weight:700;padding:11px;flex:1;cursor:pointer';
d.innerHTML='<div style="background:var(--card);color:var(--ink);border-radius:18px;padding:20px;width:100%;max-width:330px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.35)"><h3 style="margin:0 0 8px">خروج از برنامه</h3><p style="margin:0 0 16px;color:var(--mute);line-height:1.8">آیا مطمئن هستید که می‌خواهید از برنامه خارج شوید؟</p><div style="display:flex;gap:8px"><button data-x="y" style="'+bs+';background:var(--p);color:#fff">بله، خروج</button><button data-x="n" style="'+bs+';background:var(--bg);color:var(--ink)">انصراف</button></div></div>';
d.addEventListener('click',function(e){var x=e.target.dataset&&e.target.dataset.x;if(x==='y'){d.remove();exOK=1;try{history.go(-2)}catch(er){}setTimeout(function(){try{window.close()}catch(er){}},300)}else if(x==='n'||e.target===d)d.remove()});
document.body.appendChild(d)}
window.addEventListener('popstate',function(){if(exOK)return;if(exDlg()){exDlg().remove();arm();return}if(window.appBack()){arm();return}
arm();askExit()});
function mk(id,title,tabs){var d=document.createElement('div');d.id=id;d.className='screen top';d.innerHTML='<div class="bar"><button class="back back2">→</button><h2>'+title+'</h2></div>'+(tabs?'<div class="tabs" id="'+id+'t"></div>':'')+'<div class="bd" id="'+id+'b"></div>';document.body.appendChild(d);return d}
/* ---------- data store ---------- */
var CL=['members','att','disc','prz','inv','sugg','ac_people','ac_tx','ac_att','inv_fb','kh_people','kh_tx','cash','st','debts','loans'],DS={},cbs=[],DB=null;
CL.forEach(function(c){DS[c]=[]});
setTimeout(async function(){try{DB=await claude.use('db');CL.forEach(function(c){DB.collection(c).onSnapshot(function(q){DS[c]=q.docs.map(function(x){return Object.assign({id:x.id},x.data())});cbs.forEach(function(f){f()})})})}catch(e){}},50);
function put(c,o,id){if(!DB){gt('اتصال ذخیره‌گاه برقرار نیست');return Promise.resolve(false)}var r;try{r=id?DB.collection(c).doc(id).update(o):DB.collection(c).add(o)}catch(e){gt('ثبت نشد');return Promise.resolve(false)}return Promise.resolve(r).then(function(){return true},function(){gt('ثبت نشد');return false})}
function del(c,id){return DB&&DB.collection(c).doc(id).delete()}
function full(m){return((m.first||'')+' '+(m.last||'')).trim()}
function mem(){return DS.members.slice().sort(function(a,b){return full(a).localeCompare(full(b),'fa')})}
function byId(id){return DS.members.filter(function(m){return m.id===id})[0]}
function mopts(s,all){return'<option value="">'+(all?'همهٔ اعضا':'انتخاب عضو…')+'</option>'+mem().map(function(m){return'<option value="'+m.id+'"'+(m.id===s?' selected':'')+'>'+esc(full(m))+'</option>'}).join('')}
function dsel(k,v){var t=today(),p=v?v.split('-'):null,o=p?{y:+p[0],m:+p[1],d:+p[2]}:t,i,h='<div class="dp"><select id="'+k+'_d">';for(i=1;i<=31;i++)h+='<option value="'+i+'"'+(i===o.d?' selected':'')+'>'+fa(i)+'</option>';h+='</select><select id="'+k+'_m">';MN.forEach(function(n,j){h+='<option value="'+(j+1)+'"'+(j+1===o.m?' selected':'')+'>'+n+'</option>'});h+='</select><select id="'+k+'_y">';for(i=Math.min(t.y-4,o.y);i<=Math.max(t.y+1,o.y);i++)h+='<option value="'+i+'"'+(i===o.y?' selected':'')+'>'+fa(i)+'</option>';return h+'</select></div>'}
function dget(k){var y=+$('#'+k+'_y').value,m=+$('#'+k+'_m').value,d=+$('#'+k+'_d').value;return y+'-'+pad(m)+'-'+pad(Math.min(d,window.jml(y,m)))}
function dselb(k,v){var p=v?v.split('-'):['','',''],t=today(),i,h='<div class="dp"><select id="'+k+'_d"><option value="">روز</option>';for(i=1;i<=31;i++)h+='<option value="'+i+'"'+(+p[2]===i?' selected':'')+'>'+fa(i)+'</option>';h+='</select><select id="'+k+'_m"><option value="">ماه</option>';MN.forEach(function(n,j){h+='<option value="'+(j+1)+'"'+(+p[1]===j+1?' selected':'')+'>'+n+'</option>'});h+='</select><select id="'+k+'_y"><option value="">سال</option>';for(i=t.y;i>=1320;i--)h+='<option value="'+i+'"'+(+p[0]===i?' selected':'')+'>'+fa(i)+'</option>';return h+'</select></div>'}
function getb(k){var y=$('#'+k+'_y').value,m=$('#'+k+'_m').value,d=$('#'+k+'_d').value;return y&&m&&d?y+'-'+pad(m)+'-'+pad(d):''}
/* ---------- text sheet ---------- */
var BK=$('#bk');
function txt(t){BK.innerHTML='<div class="sh"><h3>گزارش متنی</h3><textarea id="bkt" rows="12" readonly style="width:100%;font:inherit;background:var(--bg);color:var(--ink);border:1.5px solid var(--mute);border-radius:12px;padding:10px">'+esc(t)+'</textarea><button class="pri" data-b="cp">کپی</button>'+(navigator.share?'<button class="sec" data-b="sh" style="margin-top:8px">ارسال در پیام‌رسان</button>':'')+'<button class="ib" data-b="x" style="width:100%;padding:10px;margin-top:8px">بستن</button></div>';BK.classList.add('on')}
BK.addEventListener('click',function(e){var b=e.target.dataset.b;if(e.target===BK||b==='x')BK.classList.remove('on');else if(b==='cp'){var t=$('#bkt');t.select();try{navigator.clipboard.writeText(t.value).then(function(){gt('کپی شد')},function(){document.execCommand('copy');gt('کپی شد')})}catch(x){try{document.execCommand('copy');gt('کپی شد')}catch(y){}}}else if(b==='sh')navigator.share({text:$('#bkt').value}).catch(function(){})});
function head(t){return t+' — هیئت معظم ابناءالحسن (علیهم السلام)\nتاریخ گزارش: '+fd(tk())+'\n\n'}
/* ---------- member stats ---------- */
function attS(id){var r={h:{p:0,l:0,a:0},g:{p:0,l:0,a:0}};DS.att.forEach(function(x){if(x.member===id&&r[x.group])r[x.group][x.status]++});return r}
function sessN(g){var o={};DS.att.forEach(function(x){if(x.group===g)o[x.date]=1});return Object.keys(o).length}
function disS(id){var p=0,m=0;DS.disc.forEach(function(x){if(x.mid===id){if(x.sign==='p')p++;else m++}});return{p:p,m:m}}
function finS(m){var n=norm(full(m)),r={ac:null,kh:null,hu:0,pu:0};['ac','kh'].forEach(function(P){var p=DS[P+'_people'].filter(function(x){return x.mid===m.id||norm(x.name)===n})[0];if(p)r[P]=sum(DS[P+'_tx'].filter(function(x){return x.pid===p.id}),function(x){return x.kind==='fee'?x.amount:-x.amount})});DS.debts.forEach(function(x){if((x.mid===m.id||norm(x.person)===n)&&x.paid!=='1'){if(x.dir==='hey')r.hu+=x.amount;else r.pu+=x.amount}});return r}
function bch(b,l){return b==null?'':(b>0?'<span class="chip a">'+l+': بدهکار '+mn(b)+'</span>':b<0?'<span class="chip p">'+l+': طلبکار '+mn(-b)+'</span>':'<span class="chip">'+l+': تسویه</span>')}
function info(m){var r=m.ref&&byId(m.ref);return[['شماره تماس',m.phone],['آدرس',m.address],['تاریخ تولد',m.birth?fd(m.birth):''],['نام پدر',m.father],['تماس خانواده',(m.fphone||'')+(m.frel?' ('+m.frel+')':'')],['معرف',r?full(r):'']].filter(function(x){return x[1]&&x[1]!==' '}).map(function(x){return'<div class="kv"><span>'+x[0]+'</span><b>'+esc(x[1])+'</b></div>'}).join('')||'<p class="hint">اطلاعات تکمیلی ثبت نشده است.</p>'}
function chips(m){var a=attS(m.id),d=disS(m.id),f=finS(m),z=DS.prz.filter(function(x){return x.mid===m.id}).length,h='';
['h','g'].forEach(function(g){var s=sessN(g);if(s)h+='<span class="chip p">'+(g==='h'?'هیئت':'حلقه')+': '+fa(a[g].p+a[g].l)+' از '+fa(s)+'</span>'});
return h+'<span class="chip '+(d.p>=d.m?'p':'a')+'">انضباطی +'+fa(d.p)+' −'+fa(d.m)+'</span>'+(z?'<span class="chip l">جایزه '+fa(z)+'</span>':'')+bch(f.ac,'آکادمی')+bch(f.kh,'خدام')+(f.hu?'<span class="chip a">بدهی هیئت به او '+mn(f.hu)+'</span>':'')+(f.pu?'<span class="chip a">بدهی او به هیئت '+mn(f.pu)+'</span>':'')}
/* ---------- members section ---------- */
mk('mm','اعضا',1);
var MB=$('#mmb'),MT=$('#mmt'),MS={tab:'add',edit:null,q:'',del:null,sel:'',src:'m',sep:',',bs:20};
var MTABS=[['add','ثبت عضو'],['list','لیست'],['book','دفترچه تلفن'],['fin','مالی'],['dis','انضباطی'],['ref','تعداد معرَّف'],['pro','پروفایل']];
function addV(){var e=MS.edit&&byId(MS.edit)||{};function f(i,l,v,t){return'<label>'+l+'</label><input class="in" id="'+i+'" '+(t?'type="'+t+'" ':'')+'value="'+esc(v)+'">'}
return'<div class="card"><h3>'+(MS.edit?'ویرایش عضو':'ثبت عضو جدید')+'</h3>'+f('m1','نام',e.first)+f('m2','نام خانوادگی',e.last)+f('m3','شماره تماس',e.phone,'tel')+f('m4','آدرس',e.address)+'<label>تاریخ تولد (اختیاری)</label>'+dselb('mb',e.birth)+f('m5','نام پدر',e.father)+f('m6','شمارهٔ تماس یکی از اعضای خانواده',e.fphone,'tel')+f('m7','نسبت او (مثلاً مادر)',e.frel)+'<label>معرف</label><select id="m8">'+mopts(e.ref).replace('انتخاب عضو…','بدون معرف')+'</select><button class="pri" data-a="save">'+(MS.edit?'ذخیرهٔ تغییرات':'ثبت عضو')+'</button></div>'+(MS.edit?'':'<div class="card"><h3>ثبت دسته‌جمعی</h3><p class="hint">هر سطر یک نفر: نام و نام خانوادگی ، شماره تماس ، آدرس ، معرف (اختیاری). جداکننده: ویرگول یا Tab.</p><textarea id="mbulk" rows="5" style="width:100%;font:inherit;background:var(--bg);color:var(--ink);border:1.5px solid var(--mute);border-radius:12px;padding:8px"></textarea><button class="sec" data-a="bulk" style="margin-top:8px">ثبت همه</button></div>')}
function ms(){var q=norm(MS.q);return mem().filter(function(m){return!q||norm(full(m)+' '+(m.phone||'')).indexOf(q)>-1})}
function mlist(){var a=ms();return'<div class="ia" style="margin-bottom:8px"><button class="ib pr" data-a="mtxt" data-k="list">گزارش متنی</button></div><p class="hint">تعداد: '+fa(a.length)+'</p>'+(a.map(function(m){return'<div class="card"><b>'+esc(full(m))+'</b>'+info(m)+WHO(m)+'<div class="ia" style="margin-top:8px"><button class="ib" data-a="ed" data-id="'+m.id+'">ویرایش</button><button class="ib dg" data-a="del" data-id="'+m.id+'">'+(MS.del===m.id?'تأیید حذف':'حذف')+'</button></div></div>'}).join('')||'<p class="hint">عضوی ثبت نشده است.</p>')}
function tel(p){return String(p||'').replace(/[٠-٩]/g,function(d){return'٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[۰-۹]/g,function(d){return'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)}).replace(/[^\d+]/g,'')}
function nums(){var o=[],seen={};ms().forEach(function(m){var l=MS.src==='f'?[m.fphone]:MS.src==='b'?[m.phone,m.fphone]:[m.phone];l.forEach(function(p){var d=tel(p);if(d.replace(/\+/g,'').length>=10&&!seen[d]){seen[d]=1;o.push(d)}})});return o}
function batches(){var n=nums(),sz=+MS.bs||20,B=[],i;for(i=0;i<n.length;i+=sz)B.push(n.slice(i,i+sz));return B}
function copyT(t){function old(){var a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy');gt('کپی شد')}catch(e){gt('کپی نشد؛ شماره‌ها را دستی انتخاب کنید')}a.remove()}try{navigator.clipboard.writeText(t).then(function(){gt('کپی شد')},old)}catch(e){old()}}
function bulkCard(){var B=batches(),n=sum(B,function(g){return g.length});function o(v,l,c){return'<option value="'+v+'"'+(String(c)===String(v)?' selected':'')+'>'+l+'</option>'}
return'<div class="card"><h3>پیامک دسته‌جمعی</h3><p class="hint">شماره‌های همین فهرست (با جستجوی بالا) به دسته‌های کوچک تقسیم می‌شود. هر دسته را کپی کنید و در برنامهٔ پیامک (قسمت گیرنده) بچسبانید.</p><label>شماره‌ها</label><select class="in" id="bsrc">'+o('m','شمارهٔ خود اعضا',MS.src)+o('f','شمارهٔ خانواده',MS.src)+o('b','هر دو',MS.src)+'</select><label>اندازهٔ هر دسته</label><select class="in" id="bsize">'+[10,20,30,50].map(function(x){return o(x,fa(x)+' شماره',MS.bs)}).join('')+'</select><label>جداکنندهٔ شماره‌ها</label><select class="in" id="bsep">'+o(',','ویرگول (,) — برای بیشتر گوشی‌ها',MS.sep)+o(';','نقطه‌ویرگول (;)',MS.sep)+o('\n','هر شماره در یک خط',MS.sep)+o(' ','با فاصله',MS.sep)+'</select><p class="hint">'+fa(n)+' شمارهٔ معتبر در '+fa(B.length)+' دسته</p>'+(B.map(function(g,i){return'<div class="row"><div><b>دستهٔ '+fa(i+1)+'</b><small>'+fa(g.length)+' شماره — '+esc(g[0])+' تا '+esc(g[g.length-1])+'</small></div><button class="ib pr" data-a="cpb" data-i="'+i+'">کپی</button></div>'}).join('')||'<p class="hint">شمارهٔ معتبری یافت نشد.</p>')+'</div>'}
function mbook(){var a=ms().filter(function(m){return m.phone||m.fphone});return vcfCard()+bulkCard()+a.map(function(m){function r(p,l){return p?'<div class="rw"><span>'+l+': <b>'+esc(p)+'</b></span><div class="ia"><a class="ib" href="tel:'+tel(p)+'">تماس</a><a class="ib" href="sms:'+tel(p)+'">پیامک</a></div></div>':''}return'<div class="card"><b>'+esc(full(m))+'</b>'+r(m.phone,'شماره')+r(m.fphone,'خانواده'+(m.frel?' ('+m.frel+')':''))+'</div>'}).join('')||'<p class="hint">شماره‌ای ثبت نشده است.</p>'}
function mfin(){var h='<div class="ia" style="margin-bottom:8px"><button class="ib pr" data-a="mtxt" data-k="fin">گزارش متنی</button></div><p class="hint">وضعیت مالی با تطبیق نام عضو با نام در آکادمی، خدام و بدهی‌ها به‌دست می‌آید؛ نام‌ها باید یکسان نوشته شده باشند.</p>';
return h+(mem().map(function(m){var f=finS(m),c=bch(f.ac,'آکادمی')+bch(f.kh,'خدام')+(f.hu?'<span class="chip a">بدهی هیئت به او '+mn(f.hu)+'</span>':'')+(f.pu?'<span class="chip a">بدهی او به هیئت '+mn(f.pu)+'</span>':'');return c?'<div class="card"><b>'+esc(full(m))+'</b><div style="margin-top:6px">'+c+'</div></div>':''}).join('')||'<p class="hint">موردی یافت نشد.</p>')}
function mdis(){var a=mem().map(function(m){var d=disS(m.id);return{m:m,d:d,n:d.p-d.m}}).filter(function(x){return x.d.p||x.d.m}).sort(function(a,b){return b.n-a.n});
return'<div class="ia" style="margin-bottom:8px"><button class="ib pr" data-a="mtxt" data-k="dis">گزارش متنی</button></div>'+(a.map(function(x){return'<div class="row" data-a="pro" data-id="'+x.m.id+'" style="cursor:pointer"><b>'+esc(full(x.m))+'</b><div><span class="chip p">+ '+fa(x.d.p)+'</span><span class="chip a">− '+fa(x.d.m)+'</span><span class="chip '+(x.n<0?'a':'p')+'">امتیاز '+fa(x.n)+'</span></div></div>'}).join('')||'<p class="hint">موردی ثبت نشده است.</p>')}
function mpro(){var m=byId(MS.sel);if(!m)return'<p class="hint">یک عضو را انتخاب کنید.</p>';
var ds=DS.disc.filter(function(x){return x.mid===m.id}).sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}),zs=DS.prz.filter(function(x){return x.mid===m.id}).sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}),a=attS(m.id),rf=DS.members.filter(function(x){return x.ref===m.id});
return'<div class="card"><h3>'+esc(full(m))+'</h3>'+info(m)+'<div style="margin-top:8px">'+chips(m)+'</div></div><div class="card"><b>حضور و غیاب</b>'+['h','g'].map(function(g){var s=a[g];return'<div class="kv"><span>'+(g==='h'?'هیئت':'حلقه گفتگو')+'</span><b>حضور '+fa(s.p)+' · تاخیر '+fa(s.l)+' · غیبت '+fa(s.a)+'</b></div>'}).join('')+'</div>'+(rf.length?'<div class="card"><b>معرفی‌شده‌ها</b><p class="hint">'+rf.map(function(x){return esc(full(x))}).join('، ')+'</p></div>':'')+'<h3>موارد انضباطی</h3>'+(ds.map(function(x){return'<div class="row"><div><b>'+(x.sign==='p'?'+ مثبت':'− منفی')+'</b><small>'+fd(x.date)+'</small><small>'+esc(x.text)+'</small>'+WHO(x)+'</div></div>'}).join('')||'<p class="hint">—</p>')+'<h3>جوایز</h3>'+(zs.map(function(x){return'<div class="row"><div><b>'+esc(x.title)+'</b><small>'+fd(x.date)+'</small><small>'+esc(x.text||'')+'</small>'+WHO(x)+'</div></div>'}).join('')||'<p class="hint">—</p>')}
function mview(){MT.innerHTML=MTABS.map(function(t){return'<button class="'+(MS.tab===t[0]?'on':'')+'" data-a="tab" data-t="'+t[0]+'">'+t[1]+'</button>'}).join('');
var h='';if(MS.tab==='add')h=addV();else if(MS.tab==='pro')h='<select class="in" id="msel">'+mopts(MS.sel)+'</select><div id="mf"></div>';else if(MS.tab==='list'||MS.tab==='book')h='<input class="in" id="mq" placeholder="جستجوی نام یا شماره" value="'+esc(MS.q)+'"><div id="mf"></div>';else h='<div id="mf"></div>';MB.innerHTML=h;mfill()}
function mfill(){var f=$('#mf');if(f)f.innerHTML={list:mlist,book:mbook,fin:mfin,dis:mdis,ref:mref,pro:mpro}[MS.tab]()}
var VCS=' (هیئت)';
function vcEsc(s){return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n')}
function vcf(){var out=[],n=0,nf=0,g1=(MS.g1||'').trim()||'هیئت معظم ابناءالحسن',g2=(MS.g2||'').trim()||'خانوادهٔ اعضای هیئت';
function ok(d){return d.replace(/\+/g,'').length>=10}
function card(nm,last,first,d,grp,uid){out.push('BEGIN:VCARD','VERSION:3.0','N:'+vcEsc(last)+';'+vcEsc(first)+';;;'+vcEsc(VCS.trim()),'FN:'+vcEsc(nm+VCS),'TEL;TYPE=CELL:'+d,'ORG:'+vcEsc(grp),'CATEGORIES:'+vcEsc(grp),'UID:'+uid,'END:VCARD')}
mem().forEach(function(m){var nm=full(m)||'بی‌نام',p=tel(m.phone),f=tel(m.fphone);
if(ok(p)){n++;card(nm,m.last||'',m.first||'',p,g1,'heyat-'+m.id)}
if(ok(f)&&f!==p){nf++;var rel=(m.frel||'').trim()||'خانوادهٔ';card(rel+' '+nm,m.last||'',(rel+' '+(m.first||'')).trim(),f,g2,'heyat-f-'+m.id)}});
return{text:out.join('\r\n')+'\r\n',n:n,nf:nf}}
function vcfCard(){var r=vcf();return'<div class="card"><h3>ذخیره در مخاطبین گوشی</h3><p class="hint">هر عضو یک مخاطب جدا و شمارهٔ خانوادهٔ او هم یک مخاطب جدا (مثلاً «مادر علی کریمی») می‌شود. اعضا در یک گروه و شماره‌های خانواده در گروهی دیگر قرار می‌گیرند. به نام هر مخاطب «(هیئت)» اضافه می‌شود.</p><label>نام گروه اعضا</label><input class="in" id="vg1" value="'+esc(MS.g1==null?'هیئت معظم ابناءالحسن':MS.g1)+'"><label>نام گروه شماره‌های خانواده</label><input class="in" id="vg2" value="'+esc(MS.g2==null?'خانوادهٔ اعضای هیئت':MS.g2)+'"><p class="hint">مخاطبین آماده: اعضا '+fa(r.n)+' — خانواده '+fa(r.nf)+'<br>در اندروید (مخاطبین گوگل) معمولاً گروه به‌صورت برچسب ساخته می‌شود. در بعضی گوشی‌ها، از جمله آیفون، ممکن است گروه ساخته نشود؛ در این حالت نام گروه در بخش «سازمان» هر مخاطب نوشته شده است.</p><button class="ib pr" data-a="vcf">دانلود فایل مخاطبین</button></div>'}
function mvcf(){var r=vcf();if(!r.n&&!r.nf)return gt('شماره‌ای برای ذخیره وجود ندارد');var f=new Blob([r.text],{type:'text/vcard;charset=utf-8'}),l=document.createElement('a');l.href=URL.createObjectURL(f);l.download='hayat-contacts-'+new Date().toISOString().slice(0,10)+'.vcf';document.body.appendChild(l);l.click();l.remove();gt(fa(r.n+r.nf)+' مخاطب آماده شد')}
function refS(){var c={},l={};mem().forEach(function(m){if(m.ref&&byId(m.ref)){(l[m.ref]=l[m.ref]||[]).push(m);c[m.ref]=(c[m.ref]||0)+1}});return mem().filter(function(m){return c[m.id]}).map(function(m){return{m:m,n:c[m.id],l:l[m.id].sort(function(a,b){return full(a).localeCompare(full(b),'fa')})}}).sort(function(a,b){return b.n-a.n||full(a.m).localeCompare(full(b.m),'fa')})}
function mref(){var a=refS(),tot=sum(a,function(x){return x.n}),none=mem().filter(function(m){return!m.ref||!byId(m.ref)}).length;
return'<div class="ia" style="margin-bottom:8px"><button class="ib pr" data-a="mtxt" data-k="ref">گزارش متنی</button></div><p class="hint">اعضایی که دیگران را معرفی کرده‌اند، از بیشترین به کمترین. روی نام هر نفر ضربه بزنید تا معرفی‌شده‌هایش را ببینید؛ با ضربه روی نام معرفی‌شده، پروفایل او باز می‌شود. مجموع معرفی‌شده‌ها: '+fa(tot)+' — اعضای بدون معرف: '+fa(none)+'</p>'+(a.map(function(x,i){var o=MS.ro===x.m.id;return'<div class="card"><div class="rw" data-a="rop" data-id="'+x.m.id+'" style="cursor:pointer;margin:0"><b>'+fa(i+1)+'. '+esc(full(x.m))+'</b><span class="chip p">'+fa(x.n)+' نفر</span></div>'+(o?'<div style="margin-top:8px">'+x.l.map(function(r){return'<div class="row" data-a="pro" data-id="'+r.id+'" style="cursor:pointer"><b>'+esc(full(r))+'</b><small class="hint">'+esc(r.phone||'')+'</small></div>'}).join('')+'</div>':'')+'</div>'}).join('')||'<p class="hint">هنوز عضوی معرف دیگری نیست. در فرم ثبت عضو، «معرف» را انتخاب کنید.</p>')}
function mtxt(k){var t='';if(k==='list'){t=head('لیست اعضا');mem().forEach(function(m,i){t+=fa(i+1)+'. '+full(m)+(m.phone?' | '+m.phone:'')+(m.father?' | پدر: '+m.father:'')+(m.birth?' | تولد: '+fd(m.birth):'')+(m.address?' | '+m.address:'')+'\n'})}
else if(k==='ref'){t=head('تعداد معرَّف');refS().forEach(function(x,i){t+=fa(i+1)+'. '+full(x.m)+': '+fa(x.n)+' نفر ('+x.l.map(full).join('، ')+')\n'})}
else if(k==='fin'){t=head('وضعیت مالی اعضا');mem().forEach(function(m){var f=finS(m),l=[];if(f.ac!=null)l.push('آکادمی '+(f.ac>0?'بدهکار '+mn(f.ac):f.ac<0?'طلبکار '+mn(-f.ac):'تسویه'));if(f.kh!=null)l.push('خدام '+(f.kh>0?'بدهکار '+mn(f.kh):f.kh<0?'طلبکار '+mn(-f.kh):'تسویه'));if(f.hu)l.push('بدهی هیئت به او '+mn(f.hu));if(f.pu)l.push('بدهی او به هیئت '+mn(f.pu));if(l.length)t+=full(m)+': '+l.join(' | ')+'\n'})}
else{t=head('موارد انضباطی اعضا');mem().forEach(function(m){var d=disS(m.id);if(d.p||d.m)t+=full(m)+': +'+fa(d.p)+' / −'+fa(d.m)+' (امتیاز '+fa(d.p-d.m)+')\n'})}
txt(t)}
MM=$('#mm');
function mclick(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,id=b.dataset.id,v=function(i){return $('#'+i).value.trim()};
if(a==='tab'){MS.tab=b.dataset.t;MS.edit=null;MS.q='';MS.del=null;mview()}
else if(a==='ed'){MS.edit=id;MS.tab='add';mview();MB.scrollTop=0}
else if(a==='del'){if(MS.del===id){MS.del=null;del('members',id)}else{MS.del=id;mfill()}}
else if(a==='pro'){MS.sel=id;MS.tab='pro';mview()}
else if(a==='rop'){MS.ro=MS.ro===id?'':id;mfill()}
else if(a==='mtxt')mtxt(b.dataset.k);
else if(a==='vcf')mvcf();
else if(a==='cpb'){var g0=batches()[+b.dataset.i];if(g0)copyT(g0.join(MS.sep))}
else if(a==='save'){var o={first:v('m1'),last:v('m2'),phone:v('m3'),address:v('m4'),birth:getb('mb'),father:v('m5'),fphone:v('m6'),frel:v('m7'),ref:$('#m8').value};if(!o.first&&!o.last)return gt('نام را وارد کنید');
var ed=MS.edit;put('members',ed?o:Object.assign(o,{at:Date.now()}),ed).then(function(ok){if(!ok)return;gt(ed?'ویرایش شد':'عضو ثبت شد');MS.edit=null;MS.tab=ed?'list':'add';mview()})}
else if(a==='bulk'){var by={};DS.members.forEach(function(m){by[full(m)]=m.id});var rows=$('#mbulk').value.split('\n').map(function(l){return l.split(/[,،\t]/).map(function(x){return x.trim()})}).filter(function(p){return p[0]});if(!rows.length)return gt('سطری وارد نشده است');
Promise.all(rows.map(function(p){var w=p[0].split(/\s+/),last=w.length>1?w.pop():'';return put('members',{first:w.join(' '),last:last,phone:p[1]||'',address:p[2]||'',ref:by[p[3]]||'',at:Date.now()})})).then(function(rs){var n=rs.filter(function(x){return x!==false}).length;if(!n)return;gt(fa(n)+' عضو ثبت شد');$('#mbulk').value=''})}}
MB.addEventListener('click',mclick);MT.addEventListener('click',mclick);
MB.addEventListener('input',function(e){if(e.target.id==='mq'){MS.q=e.target.value;mfill()}else if(e.target.id==='vg1')MS.g1=e.target.value;else if(e.target.id==='vg2')MS.g2=e.target.value;});
MB.addEventListener('change',function(e){var i=e.target.id;if(i==='msel'){MS.sel=e.target.value;mfill()}else if(i==='bsrc'||i==='bsep'||i==='bsize'){if(i==='bsrc')MS.src=e.target.value;else if(i==='bsep')MS.sep=e.target.value;else MS.bs=+e.target.value;mfill()}});
window.openMem=function(id){MS.edit=id&&typeof id==='string'?id:null;MS.tab='add';show('mm');mview()};
cbs.push(function(){if(MM.classList.contains('on')&&MS.tab!=='add')mfill()});
/* ---------- roster ---------- */
mk('rs','لیست اعضا');
var RB=$('#rsb'),RS={q:'',open:''};
function rfill(){var q=norm(RS.q),a=mem().filter(function(m){return!q||norm(full(m)+' '+(m.phone||'')).indexOf(q)>-1});$('#rl').innerHTML='<p class="hint">تعداد: '+fa(a.length)+' — برای دیدن اطلاعات تکمیلی روی نام ضربه بزنید.</p>'+a.map(function(m){var o=RS.open===m.id;return'<div class="card"><div class="rw" data-a="op" data-id="'+m.id+'" style="cursor:pointer;margin:0"><b>'+esc(full(m))+'</b><small class="hint">'+esc(m.phone||'')+'</small></div>'+(o?'<div style="margin-top:8px">'+info(m)+WHO(m)+'<div style="margin-top:8px">'+chips(m)+'</div><div class="ia" style="margin-top:8px"><button class="ib" data-a="ed" data-id="'+m.id+'">ویرایش</button><button class="ib pr" data-a="pf" data-id="'+m.id+'">پروفایل کامل</button></div></div>':'')+'</div>'}).join('')}
RB.innerHTML='<input class="in" id="rq" placeholder="جستجوی نام یا شماره"><div id="rl"></div>';
RB.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;var id=b.dataset.id;if(b.dataset.a==='op'){RS.open=RS.open===id?'':id;rfill()}else if(b.dataset.a==='ed')openMem(id);else if(b.dataset.a==='pf'){MS.sel=id;MS.tab='pro';show('mm');mview()}});
RB.addEventListener('input',function(e){if(e.target.id==='rq'){RS.q=e.target.value;rfill()}});
window.openRs=function(){show('rs');rfill()};cbs.push(function(){if($('#rs').classList.contains('on'))rfill()});
/* ---------- prizes ---------- */
mk('pz','جوایز',1);
var PB=$('#pzb'),PT=$('#pzt'),PS={tab:'add',edit:null,fm:'',del:null};
function pview(){PT.innerHTML=[['add','ثبت جایزه'],['list','لیست جوایز']].map(function(t){return'<button class="'+(PS.tab===t[0]?'on':'')+'" data-a="tab" data-t="'+t[0]+'">'+t[1]+'</button>'}).join('');
if(PS.tab==='add'){var e=PS.edit&&DS.prz.filter(function(x){return x.id===PS.edit})[0]||{};PB.innerHTML='<div class="card"><h3>'+(PS.edit?'ویرایش جایزه':'ثبت جایزه')+'</h3><label>عضو</label><select id="pzm">'+mopts(e.mid)+'</select><label>عنوان جایزه</label><input class="in" id="pzt2" value="'+esc(e.title)+'"><label>تاریخ</label>'+dsel('pzd',e.date)+'<label>توضیحات</label><textarea id="pzx" rows="4" style="width:100%;font:inherit;background:var(--bg);color:var(--ink);border:1.5px solid var(--mute);border-radius:12px;padding:8px">'+esc(e.text)+'</textarea><button class="pri" data-a="save" style="margin-top:8px">'+(PS.edit?'ذخیرهٔ ویرایش':'ثبت')+'</button></div>';return}
var a=DS.prz.filter(function(x){return!PS.fm||x.mid===PS.fm}).sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1});
PB.innerHTML='<select class="in" id="pzf">'+mopts(PS.fm,1)+'</select><div class="ia" style="margin-bottom:8px"><button class="ib pr" data-a="txt">گزارش متنی</button></div>'+(a.map(function(x){var m=byId(x.mid);return'<div class="card"><b>'+esc(m?full(m):x.mname)+'</b><p class="hint" style="margin:2px 0">'+esc(x.title)+' — '+fd(x.date)+'</p><p style="white-space:pre-wrap;margin:6px 0">'+esc(x.text||'')+'</p>'+WHO(x)+'<div class="ia"><button class="ib" data-a="ed" data-id="'+x.id+'">ویرایش</button><button class="ib dg" data-a="del" data-id="'+x.id+'">'+(PS.del===x.id?'تأیید حذف':'حذف')+'</button></div></div>'}).join('')||'<p class="hint">جایزه‌ای ثبت نشده است.</p>')}
function pclick(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,id=b.dataset.id;
if(a==='tab'){PS.tab=b.dataset.t;PS.edit=null;PS.del=null;pview()}
else if(a==='ed'){PS.edit=id;PS.tab='add';pview()}
else if(a==='del'){if(PS.del===id){PS.del=null;del('prz',id)}else{PS.del=id;pview()}}
else if(a==='txt'){var t=head('جوایز اعضا');DS.prz.slice().sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}).forEach(function(x){var m=byId(x.mid);t+=fd(x.date)+' | '+(m?full(m):x.mname)+' | '+x.title+(x.text?' | '+x.text:'')+'\n'});txt(t)}
else if(a==='save'){var mid=$('#pzm').value,ti=$('#pzt2').value.trim();if(!mid)return gt('عضو را انتخاب کنید');if(!ti)return gt('عنوان جایزه را بنویسید');
var o={mid:mid,mname:full(byId(mid)),title:ti,text:$('#pzx').value.trim(),date:dget('pzd')},ed=PS.edit;put('prz',ed?o:Object.assign(o,{by:window.HU||'',at:Date.now()}),ed).then(function(ok){if(!ok)return;gt(ed?'ویرایش شد':'جایزه ثبت شد');PS.edit=null;if(ed)PS.tab='list';pview()})}}
PB.addEventListener('click',pclick);PT.addEventListener('click',pclick);PB.addEventListener('change',function(e){if(e.target.id==='pzf'){PS.fm=e.target.value;pview()}});
window.openPz=function(){show('pz');pview()};cbs.push(function(){if($('#pz').classList.contains('on')&&PS.tab==='list')pview()});
/* ---------- dashboard ---------- */
mk('ds','داشبورد');
var DB2=$('#dsb');
function fcalc(){return HFC(DS,{})}
function lrem(){return sum(DS.loans,function(l){var p=l.pays||{};return(+l.count||0)*(+l.amount||0)-sum(Object.keys(p),function(k){return p[k].a})})}
function dsum(){var r=fcalc(),c={};DS.disc.forEach(function(x){c[x.mid]=c[x.mid]||{p:0,m:0};c[x.mid][x.sign==='p'?'p':'m']++});
var rank=Object.keys(c).map(function(k){return{m:byId(k),n:c[k].p-c[k].m}}).filter(function(x){return x.m}).sort(function(a,b){return b.n-a.n});
var at=['h','g'].map(function(g){var a=DS.att.filter(function(x){return x.group===g}),p=a.filter(function(x){return x.status!=='a'}).length;return{g:g,s:sessN(g),n:a.length,r:a.length?Math.round(p/a.length*100):0}});
return{r:r,rank:rank,at:at,pl:DS.disc.filter(function(x){return x.sign==='p'}).length,mi:DS.disc.filter(function(x){return x.sign==='m'}).length}}
function dfill(){var s=dsum(),r=s.r;function C(t,v,c){return'<div class="card"><small>'+t+'</small><div class="'+(c||'')+'" style="font-weight:600;margin-top:4px">'+v+'</div></div>'}
var lastP=DS.prz.slice().sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}).slice(0,3),lastI=DS.inv.slice().sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}).slice(0,3);
DB2.innerHTML='<div class="ia" style="margin-bottom:8px"><button class="ib pr" data-a="dt">گزارش متنی جامع</button></div><div class="card"><small>موجودی حساب</small><div class="big '+(r.bal<0?'neg':'pos')+'">'+mn(r.bal)+'</div></div><div class="g2">'+C('تعداد اعضا',fa(DS.members.length))+C('مجموع ورودی',mn(r.inn),'pos')+C('مجموع خروجی',mn(r.out),'neg')+C('هزینهٔ ایستگاه‌ها (جزو خروجی‌ها)',mn(r.st))+C('بدهی آکادمی',mn(r.acf-r.acp))+C('بدهی خدام',mn(r.khf-r.khp))+C('بدهی‌های باقی‌ماندهٔ هیئت',mn(r.hu))+C('طلب از اشخاص',mn(r.pu))+C('مانده وام‌ها و اقساط',mn(lrem()))+'</div>'+
'<div class="card"><b>حضور و غیاب</b>'+s.at.map(function(x){return'<div class="kv"><span>'+(x.g==='h'?'هیئت':'حلقه گفتگو')+'</span><b>'+fa(x.s)+' جلسه · میانگین حضور '+fa(x.r)+'٪</b></div>'}).join('')+'</div>'+
'<div class="card"><b>موارد انضباطی</b><div class="kv"><span>مثبت / منفی</span><b>'+fa(s.pl)+' / '+fa(s.mi)+'</b></div>'+(s.rank.length?'<div class="kv"><span>بالاترین امتیاز</span><b>'+esc(full(s.rank[0].m))+' ('+fa(s.rank[0].n)+')</b></div><div class="kv"><span>پایین‌ترین امتیاز</span><b>'+esc(full(s.rank[s.rank.length-1].m))+' ('+fa(s.rank[s.rank.length-1].n)+')</b></div>':'')+'</div>'+
'<div class="card"><b>جوایز ('+fa(DS.prz.length)+')</b>'+(lastP.map(function(x){var m=byId(x.mid);return'<div class="kv"><span>'+fd(x.date)+'</span><b>'+esc(m?full(m):x.mname)+' — '+esc(x.title)+'</b></div>'}).join('')||'<p class="hint">—</p>')+'</div>'+
'<div class="card"><b>دعوت‌ها ('+fa(DS.inv.length)+')</b><div class="kv"><span>مداح / سخنران</span><b>'+fa(DS.inv.filter(function(x){return x.role==='m'}).length)+' / '+fa(DS.inv.filter(function(x){return x.role==='s'}).length)+'</b></div>'+lastI.map(function(x){return'<div class="kv"><span>'+fd(x.date)+'</span><b>'+esc(x.name)+(x.occ?' — '+esc(x.occ):'')+'</b></div>'}).join('')+'</div>'+
'<div class="card"><b>انتقاد و پیشنهاد</b><div class="kv"><span>پیشنهاد / انتقاد</span><b>'+fa(DS.sugg.filter(function(x){return x.type==='p'}).length)+' / '+fa(DS.sugg.filter(function(x){return x.type==='c'}).length)+'</b></div></div>'}
DB2.addEventListener('click',function(e){if(!e.target.closest('[data-a="dt"]'))return;var s=dsum(),r=s.r,t=head('داشبورد جامع');t+='تعداد اعضا: '+fa(DS.members.length)+'\nمجموع ورودی: '+mn(r.inn)+'\nمجموع خروجی: '+mn(r.out)+'\nموجودی حساب: '+mn(r.bal)+'\nبدهی آکادمی: '+mn(r.acf-r.acp)+'\nبدهی خدام: '+mn(r.khf-r.khp)+'\nبدهی‌های باقی‌ماندهٔ هیئت: '+mn(r.hu)+'\nطلب از اشخاص: '+mn(r.pu)+'\nهزینهٔ ایستگاه‌ها (جزو خروجی‌ها): '+mn(r.st)+'\nمانده وام‌ها و اقساط: '+mn(lrem())+'\n\n';
s.at.forEach(function(x){t+=(x.g==='h'?'هیئت':'حلقه گفتگو')+': '+fa(x.s)+' جلسه، میانگین حضور '+fa(x.r)+'٪\n'});
t+='\nانضباطی: '+fa(s.pl)+' مثبت / '+fa(s.mi)+' منفی\n';s.rank.slice(0,3).forEach(function(x){t+=full(x.m)+': امتیاز '+fa(x.n)+'\n'});
t+='\nجوایز: '+fa(DS.prz.length)+' | دعوت‌ها: '+fa(DS.inv.length)+' | انتقاد/پیشنهاد: '+fa(DS.sugg.length);txt(t)});
window.openDs=function(){show('ds');dfill()};cbs.push(function(){if($('#ds').classList.contains('on'))dfill()});
/* ---------- accounts ---------- */
var AK='hdb_auth',mode='in';
function A(){try{return JSON.parse(localStorage.getItem(AK)||'{}')}catch(e){return{}}}
async function hs(s,p){var t='heyat2:'+s+':'+p;try{var b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return[].map.call(new Uint8Array(b),function(x){return('0'+x.toString(16)).slice(-2)}).join('')}catch(e){var h=5381,i;for(i=0;i<t.length;i++)h=(h*33^t.charCodeAt(i))>>>0;return'x'+h}}
function setU(n){window.HU=n;try{localStorage.setItem('heyat_user',n);localStorage.setItem('sg_me',n);localStorage.setItem('dc_me',n)}catch(e){}$('#hu').textContent='خوش آمدید، '+n;show('home');fpUI()}
function fpm(){try{return JSON.parse(localStorage.getItem('fp_map')||'{}')}catch(e){return{}}}
function fpOK(){return!!(window.PublicKeyCredential&&navigator.credentials&&(location.protocol==='https:'||location.hostname==='localhost'))}
var fpAv=false;
function fpUI(){var m=fpm(),b=$('#fpb');$('#fpl').style.display=fpAv&&Object.keys(m).length?'block':'none';b.style.display=fpAv&&window.HU?'inline-block':'none';b.textContent=window.HU&&m[window.HU.toLowerCase()]?'حذف اثر انگشت':'فعال‌سازی اثر انگشت'}
if(fpOK())PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(function(ok){fpAv=ok;fpUI()}).catch(function(){});
window.gate=function(){var n='';try{n=localStorage.getItem('heyat_user')||''}catch(e){}if(n&&A()[n.toLowerCase()]){if(fpOK()&&fpm()[n.toLowerCase()]){show('lgs');lm('برای ورود اثر انگشت را بزنید یا با رمز عبور وارد شوید.')}else setU(n)}else show('lgs')};
function lm(t){$('#lgm').textContent=t}
function setMode(m){mode=m;$('#lgc').style.display=m==='up'?'block':'none';$('#lgt').textContent=m==='up'?'ساخت حساب جدید':'ورود به برنامه';$('#lgb').textContent=m==='up'?'ثبت‌نام':'ورود';$('#lgt2').textContent=m==='up'?'حساب دارم؛ ورود':'حساب ندارم؛ ثبت‌نام';lm('')}
$('#lgt2').onclick=function(){setMode(mode==='in'?'up':'in')};
$('#lgb').onclick=async function(){var n=$('#lgn').value.trim().replace(/\s+/g,' '),p=nn($('#lgp').value),a=A(),id=n.toLowerCase();
if(n.length<3)return lm('نام و نام خانوادگی را وارد کنید');if(p.length<4)return lm('رمز عبور باید حداقل ۴ کاراکتر باشد');
try{if(mode==='up'){if(a[id])return lm('این نام قبلاً ثبت شده است؛ وارد شوید');if(nn($('#lgq').value)!==p)return lm('تکرار رمز عبور یکسان نیست');var s=Math.random().toString(36).slice(2)+Date.now().toString(36);a[id]={name:n,salt:s,h:await hs(s,p),at:Date.now()};localStorage.setItem(AK,JSON.stringify(a));setU(n)}
else{var u=a[id];if(!u)return lm('حسابی با این نام نیست؛ ثبت‌نام کنید');if(u.h!==await hs(u.salt,p))return lm('رمز عبور اشتباه است');setU(u.name)}}catch(e){lm('انجام نشد؛ دوباره تلاش کنید')}};
$('#out').onclick=function(){try{localStorage.removeItem('heyat_user')}catch(e){}location.reload()};
$('#lgi').onclick=function(){openBk()};
$('#fpb').onclick=async function(){var k=(window.HU||'').toLowerCase(),m=fpm();try{if(m[k]){delete m[k];localStorage.setItem('fp_map',JSON.stringify(m));gt('اثر انگشت حذف شد')}else{var c=await navigator.credentials.create({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rp:{name:'Heyat'},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:window.HU,displayName:window.HU},pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required'},timeout:60000}});m[k]=b64(new Uint8Array(c.rawId));localStorage.setItem('fp_map',JSON.stringify(m));gt('اثر انگشت فعال شد')}}catch(e){gt('فعال‌سازی انجام نشد')}fpUI()};
$('#fpl').onclick=async function(){var m=fpm(),ids=Object.keys(m).map(function(k){return{type:'public-key',id:ub(m[k]),transports:['internal']}});try{var a=await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),allowCredentials:ids,userVerification:'required',timeout:60000}}),id=b64(new Uint8Array(a.rawId)),k=Object.keys(m).filter(function(x){return m[x]===id})[0],u=A()[k];if(u)setU(u.name);else lm('حسابی برای این اثر انگشت پیدا نشد')}catch(e){lm('تأیید اثر انگشت انجام نشد')}};
/* ---------- backup section ---------- */
mk('bks','پشتیبان‌گیری');
var KB=$('#bksb'),LB={members:'اعضا',att:'حضور و غیاب',disc:'موارد انضباطی',prz:'جوایز',inv:'دعوت مداحان و سخنرانان',inv_fb:'نظرات مداحان و سخنرانان',sugg:'انتقاد و پیشنهاد',ac_people:'آکادمی: افراد',ac_tx:'آکادمی: شهریه/پرداخت',ac_att:'آکادمی: حضور و غیاب',kh_people:'خدام: افراد',kh_tx:'خدام: بدهی/پرداخت',cash:'ورودی و خروجی',st:'ایستگاه صلواتی',st_staff:'ایستگاه: خادمین',st_disc:'ایستگاه: انضباطی',debts:'بدهی‌ها',loans:'وام و اقساط',auth:'حساب‌های کاربری',bk_log:'گزارش کاربران'},BS={files:[],out:null,arcs:[]};
function b64(u){var s='',i;for(i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(s)}
function ub(s){var a=atob(s),u=new Uint8Array(a.length),i;for(i=0;i<a.length;i++)u[i]=a.charCodeAt(i);return u}
async function key(p,salt){var m=await crypto.subtle.importKey('raw',new TextEncoder().encode(p),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:salt,iterations:150000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function enc(t,p){var s=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),k=await key(p,s),c=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:iv},k,new TextEncoder().encode(t)));return'HEYAT1.'+b64(s)+'.'+b64(iv)+'.'+b64(c)}
async function dec(c,p){var x=c.trim().split('.');if(x[0]!=='HEYAT1')throw 1;var k=await key(p,ub(x[1]));return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(x[2])},k,ub(x[3])))}
function lmap(c){try{return JSON.parse(localStorage.getItem('hdb_'+c)||'{}')}catch(e){return{}}}
function snap(){var o={v:3,ver:window.APP_VER,at:Date.now(),by:window.HU||'',d:{}};Object.keys(LB).forEach(function(c){o.d['hdb_'+c]=localStorage.getItem('hdb_'+c)||'{}'});o.d.hdb__del=localStorage.getItem('hdb__del')||'{}';o.d.hdb__arch=localStorage.getItem('hdb__arch')||'{}';return JSON.stringify(o)}
function sig(c,x){switch(c){case'ac_tx':case'kh_tx':return[x.pid,x.kind,x.amount,x.date].join('|');case'cash':return[x.type,x.title,x.amount,x.date].join('|');case'disc':return[x.mid,x.sign,x.date,x.text].join('|');case'prz':return[x.mid,x.title,x.date].join('|');case'inv':return[x.role,x.name,x.date,x.occ].join('|');case'st':return[x.station,x.time,x.name,x.qty,x.price].join('|');case'debts':return[x.dir,x.title,x.person,x.amount,x.date].join('|');case'sugg':return[x.by,x.type,x.text].join('|');case'loans':return[x.title,x.start,x.count,x.amount].join('|');case'ac_att':return[x.pid,x.date,x.status].join('|');case'inv_fb':return[x.inv,x.by,x.r,x.c].join('|');case'st_staff':return[x.stk,x.mid].join('|');case'st_disc':return[x.mid,x.sign,x.date,x.text,x.stk].join('|')}return null}
function plan(datas,opt){opt=opt||{};var out={},res={},T={},dups=0,S={},inc=[];
Object.keys(LB).forEach(function(c){out[c]=lmap(c);res[c]={add:0,upd:0,skip:0,sim:0,rm:0};S[c]={}});
try{T=JSON.parse(localStorage.getItem('hdb__del')||'{}')}catch(e){T={}}
var AM=0;try{AM=+JSON.parse(localStorage.getItem('hdb__arch')||'{}').att||0}catch(e){}
datas.forEach(function(d){var o={};Object.keys(LB).forEach(function(c){try{o[c]=JSON.parse(d['hdb_'+c]||'{}')}catch(e){o[c]={}}});inc.push(o);try{var am=+JSON.parse(d.hdb__arch||'{}').att||0;if(am>AM)AM=am}catch(e){}try{var t=JSON.parse(d.hdb__del||'{}');Object.keys(t).forEach(function(k){if(!T[k]||T[k]<t[k])T[k]=t[k]})}catch(e){}});
if(opt.rest!=null)AM=Math.min(AM,opt.rest);
function yrOf(x){return+String(x.date||'').split('-')[0]||0}
function dead(c,id,x){var t=T[c+'/'+id];return t&&t>=(x._u||0)}
Object.keys(LB).forEach(function(c){Object.keys(out[c]).forEach(function(k){var g=sig(c,out[c][k]);if(g)S[c][g]=(c==='inv'?k:1)})});
inc.forEach(function(o){var map={members:{},ac_people:{},kh_people:{},inv:{}},added=[];
['members','ac_people','kh_people'].forEach(function(c){var nm=function(x){return norm(c==='members'?full(x):x.name)};Object.keys(o[c]).forEach(function(id){var x=o[c][id];if(dead(c,id,x))return;if(out[c][id]){if((x._u||0)>(out[c][id]._u||0)){out[c][id]=x;res[c].upd++}else res[c].skip++;return}var n=nm(x),dup=Object.keys(out[c]).filter(function(k){return nm(out[c][k])===n})[0];if(dup){map[c][id]=dup;res[c].skip++;dups++}else{out[c][id]=x;res[c].add++;if(c==='members')added.push(id)}})});
added.forEach(function(id){var m=out.members[id];if(m.ref&&map.members[m.ref])m.ref=map.members[m.ref]});
function other(c,idf,fix,skipf){Object.keys(o[c]).forEach(function(id0){var x=o[c][id0];if(fix)fix(x);var id=idf?idf(x):id0;if(skipf&&skipf(x)){res[c].arch=(res[c].arch||0)+1;return}if(dead(c,id,x))return;var l=out[c][id];if(l){if((x._u||0)>(l._u||0)){out[c][id]=x;res[c].upd++}else res[c].skip++;return}var g=sig(c,x);if(opt.sim&&g&&S[c][g]){res[c].sim++;if(c==='inv'&&S[c][g]!==1)map.inv[id0]=S[c][g];return}if(g)S[c][g]=(c==='inv'?id:1);out[c][id]=x;res[c].add++})}
other('att',function(x){return x.group+'_'+x.date+'_'+x.member},function(x){x.member=map.members[x.member]||x.member},function(x){return AM&&yrOf(x)<=AM});
other('disc',null,function(x){x.mid=map.members[x.mid]||x.mid});other('prz',null,function(x){x.mid=map.members[x.mid]||x.mid});
other('ac_tx',null,function(x){x.pid=map.ac_people[x.pid]||x.pid});other('kh_tx',null,function(x){x.pid=map.kh_people[x.pid]||x.pid});other('inv');other('inv_fb',function(x){return x.inv+'__'+String(x.by).replace(/\//g,'-')},function(x){x.inv=map.inv[x.inv]||x.inv});other('bk_log');other('ac_att',function(x){return x.date+'_'+x.pid},function(x){x.pid=map.ac_people[x.pid]||x.pid});
['sugg','cash','st','debts'].forEach(function(c){other(c)});other('st_staff',null,function(x){x.mid=map.members[x.mid]||x.mid});other('st_disc',null,function(x){x.mid=map.members[x.mid]||x.mid});
Object.keys(o.loans).forEach(function(id){var x=o.loans[id],l=out.loans[id];if(dead('loans',id,x))return;if(!l){var g=sig('loans',x);if(opt.sim&&S.loans[g]){res.loans.sim++;return}S.loans[g]=1;out.loans[id]=x;res.loans.add++}else{var nw=(x._u||0)>(l._u||0),pu=Object.assign({},x.pays||{},l.pays||{});if(nw||Object.keys(pu).length>Object.keys(l.pays||{}).length){out.loans[id]=Object.assign({},nw?x:l,{pays:pu});res.loans.upd++}else res.loans.skip++}});
Object.keys(o.auth).forEach(function(id){if(!out.auth[id]){out.auth[id]=o.auth[id];res.auth.add++}else res.auth.skip++})});
Object.keys(T).forEach(function(k){var i=k.indexOf('/'),c=k.slice(0,i),id=k.slice(i+1);if(out[c]&&out[c][id]&&T[k]>=(out[c][id]._u||0)){delete out[c][id];res[c].rm++}});
if(AM)Object.keys(out.att).forEach(function(k){if(yrOf(out.att[k])<=AM){delete out.att[k];res.att.rm++}});
return{out:out,res:res,dups:dups,T:T,AM:AM}}
function withBlankLocal(fn){var ks=Object.keys(LB).filter(function(c){return c!=='auth'}).map(function(c){return'hdb_'+c}).concat(['hdb__del','hdb__arch']),sv={};ks.forEach(function(k){sv[k]=localStorage.getItem(k);localStorage.setItem(k,'{}')});try{return fn()}finally{ks.forEach(function(k){if(sv[k]===null)localStorage.removeItem(k);else localStorage.setItem(k,sv[k])})}}
function showPlan(){var sim=$('#ksim')?$('#ksim').checked:true,rest=null;BS.arcs.forEach(function(a){if(a){var f=a.from-1;rest=rest==null?f:Math.min(rest,f)}});var fullR=!!($('#fullr')&&$('#fullr').checked);BS.full=fullR;var P=fullR?withBlankLocal(function(){return plan(BS.datas,{sim:sim,rest:rest})}):plan(BS.datas,{sim:sim,rest:rest});BS.out=P.out;BS.T=P.T;BS.AM=P.AM;
var h='<h3 style="margin-top:12px">فایل‌های بررسی‌شده</h3>'+BS.meta.map(function(m){return'<div class="kv"><span>'+esc(m.n)+'</span><b>'+(m.by?esc(m.by):'—')+(m.at?' — '+esc(new Date(m.at).toLocaleDateString('fa-IR')):'')+'</b></div>'}).join('')+'<label style="margin-top:8px"><input type="checkbox" id="ksim"'+(sim?' checked':'')+'> موارد کاملاً مشابه (احتمالاً ثبت تکراری یک تراکنش) نادیده گرفته شود</label><h3 style="margin-top:12px">خلاصهٔ تغییرات</h3>';
Object.keys(LB).forEach(function(c){var r=P.res[c],p=[];if(r.add)p.push(fa(r.add)+' جدید');if(r.upd)p.push(fa(r.upd)+' به‌روز');if(r.rm)p.push(fa(r.rm)+' حذف');if(r.sim)p.push(fa(r.sim)+' مشابه (نادیده)');if(r.arch)p.push(fa(r.arch)+' بایگانی‌شده (نادیده)');if(r.skip)p.push(fa(r.skip)+' بدون تغییر');if(p.length)h+='<div class="kv"><span>'+LB[c]+'</span><b>'+p.join(' · ')+'</b></div>'});
$('#kpv').innerHTML=h+(P.dups?'<p class="hint">'+fa(P.dups)+' عضو یا فرد همنام با اطلاعات فعلی یکی شد.</p>':'')+'<p class="hint">نسخهٔ جدیدتر هر مورد جایگزین می‌شود و مواردی که در فایل‌ها حذف شده‌اند حذف می‌شوند. هیچ‌چیز تا تأیید شما تغییر نمی‌کند.</p><button class="pri" data-k="apply">تأیید و افزودن</button>'}
function usage(){var n=0,i,k;for(i=0;i<localStorage.length;i++){k=localStorage.key(i);n+=k.length+(localStorage.getItem(k)||'').length}var pc=Math.round(n/5000000*100);return fa(pc)+'٪ (حدود '+fa(Math.round(n/1000))+' هزار از ۵ هزار هزار کاراکتر)'+(pc>=60?' — پیشنهاد: بایگانی':'')}
function archCard(){var cur=today().y,ys={};Object.values(lmap('att')).forEach(function(x){var y=+String(x.date).split('-')[0];if(y&&y<cur)ys[y]=1});var a=Object.keys(ys).sort();return'<div class="card"><h3>بایگانی حضور و غیاب سال‌های قبل</h3><p class="hint">ثبت‌های حضور و غیاب سال‌های گذشته در یک فایل جدا ذخیره و از برنامه خارج می‌شود تا برنامه سبک بماند. بعد از آن، این سال‌ها در گزارش‌ها نمی‌آید و با ادغام فایل‌های دیگران هم برنمی‌گردد. با «ورودی»ِ همان فایل بایگانی، می‌توانید آن‌ها را برگردانید.</p>'+(a.length?'<select class="in" id="ayr"><option value="">انتخاب سال…</option>'+a.map(function(y){return'<option value="'+y+'">تا پایان سال '+fa(y)+'</option>'}).join('')+'</select><div id="ainfo"></div><input class="in" id="apw" type="password" autocomplete="off" placeholder="رمز عبور شما"><button class="sec" data-k="arc">ساخت فایل بایگانی</button><div id="adel"></div>':'<p class="hint">هنوز ثبتی برای سال‌های قبل وجود ندارد.</p>')+'</div>'}
function kfill(){var l=Object.keys(LB).filter(function(c){return c!=='auth'}).map(function(c){return[LB[c],Object.keys(lmap(c)).length]}).filter(function(x){return x[1]}),last=0;try{last=+localStorage.getItem('bk_last')||0}catch(e){}
KB.innerHTML='<div class="card"><b>وضعیت</b><div class="kv"><span>آخرین پشتیبان</span><b>'+(last?esc(new Date(last).toLocaleString('fa-IR')):'هنوز گرفته نشده')+'</b></div><div class="kv"><span>ذخیرهٔ پایدار مرورگر</span><b id="kps">…</b></div><div class="kv"><span>حافظهٔ اشغال‌شده</span><b>'+usage()+'</b></div>'+(l.length?l.map(function(x){return'<div class="kv"><span>'+x[0]+'</span><b>'+fa(x[1])+'</b></div>'}).join(''):'<p class="hint">هنوز اطلاعاتی ثبت نشده است.</p>')+'</div>'+
'<div class="card"><h3>خروجی (ساخت فایل پشتیبان)</h3><p class="hint" id="kme">رمز عبور حساب خودتان را وارد کنید؛ فایل با همین رمز قفل می‌شود.</p><input class="in" id="kpw" type="password" autocomplete="off" placeholder="رمز عبور شما"><button class="pri" data-k="out">ساخت و ذخیرهٔ فایل</button></div>'+
'<div class="card"><h3>ورودی (یک یا چند فایل)</h3><p class="hint">می‌توانید فایل پشتیبان چند نفر را یکجا انتخاب کنید. رمز هر فایل را رمز عبور صاحب همان فایل وارد کنید. قبل از افزودن، خلاصهٔ تغییرات نمایش داده می‌شود.</p><input type="file" id="kfi" class="in" multiple><div id="kfl"></div><button class="sec" data-k="chk">بررسی فایل‌ها</button><div id="kpv"></div></div>'+
archCard()+'<div class="card"><b>روش پیشنهادی برای کار گروهی</b><p class="hint">۱) یک نفر مسئول فایل اصلی است و فقط او عضو جدید ثبت می‌کند.<br>۲) هر کس بخش خودش را ثبت می‌کند و در پایان هفته «خروجی» می‌گیرد و برای مسئول می‌فرستد.<br>۳) مسئول همهٔ فایل‌ها را یکجا در «ورودی» انتخاب می‌کند، خلاصه را می‌بیند، تأیید می‌کند و فایل اصلی تازه می‌سازد.<br>۴) بقیه فایل اصلی تازه را در «ورودی» می‌زنند تا همه هم‌نسخه شوند. ساعت گوشی‌ها باید درست باشد، چون در ویرایش یک مورد در چند گوشی، تازه‌ترین ویرایش می‌ماند.</p></div>'+'<div class="card"><b>نکتهٔ مهم</b><p class="hint">پاک کردن «کش» معمولاً اطلاعات برنامه را پاک نمی‌کند، ولی پاک کردن «اطلاعات سایت/کوکی‌ها» یا حذف برنامه همه‌چیز را پاک می‌کند. تنها نسخهٔ مطمئن، فایل پشتیبان بیرون از مرورگر است؛ آن را در جای امن (مثلاً پیام‌های ذخیره‌شده) نگه دارید.</p></div>';
try{navigator.storage.persist().then(function(p){$('#kps').textContent=p?'فعال':'غیرفعال (مرورگر ممکن است اطلاعات را پاک کند)'})}catch(e){$('#kps').textContent='نامشخص'}}
function km(t){var e=$('#kme');if(e)e.textContent=t}
KB.addEventListener('change',function(e){if(e.target.id==='ksim'){showPlan();return}if(e.target.id==='ayr'){var Y2=+e.target.value,n2=0;Object.values(lmap('att')).forEach(function(x){if(+String(x.date).split('-')[0]<=Y2)n2++});$('#ainfo').innerHTML=Y2?'<p class="hint">'+fa(n2)+' ثبت تا پایان سال '+fa(Y2)+' بایگانی می‌شود.</p>':'';return}if(e.target.id!=='kfi')return;BS.files=[].slice.call(e.target.files);$('#kfl').innerHTML=BS.files.map(function(f,i){return'<label>'+esc(f.name)+'</label><input class="in kpi" type="password" autocomplete="off" placeholder="رمز عبور صاحب این فایل">'}).join('');$('#kpv').innerHTML=''});
KB.addEventListener('click',async function(e){var k=e.target.dataset.k;if(!k)return;
try{
if(k==='out'){var p=nn($('#kpw').value),u=A()[(window.HU||'').toLowerCase()];if(!u)return km('ابتدا وارد حساب شوید');if(u.h!==await hs(u.salt,p))return km('این رمز عبور حساب شما نیست');
var _d0=new Date();bkLog('backup','heyat-backup-'+tk()+'-'+pad(_d0.getHours())+pad(_d0.getMinutes())+'.txt');var c=await enc(snap(),p),d=new Date(),fn='heyat-backup-'+tk()+'-'+pad(d.getHours())+pad(d.getMinutes())+'.txt',f=new Blob([c],{type:'text/plain'});
var l=document.createElement('a');l.href=URL.createObjectURL(f);l.download=fn;document.body.appendChild(l);l.click();l.remove()
try{localStorage.setItem('bk_last',Date.now())}catch(x){}$('#bkn').textContent='';kfill();km('فایل پشتیبان ساخته شد')}
else if(k==='chk'){if(!BS.files.length)return $('#kpv').innerHTML='<p class="hint">ابتدا فایل‌ها را انتخاب کنید.</p>';var pw=[].map.call(document.querySelectorAll('.kpi'),function(x){return nn(x.value)}),datas=[],errs=[],meta=[],arcs=[];
for(var i=0;i<BS.files.length;i++){try{var o=JSON.parse(await dec(await BS.files[i].text(),pw[i]));datas.push(o.d);meta.push({n:BS.files[i].name+(o.arch?' (بایگانی '+fa(o.arch.from)+'–'+fa(o.arch.to)+')':''),by:o.by,at:o.at});arcs.push(o.arch||null)}catch(x){errs.push(BS.files[i].name)}}
if(errs.length)return $('#kpv').innerHTML='<p class="warn">رمز یا فایل اشتباه است: '+errs.map(esc).join('، ')+'</p>';
BS.datas=datas;BS.meta=meta;BS.arcs=arcs;showPlan()}
else if(k==='apply'){if(BS.full&&!confirm('همهٔ داده‌های این گوشی با فایل پشتیبان جایگزین می‌شود (حساب‌های کاربری حفظ می‌شوند). ادامه می‌دهید؟'))return;if(BS.out){BS.out.bk_log=BS.out.bk_log||{};var _e={by:window.HU||'ناشناس',at:Date.now(),kind:'merge',detail:BS.files.map(function(f){return f.name}).join('، ')};BS.out.bk_log[_e.at+'_m']=_e}var old={},ks=Object.keys(LB).map(function(c){return'hdb_'+c}).concat(['hdb__del','hdb__arch']);ks.forEach(function(x){old[x]=localStorage.getItem(x)});
try{Object.keys(LB).forEach(function(c){localStorage.setItem('hdb_'+c,JSON.stringify(BS.out[c]))});localStorage.setItem('hdb__del',JSON.stringify(BS.T||{}));localStorage.setItem('hdb__arch',JSON.stringify(BS.AM?{att:BS.AM}:{}))}catch(x){ks.forEach(function(k2){try{if(old[k2]===null)localStorage.removeItem(k2);else localStorage.setItem(k2,old[k2])}catch(y){}});return $('#kpv').insertAdjacentHTML('beforeend','<p class="warn">حافظه پر است؛ ادغام انجام نشد و اطلاعات فعلی دست‌نخورده ماند. ابتدا بایگانی کنید.</p>')}
gt('اطلاعات ادغام شد');setTimeout(function(){location.reload()},600)}
else if(k==='arc'){var Y=+$('#ayr').value,pw2=nn($('#apw').value),u2=A()[(window.HU||'').toLowerCase()];if(!Y)return $('#ainfo').innerHTML='<p class="hint">سال را انتخاب کنید.</p>';if(!u2)return km('ابتدا وارد حساب شوید');if(u2.h!==await hs(u2.salt,pw2))return $('#ainfo').innerHTML='<p class="warn">این رمز عبور حساب شما نیست.</p>';
var att=lmap('att'),sub={},mnY=9999,cnt=0;Object.keys(att).forEach(function(k3){var y=+String(att[k3].date).split('-')[0];if(y<=Y){sub[k3]=att[k3];cnt++;if(y<mnY)mnY=y}});if(!cnt)return $('#ainfo').innerHTML='<p class="hint">ثبتی برای این بازه نیست.</p>';
var pl=JSON.stringify({v:3,ver:window.APP_VER,at:Date.now(),by:window.HU||'',arch:{from:mnY,to:Y},d:{hdb_att:JSON.stringify(sub)}}),c2=await enc(pl,pw2),chk2=JSON.parse(await dec(c2,pw2));if(Object.keys(JSON.parse(chk2.d.hdb_att)).length!==cnt)return $('#ainfo').innerHTML='<p class="warn">بررسی فایل ناموفق بود؛ چیزی حذف نشد.</p>';
var f2=new Blob([c2],{type:'text/plain'});
var l2=document.createElement('a');l2.href=URL.createObjectURL(f2);l2.download='heyat-archive-'+mnY+'-'+Y+'.txt';document.body.appendChild(l2);l2.click();l2.remove()
BS.arcY=Y;$('#adel').innerHTML='<p class="hint">فایل بایگانی ساخته و بررسی شد ('+fa(cnt)+' ثبت). ابتدا مطمئن شوید آن را جای امن ذخیره کرده‌اید.</p><button class="ib dg" data-k="arcdel" style="width:100%;padding:10px">فایل را ذخیره کردم؛ حذف از برنامه</button>'}
else if(k==='arcdel'){var Y3=BS.arcY;if(!Y3)return;var att3=lmap('att'),n3=0;Object.keys(att3).forEach(function(k4){if(+String(att3[k4].date).split('-')[0]<=Y3){delete att3[k4];n3++}});var am3=0;try{am3=+JSON.parse(localStorage.getItem('hdb__arch')||'{}').att||0}catch(x){}
localStorage.setItem('hdb_att',JSON.stringify(att3));localStorage.setItem('hdb__arch',JSON.stringify({att:Math.max(am3,Y3)}));gt(fa(n3)+' ثبت بایگانی و از برنامه حذف شد');setTimeout(function(){location.reload()},700)}
}catch(x){if(x&&x.name==='AbortError')return;km('انجام نشد؛ دوباره تلاش کنید')}});
window.openBk=function(){show('bks');kfill()};
var lastB=0;try{lastB=+localStorage.getItem('bk_last')||0}catch(e){}
if(Date.now()-lastB>7*864e5)$('#bkn').textContent=lastB?'بیش از یک هفته از آخرین پشتیبان گذشته است.':'هنوز پشتیبان نگرفته‌اید؛ بخش «پشتیبان‌گیری» را باز کنید.';
/* ---------- update section ---------- */
mk('ups','به‌روزرسانی');
var UB=$('#upsb'),UF=null;
function ufill(){var sv=0;try{sv=+localStorage.getItem('app_ver')||0}catch(e){}UB.innerHTML='<div class="card"><div class="kv"><span>نسخهٔ در حال اجرا</span><b>'+fa(window.APP_VER)+'</b></div><div class="kv"><span>نسخهٔ نصب‌شدهٔ ذخیره‌شده</span><b>'+(sv?fa(sv):'—')+'</b></div></div><div class="card"><h3>نصب نسخهٔ جدید</h3><p class="hint">فایل جدید برنامه (heyat-offline.html) را که از Claude گرفته‌اید انتخاب کنید. اطلاعات و حساب‌ها دست نمی‌خورد. فقط فایل‌هایی را نصب کنید که خودتان از منبع مطمئن گرفته‌اید.</p><input type="file" id="ufi" class="in" accept=".html,text/html"><div id="uvv"></div></div>'+(sv?'<button class="ib dg" data-u="rm" style="width:100%;padding:10px">حذف نسخهٔ نصب‌شده و بازگشت به نسخهٔ خودِ فایل</button>':'')}
UB.addEventListener('change',async function(e){if(e.target.id!=='ufi')return;var f=e.target.files[0];if(!f)return;var t=await f.text(),m=/var APP_VER=(\d+)/.exec(t),v=m?+m[1]:0;
if(t.indexOf('<!--HEYAT-APP-->')<0||!v)return $('#uvv').innerHTML='<p class="warn">این فایل نسخهٔ معتبر برنامه نیست.</p>';
if(v<=window.APP_VER)return $('#uvv').innerHTML='<p class="warn">این نسخه ('+fa(v)+') جدیدتر از نسخهٔ فعلی ('+fa(window.APP_VER)+') نیست.</p>';
UF={t:t,v:v};$('#uvv').innerHTML='<p class="hint" style="margin-top:8px">نسخهٔ '+fa(window.APP_VER)+' ← نسخهٔ '+fa(v)+'</p><button class="pri" data-u="ins">تأیید و نصب</button>'});
UB.addEventListener('click',function(e){var u=e.target.dataset.u;if(u==='ins'&&UF){try{localStorage.setItem('app_html',UF.t);localStorage.setItem('app_ver',UF.v);gt('نصب شد؛ در حال بارگذاری');setTimeout(function(){location.reload()},600)}catch(x){gt('حافظه کافی نیست')}}else if(u==='rm'){localStorage.removeItem('app_html');localStorage.removeItem('app_ver');location.reload()}});
window.openUp=function(){show('ups');ufill()};
/* ---------- themes ---------- */
var K=['--bg','--bg2','--ink','--mute','--card','--p','--p2','--gold','--shadow'],TH=[['خودکار',null],['سبز روشن',['#f4efe6','#e6efe9','#1f3a37','#5d7673','#ffffff','#1f6f68','#2f9a8f','#c9a24a','rgba(31,58,55,.18)']],['آبی',['#eef3fa','#e2ebf7','#1b2b44','#5a6b86','#ffffff','#2556a8','#3f7fd6','#d4a73a','rgba(27,43,68,.18)']],['بنفش',['#f5f0fa','#ebe3f5','#2e1f45','#6f5f88','#ffffff','#6b3fa0','#8d62c4','#d1a23c','rgba(46,31,69,.18)']],['کهربایی',['#faf3e8','#f3e6d0','#3d2a14','#86694a','#ffffff','#a8601e','#cf8337','#2f7d6e','rgba(61,42,20,.18)']],['سبز تیره',['#0f1f1e','#14302c','#eaf1ee','#9db5b0','#1a3431','#3aa89b','#5cc7ba','#e0bb62','rgba(0,0,0,.5)']],['سرمه‌ای تیره',['#0e1626','#16233d','#e8eefc','#9aa9c7','#1b2a47','#5b8def','#7fa8ff','#e3c26b','rgba(0,0,0,.5)']],['صورتی ملایم',['#fbf1f3','#f5e3e8','#4a2631','#8a6470','#ffffff','#b3476a','#d06b8c','#c9a24a','rgba(74,38,49,.18)']],['نعنایی',['#f0f8f5','#e0f2ec','#1d3d33','#5b7f73','#ffffff','#2a8a6e','#4fb393','#c8a14e','rgba(29,61,51,.18)']],['خاکستری',['#f3f4f6','#e5e7eb','#1f2937','#6b7280','#ffffff','#374151','#6b7280','#b8893a','rgba(31,41,55,.16)']],['شکلاتی',['#f7f1ea','#ecdfd0','#3b2418','#7d5d4a','#fffaf5','#7a4a2b','#a86b43','#c9a24a','rgba(59,36,24,.18)']],['زیتونی',['#f4f4ec','#e6e8d6','#2f3a1f','#6c7457','#ffffff','#5b6b2f','#7f9142','#c49a3c','rgba(47,58,31,.18)']],['یاسی روشن',['#f7f4fc','#ece6f7','#2a2440','#716a8c','#ffffff','#6a5bb5','#8c7fd1','#c9a24a','rgba(42,36,64,.16)']],['نارنجی',['#fff6ef','#fde8d6','#4a2a12','#8f6548','#ffffff','#d2651f','#e8864a','#2f7d6e','rgba(74,42,18,.18)']],['مشکی و طلایی',['#0b0b0c','#18181b','#f5f1e6','#a8a291','#1f1f23','#d4af37','#e6c75a','#d4af37','rgba(0,0,0,.6)']],['دریایی تیره',['#081a24','#0f2a38','#e2f3f8','#8fb3c2','#16384a','#2fa4c7','#55c0dc','#e3c26b','rgba(0,0,0,.5)']],['بنفش تیره',['#140d22','#1f1533','#efe9fb','#a596c4','#2a1f45','#9b6dff','#b592ff','#e3c26b','rgba(0,0,0,.5)']],['قرمز تیره',['#1d0f0f','#2c1616','#f8ecec','#b89a9a','#3a1f1f','#c0392b','#e0584a','#e3c26b','rgba(0,0,0,.5)']],['سفارشی',null,1]],ti=0;
try{ti=+localStorage.getItem('theme_i')||0}catch(e){}
var CU={a:'#1f6f68',b:'#c9a24a',m:'l'};
try{var _tc=JSON.parse(localStorage.getItem('theme_c')||'null');if(_tc&&/^#[0-9a-f]{6}$/i.test(_tc.a)&&/^#[0-9a-f]{6}$/i.test(_tc.b))CU={a:_tc.a,b:_tc.b,m:_tc.m==='d'?'d':'l'}}catch(e){}
function tcSave(){try{localStorage.setItem('theme_c',JSON.stringify(CU))}catch(e){}}
function tcH2R(h){h=String(h).replace('#','');return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0]}
function tcR2H(r){return'#'+r.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return(v<16?'0':'')+v.toString(16)}).join('')}
function tcMix(a,b,t){var x=tcH2R(a),y=tcH2R(b);return tcR2H([0,1,2].map(function(i){return x[i]+(y[i]-x[i])*t}))}
function tcLum(h){var c=tcH2R(h).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function tcCr(a,b){var x=tcLum(a),y=tcLum(b);if(x<y){var t=x;x=y;y=t}return(x+.05)/(y+.05)}
function tcFix(c,bg,min,to){var n=0;while(tcCr(c,bg)<min&&n++<40)c=tcMix(c,to,.08);return c}
/* two chosen colours -> a full, readable palette (light or dark base) */
function tcPal(){var a=CU.a,g=CU.b,d=CU.m==='d',p=a,bg,bg2,card,ink,mute,sh,Z='#000000',W='#ffffff',n=0,q;
if(!d){p=tcFix(p,W,4.5,Z);bg=tcMix(p,W,.93);bg2=tcMix(p,W,.86);card=W;ink=tcFix(tcMix(p,Z,.78),bg,9,Z);mute=tcFix(tcMix(ink,W,.38),bg,4.5,ink);q=tcH2R(ink);sh='rgba('+q[0]+','+q[1]+','+q[2]+',.18)'}
else{while(tcLum(p)<.13&&n++<40)p=tcMix(p,W,.08);n=0;while(tcLum(p)>.3&&n++<40)p=tcMix(p,Z,.08);bg=tcMix(a,Z,.9);bg2=tcMix(a,Z,.84);card=tcMix(a,Z,.78);ink=tcMix(a,W,.92);mute=tcFix(tcMix(ink,bg,.38),card,4.5,ink);sh='rgba(0,0,0,.5)'}
g=tcFix(g,d?card:bg,3,d?W:Z);
return[bg,bg2,ink,mute,card,p,tcMix(p,W,.25),g,sh]}
function tcHSL(h){var c=tcH2R(h).map(function(v){return v/255}),mx=Math.max(c[0],c[1],c[2]),mn=Math.min(c[0],c[1],c[2]),l=(mx+mn)/2,sa=0,hh=0,d=mx-mn;if(d){sa=d/(1-Math.abs(2*l-1));hh=mx===c[0]?((c[1]-c[2])/d)%6:mx===c[1]?(c[2]-c[0])/d+2:(c[0]-c[1])/d+4;hh*=60;if(hh<0)hh+=360}return[Math.round(hh)%360,Math.round(sa*100),Math.round(l*100)]}
function tcHEX(h,sa,l){sa/=100;l/=100;var a=sa*Math.min(l,1-l),f=function(n){var k=(n+h/30)%12;return l-a*Math.max(-1,Math.min(k-3,Math.min(9-k,1)))};return tcR2H([f(0)*255,f(8)*255,f(4)*255])}
var CSW=['#1f6f68','#2556a8','#6b3fa0','#a8601e','#b3476a','#c0392b','#2f9a5a','#d4af37','#374151','#0ea5e9'];
function cuBlock(k,lab){var h=tcHSL(CU[k]);return'<div class="cub" data-k="'+k+'" style="--hh:'+h[0]+'"><div class="cuh"><b>'+lab+'</b><i class="cup" style="background:'+CU[k]+'"></i><input class="in cux" dir="ltr" maxlength="7" autocomplete="off" spellcheck="false" aria-label="کد رنگ '+lab+'" value="'+CU[k]+'"></div><div class="cusw">'+CSW.map(function(c){return'<button type="button" data-sw="'+c+'" style="background:'+c+'" aria-label="'+c+'"></button>'}).join('')+'</div><label>طیف رنگ</label><input type="range" class="cur ch" min="0" max="360" value="'+h[0]+'"><label>شدت رنگ</label><input type="range" class="cur cs" min="0" max="100" value="'+h[1]+'"><label>روشنی</label><input type="range" class="cur cl" min="0" max="100" value="'+h[2]+'"></div>'}
function cuHtml(){return'<p class="hint" style="margin-top:0">دو رنگ را خودتان انتخاب کنید (با نوارها، کد رنگ یا نمونه‌ها)؛ بقیهٔ رنگ‌ها خودکار هماهنگ و خوانا می‌شوند.</p>'+cuBlock('a','رنگ اصلی')+cuBlock('b','رنگ مکمل')+'<div class="seg"><button data-cm="l" class="'+(CU.m==='l'?'on':'')+'">پس‌زمینهٔ روشن</button><button data-cm="d" class="'+(CU.m==='d'?'on':'')+'">پس‌زمینهٔ تیره</button></div><button class="ib" data-cm="r" style="width:100%">بازنشانی رنگ‌های دلخواه</button>'}
function tcSet(d,k,hex,src){CU[k]=hex;tcSave();ti=TH.length-1;try{localStorage.setItem('theme_i',ti)}catch(x){}applyT();
var bs=d.querySelectorAll('.thb');[].forEach.call(bs,function(x,i){x.classList.toggle('on',i===bs.length-1)});var sw=bs[bs.length-1].querySelectorAll('i'),pl=tcPal();sw[0].style.background=pl[5];sw[1].style.background=pl[7];
var bl=d.querySelector('.cub[data-k="'+k+'"]');if(!bl)return;bl.querySelector('.cup').style.background=hex;var r=bl.querySelectorAll('.cur');
if(src==='s'){bl.style.setProperty('--hh',r[0].value)}else{var h=tcHSL(hex);r[0].value=h[0];r[1].value=h[1];r[2].value=h[2];bl.style.setProperty('--hh',h[0]);if(src!=='x')bl.querySelector('.cux').value=hex}if(src==='s')bl.querySelector('.cux').value=hex}
function curT(){var t=TH[ti];return t&&(t[2]?tcPal():t[1])}
function applyT(){var de=document.documentElement,r=de.style,t=curT();K.forEach(function(k){r.removeProperty(k)});r.removeProperty('--onsec');de.removeAttribute('data-tone');
if(t){K.forEach(function(k,i){r.setProperty(k,t[i])});r.setProperty('--onsec',tcCr(t[7],'#1b2b29')>=4.5?'#1b2b29':'#ffffff');de.setAttribute('data-tone',tcLum(t[0])<.2?'d':'l')}}
applyT();
var UIS=[['circle','دایره‌ای','●'],['sq','مربعی','■'],['list','خطی (لیستی)','☰'],['tile','کاشی','▦'],['outline','حاشیه‌ای','○'],['glass','شیشه‌ای','◈']];
function uiK(){try{return localStorage.getItem('ui_k')||'circle'}catch(e){return'circle'}}
function thHtml(){var k=uiK();return'<div class="sh"><h3>ظاهر برنامه</h3><label>شکل و ساختار</label><div class="uig">'+UIS.map(function(u){return'<button class="'+(u[0]===k?'on':'')+'" data-ui="'+u[0]+'"><b>'+u[2]+'</b>'+u[1]+'</button>'}).join('')+'</div><label>رنگ</label><div class="thg">'+TH.map(function(t,i){var c=t[2]?tcPal():(t[1]||[0,0,0,0,0,'#1f6f68',0,'#c9a24a']);return'<button class="thb'+(i===ti?' on':'')+'" data-th="'+i+'"><span><i style="background:'+c[5]+'"></i><i style="background:'+c[7]+'"></i></span>'+t[0]+'</button>'}).join('')+'</div><label>رنگ دلخواه</label><div class="card" id="cuc">'+cuHtml()+'</div><button class="pri" data-th="x">بستن</button></div>'}
function thDraw(d){var o=d.firstChild?d.firstChild.scrollTop:0;d.innerHTML=thHtml();if(d.firstChild)d.firstChild.scrollTop=o}
$('#thm').onclick=function(){var d=document.getElementById('thp');if(!d){d=document.createElement('div');d.id='thp';document.body.appendChild(d);
d.addEventListener('click',function(e){if(e.target===d){d.classList.remove('on');return}var b=e.target.closest('[data-ui],[data-th],[data-cm],[data-sw]');if(!b)return;
if(b.dataset.sw){CU[b.closest('.cub').dataset.k]=b.dataset.sw;tcSave();ti=TH.length-1;try{localStorage.setItem('theme_i',ti)}catch(x){}applyT();thDraw(d)}
else if(b.dataset.cm){if(b.dataset.cm==='r')CU={a:'#1f6f68',b:'#c9a24a',m:'l'};else CU.m=b.dataset.cm;tcSave();ti=TH.length-1;try{localStorage.setItem('theme_i',ti)}catch(x){}applyT();thDraw(d)}
else if(b.dataset.ui){try{localStorage.setItem('ui_k',b.dataset.ui)}catch(x){}document.documentElement.setAttribute('data-ui',b.dataset.ui);thDraw(d)}
else if(b.dataset.th==='x')d.classList.remove('on');
else{ti=+b.dataset.th;try{localStorage.setItem('theme_i',ti)}catch(x){}applyT();thDraw(d)}});
d.addEventListener('input',function(e){var t=e.target,bl=t.closest&&t.closest('.cub');if(!bl)return;var k=bl.dataset.k;
if(t.classList.contains('cur')){var r=bl.querySelectorAll('.cur');tcSet(d,k,tcHEX(+r[0].value,+r[1].value,+r[2].value),'s')}
else if(t.classList.contains('cux')){var v=t.value.trim();if(v[0]!=='#')v='#'+v;if(/^#[0-9a-f]{6}$/i.test(v))tcSet(d,k,v.toLowerCase(),'x')}})}
thDraw(d);d.classList.add('on')};
/* ---------- corrections ---------- */
mk('cr','اصلاحیه');
var CB=$('#crb'),CS={src:'',q:'',del:null};
var SRC={cash:'ورودی/خروجی',ac_tx:'آکادمی',kh_tx:'خدام',st:'ایستگاه صلواتی',debts:'بدهی‌ها'};
function pn(P,id){var p=DS[P+'_people'].filter(function(x){return x.id===id})[0];return p?p.name:'—'}
function crRows(){var r=[];DS.cash.forEach(function(x){r.push({c:'cash',x:x,t:x.title,a:(x.type==='in'?1:-1)*x.amount,d:x.date})});
['ac','kh'].forEach(function(P){DS[P+'_tx'].forEach(function(x){r.push({c:P+'_tx',x:x,t:pn(P,x.pid)+' — '+(x.kind==='fee'?'شهریه/بدهی':'پرداخت'),a:x.kind==='pay'?x.amount:-x.amount,d:x.date,nu:x.kind==='fee'})})});
DS.st.forEach(function(x){r.push({c:'st',x:x,t:x.station+' — '+x.name,a:-Math.round((+x.qty||0)*(+x.price||0)),d:x.time})});
DS.debts.forEach(function(x){r.push({c:'debts',x:x,t:x.title+' — '+x.person,a:x.dir==='per'?x.amount:-x.amount,d:x.date,nu:x.paid!=='1'})});return r}
function crView(){CB.innerHTML='<select class="in" id="crs"><option value="">همهٔ تراکنش‌ها</option>'+Object.keys(SRC).map(function(k){return'<option value="'+k+'"'+(CS.src===k?' selected':'')+'>'+SRC[k]+'</option>'}).join('')+'</select><input class="in" id="crq" placeholder="جستجوی عنوان یا نام" value="'+esc(CS.q)+'"><div id="crl"></div>';crFill()}
function crFill(){var L=$('#crl');if(!L)return;var q=norm(CS.q),a=crRows().filter(function(r){return(!CS.src||r.c===CS.src)&&(!q||norm(r.t).indexOf(q)>-1)}).sort(function(a,b){return(b.d||'')<(a.d||'')?-1:(b.d||'')>(a.d||'')?1:0});
L.innerHTML='<p class="hint">تعداد: '+fa(a.length)+' — هر تراکنش را می‌توانید اینجا اصلاح یا حذف کنید.</p>'+(a.map(function(r){var x=r.x;return'<div class="row"><div><b>'+esc(r.t)+'</b><small>'+SRC[r.c]+' — '+fd(r.d)+'</small>'+WHO(x)+(x.edited?'<small>اصلاح‌شده '+esc(new Date(x.edited.at).toLocaleDateString('fa-IR'))+(x.edited.by?' توسط '+esc(x.edited.by):'')+'</small>':'')+'</div><div class="rt"><span class="chip '+(r.nu?'':(r.a>=0?'p':'a'))+'">'+(r.a>=0?'+ ':'− ')+mn(Math.abs(r.a))+'</span><div class="ia"><button class="ib pr" data-a="ed" data-c="'+r.c+'" data-id="'+x.id+'">اصلاح</button><button class="ib dg" data-a="del" data-c="'+r.c+'" data-id="'+x.id+'">'+(CS.del===r.c+x.id?'تأیید حذف':'حذف')+'</button></div></div></div>'}).join('')||'<p class="hint">تراکنشی ثبت نشده است.</p>')}
function SCH(c){var P=c.slice(0,2);return{cash:[['type','نوع','s',[['in','ورودی'],['out','خروجی']]],['title','عنوان','t'],['amount','مبلغ (تومان)','n'],['date','تاریخ','d']],
st:[['station','عنوان ایستگاه','t'],['time','زمان','d'],['name','نام کالا','t'],['unit','واحد سنجش','t'],['qty','تعداد / مقدار','q'],['price','قیمت واحد (تومان)','n']],
debts:[['dir','نوع','s',[['hey','بدهی هیئت'],['per','بدهی شخص']]],['title','عنوان','t'],['person','نام شخص','t'],['amount','مبلغ (تومان)','n'],['date','تاریخ','d'],['cash','آیا هنگام ثبت، پول واقعاً جابه‌جا شد؟','s',[['0','خیر (نسیه / بدون جابه‌جایی پول)'],['1','بله (پول دریافت یا پرداخت شد)']]],['paid','وضعیت','s',[['0','پرداخت‌نشده'],['1','پرداخت‌شده']]],['pdate','تاریخ پرداخت','d']]}[c]||[['pid','فرد','s',DS[P+'_people'].map(function(p){return[p.id,p.name]})],['kind','نوع','s',[['fee','شهریه / بدهی'],['pay','پرداخت']]],['amount','مبلغ (تومان)','n'],['date','تاریخ','d']]}
function crForm(c,id){var x=DS[c].filter(function(y){return y.id===id})[0];if(!x)return;var sc=SCH(c);
BK.innerHTML='<div class="sh"><h3>اصلاح — '+SRC[c]+'</h3>'+sc.map(function(f){var k=f[0],v=x[k],l='<label>'+f[1]+'</label>';
if(f[2]==='t')return l+'<input class="in" id="ce_'+k+'" value="'+esc(v)+'">';
if(f[2]==='n'||f[2]==='q')return l+'<input class="in'+(f[2]==='n'?' camt':'')+'" id="ce_'+k+'" inputmode="decimal" value="'+(v?(f[2]==='n'?String(v).replace(/\B(?=(\d{3})+(?!\d))/g,','):v):'')+'">';
if(f[2]==='s')return l+'<select class="in" id="ce_'+k+'">'+f[3].map(function(o){return'<option value="'+o[0]+'"'+(String(v)===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select>';
return l+dsel('ce_'+k,v)}).join('')+'<button class="pri" data-c="sv" style="margin-top:8px">ذخیرهٔ اصلاحیه</button><button class="ib" data-b="x" style="width:100%;padding:10px;margin-top:8px">انصراف</button></div>';BK.classList.add('on');BK._e={c:c,id:id,sc:sc}}
BK.addEventListener('click',function(e){if(e.target.dataset.c!=='sv'||!BK._e)return;var E=BK._e,o={};
E.sc.forEach(function(f){var k=f[0],el=$('#ce_'+k);if(f[2]==='d')o[k]=dget('ce_'+k);else if(f[2]==='n')o[k]=+nn(el.value).replace(/[^\d]/g,'')||0;else if(f[2]==='q')o[k]=parseFloat(nn(el.value).replace(/[^\d.]/g,''))||0;else o[k]=el.value.trim()});
var bd='';E.sc.forEach(function(f){if((f[2]==='n'||f[2]==='q')&&!(o[f[0]]>0))bd=f[1];if(f[2]==='t'&&!o[f[0]])bd=f[1]});if(bd)return gt('«'+bd+'» را درست وارد کنید');if(E.c==='debts'&&o.paid!=='1')o.pdate='';o.edited={at:Date.now(),by:window.HU||''};put(E.c,o,E.id).then(function(ok){if(!ok)return;gt('اصلاحیه ذخیره شد');BK.classList.remove('on')})});
BK.addEventListener('input',function(e){if(e.target.classList.contains('camt')){if(/[.٫\/\-−]/.test(e.target.value))gt('مبلغ را فقط به‌صورت عدد صحیح تومان (بدون اعشار و منفی) وارد کنید');var v=+nn(e.target.value).replace(/[^\d]/g,'')||0;e.target.value=v?String(v).replace(/\B(?=(\d{3})+(?!\d))/g,','):''}});
CB.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;var c=b.dataset.c,id=b.dataset.id;if(b.dataset.a==='ed')crForm(c,id);else if(CS.del===c+id){CS.del=null;del(c,id)}else{CS.del=c+id;crFill()}});
CB.addEventListener('change',function(e){if(e.target.id==='crs'){CS.src=e.target.value;crFill()}});
CB.addEventListener('input',function(e){if(e.target.id==='crq'){CS.q=e.target.value;crFill()}});
window.openCr=function(){CS.del=null;show('cr');crView()};cbs.push(function(){if($('#cr').classList.contains('on'))crFill()});
/* ---------- academy attendance ---------- */
mk('acatt','آکادمی حضور و غیاب',1);
var AC={date:null,tab:'rec',q:''},ACN={p:'حضور',l:'تاخیر',a:'غیبت'};
function acToday(){var o={};new Intl.DateTimeFormat('en-u-ca-persian-nu-latn',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).forEach(function(x){o[x.type]=x.value});return{y:+o.year,m:+o.month,d:+o.day}}
function acMlen(m,y){return y?window.jml(y,m):(m<=6?31:m<=11?30:29)}
function acKey(o){return o.y+'-'+String(o.m).padStart(2,'0')+'-'+String(o.d).padStart(2,'0')}
function acShift(o,n){var y=o.y,m=o.m,d=o.d+n;if(d<1){m--;if(m<1){m=12;y--}d=acMlen(m,y)}else if(d>acMlen(m,y)){d=1;m++;if(m>12){m=1;y++}}return{y:y,m:m,d:d}}
function acCur(d,pid){var r=(DS.ac_att||[]).filter(function(x){return x.date===d&&x.pid===pid})[0];return r?r.status:''}
function acSorted(list){return list.slice().sort(function(a,b){return(a.name||'').localeCompare(b.name||'','fa')})}
function acPeople(){return acSorted((DS.ac_people||[]).filter(function(p){return!p.arch&&(!AC.q||norm(p.name||'').indexOf(norm(AC.q))>-1)}))}
function acMark(pid,s){if(!DB)return gt('اتصال ذخیره‌گاه برقرار نیست');var d=acKey(AC.date),ref=DB.collection('ac_att').doc(d+'_'+pid);(acCur(d,pid)===s?ref.delete():ref.set({date:d,pid:pid,status:s})).catch(function(){gt('ثبت نشد')})}
function acNav(n){AC.date=n?acShift(AC.date,n):acToday();acFill()}
function acList(){var L=$('#acl'),S0=$('#acs');if(!L||!S0)return;var d=acKey(AC.date),c={p:0,l:0,a:0,n:0};
 (DS.ac_people||[]).forEach(function(p){var s=acCur(d,p.id);if(s)c[s]++;else c.n++});
 S0.innerHTML='<span class="chip p">حضور '+fa(c.p)+'</span><span class="chip l">تاخیر '+fa(c.l)+'</span><span class="chip a">غیبت '+fa(c.a)+'</span><span class="chip">ثبت‌نشده '+fa(c.n)+'</span> <button class="sec" style="width:auto;padding:5px 12px" data-ac="allp">همه حاضر</button>';
 L.innerHTML=acPeople().map(function(p){var s=acCur(d,p.id);return'<div class="row"><div><b>'+esc(p.name)+'</b></div><div class="stb">'+['p','l','a'].map(function(k){return'<button class="st '+k+(s===k?' on':'')+'" data-ac="mark" data-id="'+p.id+'" data-s="'+k+'">'+ACN[k]+'</button>'}).join('')+'</div></div>'}).join('')||'<p class="hint">'+((DS.ac_people||[]).length?'موردی یافت نشد.':'ابتدا افراد آکادمی را در بخش آکادمی ثبت کنید.')+'</p>'}
function acReport(){var n=0,ds={},ids={};(DS.ac_people||[]).forEach(function(p){ids[p.id]=1});(DS.ac_att||[]).forEach(function(x){if(ids[x.pid]&&!ds[x.date]){ds[x.date]=1;n++}});
 if(!n)return'<p class="hint">هنوز جلسه‌ای ثبت نشده است.</p>';
 return'<p class="hint">تعداد جلسات: '+fa(n)+' — درصد حضور = (حضور + تاخیر) ÷ کل جلسات</p>'+acSorted(DS.ac_people||[]).map(function(p){var c={p:0,l:0,a:0};(DS.ac_att||[]).forEach(function(x){if(x.pid===p.id&&c[x.status]!=null)c[x.status]++});return'<div class="row"><b>'+esc(p.name)+'</b><div><span class="chip p">'+fa(c.p)+'</span><span class="chip l">'+fa(c.l)+'</span><span class="chip a">'+fa(c.a)+'</span><span class="chip">'+fa(Math.round((c.p+c.l)/n*100))+'٪</span></div></div>'}).join('')}
function acFill(){var B=$('#acattb'),T=$('#acattt');if(!B||!T)return;if(!AC.date)AC.date=acToday();
 T.innerHTML=[['rec','ثبت حضور'],['rep','گزارش']].map(function(t){return'<button class="'+(AC.tab===t[0]?'on':'')+'" data-ac="tab" data-t="'+t[0]+'">'+t[1]+'</button>'}).join('');
 if(AC.tab==='rep'){B.innerHTML=acReport();return}
 B.innerHTML='<div class="dp"><button data-ac="dn" data-n="-1">قبل</button><button data-ac="dn" data-n="0">امروز</button><button data-ac="dn" data-n="1">بعد</button></div><div class="hint" style="text-align:center;font-weight:700">'+fa(acKey(AC.date).replace(/-/g,'/'))+'</div>'+dsel('acd',acKey(AC.date))+'<input class="in" id="acq" placeholder="جستجوی نام" value="'+esc(AC.q)+'"><div class="hint" id="acs"></div><div id="acl"></div>';acList()}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-ac]');if(!b)return;var a=b.dataset.ac;
 if(a==='tab'){AC.tab=b.dataset.t;acFill()}
 else if(a==='dn')acNav(+b.dataset.n);
 else if(a==='mark')acMark(b.dataset.id,b.dataset.s);
 else if(a==='allp'){var d=acKey(AC.date);(DS.ac_people||[]).forEach(function(p){if(!acCur(d,p.id))acMark(p.id,'p')})}});
document.addEventListener('input',function(e){if(e.target.id==='acq'){AC.q=e.target.value;acList()}});
document.addEventListener('change',function(e){if(e.target.id&&/^acd_[dmy]$/.test(e.target.id)){var k=dget('acd').split('-');AC.date={y:+k[0],m:+k[1],d:+k[2]};acFill()}});
cbs.push(function(){if(!$('#acatt').classList.contains('on'))return;if(AC.tab==='rep')acFill();else acList()});
window.openAcAtt=function(){AC.date=acToday();window.show('acatt');acFill()};
/* ---------- academy: phone book + debt messages ---------- */
mk('acbook','دفترچه تلفن آکادمی',0);
var AB={q:'',ph:[],id:''};
function intl(p){var d=tel(p).replace(/\+/g,'');if(d.indexOf('00')===0)d=d.slice(2);else if(d.charAt(0)==='0')d='98'+d.slice(1);else if(d.length===10&&d.charAt(0)==='9')d='98'+d;return d.length>=11?d:''}
function openLink(h,blank){var a=document.createElement('a');a.href=h;if(blank){a.target='_blank';a.rel='noopener'}document.body.appendChild(a);a.click();a.remove()}
var DM_DEF='سلام {نام} عزیز\nیادآوری شهریهٔ آکادمی فوتسال رهروان حسنی\n\nکل شهریه / بدهی: {کل}\nمجموع پرداختی: {پرداخت}\nمانده بدهی شما: {مانده}\n\nلطفاً در اولین فرصت نسبت به پرداخت اقدام فرمایید و رسید پرداخت را همین‌جا ارسال کنید.\nبا سپاس از همراهی شما\nآکادمی فوتسال رهروان حسنی — هیئت معظم ابناءالحسن (علیهم السلام)';
function dmTpl(){try{return localStorage.getItem('ac_dm_tpl')||DM_DEF}catch(e){return DM_DEF}}
function dmText(p){var fee=0,pay=0;(DS.ac_tx||[]).forEach(function(x){if(x.pid!==p.id)return;if(x.kind==='fee')fee+=(+x.amount||0);else pay+=(+x.amount||0)});var b=fee-pay;
if(b<=0)return'سلام '+p.name+' عزیز\nحساب شما در آکادمی فوتسال رهروان حسنی '+(b<0?'تسویه است و '+mn(-b)+' پیش‌پرداخت دارید.':'تسویه است و بدهی‌ای ندارید.')+'\nسپاس از همراهی شما\nآکادمی فوتسال رهروان حسنی';
return dmTpl().replace(/\{نام\}/g,p.name).replace(/\{مانده\}/g,mn(b)).replace(/\{کل\}/g,mn(fee)).replace(/\{پرداخت\}/g,mn(pay))}
function acBal(pid){return sum((DS.ac_tx||[]).filter(function(x){return x.pid===pid}),function(x){return x.kind==='fee'?(+x.amount||0):-(+x.amount||0)})}
window.acDebtSheet=function(pid){var p=(DS.ac_people||[]).filter(function(x){return x.id===pid})[0];if(!p)return gt('فرد پیدا نشد');
var ph=[];if(p.phone&&intl(p.phone))ph.push(['شمارهٔ خود فرد',p.phone]);if(p.phone2&&intl(p.phone2))ph.push(['ولی / خانواده',p.phone2]);AB.ph=ph;
BK.innerHTML='<div class="sh"><h3>پیام بدهی — '+esc(p.name)+'</h3><p class="hint">متن را در صورت نیاز ویرایش کنید، سپس کپی یا ارسال کنید.</p><textarea class="in" id="dmta" rows="11" style="min-height:240px">'+esc(dmText(p))+'</textarea>'+(ph.length?'<label>ارسال به</label><select class="in" id="dmto">'+ph.map(function(x,i){return'<option value="'+i+'">'+esc(x[0])+' — '+esc(x[1])+'</option>'}).join('')+'</select><div class="ia" style="margin-bottom:8px"><button class="ib pr" data-ab="sms">پیامک</button><button class="ib pr" data-ab="wa">واتساپ</button></div>':'<p class="hint">برای این فرد شماره‌ای ثبت نشده است؛ متن را کپی کنید یا شماره را در «دفترچه تلفن آکادمی» وارد کنید.</p>')+'<button class="pri" data-ab="cp">کپی متن</button>'+(navigator.share?'<button class="sec" data-ab="shr" style="margin-top:8px">ارسال در پیام‌رسان (ایتا، تلگرام و …)</button>':'')+'<button class="ib" data-ab="x" style="width:100%;padding:10px;margin-top:8px">بستن</button></div>';BK.classList.add('on')};
window.acDebtTpl=function(){BK.innerHTML='<div class="sh"><h3>قالب پیام بدهی</h3><p class="hint">در متن می‌توانید از این نشانه‌ها استفاده کنید: {نام} ، {مانده} ، {کل} ، {پرداخت} — هنگام ساخت پیام هر فرد با اطلاعات خودش جایگزین می‌شوند. می‌توانید شمارهٔ کارت یا توضیح پرداخت را هم به متن اضافه کنید. قالب فقط روی همین دستگاه ذخیره می‌شود.</p><textarea class="in" id="dmtp" style="min-height:240px">'+esc(dmTpl())+'</textarea><button class="pri" data-ab="tsave">ذخیره قالب</button><button class="sec" data-ab="treset" style="margin-top:8px">بازگشت به قالب پیش‌فرض</button><button class="ib" data-ab="x" style="width:100%;padding:10px;margin-top:8px">بستن</button></div>';BK.classList.add('on')};
function abRow(n,l){return n?'<div class="rw"><span>'+l+': <b>'+esc(n)+'</b></span><div class="ia"><a class="ib" href="tel:'+tel(n)+'">تماس</a><a class="ib" href="sms:'+tel(n)+'">پیامک</a>'+(intl(n)?'<a class="ib" href="https://wa.me/'+intl(n)+'" target="_blank" rel="noopener">واتساپ</a>':'')+'</div></div>':''}
function abAll(){return acSorted((DS.ac_people||[]).filter(function(p){return!p.arch}))}
function abList(){var L=$('#abl'),S0=$('#abs');if(!L||!S0)return;var q=norm(nn(AB.q)),all=abAll(),a=all.filter(function(p){return!q||norm(nn(p.name+' '+(p.phone||'')+' '+(p.phone2||''))).indexOf(q)>-1}),has=all.filter(function(p){return p.phone||p.phone2}).length;
S0.innerHTML='<div class="card"><span class="chip p">افراد '+fa(all.length)+'</span><span class="chip">دارای شماره '+fa(has)+'</span>'+(all.length-has?'<span class="chip a">بدون شماره '+fa(all.length-has)+'</span>':'')+'<div class="ia" style="margin-top:10px"><button class="ib pr" data-ab="add">افزودن فرد</button><button class="ib" data-ab="txt">فهرست متنی</button><button class="ib" data-ab="vcf">ذخیره در مخاطبین گوشی</button></div></div>';
L.innerHTML=a.map(function(p){return'<div class="card"><div class="rw"><b>'+esc(p.name)+'</b><div class="ia">'+(acBal(p.id)>0?'<button class="ib pr" data-ab="dm" data-id="'+p.id+'">پیام بدهی</button>':'')+'<button class="ib" data-ab="ed" data-id="'+p.id+'">ویرایش شماره</button></div></div>'+abRow(p.phone,'خود فرد')+abRow(p.phone2,'ولی / خانواده')+(!p.phone&&!p.phone2?'<p class="hint">شماره‌ای ثبت نشده است.</p>':'')+'</div>'}).join('')||'<p class="hint">'+(all.length?'موردی یافت نشد.':'هنوز فردی در آکادمی ثبت نشده است. با «افزودن فرد» شروع کنید.')+'</p>'}
function abFill(){var B=$('#acbookb');if(!B)return;B.innerHTML='<input class="in" id="abq" placeholder="جستجوی نام یا شماره" value="'+esc(AB.q)+'"><div id="abs"></div><div id="abl"></div>';abList()}
function abTxt(){var t='دفترچه تلفن آکادمی فوتسال رهروان حسنی — هیئت معظم ابناءالحسن (علیهم السلام)\nتاریخ: '+fd(tk())+'\n\n';abAll().forEach(function(p,i){t+=fa(i+1)+'. '+p.name+(p.phone?' | '+p.phone:'')+(p.phone2?' | ولی: '+p.phone2:'')+'\n'});return t}
function abVcf(){var out=[],n=0;abAll().forEach(function(p){[[p.phone,''],[p.phone2,'ولی ']].forEach(function(x,i){var d=tel(x[0]);if(d.replace(/\+/g,'').length<10)return;n++;var nm=x[1]+p.name+' (آکادمی)';out.push('BEGIN:VCARD','VERSION:3.0','N:'+vcEsc(nm)+';;;;','FN:'+vcEsc(nm),'TEL;TYPE=CELL:'+d,'ORG:'+vcEsc('آکادمی فوتسال رهروان حسنی'),'CATEGORIES:'+vcEsc('آکادمی رهروان حسنی'),'UID:acad-'+(i?'f-':'')+p.id,'END:VCARD')})});return{text:out.join('\r\n')+'\r\n',n:n}}
function abEdit(id){var p=id?(DS.ac_people||[]).filter(function(x){return x.id===id})[0]:null;AB.id=id||'';
BK.innerHTML='<div class="sh"><h3>'+(p?'شماره‌های '+esc(p.name):'افزودن فرد به آکادمی')+'</h3>'+(p?'':'<label>نام</label><input class="in" id="abn" value="">')+'<label>شمارهٔ تماس خود فرد</label><input class="in" id="abp1" type="tel" value="'+esc(p&&p.phone)+'"><label>شمارهٔ ولی / خانواده</label><input class="in" id="abp2" type="tel" value="'+esc(p&&p.phone2)+'"><button class="pri" data-ab="save">ذخیره</button><button class="ib" data-ab="x" style="width:100%;padding:10px;margin-top:8px">انصراف</button></div>';BK.classList.add('on')}
function abSave(){var p1=$('#abp1').value.trim(),p2=$('#abp2').value.trim(),o={phone:p1,phone2:p2};
function bad(v){return v&&tel(v).replace(/\+/g,'').length<10}
if(bad(p1)||bad(p2))return gt('شماره کامل نیست؛ شماره را با کد (مثل ۰۹۱۲…) وارد کنید');
if(!AB.id){var nmv=$('#abn').value.trim();if(!nmv)return gt('نام را وارد کنید');if((DS.ac_people||[]).some(function(x){return norm(x.name)===norm(nmv)}))return gt('این نام قبلاً ثبت شده است');o.name=nmv}
put('ac_people',o,AB.id||undefined).then(function(ok){if(ok){gt('ثبت شد');BK.classList.remove('on')}})}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-ab]');if(!b)return;var a=b.dataset.ab,id=b.dataset.id;
if(a==='x')BK.classList.remove('on');
else if(a==='add')abEdit('');
else if(a==='ed')abEdit(id);
else if(a==='save')abSave();
else if(a==='txt')txt(abTxt());
else if(a==='vcf'){var r=abVcf();if(!r.n)return gt('شماره‌ای برای ذخیره وجود ندارد');var f=new Blob([r.text],{type:'text/vcard;charset=utf-8'}),l=document.createElement('a');l.href=URL.createObjectURL(f);l.download='academy-contacts-'+new Date().toISOString().slice(0,10)+'.vcf';document.body.appendChild(l);l.click();l.remove();gt(fa(r.n)+' مخاطب آماده شد')}
else if(a==='dm')window.acDebtSheet(id);
else if(a==='cp')copyT($('#dmta').value);
else if(a==='shr')navigator.share({text:$('#dmta').value}).catch(function(){});
else if(a==='sms'||a==='wa'){var i=+(($('#dmto')||{}).value||0),n=AB.ph[i]&&AB.ph[i][1],t=$('#dmta').value;if(!n)return gt('شماره‌ای انتخاب نشده است');if(a==='sms')openLink('sms:+'+intl(n)+'?body='+encodeURIComponent(t));else openLink('https://wa.me/'+intl(n)+'?text='+encodeURIComponent(t),1)}
else if(a==='tsave'){var v=$('#dmtp').value.trim();if(!v)return gt('متن قالب خالی است');try{localStorage.setItem('ac_dm_tpl',v);gt('قالب ذخیره شد');BK.classList.remove('on')}catch(x){gt('ذخیره نشد')}}
else if(a==='treset'){try{localStorage.removeItem('ac_dm_tpl')}catch(x){}$('#dmtp').value=DM_DEF;gt('قالب پیش‌فرض بازگردانده شد؛ برای اعمال «ذخیره قالب» را بزنید یا ببندید')}});
document.addEventListener('input',function(e){if(e.target.id==='abq'){AB.q=e.target.value;abList()}});
cbs.push(function(){var s=$('#acbook');if(s&&s.classList.contains('on'))abList()});
window.openAcBook=function(){AB.q='';window.show('acbook');abFill()};
/* ---------- reports ---------- */
mk('rpt','گزارش',1);
var RP={k:'mem'};
function rpName(id){var m=(DS.members||[]).filter(function(x){return x.id===id})[0];return m?full(m):''}
var RPS={
 mem:{t:'فهرست اعضا',h:['ردیف','نام و نام خانوادگی','شماره تماس','شماره خانواده','آدرس','تاریخ تولد','نام پدر','معرف'],
  r:function(){return mem().map(function(m,i){return[fa(i+1),full(m),m.phone,m.fphone,m.address,m.birth?fd(m.birth):'',m.father,rpName(m.ref)]})}},
 acad:{t:'آکادمی: حضور و غیاب',h:['نام','جلسات','حضور','تاخیر','غیبت','درصد حضور'],
  r:function(){var ds={},ids={};(DS.ac_people||[]).forEach(function(p){ids[p.id]=1});(DS.ac_att||[]).forEach(function(x){if(ids[x.pid])ds[x.date]=1});var n=Object.keys(ds).length;return acSorted(DS.ac_people||[]).map(function(p){var c={p:0,l:0,a:0};(DS.ac_att||[]).forEach(function(x){if(x.pid===p.id&&c[x.status]!=null)c[x.status]++});return[p.name,fa(n),fa(c.p),fa(c.l),fa(c.a),n?fa(Math.round((c.p+c.l)/n*100))+'٪':'—']})}},
 inv:{t:'مداحان و سخنرانان',h:['نام','نقش','تاریخ','مناسبت','میانگین نظر','تعداد نظر'],
  r:function(){return(DS.inv||[]).slice().sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}).map(function(x){var fs=(DS.inv_fb||[]).filter(function(y){return y.inv===x.id&&y.r});var av=fs.length?(fs.reduce(function(s,y){return s+y.r},0)/fs.length).toFixed(1):'—';return[x.name,({m:'مداح',s:'سخنران'})[x.role]||'',x.date?fd(x.date):'',x.occ,fs.length?fa(av):'—',fa(fs.length)]})}},
 disc:{t:'موارد انضباطی',h:['عضو','نوع','تاریخ','شرح'],
  r:function(){return(DS.disc||[]).slice().sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}).map(function(x){return[rpName(x.mid),x.sign==='p'?'مثبت':'منفی',x.date?fd(x.date):'',x.text]})}},
 prz:{t:'جوایز',h:['عضو','عنوان','تاریخ','توضیح'],
  r:function(){return(DS.prz||[]).slice().sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}).map(function(x){return[rpName(x.mid),x.title,x.date?fd(x.date):'',x.text]})}}
};
function rpHtml(R){var th='<tr>'+R.h.map(function(h){return'<th style="border:1px solid #444;padding:4px;background:#eee">'+esc(h)+'</th>'}).join('')+'</tr>';
 var tb=R.rows.map(function(r){return'<tr>'+r.map(function(c){return'<td style="border:1px solid #444;padding:4px">'+esc(c==null?'':String(c))+'</td>'}).join('')+'</tr>'}).join('');
 return'<div dir="rtl"><h3 style="text-align:center;margin:4px 0">گزارش '+esc(R.t)+'</h3><p style="text-align:center;margin:4px 0">هیئت معظم ابناءالحسن (علیهم السلام) — تاریخ: '+fd(tk())+' — تعداد: '+fa(R.rows.length)+'</p><table style="border-collapse:collapse;width:100%;font-size:12px"><thead>'+th+'</thead><tbody>'+tb+'</tbody></table></div>'}
function rpBuild(k){var s=RPS[k];return{t:s.t,h:s.h,rows:s.r()}}
function rpFill(){var T=$('#rptt'),B=$('#rptb');if(!T||!B)return;
 T.innerHTML=[['mem','اعضا'],['acad','آکادمی'],['inv','مداحان و سخنرانان'],['disc','انضباطی'],['prz','جوایز']].map(function(x){return'<button class="'+(RP.k===x[0]?'on':'')+'" data-r="k" data-k="'+x[0]+'">'+x[1]+'</button>'}).join('');
 B.innerHTML='<style>@media print{body *{visibility:hidden}#rptout,#rptout *{visibility:visible}#rptout{position:absolute;left:0;top:0;width:100%;color:#000;background:#fff}}</style><div class="ia" style="margin-bottom:8px"><button class="ib pr" data-r="x" data-f="print">چاپ</button><button class="ib pr" data-r="x" data-f="xls">اکسل (.xls)</button><button class="ib pr" data-r="x" data-f="doc">ورد (.doc)</button></div><div id="rptout" style="background:#fff;color:#000;padding:8px;overflow-x:auto">'+rpHtml(rpBuild(RP.k))+'</div>'}
function rpExport(f){var R=rpBuild(RP.k);if(!R.rows.length)return gt('داده‌ای برای این گزارش نیست');
 if(f==='print'){$('#rptout').innerHTML=rpHtml(R);window.print();return}
 var xls=f==='xls',html='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body>'+rpHtml(R)+'</body></html>';
 rpSave(new Blob(['\ufeff'+html],{type:(xls?'application/vnd.ms-excel':'application/msword')+';charset=utf-8'}),'hayat-'+RP.k+'-'+tk()+(xls?'.xls':'.doc'));gt('فایل ساخته شد')}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-r]');if(!b)return;try{if(b.dataset.r==='k'){RP.k=b.dataset.k;rpFill()}else rpExport(b.dataset.f)}catch(err){gt('خطا در گزارش: '+err.message)}});
window.openRpt=function(){window.show('rpt');try{rpFill()}catch(e){gt('خطا در گزارش: '+e.message)}};
function rpDl(bl,name){var a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},1500)}
function rpSave(bl,name){try{var f=new File([bl],name,{type:bl.type});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:name}).catch(function(){rpDl(bl,name)});return}}catch(e){}rpDl(bl,name)}


/* ---------- routes ---------- */
var R={'داشبورد':'openDs','اعضا':'openMem','لیست اعضا':'openRs','حضور و غیاب':'openAtt','امور مالی':'openFin','اصلاحیه':'openCr','آکادمی حضور و غیاب':'openAcAtt','دفترچه تلفن آکادمی':'openAcBook','موارد انضباطی':'openDc','جوایز':'openPz','انتقاد و پیشنهاد':'openSg','ثبت دعوت مداحان و سخنرانان':'openIv','پشتیبان‌گیری':'openBk','به‌روزرسانی':'openUp'};
window.open=function(x){var f=R[x.t];if(f)window[f]()};
window._hbk={enc:enc,dec:dec,snap:snap,plan:plan};
})();
