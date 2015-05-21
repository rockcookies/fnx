var $ = require('$'),
	BaseColumn = require('./column-base')

var current = BaseColumn.currentDate

var YearColumn = BaseColumn.extend({
	attrs: {
		selected: {
			value: current.getFullYear()
		},
		focus: {
			getter: function(val){
				if(val || val === 0){
					return val
				} else {
					val = this.get('selected')
					return (val === 0 || val) ? val : current.getFullYear()
				}
			}
		},
		template: require('./column-year-month.tpl'),
		model: {
			getter: function(){
				return this._createModel()
			}
		}
	},

	events: {
		'click [data-role=year]': function(ev) {
			var value = $(ev.target).data('value')
			this.select(value)
		},
		'click [data-role=prev],[data-role=next]': function(ev) {
			var value = $(ev.target).data('value')
			this.set('focus', value)
		}
	},

	setup: function(){
		YearColumn.superclass.setup.call(this)

		this.on('change:range change:focus', function() {
			this.refresh()
		})
	},

	parse: function(val){
		val = parseInt(val)
		return isNaN(val) ? null : val
	},

	select: function(year) {
		year = this.parse(year)

		if(year === null){
			this.trigger('selectDisable', year)
			return this
		}

		var el = this.$('[data-role=year][data-value="' + year + '"]'),
			focusClass = this.get('focusClass')

		//如果在区间内
		if(this.inRange(year)){

			this.set('selected', year)

			//如果未在当前页找到年份，则focus选择的年份
			if(!el.length){
				this.set('focus', year)
			} else {
				this.$('.' + focusClass).removeClass(focusClass)
				el.addClass(focusClass)
			}

			this.trigger('select', year)
		} else {
			this.trigger('selectDisable', year)
		}

		return this
	},

	_createModel: function(){
		var year = this.get('focus'),
			selected = this.get('selected'),
			fn = this.get('process')

		var items = [process({
			value: year - 10,
			label: '. . .',
			disable: false,
			role: 'prev'
		}, fn)]


		for (var i = year - 6; i < year + 4; i++) {
			items.push(process({
				value: i,
				label: i,
				disable: !this.inRange(i),
				role: 'year'
			}, fn))
		}

		items.push(process({
			value: year + 10,
			label: '. . .',
			disable: false,
			role: 'next'
		}, fn))

		var model = YearColumn.superclass._createModel.call(this)

		$.extend(model, {
			items: items,
			type: 'year'
		})

		if(selected != items[0].value && selected != items[items.length - 1].value){
			model.selected = selected
		}

		return model
	}
})

module.exports = YearColumn

// Helpers
// ----
function process(item, fn) {
	if (!fn) {
		return item;
	}
	item.type = 'year';
	return fn(item);
}