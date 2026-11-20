
/* ===== کشیدن صفحه به چپ و راست برای جابه‌جایی بین بخش‌های فرعی (افزودنی) ===== */
(function(){
var sx=0,sy=0,lx=0,ly=0,st=0,ok=false;
var css=document.createElement('style');css.textContent='#abody,#fbody,#sbody,#dbody,#ibody,.bd{overflow-x:hidden}';document.head.appendChild(css);
function page(e){return e.classList&&(e.classList.contains('screen')||e.classList.contains('bd')||e.id==='abody'||e.id==='fbody'||e.id==='sbody'||e.id==='dbody'||e.id==='ibody'||e.id==='home')}
function blocked(t){for(var e=t;e&&e!==document.body;e=e.parentElement){var n=e.tagName;if(n==='INPUT'||n==='TEXTAREA'||n==='SELECT'||e.isContentEditable)return true;if(e.classList&&(e.classList.contains('tabs')||e.classList.contains('cur')))return true;
if(!page(e)&&e.scrollWidth>e.clientWidth+4){var o=getComputedStyle(e).overflowX;if(o==='auto'||o==='scroll')return true}}return false}
function overlay(){return!!document.querySelector('#thp.on,#bk.on,#sheet.on,#dsh.on,#ish.on,#qbkp,#qrst,#qexit')}
function go(dx,dy){if(!ok)return;ok=false;
if(Date.now()-st>900||Math.abs(dx)<50||Math.abs(dx)<Math.abs(dy)*1.2)return;
var scr=document.querySelector('.screen.on');if(!scr)return;var tabs=scr.querySelector('.tabs');if(!tabs)return;
var bs=[].slice.call(tabs.querySelectorAll('button'));if(bs.length<2)return;
if(scr.id==='att'&&bs.some(function(b){return b.dataset&&b.dataset.t==='book'}))bs=bs.filter(function(b){return b.dataset.t!=='add'});
var i=-1;bs.forEach(function(b,k){if(b.classList.contains('on'))i=k});if(i<0)return;
var j=dx>0?i+1:i-1;if(j<0||j>=bs.length)return;
bs[j].click();
setTimeout(function(){var a=tabs.querySelector('button.on');if(a){tabs.scrollLeft+=(a.getBoundingClientRect().left+a.offsetWidth/2)-(tabs.getBoundingClientRect().left+tabs.clientWidth/2)}},30)}
document.addEventListener('touchstart',function(e){ok=false;if(e.touches.length!==1||overlay()||blocked(e.target))return;var t=e.touches[0];sx=lx=t.clientX;sy=ly=t.clientY;st=Date.now();ok=true},{passive:true});
document.addEventListener('touchmove',function(e){if(!ok)return;var t=e.touches[0];lx=t.clientX;ly=t.clientY},{passive:true});
document.addEventListener('touchend',function(e){var t=e.changedTouches[0];go(t.clientX-sx,t.clientY-sy)},{passive:true});
document.addEventListener('touchcancel',function(){go(lx-sx,ly-sy)},{passive:true});
})();
