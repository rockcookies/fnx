/**
name    : FNX-UI
author  : by FNX-UI Team
version : 1.0.0
email   : hqy321@gmail.com
**/


/**===============================
component : calendar/calendar
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




__namespace__('calendar/calendar-base',function(__using__,exports,module){

var $ = __include__["$"],
    Widget = __include__["widget/widget"],
    Templatable = __include__["templatable/templatable"]

var current_date = new Date()

var BaseCalendar = Widget.extend({

	Implements: Templatable,

		attrs: {
		// 统一样式前缀
		classPrefix: 'ui-calendar',
		skin: '',
		disableClass: 'disabled-element',
		focusClass: 'focused-element',
		process: null,
		template: '',
		selected: {
			value: null,
			getter: function(val){
				val = this.parse(val)
				return this.inRange(val) ? val : null
			}
		},
		model: {
			getter: function(){
				return this._createModel()
			}
		},
		focus: {
			value: null,
			setter: function(val){
				return this.parse(val)
			}
		},
		range: {
			value: null,
			setter: function(val){
				if(!val) return null

				if(isString(val)){
					return [this.parse(val), null]
				}

				if (isArray(val)) {
					var start = (val[0] === 0 || val[0]) && this.parse(val[0])
					var end = (val[1] === 0 || val[1]) && this.parse(val[1])
					return [start, end]
				}

				return val
			}
		}
	},

	parse: function(val){
		return val
	},

	inRange: function (date){
		var range = this.get('range')

		if(!range){
			return true
		}

		if (isArray(range)) {
			var start = range[0],
				end = range[1],
				result = true

			if (start || start === 0) {
				result = result && date >= start
			}

			if (end || end === 0) {
				result = result && date <= end
			}

			return result
		}

		if (isFunction(range)){
			return range(date)
		}

		return true
	},

	_createModel: function(){
		return {
			classPrefix: this.get('classPrefix'),
			disableClass: this.get('disableClass'),
			focusClass: this.get('focusClass'),
			skin: this.get('skin')
		}
	},

	Statics: {
		currentDate : current_date
	}
})


module.exports = BaseCalendar


// Helpers
// ----
var tostring = Object.prototype.toString

function isString (val) {
	return tostring.call(val) === '[object String]'
}

/*function isFunction (val) {
	return tostring.call(val) === '[object Function]'
}*/

function isArray (val) {
	return tostring.call(val)  === '[object Array]'
}

});

__namespace__('calendar/column/column-base',function(__using__,exports,module){

var $ = __include__["$"],
	BaseCalendar = __using__("calendar/calendar-base")

var BaseColumn = BaseCalendar.extend({
	show: function() {
		this.render()
		this.element.show()
		return this
	},

	hide: function() {
		this.element.hide()
		return this
	},

	refresh: function() {
		this.element.html($(this.compile()).html())
		return this
	}
})

module.exports = BaseColumn


// Helpers
// ----

});

__namespace__('calendar/column/column-year-month.tpl',function(__using__,exports,module){

module.exports = '\
<table class="{{classPrefix}}-{{type}} {{skin}}" data-role="{{type}}-column">\
 <tr class="{{classPrefix}}-{{type}}-column">\
 {{each items as item index}}\
 {{if index%3 == 0 && index > 0 && index < items.length}}\
 </tr><tr class="ui-calendar-{{type}}-column">\
 {{/if}}\
 <td data-role="{{item.role}}" data-value="{{item.value}}" class="\
 {{if item.disable}}\
 {{disableClass}}\
 {{else}}\
 {{if selected == item.value}} {{focusClass}}{{/if}}\
 {{/if}}\
 ">{{item.label}}</td>\
 {{/each}}\
 </tr>\
</table>\
';

});

__namespace__('calendar/column/column-year',function(__using__,exports,module){

var $ = __include__["$"],
	BaseColumn = __using__("calendar/column/column-base")

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
		template: __using__("calendar/column/column-year-month.tpl"),
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

});

