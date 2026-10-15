'use strict';
const statusEl = document.getElementById('status');
const canvas = document.getElementById('game');
const fileInput = document.getElementById('file');
const customMode = new URLSearchParams(location.search).has('custom');
let fs, main, started = false;
let watchdog;
fileInput.disabled = true;
function status(text) { statusEl.textContent = text; }
function fail(error) {
  clearTimeout(watchdog);
  console.error(error);
  status('Неуспешно зареждане. Провери интернет достъпа до js-dos.com и наличието на assets/doom_dos.zip в сайта. Натисни „Рестарт“ за нов опит.');
}
async function startGame(url) {
  if (started || !fs) return;
  started = true;
  fileInput.disabled = true;
  status('Разархивиране и стартиране на DOOM…');
  try {
    await fs.extract(url);
    clearTimeout(watchdog);
    const game = main(['-c', 'cycles max', '-c', 'doom.exe -warp 1 1 -skill 3']);
    if (game && typeof game.catch === 'function') game.catch(fail);
    status('Изпратена е команда за старт. Кликни в играта за управление и звук. Стрелки: движение · Ctrl: стрелба · Space: врати.');
    canvas.focus();
  } catch (error) { fail(error); }
}
document.getElementById('retry').onclick = () => location.reload();
document.getElementById('focus').onclick = () => canvas.focus();
document.getElementById('full').onclick = async () => {
  try { await document.getElementById('screen').requestFullscreen(); canvas.focus(); }
  catch (error) { status('Браузърът не разреши цял екран. Кликни директно в играта.'); }
};
fileInput.onchange = async event => {
  const file = event.target.files[0];
  if (!file || started || !fs) return;
  const url = URL.createObjectURL(file);
  try { await startGame(url); } finally { URL.revokeObjectURL(url); }
};
const script = document.createElement('script');
script.src = 'https://js-dos.com/6.22/current/js-dos.js';
script.onerror = fail;
watchdog = setTimeout(() => status('Зареждането се бави. Провери достъпа до js-dos.com. Натисни „Рестарт“ за нов опит.'), 60000);
script.onload = () => {
  try {
    Dos(canvas, { wdosboxUrl: 'https://js-dos.com/6.22/current/wdosbox.js' }).ready((dosFs, dosMain) => {
      clearTimeout(watchdog);
      fs = dosFs;
      main = dosMain;
      if (customMode) {
        fileInput.disabled = false;
        status('Избери собствен DOS ZIP от секцията по-долу.');
      } else {
        startGame('assets/doom_dos.zip');
      }
    });
  } catch (error) { fail(error); }
};
document.head.appendChild(script);
