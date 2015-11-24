'use strict';

var through = require('through2');
var gutil = require('gulp-util');

exports.test = function (exp, task) {
	return exp ? task : through.obj();
}

exports.log = function (task) {
	return function (e) {
		gutil.log(e);
		task.end();
	}
}