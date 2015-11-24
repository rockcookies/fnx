var $ = require('$'),
	Base = require('base/base'),
	Lang = require('lang/lang'),
	AutoRender = require('./auto-render');

var DELEGATE_EVENT_NS = '.delegate-events-';
var DATA_WIDGET_CID = 'data-widget-cid';
var ON_RENDER = '_onRender';

// 所有初始化过的 Widget 实例
var cachedInstances = {};

var Widget = Base.extend({

	// config 中的这些键值会直接添加到实例上，转换成 properties
	propsInAttrs: ['element', 'events'],

	// 与 widget 关联的 DOM 元素
	element: null,

	// 事件代理，格式为：
	//   {
	//     'mousedown .title': 'edit',
	//     'click {{attrs.saveButton}}': 'save'
	//     'click .open': function(ev) { ... }
	//   }
	events: null,

	// 属性列表
	attrs: {
		// 基本属性
		id: null,
		className: null,
		style: null,

		//i18n
		locale: 'zh-cn',

		// 默认模板
		template: '<div></div>',

		// 默认数据模型
		model: null,

		// 组件的默认父节点
		parentNode: 'body'
	},

	initialize: function(config) {
		// 初始化 cid
		this.cid = Lang.uuid('widget-');

		// 初始化 attrs
		var config = this.__parseDataAttrsConfig(config);
		Widget.superclass.initialize.call(this, config);

		// 初始化属性
		this.initProps();

		// 初始化 element
		this.parseElement();

		// 初始化 events
		this.delegateEvents();

		// 子类自定义的初始化
		this.setup();

		// 保存实例信息
		this.__stamp();

		// 是否由 template 初始化
		this.__isTemplate = !(config && config.element);
	},

	// 提供给子类覆盖的初始化属性方法
	initProps: function() {},

	__parseDataAttrsConfig: function (config) {
		if (config && config.element) {
			return $.extend({}, AutoRender.parseDataApiAttrs(config.element), config);
		} else {
			return config;
		}

	},

	// 构建 this.element
	parseElement: function () {
		var element = this.element;

		if (element) {
			this.element = $(element);

		// 未传入 element 时，从 template 构建
		} else if (this.get('template')) {
			this.parseElementFromTemplate();
		}

		// 如果对应的 DOM 元素不存在，则报错
		if (!this.element || !this.element[0]) {
			throw new Error('element is invalid');
		}
	},

	// 从模板中构建 this.element
	parseElementFromTemplate: function () {
		this.element = $(this.get('template'));
	},

	// 注册事件代理
	delegateEvents: function (element, events, handler) {
		var args = trimRightUndefine(Array.prototype.slice.call(arguments));

		// widget.delegateEvents()
		if (args.length === 0) {
			events =  isFunction(this.events) ? this.events() : this.events;
			element = this.element;


		// widget.delegateEvents({
		//   'click p': 'fn1',
		//   'click li': 'fn2'
		// })
		} else if (args.length === 1) {
			events = element;
			element = this.element;

		// widget.delegateEvents('click p', function(ev) { ... })
		} else if (args.length === 2) {
			handler = events;
			events = element;
			element = this.element;

		// widget.delegateEvents(element, 'click p', function(ev) { ... })
		} else {
			element || (element = this.element);
			this.__delegateElements || (this.__delegateElements = []);
			this.__delegateElements.push($(element));
		}

		// 'click p' => {'click p': handler}
		if (isString(events) && isFunction(handler)) {
			var o = {};
			o[events] = handler;
			events = o;
		}

		// key 为 'event selector'
		for (var key in events) {
			if (!events.hasOwnProperty(key)) continue;

			var result = parseEventKey(key, this);
			var eventType = result.type;
			var selector = result.selector;

			!(function (handler, widget) {
				var callback = function(ev) {
					if (isFunction(handler)) {
						handler.call(widget, ev);
					} else {
						widget[handler](ev)
					}
				}

				// delegate
				if (selector) {
					$(element).on(eventType, selector, callback);
				// normal bind
				// 分开写是为了兼容 zepto，zepto 的判断不如 jquery 强劲有力
				} else {
					$(element).on(eventType, callback);
				}
			})(events[key], this);
		}

		return this;
	},

	// 卸载事件代理
	undelegateEvents: function (element, eventKey) {
		var args = trimRightUndefine(Array.prototype.slice.call(arguments));

		if (!eventKey) {
			eventKey = element;
			element = null;
		}

		// 卸载所有
		// .undelegateEvents()
		if (args.length === 0) {
			var type = DELEGATE_EVENT_NS + this.cid,
				des = this.__delegateElements;

			this.element && this.element.off(type);

			// 卸载所有外部传入的 element
			if (des) {
				for (var de in des) {
					if (!des.hasOwnProperty(de)) continue;
					des[de].off(type);
				}
			}
		} else {
			var result = parseEventKey(eventKey, this);

			// 卸载 this.element
			// .undelegateEvents(events)
			if (!element) {
				this.element && this.element.off(result.type, result.selector);

			// 卸载外部 element
			// .undelegateEvents(element, events)
			} else {
				$(element).off(result.type, result.selector)
			}
		}

		return this;
	},

	// 提供给子类覆盖的初始化方法
	setup: function() {},

	// 将 widget 渲染到页面上
	// 渲染不仅仅包括插入到 DOM 树中，还包括样式渲染等
	// 约定：子类覆盖时，需保持 `return this`
	render: function () {
		// 让渲染相关属性的初始值生效，并绑定到 change 事件
		if (!this.rendered) {
			this._renderAndBindAttrs();
			this.rendered = true;
		}

		// 插入到文档流中
		var parentNode = this.get('parentNode');

		if (parentNode && !isInDocument(this.element[0])) {
			this.element.appendTo(parentNode);
		}

		return this;
	},

	  // 让属性的初始值生效，并绑定到 change:attr 事件上
	_renderAndBindAttrs: function() {
		var widget = this
		var attrs = widget.attrs

		for (var attr in attrs) {
			if (!attrs.hasOwnProperty(attr)) continue
			var m = ON_RENDER + ucfirst(attr)

			if (this[m]) {
				var val = this.get(attr)

				// 让属性的初始值生效。注：默认空值不触发
				if (!isEmptyAttrValue(val)) {
					this[m](val, undefined, attr)
				}

				// 将 _onRenderXx 自动绑定到 change:xx 事件上
				(function(m) {
					widget.on('change:' + attr, function(val, prev, key) {
						widget[m](val, prev, key)
					})
				})(m)
			}
		}
	},

	_onRenderId: function(val) {
		this.element.attr('id', val)
	},

	_onRenderClassName: function(val) {
		this.element.addClass(val)
	},

	_onRenderStyle: function(val) {
		this.element.css(val)
	},

	// 让 element 与 Widget 实例建立关联
	__stamp: function() {
		var cid = this.cid;

		this.element.attr(DATA_WIDGET_CID, cid);
		cachedInstances[cid] = this;
	},

	// 在 this.element 内寻找匹配节点
	$: function(selector) {
		return this.element.find(selector);
	},

	destroy: function() {
		this.undelegateEvents();
		delete cachedInstances[this.cid];

		// For memory leak
		if (this.element && this.__isTemplate) {
			this.element.off();
			this.element.remove();
		}

		this.element = null;

		Widget.superclass.destroy.call(this);
	}
});


