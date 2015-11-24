'use strict';

var path = require('path');
var gulp = require('gulp');
var GLOBALS = gulp.GLOBALS;
var $ = require('gulp-load-plugins')();
var webpackConfig = require('./misc/webpack.config.js');
var util = require('./misc/util');
var webpackStream = require('webpack-stream');

gulp.task('js:build', function () {
	var dest = GLOBALS.isRevsion ? GLOBALS.temp.js : GLOBALS.dist.js;

	return gulp.src(path.join(GLOBALS.src.js, '**/*.main.js'))
		// webpack
		.pipe(webpackStream(webpackConfig()))
		// write files
		.pipe(gulp.dest(dest));
});

gulp.task('js:revsion', function () {
	return gulp.src(path.join(GLOBALS.temp.js, '**/*.js'))
		// revision
		.pipe($.rev())
		// write files
		.pipe(gulp.dest(GLOBALS.dist.js))
		// revision manifest
		.pipe($.rev.manifest())
		// write manifest files
		.pipe(gulp.dest(path.join(GLOBALS.temp.rev, 'js')));
});

gulp.task('js:sourcemap', function () {
	return gulp.src(path.join(GLOBALS.temp.js, '**/*.map'))
		// write files
		.pipe(gulp.dest(GLOBALS.dist.js));
});


gulp.task('js', function (done) {
	$.sequence.apply(this, GLOBALS.isRevsion ? ['js:build', 'js:revsion', 'js:sourcemap'] : ['js:build'])(done);
});
