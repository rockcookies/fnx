var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
/*var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');*/
var fixedDirectoryDescriptionFilePlugin = require('webpack-bower-resolver');
var GLOBALS = require('gulp').GLOBALS;

function getEntry() {
	var entry = {},
		src = path.resolve(GLOBALS.src.js);

	glob.sync(path.join(GLOBALS.src.js, '**/*.main.js')).forEach(function (name) {
		var key = path.relative(src, path.resolve(name));
		key = key.replace(/\.main.js$/, '');
		entry[key] = './' + key.replace(/\\/, '/') + '.main.js';
	});

	return entry;
}

function generateConfig () {
	var config = {
		cache: true,
		context:  path.resolve(GLOBALS.src.js),
		entry: getEntry(),

		resolve: {
			alias: {},
			root: path.resolve(GLOBALS.src.js),
			modulesDirectories: [path.resolve(GLOBALS.src.bower), path.resolve(GLOBALS.src.libs)]
		},

		module: {
			loaders: [
				{ test: /(swiper)/, loader: "imports?define=>false&this=>window" }
			]
		},

		plugins: [
			//new webpack.ProvidePlugin({})
			/*new webpack.ResolverPlugin(
				new fixedDirectoryDescriptionFilePlugin('bower.json', ['main'])
			),*/
			new webpack.BannerPlugin(GLOBALS.banner, {
				raw: true
			})
		],
		output: {
			path: path.resolve(GLOBALS.dist.js),
			filename: '[name].min.js'
		}
	};

	if (GLOBALS.isMinifyJs) {
		config.plugins.push(new webpack.optimize.UglifyJsPlugin({
			comments: /^!!|@preserve|@license/
		}));
	}

	if (GLOBALS.isJsSourceMap) {
		config.devtool = 'source-map';
		config.output.sourceMapFilename = '[file].map';
	}

	return config;
}


module.exports = generateConfig;