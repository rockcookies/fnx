var $ = require('$'),
	BaseColumn = require('./column-base'),
	i18n = require('../calendar-i18n')

var current = BaseColumn.currentDate

var DateColumn = BaseColumn.extend({
	attrs: {
		previousMonthClass: 'previous-month',
		currentMonthClass: 'current-month',
		nextMonthClass: 'next-month',
		startDay: 0,
		selected: {
			value: current,
			getter: function(val){
				return cloneDate(val)
			}
		},
		focus: {
			getter: function(val){
				val = val || this.get('selected') || current
				return cloneDate(val)
			}
		},
		template: require('./column-date.tpl'),
		lang: {
			value: i18n['default'].dates,
			setter: function(val){
				if(isString(val)){
					return (i18n[val] && i18n[val].dates) || i18n['default'].dates
				} else {
					return val
				}
			}
		}
	},

	events: {
		'click [data-role=date]': function(ev) {
			var value = $(ev.target).data('value')
			var date = valueToDate(value)
			var val = this.get('focus')

			val.setDate(1)
			val.setMonth(date.getMonth())
			val.setFullYear(date.getFullYear())
			val.setDate(date.getDate())

			this.select(val)
		}
	},

	setup: function() {
		DateColumn.superclass.setup.call(this)

		this.on('change:range change:focus change:lang', function() {
			this.refresh()
		})
	},

	parse: function(val){
		var p = parseInt,v

		if(isString(val)){
			v = valueToDate(val)
		} else {
			v = new Date(val)
		}

		return isNaN(v.getTime()) ? null : v
	},

	select: function(_date) {
		var date = parseDate(_date)

		if(date === null){
			this.trigger('selectDisable', date)
			return this
		}

		var el = this.$('[data-role=date][data-value="' + dateToValue(date) + '"]'),
			previousMonthClass = this.get('previousMonthClass'),
			nextMonthClass = this.get('nextMonthClass'),
			focusClass = this.get('focusClass')

		//如果在区间内
		if(this.inRange(date)){

			this.set('selected', date)

			//如果未在当前页找到日期
			if(!el.length || el.hasClass(previousMonthClass) || el.hasClass(nextMonthClass)){
				this.set('focus', date)
			} else {
				this.$('.' + focusClass).removeClass(focusClass)
				el.addClass(focusClass)
			}

			this.trigger('select', date)
		} else {
			this.trigger('selectDisable', date)
		}

		return this
	},

	_createModel: function(){
		var that = this,
			date = this.get('focus'),
			selected = this.get('selected'),
			fn = this.get('process'),
			startDay = this.get('startDay'),
			lang = this.get('lang'),
			previousMonthClass = this.get('previousMonthClass'),
			currentMonthClass = this.get('currentMonthClass'),
			nextMonthClass = this.get('nextMonthClass'),
			items = [],
			days = [],
			delta = 0,
			daysInMonth = 0,
			tmpDate = null,
			d = null,
			i = 0

		for (i = startDay; i < 7; i++) {
			days.push({
				label: lang[i] || i,
				value: i,
				role: 'day'
			})
		}
		for (i = 0; i < startDay; i++) {
			days.push({
				label: lang[i] || i,
				value: i,
				role: 'day'
			})
		}

		var pushData = function(d, className) {
			var item = {
				value: dateToValue(d),
				label: d.getDate(),
				day: d.getDay(),
				className: className,
				disable: !that.inRange(d),
				role: 'date'
			}

			if (fn) {
				item.type = 'date'
				item = fn(item)
			}
			items.push(item)
		}

		var currMonth = cloneDate(date)
		currMonth.setDate(1)//提前设置为1号，如果当前日期为3月31号，月份加1后为4月31号会出问题

		// Calculate days of previous month
		tmpDate = cloneDate(currMonth)
		delta = tmpDate.getDay() - startDay
		if (delta <= 0) {
			delta += 7
		}

		for (i = delta - 1; i >= 0; i--) {
			d = cloneDate(tmpDate)
			d.setDate(-i)
			pushData(d, previousMonthClass)
		}

		// Calculate days of current month
		tmpDate = cloneDate(currMonth)
		tmpDate.setMonth(tmpDate.getMonth() + 1)
		tmpDate.setDate(0)//设置为0则返回上个月的最后一天
		daysInMonth = tmpDate.getDate()
		for (i = 1; i <= daysInMonth; i++) {
			d = cloneDate(tmpDate)
			d.setDate(i)
			pushData(d, currentMonthClass)
		}

		// Calculate days of next month
		delta = 42 - items.length
		tmpDate = cloneDate(currMonth)
		tmpDate.setMonth(tmpDate.getMonth() + 1)
		for (i = 1; i <= delta; i++){
			d = cloneDate(tmpDate)
			d.setDate(i)
			pushData(d, nextMonthClass)
		}

		var model = DateColumn.superclass._createModel.call(this)

		$.extend(model, {
			day: days,
			date: items,
			selected: dateToValue(selected)
		})

		return model
	}
})

module.exports = DateColumn

// Helpers
// ----
var tostring = Object.prototype.toString

function isString (val) {
	return tostring.call(val) === '[object String]'
}

function cloneDate (date) {
	return new Date(date.getTime())
}

function dateToValue (date) {
	return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

function valueToDate (val) {
	var p = parseInt,
		val = val.split('-')
	return new Date(p(val[0]), p(val[1])-1, p(val[2]))
}

function parseDate (val) {
	if(isString(val)){
		return valueToDate(val)
	} else {
		return new Date(val)
	}
}