/**
name    : FNX-UI
author  : by FNX-UI Team
version : 0.0.2
email   : hqy321@gmail.com
**/


/**===============================
component : switchable/switchable
===============================**/

!(function (window) {
var __modules__ = {},__include__ = {};

function __using__ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], __using__, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function __namespace__ (path, fn) {
    __modules__[path] = fn;
}




__namespace__('switchable/basic/switchable-basic',function(__using__,exports,module){

var $ = __include__["$"],
	Widget = __include__["widget/widget"];

var SwitchableBasic = Widget.extend({
	attrs: {
		// 用户传入的 triggers，可以是 Selector、jQuery 对象
		triggers: {
			value : null,
			getter : function (val) {
				return $(val);
			}
		},

		// 用户传入的 panels，可以是 Selector、jQuery 对象
		panels: {
			value : null,
			getter : function (val) {
				return $(val);
			}
		},

		//样式前缀
		classPrefix: 'ui-switchable',

		// 是否包含 triggers，用于没有传入 triggers 时，是否自动生成的判断标准
		hasTriggers: true,

		// 触发类型 hover 或者是 click
		triggerType: 'hover',

		// 触发延迟
		delay: 100,

		// 初始切换到哪个面板
		activeIndex: {
			value : 0,
			setter : function (val) {
				return parseInt(val) || 0;
			}
		},

		// 步进值
		step: 1,

		// 有多少屏
		length: {
			readOnly : true,
			getter : function () {
				var panels = this.get('panels');

				if (panels.length) {
					return Math.ceil(panels.length / this.get('step'));
				} else {
					return 0;
				}
			}
		},

		// 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
		viewSize: null,

		activeTriggerClass: {
			getter: function (val) {
				return val ? val : this.get("classPrefix") + '-active';
			}
		}
	},

	setup: function () {
		SwitchableBasic.superclass.setup.call(this);

		this._initConstClass();
		this._initElement();

		var role = this._getDatasetRole();
		this._initPanels(role);
		// 配置中的 triggers > dataset > 自动生成
		this._initTriggers(role);
		this._bindTriggers();
		this._initEffect();
	},

	_initConstClass: function () {
		this.CONST = constClass(this.get('classPrefix'));
	},

	_initElement: function () {
		this.element.addClass(this.CONST.UI_SWITCHABLE);
	},

	_parseDatasetRole: function (roles) {
		var self = this,
			role = {};

		for (var i = 0; i < roles.length; i++) {
			var key = roles[i];
			var elems = self.$('[data-role=' + key + ']');
			if (elems.length) {
				role[key] = elems;
			}
		}

		return role;
	},

	// 从 HTML 标记中获取各个 role, 替代原来的 markupType
	_getDatasetRole: function () {
		return this._parseDatasetRole(['trigger', 'panel', 'nav', 'content'])
	},

	//初始化面板
	_initPanels: function (role) {
		var panels = this.get('panels');

		// 先获取 panels 和 content
		if (panels.length > 0) {
			//Do nothing
		} else if (role.panel) {
			this.set('panels', panels = role.panel);
		} else if (role.content) {
			this.set('panels', panels = role.content.find('> *'));
			this.content = role.content;
		}

		if (!this.content) {
			this.content = panels.parent();
		}

		this.content.addClass(this.CONST.CONTENT_CLASS)
	},

	//初始化触发器
	_initTriggers: function (role) {
		var triggers = this.get('triggers');

		// 再获取 triggers 和 nav
		if (triggers.length > 0) {}
		// attr 里没找到时，才根据 data-role 来解析
		else if (role.trigger) {
			this.set('triggers', triggers = role.trigger);
		} else if (role.nav) {
			triggers = role.nav.find('> *');

			// 空的 nav 标记
			if (triggers.length === 0) {
				triggers = generateTriggersMarkup(
						this.get('length'),
						this.get('activeIndex'),
						this.get('activeTriggerClass'),
						true
					).appendTo(role.nav);
			}
			this.set('triggers', triggers);

			this.nav = role.nav;
		}
		// 用户没有传入 triggers，也没有通过 data-role 指定时，如果
		// hasTriggers 为 true，则自动生成 triggers
		else if (this.get('hasTriggers')) {
			this.nav = generateTriggersMarkup(
					this.get('length'),
					this.get('activeIndex'),
					this.get('activeTriggerClass')
				).appendTo(this.element);

			this.set('triggers', triggers = this.nav.children());
		}

		if (!this.nav && triggers.length) {
			this.nav = triggers.parent();
		}

		this.nav && this.nav.addClass(this.CONST.NAV_CLASS);
		triggers.addClass(this.CONST.TRIGGER_CLASS).each(function (i, trigger) {
			$(trigger).data('value', i);
		});
	},

	_bindTriggers: function () {
		var that = this,
			triggers = this.get('triggers'),
			type = this.get('triggerType').
			switchTimer = null;

		if (type === 'click') {
			triggers.click(function () {
				that.switchTo($(this).data('value'));
			});
		}
		// hover
		else {
			triggers.hover(
				function () {
					var _that = this;
					switchTimer = setTimeout(function () {
						that.switchTo($(_that).data('value'));
					}, that.get('delay'));
				}, function () {
					clearTimeout(switchTimer);
				}
			);
		}
	},

	// 初始化效果
	_initEffect: function () {
		this.get('panels').hide();
	},

	// change 事件触发的前提是当前值和先前值不一致, 所以无需验证 toIndex !== fromIndex
	_onRenderActiveIndex: function (toIndex, fromIndex) {
		this._switchTo(toIndex, fromIndex);
	},

	// 切换的内部实现
	_switchTo: function (toIndex, fromIndex) {
		this.trigger('switch', toIndex, fromIndex);
		this._switchTrigger(toIndex, fromIndex);
		this._switchPanel(toIndex, fromIndex);
	},

	_switchTrigger: function (toIndex, fromIndex) {
		var triggers = this.get('triggers');
		if (triggers.length < 1)
			return;

		triggers.eq(fromIndex).removeClass(this.get('activeTriggerClass'));
		triggers.eq(toIndex).addClass(this.get('activeTriggerClass'));
	},

	_switchPanel: function (toIndex, fromIndex) {
		var panelInfo = this._getPanelInfo(toIndex, fromIndex);
		// 默认是最简单的切换效果：直接隐藏/显示
		panelInfo.fromPanels.hide();
		panelInfo.toPanels.show();
	},

	_getPanelInfo: function (toIndex, fromIndex) {
		var panels = this.get('panels').get();
		var step = this.get('step');

		var fromPanels,
			toPanels;

		// 初始情况下 fromIndex 为 undefined
		if (fromIndex > -1) {
			fromPanels = panels.slice(fromIndex * step, (fromIndex + 1) * step);
		}

		toPanels = panels.slice(toIndex * step, (toIndex + 1) * step);

		return {
			toIndex: toIndex,
			fromIndex: fromIndex,
			toPanels: $(toPanels),
			fromPanels: $(fromPanels)
		};
	},

	// 切换到指定 index
	switchTo: function (toIndex) {
		this.set('activeIndex', toIndex);
	},

	// 切换到上一视图
	prev: function () {
		//  设置手工向后切换标识, 外部调用 prev 一样
		//this._isBackward = true;
		var fromIndex = this.get('activeIndex');
		// 考虑循环切换的情况
		var index = (fromIndex - 1 + this.get('length')) % this.get('length');
		this.switchTo(index);
	},

	// 切换到下一视图
	next: function () {
		//this._isBackward = false;

		var fromIndex = this.get('activeIndex');
		var index = (fromIndex + 1) % this.get('length');
		this.switchTo(index);
	}
});

module.exports = SwitchableBasic;

// Helpers
// -------
function generateTriggersMarkup(length, activeIndex, activeTriggerClass, justChildren) {
	var nav = $('<ul>');

	for (var i = 0; i < length; i++) {
		var className = i === activeIndex ? activeTriggerClass: '';

		$('<li>', {
			'class': className,
			'html': '<span>' + (i + 1) + '</span>'
		}).appendTo(nav);
	}

	return justChildren ? nav.children(): nav;
}

// 内部默认的 className

function constClass(classPrefix) {
	return {
		UI_SWITCHABLE: classPrefix || '',
		NAV_CLASS: classPrefix ? classPrefix + '-nav': '',
		CONTENT_CLASS: classPrefix ? classPrefix + '-content': '',
		TRIGGER_CLASS: classPrefix ? classPrefix + '-trigger': '',
		PANEL_CLASS: classPrefix ? classPrefix + '-panel': ''
	}
}

});

__namespace__('switchable/basic/effects',function(__using__,exports,module){

var $ = __include__["$"],
	Easing = __include__["easing/easing"];


var SCROLLX = 'scrollx',
	SCROLLY = 'scrolly',
	FADE = 'fade';

var Effects = module.exports = {};

//==============================================
// 默认是最简单的切换效果：直接隐藏/显示
//==============================================
Effects.none = {
	initEffect: function () {
		var panels = this.get('panels');

		if (panels.length > this.get('step')) {
			panels.hide();
		} else {
			return false;
		}
	},

	switchPanel: function (panelInfo) {
		panelInfo.fromPanels.hide();
		panelInfo.toPanels.show();
	}
};

//==============================================
// 淡隐淡现效果
//==============================================
Effects.fade = {
	initEffect: function () {
		var panels = this.get('panels'),
			step = this.get('step');
		// 不支持 step > 1 的情景。若需要此效果时，可修改结构来达成。
		if (step > 1 || panels.length <= step) {
			//throw new Error('Effect "fade" only supports step === 1');
			return false;
		}
		// 初始化
		else {
			panels.css({
				position: 'absolute',
				opacity: 0,
				zIndex: 1
			}).show();
		}
	},

	switchPanel: function (panelInfo) {
		var fromPanel = panelInfo.fromPanels.eq(0),
			toPanel = panelInfo.toPanels.eq(0),
			that = this;

		// 立刻停止，以开始新的
		this.anim && this.anim.stop(false, true);

		// 首先显示下一张
		toPanel.css('opacity', 1);
		toPanel.show();

		if (panelInfo.fromIndex > -1) {
			// 动画切换
			this.anim = fromPanel.animate({
				opacity: 0
			}, this.get('duration'), this.get('easing'), function () {
				that.anim = null; // free
				// 切换 z-index
				toPanel.css('zIndex', 9);
				fromPanel.css('zIndex', 1);
				fromPanel.css('display', 'none');

				that.trigger('switched', panelInfo.toIndex, panelInfo.fromIndex);
			});
		}
		// 初始情况下没有必要动画切换
		else {
			toPanel.css('zIndex', 9);
			this.trigger('switched', panelInfo.toIndex, panelInfo.fromIndex);
		}
	}
};

//==============================================
// 滚动效果
//==============================================
Effects.__scroll = {
	initPanels: function () {
		this.before('next', function () {
			this._forceNext = true;
		});

		this.before('prev', function () {
			this._forcePrev = true;
		});

		this.after('_switchTo', function () {
			this._forceNext = this._forcePrev = undefined;
		});

		var panels = this.get('panels'),
			step = this.get('step'),
			size = this.get('size'),
			circular = this.get('circular'),
			panelsLength = panels.length;

		//clone条件判断
		if (
			// 尺寸不足一屏，或是不足一个步长，则不执行clone操作
			panelsLength <= size || panelsLength <= step ||

			// 不循环，则不执行clone操作
			!circular ||

			// 简单的情况，则不执行clone操作
			(step == size && panelsLength % step == 0)
		) return;

		//补足
		this._clonePanels = panels.slice(0, size + 1).clone(true).addClass(this.get('classPrefix') + '-clone');
		panels.last().after(this._clonePanels);
	},

	initEffect: function () {
		var panels = this.get('panels'),
			step = this.get('step'),
			size = this.get('size'),
			effect = this.get('effect'),
			content = this.content,
			firstPanel = panels.eq(0);


		if (panels.length <= size || panels.length <= step) {
			return false;
		}

		// 设置定位信息，为滚动效果做铺垫
		content.css('position', 'relative');

		// 注：content 的父级不一定是 container
		if (content.parent().css('position') === 'static') {
			content.parent().css('position', 'relative');
		}

		// 水平排列
		if (effect === SCROLLX) {
			panels.css('float', 'left');
			this._clonePanels && this._clonePanels.css('float', 'left');
			// 设置最大宽度，以保证有空间让 panels 水平排布，35791197px 为 360 下 width 最大数值
			content.width('35791197px');
		}

		// 只有 scrollX, scrollY 需要设置 viewSize
		// 其他情况下不需要
		var viewSize = this.get('viewSize');
		if (!viewSize) {
			viewSize = [],
			viewSize[0] = firstPanel.outerWidth(),
			viewSize[1] = firstPanel.outerHeight();
			this.set('viewSize', viewSize);
		}


		if (!viewSize) {
			throw new Error('Please specify viewSize manually');
		}
	},

	switchPanel: function (panelInfo) {
		var isX = this.get('effect') === SCROLLX,
			viewsize = this.get('viewSize')[isX ? 0 : 1],
			fn = null;

		// 开始动画前，先停止掉上一动画
		this.anim && this.anim.stop(false, true);

		if (this.get('circular')) {
			fn = scrollCarousel;
		} else {
			fn = scrollSlide;
		}

		fn.call(this, panelInfo, isX, viewsize);
	}
};

Effects[SCROLLX] = Effects[SCROLLY] = Effects.__scroll;


// Helpers
// -------

function scrollSlide (panelInfo, isX, viewsize) {
	var props = {};
	props[isX ? 'left' : 'top'] = -(viewsize * panelInfo.toIndex * this.get('step')) + 'px';

	if (panelInfo.fromIndex > -1) {
		var that = this;

		this.anim = this.content.animate(props, this.get('duration'), this.get('easing'), function () {
			that.anim = null; // free
			that.trigger('switched', panelInfo.toIndex, panelInfo.fromIndex);
		});
	}
	else {
		this.content.css(props);
		this.trigger('switched', panelInfo.toIndex, panelInfo.fromIndex);
	}
};

function scrollCarousel (panelInfo, isX, viewsize) {
	var prop = isX ? 'left' : 'top',
		step = this.get('step'),
		toIndex = panelInfo.toIndex,
		fromIndex = panelInfo.fromIndex,
		len = this.get('length'),
		panels = this.get('panels'),
		props = {};

	props[prop] = -(viewsize * toIndex * step) + 'px';

	// 开始动画
	if (fromIndex > -1) {
		var that = this;

		// 0 -> len-1
		var isPrevCritical = fromIndex === 0 && toIndex === len - 1 && this._forcePrev;
		// len-1 -> 0
		var isNextCritical = fromIndex === len - 1 && toIndex === 0 && this._forceNext;


		if (isPrevCritical || isNextCritical) {
			scrollCarouselCritical.call(this, panelInfo, isNextCritical, prop, viewsize);
		}
		// 直接执行动画
		else {
			this.anim = this.content.animate(props, this.get('duration'), this.get('easing'), function () {
				that.anim = null; // free
				that.trigger('switched', toIndex, fromIndex);
			});
		}
	}
	// 初始化
	else {
		this.content.css(props);
		this.trigger('switched', toIndex, fromIndex);
	}
};


function scrollCarouselCritical (panelInfo, isNext, prop, viewsize) {
	var that = this,
		toPanels = panelInfo.toPanels,
		step = this.get('step'),
		size = this.get('size'),
		panels = this.get('panels'),
		panelsLength = panels.length,
		props = {},
		resetOffset = 0,
		isSimple = size == step && panelsLength % step == 0,
		fullLength = viewsize * panelsLength;

	// len-1 -> 0
	if (isNext) {
		// 把 0 的面板移动到 len-1 的后面
		if (isSimple) {
			toPanels.css('position', 'relative').css(prop, fullLength + 'px');
		}

		// 设置滚动到 len
		props[prop] = -fullLength + 'px';
		// 动画结束后设置到 0 的位置
		resetOffset = '0px';
	}
	// 0 -> len-1
	else {
		var lenMinus1Diff =  (panelsLength - (panelsLength % step || step)) * viewsize;

		// 把 len-1 的面板移动到 0 的前面
		if (isSimple) {
			toPanels.css('position', 'relative').css(prop, -fullLength + 'px');

			// 设置滚动到 -1 的位置
			props[prop] = (step * viewsize) + 'px';

			// 动画结束后设置到 len-1 的位置
			resetOffset = -lenMinus1Diff + 'px';
		}
		// clone 的模式下
		else {
			// 设置到 len 的位置
			this.content.css(prop, -fullLength + 'px');

			// 设置滚动到 len-1 的位置
			props[prop] = -lenMinus1Diff + 'px';
		}
	}

	this.anim = this.content.animate(props, this.get('duration'), this.get('easing'), function () {
		isSimple && toPanels.css(prop, '0px');
		resetOffset && that.content.css(prop, resetOffset);

		that.anim = null; // free
		that.trigger('switched', panelInfo.toIndex, panelInfo.fromIndex);
	});
}

});

__namespace__('switchable/switchable',function(__using__,exports,module){

var $ = __include__["$"],
	SwitchableBasic = __using__("switchable/basic/switchable-basic"),
	Effects = __using__("switchable/basic/effects");

var Switahable = SwitchableBasic.extend({
	attrs: {
		// 自动播放标记
		autoplay: false,

		// 自动播放的间隔时间
		interval: 5000,

		// 是否循环播放
		circular: false,

		// 循环模式是旋转木马还是幻灯片 slide，carousel
		circularMode: 'carousel',

		// 动画效果
		effect: {
			value : 'none',
			setter: function (val) {
				return Effects[val] ? val.toLowerCase() : 'none';
			}
		},

		// 缓动函数
		easing: 'linear',

		// 动画时长
		duration: 500,

		// 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
		viewSize: null,

		// 可视窗口有多少个显示面板
		size: 1,

		// 步长不能超过 size
		step: {
			value: 1,
			getter: function (val) {
				var size = this.get('size');
				return val > size ? size : val;
			}
		}
	},

	events: {
		'mouseenter': function () {
			if (this.get('autoplay')) {
				this.stop();
				this._mouseEnterStop = true;
			}
		},
		'mouseleave': function () {
			if (this._mouseEnterStop) {
				this._mouseEnterStop = false;
				this.start();
			}
		}
	},

	//初始化面板
	_initPanels: function (role) {
		Switahable.superclass._initPanels.call(this, role);
		var panels = this._effectFunction('initPanels').call(this, this.get('panels'));

		if (panels) {
			this.set('panels', panels);
		}
	},

	// 初始化效果
	_initEffect: function () {
		if (this._effectFunction('initEffect').call(this) === false) {
			this._ineffective = true;
		}
	},

	_effectFunction: function (fn) {
		var ef = Effects[this.get('effect')];
		if (!ef) return $.noop;
		return ef[fn] ? ef[fn] : $.noop;
	},

	//切换面板
	_switchPanel: function (toIndex, fromIndex) {
		if (this.ineffective) return;

		var panelInfo = this._getPanelInfo(toIndex, fromIndex);
		this._effectFunction('switchPanel').call(this, panelInfo);
	},

	_onRenderAutoplay: function (auto) {
		var that = this,
			interval = this.get('interval');

		if (auto) {
			stopTimer();
			that._autoplayTimer = setInterval(function () {
				if (!that._autoplayTimer) return;
				that.next();
			}, interval)
		} else {
			stopTimer();
		}

		function stopTimer () {
			if (that._autoplayTimer) {
				clearInterval(that._autoplayTimer);
				that._autoplayTimer = null;
			}
		}
	},

	start: function () {
		this.set('autoplay', true);
	},

	stop: function () {
		this.set('autoplay', false);
	},

	destroy: function () {
		this._effectFunction('destroy').call(this);
	}
});

module.exports = Switahable;

// Helpers
// -------

});


if(typeof define == 'function' && define.cmd){
	define('fnx/cmp/switchable/switchable',['$','fnx/cmp/widget/widget','fnx/cmp/easing/easing'],function(require){
		require('$');
		__include__['$'] = $;
		__include__['widget/widget'] = require('fnx/cmp/widget/widget');
		__include__['easing/easing'] = require('fnx/cmp/easing/easing');
		return __using__('switchable/switchable');
	});
}


})(window);