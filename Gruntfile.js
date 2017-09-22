module.exports = function (grunt) {
  /*var files = [
    "www/login.js"
  ];
  var withoutBrowserify = [];
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    /!*!//压缩
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
  grunt.registerTask('default', ['uglify']);*!/
    concat: {
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
    }
  });

  grunt.registerTask("default", ["watch"]);
  grunt.registerTask("release", ["concat", "browserify", "concat:withoutBrowserify", "uglify:release"]);*/
  var files = [
    "www/login.js",
    "www/modules.js"
  ]
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      release : {
        files: {
          "www/login.js": files
        }
      }
    },
    browserify: {
        release: {
            src: 'www/login.js',
            dest: 'www/dest/login_app.js'
        }
    },
    /*uglify: {
      release: {
        src: 'www/dest/login_app.js',
        dest: 'www/dest/vendor_app.js'
      }
    }*/
  });
  // 加载提供"uglify"任务的插件
  grunt.loadNpmTasks("grunt-contrib-concat");
  // grunt.loadNpmTasks("grunt-contrib-cssmin");
  // grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-browserify");
  // grunt.loadNpmTasks("grunt-contrib-watch");
  // 默认任务
  grunt.registerTask('release', ['concat', 'browserify']);
}
