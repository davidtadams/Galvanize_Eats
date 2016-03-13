var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

/* all gulp tasks to make a automated dev enviroment */
gulp.task('dev-serve', function() {
  browserSync.init({
    server: {
      baseDir: "./app"
    }
  });

  gulp.watch("app/*.html").on("change", reload);
  gulp.watch("app/pages/*.html").on("change", reload);
  gulp.watch("app/css/*.css").on("change", reload);
  gulp.watch("app/js/*.js").on("change", reload);
})

/* gulp cli runners */
gulp.task('default', ['dev']);
gulp.task('dev', ['dev-serve']);
