/**
 * installation:
 * $ npm install gulp gulp-uglify gulp-concat gulp-rename gulp-replace gulp-autoprefixer gulp-htmlmin gulp-sass gulp-sourcemaps gulp-clean gulp-insert
 */

// gulp plugins:
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var path = require('path');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var insert = require('gulp-insert');

// configuration:
const PATH_RBKIT = '../rbkit/';
const PATH_DIST = '_dist';
const SOURCE_HTML = new Array('*.html');
const SOURCE_CSS = new Array('css/**/*.css');
const SOURCE_IMAGES = new Array('img/**');
const SOURCE_JAVASCRIPT = [
    PATH_RBKIT + 'framework/js/src/rbkit.global.js',
    PATH_RBKIT + 'framework/js/src/modules/*.js',
    PATH_RBKIT + 'framework/js/src/external/slick/*.js',
    //PATH_RBKIT + 'framework/js/src/external/cliplister/*.js',
    PATH_RBKIT + 'framework/js/src/external/stellar/*.js',
    PATH_RBKIT + 'framework/js/src/external/viewport/*.js',
    PATH_RBKIT + 'framework/js/src/external/featherlight/*.js',
    'js/**/*.js'
];

// local environment:
var loc = path.resolve(__dirname);
var separator = loc.indexOf('/') == -1 ? '\\' : '/';
var working_dir = loc.split(separator).pop();
var webserver_dir = loc.split('htdocs').shift() + 'htdocs' + separator;

/**
 *  replace the refs in all html and js + minify html
 */
gulp.task('html', function () {

    return gulp.src(SOURCE_HTML)
        .pipe(replace(/<!--SCRIPTS-BEGIN-->[\s\S]*<!--SCRIPTS-END-->/, function () {
            return '<script src="{{MEDIA_REF_script}}"></script><script src="{{MEDIA_REF_integration}}"></script>';
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            keepClosingSlash: true,
            removeComments: true
        }))
        .pipe(replace(/([a-zA-Z0-9:/\._-]+\.)(jpe?g|png|[tg]iff?|svg|pdf|css(?!\()|js|mp4)/gi, function ($2) {
            var splitter = $2;
            if (splitter.indexOf('//') == -1) {
                var prefix = '{{MEDIA_REF_';
                var suffix = '}}';
                var n = splitter.lastIndexOf('/');
                var cont = splitter.substring(n + 1);
                var ext = cont.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "");

                return prefix + ext + suffix;
            }
            else {
                return splitter;
            }

        }))
        .pipe(replace(/\?page=.+?\.html/g, function ($2) {
            var splitter = $2;
            var prefix = '{{LINK_REF_BASIC_';
            var suffix = '}}';
            var ext = splitter.slice(6, -5);

            return prefix + ext + suffix;
        }))
        .pipe(insert.transform(function(contents, file) {
            var path = file.path.replace(/\\/g, "/").split('/');
            var comment = '<!-- ' + new Date().toLocaleString() + ' | ' + path[path.length-2] + '/' + path[path.length-1] + ' -->\n';

            return comment + contents;
        }))
        .pipe(gulp.dest(PATH_DIST));
});


/**
 *  css autoprefixer for dist
 */
gulp.task('styles', function () {
    return gulp.src(SOURCE_CSS)
        .pipe(autoprefixer({
            browsers: ['ie >= 10', 'Firefox >= 35', 'last 1 Chrome version', 'Safari >= 7'],
            cascade: false
        }))
        .pipe(gulp.dest(PATH_DIST + separator + 'css'));
});


/**
 *  copy/rename img for dist
 */
gulp.task('images', function () {
    return gulp.src(SOURCE_IMAGES)
        .pipe(rename(function (path) {
            path.basename = path.basename.replace(/[^a-zA-Z0-9]/g, "");
        }))
        .pipe(gulp.dest(PATH_DIST + separator + 'img'));
});


/**
 *  minify all JS
 */
gulp.task('scripts', function () {
    gulp.src(SOURCE_JAVASCRIPT)
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest(PATH_DIST + separator + 'js'));
});

/**
 *  delete _dist folder
 */
gulp.task('clean', function () {
    return gulp.src(PATH_DIST, {read: false})
        .pipe(clean());
});


/**
 *  full distribution
 */
gulp.task('distribute', ['html', 'styles', 'images', 'scripts']);

/**
 *  clean _dist directory first, then full distribute
 */
gulp.task('_dist', ['clean'], function (done) {
    function onFinish(event) {
        if (event.task === 'distribute') {
            gulp.removeListener('task_stop', onFinish);
            done();
        }
    }
    gulp.on('task_stop', onFinish);
    gulp.start('distribute');
});


/**
 *  Sass watcher
 */
gulp.task('sass', function () {
    console.log('SCSS compiled.');
    return gulp.src('./css/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync({outputStyle: 'compressed', includePaths: ['./css']}).on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./css'));
});

gulp.task('default', function () {
    gulp.watch('./css/**/*.scss', ['sass']);
    console.log('Sass watcher activated.');
});