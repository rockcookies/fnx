var $ = require('$'),
    Widget = require('widget/widget'),
    Templatable = require('templatable/templatable')

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