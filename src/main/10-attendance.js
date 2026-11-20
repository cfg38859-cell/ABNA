(function(){
var $=function(s){return document.querySelector(s)},AT=$('#abody');
var S={tab:'rec',grp:'h',date:null,members:[],att:[],A:{},q:'',rep:'ind',mem:'',yr:'',mo:'',edit:null,del:null,db:null,off:0,init:0};
var GN={h:'هیئت',g:'حلقه گفتگو'},SN={p:'حضور',l:'تاخیر',a:'غیبت'};
var MN=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fa(s){return String(s).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})}
function pad(n){return n<10?'0'+n:''+n}
function dk(o){return o.y+'-'+pad(o.m)+'-'+pad(o.d)}
function fd(k){return fa(k.replace(/-/g,'/'))}
function mlen(m,y){return y?window.jml(y,m):(m<=6?31:m<=11?30:29)}
function todayJ(){var o={};new Intl.DateTimeFormat('en-u-ca-persian-nu-latn',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).forEach(function(x){o[x.type]=x.value});return{y:+o.year,m:+o.month,d:+o.day}}
function shift(o,n){var y=o.y,m=o.m,d=o.d+n;if(d<1){m--;if(m<1){m=12;y--}d=mlen(m,y)}else if(d>mlen(m,y)){d=1;m++;if(m>12){m=1;y++}}return{y:y,m:m,d:d}}
function full(m){return((m.first||'')+' '+(m.last||'')).trim()}
function byId(id){return S.members.filter(function(m){return m.id===id})[0]}
function sorted(){return S.members.slice().sort(function(a,b){return full(a).localeCompare(full(b),'fa')})}
function toast(t){var e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove('on')},2200)}
function fail(){toast('ثبت نشد؛ اتصال یا سطح دسترسی خود را بررسی کنید')}
function build(){var A={},B={};S.att.forEach(function(r){A[r.group]=A[r.group]||{};A[r.group][r.date]=A[r.group][r.date]||{};A[r.group][r.date][r.member]=r.status;B[r.group]=B[r.group]||{};B[r.group][r.date]=B[r.group][r.date]||{};B[r.group][r.date][r.member]=WHO(r)});S.A=A;S.B=B}
function opts(sel){return'<option value="">بدون معرف</option>'+sorted().map(function(m){return'<option value="'+m.id+'"'+(m.id===sel?' selected':'')+'>'+esc(full(m))+'</option>'}).join('')}
function seg(){return'<div class="seg">'+['h','g'].map(function(g){return'<button class="'+(S.grp===g?'on':'')+'" data-a="grp" data-g="'+g+'">'+GN[g]+'</button>'}).join('')+'</div>'}
function dp(){var o=S.date,t=todayJ(),i,h='<div class="dp"><button data-a="dn" data-n="-1">قبل</button><select data-c="dd">';
for(i=1;i<=mlen(o.m,o.y);i++)h+='<option value="'+i+'"'+(i===o.d?' selected':'')+'>'+fa(i)+'</option>';
h+='</select><select data-c="dm">';MN.forEach(function(n,j){h+='<option value="'+(j+1)+'"'+(j+1===o.m?' selected':'')+'>'+n+'</option>'});
h+='</select><select data-c="dy">';for(i=Math.min(t.y-4,o.y);i<=Math.max(t.y+1,o.y);i++)h+='<option value="'+i+'"'+(i===o.y?' selected':'')+'>'+fa(i)+'</option>';
return h+'</select><button data-a="dn" data-n="1">بعد</button><button data-a="dn" data-n="0">امروز</button></div>'}
function filt(){var ys={};Object.keys(S.A[S.grp]||{}).forEach(function(k){ys[k.split('-')[0]]=1});
return'<div class="dp"><select data-c="yr"><option value="">همه سال‌ها</option>'+Object.keys(ys).sort().map(function(y){return'<option value="'+y+'"'+(S.yr===y?' selected':'')+'>'+fa(y)+'</option>'}).join('')+'</select><select data-c="mo"><option value="">همه ماه‌ها</option>'+MN.map(function(n,j){return'<option value="'+(j+1)+'"'+(+S.mo===j+1?' selected':'')+'>'+n+'</option>'}).join('')+'</select></div>'}
function addH(){var m=S.edit&&byId(S.edit)||{};return'<div class="card"><h3>'+(S.edit?'ویرایش عضو':'ثبت عضو جدید')+'</h3><input class="in" id="f1" placeholder="نام" value="'+esc(m.first)+'"><input class="in" id="f2" placeholder="نام خانوادگی" value="'+esc(m.last)+'"><input class="in" id="f3" type="tel" placeholder="شماره تماس" value="'+esc(m.phone)+'"><input class="in" id="f4" placeholder="آدرس" value="'+esc(m.address)+'"><select id="f5">'+opts(m.ref)+'</select><button class="pri" data-a="save">'+(S.edit?'ذخیرهٔ تغییرات':'ثبت عضو')+'</button></div>'+(S.edit?'':'<div class="card"><h3>ثبت دسته‌جمعی</h3><p class="hint">هر سطر یک نفر: نام و نام خانوادگی ، شماره تماس ، آدرس ، معرف (اختیاری). جداکنندهٔ ستون‌ها ویرگول یا Tab است. نام معرف باید دقیقاً مانند نام او در لیست باشد.</p><textarea id="bulk" rows="6" placeholder="علی رضایی، 09121234567، قم، محمد احمدی"></textarea><button class="sec" data-a="bulk">ثبت همه</button></div>')}
function pane(){var T=[['add','ثبت عضو'],['list','لیست اعضا'],['rec','حضور و غیاب'],['rep','گزارش'],['book','دفترچه تلفن']],h=S.off?'<p class="warn">برای مشاهده و ثبت اطلاعات باید با حساب خود وارد شوید.</p>':'',q='<input class="in" id="q" placeholder="جستجوی نام یا شماره" value="'+esc(S.q)+'">';
$('#atabs').innerHTML=T.map(function(t){return'<button class="'+(S.tab===t[0]?'on':'')+'" data-a="tab" data-t="'+t[0]+'">'+t[1]+'</button>'}).join('');
if(S.tab==='add')h+=addH();
else if(S.tab==='list'||S.tab==='book')h+=q+'<div id="lst"></div>';
else if(S.tab==='rec')h+=seg()+dp()+q+'<div class="hint" id="sum"></div><div id="lst"></div>';
else h+=seg()+'<div class="sub">'+[['ind','فردی'],['all','جامع'],['list','لیست']].map(function(t){return'<button class="'+(S.rep===t[0]?'on':'')+'" data-a="rep" data-r="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div>'+filt()+(S.rep==='ind'?'<select data-c="mem"><option value="">انتخاب عضو…</option>'+sorted().map(function(m){return'<option value="'+m.id+'"'+(S.mem===m.id?' selected':'')+'>'+esc(full(m))+'</option>'}).join('')+'</select>':'')+'<div id="lst"></div>';
AT.innerHTML=h;fill()}
function fill(){var L=$('#lst');if(!L){var r=$('#f5');if(r&&S.tab==='add'){var v=r.value;r.innerHTML=opts(v)}return}
if(S.tab==='list')L.innerHTML=listH();else if(S.tab==='book')L.innerHTML=bookH();else if(S.tab==='rec')recH(L);else repH(L)}
function match(m){var q=S.q.trim();return!q||(full(m)+(m.phone||'')).indexOf(q)>-1}
function listH(){var a=sorted().filter(match);return'<p class="hint">تعداد: '+fa(a.length)+'</p>'+(a.map(function(m){var r=m.ref&&byId(m.ref);return'<div class="row"><div><b>'+esc(full(m))+'</b>'+(m.phone?'<a href="tel:'+esc(m.phone)+'">'+esc(m.phone)+'</a>':'')+(m.address?'<small>'+esc(m.address)+'</small>':'')+(r?'<small>معرف: '+esc(full(r))+'</small>':'')+WHO(m)+'</div><div class="acts"><button data-a="edit" data-id="'+m.id+'">ویرایش</button><button class="dg" data-a="del" data-id="'+m.id+'">'+(S.del===m.id?'تأیید حذف':'حذف')+'</button></div></div>'}).join('')||'<p class="hint">عضوی ثبت نشده است.</p>')}
function bookH(){var a=sorted().filter(match).filter(function(m){return m.phone});return'<p class="hint">تعداد شماره‌ها: '+fa(a.length)+'</p>'+(a.map(function(m){var t=m.phone.replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)}).replace(/[^\d+]/g,'');return'<div class="row"><div><b>'+esc(full(m))+'</b><small>'+esc(fa(t))+'</small></div><div class="acts"><a class="cb" href="tel:'+t+'">تماس</a><a class="cb" href="sms:'+t+'">پیامک</a></div></div>'}).join('')||'<p class="hint">شماره‌ای ثبت نشده است.</p>')}
function recH(L){var d=dk(S.date),cur=(S.A[S.grp]||{})[d]||{},c={p:0,l:0,a:0,n:0},all=sorted();
all.forEach(function(m){cur[m.id]?c[cur[m.id]]++:c.n++});
$('#sum').innerHTML='<span class="chip p">حضور '+fa(c.p)+'</span><span class="chip l">تاخیر '+fa(c.l)+'</span><span class="chip a">غیبت '+fa(c.a)+'</span><span class="chip">ثبت‌نشده '+fa(c.n)+'</span> <button class="sec" style="width:auto;padding:5px 12px;margin-inline-start:6px" data-a="allp">همه حاضر</button>';
L.innerHTML=all.filter(match).map(function(m){return'<div class="row"><div><b>'+esc(full(m))+'</b>'+((((S.B||{})[S.grp]||{})[d]||{})[m.id]||'')+'</div><div class="stb">'+['p','l','a'].map(function(k){return'<button class="st '+k+(cur[m.id]===k?' on':'')+'" data-a="mark" data-id="'+m.id+'" data-s="'+k+'">'+SN[k]+'</button>'}).join('')+'</div></div>'}).join('')||'<p class="hint">ابتدا عضو ثبت کنید.</p>'}
function repH(L){var A=S.A[S.grp]||{},ms=sorted(),ss=Object.keys(A).filter(function(k){var p=k.split('-');return(!S.yr||p[0]===S.yr)&&(!S.mo||+p[1]===+S.mo)}).sort().reverse();
function cnt(id){var c={p:0,l:0,a:0};ss.forEach(function(k){var s=(A[k]||{})[id];if(s)c[s]++});return c}
function pc(c){return ss.length?fa(Math.round((c.p+c.l)/ss.length*100))+'٪':'—'}
function ch(c){return'<span class="chip p">'+fa(c.p)+'</span><span class="chip l">'+fa(c.l)+'</span><span class="chip a">'+fa(c.a)+'</span>'}
if(!ss.length){L.innerHTML='<p class="hint">در این بازه جلسه‌ای ثبت نشده است.</p>';return}
var h='<p class="hint">تعداد جلسات: '+fa(ss.length)+' — درصد حضور = (حضور + تاخیر) ÷ کل جلسات</p>';
if(S.rep==='ind'){var m=byId(S.mem);if(!m){L.innerHTML=h+'<p class="hint">یک عضو را انتخاب کنید.</p>';return}var c=cnt(m.id);
h+='<div class="card"><b>'+esc(full(m))+'</b><br>حضور '+fa(c.p)+' · تاخیر '+fa(c.l)+' · غیبت '+fa(c.a)+' · درصد حضور '+pc(c)+'</div>'+ss.map(function(k){var s=A[k][m.id];return'<div class="row"><b>'+fd(k)+'</b>'+(s?'<span class="chip '+s+'">'+SN[s]+'</span>':'<span class="chip">ثبت‌نشده</span>')+'</div>'}).join('')}
else if(S.rep==='all'){h+=ss.map(function(k){var c={p:0,l:0,a:0};ms.forEach(function(m){var s=A[k][m.id];if(s)c[s]++});return'<div class="row"><b>'+fd(k)+'</b><div>'+ch(c)+'<span class="chip">'+fa(ms.length-c.p-c.l-c.a)+'</span></div></div>'}).join('')+'<p class="hint">ترتیب: حضور، تاخیر، غیبت، ثبت‌نشده</p>'}
else{h+=ms.map(function(m){var c=cnt(m.id);return{m:m,c:c,p:(c.p+c.l)}}).sort(function(a,b){return b.p-a.p}).map(function(x){return'<div class="row"><b>'+esc(full(x.m))+'</b><div>'+ch(x.c)+'<span class="chip">'+pc(x.c)+'</span></div></div>'}).join('')}
var X;if(S.rep==='ind'){var m2=byId(S.mem);X={t:'گزارش حضور و غیاب — '+full(m2),h:['تاریخ','وضعیت'],rows:ss.map(function(k){var s=A[k][m2.id];return[fd(k),s?SN[s]:'ثبت‌نشده']})}}else if(S.rep==='all'){X={t:'گزارش جامع حضور و غیاب',h:['تاریخ','حضور','تاخیر','غیبت','ثبت‌نشده'],rows:ss.map(function(k){var c={p:0,l:0,a:0};ms.forEach(function(m){var s=A[k][m.id];if(s)c[s]++});return[fd(k),fa(c.p),fa(c.l),fa(c.a),fa(ms.length-c.p-c.l-c.a)]})}}else{X={t:'لیست حضور و غیاب اعضا',h:['عضو','حضور','تاخیر','غیبت','درصد حضور'],rows:ms.map(function(m){var c=cnt(m.id);return[full(m),fa(c.p),fa(c.l),fa(c.a),pc(c)]})}}S.rx=X;L.innerHTML=h+'<div class="ia" style="margin-top:10px"><button class="ib pr" data-a="rx" data-f="doc">خروجی ورد</button><button class="ib pr" data-a="rx" data-f="xls">خروجی اکسل</button></div>'}
function atX(f){var X=S.rx;if(!X||!X.rows.length)return toast('داده‌ای برای خروجی نیست');var xls=f==='xls',th='<tr>'+X.h.map(function(x){return'<th style="border:1px solid #444;padding:4px;background:#eee">'+esc(x)+'</th>'}).join('')+'</tr>',tb=X.rows.map(function(r){return'<tr>'+r.map(function(c){return'<td style="border:1px solid #444;padding:4px">'+esc(String(c==null?'':c))+'</td>'}).join('')+'</tr>'}).join('');var html='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><div dir="rtl"><h3 style="text-align:center">'+esc(X.t)+' ('+esc(GN[S.grp]||'')+')</h3><table style="border-collapse:collapse;width:100%">'+th+tb+'</table></div></body></html>',nm='hayat-attendance-'+(S.rep||'')+(xls?'.xls':'.doc'),bl=new Blob(['\ufeff'+html],{type:(xls?'application/vnd.ms-excel':'application/msword')+';charset=utf-8'});try{var fl=new File([bl],nm,{type:bl.type});if(navigator.canShare&&navigator.canShare({files:[fl]})){navigator.share({files:[fl],title:nm}).catch(function(){});return}}catch(e){}var a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=nm;document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},1500)}
function setStatus(id,s){if(!S.db)return fail();var d=dk(S.date),cur=((S.A[S.grp]||{})[d]||{})[id],ref=S.db.collection('att').doc(S.grp+'_'+d+'_'+id);
(cur===s?ref.delete():ref.set({group:S.grp,date:d,member:id,status:s})).catch(fail)}
function onClick(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,v=function(i){return $('#'+i).value.trim()};
if(a==='tab'&&b.dataset.t==='add'){openMem();return}
if(a==='tab'){S.tab=b.dataset.t;S.q='';S.edit=null;S.del=null;pane()}
else if(a==='grp'){S.grp=b.dataset.g;pane()}
else if(a==='rep'){S.rep=b.dataset.r;pane()}
else if(a==='rx'){atX(b.dataset.f)}
else if(a==='dn'){var n=+b.dataset.n;S.date=n?shift(S.date,n):todayJ();pane()}
else if(a==='mark')setStatus(b.dataset.id,b.dataset.s);
else if(a==='allp'){var cur=(S.A[S.grp]||{})[dk(S.date)]||{};sorted().forEach(function(m){if(!cur[m.id])setStatus(m.id,'p')})}
else if(a==='edit'){openMem(b.dataset.id)}
else if(a==='del'){var id=b.dataset.id;if(S.del===id){S.db&&S.db.collection('members').doc(id).delete().catch(fail);S.del=null}else S.del=id;fill()}
else if(a==='save'){var o={first:v('f1'),last:v('f2'),phone:v('f3'),address:v('f4'),ref:v('f5')};
if(!o.first&&!o.last)return toast('نام را وارد کنید');if(!S.db)return fail();
var ed=S.edit,p=ed?S.db.collection('members').doc(ed).update(o):S.db.collection('members').add(Object.assign(o,{at:Date.now()}));
p.then(function(){toast(ed?'ویرایش شد':'عضو ثبت شد');S.edit=null;if(ed)S.tab='list';pane()}).catch(fail)}
else if(a==='bulk'){if(!S.db)return fail();var by={};S.members.forEach(function(m){by[full(m)]=m.id});
var rows=$('#bulk').value.split('\n').map(function(l){return l.split(/[,،\t]/).map(function(x){return x.trim()})}).filter(function(p){return p[0]});
if(!rows.length)return toast('سطری وارد نشده است');
Promise.all(rows.map(function(p){var w=p[0].split(/\s+/),last=w.length>1?w.pop():'';return S.db.collection('members').add({first:w.join(' '),last:last,phone:p[1]||'',address:p[2]||'',ref:by[p[3]]||'',at:Date.now()})})).then(function(){toast(fa(rows.length)+' عضو ثبت شد');$('#bulk').value=''}).catch(fail)}}
AT.addEventListener('click',onClick);$('#atabs').addEventListener('click',onClick);
AT.addEventListener('change',function(e){var c=e.target.dataset.c;if(!c)return;var v=e.target.value;
if(c==='dd')S.date.d=+v;else if(c==='dm'){S.date.m=+v;S.date.d=Math.min(S.date.d,mlen(+v,S.date.y))}else if(c==='dy'){S.date.y=+v;S.date.d=Math.min(S.date.d,mlen(S.date.m,S.date.y))}
else S[c]=v;pane()});
AT.addEventListener('input',function(e){if(e.target.id==='q'){S.q=e.target.value;fill()}});
async function connect(){try{var d=window.claude&&await claude.use('db');if(!d){S.off=1;pane();return}S.db=d;
d.collection('members').onSnapshot(function(q){S.members=q.docs.map(function(x){return Object.assign({id:x.id},x.data())});fill()});
d.collection('att').onSnapshot(function(q){S.att=q.docs.map(function(x){return x.data()});build();fill()})}catch(e){S.off=1;pane()}}
window.openAtt=function(){S.date=S.date||todayJ();show('att');if(!S.init){S.init=1;connect()}pane()};
$('#aback').onclick=function(){show('home')};
})();
