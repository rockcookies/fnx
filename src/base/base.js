// Base
// ---------
// Base 是一个基础类，提供 Class、Events、Attrs 和 Aspect 支持。

var Class = require('class/class'),
	Events = require('events/events'),
	Aspect = require('./aspect'),
	Attrs = require('./attrs')
	Lang = require('lang/lang');

module.exports = Class.create({
	Implements: [Events, Aspect, Attrs],

	initialize: function(config) {
		// 初始化 attrs
		this.initAttrs(config);

		// Automatically register `this._onChangeAttr` method as
		// a `change:attr` event handler.
		parseEventsFromInstance(this, this.attrs);
	},

	destroy: function() {
		this.off();

		for (var p in this) {
			if (this.hasOwnProperty(p)) {
				delete this[p];
			}
		}

		// Destroy should be called only once, generate a fake destroy after called
		 this.destroy = function() {};
	}
});


require('class/class-loader').register('base/base', module.exports);

function parseEventsFromInstance(host, attrs) {
	for (var attr in attrs) {
		if (attrs.hasOwnProperty(attr)) {
			var m = '_onChange' + ucfirst(attr);
			if (host[m]) {
				host.on('change:' + attr, host[m]);
			}
		}
	}
}

var ucfirst = Lang.ucfirst;