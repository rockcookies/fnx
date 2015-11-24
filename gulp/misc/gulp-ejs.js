'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var ejs = require('ejs');
var path = require('path');

module.exports = function (options, settings) {
	settings = settings || {};
	options = options || {};
	settings.ext = typeof settings.ext === "undefined" ? ".html" : settings.ext;

	return through.obj(function (file, enc, cb) {
		if (file.isNull() || path.extname(file.path) != settings.ext) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit(
				'error',
				new gutil.PluginError('gulp-ejs', 'Streaming not supported')
			);
		}

		options.filename = file.path;

		if (typeof options.ctx === "undefined") {
			options.ctx = resolveContextPath(settings, file);
		}

		options.ctx = resolveContextPath(settings, file);
		options._ = {
			include: function () {

			}
		};

		try {
			file.contents = new Buffer(ejs.render(file.contents.toString(), options));
			file.path = gutil.replaceExtension(file.path, settings.ext);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-ejs', err.toString()));
		}

		this.push(file);
		cb();
	});
}


function resolveContextPath (settings, file) {
	var ctx = '';

	if (settings.basePath && settings.destPath && settings.rootPath) {
		var basePath = path.resolve(settings.basePath);
		var destDir = path.resolve(settings.destPath);
		var ctxDir = path.resolve(settings.rootPath);

		var destPath = path.resolve(destDir, path.relative(basePath, file.path));

		ctx = path.relative(path.dirname(destPath), ctxDir);
		ctx = ctx.replace(/\\/g, '/');

		if (!ctx) {
			ctx = '.';
		}
	}


	return ctx;
}