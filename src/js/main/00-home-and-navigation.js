
var items=[
{t:"داشبورد",i:'<svg viewBox="0 0 48 48"><rect x="7" y="7" width="15" height="15" rx="3"/><rect x="26" y="7" width="15" height="9" rx="3"/><rect x="26" y="20" width="15" height="21" rx="3"/><rect class="a" x="7" y="26" width="15" height="15" rx="3"/></svg>'},
{t:"اعضا",i:'<svg viewBox="0 0 48 48"><circle cx="18" cy="17" r="6"/><path d="M6 38c0-7 5-11 12-11s12 4 12 11"/><circle class="a" cx="34" cy="19" r="5"/><path class="a" d="M34 28c5 0 8 3 8 8"/></svg>'},
{t:"لیست اعضا",i:'<svg viewBox="0 0 48 48"><rect x="9" y="7" width="30" height="34" rx="5"/><circle cx="16" cy="17" r="1.6"/><circle cx="16" cy="25" r="1.6"/><circle cx="16" cy="33" r="1.6"/><path class="a" d="M22 17h12M22 25h12M22 33h8"/></svg>'},
{t:"حضور و غیاب",i:'<svg viewBox="0 0 48 48"><rect x="9" y="8" width="30" height="34" rx="5"/><path class="a" d="M16 20l3 3 6-6M16 33h16"/></svg>'},
{t:"امور مالی",i:'<svg viewBox="0 0 48 48"><rect x="6" y="12" width="36" height="26" rx="6"/><path class="a" d="M6 20h36"/><circle cx="34" cy="29" r="2.6"/></svg>'},
{t:"آکادمی حضور و غیاب",i:'<svg viewBox="0 0 48 48"><circle cx="20" cy="17" r="5.5"/><path d="M10 37c0-6 4.5-10 10-10s10 4 10 10"/><path class="a" d="M33 14l3 3 6-6M33 26h8"/></svg>'},
{t:"دفترچه تلفن آکادمی",i:'<svg viewBox="0 0 48 48"><rect x="12" y="6" width="26" height="36" rx="5"/><circle cx="25" cy="19" r="5"/><path d="M17 34c0-5 4-8 8-8s8 3 8 8"/><path class="a" d="M7 14h5M7 24h5M7 34h5"/></svg>'},
{t:"اصلاحیه",i:'<svg viewBox="0 0 48 48"><path d="M10 38l2-9L32 9l7 7-20 20z"/><path class="a" d="M28 13l7 7M10 38h12"/></svg>'},
{t:"موارد انضباطی",i:'<svg viewBox="0 0 48 48"><path d="M24 6l15 6v11c0 10-7 16-15 19C16 39 9 33 9 23V12z"/><path class="a" d="M24 16v10M24 31v1"/></svg>'},
{t:"جوایز",i:'<svg viewBox="0 0 48 48"><path d="M15 8h18v10a9 9 0 0 1-18 0z"/><path class="a" d="M15 12H8c0 6 3 9 8 9M33 12h7c0 6-3 9-8 9M24 27v8M17 40h14"/></svg>'},
{t:"انتقاد و پیشنهاد",i:'<svg viewBox="0 0 48 48"><path d="M8 11h32v21H22l-8 7v-7H8z"/><path class="a" d="M16 19h16M16 25h10"/></svg>'},
{t:"ثبت دعوت مداحان و سخنرانان",i:'<svg viewBox="0 0 48 48"><rect x="18" y="6" width="12" height="22" rx="6"/><path d="M12 24a12 12 0 0 0 24 0"/><path class="a" d="M24 36v6M17 42h14"/></svg>'},
{t:"پشتیبان‌گیری",i:'<svg viewBox="0 0 48 48"><path d="M14 33a8 8 0 0 1 1-16 10 10 0 0 1 19 3 6.5 6.5 0 0 1-1 13z"/><path class="a" d="M24 22v12M19 29l5 5 5-5"/></svg>'}
];
var g=document.getElementById('grid');
items.forEach(function(x,n){
  var b=document.createElement('button');b.className='app';b.style.animationDelay=(n*0.09)+'s';
  b.innerHTML='<span class="circle">'+x.i+'</span><b>'+x.t+'</b>';
  b.onclick=function(){open(x)};g.appendChild(b);
});
function show(id){['splash','home','section','att','fin','sg','dc','iv','lgs'].forEach(function(s){document.getElementById(s).classList.toggle('on',s===id)})}
function open(x){if(x.t.indexOf('دعوت')>-1){openIv();return}if(x.t==='موارد انضباطی'){openDc();return}if(x.t==='انتقاد و پیشنهاد'){openSg();return}if(x.t==='امور مالی'){openFin();return}if(x.t==='حضور و غیاب'){openAtt();return}if(x.t==='آکادمی حضور و غیاب'){openAcAtt();return}if(x.t==='گزارش'){openRpt();return}document.getElementById('stitle').textContent=x.t;document.getElementById('sicon').innerHTML=x.i;show('section')}
document.getElementById('back').onclick=function(){show('home')};
document.getElementById('bd').src=document.getElementById('lg').src;
var sp=document.getElementById('splash'),done=false;
function enter(){if(done)return;done=true;gate();sp.classList.add('on','out');setTimeout(function(){sp.classList.remove('on','out')},800)}
sp.onclick=enter;setTimeout(enter,1500);
