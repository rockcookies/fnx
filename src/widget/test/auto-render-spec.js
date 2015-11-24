var $ = require('$');
var Widget = require('../widget');

describe('Widget.AutoRender', function() {

it('auto render all', function(done) {
	var dom = $("<div id=\"test1\" data-widget=\"widget/widget\" widget-options=\"className:'widget',id:'test1'\"></div>");
	dom.appendTo(document.body);

	Widget.autoRenderAll(function() {
		var test = Widget.query('#test1');

		expect(test.get('id')).toBe('test1');
		expect(test.get('className')).toBe('widget');

		expect(test.element[0]).toBe(dom[0]);
		dom.remove();
		test.destroy();
		done && done();
	});
});

it('auto render trigger', function(done) {
	var dom = $('<div id="element2">element2</div>').appendTo(document.body);
	var trigger = $("<div id=\"test2\" data-widget=\"widget/widget\" widget-role=\"trigger\" widget-options=\"element: '#element2',className:'widget'\"></div>");
	trigger.appendTo(document.body);

	Widget.autoRenderAll(function() {
		var test = Widget.query('#test2');
		expect(test.get('className')).toBe('widget');
		expect(test.get('trigger')[0]).toBe(trigger[0]);
		expect(test.element.html()).toBe('element2');
		trigger.remove();
		dom.remove();
		test.destroy();
		done && done();
	});
});

it('auto render with data attrs', function(done) {
	var dom = $('<div id="element3">element3</div>').appendTo(document.body);
	var trigger = $("<div id=\"test3\" data-widget=\"widget/widget\" widget-role=\"trigger\" widget-options=\"element: '#element3',trigger:'trigger'\"></div>");
	trigger.appendTo(document.body);

	Widget.autoRenderAll(function() {
		var test = Widget.query('#test3');
		expect(test.get('trigger')).toBe('trigger');
		expect(test.element.html()).toBe('element3');
		trigger.remove();
		dom.remove();
		test.destroy();
		done && done();
	});
});

it('render element with data attrs', function() {
	var dom = $("<div id=\"test3\" data-widget=\"widget/widget\" widget-options=\"a:1\"></div>");
	dom.appendTo(document.body);

	var test = new Widget({
		element: '#test3',
		a: 2
	});

	expect(test.get('a')).toBe(2);
	dom.remove();
	test.destroy();
});

it('auto render template', function(done) {
	var dom = $('<div id="tpl"><p>element</p></div>').appendTo(document.body);
	var trigger = $("<div id=\"test4\" data-widget=\"widget/widget\" widget-role=\"trigger\" widget-options=\"template:'#tpl'\"></div>");
	trigger.appendTo(document.body);

	Widget.autoRenderAll(function() {
		var test = Widget.query('#test4');
		expect(test.element.html().toLowerCase()).toBe('<p>element</p>');
		trigger.remove();
		dom.remove();
		test.destroy();
		done && done();
	});
});



});