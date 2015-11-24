'use strict';

var path = require('path');
var gulp = require('gulp');
var GLOBALS = gulp.GLOBALS;
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

function reload () {
	browserSync.instance && browserSync.instance.reload();
}

gulp.task('watch', ['build'], function (done) {
	gulp.watch(path.join(GLOBALS.src.js, '**/*'), ['watch:js']);
	gulp.watch(path.join(GLOBALS.src.less, '**/*'), ['watch:styles']);
	gulp.watch(path.join(GLOBALS.src.html, '**/*'), ['watch:html']);
	gulp.watch(path.join(GLOBALS.src.assets, '**/*'), ['watch:assets']);
	done();
});

gulp.task('watch:js', function (done) {
	$.sequence.apply(this, GLOBALS.isRevsion ? ['js', 'html'] : ['js'])(function () {
		reload();
		done();
	});
});

gulp.task('watch:styles', function (done) {
	$.sequence.apply(this, GLOBALS.isRevsion ? ['styles', 'html'] : ['styles'])(function () {
		reload();
		done();
	});
});

gulp.task('watch:html', function (done) {
	$.sequence('html')(function () {
		reload();
		done();
	});
});

gulp.task('watch:assets', function (done) {
	$.sequence('assets')(function () {
		reload();
		done();
	});
});