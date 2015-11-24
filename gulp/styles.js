'use strict';

var path = require('path');
var gulp = require('gulp');
var GLOBALS = gulp.GLOBALS;
var $ = require('gulp-load-plugins')();
var util = require('./misc/util');

function createLessPlugin (name, options) {
	var plugin = require('less-plugin-' + name);
	return new plugin(options || {});
}

var LessPlugin = {
	'est': createLessPlugin('est')
};

gulp.task('styles:build', function () {
	var dest = GLOBALS.isRevsion ? GLOBALS.temp.css : GLOBALS.dist.css;

	var task = gulp.src(path.join(GLOBALS.src.less, '**/*.main.less'));

	// source map init
	task.pipe(util.test(GLOBALS.isCssSourceMap, $.sourcemaps.init()))//{loadMaps: true}
	// less compile
	.pipe($.less({
		strictMath: false,
		banner: (GLOBALS.isMinifyCss ? undefined : GLOBALS.banner),
		plugins: [LessPlugin.est],
		paths: [path.resolve(GLOBALS.src.less), path.resolve(GLOBALS.src.bower), path.resolve(GLOBALS.src.libs)],
		modifyVars: {
			timestamp: Date.now()
		}
	}))
	.on('error', util.log(task))
	// autoprefixer
	.pipe($.autoprefixer(GLOBALS.autoprefixer))
	// minify css
	.pipe(util.test(GLOBALS.isMinifyCss, $.minifyCss({
		compatibility: 'ie8',
		keepSpecialComments: '*',
		advanced: false
	})))
	// banner
	.pipe(util.test(GLOBALS.isMinifyCss, $.header(GLOBALS.banner)))
	// rename
	.pipe($.rename(function (path) {
		path.basename = path.basename.replace(/\.main$/, '.min');
	}))
	// write source map
	.pipe(util.test(GLOBALS.isCssSourceMap, $.sourcemaps.write('./map')))
	// write files
	.pipe(gulp.dest(dest));

	return task;
});


gulp.task('styles:revsion', function () {
	return gulp.src(path.join(GLOBALS.temp.css, '**/*.css'))
		// revision
		.pipe($.rev())
		// write files
		.pipe(gulp.dest(GLOBALS.dist.css))
		// revision manifest
		.pipe($.rev.manifest())
		// write manifest files
		.pipe(gulp.dest(path.join(GLOBALS.temp.rev, 'css')));
});


gulp.task('styles:sourcemap', function () {
	return gulp.src(path.join(GLOBALS.temp.css, '**/*.map'))
		// write files
		.pipe(gulp.dest(GLOBALS.dist.css));
});


gulp.task('styles', function (done) {
	$.sequence.apply(this, GLOBALS.isRevsion ? ['styles:build', 'styles:revsion', 'styles:sourcemap'] : ['styles:build'])(done);
});









