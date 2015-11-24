
var Events = require('../events');
var events = new Events();


var winWidth = $(window).width();
var winHeight = $(window).height();
var timeout;


$(window).resize(function (e) {
	timeout && clearTimeout(timeout);
	timeout = setTimeout(function () {
		var winNewWidth = $(window).width();
		var winNewHeight = $(window).height();

	// IE678 莫名其妙触发 resize
	// http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer
	if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
		events.trigger('window:resize', {
			width: winNewWidth,
			height: winNewHeight,
			context: this,
			event: e
		});
	}

	winWidth = winNewWidth;
	winHeight = winNewHeight;
}, 80);
});

module.exports = events;