module.exports = function(grunt) {

  // подключаем плагин load-grunt-tasks, чтобы не перечислять все прочие плагины
  require('load-grunt-tasks')(grunt);

  // описываем задачи, которые планируем использовать (их запуск - см. низ этого файла)
  grunt.initConfig({

    // компилируем препроцессор
    sass: {
      options: {
        outputStyle: 'expanded',
        sourceMap: true,
        sourceMapEmbed: true,
      },
      dist: {
        files: {
          'build/css/style.css': 'src/sass/style.scss'
        }
      }
    },

    // обрабатываем postcss-ом (там только autoprefixer)
    postcss: {
      options: {
        map: {
          inline: false, // сохранить карту ресурсов
          annotation: 'build/css/' // в какой папке
        },
        processors: [
          // автопрефиксер и его настройки
          require("autoprefixer")({browsers: "last 2 versions"})
        ]
      },
      style: {
        // какие файлы обрабатывать (style.css)
        src: "build/css/style.css"
      }
    },

    // объединяем медиавыражения
    cmq: {
      style: {
        files: {
          // в какой файл, из какого файла (тут это один и тот же файл)
          'build/css/style.css': ['build/css/style.css']
        }
      }
    },

    // минимизируем стилевые файлы
    cssmin: {
      style: {
        options: {
          keepSpecialComments: 0
        },
        files: [{
          expand: true,
          // в какой папке брать исходники
          cwd: 'build/css',
          // какие файлы
          src: ['*.css'],
          // в какую папку писать результат
          dest: 'build/css',
          // какое расширение дать результатам обработки
          ext: '.min.css'
        }]
      }
    },

    // процесс копирования
    copy: {
      // копируем картинки
      img: {
        expand: true,
        // откуда
        cwd: 'src/img/',
        // какие файлы (все картинки (см. расширения) из корня указанной папки и всех подпапок)
        src: ['**/*.{png,jpg,gif,svg}'],
        // куда
        dest: 'build/img/',
      },

      js: {
        expand: true,
        // откуда
        cwd: 'src/js/',
        // какие файлы
        src: ['*.{js,json}'],
        // куда
        dest: 'build/js/',
      },

      font: {
        expand: true,
        // откуда
        cwd: 'src/fonts/',
        // все каталоги
        src: ['**', '!*.md'],
        // куда
        dest: 'build/fonts',
      },
    },

    // обрабатываем разметку (инклуды, простейший шаблонизатор)
    includereplace: {
      html: {
        expand: true,
        // откуда брать исходные файлы
        cwd: 'src/',
        // какие файлы обрабатывать
        src: '*.html',
        // куда писать результат обработки
        dest: 'build/',
      }
    },

    // конкатенация файлов
    concat: {
      // собираем css
      css: {
        src: ['src/_css_lib/*.css'],
        dest: 'build/css/css_lib.css',
      },
      // собираем js
      js: {
        src: ['src/js/js_concat/*.js'],
        dest: 'build/js/vendor.js',
      },
    },

    // минификация JS
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: [{
          expand: true,
          cwd: 'build/js',
          src: '**/*.js',
          dest: 'build/js'
        }]
      }
    },

    // оптимизация изображений
    imagemin: {
      static: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{ removeViewBox: false }],
        },
        files: [{
          expand: true,
          cwd: 'build/img/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'build/img/'
        }]
      },
    },

    // генератор спрайтов
    sprite: {
      all: {
        src: 'src/img/sprites/*.png',
        imgPath: '../img/spritesheet.png',
        padding: 2,
        dest: 'src/img/spritesheet.png',
        destCss: 'src/sass/_sprites.scss',
        cssFormat: 'css'
      }
    },

    // слежение за файлами
    watch: {
      // перезагрузка в браузере
      livereload: {
        options: { livereload: true },
        files: ['build/**/*'],
      },
      // следить за стилями
      style: {
        // за фактом с сохранения каких файлов следить
        files: ['src/sass/**/*.scss'],
        // какую задачу при этом запускать (сами задачи — см. ниже)
        tasks: ['sass'],
        options: {
          spawn: false,
        },
      },
      // следить за скриптами
      js: {
        // за фактом с сохранения каких файлов следить
        files: ['src/js/*.{js,json}'],
        // какую задачу при этом запускать (сами задачи — см. ниже)
        tasks: ['copy:js'],
        options: {
          spawn: false,
        },
      },
      // следить за картинками
      images: {
        // за фактом с сохранения каких файлов следить
        files: ['src/img/**/*.{png,jpg,gif,svg}'],
        // какую задачу при этом запускать (сами задачи — см. ниже)
        tasks: ['img'],
        options: {
          spawn: false
        },
      },
      // следить за файлами разметки
      html: {
        // за фактом с сохранения каких файлов следить
        files: ['src/*.html', 'src/_include/*.html'],
        // какую задачу при этом запускать (указан сам процесс)
        tasks: ['includereplace:html'],
        options: {
          spawn: false
        },
      },
    },

    // локальный сервер, автообновление
    browserSync: {
      dev: {
        bsFiles: {
          // за изменением каких файлов следить для автообновления открытой в браузере страницы с локального сервера
          src : [
            'build/css/*.css',
            'build/js/*.js',
            'build/img/*.{png,jpg,gif,svg}',
            'build/*.html',
          ]
        },
        options: {
          watchTask: true,
          server: {
            // корень сервера
            baseDir: "build/",
          },
          // синхронизация между браузерами и устройствами (если одна и та же страница открыта в нескольких браузерах)
          ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
          }
        }
      }
    }

  });


  // задача по умолчанию
  grunt.registerTask('default', [
    'sass',
    'concat',
    'img',
    'includereplace:html',
    'copy:js',
    'copy:font',
    'browserSync',
    'watch'
  ]);

  // компиляция стилей
  grunt.registerTask('style', [
    'sass',
    'concat:css',
    'postcss',
    'cmq',
    'cssmin',
  ]);

  // только обработка картинок
  grunt.registerTask('img', [
    'copy:img',
  ]);

  // скопировать шрифты
  grunt.registerTask('font', [
    'copy:font',
  ]);

  // сборка
  grunt.registerTask('build', [
    'style',
    'img',
    'imagemin',
    'concat:js',
    'copy:js',
    'copy:font',
    'uglify',
    'includereplace:html',
  ]);

};
