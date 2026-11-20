(function(){
var $=function(s){return document.querySelector(s)},B=$('#fbody'),SH=$('#sheet');
var MN=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fa(s){return String(s).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})}
function pad(n){return n<10?'0'+n:''+n}
function todayJ(){var o={};new Intl.DateTimeFormat('en-u-ca-persian-nu-latn',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).forEach(function(x){o[x.type]=x.value});return{y:+o.year,m:+o.month,d:+o.day}}
function tk(){var o=todayJ();return o.y+'-'+pad(o.m)+'-'+pad(o.d)}
function fd(k){return k?fa(k.replace(/-/g,'/')):'—'}
function grp(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function mn(n){n=Math.round(n||0);return fa((n<0?'-':'')+grp(Math.abs(n)))+' تومان'}
function num(s){return +String(s).replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)}).replace(/[^\d]/g,'')||0}
function dec(s){return parseFloat(String(s).replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)}).replace('٫','.').replace(/[^\d.]/g,''))||0}
function sum(a,f){var s=0;a.forEach(function(x){s+=f(x)});return s}
function byD(k){return function(a,b){return(b[k]||'')<(a[k]||'')?-1:(b[k]||'')>(a[k]||'')?1:0}}
function toast(t){var e=$('#ftoast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove('on')},2200)}
var CL=['cash','ac_people','ac_tx','kh_people','kh_tx','st','debts','loans','members'],D={},db=null,F={tab:'dash',sub:{},date:null,open:null,del:null,stOpen:null,off:0,init:0};
CL.forEach(function(c){D[c]=[]});
var SM={cash:'cash',ac_people:'pa',kh_people:'pe',ac_tx:'tx',kh_tx:'tx',st:'st',debts:'debts',loans:'loans'};
var SC={
cash:[['type','نوع','s',[['in','ورودی'],['out','خروجی']]],['title','عنوان','t'],['amount','مبلغ (تومان)','n'],['date','تاریخ','d']],
pe:[['name','نام','t']],
pa:[['name','نام','t'],['phone','شمارهٔ تماس خود فرد (اختیاری)','o'],['phone2','شمارهٔ ولی / خانواده (اختیاری)','o']],
tx:[['kind','نوع','s',[['fee','شهریه / بدهی'],['pay','پرداخت']]],['amount','مبلغ (تومان)','n'],['date','تاریخ','d']],
st:[['station','عنوان ایستگاه','t'],['time','زمان','d'],['name','نام کالا','t'],['unit','واحد سنجش','t'],['qty','تعداد / مقدار','q'],['price','قیمت واحد (تومان)','n']],
debts:[['dir','نوع','s',[['hey','بدهی هیئت'],['per','بدهی شخص']]],['title','عنوان','t'],['person','نام شخص','t'],['amount','مبلغ (تومان)','n'],['date','تاریخ','d'],['cash','آیا هنگام ثبت، پول واقعاً جابه‌جا شد؟','s',[['0','خیر (نسیه / بدون جابه‌جایی پول)'],['1','بله (پول دریافت یا پرداخت شد)']]],['paid','وضعیت','s',[['0','پرداخت‌نشده'],['1','پرداخت‌شده']]],['pdate','تاریخ پرداخت','d']],
loans:[['title','عنوان وام','t'],['lender','وام‌دهنده (بانک / شخص)','o'],['principal','مبلغ اصل وام (اختیاری)','n'],['start','تاریخ سررسید قسط اول','d'],['count','تعداد اقساط','n'],['amount','مبلغ هر قسط (تومان)','n'],['rcv','آیا مبلغ اصل وام به حساب/صندوق هیئت آمده؟','s',[['0','خیر (در ورودی‌ها حساب نشود)'],['1','بله (به ورودی‌ها اضافه شود)']]],['rdate','تاریخ دریافت وام','d'],['note','توضیحات','o']]};
function dsel(k,v){var t=todayJ(),p=v?v.split('-'):null,o=p?{y:+p[0],m:+p[1],d:+p[2]}:t,i,h='<div class="dp"><select id="'+k+'_d">';
for(i=1;i<=31;i++)h+='<option value="'+i+'"'+(i===o.d?' selected':'')+'>'+fa(i)+'</option>';
h+='</select><select id="'+k+'_m">';MN.forEach(function(n,j){h+='<option value="'+(j+1)+'"'+(j+1===o.m?' selected':'')+'>'+n+'</option>'});
h+='</select><select id="'+k+'_y">';for(i=Math.min(t.y-4,o.y);i<=Math.max(t.y+1,o.y);i++)h+='<option value="'+i+'"'+(i===o.y?' selected':'')+'>'+fa(i)+'</option>';return h+'</select></div>'}
function dget(k){var y=+$('#'+k+'_y').value,m=+$('#'+k+'_m').value,d=+$('#'+k+'_d').value;return y+'-'+pad(m)+'-'+pad(Math.min(d,window.jml(y,m)))}
function sheet(coll,id,def,title,extra){var rec=id?D[coll].filter(function(x){return x.id===id})[0]:null,sc=SC[SM[coll]],v=Object.assign({},def,rec);
var h='<div class="sh"><h3>'+title+'</h3>'+sc.map(function(f){var k=f[0],x=v[k],l='<label>'+f[1]+'</label>';
if(f[2]==='t'||f[2]==='o')return pick(coll,k)+l+'<input class="in" id="g_'+k+'"'+(k==='phone'||k==='phone2'?' type="tel"':'')+' list="dl_'+k+'" value="'+esc(x)+'">';
if(f[2]==='n'||f[2]==='q')return l+'<input class="in'+(f[2]==='n'?' amt':'')+'" id="g_'+k+'" inputmode="decimal" value="'+(x?(f[2]==='n'?grp(x):x):'')+'">';
if(f[2]==='s')return l+'<select id="g_'+k+'">'+f[3].map(function(o){return'<option value="'+o[0]+'"'+(String(x==null?f[3][0][0]:x)===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select>';
return l+dsel('g_'+k,x)}).join('');
['station','name','unit'].forEach(function(k){h+='<datalist id="dl_'+k+'">'+Object.keys(D.st.reduce(function(o,x){if(x[k])o[x[k]]=1;return o},{})).map(function(n){return'<option value="'+esc(n)+'">'}).join('')+'</datalist>'});
SH.innerHTML=h+'<button class="pri" data-a="sv">ذخیره</button><button class="sec" data-a="cx" style="margin-top:8px">انصراف</button></div>';SH.classList.add('on');SH._c={coll:coll,id:id,extra:extra||{}}}
function showText(t){SH.innerHTML='<div class="sh"><h3>گزارش متنی</h3><textarea id="shta" rows="12" readonly style="width:100%;font:inherit;background:var(--bg);color:var(--ink);border:1.5px solid var(--mute);border-radius:12px;padding:10px">'+esc(t)+'</textarea><button class="pri" data-a="cp">کپی</button>'+(navigator.share?'<button class="sec" data-a="shr" style="margin-top:8px">ارسال در پیام‌رسان</button>':'')+'<button class="ib" data-a="cx" style="margin-top:8px;width:100%;padding:10px">بستن</button></div>';SH.classList.add('on')}
function put(c,o,id){if(!db){fail();return Promise.resolve(false)}var r;try{r=id?db.collection(c).doc(id).update(o):db.collection(c).add(o)}catch(e){fail();return Promise.resolve(false)}return Promise.resolve(r).then(function(){return true},function(){fail();return false})}
function ic(x){return Math.round((+x.qty||0)*(+x.price||0))}
function fail(){toast('ثبت نشد؛ اتصال یا سطح دسترسی را بررسی کنید')}
function save(){var c=SH._c,sc=SC[SM[c.coll]],o={},bad=0;
sc.forEach(function(f){var k=f[0],e=$('#g_'+k);if(f[2]==='d')o[k]=dget('g_'+k);else if(f[2]==='n')o[k]=num(e.value);else if(f[2]==='q')o[k]=dec(e.value);else o[k]=e.value.trim();if(f[2]==='t'&&!o[k])bad=1});
if(bad)return toast('فیلدهای متنی را کامل کنید');
var bn='';sc.forEach(function(f){var k=f[0];if(f[2]==='n'&&k!=='principal'&&!(o[k]>0))bn=f[1];if(f[2]==='q'&&!(o[k]>0))bn=f[1]});if(bn)return toast('«'+bn+'» را درست وارد کنید');if(c.coll==='loans'&&o.rcv==='1'&&!(o.principal>0))return toast('مبلغ اصل وام را وارد کنید یا گزینهٔ دریافت اصل را «خیر» بگذارید');
if(c.coll==='loans'){if(o.count>600)return toast('تعداد اقساط زیاد است');if(c.id){var l0=D.loans.filter(function(y){return y.id===c.id})[0],mx=0;Object.keys((l0&&l0.pays)||{}).forEach(function(k){if(+k>mx)mx=+k});if(o.count<mx)return toast('تعداد اقساط نمی‌تواند کمتر از شمارهٔ آخرین قسط پرداخت‌شده ('+fa(mx)+') باشد')}}
if(/_people$/.test(c.coll)&&ppl(c.coll.slice(0,2)).some(function(p){return p.id!==c.id&&nz(p.name)===nz(o.name)}))return toast('این نام قبلاً ثبت شده است');if(c.coll==='debts'&&o.paid!=='1')o.pdate='';
var nmv=o.name!=null?o.name:o.person;
if(nmv!=null){var okm=function(i){var m=i&&D.members.filter(function(y){return y.id===i})[0];return!!m&&nz(mfull(m))===nz(nmv)};
if(c.extra.mid&&!okm(c.extra.mid))delete c.extra.mid;
if(c.id&&!c.extra.mid){var r0=D[c.coll].filter(function(y){return y.id===c.id})[0];if(r0&&r0.mid&&!okm(r0.mid))o.mid=''}}
Object.assign(o,c.extra);
if(c.coll==='st'&&!c.id){try{localStorage.setItem('st_last',JSON.stringify({station:o.station,time:o.time}))}catch(e){}}
Promise.resolve(put(c.coll,o,c.id)).then(function(ok){if(!ok)return;toast('ثبت شد');SH.classList.remove('on');if(c.coll==='st'&&!c.id)sheet('st',null,{station:o.station,time:o.time},'قلم بعدی',{})})}
function ppl(P,all){return D[P+'_people'].filter(function(p){return all||!p.arch}).sort(function(a,b){return(a.name||'').localeCompare(b.name||'','fa')})}
function nm(P,id){var p=D[P+'_people'].filter(function(x){return x.id===id})[0];return p?p.name:'—'}
function bal(P,id){return sum(D[P+'_tx'].filter(function(x){return x.pid===id}),function(x){return x.kind==='fee'?x.amount:-x.amount})}
function bch(b){return b>0?'<span class="chip a">بدهکار '+mn(b)+'</span>':b<0?'<span class="chip p">طلبکار '+mn(-b)+'</span>':'<span class="chip">تسویه</span>'}
function AR(c,id){return /_people$/.test(c)&&D[c.replace('people','tx')].some(function(x){return x.pid===id})}
function acts(c,id){return'<div class="ia"><button class="ib" data-a="ed" data-c="'+c+'" data-id="'+id+'">ویرایش</button><button class="ib dg" data-a="del" data-c="'+c+'" data-id="'+id+'">'+(F.del===c+id?(AR(c,id)?'تأیید بایگانی':'تأیید حذف'):(AR(c,id)?'بایگانی':'حذف'))+'</button></div>'}
function subs(k,a,d){var s=F.sub[k]||d;return'<div class="sub">'+a.map(function(t){return'<button class="'+(s===t[0]?'on':'')+'" data-a="sub" data-k="'+k+'" data-v="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div>'}
function txb(k,c,t){return'<div class="ia" style="margin-bottom:10px"><button class="ib pr" data-a="txt" data-k="'+k+'">گزارش متنی</button>'+(c||'')+'</div>'}
function txr(P,x,n){var fee=x.kind==='fee';return'<div class="row"><div><b>'+(n?esc(nm(P,x.pid)):(fee?'شهریه / بدهی':'پرداخت'))+'</b><small>'+(n?(fee?'شهریه / بدهی':'پرداخت')+' — ':'')+fd(x.date)+'</small>'+WHO(x)+'</div><div class="rt"><span class="chip '+(fee?'a':'p')+'">'+mn(x.amount)+'</span>'+acts(P+'_tx',x.id)+'</div></div>'}
function groups(){var g={};D.st.forEach(function(x){var k=x.station+'|'+x.time;(g[k]=g[k]||{k:k,station:x.station,time:x.time,items:[]}).items.push(x)});return Object.keys(g).map(function(k){g[k].tot=sum(g[k].items,ic);return g[k]}).sort(byD('time'))}
function head(t){return'گزارش '+t+' — هیئت معظم ابناءالحسن (علیهم السلام)\nتاریخ گزارش: '+fd(tk())+'\n'}
function stText(g){return'فاکتور ایستگاه صلواتی: '+g.station+'\nتاریخ: '+fd(g.time)+'\n'+g.items.map(function(i,n){return fa(n+1)+'. '+i.name+' — '+fa(i.qty)+' '+i.unit+' × '+mn(i.price)+' = '+mn(ic(i))}).join('\n')+'\nجمع کل: '+mn(g.tot)}
function addM(k,n){var p=String(k||'1400-01-01').split('-'),y=+p[0],m=+p[1]-1+n,d=+p[2];y+=Math.floor(m/12);m=((m%12)+12)%12;var ml=m<6?31:m<11?30:(window.jleap(y)?30:29);if(d>ml)d=ml;return y+'-'+pad(m+1)+'-'+pad(d)}
function lnCalc(l){var c=+l.count||0,a=+l.amount||0,p=l.pays||{},t=tk(),r={rows:[],paid:0,n:0,total:c*a},run=c*a,i,due,py;
for(i=1;i<=c;i++){due=addM(l.start,i-1);py=p[i];if(py){r.paid+=py.a;r.n++;run-=py.a}r.rows.push({i:i,due:due,py:py,left:run,od:!py&&due<t})}
r.od=r.rows.filter(function(x){return x.od}).length;return r}
function loanRem(){return sum(D.loans,function(l){var c=lnCalc(l);return c.total-c.paid})}
function lsheet(id,n){var l=D.loans.filter(function(y){return y.id===id})[0],py=(l.pays||{})[n];SH.innerHTML='<div class="sh"><h3>پرداخت قسط '+fa(n)+' — '+esc(l.title)+'</h3><label>تاریخ پرداخت</label>'+dsel('lp',py?py.d:F.date)+'<label>مبلغ پرداختی (تومان)</label><input class="in amt" id="lpa" inputmode="decimal" value="'+grp(py?py.a:l.amount)+'"><button class="pri" data-a="lps">ذخیره</button><button class="sec" data-a="cx" style="margin-top:8px">انصراف</button></div>';SH.classList.add('on');SH._lp={id:id,n:n}}
function lps(){var amt=num($('#lpa').value);if(!(amt>0))return toast('مبلغ پرداختی را وارد کنید');var c=SH._lp,dt=dget('lp');lpays(c.id).then(function(p){p[c.n]={d:dt,a:amt,by:window.HU||''};return put('loans',{pays:p},c.id)}).then(function(ok){if(!ok)return;toast('ثبت شد');SH.classList.remove('on')})}
function ltext(id){var l=D.loans.filter(function(y){return y.id===id})[0],c=lnCalc(l),t=head('دفترچهٔ اقساط: '+l.title)+(l.lender?'وام‌دهنده: '+l.lender+'\n':'')+(l.principal?'مبلغ اصل وام: '+mn(l.principal)+'\n':'')+'تعداد اقساط: '+fa(l.count)+' | مبلغ هر قسط: '+mn(l.amount)+'\nجمع اقساط: '+mn(c.total)+'\n'+(l.note?'توضیحات: '+l.note+'\n':'')+'\n';
c.rows.forEach(function(x){t+='قسط '+fa(x.i)+' | سررسید '+fd(x.due)+' | '+mn(l.amount)+' | '+(x.py?'پرداخت‌شده '+fd(x.py.d)+' ('+mn(x.py.a)+')':(x.od?'معوق':'پرداخت‌نشده'))+' | مانده '+mn(x.left)+'\n'});return t+'\nپرداخت‌شده: '+mn(c.paid)+'\nمانده: '+mn(c.total-c.paid)}
function lcard(l){var r=lnCalc(l),op=F.lnOpen===l.id,nx=r.rows.filter(function(x){return!x.py})[0];
return'<div class="card"><div class="rw" data-a="lno" data-id="'+l.id+'" style="cursor:pointer"><div><b>'+esc(l.title)+'</b><br><small class="hint">'+esc(l.lender||'')+'</small>'+WHO(l)+'</div><span class="chip a">مانده '+mn(r.total-r.paid)+'</span></div><div><span class="chip p">'+fa(r.n)+' از '+fa(l.count)+' قسط</span><span class="chip">هر قسط '+mn(l.amount)+'</span>'+(r.od?'<span class="chip a">معوق '+fa(r.od)+'</span>':'')+(+l.principal>0&&l.rcv!=='1'?'<span class="chip">اصل وام در ورودی‌ها حساب نشده</span>':'')+'</div>'+(nx?'<div class="ia" style="margin-top:8px"><button class="ib pr" data-a="lpay" data-id="'+l.id+'" data-n="'+nx.i+'">پرداخت قسط '+fa(nx.i)+' ('+fd(nx.due)+')</button></div>':'<p class="hint">همهٔ اقساط پرداخت شده است.</p>')+
(op?'<div style="margin-top:10px"><b>دفترچهٔ اقساط</b>'+(l.principal?'<div class="kv"><span>مبلغ اصل وام</span><b>'+mn(l.principal)+'</b></div>':'')+(l.note?'<div class="kv"><span>توضیحات</span><b>'+esc(l.note)+'</b></div>':'')+r.rows.map(function(x){return'<div class="row"><div><b>قسط '+fa(x.i)+'</b><small>سررسید '+fd(x.due)+' — '+mn(l.amount)+'</small><small>'+(x.py?'پرداخت '+fd(x.py.d)+' — '+mn(x.py.a):'')+' مانده: '+mn(x.left)+'</small>'+(x.py&&x.py.by?'<small class="by">ثبت: '+esc(x.py.by)+'</small>':'')+'</div><div class="rt"><span class="chip '+(x.py?'p':(x.od?'a':''))+'">'+(x.py?'پرداخت‌شده':(x.od?'معوق':'در انتظار'))+'</span><div class="ia">'+(x.py?'<button class="ib" data-a="lsh" data-id="'+l.id+'" data-n="'+x.i+'">ویرایش</button><button class="ib dg" data-a="lcan" data-id="'+l.id+'" data-n="'+x.i+'">'+(F.cf==='lc'+l.id+x.i?'تأیید لغو':'لغو پرداخت')+'</button>':'<button class="ib pr" data-a="lpay" data-id="'+l.id+'" data-n="'+x.i+'">پرداخت</button><button class="ib" data-a="lsh" data-id="'+l.id+'" data-n="'+x.i+'">مبلغ دیگر</button>')+'</div></div></div>'}).join('')+'<div class="ia" style="margin-top:8px"><button class="ib pr" data-a="ltx" data-id="'+l.id+'">گزارش متنی دفترچه</button></div>'+acts('loans',l.id)+'</div>':'')+'</div>'}
function loanV(){var s=F.sub.ln||'l',h=subs('ln',[['l','وام‌ها'],['r','گزارش']],'l'),L=D.loans.slice().sort(byD('start')),t=tk(),tp=0,tpd=0,od=0;
L.forEach(function(l){var c=lnCalc(l);tp+=c.total;tpd+=c.paid;od+=c.od});
if(s==='r'){var up=[];L.forEach(function(l){var c=lnCalc(l),nx=c.rows.filter(function(x){return!x.py})[0];if(nx)up.push({l:l,x:nx})});up.sort(function(a,b){return a.x.due<b.x.due?-1:1});
return h+'<div class="card"><span class="chip a">مانده کل '+mn(tp-tpd)+'</span><span class="chip p">پرداخت‌شده '+mn(tpd)+'</span>'+(od?'<span class="chip a">معوق '+fa(od)+' قسط</span>':'')+'<p class="hint">این بخش جدا از «مدیریت بدهی‌ها» حساب می‌شود.</p></div>'+txb('ln')+'<h3>هر وام</h3>'+(L.map(function(l){var c=lnCalc(l);return'<div class="row"><div><b>'+esc(l.title)+'</b><small>'+fa(c.n)+' از '+fa(l.count)+' قسط</small></div><span class="chip a">'+mn(c.total-c.paid)+'</span></div>'}).join('')||'<p class="hint">—</p>')+'<h3>قسط بعدی هر وام</h3>'+(up.map(function(u){return'<div class="row"><div><b>'+esc(u.l.title)+'</b><small>قسط '+fa(u.x.i)+' — سررسید '+fd(u.x.due)+'</small></div><span class="chip '+(u.x.od?'a':'')+'">'+(u.x.od?'معوق ':'')+mn(u.l.amount)+'</span></div>'}).join('')||'<p class="hint">—</p>')}
return h+'<div class="card"><span class="chip a">مانده کل '+mn(tp-tpd)+'</span><span class="chip p">پرداخت‌شده '+mn(tpd)+'</span>'+(od?'<span class="chip a">معوق '+fa(od)+' قسط</span>':'')+'</div><label class="lb">تاریخ پرداخت (برای ثبت سریع قسط)</label>'+dsel('fd',F.date)+'<button class="pri" data-a="add" data-c="loans" style="margin-bottom:10px">ثبت وام جدید</button>'+(L.map(lcard).join('')||'<p class="hint">وامی ثبت نشده است.</p>')}
function nz(s){return String(s||'').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/\u200c/g,' ').replace(/\s+/g,' ').trim().toLowerCase()}
F.q=F.q||{};
function fq(){return nz(F.q[F.tab]||'')}
function hit(){var q=fq();if(!q)return true;return nz([].slice.call(arguments).join(' ')).indexOf(q)>-1}
var SRCH={cash:1,ac:1,st:1,kh:1,db:1,ln:1,rp:1};
function calc(){return HFC(D,{who:WHO})}
function cashV(){var r=calc(),f=F.sub.cash||'all',L=r.led.filter(function(x){return!x.f&&(f==='all'||(f==='in'?x.a>0:x.a<0))&&hit(x.t,x.s)});
function src(sg){var o={};r.led.forEach(function(x){if(!x.f&&(sg>0?x.a>0:x.a<0))o[x.s]=(o[x.s]||0)+Math.abs(x.a)});return Object.keys(o).map(function(k){return'<span class="chip">'+k+': '+mn(o[k])+'</span>'}).join('')||'<span class="hint">—</span>'}
return warnV(r)+'<div class="card"><span class="chip p">ورودی '+mn(r.inn)+'</span><span class="chip a">خروجی '+mn(r.out)+'</span><div class="big '+(r.bal<0?'neg':'pos')+'">'+mn(r.bal)+'</div><p class="hint" style="margin:6px 0 2px">ورودی‌ها به تفکیک منبع</p>'+src(1)+'<p class="hint" style="margin:6px 0 2px">خروجی‌ها به تفکیک منبع</p>'+src(-1)+'<p class="hint">هزینهٔ ایستگاه‌های صلواتی جزو خروجی‌های هیئت است و از موجودی کسر می‌شود.</p></div><button class="pri" data-a="add" data-c="cash" style="margin-bottom:8px">ثبت ورودی / خروجی دستی</button><div class="ia" style="margin-bottom:8px"><button class="ib" data-a="op0">ثبت موجودی اول دوره</button><button class="ib pr" data-a="rc">مغایرت‌گیری با موجودی واقعی</button></div><p class="hint">اگر پیش از شروع ثبت در این برنامه پولی در صندوق یا حساب بوده، «موجودی اول دوره» را ثبت کنید و گاهی با «مغایرت‌گیری» موجودی برنامه را با واقعیت تطبیق دهید.</p>'+txb('cash')+subs('cash',[['all','همه'],['in','ورودی‌ها'],['out','خروجی‌ها']],'all')+(L.map(function(x){return'<div class="row"><div><b>'+esc(x.t)+'</b><small>'+x.s+' — '+fd(x.d)+'</small>'+(x.w||'')+'</div><div class="rt"><span class="chip '+(x.a>0?'p':'a')+'">'+(x.a>0?'+ ':'− ')+mn(Math.abs(x.a))+'</span>'+(x.id?acts('cash',x.id):'<div class="ia"><button class="ib" data-a="tab" data-t="'+x.tab+'">نمایش در بخش</button></div>')+'</div></div>'}).join('')||'<p class="hint">موردی یافت نشد.</p>')}
function hist(P,p){var tx=D[P+'_tx'].filter(function(x){return x.pid===p.id}).sort(function(a,b){return(a.date||'')<(b.date||'')?-1:(a.date||'')>(b.date||'')?1:0}),run=0,tf=0,tp=0,rows=tx.map(function(x){if(x.kind==='fee'){run+=x.amount;tf+=x.amount}else{run-=x.amount;tp+=x.amount}return{x:x,run:run}}).reverse();
return'<div style="margin-top:10px"><span class="chip a">کل '+(P==='ac'?'شهریه':'بدهی')+' '+mn(tf)+'</span><span class="chip p">کل پرداخت '+mn(tp)+'</span><span class="chip">مانده '+mn(run)+'</span>'+(rows.map(function(r){var x=r.x,fee=x.kind==='fee';return'<div class="row"><div><b>'+(fee?'شهریه / بدهی':'پرداخت')+'</b><small>'+fd(x.date)+' — مانده بعد از آن: '+mn(r.run)+'</small>'+WHO(x)+'</div><div class="rt"><span class="chip '+(fee?'a':'p')+'">'+mn(x.amount)+'</span>'+acts(P+'_tx',x.id)+'</div></div>'}).join('')||'<p class="hint">سابقه‌ای نیست.</p>')+'<div class="ia" style="margin-top:8px"><button class="ib pr" data-a="ptx" data-p="'+P+'" data-id="'+p.id+'">گزارش متنی این فرد</button></div><div class="hint">ویرایش / حذف فرد:</div>'+acts(P+'_people',p.id)+'</div>'}
function ptext(P,id){var p=D[P+'_people'].filter(function(x){return x.id===id})[0],tx=D[P+'_tx'].filter(function(x){return x.pid===id}).sort(byD('date')).reverse(),t=head((P==='ac'?'آکادمی':'خدام')+' — '+p.name)+'مانده: '+(bal(P,id)>0?'بدهکار '+mn(bal(P,id)):bal(P,id)<0?'طلبکار '+mn(-bal(P,id)):'تسویه')+'\n\n';tx.forEach(function(x){t+=fd(x.date)+' | '+(x.kind==='fee'?'شهریه/بدهی':'پرداخت')+' | '+mn(x.amount)+'\n'});return t}
function dmV(){var pe=ppl('ac',1).filter(function(p){return bal('ac',p.id)>0&&hit(p.name)}).sort(function(a,b){return bal('ac',b.id)-bal('ac',a.id)}),tot=sum(pe,function(p){return bal('ac',p.id)});
return'<div class="card"><span class="chip a">تعداد بدهکاران '+fa(pe.length)+'</span><span class="chip a">جمع بدهی '+mn(tot)+'</span><p class="hint">برای هر بدهکار یک پیام آماده ساخته می‌شود؛ می‌توانید متن را ویرایش، کپی یا مستقیم پیامک / واتساپ کنید. شمارهٔ هر فرد را از «دفترچه تلفن آکادمی» در صفحهٔ اصلی وارد کنید.</p><div class="ia"><button class="ib" data-a="dmt">ویرایش قالب پیام</button></div></div>'+(pe.map(function(p){return'<div class="row"><div><b>'+esc(p.name)+'</b><small>'+((p.phone||p.phone2)?'شماره ثبت شده':'بدون شماره')+'</small></div><div class="rt">'+bch(bal('ac',p.id))+'<div class="ia"><button class="ib pr" data-a="dm" data-id="'+p.id+'">پیام بدهی</button></div></div></div>'}).join('')||'<p class="hint">بدهکاری وجود ندارد.</p>')}
function duesV(P){var T=P==='ac'?'آکادمی فوتسال رهروان حسنی':'امور خدام',s=F.sub[P]||'p',pe=ppl(P),ids=pe.map(function(p){return p.id}),tx=D[P+'_tx'],h='<h3 style="margin:6px 2px">'+T+'</h3>'+subs(P,P==='ac'?[['p','افراد'],['m','پیام بدهی'],['r','گزارش']]:[['p','افراد'],['r','گزارش']],'p');
if(P==='ac'&&s==='m')return h+dmV();
if(s==='r'){var tf=sum(tx,function(x){return x.kind==='fee'?x.amount:0}),tp=sum(tx,function(x){return x.kind==='pay'?x.amount:0}),pay=tx.filter(function(x){return x.kind==='pay'&&hit(nm(P,x.pid))}).sort(byD('date')),fee=tx.filter(function(x){return x.kind==='fee'&&hit(nm(P,x.pid))}).sort(byD('date'));
return h+'<div class="card"><span class="chip a">کل شهریه/بدهی '+mn(tf)+'</span><span class="chip p">کل پرداخت '+mn(tp)+'</span><div class="big">مانده: '+mn(tf-tp)+'</div></div>'+txb(P)+'<h3>مانده افراد</h3>'+pe.filter(function(p){return hit(p.name)}).map(function(p){return'<div class="row"><b>'+esc(p.name)+'</b>'+bch(bal(P,p.id))+'</div>'}).join('')+'<h3>لیست پرداخت‌ها</h3>'+(pay.map(function(x){return txr(P,x,1)}).join('')||'<p class="hint">—</p>')+'<h3>لیست شهریه/بدهی‌ها</h3>'+(fee.map(function(x){return txr(P,x,1)}).join('')||'<p class="hint">—</p>')}
h+='<label class="lb">تاریخ ثبت (برای +۳۰۰ و ثبت‌های دستی)</label>'+dsel('fd',F.date)+'<button class="sec" data-a="add" data-c="'+P+'_people" style="margin-bottom:10px">'+(P==='ac'?'ثبت‌نام فرد جدید':'افزودن خادم')+'</button>';
if(P==='kh'&&!pe.length)h+='<button class="pri" data-a="seed" style="margin-bottom:10px">افزودن ۵ خادم پیش‌فرض</button>';
return h+'<p class="hint">برای دیدن تاریخچهٔ پرداخت‌ها و شهریه‌های هر فرد، روی نام او ضربه بزنید.</p>'+pe.filter(function(p){return hit(p.name)}).map(function(p){var op=F.open===p.id;return'<div class="card"><div class="rw" data-a="op" data-id="'+p.id+'" style="cursor:pointer"><b>'+esc(p.name)+'</b>'+bch(bal(P,p.id))+'</div>'+WHO(p)+'<div class="ia"><button class="ib pr" data-a="fee3" data-p="'+P+'" data-id="'+p.id+'">'+(F.cf==='f3'+p.id?'تأیید +۳۰۰':'+۳۰۰')+'</button><button class="ib" data-a="mf" data-p="'+P+'" data-id="'+p.id+'">'+(P==='ac'?'شهریه':'بدهی')+' دستی</button><button class="ib" data-a="mp" data-p="'+P+'" data-id="'+p.id+'">پرداخت</button>'+(P==='ac'?'<button class="ib" data-a="dm" data-id="'+p.id+'">پیام بدهی</button>':'')+'</div>'+(op?hist(P,p):'')+'</div>'}).join('')+arcList(P)}
function stV(){var all=groups(),g=all.filter(function(x){return hit(x.station,x.items.map(function(i){return i.name}).join(' '))});
return'<div class="card"><small>جمع هزینهٔ همهٔ ایستگاه‌ها (جزو خروجی‌ها و کسر شده از موجودی)</small><div class="big">'+mn(sum(all,function(x){return x.tot}))+'</div></div><button class="pri" data-a="adst" style="margin-bottom:10px">ثبت قلم جدید</button><button class="sec" data-a="stpdf" style="margin-bottom:10px">گزارش PDF همهٔ ایستگاه‌ها (جدول کامل)</button><p class="hint">عنوان و زمان آخرین ایستگاه در فرم بعدی خودکار پر می‌شود. هر عنوان ایستگاه اقلام و جمع جداگانه دارد.</p>'+(g.map(function(x){var op=F.stOpen===x.k;return'<div class="card"><div class="rw" data-a="sto" data-k="'+esc(x.k)+'" style="cursor:pointer"><div><b>'+esc(x.station)+'</b><br><small class="hint">'+fd(x.time)+' — '+fa(x.items.length)+' قلم</small></div><span class="chip a">'+mn(x.tot)+'</span></div>'+(op?x.items.map(function(i){return'<div class="row"><div><b>'+esc(i.name)+'</b><small>'+fa(i.qty)+' '+esc(i.unit)+' × '+mn(i.price)+'</small>'+WHO(i)+'</div><div class="rt"><span class="chip">'+mn(ic(i))+'</span>'+acts('st',i.id)+'</div></div>'}).join('')+'<div class="card" style="margin:6px 0;background:var(--bg)"><b>مجموع این ایستگاه: '+mn(x.tot)+'</b></div><div class="ia"><button class="ib" data-a="sta" data-k="'+esc(x.k)+'">افزودن قلم</button><button class="ib pr" data-a="stt" data-k="'+esc(x.k)+'">گزارش متنی</button><button class="ib pr" data-a="stpdf1" data-k="'+esc(x.k)+'">گزارش PDF</button><button class="ib pr" data-a="stp" data-k="'+esc(x.k)+'">پرامپت فاکتور</button></div>':'')+'</div>'}).join('')||'<p class="hint">ایستگاهی یافت نشد.</p>')}
function debtV(){var d=F.sub.db||'hey',st=F.sub.dbs||'all',all=D.debts.filter(function(x){return x.dir===d}),a=all.filter(function(x){return(st==='all'||(st==='u'?x.paid!=='1':x.paid==='1'))&&hit(x.title,x.person)}).sort(byD('date')),u=sum(all.filter(function(x){return x.paid!=='1'}),function(x){return x.amount}),pd=sum(all.filter(function(x){return x.paid==='1'}),function(x){return x.amount});
return subs('db',[['hey','بدهی هیئت'],['per','بدهی اشخاص']],'hey')+'<div class="card"><span class="chip a">'+(d==='hey'?'بدهی باقی‌ماندهٔ هیئت':'طلب باقی‌ماندهٔ هیئت از اشخاص')+' '+mn(u)+'</span><span class="chip p">پرداخت‌شده '+mn(pd)+'</span></div><button class="pri" data-a="adddb" style="margin-bottom:8px">'+(d==='hey'?'ثبت بدهی هیئت':'ثبت بدهی شخص')+'</button>'+txb('db')+subs('dbs',[['all','همه'],['u','پرداخت‌نشده'],['p','پرداخت‌شده']],'all')+(a.map(function(x){var pd2=x.paid==='1';return'<div class="row"><div><b>'+esc(x.title)+'</b><small>'+esc(x.person)+' — '+fd(x.date)+(x.cash==='1'?' — وجه نقد جابه‌جا شده':'')+(pd2?' — پرداخت: '+fd(x.pdate):'')+'</small>'+WHO(x)+'</div><div class="rt"><span class="chip '+(pd2?'p':'a')+'">'+mn(x.amount)+(pd2?' ✓':'')+'</span><div class="ia"><button class="ib pr" data-a="tgl" data-id="'+x.id+'">'+(pd2?(F.cf==='tg'+x.id?'تأیید برگشت':'برگشت به پرداخت‌نشده'):'پرداخت شد')+'</button></div>'+acts('debts',x.id)+'</div></div>'}).join('')||'<p class="hint">موردی یافت نشد.</p>')}
function rpV(){var r=calc(),s=F.sub.rp||'s',h=subs('rp',[['s','خلاصه'],['l','ریز تراکنش‌ها']],'s')+txb('rp');
if(s==='l')return h+(r.led.filter(function(x){return hit(x.t,x.s)}).map(function(x){return'<div class="row"><div><b>'+esc(x.t)+'</b><small>'+fd(x.d)+' — '+x.s+'</small>'+(x.w||'')+'</div>'+(x.f?'<span class="chip">ثبت '+mn(x.f)+'</span>':'<span class="chip '+(x.a>=0?'p':'a')+'">'+(x.a>=0?'+ ':'− ')+mn(Math.abs(x.a))+'</span>')+'</div>'}).join('')||'<p class="hint">—</p>');
function R(l,i,o){return'<div class="row"><b>'+l+'</b><div>'+(i?'<span class="chip p">+ '+mn(i)+'</span>':'')+(o?'<span class="chip a">− '+mn(o)+'</span>':'')+'</div></div>'}
function C(l,v){return'<div class="row"><b>'+l+'</b><span class="chip a">'+mn(v)+'</span></div>'}
return h+warnV(r)+R('ثبت دستی ورودی/خروجی',r.ci,r.co)+R('دریافت اصل وام‌ها',r.lr,0)+R('وجه نقد بدهی‌ها هنگام ثبت',r.dci,r.dco)+R('آکادمی رهروان حسنی (پرداخت‌ها)',r.acp,0)+R('امور خدام (پرداخت‌ها)',r.khp,0)+R('بدهی‌های اشخاص (دریافت‌شده)',r.pp,0)+R('بدهی‌های هیئت (پرداخت‌شده)',0,r.hp)+R('وام و اقساط (اقساط پرداخت‌شده)',0,r.lp)+R('ایستگاه‌های صلواتی (هزینه‌ها)',0,r.st)+'<div class="card" style="margin-top:12px"><span class="chip p">مجموع ورودی '+mn(r.inn)+'</span><span class="chip a">مجموع خروجی '+mn(r.out)+'</span><div class="big '+(r.bal<0?'neg':'pos')+'">موجودی: '+mn(r.bal)+'</div></div><h3>مطالبات و تعهدات باقی‌مانده</h3>'+C('بدهی آکادمی (مانده)',r.acf-r.acp)+C('بدهی خدام (مانده)',r.khf-r.khp)+C('بدهی‌های پرداخت‌نشدهٔ هیئت',r.hu)+C('طلب پرداخت‌نشده از اشخاص',r.pu)+'<h3>جدا از مجموع</h3>'+C('مانده وام‌ها و اقساط',loanRem())}
function dashV(){var r=calc();
function C(t,v,tab,c){return'<div class="card" data-a="tab" data-t="'+tab+'"><small>'+t+'</small><div class="'+(c||'')+'" style="font-weight:600;margin-top:4px">'+mn(v)+'</div></div>'}
return'<div class="card" data-a="tab" data-t="rp"><small>موجودی حساب</small><div class="big '+(r.bal<0?'neg':'pos')+'">'+mn(r.bal)+'</div></div>'+warnV(r)+'<div class="g2">'+C('مجموع ورودی',r.inn,'cash','pos')+C('مجموع خروجی',r.out,'cash','neg')+C('بدهی آکادمی',r.acf-r.acp,'ac')+C('بدهی خدام',r.khf-r.khp,'kh')+C('بدهی‌های باقی‌ماندهٔ هیئت',r.hu,'db')+C('طلب از اشخاص',r.pu,'db')+C('مانده وام‌ها و اقساط',loanRem(),'ln')+C('هزینهٔ ایستگاه‌ها (کسر شده از موجودی)',r.st,'st')+'</div><h3>آخرین تراکنش‌ها</h3>'+(r.led.filter(function(x){return!x.f}).slice(0,6).map(function(x){return'<div class="row"><div><b>'+esc(x.t)+'</b><small>'+fd(x.d)+' — '+x.s+'</small>'+(x.w||'')+'</div><span class="chip '+(x.a>=0?'p':'a')+'">'+mn(Math.abs(x.a))+'</span></div>'}).join('')||'<p class="hint">هنوز تراکنشی نیست.</p>')}
function text(k){var t='';
if(k==='cash'){var r=calc();t=head('ورودی و خروجی')+'\n';r.led.filter(function(x){return!x.f}).forEach(function(x){t+=fd(x.d)+' | '+(x.a>0?'ورودی':'خروجی')+' | '+x.s+' | '+x.t+' | '+mn(Math.abs(x.a))+'\n'});t+='\nمجموع ورودی: '+mn(r.inn)+'\nمجموع خروجی: '+mn(r.out)+'\nموجودی: '+mn(r.bal)+'\n(هزینهٔ ایستگاه‌های صلواتی در خروجی‌ها حساب شده است)'}
else if(k==='ac'||k==='kh'){var P=k;t=head(P==='ac'?'آکادمی فوتسال رهروان حسنی':'امور خدام')+'\nوضعیت افراد:\n';ppl(P,1).forEach(function(p){var b=bal(P,p.id);t+=p.name+': '+(b>0?'بدهکار '+mn(b):b<0?'طلبکار '+mn(-b):'تسویه')+'\n'});
['pay','fee'].forEach(function(kd){t+='\n'+(kd==='pay'?'پرداخت‌ها:':'شهریه/بدهی‌ها:')+'\n';D[P+'_tx'].filter(function(x){return x.kind===kd}).sort(byD('date')).forEach(function(x){t+=fd(x.date)+' | '+nm(P,x.pid)+' | '+mn(x.amount)+'\n'})})}
else if(k==='db'){t=head('مدیریت بدهی‌ها');[['hey','بدهی‌های هیئت'],['per','بدهی‌های اشخاص']].forEach(function(g){t+='\n'+g[1]+':\n';D.debts.filter(function(x){return x.dir===g[0]}).sort(byD('date')).forEach(function(x){t+=fd(x.date)+' | '+x.title+' | '+x.person+' | '+mn(x.amount)+' | '+(x.paid==='1'?'پرداخت‌شده '+fd(x.pdate):'پرداخت‌نشده')+'\n'})})}
else if(k==='ln'){t=head('وام و اقساط');D.loans.forEach(function(l){var c=lnCalc(l),nx=c.rows.filter(function(x){return!x.py})[0];t+=l.title+(l.lender?' ('+l.lender+')':'')+': '+fa(c.n)+' از '+fa(l.count)+' قسط | هر قسط '+mn(l.amount)+' | مانده '+mn(c.total-c.paid)+(c.od?' | معوق '+fa(c.od)+' قسط':'')+(nx?' | قسط بعدی '+fd(nx.due):'')+'\n'});t+='\nمجموع مانده: '+mn(loanRem())}
else if(k==='rp'){var r=calc();t=head('جامع مالی')+'\nمجموع ورودی: '+mn(r.inn)+'\nمجموع خروجی: '+mn(r.out)+' (شامل ایستگاه‌ها '+mn(r.st)+')\nموجودی حساب: '+mn(r.bal)+'\n\nبدهی آکادمی: '+mn(r.acf-r.acp)+'\nبدهی خدام: '+mn(r.khf-r.khp)+'\nبدهی‌های باقی‌ماندهٔ هیئت: '+mn(r.hu)+'\nطلب از اشخاص: '+mn(r.pu)+'\n\nجدا از مجموع:\nمانده وام‌ها و اقساط: '+mn(loanRem())+'\n\nریز تراکنش‌ها:\n';r.led.forEach(function(x){if(!x.f)t+=fd(x.d)+' | '+x.s+' | '+x.t+' | '+(x.a>=0?'+':'-')+mn(Math.abs(x.a))+'\n'})}
showText(t)}
function cur(){return({dash:dashV,cash:cashV,ac:function(){return duesV('ac')},st:stV,kh:function(){return duesV('kh')},db:debtV,ln:loanV,rp:rpV}[F.tab])()}
function view(){$('#ftabs').innerHTML=TABS.map(function(t){return'<button class="'+(F.tab===t[0]?'on':'')+'" data-a="tab" data-t="'+t[0]+'">'+t[1]+'</button>'}).join('');
var s=SRCH[F.tab]?'<input class="in" id="fq" placeholder="جستجو در این بخش" value="'+esc(F.q[F.tab]||'')+'">':'',ae=document.activeElement;
if(ae&&ae.id==='fq'&&$('#fres')){$('#fres').innerHTML=cur();return}
B.innerHTML=(F.off?'<p class="warn">برای مشاهده و ثبت اطلاعات باید با حساب خود وارد شوید.</p>':'')+s+'<div id="fres">'+cur()+'</div>'}
B.addEventListener('input',function(e){if(e.target.id==='fq'){F.q[F.tab]=e.target.value;$('#fres').innerHTML=cur()}});
function mfull(m){return((m.first||'')+' '+(m.last||'')).trim()}
function pick(coll,k){if(!((k==='name'&&/_people$/.test(coll))||(k==='person'&&coll==='debts')))return'';var a=D.members.slice().sort(function(x,y){return mfull(x).localeCompare(mfull(y),'fa')});return'<label>انتخاب از لیست اعضا</label><select class="in" id="g_pick"><option value="">— انتخاب عضو —</option>'+a.map(function(m){return'<option value="'+m.id+'">'+esc(mfull(m))+'</option>'}).join('')+'</select>'}
SH.addEventListener('change',function(e){if(e.target.id!=='g_pick')return;var m=D.members.filter(function(x){return x.id===e.target.value})[0],c=SH._c,el=$('#g_'+(c.coll==='debts'?'person':'name'));if(m){el.value=mfull(m);c.extra.mid=m.id}else{delete c.extra.mid}});
var TABS=[['dash','داشبورد'],['cash','ورودی و خروجی'],['ac','آکادمی رهروان حسنی'],['st','ایستگاه صلواتی'],['kh','امور خدام'],['db','مدیریت بدهی‌ها'],['ln','وام و اقساط'],['rp','گزارشات جامع']];
function cfAsk(key){if(F.cf===key){F.cf=null;return true}F.cf=key;view();clearTimeout(cfAsk.t);cfAsk.t=setTimeout(function(){if(F.cf===key){F.cf=null;view()}},4000);return false}
function lpays(id){var l=D.loans.filter(function(y){return y.id===id})[0],loc=Object.assign({},(l&&l.pays)||{});return new Promise(function(res){try{Promise.resolve(db.collection('loans').doc(id).get()).then(function(sn){var dd=sn&&(typeof sn.data==='function'?sn.data():sn.data);res(dd&&dd.pays?Object.assign({},dd.pays):loc)},function(){res(loc)})}catch(e){res(loc)}})}
function warnV(r){var w=[];if(r.bad)w.push(fa(r.bad)+' رکورد با مبلغ صفر، منفی یا نامعتبر (در بخش «اصلاحیه» بررسی کنید)');if(r.orph)w.push(fa(r.orph)+' تراکنش آکادمی/خدام بدون فرد معتبر ('+mn(r.orphAmt)+') — در موجودی لحاظ شده است');return w.length?'<p class="warn">⚠ '+w.join('<br>⚠ ')+'</p>':''}
function arcList(P){var a=ppl(P,1).filter(function(p){return p.arch});if(!a.length)return'';return'<h3>بایگانی‌شده‌ها</h3><p class="hint">سوابق مالی این افراد همچنان در موجودی و گزارش‌ها حساب می‌شود.</p>'+a.map(function(p){return'<div class="row"><div><b>'+esc(p.name)+'</b></div><div class="rt">'+bch(bal(P,p.id))+'<div class="ia"><button class="ib pr" data-a="unarch" data-p="'+P+'" data-id="'+p.id+'">بازگردانی</button></div></div></div>'}).join('')}
function showRc(){var r=calc();SH._rc=null;SH.innerHTML='<div class="sh"><h3>مغایرت‌گیری موجودی</h3><p class="hint">موجودی فعلی در برنامه: <b>'+mn(r.bal)+'</b>. موجودی واقعی صندوق و حساب‌های بانکی هیئت را وارد کنید؛ اختلاف به‌صورت یک ثبت تعدیلی ذخیره می‌شود.</p><label>موجودی واقعی (تومان)</label><input class="in amt" id="rca" inputmode="decimal"><button class="pri" data-a="rcs">ثبت تعدیل</button><button class="sec" data-a="cx" style="margin-top:8px">انصراف</button></div>';SH.classList.add('on')}
function rcSave(){var raw=$('#rca').value;if(!String(raw).trim())return toast('موجودی واقعی را وارد کنید');var act=num(raw),r=calc(),df=act-r.bal;if(df===0){SH.classList.remove('on');return toast('مغایرتی وجود ندارد')}if(SH._rc!==act){SH._rc=act;return toast('اختلاف '+(df>0?'+':'−')+mn(Math.abs(df))+' — برای ثبت، دوباره «ثبت تعدیل» را بزنید')}Promise.resolve(put('cash',{type:df>0?'in':'out',title:'تعدیل مغایرت موجودی',amount:Math.abs(df),date:F.date||tk()})).then(function(ok){if(!ok)return;toast('تعدیل ثبت شد');SH.classList.remove('on')})}
function lpay(id,n){var l=D.loans.filter(function(y){return y.id===id})[0];if(!l)return;lpays(id).then(function(p){p[n]={d:F.date,a:+l.amount,by:window.HU||''};return put('loans',{pays:p},id)}).then(function(ok){if(ok)toast('قسط '+fa(n)+' ثبت شد')})}
function mkPdf(jp,w,h){var parts=[],off=0,xr=[],PW=595.28,PH=841.89;
function add(x){if(typeof x==='string'){var b=new Uint8Array(x.length);for(var i=0;i<x.length;i++)b[i]=x.charCodeAt(i)&255;x=b}parts.push(x);off+=x.length}
function ob(n,f){xr[n]=off;add(n+' 0 obj\n');f();add('\nendobj\n')}
var n=jp.length,kids=[],i;for(i=0;i<n;i++)kids.push((3+3*i)+' 0 R');
add('%PDF-1.4\n');
ob(1,function(){add('<</Type/Catalog/Pages 2 0 R>>')});
ob(2,function(){add('<</Type/Pages/Kids['+kids.join(' ')+']/Count '+n+'>>')});
jp.forEach(function(u,i){var pg=3+3*i,ct=4+3*i,im=5+3*i,cs='q '+PW+' 0 0 '+PH+' 0 0 cm /Im0 Do Q';
ob(pg,function(){add('<</Type/Page/Parent 2 0 R/MediaBox[0 0 '+PW+' '+PH+']/Resources<</XObject<</Im0 '+im+' 0 R>>>>/Contents '+ct+' 0 R>>')});
ob(ct,function(){add('<</Length '+cs.length+'>>\nstream\n'+cs+'\nendstream')});
ob(im,function(){add('<</Type/XObject/Subtype/Image/Width '+w+'/Height '+h+'/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length '+u.length+'>>\nstream\n');add(u);add('\nendstream')})});
var N=3+3*n,xo=off,t='xref\n0 '+N+'\n0000000000 65535 f \n';
for(i=1;i<N;i++)t+=('0000000000'+xr[i]).slice(-10)+' 00000 n \n';
add(t+'trailer\n<</Size '+N+'/Root 1 0 R>>\nstartxref\n'+xo+'\n%%EOF');
return new Blob(parts,{type:'application/pdf'})}
function stPdf(gs,mode){if(!gs.length||!gs[0])return toast('ایستگاهی برای گزارش وجود ندارد');toast('در حال ساخت PDF…');
var go=function(){try{stPdfBuild(gs,mode)}catch(e){toast('ساخت PDF ناموفق بود')}};
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go,go);else setTimeout(go,50)}
function stPdfBuild(gs,mode){var W=1240,H=1754,M=60,CW=W-2*M,FF=getComputedStyle(document.body).fontFamily,pages=[],cv,cx,y,
INK='#1b1b1b',LINE='#8a949e',HEAD='#1f5f4a',ZEB='#f2f6f5',SUB='#dcece6',nf=function(v){return fa(grp(Math.round(v||0)))},qs=function(v){return fa(String(v).replace('.','٫'))};
function np(){cv=document.createElement('canvas');cv.width=W;cv.height=H;cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,W,H);cx.direction='rtl';cx.textBaseline='middle';pages.push(cv);y=M}
function font(z,b){cx.font=(b?'bold ':'')+z+'px '+FF}
function wrap(t,mw,z,b){font(z,b);var ws=String(t).split(/\s+/),ls=[],c='';ws.forEach(function(w){var tt=c?c+' '+w:w;if(!c||cx.measureText(tt).width<=mw)c=tt;else{ls.push(c);c=w}});if(c)ls.push(c);return ls.length?ls:['']}
function drawRow(cells,ws,al,o,rep){o=o||{};var z=o.sz||28,pd=14,lh=z+12,ls=cells.map(function(t,i){return wrap(t,ws[i]-2*pd,z,o.b)}),n=Math.max.apply(null,ls.map(function(a){return a.length})),h=n*lh+14;
if(y+h>H-M-50){np();if(rep&&!o.head)rep()}
var x=W-M;if(o.bg){cx.fillStyle=o.bg;cx.fillRect(M,y,CW,h)}cx.strokeStyle=LINE;cx.lineWidth=1.5;
cells.forEach(function(t,i){var w=ws[i],x0=x-w;cx.strokeRect(x0,y,w,h);cx.fillStyle=o.fg||INK;font(z,o.b);
ls[i].forEach(function(l,j){var yy=y+7+lh/2+j*lh;if(al[i]==='c'){cx.textAlign='center';cx.fillText(l,x0+w/2,yy)}else{cx.textAlign='right';cx.fillText(l,x-pd,yy)}});x=x0});y+=h}
function bar(t){if(y+120>H-M-50)np();cx.fillStyle=SUB;cx.fillRect(M,y,CW,58);cx.strokeStyle=HEAD;cx.lineWidth=2;cx.strokeRect(M,y,CW,58);cx.fillStyle=HEAD;font(31,true);cx.textAlign='right';cx.fillText(t,W-M-16,y+30);y+=58}
function ctr(t,z,b,col,gap){cx.fillStyle=col||INK;font(z,b);cx.textAlign='center';cx.fillText(t,W/2,y+z/2+6);y+=gap}
var items=sum(gs,function(g){return g.items.length}),tot=sum(gs,function(g){return g.tot});
np();ctr('هیئت معظم ابناءالحسن (علیهم السلام)',38,true,HEAD,64);ctr(mode==='one'?'گزارش ایستگاه صلواتی':'گزارش جامع ایستگاه‌های صلواتی',52,true,INK,70);ctr('تاریخ گزارش: '+fd(tk())+'     |     همهٔ مبالغ به تومان',26,false,'#555',56);
var w3=[373,373,374],a3=['c','c','c'];
drawRow(['تعداد ایستگاه','تعداد اقلام','جمع کل هزینه'],w3,a3,{b:1,bg:HEAD,fg:'#fff',head:1});
drawRow([fa(gs.length),fa(items),mn(tot)],w3,a3,{b:1,sz:32});y+=36;
bar('خلاصهٔ ایستگاه‌ها');
var ws1=[80,430,210,160,240],h1=['ردیف','عنوان ایستگاه','تاریخ','تعداد اقلام','جمع هزینه (تومان)'],al1=['c','r','c','c','c'],rep1=function(){drawRow(h1,ws1,al1,{b:1,bg:HEAD,fg:'#fff',head:1})};
rep1();gs.forEach(function(g,i){drawRow([fa(i+1),g.station,fd(g.time),fa(g.items.length),nf(g.tot)],ws1,al1,{bg:i%2?ZEB:''},rep1)});
drawRow(['جمع کل',nf(tot)],[ws1[0]+ws1[1]+ws1[2]+ws1[3],ws1[4]],['r','c'],{b:1,bg:SUB},rep1);y+=40;
var ws=[60,340,130,130,220,240],hd=['ردیف','نام کالا','واحد','مقدار','قیمت واحد (تومان)','جمع (تومان)'],al=['c','r','c','c','c','c'],rep=function(){drawRow(hd,ws,al,{b:1,bg:HEAD,fg:'#fff',head:1})};
gs.forEach(function(g){if(y+260>H-M-50)np();bar('ایستگاه: '+g.station+'   —   تاریخ: '+fd(g.time)+'   —   '+fa(g.items.length)+' قلم');rep();
g.items.forEach(function(it,i){drawRow([fa(i+1),it.name,it.unit||'',qs(it.qty),nf(it.price),nf(ic(it))],ws,al,{bg:i%2?ZEB:''},rep)});
drawRow(['جمع این ایستگاه',nf(g.tot)],[ws[0]+ws[1]+ws[2]+ws[3]+ws[4],ws[5]],['r','c'],{b:1,bg:SUB},rep);y+=36});
if(gs.length>1)drawRow(['جمع کل همهٔ ایستگاه‌ها',nf(tot)+' تومان'],[ws[0]+ws[1]+ws[2]+ws[3],ws[4]+ws[5]],['r','c'],{b:1,bg:HEAD,fg:'#fff',sz:32},rep);
pages.forEach(function(c,i){var k=c.getContext('2d');k.direction='rtl';k.textBaseline='middle';k.fillStyle='#666';k.font='24px '+FF;k.textAlign='center';k.fillText('صفحهٔ '+fa(i+1)+' از '+fa(pages.length),W/2,H-34)});
var jp=pages.map(function(c){var b=atob(c.toDataURL('image/jpeg',0.92).split(',')[1]),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u});
var blob=mkPdf(jp,W,H),url=URL.createObjectURL(blob),name='station-report-'+tk()+'.pdf';SH._pdf={blob:blob,name:name};
SH.innerHTML='<div class="sh"><h3>گزارش PDF ایستگاه صلواتی آماده شد</h3><p class="hint">'+fa(pages.length)+' صفحه — '+fa(gs.length)+' ایستگاه — '+fa(items)+' قلم — جمع '+mn(tot)+'</p><a class="pri" href="'+url+'" download="'+name+'" style="display:block;text-align:center;text-decoration:none;margin-bottom:8px">دانلود PDF</a>'+(navigator.share&&navigator.canShare?'<button class="sec" data-a="pdfs" style="margin-bottom:8px">ارسال در پیام‌رسان / ذخیره</button>':'')+'<a class="sec" href="'+url+'" target="_blank" style="display:block;text-align:center;text-decoration:none;margin-bottom:8px">مشاهدهٔ PDF</a><button class="sec" data-a="cx">بستن</button></div>';SH.classList.add('on')}
function pdfShare(){var p=SH._pdf;if(!p)return;try{var f=new File([p.blob],p.name,{type:'application/pdf'});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:'گزارش ایستگاه صلواتی'}).catch(function(){});else toast('ارسال در این دستگاه ممکن نیست؛ دکمهٔ دانلود را بزنید')}catch(e){toast('ارسال ممکن نشد؛ دکمهٔ دانلود را بزنید')}}
function onClick(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,c=b.dataset.c,id=b.dataset.id,p=b.dataset.p,k=b.dataset.k,g;
function G(){return groups().filter(function(x){return x.k===k})[0]}
if(a!=='fee3'&&a!=='lcan'&&a!=='tgl')F.cf=null;
if(a==='tab'){F.tab=b.dataset.t;F.del=null;F.cf=null;view()}
else if(a==='sub'){F.sub[k]=b.dataset.v;view()}
else if(a==='add')sheet(c,null,c==='loans'?{rcv:'1'}:{},'افزودن');
else if(a==='op0')sheet('cash',null,{type:'in',title:'موجودی اول دوره',date:F.date},'ثبت موجودی اول دوره',{});
else if(a==='rc')showRc();
else if(a==='unarch')put(p+'_people',{arch:false},id).then(function(ok){if(ok)toast('بازگردانی شد')});
else if(a==='ed')sheet(c,id,null,'ویرایش');
else if(a==='del'){if(F.del===c+id){F.del=null;if(!db)return fail();if(AR(c,id)){put(c,{arch:true},id).then(function(ok){if(ok)toast('فرد دارای سابقهٔ مالی است؛ بایگانی شد و سوابقش در موجودی باقی ماند')});return}db.collection(c).doc(id).delete().catch(fail);if(c==='ac_people'){try{var am=JSON.parse(localStorage.getItem('hdb_ac_att')||'{}');Object.keys(am).forEach(function(k){if(am[k].pid===id)db.collection('ac_att').doc(k).delete()})}catch(x){}}}else{F.del=c+id;view()}}
else if(a==='op'){F.open=F.open===id?null:id;view()}
else if(a==='fee3'){if(cfAsk('f3'+id))put(p+'_tx',{pid:id,kind:'fee',amount:300000,date:F.date}).then(function(ok){if(ok)toast('+۳۰۰ هزار تومان ثبت شد')})}
else if(a==='mf')sheet(p+'_tx',null,{kind:'fee',date:F.date},'ثبت شهریه / بدهی دستی',{pid:id});
else if(a==='mp')sheet(p+'_tx',null,{kind:'pay',date:F.date},'ثبت پرداخت',{pid:id});
else if(a==='seed'){['صادق جمالی فرد','محمد عسگری','حسین وفا','سید محمد علی حسین زاده علوی','اباصلت برجی'].forEach(function(n){put('kh_people',{name:n})})}
else if(a==='adst'){var l={};try{l=JSON.parse(localStorage.getItem('st_last')||'{}')}catch(x){}sheet('st',null,l,'ثبت قلم ایستگاه',{})}
else if(a==='sto'){F.stOpen=F.stOpen===k?null:k;view()}
else if(a==='sta'){g=G();sheet('st',null,{station:g.station,time:g.time},'افزودن قلم',{})}
else if(a==='stt'){showText(stText(G()))}
else if(a==='stpdf')stPdf(groups().slice().reverse(),'all');
else if(a==='stpdf1')stPdf([G()],'one');
else if(a==='stp'){showText('لطفاً با اقلام زیر یک فاکتور و گزارش مرتب و حرفه‌ای برای ایستگاه صلواتی بنویس: جدول اقلام (نام، مقدار، قیمت واحد، جمع)، جمع کل، پرهزینه‌ترین اقلام و پیشنهادهایی برای صرفه‌جویی در دفعات بعد. تمام مبالغ به تومان است.\n\n'+stText(G()))}
else if(a==='tgl'){var x=D.debts.filter(function(y){return y.id===id})[0];if(x.paid==='1'&&!cfAsk('tg'+id))return;put('debts',x.paid==='1'?{paid:'0',pdate:''}:{paid:'1',pdate:tk()},id)}
else if(a==='adddb')sheet('debts',null,{dir:F.sub.db||'hey'},'ثبت بدهی جدید',{});
else if(a==='ptx')showText(ptext(p,id));
else if(a==='dm'){if(window.acDebtSheet)window.acDebtSheet(id)}
else if(a==='dmt'){if(window.acDebtTpl)window.acDebtTpl()}
else if(a==='lno'){F.lnOpen=F.lnOpen===id?null:id;view()}
else if(a==='lpay')lpay(id,+b.dataset.n);
else if(a==='lsh')lsheet(id,+b.dataset.n);
else if(a==='lcan'){var ln0=b.dataset.n;if(cfAsk('lc'+id+ln0))lpays(id).then(function(p0){delete p0[ln0];return put('loans',{pays:p0},id)}).then(function(ok){if(ok)toast('پرداخت قسط لغو شد')})}
else if(a==='ltx')showText(ltext(id));
else if(a==='txt')text(k)}
B.addEventListener('click',onClick);$('#ftabs').addEventListener('click',onClick);
B.addEventListener('change',function(e){if(/^fd_/.test(e.target.id)){F.date=dget('fd')}});
SH.addEventListener('click',function(e){var a=e.target.dataset.a;if(a==='lps')lps();else if(a==='rcs')rcSave();else if(a==='pdfs')pdfShare();else if(a==='sv')save();else if(a==='cx')SH.classList.remove('on');else if(a==='cp'){var t=$('#shta');t.select();try{navigator.clipboard.writeText(t.value).then(function(){toast('کپی شد')},function(){document.execCommand('copy');toast('کپی شد')})}catch(x){try{document.execCommand('copy');toast('کپی شد')}catch(y){}}}else if(a==='shr')navigator.share({text:$('#shta').value}).catch(function(){});else if(e.target===SH)SH.classList.remove('on')});
SH.addEventListener('input',function(e){if(e.target.classList.contains('amt')){if(/[.٫\/\-−]/.test(e.target.value))toast('مبلغ را فقط به‌صورت عدد صحیح تومان (بدون اعشار و منفی) وارد کنید');var v=num(e.target.value);e.target.value=v?grp(v):''}});
async function connect(){try{var d=window.claude&&await claude.use('db');if(!d){F.off=1;view();return}db=d;CL.forEach(function(c){d.collection(c).onSnapshot(function(q){D[c]=q.docs.map(function(x){return Object.assign({id:x.id},x.data())});view()})})}catch(e){F.off=1;view()}}
window.openFin=function(){F.date=tk();show('fin');if(!F.init){F.init=1;connect()}view()};
$('#fback').onclick=function(){show('home')};
})();