__namespace__('calendar/calendar-i18n',function(__using__,exports,module){

//--zh-cn
exports['zh-cn'] = exports['default'] = {
	months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	dates: ['日', '一', '二', '三', '四', '五', '六']
}

//--en-us
exports['en-us'] = {
	months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	dates: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
}

});

__namespace__('calendar/column/column-month',function(__using__,exports,module){

var $ = __include__["$"],
	BaseColumn = __using__("calendar/column/column-base"),
	i18n = __using__("calendar/calendar-i18n")

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
		template: __using__("calendar/column/column-year-month.tpl"),
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

});

__namespace__('calendar/column/column-date.tpl',function(__using__,exports,module){

module.exports = '\
<table class="{{classPrefix}}-date {{skin}}" data-role="date-column">\
 <tr class="{{classPrefix}}-day-column">\
 {{each day as item index}}\
 <th class="{{classPrefix}}-day {{classPrefix}}-day-{{item.value}}" data-role="{{item.role}}" data-value="{{item.value}}">{{item.label}}</th>\
 {{/each}}\
 </tr>\
 <tr class="{{classPrefix}}-date-column">\
 {{each date as item index}}\
 {{if index%7 == 0 && index > 0 && index < date.length}}\
 </tr><tr class="{{classPrefix}}-date-column">\
 {{/if}}\
 <td data-role="{{item.role}}" data-value="{{item.value}}" class="\
 {{item.className}} {{classPrefix}}-day-{{item.day}}\
 {{if item.disable}}\
 {{disableClass}}\
 {{else}}\
 {{if selected == item.value}} {{focusClass}}{{/if}}\
 {{/if}}\
 ">{{item.label}}</td>\
 {{/each}}\
 </tr>\
</table>\
';

});

__namespace__('calendar/column/column-date',function(__using__,exports,module){

var $ = __include__["$"],
	BaseColumn = __using__("calendar/column/column-base"),
	i18n = __using__("calendar/calendar-i18n")

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
		template: __using__("calendar/column/column-date.tpl"),
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

});

__namespace__('calendar/calendar.tpl',function(__using__,exports,module){

module.exports = '\
<div class="{{classPrefix}} {{skin}}">\
 <div class="{{classPrefix}}-pannel" data-role="pannel">\
 <span class="{{classPrefix}}-control" data-role="prev-year">&lt;&lt;</span>\
 <span class="{{classPrefix}}-control" data-role="prev-month">&lt;</span>\
 <span class="{{classPrefix}}-control month" data-role="current-month"></span>\
 <span class="{{classPrefix}}-control year" data-role="current-year"></span>\
 <span class="{{classPrefix}}-control" data-role="next-month">&gt;</span>\
 <span class="{{classPrefix}}-control" data-role="next-year">&gt;&gt;</span>\
 </div>\
 <div class="{{classPrefix}}-container" data-role="container"></div>\
</div>\
';

});

__namespace__('calendar/calendar',function(__using__,exports,module){

var $ = __include__["$"],
    BaseCalendar = __using__("calendar/calendar-base"),
    YearColumn = __using__("calendar/column/column-year"),
    MonthColumn = __using__("calendar/column/column-month"),
    DateColumn = __using__("calendar/column/column-date"),
	i18n = __using__("calendar/calendar-i18n")

var current = BaseCalendar.currentDate

var Calendar = BaseCalendar.extend({
	attrs: {
		template: __using__("calendar/calendar.tpl"),
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

});


if(typeof define == 'function' && define.cmd){
	define('fnx/cmp/calendar/calendar',['$','fnx/cmp/widget/widget','fnx/cmp/templatable/templatable'],function(require){
		require('$');
		__include__['$'] = $;
		__include__['widget/widget'] = require('fnx/cmp/widget/widget');
		__include__['templatable/templatable'] = require('fnx/cmp/templatable/templatable');
		return __using__('calendar/calendar');
	});
}


})(window);