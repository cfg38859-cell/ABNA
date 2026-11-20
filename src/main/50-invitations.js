(function(){
var $=function(s){return document.querySelector(s)},B=$('#ibody');
var MN=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
var D=[],F=[],db=null,C={tab:'add',role:'m',f:'all',q:'',edit:null,del:null,init:0},RL={m:'مداح',s:'سخنران'};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fa(s){return String(s).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})}
function pad(n){return n<10?'0'+n:''+n}
function today(){var o={};new Intl.DateTimeFormat('en-u-ca-persian-nu-latn',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).forEach(function(x){o[x.type]=x.value});return{y:+o.year,m:+o.month,d:+o.day}}
function fd(k){return fa(String(k||'').replace(/-/g,'/'))}
function gt(t){var e=$('#gtoast');e.textContent=t;e.classList.add('on');clearTimeout(gt.t);gt.t=setTimeout(function(){e.classList.remove('on')},3000)}
function dsel(k,v){var t=today(),p=v?v.split('-'):null,o=p?{y:+p[0],m:+p[1],d:+p[2]}:t,i,h='<div class="dp"><select id="'+k+'_d">';
for(i=1;i<=31;i++)h+='<option value="'+i+'"'+(i===o.d?' selected':'')+'>'+fa(i)+'</option>';
h+='</select><select id="'+k+'_m">';MN.forEach(function(n,j){h+='<option value="'+(j+1)+'"'+(j+1===o.m?' selected':'')+'>'+n+'</option>'});
h+='</select><select id="'+k+'_y">';for(i=t.y-4;i<=t.y+2;i++)h+='<option value="'+i+'"'+(i===o.y?' selected':'')+'>'+fa(i)+'</option>';return h+'</select></div>'}
function dget(k){var y=+$('#'+k+'_y').value,m=+$('#'+k+'_m').value,d=+$('#'+k+'_d').value;return y+'-'+pad(m)+'-'+pad(Math.min(d,window.jml(y,m)))}
function cnt(x){return D.filter(function(y){return y.name===x.name&&y.role===x.role}).length}
function view(){var T=[['add','ثبت دعوت'],['list','لیست دعوت‌ها'],['fb','نظر دهی']];
$('#itabs').innerHTML=T.map(function(t){return'<button class="'+(C.tab===t[0]?'on':'')+'" data-a="tab" data-t="'+t[0]+'">'+t[1]+'</button>'}).join('');
if(C.tab==='fb'){fbView();return}
if(C.tab==='add'){var e=C.edit&&D.filter(function(x){return x.id===C.edit})[0]||{};C.role=e.role||C.role;
var names=Object.keys(D.reduce(function(o,x){o[x.name]=1;return o},{})),occs=Object.keys(D.reduce(function(o,x){if(x.occ)o[x.occ]=1;return o},{}));
B.innerHTML='<div class="card"><h3>'+(C.edit?'ویرایش دعوت':'ثبت دعوت جدید')+'</h3><label>انتخاب</label><div class="seg" id="irs"><button data-a="rl" data-v="m" class="'+(C.role==='m'?'on':'')+'">مداح</button><button data-a="rl" data-v="s" class="'+(C.role==='s'?'on':'')+'">سخنران</button></div><label>نام و نام خانوادگی</label><input class="in" id="inm" list="inl" value="'+esc(e.name)+'"><datalist id="inl">'+names.map(function(n){return'<option value="'+esc(n)+'">'}).join('')+'</datalist><label>تاریخ دعوت</label>'+dsel('id',e.date)+'<label>مناسبت</label><input class="in" id="iocc" list="iol" value="'+esc(e.occ)+'" placeholder="مثلاً شهادت امام حسین (ع)"><datalist id="iol">'+occs.map(function(n){return'<option value="'+esc(n)+'">'}).join('')+'</datalist><button class="pri" data-a="send">'+(C.edit?'ذخیرهٔ ویرایش':'ثبت دعوت')+'</button></div>';return}
var q=C.q.trim(),a=D.filter(function(x){return(C.f==='all'||x.role===C.f)&&(!q||(x.name+' '+(x.occ||'')).indexOf(q)>-1)}).sort(function(a,b){return(b.date||'')<(a.date||'')?-1:(b.date||'')>(a.date||'')?1:0});
B.innerHTML='<input class="in" id="iq" placeholder="جستجوی نام یا مناسبت" value="'+esc(C.q)+'"><div class="sub">'+[['all','همه'],['m','مداحان'],['s','سخنرانان']].map(function(t){return'<button class="'+(C.f===t[0]?'on':'')+'" data-a="fl" data-v="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div><div class="ia" style="margin-bottom:10px"><button class="ib pr" data-a="txt">گزارش متنی</button></div><p class="hint">تعداد: '+fa(a.length)+'</p><div id="ilst">'+lst(a)+'</div>'}
function lst(a){return a.map(function(x){return'<div class="row"><div><b>'+esc(x.name)+'</b><small>'+fd(x.date)+(x.occ?' — '+esc(x.occ):'')+'</small>'+fbSum(x.id)+fbAll(x.id)+WHO(x)+'</div><div class="rt"><span class="chip '+(x.role==='m'?'p':'l')+'">'+RL[x.role]+' · '+fa(cnt(x))+' دعوت</span><div class="ia"><button class="ib" data-a="ed" data-id="'+x.id+'">ویرایش</button><button class="ib dg" data-a="del" data-id="'+x.id+'">'+(C.del===x.id?'تأیید حذف':'حذف')+'</button></div></div></div>'}).join('')||'<p class="hint">دعوتی ثبت نشده است.</p>'}
function text(){var t='گزارش دعوت مداحان و سخنرانان — هیئت معظم ابناءالحسن (علیهم السلام)\n\n';D.slice().sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}).forEach(function(x){t+=fd(x.date)+' | '+RL[x.role]+' | '+x.name+' | '+(x.occ||'—')+'\n'});
$('#ish').innerHTML='<div class="sh"><h3>گزارش متنی</h3><textarea id="ista" rows="12" readonly style="width:100%;font:inherit;background:var(--bg);color:var(--ink);border:1.5px solid var(--mute);border-radius:12px;padding:10px">'+esc(t)+'</textarea><button class="pri" data-a="cp">کپی</button>'+(navigator.share?'<button class="sec" data-a="shr" style="margin-top:8px">ارسال در پیام‌رسان</button>':'')+'<button class="ib" data-a="cx" style="margin-top:8px;width:100%;padding:10px">بستن</button></div>';$('#ish').classList.add('on')}
function fbSorted(a){return a.slice().sort(function(a,b){return(b.date||'')<(a.date||'')?-1:(b.date||'')>(a.date||'')?1:0})}
function fbSum(id){var r=F.filter(function(y){return y.inv===id&&y.r}),n=r.length;if(!n)return'';var av=r.reduce(function(s,y){return s+y.r},0)/n;return'<small>میانگین نظرها: '+fa(av.toFixed(1))+' از ۵ ('+fa(n)+' نفر)</small>'}
function fbMine(id){var me=(window.HU||'').trim();return F.filter(function(y){return y.inv===id&&y.by===me})[0]||{}}
function fbOthers(id){var me=(window.HU||'').trim();return F.filter(function(y){return y.inv===id&&y.by!==me&&(y.r||y.c)}).map(function(y){return'<div><small>'+esc(y.by||'ناشناس')+': '+(y.r?fa(y.r)+' از ۵':'')+(y.c?' — '+esc(y.c):'')+'</small></div>'}).join('')}
function fbLst(a){var q=C.q.trim();return fbSorted(a).filter(function(x){return!q||(x.name+' '+(x.occ||'')).indexOf(q)>-1}).map(function(x){var m=fbMine(x.id),r=m.r||0;return'<div class="row" style="display:block"><div><b>'+esc(x.name)+'</b><small>'+RL[x.role]+' · '+fd(x.date)+(x.occ?' — '+esc(x.occ):'')+'</small>'+fbSum(x.id)+'</div><div class="seg" style="margin:8px 0">'+[1,2,3,4,5].map(function(v){return'<button class="'+(r===v?'on':'')+'" data-a="rt" data-id="'+x.id+'" data-v="'+v+'">'+fa(v)+'</button>'}).join('')+'</div><input class="in" id="fc_'+x.id+'" placeholder="نظر من" value="'+esc(m.c||'')+'"><button class="ib pr" data-a="fs" data-id="'+x.id+'">ذخیرهٔ نظر من</button>'+(fbOthers(x.id)?'<div style="margin-top:6px">'+fbOthers(x.id)+'</div>':'')+'</div>'}).join('')||'<p class="hint">دعوتی برای نظر دادن ثبت نشده است.</p>'}
function fbAll(id){var a=F.filter(function(y){return y.inv===id&&(y.r||y.c)});return a.length?'<div style="margin-top:4px">'+a.map(function(y){return'<div><small>'+esc(y.by||'ناشناس')+': '+(y.r?fa(y.r)+' از ۵':'')+(y.c?' — '+esc(y.c):'')+'</small></div>'}).join('')+'</div>':''}
function fbView(){B.innerHTML='<input class="in" id="fq" placeholder="جستجوی نام یا مناسبت" value="'+esc(C.q)+'"><p class="hint">هر نفر نظر خودش را جداگانه ثبت می‌کند؛ نظر دیگران جایگزین نمی‌شود.</p><div id="ilst">'+fbLst(D)+'</div>'}
function setFb(id,r,c){var me=(window.HU||'').trim();if(!me)return gt('برای ثبت نظر باید وارد حساب شوید');if(!db)return gt('اتصال برقرار نیست؛ وارد حساب شوید');
 db.collection('inv_fb').doc(id+'__'+me.replace(/\//g,'-')).set({inv:id,by:me,r:r,c:c,at:Date.now()}).then(function(){gt('نظر ثبت شد')}).catch(function(){gt('ثبت نشد؛ سطح دسترسی را بررسی کنید')})}
function onClick(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,id=b.dataset.id;
if(a==='rt'){setFb(id,+b.dataset.v,fbMine(id).c||'')}
else if(a==='fs'){var cm=$('#fc_'+id);if(cm)setFb(id,fbMine(id).r||0,cm.value.trim())}
else if(a==='tab'){C.tab=b.dataset.t;C.edit=null;C.del=null;view()}
else if(a==='rl'){C.role=b.dataset.v;[].forEach.call($('#irs').children,function(x){x.classList.toggle('on',x===b)})}
else if(a==='fl'){C.f=b.dataset.v;view()}
else if(a==='ed'){C.edit=id;C.tab='add';view();B.scrollTop=0}
else if(a==='del'){if(C.del===id){C.del=null;db&&db.collection('inv').doc(id).delete().catch(function(){gt('حذف نشد')})}else{C.del=id;view()}}
else if(a==='txt')text();
else if(a==='cx')$('#ish').classList.remove('on');
else if(a==='cp'){var t=$('#ista');t.select();try{navigator.clipboard.writeText(t.value).then(function(){gt('کپی شد')},function(){document.execCommand('copy');gt('کپی شد')})}catch(x){try{document.execCommand('copy');gt('کپی شد')}catch(y){}}}
else if(a==='shr')navigator.share({text:$('#ista').value}).catch(function(){});
else if(a==='send'){var nm=$('#inm').value.trim();if(!nm)return gt('نام و نام خانوادگی را وارد کنید');if(!db)return gt('اتصال برقرار نیست؛ وارد حساب شوید');
var o={role:C.role,name:nm,date:dget('id'),occ:$('#iocc').value.trim()},ed=C.edit,p=ed?db.collection('inv').doc(ed).update(o):db.collection('inv').add(Object.assign(o,{at:Date.now()}));
p.then(function(){gt(ed?'ویرایش شد':'دعوت ثبت شد');C.edit=null;if(ed)C.tab='list';view()}).catch(function(){gt('ثبت نشد؛ سطح دسترسی را بررسی کنید')})}}
B.addEventListener('click',onClick);$('#itabs').addEventListener('click',onClick);$('#ish').addEventListener('click',function(e){if(e.target===$('#ish'))$('#ish').classList.remove('on');else onClick(e)});
B.addEventListener('input',function(e){if(e.target.id==='fq'){C.q=e.target.value;$('#ilst').innerHTML=fbLst(D);return}if(e.target.id==='iq'){C.q=e.target.value;var q=C.q.trim();$('#ilst').innerHTML=lst(D.filter(function(x){return(C.f==='all'||x.role===C.f)&&(!q||(x.name+' '+(x.occ||'')).indexOf(q)>-1)}).sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}))}});
async function connect(){try{var d=window.claude&&await claude.use('db');if(!d){B.insertAdjacentHTML('afterbegin','<p class="warn">برای مشاهده و ثبت باید با حساب خود وارد شوید.</p>');return}db=d;
d.collection('inv').onSnapshot(function(q){D=q.docs.map(function(x){return Object.assign({id:x.id},x.data())});if(C.tab!=='add')view()});d.collection('inv_fb').onSnapshot(function(q){F=q.docs.map(function(x){return Object.assign({id:x.id},x.data())});if(C.tab!=='add')view()})}catch(e){}}
window.openIv=function(){show('iv');if(!C.init){C.init=1;connect()}view()};
$('#iback').onclick=function(){show('home')};
})();
