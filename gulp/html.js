'use strict';

var path = require('path');
var gulp = require('gulp');
var GLOBALS = gulp.GLOBALS;
var $ = require('gulp-load-plugins')();
var gulpEjs = require('./misc/gulp-ejs');
var util = require('./misc/util');

gulp.task('html', function () {
	var src = path.join(GLOBALS.src.html, '**/*.html');

	// rev files
	if (GLOBALS.isRevsion) {
		src = [path.join(GLOBALS.temp.rev, '**/*.json'), src];
	}

	var task = gulp.src(src);
		// ejs
		task.pipe(gulpEjs(GLOBALS.ejs.options, {
			basePath: GLOBALS.src.html,
			destPath: GLOBALS.dist.html,
			rootPath: GLOBALS.dist.root,
			ext: '.html'
		}))
		// error handler
		.on('error', util.log(task))
		// resolve rev manifest
		.pipe(util.test(GLOBALS.isRevsion, $.revCollector({
			replaceReved: true
		})))
		// minify
		.pipe(util.test(GLOBALS.isMinifyHtml, $.minifyHtml({
			empty: true,
			spare: true,
			quotes: true
		})))
		// error handler
		.on('error', $.util.log)
		// write file
		.pipe(gulp.dest(GLOBALS.dist.html));

	return task;
});