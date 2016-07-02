var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var rename = require("gulp-rename");

gulp.task('default', function() {
	console.log(
		"\n" +
		" You're definitely gonna forget how to use this tool, \n" +
		" so here are the gulp tasks you made: \n\n" +
		" buildSass : compiles and prefixes all .scss files in '/' \n" +
		" watchSass : watches '/' for changes in any .scss file and runs 'buildSass' \n"
	);
});

gulp.task('buildSass', function() {
	return gulp.src('./styles/main.scss')
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(autoprefix())
		.pipe(cleanCss())
		.pipe(rename({
			basename: "all.min"
		}))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('watchSass', function() {
	gulp.watch('./styles/*.scss', ['buildSass']);
});




























