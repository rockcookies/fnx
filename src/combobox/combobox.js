var $ = require("$"),
	Overlay = require("overlay/overlay");

var Combobox = Overlay.extend({
	attrs: {
		// 触发元素
		trigger: {
			value: null,
			// required
			getter: function (val) {
				return $(val);
			}
		},

		// 触发类型
		triggerType: 'hover',

		// 延迟触发和隐藏时间
		delay: 70,

		// 是否能够触发
		// 可以通过set('disabled', true)关闭
		disabled: false,

		// 默认的定位参数
    	align: {
			value: {
				baseXY: [0, '100%'],
				selfXY: [0, 0]
			},
			setter: function (val) {
				return this._alignSetter(val);
			},
			getter: function (val) {
				return this._alignGetter(val);
			}
    	}
	},

	_alignSetter: function (val) {
		if (!val) {
			return;
		}
		if (val.baseElement) {
			this._specifiedBaseElement = true;
		} else if (this.activeTrigger) {
			// 若给的定位元素未指定基准元素
			// 就给一个...
			val.baseElement = this.activeTrigger;
		}
		return val;
	},

	_alignGetter: function (val) {
		// 若未指定基准元素，则按照当前的触发元素进行定位
		return $.extend({}, val, this._specifiedBaseElement ? {} : {
			baseElement: this.activeTrigger
		});
	},

	setup: function () {
		Combobox.superclass.setup.call(this);
		this._bindTrigger();
		this._bindBlurHide();
	},

	render: function () {
		Combobox.superclass.render.call(this);

    	// 通过 template 生成的元素默认也应该是不可见的
    	// 所以插入元素前强制隐藏元素
    	this.element.hide();
    	return this;
	},

	show: function () {
		if (this.get('disabled')) {
			return;
		}
		return Combobox.superclass.show.call(this);
	},

	// 除了 element 和 relativeElements，点击 body 后都会隐藏 element
	_blurHide: function (arr) {
		arr = $.makeArray(arr);
		arr.push(this.element);
		this._relativeElements = arr;
		Combobox.blurOverlays.push(this);
	},

	_bindBlurHide: function () {
		this._blurHide(this.get('trigger'));
	},

	_bindTrigger: function () {
		switch (this.get('triggerType')) {
			case 'click':
				this._bindTriggerClick();
			break;
			case 'focus':
				this._bindTriggerFocus();
			break;
			case 'hover':
				this._bindTriggerHover();
			break;
		}
	},

	_bindTriggerClick: function () {
		var that = this;

		bindEvent('click', this.get('trigger'), function (e) {
			// this._active 这个变量表明了当前触发元素是激活状态
			if (this._active === true) {
				that.hide();
			} else {
				// 将当前trigger标为激活状态
				makeActive(this);
				that.show();
			}
		}, this);

		// 隐藏前清空激活状态
		this.before('hide', function () {
			makeActive();
		});

		function makeActive(trigger) {
			if (that.get('disabled')) {
				return;
			}
			that.get('trigger').each(function (i, item) {
				if (trigger == item) {
					item._active = true;
					// 标识当前点击的元素
					that.activeTrigger = $(item);
				} else {
					item._active = false;
				}
			});
		}
	},

	_bindTriggerFocus: function () {
		var that = this;

		bindEvent('focus', this.get('trigger'), function () {
			// 标识当前点击的元素
			that.activeTrigger = $(this);
			that.show();
		}, this);

		bindEvent('blur', this.get('trigger'), function () {
			setTimeout(function () {
				(!that._downOnElement) && that.hide();
				that._downOnElement = false;
			}, that.get('delay'));
		}, this);

		// 为了当input blur时能够选择和操作弹出层上的内容
		this.delegateEvents("mousedown", function (e) {
			this._downOnElement = true;
		});
	},

	_bindTriggerHover: function () {
		var trigger = this.get('trigger'),
			delay = this.get('delay');

		var showTimer, hideTimer,
			that = this;

		// 当 delay 为负数时
		// popup 变成 tooltip 的效果
		if (delay < 0) {
			this._bindTriggerHover();
			return;
		}

		bindEvent('mouseenter', trigger, function () {
			clearTimeout(hideTimer);
			hideTimer = null;

			// 标识当前点击的元素
			that.activeTrigger = $(this);
			showTimer = setTimeout(function () {
				that.show();
			}, delay);
		}, this);

		bindEvent('mouseleave', trigger, leaveHandler, this);

		// 鼠标在悬浮层上时不消失
		this.delegateEvents("mouseenter", function () {
			clearTimeout(hideTimer);
		});

		this.delegateEvents("mouseleave", leaveHandler);

		/*this.element.on('mouseleave', 'select', function (e) {
			e.stopPropagation();
		});*/

		function leaveHandler(e) {
			clearTimeout(showTimer);
			showTimer = null;

			if (that.get('visible')) {
				hideTimer = setTimeout(function () {
					that.hide();
				}, delay);
			}
		}
	},

	_bindTriggerTooltip: function () {
		var trigger = this.get('trigger'),
			that = this;

		bindEvent('mouseenter', trigger, function () {
			// 标识当前点击的元素
			that.activeTrigger = $(this);
			that.show();
		}, this);

		bindEvent('mouseleave', trigger, function () {
			that.hide();
		}, this);
	},

	destroy: function () {
		// 销毁两个静态数组中的实例
		erase(this, Combobox.blurOverlays);
		return Combobox.superclass.destroy.call(this);
	}
});

module.exports = Combobox;

require('class/class-loader').register('combobox/combobox', module.exports);

// Helpers
// -------

// 绑定 blur 隐藏事件
Combobox.blurOverlays = [];
$(document).on('click', function (e) {
	hideBlurOverlays(e);
});

function hideBlurOverlays(e) {
	$(Combobox.blurOverlays).each(function (index, item) {
		// 当实例为空或隐藏时，不处理
		if (!item || !item.get('visible')) {
			return;
		}

		// 遍历 _relativeElements ，当点击的元素落在这些元素上时，不处理
		if (item._relativeElements) {
			for (var i = 0; i < item._relativeElements.length; i++) {
				var el = $(item._relativeElements[i])[0];
				if (el === e.target || $.contains(el, e.target)) {
					return;
				}
			}
		}

		// 到这里，判断触发了元素的 blur 事件，隐藏元素
		item.hide();
	});
}

function bindEvent(type, element, fn, context) {
	context.delegateEvents(element, type, function (e) {
		fn.call(e.currentTarget, e);
	});
}

function erase(target, array) {
	for (var i = 0; i < array.length; i++) {
		if (target === array[i]) {
			array.splice(i, 1);
			return array;
		}
	}
}