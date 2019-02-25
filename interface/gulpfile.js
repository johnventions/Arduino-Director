var gulp = require('gulp');
const uglify = require('gulp-uglify');
var concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('merge-stream');
var stylus = require('gulp-stylus');

var jsVendor = [
    "node_modules/es6-promise/dist/es6-promise.auto.min.js",
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/vue/dist/vue.js",
    "node_modules/vuex/dist/vuex.js",
    "node_modules/wavesurfer.js/dist/wavesurfer.min.js",
    "node_modules/socket.io-client/dist/socket.io.min.js"
];

var cssVendor = [
    "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
    "node_modules/bootstrap/dist/css/bootstrap.min.css"
];

function vendorJS() {
    return gulp.src(jsVendor)
    .pipe(concat("vendor.js"))
    .pipe(gulp.dest('dist/'));
}

function javascript() {
    return gulp.src('src/js/*.js')
    .pipe(concat("main.js"))
    .pipe(gulp.dest('dist/'));
}

function css() {
    return gulp.src("src/styl/styles.styl")
        .pipe(concat("style.styl"))
        .pipe(stylus())
        .pipe(rename("styles.css"))
        .pipe(gulp.dest('dist/'));
}

function vendorCSS() {
    return gulp.src(cssVendor)
        .pipe(concat("vendor.css"))
        .pipe(rename("vendor.css"))
        .pipe(gulp.dest('dist/'));
}
function fonts() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('dist/webfonts'));
}

function watch() {
    gulp.watch("src/js/*.js", javascript);
    gulp.watch("src/styl/**/*.styl", css);
  }



var build = gulp.series(fonts, vendorCSS, css, vendorJS, javascript);
var dev = gulp.series(fonts, vendorCSS, css, vendorJS, javascript, watch);

exports.default = build;
exports.dev = dev;