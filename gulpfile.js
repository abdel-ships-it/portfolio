var gulp = require("gulp");
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
//Directory configuration

var directories = ["./*.html", "scripts/*.js", "./*.css", "pages/*.html"];

gulp.task('livereload', function() {
  livereload.listen();
	gulp.watch(directories, function(){
		gulp.src(directories)
		.pipe(livereload())
	});
});

gulp.task('serve', function(){
	 gulp.watch(directories).on('change', browserSync.reload);
});


gulp.task('minifyJS', function(){	
	  return gulp.src('./scripts/*.js')
	  .pipe(uglify({compress:{drop_console: true}}))
	  .pipe(gulp.dest('dist/scripts'));
	  console.log("compressing");	
})

gulp.task('minifyJS:watch', function(){
	console.log('Minifying JS');
	gulp.watch("scripts/*.js", ['minifyJS']);
})

gulp.task('sass', function () {
  return gulp.src('./sass/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/styling'))
    .pipe(browserSync.stream());
});
 
gulp.task('sass:watch', function () {
  console.log('sass code');
  gulp.watch('./sass/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'sass:watch','livereload', 'minifyJS:watch', 'serve'], function(){
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
});
