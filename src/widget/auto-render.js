var $ = require('$'),
	ClassLoader = require('class/class-loader');

var DATA_WIDGET_AUTO_RENDERED = 'data-widget-auto-rendered',
	DATA_WIDGET_RENDERED_ELEMENT_CID = 'data-widget-rendered-element-cid';

// 自动渲染接口，子类可根据自己的初始化逻辑进行覆盖
exports.autoRender = function(config) {
	return new this(config).render();
}

// 根据 data-widget 属性，自动渲染所有开启了 data-api 的 widget 组件
exports.autoRenderAll = function(root, callback) {
	if (typeof root === 'function') {
		callback = root;
		root = null;
	}

	root = $(root || 'body');

	root.find('[data-widget]').each(function(i, element) {
		if (!exports.isDataApiOff(element)) {
			var id = element.getAttribute('data-widget') || '';

			renderWidget(loadClass(id), $(element));
		}
	});

	// 在所有自动渲染完成后，执行回调

	callback && callback();
}

exports.resolveRenderedElmentCid = function (selector) {
	var element = $(selector).eq(0),
		cid;

	element && (cid = element.attr(DATA_WIDGET_RENDERED_ELEMENT_CID));

	return cid;
}

exports.isAutoRendered = function (element) {
	// 已经渲染过
	return $(element).attr(DATA_WIDGET_AUTO_RENDERED) ? true : false;
}

exports.parseDataApiAttrs = function (element) {
	var s = $.trim($(element).attr('widget-options')),
			options = {};

	if (s) {
		if (s.substring(0, 1) != '{'){
			s = '{' + s + '}';
		}
		options = (new Function('return ' + s))();
	}

	return options;
}



var isDefaultOff = $('body').attr('data-api') === 'off';

// 是否没开启 data-api
exports.isDataApiOff = function(element) {
	var elementDataApi = $(element).attr('data-api');

	// data-api 默认开启，关闭只有两种方式：
	//  1. element 上有 data-api="off"，表示关闭单个
	//  2. document.body 上有 data-api="off"，表示关闭所有
	return  elementDataApi === 'off' || (elementDataApi !== 'on' && isDefaultOff);
}

// Helpers
// ------

function loadClass(id){
	return ClassLoader.include(id);
}

function renderWidget(SubWidget, element){
	// 已经渲染过
	if (exports.isAutoRendered(element)) return;

	var config = {
		renderType: 'auto'
	};

	// widget-role 是指将当前的 DOM 作为 role 的属性去实例化，默认的 role 为 element
	var role = element.attr('widget-role');
	config[role ? role : 'element'] = element;

	$.extend(config, exports.parseDataApiAttrs($(element)));

	// 调用自动渲染接口
	var instance = SubWidget.autoRender && SubWidget.autoRender(config);

	// 标记已经渲染过
	element.attr(DATA_WIDGET_AUTO_RENDERED, true);

	if (instance && instance.cid) {
		element.attr(DATA_WIDGET_RENDERED_ELEMENT_CID, instance.cid);
	}
}


