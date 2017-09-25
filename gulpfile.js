var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

// var paths = {
//   sass: ['./scss/**/*.scss']
// };

// gulp.task('default', ['sass']);
gulp.task('default', ['scripts']);
// gulp.task('sass', function(done) {
//   gulp.src('./scss/ionic.app.scss')
//     .pipe(sass())
//     .on('error', sass.logError)
//     .pipe(gulp.dest('./www/css/'))
//     .pipe(cleanCss({
//       keepSpecialComments: 0
//     }))
//     .pipe(rename({ extname: '.min.css' }))
//     .pipe(gulp.dest('./www/css/'))
//     .on('end', done);
// });

// Basic usage 
gulp.task('scripts', function() {
  // Single entry point to browserify 
  gulp.src('./www/login.js')
      .pipe(browserify({
        insertGlobals : true,
        debug : !gulp.env.production
      }))
      .pipe(rename('browserifylogin.js'))      
      .pipe(gulp.dest('./www/'))
});

// gulp.task('watch', ['sass'], function() {
//   gulp.watch(paths.sass, ['sass']);
// });
