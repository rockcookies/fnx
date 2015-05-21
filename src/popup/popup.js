var $ = require('$'),
    Overlay = require('overlay/overlay'),
    OverlayMask = require('overlay/mask');

var mask = null;

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
		zIndex: 999,

		// 简单的动画效果 none | fade
		effect: 'none',

		// 默认定位左右居中，略微靠上
		align: {
			value: {
					selfXY: ['50%', '50%'],
					baseXY: ['50%', '42%']
			},
			getter: function (val) {
				// 高度超过窗口的 42/50 浮层头部顶住窗口
				// https://github.com/aralejs/dialog/issues/41
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
		this.element.remove();
		this._hideMask();
		return Popup.superclass.destroy.call(this);
	},

	setup: function () {
		//加载全局遮罩
		if (!mask) {
			mask = new OverlayMask();
			//设置Mask的tabindex
			toTabed(mask.element,0);
		}

		Popup.superclass.setup.call(this);

		this._setupMask();
		this._setupFocus();
		toTabed(this.element);
	},

	// 绑定遮罩层事件
	_setupMask: function () {
		var that = this;

		// 存放 mask 对应的对话框
		mask._dialogs = mask._dialogs || [];

		this.after('show', function () {
			if (!this.get('hasMask')) {
				return;
			}
			// not using the z-index
			// because multiable dialogs may share same mask
			mask.set('zIndex', that.get('zIndex'))
				.set('backgroundColor', that.get('maskBackgroundColor'))
				.set('backgroundOpacity', that.get('maskBackgroundOpacity'))
				.show();
			mask.element.insertBefore(that.element);

			// 避免重复存放
			var existed;
			for (var i=0; i<mask._dialogs.length; i++) {
				if (mask._dialogs[i] === that) {
					existed = mask._dialogs[i];
				}
			}
			if (existed) {
				// 把已存在的对话框提到最后一个
				erase(existed, mask._dialogs);
				mask._dialogs.push(existed);
			} else {
				// 存放新的对话框
				mask._dialogs.push(that);
			}
		});

		this.after('hide', this._hideMask);
	},

	// 隐藏 mask
	_hideMask: function () {
		if (!this.get('hasMask')) {
			return;
		}

		// 移除 mask._dialogs 当前实例对应的 dialog
		var dialogLength = mask._dialogs ? mask._dialogs.length : 0;
		for (var i=0; i<dialogLength; i++) {
			if (mask._dialogs[i] === this) {
				erase(this, mask._dialogs);

				// 如果 _dialogs 为空了，表示没有打开的 dialog 了
				// 则隐藏 mask
				if (mask._dialogs.length === 0) {
					mask.hide();
				}
				// 如果移除的是最后一个打开的 dialog
				// 则相应向下移动 mask
				else if (i === dialogLength - 1) {
					var last = mask._dialogs[mask._dialogs.length - 1];
					mask.set('zIndex', last.get('zIndex'));
					mask.element.insertBefore(last.element);
				}
			}
		}
	},

	// 绑定元素聚焦状态
	_setupFocus: function () {
		this.after('show', function () {
			this.element.focus();
		});
	},

	// onRender
	//---
	_onRenderVisible: function (val) {
		if (val) {
			if (this.get('effect') === 'fade') {
				// 固定 300 的动画时长，暂不可定制
				this.element.fadeIn(300);
			} else {
				this.element.show();
			}
		} else {
			this.element.hide();
		}
	}
})


module.exports = Popup;

// Helpers
// ----

// 让目标节点可以被 Tab
function toTabed(element, num) {
	num = parseInt(num);
	element.attr('tabindex', isNaN(num) ? -1 : num);
}

// erase item from array
function erase(item, array) {
	var index = -1;
	for (var i=0; i<array.length; i++) {
		if (array[i] === item) {
			index = i;
			break;
		}
	}
	if (index !== -1) {
		array.splice(index, 1);
	}
}