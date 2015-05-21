var $ = require('$'),
    BaseCalendar = require('./calendar-base'),
    YearColumn = require('./column/column-year'),
    MonthColumn = require('./column/column-month'),
    DateColumn = require('./column/column-date'),
	i18n = require('./calendar-i18n')

var current = BaseCalendar.currentDate

var Calendar = BaseCalendar.extend({
	attrs: {
		template: require('./calendar.tpl'),
		mode: 'dates',
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
		lang: {
			value: i18n['default'],
			setter: function(val){
				if(isString(val)){
					return i18n[val] || i18n['default']
				} else {
					return val
				}
			}
		}
	},

	events: {
		'click [data-role=current-month]': function(ev) {
			if (this.get('mode') === 'months') {
				this.renderContainer('dates')
			} else {
				this.renderContainer('months')
			}
		},
		'click [data-role=current-year]': function(ev) {
			if (this.get('mode') === 'years') {
				this.renderContainer('dates')
			} else {
				this.renderContainer('years')
			}
		},
		'click [data-role=prev-year]': function(ev) {
			var focus = this.get('focus')

			focus.setDate(1)
			focus.setFullYear(focus.getFullYear() - 1)

			this.months.select(focus.getMonth())
			this.years.select(focus.getYear())

			this.set('focus', focus)
			this.renderPannel()
		},
		'click [data-role=next-year]': function(ev) {
			var focus = this.get('focus')

			focus.setDate(1)
			focus.setFullYear(focus.getFullYear() + 1)

			this.months.select(focus.getMonth())
			this.years.select(focus.getYear())

			this.set('focus', focus)
			this.renderPannel()
		},
		'click [data-role=prev-month]': function(ev) {
			var focus = this.get('focus')

			focus.setDate(1)
			focus.setMonth(focus.getMonth() - 1)

			this.months.select(focus.getMonth())
			this.years.select(focus.getYear())

			this.set('focus', focus)
			this.renderPannel()
		},
		'click [data-role=next-month]': function(ev) {
			var focus = this.get('focus')

			focus.setDate(1)
			focus.setMonth(focus.getMonth() + 1)

			this.months.select(focus.getMonth())
			this.years.select(focus.getYear())

			this.set('focus', focus)
			this.renderPannel()
		}
	},

	setup: function() {
		Calendar.superclass.setup.call(this)

		this.set('selected', this.get('focus'))

		this.renderPannel()
		this._createColumns()
		this._bindEvents()

		this.renderContainer('dates')
	},

	parse: function(val){
		var p = parseInt,v

		if(isString(val)){
			v = val.split('-')
			v = new Date(p(v[0]), p(v[1])-1, p(v[2]))
		} else {
			v = new Date(val)
		}

		return isNaN(v.getTime()) ? null : v
	},

	select: function(date) {
		this.dates.select(date)
		return this
	},

	renderContainer: function(mode, focus) {
		this.set('mode', mode)

		focus = focus || this.get('focus')

		this.dates.hide()
		this.months.hide()
		this.years.hide()

		this.set('focus', focus)

		if (mode === 'dates') {
			this.dates.element.show()
		} else if (mode === 'months') {
			this.months.element.show()
		} else if (mode === 'years') {
			this.years.element.show()
		}

		return this
	},

	renderPannel: function() {
		var focus = this.get('focus'),
			monthPannel = this.element.find('[data-role=current-month]'),
			yearPannel = this.element.find('[data-role=current-year]'),
			lang = this.get('lang')

		monthPannel.text(lang.months[focus.getMonth()])
		yearPannel.text(focus.getFullYear())
	},

	_createColumns: function() {
		var attrs = {
			process: this.get('process'),
			classPrefix: this.get('classPrefix'),
			disableClass: this.get('disableClass'),
			focusClass: this.get('focusClass')
		}

		var focus = this.get('focus'),
			range = this.get('range')

		this.dates = new DateColumn($.extend({}, attrs, {
			focus: focus,
			range: range
		}))

		this.months = new MonthColumn($.extend({}, attrs, {
			focus: focus.getMonth()
		}))

		this.years = new YearColumn($.extend({}, attrs, {
			focus: focus.getFullYear()
		}))

		var container = this.element.find('[data-role=container]')

		container.append(this.dates.element)
		container.append(this.months.element)
		container.append(this.years.element)
	},

	_bindEvents: function() {
		var that = this

		this.on('change:focus', function(focus) {
			that.dates.set('focus', focus)
			that.months.set('focus', focus.getMonth())
			that.years.set('focus', focus.getFullYear())
		})

		this.on('change:range', function(range) {
			that.dates.set('range', convertRange('dates', range))
			that.months.set('range', convertRange('months', range))
			that.years.set('range', convertRange('years', range))
		})

		this.dates.on('select', function(date) {
			that.set('focus', date)
			that.renderPannel()

			that.months.select(date.getMonth())
			that.years.select(date.getFullYear())

			that.set('selected', date)
			that.trigger('select', date)
		})



		this.months.on('select', function(month) {
			var focus = that.get('focus')

			if(focus.getMonth() != month){
				focus.setDate(1)
				focus.setMonth(month)
				that.set('focus', focus)
				that.renderPannel()
				that.renderContainer('dates')
			}
		})

		this.years.on('select', function(year) {
			var focus = that.get('focus')

			if(focus.getFullYear() != year){
				focus.setDate(1)
				focus.setFullYear(year)
				that.set('focus', focus)
				that.renderPannel()
				that.renderContainer('dates')
			}
		})
	},

	destroy: function() {
		this.dates.destroy()
		this.months.destroy()
		this.years.destroy()
		Calendar.superclass.destroy.call(this)
	}
})

Calendar.YearColumn = YearColumn;
Calendar.MonthColumn = MonthColumn;
Calendar.DateColumn = DateColumn;

module.exports = Calendar;

// Helpers
// ----
var tostring = Object.prototype.toString

function isString (val) {
	return tostring.call(val) === '[object String]'
}

function isFunction (val) {
	return tostring.call(val) === '[object Function]'
}

function isArray (val) {
	return tostring.call(val)  === '[object Array]'
}

function cloneDate (date) {
	return new Date(date.getTime())
}

/*function yearMove(date, fullYear){
	var tmpDate = cloneDate(date),
		result = cloneDate(date)

	//获取选择的月份的最后一天
	tmpDate.setDate(1)
	tmpDate.setFullYear(fullYear)
	tmpDate.setMonth(tmpDate.getMonth() + 1)
	tmpDate.setDate(0)

	//处理最后一天是31号，而选择的月份是30号的情况，会自动修正到30号
	if (result.getDate() > tmpDate.getDate()) {
		result = tmpDate
	} else {
		result.setFullYear(fullYear)
	}

	return result
}

function monthMove(date, month){
	var tmpDate = cloneDate(date),
		result = cloneDate(date)

	//获取选择的月份的最后一天
	tmpDate.setDate(1)
	tmpDate.setMonth(month + 1)
	tmpDate.setDate(0)


	//处理最后一天是31号，而选择的月份是30号的情况，会自动修正到30号
	if (result.getDate() > tmpDate.getDate()) {
		result = tmpDate
	} else {
		result.setMonth(month)
	}

	return result
}*/