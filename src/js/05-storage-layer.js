(function(){
var L={};
function load(c){try{return JSON.parse(localStorage.getItem('hdb_'+c)||'{}')}catch(e){return{}}}
function save(c,m){localStorage.setItem('hdb_'+c,JSON.stringify(m));notify(c)}
function sd(id,d){return{id:id,exists:true,data:function(){return d},metadata:{hasPendingWrites:true}}}
function qs(c){var m=load(c);return{docs:Object.keys(m).map(function(id){return sd(id,m[id])}),docChanges:function(){return[]},metadata:{fromCache:false}}}
function notify(c){(L[c]||[]).forEach(function(f){setTimeout(function(){f(qs(c))},0)})}
function tomb(c,id){try{var t=JSON.parse(localStorage.getItem('hdb__del')||'{}');t[c+'/'+id]=Date.now();localStorage.setItem('hdb__del',JSON.stringify(t))}catch(e){}}
function rid(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}
var DB={collection:function(c){return{
add:function(d){try{var m=load(c),id=rid();m[id]=Object.assign({},d,{_u:Date.now(),_by:window.HU||''});save(c,m);return Promise.resolve({id:id})}catch(e){return Promise.reject(e)}},
doc:function(id){return{
get:function(){var m=load(c);return Promise.resolve(m[id]?sd(id,m[id]):{exists:false,data:function(){}})},
set:function(d){try{var m=load(c),o=m[id],u=window.HU||'';m[id]=Object.assign({},d,{_u:Date.now(),_by:(o&&o._by)||u});if(o&&u&&u!==m[id]._by)m[id]._ub=u;save(c,m);return Promise.resolve()}catch(e){return Promise.reject(e)}},
update:function(d){try{var m=load(c);if(!m[id])return Promise.reject(new Error('missing'));var u2=window.HU||'';m[id]=Object.assign({},m[id],d,{_u:Date.now()});if(u2&&u2!==m[id]._by)m[id]._ub=u2;else delete m[id]._ub;save(c,m);return Promise.resolve()}catch(e){return Promise.reject(e)}},
delete:function(){try{var m=load(c);delete m[id];tomb(c,id);save(c,m);return Promise.resolve()}catch(e){return Promise.reject(e)}}}},
onSnapshot:function(f){(L[c]=L[c]||[]).push(f);setTimeout(function(){f(qs(c))},0);return function(){}}}}};
window.WHO=function(x){if(!x||!(x._by||x._ub))return'';var t=x._by?'ثبت: '+x._by:'';if(x._ub&&x._ub!==x._by)t+=(t?' · ':'')+'ویرایش: '+x._ub;return'<small class="by">'+String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})+'</small>'};
window.claude={use:function(){return Promise.resolve(DB)}};
})();
