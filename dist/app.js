'use strict';
const canvas = document.getElementById('game');
const statusEl = document.getElementById('status');
let game;
let finished = false;
function status(text) { statusEl.textContent = text; }
function fail(error) {
  finished = true;
  console.error(error);
  status('Играта не успя да стартира. Провери дали doom.js, doom.wasm и doom.data са качени заедно с index.html, след което натисни „Рестарт“.');
}
async function focusGame() {
  if (game && game.audio && game.audio.state === 'suspended') {
    try { await game.audio.resume(); } catch (error) { console.warn(error); }
  }
  canvas.focus();
}
document.getElementById('focus').onclick = focusGame;
canvas.addEventListener('click', focusGame);
document.getElementById('restart').onclick = () => location.reload();
document.getElementById('fullscreen').onclick = async () => {
  try { await document.getElementById('screen').requestFullscreen(); canvas.focus(); }
  catch (error) { status('Цял екран не е разрешен от браузъра. Можеш да играеш в прозореца.'); }
};
document.getElementById('mouse').onclick = async () => {
  try { canvas.focus(); await canvas.requestPointerLock(); }
  catch (error) { status('Управлението с мишка не е достъпно. Използвай клавиатурата.'); }
};
if (typeof createDoom !== 'function') {
  fail(new Error('doom.js failed to load'));
} else {
  createDoom({
    canvas,
    arguments: ['-warp', '1', '1', '-skill', '3'],
    print: text => console.log(text),
    printErr: text => console.warn(text),
    setStatus: text => { if (!finished && text) status('Зареждане: ' + text); },
    onAbort: fail,
    onGameReady: () => { finished = true; status('DOOM е стартиран. Кликни „Играй“ за управление и звук.'); },
    onExit: code => { finished = true; status('Играта приключи (код ' + code + '). Натисни „Рестарт“, за да започнеш отново.'); }
  }).then(instance => { game = instance; }).catch(fail);
}
