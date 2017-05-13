module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

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
          'build/css/main.css': 'src/sass/main.scss'
        }
      }
    },

    // обрабатываем postcss-ом (там только autoprefixer)
    postcss: {
      options: {
        map: {
          inline: false, // сохранить карту ресурсов
          annotation: 'build/css/'
        },
        processors: [
          require("autoprefixer")({browsers: "last 4 versions"})
        ]
      },
      style: {
        // какие файлы обрабатывать
        src: "build/css/main.css"
      }
    },

    // объединяем медиавыражения
    cmq: {
      style: {
        files: {
          'build/css/main.css': ['build/css/main.css']
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
          cwd: 'build/css',
          src: ['*.css'],
          dest: 'build/css',
          ext: '.min.css'
        }]
      }
    },

    // процесс копирования
    copy: {
      // копируем картинки
      img: {
        expand: true,
        cwd: 'src/img/',
        src: ['**/*.{png,jpg,gif,svg}'],
        dest: 'build/img/',
      },

      js: {
        expand: true,
        cwd: 'src/js/',
        src: ['*.{js,json}'],
        dest: 'build/js/',
      },

      fonts: {
        expand: true,
        cwd: 'src/fonts/',
        src: ['**', '!*.md'],
        dest: 'build/fonts',
      },
    },

    // обрабатываем разметку (инклуды, простейший шаблонизатор)
    includereplace: {
      html: {
        expand: true,
        cwd: 'src/',
        src: '*.html',
        dest: 'build/',
      }
    },

    // конкатенация файлов
    concat: {
      css: {
        src: ['src/_load-styles/*.css'],
        dest: 'build/css/load-styles.css',
      },
      js: {
        src: ['src/_load-scripts/*.js'],
        dest: 'build/js/load-scripts.js',
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
        files: ['src/sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        },
      },
      // css lib
      csslib: {
        files: ['src/_css_lib/*.css'],
        tasks: ['concat:css'],
        options: {
          spawn: false,
        },
      },
      // следить за скриптами
      js: {
        files: ['src/js/*.{js,json}'],
        tasks: ['copy:js'],
        options: {
          spawn: false,
        },
      },
      // js lib
      jslib: {
        files: ['src/_js_lib/*.{js,json}'],
        tasks: ['concat:js'],
        options: {
          spawn: false,
        },
      },
      // шрифты
      fonts: {
        files: ['src/fonts/**/*'],
        tasks: ['copy:fonts'],
        options: {
          spawn: false,
        },
      },
      // следить за картинками
      images: {
        files: ['src/img/**/*.{png,jpg,gif,svg}'],
        tasks: ['img'],
        options: {
          spawn: false
        },
      },
      // следить за файлами разметки
      html: {
        files: ['src/*.html', 'src/_include/*.html'],
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
            'build/fonts/**/*',
            'build/img/**/*.{png,jpg,gif,svg}',
            'build/*.html',
          ]
        },
        options: {
          watchTask: true,
          //injectChanges: false,
          server: {
            // корень сервера
            baseDir: "build/",
          },
          // синхронизация между браузерами и устройствами (если одна и та же страница открыта в нескольких браузерах)
          ghostMode: {
            clicks: true,
            forms: true,
            scroll: true,
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
    'copy:fonts',
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
    'copy:fonts',
  ]);

  // сборка
  grunt.registerTask('build', [
    'style',
    'img',
    'imagemin',
    'concat:js',
    'copy:js',
    'copy:fonts',
    'uglify',
    'includereplace:html',
  ]);

};
