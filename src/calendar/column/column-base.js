var $ = require('$'),
	BaseCalendar = require('../calendar-base')

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