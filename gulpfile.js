"use strict";

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");

//live reload
var browsersync = require('browser-sync').create();

// BrowserSync
function browserSync(done) {
    browsersync.init({
      server: {
        baseDir: "./"
      },
      port: 3000
    });
    done();
}


function browserSyncReload(done) {
    browsersync.reload();
    done();
}  

function css() {
  return gulp
    .src("./styles/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest("./css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./css"))
    .pipe(browsersync.stream());
}

function watchFiles() {
    gulp.watch("./styles/**/*", css);
    gulp.watch("./**/*.html", browserSyncReload);
}

//compile css and js
const build = gulp.series(css);
const watch = gulp.series(build ,gulp.parallel(watchFiles, browserSync));

exports.build = build;
exports.css = css;
exports.watch = watch;
exports.default = watch;