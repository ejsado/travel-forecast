var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');

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
	return gulp.src('./*.scss')
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(autoprefix())
		.pipe(gulp.dest('./public'));
});

gulp.task('watchSass', function() {
	gulp.watch('./*.scss', ['buildSass']);
});




























