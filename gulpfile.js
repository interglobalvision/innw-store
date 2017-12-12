var gulp = require('gulp'),
  watch = require('gulp-watch'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  util = require('gulp-util'),
  plumber = require('gulp-plumber'),
  concat = require('gulp-concat'),

  jshint = require('gulp-jshint'),
  jscs = require('gulp-jscs'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),

  cache = require('gulp-cached'),

  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  swiss = require('kouto-swiss'),

  imagemin = require('gulp-imagemin');

function errorNotify(error){
  notify.onError("Error: <%= error.message %>");
  util.log(util.colors.red('Error'), error.message);
}

gulp.task('javascript', function() {
  return gulp.src('src/js/main.js')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .on('error', errorNotify)
  .pipe(jscs('.jscsrc'))
  .on('error', errorNotify)
  .pipe(rename({
    extname: '.js.liquid'
  }))
  .pipe(gulp.dest('assets'))
  .pipe(uglify())
  .on('error', errorNotify)
  .pipe(rename({
    basename: 'main',
    suffix: '.min',
    extname: '.js.liquid'
  }))
  .pipe(sourcemaps.write('/', {
    mapFile: function(mapFilePath) {
      return mapFilePath.replace('.liquid.map', '.map');
    }
  }))
  .on('error', errorNotify)
  .pipe(gulp.dest('assets'))
  .pipe(notify({ message: 'Javascript task complete' }));
});

gulp.task('javascript-library', function() {
  return gulp.src('src/js/library/*.js')
  .pipe(concat('library.js.liquid'))
  .pipe(gulp.dest('assets'))
  .pipe(notify({ message: 'Javascript Library task complete' }));
});

gulp.task('style', function() {
  return gulp.src('src/css/site.styl')
  .pipe(plumber())
  .pipe(stylus({
      use: [
        swiss()
      ],
    }))
  .on('error', errorNotify)
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
  }))
  .on('error', errorNotify)
  .pipe(rename({
    extname: '.css.liquid'
  }))
  .pipe(gulp.dest('assets'))
  .pipe(rename({
    basename: 'site',
    suffix: '.min',
    extname: '.css.liquid'
  }))
  .pipe(cleanCSS())
  .on('error', errorNotify)
  .pipe(gulp.dest('assets'))
  .pipe(notify({ message: 'Style task complete' }));
});

gulp.task('images', function () {
  return gulp.src('src/img/*.*')
  .pipe(cache('images'))
  .pipe(imagemin({
    progressive: false
  }))
  .on('error', errorNotify)
  .pipe(gulp.dest('assets'))
	.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('watch', function() {
  gulp.watch(['src/js/main.js'], ['javascript']);
  gulp.watch(['src/js/library/*.js'], ['javascript-library']);
  gulp.watch(['src/css/*.styl', 'src/css/responsive/*.styl'], ['style']);
  gulp.watch(['src/img/**'], ['images']);
});

gulp.task('default', ['watch']);
gulp.task('build', ['images', 'style', 'javascript-library', 'javascript']);
