'use strict';

var path = require('path');
var gulp = require('gulp');
var GLOBALS = gulp.GLOBALS;
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');

gulp.task('clean', function (done) {
	del.sync([GLOBALS.dist.root, GLOBALS.temp.root]);
	done();
});

gulp.task('assets', function () {
	return gulp.src(path.join(GLOBALS.src.assets, '**/*'))
    	.pipe(gulp.dest(GLOBALS.dist.assets));
});

gulp.task('build', function (done) {
	$.sequence('clean', ['js', 'styles', 'assets'], 'html')(done);
});

gulp.task('serve', ['watch'], function (done) {
	browserSync.instance = browserSync.init({
		port: GLOBALS.server.port,
		startPath: GLOBALS.server.startPath,
		server: {
			baseDir: GLOBALS.dist.root
		},
		reloadDelay: 1000,
		notify: false
	});

	done();
});


gulp.task('connect', ['watch'], function (done) {
	$.connect.server({
		root: GLOBALS.dist.root,
		port: GLOBALS.server.port
	});
	done();
});