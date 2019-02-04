const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
var concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('merge-stream');
var stylus = require('gulp-stylus');
const { parallel } = require('gulp');


var jsVendor = [
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/vue/dist/vue.js",
    "node_modules/socket.io-client/dist/socket.io.min.js"
];

var cssVendor = [
    "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
    "node_modules/bootstrap/dist/css/bootstrap.min.css"
];



function vendorJS() {
    return src(jsVendor)
    .pipe(concat("vendor.js"))
    .pipe(dest('dist/'));
}

function javascript() {
    return src('src/js/*.js')
    .pipe(concat("main.js"))
    // .pipe(uglify())
    .pipe(dest('dist/'));
}

function css() {
    return src("src/styl/*.styl")
        .pipe(concat("style.styl"))
        .pipe(stylus())
        .pipe(rename("styles.css"))
        .pipe(dest('dist/'));
}

function vendorCSS() {
    return src(cssVendor)
        .pipe(concat("vendor.css"))
        .pipe(rename("vendor.css"))
        .pipe(dest('dist/'));
}

function fonts() {
    return src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(dest('dist/webfonts'));
}

exports.default = parallel(vendorJS, javascript, vendorCSS, css, fonts);
exports.build = parallel(vendorJS, javascript, vendorCSS, css, fonts);
exports.js = parallel(vendorJS, javascript);
exports.css = parallel(vendorCSS, css, fonts);