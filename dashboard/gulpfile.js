var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('watch', function() {
  gulp.watch('main.ts', ['default']);
});

gulp.task('default', function () {
  var tsResult = gulp.src('main.ts')
    .pipe(ts({
        out: 'output.js'
      }));
  return tsResult.js.pipe(gulp.dest('./'));
});
