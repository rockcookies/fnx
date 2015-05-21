'use strict';

var fs = require('fs');
var path = require('path');

var TPL_MODULE = fs.readFileSync(__dirname + '/tpl_module.tpl', 'utf-8');


var REQUIRE_RE = /\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g;

function replaceRequire (code, fn) {
	return code.replace(REQUIRE_RE, function ($, $1, $2) {
		return fn($2);
	});
};

function toId (id) {
	return id
	.replace(/\\/g, '/')
	.replace(/^\//, '')
	.replace(/\.js$/, '');
};

function isGlobalModule (id) {
	return !/^\./.test(id);
};

function parseTxtModule(content){
	var js = 'module.exports = \'\\\n';
	var arr = content.split(/(?:\r\n|\r|\n)/g);

	arr.forEach(function(script){
		if(script){
			js += script.replace(/^\s+/,' ') + '\\\n';
		}
	});

	js += '\';';
	return js;
};

function compileTemplate(str,obj){
	return str.replace(/<(.*?)>/g,function(orig, target){
		return obj[target] || '';
	});
};


function combo (base, target, uniq, deps){
	var ext = path.extname(target);
	if (!ext) {
		target = target + '.js';
	}

	var file = path.resolve(base, target);
	var dirname = path.dirname(file);

	var id = toId(file.replace(base, ''));
	var targetContent = fs.readFileSync(file, 'utf-8');
	var requireContent = '';
	if(ext.toLowerCase() == '.tpl'){
		targetContent = parseTxtModule(targetContent);
	}

	targetContent = replaceRequire(targetContent, function (uri) {
		var baseDir = base;
		var id = uri;

		//全局模块
		if (isGlobalModule(id)) {
			//添加依赖数组，并标记该全局模块
			if(!uniq[id]){
				uniq[id] = true;
				deps.push(id);
			}

			return '__include__["' + id + '"]';
		}

		//匿名模块
		else{
			//转换ID
			id = toId(path.resolve(dirname, uri).replace(baseDir, ''));

			//加载依赖模块，并标记该模块
			if (!uniq[id]) {
				uniq[id] = true;
				requireContent += combo(baseDir, id, uniq, deps);
			}

			return '__using__("' + id + '")';
		}
	});

	targetContent = compileTemplate(TPL_MODULE,{
		id : id,
		module : targetContent
	});


	return requireContent + '\n\n' + targetContent;
};


module.exports = function (options) {
	var base = options.base;
	var target = options.target;

	var includes = [];
	var output = combo(base,target,{},includes);

	var file = path.resolve(base, target);

	return {
		includes : includes,
		content : output,
		id : toId(file.replace(base, ''))
	};
};
