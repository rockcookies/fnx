var gulp = require('gulp');
var fs = require("fs");
var pkg = require('./package.json');
var bowerConfig = JSON.parse(fs.readFileSync(".bowerrc","utf-8"));
var dateformat = require('dateformat');


var GLOBALS = gulp.GLOBALS = {
	banner: '/*!!\n' +
			' * author  : ' + pkg.author + '\n' +
			' * version : ' + pkg.version + '\n' +
			' * date    : '+dateformat(new Date(), 'yyyy-mm-dd')+'\n' +
			' * email   : ' + pkg.email + '\n' +
			' */\n',
	src: {
		less: "view/less", // Less 文件路径
		html: "view/html", // Html 静态模板路径
		js: "src", // Js 文件路径
		assets: "view/assets", // 其他资源路径
		bower: bowerConfig.directory, // bower 目录
		libs: "libs" // 资源目录
	},
	dist: {
		root: "dest", // 发布目录
		html: "dest", // HTML 发布目录
		assets: "dest/assets", // 静态资源发布目录
		css: "dest/assets/css", // CSS 发布目录
		js: "dest/assets/js" // JS 发布目录
	},
	temp: {
		root: ".tmp",// 临时目录
		rev: ".tmp/rev", // rev 临时文件目录
		js: ".tmp/js" // js 临时文件目录
	},

	ejs: {
		options: {}// EJS 变量
	},

	server: {
		port: 3000, // 服务器端口
		startPath: '/pagination.html' // 首页
	},

	autoprefixer: { // CSS autoprefixer 配置
		browsers: [
			"Android 2.3",
			"Android >= 4",
			"Chrome >= 20",
			"Firefox >= 24",
			"Explorer >= 6",
			"iOS >= 6",
			"Opera >= 12",
			"Safari >= 6"
		]
	},

	isRevsion: false, // 是否启动 revison 版本控制
	isMinifyHtml: false, // 是否开启压缩 html
	isMinifyCss: false, // 是否开启压缩 CSS
	isCssSourceMap: true, // 是否生成 CSS source map
	isMinifyJs: false, // 是否开启压缩 JS
	isJsSourceMap: true // 是否生成 JS source map
};

require('require-dir')('./gulp');

gulp.task('default', function () {
	GLOBALS.isRevsion = false;
	GLOBALS.isMinifyHtml = false;
	GLOBALS.isMinifyCss = true;
	GLOBALS.isCssSourceMap = false;
	GLOBALS.isMinifyJs = true;
	GLOBALS.isJsSourceMap = false;

    gulp.start('build');
});