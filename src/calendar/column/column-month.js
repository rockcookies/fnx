var $ = require('$'),
	BaseColumn = require('./column-base'),
	i18n = require('../calendar-i18n')

var current = BaseColumn.currentDate;

var MonthColumn = BaseColumn.extend({
	attrs: {
		selected: {
			value: current.getMonth()
		},
		focus: {
			getter: function(val){
				if(val || val === 0){
					return val
				} else {
					val = this.get('selected')
					return (val === 0 || val) ? val : current.getMonth()
				}
			}
		},
		template: require('./column-year-month.tpl'),
		lang: {
			value: i18n['default'].months,
			setter: function(val){
				if(isString(val)){
					return (i18n[val] && i18n[val].months) || i18n['default'].months
				} else {
					return val
				}
			}
		}
	},

	events: {
		'click [data-role=month]': function(ev) {
			var value = $(ev.target).data('value')
			this.select(value)
		}
	},

	setup: function() {
		MonthColumn.superclass.setup.call(this)

		this.on('change:range change:lang', function() {
			this.refresh()
		})

	},

	parse: function(val){
		val = parseInt(val)

		if(isNaN(val) || val < 0 || val > 11){
			return null
		} else {
			return val
		}
	},

	select: function(month) {
		month = this.parse(month)

		if(month === null){
			this.trigger('selectDisable', month)
			return this
		}

		var el = this.$('[data-role=month][data-value="' + month + '"]'),
		focusClass = this.get('focusClass')

		//如果在区间内
		if(this.inRange(month)){
			this.$('.' + focusClass).removeClass(focusClass)
			el.addClass(focusClass)
			this.set('selected', month)
			this.trigger('select', month)
		} else {
			this.trigger('selectDisable', month)
		}

		return this;
	},

	_createModel: function(){
		var month = this.get('focus'),
			selected = this.get('selected'),
			fn = this.get('process'),
			lang = this.get('lang'),
			items = []

		for (var i = 0; i < 12; i++){
			items.push(process({
				value: i,
				label: lang[i] || i,
				disable: !this.inRange(i),
				role: 'month'
			}, fn))
		}

		var model = MonthColumn.superclass._createModel.call(this)

		$.extend(model, {
			items: items,
			selected: selected,
			type: 'month'
		})

		return model
	}
})

module.exports = MonthColumn

// Helpers
// ----
function process(item, fn) {
	if (!fn) {
		return item;
	}
	item.type = 'month';
	return fn(item);
}