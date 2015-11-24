var $ = require('$');

require('easing/easing');

var SCROLLX = 'scrollx',
	SCROLLY = 'scrolly';

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