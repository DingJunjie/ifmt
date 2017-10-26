module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    // pkg: grunt.file.readJSON('package.json'),
    /*//压缩
    uglify: {
      options: {
        banner: '/!*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> *!/\n'
      },
      build: {
        src: 'src/<%=pkg.file %>.js',
        dest: 'dest/<%= pkg.file %>.min.js'
      }
    },
    //连接
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        //要连接的文件
        src: [],
        dest: ''
      }
    }
  });
  // 加载提供"uglify"任务的插件
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // 默认任务
  grunt.registerTask('default', ['uglify']);*/
    /*concat: {
      release: {
        files: {
          "www/login.js" : files
        }
      },
      withoutBrowserify: {
        files: {
          "www/js/vendor_app.js" : withoutBrowserify
        }
      },
      browserify: {
        release: {
          src: 'www/login.js',
          dest: 'www/js/vendor_app.js'
        }
      },
      uglify: {
        release: {
          options: {
            preserveComments: false,
            wrap: false,
            mangle: false
          },
          files: {
            "www/js/login.js" : files
          }
        }
      }
    }*/
    nggettext_extract: {
      pot: {
        files: {
          'www/po/template2.pot' : [
              'www/user/*.html',
              'www/user/*/*.html'
          ]
        }
      }
    },
    nggettext_compile: {
      all: {
        options: {
          module: 'IfmCoinApp'
        },
        files: {
          'www/js/translations.js' : ['www/po/zh.po']
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-angular-gettext");

  grunt.registerTask("default", ["watch"]);
  grunt.registerTask("release", ["nggettext_extract", "nggettext_compile"]);
}
