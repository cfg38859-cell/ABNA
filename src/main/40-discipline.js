(function(){
var $=function(s){return document.querySelector(s)},B=$('#dbody');
var NAMES=['حسین وفا','اباصلت برجی','محمد عسگری','صادق جمالی فرد','سید محمد علی حسین زاده علوی'];
var MN=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
var M=[],R=[],db=null,C={tab:'add',fm:'',fs:'all',edit:null,del:null,sg:'p',init:0};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fa(s){return String(s).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})}
function pad(n){return n<10?'0'+n:''+n}
function today(){var o={};new Intl.DateTimeFormat('en-u-ca-persian-nu-latn',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).forEach(function(x){o[x.type]=x.value});return{y:+o.year,m:+o.month,d:+o.day}}
function tk(){var o=today();return o.y+'-'+pad(o.m)+'-'+pad(o.d)}
function fd(k){return fa(String(k||'').replace(/-/g,'/'))}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k)||'';localStorage.setItem(k,v)}catch(e){return''}}
function gt(t){var e=$('#gtoast');e.textContent=t;e.classList.add('on');clearTimeout(gt.t);gt.t=setTimeout(function(){e.classList.remove('on')},3000)}
function full(m){return((m.first||'')+' '+(m.last||'')).trim()}
function mem(){return M.slice().sort(function(a,b){return full(a).localeCompare(full(b),'fa')})}
function nm(id,fb){var m=M.filter(function(x){return x.id===id})[0];return m?full(m):(fb||'—')}
function dsel(k,v){var t=today(),p=v?v.split('-'):null,o=p?{y:+p[0],m:+p[1],d:+p[2]}:t,i,h='<div class="dp"><select id="'+k+'_d">';
for(i=1;i<=31;i++)h+='<option value="'+i+'"'+(i===o.d?' selected':'')+'>'+fa(i)+'</option>';
h+='</select><select id="'+k+'_m">';MN.forEach(function(n,j){h+='<option value="'+(j+1)+'"'+(j+1===o.m?' selected':'')+'>'+n+'</option>'});
h+='</select><select id="'+k+'_y">';for(i=Math.min(t.y-4,o.y);i<=Math.max(t.y+1,o.y);i++)h+='<option value="'+i+'"'+(i===o.y?' selected':'')+'>'+fa(i)+'</option>';return h+'</select></div>'}
function dget(k){var y=+$('#'+k+'_y').value,m=+$('#'+k+'_m').value,d=+$('#'+k+'_d').value;return y+'-'+pad(m)+'-'+pad(Math.min(d,window.jml(y,m)))}
function mopts(sel,all){return'<option value="">'+(all?'همهٔ اعضا':'انتخاب عضو…')+'</option>'+mem().map(function(m){return'<option value="'+m.id+'"'+(m.id===sel?' selected':'')+'>'+esc(full(m))+'</option>'}).join('')}
function sgb(v){return'<div class="seg" id="dsg"><button data-a="sg" data-v="p" class="'+(v!=='m'?'on':'')+'">+ مثبت</button><button data-a="sg" data-v="m" class="'+(v==='m'?'on':'')+'">− منفی</button></div>'}
function rec(x){var p=x.sign==='p';return'<div class="card"><div class="rw"><div><span class="chip '+(p?'p':'a')+'">'+(p?'+ مثبت':'− منفی')+'</span></div><small class="hint">'+fd(x.date)+'</small></div><b>'+esc(nm(x.mid,x.mname))+'</b><p class="pre">'+esc(x.text)+'</p>'+(WHO(x)||'<small class="hint">ثبت‌کننده: '+esc(x.by)+'</small>')+'<div class="ia" style="margin-top:8px"><button class="ib" data-a="ed" data-id="'+x.id+'">ویرایش</button><button class="ib dg" data-a="del" data-id="'+x.id+'">'+(C.del===x.id?'تأیید حذف':'حذف')+'</button></div></div>'}
function stats(){var s={};M.forEach(function(m){s[m.id]={m:m,p:0,n:0}});R.forEach(function(x){if(s[x.mid])s[x.mid][x.sign==='p'?'p':'n']++});return Object.keys(s).map(function(k){return s[k]}).filter(function(x){return x.p||x.n}).sort(function(a,b){return(b.p-b.n)-(a.p-a.n)})}
function view(){var T=[['add','ثبت'],['list','لیست'],['rep','گزارش']];
$('#dtabs').innerHTML=T.map(function(t){return'<button class="'+(C.tab===t[0]?'on':'')+'" data-a="tab" data-t="'+t[0]+'">'+t[1]+'</button>'}).join('');
if(C.tab==='add'){var e=C.edit&&R.filter(function(x){return x.id===C.edit})[0]||{};C.sg=e.sign||C.sg;
B.innerHTML='<div class="card"><h3>ثبت‌کننده</h3><select id="dme"><option value="">انتخاب نام خود…</option>'+(window.HU?[window.HU]:NAMES).map(function(n){return'<option'+(n===ls('dc_me')?' selected':'')+'>'+n+'</option>'}).join('')+'</select><p class="hint">ابتدا نام خود را از فهرست انتخاب کنید.</p></div><div class="card"><h3>'+(C.edit?'ویرایش مورد انضباطی':'ثبت مورد انضباطی')+'</h3><label>عضو</label><select id="dmem">'+mopts(e.mid)+'</select><label>نوع</label>'+sgb(C.sg)+'<label>تاریخ</label>'+dsel('dd',e.date)+'<label>توضیحات کامل</label><textarea id="dtx" rows="5" placeholder="شرح کامل را بنویسید…">'+esc(e.text)+'</textarea><button class="pri" data-a="send">'+(C.edit?'ذخیرهٔ ویرایش':'ثبت')+'</button></div>';return}
if(C.tab==='list'){var a=R.filter(function(x){return(!C.fm||x.mid===C.fm)&&(C.fs==='all'||x.sign===C.fs)}).sort(function(a,b){return(b.at||0)-(a.at||0)});
B.innerHTML='<select id="dfm">'+mopts(C.fm,1)+'</select><div class="sub">'+[['all','همه'],['p','مثبت'],['m','منفی']].map(function(t){return'<button class="'+(C.fs===t[0]?'on':'')+'" data-a="fs" data-v="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div>'+(a.map(rec).join('')||'<p class="hint">موردی ثبت نشده است.</p>');return}
var s=stats();B.innerHTML='<div class="ia" style="margin-bottom:10px"><button class="ib pr" data-a="txt">گزارش متنی</button></div><p class="hint">امتیاز = تعداد مثبت − تعداد منفی. با لمس هر عضو، موارد او نمایش داده می‌شود.</p>'+(s.map(function(x){var n=x.p-x.n;return'<div class="row" data-a="mf" data-id="'+x.m.id+'" style="cursor:pointer"><b>'+esc(full(x.m))+'</b><div><span class="chip p">+ '+fa(x.p)+'</span><span class="chip a">− '+fa(x.n)+'</span><span class="chip '+(n<0?'a':'p')+'">امتیاز '+fa(n)+'</span></div></div>'}).join('')||'<p class="hint">موردی ثبت نشده است.</p>')}
function text(){var t='گزارش موارد انضباطی — هیئت معظم ابناءالحسن (علیهم السلام)\nتاریخ گزارش: '+fd(tk())+'\n\nخلاصه:\n';stats().forEach(function(x){t+=full(x.m)+': +'+fa(x.p)+' / −'+fa(x.n)+' (امتیاز '+fa(x.p-x.n)+')\n'});t+='\nجزئیات:\n';R.slice().sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}).forEach(function(x){t+=fd(x.date)+' | '+nm(x.mid,x.mname)+' | '+(x.sign==='p'?'+':'−')+' | '+x.text+' | ثبت: '+x.by+'\n'});
$('#dsh').innerHTML='<div class="sh"><h3>گزارش متنی</h3><textarea id="dsta" rows="12" readonly style="width:100%;font:inherit;background:var(--bg);color:var(--ink);border:1.5px solid var(--mute);border-radius:12px;padding:10px">'+esc(t)+'</textarea><button class="pri" data-a="cp">کپی</button>'+(navigator.share?'<button class="sec" data-a="shr" style="margin-top:8px">ارسال در پیام‌رسان</button>':'')+'<button class="ib" data-a="cx" style="margin-top:8px;width:100%;padding:10px">بستن</button></div>';$('#dsh').classList.add('on')}
function onClick(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,id=b.dataset.id;
if(a==='tab'){C.tab=b.dataset.t;C.edit=null;C.del=null;view()}
else if(a==='sg'){C.sg=b.dataset.v;[].forEach.call($('#dsg').children,function(x){x.classList.toggle('on',x===b)})}
else if(a==='fs'){C.fs=b.dataset.v;view()}
else if(a==='mf'){C.fm=id;C.fs='all';C.tab='list';view()}
else if(a==='ed'){C.edit=id;C.tab='add';view();B.scrollTop=0}
else if(a==='del'){if(C.del===id){C.del=null;db&&db.collection('disc').doc(id).delete().catch(function(){gt('حذف نشد')})}else{C.del=id;view()}}
else if(a==='txt')text();
else if(a==='cx')$('#dsh').classList.remove('on');
else if(a==='cp'){var t=$('#dsta');t.select();try{navigator.clipboard.writeText(t.value).then(function(){gt('کپی شد')},function(){document.execCommand('copy');gt('کپی شد')})}catch(x){try{document.execCommand('copy');gt('کپی شد')}catch(y){}}}
else if(a==='shr')navigator.share({text:$('#dsta').value}).catch(function(){});
else if(a==='send'){var by=$('#dme').value,mid=$('#dmem').value,tx=$('#dtx').value.trim();
if(!by)return gt('ابتدا نام خود را انتخاب کنید');if(!mid)return gt('عضو را انتخاب کنید');if(tx.length<3)return gt('توضیحات را بنویسید');if(!db)return gt('اتصال برقرار نیست؛ وارد حساب شوید');
ls('dc_me',by);var o={mid:mid,mname:nm(mid),sign:C.sg,text:tx,date:dget('dd')},ed=C.edit,p=ed?db.collection('disc').doc(ed).update(o):db.collection('disc').add(Object.assign(o,{by:by,at:Date.now()}));
p.then(function(){gt(ed?'ویرایش شد':'ثبت شد');C.edit=null;if(ed)C.tab='list';view()}).catch(function(){gt('ثبت نشد؛ سطح دسترسی را بررسی کنید')})}}
B.addEventListener('click',onClick);$('#dtabs').addEventListener('click',onClick);$('#dsh').addEventListener('click',function(e){if(e.target===$('#dsh'))$('#dsh').classList.remove('on');else onClick(e)});
B.addEventListener('change',function(e){if(e.target.id==='dfm'){C.fm=e.target.value;view()}else if(e.target.id==='dme')ls('dc_me',e.target.value)});
async function connect(){try{var d=window.claude&&await claude.use('db');if(!d){B.insertAdjacentHTML('afterbegin','<p class="warn">برای مشاهده و ثبت باید با حساب خود وارد شوید.</p>');return}db=d;
d.collection('members').onSnapshot(function(q){M=q.docs.map(function(x){return Object.assign({id:x.id},x.data())});var s=$('#dmem');if(C.tab==='add'&&s)s.innerHTML=mopts(s.value);else if(C.tab!=='add')view()});
d.collection('disc').onSnapshot(function(q){R=q.docs.map(function(x){return Object.assign({id:x.id},x.data())});if(C.tab!=='add')view()})}catch(e){}}
window.openDc=function(){show('dc');if(!C.init){C.init=1;connect()}view()};
$('#dback').onclick=function(){show('home')};
})();
