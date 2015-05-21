var $ = require('$'),
	Widget = require('widget/widget');

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