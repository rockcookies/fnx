var $ = require("$"),
	Combobox = require("combobox/combobox"),
	Templatable = require('templatable/templatable');

var Poptip = Combobox.extend({
	// implements: Templatable
	Implements: Templatable,

	attrs: {
		// 模板
	    template: require('html!./poptip/poptip.tpl'),

		// 统一样式前缀
		classPrefix: 'ui-poptip',

		// 提示内容
		content: 'A TIP BOX',

		// 主题 [ui-poptip-yellow|ui-poptip-blue|ui-poptip-white]
		skin : 'ui-poptip-yellow',

		// 提示框位置
		tipPosition: 'bottom left',

		// 提示框离目标距离(px)
		distance: 8,

		// 箭头偏移位置(px)，负数表示箭头位置从最右边或最下边开始算
		arrowShift: 0,

		// 是否有关闭的提示
		closable: false,

		model: {
			getter: function(){
				return this._createModel()
			}
		}
	},

	events: {
		'click [data-role=close]': function (e) {
			e.preventDefault();
			this.hide();
		}
	},

	_alignGetter: function (val) {
		if (!this._specifiedAlign) {
			val = calculateAlign(this.get('tipPosition'), this.get('distance'), this.get('arrowShift'));
		}

		return Poptip.superclass._alignGetter.call(this, val);
	},

	_alignSetter: function (val) {
		this._specifiedAlign = true;
		return Poptip.superclass._alignSetter.call(this, val);
	},

	_createModel: function () {
		return {
			classPrefix: this.get('classPrefix'),
			skin: this.get('skin'),
			closable: this.get('closable'),
			arrowPosition: ARROW_POSITION[this.get('tipPosition')] || 7
		};
	},

	_onRenderClosable: function (val) {
		this.$('[data-role=close]')[val ? 'show' : 'hide']();
	},

	_onRenderWidth: function (val) {
		this.$('[data-role="content"]').css('width', val);
	},

	_onRenderHeight: function (val) {
		this.$('[data-role="content"]').css('height', val);
	},

	_onRenderSkin: function (val, prev) {
		this.element.removeClass(prev).addClass(val);
	},
	// 用于 set 属性后的界面更新
	_onRenderContent: function (val) {
		var ctn = this.$('[data-role="content"]');
		if (typeof val !== 'string') {
			val = val.call(this);
		}
		ctn && ctn.html(val);
	}
});

module.exports = Poptip;

require('class/class-loader').register('combobox/poptip', module.exports);

// Helpers
// -------
var ARROW_POSITION = {
	'top left': 7,
	'top': 6,
	'top right': 5,

	'bottom left': 11,
	'bottom': 12,
	'bottom right': 1,

	'left top': 2,
	'left': 3,
	'left bottom': 4,

	'right top': 10,
	'right': 9,
	'right bottom': 8
};

function formatShiftValue (pos) {
	return pos >= 0 ? '+' + pos + 'px' : pos + 'px';
}

function calculateAlign (tipPosition, distance, arrowShift) {
	var alignObject = {},
		pos = tipPosition.split(' '),
		p1 = pos[0],
		p2 = pos[1] || '';

	arrowShift = parseInt(arrowShift);
	arrowShift = isNaN(arrowShift) ? 0 : arrowShift;

	if (p1 == 'top') {
		if (p2 == 'left') {
			alignObject.baseXY = [0, 0];
			alignObject.selfXY = [formatShiftValue(-arrowShift), '100%+' + distance];
		} else if (p2 == 'right') {
			alignObject.baseXY = ['100%', 0];
			alignObject.selfXY = ['100%' + formatShiftValue(-arrowShift), '100%+' + distance];
		} else {
			alignObject.baseXY = ['50%', 0];
			alignObject.selfXY = ['50%' + formatShiftValue(-arrowShift), '100%+' + distance];
		}

	} else if (p1 == 'bottom') {
		if (p2 == 'left') {
			alignObject.baseXY = [0, '100%'];
			alignObject.selfXY = [formatShiftValue(arrowShift), -distance];
		} else if (p2 == 'right') {
			alignObject.baseXY = ['100%', '100%'];
			alignObject.selfXY = ['100%' + formatShiftValue(arrowShift), -distance];
		} else {
			alignObject.baseXY = ['50%', '100%'];
			alignObject.selfXY = ['50%' + formatShiftValue(arrowShift), -distance];
		}

	} else if (p1 == 'left') {
		if (p2 == 'top') {
			alignObject.baseXY = [-distance, 0];
			alignObject.selfXY = ['100%', formatShiftValue(arrowShift)];
		} else if (p2 == 'bottom') {
			alignObject.baseXY = [-distance, '100%'];
			alignObject.selfXY = ['100%', '100%' + formatShiftValue(arrowShift)];
		} else {
			alignObject.baseXY = [-distance, '50%'];
			alignObject.selfXY = ['100%', '50%' + formatShiftValue(arrowShift)];
		}

	} else {// right

		if (p2 == 'top') {
			alignObject.baseXY = ['100%', 0];
			alignObject.selfXY = [-distance, formatShiftValue(-arrowShift)];
		} else if (p2 == 'bottom') {
			alignObject.baseXY = ['100%', '100%'];
			alignObject.selfXY = [-distance, '100%' + formatShiftValue(arrowShift)];
		} else {
			alignObject.baseXY = ['100%', '50%'];
			alignObject.selfXY = [-distance, '50%' + formatShiftValue(-arrowShift)];
		}
	}

	return alignObject;
}