// For memory leak
$(window).unload(function() {
	for(var cid in cachedInstances) {
		cachedInstances[cid].destroy();
	}
});

// 查询与 selector 匹配的第一个 DOM 节点，得到与该 DOM 节点相关联的 Widget 实例
Widget.query = function (selector) {
	var element = $(selector).eq(0),
		cid = AutoRender.resolveRenderedElmentCid(element);

	if (!cid) {
		element && (cid = element.attr(DATA_WIDGET_CID));
	}

	return cachedInstances[cid]
}

Widget.autoRender = AutoRender.autoRender;
Widget.autoRenderAll = AutoRender.autoRenderAll;
Widget.StaticsWhiteList = ['autoRender'];


module.exports = Widget;

require('class/class-loader').register('widget/widget', Widget);

// Helpers
// ------

var isString = Lang.isString,
	isFunction = Lang.isFunction,
	ucfirst = Lang.ucfirst;

// 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined
function isEmptyAttrValue(o) {
	return o == null || o === undefined;
}

function trimRightUndefine(args) {
	for (var i = args.length - 1; i >= 0; i--) {
		if (args[i] === undefined) {
			args.pop();
		} else {
			break;
		}
	}
	return args;
}

var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/;

function parseEventKey(eventKey, widget) {
	var match = eventKey.match(EVENT_KEY_SPLITTER);
	var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid;

	// 当没有 selector 时，需要设置为 undefined，以使得 zepto 能正确转换为 bind
	var selector = match[2] || undefined;

	return {
		type: eventType,
		selector: selector
	};
}


// Zepto 上没有 contains 方法
var contains = $.contains || function(a, b) {
	//noinspection JSBitwiseOperatorUsage
	return !!(a.compareDocumentPosition(b) & 16);
};

function isInDocument(element) {
	return contains(document.documentElement, element);
}