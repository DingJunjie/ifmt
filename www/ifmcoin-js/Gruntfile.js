module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      release: {
        files: {
          "www/index.js" : files
        }
      },
    }
    browserify: {
      release: {
        src: 'www/index.js',
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
  });
}
