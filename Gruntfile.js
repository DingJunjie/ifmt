module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
}
