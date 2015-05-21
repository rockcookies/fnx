'use strict';

var tasks = require('./tasks/tasks.js');

var globalModules = {

};

var banner = '/**\n\
name    : <%= pkg.name %>\n\
author  : <%= pkg.author %>\n\
version : <%= pkg.version %>\n\
email   : <%= pkg.email %>\n\
**/\n\n';

module.exports = function(grunt) {
	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
		pkg : pkg,
		meta : {
			banner : banner
		},
		fnxpack : {
			options : {
				base : './src',
				banner : '<%= meta.banner %>',
				namespace : 'FNX',
				idPrefix : 'fnx/cmp',
				globalModules : pkg.modules
			},
			'all' : {
				dest : './dest/fnx-pack.js'
			},
			'switchable': {
				modules : ['switchable/switchable', 'switchable/carousel', 'switchable/slide'],
                dest: './dest/fnx-switchable.js'
            }
		},
		uglify: {
            options: {
                banner: '<%= meta.banner %>',
                mangle : {
					except : ['require']
				}
            },
            'all': {
                src: './dest/fnx-pack.js',
                dest: './dest/fnx-pack-min.js'
            },
            'switchable': {
            	src: './dest/fnx-switchable.js',
                dest: './dest/fnx-switchable-min.js'
            }
        },
		fnxbuild : {
			options : {
				base : './src',
				banner : '<%= meta.banner %>',
				idPrefix : 'fnx/cmp',
				globalModules : pkg.modules
			},
			'all' : {
				dest : './dest/'
			}
		},
        watch : {
			options: {
				livereload: true
			},
	        fnx : {
				files : ['./src/**/*.*'],
	        	tasks : ['default']
	        }
        },
		express: {
			dev: {
				options: {
					script: 'app.js'
				}
			}
        }

    });

	tasks.regist(grunt);
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');

	grunt.registerTask('default', ['fnxpack','uglify','fnxbuild']);
	grunt.registerTask('debug', ['express','watch']);
};