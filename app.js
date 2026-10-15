'use strict';
const statusEl=document.getElementById('status');
const canvas=document.getElementById('game');
const params=new URLSearchParams(location.search);
const bundle='https://js-dos.com/cdn/upload/DOOM-@evilution.zip';
let runtime;
function status(s){statusEl.textContent=s;}
function fail(e){console.error(e);status('Неуспешно зареждане. Провери интернет връзката и достъпа до js-dos.com. Опитай „Рестарт“ или зареди собствен DOS ZIP.');}
async function boot(url){
 try{
 status('Изтегляне и стартиране на DOOM…');
 runtime=await Dos(canvas,{wdosboxUrl:'https://js-dos.com/6.22/current/wdosbox.js',cycles:1000});
 await runtime.fs.extract(url);
 await runtime.main(['-c','doom.exe -warp 1 1 -skill 3']);
 status('Стрелки за движение · Ctrl за стрелба · Space за врати. Кликни в играта за управление и звук.');canvas.focus();
 }catch(e){fail(e);}
}
document.getElementById('retry').onclick=()=>location.reload();
document.getElementById('full').onclick=async()=>{try{await document.getElementById('screen').requestFullscreen();canvas.focus();}catch(e){status('Браузърът не разреши цял екран. Кликни директно в играта.');}};
document.getElementById('focus').onclick=()=>{canvas.focus();canvas.click();};
document.getElementById('file').onchange=e=>{const file=e.target.files[0];if(!file)return;const u=URL.createObjectURL(file);sessionStorage.setItem('customDoomName',file.name);if(runtime){status('За собствен ZIP първо отвори страницата с ?custom=1, след което избери файла.');URL.revokeObjectURL(u);return;}boot(u).finally(()=>URL.revokeObjectURL(u));};
const script=document.createElement('script');script.src='https://js-dos.com/6.22/current/js-dos.js';script.onerror=fail;script.onload=()=>{if(params.has('custom'))status('Избери собствен DOS ZIP от секцията по-долу.');else boot(bundle);};document.head.appendChild(script);
