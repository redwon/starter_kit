# Старт проекта с использованием SASS и таск-раннером.


`src` - исходники. Компилируется файл `/src/sass/style.scss`.

`build` - собранный проект.

Подключаемые стили ложить в папку `/src/_css_lib/`.

Подключаемые скрипты в папку `/src/js/js_concat/`.

Свои скрипты писать в файл `/src/js/script.js`.

Перед заливкой на продакшн - нужно выполнить команду `grunt build`.

[Для запуска проекта, нужно установить Node.js](https://nodejs.org).


### Как пользоваться

1. Скачать репозиторий и поместить его файлы в свой. Или склонировать репозиторий и начать в нем работать.
2. В консоли «зайти» в папку проекта и вызвать команду `npm i`. Дождаться окончания установки зависимостей.
3. Для старта работы с проектом, вызвать команду `grunt` (если будет ругаться на отсутствие гранта, вызовайте команду `npm install -g grunt-cli` и дождитесь его установки. Если это не помогло, обновите Node.js до версии не ниже v4.5.0).
4. Для завершения работы над проектом нажать Ctrl+C.

В Gruntfile.js описаны сами задачи и, в самом низу, списки задач, выполняемых при вызове команды `grunt` и других. Всё подробно комментировано.



### Возможные команды

`grunt` — компиляция, копирование, обработка CSS, старт слежения и локального сервера. См. `Gruntfile.js`

`grunt sass` — только компиляция SCSS → CSS.

`grunt style` — задачи, каcающиеся стилей (компиляция, постобработка, оптимизация, минификация).

`grunt img` — копирование картинок в папку build/img.

`grunt sprite` — сборка спрайта, картинки беруться с папки src/img/sprites/.

`grunt font` — копирование шрифтов в папку build/fonts.

`grunt concat:css` — склеивает файлы из папки src/css_lib в файл css/css_lib.css

`grunt concat:js` — склеивает файлы из папки src/js/js_concat в файл js/vendor.js

`grunt build` — сборка проекта, компиляция, копирование, обработка CSS.


## ВАЖНО

Если локальный сервер и слежение уже запущены, добавленные после запуска файлы не отслеживаются. Перезапустите локальный сервер и слежение (нажать Ctrl+C, а потом снова стартовать командой `grunt`).
