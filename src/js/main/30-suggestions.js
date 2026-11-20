(function(){
var $=function(s){return document.querySelector(s)},B=$('#sbody');
var NAMES=['صادق جمالی فرد','حسین وفا','محمد عسگری','اباصلت برجی','سید محمد علی حسین زاده علوی'];
var D=[],db=null,S={type:'p',f:'all',del:null,edit:null,first:1,init:0,prev:0};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fa(s){return String(s).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})}
function pad(n){return n<10?'0'+n:''+n}
function tk(){var o={};new Intl.DateTimeFormat('en-u-ca-persian-nu-latn',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).forEach(function(x){o[x.type]=x.value});return o.year+'-'+pad(+o.month)+'-'+pad(+o.day)}
function fd(k){return fa(String(k||'').replace(/-/g,'/'))}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k)||'';localStorage.setItem(k,v)}catch(e){return''}}
function gt(t){var e=$('#gtoast');e.textContent=t;e.classList.add('on');clearTimeout(gt.t);gt.t=setTimeout(function(){e.classList.remove('on')},4000)}
function mx(){return D.reduce(function(m,x){return Math.max(m,x.at||0)},0)}
function badge(){var n=D.filter(function(x){return(x.at||0)>(+ls('sg_seen')||0)}).length,b=$('#sgb');if(!b)return;b.textContent=fa(n);b.style.display=n&&!$('#sg').classList.contains('on')?'grid':'none'}
function form(){B.innerHTML='<div class="card"><h3>ثبت انتقاد یا پیشنهاد</h3><div class="seg" id="sty"><button class="on" data-a="ty" data-v="p">پیشنهاد</button><button data-a="ty" data-v="c">انتقاد</button></div><label>ثبت‌کننده</label><select id="sby"><option value="">انتخاب نام…</option>'+(window.HU?[window.HU]:NAMES).map(function(n){return'<option'+(n===ls('sg_me')?' selected':'')+'>'+n+'</option>'}).join('')+'</select><label>متن</label><textarea id="stx" rows="5" placeholder="نظر خود را بنویسید…"></textarea><button class="pri" id="ssend" data-a="send">ثبت</button><p class="hint">با ثبت، همهٔ کاربرانی که برنامه را باز دارند اعلان می‌بینند و برای بقیه نشانهٔ «جدید» روی این بخش می‌ماند.</p></div><div id="sflt"></div><div id="slist"></div>'}
function list(){var L=$('#slist');if(!L)return;$('#sflt').innerHTML='<div class="sub">'+[['all','همه'],['p','پیشنهادها'],['c','انتقادها']].map(function(t){return'<button class="'+(S.f===t[0]?'on':'')+'" data-a="flt" data-v="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div>';
var a=D.filter(function(x){return S.f==='all'||x.type===S.f}).sort(function(a,b){return(b.at||0)-(a.at||0)});
L.innerHTML=a.map(function(x){var c=x.type==='c';return'<div class="card"><div class="rw"><div><span class="chip '+(c?'a':'p')+'">'+(c?'انتقاد':'پیشنهاد')+'</span>'+((x.at||0)>S.prev?'<span class="chip l">جدید</span>':'')+'</div><small class="hint">'+fd(x.date)+'</small></div><b>'+esc(x.by)+'</b><p class="pre">'+esc(x.text)+'</p>'+WHO(x)+'<div class="ia"><button class="ib pr" data-a="shr" data-id="'+x.id+'">ارسال</button><button class="ib" data-a="ed" data-id="'+x.id+'">ویرایش</button><button class="ib dg" data-a="del" data-id="'+x.id+'">'+(S.del===x.id?'تأیید حذف':'حذف')+'</button></div></div>'}).join('')||'<p class="hint">هنوز موردی ثبت نشده است.</p>'}
function sel(id){return D.filter(function(x){return x.id===id})[0]}
B.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,id=b.dataset.id;
if(a==='ty'){S.type=b.dataset.v;[].forEach.call($('#sty').children,function(x){x.classList.toggle('on',x===b)})}
else if(a==='flt'){S.f=b.dataset.v;list()}
else if(a==='send'){var by=$('#sby').value,tx=$('#stx').value.trim();
if(!by)return gt('ابتدا نام خود را از فهرست انتخاب کنید');if(tx.length<3)return gt('متن را بنویسید');if(!db)return gt('اتصال برقرار نیست؛ وارد حساب شوید');
ls('sg_me',by);var o={by:by,type:S.type,text:tx},ed=S.edit,p=ed?db.collection('sugg').doc(ed).update(o):db.collection('sugg').add(Object.assign(o,{date:tk(),at:Date.now()}));
p.then(function(){gt(ed?'ویرایش شد':'ثبت شد؛ برای همه اعلان ارسال شد');S.edit=null;$('#stx').value='';$('#ssend').textContent='ثبت'}).catch(function(){gt('ثبت نشد؛ سطح دسترسی خود را بررسی کنید')})}
else if(a==='ed'){var x=sel(id);if(!x)return;S.edit=id;S.type=x.type;$('#sby').value=x.by;$('#stx').value=x.text;$('#ssend').textContent='ذخیرهٔ ویرایش';[].forEach.call($('#sty').children,function(y){y.classList.toggle('on',y.dataset.v===x.type)});B.scrollTop=0}
else if(a==='del'){if(S.del===id){S.del=null;db&&db.collection('sugg').doc(id).delete().catch(function(){gt('حذف نشد')})}else{S.del=id;list()}}
else if(a==='shr'){var y=sel(id),t=(y.type==='c'?'انتقاد':'پیشنهاد')+' از '+y.by+' ('+fd(y.date)+'):\n'+y.text+'\n— هیئت معظم ابناءالحسن (علیهم السلام)';
if(navigator.share)navigator.share({text:t}).catch(function(){});else{try{navigator.clipboard.writeText(t).then(function(){gt('متن کپی شد')})}catch(z){gt('امکان کپی نیست')}}}});
async function connect(){if(S.init)return;S.init=1;try{var d=window.claude&&await claude.use('db');if(!d)return;db=d;
d.collection('sugg').onSnapshot(function(q){
if(!S.first)q.docChanges().forEach(function(c){if(c.type==='added'&&!c.doc.metadata.hasPendingWrites){var x=c.doc.data();gt((x.type==='c'?'انتقاد':'پیشنهاد')+' جدید از '+x.by)}});
if(!q.metadata.fromCache)S.first=0;
D=q.docs.map(function(x){return Object.assign({id:x.id},x.data())});if($('#sg').classList.contains('on'))ls('sg_seen',mx());list();badge()})}catch(e){}}
window.openSg=function(){S.prev=+ls('sg_seen')||0;show('sg');if(!B.firstChild)form();ls('sg_seen',mx());badge();list();connect()};
$('#sback').onclick=function(){show('home');badge()};
var c=[].filter.call(document.querySelectorAll('#grid .app'),function(a){return a.textContent.indexOf('انتقاد')>-1})[0];if(c)c.querySelector('.circle').insertAdjacentHTML('beforeend','<i class="bdg" id="sgb"></i>');
setTimeout(connect,1500);
})();
