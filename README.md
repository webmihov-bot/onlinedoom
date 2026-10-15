# DOOM — WebAssembly за браузър и Netlify

Оригиналният Linux DOOM 1.10 от **id Software**, адаптиран и компилиран с **Emscripten 3.1.69** до WebAssembly. Игровите данни са от предоставения shareware пакет **DOOM 1.9**. Първото ниво започва автоматично след зареждане на страницата.

Всички файлове за игра са включени в `dist/`: HTML, JavaScript, `doom.wasm` и `doom.data`. Не е необходим външен емулатор, CDN, backend или API ключ. Звукът изисква клик според правилата на браузъра.

## Най-лесно: ZIP за Netlify Drop

1. Изтегли [netlify-doom-wasm.zip](https://github.com/webmihov-bot/onlinedoom/raw/refs/heads/main/netlify-doom-wasm.zip).
2. Разархивирай го. `index.html` трябва да е непосредствено в получената папка.
3. Отвори https://app.netlify.com/drop и плъзни тази папка.
4. Отвори получения HTTPS адрес. Играта стартира при зареждане.

В този ZIP са само файловете за публикуване. Изходният код е отделно в `source/doom-source.zip`.

## Netlify чрез GitHub

1. В https://app.netlify.com/ избери **Add new project → Import an existing project → GitHub**.
2. Избери **webmihov-bot/onlinedoom**, branch **main**.
3. Остави **Build command** празно.
4. **Publish directory**: `dist` — вече е зададено в `netlify.toml`.
5. Натисни **Deploy**.

Готовата компилация е включена в GitHub; Netlify няма нужда от инсталиране на Emscripten или повторна компилация. При изтегляне чрез **Code → Download ZIP**, за ръчно качване използвай папката `dist`.

## Управление

| Клавиш | Действие |
| --- | --- |
| Стрелки | Напред/назад и завъртане |
| W / S | Напред / назад |
| A / D | Странично движение |
| Ctrl | Стрелба |
| Space | Врати и превключватели |
| Shift | Бягане |
| 1–7 | Избор на оръжие |
| Esc | Меню; освобождаване на мишката |
| Tab | Карта |
| + / − | Размер на игровия изглед |

Натисни **Играй / включи звука**, за да фокусираш играта. Бутонът за мишка заключва курсора по желание; ляв бутон стреля. За fullscreen използвай **Цял екран**. Предназначено за компютър с клавиатура.

## Ограничения

- Има PCM звукови ефекти през Web Audio. MUS музиката още не е реализирана.
- Само single-player; мрежова игра не е включена.
- Записите са във временната памет на страницата и се губят при презареждане.
- Пакетът включва shareware първия епизод; не включва пълната платена игра.

## Локална проверка

Изпълни от основната папка:

```sh
python3 -m http.server 8000 --directory dist
```

Отвори http://localhost:8000/. Не отваряй `index.html` чрез `file://`, защото WebAssembly и data пакетът се зареждат чрез HTTP.

## Инсталиране на Emscripten и повторна компилация

Официалният инструмент за инсталация е [emsdk](https://github.com/emscripten-core/emsdk). Самото [emscripten](https://github.com/emscripten-core/emscripten) хранилище не включва всички бинарни зависимости.

```sh
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install 3.1.69
./emsdk activate 3.1.69
source ./emsdk_env.sh
cd ..
git clone https://github.com/webmihov-bot/onlinedoom.git
cd onlinedoom
python3 -m zipfile -e source/doom-source.zip .
python3 -c "import zipfile; z=zipfile.ZipFile('assets/doom_dos.zip'); open('doom1.wad','wb').write(z.read('DOOM1.WAD'))"
python3 build.py
```

При Windows използвай `emsdk.bat` и `emsdk_env.bat` вместо shell скриптовете. За Debian/Ubuntu може да се използва и пакетът `emscripten`; проверената тук версия е Debian 3.1.69.

`source/doom-source.zip` съдържа целия съответстващ C код, header файловете, оригиналния Makefile и браузърния платформен слой `src/i_web.c`. `build.py` е включен и в основната папка, и в архива.

Основните адаптации са: canvas графика и клавиатура/мишка, Web Audio ефекти, single-player platform stubs, Asyncify yield в игровия цикъл, съвместим boolean тип и имена на функции, корекция на индексирането на входните събития. Оригиналният игрови engine остава на C.

## Извършена проверка

- Emscripten: C smoke test → WebAssembly → успешно изпълнение.
- Успешна компилация на DOOM; валиден WebAssembly модул.
- Chromium 154: автоматичен старт на E1M1, движение, завъртане, стрелба (намаляване на амунициите), Esc меню и активен Web Audio контекст след клик.
- Без JavaScript runtime грешки при тази проверка. Всички игрови ресурси са локални.

Компилацията запазва някои предупреждения от оригиналния C код. Проверката не обхваща всички нива и браузъри.

## Лицензи и произход

Оригинален engine: https://github.com/id-software/DOOM — **GPL-2.0**, виж `LICENSE`. Браузърните адаптации се предоставят под същия лиценз. Изходният код се разпространява в `source/doom-source.zip`.

DOOM и игровите данни © id Software / ZeniMax. Лицензът на engine кода не променя правата върху игровите данни. Оригиналният предоставен DOS shareware архив е запазен непроменен в `assets/doom_dos.zip`; документацията му е включена и в `dist/SHAREWARE-README.TXT`. Това е неофициален порт.
