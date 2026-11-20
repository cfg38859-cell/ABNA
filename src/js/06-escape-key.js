
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;var t=e.target;if(t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)&&t.type!=='checkbox'&&t.type!=='range'&&document.querySelector('#sheet.on,#dsh.on,#ish.on,#bk.on,#thp.on,#qbkp')==null)return;
var d=document.querySelector('#qbkp,#thp.on,#bk.on,#sheet.on,#dsh.on,#ish.on');if(d){d.click();return}
var b=document.querySelector('.screen.on .back');if(b)b.click()});
