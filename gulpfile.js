var gulp = require("gulp");
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

//Directory configuration

var directories = ["./*.html", "scripts/*.js", "./*.css", "pages/*.html", "sass/*.scss"];

gulp.task('livereload', function() {
  livereload.listen();
	gulp.watch(directories, function(){
		gulp.src(directories).pipe(livereload());
	});
});

gulp.task('compressJS', function(){
	gulp.watch(directories, function(){
		return gulp.src('./scripts/*.js')
	  .pipe(uglify({compress:{drop_console: false}}))
	  .pipe(gulp.dest('dist/scripts'));
	  console.log("compressing");
	});
})

gulp.task('sass', function () {
  return gulp.src('./sass/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('dist/styling'));
});
 
gulp.task('sass:watch', function () {
  console.log('sass code');
  gulp.watch('./sass/*.scss', ['sass']);
});

gulp.task('css:watch', function () {
  gulp.watch('dist/styling/*.css', ['sass']);
});


gulp.task('default', ['sass:watch','css:watch' , 'livereload', 'compressJS'], function() {
	
});
