
/* موتور واحد محاسبهٔ مالی: هم صفحهٔ مالی و هم داشبورد از همین استفاده می‌کنند */
window.HFC=function(d,o){o=o||{};var who=o.who||function(){return''},
A=function(v){v=+v;return isFinite(v)?v:0},
fa=function(x){return String(x).replace(/\d/g,function(c){return'۰۱۲۳۴۵۶۷۸۹'[c]})},
sum=function(a,f){return a.reduce(function(t,x){return t+f(x)},0)},
r={led:[],bad:0,orph:0,orphAmt:0},L=r.led,
nmf=function(P,id){var p=(d[P+'_people']||[]).filter(function(x){return x.id===id})[0];return p?p.name:'—'};
function chk(v){var n=+v;if(!isFinite(n)||n<=0)r.bad++}
r.ci=r.co=0;
(d.cash||[]).forEach(function(x){var a=A(x.amount);chk(x.amount);if(x.type==='in')r.ci+=a;else r.co+=a;L.push({d:x.date,s:'ثبت دستی',t:x.title,a:x.type==='in'?a:-a,tab:'cash',id:x.id,w:who(x)})});
['ac','kh'].forEach(function(P){var s=P==='ac'?'آکادمی':'خدام',ids={};(d[P+'_people']||[]).forEach(function(p){ids[p.id]=1});r[P+'p']=0;r[P+'f']=0;
(d[P+'_tx']||[]).forEach(function(x){var a=A(x.amount);chk(x.amount);if(!ids[x.pid]){r.orph++;r.orphAmt+=a}
if(x.kind==='pay'){r[P+'p']+=a;L.push({d:x.date,s:s,t:'پرداخت — '+nmf(P,x.pid),a:a,tab:P,w:who(x)})}
else{r[P+'f']+=a;L.push({d:x.date,s:s,t:'شهریه/بدهی — '+nmf(P,x.pid),a:0,f:a,tab:P,w:who(x)})}})});
var g={};r.st=0;(d.st||[]).forEach(function(x){var v=Math.round(A(x.qty)*A(x.price));if(!(A(x.qty)>0)||!(A(x.price)>0))r.bad++;r.st+=v;var k=x.station+'|'+x.time;(g[k]=g[k]||{station:x.station,time:x.time,tot:0}).tot+=v});
Object.keys(g).forEach(function(k){if(g[k].tot>0)L.push({d:g[k].time,s:'ایستگاه صلواتی',t:'ایستگاه: '+g[k].station,a:-g[k].tot,tab:'st',w:''})});
r.hp=r.pp=r.hu=r.pu=r.dci=r.dco=0;
(d.debts||[]).forEach(function(x){var a=A(x.amount),hey=x.dir==='hey';chk(x.amount);
if(x.cash==='1'){if(hey){r.dci+=a;L.push({d:x.date,s:'بدهی هیئت',t:x.title+' — '+x.person+' (دریافت وجه هنگام ثبت)',a:a,tab:'db',w:who(x)})}else{r.dco+=a;L.push({d:x.date,s:'بدهی اشخاص',t:x.title+' — '+x.person+' (پرداخت وجه به شخص)',a:-a,tab:'db',w:who(x)})}}
if(x.paid==='1'){if(hey)r.hp+=a;else r.pp+=a;L.push({d:x.pdate||x.date,s:hey?'بدهی هیئت':'بدهی اشخاص',t:x.title+' — '+x.person+(hey?' (پرداخت هیئت)':' (دریافت)'),a:hey?-a:a,tab:'db',w:who(x)})}
else if(hey)r.hu+=a;else r.pu+=a});
r.lp=0;r.lr=0;
(d.loans||[]).forEach(function(l){var p=l.pays||{};
if(l.rcv==='1'&&A(l.principal)>0){r.lr+=A(l.principal);L.push({d:l.rdate||l.start,s:'وام (دریافت اصل)',t:l.title,a:A(l.principal),tab:'ln',w:who(l)})}
Object.keys(p).forEach(function(k){var a=A(p[k].a);chk(p[k].a);r.lp+=a;L.push({d:p[k].d,s:'وام و اقساط',t:l.title+' — قسط '+fa(k),a:-a,tab:'ln',w:who({_by:p[k].by})})})});
r.inn=r.ci+r.acp+r.khp+r.pp+r.dci+r.lr;r.out=r.co+r.hp+r.lp+r.st+r.dco;r.bal=r.inn-r.out;
L.sort(function(a,b){var x=a.d||'',y=b.d||'';return y<x?-1:y>x?1:0});return r};
