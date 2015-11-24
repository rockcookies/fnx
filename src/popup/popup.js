var $ = require('$'),
    Overlay = require('overlay/overlay'),
    PopupMask = require('overlay/mask');

// Popup
// ---
// Popup 是通用弹出层组件，提供遮罩层、内容区域自定义功能。
// 是所有弹出层类型组件的基类。

var Popup = Overlay.extend({
	attrs : {
		// 是否有背景遮罩层
		hasMask: false,

		// 设置遮罩背景颜色
		maskBackgroundColor: '#000',

		// 设置遮罩透明度
		maskBackgroundOpacity: 0.2,

		// 默认宽度
		width: null,

		// 默认高度
		height: null,

		// 不用解释了吧
		zIndex: {
			value: null,
			getter: function (val) {
				return val === null ? Popup.zIndex : val;
			}
		},

		// 是否支持自动聚焦
		autofocus: true,

		// 默认定位左右居中，略微靠上
		align: {
			value: {
					selfXY: ['50%', '50%'],
					baseXY: ['50%', '42%']
			},
			getter: function (val) {
				// 高度超过窗口的 42/50 浮层头部顶住窗口
				if (this.element.height() > $(window).height() * 0.84) {
					return {
						selfXY: ['50%', '0'],
						baseXY: ['50%', '0']
					};
				}
				return val;
			}
		}
	},

	destroy: function () {
		if (Popup.current === this) {
            Popup.current = null;
        }
		this.element.remove();
		return Popup.superclass.destroy.call(this);
	},

	setup: function () {
		this._setupPopup();
		this._setupFocus();
		this._setupMask();

		Popup.superclass.setup.call(this);
	},

	// 初始化弹出层
	_setupPopup: function () {
		toTabed(this.element, -1);
	},

	_setupMask: function () {
		this.after('show', function () {
			this.get('hasMask') && this._showMask();
		});

		this.after('hide', function () {
			this.get('hasMask') && this._hideMask();
		});

		this.before('destroy', function () {
			this._mask && this._mask.destroy();
			this._mask = null;
		});
	},

	_showMask: function () {
		if (!this._mask) {
			this._mask = this._createMask();
			this._mask.element.insertBefore(this.element);
		}

		this._mask.set('zIndex', this.get('zIndex'));
		this._mask.show();
	},

	_hideMask: function () {
		this._mask && this._mask.hide();
	},

	// 绑定元素聚焦状态
	_setupFocus: function () {
		this.before('show', function () {
			this.__activeElement = getActiveElement();
		});
		this.after('show', function () {
			this.get('autofocus') && this.focus();
		});
	},

	_createMask: function () {
		var mask = new PopupMask();
		//设置Mask的tabindex
		toTabed(mask.element, 0);

		mask.set('backgroundColor', this.get('maskBackgroundColor'));
		mask.set('backgroundOpacity', this.get('maskBackgroundOpacity'));
		mask.element.on('focus', $.proxy(this.focus, this));

		return mask;
	},

	/** 是不是顶层 */
	isTop: function () {
		return Popup.current === this;
	},

	/** 让浮层获取焦点 */
	focus: function () {
		var current = Popup.current;
		var index = Popup.zIndex++;

		if (current && current !== this) {
			current.blur(false);
        }

		// 检查焦点是否在浮层里面
		if (!$.contains(this.element[0], getActiveElement())) {
			var autofocus = this.element.find('[autofocus]')[0];

			if (!this._autofocus && autofocus) {
				this._autofocus = true;
			} else {
				autofocus = this.element[0];
			}
			this._focus(autofocus);
		}


		Popup.current = this;
		this.set('zIndex', index);
	},

	/** 让浮层失去焦点。将焦点退还给之前的元素，照顾视力障碍用户 */
	blur: function () {
		var activeElement = this.__activeElement;
		var isBlur = arguments[0];

		if (isBlur !== false) {
			this._focus(activeElement);
		}

		this._autofocus = false;
	},

	_focus: function (elem) {
		// 防止 iframe 跨域无权限报错
        // 防止 IE 不可见元素报错
        try {
            // ie11 bug: iframe 页面点击会跳到顶部
            if (this.get('autofocus') && !/^iframe$/i.test(elem.nodeName)) {
                elem.focus();
            }
        } catch (e) {}
	}
})


module.exports = Popup;

require('class/class-loader').register('popup/popup', module.exports);

/** 当前叠加高度 */
Popup.zIndex = 1024;

/** 顶层浮层的实例 */
Popup.current = null;

// Helpers
// ----

// 让目标节点可以被 Tab
function toTabed(element, num) {
	num = parseInt(num);
	element.attr('tabindex', isNaN(num) ? -1 : num);
}

function getActiveElement () {
	try {// try: ie8~9, iframe #26
		var activeElement = document.activeElement;
		var contentDocument = activeElement.contentDocument;
		var elem = contentDocument && contentDocument.activeElement || activeElement;
		return elem;
	} catch (e) {}
}