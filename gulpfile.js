// Paths
var dest = "build/";
var source = "source/";

var gulp = require("gulp");

// Plugins
var argv = require('yargs').boolean('production').argv;
var sass = require("gulp-sass");
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require("browser-sync").create();
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var gcmq = require('gulp-group-css-media-queries');
var purify = require('gulp-purifycss');
var shorthand = require('gulp-shorthand');
var gzip = require('gulp-gzip');
var sourcemaps = require('gulp-sourcemaps');
var gs = require('gulp-selectors');

// Variables
var isProd = !!argv.production;
var isDev = !isProd;

// Tasks

gulp.task('default', ['compile', 'watch', 'server']);
gulp.task('compile', ['template','sass', 'scripts']);

gulp.task('template', function(){
	gulp.src(source + "index.html")
	.pipe(gulp.dest(dest));
})

gulp.task("sass", function(){	
	
	gulp.src(source + "scss/styles.scss")
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(sass())
		.pipe(gulpif(isProd, cssnano()))
		.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
		.pipe(gulpif(isDev,sourcemaps.write('.')))
		.pipe(rename("app.css"))
		.pipe(gulp.dest(dest + "css/"));
});

gulp.task('scripts', function() {
  return gulp.src(source +'js/*.js')
  	.pipe(gulpif(isDev, sourcemaps.init()))
  	.pipe(babel({
            presets: ['es2015']
    }))
    .pipe(gulpif(isDev, sourcemaps.write('.')))
    .pipe(gulpif(isProd, concat('countdowndays.min.js')))
    .pipe(gulpif(isProd, uglify()))
	.pipe(gulp.dest(dest + 'js/'));
});

gulp.task ("watch", function() {
	gulp.watch(source + 'scss/*.scss', ['sass']);
	gulp.watch(source + '*.html', ['template']);
	gulp.watch(source + 'js/*.js', ['scripts']);
});

gulp.task("server", function(){
	browserSync.init(['./build/js/*.js', './build/css/*.css', './build/index.html'], {
		server: {
            baseDir: "./build/"
        }
	})
});