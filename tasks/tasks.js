'use strict';

var fs = require('fs');
var path = require('path');
var unwrap = require('./unwrap/unwrap.js');

var TPL_PACK_HEAD = fs.readFileSync(__dirname + '/tpl_pack_head.tpl', 'utf-8');
var TPL_PACK_BODY = fs.readFileSync(__dirname + '/tpl_pack_body.tpl', 'utf-8');
var TPL_ASYNC_BODY = fs.readFileSync(__dirname + '/tpl_async_body.tpl', 'utf-8');

function parseOptions(grunt){
	var options = this.options();

	options.base = path.resolve(options.base || './');
	options.banner = options.banner || '';
	options.namespace = options.namespace || 'FNX';
	options.idPrefix = options.idPrefix || 'fnx/cmp';
	options.globalModules = options.globalModules || {};
	options.modules = this.data.modules;

	//检查构建模块列表
	if(!options.modules){
		options.modules = [];
		for(var name in options.globalModules){
			options.modules.push(name);
		}
	}

	if (!fs.existsSync(options.base)) {
		grunt.fail.warn('`options.base` is not a directory');
	}
	return options;
};

function generateBanner(key, value){
	var b = '';
	b += '\n/**';
	b += '===============================\n';
	b += key + ' : ' + value + '\n';
	b += '===============================';
	b += '**/\n';
	return b;
};

function compileTemplate(str,obj){
	return str.replace(/<(.*?)>/g,function(orig, target){
		return obj[target] || '';
	});
};

exports.regist = function(grunt){
	/**
	 * 注册打包任务
	 **/
	grunt.registerMultiTask('fnxpack','FNX building tools.',function(){
		var options = parseOptions.call(this,grunt);
		var base = options.base;
		var globalModules = options.globalModules;
		var modules = options.modules;
		var namespace = options.namespace;
		var idPrefix = options.idPrefix;
		var dest = this.files[0].dest;
		var banner = options.banner;
		var uniq = {};
		var output = "";
		var requireModule = {};
		var requires = '';


		parseScript(modules);

		//解析脚本
		function parseScript(modules){
			modules.forEach(function (name) {
				if(uniq[name]) return;
				uniq[name] = true;
				var module = globalModules[name];
				if(!module){
					requireModule[name] = true;
					return;
				}

				var result = unwrap({
					base : module.base || base,
					target : module.src
				});

				//加载依赖
				parseScript(result.includes);

				output += compileTemplate(TPL_PACK_BODY,{
					banner : generateBanner('component', name),
					namespace : namespace,
					modules : result.content,
					init : generateInitScript(name, result.id, result.includes)
				});

				grunt.log.writeln('packing component : [' + name + ']' +
					(result.includes.length ? ', deps : [ ' + result.includes.join(' , ') +' ]' : '')
				);

			});
		};

		//生成初始化脚本（添加依赖）
		function generateInitScript(name, initId, includeNames){
				var script = '\n';

			includeNames.forEach(function(name){
				var id = idPrefix + '/' + name;
				if(name == '$'){
					script += "__include__['$'] = $;\n";
				}else{
					script += "__include__['" + name + "'] = " + namespace + ".__clz__['" + idPrefix + "/" + name + "'];\n";
				}
			});

			script += namespace + ".__clz__['" + idPrefix + '/' + name + "'] = __using__('" + initId + "');";

			return script;
		};

		for(var i in requireModule){
			requires += 'require("'+i+'")\n';
		}

		//编译模板头部模块加载器
		output = compileTemplate(TPL_PACK_HEAD, {
			namespace : namespace,
			banner : banner,//生成Banner
			info : generateBanner('modules', '\n' + modules.join('	\n')),//生成头部模块标识
			modules : output,
			requires : requires
		});

		grunt.file.write(dest, output);
	});

	/**
	 * 注册异步任务
	 **/
	grunt.registerMultiTask('fnxbuild', 'FNX build.', function() {
		var options = parseOptions.call(this,grunt);
		var base = options.base;
		var globalModules = options.globalModules;
		var modules = options.modules;
		var namespace = options.namespace;
		var idPrefix = options.idPrefix;
		var dest = this.files[0].dest;
		var banner = options.banner;
		var output = "";

		//遍历构建模块
		modules.forEach(function (name) {
			var module = globalModules[name];
			var output = "";

			var result = unwrap({
				base : module.base || base,
				target : module.src
			});

			output += compileTemplate(TPL_ASYNC_BODY,{
				banner : banner + generateBanner('component', name),
				modules : result.content,
				init : generateInitScript(name, result.id, result.includes)
			});

			//写入文件
			grunt.file.write(path.resolve(dest,'./sea/' + idPrefix + '/' + name + '.js'), output);

			grunt.log.writeln('building component : [' + name + ']' +
				(result.includes.length ? ', deps : [ ' + result.includes.join(' , ') +' ]' : '')
			);
		});

		//生成初始化脚本（添加依赖）
		function generateInitScript(name, initId, includes){
			var script = '\n';
			var	id = idPrefix + '/' + name;
			var includeArr = [],requireArr = [];

			includes.forEach(function(include){
				if(include == '$'){
					includeArr.push("'$'");
					requireArr.push("		require('$');\n		__include__['$'] = $;");
				}else{
					var includePath = idPrefix + '/' + include;
					includeArr.push("'" + includePath + "'");
					requireArr.push("		__include__['"+include+"'] = require('" + includePath + "');");
				}
			});

			script += "if(typeof define == 'function' && define.cmd){\n";
			script += "	define('"+id+"',["+includeArr.join(',')+"],function(require){\n";
			script += requireArr.length ? requireArr.join('\n') + '\n' : '';
			script += "		return __using__('" + initId + "');\n";
			script += '	});\n';
			script += '}';
			return script;
		};

	});
};