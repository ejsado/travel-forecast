var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var htmlReplace = require('gulp-html-replace');

gulp.task('default', function() {
	console.log(
		"\n" +
		" You're definitely gonna forget how to use this tool, \n" +
		" so here are the gulp tasks you made: \n\n" +
		" buildSass : compiles and prefixes all .scss files in '/styles' \n" +
		" watchSass : watches '/styles' for changes in any .scss file and runs 'buildSass' \n" +
		" compressJs : combines and compresses all js files in '/public/js' \n" +
		" compressVendorJs : combines and compresses all js files in '/public/js/vendor' \n" +
		" srcReplace : replaces source references in 'public/index.php' \n" +
		" buildDist : runs above tasks (all tasks output to '/dist') \n"
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
		.pipe(gulp.dest('./public/css'))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('watchSass', function() {
	gulp.watch('./styles/*.scss', ['buildSass']);
});

var jsDest = './dist/js/';

gulp.task('compressJs', function() {
	return gulp.src('./public/js/*.js')
		.pipe(concat('app.js'))
        .pipe(gulp.dest(jsDest))
		.pipe(rename('app.min.js'))
		.pipe(uglify({
			mangle: false
		}))
		.pipe(gulp.dest(jsDest));
});

gulp.task('compressLibJs', function() {
	return gulp.src('./public/js/lib/*.js')
		.pipe(concat('lib.js'))
        .pipe(gulp.dest(jsDest))
		.pipe(rename('lib.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(jsDest));
});

gulp.task('srcReplace', function() {
  gulp.src('./public/index.php')
    .pipe(htmlReplace({
        'angular': [
			'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular.min.js',
			'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular-animate.min.js'
		],
        'lib': '/js/lib.min.js',
		'app': '/js/app.min.js'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('buildDist', [
	'buildSass',
	'compressJs',
	'compressLibJs',
	'srcReplace'
]);






















