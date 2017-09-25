module.exports = function (grunt) {
  var files = [
    "./index.js"
  ]
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      release: {
        files: {
          "./index.js" : files
        }
      },
    },
    browserify: {
      release: {
        src: './index.js',
        dest: '../../js/ifmcoin.js'
      }
    },
    /*uglify: {
      release: {
        options: {
          preserveComments: false,
          wrap: false,
          mangle: false
        },
        files: {
          "../../js/ifmcoin.js" : files
        }
      }
    }*/
  });
  // grunt.loadNpmTasks("grunt-angular-gettext");
  grunt.loadNpmTasks("grunt-contrib-concat");
  // grunt.loadNpmTasks("grunt-contrib-cssmin");
  // grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-browserify");
  // grunt.loadNpmTasks("grunt-contrib-watch");

  // grunt.registerTask("default", ["watch"]);
  grunt.registerTask("release", ["concat", "browserify"]);
}
